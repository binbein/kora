import type { EmployeeProfile, FullCapacityReference, Professional } from "../types";
import { DEMO_TODAY } from "./demo-date";

/*
 * Le persone della demo (CLAUDE.md §8).
 *
 * Dei professionisti il documento fissa titolo, cognome, specialità, lingue e
 * valutazione: i nomi propri non ci sono e non si inventano, ed è per questo
 * che `Professional.firstName` è opzionale. Non ci sono numeri d'albo, e nemmeno
 * quelli si inventano — il §8 lo vieta e il tipo non ha il campo.
 */

export const LAURA: EmployeeProfile = {
  id: "laura-bernasconi",
  firstName: "Laura",
  lastName: "Bernasconi",
  age: 34,
  departmentId: "operations",
  email: "l.bernasconi@demo-sa.example",
  // gennaio dell'anno in cui cade la demo: la data di iscrizione non è un dato
  // del §8 e non deve diventare una data assoluta che invecchia da sola
  memberSince: new Date(DEMO_TODAY.getFullYear(), 0, 1),
  healthProfile: {
    score: 78,
    summaryKey: "balanced",
    weakestArea: "sleep",
  },
};

/*
 * Compenso per sessione erogata: il §9 fissa la banda CHF 70–80, non la tariffa
 * della singola persona.
 *
 * Dove cade ognuno dentro la banda è quindi **una scelta di questo file**, come
 * il §9 chiede di dichiarare. Segue la valutazione, che è l'unico ordinamento
 * che il §8 dà dei quattro: distribuirle a caso avrebbe avuto lo stesso valore
 * informativo e sarebbe stato più difficile da difendere se qualcuno lo chiede.
 * Se arrivano le tariffe vere, si sostituiscono qui.
 */
export const SESSION_FEE_BAND = { min: 70, max: 80 } as const;

/*
 * Il riferimento a pieno regime del §9: con 20 sessioni a settimana un
 * professionista arriva a CHF 5'600–6'400 al mese.
 *
 * Le due cifre tornano con la banda qui sopra — 20 × 4 settimane × 70 e × 80 —
 * il che dice anche che il Business Plan conta quattro settimane per mese. Sono
 * comunque scritte e non calcolate: sono un dato del documento, e ricavarle da
 * una moltiplicazione le farebbe sembrare una nostra stima.
 */
export const FULL_CAPACITY: FullCapacityReference = {
  sessionsPerWeek: 20,
  monthlyMinChf: 5600,
  monthlyMaxChf: 6400,
};

export const PROFESSIONALS: Professional[] = [
  {
    id: "colombo",
    title: "Dr.ssa",
    lastName: "Colombo",
    specialty: "work_stress",
    languages: ["it", "de"],
    rating: 4.9,
    sessionFee: 80,
    totalSessions: 340,
    documentsVerified: true,
    mandateSigned: true,
  },
  {
    id: "rossi",
    title: "Dr.",
    lastName: "Rossi",
    specialty: "burnout_anxiety",
    languages: ["it", "fr"],
    rating: 4.8,
    sessionFee: 75,
    totalSessions: 285,
    documentsVerified: true,
    mandateSigned: true,
  },
  {
    id: "meier",
    title: "Dr.ssa",
    lastName: "Meier",
    specialty: "sleep",
    languages: ["it", "de"],
    rating: 4.9,
    sessionFee: 80,
    totalSessions: 312,
    documentsVerified: true,
    mandateSigned: true,
  },
  {
    id: "fontana",
    title: "Dr.",
    lastName: "Fontana",
    specialty: "coaching",
    languages: ["it"],
    rating: 4.7,
    sessionFee: 70,
    totalSessions: 210,
    documentsVerified: true,
    mandateSigned: true,
  },
];
