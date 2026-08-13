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

  /*
   * Percorso dipendente (§10.B). **È l'unica area che dà del du.**
   *
   * IL MEDICO VIRTUALE DÀ DEL SIE ANCHE QUI DENTRO, ed è il §7 applicato alla
   * lettera: un professionista parla come parlerebbe lui, non come parla il
   * prodotto. Quindi in `doctor` convivono due registri — il prodotto che si
   * rivolge a Laura (titolo, sottotitolo, campo, disclaimer) dà del du, e i
   * messaggi del medico (`greeting`, `reply.*.text`, `fallback`) danno del Sie,
   * dall'inizio alla fine della conversazione.
   */
  employee: {
    nav: {
      home: "Start",
      psychologists: "Psychologie",
      doctor: "Arzt",
      checkup: "Check-up",
      aiPlan: "KI-Plan",
      profile: "Profil",
    },

    identity: "{company} · {plan}",

    privacy:
      "Dein Unternehmen sieht nur aggregierte und anonyme Daten. Deine Gesundheit bleibt deine.",

    state: {
      error: {
        title: "Dieser Teil wurde nicht geladen",
        body: "Versuch es in einem Moment erneut.",
      },
    },

    service: {
      psychologist: "Psychologe",
      coach: "Coach",
    },

    home: {
      greeting: "Guten Morgen {name}",
      subtitle: "Deine Gesundheit, an einem Ort.",

      healthTitle: "Dein Gesundheitszustand",
      scoreOutOf: "/100",
      weakestArea: {
        sleep: "Der Schlaf verdient Aufmerksamkeit",
        stress: "Der Stress verdient Aufmerksamkeit",
        activity: "Die Bewegung verdient Aufmerksamkeit",
        nutrition: "Die Ernährung verdient Aufmerksamkeit",
        mental: "Die psychische Gesundheit verdient Aufmerksamkeit",
      },
      weakestAreaHint: "Hier setzt dein Präventionsplan an.",

      appointmentsTitle: "Deine nächsten Termine",
      appointmentsEmpty: "Du hast keine geplanten Termine.",
      appointmentWhen: "{weekday} {date}, um {time}",

      sessions: "{used} von {total} Sitzungen genutzt",
      sessionsWithScheduled:
        "{used} von {total} Sitzungen genutzt · {scheduled} geplant",
      book: "Sitzung buchen",

      quickAction: {
        doctor: "Virtueller Arzt",
        checkup: "Jährlicher Check-up",
        aiPlan: "Präventionsplan",
        profile: "Gesundheitsprofil",
      },
      checkupDone: "Erledigt",

      planTitle: "Aus deinem Präventionsplan",
      planCta: "Plan ansehen",
    },

    rapidCheck: {
      question: "Wie geht es dir heute?",
      hint: "Eine Frage, ein Tippen. Deine Antwort fliesst nur in den Durchschnitt deiner Abteilung ein.",
      option: {
        1: "Sehr gut",
        2: "Gut",
        3: "Geht so",
        4: "Nicht gut",
        5: "Sehr schlecht",
      },
      error: {
        title: "Wir konnten es nicht erfassen",
        body: "Tipp erneut, um es nochmals zu versuchen.",
      },
      done: "Danke, erfasst.",
      doneHint: "Wir fragen dich in ein paar Tagen wieder, wie es dir geht.",
    },

    psychologists: {
      title: "Sprich mit jemandem",
      subtitle:
        "Psychologinnen, Psychologen und Coaches im Kora-Netzwerk. Wähle, wer dich begleitet, und buche, wann es dir passt.",
      filter: {
        psychologist: "Psychologie",
        coach: "Coaching",
      },
      empty: "Für diesen Dienst ist keine Fachperson verfügbar.",
      totalSessions: "{n} durchgeführte Sitzungen",
      book: "Buchen",

      dialog: {
        title: "Termin bei {professional}",
        chooseDay: "Wähle einen Tag",
        chooseTime: "Wähle eine Uhrzeit",
        noSlots:
          "Im Moment sind keine Zeiten frei. Versuch es in ein paar Tagen erneut.",
        summary: "Übersicht",
        summaryWhen: "{weekday} {date}, um {time}",
        dayOption: "{weekday} {date}",
        included: "Sitzung in deinem Plan enthalten",
        overCapWithPrice:
          "Die enthaltenen Sitzungen sind aufgebraucht: diese kostet {price}",
        overCapWithoutPrice:
          "Du hast die in deinem Plan enthaltenen Sitzungen für diesen Dienst aufgebraucht.",
        confirm: "Buchung bestätigen",
        error: {
          title: "Die Buchung hat nicht geklappt",
          body: "Der Termin ist noch frei: versuch es erneut.",
        },
        confirmedTitle: "Buchung bestätigt",
        confirmedWith: "bei {professional}",
        confirmedNote:
          "Du findest sie auf deiner Startseite. Den Link für das Video bekommst du per E-Mail.",
        close: "Schliessen",
      },
    },

    doctor: {
      title: "Virtueller Arzt",
      subtitle: "Beschreib deine Beschwerden: eine Ärztin oder ein Arzt antwortet dir.",
      sla: "Antwort innerhalb von {hours} Stunden",
      online: "Online",
      placeholder: "Beschreib deine Beschwerden",
      send: "Senden",
      typing: "Der Arzt schreibt",

      /*
       * Le parole chiave sono tedesche, ed è il motivo per cui stanno nel
       * dizionario: il confronto è sul testo che scrive chi legge, e nessuno
       * scriverebbe "schiena" in tedesco. Sono minuscole perché `replyTo`
       * confronta su `toLowerCase()`.
       *
       * DA QUI IN GIÙ PARLA IL MEDICO, QUINDI SI DÀ DEL SIE (§7).
       */
      greeting:
        "Guten Tag. Ich bin die diensthabende Ärztin des Kora-Dienstes. Sagen Sie mir: welche Beschwerden führen Sie heute zu uns?",
      reply: {
        back: {
          keyword: "rücken",
          text: "Die Schmerzen tun mir leid. Ich stelle Ihnen ein paar Fragen: strahlt der Schmerz ins Bein aus? Haben Sie Fieber oder Kribbeln?",
        },
        head: {
          keyword: "kopf",
          text: "Kopfschmerzen können verschiedene Ursachen haben. Sind sie punktuell oder diffus? Nehmen Sie zurzeit Medikamente ein?",
        },
        stress: {
          keyword: "stress",
          text: "Stress kann sich auf viele Arten zeigen. Ich empfehle Ihnen, im entsprechenden Bereich eine Sitzung bei einer Psychologin zu buchen. In der Zwischenzeit kann ich Ihnen bei den körperlichen Beschwerden helfen.",
        },
        sleep: {
          keyword: "schlaf",
          text: "Schlafstörungen sind sehr verbreitet. Seit wann haben Sie Schwierigkeiten? Wachen Sie nachts auf oder fällt Ihnen das Einschlafen schwer?",
        },
      },
      fallback:
        "Ich verstehe. Können Sie mir die Beschwerden genauer beschreiben? Seit wann spüren Sie sie?",

      /* Qui torna a parlare il prodotto: du. */
      disclaimer:
        "Dieses Gespräch ist eine Demonstration. Die Antworten sind keine ärztliche Beurteilung und ersetzen keine Untersuchung. Wähle im Notfall die 144.",
      privacy:
        "Die Gespräche sind privat und geschützt. Dein Unternehmen erhält nie Zugriff auf diese Informationen.",
    },

    checkup: {
      title: "Jährlicher Check-up",
      subtitle: "Der körperliche Check-up, der in deinem Plan enthalten ist.",

      lastTitle: "Dein letzter Befund",
      lastDone: "Durchgeführt am {date} · {provider}",
      lastOpen: "Zum Ansehen tippen",

      nextFrom: "Ab dem {date} kannst du einen neuen buchen.",

      networkTitle: "Die Partnerzentren",
      networkHint:
        "In diesen Zentren bucht Kora deinen Check-up, mit den Kosten bereits durch den Plan gedeckt.",
      networkEmpty: "Im Moment ist keine Einrichtung verfügbar.",
      distance: "{km} km",
      providerAddress: "{address}, {city}",
      bookFrom: "Ab {date}",

      report: {
        title: "Befund vom {date}",
        measurement: {
          blood_pressure: "Blutdruck",
          cholesterol: "Cholesterin",
          ecg: "EKG",
          bmi: "BMI",
          stress_risk: "Stressrisiko",
        },
        status: {
          normal: "Im Normbereich",
          attention: "Im Auge zu behalten",
        },
        explanationTitle: "Was das bedeutet",
        explanation: {
          laura:
            "Das Cholesterin liegt leicht über dem empfohlenen Wert und das Stressrisiko ist mässig. Das ist kein Notfall: folge dem Präventionsplan und wiederhole die Kontrolle beim nächsten Check-up.",
        },
        disclaimer:
          "Demonstrativer Befund mit Beispielwerten. Er ist kein klinisches Dokument und ersetzt nicht den Befund des Zentrums, das den Check-up durchführt.",
      },
    },

    profile: {
      title: "Dein Profil",
      privacy:
        "Deine Gesundheit bleibt deine. Es werden keine individuellen Daten an dein Unternehmen weitergegeben.",

      company: "Unternehmen",
      plan: "Plan",
      memberSince: "Mitglied seit",

      healthTitle: "Gesundheitsübersicht",
      score: "Gesundheitswert",
      scoreValue: "{score}/100",
      summary: "Einschätzung",
      weakest: "Bereich mit Priorität",

      usageTitle: "Nutzung der Dienste",
      usage: {
        psychologist: "Sitzungen Psychologie",
        coach: "Sitzungen Coaching",
        checkup: "Jährlicher Check-up",
        doctor: "Konsultationen virtueller Arzt",
      },
      outOf: "{used} von {total}",
      checkupDone: "Durchgeführt am {date}",
      checkupToBook: "Noch zu buchen",
      consults: "{n} in diesem Jahr",

      dataNote:
        "Deine Gesundheitsdaten sind geschützt und werden nie an Dritte weitergegeben.",
    },

    aiPlan: {
      title: "Präventionsplan",
      subtitle: "Auf dein Gesundheitsprofil abgestimmt.",
      generated: "Aktualisiert im {month}",
      nextUpdate: "Die nächste Aktualisierung erfolgt im {month}.",

      goal: {
        sleep_hours: "Den Schlaf von 6 auf 7 Stunden pro Nacht bringen",
        stress_reduction:
          "Den empfundenen Stress in 8 Wochen um 15% senken",
        activity_weekly: "Auf 2 Bewegungseinheiten pro Woche kommen",
        nutrition_cholesterol:
          "Das Cholesterin mit ausgewogener Ernährung in den Normbereich zurückbringen",
        mental_coaching: "Im nächsten Monat 2 Sitzungen mit dem Coach machen",
      },

      tip: {
        sleep_screens: "Vermeide Bildschirme in den 30 Minuten vor dem Schlafen",
        sleep_schedule: "Geh immer zur gleichen Zeit ins Bett und steh gleich auf",
        sleep_caffeine: "Kein Koffein nach 14:00 Uhr",
        stress_breathing: "Nimm dir täglich 10 Minuten für die Atmung",
        stress_breaks: "Plane alle 90 Minuten eine Pause ein",
        stress_coach:
          "Buche eine Sitzung mit dem Coach für die Bewältigungstechniken",
        activity_walk: "Fang mit Spaziergängen von 30 Minuten an",
        activity_stairs: "Nimm die Treppe statt den Lift",
        activity_yoga: "Probier eine Yogastunde online aus",
        nutrition_fibre: "Erhöhe Ballaststoffe und Gemüse bei jeder Mahlzeit",
        nutrition_fats: "Reduziere gesättigte Fette",
        nutrition_recheck:
          "Wiederhole die Cholesterinkontrolle beim nächsten Check-up",
        mental_continue: "Setz den Weg mit der Psychologin fort",
        mental_techniques: "Nutze die gelernten Techniken auch ausserhalb der Sitzung",
        mental_journal: "Halt fest, wie du dich an schwierigen Tagen fühlst",
      },
    },
  },
};
