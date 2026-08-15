import type { Dictionary } from "./index";

/*
 * Il dizionario tedesco (CLAUDE.md §4, blocco e di M5).
 *
 * SI DICHIARA `Dictionary`, ED È LÌ CHE STA LA GARANZIA: la forma è quella di
 * `it.ts`, quindi una chiave mancante o rinominata è un errore di typecheck e
 * non una stringa italiana che sbuca in tedesco. "Stesse chiavi" smette di
 * essere una promessa.
 *
 * L'annotazione è arrivata **con il commit che ha completato il file**, non
 * prima: su un dizionario parziale avrebbe dichiarato il falso e rotto il
 * typecheck sull'albero, perché `tsc` legge il filesystem e non git.
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
 *
 * DA PORTARE A QUELLA REVISIONE, nominate qui perché non si perdano nel diff.
 * Non sono errori: sono scelte su cui **non siamo il giudice giusto**, e la
 * revisione nativa è l'unico posto in cui la domanda ha una risposta vera
 * (founder, 14.08.2026).
 *
 *   1. `admin.professionals.kpiSessions` — "sedute di carriera" è reso
 *      `Sitzungen gesamt`. L'italiano ha coniato un'espressione per separare
 *      questo totale da altri due conteggi su schermate vicine; il tedesco non
 *      ha un composto corto che non suoni come storia d'impiego, quindi la
 *      distinzione si sposta tutta nel sottotitolo sotto la KPI.
 *   2. `admin.checkupProviders.statusPending` — "in convenzionamento" è reso
 *      `In Vertragsprüfung`. Nomina un istituto sanitario svizzero che in
 *      tedesco non ha un equivalente in una parola: la resa dice cosa lo stato
 *      **è**, cioè che il contratto è in esame.
 *   3. `employee.home.greeting` — `Guten Tag {name}` è la resa fedele di
 *      "Buongiorno", che copre tutta la giornata mentre `Guten Morgen` no. In
 *      un registro caldo un madrelingua potrebbe preferire `Hallo`: è una
 *      scelta di tono, non di significato.
 *   4. Le forme femminili di `professional.*` — `Patientinnen`,
 *      `Patientin {initials}`. L'italiano le usa perché il portale è quello
 *      della Dr.ssa Meier; il tedesco costringe a scegliere, e il maschile
 *      generico avrebbe cambiato in silenzio di chi parla la demo.
 */
