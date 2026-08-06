import { assertInDev } from "../guardrails";
import type { DepartmentMonth } from "../types";
import { COMPANY, DEPARTMENTS } from "./company";
import { DEMO_TODAY } from "./demo-date";

/*
 * La misurazione dello stress, mese per mese e reparto per reparto
 * (CLAUDE.md §8).
 *
 * Due matrici e nient'altro scritto a mano: quante persone del reparto hanno
 * risposto al check rapido, e che punteggio ne è uscito. Tutto il resto — la
 * pubblicabilità, la serie aziendale, l'alert precoce, le percentuali di
 * adesione — si deriva da qui (§5.5).
 *
 * La storia che deve emergere dai grafici senza che nessuno la racconti:
 *
 *   mesi 1–8   stress aziendale stabile su "medio", in lieve calo;
 *              Vendite in linea con l'azienda
 *   mesi 9–12  Vendite si stacca e sale fino ad "alto"
 *   mese 10    la soglia "alto" viene superata: scatta l'alert precoce
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
 * Quante persone di ogni reparto hanno risposto al check rapido, mese per mese.
 *
 * È il conteggio che decide se il dato è pubblicabile e che pesa la media
 * aziendale, e sta qui e non sull'anagrafica proprio perché si muove: quattro
 * reparti su sei crescono con l'adozione, la Direzione resta sempre sotto
 * soglia, e le **Vendite calano dal mese 9** — un reparto sotto pressione è il
 * primo a smettere di rispondere, ed è anche il motivo per cui l'aggregato non
 * si accorge di niente.
 *
 * L'adesione alta di HR + Legale (12–14 su 15) non è una scelta di gusto: con
 * l'organico a 15 e la soglia a 12, qualunque valore pubblicabile è sopra
 * l'80%. È il margine stretto che il §8 accetta scendendo da 15 a 12.
 */
const MEASURED: Record<string, number[]> = {
  sales: [18, 18, 19, 19, 19, 20, 20, 20, 18, 16, 14, 13],
  operations: [20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26],
  finance: [13, 13, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16],
  it: [12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15],
  "hr-legal": [12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 14],
  board: [8, 8, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11],
};

/*
 * Punteggi mensili per reparto, dal più vecchio al più recente. I valori
 * dell'ultimo mese sono quelli del §8 e non si toccano — Vendite 78, Operations
 * 52, Finanza 44, IT 31, HR + Legale 26 — e il resto della curva è costruito
 * per arrivarci.
 *
 * Quattro reparti su cinque migliorano per tutto l'anno e il ritmo accelera
 * negli ultimi trimestri, cosa che torna con l'adozione salita da 39 a 82
 * iscritti nello stesso periodo (§9). Le Vendite fanno l'opposto.
 *
 * Le due cose quasi si annullano nella media aziendale, ed è esattamente il
 * punto del pitch: l'aggregato resta piatto e non segnala niente, solo il
 * dettaglio per reparto fa vedere che le Vendite stanno cedendo.
 *
 * La Direzione non ha punteggi: sta sotto soglia in tutti e dodici i mesi, e
 * non si inventa un dato per un reparto che non si può misurare.
 */
const SCORES: Record<string, number[] | null> = {
  sales: [54, 53, 53, 52, 51, 51, 50, 50, 58, 68, 73, 78],
  operations: [64, 63, 62, 62, 61, 60, 60, 60, 57, 55, 54, 52],
  finance: [56, 55, 55, 54, 53, 53, 52, 52, 50, 47, 45, 44],
  it: [43, 42, 42, 41, 40, 40, 39, 38, 36, 33, 32, 31],
  "hr-legal": [38, 37, 37, 36, 35, 35, 34, 33, 32, 29, 27, 26],
  board: null,
};

/** I record grezzi di ogni reparto, dal mese più vecchio al più recente. */
export const DEPARTMENT_MONTHS: Record<string, DepartmentMonth[]> =
  Object.fromEntries(
    DEPARTMENTS.map((department) => [
      department.id,
      HISTORY_MONTHS.map((month, index) => ({
        departmentId: department.id,
        month,
        measuredEmployees: MEASURED[department.id][index],
        score: SCORES[department.id]?.[index] ?? null,
      })),
    ]),
  );

/** Un reparto è pubblicabile nel mese in cui ha misurato abbastanza persone. */
export function isPublishable(record: DepartmentMonth): boolean {
  return record.measuredEmployees >= COMPANY.anonymityThreshold;
}

export type CompanyMonth = {
  month: Date;
  /** Somma dei misurati dei soli reparti pubblicabili: il denominatore */
  measuredEmployees: number;
  /** `null` se in quel mese nessun reparto era pubblicabile */
  score: number | null;
};

