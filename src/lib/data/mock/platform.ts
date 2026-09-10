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
  UserRole,
} from "../types";
import { patientDisplayName, patientInitials, sameQuarter } from "../types";
import { COMPANY, PLANS, PLAN_LIST } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { HISTORY_MONTHS } from "./measurement";
import { PORTAL_SESSIONS } from "./professional-portal";
import { CURRENT_QUARTER, ROI_SNAPSHOTS } from "./roi";
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
     * nella banda 20–100 che `/plans` dichiara per quel piano, e il codice
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

/**
 * Ricavo mensile di un cliente.
 *
 * Non controlla che il contratto sia avviato, e non deve: a escludere chi non
 * lo è ci pensa il filtro che costruisce la lista dei clienti del mese, che è
 * il posto in cui quella regola vive **una volta sola** (§5.5). Prima il
 * controllo era qui, e la stessa regola risultava espressa in tre modi diversi
 * in tre punti dello stesso oggetto.
 */
function monthlyRevenueOf(company: ClientCompany): number {
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

/*
 * L'azienda da cui si scalano tutte le curve, cercata **per id**.
 *
 * Era `CLIENT_COMPANIES[0]`, e il guardrail in fondo al file verificava che
 * `demo-sa` fosse nell'elenco — non che fosse in prima posizione. Riordinare
 * l'array avrebbe cambiato la base di ogni curva di piattaforma in silenzio,
 * senza che nessun controllo se ne accorgesse. Cercandola per id la dipendenza
 * posizionale sparisce, e con lei la cosa da sorvegliare.
 *
 * L'asserzione sta **qui e non in fondo**, perché `REFERENCE` viene
 * dereferenziato poche righe sotto: un controllo a valle lascerebbe l'assenza
 * arrivare al calcolo, e in produzione — dove i guardrail tacciono (§5.6) —
 * diventerebbe un `TypeError` lontano dal punto in cui si capisce. Il `throw`
 * accanto è lo stesso idioma di `requireProfessional` in `provider.ts`: il
 * guardrail spiega in sviluppo, il lancio ferma ovunque nel posto giusto.
 */
const reference = CLIENT_COMPANIES.find((company) => company.id === "demo-sa");

assertInDev(
  reference !== undefined,
  "Demo SA non è nel portafoglio clienti: è l'azienda da cui si scalano tutte le curve di piattaforma.",
);

if (reference === undefined) {
  throw new Error("Nessun cliente con id \"demo-sa\" nel portafoglio.");
}

const REFERENCE = reference;

/*
 * IL PUNTEGGIO MEDIO DEL PROFILO SALUTE, ED È UN VALORE DICHIARATO.
 *
 * Come le sedute di carriera del §8, e per la stessa ragione: dietro non c'è
 * una seconda sorgente da cui derivarlo. Fino al 16.08.2026 il numero a schermo
 * era la media di sette punteggi individuali scritti su `PLATFORM_USERS`, cioè
 * sette cifre non ratificate al posto di una — e soprattutto sette dati
 * sanitari attaccati a nome, cognome ed email. Il 73 è il valore che quella
 * media dava, tenuto perché la schermata non si muove.
 *
 * SEMPLIFICAZIONE DELLA DEMO, non del contratto: è costante sulla finestra,
 * mentre il campo sta su una serie mensile perché in produzione il backend lo
 * calcolerà mese per mese dalle risposte vere (`docs/CONTRATTO-DATI.md` §7).
 */
const AVERAGE_HEALTH_SCORE = 73;

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
    /*
     * I CLIENTI CHE CONTANO IN QUESTO MESE: presenti **e** avviati.
     *
     * Un predicato solo, applicato una volta, per tutti e quattro i campi del
     * mese. Prima ce n'erano tre diversi: `coveredEmployees` filtrava gli
     * attivi, `enrolledEmployees` no, le sedute nemmeno, e il ricavo li
     * escludeva da dentro `monthlyRevenueOf`. Iscritti e coperti sono il
     * numeratore e il denominatore dell'attivazione
     * (`docs/CONTRATTO-DATI.md` §3): contare due insiemi diversi ammette
     * un'attivazione sopra il 100%.
     *
     * A schermo non si vedeva, e per una coincidenza: l'unica azienda non
     * avviata ha zero iscritti. È lo stesso difetto degli "utenti iscritti"
     * della pagina utenti, un livello più sotto — e in produzione la
     * coincidenza cade, perché un contratto firmato e non partito può avere
     * benissimo delle persone già registrate.
     */
    const clients = CLIENT_COMPANIES.filter(
      (company) => isClientIn(company, month) && company.active,
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

    const enrolled = clients.reduce(
      (sum, company) => sum + company.enrolledEmployees,
      0,
    );

    return {
      month,
      recurringRevenueChf: clients.reduce(
        (sum, company) => sum + monthlyRevenueOf(company),
        0,
      ),
      coveredEmployees: clients.reduce(
        (sum, company) => sum + company.employeeCount,
        0,
      ),
      enrolledEmployees: enrolled,
      sessions,
      /*
       * Nessun iscritto vuol dire nessun assessment, quindi nessuna media: è il
       * `null` del §11 — il valore assente, non uno zero che si legge come un
       * punteggio pessimo. Il ramo non si raggiunge con questa finestra, che si
       * apre sul mese d'ingresso di Demo SA, e sta qui per la stessa ragione per
       * cui `adoptionPercent` guarda il proprio denominatore: in produzione il
       * primo mese di un cliente nuovo è il caso ordinario.
       */
      averageHealthScore:
        enrolled === 0 ? null : AVERAGE_HEALTH_SCORE,
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
    assessmentCompleted: true,
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
    assessmentCompleted: true,
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
    assessmentCompleted: true,
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
    assessmentCompleted: true,
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
    assessmentCompleted: true,
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
    assessmentCompleted: true,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 3),
  },
  {
    /*
     * L'unico iscritto che l'assessment non l'ha fatto: è il caso che tiene
     * onesta la KPI "con assessment", che senza di lui conterebbe tutte le
     * righe e non avrebbe niente da dire.
     */
    id: "user-gm",
    firstName: "Giorgio",
    lastName: "Motta",
    email: "g.motta@studio-legale-rovere.example",
    companyId: "studio-legale-rovere",
    role: "employee",
    active: false,
    assessmentCompleted: false,
    joinedAt: monthStart(DEMO_TODAY.getFullYear(), 5),
  },
];

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

