/*
 * Modello del calcolatore ROI della landing (CLAUDE.md §9, §10.A.2).
 *
 * Non sta in `lib/data/` di proposito: quello è il layer che un giorno verrà
 * sostituito da una API, mentre queste formule sono il modello economico del
 * business plan e restano tali. Il prezzo però non lo decide questo file: lo
 * riceve, così KORA ha una sola fonte per quella cifra in tutta l'applicazione.
 * Da M2 il chiamante lo prende dal provider — `plan.monthlyPricePerEmployee` —
 * e questo file non cambia.
 *
 * PUNTO DI CONTROLLO — a 100 dipendenti il risultato deve coincidere con il
 * business plan alla cifra:
 *
 *   perdite  CHF 1'289'500 · risparmio CHF 221'150 · costo KORA CHF 66'000
 *   netto    CHF   155'150 · ROI 2.35:1
 *
 * È il primo confronto che farà un investitore col documento in mano, quindi
 * qualunque modifica a queste costanti va verificata contro quei cinque
 * numeri prima di essere committata.
 *
 * Due cose che il §9 non dice esplicitamente e che sono state ricavate:
 *
 * 1. IL ROI È IL NETTO SUL COSTO, non il risparmio lordo sul costo.
 *    155'150 / 66'000 = 2.35, mentre 221'150 / 66'000 darebbe 3.35. Il §9
 *    fissa 2.35:1, quindi il rapporto è "quanto resta in tasca per ogni
 *    franco speso". Da non confondere con il 19.5:1 dell'executive summary,
 *    che è un terzo rapporto ancora (perdite totali su costo, 1'289'500 /
 *    66'000): non va usato da nessuna parte in questa schermata, perché
 *    mescolare due definizioni di ROI indebolisce quella buona.
 *
 * 2. LA "STIMA SOSTITUZIONE" DEL TURNOVER VALE CHF 470 PER DIPENDENTE.
 *    Il §9 la nomina nella formula senza quantificarla. L'unico ancoraggio
 *    disponibile è il totale del business plan, da cui si ricava per
 *    differenza:
 *
 *      perdita per dipendente   1'289'500 / 100          = 12'895
 *      meno assenteismo                                  =  5'850
 *      meno presenteismo                                 =  1'500
 *      meno burnout                                      =  2'925
 *      → turnover per dipendente                            2'620
 *      di cui quota diretta     0.043 × 50'000           =  2'150
 *      → stima sostituzione                                   470
 *
 *    (≈ CHF 10'930 per uscita, a un turnover del 4.3%.) Il giorno in cui
 *    arriva la cifra vera dal business plan si sostituisce qui e basta.
 *
 * Conseguenza da tenere presente disegnando la schermata: ogni voce è
 * lineare nel numero di dipendenti, quindi gli importi crescono con N ma il
 * rapporto 2.35:1 resta identico da 20 a 1000. Il ROI è una proprietà del
 * modello, non del numero digitato, e la UI non deve suggerire il contrario.
 */

/** Intervallo di dipendenti coperto dal calcolatore (§10.A.2). */
export const EMPLOYEE_RANGE = { min: 20, max: 1000, step: 10 } as const;

/** Valore all'apertura: 100, così il confronto col business plan è immediato. */
export const DEFAULT_EMPLOYEES = 100;

/** Tutte le costanti del §9. Non se ne aggiungono e non se ne inventano. */
export const ROI_MODEL = {
  /* perdite */
  absenceDaysPerEmployee: 6.5,
  costPerAbsenceDay: 900,
  presenteeismPerEmployee: 1500,
  burnoutRiskShare: 0.3,
  averageSalary: 65000,
  burnoutProductivityLoss: 0.15,
  turnoverRate: 0.043,
  turnoverCostPerLeaver: 50000,
  replacementPerEmployee: 470,

  /* risparmio, scenario conservativo */
  savingRateAbsence: 0.15,
  savingRateBurnout: 0.2,
} as const;

export type RoiLossId = "absenteeism" | "presenteeism" | "burnout" | "turnover";

