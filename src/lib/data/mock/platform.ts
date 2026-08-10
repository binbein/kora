import { assertInDev } from "../guardrails";
import {
  annualRevenueOf,
  currentPlatformMonth,
} from "../../platform-metrics";
import type {
  AppointmentKind,
  ClientCompany,
  PlatformMonth,
  PlatformUser,
} from "../types";
import { PLANS, PLAN_LIST } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { HISTORY_MONTHS } from "./measurement";
import { SERVICE_USAGE } from "./service-usage";

/*
 * Il portafoglio clienti e le serie di piattaforma (CLAUDE.md §8, §10.E).
 *
 * LA REGOLA DELL'AREA È UNA SOLA: i totali si ricavano dai dati e non si
 * scrivono. Il back-office ereditato dichiarava "618 utenti attivi" accanto a
 * un tasso di attivazione che ne implicava 767, e un fatturato che non tornava
 * con l'elenco delle aziende accanto. Qui l'unica cosa scritta a mano è la
 * tabella del §8 — organico, piano, mese di ingresso, iscritti — e tutto il
 * resto discende.
 *
 * DEMO SA È DENTRO I TOTALI, non accanto: le sue 142 sedute e i suoi 82
 * iscritti sono gli stessi che la dashboard HR mostra, e la sua serie di
 * utilizzo è la curva di adozione da cui si scalano gli altri clienti.
 */

const monthStart = (year: number, month: number) => new Date(year, month - 1, 1);

/**
 * I cinque clienti del §8. **L'unico dato scritto a mano di questo file.**
 *
 * Il ricavo non c'è: è organico × prezzo del piano × 12, e scriverlo vorrebbe
 * dire poterlo contraddire — che è esattamente quello che il back-office
 * ereditato faceva, dichiarando CHF 99'000 per Demo SA su un organico che
 * l'elenco accanto non confermava più (§5.5).
 */
export const CLIENT_COMPANIES: ClientCompany[] = [
  {
    id: "demo-sa",
    name: "Demo SA",
    industry: "finance",
    city: "Lugano",
    employeeCount: 120,
    planId: "plus",
    // il primo mese della finestra: la sua serie di stress e i suoi quattro
    // trimestri ROI coprono già dodici mesi, quindi non può essere più recente
    clientSince: monthStart(DEMO_TODAY.getFullYear() - 1, 10),
    enrolledEmployees: 82,
    active: true,
  },
  {
    id: "larice-pharma",
    name: "Larice Pharma SA",
    industry: "pharma",
    city: "Mendrisio",
    employeeCount: 420,
    planId: "executive",
    clientSince: monthStart(DEMO_TODAY.getFullYear(), 1),
    enrolledEmployees: 226,
    active: true,
  },
  {
    id: "genziana-tech",
    name: "Genziana Tech SA",
    industry: "tech",
    city: "Bellinzona",
    employeeCount: 210,
    planId: "plus",
    clientSince: monthStart(DEMO_TODAY.getFullYear(), 3),
    enrolledEmployees: 92,
    active: true,
  },
  {
    id: "studio-legale-rovere",
    name: "Studio Legale Rovere",
    industry: "legal",
    city: "Lugano",
    employeeCount: 48,
    planId: "essenziale",
    clientSince: monthStart(DEMO_TODAY.getFullYear(), 5),
    enrolledEmployees: 15,
    active: true,
  },
  {
    /*
     * L'unico non avviato. Sull'Essenziale e non sul Plus: 85 dipendenti stanno
     * nella banda 20–100 che `/pricing` dichiara per quel piano, e il codice
     * ereditato lo dava sul Plus, cioè in disaccordo con l'altra schermata
     * della stessa demo (§8).
     */
    id: "betulla-assicurazioni",
    name: "Betulla Assicurazioni SA",
    industry: "insurance",
    city: "Locarno",
    employeeCount: 85,
    planId: "essenziale",
    clientSince: monthStart(DEMO_TODAY.getFullYear(), 7),
    enrolledEmployees: 0,
    active: false,
  },
];

/** Ricavo mensile di un cliente. Zero finché il contratto non è avviato. */
function monthlyRevenueOf(company: ClientCompany): number {
  if (!company.active) return 0;
  return company.employeeCount * PLANS[company.planId].monthlyPricePerEmployee;
}

/** Se il contratto era già partito in un dato mese. */
function isClientIn(company: ClientCompany, month: Date): boolean {
  return company.clientSince.getTime() <= month.getTime();
}

/*
 * I servizi che un piano non comprende valgono zero.
 *
 * Senza questo, scalando la curva di Demo SA sugli altri clienti i due
 * Essenziale risulterebbero consumare coach e check-up, che il §9 non dà loro:
 * il totale di piattaforma sarebbe fatto di sedute che nessun contratto
 * prevede.
 */
function includesService(
  company: ClientCompany,
  kind: AppointmentKind,
): boolean {
  const plan = PLANS[company.planId];
  if (kind === "coach") return plan.coachSessionsPerYear !== undefined;
  if (kind === "checkup") return plan.checkup !== undefined;
  return true;
}

