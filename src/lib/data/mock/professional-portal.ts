import { addDays, startOfWeek } from "../../dates";
import { assertInDev } from "../guardrails";
import type {
  Payout,
  ProfessionalEarnings,
  ProfessionalSession,
  SessionEntitlement,
  SessionNote,
  SessionType,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { FULL_CAPACITY, LAURA, PROFESSIONALS } from "./people";
import { INITIAL_SLOTS, SESSION_DURATION_MINUTES } from "./scheduling";

/*
 * L'agenda della Dr.ssa Meier (CLAUDE.md §10.D).
 *
 * È il portale della professionista che il dipendente prenota in §10.B, quindi
 * **le sedute di Laura sono queste sedute**, non una seconda lista: la home del
 * dipendente e il calendario della professionista proiettano lo stesso record.
 * È anche ciò che rende reggibile, il giorno in cui M3 costruisce la
 * prenotazione, la prova del §10.D — una prenotazione nuova entra qui dentro e
 * compare da tutti e due i lati perché è una cosa sola.
 *
 * L'agenda non è scritta riga per riga: ogni paziente ha il suo slot settimanale
 * ricorrente, che è come funziona davvero un percorso di terapia, e le sedute si
 * generano da lì. Una lista scritta a mano si riconosce — gli orari finiscono
 * tutti tondi o tutti diversi — e andrebbe riscritta da capo per cambiare un
 * solo parametro.
 */

export const PORTAL_PROFESSIONAL_ID = "meier";

/*
 * L'id del dipendente della demo, che è anche una paziente della Dr.ssa Meier.
 *
 * Viene da `LAURA` invece di essere riscritto qui: erano due stringhe uguali in
 * due file, e due valori che devono coincidere è meglio che siano lo stesso
 * valore (§5.5). Se divergessero, l'agenda smetterebbe di riconoscere le sedute
 * di Laura senza che niente si rompa a schermo.
 */
export const PORTAL_PATIENT_EMPLOYEE_ID = LAURA.id;

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
   * "nuovo" da nessuna parte: non ha sedute erogate perché non ne ha fatte.
   */
  fromWeeksAgo: number;
  /** Quante settimane fa il percorso si è chiuso. Assente = ancora in corso. */
  untilWeeksAgo?: number;
};

/*
 * I percorsi della Dr.ssa Meier.
 *
 * IL CAP DEL PIANO DECIDE LA FORMA DELL'AGENDA, e non è un dettaglio del
 * listino: il Plus include 10 sedute all'anno (§9), quindi sei pazienti valgono
 * al massimo 60 sedute l'anno, poco più di una a settimana. Un'agenda da cinque
 * sedute settimanali non descrive sei percorsi lunghi — descrive **molti
 * percorsi brevi che si avvicendano**, ed è così che va costruita.
 *
 * Da qui i tre percorsi già conclusi: non compaiono nell'elenco pazienti, che
 * conta gli attivi, ma i loro compensi restano nello storico dei pagamenti, ed è
 * lì che spiegano i mesi in cui la Dr.ssa Meier lavorava con altre persone.
 * Nessuno dei tre finisce esattamente sul cap: un percorso si chiude quando il
 * lavoro è fatto, non solo quando finiscono le sedute incluse, e tre corsi che
 * si fermano tutti a 10 si leggerebbero come generati.
 *
 * Due pazienti stanno **sopra** il cap, e la schermata lo dice con il
 * co-payment: è il **deterrente** che tiene il consumo dentro il cap, mentre il
 * margine viene dal gap fra sessioni incluse ed erogate (Business Plan §5).
 * Mostrarlo a schermo vale più della riga che costa.
 */
