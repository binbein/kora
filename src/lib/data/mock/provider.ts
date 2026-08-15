import { assertInDevOutsidePromise } from "../guardrails";
import type { DataProvider } from "../provider";
import {
  type AiHealthPlan,
  type CappedServiceKind,
  type CheckupEligibility,
  type CheckupProvider,
  type CheckupReport,
  type ClientCompany,
  type DemoRequest,
  type DemoRequestInput,
  type EmployeeDirectoryEntry,
  type PlatformMonth,
  type PlatformUser,
  type HrReport,
  type Invoice,
  type ServiceUsageMonth,
  type VirtualDoctorConsult,
  sameQuarter,
  serviceOf,
  type Appointment,
  type AppointmentSlot,
  type Company,
  type Department,
  type EarlyAlert,
  type EmployeeProfile,
  type PatientSummary,
  type Payout,
  type Plan,
  type PlanId,
  type Professional,
  type ProfessionalEarnings,
  type ProfessionalFilter,
  type ProfessionalSession,
  type Quarter,
  type RapidCheckAnswer,
  type RoiSnapshot,
  type Session,
  type SessionEntitlement,
  type SessionNote,
  type StressRecord,
  type UserRole,
} from "../types";
import { LAURA_AI_PLAN } from "./ai-plan";
import {
  CHECKUP_PROVIDERS,
  LAURA_CHECKUP_ELIGIBILITY,
  LAURA_CHECKUP_REPORT,
} from "./checkup";
import { COMPANY, DEPARTMENTS, PLANS, PLAN_LIST } from "./company";
import {
  employeeEntitlement,
  LAURA_VIRTUAL_DOCTOR_CONSULTS,
} from "./employee-portal";
import { EMPLOYEE_DIRECTORY, HR_REPORTS, INVOICES } from "./hr";
import { DEMO_TODAY } from "./demo-date";
import { LAURA, PROFESSIONALS } from "./people";
import {
  CLIENT_COMPANIES,
  PLATFORM_MONTHS,
  PLATFORM_USERS,
} from "./platform";
import {
  entitlementFor,
  isActivePatient,
  sessionsOfPatient,
  monthlyEarnings,
  payoutHistory,
  PORTAL_PATIENT_EMPLOYEE_ID,
  PORTAL_PROFESSIONAL_ID,
  PORTAL_SESSIONS,
  SESSION_NOTES,
} from "./professional-portal";
import { CURRENT_QUARTER, QUARTERS, ROI_SNAPSHOTS } from "./roi";
import { INITIAL_SLOTS } from "./scheduling";
import { SERVICE_USAGE } from "./service-usage";
import {
  COMPANY_STRESS_HISTORY,
  DEPARTMENT_STRESS_HISTORY,
  EARLY_ALERT,
} from "./stress";

/*
 * L'implementazione mock del contratto (CLAUDE.md §5.1).
 *
 * Risolve immediatamente da un dataset già in memoria: **durante il pitch non
 * si vede mai uno spinner**. Non aggiungere ritardi artificiali "per realismo" —
 * in una presentazione dal vivo l'attesa è tempo morto da spiegare, e il §5.1
 * lo vieta.
 *
 * L'unico stato mutabile è la mappa delle note. Tutto il resto è il dataset,
 * che non cambia: le letture non copiano e non clonano, perché il giorno in cui
 * dietro c'è una `fetch` ogni risposta sarà comunque un oggetto nuovo.
 *
 * Quando arriva il backend questo file si cancella e ne compare uno in
 * `lib/data/http/` con la stessa interfaccia. Le schermate non le tocca nessuno.
 */
export class MockDataProvider implements DataProvider {
  /*
   * Le note, e sono **l'unica sorgente di `hasNote`**: nasce con i semi del
   * dataset e la demo ci aggiunge quelle che il professionista scrive. Le due
   * strade portano allo stesso posto, quindi una nota seminata e una scritta in
   * sala si comportano identiche (§5.5).
   */
  private readonly notes = new Map<string, SessionNote>(
    SESSION_NOTES.map((note) => [note.sessionId, note]),
  );

