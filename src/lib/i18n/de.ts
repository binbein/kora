/*
 * Il dizionario tedesco (CLAUDE.md §4, blocco e di M5).
 *
 * ⚠︎ QUESTO FILE È PARZIALE: 41 chiavi su 663, i dieci namespace piccoli.
 * Mancano `employee`, `professional`, `hr`, `public` e `admin`.
 *
 * PER QUESTO NON DICHIARA ANCORA `: Dictionary`. L'annotazione è la garanzia
 * del blocco — la forma è quella di `it.ts`, quindi una chiave mancante o
 * rinominata diventa un errore di typecheck invece di una stringa italiana che
 * sbuca in tedesco — ma messa qui adesso **direbbe il falso e romperebbe il
 * typecheck sull'albero**, perché `tsc` legge il filesystem e non git.
 *
 * ARRIVA COME ULTIMA RIGA DEL COMMIT CHE COMPLETA IL FILE, quando la promessa
 * è vera. È la stessa regola del numero di PR che si scrive quando lo si
 * conosce: una dichiarazione si fa quando è verificabile, non quando è
 * comoda.
 *
 * Finché manca, **nessuno importa questo file** e `DICTIONARIES` non lo
 * registra: il tedesco non è raggiungibile e non può comparire a schermo per
 * sbaglio.
 *
 * TEDESCO SVIZZERO: **doppia esse e mai l'Eszett**, ovunque — `Grösse`,
 * `heisst`, `schliessen`. È l'unico errore di registro che si trova a
 * macchina, e infatti lo si trova a macchina: un `grep` dell'Eszett su questo
 * file deve dare **zero**.
 *
 * PER QUESTO IL CARATTERE NON COMPARE NEMMENO IN QUESTO COMMENTO: nominarlo
 * qui darebbe due occorrenze e renderebbe il controllo una lettura invece di
 * un conteggio.
 *
 * IL REGISTRO SEGUE IL §7, e in tedesco diventa la distinzione T-V:
 *   - `employee.*` dà del **du** — è il portale della persona, registro caldo;
 *   - tutto il resto dà del **Sie** — HR, pubblica, professionista, back-office.
 *
 * LE TRE STRINGHE CHE ATTRAVERSANO IL CONFINE sono in forma **nominale**, che
 * non prende posizione, ed è la decisione dei founder del 13.08.2026:
 * `common.state.retry`, `common.accessDenied.toPortal` e `.toHome`. La prima è
 * resa dentro `StateNotice` anche quando il corpo attorno viene da
 * `employee.state`; le altre due da `RequireRole`, che sta sopra ogni layout e
 * non ha un registro da cui ereditare. In italiano sono imperativi con il tu, e
 * lì restano: sui pulsanti l'imperativo è la convenzione del software italiano
 * ed è neutro per prassi — Salva, Annulla, Riprova non danno del tu a nessuno.
 * È il tedesco a costringere la scelta, e FR ed EN ereditano la regola.
 *
 * I SEGNAPOSTO SONO QUELLI DELL'ITALIANO, alla lettera: `{n}`, `{max}`,
 * `{company}`. Rinominarne uno compila e rende `{anzahl}` a schermo, quindi a
 * sorvegliarli c'è un guardrail che li confronta chiave per chiave con `it`.
 *
 * NON SI RIFORMULA IL SIGNIFICATO. Dove l'italiano è ambiguo la traduzione lo
 * segnala invece di sceglierne una lettura; i punti aperti sono elencati nella
 * sezione M5.e di `docs/PROGRESS.md`.
 *
 * LA REVISIONE MADRELINGUA RESTA DA FARE, ed è a verbale: questo file rende il
 * tedesco verificabile e presentabile, non ratificato. Prima di un pitch in
 * tedesco va riletto da chi la lingua ce l'ha.
 */
export const de = {
  common: {
    appName: "Kora",
    none: "—",
    state: {
      /* Nominale: la stessa chiave è resa in entrambi i registri (vedi sopra). */
      retry: "Erneut versuchen",
      error: {
        title: "Daten nicht verfügbar",
        body: "Versuchen Sie es in einem Moment erneut.",
      },
      boot: {
        title: "Kora konnte nicht gestartet werden",
        body: "Laden Sie die Seite neu, um es erneut zu versuchen. Was Sie bisher gemacht haben, wird nicht gespeichert.",
      },
    },

    accessDenied: {
      title: "Geschützter Bereich",
      body: "Dieser Bereich gehört zu einer anderen Rolle.",
      /* Nominali: `RequireRole` sta sopra ogni layout e non ha un registro. */
      toPortal: "Zum eigenen Bereich",
      toHome: "Zur Startseite",
    },
  },

  notFound: {
    title: "Seite nicht gefunden",
    body: "Die Adresse {path} führt zu keiner Seite.",
    home: "Zur Startseite",
  },

  plan: {
    essenziale: "Essenziale",
    plus: "Plus",
    executive: "Executive",
  },

  qualification: {
    psychologist_f: "Psychologin FSP",
    psychologist_m: "Psychologe FSP",
    coach_m: "Coach",
  },

  specialty: {
    work_stress: "Arbeitsstress",
    burnout_anxiety: "Burnout und Angst",
    sleep: "Schlaf",
    coaching: "Coaching",
  },

  language: {
    it: "Italiano",
    de: "Deutsch",
    fr: "Français",
    en: "English",
  },

  healthArea: {
    sleep: "Schlaf",
    stress: "Stress",
    activity: "Bewegung",
    nutrition: "Ernährung",
    mental: "Psychische Gesundheit",
  },

  healthSummary: {
    balanced: "Gut im Gleichgewicht",
    attention: "Im Auge zu behalten",
    at_risk: "Gefährdet",
  },

  sessionType: {
    first_visit: "Erstgespräch",
    session: "Sitzung",
    follow_up: "Folgetermin",
  },

  cancellationReason: {
    by_patient: "Von der Patientin abgesagt",
    by_professional: "Von der Fachperson abgesagt",
  },
};