const PATIENTS: PatientSlot[] = [
  { patientId: "gr", initials: "G.R.", weekday: 1, hour: 10, minute: 0, fromWeeksAgo: 10 },
  { patientId: "mb", initials: "M.B.", weekday: 1, hour: 14, minute: 0, fromWeeksAgo: 8 },
  { patientId: "ek", initials: "E.K.", weekday: 2, hour: 11, minute: 0, fromWeeksAgo: -1 },
  { patientId: "sc", initials: "S.C.", weekday: 3, hour: 16, minute: 0, fromWeeksAgo: 12 },
  {
    patientId: PORTAL_PATIENT_EMPLOYEE_ID,
    initials: "L.B.",
    weekday: 4,
    hour: 17,
    minute: 30,
    // tre sedute erogate e la quarta domani: è il 3/10 del §8, e il contatore
    // del dipendente non è un numero a parte ma il conto di queste
    fromWeeksAgo: 3,
  },
  { patientId: "at", initials: "A.T.", weekday: 5, hour: 9, minute: 0, fromWeeksAgo: 6 },

  // percorsi conclusi: fuori dall'elenco pazienti, dentro lo storico compensi
  { patientId: "df", initials: "D.F.", weekday: 2, hour: 15, minute: 0, fromWeeksAgo: 29, untilWeeksAgo: 22 },
  { patientId: "pm", initials: "P.M.", weekday: 3, hour: 9, minute: 30, fromWeeksAgo: 24, untilWeeksAgo: 16 },
  { patientId: "rt", initials: "R.T.", weekday: 5, hour: 14, minute: 0, fromWeeksAgo: 17, untilWeeksAgo: 12 },
];

/**
 * Sedute annullate, indicate come settimane prima di oggi sullo slot del
 * paziente. Una cancellazione è un fatto isolato, non una regola: si dichiara,
 * ma la data continua a derivarsi.
 */
const CANCELLATIONS: { patientId: string; weeksAgo: number }[] = [
  { patientId: "at", weeksAgo: 2 },
];

/** Il mese che il portale riepiloga: quello del giorno della demo. */
export const PORTAL_MONTH = new Date(
  DEMO_TODAY.getFullYear(),
  DEMO_TODAY.getMonth(),
  1,
);

/*
 * L'agenda arriva due settimane oltre la fine del mese.
 *
 * Il riepilogo compensi guarda il mese, il calendario guarda la settimana, e i
 * pazienti guardano il prossimo appuntamento: fermando le sedute al 30
 * settembre, chi ha la seduta successiva in ottobre comparirebbe nell'elenco
 * senza una prossima data, come se il percorso fosse finito.
 */
const HORIZON = addDays(
  new Date(PORTAL_MONTH.getFullYear(), PORTAL_MONTH.getMonth() + 1, 0),
  14,
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
    const lastWeek = slot.untilWeeksAgo === undefined ? null : -slot.untilWeeksAgo;

    for (
      let weekOffset = -slot.fromWeeksAgo;
      occurrence(slot, weekOffset) <= HORIZON &&
      (lastWeek === null || weekOffset <= lastWeek);
      weekOffset += 1
    ) {
      const start = occurrence(slot, weekOffset);
      const cancelled = CANCELLATIONS.some(
        (entry) =>
          entry.patientId === slot.patientId &&
          occurrence(slot, -entry.weeksAgo).getTime() === start.getTime(),
      );

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
        // il tipo si deriva sotto, quando la lista è completa e ordinata
        type: "session",
        hasNote: false,
        ...(cancelled ? { cancellationReasonKey: "by_patient" as const } : {}),
      });
    }
  }

  const sorted = sessions.sort((a, b) => a.start.getTime() - b.start.getTime());

  for (const session of sorted) {
    const mine = sorted.filter(
      (other) => other.patientId === session.patientId && other.status !== "cancelled",
    );

    /*
     * Il tipo si deriva dalla posizione nel percorso: il primo incontro è una
     * prima visita, e la seduta che riprende dopo un'assenza è un follow-up.
     * Scriverlo sul singolo record vorrebbe dire poterlo contraddire — un
     * paziente con due prime visite, o con la prima visita a metà percorso.
     */
    if (session.status !== "cancelled") {
      const previous = mine[mine.indexOf(session) - 1];
      const gapWeeks =
        previous === undefined
          ? 0
          : Math.round(
              (session.start.getTime() - previous.start.getTime()) /
                (7 * 24 * 60 * 60 * 1000),
            );
      const type: SessionType =
        previous === undefined
          ? "first_visit"
          : gapWeeks > 1
            ? "follow_up"
            : "session";
      session.type = type;
    }

    /*
     * La nota si scrive dopo la seduta, quindi l'ultima erogata di ogni paziente
     * non ce l'ha ancora: è quella su cui il professionista sta per scrivere, ed
     * è anche l'unico modo perché il pulsante "aggiungi nota" esista davvero
     * invece di essere sempre "nota".
     */
    if (session.status === "completed") {
      session.hasNote = sorted.some(
        (other) =>
          other.patientId === session.patientId &&
          other.status === "completed" &&
          other.start > session.start,
      );
    }
  }

  return sorted;
}