  /*
   * Le sedute prenotate durante la demo, per professionista.
   *
   * Stanno qui e non nel dataset perché il dataset è la storia curata del §8,
   * che non cambia: questo è ciò che succede mentre qualcuno guarda. Ed è **un
   * record solo**, non due — la stessa seduta esce da `getProfessionalSessions`
   * per il professionista e da `getAppointments` per il dipendente, che è
   * l'unico modo perché le due schermate non possano divergere (§10.D).
   */
  private readonly bookedByProfessional = new Map<string, ProfessionalSession[]>();

  /*
   * L'ultima risposta al check rapido. Non entra nelle serie del §8, ed è una
   * scelta: quelle dodici curve raccontano la storia che il pitch spiega, e un
   * tocco fatto davanti a un investitore non deve poterla muovere. Serve a
   * mostrare che il segnale esiste ed è suo — la home rilegge da qui e sa di
   * aver già risposto.
   */
  private lastRapidCheck: RapidCheckAnswer | null = null;

  /*
   * Le richieste di demo arrivate dal form pubblico, in ordine di arrivo.
   *
   * Non c'è nessun seme: il §8 non contiene richieste demo e non se ne
   * inventano (§2.4). L'elenco parte vuoto e si riempie durante la demo, ed è
   * ciò che il back-office leggerà quando sarà migrato — il provider vive in
   * memoria, quindi una richiesta compilata davanti a un investitore è ancora
   * lì navigando su `/admin` (§10).
   */
  private readonly demoRequests: DemoRequest[] = [];

  /*
   * Il ruolo con cui si sta guardando l'applicazione.
   *
   * Parte `null`, che è lo stato di chi sta sull'area pubblica, e lo muove
   * `enterAs` — cioè la porta di un portale. Vive qui e non in un context di
   * React perché in produzione a rispondere sarà l'autenticazione: se lo
   * tenessimo nel client, quel giorno andrebbe spostato, ed è la riscrittura
   * che il §5.7 esiste per evitare.
   *
   * Come tutto il resto dello stato del provider, **muore con un
   * ricaricamento** — e va bene: la porta riconcede al montaggio.
   */
  private session: Session = { role: null };

  /**
   * Tutte le sedute di un professionista, curate e prenotate, in ordine di
   * orario e con lo stato delle note applicato.
   */
  private sessionsOf(professionalId: string): ProfessionalSession[] {
    const curated =
      professionalId === PORTAL_PROFESSIONAL_ID ? PORTAL_SESSIONS : [];
    const all = [
      ...curated,
      ...(this.bookedByProfessional.get(professionalId) ?? []),
    ];
    all.sort((a, b) => a.start.getTime() - b.start.getTime());
    return all.map((session) => ({
      ...session,
      hasNote: session.hasNote || this.notes.has(session.id),
    }));
  }

  getReferenceDate(): Promise<Date> {
    return Promise.resolve(DEMO_TODAY);
  }

  getCompany(): Promise<Company> {
    return Promise.resolve(COMPANY);
  }

  getPlans(): Promise<Plan[]> {
    return Promise.resolve(PLAN_LIST);
  }

  getPlan(id: PlanId): Promise<Plan | null> {
    return Promise.resolve(PLANS[id] ?? null);
  }

  getDepartments(): Promise<Department[]> {
    return Promise.resolve(DEPARTMENTS);
  }

  getStressHistory(departmentId?: string): Promise<StressRecord[]> {
    if (departmentId === undefined) {
      return Promise.resolve(COMPANY_STRESS_HISTORY);
    }
    return Promise.resolve(DEPARTMENT_STRESS_HISTORY[departmentId] ?? []);
  }

  getLatestStressByDepartment(): Promise<StressRecord[]> {
    /*
     * Il `?? []` è quello di `getStressHistory` qui sopra, e da solo non
     * basterebbe: su una serie vuota l'ultimo elemento è `undefined`, quindi il
     * buco finirebbe **dentro l'array di ritorno** e la dashboard esploderebbe
     * una riga più in là, leggendo `measuredEmployees` di niente.
     *
     * Un reparto senza record esce dall'elenco invece di comparire con una riga
     * inventata: la funzione promette l'ultimo record di ogni reparto, e senza
     * record non c'è un ultimo record. Fabbricarne uno soppresso vorrebbe dire
     * dichiarare un dato che il provider non ha.
     */
    return Promise.resolve(
      DEPARTMENTS.flatMap((department) => {
        const series = DEPARTMENT_STRESS_HISTORY[department.id] ?? [];
        const latest = series[series.length - 1];
        return latest === undefined ? [] : [latest];
      }),
    );
  }

