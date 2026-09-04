import { assertInDev } from "../guardrails";
import {
  stressLevelFromScore,
  type DepartmentMonth,
  type EarlyAlert,
  type StressRecord,
} from "../types";
import { DEPARTMENTS } from "./company";
import {
  COMPANY_MONTHS,
  DEPARTMENT_MONTHS,
  HISTORY_MONTHS,
  isPublishable,
  type CompanyMonth,
} from "./measurement";

/*
 * Quello che il provider consegna alle schermate (CLAUDE.md §5).
 *
 * `measurement.ts` tiene il dato grezzo; qui si decide **cosa ne esce**. La
 * soppressione avviene in questo passaggio e non a schermo: un reparto sotto
 * soglia non ha un punteggio nascosto in UI, non ce l'ha proprio nel record che
 * il client riceve. È la stessa ragione per cui il conteggio dei misurati esce
 * sempre, anche sulle righe soppresse — il §8 lo vuole su ogni riga, altrimenti
 * i due reparti da 15 dipendenti sarebbero righe identiche con esiti opposti.
 *
 * Post-funding questo passaggio lo fa il backend. Il punto è che lo faccia
 * qualcuno prima del browser.
 */

function toStressRecord(record: DepartmentMonth): StressRecord {
  if (!isPublishable(record) || record.score === null) {
    return {
      month: record.month,
      departmentId: record.departmentId,
      measuredEmployees: record.measuredEmployees,
      suppressed: true,
    };
  }
  return {
    month: record.month,
    departmentId: record.departmentId,
    measuredEmployees: record.measuredEmployees,
    suppressed: false,
    score: record.score,
    level: stressLevelFromScore(record.score),
  };
}

function toCompanyRecord(month: CompanyMonth): StressRecord {
  if (month.score === null) {
    return {
      month: month.month,
      measuredEmployees: month.measuredEmployees,
      suppressed: true,
    };
  }
  return {
    month: month.month,
    measuredEmployees: month.measuredEmployees,
    suppressed: false,
    score: month.score,
    level: stressLevelFromScore(month.score),
  };
}

/** Dodici mesi per reparto, dal più vecchio al più recente. */
export const DEPARTMENT_STRESS_HISTORY: Record<string, StressRecord[]> =
  Object.fromEntries(
    DEPARTMENTS.map((department) => [
      department.id,
      DEPARTMENT_MONTHS[department.id].map(toStressRecord),
    ]),
  );

/** La serie aziendale, già derivata dai reparti pubblicabili. */
export const COMPANY_STRESS_HISTORY: StressRecord[] =
  COMPANY_MONTHS.map(toCompanyRecord);

/*
 * L'alert precoce non è un valore scritto a mano: si ricava scandendo le serie,
 * così se un giorno i punteggi cambiano il marker sul grafico si sposta da sé
 * invece di restare a indicare un mese qualsiasi (§5.5).
 *
 * Cerca un reparto che entra in fascia "alto" e **ci resta fino all'ultimo
 * rilevamento**: una risalita rientrata da sola non è un allarme, è rumore, e
 * un banner che segnala un reparto già tornato a posto brucia la fiducia nel
 * segnale successivo.
 */
function computeEarlyAlert(): EarlyAlert | null {
  for (const department of DEPARTMENTS) {
    const series = DEPARTMENT_STRESS_HISTORY[department.id] ?? [];

    let streakStart: Date | null = null;
    let streak = 0;

    for (const record of series) {
      if (!record.suppressed && record.level === "high") {
        streak += 1;
        streakStart ??= record.month;
      } else {
        streak = 0;
        streakStart = null;
      }
    }

    if (streakStart !== null && streak > 0) {
      return {
        departmentId: department.id,
        triggeredAt: streakStart,
        consecutiveMonths: streak,
      };
    }
  }
  return null;
}

export const EARLY_ALERT: EarlyAlert | null = computeEarlyAlert();

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

/*
 * Il §8 dice che l'alert scatta al mese 10 e riguarda le Vendite. Se un domani
 * qualcuno ritocca i punteggi e l'alert si sposta, il banner e il marker
 * continuerebbero a funzionare — indicherebbero solo un mese diverso da quello
 * che la storia racconta, e a schermo non se ne accorgerebbe nessuno.
 */