export const de: Dictionary = {
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
      /* "Buongiorno" copre tutta la giornata, "Guten Morgen" solo il mattino,
         e il saluto è statico: "Guten Tag" è la resa fedele. */
      greeting: "Guten Tag {name}",
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
          "Du hast die in deinem Plan enthaltenen Sitzungen für diesen Dienst in diesem Jahr aufgebraucht. Für weitere sprich mit deiner HR-Ansprechperson.",
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
      notInPlan: "Nicht im Plan enthalten",

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

  /* Portale professionista: registro strumento, **Sie**. */
  professional: {
    portalName: "Portal für Fachpersonen",

    nav: {
      calendar: "Kalender",
      sessions: "Sitzungen",
      patients: "Patientinnen",
      payments: "Zahlungen",
      profile: "Profil",
    },

    feePerSession: "{fee} pro Sitzung",

    calendar: {
      title: "Kalender",
      week: "Woche vom {from} bis {to}",
      sessionsThisWeek: "Sitzungen diese Woche",
      nextSession: "Nächste Sitzung",
      sessionsThisMonth: "Diesen Monat im Kalender",
      activePatients: "Aktive Patientinnen",
      noNextSession: "Keine",
      nextSessionValue: "{weekday} {time}",
      legendBooked: "Gebucht",
      legendFree: "Frei",
      legendPast: "Vergangen",
      today: "heute",
      empty: "Keine Sitzung in dieser Woche.",
    },

    sessions: {
      title: "Sitzungen",
      upcoming: "Geplant ({n})",
      completed: "Durchgeführt ({n})",
      cancelled: "Abgesagt ({n})",
      start: "Starten",
      addNote: "Notiz hinzufügen",
      editNote: "Notiz",
      emptyUpcoming: "Keine geplante Sitzung.",
      emptyCompleted: "Keine durchgeführte Sitzung.",
      emptyCancelled: "Keine abgesagte Sitzung.",
      note: {
        title: "Private Notiz — {patient}",
        notes: "Notizen zur Sitzung",
        notesPlaceholder: "Private klinische Aufzeichnungen",
        nextGoal: "Nächstes Ziel",
        nextGoalPlaceholder: "Ziel für die nächste Sitzung",
        followUp: "Empfohlener Folgetermin",
        followUpPlaceholder: "Nächste Sitzung empfohlen in",
        save: "Notiz speichern",
        saving: "Wird gespeichert",
        error: {
          title: "Notiz nicht gespeichert",
          body: "Der Text ist noch hier: versuchen Sie es erneut.",
        },
        saved: "Notiz gespeichert",
        privacy:
          "Die Notizen sind privat und werden nicht mit dem Unternehmen der Patientin geteilt.",
      },
    },

    patients: {
      title: "Patientinnen",
      count: "{n} aktive Patientinnen",
      privacy:
        "Die Namen sind aus Datenschutzgründen abgekürzt. Die klinischen Notizen sehen nur Sie.",
      name: "Patientin {initials}",
      delivered: "{n} durchgeführte Sitzungen",
      next: "Nächste: {date}",
      noNext: "Keine geplante Sitzung",
      new: "Neu",
      withinCap: "{used} von {total} enthalten",
      overCap: "{total} enthalten + {extra} zu {price}",
      capReached: "Enthaltene Sitzungen aufgebraucht",
    },

    payments: {
      title: "Zahlungen",
      sessionsThisMonth: "Durchgeführte Sitzungen",
      feePerSession: "Tarif pro Sitzung",
      monthTotal: "Total des Monats",
      yearTotal: "Total des Jahres",
      monthInProgress: "{month} · laufend",
      model:
        "Vergütung pro durchgeführte Sitzung. Kora stellt die Rechnung und zahlt bis zum 5. des Folgemonats.",
      capacityTitle: "Ihr Pensum",
      capacity:
        "Sie halten {sessions} Sitzungen pro Woche. Bei vollem Pensum sind es {full} pro Woche, die {min}–{max} im Monat ergeben: die Zusammenarbeit beginnt bei einer Mindestverfügbarkeit von {minHours} Stunden pro Woche und wächst mit dem Kalender.",
      weeks: "Wochen des Monats",
      weeksEmpty: "In diesem Monat wurden keine Sitzungen durchgeführt.",
      payoutsEmpty: "Noch keine Zahlungen.",
      weekRange: "vom {from} bis {to}",
      weekDetail: "{sessions} Sitzungen · {minutes} Min.",
      paid: "Bezahlt",
      pending: "Ausstehend",
      paidOn: "am {date}",
      sessionsTimesFee: "{sessions} Sitzungen × {fee}",
      empty: "Noch keine Vergütung angefallen.",
    },

    profile: {
      title: "Berufsprofil",
      empty: "Kein Profil anzuzeigen.",
      languages: "Sprachen",
      specialty: "Spezialisierung",
      collaboration: "Zusammenarbeit",
      fee: "Tarif pro Sitzung",
      documents: "Dokumente",
      verified: "Verifiziert",
      documentsPending: "In Prüfung",
      mandate: "Auftragsvertrag",
      signed: "Unterzeichnet",
      mandatePending: "Zu unterzeichnen",
      totalSessions: "{n} durchgeführte Sitzungen",
      mandateNote:
        "Zusammenarbeit im Auftragsverhältnis. Keine Anstellung: Kora bringt die Patientinnen und übernimmt Buchungen, Video und Zahlungen.",
    },
  },

  /* Portale HR: registro strumento, **Sie**. */
  hr: {
    portalName: "HR-Portal",
    navDashboard: "Dashboard",
    navEmployees: "Mitarbeitende",
    navReport: "Bericht",
    navBilling: "Rechnungen",
    navPrivacy: "Datenschutz",
    navCompanyMeta: "{count} Mitarbeitende · Plan {plan}",

    dashboardTitle: "HR-Dashboard",
    companySubtitle: "{name} · {count} Mitarbeitende · Plan {plan}",

    quarterSelectorLabel: "Quartal",
    quarterLabel: "{quarter}. Quartal {year}",
    quarterLabelInProgress: "{quarter}. Quartal {year} · laufend",
    quarterShort: "Q{quarter}",

    privacyNote:
      "Aggregierte und anonyme Daten · Mindestschwelle {threshold} gemessene Mitarbeitende pro Abteilung",

    kpiSavings: "Einsparung des Quartals",
    kpiSavingsHint: "{days} vermiedene Absenztage",
    kpiAdoption: "Nutzung",
    kpiAdoptionHint: "{enrolled} von {total} angemeldet",
    kpiActive: "Aktive Mitarbeitende",
    kpiActiveHint: "mindestens ein Dienst im Quartal",
    kpiStress: "Durchschnittlicher Stress",
    kpiStressValue: "{points} Punkte",
    kpiStressHint: "vs. Vorquartal",
    kpiStressEmpty: "kein Vorquartal im Zeitfenster",

    quarterEmpty:
      "Keine Daten für das gewählte Quartal. Wählen Sie oben ein anderes aus.",
    kpiSessions: "Genutzte Sitzungen",
    kpiSessionsHint: "{used} von {total} Jahressitzungen",
    kpiCheckup: "Abgeschlossene Check-ups",
    kpiCheckupHint: "{done} von {enrolled} angemeldet",

    alertTitle: "Frühwarnung — Abteilung {department} · letzte Erhebung",
    alertDescription:
      "Der Stress der Abteilung liegt seit {months} aufeinanderfolgenden Monaten im hohen Bereich, seit {since}.",

    usageTitle: "Nutzung der Dienste · letzte {months} Monate",
    distributionTitle: "Verteilung der Dienste",
    distributionSubtitle: "kumuliert vom Beginn des Zeitfensters bis {quarter}",
    distributionEntry: "{service}: {count}",

    stressByDepartment: "Stress nach Abteilung · letzter Monat",
    departmentMeta: "{employees} Mitarbeitende · {measured} gemessen",
    departmentScore: "{percent} · {level}",
    suppressed: "Unter der Schwelle",
    suppressedTooltip:
      "Unter der Schwelle wird der Wert nicht berechnet, damit er nicht einzelnen Personen zugeordnet werden kann.",

    trendTitle: "Stressverlauf · letzte {months} Monate",
    trendCompany: "Durchschnitt Unternehmen",
    trendAlertMarker: "Warnung",
    trendCompanyLegend: "von {from} bis {to} · durchgehend im mittleren Bereich",
    trendDepartmentLegend: "von {from} bis {to} · im hohen Bereich ab Monat {month}",

    roiTitle: "Einsparung pro Quartal",

    stressLevel: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
    },

    service: {
      psychologist: "Psychologie",
      virtual_doctor: "Virtueller Arzt",
      coach: "Coaching",
      checkup: "Check-up",
    },

    employees: {
      title: "Mitarbeitende",
      subtitle: "{enrolled} von {total} angemeldet · nur anonyme Daten",
      sampleNote: "Die Tabelle zeigt einen Auszug von {n} Mitarbeitenden.",
      empty: "Keine Mitarbeitenden anzuzeigen.",
      privacyNote:
        "Die Namen sind abgekürzt. Kora zeigt dem Unternehmen nie individuelle Gesundheitsdaten.",
      columnEmployee: "Mitarbeitende",
      columnDepartment: "Abteilung",
      columnStatus: "Status",
      columnCheckup: "Check-up",
      enrolled: "Aktiv",
      notEnrolled: "Ausstehend",
      checkup: {
        completed: "Abgeschlossen",
        booked: "Gebucht",
        available: "Verfügbar",
      },
    },

    billing: {
      title: "Rechnungen",
      planTitle: "Aktiver Plan",
      employees: "Mitarbeitende",
      monthlyCost: "Monatliche Kosten",
      annualContract: "Jahresvertrag",
      renewal: "Ablauf",
      invoicesTitle: "Aktuelle Rechnungen",
      invoicesEmpty: "Bisher keine Rechnung ausgestellt.",
      invoiceDetail: "{count} Mitarbeitende × {price}",
      invoicePaid: "Bezahlt",
      invoicePending: "Ausstehend",
      simulatorTitle: "Kostenrechner",
      simulatorEmployees: "Mitarbeitende",
      simulatorPlan: "Plan",
      simulatorBilling: "Rhythmus",
      billingMonthly: "Monatlich",
      billingAnnual: "Jährlich",
      totalMonthly: "Total monatlich",
      totalAnnual: "Total jährlich",
      planOption: "{name} ({price})",
    },

    report: {
      title: "Bericht zur Unternehmensgesundheit",
      subtitle: "{quarter} · {company}",
      download: "PDF herunterladen",
      downloadError: {
        title: "Das PDF wurde nicht erstellt",
        body: "Versuchen Sie den Download erneut.",
      },
      metricsTitle: "Kennzahlen",
      adoption: "Aktivierungsrate",
      usage: "Sitzungen am Jahreskontingent",
      checkup: "Abgeschlossene Check-ups",
      stress: "Durchschnittlicher Stress",
      stressValue: "{points} Punkte",
      savings: "Geschätzte Einsparung",
      avoidedDays: "Vermiedene Absenztage",
      daysValue: "{days} Tage",
      recommendationsTitle: "Empfehlungen",
      recommendation: {
        /* Il nome del reparto viene dal dataset (`mock/company.ts`) e non si
           traduce, come i titoli professionali: questa riga deve dire quello
           che il banner dell'alert mostra due schermate più in là, dove
           `{department}` rende `Vendite`. Diceva `Verkauf`, quindi lo stesso
           reparto compariva con due nomi. */
        salesWorkshop:
          "Eine Massnahme für die Abteilung Vendite planen, seit drei Monaten im hohen Bereich.",
        checkupPush:
          "Den jährlichen Check-up bei allen in Erinnerung rufen, die das Konto aktiviert und ihn noch nicht gebucht haben.",
        coachAwareness:
          "Das Coaching bekannter machen: es ist die Leistung des Plans mit der geringsten Nutzung.",
        partnerExtension:
          "Die Erweiterung auf Angehörige prüfen, optional im Plan Plus.",
      },

      pdf: {
        documentTitle: "Bericht zur Unternehmensgesundheit",
        documentSubtitle: "{company} · {employees} Mitarbeitende · Plan {plan}",
        period: "Zeitraum · {quarter}",
        generatedOn: "Erstellt am {date}",
        active: "Aktive Mitarbeitende",
        sessions: "Genutzte Sitzungen",
        sessionsValue: "{used} von {total}",
        privacyNote:
          "Aggregierte und anonyme Daten. Kora übermittelt dem Unternehmen keine individuellen Gesundheitsdaten und keine Buchungen, die einzelnen Personen zugeordnet werden können.",
      },
    },

    privacy: {
      title: "Datenschutz und Sicherheit",
      subtitle: "Der Datenschutz ist das Herz von Kora.",
      neverSeenTitle: "Das Unternehmen sieht nie:",
      neverSeen: {
        healthData: "Individuelle Gesundheitsdaten",
        names: "Wer die Psychologie genutzt hat",
        notes: "Klinische Notizen oder Befunde",
        diagnoses: "Diagnosen oder Behandlungen",
        bookings: "Individuelle Buchungen",
      },
      measurementTitle: "Woher die Stressdaten kommen",
      measurementBody:
        "Der Stresswert kommt aus dem Schnellcheck: eine Frage, ein Tippen, von der Person selbst angegeben. Er wird nie aus dem Verhalten abgeleitet — weder aus gebuchten Sitzungen noch aus dem Öffnen der App.",
      anonymousLinkTitle: "Auch ohne Konto",
      anonymousLinkBody:
        "Der Schnellcheck wird in der App oder über einen anonymen Link beantwortet, der kein aktiviertes Konto voraussetzt. Nur die Angemeldeten zu messen hiesse, nur die bereits Erreichten zu messen — und der Wert zählt vor allem dort, wo die Nutzung noch nicht angekommen ist.",
      thresholdTitle: "Anonymitätsschwelle",
      thresholdBody:
        "Der Wert einer Abteilung wird nur veröffentlicht, wenn in diesem Zeitraum mindestens {threshold} gemessene Mitarbeitende geantwortet haben. Unter der Schwelle zeigt das Dashboard einen Strich und keinen Wert.",
      principle: {
        noIndividual: {
          title: "Keine individuellen Daten",
          body: "Das Unternehmen sieht nie Sitzungen, Befunde, Diagnosen oder Gesundheitsdaten einzelner Mitarbeitender.",
        },
        aggregated: {
          title: "Nur aggregierte Daten",
          body: "Das Dashboard zeigt anonyme Statistiken, aggregiert nach Abteilung oder Unternehmen.",
        },
        encryption: {
          title: "Ende-zu-Ende-Verschlüsselung",
          body: "Die Gesundheitsdaten sind bei der Übertragung und im Ruhezustand nach AES-256 verschlüsselt.",
        },
        hosting: {
          title: "Hosting in der Schweiz",
          body: "Die Daten liegen auf Servern in der Schweiz, konform mit dem Bundesgesetz über den Datenschutz.",
        },
        compliance: {
          title: "DSGVO- und DSG-Konformität",
          body: "Kora ist konform mit der europäischen DSGVO und dem Schweizer DSG.",
        },
        consent: {
          title: "Einwilligung der Mitarbeitenden",
          body: "Jede Person bestätigt die Einwilligung bei der Aktivierung und kann sie jederzeit widerrufen.",
        },
      },
    },
  },

  /*
   * Area pubblica: registro strumento, **Sie** — e qui il Sie è quello di
   * cortesia rivolto a **un'azienda che valuta**, non alla persona che userà
   * il prodotto. La seconda persona calda comincia dopo l'accesso.
   */
  public: {
    nav: {
      pricing: "Pläne",
      roi: "ROI-Rechner",
      demo: "Demo",
      employees: "Mitarbeitende",
      hr: "HR",
      professionals: "Fachpersonen",
      login: "Anmelden",
      bookDemo: "Demo buchen",
      menu: "Menü öffnen",
      language: "Sprache",
    },

    footer: {
      tagline: "Das Betriebssystem für die Gesundheit Schweizer Unternehmen.",
      city: "Lugano, Schweiz",

      platformTitle: "Plattform",
      platformPricing: "Pläne und Preise",
      platformRoi: "ROI-Rechner",
      platformEmployee: "Portal für Mitarbeitende",
      platformHr: "HR-Portal",
      platformProfessional: "Für Fachpersonen",

      companyTitle: "Unternehmen",
      companyAbout: "Über uns",
      companyContact: "Kontakt",
      companyCareers: "Karriere",
      companyBlog: "Blog",

      privacyTitle: "Datenschutz und Sicherheit",
      privacyBody:
        "Geschützte Gesundheitsdaten. DSGVO- und DSG-konform. Hosting in der Schweiz.",

      legalPrivacy: "Datenschutzerklärung",
      legalTerms: "Nutzungsbedingungen",
      legalCookies: "Cookie-Richtlinie",

      copyright: "© {year} Kora Switzerland SA. Alle Rechte vorbehalten.",
    },

    roi: {
      title: "Was die Gesundheit der Mitarbeitenden heute kostet",
      empty: "Der Rechner ist im Moment nicht verfügbar.",
      subtitle:
        "Die Verluste, die ein Schweizer Unternehmen jedes Jahr trägt, und wie viel davon mit Kora zurückkommt. Konservatives Szenario.",

      employeesLabel: "Anzahl Mitarbeitende",
      employeesRange: "Von {min} bis {max} Mitarbeitende",

      lossesTitle: "Geschätzte Jahresverluste",
      loss: {
        absenteeism: "Absenzen",
        presenteeism: "Präsentismus",
        burnout: "Vorklinisches Burnout",
        turnover: "Gesundheitsbedingte Fluktuation",
      },
      lossHint: {
        absenteeism: "{days} Absenztage pro Mitarbeitende, zu {cost} pro Tag",
        presenteeism: "{cost} verlorene Produktivität pro Mitarbeitende",
        burnout: "{share} der Belegschaft gefährdet, {loss} verlorene Produktivität",
        turnover: "{rate} gesundheitsbedingte Abgänge, plus die Wiederbesetzungskosten",
      },
      lossesTotal: "Total Verluste",

      savingsTitle: "Mit Kora",
      savings: "Geschätzte Einsparung",
      savingsHint:
        "{absence} auf Absenzen und Präsentismus, {burnout} auf Burnout und Fluktuation",
      cost: "Kosten Kora",
      costHint: "Im Plan {plan}, {price} pro Mitarbeitende und Monat",
      costValue: "− {amount}",
      netSavings: "Nettoeinsparung",
      ratio: "Rendite der Investition",
      ratioValue: "{ratio}:1",
      ratioHint: "Nettoeinsparung pro investiertem Franken",

      perEmployee:
        "≈ {amount} pro Mitarbeitende und Jahr, konservatives Szenario",

      linearityNote:
        "Jede Position wächst proportional zur Belegschaft: das Verhältnis bleibt {ratio} bei jeder Anzahl Mitarbeitender.",

      sources: "Konservatives Szenario. Quellen: SECO, Job Stress Index.",

      ctaTitle: "Diese Zahlen, auf Ihr Unternehmen gerechnet",
      ctaBody:
        "Eine Demo von dreissig Minuten mit den Daten Ihrer Branche und Ihrer Belegschaft.",
      ctaButton: "Demo buchen",
      ctaPricing: "Pläne ansehen",
    },

    plans: {
      title: "Transparente Pläne, konkreter Wert",
      empty: "Im Moment ist kein Plan anzuzeigen.",
      subtitle:
        "Ein Abonnement pro Mitarbeitende. Keine versteckten Kosten. Messbarer ROI ab dem ersten Quartal.",

      target: {
        essenziale: "Unternehmen mit 20–100 Mitarbeitenden",
        plus: "Unternehmen mit 100–300 Mitarbeitenden",
        executive: "Unternehmen ab 300 Mitarbeitenden",
      },

      recommended: "Empfohlener Plan",
      priceUnit: "/ Mitarbeitende / Monat",
      cta: "Offerte anfragen",

      feature: {
        sessions: "{count} Psychologiesitzungen pro Jahr",
        intro: "Kostenloses Erstgespräch, einmalig",
        coach: "{count} Coaching-Sitzungen pro Jahr",
        psychiatrist: "Psychiatrische Betreuung auf Anfrage inbegriffen",
        nutritionist: "{count} Ernährungsberatungen pro Jahr",
        virtualDoctorUnlimited:
          "Virtueller Arzt unbegrenzt, Antwort innerhalb von {hours} Stunden",
        virtualDoctorUnlimitedOneHour:
          "Virtueller Arzt unbegrenzt, Antwort innerhalb einer Stunde",
        virtualDoctorCapped:
          "{count} Konsultationen beim virtuellen Arzt pro Jahr, Antwort innerhalb von {hours} Stunden",
        virtualDoctorCappedOneHour:
          "{count} Konsultationen beim virtuellen Arzt pro Jahr, Antwort innerhalb einer Stunde",
        checkup: {
          annual: "Jährlicher körperlicher Check-up",
          executive:
            "Vollständiger Executive-Check-up: EKG, Bauchultraschall, Augenarzt, komplettes Blutbild",
        },
        aiPlanMonthly: "KI-Präventionsplan, monatlich aktualisiert",
        aiPlanEveryMonths:
          "KI-Präventionsplan, alle {months} Monate aktualisiert",
        hrDashboard: {
          base: "HR-Dashboard und Basis-ROI: Nutzung, anonymisierter Stress, Einsparung in CHF",
          department:
            "HR-Dashboard nach Abteilung mit Quartalsbericht und Burnout-Frühwarnung",
          advanced:
            "Erweitertes HR-Dashboard, mit Monatsbericht und monatlichem Call mit dem klinischen Team",
        },
        workshops: "{count} Live-Workshops pro Jahr inbegriffen",
        family: "Angehörige inbegriffen: Partner und ein Kind",
        partnerExtension:
          "Erweiterung auf Angehörige: + {price} pro Mitarbeitende und Monat, optional",
        extraSession: "Sitzung über dem Kontingent: {price}",
      },
    },

    costSimulator: {
      title: "Kosten berechnen",
      employeesLabel: "Anzahl Mitarbeitende",
      planLabel: "Plan",
      planOption: "{plan} — {price} pro Monat",
      billingLabel: "Rechnungsstellung",
      billingMonthly: "Monatlich",
      billingAnnual: "Jährlich",
      totalMonthly: "Total monatlich",
      totalAnnual: "Total jährlich",
      breakdownAnnual: "{employees} Mitarbeitende × {price} × 12 Monate",
      breakdownMonthly: "{employees} Mitarbeitende × {price} × 1 Monat",
      cta: "Demo buchen",
      roiLink: "Was Sie ohne Kora bereits verlieren",
    },

    landing: {
      badge: "Schweizer Plattform, Privacy-first",
      mockupSeal: "Privacy-first",
      heroTitleLead: "Unternehmensgesundheit,",
      heroTitleAccent: "endlich integriert.",
      heroBody:
        "Kora vereint Online-Psychologie, virtuellen Arzt, körperliche Check-ups, KI-Prävention und ein anonymes HR-Dashboard in einem einzigen Abonnement pro Mitarbeitende.",
      heroCtaRoi: "Rendite berechnen",
      heroCtaDemo: "Demo buchen",
      heroCompliance: "Hosting in der Schweiz. DSGVO- und DSG-konform.",

      mockup: {
        scoreLabel: "Gesundheitsprofil",
        scoreOutOf: "/100",
        focus: "Fokus: {area}",
        nextSessionLabel: "Nächste Sitzung",
        nextSessionValue: "{weekday} {time} · {professional}",
        analyticsLabel: "HR-Dashboard (anonym)",
        analyticsValue: "Nutzung {adoption} · Stress {trend} Punkte",
        analyticsValueNoTrend: "Nutzung {adoption}",
      },

      problemTitle: "Die versteckten Kosten der Unternehmensgesundheit",
      problem: {
        burnout: "Zunehmendes Burnout",
        absenteeism: "Teure Absenzen",
        waitingLists: "Wartelisten für die Psychologie",
        fragmented: "Zersplitterte Gesundheitsleistungen",
        noData: "HR ohne messbare Daten",
      },

      valueTitle: "Eine Plattform. Drei Ebenen von Wert.",
      value: {
        employee: {
          title: "Für die Mitarbeitenden",
          body: "Einfacher Zugang zu psychischer Gesundheit, virtuellem Arzt und Prävention. Alles privat, alles an einem Ort.",
        },
        company: {
          title: "Für das Unternehmen",
          body: "Anonyme Erkenntnisse, messbare Rendite, bessere Bindung und weniger Absenzen.",
        },
        professional: {
          title: "Für die Fachpersonen",
          body: "Neue Nachfrage, weniger Bürokratie, automatische Zahlungen. Zusammenarbeit im Auftragsverhältnis ohne Bindung.",
        },
      },

      roiTeaser: {
        title: "Die Rendite, vor der Unterschrift",
        losses:
          "Ein Unternehmen mit {employees} Mitarbeitenden verliert {amount} pro Jahr.",
        net: "Mit Kora kommen {amount} netto zurück: {ratio}, konservatives Szenario.",
        cta: "Rechner öffnen",
      },

      plansTitle: "Transparente Pläne, konkreter Wert",
      plansSubtitle:
        "Ein Abonnement pro Mitarbeitende. Keine versteckten Kosten. Messbare Rendite.",
      plansAll: "Die drei Pläne vergleichen",

      privacyTitleLead: "Datenschutz ist kein Detail.",
      privacyTitleAccent: "Er ist das Herz des Produkts.",
      privacyBody:
        "Das Unternehmen sieht nie individuelle Daten, Sitzungen, Befunde oder Diagnosen. Nur aggregierte und anonyme Erkenntnisse. Die Gesundheitsdaten bleiben bei denen, die sie erzeugen.",
      privacyChip: {
        hosting: "Hosting in der Schweiz",
        gdpr: "DSGVO-konform",
        lpd: "DSG-konform",
        encryption: "Ende-zu-Ende-Verschlüsselung",
      },

      finalTitle: "Holen Sie Kora in Ihr Unternehmen.",
      finalBody:
        "Dreissig Minuten, um die Plattform mit Ihren Zahlen zu sehen.",
      finalCta: "Demo buchen",
    },

    demoRequest: {
      title: "Demo buchen",
      subtitle:
        "Dreissig Minuten mit unserem Team, mit den Zahlen Ihres Unternehmens.",

      companyLabel: "Name des Unternehmens",
      contactLabel: "Vor- und Nachname",
      emailLabel: "Geschäftliche E-Mail",
      phoneLabel: "Telefon",
      employeesLabel: "Anzahl Mitarbeitende",
      messageLabel: "Nachricht",
      optional: "optional",
      privacy:
        "Die Daten werden gemäss dem Schweizer DSG und der DSGVO bearbeitet.",
      submit: "Anfrage senden",
      submitting: "Wird gesendet",
      error: {
        title: "Senden fehlgeschlagen",
        body: "Was Sie eingegeben haben, ist noch hier: versuchen Sie es erneut.",
      },

      validation: {
        companyRequired: "Der Name des Unternehmens ist erforderlich.",
        contactRequired: "Der Name der Kontaktperson ist erforderlich.",
        emailRequired: "Die E-Mail-Adresse ist erforderlich.",
        emailInvalid: "Die E-Mail-Adresse scheint nicht gültig zu sein.",
        employeesInvalid:
          "Die Anzahl Mitarbeitende ist in ganzen Zahlen anzugeben oder leer zu lassen.",
      },

      successTitle: "Anfrage erhalten",
      successBody:
        "Die Anfrage für {company} ist erfasst. Das Team antwortet innerhalb eines Arbeitstages.",
      successHome: "Zur Startseite",
      successRoi: "Berechnen Sie inzwischen die Rendite",
    },
  },

  /* Back-office: registro strumento, **Sie**, come l'area HR. */
  admin: {
    portalName: "Internes Admin",
    nav: {
      companies: "Unternehmen",
      users: "Benutzer",
      professionals: "Fachpersonen",
      sessions: "Sitzungen",
      checkupProviders: "Check-up-Anbieter",
      analytics: "Analytics",
    },
    demoBanner:
      "Internes Back-office · Demonstrationsdaten. Unternehmen, Personen und Einrichtungen in diesem Bereich sind erfunden und beschreiben keine realen Kunden.",

    extractNote:
      "Auszug von {shown} Zeilen von {total}. Die vollständige Suche kommt mit dem Produktivbetrieb.",

    companies: {
      empty: "Keine Kundenunternehmen.",
      title: "Kundenunternehmen",
      kpiActive: "Aktive Kunden",
      kpiEmployees: "Abgedeckte Mitarbeitende",
      kpiRevenue: "Jahresumsatz",
      kpiRevenueHint: "Auf den aktiven Kunden",
      kpiEnrolled: "Angemeldet",
      kpiEnrolledHint: "{enrolled} von {covered} abgedeckten Mitarbeitenden",

      colName: "Unternehmen",
      colIndustry: "Branche",
      colEmployees: "Mitarbeitende",
      colPlan: "Plan",
      colCity: "Sitz",
      colClientSince: "Kunde seit",
      colRevenue: "Umsatz/Jahr",
      colStatus: "Status",

      statusActive: "Aktiv",
      statusOnboarding: "In Aktivierung",
      revenuePotential: "{amount} potenziell",
    },

    industry: {
      finance: "Finanzwesen",
      pharma: "Pharma",
      legal: "Recht",
      tech: "Technologie",
      insurance: "Versicherungen",
    },

    users: {
      title: "Benutzer",
      searchPlaceholder: "Nach Name oder Unternehmen suchen",
      kpiTotal: "Angemeldete Benutzer",
      kpiTotalHint: "Über alle Kunden im Portfolio",
      kpiActive: "Aktiv",
      kpiWithAssessment: "Mit Assessment",
      kpiAverageScore: "Durchschnittliches Gesundheitsprofil",
      kpiOnExtract: "Auf den {shown} gezeigten Zeilen",

      colName: "Name",
      colEmail: "E-Mail",
      colCompany: "Unternehmen",
      colRole: "Rolle",
      colScore: "Gesundheitsprofil",
      colStatus: "Status",
      colJoined: "Angemeldet",

      statusActive: "Aktiv",
      statusInactive: "Inaktiv",
      empty: "Kein Benutzer entspricht der Suche.",
    },

    role: {
      employee: "Mitarbeitende",
      hr: "HR",
      professional: "Fachperson",
      admin: "Admin",
    },

    professionals: {
      title: "Fachpersonen",
      empty: "Keine Fachperson im Roster.",
      kpiTotal: "Im Roster",
      kpiBookable: "Buchbar",
      kpiVetting: "In Prüfung",
      kpiSessions: "Sitzungen gesamt",
      kpiSessionsHint: "Summe aller Fachpersonen des Netzwerks",

      colName: "Name",
      colQualification: "Qualifikation",
      colSpecialty: "Spezialität",
      colLanguages: "Sprachen",
      colFee: "Vergütung",
      colSessions: "Sitzungen",
      colDocuments: "Dokumente",
      colMandate: "Auftrag",
      colStatus: "Status",

      statusBookable: "Buchbar",
      statusVetting: "In Prüfung",
      vettingNote:
        "Eine Fachperson ist buchbar, wenn die Dokumente verifiziert und der Auftrag unterzeichnet sind. Bis dahin erscheint sie nicht in der Buchung.",
    },

    sessions: {
      title: "Sitzungen",
      subtitle: "Kalender von {professional}",
      kpiTotal: "Sitzungen",
      kpiDelivered: "Durchgeführt",
      kpiScheduled: "Geplant",
      kpiVolume: "Angefallene Vergütung",
      kpiVolumeHint: "Nur durchgeführte Sitzungen",

      colPatient: "Patientin",
      colProfessional: "Fachperson",
      colDate: "Datum",
      colType: "Art",
      colFee: "Vergütung",
      colStatus: "Status",

      statusScheduled: "Geplant",
      statusCompleted: "Durchgeführt",
      statusCancelled: "Abgesagt",
      privacyNote:
        "Von den Patientinnen erscheinen nur die Initialen, nie der Name.",
    },

    checkupProviders: {
      empty: "Keine Einrichtung im Netzwerk.",
      title: "Check-up-Anbieter",
      kpiActive: "Aktive Einrichtungen",
      kpiCities: "Abgedeckte Städte",
      kpiBookings: "Gebuchte Check-ups",
      kpiBookingsHint: "Über zwölf Monate",
      kpiPending: "In Vertragsprüfung",

      colName: "Einrichtung",
      colCity: "Stadt",
      colAddress: "Adresse",
      colDistance: "Distanz",
      colStatus: "Status",

      statusActive: "Aktiv",
      statusPending: "In Vertragsprüfung",
      distance: "{km} km",
      pendingNote:
        "Eine Einrichtung in Vertragsprüfung ist über das Portal für Mitarbeitende nicht buchbar.",
    },

    analytics: {
      title: "Plattform-Analytics",
      empty: "Keine Plattformdaten für den laufenden Monat.",
      kpiRevenue: "Umsatz des Monats",
      kpiRevenueHint: "{amount} annualisiert",
      kpiSessions: "Sitzungen des Monats",
      kpiEnrolled: "Angemeldete Benutzer",
      kpiActivation: "Aktivierung",
      kpiActivationHint: "{enrolled} von {covered} abgedeckten Mitarbeitenden",

      revenueChart: "Monatlich wiederkehrender Umsatz",
      sessionsChart: "Plattformsitzungen pro Monat",
      planMixChart: "Plan-Mix",
      activationChart: "Aktivierung",
      serviceMixChart: "Sitzungen nach Dienst, zwölf Monate",

      planMixOne: "1 Unternehmen",
      planMixMany: "{count} Unternehmen",
      planMixEntry: "{plan}: {count}",
    },

    demoRequests: {
      title: "Demo-Anfragen",
      empty:
        "Keine Anfrage. Die über das öffentliche Formular gesendeten Anfragen erscheinen hier.",
      colCompany: "Unternehmen",
      colContact: "Kontaktperson",
      colEmail: "E-Mail",
      colPhone: "Telefon",
      colEmployees: "Mitarbeitende",
      colReceived: "Erhalten",
    },
  },
};
