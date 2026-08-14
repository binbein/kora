/*
 * Il dizionario inglese (CLAUDE.md §4, blocco e di M5, tranche 3 — l'ultima).
 *
 * SI DICHIARA `Dictionary`, ED È LÌ CHE STA LA GARANZIA: la forma è quella di
 * `it.ts`, quindi una chiave mancante o rinominata è un errore di typecheck e
 * non una stringa italiana che sbuca in inglese. L'annotazione arriva **con il
 * commit che completa il file**, come nelle due tranche precedenti: su un
 * dizionario parziale dichiarerebbe il falso e romperebbe il typecheck
 * sull'albero.
 *
 * INGLESE BRITANNICO: `organisation`, `centre`, `specialisation`, `cancelled`,
 * `fibre`, `lift`. Non è una preferenza di gusto — è la variante che si scrive
 * in Svizzera e nell'Europa continentale, ed è quella che un investitore
 * internazionale si aspetta accanto a un indirizzo di Lugano.
 *
 * `en-CH` È UN LOCALE DI FORMATO SVIZZERO, e la scelta è tutto: `en-CH` rende
 * `CHF 14'200`, `24.09.2026`, `17:30` e `2.35`, mentre `en-GB` darebbe
 * `CHF 14,200` e `24/09/2026`. Misurato interrogando `Intl` sulle due varianti
 * prima di scrivere una riga. Le date restano quindi puntate come nelle altre
 * tre lingue, la valuta sta **prima** del numero come in italiano e tedesco, e
 * il separatore decimale è il punto (§11). L'apostrofo delle migliaia è quello
 * che `format.ts` impone a tutte e quattro le lingue (§2.7, founder
 * 14.08.2026) — qui `en-CH` lo darebbe già di suo.
 *
 * IL REGISTRO NON PASSA DAI PRONOMI, PERCHÉ L'INGLESE NON HA IL T-V. Dove il
 * tedesco sceglie fra `du` e `Sie` e il francese fra `tu` e `vous`, qui la
 * distinzione del §7 si fa con il **lessico e la forma della frase**:
 *
 *   - `employee.*` — seconda persona e **contrazioni**: *"You've used 3 of your
 *     10 sessions"*, *"you'll find it on your home page"*. È il registro caldo;
 *   - tutto il resto — forme **nominali** e terza persona, **senza
 *     contrazioni**: *"3 of 10 sessions used"*, *"the address does not match"*.
 *     È il registro strumento, e la mancanza della contrazione è ciò che in
 *     inglese lo rende formale senza irrigidirlo.
 *
 * NE DISCENDE CHE LE TRE STRINGHE DI CONFINE QUI NON SONO UN PROBLEMA.
 * `common.state.retry` e le due uscite di `RequireRole` sono imperativi piani —
 * `Try again`, `Go to your area`, `Back to home` — e l'imperativo inglese non
 * prende posizione su niente. Il vincolo che ha costretto tedesco e francese
 * alla forma nominale non esiste in questa lingua, ed è la ragione per cui qui
 * non se ne parla altrove.
 *
 * ANCHE IL MEDICO VIRTUALE CAMBIA STRUMENTO. In tedesco e in francese dà del
 * Sie e del vous dentro l'area del du e del tu; in inglese lo stesso salto di
 * registro si fa **togliendogli le contrazioni** e allungando le frasi: *"I am
 * sorry about the pain"*, non *"I'm sorry"*. Il §7 vuole che un professionista
 * parli come parlerebbe lui, e questo è l'unico modo che l'inglese ha di dirlo.
 *
 * LE CONTRAZIONI USANO L'APOSTROFO DRITTO `'`, come le altre stringhe di questo
 * repository. Quello tipografico sarebbe più corretto in tipografia, e sarebbe
 * il sesto carattere invisibile del codice: la ragione per non introdurlo è la
 * stessa per cui il francese non ha portato U+202F (`format.ts`).
 *
 * I SEGNAPOSTO SONO QUELLI DELL'ITALIANO, alla lettera, e a sorvegliarli c'è il
 * guardrail di `placeholders.ts`.
 *
 * NON SI RIFORMULA IL SIGNIFICATO. I punti su cui l'inglese costringe a
 * scegliere sono elencati in fondo a questa intestazione.
 *
 * LA REVISIONE MADRELINGUA RESTA DA FARE, ed è a verbale per tutte e tre le
 * lingue: questo file rende l'inglese verificabile e presentabile, non
 * ratificato.
 */