assertInDev(
  EARLY_ALERT !== null,
  "Nessun alert precoce nel dataset: il §8 ne descrive uno sulle Vendite.",
);
assertInDev(
  EARLY_ALERT?.departmentId === "sales",
  `L'alert precoce è sul reparto ${EARLY_ALERT?.departmentId}, non sulle Vendite.`,
);
assertInDev(
  EARLY_ALERT?.triggeredAt.getTime() === HISTORY_MONTHS[9].getTime(),
  "L'alert precoce non scatta al decimo mese come dice il §8.",
);

/*
 * Una riga soppressa che porta un punteggio sarebbe un dato uscito da una porta
 * di servizio. Il tipo lo rende impossibile da scrivere per distrazione, questo
 * lo rende impossibile da costruire per calcolo.
 */
for (const department of DEPARTMENTS) {
  const series = DEPARTMENT_STRESS_HISTORY[department.id];
  assertInDev(
    series.length === HISTORY_MONTHS.length,
    `${department.id}: ${series.length} rilevazioni invece di ${HISTORY_MONTHS.length}.`,
  );
  assertInDev(
    series.every((record) => record.measuredEmployees > 0),
    `${department.id}: una rilevazione senza misurati non è distinguibile da un reparto che non esiste.`,
  );
}

/*
 * LA MEDIA AZIENDALE NON CONTIENE I REPARTI SOPPRESSI, E QUI SI VERIFICA CHE
 * NON LI CONTENGA — non che il codice che la calcola dica di escluderli.
 *
 * È l'invariante da cui dipende la soppressione: finché l'aggregato esclude un
 * reparto da **numeratore e denominatore**, il suo punteggio non si ricava per
 * sottrazione da ciò che il client riceve. Il giorno in cui rientrasse anche
 * solo nel denominatore, i conteggi che la tabella mostra su ogni riga
 * diventerebbero il moltiplicatore che rende l'aritmetica risolvibile
 * (`docs/CONTRATTO-DATI.md` §3).
 *
 * SI CONFRONTANO LE DUE SERIE CHE ESCONO DAL PROVIDER, non la serie contro
 * l'espressione che l'ha prodotta: ricalcolarla da `DEPARTMENT_MONTHS`
 * verificherebbe `buildCompanySeries` contro sé stessa — la trappola che il
 * `docs/CONTRATTO-DATI.md` §3 nomina a proposito della data delle note. Qui il
 * lato destro è fatto dei soli record **pubblicati**, cioè di quello che il
 * client vede: se la media che gli arriva non si ricostruisce da lì, porta
 * dentro qualcosa che lui non ha.
 *
 * Ne discende che questo controllo è anche il primo a rompersi se qualcuno
 * cambia `buildCompanySeries` per includere i soppressi, che è esattamente il
 * modo in cui la falla nascerebbe.
 */
for (const [index, companyRecord] of COMPANY_STRESS_HISTORY.entries()) {
  let weightedSum = 0;
  let weight = 0;

  for (const department of DEPARTMENTS) {
    const record = DEPARTMENT_STRESS_HISTORY[department.id][index];
    if (record === undefined || record.suppressed) continue;
    weightedSum += record.score * record.measuredEmployees;
    weight += record.measuredEmployees;
  }

  const expected = weight === 0 ? null : Math.round(weightedSum / weight);
  const actual = companyRecord.suppressed ? null : companyRecord.score;

  assertInDev(
    actual === expected,
    `La media aziendale del mese ${index + 1} vale ${actual}, mentre i reparti pubblicati ne danno ${expected}: l'aggregato contiene qualcosa che il client non riceve.`,
  );
  assertInDev(
    companyRecord.measuredEmployees === weight,
    `Il denominatore della media aziendale del mese ${index + 1} è ${companyRecord.measuredEmployees}, mentre i reparti pubblicati ne sommano ${weight}: un reparto soppresso pesa su un aggregato da cui è escluso.`,
  );
}
