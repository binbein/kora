import { assertInDev } from "../guardrails";
import type {
  Appointment,
  AppointmentSlot,
  SessionEntitlement,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { PROFESSIONALS } from "./people";

/*
 * Sessioni e agenda di Laura (CLAUDE.md §8): 3 sessioni usate su 10, prossimo
 * appuntamento con la Dr.ssa Meier giovedì alle 17:30.
 *
 * Il cap e il prezzo della sessione extra vengono dal piano dell'azienda, non
 * ricopiati qui: il Plus dà 10 sessioni all'anno e CHF 28 per quelle in più, e
 * se domani Demo SA passa all'Executive il contatore segue da solo.
 */

export const INITIAL_ENTITLEMENT: SessionEntitlement = {
  used: 3,
  total: COMPANY.plan.sessionsPerYear,
  extraSessionPrice: COMPANY.plan.extraSessionPrice,
};

export const SESSION_DURATION_MINUTES = 50;

/** Giorni dopo il giorno della demo, alle ore indicate. */
function at(daysFromReference: number, hour: number, minute = 0): Date {
  return new Date(
    DEMO_TODAY.getFullYear(),
    DEMO_TODAY.getMonth(),
    DEMO_TODAY.getDate() + daysFromReference,
    hour,
    minute,
  );
}

/*
 * L'appuntamento del §8: giovedì 17:30 con la Dr.ssa Meier.
 *
 * Con la demo ambientata di **mercoledì**, quel giovedì è **domani** — un solo
 * giorno dopo il riferimento — ed è così che la home del dipendente lo deve
 * presentare. Il giorno si deriva dallo scarto e non si scrive: il guardrail
 * qui sotto verifica che sia davvero giovedì, così spostando `DEMO_TODAY` la
 * bugia si vede subito.
 */
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "appointment-meier-1",
    kind: "psychologist",
    professionalId: "meier",
    start: at(1, 17, 30),
    durationMinutes: SESSION_DURATION_MINUTES,
    status: "scheduled",
    // la quarta sessione di Laura, non una prima visita: ne ha già fatte tre
    type: "session",
  },
];

/*
 * Slot proponibili, dal giorno dopo il riferimento. Solo giorni feriali e orari
 * plausibili: chi guarda la demo deve poterci credere senza pensarci. Le
 * combinazioni giorno/ora cambiano da professionista a professionista,
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

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

const THURSDAY = 4;
assertInDev(
  INITIAL_APPOINTMENTS[0].start.getDay() === THURSDAY,
  "L'appuntamento con la Dr.ssa Meier non cade di giovedì come dice il §8.",
);

assertInDev(
  INITIAL_ENTITLEMENT.used <= INITIAL_ENTITLEMENT.total,
  `Laura ha usato ${INITIAL_ENTITLEMENT.used} sessioni su un cap di ${INITIAL_ENTITLEMENT.total}.`,
);

/*
 * Uno slot proponibile non può cadere su un appuntamento già preso: le due
 * liste finiscono nella stessa griglia, e un'ora insieme occupata e prenotabile
 * si nota solo a schermo e solo se qualcuno guarda quel giorno.
 */
for (const slot of INITIAL_SLOTS) {
  assertInDev(
    !INITIAL_APPOINTMENTS.some(
      (appointment) =>
        appointment.professionalId === slot.professionalId &&
        appointment.start.getTime() === slot.start.getTime(),
    ),
    `Uno slot di ${slot.professionalId} cade su un appuntamento già preso.`,
  );
  assertInDev(
    slot.start.getDay() !== 0 && slot.start.getDay() !== 6,
    `Uno slot di ${slot.professionalId} cade nel fine settimana.`,
  );
}
