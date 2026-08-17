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
  /**
   * Il livello della dashboard HR. **Obbligatorio**: dal 08.08.2026 il §9 lo
   * dichiara per tutti e tre i piani, quindi non c'è un caso in cui il
   * contratto commerciale non lo preveda.
   *
   * È un'enumerazione e non una cadenza, per la stessa ragione per cui
   * `checkup` non è un booleano: i tre livelli sono tre cose diverse — la base
   * mostra utilizzo, stress anonimizzato e risparmio; quella del Plus taglia
   * per reparto e porta l'alert burnout precoce; quella dell'Executive
   * aggiunge il report mensile e la call col team clinico — e una card che li
   * rendesse con la stessa frase e un numero diverso direbbe che il piano più
   * caro è lo stesso prodotto più spesso.
   *
   * Le cadenze **non stanno qui apposta**: il §9 le dà trimestrali sul Plus e
   * mensili sull'Executive, mentre sulla riga dell'Essenziale "mensile" si
   * riferisce alla dashboard e non a un report. Un numero costringerebbe a
   * decidere quel punto, cioè a inventarlo (§2.4).
   */
  hrDashboard: "base" | "department" | "advanced";
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
  /** Quando scade il contratto in corso: la fatturazione lo mostra. */
  contractRenewsOn: Date;
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

/**
 * I servizi che il piano cappa a un numero di sedute l'anno, cioè quelli per cui
 * ha senso chiedere "quante ne ho usate".
 *
 * È un'unione stretta e non `AppointmentKind`: il medico virtuale del Plus è
 * illimitato e il check-up si conta una volta l'anno, quindi per loro
 * `SessionEntitlement` non direbbe niente di vero. In produzione l'unione si
 * allarga se un piano cappa altro — l'Executive ha nutrizionista e workshop —
 * ma un valore in più qui è un caso in più da gestire, e oggi non ha chiamanti.
 */
export type CappedServiceKind = "psychologist" | "coach";

/**
 * Nome da mostrare al diretto interessato. Sta qui per la stessa ragione di
 * `professionalDisplayName`: l'ordine delle parti di un nome è una convenzione,
 * non una scelta di layout, e cambiarla un giorno deve essere una modifica sola.
 */
export function employeeDisplayName(profile: EmployeeProfile): string {
  return `${profile.firstName} ${profile.lastName}`;
}

/** Quante sessioni sono state usate sul cap del piano, e quanto costa la successiva. */
export type SessionEntitlement = {
  used: number;
  total: number;
  /**
   * CHF per sessione oltre il cap, dal piano.
   *
   * **Assente quando il piano non dichiara un prezzo oltre il cap**, ed è il
   * criterio `?` di `docs/CONTRATTO-DATI.md` §2: il campo non pertiene, non è
   * uno slot vuoto. Il §9 dà l'importo per lo psicologo (CHF 28 sul Plus) e non
   * ne dà nessuno per il coach, quindi la seduta di coaching successiva alla
   * quarta non è acquistabile a un prezzo che conosciamo — e inventarlo
   * violerebbe il §2.4. La schermata salta la riga invece di stampare un
   * "gratis" che il Business Plan non promette.
   */
  extraSessionPrice?: number;
};

/**
 * Un consulto di medico virtuale già avvenuto (§8, §10.B).
 *
 * Esiste perché il Profilo dice quanti ne hai fatti quest'anno, e quel numero si
 * **conta da questa lista** invece di essere uno scalare accanto: due numeri che
 * descrivono la stessa cosa devono essere lo stesso numero (§5.5).
 *
 * Porta la sola data di apertura, e non il contenuto della conversazione: la
 * chat della demo è una simulazione dichiarata (disclaimer di M0) e non ha
 * trascritti da conservare. In produzione questo tipo cresce — trascritto,
 * medico che ha risposto, esito — e cresce qui, non in una seconda entità.
 */
