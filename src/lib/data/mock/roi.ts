import { ROI_MODEL } from "../../roi-model";
import { assertInDev } from "../guardrails";
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
import { sessionsUsedThrough } from "./service-usage";

/*
 * ROI per trimestre (CLAUDE.md §9, "Trimestri diversi da quello corrente").
 *
 * I semi sono le persone, non il denaro. Un importo arrotondato non si inverte:
 * risalire agli attivi da CHF 11'800 darebbe 34.07 persone, cioè la cifra
 * scritta a mano *e* la persona finta. Si parte dai conteggi e si scende verso
 * gli importi, mai il contrario.
 */

type QuarterSeed = {
  enrolledEmployees: number;
  activeEmployees: number;
};

/*
 * I quattro trimestri, dal più recente al più vecchio: è l'ordine in cui il
 * selettore li mostra.
 *
 * I semi portano solo i valori, non il periodo: i trimestri si contano a
 * ritroso da `DEMO_TODAY`. Con le date assolute bastava spostare il giorno
 * della demo fuori dal trimestre di quei semi perché la dashboard aprisse su un
 * periodo senza snapshot, cioè su una schermata vuota — e il §5.4 promette che
 * quella data è l'unica manopola.
 *
 * LE SESSIONI NON SONO PIÙ UN SEME: si sommano dalla serie di utilizzo dei
 * servizi (`service-usage.ts`), cumulate dall'inizio della finestra alla fine
 * del trimestre. Erano quattro numeri scelti prima che l'agenda della Dr.ssa
 * Meier esistesse, e non la contenevano: la sola Meier eroga più sedute nel
 * trimestre corrente di quante quei semi ne attribuissero all'azienda intera.
 * Derivarle è ciò che rende impossibile riaprire quella distanza (§5.5).
 *
 * Restano **cumulate sui dodici mesi**, non consumate nel trimestre: il monte
 * di 1'200 è annuo, e "142 su 1'200" confronta due grandezze solo se coprono lo
 * stesso periodo.
 */
const SEEDS: QuarterSeed[] = [
  { enrolledEmployees: 82, activeEmployees: 41 },
  { enrolledEmployees: 71, activeEmployees: 34 },
  { enrolledEmployees: 58, activeEmployees: 27 },
  { enrolledEmployees: 39, activeEmployees: 18 },
];

/** CHF risparmiati per dipendente attivo, ancorati al trimestre corrente (§9). */
const SAVINGS_PER_ACTIVE = 14200 / 41;

/**
 * Monte sessioni annuo dell'azienda: organico per sessioni incluse dal piano.
 * Demo SA ha 120 persone sul Plus, che ne dà 10 a testa, quindi 1'200.
 *
 * Calcolarlo lo tiene agganciato all'organico e al piano: se domani Demo SA
 * passa all'Executive, il monte segue senza che nessuno se ne ricordi.
 */
export const ANNUAL_SESSION_ALLOWANCE =
  COMPANY.employeeCount * COMPANY.plan.sessionsPerYear;

/**
 * Arrotonda al centinaio.
 *
 * Fa parte della regola del §9, non è un dettaglio di formattazione: senza,
 * gli importi dei tre trimestri precedenti non sono riproducibili, e una cifra
 * al franco su un risparmio stimato è finta precisione.
 */
function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

/*
 * I GIORNI DI ASSENZA EVITATI SONO UN QUOZIENTE, NON UN DATO A SÉ: il risparmio
 * diviso il costo di una giornata di assenza, CHF 900, la stessa costante su
 * cui gira il calcolatore della landing (§8, §9). Ogni riga regge la divisione
 * che un investitore può fare a mente.
 */
function avoidedDaysFrom(savedChf: number): number {
  return Math.round(savedChf / ROI_MODEL.costPerAbsenceDay);
}

/** Il trimestre in cui cade il giorno della demo. */
export const CURRENT_QUARTER: Quarter = quarterOf(DEMO_TODAY);

/** I periodi dei quattro snapshot: il corrente e i tre che lo precedono. */
export const QUARTERS: Quarter[] = SEEDS.map((_, index) =>
  addQuarters(CURRENT_QUARTER, -index),
);

function toSnapshot(seed: QuarterSeed, index: number): RoiSnapshot {
  // il primo seme è il trimestre corrente e non passa dal calcolo: usa i
  // CHF 14'200 esatti del §8, che sono l'ancoraggio di tutti gli altri
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
    sessionsUsed: sessionsUsedThrough(QUARTERS[index]),
    sessionsTotal: ANNUAL_SESSION_ALLOWANCE,
  };
}

export const ROI_SNAPSHOTS: RoiSnapshot[] = SEEDS.map(toSnapshot);

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

/*
 * Rete di sicurezza per chi sposterà il giorno della demo. Oggi il primo
 * periodo È il trimestre corrente per costruzione, quindi il controllo non può
 * fallire; serve nel caso in cui qualcuno riordini i semi o cambi il modo in cui
 * i periodi si derivano. Un trimestre corrente fuori dall'elenco non darebbe un
 * errore: darebbe una dashboard vuota, che si scopre a schermo e nel momento
 * peggiore.
 */
assertInDev(
  QUARTERS.some((period) => sameQuarter(period, CURRENT_QUARTER)),
  `DEMO_TODAY cade in ${quarterKey(CURRENT_QUARTER)}, che non è fra i trimestri del dataset (${QUARTERS.map(quarterKey).join(", ")}): la dashboard aprirebbe su un periodo senza snapshot.`,
);

assertInDev(
  new Set(QUARTERS.map(quarterKey)).size === QUARTERS.length,
  `Due snapshot condividono lo stesso periodo: ${QUARTERS.map(quarterKey).join(", ")}.`,
);

/*
 * Le sessioni sono cumulate, quindi devono crescere andando verso il presente.
 * Se un giorno qualcuno le rileggesse come consumo del singolo trimestre e
 * riscrivesse i semi di conseguenza, la KPI "142 su 1'200" tornerebbe a
 * confrontare un trimestre con un anno senza che nulla si rompa a schermo.
 */
for (let index = 1; index < ROI_SNAPSHOTS.length; index += 1) {
  assertInDev(
    ROI_SNAPSHOTS[index].sessionsUsed < ROI_SNAPSHOTS[index - 1].sessionsUsed,
    `Le sessioni cumulate non crescono verso il presente: ${ROI_SNAPSHOTS.map((s) => s.sessionsUsed).join(", ")}.`,
  );
  assertInDev(
    ROI_SNAPSHOTS[index].enrolledEmployees <
      ROI_SNAPSHOTS[index - 1].enrolledEmployees,
    `Gli iscritti non crescono verso il presente: ${ROI_SNAPSHOTS.map((s) => s.enrolledEmployees).join(", ")}.`,
  );
}

assertInDev(
  ROI_SNAPSHOTS.every(
    (snapshot) => snapshot.sessionsUsed <= ANNUAL_SESSION_ALLOWANCE,
  ),
  `Un trimestre consuma più sessioni del monte annuo di ${ANNUAL_SESSION_ALLOWANCE}.`,
);

assertInDev(
  ROI_SNAPSHOTS.every(
    (snapshot) => snapshot.enrolledEmployees <= COMPANY.employeeCount,
  ),
  `Un trimestre dichiara più iscritti dell'organico di ${COMPANY.employeeCount}.`,
);
