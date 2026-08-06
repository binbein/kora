/*
 * Le entità di dominio (CLAUDE.md §5.3). È la specifica che il backend dovrà
 * rispettare, non l'elenco dei campi che oggi servono a una schermata: copre
 * tutte le aree del §10, anche quelle che M3 e M4 devono ancora costruire.
 *
 * I *metodi* del provider invece nascono con un chiamante, area per area: un
 * tipo senza consumatore non costa niente a runtime ed è documentazione, un
 * metodo senza consumatore è codice da mantenere (§11).
 *
 * Gli identificatori sono in inglese e le etichette da mostrare vivono in
 * `i18n/it.ts`: un valore di dominio non è mai testo da schermo. I nomi delle
 * persone e dei reparti sono un'eccezione apparente — sono dati, non stringhe
 * di interfaccia, e non si traducono.
 *
 * I dodici schemi in `base44/entities/*.jsonc` sono stati usati come lista di
 * controllo della copertura, non come vincolo di forma (§5.3).
 */

// ---------------------------------------------------------------------------
// Tempo
// ---------------------------------------------------------------------------

/** Trimestre, nella forma usata dal selettore della dashboard HR. */
export type Quarter = {
  year: number;
  /** 1–4 */
  quarter: 1 | 2 | 3 | 4;
};

/** Chiave stabile per confronti e `key` di React: "2026-Q3". */
export function quarterKey(period: Quarter): string {
  return `${period.year}-Q${period.quarter}`;
}

export function sameQuarter(a: Quarter, b: Quarter): boolean {
  return a.year === b.year && a.quarter === b.quarter;
}

