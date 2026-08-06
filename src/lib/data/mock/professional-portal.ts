import { addDays, startOfWeek } from "../../dates";
import { assertInDev } from "../guardrails";
import type {
  Payout,
  ProfessionalEarnings,
  ProfessionalSession,
  SessionType,
} from "../types";
import { DEMO_TODAY } from "./demo-date";
import { FULL_CAPACITY, PROFESSIONALS } from "./people";
import { INITIAL_SLOTS, SESSION_DURATION_MINUTES } from "./scheduling";

/*
 * L'agenda della Dr.ssa Meier (CLAUDE.md §10.D).
 *
 * È il portale della professionista che il dipendente prenota in §10.B, quindi
 * **le sessioni di Laura sono queste sessioni**, non una seconda lista: la home
 * del dipendente e il calendario della professionista proiettano lo stesso
 * record. È anche ciò che rende reggibile, il giorno in cui M3 costruisce la
 * prenotazione, la prova del §10.D — una prenotazione nuova entra qui dentro e
 * compare da tutti e due i lati perché è una cosa sola.
 *
 * L'agenda non è scritta riga per riga: ogni paziente ha il suo slot
 * settimanale ricorrente, che è come funziona davvero un percorso di terapia, e
 * le sessioni si generano da lì. Una lista scritta a mano si riconosce — gli
 * orari finiscono tutti tondi o tutti diversi — e andrebbe riscritta da capo
 * per cambiare un solo parametro.
 */

export const PORTAL_PROFESSIONAL_ID = "meier";

/** L'id del dipendente della demo, che è anche una paziente della Dr.ssa Meier. */
export const PORTAL_PATIENT_EMPLOYEE_ID = "laura-bernasconi";

type PatientSlot = {
  patientId: string;
  /** È tutto ciò che il professionista riceve del nome (§10.D) */
  initials: string;
  /** 1 = lunedì … 5 = venerdì. Sabato e domenica non lavora. */
  weekday: number;
  hour: number;
  minute: number;
  /**
   * Da quante settimane dura il percorso. Negativo = il primo incontro deve
   * ancora avvenire, ed è così che si ottiene un paziente nuovo senza scrivere
   * "nuovo" da nessuna parte: non ha sessioni erogate perché non ne ha fatte.
   */
  weeksInTherapy: number;
};

/*
 * I sei percorsi in corso. Le iniziali sono quelle che la demo ereditata usava
 * già; `L.B.` è Laura Bernasconi, il che chiude il cerchio fra le due aree.
 *
 * Gli orari non si sovrappongono mai e stanno tutti in giornata lavorativa. La
 * durata dei percorsi è volutamente diversa: sei pazienti iniziati la stessa
 * settimana sarebbero un'agenda generata da un ciclo, non uno studio.
 */
const PATIENTS: PatientSlot[] = [
  { patientId: "gr", initials: "G.R.", weekday: 1, hour: 10, minute: 0, weeksInTherapy: 30 },
  { patientId: "mb", initials: "M.B.", weekday: 1, hour: 14, minute: 0, weeksInTherapy: 18 },
  { patientId: "ek", initials: "E.K.", weekday: 2, hour: 11, minute: 0, weeksInTherapy: -1 },
  { patientId: "sc", initials: "S.C.", weekday: 3, hour: 16, minute: 0, weeksInTherapy: 24 },
  {
    patientId: PORTAL_PATIENT_EMPLOYEE_ID,
    initials: "L.B.",
    weekday: 4,
    hour: 17,
    minute: 30,
    // tre sessioni erogate e la quarta domani: è il 3/10 del §8, e il contatore
    // del dipendente non è un numero a parte ma il conto di queste
    weeksInTherapy: 3,
  },
  { patientId: "at", initials: "A.T.", weekday: 5, hour: 9, minute: 0, weeksInTherapy: 12 },
];

/**
 * Sessioni annullate, indicate come settimane prima di oggi sullo slot del
 * paziente. Una cancellazione è un fatto isolato, non una regola: si dichiara,
 * ma la data continua a derivarsi.
 */
const CANCELLATIONS: { patientId: string; weeksAgo: number }[] = [
  { patientId: "at", weeksAgo: 2 },
];

/** Sessioni a settimana secondo gli slot: il regime che la Dr.ssa Meier tiene. */
export const SESSIONS_PER_WEEK = PATIENTS.length;

/** Il mese che il portale riepiloga: quello del giorno della demo. */
export const PORTAL_MONTH = new Date(
  DEMO_TODAY.getFullYear(),
  DEMO_TODAY.getMonth(),
  1,
);