export type VirtualDoctorConsult = {
  id: string;
  startedAt: Date;
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
  /**
   * **Slot di valore, non campo che non pertiene**: un professionista un nome
   * proprio ce l'ha sempre, e in produzione arriva valorizzato. È il dataset
   * demo a lasciarlo vuoto — il §8 del `CLAUDE.md` fissa del corpo
   * professionale il solo cognome, e inventare cinque nomi propri rifarebbe la
   * prova di sicurezza dei nomi. La semplificazione è dichiarata in
   * `docs/CONTRATTO-DATI.md` §7, dove sta anche il lato produzione: lì il campo
   * si potrà stringere a obbligatorio.
   */
  firstName: string | null;
  lastName: string;
  specialty: ProfessionalSpecialty;
  languages: ProfessionalLanguage[];
  /**
   * Chiave della qualifica in `it.ts`: "Psicologa FSP", "Coach".
   *
   * La qualifica è ciò che conta a chi guarda, ed è quanto il §8 ammette del
   * corpo professionale: il numero di iscrizione all'albo non esiste in questo
   * tipo e non si inventa.
   */
  qualificationKey: "psychologist_f" | "psychologist_m" | "coach_m";
  /**
   * 0–5, un decimale. **`null` per chi non ha ancora erogato sedute**: un
   * professionista in verifica non ha una valutazione, e uno zero si
   * leggerebbe come la peggiore possibile invece che come assente (§11).
   */
  rating: number | null;
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

/**
 * Se un professionista può essere prenotato.
 *
 * **Si deriva e non è un campo**: documenti verificati e mandato firmato sono
 * già il fatto: uno `status` accanto sarebbe un secondo dato sulla stessa cosa,
 * e i due potrebbero divergere (§5.5). È la stessa forma della rete check-up,
 * dove `CheckupProvider.status` decide chi è prenotabile — lì lo stato è il
 * dato, qui il dato sono i due controlli che lo producono.
 *
 * Il back-office elenca **tutti**, perché seguire chi è in verifica è il suo
 * mestiere; la prenotazione filtra su questa funzione.
 */
export function isBookable(professional: Professional): boolean {
  return professional.documentsVerified && professional.mandateSigned;
}

/**
 * Quale dei due servizi cappati dal piano eroga un professionista.
 *
 * Si deriva dalla specializzazione invece di essere un campo suo: sono lo stesso
 * fatto, e un campo in più potrebbe smettere di concordare con la specialità che
 * la card mostra accanto. Il coaching è coaching, il resto è psicologia — ed è
 * la ragione per cui la schermata di prenotazione non può presentare i quattro
 * professionisti in un elenco solo senza dire chi fa cosa.
 */
export function serviceOf(professional: Professional): CappedServiceKind {
  return professional.specialty === "coaching" ? "coach" : "psychologist";
}

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
  /** `null` quando è un paziente nuovo che non ha ancora fatto sedute */
  lastSessionAt: Date | null;
  nextSessionAt: Date | null;
  /**
   * Quante sedute ha consumato sul cap del suo piano, e quanto costa la
   * successiva se il cap è esaurito.
   *
   * È lo stesso tipo che porta il contatore del dipendente, e non per comodità:
   * sono lo stesso fatto visto dai due lati del marketplace.
   *
   * **Il margine viene dal gap fra sessioni incluse ed erogate** — Business Plan
   * §5, riquadro «Principio fondamentale» — e il cap è ciò che lo tiene: il
   * co-payment è il **deterrente** che trattiene il consumo dentro il cap, non
   * una fonte di ricavo (BP §9: margine «—», funzione di fidelizzazione). Un
   * paziente che supera il cap senza che la schermata lo dica contraddice quindi
   * il documento che l'investitore ha in mano.
   */
  entitlement: SessionEntitlement;
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
  /**
   * Il minimo di disponibilità chiesto a chi entra nella rete. Sta qui e non
   * nella pagina che lo mostra per la stessa ragione delle tre cifre qui sopra:
   * è una condizione del contratto con il professionista, e una schermata non è
   * il posto in cui vive una condizione contrattuale.
   */
  minHoursPerWeek: number;
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

/**
 * Una struttura della rete convenzionata (§8). È **una sola rete**: il portale
 * dipendente e il back-office descrivono queste stesse strutture.
 *
 * `status` sta sul dato e non nella schermata, ed è la ragione per cui il tipo
 * ce l'ha: il codice ereditato offriva al dipendente una struttura che l'admin
 * dichiarava non ancora convenzionata, perché ognuna delle due pagine teneva il
 * proprio elenco. Una struttura `pending` si vede nel back-office, che segue i
 * convenzionamenti in corso, e non si può prenotare.
 */
export type CheckupProvider = {
  id: string;
  name: string;
  city: string;
  address: string;
  /** Distanza dalla sede dell'azienda, che è da dove parte chi prenota */
  distanceKm: number;
  status: "active" | "pending";
};

export type CheckupBooking = {
  id: string;
  providerId: string;
  start: Date;
  status: AppointmentStatus;
};

/**
 * Se il dipendente può prenotare un check-up, e da quando (§10.B).
 *
 * Sta sul contratto e non nella schermata perché la cadenza è una regola del
 * piano — il Plus ne dà uno all'anno (§9) — e una pagina che la ricalcolasse
 * potrebbe smettere di concordare con quella del piano. È la stessa ragione per
 * cui `SessionEntitlement` non è un conto tenuto dalla UI.
 *
 * `lastCompleted` è `null` per chi non ne ha ancora fatto nessuno;
 * `availableFrom` è `null` quando il piano non comprende il check-up, che è il
 * caso dell'Essenziale — e non è la stessa cosa di una data lontana.
 */
export type CheckupEligibility = {
  lastCompleted: CheckupBooking | null;
  availableFrom: Date | null;
};

export type CheckupMeasurementKey =
  | "blood_pressure"
  | "cholesterol"
  | "ecg"
  | "bmi"
  | "stress_risk";

/**
 * Una misura del referto.
 *
 * `value` è una **stringa e resta tale**: "120/80 mmHg" e "Ritmo sinusale" sono
 * letture con la loro unità, come il centro le ha refertate, non grandezze che
 * il client debba riformattare. La regola del §11 — ogni numero a schermo passa
 * da `format.ts` — riguarda importi, percentuali e date, cioè ciò che cambia
 * forma con il locale; una pressione arteriosa no, e passarla da un
 * formattatore vorrebbe dire deciderne noi la resa clinica.
 */
export type CheckupMeasurement = {
  key: CheckupMeasurementKey;
  value: string;
  status: "normal" | "attention";
};

/**
 * Il referto di un check-up eseguito (§10.B).
 *
 * È l'unico dato sanitario individuale del dominio, e vive **solo** su questo
 * tipo: nessun metodo dell'area HR o admin lo restituisce, esattamente come per
 * `SessionNote`. `EmployeeDirectoryEntry` porta lo stato del check-up e non il
 * suo esito, e la garanzia è la forma del tipo, non una scelta di rendering.
 *
 * Nella demo i valori sono quelli già a schermo e dichiaratamente dimostrativi:
 * la schermata lo dice con il disclaimer di M0.
 */
export type CheckupReport = {
  bookingId: string;
  measurements: CheckupMeasurement[];
  /**
   * Chiave della spiegazione in `i18n`.
   *
   * **Un'unione e non `string`**, come `qualificationKey`: con `string`
   * qualunque chiave compilava e rendeva vuoto a schermo, e la schermata era
   * costretta ad allargare il dizionario a `Record<string, string>` — cioè a
   * dichiarare un accesso sicuro dove poteva uscire `undefined`. Un membro solo
   * non è una stranezza: dice che l'insieme è chiuso, che è l'informazione che
   * mancava. In produzione se ne aggiungono, qui.
   */
  explanationKey: "laura";
};

/**
 * Un'area del piano di prevenzione AI (§10.B), con l'obiettivo e i suggerimenti
 * che il piano propone. Le chiavi dei testi stanno in `it.ts`.
 */
export type AiPlanArea = {
  area: HealthArea;
  /** Unione e non `string`, per la ragione detta su `CheckupReport`. */
  goalKey:
    | "sleep_hours"
    | "stress_reduction"
    | "activity_weekly"
    | "nutrition_cholesterol"
    | "mental_coaching";
  /** 0–100 */
  progressPercent: number;
  tipKeys: AiPlanTipKey[];
};

/** Le chiavi dei suggerimenti in `i18n`, tre per ognuna delle cinque aree. */
export type AiPlanTipKey =
  | "sleep_screens"
  | "sleep_schedule"
  | "sleep_caffeine"
  | "stress_breathing"
  | "stress_breaks"
  | "stress_coach"
  | "activity_walk"
  | "activity_stairs"
  | "activity_yoga"
  | "nutrition_fibre"
  | "nutrition_fats"
  | "nutrition_recheck"
  | "mental_continue"
  | "mental_techniques"
  | "mental_journal";

/**
 * Il piano di prevenzione (§10.B).
 *
 * Le aree sono le cinque di `HealthArea` e nient'altro: il piano commenta lo
 * stato di salute, e il check-up è un servizio che si prenota, non un'area su
 * cui si progredisce. Nel codice ereditato era la sesta voce, con la sua barra
 * di avanzamento allo 0% — cioè un servizio travestito da abitudine.
 *
 * Le due date **si derivano** dall'iscrizione del dipendente e dalla cadenza del
 * piano (`Plan.aiPlanEveryMonths`), e non si scrivono: una data scritta
 * invecchia da sola mentre `DEMO_TODAY` resta l'unica manopola (§5.4).
 */
export type AiHealthPlan = {
  id: string;
  generatedAt: Date;
  /** Il piano Plus lo rigenera ogni 6 mesi (§9) */
  nextUpdateAt: Date;
  areas: AiPlanArea[];
};

// ---------------------------------------------------------------------------
// Utilizzo servizi
// ---------------------------------------------------------------------------

/**
 * L'utilizzo dei servizi in un mese: quante sessioni per ogni tipo (§10.C.1).
 *
 * È una serie mensile come quella dello stress, e per la stessa ragione: le
 * serie aziendali hanno il mese come granularità (§5.3). La ciambella di
 * distribuzione non ha un tipo suo — è la somma di questa serie sul periodo
 * selezionato, derivata (§5.5): con un tipo proprio i due grafici potrebbero
 * divergere, che è il difetto della schermata ereditata, dove la ciambella
 * dice 180 sessioni di psicologo contro le 142 del §8.
 *
 * Invariante per il dataset, che è lavoro di M3 con la dashboard: le sessioni
 * `psychologist`, sommate sui dodici mesi, sono le 142 del §8 — lo stesso
 * numero della KPI dello snapshot, non un secondo conteggio che gli somiglia.
 * Il guardrail arriva con il dataset. I conteggi degli altri tre servizi non
 * sono nel §8: si fissano lì quando M3 li costruisce (§2.4).
 */
export type ServiceUsageMonth = {
  /** Primo giorno del mese */
  month: Date;
  sessions: Record<AppointmentKind, number>;
};

// ---------------------------------------------------------------------------
// Elenco dipendenti e fatturazione (area HR)
// ---------------------------------------------------------------------------

/**
 * Una riga dell'elenco dipendenti che l'HR vede (§10.C).
 *
 * **Non ha nessun campo su cui un nome possa arrivare**, esattamente come
 * `ProfessionalSession`: chi guarda riceve le iniziali e il reparto, e la
 * garanzia è la forma del tipo, non una scelta di rendering. Non porta nemmeno
 * un dato sanitario — lo stato del check-up dice se è stato fatto, mai cosa ha
 * detto.
 *
 * `checkupStatus` è `null` per chi non ha attivato l'account: la colonna esiste
 * per tutti, il valore no (`docs/CONTRATTO-DATI.md` §2).
 */
export type EmployeeDirectoryEntry = {
  employeeId: string;
  /** "L.B." — è tutto ciò che l'azienda riceve del nome */
  initials: string;
  departmentId: string;
  /** Ha attivato l'account e può prenotare */
  enrolled: boolean;
  checkupStatus: "completed" | "booked" | "available" | null;
};

/**
 * Una fattura mensile dell'abbonamento (§10.C).
 *
 * Non porta il totale: è organico per prezzo unitario, e due numeri che
 * descrivono la stessa cosa non devono poter divergere (§5.5). In produzione,
 * il giorno in cui una fattura avrà rettifiche o crediti, il totale smetterà di
 * essere una moltiplicazione e diventerà un campo — è dichiarato in
 * `docs/CONTRATTO-DATI.md` §6.
 */
export type Invoice = {
  /** Primo giorno del mese fatturato */
  month: Date;
  employeeCount: number;
  /** CHF per dipendente al mese applicati su questa fattura */
  unitPriceChf: number;
  status: "paid" | "pending";
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
  /** Iscritti ÷ organico */
  adoptionPercent: number;
  /** Sessioni di psicologo consumate ÷ monte annuo: il 12% del §8 */
  usagePercent: number;
  /**
   * Check-up eseguiti ÷ **iscritti**, non ÷ organico: chi non ha attivato
   * l'account non può prenotarlo, e metterlo al denominatore misurerebbe
   * l'adozione una seconda volta.
   */
  checkupCompletionPercent: number;
  /**
   * Variazione dello stress medio sul trimestre, in punti: l'ultimo mese del
   * trimestre contro l'ultimo del precedente. La finestra è dichiarata perché
   * il numero da solo non è verificabile da chi guarda (§6.1).
   *
   * `null` sul trimestre più vecchio della finestra, che un precedente non ce
   * l'ha. Uno zero direbbe "invariato" dove il dato non esiste, e la KPI
   * uscirebbe neutra invece che vuota (§11: il primo periodo del dataset).
   */
  stressTrendPoints: number | null;
  /**
   * I consulti di medico virtuale **dei soli mesi del trimestre**, e non
   * cumulati come le sedute di psicologo.
   *
   * La differenza è una scelta e va detta, perché le due grandezze vivono
   * sulla stessa schermata: `usagePercent` misura il consumo di un **monte
   * annuo**, quindi si cumula; il medico virtuale sul piano Plus è illimitato
   * (`CLAUDE.md` §9) e non ha nessun monte da consumare, quindi cumularlo
   * darebbe i 118 dei dodici mesi in tutti e quattro i trimestri — un numero
   * che non si muove mai accanto a un selettore che si muove.
   */
  virtualDoctorConsults: number;
  savedChf: number;
  avoidedAbsenceDays: number;
  /** Chiavi delle raccomandazioni in `i18n`, unione per la ragione detta su
      `CheckupReport`: con `string` la schermata e la vista di stampa avevano
      ognuna il proprio `as keyof typeof`. */
  recommendationKeys: (
    | "salesWorkshop"
    | "checkupPush"
    | "coachAwareness"
    | "partnerExtension"
  )[];
};

// ---------------------------------------------------------------------------
// Richiesta demo (area pubblica)
// ---------------------------------------------------------------------------

/**
 * Quello che il form manda. `phone`, `employeeCount` e `message` sono `?` ed è
 * la convenzione giusta su un payload di scrittura: sono campi che si possono
 * lasciare vuoti, e obbligare ogni chiamante a passare `null` sarebbe rumore
 * (`docs/CONTRATTO-DATI.md` §2).
 *
 * **`employeeCount` era obbligatorio e usava lo zero come sentinella**: il form
 * mandava `0` per "non dichiarato" e il back-office lo ridecodificava in "—",
 * quindi un'azienda con zero dipendenti dichiarati era indistinguibile da una
 * che non aveva risposto. Ora attraversa il confine come gli altri due.
 */
export type DemoRequestInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  employeeCount?: number;
  message?: string;
};

