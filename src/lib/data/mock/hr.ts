import { assertInDev } from "../guardrails";
import {
  addQuarters,
  adoptionPercent,
  quarterKey,
  quarterOf,
  type EmployeeDirectoryEntry,
  type HrReport,
  type Invoice,
  type Quarter,
  type RoiSnapshot,
} from "../types";
import { COMPANY, DEPARTMENTS } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { COMPANY_MONTHS, HISTORY_MONTHS } from "./measurement";
import { LAURA } from "./people";
import { ANNUAL_SESSION_ALLOWANCE, ROI_SNAPSHOTS } from "./roi";
import { usageThrough } from "./service-usage";

/*
 * I dati che vivono solo nell'area HR (CLAUDE.md §10.C).
 *
 * Elenco dipendenti, fatture e report trimestrale. Le prime due sono anagrafica
 * di questa demo; il terzo non è un dato ma una vista: ogni sua metrica si
 * ricava dallo snapshot e dalle serie, così la schermata e il PDF di M4 dicono
 * lo stesso numero perché leggono lo stesso dato.
 */

/*
 * L'elenco che l'HR vede.
 *
 * SEMPLIFICAZIONE DICHIARATA: sono otto righe su 120 dipendenti. Un elenco vero
 * si pagina e si cerca, ed è M5; qui la schermata dice che è un estratto invece
 * di far credere che l'azienda abbia otto persone — che è quello che fa il
 * codice ereditato, dove l'intestazione conta "6/8 attivati" accanto a una
 * dashboard che ne dichiara 82 su 120.
 *
 * LE INIZIALI SONO LE STESSE DEL PORTALE PROFESSIONISTA, e non per ordine: sei
 * di queste persone sono pazienti della Dr.ssa Meier, quindi hanno per forza
 * attivato l'account. L.B. è Laura Bernasconi — il codice ereditato la dava
 * "in attesa" e in Finance, mentre ha tre sedute erogate ed è in Operations.
 * Stesse iniziali vuol dire stessa persona (§8, difetto aperto da M0).
 */
export const EMPLOYEE_DIRECTORY: EmployeeDirectoryEntry[] = [
  {
    employeeId: LAURA.id,
    initials: "L.B.",
    departmentId: LAURA.departmentId,
    enrolled: true,
    checkupStatus: "completed",
  },
  {
    employeeId: "gr",
    initials: "G.R.",
    departmentId: "finance",
    enrolled: true,
    checkupStatus: "completed",
  },
  {
    employeeId: "mb",
    initials: "M.B.",
    departmentId: "operations",
    enrolled: true,
    checkupStatus: "booked",
  },
  {
    employeeId: "ek",
    initials: "E.K.",
    departmentId: "hr-legal",
    enrolled: true,
    checkupStatus: "available",
  },
  {
    /*
     * ERA `sc` / "S.C.", ED ERA UNA COLLISIONE DI IDENTITÀ (16.08.2026).
     *
     * S.C. sono anche le iniziali di Sara Conti, la referente HR di Demo SA in
     * `platform.ts`: per il §8 — stesse iniziali, stessa persona — questa riga,
     * il suo percorso dalla Dr.ssa Meier e l'utente del back-office parlavano
     * della stessa persona, e la facevano risultare in Vendite e con il
     * percorso terapeutico più lungo della demo.
     *
     * A cambiare sono le **iniziali**, non il nome: un nome nuovo passa dalla
     * verifica del §8 e da una decisione dei founder, una coppia di iniziali
     * libera no.
     */
    employeeId: "ig",
    initials: "I.G.",
    departmentId: "sales",
    enrolled: true,
    checkupStatus: "completed",
  },
  {
    employeeId: "at",
    initials: "A.T.",
    departmentId: "it",
    enrolled: true,
    checkupStatus: "booked",
  },
  {
    employeeId: "fm",
    initials: "F.M.",
    departmentId: "sales",
    enrolled: false,
    checkupStatus: null,
  },
  {
    employeeId: "pv",
    initials: "P.V.",
    departmentId: "board",
    enrolled: false,
    checkupStatus: null,
  },
];