/*
 * I DUE LATI DELLA STESSA AZIENDA DEVONO DIRE LO STESSO NUMERO.
 *
 * L'organico di Demo SA è scritto in `company.ts` e qui; i suoi iscritti in
 * `roi.ts` — il seme del trimestre corrente — e qui. Sono quattro valori per due
 * fatti, e fino a questo controllo **niente li confrontava**: cambiandone uno
 * solo, la dashboard HR e il back-office descrivevano due aziende diverse senza
 * che si rompesse niente.
 *
 * È il difetto del 618 contro il 767 che M3 ha chiuso a valle, sopravvissuto un
 * livello più sopra: lì erano due conteggi nella stessa schermata, qui sono due
 * semi in due file.
 *
 * Il messaggio è quello che stava sul controllo di presenza di `demo-sa`, e ci
 * sta meglio: quella riga diceva "descriverebbero due aziende diverse" per
 * un'assenza, mentre il caso che davvero le fa divergere è questo.
 */
const DEMO_SA_ENROLLED = ROI_SNAPSHOTS.find((snapshot) =>
  sameQuarter(snapshot.period, CURRENT_QUARTER),
)?.enrolledEmployees;

assertInDev(
  REFERENCE.employeeCount === COMPANY.employeeCount,
  `Il portafoglio dà a ${REFERENCE.name} ${REFERENCE.employeeCount} dipendenti e la dashboard HR ${COMPANY.employeeCount}: il back-office e l'area HR descrivono due aziende diverse.`,
);

