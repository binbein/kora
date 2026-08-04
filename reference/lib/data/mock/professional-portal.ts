import { addDays, startOfWeek } from "../../dates";
import type { Appointment, EarningsWeek, ProfessionalEarnings } from "../types";
import { DEMO_TODAY } from "./demo-date";
import { FULL_CAPACITY } from "./people";
import { SESSION_DURATION_MINUTES } from "./scheduling";

/*
 * Portale del professionista (CLAUDE.md §8.D).
 *
 * La demo mostra il portale della **Dr.ssa Meier**: è la professionista con
 * cui Laura ha l'appuntamento nel percorso dipendente, quindi le tre
 * schermate raccontano la stessa storia da tre lati invece di essere tre
 * demo scollegate.
 *
 * L'agenda non è scritta riga per riga: è generata da uno schema settimanale
 * dichiarato qui sotto, sui giorni feriali del mese di riferimento. Una lista
 * scritta a mano si riconosce — gli orari finiscono tutti tondi o tutti
 * diversi — e andrebbe riscritta da capo per cambiare un solo parametro.
 *
 * Gli orari dello schema non toccano mai gli slot ancora liberi della Dr.ssa
 * Meier in `scheduling.ts`: un'ora non può essere insieme occupata e
 * prenotabile, e le due liste finiscono nella stessa griglia.
 */

export const PORTAL_PROFESSIONAL_ID = "meier";

/**
 * Ore delle sessioni per giorno della settimana, come le restituisce
 * `Date.getDay()` (1 = lunedì … 5 = venerdì). Sabato e domenica non lavora:
 * un'agenda piena sette giorni su sette non sarebbe credibile.
 */
const WEEKLY_PATTERN: Record<number, [hour: number, minute: number][]> = {
  1: [
    [10, 0],
    [14, 0],
  ],
  2: [[11, 0]],
  3: [[16, 0]],
  4: [[10, 0]],
  5: [[9, 0]],
};

/**
 * Sessioni in una settimana piena secondo lo schema: il regime che la Dr.ssa
 * Meier tiene sulla piattaforma. Si conta dallo schema invece di scriverlo,
 * così cambiando le ore qui sopra il numero mostrato a schermo segue.
 */
export const SESSIONS_PER_WEEK = Object.values(WEEKLY_PATTERN).reduce(
  (total, hours) => total + hours.length,
  0,
);

/** Il mese che il portale riepiloga: quello della data di riferimento. */
export const PORTAL_MONTH = new Date(
  DEMO_TODAY.getFullYear(),
  DEMO_TODAY.getMonth(),
  1,
);

/**
 * Le sessioni del mese secondo lo schema.
 *
 * Lo stato dipende dalla data di riferimento e non è scritto nel dato: prima
 * di oggi la sessione è erogata, da oggi in poi è in programma. Così il
 * riepilogo compensi e il calendario non possono raccontare due cose diverse.
 */
function sessionsOfMonth(): Appointment[] {
  const sessions: Appointment[] = [];
  const cursor = new Date(PORTAL_MONTH);

  while (cursor.getMonth() === PORTAL_MONTH.getMonth()) {
    for (const [hour, minute] of WEEKLY_PATTERN[cursor.getDay()] ?? []) {
      const start = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
        hour,
        minute,
      );
      sessions.push({
        id: `portal-session-${start.getTime()}`,
        kind: "psychologist",
        professionalId: PORTAL_PROFESSIONAL_ID,
        start,
        durationMinutes: SESSION_DURATION_MINUTES,
        status: start < DEMO_TODAY ? "completed" : "scheduled",
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return sessions;
}

export const PORTAL_SESSIONS: Appointment[] = sessionsOfMonth();

/**
 * Riepilogo mensile a partire dalle sessioni di un professionista.
 *
 * Conta solo quelle erogate: un compenso maturato è una sessione già tenuta,
 * e mostrare anche le altre gonfierebbe il totale di soldi non guadagnati.
 */
export function monthlyEarnings(
  professionalId: string,
  sessions: Appointment[],
  feePerSession: number,
  month: Date,
  referenceDate: Date,
): ProfessionalEarnings {
  const delivered = sessions.filter(
    (session) =>
      session.status === "completed" &&
      session.start.getFullYear() === month.getFullYear() &&
      session.start.getMonth() === month.getMonth(),
  );

  const byWeek = new Map<number, EarningsWeek>();
  for (const session of delivered) {
    const start = startOfWeek(session.start);
    const week = byWeek.get(start.getTime()) ?? {
      start,
      end: addDays(start, 6),
      sessions: 0,
      minutes: 0,
      grossChf: 0,
    };
    week.sessions += 1;
    week.minutes += session.durationMinutes;
    week.grossChf += feePerSession;
    byWeek.set(start.getTime(), week);
  }

  const weeks = [...byWeek.values()].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  return {
    professionalId,
    month,
    inProgress:
      referenceDate.getFullYear() === month.getFullYear() &&
      referenceDate.getMonth() === month.getMonth(),
    sessionsDelivered: delivered.length,
    minutesDelivered: delivered.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    ),
    sessionsPerWeek: SESSIONS_PER_WEEK,
    feePerSession,
    grossChf: delivered.length * feePerSession,
    weeks,
    fullCapacity: FULL_CAPACITY,
  };
}
