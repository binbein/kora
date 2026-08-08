import type {
  AiHealthPlan,
  Appointment,
  AppointmentSlot,
  CappedServiceKind,
  CheckupEligibility,
  CheckupProvider,
  CheckupReport,
  Company,
  DemoRequest,
  DemoRequestInput,
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
  RapidCheckAnswer,
  RoiSnapshot,
  ServiceUsageMonth,
  SessionEntitlement,
  SessionNote,
  StressRecord,
  VirtualDoctorConsult,
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
  /** Tutti gli snapshot, dal più recente: il grafico del risparmio li mostra insieme. */
  getRoiSnapshots(): Promise<RoiSnapshot[]>;

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

  /**
   * Quante sedute ha usato sul cap del piano, per uno dei servizi cappati.
   *
   * Prende il servizio invece di rispondere solo per lo psicologo perché il Plus
   * ne cappa due, e la home mostra i due contatori affiancati: con un metodo
   * solo il coach sarebbe finito da qualche altra parte, e due contatori che si
   * assomigliano ma arrivano da strade diverse sono il modo in cui poi
   * divergono.
   */
  getEntitlement(kind: CappedServiceKind): Promise<SessionEntitlement>;
  /**
   * Gli appuntamenti **in programma** della persona, dal più imminente. Le
   * sedute già erogate non sono appuntamenti da elencare: sono il contatore
   * (`getEntitlement`), che è il conto di quelle.
   */
  getAppointments(): Promise<Appointment[]>;
  /** Slot proponibili per un professionista, già filtrati sui liberi. */
  getAvailableSlots(professionalId: string): Promise<AppointmentSlot[]>;

  /**
   * Prenota uno slot per la persona della demo.
   *
   * **Scrive una seduta sola.** `Appointment` e `ProfessionalSession` sono due
   * proiezioni dello stesso record (§10.D): dopo questa chiamata la seduta esce
   * da `getAppointments` per il dipendente e da `getProfessionalSessions` per il
   * professionista, e lo slot non esce più da `getAvailableSlots`. Il client non
   * allinea niente a mano — invalida e rilegge (§5.2).
   *
   * Non fa salire `used`: la seduta nasce `scheduled` e il diritto conta le
   * erogate (§10.B).
   */
  bookAppointment(slot: AppointmentSlot): Promise<Appointment>;

  // --- Check rapido (§8, §10.B) ---------------------------------------------

  /** La risposta di oggi, se è già stata data. */
  getRapidCheckAnswer(): Promise<RapidCheckAnswer | null>;

  /**
   * Registra la risposta al check rapido: una domanda, un tocco.
   *
   * Prende il solo valore perché chi risponde è la persona autenticata e il suo
   * reparto lo sa il server — è la stessa ragione per cui `getCompany()` non
   * prende un identificatore (`docs/CONTRATTO-DATI.md` §7). La variante su link
   * anonimo del §8 porterà il reparto dal link, non da qui.
   *
   * **Nella demo la risposta non entra negli aggregati**: le dodici curve della
   * dashboard sono la storia curata del §8, e un tocco fatto durante il pitch non
   * deve poterla muovere. In produzione questa scrittura è invece esattamente
   * ciò che alimenta quelle serie.
   */
  submitRapidCheck(value: RapidCheckAnswer["value"]): Promise<RapidCheckAnswer>;

  /**
   * I consulti di medico virtuale già avvenuti, dal più vecchio.
   *
   * Il Profilo ne mostra il conto, e lo conta da qui: il piano Plus non li
   * limita, quindi il numero che interessa è quanti ne hai fatti, non quanti te
   * ne restano — e per quello `SessionEntitlement` non sarebbe il tipo giusto.
   */
  getVirtualDoctorConsults(): Promise<VirtualDoctorConsult[]>;

  // --- Check-up (§10.B) -----------------------------------------------------

  /**
   * La rete convenzionata, **tutta**, con lo stato di ciascuna struttura.
   *
   * Le strutture in convenzionamento arrivano al client invece di essere
   * filtrate: il back-office le segue, ed è un dato del dominio, non una
   * soppressione per privacy come quella dei reparti sotto soglia. Chi prenota
   * mostra le sole `active`.
   */
  getCheckupProviders(): Promise<CheckupProvider[]>;

  /** Se il dipendente può prenotare un check-up, e da quando. */
  getCheckupEligibility(): Promise<CheckupEligibility>;

  /**
   * Il referto di un check-up eseguito.
   *
   * Sta su un metodo suo e non dentro `getCheckupEligibility` perché è l'unico
   * dato sanitario individuale del dominio: si chiede quando lo si apre, che è
   * anche il modo in cui in produzione lo si permessiona e lo si traccia.
   */
  getCheckupReport(bookingId: string): Promise<CheckupReport | null>;

  // --- Prevenzione (§10.B) --------------------------------------------------

  /** Il piano di prevenzione della persona, con le cinque aree di salute. */
  getAiHealthPlan(): Promise<AiHealthPlan>;

  // --- Area pubblica (§10.A) ------------------------------------------------

  /**
   * Registra una richiesta di demo dal form pubblico.
   *
   * **Non invalida nessuna query, oggi**: chi legge le richieste è il
   * back-office, che è l'ultima area da migrare. La lettura —
   * `getDemoRequests` — nasce con il suo consumatore e con la sua riga nella
   * tabella di `docs/CONTRATTO-DATI.md` §4, invece di essere dichiarata adesso
   * per indovinare una superficie di invalidazione che fra un passo si sa
   * (§2 del contratto).
   *
   * Il record viene comunque conservato, così l'admin lo troverà: il provider
   * vive in memoria e lo stato sopravvive alla navigazione interna (§10).
   */
  submitDemoRequest(input: DemoRequestInput): Promise<DemoRequest>;
}