/**
 * Quello che il back-office legge. **Non è un'intersezione dell'input**, ed è la
 * differenza fra le due metà della regola: sul modello di lettura l'assenza si
 * dice `null`, sempre presente nella risposta, perché chi legge non deve
 * distinguere "non l'ha scritto" da "il campo non è arrivato".
 *
 * A normalizzare è il confine della scrittura, cioè il provider — che è dove lo
 * farà il backend ricevendo la richiesta.
 */
export type DemoRequest = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  employeeCount: number | null;
  message: string | null;
  submittedAt: Date;
};

// ---------------------------------------------------------------------------
// Back-office admin
// ---------------------------------------------------------------------------

export type UserRole = "employee" | "hr" | "professional" | "admin";

/**
 * Chi sta usando l'applicazione, dal punto di vista dell'accesso.
 *
 * **`UserRole` ha due mestieri da M5.d**, e prima ne aveva uno solo: era il
 * dato che il back-office mostra accanto a un utente. Ora è anche ciò con cui
 * le guardie di rotta decidono. La ragione per cui sono lo stesso tipo e non
 * due è che sono la stessa cosa — il ruolo di una persona non cambia natura a
 * seconda di chi lo guarda — e tenerli separati avrebbe prodotto due
 * enumerazioni da tenere allineate a mano (§5.5).
 *
 * `role` è `null` quando nessuna porta ha ancora concesso niente: è lo stato
 * di chi sta sull'area pubblica, e non è un errore. Il vuoto qui si dice
 * `null` come ovunque (`docs/CONTRATTO-DATI.md` §2).
 *
 * **In produzione questo oggetto lo riempie l'autenticazione**, e il tipo non
 * cambia: `getSession()` non prende parametri per la stessa ragione per cui
 * non ne prendono `getCompany()` e `getEmployeeProfile()` — la persona arriva
 * dalla sessione, non da un argomento (§7 del contratto). È il §5.7 applicato
 * al ruolo: quel giorno cambia chi risponde, non chi chiede.
 */
