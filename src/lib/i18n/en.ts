import type { Dictionary } from "./index";

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
 *
 * DA PORTARE A QUELLA REVISIONE, nominate qui perché non si perdano nel diff.
 * Non sono errori: sono scelte su cui **non siamo il giudice giusto**.
 *
 *   1. `employee.home.greeting` — `Hello {name}`. "Buongiorno" copre tutta la
 *      giornata e "Good morning" no: è lo stesso inciampo del tedesco, e la
 *      resa che non mente sull'ora è questa. Se in un registro caldo si dica
 *      piuttosto `Hi` è una scelta di tono.
 *   2. **LPD → FADP**, e la legge per esteso *Federal Act on Data Protection*.
 *      È il nome inglese della stessa legge, non una sigla inventata, ma
 *      compare in sei stringhe fra landing, footer, privacy HR e richiesta
 *      demo: se l'inglese di casa preferisse tenere `LPD`, si cambia lì.
 *   3. **`company` e `organisation` per lo stesso soggetto**: il copy
 *      commerciale dice `company`, le promesse di privacy dicono
 *      `organisation`. In italiano è "azienda" in entrambi i casi, quindi la
 *      distinzione è nostra e va confermata.
 *   4. `hr.quarterLabel` — `Quarter 3 2026` invece dell'ordinale, perché
 *      l'inglese dice `1st`, `2nd`, `3rd`, `4th` e il selettore li mostra tutti
 *      e quattro. È lo stesso esito del francese con un'altra grammatica; la
 *      revisione può preferire `Q3 2026`.
 *   5. **L'inglese britannico ha delle scelte di casa**: `speciality` contro
 *      `specialty`, `anonymised`, `organisation`. Sono coerenti in tutto il
 *      file, e cambiarle è un trova-e-sostituisci, non una riscrittura.
 */
