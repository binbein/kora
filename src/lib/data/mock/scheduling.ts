import { overlaps } from "../../dates";
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
      // le 09:00 e non le 09:30: a 09:30 questo slot finiva alle 10:20 e si
      // sovrapponeva per venti minuti a quello della Dr.ssa Meier delle 10:00,
      // che è **lo slot che `docs/PITCH.md` prescrive di prenotare**. Chi li
      // prenotava entrambi si ritrovava due sedute accavallate nella home.
      [2, 9, 0],
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

/*
 * DUE SLOT PROPONIBILI NON SI SOVRAPPONGONO, nemmeno fra professionisti diversi.
 *
 * A prenotarli è **una persona sola**, quindi due fasce che si accavallano sono
 * due sedute che non può fare — e la demo le proponeva entrambe: lo slot delle
 * 09:30 del Dr. Rossi finiva alle 10:20, dentro quello delle 10:00 della
 * Dr.ssa Meier che `docs/PITCH.md` prescrive di prenotare.
 *
 * Confronta **intervalli e non istanti**: sullo stesso istante di inizio il
 * difetto si vede, venti minuti dopo no. È il controllo che avrebbe trovato
 * quella coppia da solo, e serve a chi cambierà un orario del piano senza
 * ricalcolare a mente le sedici fasce.
 */
for (const [index, slot] of INITIAL_SLOTS.entries()) {
  for (const other of INITIAL_SLOTS.slice(index + 1)) {
    assertInDev(
      !overlaps(
        slot.start,
        slot.durationMinutes,
        other.start,
        other.durationMinutes,
      ),
      `Gli slot di ${slot.professionalId} e ${other.professionalId} si sovrappongono: chi prenota è la stessa persona e non può fare entrambe le sedute.`,
    );
  }
}