  getEarlyAlert(): Promise<EarlyAlert | null> {
    return Promise.resolve(EARLY_ALERT);
  }

  getQuarters(): Promise<Quarter[]> {
    return Promise.resolve(QUARTERS);
  }

  getCurrentQuarter(): Promise<Quarter> {
    return Promise.resolve(CURRENT_QUARTER);
  }

  getRoiSnapshot(period: Quarter): Promise<RoiSnapshot | null> {
    const snapshot = ROI_SNAPSHOTS.find((entry) =>
      sameQuarter(entry.period, period),
    );
    return Promise.resolve(snapshot ?? null);
  }

  getRoiSnapshots(): Promise<RoiSnapshot[]> {
    return Promise.resolve(ROI_SNAPSHOTS);
  }

  getServiceUsage(): Promise<ServiceUsageMonth[]> {
    return Promise.resolve(SERVICE_USAGE);
  }

  getHrReport(period: Quarter): Promise<HrReport | null> {
    const report = HR_REPORTS.find((entry) =>
      sameQuarter(entry.period, period),
    );
    return Promise.resolve(report ?? null);
  }

  getEmployeeDirectory(): Promise<EmployeeDirectoryEntry[]> {
    return Promise.resolve(EMPLOYEE_DIRECTORY);
  }

  getInvoices(): Promise<Invoice[]> {
    return Promise.resolve(INVOICES);
  }

  getProfessionals(filter?: ProfessionalFilter): Promise<Professional[]> {
    const matches = PROFESSIONALS.filter((professional) => {
      if (filter?.specialty && professional.specialty !== filter.specialty) {
        return false;
      }
      if (filter?.language && !professional.languages.includes(filter.language)) {
        return false;
      }
      return true;
    });
    return Promise.resolve(matches);
  }

  getProfessional(id: string): Promise<Professional | null> {
    return Promise.resolve(
      PROFESSIONALS.find((professional) => professional.id === id) ?? null,
    );
  }

  getPortalProfessionalId(): Promise<string> {
    return Promise.resolve(PORTAL_PROFESSIONAL_ID);
  }

  /**
   * Il professionista di quell'id, o un errore.
   *
   * **Lancia anche in produzione, e non è una svista.** I guardrail del §5.6
   * tacciono in produzione perché sorvegliano il dataset, che in produzione non
   * ci sarà; questo è un invariante dell'API — un backend vero risponderebbe
   * 404 — e un'implementazione che al suo posto inventa un dato è peggio di una
   * promise rifiutata: il difetto smette di esistere invece di farsi vedere.
   * Non va "corretto" in un `assertInDev`.
   *
   * L'assert in più serve allo sviluppo: un `throw` dentro un metodo `async`
   * finisce nello stato di errore di react-query, dove nessuno lo guarda,
   * mentre `assertInDevOutsidePromise` lo porta nell'overlay di Vite.
   */
  private async requireProfessional(id: string): Promise<Professional> {
    const professional = await this.getProfessional(id);
    assertInDevOutsidePromise(
      professional !== null,
      `"${id}" non è fra i professionisti.`,
    );
    if (professional === null) {
      throw new Error(`Nessun professionista con id "${id}".`);
    }
    return professional;
  }

  getProfessionalSessions(
    professionalId: string,
  ): Promise<ProfessionalSession[]> {
    return Promise.resolve(this.sessionsOf(professionalId));
  }

  async getProfessionalPatients(
    professionalId: string,
  ): Promise<PatientSummary[]> {
    const sessions = await this.getProfessionalSessions(professionalId);

    /*
     * I pazienti si ricavano dalle sedute e non da un elenco a parte: due liste
     * che descrivono le stesse persone finirebbero per non coincidere, ed è
     * esattamente il difetto che il §10.D chiede di chiudere — oggi la KPI dice
     * 18 pazienti e la pagina ne elenca 6.
     */
    const byPatient = new Map<string, ProfessionalSession[]>();
    for (const session of sessions) {
      byPatient.set(session.patientId, [
        ...(byPatient.get(session.patientId) ?? []),
        session,
      ]);
    }

    const summaries: PatientSummary[] = [];
    for (const [patientId, mine] of byPatient) {
      // l'elenco conta i pazienti **attivi**, ed è la stessa definizione che la
      // KPI usa perché è lo stesso calcolo
      if (!isActivePatient(mine)) continue;

      const completed = mine.filter((session) => session.status === "completed");
      summaries.push({
        patientId,
        patientInitials: mine[0].patientInitials,
        lastSessionAt: completed[completed.length - 1]?.start ?? null,
        nextSessionAt:
          mine.find((session) => session.status === "scheduled")?.start ?? null,
        entitlement: entitlementFor(mine),
      });
    }

    /*
     * L'ordine è per prossimo appuntamento: è la domanda che si fa chi apre
     * l'elenco. Chi non ne ha uno va in fondo invece di sparire.
     */
    return summaries.sort((a, b) => {
      if (a.nextSessionAt === null) return 1;
      if (b.nextSessionAt === null) return -1;
      return a.nextSessionAt.getTime() - b.nextSessionAt.getTime();
    });
  }

