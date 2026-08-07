import type {
  Appointment,
  AppointmentSlot,
  Company,
  Department,
  EarlyAlert,
  EmployeeDirectoryEntry,
  HrReport,
  Invoice,
  EmployeeProfile,
  PatientSummary,
  Payout,
  Plan,
  PlanId,
  Professional,
  ProfessionalEarnings,
  ProfessionalFilter,
  ProfessionalSession,
  Quarter,
  RoiSnapshot,
  ServiceUsageMonth,
  SessionEntitlement,
  SessionNote,
  StressRecord,
} from "./types";

/*
 * Il contratto dati (CLAUDE.md §5.1). Le schermate consumano questa interfaccia
 * e non sanno che oggi dietro c'è un dataset statico: post-funding cambia
 * l'implementazione, non le pagine.
 *
 * OGNI METODO RESTITUISCE UNA PROMISE, SENZA ECCEZIONI. È l'unica scelta di
 * questo file che non si recupera dopo: se una schermata chiamasse il provider
 * aspettandosi un oggetto, il giorno in cui dietro c'è una `fetch` non si
 * sostituirebbe l'implementazione — si riscriverebbe ogni schermata, perché
 * ognuna dovrebbe imparare a gestire attesa, errore e vuoto.
 *
 * I metodi sono di DOMINIO, non di schermata. Il criterio è che sopravvivano a
 * un redesign della pagina che li consuma: `getRoiSnapshot(period)` sopravvive,
 * un `getHRDashboardData()` no — alla prima KPI spostata cambierebbe l'API, e
 * il backend erediterebbe le nostre decisioni di layout. Per la stessa ragione
 * qui non c'è nessun raggruppamento per settimana: quello è presentazione e si
 * costruisce dalle sessioni con una funzione pura.
 *
 * L'interfaccia cresce **un'area alla volta**: porta i metodi che il dataset sa
 * già rispondere, non quelli che un giorno serviranno. Un metodo senza
 * chiamante è codice da mantenere (§11); un tipo senza chiamante è
 * documentazione, ed è per questo che `types.ts` copre tutto il §10 e questo
 * file no. Cosa manca e perché è dichiarato in `docs/CONTRATTO-DATI.md`.
 *
 * ASSENTE SI DICE `null`, mai `undefined`: un valore che non c'è e un campo che
 * nessuno ha valorizzato si distinguono, e alla prima serializzazione JSON
 * `undefined` sparirebbe dall'oggetto invece di arrivare come assenza.
 */
export interface DataProvider {
  /**
   * Il giorno in cui la demo è ambientata.
   *
   * Le schermate non chiamano `new Date()` — una regola di lint lo impedisce —
   * perché il dataset è costruito attorno a questa data, e un calendario che
   * segue l'orologio vero mostrerebbe una settimana vuota il giorno della
   * presentazione.
   */
  getReferenceDate(): Promise<Date>;

  // --- Azienda e piani -----------------------------------------------------

  getCompany(): Promise<Company>;

  /**
   * Il listino dei tre piani, dal più economico al più completo.
   *
   * Serve al pubblico, che parla a un'azienda che il piano non l'ha ancora
   * scelto, mentre `getCompany().plan` è il piano di Demo SA: sono due domande
   * diverse e la landing non deve rispondere alla seconda.
   */
  getPlans(): Promise<Plan[]>;
  getPlan(id: PlanId): Promise<Plan | null>;
  getDepartments(): Promise<Department[]>;

  // --- Misurazione dello stress -------------------------------------------

  /**
   * Dodici mesi di rilevazioni, dalla più vecchia alla più recente. Senza
   * `departmentId` restituisce l'aggregato dell'intera azienda.
   *
   * La soppressione è già avvenuta: un reparto sotto soglia arriva senza
   * punteggio, non con un punteggio da nascondere.
   */
  getStressHistory(departmentId?: string): Promise<StressRecord[]>;

  /** Ultima rilevazione di ogni reparto, nell'ordine di `getDepartments()`. */
  getLatestStressByDepartment(): Promise<StressRecord[]>;

  /** L'alert precoce attivo, se c'è. */
  getEarlyAlert(): Promise<EarlyAlert | null>;

  // --- ROI ------------------------------------------------------------------

  /** Trimestri selezionabili, dal più recente al più vecchio. */
  getQuarters(): Promise<Quarter[]>;
  /** Trimestre mostrato all'apertura della dashboard. */
  getCurrentQuarter(): Promise<Quarter>;
  getRoiSnapshot(period: Quarter): Promise<RoiSnapshot | null>;

