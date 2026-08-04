import {
  ANONYMITY_THRESHOLD,
  stressLevelFromScore,
  type EarlyAlert,
  type StressRecord,
} from "../types";
import { DEPARTMENTS } from "./company";
import { DEMO_TODAY } from "./demo-date";

/*
 * La storia dei dodici mesi (CLAUDE.md §6). Deve emergere dai grafici senza
 * che nessuno la racconti:
 *
 *   mesi 1–8   stress aziendale stabile su "medio", in lieve calo;
 *              Vendite in linea con l'azienda
 *   mesi 9–12  Vendite si stacca e sale fino ad "alto"
 *   mese 10    la soglia "alto" viene superata: scatta l'alert precoce
 *
 * I valori dell'ultimo mese sono quelli fissati dal §6: Vendite 78,
 * Operations 52, Finanza 44, IT 31, HR + Legale 26, Direzione sotto soglia.
 * Le dodici serie sono costruite per atterrare esattamente lì.
 */

export const MONTHS_OF_HISTORY = 12;

/** I dodici mesi, dal più vecchio al più recente. */
export const HISTORY_MONTHS: Date[] = Array.from(
  { length: MONTHS_OF_HISTORY },
  (_, index) =>
    new Date(
      DEMO_TODAY.getFullYear(),
      DEMO_TODAY.getMonth() - (MONTHS_OF_HISTORY - 1 - index),
      1,
    ),
);

/*
 * Punteggi mensili per reparto, dal più vecchio al più recente. I valori
 * dell'ultimo mese sono quelli del §6 e non si toccano; il resto della curva
 * è costruito per arrivarci.
 *
 * Quattro reparti su sei migliorano per tutto l'anno, e il ritmo accelera
 * negli ultimi trimestri — cosa che torna con l'adozione, salita da 39 a 82
 * iscritti nello stesso periodo (roi.ts). Le Vendite fanno l'opposto.
 *
 * Le due cose quasi si annullano nella media aziendale, ed è esattamente il
 * punto del pitch: l'aggregato resta piatto, non segnala niente, e solo il
 * dettaglio per reparto fa vedere che le Vendite stanno cedendo. La media
 * NON deve salire, altrimenti racconta il contrario.
 */
const DEPARTMENT_SCORES: Record<string, number[]> = {
  // in linea con l'azienda fino al mese 8, poi la salita
  sales: [54, 53, 53, 52, 51, 51, 50, 50, 58, 68, 73, 78],
  operations: [64, 63, 62, 62, 61, 60, 60, 60, 57, 55, 54, 52],
  finance: [56, 55, 55, 54, 53, 53, 52, 52, 50, 47, 45, 44],
  it: [43, 42, 42, 41, 40, 40, 39, 38, 36, 33, 32, 31],
  "hr-legal": [38, 37, 37, 36, 35, 35, 34, 33, 32, 29, 27, 26],
  // la Direzione risponde sempre sotto soglia: non c'è nessun punteggio
  board: [],
};

function buildSeries(scores: number[], departmentId?: string): StressRecord[] {
  return HISTORY_MONTHS.map((month, index) => {
    const score = scores[index];
    if (score === undefined) {
      return { month, departmentId, suppressed: true };
    }
    return {
      month,
      departmentId,
      suppressed: false,
      score,
      level: stressLevelFromScore(score),
    };
  });
}

export const DEPARTMENT_STRESS_HISTORY: Record<string, StressRecord[]> =
  Object.fromEntries(
    DEPARTMENTS.map((department) => {
      const scores = DEPARTMENT_SCORES[department.id] ?? [];
      const publishable = department.respondents >= ANONYMITY_THRESHOLD;
      return [
        department.id,
        buildSeries(publishable ? scores : [], department.id),
      ];
    }),
  );

/*
 * La serie aziendale è DERIVATA dai reparti, non scritta a mano: media
 * pesata sulle risposte di ogni reparto.
 *
 * Prima era un array a sé e aveva finito per contraddire i reparti da cui
 * avrebbe dovuto nascere — dichiarava 57 all'ultimo mese quando la media vera
 * è 47.9, e nessun reparto tranne le Vendite superava 52. Calcolarla toglie
 * di mezzo la possibilità che le due cose divergano di nuovo.
 *
 * I reparti sotto soglia restano fuori dal calcolo: se il loro punteggio non
 * è pubblicabile, non può nemmeno rientrare da una porta di servizio dentro
 * un aggregato da cui si potrebbe risalire.
 */
function buildCompanySeries(): StressRecord[] {
  return HISTORY_MONTHS.map((month, index) => {
    let weightedSum = 0;
    let weight = 0;

    for (const department of DEPARTMENTS) {
      const record = DEPARTMENT_STRESS_HISTORY[department.id]?.[index];
      if (!record || record.suppressed) continue;
      weightedSum += record.score * department.respondents;
      weight += department.respondents;
    }

    if (weight === 0) return { month, suppressed: true };

    const score = Math.round(weightedSum / weight);
    return {
      month,
      suppressed: false,
      score,
      level: stressLevelFromScore(score),
    };
  });
}

export const COMPANY_STRESS_HISTORY = buildCompanySeries();

/*
 * L'alert precoce non è un valore scritto a mano: viene calcolato dalla serie,
 * così se un giorno i punteggi cambiano il marker sul grafico si sposta da sé
 * invece di restare a indicare un mese qualsiasi.
 */
function computeEarlyAlert(): EarlyAlert | undefined {
  for (const department of DEPARTMENTS) {
    const series = DEPARTMENT_STRESS_HISTORY[department.id] ?? [];

    let streakStart: Date | undefined;
    let streak = 0;

    for (const record of series) {
      const isHigh = !record.suppressed && record.level === "high";
      if (isHigh) {
        streak += 1;
        streakStart ??= record.month;
      } else {
        streak = 0;
        streakStart = undefined;
      }
    }

    if (streakStart && streak > 0) {
      return {
        departmentId: department.id,
        triggeredAt: streakStart,
        consecutiveMonths: streak,
      };
    }
  }
  return undefined;
}

export const EARLY_ALERT = computeEarlyAlert();
