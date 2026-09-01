import { addDays, isSameDay, startOfWeek } from "./dates";
import type { ProfessionalSession, ProfessionalSlot } from "./data/types";

/*
 * La griglia settimanale del calendario.
 *
 * Non è un metodo del provider: la settimana è un raggruppamento di
 * presentazione, e un `DaySchedule[]` nell'interfaccia farebbe ereditare al
 * backend la forma della griglia (CLAUDE.md §5.1). Sta qui, come funzione pura
 * sulle stesse sedute che la pagina ha già.
 *
 * La conseguenza è quella voluta: la KPI "sedute questa settimana", le celle
 * della griglia e il totale del mese **non possono divergere**, perché nascono
 * dalla stessa lista filtrata invece che da tre conteggi separati (§5.5).
 */

/** Lunedì–venerdì: il fine settimana non è nell'agenda di nessuno. */
export const WORKING_DAYS = 5;

/**
 * Una cella della griglia: una seduta, una fascia dichiarata, oppure niente.
 *
 * **I due campi non si escludono, e non vanno collassati in uno stato solo**
 * (01.09.2026): una fascia può essere occupata da una seduta, e in quel caso la
 * cella ha entrambi. A decidere cosa mostrare è la schermata — la seduta vince,
 * perché dice di più — ma la griglia non le toglie il resto, o il giorno in cui
 * servisse saperlo bisognerebbe ricostruirlo.
 */
export type CalendarCell = {
  /** Minuti dalla mezzanotte: 1050 = 17:30 */
  minuteOfDay: number;
  session: ProfessionalSession | null;
  /** La fascia dichiarata su quell'ora, se ce n'è una */
  slot: ProfessionalSlot | null;
};

export type CalendarDay = {
  date: Date;
  isToday: boolean;
  cells: CalendarCell[];
};

/** Le sedute che cadono nella settimana di `date`, in ordine di orario. */
export function sessionsOfWeek(
  sessions: ProfessionalSession[],
  date: Date,
): ProfessionalSession[] {
  const from = startOfWeek(date);
  const to = addDays(from, 7);
  return sessions.filter(
    (session) =>
      session.status !== "cancelled" &&
      session.start >= from &&
      session.start < to,
  );
}

/** Le sedute erogate o in programma nel mese di `date`. */
export function sessionsOfMonth(
  sessions: ProfessionalSession[],
  date: Date,
): ProfessionalSession[] {
  return sessions.filter(
    (session) =>
      session.status !== "cancelled" &&
      session.start.getFullYear() === date.getFullYear() &&
      session.start.getMonth() === date.getMonth(),
  );
}

/** La prima seduta in programma, se ce n'è una. */
export function nextSession(
  sessions: ProfessionalSession[],
): ProfessionalSession | null {
  return sessions.find((session) => session.status === "scheduled") ?? null;
}

/** I minuti dalla mezzanotte di una data: 17:30 → 1050. */
function minuteOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Le fasce dichiarate che cadono nella settimana di `date`. */
export function slotsOfWeekRange(
  slots: ProfessionalSlot[],
  date: Date,
): ProfessionalSlot[] {
  const from = startOfWeek(date);
  const to = addDays(from, 7);
  return slots.filter((slot) => slot.start >= from && slot.start < to);
}

/**
 * Gli orari da mostrare come righe della griglia, in minuti dalla mezzanotte.
 *
 * Si ricavano da ciò che c'è invece di essere una fascia fissa 9–18: una
 * griglia con dieci righe di cui tre piene si legge come un'agenda vuota,
 * mentre l'agenda non è vuota — è concentrata. Se la settimana non ha né sedute
 * né fasce la griglia non ha righe, e la pagina lo dice a parole.
 *
 * **UNISCE LE SEDUTE E LE FASCE** (01.09.2026), e prima erano le sole sedute:
 * una fascia libera non aveva una riga, quindi le fasce dichiarate non erano
 * **mai** state renderizzate nel portale: le celle vuote erano solo i giorni in
 * cui nessuno aveva preso quell'ora. Senza questa unione «chiudere una fascia»
 * non avrebbe avuto un bersaglio su cui cliccare.
 *
 * Sono minuti e non ore perché l'appuntamento del §8 è alle **17:30**: con le
 * righe a ore intere finirebbe in quella delle 17:00, e la griglia direbbe un
 * orario diverso da quello del calendario vero.
 */
export function slotsOfWeek(
  sessions: ProfessionalSession[],
  slots: ProfessionalSlot[] = [],
): number[] {
  const minutes = new Set([
    ...sessions.map((session) => minuteOfDay(session.start)),
    ...slots.map((slot) => minuteOfDay(slot.start)),
  ]);
  return [...minutes].sort((a, b) => a - b);
}

/** La griglia: cinque giorni feriali per le ore in cui c'è qualcosa. */
export function weekGrid(
  sessions: ProfessionalSession[],
  slots: ProfessionalSlot[],
  weekOf: Date,
  today: Date,
): CalendarDay[] {
  const week = sessionsOfWeek(sessions, weekOf);
  const weekSlots = slotsOfWeekRange(slots, weekOf);
  const rows = slotsOfWeek(week, weekSlots);
  const monday = startOfWeek(weekOf);

  return Array.from({ length: WORKING_DAYS }, (_, index) => {
    const date = addDays(monday, index);
    return {
      date,
      isToday: isSameDay(date, today),
      cells: rows.map((minute) => ({
        minuteOfDay: minute,
        session:
          week.find(
            (session) =>
              isSameDay(session.start, date) &&
              minuteOfDay(session.start) === minute,
          ) ?? null,
        slot:
          weekSlots.find(
            (slot) =>
              isSameDay(slot.start, date) && minuteOfDay(slot.start) === minute,
          ) ?? null,
      })),
    };
  });
}