export const en = {
  common: {
    appName: "Kora",
    none: "—",
    state: {
      retry: "Try again",
      error: {
        title: "Data unavailable",
        body: "Try again in a moment.",
      },
      boot: {
        title: "Kora did not start",
        body: "Reload the page to try again. Anything done so far is not saved.",
      },
    },

    accessDenied: {
      title: "Restricted section",
      body: "This section belongs to a different role.",
      toPortal: "Go to your area",
      toHome: "Back to home",
    },
  },

  notFound: {
    title: "Page not found",
    body: "The address {path} does not match any page.",
    home: "Back to home",
  },

  plan: {
    essenziale: "Essenziale",
    plus: "Plus",
    executive: "Executive",
  },

  /* Come in francese, l'inglese non distingue il genere del sostantivo: le due
     chiavi rendono la stessa stringa. FSP è la sigla che la federazione usa
     anche in inglese, quindi la qualifica resta leggibile senza tradurla. */
  qualification: {
    psychologist_f: "Psychologist FSP",
    psychologist_m: "Psychologist FSP",
    coach_m: "Coach",
  },

  specialty: {
    work_stress: "Work-related stress",
    burnout_anxiety: "Burnout and anxiety",
    sleep: "Sleep",
    coaching: "Coaching",
  },

  language: {
    it: "Italiano",
    de: "Deutsch",
    fr: "Français",
    en: "English",
  },

  healthArea: {
    sleep: "Sleep",
    stress: "Stress",
    activity: "Physical activity",
    nutrition: "Nutrition",
    mental: "Mental health",
  },

  healthSummary: {
    balanced: "Well balanced",
    attention: "Worth watching",
    at_risk: "At risk",
  },

  sessionType: {
    first_visit: "First consultation",
    session: "Session",
    follow_up: "Follow-up",
  },

  cancellationReason: {
    by_patient: "Cancelled by the patient",
    by_professional: "Cancelled by the professional",
  },

  /*
   * Percorso dipendente (§10.B). **È l'unica area che usa le contrazioni**, ed
   * è così che l'inglese rende il registro caldo del §7: la seconda persona da
   * sola non basta, perché anche le aree strumento dicono "your".
   *
   * IL MEDICO VIRTUALE LE PERDE, dentro quest'area: le sue battute sono frasi
   * intere senza contrazioni, che è il salto di registro reso con lo strumento
   * che questa lingua ha.
   */
  employee: {
    nav: {
      home: "Home",
      psychologists: "Psychologists",
      doctor: "Doctor",
      checkup: "Check-up",
      aiPlan: "AI plan",
      profile: "Profile",
    },

    identity: "{company} · {plan}",

    privacy:
      "Your organisation only sees aggregated, anonymous data. Your health stays yours.",

    state: {
      error: {
        title: "This part didn't load",
        body: "Try again in a moment.",
      },
    },

    service: {
      psychologist: "Psychologist",
      coach: "Coach",
    },

    home: {
      /* "Buongiorno" copre tutta la giornata, "Good morning" no, e il saluto è
         statico: è lo stesso inciampo del tedesco. `Hello` è la resa che non
         mente sull'ora; se sia abbastanza caldo è una domanda per la revisione
         madrelingua, non una di significato. */
      greeting: "Hello {name}",
      subtitle: "Your health, all in one place.",

      healthTitle: "Your health status",
      scoreOutOf: "/100",
      weakestArea: {
        sleep: "Sleep deserves some attention",
        stress: "Stress deserves some attention",
        activity: "Physical activity deserves some attention",
        nutrition: "Nutrition deserves some attention",
        mental: "Mental health deserves some attention",
      },
      weakestAreaHint: "It's where your prevention plan starts.",

      appointmentsTitle: "Your next appointments",
      appointmentsEmpty: "You don't have any appointments scheduled.",
      appointmentWhen: "{weekday} {date} at {time}",

      sessions: "You've used {used} of your {total} sessions",
      sessionsWithScheduled:
        "You've used {used} of your {total} sessions · {scheduled} scheduled",
      book: "Book a session",

      quickAction: {
        doctor: "Virtual doctor",
        checkup: "Annual check-up",
        aiPlan: "Prevention plan",
        profile: "Health profile",
      },
      checkupDone: "Done",

      planTitle: "From your prevention plan",
      planCta: "See the plan",
    },

    rapidCheck: {
      question: "How are you feeling today?",
      hint: "One question, one tap. Your answer only goes into your department's average.",
      option: {
        1: "Very good",
        2: "Good",
        3: "So-so",
        4: "Not good",
        5: "Very bad",
      },
      error: {
        title: "We couldn't record it",
        body: "Tap again to try once more.",
      },
      done: "Thanks, recorded.",
      doneHint: "We'll ask how you're doing again in a few days.",
    },

    psychologists: {
      title: "Talk to someone",
      subtitle:
        "Psychologists and coaches in the Kora network. Choose who supports you and book when it suits you.",
      filter: {
        psychologist: "Psychologists",
        coach: "Coaches",
      },
      empty: "No professional available for this service.",
      totalSessions: "{n} sessions delivered",
      book: "Book",

      dialog: {
        title: "Book with {professional}",
        chooseDay: "Choose a day",
        chooseTime: "Choose a time",
        noSlots: "There are no free times right now. Try again in a few days.",
        summary: "Summary",
        summaryWhen: "{weekday} {date} at {time}",
        dayOption: "{weekday} {date}",
        included: "Session included in your plan",
        overCapWithPrice:
          "You've used up the sessions included: this one costs {price}",
        overCapWithoutPrice:
          "You've used up the sessions included in your plan for this service.",
        confirm: "Confirm booking",
        error: {
          title: "The booking didn't go through",
          body: "The slot is still free: try again.",
        },
        confirmedTitle: "Booking confirmed",
        confirmedWith: "with {professional}",
        confirmedNote:
          "You'll find it on your home page. The video link arrives by email.",
        close: "Close",
      },
    },

    doctor: {
      title: "Virtual doctor",
      subtitle: "Describe your symptoms: a doctor replies.",
      sla: "Reply within {hours} hours",
      online: "Online",
      placeholder: "Describe your symptoms",
      send: "Send",
      typing: "The doctor is typing",

      /*
       * Le parole chiave sono inglesi perché il confronto è sul testo che
       * scrive chi legge, e sono minuscole perché `replyTo` confronta su
       * `toLowerCase()`.
       *
       * IN INGLESE SONO PAROLE CORTE E COMUNI — `back`, `head` — quindi
       * agganciano anche dove non dovrebbero: "come back", "ahead". È un limite
       * della simulazione, non del dizionario: il confronto è per sottostringa,
       * e le parole giuste per quei due disturbi sono queste.
       *
       * DA QUI IN GIÙ PARLA IL MEDICO, QUINDI NIENTE CONTRAZIONI (§7).
       */
      greeting:
        "Hello. I am the duty doctor for the Kora service. Please tell me: what has brought you here today?",
      reply: {
        back: {
          keyword: "back",
          text: "I am sorry about the pain. Let me ask a few questions: does the pain travel down your leg? Do you have a fever or any tingling?",
        },
        head: {
          keyword: "head",
          text: "Headaches can have several causes. Is the pain in one spot or spread out? Are you taking any medication at the moment?",
        },
        stress: {
          keyword: "stress",
          text: "Stress can show itself in many ways. I would suggest booking a session with a psychologist from the dedicated section. In the meantime I can help you with the physical symptoms.",
        },
        sleep: {
          keyword: "sleep",
          text: "Sleep problems are very common. How long have you had difficulties? Do you wake up during the night, or do you struggle to fall asleep?",
        },
      },
      fallback:
        "I understand. Could you describe the problem in more detail? How long have you been feeling it?",

      disclaimer:
        "This conversation is a demonstration simulation. The replies are not medical advice and do not replace a consultation. In an emergency, call 144.",
      privacy:
        "Conversations are private and protected. Your organisation never has access to this information.",
    },

    checkup: {
      title: "Annual check-up",
      subtitle: "The physical check-up included in your plan.",

      lastTitle: "Your latest report",
      lastDone: "Done on {date} · {provider}",
      lastOpen: "Tap to view it",

      nextFrom: "You can book a new one from {date}.",

      networkTitle: "Partner centres",
      networkHint:
        "These are the centres where Kora books your check-up, with the costs already covered by your plan.",
      networkEmpty: "No centre available at the moment.",
      distance: "{km} km",
      providerAddress: "{address}, {city}",
      bookFrom: "From {date}",

      report: {
        title: "Report of {date}",
        measurement: {
          blood_pressure: "Blood pressure",
          cholesterol: "Cholesterol",
          ecg: "ECG",
          bmi: "BMI",
          stress_risk: "Stress-related risk",
        },
        status: {
          normal: "Within range",
          attention: "Worth watching",
        },
        explanationTitle: "What this means",
        explanation: {
          laura:
            "Your cholesterol is slightly above the recommended value and your stress-related risk is moderate. It isn't an emergency: follow your prevention plan and repeat the test at your next check-up.",
        },
        disclaimer:
          "Demonstration report with example values. It is not a clinical document and does not replace the report from the centre carrying out the check-up.",
      },
    },

    profile: {
      title: "Your profile",
      privacy:
        "Your health stays yours. No individual data is shared with your organisation.",

      company: "Organisation",
      plan: "Plan",
      memberSince: "Member since",

      healthTitle: "Health summary",
      score: "Health score",
      scoreValue: "{score}/100",
      summary: "Summary",
      weakest: "Area to follow",

      usageTitle: "Service usage",
      usage: {
        psychologist: "Psychologist sessions",
        coach: "Coach sessions",
        checkup: "Annual check-up",
        doctor: "Virtual doctor consultations",
      },
      outOf: "{used} of {total}",
      checkupDone: "Done on {date}",
      checkupToBook: "To be booked",
      consults: "{n} this year",

      dataNote:
        "Your health data is protected and is never shared with third parties.",
    },

    aiPlan: {
      title: "Prevention plan",
      subtitle: "Built on your health profile.",
      generated: "Updated in {month}",
      nextUpdate: "The next update is in {month}.",

      goal: {
        sleep_hours: "Move from 6 to 7 hours of sleep a night",
        stress_reduction: "Reduce perceived stress by 15% in 8 weeks",
        activity_weekly: "Get to 2 physical activity sessions a week",
        nutrition_cholesterol:
          "Bring your cholesterol back within range with a balanced diet",
        mental_coaching: "Have 2 sessions with the coach next month",
      },

      tip: {
        sleep_screens: "Avoid screens in the 30 minutes before bed",
        sleep_schedule: "Go to bed and get up at the same time every day",
        sleep_caffeine: "No caffeine after 14:00",
        stress_breathing: "Spend 10 minutes a day on breathing",
        stress_breaks: "Schedule a break every 90 minutes",
        stress_coach:
          "Book a session with the coach for stress management techniques",
        activity_walk: "Start with 30-minute walks",
        activity_stairs: "Take the stairs instead of the lift",
        activity_yoga: "Try an online yoga class",
        nutrition_fibre: "Add more fibre and vegetables to every meal",
        nutrition_fats: "Cut down on saturated fats",
        nutrition_recheck: "Repeat the cholesterol test at your next check-up",
        mental_continue: "Carry on with the psychologist",
        mental_techniques:
          "Use the techniques you learn outside the sessions too",
        mental_journal: "Note how you feel on difficult days",
      },
    },
  },
} as const;
