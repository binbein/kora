import { ROI_MODEL } from "../../roi-model";
import {
  addQuarters,
  quarterKey,
  quarterOf,
  sameQuarter,
  type Quarter,
  type RoiSnapshot,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";

/*
 * ROI per trimestre (CLAUDE.md §6, §8.A).
 *
 * Il §6 fissa un solo trimestre, quello corrente: CHF 14'200 risparmiati,
 * 68% di adozione (82 iscritti, 41 attivi), 142 sessioni consumate.
 *
 * Il §8.A però chiede che il selettore trimestre "cambi davvero i dati",
 * quindi servono anche i trimestri precedenti, che il documento non copre.
 * Invece di scegliere cifre a caso sono derivate da una regola sola e
 * dichiarata: il risparmio è proporzionale ai dipendenti attivi nel
 * trimestre, con il trimestre corrente come riferimento.
 *
 *   CHF per attivo = 14'200 / 41 ≈ 346
 *
 * Così la crescita dell'adozione e quella del risparmio raccontano la stessa
 * cosa, e sostituire questi numeri con quelli veri del business plan è una
 * modifica a questo file soltanto.
 */

const SAVINGS_PER_ACTIVE = 14200 / 41;

/*
 * I GIORNI DI ASSENZA EVITATI SONO UN QUOZIENTE, NON UN DATO A SÉ.
 *
 * Il risparmio diviso il costo di una giornata di assenza — CHF 900, la
 * stessa costante su cui gira il calcolatore della landing (§7). Erano
 * scritti a mano, e le due cifre avevano smesso di parlarsi: 31 giorni su
 * CHF 14'200 implicano CHF 458 al giorno, che non è un numero del business
 * plan. Erano anche troppi, perché 31 giorni valgono un trimestre intero
 * mentre quello corrente è appena cominciato.
 *
 * Derivandoli, il trimestre corrente dà 16 giorni e i precedenti 13, 10 e 7:
 * ogni riga regge la divisione che un investitore può fare a mente.
 */
function avoidedDaysFrom(savedChf: number): number {
  return Math.round(savedChf / ROI_MODEL.costPerAbsenceDay);
}

type QuarterSeed = {
  enrolledEmployees: number;
  activeEmployees: number;
  /** Sessioni consumate a fine trimestre, cumulate sul monte annuale */
  sessionsUsed: number;
};

/*
 * I quattro trimestri, dal più recente al più vecchio: è l'ordine in cui il
 * selettore li mostra.
 *
 * I semi portano solo i valori, non il periodo. Le date erano assolute —
 * 2026 Q3, Q2, Q1, 2025 Q4 — mentre il trimestre corrente si ricava ormai da
 * `DEMO_TODAY`: bastava spostare quella data fuori dal terzo trimestre 2026
 * perché la dashboard aprisse su un periodo senza snapshot, cioè su una
 * schermata vuota. Il §5 promette che quella data è l'unica manopola, e
 * questa è la parte che la promessa richiede.
 */
const SEEDS: QuarterSeed[] = [
  { enrolledEmployees: 82, activeEmployees: 41, sessionsUsed: 142 },
  { enrolledEmployees: 71, activeEmployees: 34, sessionsUsed: 105 },
  { enrolledEmployees: 58, activeEmployees: 27, sessionsUsed: 64 },
  { enrolledEmployees: 39, activeEmployees: 18, sessionsUsed: 28 },
];

/**
 * Monte sessioni annuo dell'azienda: dipendenti per sessioni incluse dal
 * piano (§7). Demo SA ha 120 persone sul piano Plus, che ne dà 10 a testa,
 * quindi 1'200.
 *
 * Era scritto 400, che non discende da nessuna cifra del business plan.
 * Calcolarlo lo tiene agganciato all'organico e al piano: se domani Demo SA
 * passa all'Executive, il monte segue senza che nessuno se ne ricordi.
 */
export const ANNUAL_SESSION_ALLOWANCE =
  COMPANY.employeeCount * COMPANY.plan.sessionsPerYear;

/** Arrotonda alle centinaia: a schermo una cifra al franco sarebbe finta precisione. */
function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

/** Il trimestre in cui cade il giorno della demo. */
export const CURRENT_QUARTER: Quarter = quarterOf(DEMO_TODAY);

/**
 * I periodi dei quattro snapshot: il corrente e i tre che lo precedono.
 * Con `DEMO_TODAY` al 29.07.2026 vengono 2026 Q3, Q2, Q1 e 2025 Q4.
 */
export const QUARTERS: Quarter[] = SEEDS.map((_, index) =>
  addQuarters(CURRENT_QUARTER, -index),
);

/*
 * Rete di sicurezza per chi sposterà la data della demo.
 *
 * Oggi il primo periodo È il trimestre corrente per costruzione, quindi il
 * controllo non può fallire; serve nel caso in cui qualcuno riordini i semi
 * o cambi il modo in cui i periodi si derivano. Un trimestre corrente fuori
 * dall'elenco non darebbe un errore: darebbe una dashboard vuota, che si
 * scopre a schermo e nel momento peggiore. Solo in sviluppo: in produzione
 * il dataset è quello verificato al build.
 */
if (process.env.NODE_ENV === "development") {
  const covered = QUARTERS.some((period) =>
    sameQuarter(period, CURRENT_QUARTER),
  );
  if (!covered) {
    throw new Error(
      `DEMO_TODAY cade in ${quarterKey(CURRENT_QUARTER)}, che non è fra i trimestri del dataset (${QUARTERS.map(quarterKey).join(", ")}): la dashboard aprirebbe su un periodo senza snapshot.`,
    );
  }
}

function toSnapshot(seed: QuarterSeed, index: number): RoiSnapshot {
  // il primo seme è il trimestre corrente, e usa il valore esatto del §6
  const savedChf =
    index === 0
      ? 14200
      : roundToHundreds(seed.activeEmployees * SAVINGS_PER_ACTIVE);

  return {
    period: QUARTERS[index],
    savedChf,
    avoidedAbsenceDays: avoidedDaysFrom(savedChf),
    enrolledEmployees: seed.enrolledEmployees,
    activeEmployees: seed.activeEmployees,
    sessionsUsed: seed.sessionsUsed,
    sessionsTotal: ANNUAL_SESSION_ALLOWANCE,
  };
}

export const ROI_SNAPSHOTS: RoiSnapshot[] = SEEDS.map(toSnapshot);