/** Il trimestre in cui cade una data. */
export function quarterOf(date: Date): Quarter {
  const quarter = (Math.floor(date.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
  return { year: date.getFullYear(), quarter };
}

/**
 * Sposta un trimestre lungo il calendario: `delta` negativo va indietro.
 *
 * Serve a costruire una serie di trimestri a partire da quello corrente invece
 * di scriverli come date assolute, così spostare il giorno della demo porta con
 * sé anche il periodo dei dati (§5.4).
 */
export function addQuarters(period: Quarter, delta: number): Quarter {
  const fromZero = period.quarter - 1 + delta;
  return {
    year: period.year + Math.floor(fromZero / 4),
    // il resto in JS conserva il segno: il doppio modulo lo riporta in 0–3
    quarter: ((((fromZero % 4) + 4) % 4) + 1) as 1 | 2 | 3 | 4,
  };
}

/** Intervallo di date, estremi inclusi. */
export type DateRange = {
  from: Date;
  to: Date;
};

// ---------------------------------------------------------------------------
// Piani e azienda
// ---------------------------------------------------------------------------

export type PlanId = "essenziale" | "plus" | "executive";

/**
 * Un piano di abbonamento (§9). Tutte le cifre vengono dal Business Plan e non
 * se ne inventano altre.
 *
 * I campi opzionali seguono una regola sola: **assente significa che il piano
 * non promette quella cosa**, che è diverso dal prometterne l'assenza. La card
 * salta la riga invece di dedurre una condizione che il documento non contiene.
 */
export type Plan = {
  id: PlanId;
  /** CHF per dipendente al mese */
  monthlyPricePerEmployee: number;
  /** Sessioni di psicologo incluse in un anno */
  sessionsPerYear: number;
  /** CHF per sessione oltre il cap */
  extraSessionPrice: number;
  /** Ore entro cui il medico virtuale risponde: 12 / 4 / 1 */
  virtualDoctorSlaHours: number;
  /**
   * Consulti di medico virtuale inclusi in un anno: tre sull'Essenziale, senza
   * tetto sugli altri due. `"unlimited"` invece del campo assente, perché un
   * piano senza tetto e un piano di cui non conosciamo il tetto sono due cose
   * diverse e il listino le mostra in modo diverso.
   */
  virtualDoctorConsultsPerYear: number | "unlimited";
  /** Sessioni di coaching incluse in un anno: 4 sul Plus, 6 sull'Executive. */
  coachSessionsPerYear?: number;
  /** Sessioni di nutrizionista incluse in un anno: 4, solo Executive. */
  nutritionistSessionsPerYear?: number;
  /** Workshop live inclusi in un anno: 2, solo Executive. */
  liveWorkshopsPerYear?: number;
  /**
   * Il check-up fisico compreso nel piano, se ce n'è uno.
   *
   * I due che il §9 dichiara non sono lo stesso check-up: il Plus ha quello
   * annuale, l'Executive uno più esteso — ECG, eco addome, oculista, sangue
   * completo. Un booleano li mostrerebbe come la stessa riga, che è il modo in
   * cui il piano più caro finisce per sembrare identico a quello di mezzo.
   *
   * Assente sull'Essenziale, dove il §9 non ne dichiara nessuno.
   */
  checkup?: "annual" | "executive";
  /** Ogni quanti mesi il piano di prevenzione AI viene rigenerato. */
  aiPlanEveryMonths?: number;
  /** Psichiatra su richiesta: incluso, non a pagamento (solo Executive). */
  includesPsychiatrist?: boolean;
  /** Familiari compresi nel prezzo: partner e un figlio (solo Executive). */
  includesFamily?: boolean;
  /**
   * Colloquio conoscitivo gratuito, **una volta sola** e solo sull'Essenziale.
   * Il §9 chiede che la card lo dica, altrimenti si legge come un extra
   * ricorrente.
   */
  freeIntroInterview: boolean;
  /**
   * Estensione ai familiari, CHF per dipendente al mese: 15 sul Plus.
   * L'Executive li include già e non ha l'estensione.
   */
  partnerExtensionPerEmployee?: number;
};

export type Company = {
  id: string;
  name: string;
  city: string;
  employeeCount: number;
  plan: Plan;
  /**
   * Dipendenti **misurati** nel periodo sotto cui il dato di un reparto non
   * viene pubblicato (§8). Sta qui e non è una costante globale perché è una
   * proprietà del cliente: il giorno in cui un'azienda ne ha una diversa non
   * cambia né la regola né la frase che la mostra (§7).
   */
  anonymityThreshold: number;
};

export type Department = {
  id: string;
  /** Nome del reparto: è un dato, non una stringa di UI da tradurre. */
  name: string;
  employeeCount: number;
};

// ---------------------------------------------------------------------------
// Misurazione dello stress
// ---------------------------------------------------------------------------

/** Fascia di stress mostrata all'HR. Le etichette stanno in `it.ts`. */
export type StressLevel = "low" | "medium" | "high";

/**
 * Soglie delle fasce, dedotte dai valori del §8: Vendite 78 è "alto",
 * Operations 52 e Finanza 44 sono "medio", IT 31 e HR + Legale 26 sono "basso".
 */
export const STRESS_BANDS = { mediumFrom: 35, highFrom: 66 } as const;

export function stressLevelFromScore(score: number): StressLevel {
  if (score >= STRESS_BANDS.highFrom) return "high";
  if (score >= STRESS_BANDS.mediumFrom) return "medium";
  return "low";
}

/**
 * Il dato grezzo di un reparto in un mese, come lo tiene il dataset.
 *
 * `measuredEmployees` sta **qui e non su `Department`** (§8): l'anagrafica
 * porterebbe un numero solo, e con quello si peserebbero tutti e dodici i mesi
 * della serie e si deciderebbe l'esclusione una volta sola per l'intera storia.
 * L'adesione al check rapido è proprio ciò che si muove quando un reparto va
 * sotto pressione, quindi il conteggio deve poter cambiare mese per mese.
 *
 * `score` è `null` esattamente quando il reparto è sotto soglia: non si inventa
 * un punteggio per un reparto che non si può misurare. Il guardrail del §5.6
 * verifica che le due cose restino in accordo.
 *
 * Questo tipo non lascia mai il provider: le schermate vedono `StressRecord`.
 */
export type DepartmentMonth = {
  departmentId: string;
  /** Primo giorno del mese */
  month: Date;
  measuredEmployees: number;
  /** 0–100, oppure `null` se il reparto è sotto soglia in quel mese */
  score: number | null;
};

/**
 * Rilevazione mensile che **esce** dal provider, già aggregata e già filtrata.
 *
 * `departmentId` assente = dato aggregato dell'intera azienda.
 *
 * `measuredEmployees` sta su entrambi i rami dell'unione, `score` e `level`
 * solo su quello pubblicabile: il §8 vuole i misurati su ogni riga, anche sotto
 * soglia — con il solo organico i due reparti da 15 sarebbero righe identiche
 * con esiti opposti, e una delle due sembrerebbe rotta.
 *
 * Un reparto soppresso non ha un punteggio nascosto in UI: non ce l'ha proprio
 * nel dato che il client riceve. La privacy è un argomento di vendita, quindi
 * il tipo la rende impossibile da aggirare per errore.
 */
export type StressRecord =
  | {
      month: Date;
      departmentId?: string;
      measuredEmployees: number;
      suppressed: false;
      /** 0–100 */
      score: number;
      level: StressLevel;
    }
  | {
      month: Date;
      departmentId?: string;
      measuredEmployees: number;
      suppressed: true;
    };

/**
 * Alert precoce: un reparto che entra in fascia "alto" e ci resta.
 * Serve al banner della dashboard e al marker sul grafico a 12 mesi.
 */
export type EarlyAlert = {
  departmentId: string;
  /** Mese in cui la soglia è stata superata per la prima volta */
  triggeredAt: Date;
  /** Mesi consecutivi sopra soglia, fino all'ultimo rilevamento */
  consecutiveMonths: number;
};

/**
 * Il check rapido ricorrente (§8, §10.B): una domanda, un tocco.
 *
 * È il segnale che alimenta ogni dato di stress della dashboard HR. Vive
 * dentro l'app per chi ha l'account e su link anonimo per chi non ce l'ha,
 * quindi `employeeId` è opzionale mentre `departmentId` non lo è: senza il
 * reparto la risposta non è aggregabile, senza la persona sì.
 *
 * Lo stress non si deduce mai dal comportamento (§8): questa risposta
 * auto-riportata è l'unica fonte ammessa.
 */
export type RapidCheckAnswer = {
  departmentId: string;
  /** 1 = molto bene, 5 = molto male */
  value: 1 | 2 | 3 | 4 | 5;
  answeredAt: Date;
  /** Assente quando la risposta arriva dal link anonimo */
  employeeId?: string;
};

// ---------------------------------------------------------------------------
// ROI
// ---------------------------------------------------------------------------

export type RoiSnapshot = {
  period: Quarter;
  /** CHF risparmiati nel trimestre, arrotondati al centinaio (§9) */
  savedChf: number;
  /** Giorni di assenza evitati: risparmio ÷ CHF 900 (§8) */
  avoidedAbsenceDays: number;
  /** Dipendenti iscritti alla piattaforma a fine trimestre */
  enrolledEmployees: number;
  /** Dipendenti attivi nel trimestre */
  activeEmployees: number;
  /**
   * Sessioni consumate, **cumulate sui dodici mesi** del monte annuo e non
   * consumate nel trimestre (§9): è l'unica lettura per cui "142 su 1'200"
   * confronta due grandezze che coprono lo stesso periodo.
   */
  sessionsUsed: number;
  sessionsTotal: number;
};

/**
 * Percentuale di adozione: iscritti sull'organico. È una grandezza derivata,
 * quindi si calcola e non si conserva — un numero salvato può smettere di
 * tornare con quelli da cui viene (§5.5).
 */
export function adoptionPercent(
  company: Company,
  snapshot: RoiSnapshot,
): number {
  if (company.employeeCount === 0) return 0;
  return Math.round((snapshot.enrolledEmployees / company.employeeCount) * 100);
}

// ---------------------------------------------------------------------------
// Dipendente
// ---------------------------------------------------------------------------

/**
 * Le cinque aree dell'assessment iniziale (§8).
 *
 * Sono le quattro che il profilo salute ha sempre avuto più `mental`, che il
 * piano di prevenzione tratta già come area a sé accanto allo stress: lo
 * stress è come stai adesso, la salute mentale è il percorso.
 */
export type HealthArea =
  | "sleep"
  | "stress"
  | "activity"
  | "nutrition"
  | "mental";

export type HealthProfile = {
  /** 0–100 */
  score: number;
  /** Chiave dell'etichetta sintetica in `it.ts` (es. "in buon equilibrio") */
  summaryKey: "balanced" | "attention" | "at_risk";
  /** Area con il punteggio più basso, da evidenziare nella app */
  weakestArea: HealthArea;
};

export type EmployeeProfile = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  departmentId: string;
  email: string;
  /** Mese in cui ha attivato l'account */
  memberSince: Date;
  healthProfile: HealthProfile;
};

/** Quante sessioni sono state usate sul cap del piano, e quanto costa la successiva. */
export type SessionEntitlement = {
  used: number;
  total: number;
  /** CHF per sessione oltre il cap, dal piano */
  extraSessionPrice: number;
};

// ---------------------------------------------------------------------------
// Professionisti
// ---------------------------------------------------------------------------

export type ProfessionalSpecialty =
  | "work_stress"
  | "burnout_anxiety"
  | "sleep"
  | "coaching";

export type ProfessionalLanguage = "it" | "de" | "fr" | "en";

export type Professional = {
  id: string;
  /** Titolo e nome sono dati anagrafici, non stringhe di UI. */
  title: string;
  /** Opzionale: del corpo professionale il §8 fissa solo il cognome. */
  firstName?: string;
  lastName: string;
  specialty: ProfessionalSpecialty;
  languages: ProfessionalLanguage[];
  /** 0–5, un decimale */
  rating: number;
  /**
   * CHF che il professionista incassa per una sessione erogata. Il §9 fissa la
   * banda CHF 70–80; dove cade il singolo è una scelta della demo, dichiarata
   * in `mock/people.ts`.
   */
  sessionFee: number;
  /*
   * Non c'è un numero di iscrizione all'albo, e non è una dimenticanza: il §8
   * vieta di inventarne. La qualifica e lo stato dei documenti dicono a chi
   * guarda quello che conta, e un identificatore plausibile su una persona
   * inventata potrebbe collidere con l'iscrizione di un professionista vero.
   * In produzione il campo esisterà: l'esclusione è dichiarata in
   * `docs/CONTRATTO-DATI.md`.
   */
  /** Sessioni erogate sulla piattaforma da quando collabora */
  totalSessions: number;
  documentsVerified: boolean;
  mandateSigned: boolean;
};

/**
 * Nome da mostrare. Sta qui e non nei componenti perché l'ordine delle parti di
 * un nome è una convenzione, non una scelta di layout: cambiarla un giorno deve
 * essere una modifica sola.
 */
export function professionalDisplayName(professional: Professional): string {
  const { title, firstName, lastName } = professional;
  return [title, firstName, lastName].filter(Boolean).join(" ");
}

export type ProfessionalFilter = {
  specialty?: ProfessionalSpecialty;
  language?: ProfessionalLanguage;
};

// ---------------------------------------------------------------------------
// Appuntamenti — due proiezioni della stessa entità
// ---------------------------------------------------------------------------

export type AppointmentKind = "psychologist" | "coach" | "virtual_doctor" | "checkup";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

/** Che tipo di incontro è, dal punto di vista clinico. */
export type SessionType = "session" | "first_visit" | "follow_up";

/**
 * L'appuntamento come lo vede **il dipendente**: il professionista è
 * identificato per intero, il paziente è implicito perché è chi guarda.
 */
export type Appointment = {
  id: string;
  kind: AppointmentKind;
  professionalId: string;
  start: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  type: SessionType;
};

/**
 * Lo stesso appuntamento come lo vede **il professionista**: il paziente è
 * identificato da un id opaco e dalle iniziali, mai dal nome.
 *
 * Sono due proiezioni di una sola entità memorizzata, non due entità: una
 * prenotazione fatta dal dipendente compare qui perché è lo stesso record
 * (§10.D). Che il nome non ci sia è una garanzia del contratto, non una scelta
 * di rendering: non esiste campo su cui possa arrivare.
 */
export type ProfessionalSession = {
  id: string;
  patientId: string;
  /** "L.B." — è tutto ciò che il professionista riceve del nome */
  patientInitials: string;
  start: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  type: SessionType;
  /** Se esiste una nota privata per questa sessione; il testo sta altrove */
  hasNote: boolean;
  /** Chiave del motivo in `it.ts`, presente solo sulle sessioni annullate */
  cancellationReasonKey?: "by_patient" | "by_professional";
};

/** Slot proponibile in prenotazione; diventa un `Appointment` se confermato. */
export type AppointmentSlot = {
  professionalId: string;
  start: Date;
  durationMinutes: number;
};

/**
 * La nota clinica privata di una sessione (§10.D).
 *
 * **Non esce mai verso l'azienda**, e a impedirlo è la forma del dominio: il
 * testo vive solo su questo tipo, che nessun metodo dell'area HR o admin
 * restituisce. Le altre proiezioni sanno al massimo che una nota esiste
 * (`ProfessionalSession.hasNote`), mai cosa dice.
 */
export type SessionNote = {
  sessionId: string;
  notes: string;
  nextGoal: string;
  suggestedFollowUp: string;
  updatedAt: Date;
};

// ---------------------------------------------------------------------------
// Portale professionista — pazienti e compensi
// ---------------------------------------------------------------------------

/**
 * Un paziente nell'elenco del professionista. Ogni campo è derivato dalle sue
 * sessioni e nessuno è scritto a mano (§5.5): l'elenco e la KPI che lo conta
 * non possono divergere perché sono la stessa lista.
 */
export type PatientSummary = {
  patientId: string;
  patientInitials: string;
  sessionsCompleted: number;
  /** `null` quando è un paziente nuovo che non ha ancora fatto sessioni */
  lastSessionAt: Date | null;
  nextSessionAt: Date | null;
};

/**
 * Quanto rende un'agenda piena (§9): 20 sessioni a settimana valgono
 * CHF 5'600–6'400 al mese.
 *
 * Va mostrato accanto al totale, sempre. Senza, chi ha letto il Business Plan
 * legge uno scarto di un ordine di grandezza come un errore nostro invece che
 * come il regime part-time di chi lavora sulla piattaforma poche ore.
 */
export type FullCapacityReference = {
  sessionsPerWeek: number;
  monthlyMinChf: number;
  monthlyMaxChf: number;
};

/**
 * Riepilogo compensi mensile di un professionista (§10.D).
 *
 * Conta solo le sessioni **erogate**: quelle in programma non sono un compenso
 * maturato, ed è la differenza fra un portale credibile e uno che promette
 * soldi non ancora guadagnati.
 *
 * Non porta le righe settimanali: la settimana è un raggruppamento di
 * presentazione e si costruisce dalle stesse sessioni con una funzione pura, in
 * modo che "le righe sommano al totale" sia un'identità e non un controllo.
 */
export type ProfessionalEarnings = {
  professionalId: string;
  /** Primo giorno del mese a cui il riepilogo si riferisce */
  month: Date;
  /** Il mese non è ancora chiuso: mancano le sessioni da qui a fine mese */
  inProgress: boolean;
  sessionsDelivered: number;
  minutesDelivered: number;
  /** Sessioni in una settimana piena di lavoro, cioè il regime tenuto */
  sessionsPerWeek: number;
  /** CHF per sessione erogata, dal profilo del professionista */
  feePerSession: number;
  grossChf: number;
  fullCapacity: FullCapacityReference;
};

/** Una riga dello storico pagamenti: un mese chiuso o quello in corso. */
export type Payout = {
  /** Primo giorno del mese */
  month: Date;
  sessions: number;
  feePerSession: number;
  grossChf: number;
  status: "paid" | "pending";
  /** Quando è stato pagato; `null` finché è in attesa */
  paidOn: Date | null;
};

// ---------------------------------------------------------------------------
// Check-up e prevenzione
// ---------------------------------------------------------------------------

export type CheckupProvider = {
  id: string;
  name: string;
  city: string;
  address: string;
  distanceKm: number;
};

export type CheckupBooking = {
  id: string;
  providerId: string;
  start: Date;
  status: AppointmentStatus;
};

/**
 * Un'area del piano di prevenzione AI (§10.B), con l'obiettivo e i suggerimenti
 * che il piano propone. Le chiavi dei testi stanno in `it.ts`.
 */
export type AiPlanArea = {
  area: HealthArea;
  goalKey: string;
  /** 0–100 */
  progressPercent: number;
  tipKeys: string[];
};

export type AiHealthPlan = {
  id: string;
  generatedAt: Date;
  /** Il piano Plus lo rigenera ogni 6 mesi (§9) */
  nextUpdateAt: Date;
  areas: AiPlanArea[];
};

// ---------------------------------------------------------------------------
// Report HR
// ---------------------------------------------------------------------------

/**
 * Il report trimestrale (§10.C). Le metriche sono derivate dallo snapshot e
 * dalle serie, non riscritte: il PDF e la schermata devono dire lo stesso
 * numero perché leggono lo stesso dato (§5.6).
 */
export type HrReport = {
  period: Quarter;
  adoptionPercent: number;
  usagePercent: number;
  checkupCompletionPercent: number;
  /** Variazione dello stress medio sul trimestre, in punti percentuali */
  stressTrendPercent: number;
  savedChf: number;
  avoidedAbsenceDays: number;
  /** Chiavi delle raccomandazioni in `it.ts` */
  recommendationKeys: string[];
};

// ---------------------------------------------------------------------------
// Richiesta demo (area pubblica)
// ---------------------------------------------------------------------------

export type DemoRequestInput = {
  companyName: string;
  contactName: string;
  email: string;
  employeeCount: number;
  message?: string;
};

export type DemoRequest = DemoRequestInput & {
  id: string;
  submittedAt: Date;
};

// ---------------------------------------------------------------------------
// Back-office admin
// ---------------------------------------------------------------------------

export type UserRole = "employee" | "hr" | "professional" | "admin";

export type PlatformUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
  role: UserRole;
  active: boolean;
  /** Punteggio del profilo salute, se ha completato l'assessment */
  healthScore: number | null;
  joinedAt: Date;
};

/**
 * Un'azienda cliente vista dal back-office. Il fatturato è **derivato**
 * dall'organico e dal piano, mai scritto: è il punto in cui la demo ereditata
 * dichiarava CHF 99'000 su un organico che l'elenco accanto non confermava
 * (§8).
 */
export type ClientCompany = {
  id: string;
  name: string;
  industry: string;
  city: string;
  employeeCount: number;
  planId: PlanId;
  active: boolean;
};
