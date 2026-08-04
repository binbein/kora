/*
 * Entità di dominio (CLAUDE.md §5). Si estendono qui, mai inline nei
 * componenti: questo è il pezzo di codice che sopravvive alla demo.
 *
 * Gli identificatori sono in inglese e le etichette da mostrare vivono in
 * `i18n/it.ts`: un valore di dominio non è mai testo da schermo.
 */

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
 * Serve a costruire una serie di trimestri a partire da quello corrente
 * invece di scriverli come date assolute, così spostare il giorno della demo
 * porta con sé anche il periodo dei dati.
 */
export function addQuarters(period: Quarter, delta: number): Quarter {
  const fromZero = period.quarter - 1 + delta;
  return {
    year: period.year + Math.floor(fromZero / 4),
    // il resto in JS conserva il segno: il doppio modulo lo riporta in 0–3
    quarter: ((((fromZero % 4) + 4) % 4) + 1) as 1 | 2 | 3 | 4,
  };
}

export type PlanId = "essenziale" | "plus" | "executive";

export type Plan = {
  id: PlanId;
  /** CHF per dipendente al mese (§7) */
  monthlyPricePerEmployee: number;
  /** Sessioni di psicologo incluse per anno */
  sessionsPerYear: number;
  /** CHF per sessione oltre il cap */
  extraSessionPrice: number;
  /**
   * Ore entro cui il medico virtuale risponde: 4 su Plus, 1 su Executive (§7).
   *
   * Assente dove il §7 non lo dichiara. Un piano senza questo campo non
   * promette nulla sul medico, che è diverso dal prometterne l'assenza: la
   * landing salta la riga invece di dedurre una condizione che il documento
   * non contiene.
   */
  virtualDoctorSlaHours?: number;
  /**
   * Consulti di medico virtuale inclusi in un anno (§7): tre sull'Essenziale,
   * senza tetto sugli altri due.
   *
   * `"unlimited"` invece di lasciare il campo assente: un piano senza tetto e
   * un piano di cui non conosciamo il tetto sono due cose diverse, e il
   * listino le mostra in modo diverso.
   */
  virtualDoctorConsultsPerYear: number | "unlimited";
};

export type Company = {
  id: string;
  name: string;
  city: string;
  employeeCount: number;
  plan: Plan;
};

export type Department = {
  id: string;
  /** Nome del reparto: è un dato, non una stringa di UI da tradurre. */
  name: string;
  employeeCount: number;
  /**
   * Quante persone del reparto hanno risposto al questionario nell'ultimo mese.
   * È questo numero, non l'organico, a decidere se il dato è pubblicabile:
   * la soglia protegge chi ha risposto, non chi è a libro paga.
   *
   * Serve anche a rendere coerente il §6, dove HR + Legale e Direzione hanno
   * entrambi 15 dipendenti ma solo la Direzione risulta sotto soglia.
   */
  respondents: number;
};

/** Fascia di stress mostrata all'HR. Le etichette stanno in `it.ts`. */
export type StressLevel = "low" | "medium" | "high";

/**
 * Soglie delle fasce, dedotte dai valori del §6: Vendite 78 è "alto",
 * Operations 52 e Finanza 44 sono "medio", IT 31 e HR + Legale 26 sono "basso".
 */
export const STRESS_BANDS = { mediumFrom: 35, highFrom: 66 } as const;

export function stressLevelFromScore(score: number): StressLevel {
  if (score >= STRESS_BANDS.highFrom) return "high";
  if (score >= STRESS_BANDS.mediumFrom) return "medium";
  return "low";
}

/**
 * Rilevazione mensile di stress, sempre aggregata per reparto.
 *
 * `departmentId` assente = dato aggregato dell'intera azienda.
 * `suppressed` = reparto sotto la soglia minima di anonimato: il valore non
 * esiste proprio, non è "nascosto in UI". La privacy è un argomento di
 * vendita (§4.4), quindi il tipo la rende impossibile da aggirare per errore.
 */
export type StressRecord =
  | {
      month: Date;
      departmentId?: string;
      suppressed: false;
      /** 0–100 */
      score: number;
      level: StressLevel;
    }
  | {
      month: Date;
      departmentId?: string;
      suppressed: true;
    };

/** Risposte minime per reparto sotto cui il dato non viene esposto. */
export const ANONYMITY_THRESHOLD = 15;

/**
 * Alert precoce: un reparto che entra in fascia "alto" e ci resta.
 * Serve alla dashboard per il banner e per il marker sul grafico a 12 mesi.
 */
