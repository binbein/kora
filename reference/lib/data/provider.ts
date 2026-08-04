import type {
  Appointment,
  AppointmentSlot,
  Company,
  Department,
  EarlyAlert,
  EmployeeProfile,
  Plan,
  PlanId,
  Professional,
  ProfessionalEarnings,
  ProfessionalFilter,
  Quarter,
  RoiSnapshot,
  SessionEntitlement,
  StressRecord,
} from "./types";

/*
 * Il contratto dati (CLAUDE.md §5). Le schermate consumano questa interfaccia
 * e non sanno che oggi dietro c'è un dataset statico: post-funding cambia
 * l'implementazione, non le pagine.
 *
 * Tutti i metodi sono sincroni di proposito. Una demo che si presenta dal vivo
 * non deve avere stati di caricamento da spiegare, e il giorno in cui arriva
 * una API vera il passaggio ad async è una modifica isolata e visibile,
 * non un dettaglio che si nasconde.
 */
export interface DataProvider {
  // --- Azienda e dashboard HR ---------------------------------------------

  getCompany(): Company;
  getDepartments(): Department[];

  /**
   * Il listino dei tre piani (§7), dal più economico al più completo.
   *
   * Serve alla landing, che parla a un'azienda che il piano non l'ha ancora
   * scelto, mentre `getCompany().plan` è il piano di Demo SA. Sono due
   * domande diverse e la landing non deve rispondere alla seconda.
   */
  getPlans(): Plan[];

  /** Un piano per identificatore, per chi ne serve uno solo (il calcolatore). */
  getPlan(id: PlanId): Plan;

  /**
   * Dodici mesi di rilevazioni, dal più vecchio al più recente.
   * Senza `departmentId` restituisce l'aggregato dell'intera azienda.
   */
  getStressHistory(departmentId?: string): StressRecord[];

  /** Ultima rilevazione di ogni reparto, nell'ordine di `getDepartments()`. */
  getLatestStressByDepartment(): StressRecord[];

  /** Trimestri selezionabili, dal più recente al più vecchio. */
  getQuarters(): Quarter[];

  /** Trimestre mostrato all'apertura della dashboard. */
  getCurrentQuarter(): Quarter;

  getRoiSnapshot(period: Quarter): RoiSnapshot;

  /** L'alert precoce attivo, se c'è. */
  getEarlyAlert(): EarlyAlert | undefined;

  /**
   * La data in cui la demo è ambientata.
   *
   * Le schermate non chiamano `new Date()`: il dataset è costruito attorno a
   * questa data, e un calendario che segue l'orologio vero mostrerebbe una
   * settimana vuota il giorno in cui la demo viene presentata.
   */
  getReferenceDate(): Date;

  // --- Portale professionista (§8.D) ---------------------------------------

  /** Il professionista di cui la demo mostra il portale. */
  getPortalProfessional(): Professional;

  /**
   * Sessioni del professionista, erogate e in programma, in ordine di orario.
   * Comprende le prenotazioni fatte durante la demo, così il calendario del
   * professionista mostra quello che il dipendente ha appena prenotato.
   */
  getProfessionalSessions(professionalId: string): Appointment[];

  /** Riepilogo compensi del mese di riferimento. */
  getProfessionalEarnings(professionalId: string): ProfessionalEarnings;

  // --- Percorso dipendente -------------------------------------------------

  /** La persona della demo: Laura Bernasconi. */
  getEmployeeProfile(): EmployeeProfile;

  getProfessionals(filter?: ProfessionalFilter): Professional[];
  getProfessionalById(id: string): Professional | undefined;

  getEntitlement(): SessionEntitlement;

  /** Appuntamenti della persona, dal più imminente. */
  getAppointments(): Appointment[];

  /** Slot proponibili per un professionista, già filtrati sui liberi. */
  getAvailableSlots(professionalId: string): AppointmentSlot[];

  /**
   * Conferma una prenotazione. Muta solo lo stato in memoria: l'appuntamento
   * compare subito in home e il contatore sessioni si aggiorna, che è quello
   * che deve succedere durante la demo.
   */
  bookAppointment(slot: AppointmentSlot): Appointment;

  /** Riporta il provider allo stato iniziale, fra una prova e l'altra. */
  reset(): void;

  // --- Notifiche di cambiamento -------------------------------------------

  /**
   * Registra un ascoltatore chiamato a ogni mutazione; restituisce la funzione
   * per disiscriversi. È il gancio che permette a React di ridisegnare senza
   * che i dati passino da uno store globale.
   */
  subscribe(listener: () => void): () => void;

  /** Contatore che cambia a ogni mutazione, per `useSyncExternalStore`. */
  getVersion(): number;
}