/*
 * Le ultime quattro fatture, dal mese della demo all'indietro.
 *
 * I mesi si contano da `DEMO_TODAY` e non si scrivono: il codice ereditato
 * fatturava "Aprile 2026" a una demo ambientata in settembre, che è lo stesso
 * difetto delle date scritte a mano del portale professionista (§11).
 *
 * TUTTE E QUATTRO SONO `paid`, COMPRESO IL MESE IN CORSO, e va detto perché il
 * lato professionista fa l'opposto: `payoutHistory` mette il mese in corso a
 * `pending`, e chi legge i due file di seguito trova la stessa demo che dà lo
 * stesso mese per pagato di qua e in attesa di là.
 *
 * Non è una contraddizione, sono i due versi del flusso di cassa: l'azienda
 * paga l'abbonamento **in anticipo** — settembre è già fatturato e incassato al
 * 23 del mese — mentre il professionista è pagato **a consuntivo**, entro il 5
 * del mese successivo, perché il compenso dipende dalle sedute erogate, che a
 * mese aperto non sono ancora tutte. È anche il margine raccontato dal lato
 * della tesoreria: incassiamo prima di pagare.
 */
const INVOICE_COUNT = 4;

export const INVOICES: Invoice[] = Array.from(
  { length: INVOICE_COUNT },
  (_, index) => ({
    month: new Date(
      DEMO_TODAY.getFullYear(),
      DEMO_TODAY.getMonth() - index,
      1,
    ),
    employeeCount: COMPANY.employeeCount,
    unitPriceChf: COMPANY.plan.monthlyPricePerEmployee,
    status: "paid" as const,
  }),
);

/*
 * Le raccomandazioni del report, come chiavi di `it.ts` e non come frasi.
 *
 * Sono una lettura del trimestre, quindi in produzione le sceglierà il backend
 * guardando i dati; qui l'elenco è fisso, ma passa comunque dal dizionario,
 * perché una frase in italiano dentro il dataset è testo cablato quanto una
 * dentro un componente (§2.7).
 */
const RECOMMENDATION_KEYS: HrReport["recommendationKeys"] = [
  "salesWorkshop",
  "checkupPush",
  "coachAwareness",
  "partnerExtension",
];

/** Lo stress medio dell'ultimo mese di un trimestre, se pubblicabile. */
function stressAtEndOf(period: Quarter): number | null {
  const months = COMPANY_MONTHS.filter(
    (entry) => quarterKey(quarterOf(entry.month)) === quarterKey(period),
  );
  return months.length === 0 ? null : months[months.length - 1].score;
}

/*
 * LO STRESS SI CONFRONTA CON IL TRIMESTRE PRECEDENTE, in punti e non in
 * percentuale.
 *
 * La finestra è una scelta e va detta a schermo: il §6.1 citava un −8% che da
 * questa serie non esce, e usciva solo scegliendo la finestra che lo produceva.
 * Qui la finestra è la più corta che abbia senso accanto a un selettore di
 * trimestri, e il numero è quello che ne viene.
 */
function stressTrendFor(period: Quarter): number | null {
  const current = stressAtEndOf(period);
  const previous = stressAtEndOf(addQuarters(period, -1));

  if (current === null || previous === null) return null;
  return current - previous;
}

function toReport(snapshot: RoiSnapshot): HrReport {
  const usage = usageThrough(snapshot.period);

  return {
    period: snapshot.period,
    adoptionPercent: adoptionPercent(COMPANY, snapshot),
    /*
     * I due denominatori sono guardati come fa `adoptionPercent` due righe
     * sopra, e per lo stesso motivo: una divisione per zero stampa "∞%" in una
     * dashboard. Il monte annuo è zero se il piano non dà sedute, gli iscritti
     * di un trimestre lo sono prima che qualcuno attivi l'account — cioè al
     * primo trimestre di un cliente nuovo, che in produzione è il caso
     * ordinario e non un caso di scuola.
     */
    // sessioni consumate sul monte annuo: il 12% del §8, non una percentuale nuova
    usagePercent:
      ANNUAL_SESSION_ALLOWANCE === 0
        ? 0
        : Math.round((snapshot.sessionsUsed / ANNUAL_SESSION_ALLOWANCE) * 100),
    checkupCompletionPercent:
      snapshot.enrolledEmployees === 0
        ? 0
        : Math.round((usage.checkup / snapshot.enrolledEmployees) * 100),
    stressTrendPoints: stressTrendFor(snapshot.period),
    savedChf: snapshot.savedChf,
    avoidedAbsenceDays: snapshot.avoidedAbsenceDays,
    recommendationKeys: RECOMMENDATION_KEYS,
  };
}