export type Session = {
  role: UserRole | null;
};

/**
 * Una persona vista dal back-office: **nome, cognome ed email**, cioè
 * un'identità in chiaro.
 *
 * PER QUESTO NON PORTA NESSUN DATO SANITARIO (founder, 16.08.2026). Fino a
 * questa data c'era `healthScore`, il punteggio del profilo salute della
 * persona, e la tabella lo rendeva in una colonna accanto al nome: era l'unico
 * punto del dominio in cui un dato sanitario individuale usciva verso l'area
 * admin, e smentiva la garanzia che il `docs/CONTRATTO-DATI.md` §3 dà per
 * l'intero contratto.
 *
 * `assessmentCompleted` dice **che** l'assessment è stato fatto, mai cosa ha
 * detto: è la stessa distinzione con cui `EmployeeDirectoryEntry` porta lo
 * stato del check-up senza portarne l'esito. Il punteggio resta, ma **come
 * aggregato**, su `PlatformMonth`.
 */
export type PlatformUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
  role: UserRole;
  active: boolean;
  /** Se ha completato l'assessment iniziale (§8). Non dice con che esito. */
  assessmentCompleted: boolean;
  joinedAt: Date;
};

/**
 * Un'azienda cliente vista dal back-office. Il fatturato è **derivato**
 * dall'organico e dal piano, mai scritto: è il punto in cui la demo ereditata
 * dichiarava CHF 99'000 su un organico che l'elenco accanto non confermava
 * (§8).
 */
