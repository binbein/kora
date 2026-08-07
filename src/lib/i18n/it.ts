/*
 * Tutte le stringhe di UI (CLAUDE.md §2.7). Niente testo cablato nei
 * componenti: aggiungere una lingua domani significa aggiungere un file con le
 * stesse chiavi, non rileggere le schermate.
 *
 * Le frasi con valori variabili sono complete, con segnaposto {nome}: l'ordine
 * delle parole cambia da lingua a lingua, quindi la concatenazione è vietata.
 * I valori si formattano con `format.ts` prima di entrare nel segnaposto.
 *
 * Registro (§7): HR, landing, professionista e admin in terza persona e
 * professionali; app dipendente in seconda persona e calda. Ovunque sentence
 * case, niente punti esclamativi, niente emoji.
 *
 * Le chiavi entrano una schermata alla volta, mentre la si migra: è l'unico
 * modo in cui il §2.7 non costa dieci volte tanto. Oggi c'è l'area
 * professionista, che è quella migrata da M2.
 */
export const it = {
  common: {
    appName: "Kora",
  },

  plan: {
    essenziale: "Essenziale",
    plus: "Plus",
    executive: "Executive",
  },

  qualification: {
    psychologist_f: "Psicologa FSP",
    psychologist_m: "Psicologo FSP",
    coach_m: "Coach",
  },

  specialty: {
    work_stress: "Stress lavorativo",
    burnout_anxiety: "Burnout e ansia",
    sleep: "Sonno",
    coaching: "Coaching",
  },

  language: {
    it: "Italiano",
    de: "Deutsch",
    fr: "Français",
    en: "English",
  },

  /** Le cinque aree dell'assessment (§8), come etichette a sé. */
  healthArea: {
    sleep: "Sonno",
    stress: "Stress",
    activity: "Movimento",
    nutrition: "Alimentazione",
    mental: "Salute mentale",
  },

  healthSummary: {
    balanced: "In buon equilibrio",
    attention: "Da tenere d'occhio",
    at_risk: "A rischio",
  },

  sessionType: {
    first_visit: "Prima visita",
    session: "Seduta",
    follow_up: "Follow-up",
  },

  cancellationReason: {
    by_patient: "Annullata dal paziente",
    by_professional: "Annullata dal professionista",
  },

  /*
   * Percorso dipendente (§10.B). Registro consumer: seconda persona, caldo, mai
   * infantile — e senza emoji, che il §7 non ammette nemmeno qui (decisione dei
   * founder del 07.08.2026, che ha tolto il 👋 del saluto).
   *
   * È l'unica area che dà del tu. Il medico virtuale, che è una persona che
   * parla, dà del lei anche dentro questa area: un professionista parla come
   * parlerebbe lui, non come parla il prodotto (§7).
   */
  employee: {
    nav: {
      home: "Home",
      psychologists: "Psicologi",
      doctor: "Medico",
      checkup: "Check-up",
      aiPlan: "Piano AI",
      profile: "Profilo",
    },

    /** "Demo SA · Plus" */
    identity: "{company} · {plan}",

    privacy:
      "La tua azienda vede solo dati aggregati e anonimi. La tua salute resta tua.",

    /** I due servizi che il piano cappa, come li chiama chi li usa. */
    service: {
      psychologist: "Psicologo",
      coach: "Coach",
    },

    home: {
      /** "Buongiorno Laura" */
      greeting: "Buongiorno {name}",
      subtitle: "La tua salute, in un unico posto.",

      healthTitle: "Il tuo stato di salute",
      scoreOutOf: "/100",
      /*
       * Cinque frasi complete, non "{area} merita attenzione": in italiano
       * l'articolo cambia con la parola, e in tedesco cambia l'ordine. È il §2.7
       * applicato al caso più piccolo che ci sia.
       */
      weakestArea: {
        sleep: "Il sonno merita attenzione",
        stress: "Lo stress merita attenzione",
        activity: "Il movimento merita attenzione",
        nutrition: "L'alimentazione merita attenzione",
        mental: "La salute mentale merita attenzione",
      },
      weakestAreaHint:
        "È l'area da cui parte il tuo piano di prevenzione.",

      appointmentsTitle: "I tuoi prossimi appuntamenti",
      appointmentsEmpty: "Non hai appuntamenti in programma.",
      /** "giovedì 24.09.2026, alle 17:30" */
      appointmentWhen: "{weekday} {date}, alle {time}",

      /** "3 su 10 sessioni usate" */
      sessions: "{used} su {total} sessioni usate",
      /*
       * Una prenotazione non fa salire le usate — quelle sono le sedute già
       * fatte (§10.B) — quindi la parte in programma è una frase a sé, e la
       * riga la usa solo quando c'è qualcosa in programma.
       */
      sessionsWithScheduled:
        "{used} su {total} sessioni usate · {scheduled} in programma",
      book: "Prenota una sessione",

      quickAction: {
        doctor: "Medico virtuale",
        checkup: "Check-up annuale",
        aiPlan: "Piano di prevenzione",
        profile: "Profilo salute",
      },
      checkupDone: "Fatto",

      planTitle: "Dal tuo piano di prevenzione",
      planCta: "Vedi il piano",
    },

    /*
     * Il check rapido (§8, §10.B): **una domanda, un tocco**. Cinque opzioni e
     * un solo gesto — la frase è quella congelata del §8, e descrive il gesto,
     * non il numero di scelte.
     *
     * La scala è quella del dominio, da 1 "molto bene" a 5 "molto male": le
     * etichette stanno qui perché il valore è un dato e la parola è interfaccia.
     */
    rapidCheck: {
      question: "Come ti senti oggi?",
      hint: "Una domanda, un tocco. La tua risposta entra solo nella media del tuo reparto.",
      option: {
        1: "Molto bene",
        2: "Bene",
        3: "Così così",
        4: "Non bene",
        5: "Molto male",
      },
      done: "Grazie, registrato.",
      doneHint: "Ti richiediamo come stai fra qualche giorno.",
    },

    /*
     * La prenotazione. L'intestazione non dice "Psicologi" come la voce di menu,
     * perché la schermata elenca anche il coach: dire una cosa sola sopra un
     * elenco che ne contiene due è il difetto che il §5.5 chiama divergenza,
     * applicato alle parole.
     */
    psychologists: {
      title: "Parla con qualcuno",
      subtitle:
        "Psicologi e coach della rete Kora. Scegli chi ti segue e prenota quando ti è comodo.",
      filter: {
        psychologist: "Psicologi",
        coach: "Coach",
      },
      empty: "Nessun professionista disponibile per questo servizio.",
      /** "312 sedute erogate" */
      totalSessions: "{n} sedute erogate",
      book: "Prenota",

      dialog: {
        /** "Prenota con Dr.ssa Meier" */
        title: "Prenota con {professional}",
        chooseDay: "Scegli un giorno",
        chooseTime: "Scegli un orario",
        noSlots:
          "Non ci sono orari liberi al momento. Riprova fra qualche giorno.",
        summary: "Riepilogo",
        /** "venerdì 25.09.2026, alle 10:00" */
        summaryWhen: "{weekday} {date}, alle {time}",
        included: "Sessione inclusa nel tuo piano",
        /** "Le sessioni incluse sono finite: questa costa CHF 28" */
        overCapWithPrice: "Le sessioni incluse sono finite: questa costa {price}",
        /*
         * Il §9 non dà un prezzo oltre il cap per il coaching, quindi non se ne
         * offre una a pagamento: si dice che le incluse sono finite e si ferma
         * la conferma, invece di far credere che sia gratis.
         */
        overCapWithoutPrice:
          "Hai finito le sessioni incluse nel piano per questo servizio.",
        confirm: "Conferma la prenotazione",
        confirmedTitle: "Prenotazione confermata",
        confirmedWith: "con {professional}",
        confirmedNote:
          "La trovi nella tua home. Ti arriva il link per il video via email.",
        close: "Chiudi",
      },
    },

    /*
     * Il medico virtuale.
     *
     * **Due registri nella stessa schermata, ed è voluto.** L'intestazione, il
     * campo e i piedi di pagina sono il prodotto che parla a Laura, quindi danno
     * del tu; i messaggi sono il medico che parla, e un professionista parla
     * come parlerebbe lui — dà del lei, dall'inizio alla fine (§7). Il codice
     * ereditato oscillava fra i due dentro la stessa conversazione.
     *
     * Il medico **non ha un nome**: quello ereditato, "Dr. Andrea Fontana",
     * prendeva il cognome del coach del §8 e ci attaccava un nome proprio
     * inventato. Il servizio si presenta come servizio.
     */
    doctor: {
      title: "Medico virtuale",
      subtitle: "Descrivi i sintomi: un medico ti risponde.",
      /** "Risposta entro 4 ore" — le ore vengono dal piano */
      sla: "Risposta entro {hours} ore",
      online: "In linea",
      placeholder: "Descrivi i sintomi",
      send: "Invia",
      typing: "Il medico sta scrivendo",

      /*
       * Le parole chiave stanno qui accanto alla risposta perché sono lingua:
       * un dizionario tedesco non cercherebbe "schiena". Il confronto è sul
       * testo scritto da chi legge, quindi cambia con il dizionario attivo.
       */
      greeting:
        "Buongiorno. Sono il medico di turno del servizio Kora. Mi dica pure: che disturbo la porta qui oggi?",
      reply: {
        back: {
          keyword: "schiena",
          text: "Mi dispiace per il dolore. Le faccio qualche domanda: il dolore scende lungo la gamba? Ha febbre o formicolii?",
        },
        head: {
          keyword: "testa",
          text: "Il mal di testa può avere cause diverse. È localizzato o diffuso? Sta prendendo farmaci in questo periodo?",
        },
        stress: {
          keyword: "stress",
          text: "Lo stress può manifestarsi in molti modi. Le consiglio di prenotare una sessione con uno psicologo dalla sezione dedicata. Nel frattempo posso aiutarla con i sintomi fisici.",
        },
        sleep: {
          keyword: "sonno",
          text: "I disturbi del sonno sono molto comuni. Da quanto tempo ha difficoltà? Si sveglia durante la notte o fatica ad addormentarsi?",
        },
      },
      fallback:
        "Capisco. Può descrivermi meglio il disturbo? Da quanto tempo lo avverte?",

      disclaimer:
        "Questa conversazione è una simulazione dimostrativa. Le risposte non sono un parere medico e non sostituiscono una visita. In caso di emergenza chiama il 144.",
      privacy:
        "Le conversazioni sono private e protette. La tua azienda non accede mai a queste informazioni.",
    },

    aiPlan: {
      /*
       * Gli obiettivi del piano, per chiave. Li leggono due schermate — la home
       * mostra quello dell'area debole, la pagina del piano tutti e cinque — ed
       * è la ragione per cui stanno in una mappa e non accanto alla loro area.
       */
      goal: {
        sleep_hours: "Portare il sonno da 6 a 7 ore per notte",
        stress_reduction: "Ridurre lo stress percepito del 15% in 8 settimane",
        activity_weekly: "Arrivare a 2 sessioni di movimento a settimana",
        nutrition_cholesterol:
          "Riportare il colesterolo nella norma con un'alimentazione equilibrata",
        mental_coaching: "Fare 2 sessioni con il coach nel prossimo mese",
      },
    },
  },

  professional: {
    portalName: "Portale professionisti",

    nav: {
      calendar: "Calendario",
      sessions: "Sedute",
      patients: "Pazienti",
      payments: "Pagamenti",
      profile: "Profilo",
    },

    /** "CHF 80 a seduta" — l'importo arriva già formattato da format.ts */
    feePerSession: "{fee} a seduta",

    calendar: {
      title: "Calendario",
      /** "Settimana dal 21.09.2026 al 27.09.2026" */
      week: "Settimana dal {from} al {to}",
      sessionsThisWeek: "Sedute questa settimana",
      nextSession: "Prossima seduta",
      /* "in agenda" e non "del mese": i Pagamenti contano le erogate, e due
         etichette uguali su due numeri diversi sono il difetto del §5.5 */
      sessionsThisMonth: "In agenda questo mese",
      activePatients: "Pazienti attivi",
      noNextSession: "Nessuna",
      /** "giovedì 17:30" */
      nextSessionValue: "{weekday} {time}",
      legendBooked: "Prenotata",
      legendFree: "Libera",
      legendPast: "Passata",
      today: "oggi",
      empty: "Nessuna seduta in questa settimana.",
    },

    sessions: {
      title: "Sedute",
      upcoming: "In programma ({n})",
      completed: "Erogate ({n})",
      cancelled: "Annullate ({n})",
      start: "Avvia",
      addNote: "Aggiungi nota",
      editNote: "Nota",
      emptyUpcoming: "Nessuna seduta in programma.",
      emptyCompleted: "Nessuna seduta erogata.",
      emptyCancelled: "Nessuna seduta annullata.",
      note: {
        /** "Nota privata — L.B." */
        title: "Nota privata — {patient}",
        notes: "Note della seduta",
        notesPlaceholder: "Appunti clinici privati",
        nextGoal: "Prossimo obiettivo",
        nextGoalPlaceholder: "Obiettivo per la seduta successiva",
        followUp: "Follow-up suggerito",
        followUpPlaceholder: "Seduta successiva consigliata fra",
        save: "Salva nota",
        saving: "Salvataggio",
        saved: "Nota salvata",
        privacy:
          "Le note sono private e non vengono condivise con l'azienda del paziente.",
      },
    },

    patients: {
      title: "Pazienti",
      /** "6 pazienti attivi" */
      count: "{n} pazienti attivi",
      privacy:
        "I nomi sono abbreviati per privacy. Le note cliniche sono visibili solo a te.",
      /** "Paziente L.B." */
      name: "Paziente {initials}",
      /** "9 sedute erogate" */
      delivered: "{n} sedute erogate",
      /** "Prossima: 24.09.2026" */
      next: "Prossima: {date}",
      noNext: "Nessuna seduta in programma",
      new: "Nuovo",
      /** "10 su 10 incluse" */
      withinCap: "{used} su {total} incluse",
      /** "10 incluse + 2 a CHF 28" */
      overCap: "{total} incluse + {extra} a {price}",
      capReached: "Sedute incluse esaurite",
    },

    payments: {
      title: "Pagamenti",
      sessionsThisMonth: "Sedute erogate",
      feePerSession: "Tariffa a seduta",
      monthTotal: "Totale del mese",
      yearTotal: "Totale dell'anno",
      inProgress: "in corso",
      model:
        "Pagamento per seduta erogata. Kora emette la fattura e paga entro il 5 del mese successivo.",
      /*
       * Il regime va detto accanto al totale (§9), altrimenti CHF 1'120 contro i
       * CHF 5'600–6'400 del Business Plan si legge come "Kora paga poco" invece
       * che come una collaborazione part-time.
       */
      capacityTitle: "Il tuo regime",
      capacity:
        "Tieni {sessions} sedute a settimana. A pieno regime sono {full} a settimana, che valgono {min}–{max} al mese: la collaborazione parte da una disponibilità minima di {minHours} ore a settimana e cresce con l'agenda.",
      weeks: "Settimane del mese",
      /** "dal 21.09.2026 al 27.09.2026" */
      weekRange: "dal {from} al {to}",
      /** "5 sedute · 250 min" */
      weekDetail: "{sessions} sedute · {minutes} min",
      paid: "Pagato",
      pending: "In attesa",
      /** "il 05.10.2026" */
      paidOn: "il {date}",
      /** "14 sedute × CHF 80" */
      sessionsTimesFee: "{sessions} sedute × {fee}",
      empty: "Nessun compenso ancora maturato.",
    },

    profile: {
      title: "Profilo professionale",
      languages: "Lingue",
      specialty: "Specializzazione",
      collaboration: "Collaborazione",
      fee: "Tariffa a seduta",
      documents: "Documenti",
      verified: "Verificati",
      mandate: "Contratto a mandato",
      signed: "Firmato",
      /** "312 sedute erogate" */
      totalSessions: "{n} sedute erogate",
      mandateNote:
        "Collaborazione a mandato (Auftrag). Nessun vincolo di assunzione: Kora porta i pazienti e gestisce prenotazioni, video e pagamenti.",
    },
  },

  /*
   * Portale HR (§10.C). Registro strumento come il professionista: chi guarda
   * sta lavorando, parla di soglie, trimestri e CHF, e non va incoraggiato.
   *
   * Diverse chiavi vengono dal dizionario della demo precedente, ma nessuna
   * copiata così com'era: `adoptionHint` diceva "attivi nel mese" e gli attivi
   * sono trimestrali dal 07.08.2026, e la nota privacy diceva "risposte" dove il
   * §7 vuole "dipendenti misurati".
   */
  hr: {
    portalName: "Portale HR",
    navDashboard: "Dashboard",
    navEmployees: "Dipendenti",
    navReport: "Report",
    navBilling: "Fatturazione",
    navPrivacy: "Privacy",
    /** "120 dipendenti · Piano Plus" */
    navCompanyMeta: "{count} dipendenti · Piano {plan}",

    dashboardTitle: "Dashboard HR",
    /** "Demo SA · 120 dipendenti · Piano Plus" */
    companySubtitle: "{name} · {count} dipendenti · Piano {plan}",

    quarterSelectorLabel: "Trimestre",
    /** "3° trimestre 2026" */
    quarterLabel: "{quarter}° trimestre {year}",
    /* Il trimestre in corso è parziale: senza dirlo, chi confronta le sessioni
       con quelle del trimestre chiuso legge un dato incompleto come un calo. */
    quarterInProgress: "in corso",

    /* La soglia è un segnaposto e non un numero: è una proprietà del cliente
       (§7), e la parola è "misurati" perché a contare è chi ha risposto al
       check rapido, non chi ha attivato l'account. */
    privacyNote:
      "Dati aggregati e anonimi · soglia minima {threshold} dipendenti misurati per reparto",

    kpiSavings: "Risparmio del trimestre",
    /** "16 giorni di assenza evitati" */
    kpiSavingsHint: "{days} giorni di assenza evitati",
    kpiAdoption: "Adozione",
    /** "82 iscritti su 120" */
    kpiAdoptionHint: "{enrolled} iscritti su {total}",
    kpiActive: "Dipendenti attivi",
    /* La finestra sta nell'etichetta: "attivo" è chi ha usato almeno un
       servizio nel trimestre, e senza dirlo il numero non è verificabile. */
    kpiActiveHint: "almeno un servizio nel trimestre",
    kpiStress: "Stress medio",
    /** "−2 punti" — il segno lo mette format.ts */
    kpiStressValue: "{points} punti",
    kpiStressHint: "vs trimestre precedente",
    kpiStressEmpty: "nessun trimestre precedente nella finestra",
    kpiSessions: "Sessioni usate",
    /** "142 di 1'200 sessioni annue" */
    kpiSessionsHint: "{used} di {total} sessioni annue",
    kpiCheckup: "Check-up completati",
    /* "su" e non "sugli": l'articolo si accorda con come si legge il numero —
       "sugli 82" ma "sui 58" — e il selettore fa passare da uno all'altro. Una
       preposizione invariabile è l'unico modo di comporre la frase senza
       sbagliarla su metà dei periodi (§2.7). */
    /** "51 su 82 iscritti" */
    kpiCheckupHint: "{done} su {enrolled} iscritti",

    alertTitle: "Alert precoce — reparto {department}",
    alertDescription:
      "Lo stress del reparto è in fascia alta da {months} mesi consecutivi, da {since}.",

    usageTitle: "Utilizzo servizi · ultimi {months} mesi",
    distributionTitle: "Distribuzione servizi",
    /* La ciambella è cumulata come la KPI delle sessioni: senza dirlo, accanto
       al trimestre in corso si legge come "in questo trimestre". */
    distributionSubtitle: "cumulata dall'inizio della finestra a {quarter}",

    /* "ultimo mese" nel titolo non è pignoleria: tutto il resto della schermata
       segue il selettore del trimestre, questa tabella no — lo stress è una
       serie mensile (§5.3) e il §8 la fissa sull'ultimo rilevamento. Senza
       dirlo, chi apre un trimestre chiuso legge dati di settembre credendoli
       suoi. */
    stressByDepartment: "Stress per reparto · ultimo mese",
    /* Organico e misurati su ogni riga, anche su quelle pubblicabili: è l'unico
       modo di vedere perché la Direzione è sotto soglia e HR + Legale no, visto
       che hanno lo stesso organico. Senza, due righe identiche danno esiti
       diversi e sembra un errore. */
    departmentMeta: "{employees} dipendenti · {measured} misurati",
    suppressed: "Sotto soglia",
    suppressedTooltip:
      "Sotto la soglia il dato non viene calcolato, per non renderlo riconducibile a singole persone.",

    trendTitle: "Trend stress · ultimi {months} mesi",
    trendCompany: "Media azienda",
    trendDepartment: "{department}",
    trendAlertMarker: "alert",
    /* Il contrasto è la frase del pitch e deve leggersi dalla legenda, senza
       che nessuno debba raccontarlo. */
    trendCompanyLegend: "da {from} a {to} · sempre in fascia media",
    trendDepartmentLegend: "da {from} a {to} · in fascia alta dal mese {month}",

    roiTitle: "Risparmio per trimestre",

    stressLevel: {
      low: "Basso",
      medium: "Medio",
      high: "Alto",
    },

    service: {
      psychologist: "Psicologo",
      virtual_doctor: "Medico virtuale",
      coach: "Coach",
      checkup: "Check-up",
    },

    employees: {
      title: "Dipendenti",
      /** "82 iscritti su 120 · solo dati anonimi" */
      subtitle: "{enrolled} iscritti su {total} · solo dati anonimi",
      /* La tabella è un estratto e lo dice: il codice ereditato contava
         "6/8 attivati" accanto a una dashboard che ne dichiarava 82 su 120, e
         chi leggeva entrambe trovava due aziende diverse. */
      sampleNote: "La tabella mostra un estratto di {n} dipendenti.",
      privacyNote:
        "I nomi sono abbreviati. Kora non mostra mai dati sanitari individuali all'azienda.",
      columnEmployee: "Dipendente",
      columnDepartment: "Reparto",
      columnStatus: "Stato",
      columnCheckup: "Check-up",
      enrolled: "Attivo",
      notEnrolled: "In attesa",
      checkup: {
        completed: "Completato",
        booked: "Prenotato",
        available: "Disponibile",
      },
      checkupUnavailable: "—",
    },

    billing: {
      title: "Fatturazione",
      planTitle: "Piano attivo",
      employees: "Dipendenti",
      monthlyCost: "Costo mensile",
      annualContract: "Contratto annuale",
      renewal: "Scadenza",
      invoicesTitle: "Fatture recenti",
      /** "120 dipendenti × CHF 55" */
      invoiceDetail: "{count} dipendenti × {price}",
      invoicePaid: "Pagata",
      invoicePending: "In attesa",
      simulatorTitle: "Simulatore costi",
      simulatorEmployees: "Dipendenti",
      simulatorPlan: "Piano",
      simulatorBilling: "Frequenza",
      billingMonthly: "Mensile",
      billingAnnual: "Annuale",
      totalMonthly: "Totale mensile",
      totalAnnual: "Totale annuale",
      /** "Plus (CHF 55)" */
      planOption: "{name} ({price})",
    },

    report: {
      title: "Report salute aziendale",
      /** "3° trimestre 2026 · Demo SA" */
      subtitle: "{quarter} · {company}",
      download: "Scarica PDF",
      metricsTitle: "Metriche chiave",
      adoption: "Tasso di attivazione",
      usage: "Sessioni sul monte annuo",
      checkup: "Check-up completati",
      stress: "Stress medio",
      /** "−2 punti" */
      stressValue: "{points} punti",
      stressEmpty: "—",
      savings: "Risparmio stimato",
      avoidedDays: "Giorni di assenza evitati",
      /** "16 giorni" */
      daysValue: "{days} giorni",
      recommendationsTitle: "Raccomandazioni",
      recommendation: {
        salesWorkshop:
          "Programmare un intervento sul reparto Vendite, in fascia alta da tre mesi.",
        checkupPush:
          "Ricordare il check-up annuale a chi ha attivato l'account e non l'ha ancora prenotato.",
        coachAwareness:
          "Far conoscere il coach: è la voce del piano con l'utilizzo più basso.",
        partnerExtension:
          "Valutare l'estensione ai familiari, opzionale sul piano Plus.",
      },
    },

    privacy: {
      title: "Privacy e sicurezza",
      subtitle: "La privacy è il cuore di Kora.",
      neverSeenTitle: "L'azienda non vede mai:",
      neverSeen: {
        healthData: "Dati sanitari individuali",
        names: "Chi ha usato lo psicologo",
        notes: "Note cliniche o referti",
        diagnoses: "Diagnosi o trattamenti",
        bookings: "Prenotazioni individuali",
      },
      /*
       * Da dove vengono i numeri della dashboard. Nessuna schermata lo diceva, ed
       * è la domanda che un investitore fa subito dopo aver visto il grafico per
       * reparto (§8).
       */
      measurementTitle: "Da dove vengono i dati di stress",
      measurementBody:
        "Il dato di stress arriva dal check rapido: una domanda, un tocco, auto-riportata dal dipendente. Non si deduce mai dal comportamento — né dalle sedute prenotate, né dalle aperture dell'app.",
      anonymousLinkTitle: "Anche senza account",
      anonymousLinkBody:
        "Il check rapido si risponde nell'app oppure da un link anonimo, che non richiede di aver attivato l'account. Misurare solo chi si è iscritto vorrebbe dire misurare solo chi è già ingaggiato, e il dato serve soprattutto dove l'adozione non è ancora arrivata.",
      thresholdTitle: "Soglia di anonimato",
      thresholdBody:
        "Il dato di un reparto viene pubblicato solo se in quel periodo hanno risposto almeno {threshold} dipendenti misurati. Sotto la soglia la dashboard mostra un trattino, non un punteggio.",
      principle: {
        noIndividual: {
          title: "Nessun dato individuale",
          body: "L'azienda non vede mai sessioni, referti, diagnosi o dati sanitari di singoli dipendenti.",
        },
        aggregated: {
          title: "Solo dati aggregati",
          body: "La dashboard mostra statistiche anonime, aggregate per reparto o per azienda.",
        },
        encryption: {
          title: "Crittografia end-to-end",
          body: "I dati sanitari sono crittografati in transito e a riposo con standard AES-256.",
        },
        hosting: {
          title: "Hosting in Svizzera",
          body: "I dati risiedono su server in Svizzera, conformi alla Legge federale sulla protezione dei dati.",
        },
        compliance: {
          title: "Conformità GDPR e LPD",
          body: "Kora è conforme al GDPR europeo e alla LPD svizzera.",
        },
        consent: {
          title: "Consenso del dipendente",
          body: "Ogni dipendente conferma il consenso durante l'attivazione e può revocarlo in ogni momento.",
        },
      },
    },
  },
} as const;