/*
 * La serie aziendale è DERIVATA dai reparti, mai scritta a mano: media dei
 * punteggi pesata sui dipendenti misurati.
 *
 * I reparti sotto soglia restano fuori dal calcolo e quindi anche dal
 * denominatore: se il loro punteggio non è pubblicabile non può rientrare da
 * una porta di servizio dentro un aggregato da cui si potrebbe risalire. È
 * anche la ragione per cui "reparti in calo su N" conta i soli pubblicabili.
 */
function buildCompanySeries(): CompanyMonth[] {
  return HISTORY_MONTHS.map((month, index) => {
    let weightedSum = 0;
    let weight = 0;

    for (const department of DEPARTMENTS) {
      const record = DEPARTMENT_MONTHS[department.id][index];
      if (!isPublishable(record) || record.score === null) continue;
      weightedSum += record.score * record.measuredEmployees;
      weight += record.measuredEmployees;
    }

    return {
      month,
      measuredEmployees: weight,
      score: weight === 0 ? null : Math.round(weightedSum / weight),
    };
  });
}

export const COMPANY_MONTHS: CompanyMonth[] = buildCompanySeries();

// ---------------------------------------------------------------------------
// Guardrail (§5.6): i vincoli del §8, verificati alla costruzione del dataset
// ---------------------------------------------------------------------------

assertInDev(
  DEMO_TODAY.getDay() !== 0 && DEMO_TODAY.getDay() !== 6,
  "DEMO_TODAY cade nel fine settimana: la colonna \"oggi\" del calendario del professionista sarebbe vuota.",
);

for (const department of DEPARTMENTS) {
  const records = DEPARTMENT_MONTHS[department.id];

  for (const record of records) {
    assertInDev(
      record.measuredEmployees <= department.employeeCount,
      `${department.id}: ${record.measuredEmployees} misurati su un organico di ${department.employeeCount}.`,
    );
    // il punteggio è nullo esattamente quando il reparto è sotto soglia: senza
    // questo, un reparto pubblicabile senza punteggio sparirebbe in silenzio
    // dalla media invece di far fallire il dataset
    assertInDev(
      isPublishable(record) === (record.score !== null),
      `${department.id}: pubblicabilità e punteggio non concordano (misurati ${record.measuredEmployees}, punteggio ${record.score}).`,
    );
  }

  const alwaysBelow = records.every((record) => !isPublishable(record));
  const alwaysAbove = records.every((record) => isPublishable(record));
  assertInDev(
    department.id === "board" ? alwaysBelow : alwaysAbove,
    department.id === "board"
      ? "La Direzione deve restare sotto soglia in tutti e dodici i mesi."
      : `${department.id} deve restare sopra soglia in tutti e dodici i mesi.`,
  );
}

/*
 * L'adesione delle Vendite cala fra il mese 9 e il 12. È il vincolo per cui il
 * conteggio vive sul record mensile invece che sull'anagrafica: senza, la
 * curva aziendale sarebbe pesata su un'adesione che non si muove mai.
 */
const salesMeasured = DEPARTMENT_MONTHS.sales.map((r) => r.measuredEmployees);
assertInDev(
  salesMeasured
    .slice(8)
    .every((value, index, tail) => index === 0 || value < tail[index - 1]),
  `L'adesione delle Vendite non cala fra il mese 9 e il 12: ${salesMeasured.slice(8).join(", ")}.`,
);

/*
 * LA PROPRIETÀ PIÙ IMPORTANTE DEL DATASET: la serie aziendale non cresce mai.
 *
 * "Non sale sopra il primo mese" non basterebbe — una curva che scende fino al
 * mese 8 e poi risale lo passerebbe, e salirebbe esattamente nella finestra in
 * cui il §8 dice che non deve, cioè quella in cui le Vendite si staccano. Se la
 * media aziendale sale, contraddice la narrazione, che è "la media non mostrava
 * nulla, il dettaglio per reparto sì".
 */
for (let index = 1; index < COMPANY_MONTHS.length; index += 1) {
  const previous = COMPANY_MONTHS[index - 1].score;
  const current = COMPANY_MONTHS[index].score;
  assertInDev(
    previous === null || current === null || current <= previous,
    `La serie aziendale cresce al mese ${index + 1}: ${previous} → ${current}.`,
  );
}

const firstScore = COMPANY_MONTHS[0].score;
const lastScore = COMPANY_MONTHS[COMPANY_MONTHS.length - 1].score;
assertInDev(
  firstScore !== null && lastScore !== null && lastScore < firstScore,
  `La serie aziendale non è in calo sui dodici mesi: ${firstScore} → ${lastScore}.`,
);
