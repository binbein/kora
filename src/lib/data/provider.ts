import type {
  AiHealthPlan,
  Appointment,
  AppointmentSlot,
  ProfessionalSlot,
  SlotStatus,
  CappedServiceKind,
  CheckupEligibility,
  CheckupProvider,
  CheckupReport,
  ClientCompany,
  Company,
  PlatformMonth,
  PlatformUser,
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
  PlatformSession,
  Professional,
  ProfessionalEarnings,
  ProfessionalSession,
  Quarter,
  RapidCheckAnswer,
  RapidCheckLink,
  RoiSnapshot,
  ServiceUsageMonth,
  Session,
  SessionEntitlement,
  SessionNote,
  StressRecord,
  UserRole,
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
   * è lavoro dell'MVP (`docs/CONTRATTO-DATI.md` §8.12) — e la schermata lo
   * dichiara invece di far credere il contrario.
   */
  getEmployeeDirectory(): Promise<EmployeeDirectoryEntry[]>;

  /** Le fatture dell'abbonamento, dalla più recente. */
  getInvoices(): Promise<Invoice[]>;

  // --- Professionisti -------------------------------------------------------

  /**
   * Il corpo professionale, **intero e senza filtro** (16.08.2026).
   *
   * Prendeva un `ProfessionalFilter` opzionale su specialità e lingua che **non
   * chiamava nessuno** dei quattro consumatori. Non era un'opzione in attesa di
   * un uso: era un'opzione che la chiave di cache non codificava — la lettura
   * sta su `queryKeys.professional.all()`, che è costante — quindi il primo
   * chiamante che avesse passato un filtro avrebbe letto la risposta di un'altra
   * domanda.
   *
   * Delle due strade — la chiave codifica il filtro, oppure il parametro esce —
   * è uscito il parametro, per tre ragioni: il §11 non vuole opzioni che nessuno
   * passa; **il filtro che serve non è questo** — chi prenota filtra per
   * prenotabilità e tipo di servizio, non per specialità e lingua; e il vuoto
   * vero, che il `docs/CONTRATTO-DATI.md` §8 nomina, è che **il dipendente non
   * ha una lingua**, quindi nessun filtro per lingua è costruibile da questo
   * lato. Il giorno in cui ce l'ha, il parametro torna **insieme alla sua
   * chiave**.
   */
  getProfessionals(): Promise<Professional[]>;
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
   * Le stesse sedute come le vede **il back-office**: la terza proiezione.
   *
   * Non è `getProfessionalSessions` con un altro nome: quella serve **chi
   * cura** e porta il nome del paziente, questa serve chi amministra la
   * piattaforma e porta le iniziali, su un tipo che il nome non ha
   * (`PlatformSession`). Le due letture si sono separate il giorno in cui la
   * prima ha guadagnato il nome — prima erano la stessa perché dicevano la
   * stessa cosa.
   *
   * Prende l'id perché nel dataset demo il back-office elenca l'agenda di una
   * professionista sola, e la schermata lo dichiara: in produzione ne aggrega
   * molte e prenderà un intervallo e una pagina
   * (`docs/CONTRATTO-DATI.md` §6, §7).
   */
  getPlatformSessions(professionalId: string): Promise<PlatformSession[]>;

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

  /**
   * Annulla una sessione in programma, dal lato del professionista.
   *
   * **RIFIUTA SE LA SESSIONE NON È ANNULLABILE**, e la condizione ha due metà
   * che oggi coincidono e domani no: dev'essere `scheduled` e dev'essere
   * ancora futura. Nel dataset demo la prima implica la seconda, perché lo
   * stato si deriva dall'orologio; in produzione lo stato è un **evento** che
   * qualcuno dichiara (`docs/CONTRATTO-DATI.md` §8.5), quindi una seduta di
   * ieri che nessuno ha chiuso resta `scheduled` — e annullarla a posteriori
   * cambierebbe un compenso già maturato.
   *
   * **DUE TESTI FACOLTATIVI, CON DUE DESTINATARI** (founder, 01.09.2026), e la
   * differenza è di forma e non di rendering:
   *
   * - `note` arriva su `ProfessionalSession.cancellationNote`, che è una
   *   proiezione di chi cura, e **`Appointment` non ha quel campo**;
   * - `message` arriva su **entrambe** — è la riga che la professionista scrive
   *   al paziente, e nasce per essere letta da lui.
   *
   * **Nessuna delle due esce mai verso l'azienda**, e resta vero adesso che una
   * esce verso il paziente: il paziente **non è l'azienda**, ed è la distinzione
   * che tiene in piedi tutta la garanzia. `EmployeeDirectoryEntry` e
   * `PlatformSession` non hanno un campo su cui l'uno o l'altro possa arrivare.
   *
   * **UN OGGETTO E NON DUE `string?` DI FILA.** Con due note facoltative i
   * parametri posizionali diventano illeggibili al call site:
   * `cancelSession(id, undefined, "…")` non dice a chi legge quale dei due testi
   * sta passando, e invertirli è un errore che compila. L'oggetto nomina i due
   * campi nel punto in cui si scrivono.
   *
   * **Il `?` è la convenzione degli input di scrittura** (§2 del contratto), e
   * qui vale sia sull'oggetto sia sui suoi due campi: annullare senza scrivere
   * niente è il caso normale. **A normalizzare è il confine**, come per la
   * richiesta demo — assente, vuoto e soli spazi diventano la stessa cosa una
   * volta sola. La lettura però **non** dice `| null` come là: i due campi della
   * proiezione sono `?` per la ragione dichiarata sui tipi — assente vuol dire
   * che quel testo non c'è, e copre anche la seduta non annullata — quindi il
   * confine normalizza *verso l'assenza* invece che verso `null`.
   *
   * Chi annulla è il professionista, quindi il motivo non è un parametro: la
   * disdetta dal lato del dipendente non esiste ancora, ed è dichiarata fra i
   * vuoti dell'MVP insieme alla policy di preavviso.
   */
  cancelSession(
    sessionId: string,
    input?: { note?: string; message?: string },
  ): Promise<ProfessionalSession>;

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
   * Gli appuntamenti della persona che **non sono ancora passati**, dal più
   * imminente: quelli in programma e quelli **annullati ma ancora futuri**.
   *
   * Le sedute già erogate non sono appuntamenti da elencare: sono il contatore
   * (`getEntitlement`), che è il conto di quelle.
   *
   * **Le annullate ci sono dal 18.08.2026**, perché senza di loro una disdetta
   * della professionista faceva sparire la seduta e basta: chi aveva prenotato
   * non aveva nessun modo di saperlo. Chi consuma questa lista per **contare**
   * gli appuntamenti in programma filtra sullo stato — è il contatore della
   * home, e il filtro sta nel punto che conta, non qui.
   */
  getAppointments(): Promise<Appointment[]>;
  /**
   * Disdice un appuntamento, dal lato del dipendente (§10.B.5).
   *
   * **È la stessa transizione di `cancelSession`, dall'altro verso**: la seduta
   * è un record solo, e a cambiare non è cosa succede ma **chi lo dichiara** —
   * il motivo scritto è `by_patient` invece di `by_professional`. Ne discende
   * che invalida le stesse due radici (`docs/CONTRATTO-DATI.md` §4).
   *
   * **RIFIUTA SE L'APPUNTAMENTO NON È ANNULLABILE**, con la stessa
   * precondizione a due metà: dev'essere `scheduled` e dev'essere ancora
   * futuro. Oggi la prima implica la seconda perché lo stato si deriva
   * dall'orologio; in produzione lo stato è un evento che qualcuno dichiara e
   * le due si separano.
   *
   * **CERCA FRA GLI APPUNTAMENTI DI CHI È AUTENTICATO**, cioè nella stessa
   * lista che `getAppointments` restituisce, e non fra tutte le sedute del
   * dominio come fa `cancelSession` — che è il metodo di chi cura, e ha davanti
   * la propria agenda. Da qui **"non trovato" copre già "non è tuo"**, e non
   * serve un rifiuto in più: la seduta di qualcun altro non è in quella lista.
   * In produzione a restringere è la sessione lato server (§8.7 del contratto),
   * quindi la firma non cambia.
   *
   * **Non prende testi**, e non è una versione ridotta dell'altro verso: la
   * nota è di chi cura e il messaggio è la sua voce verso il paziente. Una riga
   * scritta da qui avrebbe **un terzo destinatario** — chi cura la
   * riceverebbe — e con lui le domande su quando la legge e come le arriva, che
   * sono la notifica del §8.5 e non sono decise.
   *
   * **Le policy restano fuori**: preavviso, chi paga una disdetta tardiva,
   * riprogrammazione. Questo metodo è il verbo, non le regole che un giorno lo
   * governeranno.
   */
  cancelAppointment(appointmentId: string): Promise<Appointment>;
  /**
   * Slot proponibili per un professionista, già filtrati sui liberi.
   *
   * **DUE SOTTRAZIONI E NON UNA** (01.09.2026): dalle fasce dichiarate si
   * tolgono quelle occupate da una seduta non annullata **e quelle che la
   * professionista ha chiuso**. La seconda è arrivata con `setSlotStatus`, e
   * senza di lei una fascia chiusa restava prenotabile — cioè la chiusura non
   * avrebbe chiuso niente.
   */
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

  // --- Le fasce, dal lato di chi le amministra (§10.D) -----------------------

  /**
   * Le fasce dichiarate di un professionista, ognuna con il suo stato.
   *
   * **Non è `getAvailableSlots` con un campo in più**, e i due non si
   * sostituiscono: quello restituisce `AppointmentSlot`, cioè **ciò che si può
   * prenotare**, ed è la lista che alimenta `bookAppointment`; questo
   * restituisce `ProfessionalSlot`, cioè **ciò che la professionista
   * amministra**, comprese le fasce che ha chiuso e che nessuno deve poter
   * prenotare. Un tipo solo con lo stato dentro finirebbe come input di
   * prenotazione, ed è la ragione scritta su `ProfessionalSlot`.
   *
   * Porta le fasce **occupate** come porta le libere: a dire che un'ora è presa
   * è la seduta, che il calendario ha già da `getProfessionalSessions`, e una
   * lista che le togliesse costringerebbe la griglia a ricostruirle.
   */
  getProfessionalSlots(professionalId: string): Promise<ProfessionalSlot[]>;

  /**
   * Apre o chiude una fascia dichiarata.
   *
   * **UNA SCRITTURA CON LO STATO DESIDERATO, NON DUE METODI SPECULARI.** Un
   * `openSlot` e un `closeSlot` sarebbero due superfici di invalidazione da
   * tenere allineate a mano per una differenza che sta in un valore, ed è la
   * stessa ragione per cui `saveSessionNote` è un upsert invece di una coppia
   * crea/aggiorna. Il chiamante dice **dove vuole arrivare**, e chiedere lo
   * stato in cui la fascia è già è legittimo: la richiesta è soddisfatta.
   *
   * **RIFIUTA TRE COSE, E LE TRE NON SONO DELLA STESSA NATURA:**
   *
   * - **la fascia che non esiste** — è del dominio, e un backend risponderebbe
   *   404. Vale identico in produzione;
   * - **la fascia occupata da una seduta in programma** — è del dominio, e un
   *   backend risponderebbe 409. Chiudere un'ora già presa non vuol dire
   *   niente: il gesto che libera quell'ora è l'annullamento, e ha il suo
   *   metodo. Vale identico in produzione;
   * - **la fascia passata** — la **regola** è del dominio (chiudere un'ora già
   *   trascorsa non cambia niente per nessuno), ma **l'implementazione è
   *   dell'orologio della demo**: qui "passata" si misura su `DEMO_TODAY` e non
   *   su `new Date()` (`CLAUDE.md` §5.4), quindi il confine si sposta con il
   *   dataset invece che con il calendario. È la stessa struttura a due metà
   *   che `cancelSession` dichiara sulla sua precondizione.
   *
   * **La fascia si identifica con l'istante d'inizio**, e il perché — e fino a
   * quando — sta su `ProfessionalSlot`.
   *
   * **Invalida due radici**, quella del professionista e quella del dipendente,
   * per la ragione già scritta su `cancelSession` e `bookAppointment`: la fascia
   * è un fatto solo che i due lati leggono da due liste diverse.
   */
  setSlotStatus(
    professionalId: string,
    start: Date,
    status: SlotStatus,
  ): Promise<ProfessionalSlot>;

  // --- Check rapido (§8, §10.B) ---------------------------------------------

  /** La risposta di oggi, se è già stata data. */
  getRapidCheckAnswer(): Promise<RapidCheckAnswer | null>;

  /**
   * A quale azienda e a quale reparto porta un link anonimo (§10.A.5).
   *
   * `null` copre **due casi che il client non distingue**: il token non esiste,
   * oppure è scaduto. È deliberato — a chi apre un link morto la differenza non
   * serve, e dirgliela direbbe a chiunque provi un token a caso quali token
   * sono esistiti.
   */
  getRapidCheckLink(token: string): Promise<RapidCheckLink | null>;

  /**
   * Registra la risposta al check rapido: una domanda, un tocco.
   *
   * Senza il secondo argomento prende il solo valore, perché chi risponde è la
   * persona autenticata e il suo reparto lo sa il server — è la stessa ragione
   * per cui `getCompany()` non prende un identificatore
   * (`docs/CONTRATTO-DATI.md` §7).
   *
   * **Con `{ token }` la risposta arriva dal link anonimo**: il reparto lo porta
   * il link e la risposta **non ha `employeeId`**, che è il caso per cui quel
   * campo del tipo è opzionale. Rifiuta un token che non risolve — un link
   * scaduto o inventato non deve poter scrivere nel reparto di nessuno.
   *
   * **Il facoltativo è un argomento di scrittura, non un campo di lettura**:
   * assente significa *"risponde la persona autenticata"*, non *"il token è
   * vuoto"*. Sono due chiamate diverse, non la stessa con un buco.
   *
   * **Nella demo la risposta non entra negli aggregati**: le dodici curve della
   * dashboard sono la storia curata del §8, e un tocco fatto durante il pitch non
   * deve poterla muovere. In produzione questa scrittura è invece esattamente
   * ciò che alimenta quelle serie.
   */
  submitRapidCheck(
    value: RapidCheckAnswer["value"],
    options?: { token: string },
  ): Promise<RapidCheckAnswer>;

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

  // --- Sessione e ruolo (§10, guardie di rotta) -----------------------------

  /**
   * Chi sta usando l'applicazione, dal punto di vista dell'accesso.
   *
   * **Non prende parametri**, ed è la scelta che rende il passaggio a
   * produzione una sostituzione invece di una riscrittura (§5.7): oggi
   * risponde il provider in memoria, domani l'autenticazione, e chi chiede non
   * cambia. È la stessa forma di `getCompany()` e `getEmployeeProfile()`, che
   * il §7 del contratto dichiara già servite dalla sessione.
   *
   * `role` è `null` sull'area pubblica: nessuna porta ha ancora concesso
   * niente, e non è un errore.
   */
  getSession(): Promise<Session>;

  /**
   * La porta di un portale concede il ruolo che quel portale richiede.
   *
   * **In demo è ciò che sostituisce il login**, e la sostituzione è dichiarata:
   * senza un backend non esiste un'autenticazione da simulare onestamente
   * (§2.5), quindi a concedere è l'ingresso. La guardia resta vera — legge la
   * sessione e nega quando il ruolo non corrisponde — e ciò che cambia in
   * produzione è chi la riempie.
   *
   * **Una sessione fissata non viene riconcessa**: è la manopola di sviluppo
   * `?role=` a fissarla (`data/fault-injection.ts`), ed è così che la
   * negazione diventa raggiungibile. Fuori dallo sviluppo la manopola non
   * esiste e questo metodo concede sempre.
   */
  enterAs(role: UserRole): Promise<Session>;

  // --- Area pubblica (§10.A) ------------------------------------------------

  /**
   * Registra una richiesta di demo dal form pubblico.
   *
   * **Invalida `platform.demoRequests()`**: chi legge le richieste è il
   * back-office, e da quando esiste — `getDemoRequests`, qui sotto — una
   * richiesta inviata durante la demo compare in `/admin` senza ricaricare. È
   * la riga della tabella di `docs/CONTRATTO-DATI.md` §4, che questa lettura
   * ha guadagnato nascendo con il suo consumatore invece di essere dichiarata
   * prima (§2 del contratto).
   *
   * *(Fino al 18.08.2026 questa docstring diceva "non invalida nessuna query,
   * oggi", ed era vera finché nessuno leggeva le richieste: l'area pubblica di
   * M3 ha chiuso la riga e non è risalita fin qui.)*
   *
   * Il record vive in memoria e lo stato sopravvive alla navigazione interna,
   * non a un ricaricamento (§10).
   */
  submitDemoRequest(input: DemoRequestInput): Promise<DemoRequest>;

  /**
   * Le richieste di demo arrivate, dalla più recente.
   *
   * Nasce con il suo consumatore, che è il back-office: fino a M3 la scrittura
   * non invalidava niente perché niente la leggeva, e questa è la lettura che
   * chiude quella riga di `docs/CONTRATTO-DATI.md` §4.
   */
  getDemoRequests(): Promise<DemoRequest[]>;

  // --- Back-office (§10.E) --------------------------------------------------

  /**
   * Le aziende clienti della piattaforma, Demo SA compresa.
   *
   * **Non portano il fatturato**: è organico × prezzo del piano × 12, e un
   * campo accanto potrebbe smettere di tornare con i due da cui viene — che è
   * il difetto del back-office ereditato, dove Demo SA dichiarava CHF 99'000
   * su un organico che l'elenco non confermava più (§5.5).
   */
  getClientCompanies(): Promise<ClientCompany[]>;

  /**
   * Le dodici mensilità della piattaforma: ricavo, copertura, iscritti,
   * sessioni per servizio.
   *
   * È una serie sola per tutti i grafici dell'analytics, per la stessa ragione
   * per cui `getServiceUsage` lo è per la dashboard HR: due entità separate
   * possono divergere, una serie letta due volte no.
   */
  getPlatformMonths(): Promise<PlatformMonth[]>;

  /**
   * Gli utenti della piattaforma. Nel dataset demo è un estratto di sette
   * righe, come l'elenco dipendenti dell'HR: la schermata lo dichiara.
   */
  getPlatformUsers(): Promise<PlatformUser[]>;
}