export type RoiLoss = {
  id: RoiLossId;
  /** CHF all'anno, già arrotondati al franco */
  chf: number;
};

export type RoiEstimate = {
  /** Dipendenti effettivamente usati nel calcolo, dopo il clamp */
  employees: number;
  /** Le quattro voci, nell'ordine in cui la schermata le elenca */
  losses: RoiLoss[];
  totalLossesChf: number;
  savingsChf: number;
  koraCostChf: number;
  netSavingsChf: number;
  /** Risparmio netto per franco investito: 2.35 → "2.35:1" */
  roiRatio: number;
};

/** Perdita annua per dipendente, voce per voce. */
const PER_EMPLOYEE: Record<RoiLossId, number> = {
  absenteeism: ROI_MODEL.absenceDaysPerEmployee * ROI_MODEL.costPerAbsenceDay,
  presenteeism: ROI_MODEL.presenteeismPerEmployee,
  burnout:
    ROI_MODEL.burnoutRiskShare *
    ROI_MODEL.averageSalary *
    ROI_MODEL.burnoutProductivityLoss,
  turnover:
    ROI_MODEL.turnoverRate * ROI_MODEL.turnoverCostPerLeaver +
    ROI_MODEL.replacementPerEmployee,
};

/** Quanto KORA riduce ogni voce nello scenario conservativo del §9. */
const SAVING_RATE: Record<RoiLossId, number> = {
  absenteeism: ROI_MODEL.savingRateAbsence,
  presenteeism: ROI_MODEL.savingRateAbsence,
  burnout: ROI_MODEL.savingRateBurnout,
  turnover: ROI_MODEL.savingRateBurnout,
};

const LOSS_ORDER: RoiLossId[] = [
  "absenteeism",
  "presenteeism",
  "burnout",
  "turnover",
];

/**
 * Arrotonda al centinaio.
 *
 * Fa parte della regola del §9, non è un dettaglio di formattazione: una cifra
 * al franco su un risparmio **stimato** è finta precisione, e senza
 * l'arrotondamento gli importi trimestrali della dashboard non sono nemmeno
 * riproducibili. Sta qui perché la regola è del modello economico e i suoi due
 * chiamanti stanno da due parti diverse — il risparmio per dipendente del
 * calcolatore e il risparmio trimestrale del dataset.
 */
export function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

/**
 * Riporta un numero di dipendenti dentro l'intervallo ammesso. Un campo di
 * testo accetta qualunque cosa, il modello no.
 */
export function clampEmployees(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_EMPLOYEES;
  const whole = Math.round(value);
  if (whole < EMPLOYEE_RANGE.min) return EMPLOYEE_RANGE.min;
  if (whole > EMPLOYEE_RANGE.max) return EMPLOYEE_RANGE.max;
  return whole;
}

export function computeRoi(
  employees: number,
  monthlyPricePerEmployee: number,
): RoiEstimate {
  const count = clampEmployees(employees);

  /*
   * Ogni voce viene arrotondata al franco prima di essere sommata, e il
   * totale è la somma delle voci arrotondate: chi somma a mano le quattro
   * righe che vede a schermo deve ottenere il totale che vede a schermo.
   */
  const losses: RoiLoss[] = LOSS_ORDER.map((id) => ({
    id,
    chf: Math.round(PER_EMPLOYEE[id] * count),
  }));

  const totalLossesChf = losses.reduce((sum, loss) => sum + loss.chf, 0);

  /* Il risparmio parte dalle voci già arrotondate, per la stessa ragione. */
  const savingsChf = Math.round(
    losses.reduce((sum, loss) => sum + loss.chf * SAVING_RATE[loss.id], 0),
  );

  const koraCostChf = count * monthlyPricePerEmployee * 12;
  const netSavingsChf = savingsChf - koraCostChf;

  return {
    employees: count,
    losses,
    totalLossesChf,
    savingsChf,
    koraCostChf,
    netSavingsChf,
    roiRatio: koraCostChf === 0 ? 0 : netSavingsChf / koraCostChf,
  };
}