/** Tutte le sedute della Dr.ssa Meier, dalla più vecchia alla più recente. */
export const PORTAL_SESSIONS: ProfessionalSession[] = buildSessions();

/*
 * LE NOTE CHE ESISTONO DAVVERO.
 *
 * `hasNote` dice "la nota esiste" (`docs/CONTRATTO-DATI.md` §3), quindi dietro
 * ogni `true` ci deve essere una nota da leggere: prima di questi semi il campo
 * si derivava da un'euristica su *quando una nota si scriverebbe*, e 55 sedute
 * su 63 lo dichiaravano vero mentre `getSessionNote` rispondeva `null` per
 * tutte.
 *
 * STANNO SULLA PRIMA VISITA, ed è il criterio da non cambiare senza sapere cosa
 * si rompe: è la seduta di presa in carico, l'unica che si verbalizza sempre.
 * Le altre restano da scrivere, ed è ciò che tiene vivo "aggiungi nota" — senza
 * almeno una seduta erogata senza nota quel pulsante non esiste più a schermo,
 * e con lui il caso che il dialogo serve a mostrare.
 *
 * IL TESTO È DI PROCESSO E NON CLINICO — cosa si è fatto, cosa si è concordato,
 * quando ci si rivede — e non lo è per pudore: sono persone inventate, e una
 * nota clinica verosimile su una persona inventata è contenuto che nessuno ha
 * approvato (§2.4). Le otto note si somigliano, ed è la scelta meno peggiore:
 * variare la sostanza vorrebbe dire inventare un sintomo o un obiettivo
 * terapeutico a testa. La ripetizione è un difetto estetico, l'altro no.
 */
const FIRST_VISIT_NOTES: Record<
  string,
  Omit<SessionNote, "sessionId" | "updatedAt">
> = {
  df: {
    notes: "Primo incontro. Raccolta l'anamnesi e definito il perimetro del percorso.",
    nextGoal: "Concordare la frequenza degli incontri.",
    suggestedFollowUp: "Seduta settimanale.",
  },
  pm: {
    notes: "Presa in carico. Ricostruito il quadro iniziale insieme alla persona.",
    nextGoal: "Mettere a fuoco l'obiettivo del percorso.",
    suggestedFollowUp: "Si prosegue con cadenza settimanale.",
  },
  rt: {
    notes: "Colloquio iniziale. Chiarite le aspettative sul percorso.",
    nextGoal: "Definire i primi passi da verificare insieme.",
    suggestedFollowUp: "Prossimo incontro fra una settimana.",
  },
  sc: {
    notes: "Prima seduta. Raccolta la storia e concordato il metodo di lavoro.",
    nextGoal: "Verificare la tenuta della cadenza concordata.",
    suggestedFollowUp: "Cadenza settimanale, da rivedere fra un mese.",
  },
  gr: {
    notes: "Apertura del percorso. Ricostruita la situazione di partenza.",
    nextGoal: "Individuare le priorità su cui lavorare.",
    suggestedFollowUp: "Incontri settimanali.",
  },
  mb: {
    notes: "Primo colloquio. Definiti insieme i termini del lavoro.",
    nextGoal: "Riprendere il punto concordato al prossimo incontro.",
    suggestedFollowUp: "Settimanale, stesso orario.",
  },
  at: {
    notes: "Presa in carico. Raccolte le informazioni iniziali.",
    nextGoal: "Fissare l'obiettivo del primo ciclo di sedute.",
    suggestedFollowUp: "Si rivede la persona la settimana prossima.",
  },
  [PORTAL_PATIENT_EMPLOYEE_ID]: {
    notes: "Prima visita. Ricostruito il quadro e condiviso il piano di lavoro.",
    nextGoal: "Verificare i primi riscontri al prossimo incontro.",
    suggestedFollowUp: "Cadenza settimanale.",
  },
};