  async getProfessionalEarnings(
    professionalId: string,
    month: Date,
  ): Promise<ProfessionalEarnings> {
    const professional = await this.requireProfessional(professionalId);
    return monthlyEarnings(
      professionalId,
      this.sessionsOf(professionalId),
      professional.sessionFee,
      month,
    );
  }

  async getProfessionalPayouts(professionalId: string): Promise<Payout[]> {
    const professional = await this.requireProfessional(professionalId);
    return payoutHistory(this.sessionsOf(professionalId), professional.sessionFee);
  }

  getSessionNote(sessionId: string): Promise<SessionNote | null> {
    return Promise.resolve(this.notes.get(sessionId) ?? null);
  }

  saveSessionNote(note: Omit<SessionNote, "updatedAt">): Promise<SessionNote> {
    const saved: SessionNote = { ...note, updatedAt: DEMO_TODAY };
    this.notes.set(note.sessionId, saved);
    return Promise.resolve(saved);
  }

  getEmployeeProfile(): Promise<EmployeeProfile> {
    return Promise.resolve(LAURA);
  }

  /*
   * Il contatore dello psicologo è il conto delle sedute erogate di Laura, non
   * un numero a parte: è la stessa funzione che alimenta il co-payment
   * dell'elenco pazienti (§5.5). Quello del coach è un seme del §8, perché
   * dietro non c'è nessuna agenda — la distinzione è dichiarata in
   * `employee-portal.ts`.
   *
   * Una prenotazione **non** fa salire `used`: nasce `scheduled`, e `used` conta
   * le erogate (§10.B).
   */
  getEntitlement(kind: CappedServiceKind): Promise<SessionEntitlement> {
    const psychologistSessions = PROFESSIONALS.filter(
      (professional) => serviceOf(professional) === "psychologist",
    ).flatMap((professional) =>
      sessionsOfPatient(
        PORTAL_PATIENT_EMPLOYEE_ID,
        this.sessionsOf(professional.id),
      ),
    );
    return Promise.resolve(
      employeeEntitlement(kind, psychologistSessions),
    );
  }

  getVirtualDoctorConsults(): Promise<VirtualDoctorConsult[]> {
    return Promise.resolve(LAURA_VIRTUAL_DOCTOR_CONSULTS);
  }

  getCheckupProviders(): Promise<CheckupProvider[]> {
    return Promise.resolve(CHECKUP_PROVIDERS);
  }

  getCheckupEligibility(): Promise<CheckupEligibility> {
    return Promise.resolve(LAURA_CHECKUP_ELIGIBILITY);
  }

  getCheckupReport(bookingId: string): Promise<CheckupReport | null> {
    if (bookingId !== LAURA_CHECKUP_REPORT.bookingId) {
      return Promise.resolve(null);
    }
    return Promise.resolve(LAURA_CHECKUP_REPORT);
  }

  getAiHealthPlan(): Promise<AiHealthPlan> {
    return Promise.resolve(LAURA_AI_PLAN);
  }