/** L'ultimo giorno coperto dall'agenda: la fine del mese di riferimento. */
const HORIZON = new Date(
  PORTAL_MONTH.getFullYear(),
  PORTAL_MONTH.getMonth() + 1,
  0,
  23,
  59,
);

/** La ricorrenza di un paziente nella settimana spostata di `weekOffset`. */
function occurrence(slot: PatientSlot, weekOffset: number): Date {
  const monday = addDays(startOfWeek(DEMO_TODAY), weekOffset * 7);
  const day = addDays(monday, slot.weekday - 1);
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    slot.hour,
    slot.minute,
  );
}

function buildSessions(): ProfessionalSession[] {
  const sessions: ProfessionalSession[] = [];

  for (const slot of PATIENTS) {
    let emitted = 0;

    for (
      let weekOffset = -slot.weeksInTherapy;
      occurrence(slot, weekOffset) <= HORIZON;
      weekOffset += 1
    ) {
      const start = occurrence(slot, weekOffset);
      const cancelled = CANCELLATIONS.some(
        (entry) =>
          entry.patientId === slot.patientId &&
          occurrence(slot, -entry.weeksAgo).getTime() === start.getTime(),
      );

      /*
       * Il tipo si deriva dalla posizione nel percorso: il primo incontro è una
       * prima visita, e la sessione che riprende dopo un'assenza è un
       * follow-up. Scriverlo sul singolo record vorrebbe dire poterlo
       * contraddire — un paziente con due prime visite, o con la prima visita a
       * metà percorso.
       */
      const followsCancellation = CANCELLATIONS.some(
        (entry) =>
          entry.patientId === slot.patientId &&
          occurrence(slot, -entry.weeksAgo + 1).getTime() === start.getTime(),
      );
      const type: SessionType = cancelled
        ? "session"
        : emitted === 0
          ? "first_visit"
          : followsCancellation
            ? "follow_up"
            : "session";

      sessions.push({
        id: `session-${slot.patientId}-${start.getTime()}`,
        patientId: slot.patientId,
        patientInitials: slot.initials,
        start,
        durationMinutes: SESSION_DURATION_MINUTES,
        status: cancelled
          ? "cancelled"
          : start < DEMO_TODAY
            ? "completed"
            : "scheduled",
        type,
        // la nota si scrive dopo la seduta, quindi l'ultima erogata di ogni
        // paziente non ce l'ha ancora: è quella su cui il professionista sta per
        // scrivere, ed è anche l'unico modo perché il pulsante "aggiungi nota"
        // esista davvero invece di essere sempre "nota"
        hasNote: false,
        ...(cancelled ? { cancellationReasonKey: "by_patient" as const } : {}),
      });

      if (!cancelled) emitted += 1;
    }
  }

  const sorted = sessions.sort((a, b) => a.start.getTime() - b.start.getTime());

  for (const session of sorted) {
    if (session.status !== "completed") continue;
    session.hasNote = sorted.some(
      (other) =>
        other.patientId === session.patientId &&
        other.status === "completed" &&
        other.start > session.start,
    );
  }

  return sorted;
}

/** Tutte le sessioni della Dr.ssa Meier, dalla più vecchia alla più recente. */
export const PORTAL_SESSIONS: ProfessionalSession[] = buildSessions();

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function deliveredIn(month: Date): ProfessionalSession[] {
  return PORTAL_SESSIONS.filter(
    (session) => session.status === "completed" && sameMonth(session.start, month),
  );
}

/**
 * Riepilogo compensi di un mese.
 *
 * Conta solo le sessioni **erogate**: quelle in programma non sono un compenso
 * maturato, ed è la differenza fra un portale credibile e uno che promette soldi
 * non ancora guadagnati.
 *
 * Non produce le righe settimanali: la settimana è un raggruppamento di
 * presentazione e si costruisce dalle stesse sessioni in `lib/earnings.ts`, così
 * che "le righe sommano al totale" sia un'identità e non un controllo.
 */
export function monthlyEarnings(
  professionalId: string,
  feePerSession: number,
  month: Date,
): ProfessionalEarnings {
  const delivered = deliveredIn(month);
  return {
    professionalId,
    month,
    inProgress: sameMonth(DEMO_TODAY, month),
    sessionsDelivered: delivered.length,
    minutesDelivered: delivered.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    ),
    sessionsPerWeek: SESSIONS_PER_WEEK,
    feePerSession,
    grossChf: delivered.length * feePerSession,
    fullCapacity: FULL_CAPACITY,
  };
}