/*
 * Si costruiscono dall'array **finito**, non dentro il ciclo che deriva i tipi:
 * là `session.type` è ancora da scrivere per metà lista, e il criterio
 * pescherebbe meno note senza che niente si lamenti.
 *
 * `updatedAt` è la fine della seduta, non `DEMO_TODAY`: una nota su una seduta
 * di marzo datata al giorno della demo direbbe che è stata scritta sette mesi
 * dopo. Deriva dal record — nessuna costante nuova — ed è il primo istante in
 * cui la nota può esistere onestamente. Il ritardo vero con cui un
 * professionista verbalizza sarebbe una cifra che nessuno ha approvato, per un
 * campo che nessuna schermata rende.
 */
export const SESSION_NOTES: SessionNote[] = PORTAL_SESSIONS.filter(
  (session) => session.status === "completed" && session.type === "first_visit",
).map((session) => {
  const text = FIRST_VISIT_NOTES[session.patientId];
  /*
   * Il record è indicizzato per stringa, quindi un paziente aggiunto senza il
   * suo testo produrrebbe una nota con tre campi `undefined` — e `hasNote`
   * direbbe di sì su una nota che non si può leggere. Il controllo fallisce
   * davvero: è il nono paziente che qualcuno aggiungerà a `PATIENTS`.
   */
  assertInDev(
    text !== undefined,
    `La prima visita di ${session.patientInitials} non ha un testo in FIRST_VISIT_NOTES.`,
  );
  return {
    sessionId: session.id,
    ...text,
    updatedAt: new Date(
      session.start.getTime() + session.durationMinutes * 60_000,
    ),
  };
});

/*
 * PAZIENTE ATTIVO: ha una seduta in programma, oppure ne ha avuta una nelle
 * ultime sei settimane.
 *
 * È una regola di dominio che il §8 non copre, quindi va dichiarata: "pazienti
 * attivi" è una KPI, e il backend dovrà calcolarla allo stesso modo. Se la
 * definizione vivesse solo qui, in produzione ne nascerebbe una seconda e le due
 * schermate direbbero numeri diversi.
 *
 * Le sei settimane servono a non far sparire dall'elenco chi ha saltato un paio
 * di sedute: un percorso in pausa non è un percorso chiuso, e toglierlo dalla
 * lista è il modo in cui un professionista perde di vista qualcuno.
 */
export const ACTIVE_PATIENT_WEEKS = 6;

export function isActivePatient(sessions: ProfessionalSession[]): boolean {
  const since = addDays(startOfWeek(DEMO_TODAY), -ACTIVE_PATIENT_WEEKS * 7);
  return sessions.some(
    (session) =>
      session.status === "scheduled" ||
      (session.status === "completed" && session.start >= since),
  );
}

/*
 * IL DIRITTO ALLE SEDUTE È DERIVATO, mai scritto: `used` è il conto delle sedute
 * erogate, e non un secondo numero pinnato allo stesso valore.
 *
 * È la stessa funzione che alimenta il contatore del dipendente e la riga
 * "10 incluse + N a CHF 28" dell'elenco pazienti: sono lo stesso calcolo, quindi
 * devono essere lo stesso codice (§5.5).
 *
 * Riceve **le sedute del paziente** invece del suo id, e non è un dettaglio: le
 * prenotazioni fatte durante la demo non stanno in `PORTAL_SESSIONS`, che è il
 * dataset curato, ma nello stato del provider. Leggendo la costante il conto
 * sarebbe giusto solo finché nessuna seduta cambia stato a runtime — cioè
 * giusto per caso. Chi chiama ha già la lista completa e gliela passa.
 *
 * Una prenotazione comunque non lo fa salire: nasce `scheduled`, e qui si
 * contano le erogate (§10.B).
 */
export function entitlementFor(
  patientSessions: ProfessionalSession[],
): SessionEntitlement {
  return {
    used: patientSessions.filter((session) => session.status === "completed")
      .length,
    total: COMPANY.plan.sessionsPerYear,
    extraSessionPrice: COMPANY.plan.extraSessionPrice,
  };
}

