import { assertInDevOutsidePromise } from "./data/guardrails";
import type { ClientCompany, Plan, PlatformMonth } from "./data/types";

/*
 * Le grandezze del back-office che si **derivano** dal portafoglio clienti
 * (CLAUDE.md §5.5, §10.E).
 *
 * Stanno qui e non in `lib/data/mock/`, dove sono nate, per una ragione
 * eseguibile: `mock/` non lo può importare nessuno fuori dal layer dati — è la
 * regola di lint che tiene in piedi il seam del §5.7 — quindi finché vivevano
 * lì le schermate non potevano che riscriverle. E le riscrivevano: due divisioni
 * ripetute nell'analytics, una moltiplicazione reimplementata nell'elenco
 * aziende, l'ultimo mese ricalcolato in pagina.
 *
 * Stanno qui e non nel provider perché non sono dati: sono conti sui dati, e il
 * `docs/CONTRATTO-DATI.md` §3 lo dice del più importante — «il tasso di
 * attivazione non è un campo». È lo stesso posto e la stessa ragione di
 * `earnings.ts` e `schedule.ts`.
 *
 * Il giorno in cui `mock/` si cancella, questo file non si tocca.
 */

/**
 * Ricavo annuo di un cliente: organico × prezzo del piano × 12.
 *
 * I piani arrivano da fuori perché in produzione li porta il provider, non una
 * tabella importabile: la schermata li ha già da `usePlans()`.
 *
 * **Lancia se il piano non esiste**, invece di restituire zero. Un ricavo di
 * CHF 0 su un cliente attivo si legge come un cliente che non fattura — cioè
 * come un dato, non come un difetto — ed è lo stesso ragionamento di
 * `requireProfessional`: un invariante rotto deve farsi sentire, non
 * mimetizzarsi. L'assert lo rende visibile in sviluppo, dove un throw dentro
 * un render React verrebbe inghiottito.
 */
export function annualRevenueOf(
  company: ClientCompany,
  plans: Plan[],
): number {
  const plan = plans.find((candidate) => candidate.id === company.planId);
  assertInDevOutsidePromise(
    plan !== undefined,
    `"${company.name}" è sul piano "${company.planId}", che non è fra i piani.`,
  );
  if (plan === undefined) {
    throw new Error(`Nessun piano con id "${company.planId}".`);
  }
  return company.employeeCount * plan.monthlyPricePerEmployee * 12;
}

/**
 * Tasso di attivazione: iscritti ÷ dipendenti coperti, arrotondato all'intero.
 *
 * È la stessa definizione dell'adozione aziendale della dashboard HR
 * (`docs/CONTRATTO-DATI.md` §3), applicata a tutti i clienti attivi invece che
 * a uno solo. Si calcola e non si conserva: era il numero che il back-office
 * ereditato scriveva come "84%" accanto a 618 utenti, mentre 618 su quel
 * denominatore ne davano un altro.
 */
export function activationPercent(entry: PlatformMonth): number {
  if (entry.coveredEmployees === 0) return 0;
  return Math.round((entry.enrolledEmployees / entry.coveredEmployees) * 100);
}

/**
 * Il mese in cui cade il giorno della demo: l'ultimo della serie.
 *
 * `null` su una serie vuota, che è un caso che il contratto ammette (§11: cosa
 * succede con zero elementi) anche se il dataset di oggi non lo produce.
 */
export function currentPlatformMonth(
  months: PlatformMonth[],
): PlatformMonth | null {
  return months.length === 0 ? null : months[months.length - 1];
}
