import type { EmployeeProfile, Professional } from "../types";

/*
 * Le persone della demo (CLAUDE.md §6).
 *
 * Dei professionisti il documento fissa titolo, cognome, specialità, lingue e
 * valutazione: i nomi propri non ci sono e non vengono inventati, perché
 * `Professional.firstName` è opzionale proprio per questo.
 */

export const LAURA: EmployeeProfile = {
  id: "laura-bernasconi",
  firstName: "Laura",
  lastName: "Bernasconi",
  age: 34,
  departmentId: "operations",
  healthProfile: {
    score: 78,
    summaryKey: "balanced",
    weakestArea: "sleep",
  },
};

/*
 * Compenso per sessione erogata (§7): il Business Plan fissa la banda
 * CHF 70–80, non la tariffa della singola persona.
 *
 * Dove cade ognuno dentro la banda è quindi una scelta di questo file, non un
 * dato del documento. Segue la valutazione, che è l'unico ordinamento che il
 * §6 dà dei quattro professionisti: distribuirle a caso avrebbe avuto lo
 * stesso valore informativo e sarebbe stato più difficile da difendere se
 * qualcuno lo chiede. Se arrivano le tariffe vere, si sostituiscono qui.
 */
export const SESSION_FEE_BAND = { min: 70, max: 80 } as const;

/*
 * Il riferimento a pieno regime del §7: con 20 sessioni a settimana un
 * professionista arriva a CHF 5'600–6'400 al mese.
 *
 * Le due cifre tornano con la banda qui sopra — 20 × 4 settimane × 70 e ×
 * 80 — il che dice anche che il Business Plan conta quattro settimane per
 * mese. Sono comunque scritte, non calcolate: sono un dato del documento, e
 * ricavarle da una moltiplicazione le farebbe sembrare una nostra stima.
 */
export const FULL_CAPACITY = {
  sessionsPerWeek: 20,
  monthlyMinChf: 5600,
  monthlyMaxChf: 6400,
} as const;

export const PROFESSIONALS: Professional[] = [
  {
    id: "colombo",
    title: "Dr.ssa",
    lastName: "Colombo",
    specialty: "work_stress",
    languages: ["it", "de"],
    rating: 4.9,
    sessionFee: 80,
  },
  {
    id: "rossi",
    title: "Dr.",
    lastName: "Rossi",
    specialty: "burnout_anxiety",
    languages: ["it", "fr"],
    rating: 4.8,
    sessionFee: 75,
  },
  {
    id: "meier",
    title: "Dr.ssa",
    lastName: "Meier",
    specialty: "sleep",
    languages: ["it", "de"],
    rating: 4.9,
    sessionFee: 80,
  },
  {
    id: "fontana",
    title: "Dr.",
    lastName: "Fontana",
    specialty: "coaching",
    languages: ["it"],
    rating: 4.7,
    sessionFee: 70,
  },
];