export type ClientIndustry =
  | "finance"
  | "pharma"
  | "legal"
  | "tech"
  | "insurance";

export type ClientCompany = {
  id: string;
  name: string;
  /** Chiave del settore in `it.ts`: è una categoria, non il nome dell'azienda. */
  industry: ClientIndustry;
  city: string;
  employeeCount: number;
  planId: PlanId;
  /** Primo giorno del mese in cui il contratto è partito (§8). */
  clientSince: Date;
  /**
   * Dipendenti che hanno attivato l'account. Vale 0 per un cliente non ancora
   * avviato, che non è la stessa cosa di un cliente con adozione nulla — a
   * distinguerli è `active`.
   */
  enrolledEmployees: number;
  /**
   * Se il contratto è avviato. Un cliente non attivo **non fattura e non ha
   * iscritti**, e a schermo si legge "in attivazione", non "inattiva": il caso
   * descritto è un contratto firmato da poco, non un abbandono (§8).
   */
  active: boolean;
};

/**
 * Un mese della piattaforma, per l'analytics del back-office (§10.E).
 *
 * Ogni campo è **derivato** dal portafoglio clienti e dalla serie di Demo SA:
 * il §10.E chiede che i totali si ricavino dai dati, ed è il difetto che
 * l'area aveva — "618 utenti attivi" accanto a un tasso di attivazione che ne
 * implicava 767.
 */
export type PlatformMonth = {
  month: Date;
  /** Ricavo ricorrente del mese: somma delle aziende che fatturano */
  recurringRevenueChf: number;
  /** Dipendenti coperti dai contratti attivi in quel mese */
  coveredEmployees: number;
  /** Di quelli, quanti hanno attivato l'account */
  enrolledEmployees: number;
  /** Sessioni erogate nel mese, per servizio */
  sessions: Record<AppointmentKind, number>;
  /**
   * Punteggio medio del profilo salute nel mese, `null` se nessuno l'ha ancora
   * fatto.
   *
   * È **la forma in cui il punteggio individuale può stare in un'area che vede
   * i nomi**: un aggregato non si attribuisce a nessuno. Sta qui e non sulla
   * persona per la decisione del 16.08.2026, ed è su questa serie perché è già
   * quella sola da cui il back-office prende tutti i suoi grafici (§2 del
   * contratto dati).
   */
  averageHealthScore: number | null;
};
