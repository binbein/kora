import { assertInDev } from "../guardrails";
import {
  addQuarters,
  adoptionPercent,
  quarterKey,
  quarterOf,
  type HrReport,
  type Invoice,
  type Quarter,
  type RoiSnapshot,
} from "../types";
import { COMPANY, DEPARTMENTS } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { COMPANY_MONTHS, HISTORY_MONTHS } from "./measurement";
import { ANNUAL_SESSION_ALLOWANCE, ROI_SNAPSHOTS } from "./roi";
import { usageThrough, usageWithin } from "./service-usage";

/*
 * I dati che vivono solo nell'area HR (CLAUDE.md §10.C).
 *
 * Elenco dipendenti, fatture e report trimestrale. Le prime due sono anagrafica
 * di questa demo; il terzo non è un dato ma una vista: ogni sua metrica si
 * ricava dallo snapshot e dalle serie, così la schermata e il PDF di M4 dicono
 * lo stesso numero perché leggono lo stesso dato.
 */

/*
 * Iscritti e check-up di ogni reparto (CLAUDE.md §8, founder 10.09.2026).
 *
 * L'HR VEDE QUANTI, MAI CHI. Fino al 10.09.2026 qui c'era `EMPLOYEE_DIRECTORY`,
 * un estratto di otto righe con iniziali, reparto, iscrizione e stato del
 * check-up di ogni persona: un segnale individuale su un servizio sanitario, e
 * in un reparto da sei persone due iniziali identificano. Non è stato ristretto
 * né mascherato — **è stato sostituito da un conteggio**, che è l'unica forma in
 * cui quella domanda si può rispondere senza rispondere anche a un'altra.
 *
 * SONO CIFRE DEL DATASET, e le loro due somme sono numeri che il resto della
 * demo già dichiara: 82 iscritti e 51 check-up. I guardrail in fondo al file le
 * verificano invece di lasciarle a una promessa (§5.5).
 *
 * `checkupCompleted` È IL VALORE GREZZO: la soppressione sotto soglia la applica
 * il provider, come per lo stress, così qui resta il dato e là resta la regola.
 */
type DepartmentEnrollmentSeed = {
  departmentId: string;
  enrolled: number;
  checkupCompleted: number;
};

export const DEPARTMENT_ENROLLMENT: DepartmentEnrollmentSeed[] = [
  { departmentId: "sales", enrolled: 15, checkupCompleted: 9 },
  { departmentId: "operations", enrolled: 23, checkupCompleted: 15 },
  { departmentId: "finance", enrolled: 13, checkupCompleted: 8 },
  { departmentId: "it", enrolled: 12, checkupCompleted: 8 },
  { departmentId: "hr-legal", enrolled: 12, checkupCompleted: 7 },
  // sette iscritti sotto la soglia di 12: è l'unico reparto soppresso, come
  // nella tabella dello stress e per una strada sua (§8)
  { departmentId: "board", enrolled: 7, checkupCompleted: 4 },
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
    virtualDoctorConsults: usageWithin(snapshot.period).virtual_doctor,
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
for (const row of DEPARTMENT_ENROLLMENT) {
  assertInDev(
    departmentIds.has(row.departmentId),
    `Gli iscritti sono dichiarati per il reparto "${row.departmentId}", che non esiste fra i sei del §8.`,
  );

  const department = DEPARTMENTS.find(({ id }) => id === row.departmentId);
  assertInDev(
    department === undefined || row.enrolled <= department.employeeCount,
    `Il reparto "${row.departmentId}" dichiara ${row.enrolled} iscritti su un organico di ${department?.employeeCount}.`,
  );

  /*
   * Il check-up si prenota dall'account, quindi chi non è iscritto non può
   * averlo fatto: è la stessa cosa che il vecchio estratto diceva riga per riga,
   * detta sul conteggio.
   */
  assertInDev(
    row.checkupCompleted <= row.enrolled,
    `Il reparto "${row.departmentId}" dichiara ${row.checkupCompleted} check-up su ${row.enrolled} iscritti.`,
  );
}

/*
 * LE DUE SOMME SONO NUMERI CHE ALTRE SCHERMATE GIÀ DICHIARANO, e per questo
 * hanno un guardrail: gli iscritti sono quelli dello snapshot del trimestre
 * corrente — la KPI di adozione li conta — e i check-up sono il totale dei
 * dodici mesi della serie di utilizzo, che la KPI mostra come "51 su 82
 * iscritti". Due numeri sullo stesso fatto devono essere lo stesso numero
 * (§5.5).
 */
const enrolledTotal = DEPARTMENT_ENROLLMENT.reduce(
  (total, row) => total + row.enrolled,
  0,
);
assertInDev(
  enrolledTotal === ROI_SNAPSHOTS[0].enrolledEmployees,
  `Gli iscritti per reparto sommano a ${enrolledTotal}, il trimestre corrente ne dichiara ${ROI_SNAPSHOTS[0].enrolledEmployees}.`,
);

const checkupTotal = DEPARTMENT_ENROLLMENT.reduce(
  (total, row) => total + row.checkupCompleted,
  0,
);
assertInDev(
  checkupTotal === usageThrough(ROI_SNAPSHOTS[0].period).checkup,
  `I check-up per reparto sommano a ${checkupTotal}, la serie di utilizzo ne conta ${usageThrough(ROI_SNAPSHOTS[0].period).checkup} sui dodici mesi.`,
);

/*
 * L'UNICITÀ DELLE INIZIALI SI CONTROLLA IN `platform.ts` (16.08.2026).
 *
 * Stava qui e guardava questa lista sola, mentre le persone della demo vivono
 * in tre elenchi: l'estratto, l'agenda della Dr.ssa Meier e gli utenti del
 * back-office. Guardandone uno non poteva vedere la collisione fra la referente
 * HR e la paziente con il percorso più lungo, che è il difetto per cui il §8
 * dice "stesse iniziali, stessa persona".
 *
 * È andato dove i tre elenchi si possono importare senza chiudere un ciclo, non
 * duplicato: due controlli sulla stessa condizione sono due posti in cui
 * sbagliarla (§5.6).
 */

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