export const en: Dictionary = {
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

  /* No university, clinic or association name, and no years of experience: the
     rule lives in `it.ts` and holds for all four languages. */
  professionalBio: {
    colombo:
      "Works on stress that comes from the job: workloads that no longer fit the day, boundaries that blur, decisions that weigh. The first meeting is there to work out what is actually needed.",
    rossi:
      "Follows burnout and anxiety with a practical method: few goals at a time, reviewed together at every session.",
    meier:
      "Works on sleep and on what keeps it away — irregular rhythms, thoughts that come back in the evening, rest that does not restore. Moves step by step, starting from habits.",
    fontana:
      "Coaching on professional goals, changes of role and decisions to be made. It is not a clinical path and does not replace one.",
    keller:
      "Works on job-related stress with an eye on prevention: recognising the signals before they turn into a problem.",
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
    },

    identity: "{company} · {plan}",
    identityAction: "Open your profile",

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
      appointmentCancelled: "Cancelled",
      appointmentCancelledByProfessional: "{professional} cancelled this appointment.",
      appointmentCancelledByPatient: "You cancelled this appointment.",

      sessions: "You've used {used} of your {total} sessions",
      sessionsWithScheduled:
        "You've used {used} of your {total} sessions · {scheduled} scheduled",
      book: "Book a session",

      checkupTitle: "Annual check-up",
      checkupNext: "Next from {date}",
      checkupToBook: "To book",
      doctorTitle: "Virtual doctor",
      doctorConsults: "{n} consultations this year",
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
          "You've used up this year's sessions for this service included in your plan. To get more, talk to your HR contact.",
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
      arc: {
        impact: "Thank you. How much does it weigh on your day: are you managing work and your usual activities as before, or have you had to give something up?",
        symptoms: "Understood. Do you notice anything alongside it — fever, tiredness or changes in appetite?",
        guidance: "Thank you, that is enough for me to point you in the right direction. I cannot make a diagnosis from here: if the trouble is linked to stress or mood, book a session with a psychologist from the dedicated section; otherwise please see your own doctor, who can examine you. If the symptoms worsen suddenly, call 144.",
      },
      closed: "The demonstration conversation ends here.",
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

      openReport: "Open your latest report",
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
      notInPlan: "Not included in your plan",

      report: {
        title: "Report of {date}",
        empty: "There is no report to show for this check-up.",
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

      company: "Company",
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
        "Your health data is visible to the professionals you choose.",
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

  /*
   * Portale professionista (§10.D). Registro strumento: forme nominali, terza
   * persona, **niente contrazioni**.
   *
   * Il titolo `Dr.ssa` resta un campo del dataset (`people.ts`) e non si
   * traduce, come nelle altre due lingue. Dei pazienti si conoscono le sole
   * iniziali, e in inglese la questione del genere non si pone: `patient` non
   * lo porta.
   */
  professional: {
    portalName: "Professionals portal",
    identityAction: "Open your professional profile",

    nav: {
      calendar: "Calendar",
      sessions: "Sessions",
      patients: "Patients",
      payments: "Payments",
    },

    feePerSession: "{fee} per session",

    calendar: {
      title: "Calendar",
      week: "Week from {from} to {to}",
      sessionsThisWeek: "Sessions this week",
      nextSession: "Next session",
      sessionsThisMonth: "Scheduled this month",
      activePatients: "Active patients",
      noNextSession: "None",
      nextSessionValue: "{weekday} {time}",
      legendBooked: "Booked",
      legendFree: "Free",
      legendPast: "Past",
      today: "today",
      empty: "No session this week.",
    },

    sessions: {
      title: "Sessions",
      upcoming: "Scheduled ({n})",
      completed: "Delivered ({n})",
      cancelled: "Cancelled ({n})",
      startUnavailable: "Video call not active in this demo",
      addNote: "Add note",
      editNote: "Note",
      cancel: {
        action: "Cancel session",
        actionLabel:
          "Cancel the session with {patient} on {weekday} {date} at {time}",
        title: "Cancel this session?",
        summary: "{patient} · {weekday} {date}, {time}",
        noteLabel: "Note (optional)",
        notePlaceholder: "Why the session was cancelled",
        notePrivacy:
          "The note stays in your calendar: the patient's organisation does not see it.",
        effect:
          "The slot becomes bookable again and the session does not count towards your fees.",
        keep: "Go back",
        confirm: "Cancel the session",
        confirming: "Cancelling",
        error: {
          title: "Session not cancelled",
          body: "The session is still scheduled: please try again.",
        },
        noteShown: "Note: {note}",
      },
      emptyUpcoming: "No session scheduled.",
      emptyCompleted: "No session delivered.",
      emptyCancelled: "No session cancelled.",
      note: {
        title: "Private note — {patient}",
        notes: "Session notes",
        notesPlaceholder: "Private clinical notes",
        nextGoal: "Next goal",
        nextGoalPlaceholder: "Goal for the next session",
        followUp: "Suggested follow-up",
        followUpPlaceholder: "Next session recommended in",
        save: "Save note",
        saving: "Saving",
        error: {
          title: "Note not saved",
          body: "The text is still here: try again.",
        },
                loadError: {
          title: "Note unavailable",
          body: "The note for this session did not load. Saving now would overwrite it.",
        },
        saved: "Note saved",
        privacy:
          "Notes are private and are not shared with the patient's organisation.",
      },
    },

    patients: {
      title: "Patients",
      count: "{n} active patients",
      privacy:
        "You see the names because you are the one following these people. The organisation receives neither names nor notes: its list carries initials only.",
      delivered: "{n} sessions delivered",
      next: "Next: {date}",
      noNext: "No session scheduled",
      new: "New",
      withinCap: "{used} of {total} included",
      overCap: "{total} included + {extra} at {price}",
      capReached: "Included sessions used up",
      empty: "No patients in your care.",
    },

    payments: {
      title: "Payments",
      sessionsThisMonth: "Sessions delivered",
      feePerSession: "Fee per session",
      monthTotal: "Month total",
      yearTotal: "Year total",
      monthInProgress: "{month} · in progress",
      model:
        "Payment per session delivered. Kora issues the invoice and pays by the 5th of the following month.",
      capacityTitle: "Your workload",
      capacity:
        "You hold {sessions} sessions a week. At full capacity that is {full} a week, worth {min}–{max} a month: the collaboration starts from a minimum availability of {minHours} hours a week and grows with the calendar.",
      weeks: "Weeks of the month",
      weeksEmpty: "No sessions delivered this month.",
      payoutsEmpty: "No payments yet.",
      weekRange: "from {from} to {to}",
      weekDetail: "{sessions} sessions · {minutes} min",
      paid: "Paid",
      pending: "Pending",
      paidOn: "on {date}",
      sessionsTimesFee: "{sessions} sessions × {fee}",
      empty: "No fee earned yet.",
    },

    profile: {
      title: "Professional profile",
      empty: "No profile to show.",
      languages: "Languages",
      specialty: "Specialisation",
      collaboration: "Collaboration",
      fee: "Fee per session",
      documents: "Documents",
      verified: "Verified",
      documentsPending: "Under review",
      mandate: "Mandate contract",
      signed: "Signed",
      mandatePending: "To be signed",
      totalSessions: "{n} sessions delivered",
      /* "(Auftrag)" resta, come in francese: l'italiano nomina apposta
         l'istituto del Codice delle obbligazioni, e il mandato inglese non è
         la stessa figura giuridica. */
      mandateNote:
        "Collaboration under a mandate contract (Auftrag). No employment tie: Kora brings the patients and handles bookings, video and payments.",
    },
  },

  /*
   * Portale HR (§10.C). Registro strumento, e la schermata su cui il pitch si
   * regge.
   *
   * IL TRIMESTRE NON PORTA L'ORDINALE, per la stessa ragione del francese e con
   * un'altra grammatica: l'inglese dice `1st`, `2nd`, `3rd`, `4th`, quindi una
   * stringa sola con un suffisso fisso ne sbaglierebbe tre su quattro, e il
   * selettore li mostra tutti. `Quarter {quarter} {year}`, e `Q{quarter}`
   * sull'asse.
   *
   * IL NOME DEL REPARTO NON SI TRADUCE: `Vendite` è un campo del dataset
   * (`mock/company.ts`), quindi la raccomandazione del report lo nomina come
   * lo mostra il banner dell'alert. È la regola che il francese ha applicato e
   * che in tedesco è stata corretta dopo.
   *
   * LPD DIVENTA FADP, che è il nome inglese della stessa legge — *Federal Act
   * on Data Protection*. È una traduzione, non una sigla nuova, ma è la sola
   * di questo file che valga la pena di far confermare (vedi in testa).
   */
  hr: {
    portalName: "HR portal",
    navDashboard: "Dashboard",
    navEmployees: "Employees",
    navReport: "Report",
    navBilling: "Billing",
    navPrivacy: "Privacy",
    navCompanyMeta: "{count} employees · {plan} plan",

    dashboardTitle: "HR dashboard",
    companySubtitle: "{name} · {count} employees · {plan} plan",

    quarterSelectorLabel: "Quarter",
    quarterFrameTitle: "The selected quarter",
    quarterFrameHint: "Everything inside this box changes with the quarter.",
    quarterLabel: "Quarter {quarter} {year}",
    quarterLabelInProgress: "Quarter {quarter} {year} · in progress",
    quarterShort: "Q{quarter}",

    privacyNote:
      "Aggregated, anonymous data · minimum threshold of {threshold} measured employees per department",

    kpiSavings: "Savings this quarter",
    kpiSavingsHint: "{days} absence days avoided",
    kpiAdoption: "Adoption",
    kpiAdoptionHint: "{enrolled} enrolled of {total}",
    kpiActive: "Active employees",
    kpiActiveHint: "at least one service in the quarter",
    kpiStress: "Average stress",
    kpiStressValue: "{points} points",
    kpiStressHint: "vs previous quarter",
    kpiStressEmpty: "no previous quarter in the window",

    quarterEmpty:
      "No data for the selected quarter. Choose another one from the list above.",
    kpiSessions: "Sessions used",
    kpiSessionsHint: "{used} of {total} annual sessions",
    kpiCheckup: "Check-ups completed",
    kpiCheckupHint: "{done} of {enrolled} enrolled",

    alertTitle: "Early alert — {department} department · latest reading",
    alertDescription:
      "The stress of the department has been in the high band for {months} consecutive months, since {since}.",

    usageTitle: "Service usage · last {months} months",
    distributionTitle: "Service distribution",
    distributionSubtitle:
      "cumulative from the start of the window to {quarter}",
    distributionEntry: "{service}: {count}",

    stressByDepartment: "Stress by department · last month",
    departmentMeta: "{employees} employees · {measured} measured",
    departmentScore: "{percent} · {level}",
    suppressed: "Below threshold",
    suppressedTooltip:
      "Below the threshold the figure is not calculated, so that it cannot be traced back to individuals.",

    trendTitle: "Stress trend · last {months} months",
    trendCompany: "Company average",
    trendAlertMarker: "alert",
    trendCompanyLegend: "from {from} to {to} · always in the medium band",
    trendDepartmentLegend:
      "from {from} to {to} · in the high band from month {month}",

    roiTitle: "Savings per quarter",
    roiSubtitle: "All four quarters, with the selected one highlighted.",

    stressLevel: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },

    service: {
      psychologist: "Psychologist",
      virtual_doctor: "Virtual doctor",
      coach: "Coach",
      checkup: "Check-up",
    },

    employees: {
      title: "Employees",
      subtitle: "{enrolled} enrolled of {total} · anonymous data only",
      sampleNote: "The table shows an extract of {n} employees.",
      empty: "No employee to show.",
      privacyNote:
        "Names are abbreviated. Kora never shows individual health data to the organisation.",
      columnEmployee: "Employee",
      columnDepartment: "Department",
      columnStatus: "Status",
      columnCheckup: "Check-up",
      enrolled: "Active",
      notEnrolled: "Pending",
      checkup: {
        completed: "Completed",
        booked: "Booked",
        available: "Available",
      },
    },

    billing: {
      title: "Billing",
      planTitle: "Active plan",
      employees: "Employees",
      monthlyCost: "Monthly cost",
      annualContract: "Annual contract",
      renewal: "Renewal",
      invoicesTitle: "Recent invoices",
      invoicesEmpty: "No invoice issued so far.",
      invoiceDetail: "{count} employees × {price}",
      invoicePaid: "Paid",
      invoicePending: "Pending",
      simulatorTitle: "Cost simulator",
      simulatorEmployees: "Employees",
      simulatorPlan: "Plan",
      simulatorBilling: "Frequency",
      billingMonthly: "Monthly",
      billingAnnual: "Annual",
      totalMonthly: "Monthly total",
      totalAnnual: "Annual total",
      planOption: "{name} ({price})",
    },

    report: {
      title: "Company health report",
      subtitle: "{quarter} · {company}",
      download: "Download PDF",
      downloadError: {
        title: "The PDF was not created",
        body: "Try the download again.",
      },
      metricsTitle: "Key metrics",
      adoption: "Activation rate",
      usage: "Sessions of the annual volume",
      checkup: "Check-ups completed",
      virtualDoctor: "Virtual doctor consultations · this quarter",
      stress: "Average stress",
      stressValue: "{points} points",
      savings: "Estimated savings",
      avoidedDays: "Absence days avoided",
      daysValue: "{days} days",
      recommendationsTitle: "Recommendations",
      recommendation: {
        salesWorkshop:
          "Plan an intervention for the Vendite department, in the high band for three months.",
        checkupPush:
          "Remind the people who have activated their account and not yet booked about the annual check-up.",
        coachAwareness:
          "Raise awareness of the coach: it is the least used item in the plan.",
        partnerExtension:
          "Consider the extension to family members, optional on the Plus plan.",
      },

      pdf: {
        documentTitle: "Company health report",
        documentSubtitle: "{company} · {employees} employees · {plan} plan",
        period: "Period · {quarter}",
        generatedOn: "Generated on {date}",
        active: "Active employees",
        sessions: "Sessions used",
        sessionsValue: "{used} of {total}",
        privacyNote:
          "Aggregated, anonymous data. Kora does not pass individual health data, or bookings traceable to individuals, to the organisation.",
      },
    },

    privacy: {
      title: "Privacy and security",
      subtitle: "Privacy is at the heart of Kora.",
      neverSeenTitle: "The organisation never sees:",
      neverSeen: {
        healthData: "Individual health data",
        names: "Who has seen a psychologist",
        notes: "Clinical notes or reports",
        diagnoses: "Diagnoses or treatments",
        bookings: "Individual bookings",
      },
      measurementTitle: "Where the stress data comes from",
      measurementBody:
        "The stress figure comes from the quick check: one question, one tap, self-reported by the employee. It is never inferred from behaviour — not from booked sessions, not from app opens.",
      anonymousLinkTitle: "Even without an account",
      anonymousLinkBody:
        "The quick check is answered in the app or through an anonymous link, which does not require an activated account. Measuring only the people who enrolled would mean measuring only those already engaged, while the figure matters most where adoption has not arrived yet.",
      thresholdTitle: "Anonymity threshold",
      thresholdBody:
        "The figure for a department is published only if at least {threshold} measured employees answered in that period. Below the threshold the dashboard shows a dash, not a score.",
      principle: {
        noIndividual: {
          title: "No individual data",
          body: "The organisation never sees sessions, reports, diagnoses or health data of identifiable employees.",
        },
        aggregated: {
          title: "Aggregated data only",
          body: "The dashboard shows anonymous statistics, aggregated by department or by organisation.",
        },
        encryption: {
          title: "End-to-end encryption",
          body: "Health data is encrypted in transit and at rest, to the AES-256 standard.",
        },
        hosting: {
          title: "Hosting in Switzerland",
          body: "Data resides on servers in Switzerland, compliant with the Federal Act on Data Protection.",
        },
        compliance: {
          title: "GDPR and FADP compliance",
          body: "Kora complies with the European GDPR and the Swiss FADP.",
        },
        consent: {
          title: "Employee consent",
          body: "Every employee confirms consent during activation and can withdraw it at any time.",
        },
      },
    },
  },

  /*
   * L'area pubblica (§10.A). Registro strumento: parla a un'azienda che valuta.
   *
   * DUE PAROLE PER LO STESSO SOGGETTO, ED È UNA SCELTA: `company` nel copy
   * commerciale, che è chi compra, e `organisation` nelle promesse di privacy,
   * che è il termine con cui la protezione dei dati nomina il titolare. In
   * italiano è "azienda" in entrambi i casi, e la distinzione va confermata
   * dalla revisione madrelingua.
   */
  public: {
    nav: {
      pricing: "Plans",
      roi: "ROI calculator",
      employees: "Employees",
      hr: "HR",
      professionals: "Professionals",
      admin: "Admin",
      login: "Log in",
      bookDemo: "Book a demo",
      menu: "Open the menu",
      language: "Language",
    },

    footer: {
      tagline: "The health operating system for Swiss companies.",
      city: "Lugano, Switzerland",

      platformTitle: "Platform",
      platformPricing: "Plans and pricing",
      platformRoi: "ROI calculator",
      platformEmployee: "Employee portal",
      platformHr: "HR portal",
      platformProfessional: "For professionals",

      companyTitle: "Company",
      companyAbout: "About us",
      companyContact: "Contact",
      companyCareers: "Careers",
      companyBlog: "Blog",

      privacyTitle: "Privacy and security",
      privacyBody:
        "Protected health data. GDPR and FADP compliant. Hosting in Switzerland.",

      legalPrivacy: "Privacy policy",
      legalTerms: "Terms of service",
      legalCookies: "Cookie policy",

      copyright: "© {year} Kora Switzerland SA. All rights reserved.",
    },

    roi: {
      title: "What employee health costs today",
      empty: "The calculator is not available at the moment.",
      subtitle:
        "The losses a Swiss company carries every year, and how much of that comes back with Kora. Conservative scenario.",

      employeesLabel: "Number of employees",
      employeesRange: "From {min} to {max} employees",

      lossesTitle: "Estimated annual losses",
      loss: {
        absenteeism: "Absenteeism",
        presenteeism: "Presenteeism",
        burnout: "Pre-clinical burnout",
        turnover: "Health-related turnover",
      },
      lossHint: {
        absenteeism: "{days} absence days per employee, at {cost} a day",
        presenteeism: "{cost} of lost productivity per employee",
        burnout: "{share} of the population at risk, {loss} of lost productivity",
        turnover:
          "{rate} of health-related departures, plus the replacement cost",
      },
      lossesTotal: "Total losses",

      savingsTitle: "With Kora",
      savings: "Estimated savings",
      savingsHint:
        "{absence} on absenteeism and presenteeism, {burnout} on burnout and turnover",
      cost: "Kora cost",
      costHint: "On the {plan} plan, {price} per employee a month",
      /* Il meno è U+2212 come nelle altre tre lingue. */
      costValue: "− {amount}",
      netSavings: "Net savings",
      ratio: "Return on investment",
      ratioValue: "{ratio}:1",
      ratioHint: "Net savings for every franc invested",

      perEmployee: "≈ {amount} per employee a year, conservative scenario",

      linearityNote:
        "Every item grows in proportion to headcount: the ratio stays {ratio} at any number of employees.",

      sources: "Conservative scenario. Sources: SECO, Job Stress Index.",

      ctaTitle: "These figures, on your company",
      ctaBody:
        "A thirty-minute demo on the data of your sector and your headcount.",
      ctaButton: "Book a demo",
      ctaPricing: "See the plans",
    },

    plans: {
      title: "Transparent plans, concrete value",
      empty: "No plan to show at the moment.",
      subtitle:
        "One subscription per employee. No hidden costs. ROI measurable from the first quarter.",

      target: {
        essenziale: "Companies with 20–100 employees",
        plus: "Companies with 100–300 employees",
        executive: "Companies with 300+ employees",
      },

      recommended: "Recommended plan",
      priceUnit: "/ employee / month",
      cta: "Request a quote",

      feature: {
        sessions: "{count} psychologist sessions a year",
        intro: "Free introductory consultation, once",
        coach: "{count} coach sessions a year",
        psychiatrist: "Psychiatrist on request included",
        nutritionist: "{count} nutritionist sessions a year",
        virtualDoctorUnlimited:
          "Unlimited virtual doctor, reply within {hours} hours",
        virtualDoctorUnlimitedOneHour:
          "Unlimited virtual doctor, reply within one hour",
        virtualDoctorCapped:
          "{count} virtual doctor consultations a year, reply within {hours} hours",
        virtualDoctorCappedOneHour:
          "{count} virtual doctor consultations a year, reply within one hour",
        checkup: {
          annual: "Annual physical check-up",
          executive:
            "Full executive check-up: ECG, abdominal ultrasound, eye test, complete blood panel",
        },
        aiPlanMonthly: "AI prevention plan updated every month",
        aiPlanEveryMonths: "AI prevention plan updated every {months} months",
        hrDashboard: {
          base: "Basic HR dashboard and ROI: usage, anonymised stress, savings in CHF",
          department:
            "HR dashboard by department, with quarterly report and early burnout alert",
          advanced:
            "Advanced HR dashboard, with monthly report and monthly call with the clinical team",
        },
        workshops: "{count} live workshops a year included",
        family: "Family included: partner and one child",
        partnerExtension:
          "Extension to family members: + {price} per employee a month, optional",
        extraSession: "Session beyond the cap: {price}",
      },
    },

    costSimulator: {
      title: "Calculate the cost",
      employeesLabel: "Number of employees",
      planLabel: "Plan",
      planOption: "{plan} — {price} a month",
      billingLabel: "Billing",
      billingMonthly: "Monthly",
      billingAnnual: "Annual",
      totalMonthly: "Monthly total",
      totalAnnual: "Annual total",
      breakdownAnnual: "{employees} employees × {price} × 12 months",
      breakdownMonthly: "{employees} employees × {price} × 1 month",
      cta: "Book a demo",
      roiLink: "What you are already losing without Kora",
    },

    landing: {
      badge: "Swiss platform, privacy-first",
      mockupSeal: "Privacy-first",
      heroTitleLead: "Workplace health,",
      heroTitleAccent: "finally integrated.",
      heroBody:
        "Kora brings together online psychologists, a virtual doctor, physical check-ups, AI prevention and an anonymous HR dashboard in a single subscription per employee.",
      heroCtaRoi: "Calculate the return",
      heroCtaDemo: "Book a demo",
      heroCompliance: "Hosting in Switzerland. GDPR and FADP compliant.",

      mockup: {
        scoreLabel: "Health profile",
        scoreOutOf: "/100",
        focus: "Focus: {area}",
        nextSessionLabel: "Next session",
        nextSessionValue: "{weekday} {time} · {professional}",
        analyticsLabel: "HR dashboard (anonymous)",
        analyticsValue: "Adoption {adoption} · Stress {trend} points",
        analyticsValueNoTrend: "Adoption {adoption}",

        panelEmployee: "Employee portal",
        panelHr: "HR portal",
        panelProfessional: "Professional portal",
        panelShow: "Show {panel}",

        savingsLabel: "Savings this quarter",
        avoidedDaysLabel: "Absence days avoided",
        avoidedDaysValue: "{days} days this quarter",

        earningsLabel: "Fees this month",
        sessionsValue: "{sessions} sessions × {fee}",
        patientsLabel: "Active patients",
      },

      problemTitle: "The hidden cost of workplace health",
      problem: {
        burnout: "Burnout on the rise",
        absenteeism: "Costly absenteeism",
        waitingLists: "Waiting lists for psychologists",
        fragmented: "Fragmented health benefits",
        noData: "HR without measurable data",
      },

      valueTitle: "One platform. Three levels of value.",
      value: {
        employee: {
          title: "For the employee",
          body: "Simple access to mental health, a virtual doctor and prevention. All private, all in one place.",
        },
        company: {
          title: "For the company",
          body: "Anonymous insight, measurable return, better retention and less absenteeism.",
        },
        professional: {
          title: "For professionals",
          body: "New demand, less paperwork, automatic payments. Mandate-based collaboration with no tie.",
        },
      },

      roiTeaser: {
        title: "The return, before the signature",
        losses: "A company of {employees} employees loses {amount} a year.",
        net: "With Kora it recovers {amount} net: {ratio}, conservative scenario.",
        cta: "Open the calculator",
      },

      plansTitle: "Transparent plans, concrete value",
      plansSubtitle:
        "One subscription per employee. No hidden costs. Measurable return.",
      plansAll: "Compare the three plans",

      privacyTitleLead: "Privacy is not a detail.",
      privacyTitleAccent: "It is the heart of the product.",
      privacyBody:
        "The company never sees individual data, sessions, reports or diagnoses. Only aggregated, anonymous insight. Health data stays with the people who produce it.",
      privacyChip: {
        hosting: "Hosting in Switzerland",
        gdpr: "GDPR compliant",
        lpd: "FADP compliant",
        encryption: "End-to-end encryption",
      },

      finalTitle: "Bring Kora into your company.",
      finalBody: "Thirty minutes to see the platform on your figures.",
      finalCta: "Book a demo",
    },

    demoRequest: {
      title: "Book a demo",
      subtitle: "Thirty minutes with our team, on your company's figures.",

      companyLabel: "Company name",
      contactLabel: "Full name",
      emailLabel: "Work email",
      phoneLabel: "Phone",
      employeesLabel: "Number of employees",
      messageLabel: "Message",
      optional: "optional",
      privacy:
        "Data will be processed in line with the Swiss FADP and the GDPR.",
      submit: "Send the request",
      submitting: "Sending",
      error: {
        title: "The request was not sent",
        body: "The details entered are still here: try again.",
      },

      validation: {
        companyRequired: "The company name is required.",
        contactRequired: "The contact name is required.",
        emailRequired: "The email is required.",
        emailInvalid: "The email address does not look valid.",
        employeesInvalid:
          "The number of employees must be written in whole figures, or left empty.",
      },

      successTitle: "Request received",
      successBody:
        "Thank you for your interest. Our team will contact you within one working day.",
      successHome: "Back to home",
      successRoi: "In the meantime, calculate the return",
    },
  },

  /*
   * Il back-office (§10.E). Registro strumento: parla a chi gestisce la
   * piattaforma.
   */
  admin: {
    portalName: "Internal admin",
    nav: {
      companies: "Companies",
      users: "Users",
      professionals: "Professionals",
      sessions: "Sessions",
      checkupProviders: "Check-up providers",
      analytics: "Analytics",
    },
    demoBanner:
      "Internal back office · demonstration data. The companies, people and centres in this section are fictional and do not describe real clients.",

    extractNote:
      "Extract of {shown} rows out of {total}. Full search arrives with the move to production.",

    companies: {
      empty: "No client company.",
      title: "Client companies",
      kpiActive: "Active clients",
      kpiEmployees: "Employees covered",
      kpiRevenue: "Annual revenue",
      kpiRevenueHint: "On active clients",
      kpiEnrolled: "Enrolled",
      kpiEnrolledHint: "{enrolled} of {covered} employees covered",

      colName: "Company",
      colIndustry: "Sector",
      colEmployees: "Employees",
      colPlan: "Plan",
      colCity: "Head office",
      colClientSince: "Client since",
      colRevenue: "Revenue/year",
      colStatus: "Status",

      statusActive: "Active",
      /* Non "inactive": su una schermata che un investitore può vedere si
         leggerebbe come abbandono, mentre il caso è un contratto firmato da
         poco e non ancora avviato (§8). */
      statusOnboarding: "Onboarding",
      revenuePotential: "{amount} potential",
    },

    industry: {
      finance: "Finance",
      pharma: "Pharmaceutical",
      legal: "Legal",
      tech: "Technology",
      insurance: "Insurance",
    },

    users: {
      title: "Users",
      searchPlaceholder: "Search by name or company",
      kpiTotal: "Enrolled users",
      kpiTotalHint: "Across all clients in the portfolio",
      kpiActive: "Active",
      kpiWithAssessment: "Initial assessment completed",
      kpiAverageScore: "Average health profile",
      kpiOnExtract: "On the {shown} rows shown",

      colName: "Name",
      colEmail: "Email",
      colCompany: "Company",
      colRole: "Role",
      colStatus: "Status",
      colJoined: "Joined",

      statusActive: "Active",
      statusInactive: "Inactive",
      empty: "No user matches the search.",
    },

    role: {
      employee: "Employee",
      hr: "HR",
      professional: "Professional",
      admin: "Admin",
    },

    professionals: {
      title: "Professionals",
      empty: "No professional in the network.",
      kpiTotal: "Professionals",
      kpiBookable: "Bookable",
      kpiVetting: "In vetting",
      /* "Sessioni di carriera" ha in inglese un aggettivo che le altre due lingue
         non avevano: `lifetime` dice il totale di sempre senza evocare una
         storia d'impiego, quindi il sottotitolo qui conferma invece di
         supplire. */
      kpiSessions: "Lifetime sessions",
      kpiSessionsHint: "Sum across all professionals in the network",

      colName: "Name",
      colQualification: "Qualification",
      colSpecialty: "Speciality",
      colLanguages: "Languages",
      colFee: "Fee",
      colSessions: "Sessions",
      colDocuments: "Documents",
      colMandate: "Mandate",
      colStatus: "Status",

      statusBookable: "Bookable",
      statusVetting: "In vetting",
      vettingNote:
        "A professional is bookable when the documents are verified and the mandate is signed. Until then, they do not appear in booking.",
    },

    sessions: {
      title: "Sessions",
      subtitle: "Calendar of {professional}",
      kpiTotal: "Sessions",
      kpiDelivered: "Delivered",
      kpiScheduled: "Scheduled",
      kpiVolume: "Fees earned",
      kpiVolumeHint: "Delivered sessions only",

      colPatient: "Patient",
      colProfessional: "Professional",
      colDate: "Date",
      colType: "Type",
      colFee: "Fee",
      colStatus: "Status",

      statusScheduled: "Scheduled",
      statusCompleted: "Delivered",
      statusCancelled: "Cancelled",
      privacyNote: "Only the initials of patients are shown, never the name.",
    },

    checkupProviders: {
      empty: "No centre in the network.",
      title: "Check-up providers",
      kpiActive: "Active centres",
      kpiCities: "Cities covered",
      kpiBookings: "Check-ups booked",
      kpiBookingsHint: "Platform-wide, over the twelve months",
      kpiPending: "Under agreement",

      colName: "Centre",
      colCity: "City",
      colAddress: "Address",
      colDistance: "Distance",
      colStatus: "Status",

      statusActive: "Active",
      statusPending: "Under agreement",
      distance: "{km} km",
      pendingNote:
        "A centre under agreement cannot be booked from the employee portal.",
    },

    analytics: {
      title: "Platform analytics",
      empty: "No platform data for the current month.",
      kpiRevenue: "Revenue this month",
      kpiRevenueHint: "{amount} annualised",
      kpiSessions: "Sessions this month",
      kpiEnrolled: "Enrolled users",
      kpiActivation: "Activation",
      kpiActivationHint: "{enrolled} of {covered} employees covered",

      revenueChart: "Monthly recurring revenue",
      sessionsChart: "Platform sessions per month",
      planMixChart: "Plan mix",
      activationChart: "Activation",
      serviceMixChart: "Sessions by service, twelve months",

      planMixOne: "1 company",
      planMixMany: "{count} companies",
      planMixEntry: "{plan}: {count}",
    },

    demoRequests: {
      title: "Demo requests",
      empty:
        "No request. Requests sent from the public form appear here.",
      colCompany: "Company",
      colContact: "Contact",
      colEmail: "Email",
      colPhone: "Phone",
      colEmployees: "Employees",
      colReceived: "Received",
    },
  },
};
