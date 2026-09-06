import { assertInDev } from "../guardrails";
import type { AiHealthPlan, AiPlanArea, HealthArea } from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { LAURA } from "./people";

/*
 * Il piano di prevenzione di Laura (CLAUDE.md §10.B).
 *
 * Cinque aree, quelle di `HealthArea` e nient'altro: nel codice ereditato ce
 * n'era una sesta, "Check-up", con la sua barra di avanzamento allo 0% — cioè un
 * servizio che si prenota travestito da abitudine su cui si progredisce. Ora il
 * check-up sta dove sta, e il piano commenta lo stato di salute.
 *
 * Le percentuali sono quelle della schermata ereditata: sono contenuto della
 * demo, e non se ne inventano di nuove.
 */

/*
 * La cadenza viene dal piano commerciale (§9: il Plus rigenera ogni 6 mesi), non
 * da una costante di questo file. Un piano che non la dichiara non comprende la
 * prevenzione AI, e la demo gira su Plus: il guardrail ferma il caso invece di
 * lasciar passare una data storta.
 */
const CADENCE_MONTHS = COMPANY.plan.aiPlanEveryMonths ?? 0;

assertInDev(
  CADENCE_MONTHS > 0,
  "Il piano di Demo SA non comprende la prevenzione AI: il piano di Laura non dovrebbe esistere.",
);

/*
 * Le due date **si derivano** dall'iscrizione e dalla cadenza, e non si
 * scrivono: la schermata ereditata diceva "Aggiornato: Aprile 2026" su una demo
 * ambientata a settembre, che è quello che succede a una data scritta a mano.
 *
 * Laura si è iscritta a gennaio, quindi il piano si è rigenerato a luglio e il
 * prossimo tocca a gennaio: spostando `DEMO_TODAY` si spostano da sole.
 */
const monthsSinceJoin =
  (DEMO_TODAY.getFullYear() - LAURA.memberSince.getFullYear()) * 12 +
  (DEMO_TODAY.getMonth() - LAURA.memberSince.getMonth());

const cyclesSinceJoin = Math.floor(monthsSinceJoin / CADENCE_MONTHS);

function regenerationAfter(cycles: number): Date {
  return new Date(
    LAURA.memberSince.getFullYear(),
    LAURA.memberSince.getMonth() + cycles * CADENCE_MONTHS,
    LAURA.memberSince.getDate(),
  );
}

/*
 * Le aree, ognuna con l'obiettivo e i suggerimenti. I testi stanno in `it.ts`:
 * qui ci sono le chiavi, perché un valore di dominio non è mai testo da schermo.
 *
 * Nessun suggerimento promette un servizio che il piano non comprende — la
 * schermata ereditata ne aveva uno che rimandava alla nutrizionista, che il §9
 * dà solo all'Executive mentre Demo SA è su Plus. E nessuno ripete un contatore
 * che vive altrove: "hai fatto 1 sessione su 4" scritto qui sarebbe un secondo
 * numero sullo stesso fatto (§5.5).
 */
const AREAS: AiPlanArea[] = [
  {
    area: "sleep",
    goalKey: "sleep_hours",
    progressPercent: 40,
    tipKeys: ["sleep_screens", "sleep_schedule", "sleep_caffeine"],
  },
  {
    area: "stress",
    goalKey: "stress_reduction",
    progressPercent: 35,
    tipKeys: ["stress_breathing", "stress_breaks", "stress_coach"],
  },
  {
    area: "activity",
    goalKey: "activity_weekly",
    progressPercent: 50,
    tipKeys: ["activity_walk", "activity_stairs", "activity_yoga"],
  },
  {
    area: "nutrition",
    goalKey: "nutrition_cholesterol",
    progressPercent: 25,
    tipKeys: ["nutrition_fibre", "nutrition_fats", "nutrition_recheck"],
  },
  {
    area: "mental",
    goalKey: "mental_coaching",
    progressPercent: 50,
    tipKeys: ["mental_continue", "mental_techniques", "mental_journal"],
  },
];

/**
 * Il piano, con l'area più debole in testa.
 *
 * **È una funzione dell'area debole e non una costante** (06.09.2026), ed è la
 * differenza che si vede solo rifacendo l'assessment: l'ordine si derivava dal
 * profilo, ma **una volta sola**, al caricamento del modulo. Da quando le dieci
 * risposte si possono riscrivere (§10.A.6) il profilo cambia a runtime, e un
 * ordine congelato all'avvio avrebbe fatto dire un'area al profilo e un'altra al
 * piano — i due numeri sullo stesso fatto che il §5.5 vieta.
 *
 * `generatedAt` e `nextUpdateAt` **non** si muovono con le risposte: sono la
 * cadenza del piano commerciale, non un effetto dell'assessment.
 */
export function aiHealthPlanFor(weakestArea: HealthArea): AiHealthPlan {
  return {
    id: "ai-plan-laura",
    generatedAt: regenerationAfter(cyclesSinceJoin),
    nextUpdateAt: regenerationAfter(cyclesSinceJoin + 1),
    areas: [
      ...AREAS.filter((entry) => entry.area === weakestArea),
      ...AREAS.filter((entry) => entry.area !== weakestArea),
    ],
  };
}

/** Il piano come lo vede Laura all'avvio, e la base dei guardrail statici. */
export const LAURA_AI_PLAN: AiHealthPlan = aiHealthPlanFor(
  LAURA.healthProfile.weakestArea,
);

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

const ALL_HEALTH_AREAS: HealthArea[] = [
  "sleep",
  "stress",
  "activity",
  "nutrition",
  "mental",
];

const coveredAreas = new Set(LAURA_AI_PLAN.areas.map((entry) => entry.area));

assertInDev(
  coveredAreas.size === LAURA_AI_PLAN.areas.length,
  "Il piano di prevenzione ripete un'area.",
);

assertInDev(
  ALL_HEALTH_AREAS.every((area) => coveredAreas.has(area)),
  "Il piano di prevenzione non copre tutte e cinque le aree di salute.",
);

assertInDev(
  LAURA_AI_PLAN.areas[0].area === LAURA.healthProfile.weakestArea,
  "Il piano non si apre sull'area debole del profilo.",
);

for (const entry of LAURA_AI_PLAN.areas) {
  assertInDev(
    entry.progressPercent >= 0 && entry.progressPercent <= 100,
    `L'area ${entry.area} ha un avanzamento del ${entry.progressPercent}%.`,
  );
  assertInDev(
    entry.tipKeys.length > 0,
    `L'area ${entry.area} non ha nessun suggerimento: a schermo sarebbe un titolo e una barra.`,
  );
}

assertInDev(
  LAURA_AI_PLAN.generatedAt <= DEMO_TODAY,
  "Il piano di prevenzione è stato generato dopo il giorno della demo.",
);

assertInDev(
  LAURA_AI_PLAN.nextUpdateAt > DEMO_TODAY,
  "Il prossimo aggiornamento del piano è già passato: la schermata annuncerebbe una data vecchia.",
);
