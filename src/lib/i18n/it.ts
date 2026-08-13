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
    /* Il posto di un valore che non c'è. Una chiave sola perché è la stessa
       cosa ovunque, e tre trattini scritti in tre punti diventano tre trattini
       diversi alla prima revisione. */
    none: "—",
    /* Il separatore di una lista in linea. Sta qui perché **cambia con la
       lingua** (§2.7) e in pagina era un ", " scritto dentro un `.join()`.
       `Intl.ListFormat` sarebbe la forma completa — in italiano darebbe
       "Italiano e Deutsch" sull'ultimo elemento — ma cambierebbe ciò che si
       legge a schermo, quindi è una decisione dei founder e non di una
       passata di igiene. */
    listSeparator: ", ",

    /* Gli stati che sostituiscono i dati quando i dati non ci sono (M5.b).
       Questi sono il **registro strumento** del §7 — terza persona, asciutti —
       e li usano l'area pubblica, HR, il professionista e il back-office. Il
       portale dipendente ha i suoi in `employee.state`, perché lì si dà del tu.

       Il corpo dice cosa fare, non cosa è successo: "non è stato possibile
       caricare" descriverebbe il guasto a chi non può farci niente. */
    state: {
      retry: "Riprova",
      error: {
        title: "Dati non disponibili",
        body: "Riprova fra un momento.",
      },
      /* Il boot fallito. È l'unico stato che non ha una schermata attorno,
         quindi il gesto va detto per esteso: ricaricare è anche l'unico modo
         di ripartire, visto che il provider vive in memoria (§10). */
      boot: {
        title: "Kora non si è avviata",
        body: "Ricarica la pagina per riprovare. Quello che hai fatto finora non viene conservato.",
      },
    },

    /* L'accesso negato (M5.d). Sta in `common` e **non ha un gemello in
       `employee.state`**, a differenza degli stati di M5.b: quelli parlano a
       chi guarda i propri dati, questo parla a chi ha sbagliato porta, e in
       demo lo raggiunge solo la manopola `?role=` di sviluppo. Una seconda
       versione col tu sarebbe una chiave che nessuno usa (§11).

       Il corpo non nomina il ruolo. Dirlo servirebbe a poco — chi legge sa da
       dove è entrato — e costringerebbe questo componente a leggere le
       etichette dei ruoli dal dizionario del back-office, che è l'unico posto
       dove vivono.

       LE DUE USCITE NON SONO ORNAMENTO: un "accesso negato" senza via d'uscita
       è il vicolo cieco che il §10 vieta, e lo sarebbe anche essendo
       raggiungibile solo in sviluppo. */
    accessDenied: {
      title: "Sezione riservata",
      body: "Questa sezione appartiene a un altro ruolo.",
      toPortal: "Vai alla tua area",
      toHome: "Torna alla home",
    },
  },

  /* La 404. `body` è una frase intera con segnaposto e non due pezzi cuciti
     attorno all'indirizzo: l'ordine delle parole cambia con la lingua (§2.7),
     e in tedesco l'indirizzo non sta dove sta qui. */
  notFound: {
    title: "Pagina non trovata",
    body: "L'indirizzo {path} non corrisponde a nessuna pagina.",
    home: "Torna alla home",
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

    /* Lo stato d'errore nel registro consumer (§7): seconda persona, e nessuna
       colpa data a chi legge. È lo stesso guasto che `common.state` racconta
       in terza persona alle altre quattro aree — a cambiare è solo come si
       parla, che è il motivo per cui i due registri stanno in `i18n` e non
       dentro il componente. */
    state: {
      error: {
        title: "Questa parte non si è caricata",
        body: "Riprova fra un momento.",
      },
    },

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
      /* La scrittura non è riuscita. Il registro è consumer, e la frase dice
         che si può ritoccare: il pulsante che ha fallito è lì. */
      error: {
        title: "Non siamo riusciti a registrarlo",
        body: "Tocca di nuovo per riprovare.",
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
        /** Il pulsante del giorno: "venerdì 25.09.2026" */
        dayOption: "{weekday} {date}",
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
        /* La prenotazione non è riuscita. La frase dice **che cosa non è
           successo** — lo slot è ancora libero — perché il dubbio vero, dopo
           un errore su una prenotazione, è se sia passata a metà. */
        error: {
          title: "La prenotazione non è andata a buon fine",
          body: "Lo slot è ancora libero: riprova.",
        },
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

    /*
     * Il check-up. Laura l'ha già fatto (§8), quindi la schermata mostra il
     * referto e dice quando si apre il prossimo, invece di riproporre una
     * prenotazione: l'elenco dipendenti dell'HR dichiara `completed` per la sua
     * riga, e due schermate che si contraddicono sono il difetto del §5.5.
     */
    checkup: {
      title: "Check-up annuale",
      subtitle: "Il check-up fisico incluso nel tuo piano.",

      lastTitle: "Il tuo ultimo referto",
      /** "Fatto il 15.03.2026 · Centro Medico Ardesia" */
      lastDone: "Fatto il {date} · {provider}",
      lastOpen: "Tocca per vederlo",

      /** "Puoi prenotarne uno nuovo dal 15.03.2027." */
      nextFrom: "Puoi prenotarne uno nuovo dal {date}.",

      networkTitle: "I centri convenzionati",
      networkHint:
        "Sono le strutture in cui Kora prenota il tuo check-up, con i costi già coperti dal piano.",
      /* Nessuna struttura prenotabile. La rete esiste ma può essere tutta in
         convenzionamento, come il Centro Diagnostico Basalto (§8): chi prenota
         vede le sole attive, quindi l'elenco può restare vuoto. */
      networkEmpty: "Nessuna struttura disponibile al momento.",
      /** "2.1 km" */
      distance: "{km} km",
      /* La virgola fra via e città è una convenzione postale, non un dettaglio
         di JSX: in altre lingue l'ordine delle due parti cambia (§2.7). */
      /** "Via al Parco 4, Lugano" */
      providerAddress: "{address}, {city}",
      /** Sul pulsante, quando il prossimo check-up non è ancora aperto */
      bookFrom: "Dal {date}",

      report: {
        /** "Referto del 15.03.2026" */
        title: "Referto del {date}",
        measurement: {
          blood_pressure: "Pressione",
          cholesterol: "Colesterolo",
          ecg: "ECG",
          bmi: "BMI",
          stress_risk: "Rischio da stress",
        },
        status: {
          normal: "Nella norma",
          attention: "Da tenere d'occhio",
        },
        explanationTitle: "Cosa vuol dire",
        /*
         * La spiegazione copre **tutte** le misure fuori norma: commentarne una
         * sola lascerebbe l'altra segnalata e senza risposta (§11).
         */
        explanation: {
          laura:
            "Il colesterolo è poco sopra il valore consigliato e il rischio da stress risulta moderato. Non è un'emergenza: segui il piano di prevenzione e ripeti il controllo al prossimo check-up.",
        },
        disclaimer:
          "Referto dimostrativo con valori di esempio. Non è un documento clinico e non sostituisce il referto del centro che esegue il check-up.",
      },
    },

    /*
     * Il profilo. Ogni riga viene dalla stessa fonte delle altre schermate: è
     * l'unico posto in cui i quattro contatori stanno insieme, quindi è anche
     * quello in cui una divergenza si vedrebbe subito.
     */
    profile: {
      title: "Il tuo profilo",
      privacy:
        "La tua salute resta tua. Nessun dato individuale viene condiviso con la tua azienda.",

      company: "Azienda",
      plan: "Piano",
      memberSince: "Iscritta da",

      healthTitle: "Riepilogo salute",
      score: "Punteggio salute",
      /** "78/100" */
      scoreValue: "{score}/100",
      summary: "Sintesi",
      weakest: "Area da seguire",

      usageTitle: "Utilizzo dei servizi",
      usage: {
        psychologist: "Sessioni psicologo",
        coach: "Sessioni coach",
        checkup: "Check-up annuale",
        doctor: "Consulti medico virtuale",
      },
      /** "3 su 10" */
      outOf: "{used} su {total}",
      /** "Fatto il 15.03.2026" */
      checkupDone: "Fatto il {date}",
      checkupToBook: "Da prenotare",
      /** "2 quest'anno" */
      consults: "{n} quest'anno",

      dataNote:
        "I tuoi dati sanitari sono protetti e non vengono mai condivisi con terzi.",
    },

    aiPlan: {
      title: "Piano di prevenzione",
      subtitle: "Costruito sul tuo profilo di salute.",
      /** "Aggiornato a luglio 2026" */
      generated: "Aggiornato a {month}",
      /** "Il prossimo aggiornamento è a gennaio 2027." */
      nextUpdate: "Il prossimo aggiornamento è a {month}.",

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

      /*
       * I suggerimenti. Nessuno promette un servizio che il piano non comprende
       * — l'ereditato ne aveva uno che rimandava alla nutrizionista, che il §9
       * dà solo all'Executive mentre Demo SA è su Plus — e nessuno ripete un
       * contatore che vive altrove (§5.5).
       */
      tip: {
        sleep_screens: "Evita gli schermi nei 30 minuti prima di dormire",
        sleep_schedule: "Vai a letto e alzati sempre alla stessa ora",
        sleep_caffeine: "Niente caffeina dopo le 14:00",
        stress_breathing: "Dedica 10 minuti al giorno alla respirazione",
        stress_breaks: "Programma una pausa ogni 90 minuti",
        stress_coach:
          "Prenota una sessione con il coach per le tecniche di gestione",
        activity_walk: "Comincia con camminate di 30 minuti",
        activity_stairs: "Usa le scale al posto dell'ascensore",
        activity_yoga: "Prova una lezione di yoga online",
        nutrition_fibre: "Aumenta fibre e verdura a ogni pasto",
        nutrition_fats: "Riduci i grassi saturi",
        nutrition_recheck:
          "Ripeti il controllo del colesterolo al prossimo check-up",
        mental_continue: "Prosegui il percorso con la psicologa",
        mental_techniques: "Usa fuori dalla seduta le tecniche che impari",
        mental_journal: "Annota come ti senti nei giorni difficili",
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
      /* Nella sua agenda: la scheda vive dentro il portale di una sola
         professionista, e il numero e' il suo. */
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
        /* La nota non è stata salvata. Registro strumento, e si dice che il
           testo scritto non è andato perso: è ancora nel campo. */
        error: {
          title: "Nota non salvata",
          body: "Il testo è ancora qui: riprova.",
        },
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
      /* La frase intera, non " · in corso" attaccato al mese: il pezzo mobile
         non sta a destra in tutte le lingue (§2.7). La maiuscola iniziale la
         mette il CSS sulla prima lettera, perché `formatMonthYear` restituisce
         il mese minuscolo come vuole `Intl`. */
      /** "settembre 2026 · in corso" */
      monthInProgress: "{month} · in corso",
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
      /* `getProfessional` è nullable per contratto: il portale può restare
         senza il professionista di cui mostra il profilo. */
      empty: "Nessun profilo da mostrare.",
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
    /* La frase intera e non "{label} · in corso" composto in pagina: in tedesco
       il pezzo mobile non sta a destra, e una lingua che lo mette altrove non
       avrebbe dove dirlo (§2.7). */
    /** "3° trimestre 2026 · in corso" */
    quarterLabelInProgress: "{quarter}° trimestre {year} · in corso",
    /* La sigla dell'asse: sta qui perché "Q" è la lettera di *quarter*, e in
       tedesco un asse si etichetta "Q3" o "3. Quartal" a seconda dello spazio.
       In pagina era un template literal, cioè intraducibile. */
    /** "Q3" */
    quarterShort: "Q{quarter}",

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

    /* Il trimestre scelto non ha snapshot né report: `null` per contratto, non
       un guasto (`docs/CONTRATTO-DATI.md` §2). La frase nomina il selettore,
       perché è il comando con cui si esce. */
    quarterEmpty:
      "Nessun dato per il trimestre selezionato. Scegline un altro dall'elenco qui sopra.",
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
    /** "Psicologo: 142" */
    distributionEntry: "{service}: {count}",

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
    /** "78% · Alto" */
    departmentScore: "{percent} · {level}",
    suppressed: "Sotto soglia",
    suppressedTooltip:
      "Sotto la soglia il dato non viene calcolato, per non renderlo riconducibile a singole persone.",

    trendTitle: "Trend stress · ultimi {months} mesi",
    trendCompany: "Media azienda",
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
      /* Nessun dipendente da elencare: succede a un'azienda appena attivata,
         come Betulla nel portafoglio del back-office (§8). */
      empty: "Nessun dipendente da mostrare.",
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
    },

    billing: {
      title: "Fatturazione",
      planTitle: "Piano attivo",
      employees: "Dipendenti",
      monthlyCost: "Costo mensile",
      annualContract: "Contratto annuale",
      renewal: "Scadenza",
      invoicesTitle: "Fatture recenti",
      /* Un cliente appena attivato non ha ancora fatturato niente. */
      invoicesEmpty: "Nessuna fattura emessa finora.",
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

      /*
       * Il documento scaricabile (§10.C.3). È **una pagina sola**: un allegato
       * per il consiglio, non un fascicolo — quindi qui non c'è niente che la
       * schermata non dica già, e le etichette sono le stesse.
       *
       * Registro strumento (§7): terza persona, metrico, sentence case.
       */
      pdf: {
        /** Il titolo stampato in testa al documento */
        documentTitle: "Report salute aziendale",
        /** "Demo SA · 120 dipendenti · Piano Plus" */
        documentSubtitle: "{company} · {employees} dipendenti · Piano {plan}",
        /** "3° trimestre 2026" — il periodo, in evidenza sotto il titolo */
        period: "Periodo · {quarter}",
        /** "Generato il 23.09.2026" — la data viene da DEMO_TODAY, non dall'orologio */
        generatedOn: "Generato il {date}",
        active: "Dipendenti attivi",
        sessions: "Sessioni usate",
        /** "142 di 1'200 sessioni annue" */
        sessionsValue: "{used} di {total}",
        /* La nota chiude il documento perché è ciò che l'azienda deve poter
           rileggere quando il PDF circola fuori dalla dashboard, dove il banner
           non c'è più. */
        privacyNote:
          "Dati aggregati e anonimi. Kora non comunica all'azienda dati sanitari individuali né prenotazioni riconducibili a singole persone.",
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

  /*
   * L'area pubblica (§10.A): landing, calcolatore ROI, prezzi, richiesta demo.
   *
   * Registro strumento (§7), e con una precisazione che vale solo qui: queste
   * quattro schermate parlano a **un'azienda che valuta**, non a un dipendente
   * che usa. Terza persona, metrica, niente incoraggiamento — la seconda
   * persona calda comincia dopo l'accesso.
   */
  public: {
    nav: {
      pricing: "Piani",
      roi: "Calcolatore ROI",
      demo: "Demo",
      employees: "Dipendenti",
      hr: "HR",
      professionals: "Professionisti",
      login: "Accedi",
      bookDemo: "Prenota una demo",
      /** Nome del pulsante che apre la barra sul mobile: lo legge chi non vede l'icona. */
      menu: "Apri il menu",
    },

    footer: {
      tagline: "Il sistema operativo della salute per le aziende svizzere.",
      city: "Lugano, Svizzera",

      platformTitle: "Piattaforma",
      platformPricing: "Piani e prezzi",
      platformRoi: "Calcolatore ROI",
      platformEmployee: "Portale dipendenti",
      platformHr: "Portale HR",
      platformProfessional: "Per professionisti",

      /*
       * Le voci senza destinazione. Restano come elenco di sezioni previste —
       * l'affordance da link è stata tolta, perché un testo che si illumina al
       * passaggio del mouse e non porta da nessuna parte è un vicolo cieco
       * (§10), e le pagine vere sarebbero scope nuovo (§2.6). Decisione dei
       * founder dell'08.08.2026; sono lavoro di M5.
       */
      companyTitle: "Azienda",
      companyAbout: "Chi siamo",
      companyContact: "Contatti",
      companyCareers: "Carriere",
      companyBlog: "Blog",

      privacyTitle: "Privacy e sicurezza",
      privacyBody:
        "Dati sanitari protetti. Conformità GDPR e LPD. Hosting in Svizzera.",

      legalPrivacy: "Privacy policy",
      legalTerms: "Termini di servizio",
      legalCookies: "Cookie policy",

      /** "© 2026 Kora Switzerland SA. Tutti i diritti riservati." */
      copyright: "© {year} Kora Switzerland SA. Tutti i diritti riservati.",
    },

    /*
     * Il calcolatore ROI (§10.A.2). Risponde a "quanto stai già perdendo",
     * mentre il simulatore di `/pricing` risponde a "quanto costa": è la
     * ragione per cui stanno su due rotte e non condividono un campo
     * "numero di dipendenti".
     */
    roi: {
      title: "Quanto costa oggi la salute dei dipendenti",
      /* Il listino è arrivato senza il piano su cui il calcolatore è tarato:
         senza prezzo non c'è niente da calcolare (§9). */
      empty: "Il calcolatore non è disponibile al momento.",
      subtitle:
        "Le perdite che un'azienda svizzera sostiene ogni anno, e quanto ne recupera con Kora. Scenario conservativo.",

      employeesLabel: "Numero di dipendenti",
      /** Sotto il campo: "Da 20 a 1'000 dipendenti" */
      employeesRange: "Da {min} a {max} dipendenti",

      lossesTitle: "Perdite annue stimate",
      loss: {
        absenteeism: "Assenteismo",
        presenteeism: "Presenteismo",
        burnout: "Burnout pre-clinico",
        turnover: "Turnover legato alla salute",
      },
      lossHint: {
        /** "6.5 giorni di assenza per dipendente, a CHF 900 al giorno" */
        absenteeism: "{days} giorni di assenza per dipendente, a {cost} al giorno",
        /** "CHF 1'500 di produttività persa per dipendente" */
        presenteeism: "{cost} di produttività persa per dipendente",
        /** "30% della popolazione a rischio, 15% di produttività persa" */
        burnout: "{share} della popolazione a rischio, {loss} di produttività persa",
        /** "4.3% di uscite legate alla salute, più il costo di sostituzione" */
        turnover: "{rate} di uscite legate alla salute, più il costo di sostituzione",
      },
      lossesTotal: "Totale perdite",

      savingsTitle: "Con Kora",
      savings: "Risparmio stimato",
      /** "Il 15% su assenteismo e presenteismo, il 20% su burnout e turnover" */
      savingsHint:
        "Il {absence} su assenteismo e presenteismo, il {burnout} su burnout e turnover",
      cost: "Costo Kora",
      /** "Sul piano Plus, CHF 55 per dipendente al mese" */
      costHint: "Sul piano {plan}, {price} per dipendente al mese",
      /*
       * Il costo si sottrae, e il segno lo mette la frase.
       *
       * ATTENZIONE AL CARATTERE: è il meno tipografico U+2212 (−), non il
       * trattino da tastiera (-). È lo stesso che `formatSigned` usa sulle KPI
       * di trend, e sostituirlo "raddrizzando" la stringa fa uscire due segni
       * diversi nella stessa schermata.
       *
       * L'alternativa sarebbe `formatCHF(-valore)` e lasciare il segno a
       * `Intl`, che è più corretto per le lingue che lo mettono altrove — ma
       * cambia il glifo a schermo, quindi è una decisione dei founder.
       */
      /** "− CHF 66'000" */
      costValue: "− {amount}",
      netSavings: "Risparmio netto",
      ratio: "Ritorno sull'investimento",
      /** "2.35:1" */
      ratioValue: "{ratio}:1",
      ratioHint: "Risparmio netto per ogni franco investito",

      /*
       * La riga che sostituisce la stima "CHF 1'400–2'900 per dipendente",
       * che il Business Plan non contiene ed è uscita in M0 (§9). Qui il
       * numero è derivato dal modello e arrotondato al centinaio: al franco
       * sarebbe finta precisione su una stima.
       */
      perEmployee: "≈ {amount} per dipendente all'anno, scenario conservativo",

      /*
       * Ogni voce è lineare nell'organico, quindi il rapporto non si muove da
       * 20 a 1000 dipendenti. Il §9 chiede che la UI non faccia credere il
       * contrario: chi muove il cursore deve leggerlo, non dedurlo.
       */
      linearityNote:
        "Ogni voce cresce in proporzione all'organico: il rapporto resta {ratio} a qualunque numero di dipendenti.",

      sources: "Scenario conservativo. Fonti: SECO, Job Stress Index.",

      ctaTitle: "Questi numeri, sulla vostra azienda",
      ctaBody:
        "Una demo di trenta minuti sui dati del vostro settore e del vostro organico.",
      ctaButton: "Prenota una demo",
      ctaPricing: "Vedi i piani",
    },

    /*
     * Il listino (§10.A.3). Le voci sono frasi complete con segnaposto e le
     * compone `lib/plan-features.ts` da `Plan`: nessuna card elenca le proprie
     * righe, quindi nessuna può divergere dal §9.
     *
     * Le fasce di organico sono copy di segmento e non un dato del piano: il
     * §9 non le trascrive, quindi non stanno sul tipo. Restano quelle
     * ereditate, invariate.
     */
    plans: {
      title: "Piani trasparenti, valore concreto",
      /* Listino vuoto: la pagina prezzi non ha niente da mostrare. */
      empty: "Nessun piano da mostrare al momento.",
      subtitle:
        "Un abbonamento per dipendente. Nessun costo nascosto. ROI misurabile dal primo trimestre.",

      target: {
        essenziale: "Aziende 20–100 dipendenti",
        plus: "Aziende 100–300 dipendenti",
        executive: "Aziende 300+ dipendenti",
      },

      recommended: "Piano consigliato",
      /** "CHF 55" accanto a "/ dipendente / mese" */
      priceUnit: "/ dipendente / mese",
      cta: "Richiedi preventivo",

      feature: {
        /** "10 sessioni di psicologo all'anno" */
        sessions: "{count} sessioni di psicologo all'anno",
        /* "una volta" è l'informazione: il §9 lo dà una sola volta, non a ogni
           sessione, e senza il tetto si legge come un extra ricorrente. */
        intro: "Colloquio conoscitivo gratuito, una volta",
        /** "4 sessioni di coach all'anno" */
        coach: "{count} sessioni di coach all'anno",
        psychiatrist: "Psichiatra su richiesta incluso",
        /** "4 sessioni di nutrizionista all'anno" */
        nutritionist: "{count} sessioni di nutrizionista all'anno",
        /*
         * L'SLA in quattro frasi e non in due con un numero dentro: a un'ora
         * "entro {hours} ore" dà "entro 1 ore", ed è il caso dell'Executive,
         * cioè la card più cara. È il §2.7 nel suo caso più piccolo — la
         * frase intera cambia, non solo il valore — e vale allo stesso modo
         * per il tedesco, dove cambia anche l'ordine.
         */
        /** "Medico virtuale illimitato, risposta entro 4 ore" */
        virtualDoctorUnlimited:
          "Medico virtuale illimitato, risposta entro {hours} ore",
        virtualDoctorUnlimitedOneHour:
          "Medico virtuale illimitato, risposta entro un'ora",
        /** "3 consulti di medico virtuale all'anno, risposta entro 12 ore" */
        virtualDoctorCapped:
          "{count} consulti di medico virtuale all'anno, risposta entro {hours} ore",
        virtualDoctorCappedOneHour:
          "{count} consulti di medico virtuale all'anno, risposta entro un'ora",
        /* Due frasi e non una con un aggettivo variabile: i due check-up del
           §9 non sono lo stesso check-up, e la card deve poterli distinguere. */
        checkup: {
          annual: "Check-up fisico annuale",
          executive:
            "Check-up executive completo: ECG, eco addome, oculista, sangue completo",
        },
        aiPlanMonthly: "Piano di prevenzione AI aggiornato ogni mese",
        /** "Piano di prevenzione AI aggiornato ogni 6 mesi" */
        aiPlanEveryMonths:
          "Piano di prevenzione AI aggiornato ogni {months} mesi",
        /*
         * I tre livelli della dashboard HR (§9, p.9 e p.10 del BP). Tre frasi
         * intere e non una con un aggettivo variabile: la base dice cosa
         * mostra, quella del Plus introduce il taglio per reparto e l'alert
         * burnout, quella dell'Executive la cadenza mensile e la call. Rese
         * come "dashboard base / per reparto / avanzata" direbbero che il
         * piano più caro è lo stesso prodotto in una taglia più grande.
         */
        hrDashboard: {
          base: "Dashboard HR e ROI base: utilizzo, stress anonimizzato, risparmio in CHF",
          department:
            "Dashboard HR per reparto con report trimestrale e alert burnout precoce",
          advanced:
            "Dashboard HR avanzata, con report mensile e call mensile col team clinico",
        },
        /** "2 workshop live all'anno inclusi" */
        workshops: "{count} workshop live all'anno inclusi",
        family: "Familiari inclusi: partner e un figlio",
        /** "Estensione ai familiari: + CHF 15 per dipendente al mese, opzionale" */
        partnerExtension:
          "Estensione ai familiari: + {price} per dipendente al mese, opzionale",
        /** "Sessione oltre il tetto: CHF 28" */
        extraSession: "Sessione oltre il tetto: {price}",
      },
    },

    /* Il simulatore di costo di `/pricing`: risponde a "quanto costa", che è
       la domanda che il calcolatore di `/roi` non fa. */
    costSimulator: {
      title: "Calcola il costo",
      employeesLabel: "Numero di dipendenti",
      planLabel: "Piano",
      /** "Plus — CHF 55 al mese" */
      planOption: "{plan} — {price} al mese",
      billingLabel: "Fatturazione",
      billingMonthly: "Mensile",
      billingAnnual: "Annuale",
      totalMonthly: "Totale mensile",
      totalAnnual: "Totale annuale",
      /** "120 dipendenti × CHF 55 × 12 mesi" */
      breakdownAnnual: "{employees} dipendenti × {price} × 12 mesi",
      /** "120 dipendenti × CHF 55 × 1 mese" */
      breakdownMonthly: "{employees} dipendenti × {price} × 1 mese",
      cta: "Prenota una demo",
      /* Il costo non è il valore: da qui si rimanda al calcolatore, che è la
         pagina che risponde all'altra metà della domanda (§10.A.2). */
      roiLink: "Quanto stai già perdendo senza Kora",
    },

    /* La landing (§10.A.1). Parla a un'azienda che valuta, non a un
       dipendente che usa: terza persona, metrica. */
    landing: {
      badge: "Piattaforma svizzera, privacy-first",
      /* Il sigillo sul riquadro del prodotto. Chiave sua e non `badge`: sono
         due elementi diversi nella stessa schermata, e la stessa frase due
         volte a mezzo schermo di distanza si legge come un difetto. */
      mockupSeal: "Privacy-first",
      /* Il titolo è spezzato in due perché la seconda metà è colorata: sono
         due parti della stessa frase, non due frasi da concatenare. */
      heroTitleLead: "La salute aziendale,",
      heroTitleAccent: "finalmente integrata.",
      heroBody:
        "Kora unisce psicologi online, medico virtuale, check-up fisici, prevenzione AI e dashboard HR anonima in un unico abbonamento per dipendente.",
      heroCtaRoi: "Calcola il ritorno",
      heroCtaDemo: "Prenota una demo",
      heroCompliance: "Hosting in Svizzera. Conforme GDPR e LPD.",

      /*
       * Il riquadro dell'hero è una miniatura del prodotto e legge dal
       * provider: nel codice ereditato dichiarava un punteggio, un dato di
       * sonno, un'adozione e un calo di stress che il §8 non contiene — fra
       * cui il "−8%" che la migrazione dell'area HR ha già dimostrato non
       * riproducibile, e un "82%" che era il numero degli iscritti letto come
       * percentuale.
       */
      mockup: {
        scoreLabel: "Profilo salute",
        scoreOutOf: "/100",
        /** "Focus: sonno" — l'area più debole del profilo */
        focus: "Focus: {area}",
        nextSessionLabel: "Prossima sessione",
        /** "gio 17:30 · Dr.ssa Meier" */
        nextSessionValue: "{weekday} {time} · {professional}",
        analyticsLabel: "Dashboard HR (anonima)",
        /** "Adozione 68% · Stress −2 punti" */
        analyticsValue: "Adozione {adoption} · Stress {trend} punti",
        /** Quando il trimestre più vecchio non ha un precedente da cui derivare il trend. */
        analyticsValueNoTrend: "Adozione {adoption}",
      },

      problemTitle: "Il costo nascosto della salute aziendale",
      problem: {
        burnout: "Burnout in aumento",
        absenteeism: "Assenteismo costoso",
        waitingLists: "Liste d'attesa per gli psicologi",
        fragmented: "Benefit sanitari frammentati",
        noData: "HR senza dati misurabili",
      },

      valueTitle: "Una piattaforma. Tre livelli di valore.",
      value: {
        employee: {
          title: "Per il dipendente",
          body: "Accesso semplice a salute mentale, medico virtuale e prevenzione. Tutto privato, tutto in un unico posto.",
        },
        company: {
          title: "Per l'azienda",
          body: "Insight anonimi, ritorno misurabile, retention migliorata e riduzione dell'assenteismo.",
        },
        professional: {
          title: "Per i professionisti",
          body: "Nuova domanda, meno burocrazia, pagamenti automatici. Collaborazione a mandato senza vincoli.",
        },
      },

      /*
       * Il richiamo al calcolatore. I numeri sono quelli di ancoraggio del §9,
       * calcolati dal modello come sulla pagina `/roi`: qui il campione è
       * dichiarato, perché un importo senza l'organico su cui è calcolato non
       * è verificabile.
       */
      roiTeaser: {
        title: "Il ritorno, prima della firma",
        /** "Un'azienda di 100 dipendenti perde CHF 1'289'500 all'anno." */
        losses: "Un'azienda di {employees} dipendenti perde {amount} all'anno.",
        /** "Con Kora ne recupera CHF 155'150 netti: 2.35:1, scenario conservativo." */
        net: "Con Kora ne recupera {amount} netti: {ratio}, scenario conservativo.",
        cta: "Apri il calcolatore",
      },

      plansTitle: "Piani trasparenti, valore concreto",
      plansSubtitle:
        "Un abbonamento per dipendente. Nessun costo nascosto. Ritorno misurabile.",
      plansAll: "Confronta i tre piani",

      privacyTitleLead: "La privacy non è un dettaglio.",
      privacyTitleAccent: "È il cuore del prodotto.",
      privacyBody:
        "L'azienda non vede mai dati individuali, sedute, referti o diagnosi. Solo insight aggregati e anonimi. I dati sanitari restano di chi li produce.",
      privacyChip: {
        hosting: "Hosting in Svizzera",
        gdpr: "Conforme GDPR",
        lpd: "Conforme LPD",
        encryption: "Crittografia end-to-end",
      },

      finalTitle: "Porta Kora nella tua azienda.",
      finalBody: "Trenta minuti per vedere la piattaforma sui vostri numeri.",
      finalCta: "Prenota una demo",
    },

    /* La richiesta di demo (§10.A.4). La validazione vera è M5: qui bastano i
       `required` del browser, e il form non finge di controllare altro. */
    demoRequest: {
      title: "Prenota una demo",
      subtitle:
        "Trenta minuti con il nostro team, sui numeri della vostra azienda.",

      companyLabel: "Nome azienda",
      contactLabel: "Nome e cognome",
      emailLabel: "Email aziendale",
      phoneLabel: "Telefono",
      employeesLabel: "Numero di dipendenti",
      messageLabel: "Messaggio",
      optional: "facoltativo",
      privacy:
        "I dati saranno trattati in conformità alla LPD svizzera e al GDPR.",
      submit: "Invia la richiesta",
      submitting: "Invio in corso",
      /* L'invio non è riuscito. Stessa logica della nota: i dati compilati
         restano nel form, e dirlo evita che si ricominci da capo. */
      error: {
        title: "Invio non riuscito",
        body: "I dati che hai scritto sono ancora qui: riprova.",
      },

      /* La validazione (M5.c). Registro strumento come il resto dell'area
         pubblica, e ogni messaggio è una frase intera: comporlo dall'etichetta
         del campo più una parola ("obbligatorio") lo romperebbe in tedesco,
         dove l'ordine cambia (§2.7).

         Sono cinque perché cinque sono le regole che il contratto dichiara.
         Telefono e messaggio non compaiono: sono facoltativi e non hanno un
         formato da rispettare, quindi non c'è niente da dire. */
      validation: {
        companyRequired: "Il nome dell'azienda è obbligatorio.",
        contactRequired: "Il nome del referente è obbligatorio.",
        emailRequired: "L'email è obbligatoria.",
        emailInvalid: "L'indirizzo email non sembra valido.",
        employeesInvalid:
          "Il numero di dipendenti va scritto in cifre intere, oppure lasciato vuoto.",
      },

      successTitle: "Richiesta ricevuta",
      /* La conferma nomina l'azienda che ha scritto, e la legge dal record
         restituito dalla mutation: è la prova che la scrittura è avvenuta,
         non un cartello che compare comunque. */
      successBody:
        "La richiesta per {company} è registrata. Il team risponde entro un giorno lavorativo.",
      successHome: "Torna alla home",
      successRoi: "Intanto, calcola il ritorno",
    },
  },

  /*
   * Il back-office (§10.E). Registro strumento: parla a chi gestisce la
   * piattaforma, quindi terza persona e metrico, come l'area HR.
   *
   * Non ha valore narrativo per il pitch, ma ha valore di prodotto: serve dopo.
   * Il banner "dati dimostrativi" resta finché la guardia di ruolo non arriva
   * con M5.
   */
  admin: {
    portalName: "Admin interno",
    nav: {
      companies: "Aziende",
      users: "Utenti",
      professionals: "Professionisti",
      sessions: "Sessioni",
      checkupProviders: "Provider check-up",
      analytics: "Analytics",
    },
    demoBanner:
      "Back-office interno · dati dimostrativi. Aziende, persone e strutture di questa sezione sono di fantasia e non descrivono clienti reali.",

    /* L'estratto si dichiara, come per l'elenco dipendenti dell'HR: la
       paginazione è M5, e far credere che la piattaforma abbia sette utenti
       sarebbe peggio che dire quanti se ne stanno mostrando. */
    extractNote: "Estratto di {shown} righe su {total}. La ricerca completa arriva con la messa in produzione.",

    companies: {
      /* Portafoglio vuoto: nessun cliente ancora firmato. */
      empty: "Nessuna azienda cliente.",
      title: "Aziende clienti",
      kpiActive: "Clienti attivi",
      kpiEmployees: "Dipendenti coperti",
      kpiRevenue: "Ricavo annuo",
      /* "Sui clienti attivi": senza, il totale sembra includere anche chi non
         fattura ancora, che è il difetto della schermata ereditata. */
      kpiRevenueHint: "Sui clienti attivi",
      kpiEnrolled: "Iscritti",
      /** "415 su 798 dipendenti coperti" */
      kpiEnrolledHint: "{enrolled} su {covered} dipendenti coperti",

      colName: "Azienda",
      colIndustry: "Settore",
      colEmployees: "Dipendenti",
      colPlan: "Piano",
      colCity: "Sede",
      colClientSince: "Cliente da",
      colRevenue: "Ricavo/anno",
      colStatus: "Stato",

      statusActive: "Attiva",
      /* Non "inattiva": su una schermata che un investitore può vedere si
         leggerebbe come abbandono, mentre il caso è un contratto firmato da
         poco e non ancora avviato (§8). */
      statusOnboarding: "In attivazione",
      /** Il ricavo di un cliente non ancora avviato: potenziale, non fatturato. */
      revenuePotential: "{amount} potenziale",
    },

    industry: {
      finance: "Finanza",
      pharma: "Farmaceutica",
      legal: "Legale",
      tech: "Tecnologia",
      insurance: "Assicurazioni",
    },

    users: {
      title: "Utenti",
      searchPlaceholder: "Cerca per nome o azienda",
      kpiTotal: "Utenti iscritti",
      /* "in portafoglio" e non "attivi": il conteggio del dominio somma gli
         iscritti di ogni cliente il cui contratto è partito, senza escludere
         chi non è ancora avviato. Diceva "attivi" perché la pagina rifaceva il
         conto per conto suo con quel filtro, e le due definizioni davano lo
         stesso numero solo perché l'unico cliente non avviato ha zero
         iscritti. */
      kpiTotalHint: "Su tutti i clienti in portafoglio",
      kpiActive: "Attivi",
      kpiWithAssessment: "Con assessment",
      kpiAverageScore: "Profilo salute medio",
      /* Le tre KPI qui sopra si contano sull'estratto, la prima su tutta la
         piattaforma: senza dirlo, quattro numeri affiancati sembrerebbero
         parlare della stessa popolazione — che è il difetto per cui il
         back-office ereditato metteva 618 utenti accanto a un tasso che ne
         implicava 767. */
      kpiOnExtract: "Sulle {shown} righe mostrate",

      colName: "Nome",
      colEmail: "Email",
      colCompany: "Azienda",
      colRole: "Ruolo",
      colScore: "Profilo salute",
      colStatus: "Stato",
      colJoined: "Iscritto",

      statusActive: "Attivo",
      statusInactive: "Inattivo",
      empty: "Nessun utente corrisponde alla ricerca.",
    },

    role: {
      employee: "Dipendente",
      hr: "HR",
      professional: "Professionista",
      admin: "Admin",
    },

    professionals: {
      title: "Professionisti",
      /* Roster vuoto: nessuno è ancora entrato nella rete. */
      empty: "Nessun professionista nel roster.",
      kpiTotal: "Nel roster",
      kpiBookable: "Prenotabili",
      kpiVetting: "In verifica",
      /* "di carriera": e' la somma dei totali di sempre dei cinque
         professionisti, non le sedute di un mese ne' quelle di un'agenda. Tre
         schermate del back-office dicevano "sedute erogate" contando tre cose
         diverse, e affiancate si leggevano come lo stesso numero sbagliato
         (§5.5). */
      kpiSessions: "Sedute di carriera",
      kpiSessionsHint: "Somma di tutti i professionisti della rete",

      colName: "Nome",
      colQualification: "Qualifica",
      colSpecialty: "Specialità",
      colLanguages: "Lingue",
      colFee: "Compenso",
      colSessions: "Sedute",
      colDocuments: "Documenti",
      colMandate: "Mandato",
      colStatus: "Stato",

      statusBookable: "Prenotabile",
      statusVetting: "In verifica",
      /* Il numero d'albo non esiste nel dominio e non si inventa (§8): quello
         che la piattaforma verifica davvero sono i documenti e il mandato. */
      vettingNote:
        "Un professionista è prenotabile quando i documenti sono verificati e il mandato è firmato. Finché non lo è, non compare nella prenotazione.",
    },

    sessions: {
      title: "Sedute",
      /* La sola agenda della Dr.ssa Meier: il dataset demo ha un portale
         professionista solo (`docs/CONTRATTO-DATI.md` §7). */
      subtitle: "Agenda di {professional}",
      kpiTotal: "Sedute",
      kpiDelivered: "Erogate",
      kpiScheduled: "In programma",
      kpiVolume: "Compensi maturati",
      kpiVolumeHint: "Solo sedute erogate",

      colPatient: "Paziente",
      colProfessional: "Professionista",
      colDate: "Data",
      colType: "Tipo",
      colFee: "Compenso",
      colStatus: "Stato",

      statusScheduled: "In programma",
      statusCompleted: "Erogata",
      statusCancelled: "Annullata",
      /* Le iniziali sono tutto ciò che esce del paziente, e a impedirlo è il
         tipo: `ProfessionalSession` non ha un campo su cui un nome possa
         arrivare (`docs/CONTRATTO-DATI.md` §3). */
      privacyNote: "Dei pazienti escono le sole iniziali, mai il nome.",
    },

    checkupProviders: {
      /* Rete convenzionata vuota. */
      empty: "Nessuna struttura nella rete.",
      title: "Provider check-up",
      kpiActive: "Strutture attive",
      kpiCities: "Città coperte",
      kpiBookings: "Check-up prenotati",
      kpiBookingsHint: "Sui dodici mesi",
      kpiPending: "In convenzionamento",

      colName: "Struttura",
      colCity: "Città",
      colAddress: "Indirizzo",
      colDistance: "Distanza",
      colStatus: "Stato",

      statusActive: "Attiva",
      statusPending: "In convenzionamento",
      /** "2.1 km" */
      distance: "{km} km",
      pendingNote:
        "Una struttura in convenzionamento non è prenotabile dal portale dipendente.",
    },

    analytics: {
      title: "Analytics piattaforma",
      /* Serie di piattaforma senza il mese corrente: è il back-office aperto
         prima del primo cliente, non un guasto. */
      empty: "Nessun dato di piattaforma per il mese corrente.",
      kpiRevenue: "Ricavo del mese",
      /** "CHF 652'968 annualizzati" */
      kpiRevenueHint: "{amount} annualizzati",
      kpiSessions: "Sedute del mese",
      kpiEnrolled: "Utenti iscritti",
      kpiActivation: "Attivazione",
      /** "415 su 798 dipendenti coperti" */
      kpiActivationHint: "{enrolled} su {covered} dipendenti coperti",

      revenueChart: "Ricavo ricorrente mensile",
      /* "di piattaforma": e' la somma su tutti i clienti, mese per mese —
         un'altra grandezza ancora rispetto alle sedute di carriera dei
         professionisti e a quelle di una singola agenda. */
      sessionsChart: "Sedute di piattaforma per mese",
      planMixChart: "Mix piani",
      activationChart: "Attivazione",
      serviceMixChart: "Sedute per servizio, dodici mesi",

      /** "1 azienda" / "2 aziende" — il singolare cambia la parola intera. */
      planMixOne: "1 azienda",
      planMixMany: "{count} aziende",
      /** L'etichetta sugli spicchi: "Plus: 2" */
      planMixEntry: "{plan}: {count}",
    },

    demoRequests: {
      title: "Richieste demo",
      /* Parte vuoto di proposito: il §8 non contiene richieste demo, quindi
         non se ne inventano. Si riempie inviando il form da /demo. */
      empty: "Nessuna richiesta. Le richieste inviate dal form pubblico compaiono qui.",
      colCompany: "Azienda",
      colContact: "Referente",
      colEmail: "Email",
      colPhone: "Telefono",
      colEmployees: "Dipendenti",
      colReceived: "Ricevuta",
    },
  },
} as const;
