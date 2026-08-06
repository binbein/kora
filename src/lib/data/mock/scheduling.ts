import { assertInDev } from "../guardrails";
import type { AppointmentSlot, SessionEntitlement } from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { PROFESSIONALS } from "./people";

/*
 * Il diritto alle sessioni di Laura e gli slot ancora prenotabili (CLAUDE.md §8).
 *
 * Il cap e il prezzo della sessione extra vengono dal piano dell'azienda, non
 * ricopiati qui: il Plus dà 10 sessioni all'anno e CHF 28 per quelle in più, e
 * se domani Demo SA passa all'Executive il contatore segue da solo.
 *
 * Gli **appuntamenti** di Laura non stanno qui: sono le sessioni della Dr.ssa
 * Meier, in `professional-portal.ts`. Il giovedì 17:30 del §8 è un record solo,
 * proiettato da due lati — tenerne una copia per il dipendente e una per la
 * professionista significherebbe avere due verità sullo stesso appuntamento, che
 * è precisamente ciò che il §5.5 vieta.
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

assertInDev(
  INITIAL_ENTITLEMENT.used <= INITIAL_ENTITLEMENT.total,
  `Laura ha usato ${INITIAL_ENTITLEMENT.used} sessioni su un cap di ${INITIAL_ENTITLEMENT.total}.`,
);

/*
 * Uno slot proponibile non può cadere nel fine settimana. Che non caschi su una
 * sessione già presa lo verifica `professional-portal.ts`, che è dove vivono le
 * sessioni.
 */
for (const slot of INITIAL_SLOTS) {
  assertInDev(
    slot.start.getDay() !== 0 && slot.start.getDay() !== 6,
    `Uno slot di ${slot.professionalId} cade nel fine settimana.`,
  );
}
