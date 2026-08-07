import { assertInDev } from "../guardrails";
import type { AppointmentSlot } from "../types";
import { DEMO_TODAY } from "./demo-date";
import { PROFESSIONALS } from "./people";

/*
 * Gli slot ancora prenotabili (CLAUDE.md §8).
 *
 * Qui non c'è né il diritto alle sedute di Laura né i suoi appuntamenti, e per
 * la stessa ragione: sono entrambi conti sulle sedute della Dr.ssa Meier, che
 * vivono in `professional-portal.ts`. Il giovedì 17:30 del §8 è un record solo,
 * proiettato da due lati, e `used: 3` sarebbe un secondo numero pinnato sullo
 * stesso fatto — che è precisamente ciò che il §5.5 vieta.
 */

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
