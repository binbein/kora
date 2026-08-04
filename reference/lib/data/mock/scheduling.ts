import type {
  Appointment,
  AppointmentSlot,
  SessionEntitlement,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { PROFESSIONALS } from "./people";

/*
 * Sessioni e agenda di Laura (CLAUDE.md §6): 3 sessioni usate su 10, prossimo
 * appuntamento con la Dr.ssa Meier giovedì alle 17:30.
 *
 * Il piano Plus dà 10 sessioni all'anno e CHF 28 per quelle in più (§7): il
 * cap e il prezzo vengono dal piano dell'azienda, non ricopiati qui.
 */

export const INITIAL_ENTITLEMENT: SessionEntitlement = {
  used: 3,
  total: COMPANY.plan.sessionsPerYear,
  extraSessionPrice: COMPANY.plan.extraSessionPrice,
};

/** Giorni dopo la data di riferimento (mercoledì 29.07.2026), alle ore indicate. */
function at(daysFromReference: number, hour: number, minute = 0): Date {
  return new Date(
    DEMO_TODAY.getFullYear(),
    DEMO_TODAY.getMonth(),
    DEMO_TODAY.getDate() + daysFromReference,
    hour,
    minute,
  );
}

export const SESSION_DURATION_MINUTES = 50;

/** Il giovedì successivo al riferimento: +1 giorno. */
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "appointment-meier-1",
    kind: "psychologist",
    professionalId: "meier",
    start: at(1, 17, 30),
    durationMinutes: SESSION_DURATION_MINUTES,
    status: "scheduled",
  },
];

/*
 * Slot proponibili, dal giorno dopo il riferimento. Solo giorni feriali e
 * orari plausibili: chi guarda la demo deve poterci credere senza pensarci.
 * Le combinazioni giorno/ora cambiano da professionista a professionista,
 * altrimenti l'agenda sembra generata da un ciclo.
 */
const SLOT_PLAN: Record<string, [day: number, hour: number, minute: number][]> =
  {
    colombo: [
      [1, 9, 0],
      [1, 14, 30],
      [2, 11, 0],
      [5, 16, 0],
      [6, 8, 30],
    ],
    rossi: [
      [1, 12, 0],
      [2, 9, 30],
      [5, 13, 0],
      [6, 17, 0],
    ],
    meier: [
      [2, 10, 0],
      [5, 9, 0],
      [6, 15, 30],
      [7, 17, 30],
    ],
    fontana: [
      [1, 16, 30],
      [5, 11, 30],
      [7, 9, 0],
    ],
  };

export const INITIAL_SLOTS: AppointmentSlot[] = PROFESSIONALS.flatMap(
  (professional) =>
    (SLOT_PLAN[professional.id] ?? []).map(([day, hour, minute]) => ({
      professionalId: professional.id,
      start: at(day, hour, minute),
      durationMinutes: SESSION_DURATION_MINUTES,
    })),
);
