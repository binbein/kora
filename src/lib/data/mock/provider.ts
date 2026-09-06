import { overlaps } from "../../dates";
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
  patientInitials,
  quarterOf,
  sameQuarter,
  serviceOf,
  type Appointment,
  type AppointmentSlot,
  type ProfessionalSlot,
  type SlotStatus,
  type Company,
  type Department,
  type EarlyAlert,
  type EmployeeProfile,
  type PatientSummary,
  type Payout,
  type Plan,
  type PlanId,
  type PlatformSession,
  type Professional,
  type ProfessionalEarnings,
  type ProfessionalSession,
  type Quarter,
  type AssessmentAnswers,
  type HealthProfile,
  type RapidCheckAnswer,
  type RapidCheckLink,
  type RoiSnapshot,
  type Session,
  type SessionEntitlement,
  type SessionNote,
  type StressRecord,
  type UserRole,
} from "../types";
import { healthProfileOf } from "@/lib/health-profile";
import { aiHealthPlanFor } from "./ai-plan";
import {
  CHECKUP_PROVIDERS,
  LAURA_CHECKUP_ELIGIBILITY,
  LAURA_CHECKUP_REPORT,
} from "./checkup";
import { COMPANY, COMPANY_CODE, DEPARTMENTS, PLANS, PLAN_LIST } from "./company";
import {
  employeeEntitlement,
  LAURA_VIRTUAL_DOCTOR_CONSULTS,
} from "./employee-portal";
import { EMPLOYEE_DIRECTORY, HR_REPORTS, INVOICES } from "./hr";
import { DEMO_TODAY } from "./demo-date";
import { LAURA, LAURA_ASSESSMENT, PROFESSIONALS } from "./people";
import { resolveRapidCheckLink } from "./rapid-check";
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
  type StoredSession,
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
  private readonly bookedByProfessional = new Map<string, StoredSession[]>();

  /*
   * Le sedute annullate durante la demo, per id.
   *
   * È una **sovrapposizione** e non una modifica: `PORTAL_SESSIONS` è il
   * dataset curato del §8 e non si tocca, quindi l'annullamento vive qui e
   * `sessionsOf` lo applica in proiezione — come `hasNote`, che nasce dalle note
   * e non dal record memorizzato. Ne discende che un ricaricamento riporta la
   * seduta al suo posto, che è ciò che il §10 dice di tutto lo stato del
   * provider.
   *
   * Porta anche il motivo, benché oggi possa valere una cosa sola: il giorno in
   * cui la disdetta arriva anche dal lato del dipendente
   * (`docs/CONTRATTO-DATI.md` §8.5) a cambiare è chi scrive qui dentro, non la
   * forma.
   */
  private readonly cancellations = new Map<
    string,
    {
      reasonKey: "by_patient" | "by_professional";
      note: string | null;
      /** La riga scritta al paziente; `null` se non ne è stata scritta una */
      message: string | null;
    }
  >();

  /*
   * Le fasce che la professionista ha chiuso durante la demo (01.09.2026).
   *
   * È una **sovrapposizione** su `INITIAL_SLOTS`, come `cancellations` lo è su
   * `PORTAL_SESSIONS`, e per la stessa ragione: il piano delle fasce è dataset
   * curato del §8 e non si tocca, quindi la chiusura vive qui e la lettura la
   * applica in proiezione. Un ricaricamento riporta le fasce al loro posto,
   * come tutto lo stato del provider (`CLAUDE.md` §10).
   *
   * La chiave è `professionalId` più l'istante d'inizio, che è l'identità di
   * una fascia finché le fasce sono generate — il perché sta su
   * `ProfessionalSlot`.
   */
  private readonly closedSlots = new Set<string>();

  /*
   * L'ultima risposta al check rapido. Non entra nelle serie del §8, ed è una
   * scelta: quelle dodici curve raccontano la storia che il pitch spiega, e un
   * tocco fatto davanti a un investitore non deve poterla muovere. Serve a
   * mostrare che il segnale esiste ed è suo — la home rilegge da qui e sa di
   * aver già risposto.
   */
  private lastRapidCheck: RapidCheckAnswer | null = null;

  /*
   * Le dieci risposte dell'assessment, che partono da quelle del §8.
   *
   * **Sono il dato, e il profilo è una lettura**: punteggio, sintesi e area
   * debole si derivano da qui con la formula, quindi rifare l'assessment sposta
   * il profilo, la home, il Profilo e l'ordine delle aree del piano **senza che
   * nessuno di quei quattro punti si allinei a mano** (§5.5).
   *
   * Come tutto lo stato del provider muore con un ricaricamento, e quel giorno
   * Laura torna a 78 (§10).
   */
  private assessment: AssessmentAnswers = LAURA_ASSESSMENT;

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
   *
   * **È l'unico punto che produce `ProfessionalSession`**, e quindi l'unico che
   * decide `hasNote`: l'archivio non porta quel campo (`StoredSession`), e qui
   * si legge dalle note che esistono. Non è un allineamento fra due valori — è
   * lo stesso valore letto in due modi (§5.5).
   */
  private sessionsOf(professionalId: string): ProfessionalSession[] {
    const curated =
      professionalId === PORTAL_PROFESSIONAL_ID ? PORTAL_SESSIONS : [];
    const all = [
      ...curated,
      ...(this.bookedByProfessional.get(professionalId) ?? []),
    ];
    all.sort((a, b) => a.start.getTime() - b.start.getTime());
    return all.map((session) =>
      this.applyCancellation({
        ...session,
        hasNote: this.notes.has(session.id),
      }),
    );
  }

  /*
   * La chiave di una fascia dentro `closedSlots`.
   *
   * Sta in una funzione perché la usano in tre — la lettura, la scrittura e il
   * filtro degli slot liberi — e tre punti che costruiscono la stessa chiave
   * sono tre punti che possono divergere (§5.5).
   */
  private slotKey(professionalId: string, start: Date): string {
    return `${professionalId}@${start.getTime()}`;
  }

  /** Le fasce dichiarate di quel professionista, in ordine di orario. */
  private slotsOf(professionalId: string): AppointmentSlot[] {
    return INITIAL_SLOTS.filter(
      (slot) => slot.professionalId === professionalId,
    ).sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  /**
   * L'annullamento avvenuto durante la demo, applicato in proiezione.
   *
   * Sta in una funzione perché la usano in due — la lettura e la scrittura, che
   * deve restituire la seduta com'è appena diventata — e due punti che
   * costruiscono la stessa forma sono due punti che possono divergere (§5.5).
   *
   * **È l'ultima parola sullo stato**: una seduta annullata non è più "in
   * programma" per nessun lettore — il calendario, gli appuntamenti del
   * dipendente e lo slot che torna libero leggono tutti `status`, ed è la
   * ragione per cui non serve toccarne nessuno.
   */
  private applyCancellation(session: ProfessionalSession): ProfessionalSession {
    const cancelled = this.cancellations.get(session.id);
    if (cancelled === undefined) return session;

    return {
      ...session,
      status: "cancelled",
      cancellationReasonKey: cancelled.reasonKey,
      ...(cancelled.note === null ? {} : { cancellationNote: cancelled.note }),
      ...(cancelled.message === null
        ? {}
        : { cancellationMessage: cancelled.message }),
    };
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

  /**
   * La rilevazione di ogni reparto nel trimestre scelto.
   *
   * **L'ultimo mese del trimestre di cui esiste un record**, non la media dei
   * tre: mediarli darebbe un numero che nessuna rilevazione ha prodotto.
   *
   * IL FILTRO HA DUE CONDIZIONI E LA SECONDA NON È RIDONDANTE. La prima tiene i
   * mesi del trimestre; la seconda scarta quelli **oltre il giorno della demo**,
   * e serve al trimestre in corso — dove "l'ultimo mese del trimestre" e
   * "l'ultimo mese arrivato" sono due cose diverse. Oggi coincidono, perché la
   * serie finisce nel mese di `DEMO_TODAY`; il giorno in cui il dataset
   * arrivasse a fine trimestre la tabella mostrerebbe un mese che non è ancora
   * successo.
   *
   * Il `?? []` è quello di `getStressHistory`, e da solo non basterebbe: su una
   * serie vuota l'ultimo elemento è `undefined`, quindi il buco finirebbe
   * **dentro l'array di ritorno** e la dashboard esploderebbe una riga più in
   * là, leggendo `measuredEmployees` di niente.
   *
   * Un reparto senza record nel trimestre esce dall'elenco invece di comparire
   * con una riga inventata: senza record non c'è un ultimo record, e
   * fabbricarne uno soppresso dichiarerebbe un dato che il provider non ha.
   */
  getStressByDepartment(period: Quarter): Promise<StressRecord[]> {
    return Promise.resolve(
      DEPARTMENTS.flatMap((department) => {
        const inQuarter = (DEPARTMENT_STRESS_HISTORY[department.id] ?? []).filter(
          (record) =>
            sameQuarter(quarterOf(record.month), period) &&
            record.month <= DEMO_TODAY,
        );
        const latest = inQuarter[inQuarter.length - 1];
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

  getProfessionals(): Promise<Professional[]> {
    return Promise.resolve(PROFESSIONALS);
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

  /**
   * La proiezione del back-office: le stesse sedute senza il nome.
   *
   * Si costruisce **dalla stessa lista** che riceve il professionista, campo per
   * campo e non con uno spread: uno spread porterebbe qui ogni campo che
   * `ProfessionalSession` guadagnerà domani — il nome del paziente, la nota di
   * annullamento — e la garanzia del tipo verrebbe aggirata dall'implementazione
   * che dovrebbe rispettarla.
   */
  async getPlatformSessions(
    professionalId: string,
  ): Promise<PlatformSession[]> {
    const sessions = await this.getProfessionalSessions(professionalId);
    return sessions.map((session) => ({
      id: session.id,
      professionalId,
      // il nome non attraversa questo confine, le iniziali sì: si derivano qui
      patientInitials: patientInitials(session),
      start: session.start,
      status: session.status,
      type: session.type,
    }));
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
        patientFirstName: mine[0].patientFirstName,
        patientLastName: mine[0].patientLastName,
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

  /**
   * Annulla una sessione in programma.
   *
   * **Cerca l'id in tutte le agende**, e non in quella del portale: un id di
   * seduta è unico nel dominio, e in produzione a trovarlo è il server. Passare
   * anche il professionista sarebbe un secondo dato che il primo già implica —
   * e che il chiamante potrebbe sbagliare.
   *
   * Lancia anche in produzione, come `requireProfessional` e per la stessa
   * ragione: sono invarianti dell'API, non del dataset. Un backend vero
   * risponderebbe 404 sulla seduta che non c'è e 409 su quella che non si può
   * più annullare.
   */
  async cancelSession(
    sessionId: string,
    input?: { note?: string; message?: string },
  ): Promise<ProfessionalSession> {
    const session = PROFESSIONALS.flatMap((professional) =>
      this.sessionsOf(professional.id),
    ).find((entry) => entry.id === sessionId);

    assertInDevOutsidePromise(
      session !== undefined,
      `"${sessionId}" non è una seduta di nessuna agenda.`,
    );
    if (session === undefined) {
      throw new Error(`Nessuna seduta con id "${sessionId}".`);
    }

    /*
     * LE DUE METÀ DELLA CONDIZIONE, che oggi coincidono e domani no.
     *
     * Qui lo stato si deriva dall'orologio, quindi `scheduled` implica già
     * futura; in produzione lo stato è un evento che qualcuno dichiara
     * (`docs/CONTRATTO-DATI.md` §8.5) e le due si separano — una seduta di ieri
     * che nessuno ha chiuso è ancora `scheduled`, e annullarla toglierebbe un
     * compenso già maturato. Sono una precondizione sola, non due rami: il
     * secondo non è codice irraggiungibile, è la metà che tiene il metodo
     * onesto il giorno del passaggio.
     */
    if (session.status !== "scheduled" || session.start <= DEMO_TODAY) {
      throw new Error(
        `La seduta "${sessionId}" non è annullabile: è ${session.status} e comincia il ${session.start.toISOString()}.`,
      );
    }

    /*
     * Il confine normalizza, come per la richiesta demo: assente, vuoto e soli
     * spazi sono la stessa cosa per chi legge, e diventano `null` una volta
     * sola. **Vale per tutti e due i testi allo stesso modo**, ed è ciò che
     * rende legittimi i quattro casi — solo la nota, solo il messaggio,
     * entrambi, nessuno dei due.
     */
    this.cancellations.set(sessionId, {
      reasonKey: "by_professional",
      note: input?.note?.trim() || null,
      message: input?.message?.trim() || null,
    });

    return this.applyCancellation(session);
  }

  getSessionNote(sessionId: string): Promise<SessionNote | null> {
    return Promise.resolve(this.notes.get(sessionId) ?? null);
  }

  saveSessionNote(note: Omit<SessionNote, "updatedAt">): Promise<SessionNote> {
    const saved: SessionNote = { ...note, updatedAt: DEMO_TODAY };
    this.notes.set(note.sessionId, saved);
    return Promise.resolve(saved);
  }

  /*
   * Il profilo che esce dalle risposte correnti.
   *
   * Sta in una funzione perché la usano in tre — il profilo, il piano di
   * benessere e la scrittura che le sostituisce — e tre punti che ricalcolano
   * la stessa cosa sono tre punti che possono divergere (§5.5).
   */
  private healthProfile(): HealthProfile {
    return healthProfileOf(this.assessment);
  }

  getEmployeeProfile(): Promise<EmployeeProfile> {
    return Promise.resolve({ ...LAURA, healthProfile: this.healthProfile() });
  }

  // --- Attivazione dell'account (§10.A.6) -----------------------------------

  /*
   * Il codice azienda risolve, oppure non risolve.
   *
   * **Il consenso non viene controllato qui**, e non è una dimenticanza: a
   * impedire la chiamata senza consenso è il **tipo**, che è il letterale
   * `true` — un controllo a runtime sarebbe la seconda guardia sullo stesso
   * fatto, e quella che si può togliere.
   *
   * Non scrive niente. Nella demo c'è un cliente solo e un dipendente solo
   * (`docs/CONTRATTO-DATI.md` §7): l'attivazione dice a chi porta il codice, e
   * l'account che creerebbe esiste già.
   */
  activate(input: { companyCode: string; consent: true }): Promise<Company | null> {
    return Promise.resolve(
      input.companyCode.trim().toUpperCase() === COMPANY_CODE ? COMPANY : null,
    );
  }

  /*
   * Le dieci risposte sostituiscono le precedenti, e il profilo esce dalla
   * formula: non c'è nessun punteggio da scrivere accanto.
   *
   * **Non accumula**: non esiste uno storico degli assessment, ed è la
   * semplificazione che salta per prima il giorno in cui il profilo dovrà dire
   * "sta migliorando" (`docs/CONTRATTO-DATI.md` §8.10).
   */
  submitAssessment(answers: AssessmentAnswers): Promise<HealthProfile> {
    this.assessment = answers;
    return Promise.resolve(this.healthProfile());
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

  /*
   * Il piano si ordina sull'area debole **del profilo corrente**, non su quella
   * dell'avvio: da quando le risposte si riscrivono, un ordine congelato
   * direbbe un'area mentre il profilo ne dice un'altra.
   */
  getAiHealthPlan(): Promise<AiHealthPlan> {
    const profile = this.healthProfile();
    const plan = aiHealthPlanFor(profile.weakestArea);

    /*
     * LA HOME LEGGE LA PRIMA AREA DEL PIANO E LA CHIAMA "l'area da cui parte il
     * tuo piano di benessere", mentre il profilo mostra la propria: sono due
     * schermate che affermano lo stesso fatto leggendo due valori diversi.
     *
     * Il guardrail statico di `ai-plan.ts` copre l'avvio e **non può coprire
     * questo**: lì il profilo è quello del §8, qui è quello che l'assessment ha
     * appena prodotto. È il caso che nasce con la scrittura, quindi il controllo
     * nasce con lei.
     */
    assertInDevOutsidePromise(
      plan.areas[0].area === profile.weakestArea,
      `Il piano si apre su "${plan.areas[0].area}" mentre il profilo indica "${profile.weakestArea}": la home direbbe un'area e il profilo un'altra.`,
    );

    return Promise.resolve(plan);
  }

  /*
   * Gli appuntamenti del dipendente sono le sue sessioni viste dall'altro lato:
   * stesso record, proiezione diversa. Il professionista ne riceve il nome, il
   * dipendente il professionista per intero.
   *
   * Dalla più imminente: il contratto promette quell'ordine, quindi lo
   * garantisce l'implementazione e non l'ordinamento con cui il dataset è
   * costruito — la prenotazione aggiunge sedute a runtime.
   *
   * QUALI SEDUTE, E PERCHÉ NON SOLO LE `scheduled` (18.08.2026). Ci sono anche
   * le **annullate ancora future**: senza, una disdetta della professionista
   * faceva sparire la riga e il dipendente non aveva nessun modo di sapere che
   * c'era stata. Le **erogate** restano fuori come sono sempre state — quelle
   * sono il contatore.
   *
   * Un'annullata **passata** esce da sé, con la stessa condizione che regge le
   * altre: quando la sua ora è passata non è più un appuntamento. È anche il
   * motivo per cui l'avviso non ha bisogno di un gesto per toglierlo.
   */
  getAppointments(): Promise<Appointment[]> {
    const mine: Appointment[] = [];

    for (const professional of PROFESSIONALS) {
      for (const session of this.sessionsOf(professional.id)) {
        if (session.patientId !== PORTAL_PATIENT_EMPLOYEE_ID) continue;
        const upcomingCancellation =
          session.status === "cancelled" && session.start > DEMO_TODAY;
        if (session.status !== "scheduled" && !upcomingCancellation) continue;
        const appuntamento: Appointment = {
          id: session.id,
          kind: serviceOf(professional),
          professionalId: professional.id,
          start: session.start,
          durationMinutes: session.durationMinutes,
          status: session.status,
          type: session.type,
          /* Lo spread condizionale, come per la nota: assegnare sempre il campo
             mette la proprietà con dentro `undefined` anche su una seduta in
             programma, e il §2 del contratto dice che un campo `?` **non c'è**
             quando non pertiene. */
          ...(session.cancellationReasonKey === undefined
            ? {}
            : { cancellationReasonKey: session.cancellationReasonKey }),
          /* IL MESSAGGIO PASSA, LA NOTA NO, ed è l'unico punto in cui la
             separazione si esegue invece di essere dichiarata: `message` è
             nato per essere letto dal paziente, `note` no, e qui il secondo
             non ha nemmeno un campo dove andare (01.09.2026). Il guardrail
             qui sotto sorveglia che resti così. */
          ...(session.cancellationMessage === undefined
            ? {}
            : { cancellationMessage: session.cancellationMessage }),
        };
        mine.push(appuntamento);

        /*
         * NESSUN APPUNTAMENTO PORTA IL TESTO DI UNA NOTA PRIVATA (§5.6).
         *
         * **SONO DUE CONTROLLI E COLGONO DUE MINACCE DIVERSE**, ed è la riga da
         * leggere prima di toglierne uno credendolo il duplicato dell'altro:
         *
         * - **la forma** coglie il refactor che unifica i due campi "perché si
         *   assomigliano", che è la minaccia per cui questo guardrail esiste.
         *   Un refactor del genere fa arrivare qui la chiave, e la chiave o
         *   c'è o non c'è: non può dare falsi allarmi;
         * - **il testo** coglie il campo **rinominato**, che la forma non
         *   vede: `cancellationNote` che diventa `noteForPatient` passerebbe
         *   un controllo sulla chiave portandosi dietro il testo.
         *
         * IL TESTO SI CONFRONTA VALORE PER VALORE, e non cercando una
         * sottostringa nella serializzazione: quella versione dava un **falso
         * allarme su un caso normale** — nota "malata" dentro messaggio "Sono
         * malata, ti ricontatto io" — perché la serializzazione contiene il
         * messaggio, che contiene la nota. Riprodotto prima di correggerlo.
         *
         * `cancellationMessage` è **l'unico valore escluso dal confronto**, e
         * non è una scorciatoia: è il campo che la nota può legittimamente
         * eguagliare, quando chi scrive mette lo stesso testo in tutti e due.
         * La versione precedente lo trattava come una via d'uscita
         * sull'assert intero — `nota === message` faceva passare tutto — e
         * quella via era **cieca proprio sul bersaglio**, perché il refactor
         * che unifica i due campi produce esattamente quell'uguaglianza.
         *
         * `assertInDevOutsidePromise` e non `assertInDev`: questo metodo lo
         * chiama react-query, che cattura, quindi un `throw` finirebbe nello
         * stato di errore della query dove nessuno lo guarda — è la stessa
         * ragione scritta su `requireProfessional`.
         */
        assertInDevOutsidePromise(
          !("cancellationNote" in appuntamento),
          `L'appuntamento della seduta "${session.id}" ha un campo "cancellationNote": i due campi della disdetta sono stati unificati, e la nota privata esce verso il dipendente.`,
        );

        const nota = session.cancellationNote;
        assertInDevOutsidePromise(
          nota === undefined ||
            !Object.entries(appuntamento).some(
              ([chiave, valore]) =>
                chiave !== "cancellationMessage" && valore === nota,
            ),
          `Il testo della nota privata della seduta "${session.id}" è finito in un campo dell'appuntamento del dipendente.`,
        );
      }
    }

    mine.sort((a, b) => a.start.getTime() - b.start.getTime());
    return Promise.resolve(mine);
  }

  /**
   * Disdice un appuntamento, dal lato del dipendente (§10.B.5).
   *
   * **Scrive nella stessa mappa di `cancelSession`**, cambiando solo il motivo:
   * da lì `applyCancellation` proietta l'annullamento sui tre lati — il
   * calendario della professionista, la lista sedute e la home del dipendente —
   * senza una riga di codice in più. È la ragione per cui quella mappa portava
   * il motivo da prima che qualcuno potesse scrivere `by_patient`: a cambiare è
   * chi scrive, non la forma.
   *
   * **Cerca fra i propri appuntamenti**, cioè nella lista che `getAppointments`
   * restituisce, e non fra tutte le sedute del dominio come fa `cancelSession`:
   * da qui **"non trovato" copre già "non è tuo"** senza un quarto rifiuto. Una
   * seduta erogata non è in quella lista, ed è giusto che risponda così: non è
   * un appuntamento.
   *
   * Lancia anche in produzione, come `cancelSession` e per la stessa ragione:
   * sono invarianti dell'API, non del dataset — un backend risponderebbe 404 su
   * ciò che non trova e 409 su ciò che non si può più annullare.
   */
  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = (await this.getAppointments()).find(
      (entry) => entry.id === appointmentId,
    );

    assertInDevOutsidePromise(
      appointment !== undefined,
      `"${appointmentId}" non è un appuntamento del dipendente: o non esiste, o è di qualcun altro.`,
    );
    if (appointment === undefined) {
      throw new Error(`Nessun appuntamento con id "${appointmentId}".`);
    }

    /*
     * I DUE RIFIUTI SONO SEPARATI, e nell'altro verso sono una condizione sola.
     *
     * Non è incoerenza: là le due metà coincidono per costruzione — lo stato si
     * deriva dall'orologio — e il commento lo dice. Qui la prima è
     * **raggiungibile davvero**, perché `getAppointments` restituisce anche le
     * annullate ancora future: chi tiene la home aperta mentre la
     * professionista disdice ha davanti un pulsante su una seduta che non è più
     * in programma. Separarle è ciò che distingue "l'ha già annullata qualcuno"
     * da "è troppo tardi" per chi legge il messaggio.
     */
    assertInDevOutsidePromise(
      appointment.status === "scheduled",
      `L'appuntamento "${appointmentId}" è ${appointment.status}: la home sta offrendo di annullare qualcosa che non è in programma.`,
    );
    if (appointment.status !== "scheduled") {
      throw new Error(
        `L'appuntamento "${appointmentId}" non è in programma: è ${appointment.status}.`,
      );
    }

    assertInDevOutsidePromise(
      appointment.start > DEMO_TODAY,
      `L'appuntamento "${appointmentId}" comincia il ${appointment.start.toISOString()}, che non è nel futuro: la home sta offrendo di annullare una seduta già cominciata.`,
    );
    if (appointment.start <= DEMO_TODAY) {
      throw new Error(
        `L'appuntamento "${appointmentId}" è già cominciato il ${appointment.start.toISOString()}.`,
      );
    }

    /*
     * Nessun testo, e i due campi nascono `null` invece di restare fuori: la
     * mappa li dichiara, e un `null` esplicito dice **non ne è stato scritto
     * nessuno** dove un campo assente direbbe che la forma è un'altra. Il
     * perché non ci siano sta in `provider.ts`.
     */
    this.cancellations.set(appointmentId, {
      reasonKey: "by_patient",
      note: null,
      message: null,
    });

    /*
     * Si rilegge invece di comporre la risposta a mano, ed è la stessa scelta
     * di `cancelSession`, che restituisce `applyCancellation(session)`: la
     * proiezione di un appuntamento la costruisce `getAppointments` e nessun
     * altro, quindi ricostruirla qui sarebbero due forme che possono divergere
     * (§5.5).
     *
     * **Non può mancare**: quella lista tiene le annullate ancora future, ed è
     * la ragione per cui esiste dal 18.08.2026. Il ramo è il prezzo di avere
     * una proiezione sola, non un caso da gestire.
     */
    const cancelled = (await this.getAppointments()).find(
      (entry) => entry.id === appointmentId,
    );
    if (cancelled === undefined) {
      throw new Error(
        `L'appuntamento "${appointmentId}" è sparito dalla lista subito dopo essere stato annullato.`,
      );
    }
    return cancelled;
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
    /*
     * OCCUPATO VUOL DIRE SOVRAPPOSTO, NON "COMINCIA ALLO STESSO ISTANTE"
     * (16.08.2026).
     *
     * Era un insieme di istanti d'inizio, quindi uno slot che invade a metà una
     * seduta già in agenda veniva **offerto** — e poi prenotato, perché il
     * controllo della prenotazione guardava lo stesso istante. Il dataset di
     * oggi non lo produce, ma è il difetto corretto sugli slot fra loro il
     * 15.08.2026 e lasciato asimmetrico da questo lato.
     */
    /*
     * LA SECONDA SOTTRAZIONE: LE FASCE CHIUSE (01.09.2026).
     *
     * Fino a qui l'elenco toglieva una cosa sola — le fasce occupate da una
     * seduta — e l'unico modo che la professionista aveva di liberarsi un'ora
     * era che ci fosse una seduta da annullare. Un impegno personale su un'ora
     * libera non aveva nessuna rappresentazione, e quell'ora restava
     * prenotabile.
     *
     * **Le due sottrazioni sono indipendenti**: una fascia può essere chiusa e
     * occupata insieme, e ognuna basta da sola a toglierla dai proponibili.
     */
    const busy = this.sessionsOf(professionalId).filter(
      (session) => session.status !== "cancelled",
    );
    return Promise.resolve(
      this.slotsOf(professionalId).filter(
        (slot) =>
          !this.closedSlots.has(this.slotKey(professionalId, slot.start)) &&
          !busy.some((session) =>
            overlaps(
              slot.start,
              slot.durationMinutes,
              session.start,
              session.durationMinutes,
            ),
          ),
      ),
    );
  }

  getProfessionalSlots(professionalId: string): Promise<ProfessionalSlot[]> {
    return Promise.resolve(
      this.slotsOf(professionalId).map(({ start, durationMinutes }) => ({
        start,
        durationMinutes,
        status: this.closedSlots.has(this.slotKey(professionalId, start))
          ? ("closed" as const)
          : ("open" as const),
      })),
    );
  }

  /*
   * Apre o chiude una fascia. I tre rifiuti e la loro natura stanno
   * sull'interfaccia, che è dove li legge chi scriverà il backend.
   *
   * Lancia anche in produzione, come `requireProfessional` e `cancelSession`:
   * sono invarianti dell'API e non del dataset, e un'implementazione che al
   * loro posto inventasse un esito farebbe sparire il difetto invece di
   * mostrarlo.
   */
  async setSlotStatus(
    professionalId: string,
    start: Date,
    status: SlotStatus,
  ): Promise<ProfessionalSlot> {
    const slot = this.slotsOf(professionalId).find(
      (entry) => entry.start.getTime() === start.getTime(),
    );

    assertInDevOutsidePromise(
      slot !== undefined,
      `${professionalId} non ha una fascia che comincia alle ${start.toISOString()}.`,
    );
    if (slot === undefined) {
      throw new Error(
        `Nessuna fascia di "${professionalId}" alle ${start.toISOString()}.`,
      );
    }

    /*
     * Le due precondizioni, e sono di natura diversa — il perché sta sul
     * metodo dell'interfaccia. La prima è del dominio e vale identica in
     * produzione; la seconda è la stessa regola con l'orologio della demo al
     * posto di quello vero (`CLAUDE.md` §5.4).
     */
    const occupata = this.sessionsOf(professionalId).some(
      (session) =>
        session.status === "scheduled" &&
        overlaps(
          slot.start,
          slot.durationMinutes,
          session.start,
          session.durationMinutes,
        ),
    );
    if (occupata) {
      throw new Error(
        `La fascia di "${professionalId}" alle ${start.toISOString()} è occupata da una seduta in programma: per liberarla si annulla la seduta.`,
      );
    }
    if (slot.start <= DEMO_TODAY) {
      throw new Error(
        `La fascia di "${professionalId}" alle ${start.toISOString()} è passata.`,
      );
    }

    const key = this.slotKey(professionalId, slot.start);
    if (status === "closed") this.closedSlots.add(key);
    else this.closedSlots.delete(key);

    return {
      start: slot.start,
      durationMinutes: slot.durationMinutes,
      status,
    };
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
     *
     * **Intervalli e non istanti** (16.08.2026), come il filtro che decide cosa
     * è libero: guardando il solo inizio, una fascia che ne invade un'altra
     * passava di qui in silenzio.
     */
    assertInDevOutsidePromise(
      !agenda.some(
        (session) =>
          session.status !== "cancelled" &&
          overlaps(
            slot.start,
            slot.durationMinutes,
            session.start,
            session.durationMinutes,
          ),
      ),
      "Prenotata una fascia che si sovrappone a una seduta già in agenda: la schermata sta proponendo uno slot occupato.",
    );

    assertInDevOutsidePromise(
      slot.start.getDay() !== 0 && slot.start.getDay() !== 6,
      "Prenotata una seduta nel fine settimana.",
    );

    /*
     * UNA FASCIA CHIUSA NON SI PRENOTA, E IL CONTROLLO STA QUI (01.09.2026).
     *
     * `getAvailableSlots` la toglie già dall'elenco, ma verificarlo **là**
     * sarebbe tautologico — è la stessa funzione che decide cosa è libero,
     * quindi se il suo filtro si rompe si rompe anche la verifica. È la
     * ragione già scritta sui due controlli qui sopra, applicata alla
     * sottrazione nuova: si guarda **l'archivio delle chiuse**, che è
     * indipendente da chi costruisce l'elenco.
     *
     * Il caso che coglie non è teorico: chi prenota tiene lo slot in uno stato
     * locale (`Psicologi.tsx`), quindi fra l'elenco e la conferma la fascia può
     * essere stata chiusa dall'altro lato del marketplace.
     */
    assertInDevOutsidePromise(
      !this.closedSlots.has(this.slotKey(slot.professionalId, slot.start)),
      `Prenotata la fascia di ${slot.professionalId} alle ${slot.start.toISOString()}, che è chiusa: la schermata sta proponendo uno slot che la professionista ha tolto.`,
    );

    /*
     * IL TERZO CONTROLLO GUARDA L'AGENDA DEL PAZIENTE, non quella del
     * professionista, ed è l'unica che possa rispondere alla domanda: il
     * dipendente ha già qualcosa in quella fascia?
     *
     * I due controlli qui sopra non lo vedono, e per costruzione: guardano un
     * professionista alla volta, mentre chi prenota può avere sedute con
     * chiunque. Due slot di professionisti diversi che si accavallano passavano
     * entrambi, e la home elencava due sedute sovrapposte — è successo, ed è la
     * ragione per cui questo controllo esiste (`scheduling.ts` ha il gemello
     * statico sugli slot proponibili).
     *
     * **Intervalli e non istanti**: sullo stesso inizio rispondeva già il primo
     * controllo, e il caso vero era uno slot che ne invade un altro di venti
     * minuti. Vale la stessa esenzione delle annullate: quella fascia è tornata
     * libera davvero.
     */
    const patientAgenda = PROFESSIONALS.flatMap((professional) =>
      sessionsOfPatient(
        PORTAL_PATIENT_EMPLOYEE_ID,
        this.sessionsOf(professional.id),
      ),
    );
    assertInDevOutsidePromise(
      !patientAgenda.some(
        (session) =>
          session.status !== "cancelled" &&
          overlaps(
            slot.start,
            slot.durationMinutes,
            session.start,
            session.durationMinutes,
          ),
      ),
      "Prenotata una seduta che si sovrappone a un'altra dello stesso dipendente: la schermata sta proponendo una fascia già occupata.",
    );

    const mine = sessionsOfPatient(PORTAL_PATIENT_EMPLOYEE_ID, agenda);

    const session: StoredSession = {
      // deterministico: lo stesso slot non può produrre due id diversi
      id: `booked-${slot.professionalId}-${slot.start.getTime()}`,
      patientId: PORTAL_PATIENT_EMPLOYEE_ID,
      // il nome viene dal profilo, non riscritto qui: è la stessa persona che il
      // portale dipendente mostra, e due stringhe uguali possono divergere
      patientFirstName: LAURA.firstName,
      patientLastName: LAURA.lastName,
      start: slot.start,
      durationMinutes: slot.durationMinutes,
      status: "scheduled",
      // primo colloquio se è la prima volta con questo professionista: è la
      // stessa distinzione che il suo calendario mostra
      type: mine.length === 0 ? "first_visit" : "session",
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

  getRapidCheckLink(token: string): Promise<RapidCheckLink | null> {
    return Promise.resolve(resolveRapidCheckLink(token));
  }

  /*
   * Senza il token risponde la persona autenticata, e il suo reparto lo sa il
   * provider — in produzione lo saprà la sessione. È la stessa ragione per cui
   * `getCompany()` non prende un identificatore (§7 del contratto).
   *
   * CON IL TOKEN LA RISPOSTA NON È DI NESSUNO, ed è la parte da non
   * scorciare: porta il reparto del link, **non porta `employeeId`** e **non
   * tocca `lastRapidCheck`**. Quello è ciò che `getRapidCheckAnswer`
   * restituisce, cioè la risposta di chi ha l'account: scriverci dentro
   * farebbe comparire nella home di Laura la risposta di uno sconosciuto, che
   * è l'esatto contrario della garanzia per cui il link è anonimo. La
   * schermata anonima legge l'esito dalla mutation, che è l'unico posto in cui
   * esiste.
   *
   * **Non tocca le serie del §8.** Le dodici curve della dashboard sono la
   * storia che il pitch racconta, e un tocco fatto davanti a un investitore non
   * deve poterla muovere: qui si dimostra che il segnale esiste, non lo si
   * aggrega. Vale per tutte e due le strade.
   */
  submitRapidCheck(
    value: RapidCheckAnswer["value"],
    options?: { token: string },
  ): Promise<RapidCheckAnswer> {
    if (options !== undefined) {
      const link = resolveRapidCheckLink(options.token);
      /*
       * Un link scaduto o inventato non scrive nel reparto di nessuno. La
       * schermata non ci arriva — con un token che non risolve mostra il vuoto
       * e non la card — ma il rifiuto sta sul metodo, come per
       * `cancelSession` e `setSlotStatus`: è il contratto a dire cosa è
       * ammesso, non chi lo chiama.
       */
      if (link === null) {
        return Promise.reject(
          new Error(`Il link "${options.token}" non è valido.`),
        );
      }

      return Promise.resolve({
        departmentId: link.departmentId,
        value,
        answeredAt: DEMO_TODAY,
      });
    }

    const answer: RapidCheckAnswer = {
      departmentId: LAURA.departmentId,
      employeeId: LAURA.id,
      value,
      answeredAt: DEMO_TODAY,
    };
    this.lastRapidCheck = answer;
    return Promise.resolve(answer);
  }

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

  /*
   * La richiesta di demo (§10.A.4).
   *
   * L'id è progressivo e la data è quella della demo: nessun `Math.random()` e
   * nessun `new Date()`, come per la prenotazione. Due invii identici restano
   * due richieste, perché lo sono — a differenza di uno slot, che è occupato o
   * libero.
   */
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
