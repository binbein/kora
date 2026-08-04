import type { Company, Department, Plan, PlanId } from "../types";

/*
 * Demo SA e i suoi reparti (CLAUDE.md §6). Nessuna cifra qui è inventata:
 * organico, reparti e piano vengono dal documento.
 *
 * La data in cui la demo è ambientata sta in `demo-date.ts`: la usano cinque
 * moduli del dataset, e non è un dato dell'azienda.
 */

/**
 * I tre piani del §7. La demo usa Plus.
 *
 * Tutti e tre includono il medico virtuale, con tempi di risposta e tetto di
 * consulti diversi: l'Essenziale ne dà tre all'anno con risposta entro 12
 * ore, gli altri due non pongono un tetto. Il listino della landing mostrava
 * l'Essenziale con due voci contro le tre degli altri, e si leggeva come se
 * il medico non fosse compreso.
 */
export const PLANS: Record<PlanId, Plan> = {
  essenziale: {
    id: "essenziale",
    monthlyPricePerEmployee: 38,
    sessionsPerYear: 6,
    extraSessionPrice: 35,
    virtualDoctorSlaHours: 12,
    virtualDoctorConsultsPerYear: 3,
  },
  plus: {
    id: "plus",
    monthlyPricePerEmployee: 55,
    sessionsPerYear: 10,
    extraSessionPrice: 28,
    virtualDoctorSlaHours: 4,
    virtualDoctorConsultsPerYear: "unlimited",
  },
  executive: {
    id: "executive",
    monthlyPricePerEmployee: 82,
    sessionsPerYear: 16,
    extraSessionPrice: 22,
    virtualDoctorSlaHours: 1,
    virtualDoctorConsultsPerYear: "unlimited",
  },
};

/**
 * I piani nell'ordine in cui la landing li mostra, dal più economico al più
 * completo. È un elenco esplicito e non `Object.values(PLANS)`: l'ordine con
 * cui si presenta un listino è una scelta, non l'ordine di scrittura di un
 * oggetto.
 */
export const PLAN_LIST: Plan[] = [
  PLANS.essenziale,
  PLANS.plus,
  PLANS.executive,
];

export const COMPANY: Company = {
  id: "demo-sa",
  name: "Demo SA",
  city: "Lugano",
  employeeCount: 120,
  plan: PLANS.plus,
};

/*
 * `respondents` sono le persone che hanno risposto al questionario mensile,
 * ed è questo numero a decidere se il dato del reparto è pubblicabile.
 *
 * Non coincide con gli iscritti alla piattaforma (82, §6): il questionario di
 * benessere va a tutta l'azienda, l'iscrizione serve invece a prenotare le
 * sessioni. Sono due cose diverse e vanno tenute separate.
 *
 * È anche l'unico modo di rendere coerente il §6: HR + Legale e Direzione
 * hanno entrambi 15 dipendenti, ma solo la Direzione risulta sotto soglia.
 */
export const DEPARTMENTS: Department[] = [
  { id: "sales", name: "Vendite", employeeCount: 24, respondents: 18 },
  { id: "operations", name: "Operations", employeeCount: 31, respondents: 23 },
  { id: "finance", name: "Finanza", employeeCount: 18, respondents: 15 },
  { id: "it", name: "IT", employeeCount: 17, respondents: 15 },
  { id: "hr-legal", name: "HR + Legale", employeeCount: 15, respondents: 15 },
  { id: "board", name: "Direzione", employeeCount: 15, respondents: 11 },
];