  // --- Area HR (§10.C) ------------------------------------------------------

  /**
   * L'utilizzo dei servizi, un record per mese, dal più vecchio al più recente.
   *
   * Una serie sola per due grafici: le barre la leggono mese per mese, la
   * ciambella la somma sul periodo scelto. Esporre la distribuzione già
   * aggregata sarebbe un secondo conteggio della stessa cosa, ed è il difetto
   * della schermata ereditata — dove la ciambella dice 180 sessioni di
   * psicologo e la KPI accanto ne dice 142 (§5.5).
   */
  getServiceUsage(): Promise<ServiceUsageMonth[]>;

  /** Le metriche del trimestre, per la pagina report e per il PDF di M4. */
  getHrReport(period: Quarter): Promise<HrReport | null>;

  /**
   * L'elenco dipendenti che l'azienda può vedere: iniziali e reparto, mai un
   * nome. Nel dataset demo è un estratto di otto righe su 120 — la paginazione
   * è M5 — e la schermata lo dichiara invece di far credere il contrario.
   */
  getEmployeeDirectory(): Promise<EmployeeDirectoryEntry[]>;

  /** Le fatture dell'abbonamento, dalla più recente. */
  getInvoices(): Promise<Invoice[]>;

  // --- Professionisti -------------------------------------------------------

  getProfessionals(filter?: ProfessionalFilter): Promise<Professional[]>;
  getProfessional(id: string): Promise<Professional | null>;

  // --- Portale professionista (§10.D) --------------------------------------

  /** Di chi è il portale che la demo mostra: la Dr.ssa Meier. */
  getPortalProfessionalId(): Promise<string>;

  /**
   * Le sessioni di un professionista, erogate e in programma, in ordine di
   * orario. Comprende le prenotazioni fatte durante la demo, perché sono lo
   * stesso record che il dipendente vede dal suo lato.
   *
   * Le restituisce tutte: la settimana del calendario e il mese del riepilogo
   * sono due domande sullo stesso dato, e filtrarle in memoria è ciò che rende
   * impossibile che divergano. In produzione questo metodo prenderà un
   * intervallo, perché un'agenda vera non entra in una risposta —
   * `docs/CONTRATTO-DATI.md` §6.
   */
  getProfessionalSessions(
    professionalId: string,
  ): Promise<ProfessionalSession[]>;

  /**
   * I pazienti di un professionista, ognuno con il suo conto di sessioni.
   * È derivato dalle sessioni: l'elenco e la KPI che lo conta non possono
   * divergere perché sono la stessa lista (§10.D).
   */
  getProfessionalPatients(professionalId: string): Promise<PatientSummary[]>;

  /** Riepilogo compensi di un mese. Conta solo le sessioni erogate. */
  getProfessionalEarnings(
    professionalId: string,
    month: Date,
  ): Promise<ProfessionalEarnings>;

  /** Storico pagamenti, dal mese in corso all'indietro. */
  getProfessionalPayouts(professionalId: string): Promise<Payout[]>;

  getSessionNote(sessionId: string): Promise<SessionNote | null>;

  /**
   * Salva la nota privata di una sessione.
   *
   * È l'unica scrittura di M2, e serve a dimostrare il giro completo del §5.2:
   * la mutation invalida le query toccate e la schermata rilegge dal provider,
   * invece di tenersi uno stato locale allineato a mano.
   *
   * La nota non esce mai verso l'azienda, e a impedirlo è il dominio: nessun
   * metodo dell'area HR o admin restituisce `SessionNote`.
   */
  saveSessionNote(note: Omit<SessionNote, "updatedAt">): Promise<SessionNote>;

  // --- Percorso dipendente --------------------------------------------------

  /** La persona della demo: Laura Bernasconi. */
  getEmployeeProfile(): Promise<EmployeeProfile>;
  getEntitlement(): Promise<SessionEntitlement>;
  /**
   * Gli appuntamenti **in programma** della persona, dal più imminente. Le
   * sedute già erogate non sono appuntamenti da elencare: sono il contatore
   * (`getEntitlement`), che è il conto di quelle.
   */
  getAppointments(): Promise<Appointment[]>;
  /** Slot proponibili per un professionista, già filtrati sui liberi. */
  getAvailableSlots(professionalId: string): Promise<AppointmentSlot[]>;
}