/** Le sedute di un paziente dentro una lista. */
export function sessionsOfPatient(
  patientId: string,
  sessions: ProfessionalSession[],
): ProfessionalSession[] {
  return sessions.filter((session) => session.patientId === patientId);
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function deliveredIn(
  sessions: ProfessionalSession[],
  month: Date,
): ProfessionalSession[] {
  return sessions.filter(
    (session) => session.status === "completed" && sameMonth(session.start, month),
  );
}

/*
 * Il regime tenuto: media delle sedute erogate nelle quattro settimane piene
 * precedenti quella corrente.
 *
 * Si deriva e non si conta sugli slot, perché i percorsi si avvicendano: un
 * numero fisso resterebbe fermo mentre l'agenda cambia. La settimana corrente
 * resta fuori perché non è finita, e includerla farebbe sempre sembrare il
 * regime più basso di quello che è.
 *
 * Riceve le sedute per la stessa ragione delle due funzioni qui sotto: era una
 * costante di modulo calcolata su `PORTAL_SESSIONS`, quindi il regime della
 * Dr.ssa Meier veniva dichiarato di chiunque.
 */
function sessionsPerWeek(sessions: ProfessionalSession[]): number {
  return Math.round(
    sessions.filter(
      (session) =>
        session.status === "completed" &&
        session.start >= addDays(startOfWeek(DEMO_TODAY), -28) &&
        session.start < startOfWeek(DEMO_TODAY),
    ).length / 4,
  );
}

/**
 * Riepilogo compensi di un mese.
 *
 * Conta solo le sedute **erogate**: quelle in programma non sono un compenso
 * maturato, ed è la differenza fra un portale credibile e uno che promette soldi
 * non ancora guadagnati.
 *
 * Non produce le righe settimanali: la settimana è un raggruppamento di
 * presentazione e si costruisce dalle stesse sedute in `lib/earnings.ts`, così
 * che "le righe sommano al totale" sia un'identità e non un controllo. **Era
 * un'identità a metà**: le righe si costruivano dalla lista del provider e
 * `grossChf` da `PORTAL_SESSIONS`, quindi tornavano per coincidenza.
 *
 * RICEVE LE SEDUTE E NON L'ID, come `entitlementFor` qui sopra e per la stessa
 * ragione: chi chiama ha già la lista completa. Leggendo la costante di modulo
 * questa funzione rispondeva con l'agenda della Dr.ssa Meier a **qualunque**
 * professionista le si chiedesse — `getProfessionalEarnings("keller")`
 * dichiarava 14 sedute per chi non ne ha nessuna, mentre
 * `getProfessionalSessions("keller")` restituiva la lista vuota. Due metodi
 * dello stesso contratto che si contraddicono (§5.5).
 */
export function monthlyEarnings(
  professionalId: string,
  sessions: ProfessionalSession[],
  feePerSession: number,
  month: Date,
): ProfessionalEarnings {
  const delivered = deliveredIn(sessions, month);
  return {
    professionalId,
    month,
    inProgress: sameMonth(DEMO_TODAY, month),
    sessionsDelivered: delivered.length,
    minutesDelivered: delivered.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    ),
    sessionsPerWeek: sessionsPerWeek(sessions),
    feePerSession,
    grossChf: delivered.length * feePerSession,
    fullCapacity: FULL_CAPACITY,
  };
}

/**
 * Lo storico pagamenti, dal mese in corso all'indietro.
 *
 * Kora paga entro il 5 del mese successivo, quindi il mese in corso è sempre in
 * attesa e i precedenti sono pagati. I mesi senza sedute non compaiono: una riga
 * da CHF 0 non è un pagamento mancato, è un mese in cui non si è lavorato, e in
 * un elenco di compensi si legge come un errore.
 *
 * Riceve le sedute per la ragione detta su `monthlyEarnings` — qui il difetto
 * era anche peggiore, perché l'id non lo prendeva nemmeno.
 *
 * **Le vuole in ordine cronologico**, perché la prima dice da dove far partire
 * la scansione all'indietro. I due chiamanti lo garantiscono: `PORTAL_SESSIONS`
 * nasce ordinata e `sessionsOf` riordina dopo aver aggiunto le prenotazioni.
 */