export const HR_REPORTS: HrReport[] = ROI_SNAPSHOTS.map(toReport);

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

const departmentIds = new Set(DEPARTMENTS.map((department) => department.id));
for (const entry of EMPLOYEE_DIRECTORY) {
  assertInDev(
    departmentIds.has(entry.departmentId),
    `${entry.initials} è nel reparto "${entry.departmentId}", che non esiste fra i sei del §8.`,
  );
  /*
   * Chi non ha attivato l'account non può avere prenotato un check-up: la
   * colonna resta, il valore no. È il caso che il codice ereditato mostrava con
   * un trattino scritto a mano dentro i dati.
   */
  assertInDev(
    entry.enrolled || entry.checkupStatus === null,
    `${entry.initials} non ha attivato l'account ma ha uno stato di check-up.`,
  );
}

assertInDev(
  new Set(EMPLOYEE_DIRECTORY.map((entry) => entry.initials)).size ===
    EMPLOYEE_DIRECTORY.length,
  "Due dipendenti condividono le iniziali: stesse iniziali deve voler dire stessa persona (§8).",
);

/*
 * L'estratto non può essere più lungo dell'azienda, né dichiarare più iscritti
 * di quanti ne abbia il trimestre corrente.
 */
assertInDev(
  EMPLOYEE_DIRECTORY.length <= COMPANY.employeeCount,
  `L'elenco mostra ${EMPLOYEE_DIRECTORY.length} righe su un organico di ${COMPANY.employeeCount}.`,
);

assertInDev(
  EMPLOYEE_DIRECTORY.filter((entry) => entry.enrolled).length <=
    ROI_SNAPSHOTS[0].enrolledEmployees,
  "L'estratto dell'elenco contiene più iscritti di quanti il trimestre corrente ne dichiari.",
);

/*
 * Le fatture stanno dentro la finestra dei dodici mesi: una fattura più vecchia
 * della serie descriverebbe un periodo su cui la dashboard non sa dire niente.
 */
for (const invoice of INVOICES) {
  assertInDev(
    invoice.month >= HISTORY_MONTHS[0],
    `Una fattura è datata ${invoice.month.toISOString().slice(0, 7)}, prima dell'inizio della finestra dei dodici mesi.`,
  );
}

/*
 * Il report del trimestre corrente deve dire le cifre del §8: se una di queste
 * si muove, si è mosso il dataset sotto e la dashboard lo direbbe in silenzio.
 */
const currentReport = HR_REPORTS[0];
assertInDev(
  currentReport.adoptionPercent === 68,
  `L'adozione del trimestre corrente è ${currentReport.adoptionPercent}%, non il 68% del §8.`,
);
assertInDev(
  currentReport.usagePercent === 12,
  `L'utilizzo del trimestre corrente è ${currentReport.usagePercent}%, non il 12% del §8.`,
);
assertInDev(
  currentReport.savedChf === 14200 && currentReport.avoidedAbsenceDays === 16,
  `Il report del trimestre corrente dice ${currentReport.savedChf} CHF e ${currentReport.avoidedAbsenceDays} giorni, non i 14'200 e i 16 del §8.`,
);
assertInDev(
  currentReport.stressTrendPoints !== null && currentReport.stressTrendPoints < 0,
  `Lo stress del trimestre corrente non è in calo (${currentReport.stressTrendPoints}): contraddice la storia del §8.`,
);

/*
 * Il trimestre più vecchio non ha un precedente dentro la finestra, quindi il
 * suo trend è vuoto e non zero. Il controllo esiste perché è il caso che si
 * perde per primo: basta che qualcuno restituisca 0 "per comodità" e la KPI
 * esce neutra invece che assente.
 */
assertInDev(
  HR_REPORTS[HR_REPORTS.length - 1].stressTrendPoints === null,
  "Il trimestre più vecchio dichiara un trend di stress, ma dentro la finestra non ha un precedente con cui confrontarsi.",
);
