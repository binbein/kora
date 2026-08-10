import { assertInDev } from "../guardrails";
import type {
  EmployeeProfile,
  FullCapacityReference,
  Professional,
} from "../types";
import { DEMO_TODAY } from "./demo-date";

/*
 * Le persone della demo (CLAUDE.md §8).
 *
 * Dei professionisti il documento fissa titolo, cognome, specialità, lingue e
 * valutazione. I nomi propri non ci sono e non si inventano: `firstName` è
 * `null` su tutti e cinque, dichiarato invece che omesso, perché è uno slot che
 * il dataset lascia vuoto e non un campo che al caso non pertiene — in
 * produzione il nome esiste sempre (`docs/CONTRATTO-DATI.md` §7). Non ci sono
 * numeri d'albo, e nemmeno quelli si inventano: il §8 lo vieta e il tipo non ha
 * il campo.
 */

/*
 * L'id è opaco, come quello degli altri otto pazienti (gr, mb, ek…), e deve
 * restarlo: esce sul filo in `ProfessionalSession.patientId` e in
 * `EmployeeDirectoryEntry.employeeId`, cioè sulle due proiezioni che il
 * contratto dichiara prive di qualunque campo su cui un nome possa arrivare
 * (`docs/CONTRATTO-DATI.md` §3). Un id leggibile è un nome che arriva lo
 * stesso, e sarebbe arrivato proprio della persona su cui la demo si regge.
 */
export const LAURA: EmployeeProfile = {
  id: "lb",
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
const SESSION_FEE_BAND = { min: 70, max: 80 } as const;

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
  // le ore minime a settimana: **non sono trascritte nel §9**, a differenza
  // delle tre cifre qui sopra. Stanno qui perché è dove vivono le condizioni
  // del contratto con il professionista, non perché siano approvate
  minHoursPerWeek: 8,
};

export const PROFESSIONALS: Professional[] = [
  {
    id: "colombo",
    title: "Dr.ssa",
    firstName: null,
    lastName: "Colombo",
    qualificationKey: "psychologist_f",
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
    firstName: null,
    lastName: "Rossi",
    qualificationKey: "psychologist_m",
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
    firstName: null,
    lastName: "Meier",
    qualificationKey: "psychologist_f",
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
    firstName: null,
    lastName: "Fontana",
    qualificationKey: "coach_m",
    specialty: "coaching",
    languages: ["it"],
    rating: 4.7,
    sessionFee: 70,
    totalSessions: 210,
    documentsVerified: true,
    mandateSigned: true,
  },
  /*
   * La quinta è in verifica (§8), e non è offerta in più: è il flusso di
   * vetting messo a schermo. Documenti verificati, mandato non ancora firmato,
   * zero sedute e nessuna valutazione — senza di lei la KPI "in verifica" del
   * back-office mostra zero e la piattaforma sembra non controllare nessuno.
   *
   * Non è prenotabile, e a deciderlo è il dato: `isBookable` chiede documenti
   * **e** mandato. È la stessa regola del Centro Diagnostico Basalto, che il
   * back-office elenca e la prenotazione non propone.
   */
  {
    id: "keller",
    title: "Dr.ssa",
    firstName: null,
    lastName: "Keller",
    qualificationKey: "psychologist_f",
    specialty: "work_stress",
    languages: ["de", "en"],
    rating: null,
    sessionFee: 75,
    totalSessions: 0,
    documentsVerified: true,
    mandateSigned: false,
  },
];

/*
 * La banda del §9 non era usata da nessuno: era una costante esportata accanto
 * a cinque tariffe che nessuno confrontava con lei, cioe' il commento qui sopra
 * scritto due volte invece di una verifica.
 *
 * Una tariffa fuori banda non romperebbe niente a schermo — uscirebbe un totale
 * mensile plausibile e sbagliato, e il "CHF 70-80 a sessione erogata" del
 * Business Plan smetterebbe di descrivere la demo che gli sta accanto.
 */
PROFESSIONALS.forEach((professional) => {
  assertInDev(
    professional.sessionFee >= SESSION_FEE_BAND.min &&
      professional.sessionFee <= SESSION_FEE_BAND.max,
    `${professional.lastName} prende CHF ${professional.sessionFee} a seduta, fuori dalla banda CHF ${SESSION_FEE_BAND.min}-${SESSION_FEE_BAND.max} del §9.`,
  );
});
