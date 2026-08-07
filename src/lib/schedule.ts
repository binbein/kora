import { addDays, isSameDay, startOfWeek } from "./dates";
import type { ProfessionalSession } from "./data/types";

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

export type CalendarCell = {
  /** Minuti dalla mezzanotte: 1050 = 17:30 */
  minuteOfDay: number;
  session: ProfessionalSession | null;
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

/**
 * Gli orari da mostrare come righe della griglia, in minuti dalla mezzanotte.
 *
 * Si ricavano dalle sedute della settimana invece di essere una fascia fissa
 * 9–18: una griglia con dieci righe di cui tre piene si legge come un'agenda
 * vuota, mentre l'agenda non è vuota — è concentrata. Se la settimana non ha
 * sedute la griglia non ha righe, e la pagina lo dice a parole.
 *
 * Sono minuti e non ore perché l'appuntamento del §8 è alle **17:30**: con le
 * righe a ore intere finirebbe in quella delle 17:00, e la griglia direbbe un
 * orario diverso da quello del calendario vero.
 */
export function slotsOfWeek(sessions: ProfessionalSession[]): number[] {
  const slots = new Set(
    sessions.map((session) => session.start.getHours() * 60 + session.start.getMinutes()),
  );
  return [...slots].sort((a, b) => a - b);
}

/** La griglia: cinque giorni feriali per le ore in cui c'è qualcosa. */
export function weekGrid(
  sessions: ProfessionalSession[],
  weekOf: Date,
  today: Date,
): CalendarDay[] {
  const week = sessionsOfWeek(sessions, weekOf);
  const slots = slotsOfWeek(week);
  const monday = startOfWeek(weekOf);

  return Array.from({ length: WORKING_DAYS }, (_, index) => {
    const date = addDays(monday, index);
    return {
      date,
      isToday: isSameDay(date, today),
      cells: slots.map((minuteOfDay) => ({
        minuteOfDay,
        session:
          week.find(
            (session) =>
              isSameDay(session.start, date) &&
              session.start.getHours() * 60 + session.start.getMinutes() ===
                minuteOfDay,
          ) ?? null,
      })),
    };
  });
}