  /*
   * Gli appuntamenti del dipendente sono le sue sessioni viste dall'altro lato:
   * stesso record, proiezione diversa. Il professionista ne riceve le iniziali,
   * il dipendente il professionista per intero.
   *
   * Solo le sedute in programma, dalla più imminente: il contratto promette
   * quell'ordine, quindi lo garantisce l'implementazione e non l'ordinamento
   * con cui il dataset è costruito — in M3 la prenotazione aggiungerà sedute
   * a runtime.
   */
  getAppointments(): Promise<Appointment[]> {
    const mine: Appointment[] = [];

    for (const professional of PROFESSIONALS) {
      for (const session of this.sessionsOf(professional.id)) {
        if (session.patientId !== PORTAL_PATIENT_EMPLOYEE_ID) continue;
        if (session.status !== "scheduled") continue;
        mine.push({
          id: session.id,
          kind: serviceOf(professional),
          professionalId: professional.id,
          start: session.start,
          durationMinutes: session.durationMinutes,
          status: session.status,
          type: session.type,
        });
      }
    }

    mine.sort((a, b) => a.start.getTime() - b.start.getTime());
    return Promise.resolve(mine);
  }

  getAvailableSlots(professionalId: string): Promise<AppointmentSlot[]> {
    /*
     * Una seduta **annullata non occupa la sua fascia**: è il caso che dà un
     * senso all'annullamento, e senza il filtro quell'orario non tornava
     * prenotabile da nessuno.
     *
     * Il dataset di oggi non lo mostra — l'unica cancellazione è di due
     * settimane fa e gli slot proponibili partono dal giorno dopo la demo — ma
     * il difetto è nel contratto, non nella schermata, e in produzione un
     * annullamento riguarda quasi sempre una seduta futura.
     */
    const taken = new Set(
      this.sessionsOf(professionalId)
        .filter((session) => session.status !== "cancelled")
        .map((session) => session.start.getTime()),
    );
    return Promise.resolve(
      INITIAL_SLOTS.filter(
        (slot) =>
          slot.professionalId === professionalId &&
          !taken.has(slot.start.getTime()),
      ),
    );
  }

  /*
   * LA PRENOTAZIONE (§10.B, §5.2).
   *
   * Scrive **una seduta sola**. Il dipendente la rilegge da `getAppointments`,
   * il professionista da `getProfessionalSessions`, e lo slot sparisce da
   * `getAvailableSlots` perché quell'orario adesso è occupato: sono tre risposte
   * diverse allo stesso fatto, non tre stati da tenere allineati a mano.
   *
   * Non fa salire `used`: la seduta nasce `scheduled`, e il contatore conta le
   * erogate (§10.B). E non muove nessun numero dell'area HR — le sessioni
   * consumate dell'azienda vengono dalla serie di utilizzo, che è il dataset
   * curato del §8.
   */
  async bookAppointment(slot: AppointmentSlot): Promise<Appointment> {
    const professional = await this.requireProfessional(slot.professionalId);

    const agenda = this.sessionsOf(slot.professionalId);

    /*
     * I due controlli guardano **l'agenda**, non `getAvailableSlots`.
     *
     * Appoggiarsi a quella funzione sembrava naturale — è lei che decide cosa è
     * libero — ed era un controllo tautologico: se il filtro degli occupati si
     * rompe, la stessa rottura fa passare anche la verifica. Confrontare con le
     * sedute già in agenda è indipendente, e prende il caso che conta: due
     * prenotazioni sullo stesso orario, che condividono anche l'id.
     *
     * Salta le annullate con lo stesso criterio di `getAvailableSlots`: da
     * quando quella fascia torna prenotabile, un guardrail che la contasse
     * ancora come occupata accuserebbe la schermata di proporre uno slot che
     * invece è libero per davvero.
     */
    assertInDevOutsidePromise(
      !agenda.some(
        (session) =>
          session.status !== "cancelled" &&
          session.start.getTime() === slot.start.getTime(),
      ),
      "Prenotato un orario su cui c'è già una seduta: la schermata sta proponendo uno slot occupato.",
    );

    assertInDevOutsidePromise(
      slot.start.getDay() !== 0 && slot.start.getDay() !== 6,
      "Prenotata una seduta nel fine settimana.",
    );

    const mine = sessionsOfPatient(PORTAL_PATIENT_EMPLOYEE_ID, agenda);

    const session: ProfessionalSession = {
      // deterministico: lo stesso slot non può produrre due id diversi
      id: `booked-${slot.professionalId}-${slot.start.getTime()}`,
      patientId: PORTAL_PATIENT_EMPLOYEE_ID,
      // le iniziali si derivano dal profilo: è tutto ciò che il professionista
      // riceve del nome, e scriverle a mano vorrebbe dire poterle sbagliare
      patientInitials: `${LAURA.firstName[0]}.${LAURA.lastName[0]}.`,
      start: slot.start,
      durationMinutes: slot.durationMinutes,
      status: "scheduled",
      // primo colloquio se è la prima volta con questo professionista: è la
      // stessa distinzione che il suo calendario mostra
      type: mine.length === 0 ? "first_visit" : "session",
      hasNote: false,
    };

    this.bookedByProfessional.set(slot.professionalId, [
      ...(this.bookedByProfessional.get(slot.professionalId) ?? []),
      session,
    ]);

    return {
      id: session.id,
      kind: serviceOf(professional),
      professionalId: slot.professionalId,
      start: session.start,
      durationMinutes: session.durationMinutes,
      status: session.status,
      type: session.type,
    };
  }