const REFERENCE = CLIENT_COMPANIES[0];

const SERVICE_KINDS: AppointmentKind[] = [
  "psychologist",
  "virtual_doctor",
  "coach",
  "checkup",
];

/*
 * Le dodici mensilità della piattaforma.
 *
 * Le sessioni di ogni cliente sono **la curva di Demo SA scalata sul rapporto
 * fra gli iscritti**, contata dal suo mese di ingresso. Non è una stima
 * comoda: è ciò che rende impossibile che il totale di piattaforma smetta di
 * contenere le 142 sedute che la dashboard HR mostra, perché quel mese di Demo
 * SA entra nel totale con il suo valore esatto (rapporto 1).
 */
export const PLATFORM_MONTHS: PlatformMonth[] = HISTORY_MONTHS.map(
  (month, index) => {
    const clients = CLIENT_COMPANIES.filter((company) =>
      isClientIn(company, month),
    );

    const sessions: Record<AppointmentKind, number> = {
      psychologist: 0,
      virtual_doctor: 0,
      coach: 0,
      checkup: 0,
    };

    for (const company of clients) {
      const share = company.enrolledEmployees / REFERENCE.enrolledEmployees;
      for (const kind of SERVICE_KINDS) {
        if (!includesService(company, kind)) continue;
        sessions[kind] += Math.round(
          SERVICE_USAGE[index].sessions[kind] * share,
        );
      }
    }

    return {
      month,
      recurringRevenueChf: clients.reduce(
        (sum, company) => sum + monthlyRevenueOf(company),
        0,
      ),
      coveredEmployees: clients
        .filter((company) => company.active)
        .reduce((sum, company) => sum + company.employeeCount, 0),
      enrolledEmployees: clients.reduce(
        (sum, company) => sum + company.enrolledEmployees,
        0,
      ),
      sessions,
    };
  },
);

/*
 * Il mese corrente e il ricavo annuo si derivano in `lib/platform-metrics.ts`,
 * che le schermate possono importare e questo file no (§5.7): una
 * implementazione sola, che sopravvive alla cancellazione di `mock/`.
 */
const CURRENT_PLATFORM_MONTH = currentPlatformMonth(PLATFORM_MONTHS);

/*
 * La serie nasce dai dodici mesi della finestra, quindi non può essere vuota —
 * ma il tipo lo ammette, ed è il caso che regge i guardrail qui sotto: senza
 * questo controllo il confronto sul run-rate non verrebbe fatto affatto, e un
 * guardrail che non gira è peggio di uno che manca.
 */
assertInDev(
  CURRENT_PLATFORM_MONTH !== null,
  "La serie di piattaforma è vuota: nessun mese corrente da cui derivare i totali.",
);

/*
 * Gli utenti del back-office: un estratto, come l'elenco dipendenti dell'HR.
 *
 * I domini stanno sotto il TLD riservato `.example` (RFC 2606), che nessuno può
 * registrare: una persona inventata non deve comparire su un dominio di terzi
 * (§8). Sono tutti sulla stessa forma — il nome dell'azienda in minuscolo con i
 * trattini — perché nel codice ereditato Demo SA usava `demo-sa.example` e le
 * altre quattro una forma tutta attaccata.
 *
 * NON PORTANO IL PIANO: il piano è dell'azienda, non della persona. La colonna
 * che il back-office ereditato mostrava era un dato duplicato che poteva
 * divergere da quello dell'elenco aziende.
 */
export const PLATFORM_USERS: PlatformUser[] = [
  {
    id: "user-mb",
    firstName: "Marco",
    lastName: "Bianchi",
    email: "m.bianchi@demo-sa.example",
    companyId: "demo-sa",
    role: "employee",
    active: true,
    healthScore: 74,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 1),
  },
  {
    id: "user-sc",
    firstName: "Sara",
    lastName: "Conti",
    email: "s.conti@demo-sa.example",
    companyId: "demo-sa",
    role: "hr",
    active: true,
    healthScore: 82,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 1),
  },
  {
    id: "user-lf",
    firstName: "Luca",
    lastName: "Ferrari",
    email: "l.ferrari@larice-pharma.example",
    companyId: "larice-pharma",
    role: "employee",
    active: true,
    healthScore: 61,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 2),
  },
  {
    id: "user-er",
    firstName: "Elena",
    lastName: "Russo",
    email: "e.russo@larice-pharma.example",
    companyId: "larice-pharma",
    role: "hr",
    active: true,
    healthScore: 88,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 2),
  },
  {
    id: "user-cv",
    firstName: "Chiara",
    lastName: "Verdi",
    email: "c.verdi@genziana-tech.example",
    companyId: "genziana-tech",
    role: "employee",
    active: true,
    healthScore: 79,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 3),
  },
  {
    id: "user-rn",
    firstName: "Roberto",
    lastName: "Neri",
    email: "r.neri@genziana-tech.example",
    companyId: "genziana-tech",
    role: "employee",
    active: false,
    healthScore: 55,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 3),
  },
  {
    /*
     * Iscritto senza assessment: `healthScore` è `null`, che è il caso di §11
     * — il valore assente, non uno zero che si legge come un punteggio pessimo.
     */
    id: "user-gm",
    firstName: "Giorgio",
    lastName: "Motta",
    email: "g.motta@studio-legale-rovere.example",
    companyId: "studio-legale-rovere",
    role: "employee",
    active: false,
    healthScore: null,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 5),
  },
];

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

