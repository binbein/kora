import type { DataProvider } from "../provider";
import {
  sameQuarter,
  type Appointment,
  type AppointmentSlot,
  type Company,
  type Department,
  type EarlyAlert,
  type EmployeeProfile,
  type Plan,
  type PlanId,
  type Professional,
  type ProfessionalEarnings,
  type ProfessionalFilter,
  type Quarter,
  type RoiSnapshot,
  type SessionEntitlement,
  type StressRecord,
} from "../types";
import { COMPANY, DEPARTMENTS, PLANS, PLAN_LIST } from "./company";
import { DEMO_TODAY } from "./demo-date";
import {
  monthlyEarnings,
  PORTAL_MONTH,
  PORTAL_PROFESSIONAL_ID,
  PORTAL_SESSIONS,
} from "./professional-portal";
import { LAURA, PROFESSIONALS } from "./people";
import { CURRENT_QUARTER, QUARTERS, ROI_SNAPSHOTS } from "./roi";
import {
  COMPANY_STRESS_HISTORY,
  DEPARTMENT_STRESS_HISTORY,
  EARLY_ALERT,
} from "./stress";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_ENTITLEMENT,
  INITIAL_SLOTS,
} from "./scheduling";

/*
 * Implementazione mock del contratto di §5.
 *
 * I dataset importati qui sopra sono immutabili: quello che cambia durante la
 * demo vive nei campi privati di questa classe, e ogni mutazione alza un
 * contatore di versione a cui React si aggancia. Non c'è nessuno store
 * globale e nessuna libreria di stato: quando al posto del mock arriverà una
 * API, sparisce questo file e non le schermate.
 */
export class MockDataProvider implements DataProvider {
  #appointments: Appointment[] = [];
  #entitlement: SessionEntitlement = { ...INITIAL_ENTITLEMENT };
  #bookedSlots = new Set<string>();
  #version = 0;
  #listeners = new Set<() => void>();

  constructor() {
    this.reset();
  }

  // --- Azienda e dashboard HR ---------------------------------------------

  getCompany(): Company {
    return COMPANY;
  }

  getDepartments(): Department[] {
    return DEPARTMENTS;
  }

  getPlans(): Plan[] {
    return PLAN_LIST;
  }

  /* `PLANS` è un Record su PlanId: ogni identificatore ha il suo piano, quindi
     qui non c'è un caso "non trovato" da gestire. */
  getPlan(id: PlanId): Plan {
    return PLANS[id];
  }

  getStressHistory(departmentId?: string): StressRecord[] {
    if (departmentId === undefined) return COMPANY_STRESS_HISTORY;
    return DEPARTMENT_STRESS_HISTORY[departmentId] ?? [];
  }

  getLatestStressByDepartment(): StressRecord[] {
    return DEPARTMENTS.map((department) => {
      const series = this.getStressHistory(department.id);
      const latest = series[series.length - 1];
      // un reparto senza serie non ha un dato da mostrare, non ne ha uno pari a zero
      return (
        latest ?? {
          month: new Date(),
          departmentId: department.id,
          suppressed: true,
        }
      );
    });
  }

  getQuarters(): Quarter[] {
    return QUARTERS;
  }

  getCurrentQuarter(): Quarter {
    return CURRENT_QUARTER;
  }

  getRoiSnapshot(period: Quarter): RoiSnapshot {
    const snapshot = ROI_SNAPSHOTS.find((entry) =>
      sameQuarter(entry.period, period),
    );
    if (!snapshot) {
      /*
       * Meglio fermarsi che disegnare un trimestre vuoto: se il selettore
       * offre un periodo, il dataset deve averlo, e uno svarione si deve
       * vedere in sviluppo, non durante il pitch.
       */
      throw new Error(
        `Nessuno snapshot ROI per ${period.year}-Q${period.quarter}`,
      );
    }
    return snapshot;
  }

  getEarlyAlert(): EarlyAlert | undefined {
    return EARLY_ALERT;
  }

  getReferenceDate(): Date {
    return DEMO_TODAY;
  }

  // --- Portale professionista (§8.D) ---------------------------------------

  getPortalProfessional(): Professional {
    return this.#requireProfessional(PORTAL_PROFESSIONAL_ID);
  }

