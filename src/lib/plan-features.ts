import type { Plan } from "@/lib/data/types";
import { formatCHF, formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Le righe del listino, derivate da `Plan` (CLAUDE.md §10.A).
 *
 * È presentazione e non dominio — come `earnings.ts` e `schedule.ts` — quindi
 * sta qui e non nel provider: quali voci un listino mostra e in che ordine è
 * una decisione della schermata, non del contratto dati.
 *
 * ESISTE PERCHÉ I CHIAMANTI SONO DUE: le card di `/plans` e l'anteprima
 * piani della landing. Elencando le voci a mano in due JSX le due schermate
 * potrebbero dire cose diverse dello stesso piano, ed è già successo — nel
 * codice ereditato la landing dava all'Executive "Coach + psichiatra" e
 * `/plans` "Coach + psichiatra se necessario", mentre il §9 dà un tetto di 6
 * sessioni e lo psichiatra **incluso**.
 *
 * Da qui una card non può divergere dal piano, perché non ha più niente da cui
 * divergere: se una voce sparisce dal §9 sparisce dal tipo, e la riga smette
 * di esistere in tutte e due le schermate insieme.
 *
 * L'assenza di un campo opzionale **salta la riga**, non la nega: un piano che
 * non dichiara il coaching non offre "0 sessioni di coach", semplicemente il
 * contratto commerciale non lo prevede (`docs/CONTRATTO-DATI.md` §2).
 */

export type PlanFeatureKey =
  | "firstSession"
  | "sessions"
  | "intro"
  | "coach"
  | "psychiatrist"
  | "nutritionist"
  | "virtualDoctor"
  | "checkup"
  | "aiPlan"
  | "hrDashboard"
  | "workshops"
  | "family"
  | "partnerExtension"
  | "extraSession";

export type PlanFeature = {
  key: PlanFeatureKey;
  text: string;
};

/**
 * Le voci di un piano, nell'ordine in cui il listino le elenca.
 *
 * L'ordine è quello del `push`: si legge dall'alto come si legge la card, che
 * è più utile di una tabella di priorità da incrociare con un altro elenco.
 */
export function planFeatures(plan: Plan): PlanFeature[] {
  const f = t.public.plans.feature;
  const features: PlanFeature[] = [];

  /*
   * Prima di tutto il resto: è la promessa che risponde alla domanda "e perché
   * non passo dalla LAMal", e vale su tutti e tre i piani (§9). Sta in cima
   * perché è l'accesso, e le righe sotto sono cosa si ottiene una volta dentro.
   */
  features.push({
    key: "firstSession",
    text: interpolate(f.firstSession, {
      hours: formatNumber(plan.firstSessionWithinHours),
    }),
  });

  features.push({
    key: "sessions",
    text: interpolate(f.sessions, {
      count: formatNumber(plan.sessionsPerYear),
    }),
  });

  // una volta sola: senza il tetto si legge come un extra ricorrente (§9)
  if (plan.freeIntroInterview) {
    features.push({ key: "intro", text: f.intro });
  }

  if (plan.coachSessionsPerYear !== undefined) {
    features.push({
      key: "coach",
      text: interpolate(f.coach, {
        count: formatNumber(plan.coachSessionsPerYear),
      }),
    });
  }

  // "incluso" È l'informazione: non è un'opzione a pagamento e non ha un
  // prezzo da mostrare (§9)
  if (plan.includesPsychiatrist) {
    features.push({ key: "psychiatrist", text: f.psychiatrist });
  }

  if (plan.nutritionistSessionsPerYear !== undefined) {
    features.push({
      key: "nutritionist",
      text: interpolate(f.nutritionist, {
        count: formatNumber(plan.nutritionistSessionsPerYear),
      }),
    });
  }

  /*
   * Tutti e tre i piani hanno il medico virtuale, con l'SLA che cambia. Due
   * cose fanno cambiare la frase intera, non un valore dentro la frase:
   *
   * - il tetto di consulti, che esiste solo sull'Essenziale — `"unlimited"` e
   *   un numero sono due promesse commerciali diverse, non un valore speciale;
   * - l'SLA di **un'ora** dell'Executive, che in italiano non è "1 ore".
   *
   * Da qui quattro frasi complete. Comporle concatenando è ciò che il §2.7
   * vieta, e non per pedanteria: in tedesco cambia anche l'ordine.
   */
  const oneHourSla = plan.virtualDoctorSlaHours === 1;
  features.push({
    key: "virtualDoctor",
    text:
      plan.virtualDoctorConsultsPerYear === "unlimited"
        ? oneHourSla
          ? f.virtualDoctorUnlimitedOneHour
          : interpolate(f.virtualDoctorUnlimited, {
              hours: formatNumber(plan.virtualDoctorSlaHours),
            })
        : oneHourSla
          ? interpolate(f.virtualDoctorCappedOneHour, {
              count: formatNumber(plan.virtualDoctorConsultsPerYear),
            })
          : interpolate(f.virtualDoctorCapped, {
              count: formatNumber(plan.virtualDoctorConsultsPerYear),
              hours: formatNumber(plan.virtualDoctorSlaHours),
            }),
  });

  // i due check-up non sono lo stesso check-up (§9): l'Executive è più esteso,
  // e un booleano li mostrerebbe come la stessa riga
  if (plan.checkup !== undefined) {
    features.push({ key: "checkup", text: f.checkup[plan.checkup] });
  }

  if (plan.aiPlanEveryMonths !== undefined) {
    features.push({
      key: "aiPlan",
      text:
        plan.aiPlanEveryMonths === 1
          ? f.aiPlanMonthly
          : interpolate(f.aiPlanEveryMonths, {
              months: formatNumber(plan.aiPlanEveryMonths),
            }),
    });
  }

  /*
   * Senza `if`: dal 08.08.2026 il §9 dichiara una dashboard per tutti e tre i
   * piani, quindi il campo è obbligatorio e la riga c'è sempre. I tre livelli
   * sono tre frasi intere, come i due check-up.
   */
  features.push({
    key: "hrDashboard",
    text: f.hrDashboard[plan.hrDashboard],
  });

  if (plan.liveWorkshopsPerYear !== undefined) {
    features.push({
      key: "workshops",
      text: interpolate(f.workshops, {
        count: formatNumber(plan.liveWorkshopsPerYear),
      }),
    });
  }

  if (plan.includesFamily) {
    features.push({ key: "family", text: f.family });
  }

  // per dipendente al mese: scritto "+ CHF 15/mese" si legge come una tariffa
  // unica per l'azienda, che a 120 dipendenti sbaglia di due ordini di
  // grandezza (§9)
  if (plan.partnerExtensionPerEmployee !== undefined) {
    features.push({
      key: "partnerExtension",
      text: interpolate(f.partnerExtension, {
        price: formatCHF(plan.partnerExtensionPerEmployee),
      }),
    });
  }

  features.push({
    key: "extraSession",
    text: interpolate(f.extraSession, {
      price: formatCHF(plan.extraSessionPrice),
    }),
  });

  return features;
}