  // --- Check rapido ---------------------------------------------------------

  /**
   * La risposta di oggi al check rapido, se è già stata data.
   *
   * La home la rilegge dopo il tocco invece di tenersi uno stato locale: è il
   * giro del §5.2 sulla scrittura più piccola del dominio.
   */
  getRapidCheckAnswer(): Promise<RapidCheckAnswer | null> {
    return Promise.resolve(this.lastRapidCheck);
  }

  /*
   * Prende il solo valore: chi risponde è la persona autenticata, e il suo
   * reparto lo sa il provider — in produzione lo saprà la sessione. È la stessa
   * ragione per cui `getCompany()` non prende un identificatore (§7 del
   * contratto). La variante su link anonimo porterà il reparto dal link.
   *
   * **Non tocca le serie del §8.** Le dodici curve della dashboard sono la
   * storia che il pitch racconta, e un tocco fatto davanti a un investitore non
   * deve poterla muovere: qui si dimostra che il segnale esiste, non lo si
   * aggrega.
   */
  submitRapidCheck(value: RapidCheckAnswer["value"]): Promise<RapidCheckAnswer> {
    const answer: RapidCheckAnswer = {
      departmentId: LAURA.departmentId,
      employeeId: LAURA.id,
      value,
      answeredAt: DEMO_TODAY,
    };
    this.lastRapidCheck = answer;
    return Promise.resolve(answer);
  }

  /*
   * La richiesta di demo (§10.A.4).
   *
   * L'id è progressivo e la data è quella della demo: nessun `Math.random()` e
   * nessun `new Date()`, come per la prenotazione. Due invii identici restano
   * due richieste, perché lo sono — a differenza di uno slot, che è occupato o
   * libero.
   */
  getSession(): Promise<Session> {
    return Promise.resolve(this.session);
  }

  enterAs(role: UserRole): Promise<Session> {
    /*
     * L'oggetto è nuovo a ogni concessione, non mutato in luogo: react-query
     * confronta per riferimento, e un oggetto riscritto dentro non farebbe
     * ri-renderizzare chi lo osserva.
     */
    this.session = { role };
    return Promise.resolve(this.session);
  }

  submitDemoRequest(input: DemoRequestInput): Promise<DemoRequest> {
    assertInDevOutsidePromise(
      input.companyName.trim() !== "" && input.email.trim() !== "",
      "Richiesta demo inviata senza azienda o senza email: il form non sta trattenendo i campi obbligatori.",
    );

    const request: DemoRequest = {
      id: `demo-request-${this.demoRequests.length + 1}`,
      companyName: input.companyName,
      contactName: input.contactName,
      email: input.email,
      // il confine normalizza: assente, vuoto e soli spazi sono la stessa cosa
      // per chi legge, e diventano `null` una volta sola, qui
      employeeCount: input.employeeCount ?? null,
      phone: input.phone?.trim() || null,
      message: input.message?.trim() || null,
      submittedAt: DEMO_TODAY,
    };
    this.demoRequests.push(request);
    return Promise.resolve(request);
  }

  /** Dalla più recente: è l'ordine in cui il back-office le lavora. */
  getDemoRequests(): Promise<DemoRequest[]> {
    return Promise.resolve([...this.demoRequests].reverse());
  }

  // --- Back-office (§10.E) --------------------------------------------------

  getClientCompanies(): Promise<ClientCompany[]> {
    return Promise.resolve(CLIENT_COMPANIES);
  }

  getPlatformMonths(): Promise<PlatformMonth[]> {
    return Promise.resolve(PLATFORM_MONTHS);
  }

  getPlatformUsers(): Promise<PlatformUser[]> {
    return Promise.resolve(PLATFORM_USERS);
  }
}