  getProfessionalSessions(professionalId: string): Appointment[] {
    const fromDataset = PORTAL_SESSIONS.filter(
      (session) => session.professionalId === professionalId,
    );
    /* Le prenotazioni della demo vivono nello stato del provider, non nel
       dataset: senza di loro il calendario del professionista non mostrerebbe
       la sessione appena prenotata dal dipendente. */
    const booked = this.#appointments.filter(
      (appointment) => appointment.professionalId === professionalId,
    );
    return [...fromDataset, ...booked].sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
  }

  getProfessionalEarnings(professionalId: string): ProfessionalEarnings {
    const professional = this.#requireProfessional(professionalId);
    return monthlyEarnings(
      professionalId,
      this.getProfessionalSessions(professionalId),
      professional.sessionFee,
      PORTAL_MONTH,
      DEMO_TODAY,
    );
  }

  /* Un id che non esiste è uno svarione da vedere in sviluppo, non un portale
     vuoto da spiegare durante il pitch. */
  #requireProfessional(id: string): Professional {
    const professional = this.getProfessionalById(id);
    if (!professional) throw new Error(`Nessun professionista con id ${id}`);
    return professional;
  }

  // --- Percorso dipendente -------------------------------------------------

  getEmployeeProfile(): EmployeeProfile {
    return LAURA;
  }

  getProfessionals(filter?: ProfessionalFilter): Professional[] {
    return PROFESSIONALS.filter((professional) => {
      if (filter?.specialty && professional.specialty !== filter.specialty) {
        return false;
      }
      if (
        filter?.language &&
        !professional.languages.includes(filter.language)
      ) {
        return false;
      }
      return true;
    });
  }

  getProfessionalById(id: string): Professional | undefined {
    return PROFESSIONALS.find((professional) => professional.id === id);
  }

  getEntitlement(): SessionEntitlement {
    return this.#entitlement;
  }

  getAppointments(): Appointment[] {
    return this.#appointments;
  }

  getAvailableSlots(professionalId: string): AppointmentSlot[] {
    return INITIAL_SLOTS.filter(
      (slot) =>
        slot.professionalId === professionalId &&
        !this.#bookedSlots.has(slotKey(slot)),
    );
  }

  bookAppointment(slot: AppointmentSlot): Appointment {
    const key = slotKey(slot);
    if (this.#bookedSlots.has(key)) {
      throw new Error(`Slot già prenotato: ${key}`);
    }

    const appointment: Appointment = {
      id: `appointment-${key}`,
      kind: "psychologist",
      professionalId: slot.professionalId,
      start: slot.start,
      durationMinutes: slot.durationMinutes,
      status: "scheduled",
    };

    this.#bookedSlots.add(key);
    this.#appointments = [...this.#appointments, appointment].sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );

    /*
     * Il contatore sessioni si muove insieme alla prenotazione: è la cosa che
     * si guarda durante la demo, e vederlo salire subito dopo la conferma è
     * metà del punto della schermata (§8.B).
     *
     * Oltre il cap non si scende sotto zero né si sfora: le sessioni in più
     * esistono e si pagano (§7), quindi `used` può superare `total`, ma la
     * barra si ferma al 100% — quello lo gestisce SessionMeter.
     */
    this.#entitlement = {
      ...this.#entitlement,
      used: this.#entitlement.used + 1,
    };

    this.#emit();
    return appointment;
  }

  reset(): void {
    this.#appointments = INITIAL_APPOINTMENTS.map((appointment) => ({
      ...appointment,
    })).sort((a, b) => a.start.getTime() - b.start.getTime());
    this.#entitlement = { ...INITIAL_ENTITLEMENT };
    this.#bookedSlots = new Set(
      INITIAL_APPOINTMENTS.map((appointment) =>
        slotKey({
          professionalId: appointment.professionalId,
          start: appointment.start,
          durationMinutes: appointment.durationMinutes,
        }),
      ),
    );
    this.#emit();
  }

  // --- Notifiche di cambiamento -------------------------------------------

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  getVersion(): number {
    return this.#version;
  }

  #emit(): void {
    this.#version += 1;
    for (const listener of this.#listeners) listener();
  }
}

/** Chiave stabile di uno slot: professionista + istante. */
function slotKey(slot: AppointmentSlot): string {
  return `${slot.professionalId}-${slot.start.getTime()}`;
}