/**
 * Lo storico pagamenti, dal mese in corso all'indietro.
 *
 * Kora paga entro il 5 del mese successivo, quindi il mese in corso è sempre in
 * attesa e i precedenti sono pagati. I mesi senza sessioni non compaiono: una
 * riga da CHF 0 non è un pagamento mancato, è un mese in cui non si è lavorato,
 * e in un elenco di compensi si legge come un errore.
 */
export function payoutHistory(feePerSession: number): Payout[] {
  const payouts: Payout[] = [];
  const oldest = PORTAL_SESSIONS[0]?.start ?? DEMO_TODAY;

  const cursor = new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), 1);
  while (cursor >= new Date(oldest.getFullYear(), oldest.getMonth(), 1)) {
    const month = new Date(cursor);
    const sessions = deliveredIn(month).length;
    if (sessions > 0) {
      const pending = sameMonth(DEMO_TODAY, month);
      payouts.push({
        month,
        sessions,
        feePerSession,
        grossChf: sessions * feePerSession,
        status: pending ? "pending" : "paid",
        paidOn: pending
          ? null
          : new Date(month.getFullYear(), month.getMonth() + 1, 5),
      });
    }
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return payouts;
}

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

assertInDev(
  PROFESSIONALS.some((professional) => professional.id === PORTAL_PROFESSIONAL_ID),
  `Il portale è quello di "${PORTAL_PROFESSIONAL_ID}", che non è nel roster dei professionisti.`,
);

/*
 * Due sessioni alla stessa ora sono un doppio appuntamento: a schermo entrano
 * nella stessa cella della griglia e una delle due sparisce senza che nessuno
 * se ne accorga.
 */
const startTimes = PORTAL_SESSIONS.filter(
  (session) => session.status !== "cancelled",
).map((session) => session.start.getTime());
assertInDev(
  new Set(startTimes).size === startTimes.length,
  "Due sessioni della Dr.ssa Meier cadono alla stessa ora.",
);

assertInDev(
  PORTAL_SESSIONS.every(
    (session) => session.start.getDay() !== 0 && session.start.getDay() !== 6,
  ),
  "Una sessione della Dr.ssa Meier cade nel fine settimana.",
);

/*
 * Il §8 dà a Laura 3 sessioni usate su 10. Il contatore del dipendente non è un
 * numero a parte: è il conto delle sue sessioni erogate, e se le due cose
 * divergono è il dataset a essere sbagliato, non la KPI.
 */
const lauraCompleted = PORTAL_SESSIONS.filter(
  (session) =>
    session.patientId === PORTAL_PATIENT_EMPLOYEE_ID &&
    session.status === "completed",
).length;
assertInDev(
  lauraCompleted === 3,
  `Laura ha ${lauraCompleted} sessioni erogate, il §8 ne dichiara 3.`,
);

const lauraNext = PORTAL_SESSIONS.find(
  (session) =>
    session.patientId === PORTAL_PATIENT_EMPLOYEE_ID &&
    session.status === "scheduled",
);
assertInDev(
  lauraNext !== undefined &&
    lauraNext.start.getDay() === 4 &&
    lauraNext.start.getHours() === 17 &&
    lauraNext.start.getMinutes() === 30,
  "Il prossimo appuntamento di Laura non è il giovedì alle 17:30 del §8.",
);

/*
 * Le sessioni della demo sono una finestra sulla carriera del professionista,
 * non la carriera intera: il totale dichiarato sul profilo deve contenerle.
 */
const meier = PROFESSIONALS.find((p) => p.id === PORTAL_PROFESSIONAL_ID);
assertInDev(
  meier !== undefined &&
    meier.totalSessions >=
      PORTAL_SESSIONS.filter((session) => session.status === "completed").length,
  "Il profilo della Dr.ssa Meier dichiara meno sessioni di quante ne contenga la sua agenda.",
);

/*
 * Un'ora non può essere insieme occupata e prenotabile: le due liste finiscono
 * nella stessa griglia, e il conflitto si vede solo a schermo e solo se
 * qualcuno guarda proprio quel giorno.
 */
for (const slot of INITIAL_SLOTS.filter(
  (entry) => entry.professionalId === PORTAL_PROFESSIONAL_ID,
)) {
  assertInDev(
    !PORTAL_SESSIONS.some(
      (session) =>
        session.status !== "cancelled" &&
        session.start.getTime() === slot.start.getTime(),
    ),
    `Uno slot prenotabile della Dr.ssa Meier cade su una sessione già in agenda.`,
  );
}