assertInDev(
  CLIENT_COMPANIES.some((company) => company.id === "demo-sa"),
  "Demo SA non è nel portafoglio clienti: il back-office e la dashboard HR descriverebbero due aziende diverse.",
);

for (const company of CLIENT_COMPANIES) {
  assertInDev(
    company.enrolledEmployees <= company.employeeCount,
    `${company.name} dichiara ${company.enrolledEmployees} iscritti su ${company.employeeCount} dipendenti.`,
  );
  assertInDev(
    company.clientSince >= HISTORY_MONTHS[0],
    `${company.name} è cliente da prima della finestra dei dodici mesi: la sua curva partirebbe fuori dal grafico.`,
  );
  assertInDev(
    company.active || company.enrolledEmployees === 0,
    `${company.name} non è avviata ma dichiara ${company.enrolledEmployees} iscritti.`,
  );
}

/*
 * L'adozione deve scendere con l'anzianità (§8): è ciò che rende la curva di
 * activation il racconto dell'onboarding invece di una scala scelta a mano. Se
 * qualcuno riordina i semi, il grafico continua a disegnarsi e smette di dire
 * quello che il §8 promette.
 */
const byTenure = CLIENT_COMPANIES.filter((company) => company.active).sort(
  (a, b) => a.clientSince.getTime() - b.clientSince.getTime(),
);

for (let index = 1; index < byTenure.length; index += 1) {
  const older = byTenure[index - 1];
  const newer = byTenure[index];
  assertInDev(
    older.enrolledEmployees / older.employeeCount >
      newer.enrolledEmployees / newer.employeeCount,
    `${newer.name} ha un'adozione più alta di ${older.name}, che è cliente da più tempo.`,
  );
}

/*
 * IL RICAVO ANNUO E IL RUN-RATE DEVONO COINCIDERE. Sono due strade verso lo
 * stesso numero — la somma dell'elenco e il mensile corrente per dodici — ed è
 * il controllo che il back-office ereditato non avrebbe passato.
 */
const annualFromList = CLIENT_COMPANIES.filter((company) => company.active)
  .map((company) => annualRevenueOf(company, PLAN_LIST))
  .reduce((sum, value) => sum + value, 0);

const runRate = (CURRENT_PLATFORM_MONTH?.recurringRevenueChf ?? 0) * 12;

assertInDev(
  annualFromList === runRate,
  `Il ricavo annuo dall'elenco è ${annualFromList} e il run-rate mensile ne dà ${runRate}.`,
);

/* Il ricavo ricorrente non può scendere: nessun cliente esce dalla finestra. */
for (let index = 1; index < PLATFORM_MONTHS.length; index += 1) {
  assertInDev(
    PLATFORM_MONTHS[index].recurringRevenueChf >=
      PLATFORM_MONTHS[index - 1].recurringRevenueChf,
    `Il ricavo ricorrente cala fra ${PLATFORM_MONTHS[index - 1].month.toISOString().slice(0, 7)} e ${PLATFORM_MONTHS[index].month.toISOString().slice(0, 7)}.`,
  );
}

/*
 * Le sedute di psicologo di Demo SA devono stare dentro il totale di
 * piattaforma di ogni mese. È l'invariante che tiene insieme back-office e
 * dashboard HR: se un giorno la scalatura degli altri clienti cambiasse segno,
 * il totale potrebbe scendere sotto il dato che l'altra schermata mostra.
 */
for (const [index, entry] of PLATFORM_MONTHS.entries()) {
  assertInDev(
    entry.sessions.psychologist >= SERVICE_USAGE[index].sessions.psychologist,
    `Il totale di piattaforma di ${entry.month.toISOString().slice(0, 7)} ha meno sedute di psicologo di quante la sola Demo SA ne dichiari.`,
  );
}

/* I due piani Essenziale non comprendono coach e check-up (§9). */
for (const company of CLIENT_COMPANIES) {
  if (company.planId !== "essenziale") continue;
  assertInDev(
    !includesService(company, "coach") && !includesService(company, "checkup"),
    `${company.name} è sull'Essenziale ma il piano dichiara coach o check-up.`,
  );
}

const companyIds = new Set(CLIENT_COMPANIES.map((company) => company.id));

for (const user of PLATFORM_USERS) {
  assertInDev(
    companyIds.has(user.companyId),
    `L'utente ${user.email} appartiene a "${user.companyId}", che non è fra le aziende clienti.`,
  );
  assertInDev(
    user.email.endsWith(".example"),
    `L'utente ${user.email} non è su un dominio .example: una persona inventata non deve comparire su un dominio di terzi (§8).`,
  );
}
