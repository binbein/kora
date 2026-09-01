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

  /*
   * La sessione (M5.d). Sta alla radice e non sotto nessuna area, perché non
   * appartiene a nessuna: la leggono le guardie di tutti e quattro i portali.
   *
   * `enterAs` la invalida, ed è l'unica cosa che invalida — concedere un ruolo
   * non cambia nessun dato, quindi far rileggere altro sarebbe rileggere mezza
   * applicazione per un cambio di porta.
   */
  session: () => ["session"] as const,

  professional: {
    /** Radice di tutto ciò che riguarda un professionista: invalida il resto. */
    root: (professionalId: string) => ["professional", professionalId] as const,
    portalId: () => ["professional", "portal-id"] as const,
    /** Il corpo professionale, per chi deve sceglierne uno. */
    all: () => ["professional", "all"] as const,
    /*
     * La disponibilità sta sotto la radice del professionista, non sotto quella
     * del dipendente, perché è la sua agenda: una prenotazione la invalida
     * insieme a sedute e pazienti, con la stessa riga.
     */
    slots: (professionalId: string) =>
      ["professional", professionalId, "slots"] as const,
    /*
     * Le fasce **con il loro stato**, che è una lettura diversa dai proponibili
     * qui sopra: quella dice cosa si può prenotare, questa cosa la
     * professionista amministra. Sono due chiavi perché sono due domande, e
     * stanno sotto la stessa radice perché a invalidarle sono gli stessi fatti.
     */
    ownSlots: (professionalId: string) =>
      ["professional", professionalId, "own-slots"] as const,
    profile: (professionalId: string) =>
      ["professional", professionalId, "profile"] as const,
    sessions: (professionalId: string) =>
      ["professional", professionalId, "sessions"] as const,
    /*
     * La proiezione del back-office sta **sotto la radice del professionista**,
     * non sotto quella della piattaforma, ed è la stessa ragione per cui gli
     * slot stanno qui: è la sua agenda, vista da un'altra parte. Da lì una
     * prenotazione o un annullamento — che invalidano la radice — se la portano
     * dietro, e `/admin/sessions` non resta indietro rispetto al portale che
     * mostra le stesse sedute.
     */
    platformSessions: (professionalId: string) =>
      ["professional", professionalId, "platform-sessions"] as const,
    patients: (professionalId: string) =>
      ["professional", professionalId, "patients"] as const,
    earnings: (professionalId: string, month: string) =>
      ["professional", professionalId, "earnings", month] as const,
    payouts: (professionalId: string) =>
      ["professional", professionalId, "payouts"] as const,
    /*
     * La nota sta sotto la radice, e non è un dettaglio di ordinamento:
     * `saveSessionNote` invalida `["professional", id]` (CONTRATTO-DATI §4), e
     * una chiave fuori di lì resterebbe ferma sulla nota appena scritta. La
     * precauzione ha avuto il suo lettore — `useSessionNote`, che `ProSessioni`
     * apre riaprendo il dialogo della nota — e lì la scelta si è dimostrata
     * invece di restare una cautela.
     *
     * *(Fino al 18.08.2026 questo commento diceva che nessuno legge le note e
     * che il difetto "si vedrebbe al primo lettore": il primo lettore è
     * arrivato, e la riga che lo prevedeva non è stata riletta.)*
     */
    sessionNote: (professionalId: string, sessionId: string) =>
      ["professional", professionalId, "session-note", sessionId] as const,
  },

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

  /*
   * Il percorso dipendente. La radice porta con sé tutto ciò che una
   * prenotazione cambia dal suo lato — gli appuntamenti e i contatori — e una
   * prenotazione invalida questa radice **e** quella del professionista, perché
   * la seduta è un record solo visto da due parti (§10.D).
   */
  employee: {
    root: () => ["employee"] as const,
    profile: () => ["employee", "profile"] as const,
    entitlement: (kind: string) => ["employee", "entitlement", kind] as const,
    appointments: () => ["employee", "appointments"] as const,
    virtualDoctorConsults: () => ["employee", "virtual-doctor"] as const,
    aiPlan: () => ["employee", "ai-plan"] as const,
    rapidCheck: () => ["employee", "rapid-check"] as const,
  },

  /*
   * Il back-office (§10.E). La radice porta con sé tutto ciò che riguarda la
   * piattaforma, e le richieste demo stanno sotto di lei: è il back-office a
   * leggerle, quindi una richiesta inviata dal form pubblico invalida questa
   * radice e non quella dell'azienda cliente.
   */
  platform: {
    root: () => ["platform"] as const,
    clients: () => ["platform", "clients"] as const,
    months: () => ["platform", "months"] as const,
    users: () => ["platform", "users"] as const,
    demoRequests: () => ["platform", "demo-requests"] as const,
  },

  /*
   * Il check-up sta fuori dalla radice del dipendente perché la rete non è sua:
   * è la stessa che il back-office segue, e nessuna prenotazione di seduta la
   * tocca.
   */
  checkup: {
    providers: () => ["checkup", "providers"] as const,
    eligibility: () => ["checkup", "eligibility"] as const,
    report: (bookingId: string) => ["checkup", "report", bookingId] as const,
  },
} as const;

/** Il mese come chiave stabile: "2026-09". Una `Date` non è confrontabile. */
export function monthKey(month: Date): string {
  return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
}
