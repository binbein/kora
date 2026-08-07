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

  sessionType: {
    first_visit: "Prima visita",
    session: "Seduta",
    follow_up: "Follow-up",
  },

  cancellationReason: {
    by_patient: "Annullata dal paziente",
    by_professional: "Annullata dal professionista",
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
      sessionsThisMonth: "Sedute del mese",
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
      sessionsThisMonth: "Sedute del mese",
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
} as const;
