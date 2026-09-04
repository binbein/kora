import { assertInDev } from "../guardrails";
import type { Company, Department, Plan, PlanId } from "../types";
import { DEMO_TODAY } from "./demo-date";

/*
 * Demo SA e i suoi reparti (CLAUDE.md §8). Nessuna cifra qui è inventata:
 * organico, reparti, piano e prezzi vengono dal documento.
 *
 * La data in cui la demo è ambientata sta in `demo-date.ts`: la usano quasi
 * tutti i moduli del dataset e non è un dato dell'azienda.
 */

/*
 * I tre piani del §9. La demo usa Plus.
 *
 * I campi opzionali seguono la regola dichiarata sul tipo: **assente significa
 * che il Business Plan non lo dice**, non che il piano ne sia privo — la card
 * salta la riga, non la trasforma in una negazione. Vale per esempio per il
 * coaching dell'Essenziale, che il §9 non nomina.
 *
 * La regola si è già ripagata: costruendo questi tre piani il check-up
 * dell'Executive risultava assente, e invece di diventare un `false` scritto da
 * noi ha fatto emergere che era il §9 a saltare tre righe della p.10 del
 * Business Plan. La correzione è andata sulla costituzione, non qui.
 */
export const PLANS: Record<PlanId, Plan> = {
  essenziale: {
    id: "essenziale",
    monthlyPricePerEmployee: 38,
    sessionsPerYear: 6,
    extraSessionPrice: 35,
    virtualDoctorSlaHours: 12,
    virtualDoctorConsultsPerYear: 3,
    firstSessionWithinHours: 72,
    // una volta sola, non uno per sessione: scritto senza il tetto si legge
    // come un extra ricorrente (§9)
    freeIntroInterview: true,
    hrDashboard: "base",
  },
  plus: {
    id: "plus",
    monthlyPricePerEmployee: 55,
    sessionsPerYear: 10,
    extraSessionPrice: 28,
    virtualDoctorSlaHours: 4,
    virtualDoctorConsultsPerYear: "unlimited",
    firstSessionWithinHours: 72,
    coachSessionsPerYear: 4,
    checkup: "annual",
    aiPlanEveryMonths: 6,
    freeIntroInterview: false,
    // per reparto, con l'alert burnout precoce: è il piano di Demo SA, ed è
    // il livello che la dashboard del §10.C mostra davvero
    hrDashboard: "department",
    // per dipendente al mese: scritto "+ CHF 15/mese" si legge come una tariffa
    // unica per l'azienda, che a 120 dipendenti sbaglia di due ordini di
    // grandezza (§9)
    partnerExtensionPerEmployee: 15,
  },
  executive: {
    id: "executive",
    monthlyPricePerEmployee: 82,
    sessionsPerYear: 16,
    extraSessionPrice: 22,
    virtualDoctorSlaHours: 1,
    virtualDoctorConsultsPerYear: "unlimited",
    firstSessionWithinHours: 72,
    coachSessionsPerYear: 6,
    nutritionistSessionsPerYear: 4,
    liveWorkshopsPerYear: 2,
    // più esteso di quello annuale del Plus: ECG, eco addome, oculista, sangue
    // completo (§9)
    checkup: "executive",
    aiPlanEveryMonths: 1,
    // report mensile e call mensile col team clinico (§9): è la voce che la
    // card ereditata dava come "consulenza HR trimestrale", sottostimando il
    // piano più caro
    hrDashboard: "advanced",
    includesPsychiatrist: true,
    includesFamily: true,
    freeIntroInterview: false,
  },
};

/**
 * I piani nell'ordine in cui il listino li mostra, dal più economico al più
 * completo. È un elenco esplicito e non `Object.values(PLANS)`: l'ordine con
 * cui si presenta un listino è una scelta, non l'ordine di scrittura di un
 * oggetto.
 */
export const PLAN_LIST: Plan[] = [PLANS.essenziale, PLANS.plus, PLANS.executive];

export const COMPANY: Company = {
  id: "demo-sa",
  name: "Demo SA",
  city: "Lugano",
  employeeCount: 120,
  plan: PLANS.plus,
  // 12 dipendenti misurati nel periodo, non 15: HR + Legale ha 15 di organico e
  // con la soglia a 15 sarebbe pubblicabile solo con il 100% di risposte in
  // tutti e dodici i mesi (§8)
  anonymityThreshold: 12,
  // fine dell'anno in cui cade la demo: come per l'iscrizione di Laura, una data
  // assoluta invecchierebbe da sola mentre `DEMO_TODAY` resta l'unica manopola
  contractRenewsOn: new Date(DEMO_TODAY.getFullYear(), 11, 31),
};

/**
 * I sei reparti del §8. Sommano a 120.
 *
 * L'anagrafica **non** porta il conteggio dei misurati: quello vive sul record
 * mensile, in `measurement.ts`, perché cambia mese per mese ed è ciò che si
 * muove quando un reparto va sotto pressione.
 */
export const DEPARTMENTS: Department[] = [
  { id: "sales", name: "Vendite", employeeCount: 24 },
  { id: "operations", name: "Operations", employeeCount: 31 },
  { id: "finance", name: "Finanza", employeeCount: 18 },
  { id: "it", name: "IT", employeeCount: 17 },
  { id: "hr-legal", name: "HR + Legale", employeeCount: 15 },
  { id: "board", name: "Direzione", employeeCount: 15 },
];

/*
 * "Sommano a 120" era una promessa del commento qui sopra, e un commento non
 * ferma nessuno. Il conto sostiene la riga "24 dipendenti · 13 misurati" di
 * ogni riga della dashboard e il denominatore dell'adozione: se un reparto
 * cambiasse organico, l'azienda direbbe 120 in cima e un'altra cifra sommando
 * la tabella sotto, senza che niente si rompa.
 */
const departmentHeadcount = DEPARTMENTS.reduce(
  (sum, department) => sum + department.employeeCount,
  0,
);

assertInDev(
  departmentHeadcount === COMPANY.employeeCount,
  `I sei reparti sommano a ${departmentHeadcount} dipendenti, l'azienda ne dichiara ${COMPANY.employeeCount} (§8).`,
);

/*
 * IL PAVIMENTO DELLA SOGLIA DI ANONIMATO (founder, 02.09.2026).
 *
 * `anonymityThreshold` è una proprietà del cliente e non una costante di
 * piattaforma: aziende diverse possono averne di diverse
 * (`docs/CONTRATTO-DATI.md` §3). Ma **sotto 5 la soglia smette di essere una
 * soglia**: con quattro risposte un punteggio di reparto è la media di un
 * gruppo che chi ci lavora sa nominare, e l'anonimato diventa una parola.
 *
 * È il controllo che in produzione sta sul confine — nessun cliente può
 * scendere sotto — e qui vale sul dataset, che è l'unico cliente che c'è.
 */
assertInDev(
  COMPANY.anonymityThreshold >= 5,
  `La soglia di anonimato di ${COMPANY.name} è ${COMPANY.anonymityThreshold}: sotto 5 un punteggio di reparto descrive un gruppo che chi ci lavora sa nominare.`,
);