export function payoutHistory(
  sessions: ProfessionalSession[],
  feePerSession: number,
): Payout[] {
  const payouts: Payout[] = [];
  const oldest = sessions[0]?.start ?? DEMO_TODAY;

  const cursor = new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), 1);
  while (cursor >= new Date(oldest.getFullYear(), oldest.getMonth(), 1)) {
    const month = new Date(cursor);
    const delivered = deliveredIn(sessions, month).length;
    if (delivered > 0) {
      const pending = sameMonth(DEMO_TODAY, month);
      payouts.push({
        month,
        sessions: delivered,
        feePerSession,
        grossChf: delivered * feePerSession,
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
 * Due sedute alla stessa ora sono un doppio appuntamento: a schermo entrano
 * nella stessa cella della griglia e una delle due sparisce senza che nessuno
 * se ne accorga.
 */
const startTimes = PORTAL_SESSIONS.filter(
  (session) => session.status !== "cancelled",
).map((session) => session.start.getTime());
assertInDev(
  new Set(startTimes).size === startTimes.length,
  "Due sedute della Dr.ssa Meier cadono alla stessa ora.",
);

assertInDev(
  PORTAL_SESSIONS.every(
    (session) => session.start.getDay() !== 0 && session.start.getDay() !== 6,
  ),
  "Una seduta della Dr.ssa Meier cade nel fine settimana.",
);

/*
 * Il §8 dà a Laura 3 sedute usate su 10. Il contatore del dipendente non è un
 * numero a parte: è il conto delle sue sedute erogate, e se le due cose
 * divergono è il dataset a essere sbagliato, non la KPI.
 */
const lauraEntitlement = entitlementFor(
  sessionsOfPatient(PORTAL_PATIENT_EMPLOYEE_ID, PORTAL_SESSIONS),
);
assertInDev(
  lauraEntitlement.used === 3,
  `Laura ha ${lauraEntitlement.used} sedute erogate, il §8 ne dichiara 3.`,
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
 * NESSUN PAZIENTE SUPERA IL CAP SENZA CHE LA SCHERMATA LO DICA.
 *
 * Il margine viene dal gap fra sessioni incluse ed erogate (Business Plan §5) e
 * il cap è ciò che lo tiene, con il co-payment come deterrente: un conteggio che
 * sfonda il cap in silenzio non è quindi un difetto interno, contraddice il
 * documento che l'investitore ha in mano mentre guarda lo schermo. Chi sta sopra il cap deve comparire nell'elenco pazienti, che è
 * l'unico posto in cui il co-payment si vede.
 */
for (const slot of PATIENTS) {
  const mine = sessionsOfPatient(slot.patientId, PORTAL_SESSIONS);
  const entitlement = entitlementFor(mine);
  if (entitlement.used <= entitlement.total) continue;
  assertInDev(
    isActivePatient(mine),
    `${slot.initials} ha ${entitlement.used} sedute sul cap di ${entitlement.total} ma non è un paziente attivo: il co-payment non comparirebbe da nessuna parte.`,
  );
}

/*
 * Le sedute della demo sono una finestra sulla carriera del professionista, non
 * la carriera intera: il totale dichiarato sul profilo deve contenerle.
 */
const meier = PROFESSIONALS.find((p) => p.id === PORTAL_PROFESSIONAL_ID);
assertInDev(
  meier !== undefined &&
    meier.totalSessions >=
      PORTAL_SESSIONS.filter((session) => session.status === "completed").length,
  "Il profilo della Dr.ssa Meier dichiara meno sedute di quante ne contenga la sua agenda.",
);

/*
 * Il controllo "le sedute della Dr.ssa Meier stanno dentro quelle dell'azienda"
 * viveva qui con il 142 scritto a mano. Ora sta in `service-usage.ts`, dove la
 * serie aziendale la contiene per costruzione invece di limitarsi a non
 * contraddirla — ed è lì che si legge anche la semplificazione che lo regge:
 * tutti i suoi pazienti sono di Demo SA (`docs/CONTRATTO-DATI.md` §7).
 */

/*
 * Un'ora non può essere insieme occupata e prenotabile: le due liste finiscono
 * nella stessa griglia, e il conflitto si vede solo a schermo e solo se qualcuno
 * guarda proprio quel giorno.
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
    `Uno slot prenotabile della Dr.ssa Meier cade su una seduta già in agenda.`,
  );
}