assertInDev(
  DEMO_SA_ENROLLED === REFERENCE.enrolledEmployees,
  `Il portafoglio dà a ${REFERENCE.name} ${REFERENCE.enrolledEmployees} iscritti e lo snapshot del trimestre corrente ${DEMO_SA_ENROLLED}: il back-office e l'area HR descrivono due aziende diverse.`,
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
 * GLI ISCRITTI NON POSSONO SUPERARE I COPERTI, in nessun mese.
 *
 * È l'invariante che l'attivazione presuppone: iscritti ÷ coperti è una
 * percentuale solo se le due somme contano lo stesso insieme di clienti
 * (`docs/CONTRATTO-DATI.md` §3). Rotto, dà un'attivazione sopra il 100% — un
 * numero che a schermo si legge benissimo e non vuol dire niente.
 *
 * Sta a un livello diverso dal controllo sui semi qui sopra, che vieta a un
 * cliente non avviato di dichiarare iscritti: quello sorveglia il **dataset**,
 * questo la **serie derivata**. Il primo non vedrebbe un filtro che torna
 * asimmetrico, che è esattamente il difetto da cui questo controllo nasce.
 */
for (const entry of PLATFORM_MONTHS) {
  assertInDev(
    entry.enrolledEmployees <= entry.coveredEmployees,
    `Nel mese ${entry.month.getFullYear()}-${entry.month.getMonth() + 1} gli iscritti sono ${entry.enrolledEmployees} su ${entry.coveredEmployees} dipendenti coperti: l'attivazione supererebbe il 100%.`,
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

/*
 * STESSE INIZIALI DEVE VOLER DIRE STESSA PERSONA, E A DIRLO SONO DUE LISTE.
 *
 * Erano tre fino al 10.09.2026, e la terza era l'estratto dell'HR: è uscito con
 * l'elenco per persona, perché l'azienda vede ora **quanti si sono iscritti per
 * reparto e non chi** (§10.C.5). Restano l'agenda della Dr.ssa Meier e gli
 * utenti del back-office, che sono anche le due liste in cui una collisione fa
 * danno — quella del 16.08.2026, S.C. insieme referente HR e paziente con il
 * percorso più lungo, passava esattamente di qui.
 *
 * IL CONFRONTO SUL REPARTO È USCITO CON LA LISTA CHE LO DICHIARAVA. Era l'unica
 * a portare un `departmentId`, quindi senza di lei il controllo non poteva più
 * fallire: un ramo che nessun dato può raggiungere è codice che il §11 non
 * vuole, e tenerlo "per il giorno in cui servirà" era la previsione che questo
 * repository ha già visto invecchiare due volte.
 *
 * IL CASO CHE DEVE PASSARE È M.B.: Marco Bianchi è l'utente `user-mb` del
 * back-office e il paziente del lunedì alle 14:00, ed è la stessa persona. A
 * distinguerlo da S.C. sono i confronti qui sotto.
 */
type IdentityClaim = {
  initials: string;
  companyId: string;
  /** Il ruolo, dove la lista lo dichiara: ce l'ha solo il back-office. */
  role: UserRole | null;
  /** Il nome per esteso: da quando le liste sono due, ce l'hanno entrambe. */
  fullName: string | null;
  /**
   * L'id di dominio della persona, dove la lista ce l'ha. Il back-office ha un
   * id suo (`user-mb`) che non è quello del dominio, quindi lì è `null`:
   * ricavarlo togliendo il prefisso sarebbe un aggancio su una convenzione di
   * scrittura, cioè la cosa che questo guardrail esiste per non fare.
   */
  personId: string | null;
  /**
   * Se la lista contiene, per costruzione, dipendenti dell'azienda: i pazienti
   * sì, gli utenti del back-office no — lì ci sono anche HR e amministratori.
   */
  isEmployee: boolean;
  /** Chi lo afferma, perché il messaggio dica dove guardare. */
  source: string;
};

const identityClaims: IdentityClaim[] = [
  /*
   * I pazienti del portale sono dipendenti di Demo SA: è la stessa azienda vista
   * dai due lati del marketplace (§10.D).
   */
  ...PORTAL_SESSIONS.map((session) => ({
    // derivate dal nome, non dichiarate: dal 17.08.2026 l'agenda porta il nome
    initials: patientInitials(session),
    companyId: COMPANY.id,
    role: null,
    fullName: patientDisplayName(session),
    personId: session.patientId,
    isEmployee: true,
    source: "l'agenda del portale professionista",
  })),
  ...PLATFORM_USERS.map((user) => ({
    initials: `${user.firstName.charAt(0)}.${user.lastName.charAt(0)}.`,
    companyId: user.companyId,
    role: user.role,
    fullName: `${user.firstName} ${user.lastName}`,
    personId: null,
    isEmployee: false,
    source: "gli utenti del back-office",
  })),
];

/** Le rivendicazioni raggruppate per `key`, saltando quelle che non ne hanno. */
function groupBy(
  key: (claim: IdentityClaim) => string | null,
): Map<string, IdentityClaim[]> {
  const groups = new Map<string, IdentityClaim[]>();
  for (const claim of identityClaims) {
    const value = key(claim);
    if (value === null) continue;
    const group = groups.get(value);
    if (group === undefined) groups.set(value, [claim]);
    else group.push(claim);
  }
  return groups;
}

/** I valori distinti e dichiarati di un gruppo, per i messaggi e per i conti. */
function declared(
  group: IdentityClaim[],
  field: (claim: IdentityClaim) => string | null,
): string[] {
  return [
    ...new Set(group.map(field).filter((value): value is string => value !== null)),
  ];
}

for (const [initials, group] of groupBy((claim) => claim.initials)) {
  const companies = declared(group, (claim) => claim.companyId);
  assertInDev(
    companies.length === 1,
    `${initials} compare in più aziende — ${companies.join(", ")} — quindi stesse iniziali non vogliono dire stessa persona (§8).`,
  );

  /* Due dipendenti diversi non possono avere le stesse iniziali. */
  const people = declared(group, (claim) => claim.personId);
  assertInDev(
    people.length <= 1,
    `${initials} appartiene a più persone — ${people.join(", ")} — su elenchi che si uniscono per id (§8).`,
  );

  /*
   * IL CONFRONTO CHE DISTINGUE M.B. DA S.C., e senza il quale gli altri
   * lasciavano passare la collisione: azienda e id tornavano, perché il
   * back-office non dichiara un id di dominio.
   *
   * QUESTA È UNA REGOLA DEL DATASET DEMO, NON DEL DOMINIO, e la distinzione è
   * la correzione del 16.08.2026 a come questa riga era stata scritta. Una
   * referente HR **è** una dipendente: può stare nell'estratto della propria
   * azienda e può essere in cura, e il prodotto ha bisogno che sia possibile —
   * dire il contrario sarebbe una regola falsa messa in un guardrail.
   *
   * Ciò che è vero e verificabile è più modesto: **in questo dataset le persone
   * con un ruolo non-`employee` non compaiono nell'altro elenco.** Le iniziali
   * sono l'unica chiave che unisce le due liste — il back-office non porta un id
   * di dominio — quindi finché quel vincolo tiene,
   * iniziali condivise con un ruolo diverso vogliono dire **due persone che il
   * dataset non sa distinguere**, non una persona con due mestieri.
   *
   * In produzione le liste si uniranno per id vero e questo confronto sparisce
   * (`docs/CONTRATTO-DATI.md` §7).
   */
  const employeeClaim = group.find((claim) => claim.isEmployee);
  for (const claim of group) {
    assertInDev(
      employeeClaim === undefined ||
        claim.role === null ||
        claim.role === "employee",
      `${initials} compare in ${employeeClaim?.source} e ha ruolo "${claim.role}" in ${claim.source}: in questo dataset chi non è "employee" non sta negli altri due elenchi, quindi sono due persone che le sole iniziali non distinguono (§8).`,
    );
  }

  /*
   * IL CONFRONTO NUOVO, E LO PORTA IL NOME (17.08.2026).
   *
   * Le due liste dichiarano un nome per esteso. Se le stesse iniziali portano
   * due nomi diversi, il §8 è violato **in un modo che gli altri confronti non
   * vedono** — tornano tutti, perché il back-office non dichiara un id di
   * dominio, ed è esattamente il buco da cui passò S.C. il 16.08.2026.
   *
   * È il caso di M.B.: Marco Bianchi è l'utente `user-mb` del back-office e il
   * paziente del lunedì alle 14:00, e ora che il nome è a schermo da un lato
   * solo dei due, chiamarlo in due modi sarebbe una collisione che nessuno
   * vedrebbe leggendo — le iniziali continuerebbero a coincidere.
   */
  const names = declared(group, (claim) => claim.fullName);
  assertInDev(
    names.length <= 1,
    `${initials} compare con più nomi — ${names.join(", ")} — su elenchi che il §8 tiene uniti per iniziali: o sono due persone e le iniziali vanno cambiate, o è una e il nome è scritto in due modi.`,
  );
}

/*
 * E la stessa persona non può avere due iniziali. È la direzione opposta della
 * precedente: l'agenda porta un nome per seduta, quindi lo stesso paziente
 * scritto in due modi su due sedute produce due persone dove ce n'è una, senza
 * che nessuno degli altri controlli se ne accorga — quelli raggruppano per
 * iniziali, e qui sono proprio le iniziali a divergere.
 */
for (const [personId, group] of groupBy((claim) => claim.personId)) {
  const spellings = declared(group, (claim) => claim.initials);
  assertInDev(
    spellings.length === 1,
    `La persona "${personId}" compare con più iniziali — ${spellings.join(", ")} — su elenchi che si uniscono per id (§8).`,
  );
}