export type EarlyAlert = {
  departmentId: string;
  /** Mese in cui la soglia è stata superata per la prima volta */
  triggeredAt: Date;
  /** Mesi consecutivi sopra soglia, fino all'ultimo rilevamento */
  consecutiveMonths: number;
};

export type RoiSnapshot = {
  period: Quarter;
  /** CHF risparmiati nel trimestre */
  savedChf: number;
  /** Giorni di assenza evitati nel trimestre */
  avoidedAbsenceDays: number;
  /** Dipendenti iscritti alla piattaforma */
  enrolledEmployees: number;
  /** Dipendenti attivi nell'ultimo mese */
  activeEmployees: number;
  /** Sessioni consumate dall'azienda sul monte annuale */
  sessionsUsed: number;
  sessionsTotal: number;
};

/**
 * Percentuale di adozione: iscritti sull'organico. È una grandezza derivata,
 * quindi si calcola qui e non si conserva nel dataset — un numero salvato può
 * smettere di tornare con quelli da cui viene.
 */
export function adoptionPercent(
  company: Company,
  snapshot: RoiSnapshot,
): number {
  if (company.employeeCount === 0) return 0;
  return Math.round((snapshot.enrolledEmployees / company.employeeCount) * 100);
}

export type HealthArea = "sleep" | "stress" | "activity" | "nutrition";

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
  healthProfile: HealthProfile;
};

export type ProfessionalSpecialty =
  "work_stress" | "burnout_anxiety" | "sleep" | "coaching";

export type ProfessionalLanguage = "it" | "de" | "fr" | "en";

export type Professional = {
  id: string;
  /** Titolo e nome sono dati anagrafici, non stringhe di UI. */
  title: string;
  /** Opzionale: del corpo professionale il §6 fissa solo il cognome. */
  firstName?: string;
  lastName: string;
  specialty: ProfessionalSpecialty;
  languages: ProfessionalLanguage[];
  /** 0–5, un decimale */
  rating: number;
  /**
   * CHF che il professionista incassa per una sessione erogata.
   *
   * Il §7 fissa la banda CHF 70–80; dove cade la tariffa del singolo dentro
   * quella banda è un'assunzione della demo, dichiarata in `mock/people.ts`.
   */
  sessionFee: number;
};

/** Una riga del riepilogo compensi mensile: una settimana di calendario. */
export type EarningsWeek = {
  /** Lunedì della settimana */
  start: Date;
  /** Domenica della stessa settimana */
  end: Date;
  sessions: number;
  minutes: number;
  grossChf: number;
};

/**
 * Quanto rende un'agenda piena (§7).
 *
 * Serve a contestualizzare il compenso di chi lavora sulla piattaforma a
 * tempo parziale: senza questo riferimento, un totale mensile modesto sembra
 * il massimo che KORA può dare a un professionista, e non lo è.
 */
export type FullCapacityReference = {
  sessionsPerWeek: number;
  monthlyMinChf: number;
  monthlyMaxChf: number;
};

/**
 * Riepilogo compensi mensile di un professionista (§8.D).
 *
 * Conta solo le sessioni **erogate**: quelle in programma non sono un
 * compenso maturato, ed è la differenza fra un portale credibile e uno che
 * promette soldi non ancora guadagnati.
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
  weeks: EarningsWeek[];
  fullCapacity: FullCapacityReference;
};

/**
 * Nome da mostrare. Sta qui e non nei componenti perché l'ordine delle parti
 * di un nome è una convenzione, non una scelta di layout: cambiarla un giorno
 * deve essere una modifica sola.
 */
export function professionalDisplayName(professional: Professional): string {
  const { title, firstName, lastName } = professional;
  return [title, firstName, lastName].filter(Boolean).join(" ");
}

export type SessionEntitlement = {
  used: number;
  total: number;
  /** CHF per sessione oltre il cap, dal piano */
  extraSessionPrice: number;
};

export type AppointmentKind = "psychologist" | "virtual_doctor" | "checkup";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  kind: AppointmentKind;
  professionalId: string;
  start: Date;
  durationMinutes: number;
  status: AppointmentStatus;
};

/** Slot proponibile in prenotazione; diventa un Appointment se confermato. */
export type AppointmentSlot = {
  professionalId: string;
  start: Date;
  durationMinutes: number;
};

export type ProfessionalFilter = {
  specialty?: ProfessionalSpecialty;
  language?: ProfessionalLanguage;
};
