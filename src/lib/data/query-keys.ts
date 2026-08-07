/*
 * Le chiavi di react-query, in un posto solo (CLAUDE.md §5.2).
 *
 * Stanno qui e non nei componenti perché una chiave scritta a mano in due punti
 * è due cache diverse per lo stesso dato: la mutation ne invalida una, l'altra
 * resta ferma, e a schermo si vede una schermata aggiornata accanto a una che
 * non lo è.
 *
 * Le chiavi sono gerarchiche, e non è un vezzo: invalidare `["professional",
 * id]` invalida sessioni, pazienti, compensi e pagamenti di quel
 * professionista in un colpo solo, che è esattamente ciò che deve succedere
 * quando una sessione cambia.
 *
 * Crescono un'area alla volta, come i metodi del provider: qui c'è quello che
 * M2 collega davvero.
 */
export const queryKeys = {
  referenceDate: () => ["reference-date"] as const,

  professional: {
    /** Radice di tutto ciò che riguarda un professionista: invalida il resto. */
    root: (professionalId: string) => ["professional", professionalId] as const,
    portalId: () => ["professional", "portal-id"] as const,
    profile: (professionalId: string) =>
      ["professional", professionalId, "profile"] as const,
    sessions: (professionalId: string) =>
      ["professional", professionalId, "sessions"] as const,
    patients: (professionalId: string) =>
      ["professional", professionalId, "patients"] as const,
    earnings: (professionalId: string, month: string) =>
      ["professional", professionalId, "earnings", month] as const,
    payouts: (professionalId: string) =>
      ["professional", professionalId, "payouts"] as const,
  },

  sessionNote: (sessionId: string) => ["session-note", sessionId] as const,

  /*
   * L'area HR. La radice porta con sé tutto ciò che riguarda l'azienda, come
   * per il professionista: il giorno in cui una prenotazione muoverà i
   * contatori aziendali, invalidarla sarà una riga sola.
   */
  company: {
    root: () => ["company"] as const,
    profile: () => ["company", "profile"] as const,
    departments: () => ["company", "departments"] as const,
    plans: () => ["company", "plans"] as const,
    stressHistory: (departmentId?: string) =>
      ["company", "stress", departmentId ?? "all"] as const,
    latestStress: () => ["company", "stress", "latest"] as const,
    earlyAlert: () => ["company", "early-alert"] as const,
    quarters: () => ["company", "quarters"] as const,
    currentQuarter: () => ["company", "quarters", "current"] as const,
    roiSnapshot: (period: string) => ["company", "roi", period] as const,
    roiSnapshots: () => ["company", "roi", "all"] as const,
    serviceUsage: () => ["company", "service-usage"] as const,
    report: (period: string) => ["company", "report", period] as const,
    directory: () => ["company", "directory"] as const,
    invoices: () => ["company", "invoices"] as const,
  },
} as const;

/** Il mese come chiave stabile: "2026-09". Una `Date` non è confrontabile. */
export function monthKey(month: Date): string {
  return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
}
