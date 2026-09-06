import type {
  AssessmentAnswers,
  AssessmentQuestionId,
  HealthArea,
  HealthProfile,
} from "@/lib/data/types";

/*
 * La formula del profilo salute (CLAUDE.md §8).
 *
 * Sta in `lib/` e non in `lib/data/mock/` perché **non è dataset**: è il calcolo
 * che trasforma dieci risposte in un punteggio, e le risposte sono il dato. Il
 * giorno in cui `mock/` si cancella (§5.7) questo file non si tocca — anche se
 * il calcolo passerà al backend, che è dove appartiene: è lui a decidere cosa
 * una persona legge di sé (`docs/CONTRATTO-DATI.md` §3).
 *
 * LE CINQUE AREE HANNO UN ORDINE, E L'ORDINE È UNA REGOLA. A parità di punteggio
 * minimo vince la prima di questo elenco: senza, l'area debole dipenderebbe
 * dall'ordine in cui il codice percorre una mappa, che qualcuno può cambiare
 * senza sapere di aver cambiato un numero a schermo. È scritto nel §8 accanto
 * alla formula, e questa costante è quel testo eseguito.
 */
export const HEALTH_AREAS: HealthArea[] = [
  "sleep",
  "stress",
  "activity",
  "nutrition",
  "mental",
];

/*
 * Le due domande di ogni area, nell'ordine in cui la schermata le pone.
 *
 * L'appartenenza si legge dall'id — `sleep_1` è del sonno — quindi questa
 * costante **deriva** dalle aree invece di ripeterle: una seconda tabella
 * "domanda → area" sarebbe il secondo elenco che diverge dal primo (§5.5).
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestionId[] = HEALTH_AREAS.flatMap(
  (area) => [`${area}_1`, `${area}_2`] as AssessmentQuestionId[],
);

/** Le due risposte di un'area, nell'ordine delle domande. */
function answersOf(
  answers: AssessmentAnswers,
  area: HealthArea,
): number[] {
  return [answers[`${area}_1`], answers[`${area}_2`]];
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Il punteggio 0–100 di un'area: media delle sue due risposte × 20 (§8). */
export function areaScore(
  answers: AssessmentAnswers,
  area: HealthArea,
): number {
  return average(answersOf(answers, area)) * 20;
}

/**
 * Il profilo salute che esce da dieci risposte (§8).
 *
 * Il totale **non è la media dei cinque punteggi di area**, ed è una differenza
 * che qui non si vede: le aree hanno due domande ciascuna, quindi i due conti
 * coincidono. Resta la media delle dieci perché è così che il §8 la scrive, e il
 * giorno in cui un'area avesse tre domande i due conti si separerebbero.
 */
export function healthProfileOf(answers: AssessmentAnswers): HealthProfile {
  const score = Math.round(
    average(ASSESSMENT_QUESTIONS.map((id) => answers[id])) * 20,
  );

  /*
   * `reduce` e non un `sort`: ordinare per punteggio mette la regola del
   * pareggio nelle mani della stabilità dell'algoritmo, che è una proprietà del
   * motore e non una decisione nostra. Qui il `<` stretto tiene la prima area
   * dell'elenco a parità di punteggio, ed è esattamente la regola del §8.
   */
  const weakestArea = HEALTH_AREAS.reduce((weakest, area) =>
    areaScore(answers, area) < areaScore(answers, weakest) ? area : weakest,
  );

  return {
    score,
    summaryKey: score >= 70 ? "balanced" : score >= 50 ? "attention" : "at_risk",
    weakestArea,
  };
}
