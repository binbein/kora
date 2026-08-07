import type { DataProvider } from "../provider";
import {
  sameQuarter,
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
  type RoiSnapshot,
  type SessionEntitlement,
  type SessionNote,
  type StressRecord,
} from "../types";
import { COMPANY, DEPARTMENTS, PLANS, PLAN_LIST } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { LAURA, PROFESSIONALS } from "./people";
import {
  entitlementFor,
  isActivePatient,
  monthlyEarnings,
  payoutHistory,
  PORTAL_PATIENT_EMPLOYEE_ID,
  PORTAL_PROFESSIONAL_ID,
  PORTAL_SESSIONS,
} from "./professional-portal";
import { CURRENT_QUARTER, QUARTERS, ROI_SNAPSHOTS } from "./roi";
import { INITIAL_SLOTS } from "./scheduling";
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
  private readonly notes = new Map<string, SessionNote>();

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
    return Promise.resolve(
      DEPARTMENTS.map((department) => {
        const series = DEPARTMENT_STRESS_HISTORY[department.id];
        return series[series.length - 1];
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

  getProfessionalSessions(
    professionalId: string,
  ): Promise<ProfessionalSession[]> {
    if (professionalId !== PORTAL_PROFESSIONAL_ID) {
      return Promise.resolve([]);
    }
    const sessions = PORTAL_SESSIONS.map((session) => ({
      ...session,
      hasNote: session.hasNote || this.notes.has(session.id),
    }));
    return Promise.resolve(sessions);
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
        entitlement: entitlementFor(patientId),
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
    const professional = await this.getProfessional(professionalId);
    return monthlyEarnings(
      professionalId,
      professional?.sessionFee ?? 0,
      month,
    );
  }

  async getProfessionalPayouts(professionalId: string): Promise<Payout[]> {
    const professional = await this.getProfessional(professionalId);
    return payoutHistory(professional?.sessionFee ?? 0);
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
   * Il contatore di Laura è il conto delle sue sedute erogate, non un numero a
   * parte: è la stessa funzione che alimenta il co-payment dell'elenco pazienti
   * (§5.5). In M3 la prenotazione lo farà salire come conseguenza dell'aggiunta
   * di una seduta, invece che come seconda scrittura.
   */
  getEntitlement(): Promise<SessionEntitlement> {
    return Promise.resolve(entitlementFor(PORTAL_PATIENT_EMPLOYEE_ID));
  }

  /*
   * Gli appuntamenti del dipendente sono le sue sessioni viste dall'altro lato:
   * stesso record, proiezione diversa. Il professionista ne riceve le iniziali,
   * il dipendente il professionista per intero.
   */
  getAppointments(): Promise<Appointment[]> {
    const mine = PORTAL_SESSIONS.filter(
      (session) =>
        session.patientId === PORTAL_PATIENT_EMPLOYEE_ID &&
        session.status !== "cancelled",
    ).map(
      (session): Appointment => ({
        id: session.id,
        kind: "psychologist",
        professionalId: PORTAL_PROFESSIONAL_ID,
        start: session.start,
        durationMinutes: session.durationMinutes,
        status: session.status,
        type: session.type,
      }),
    );
    return Promise.resolve(mine);
  }

  getAvailableSlots(professionalId: string): Promise<AppointmentSlot[]> {
    return Promise.resolve(
      INITIAL_SLOTS.filter((slot) => slot.professionalId === professionalId),
    );
  }
}
