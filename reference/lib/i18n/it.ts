import type {
  AppointmentKind,
  HealthArea,
  HealthProfile,
  PlanId,
  ProfessionalLanguage,
  ProfessionalSpecialty,
  StressLevel,
} from "@/lib/data/types";

/*
 * Tutte le stringhe di UI (CLAUDE.md §2.6). Niente testo cablato nei
 * componenti: aggiungere una lingua domani significa aggiungere un file con
 * le stesse chiavi, non rileggere le schermate.
 *
 * Le frasi con valori variabili sono sempre complete, con segnaposto {nome}:
 * l'ordine delle parole cambia da lingua a lingua, quindi la concatenazione
 * è vietata. I valori vanno formattati con `format.ts` prima di entrare qui.
 *
 * Tono (§4.4): dashboard HR professionale e in terza persona, app dipendente
 * calda e in seconda persona. Ovunque sentence case, niente punti
 * esclamativi, niente emoji.
 */

const dictionary = {
  /*
   * Testi che non stanno dentro una schermata: titolo della scheda del
   * browser, descrizione, anteprima del link quando viene condiviso. Sono
   * comunque testo da leggere, quindi vivono qui come tutto il resto.
   */
  meta: {
    title: "KORA",
    description: "Piattaforma di salute aziendale per il mercato svizzero",
    shareImageAlt: "KORA — salute aziendale per le imprese svizzere",
  },

  common: {
    appName: "KORA",
    loading: "Caricamento",
    confirm: "Conferma",
    cancel: "Annulla",
    back: "Indietro",
    next: "Avanti",
    close: "Chiudi",
    notAvailable: "—",
  },

  /*
   * Landing pubblica (§8.C). Parla a chi compra — direzione, HR, CFO — quindi
   * tiene il registro professionale della dashboard; il "tuo" della call to
   * action è quello che il §8.C detta alla lettera.
   *
   * Le frasi sono intere e senza elementi inline in mezzo. È il modo più
   * semplice di non incappare nella trappola del §9: uno spazio mangiato da
   * SWC attorno a un <strong> attacca due parole, e su una landing piena di
   * testo è il difetto che si nota per primo.
   */
  site: {
    hero: {
      eyebrow: "Salute aziendale · Svizzera",
      title: "La salute dei dipendenti, misurata in franchi",
      subtitle:
        "Psicologo, medico virtuale, check-up e prevenzione per tutta l'azienda. La dashboard HR mostra quanto sta rendendo, reparto per reparto e trimestre per trimestre.",
      cta: "Calcola il tuo ROI",
      pillarPsychologist: "Psicologo con sessioni incluse",
      pillarDoctor: "Medico virtuale",
      pillarCheckup: "Check-up fisico",
      pillarPrevention: "Prevenzione AI",
      pillarDashboard: "Dashboard HR con ROI",
    },

    calculator: {
      title: "Quanto vale per la tua azienda",
      intro:
        "Le formule sono quelle del nostro business plan, con valori svizzeri e ipotesi di risparmio prudenti. Cambia il numero di dipendenti e i conti si rifanno.",
      employeesLabel: "Dipendenti",
      employeesHelp: "Da {min} a {max} dipendenti",
      presetsLabel: "Esempi",

      lossesTitle: "Quanto costa oggi",
      lossesCaption: "Perdita annua stimata, senza alcun intervento",
      lossesBreakdown: "Come si compone",
      lossAbsenteeism: "Assenteismo",
      /* Gli importi entrano già formattati da formatCHF, valuta compresa: la
         posizione del simbolo cambia con la lingua (fr-CH lo mette dopo il
         numero, §2.6), quindi "CHF" non può stare cablato nella frase. */
      lossAbsenteeismHint:
        "{days} giorni per dipendente all'anno, a {cost} al giorno",
      lossPresenteeism: "Presenteismo",
      lossPresenteeismHint: "{cost} per dipendente all'anno",
      lossBurnout: "Burnout pre-clinico",
      lossBurnoutHint:
        "{share} dei dipendenti a rischio, con {loss} di produttività persa",
      lossTurnover: "Turnover da salute",
      lossTurnoverHint:
        "{rate} di uscite all'anno, fra costo di uscita e sostituzione",

      koraTitle: "Con KORA",
      conservativeBadge: "scenario conservativo",
      netBreakdown: "Come ci si arriva",
      savingsLabel: "Risparmio stimato",
      costLabel: "Costo KORA",
      costHint: "{employees} dipendenti, a {price} al mese per dodici mesi",
      netLabel: "Risparmio netto annuo",
      /* Il rapporto è il risparmio netto sul costo: quanto resta in tasca per
         ogni franco speso. La didascalia lo dice, perché "ROI" da solo si
         presta a tre letture diverse. */
      roiValue: "{ratio}:1",
      roiCaption: "di risparmio netto per ogni franco investito",

      assumptions:
        "Scenario conservativo: riduzione del {absence} su assenteismo e presenteismo, del {burnout} su burnout e turnover.",
      sources: "Fonti dei valori di partenza: SECO, Job Stress Index.",
      planNote: "Calcolo sul piano {plan}.",
    },

    plans: {
      title: "Un abbonamento mensile per dipendente",
      subtitle:
        "Tre livelli di copertura. Il calcolatore qui sopra usa il piano Plus.",
      recommended: "consigliato",
      priceUnit: "per dipendente al mese",
      featureSessions: "{count} sessioni di psicologo all'anno",
      featureExtra: "Sessione aggiuntiva a {price}",
      /* L'Executive risponde entro un'ora: senza le due forme diventerebbe
         "entro 1 ore" nella card più cara del listino. */
      featureDoctor: {
        one: "Medico virtuale, risposta entro {hours} ora",
        other: "Medico virtuale, risposta entro {hours} ore",
      },
      /* Variante per i piani con un tetto di consulti: oggi solo l'Essenziale
         (3 all'anno). La forma si sceglie sulle ore, come sopra; i consulti
         restano un segnaposto semplice perché il §7 ne dà tre — se un piano
         dovesse mai includerne uno solo, qui servirebbe la seconda coppia. */
      featureDoctorCapped: {
        one: "Medico virtuale, {count} consulti all'anno, risposta entro {hours} ora",
        other:
          "Medico virtuale, {count} consulti all'anno, risposta entro {hours} ore",
      },
    },

    footer: {
      tagline: "Salute aziendale per le imprese svizzere.",
      demoNote: "Demo per investitori: i dati mostrati sono dimostrativi.",
      /* Le due schermate sono presentate come percorsi della demo, non come
         funzioni del prodotto: chi riceve il link naviga da solo, e un link
         all'app dipendente su una landing pubblica solleverebbe altrimenti la
         domanda sbagliata. I due punti stanno nella stringa perché la
         punteggiatura cambia con la lingua (il francese li fa precedere da
         uno spazio). */
      demoPathsLabel: "Percorsi demo:",
      demoPathHr: "Dashboard HR",
      demoPathApp: "App dipendente",
      demoPathPro: "Portale professionista",
    },
  },

  hr: {
    privacyNote:
      "Dati aggregati e anonimi · soglia minima {threshold} risposte per reparto",
    /* Il tooltip non ripete più la soglia né il numero di risposte: da quando
       ogni riga li mostra, dirlo di nuovo al passaggio del mouse era la stessa
       informazione due volte. Resta il perché, che a schermo non c'è. */
    suppressedTooltip:
      "Sotto la soglia il dato non viene calcolato, per non renderlo riconducibile a singole persone.",
    suppressedShort: "Sotto soglia",
    stressByDepartment: "Stress per reparto",
    /* Organico e risposte insieme su ogni riga, anche quelle pubblicabili:
       è l'unico modo di vedere perché la Direzione è sotto soglia e HR +
       Legale no, visto che hanno lo stesso numero di dipendenti. Senza, due
       righe identiche danno esiti diversi e sembra un errore. */
    departmentMeta: "{employees} dipendenti · {respondents} risposte",

    companySubtitle: "{name} · {count} dipendenti",
    quarterLabel: "{quarter}° trimestre {year}",
    /* Il trimestre in corso è parziale: senza dirlo, un risparmio più alto di
       quello dei trimestri chiusi sembra un errore di calcolo. Detto, è un
       dato più forte. */
    quarterLabelCurrent: "{quarter}° trimestre {year} · in corso",
    quarterInProgress: "in corso",

    kpiSavings: "Risparmio del trimestre",
    kpiAdoption: "Adozione",
    kpiStress: "Stress aziendale",
    kpiSessions: "Sessioni usate",
    savingsHint: "{days} giorni di assenza evitati",
    adoptionHint: "{enrolled} iscritti · {active} attivi nel mese",
    sessionsHint: "{used} di {total} sessioni annue",
    /* La finestra di confronto sta nell'etichetta: il dato deve reggere se
       qualcuno chiede su quale periodo è calcolato. Il denominatore conta i
       soli reparti pubblicabili: la Direzione è esclusa dalla media
       aziendale, quindi non può comparire nel conteggio che la descrive. */
    stressHint:
      "In calo in {declining} reparti su {total} · ultimi {months} mesi",

    alertTitle: "Alert precoce — reparto {department}",
    alertDescription:
      "Lo stress del reparto è in fascia alta da {months} mesi consecutivi, da {since}.",
    alertAction: "Apri il dettaglio",

    quarterSelectorLabel: "Trimestre",

    trendTitle: "Trend stress · ultimi {months} mesi",
    trendNote:
      "Asse fisso 0–100: la scala non è tagliata sui dati, così la distanza fra le due linee è quella vera.",
    trendCompany: "Media azienda",
    trendSales: "Vendite",
    /* Il contrasto è la frase del pitch: deve leggersi dalla legenda, senza
       che nessuno debba raccontarlo. */
    trendCompanyLegend:
      "da {from} a {to} · sempre in fascia media, non segnala nulla",
    trendSalesLegend: "da {from} a {to} · in fascia alta dal mese {month}",
    trendAlertMarker: "alert",
    trendBandMedium: "medio",
    trendBandHigh: "alto",
    trendAxisScore: "Indice di stress",

    reportTitle: "Report trimestrale per il board pronto",
    reportDescription:
      "Stress per reparto, adozione e risparmio stimato del {quarter}, in un documento da allegare al consiglio.",
    reportAction: "Scarica il PDF",
    /* Sui trimestri chiusi la dashboard mostra solo dati: nessuna azione. */
    reportOnlyCurrent:
      "Il report si scarica dal trimestre in corso. Sui trimestri chiusi la dashboard mostra solo i dati.",
  },

  /*
   * Il documento che si scarica dalla dashboard (§8.A.6).
   *
   * Sta in `it.ts` come tutto il resto anche se nasce da una pagina interna:
   * la pagina serve a noi, il PDF lo legge un investitore, quindi il suo testo
   * è interfaccia di prodotto a tutti gli effetti. Registro della dashboard
   * (§4.4): terza persona, metrico, nessun incoraggiamento.
   *
   * Le intestazioni di colonna sono corte perché la tabella deve stare in
   * larghezza su A4 senza andare a capo; in tedesco cresceranno, ed è per
   * questo che nessuna colonna ha una larghezza fissa.
   */
  report: {
    documentTitle: "Report trimestrale — {company}",
    subtitle: "{quarter} · {city} · {employees} dipendenti · Piano {plan}",

    summaryTitle: "Sintesi del trimestre",
    savingsLabel: "Risparmio stimato",
    avoidedDaysLabel: "Giorni di assenza evitati",
    adoptionLabel: "Adozione",
    adoptionValue: "{enrolled} iscritti, {active} attivi nel mese",
    sessionsLabel: "Sessioni consumate",
    sessionsValue: "{used} di {total} annue",

    stressTitle: "Stress per reparto — ultimo mese",
    /* Organico e risposte anche qui, per la ragione del §6: due reparti con lo
       stesso organico e un esito diverso, senza le risposte accanto, sembrano
       un errore di stampa. */
    columnDepartment: "Reparto",
    columnHeadcount: "Organico",
    columnRespondents: "Risposte",
    columnLevel: "Fascia",
    columnScore: "Indice",
    suppressedReason: "sotto soglia di anonimato",

    trendTitle: "Trend stress — ultimi {months} mesi",

    alertTitle: "Alert precoce",
    alertBody:
      "Il reparto {department} è in fascia alta da {months} mesi consecutivi, da {since}.",
    /* La frase del pitch, per chi legge il documento senza averlo sentito. */
    alertContrast:
      "La media aziendale è rimasta piatta nello stesso periodo: senza il dettaglio per reparto la situazione non sarebbe emersa.",

    disclaimer:
      "Documento dimostrativo: i dati sono costruiti a scopo di presentazione.",
  },

  /*
   * Portale del professionista (§8.D). Registro strumento come la dashboard
   * HR: chi lo usa sta lavorando, non sta scoprendo il prodotto. Terza
   * persona, nessun incoraggiamento.
   */
  pro: {
    portalName: "Portale professionista",
    headerSubtitle: "{name} · {specialty}",

    tabCalendar: "Calendario",
    tabEarnings: "Compensi",

    calendarTitle: "Settimana del {date}",
    today: "oggi",
    dayEmpty: "nessuna sessione",
    sessionDuration: "{minutes} min",
    statusDelivered: "erogata",
    statusScheduled: "in programma",
    statusFree: "libero",
    /* Il calendario mostra orari e stato, non chi c'è dall'altra parte: i
       nomi dei pazienti non servono a questa demo e non si inventano. */
    calendarNote:
      "Gli slot ancora liberi sono quelli che il dipendente vede in fase di prenotazione.",

    earningsTitle: "Compensi di {month}",
    monthInProgress: "in corso",
    kpiSessions: "Sessioni erogate",
    kpiGross: "Compenso lordo",
    kpiHours: "Ore erogate",
    kpiFee: "Tariffa per sessione",
    hoursValue: "{hours} h",
    sessionsHint: "Sessioni da {minutes} minuti",
    grossHint: "{sessions} sessioni × {fee}",
    feeHint: "Per sessione erogata",

    /*
     * Il regime di lavoro accanto al totale. Senza, un compenso mensile
     * modesto sembra il massimo che la piattaforma può dare a un
     * professionista: è invece quello di chi ci lavora a tempo parziale.
     *
     * La seconda riga dà il riferimento a pieno regime del §7, ma con la voce
     * del prodotto: questa è la schermata che un professionista vedrebbe
     * davvero, e "il business plan indica" romperebbe la finzione proprio
     * mentre si mostra il potenziale.
     */
    regimeNote: "{sessions} sessioni a settimana · disponibilità parziale",
    fullCapacityNote:
      "Un'agenda piena, con {sessions} sessioni a settimana, vale da {min} a {max} al mese.",

    tableWeek: "Settimana",
    tableSessions: "Sessioni",
    tableHours: "Ore",
    tableGross: "Compenso",
    tableTotal: "Totale",
    /* Intervallo di date: sta qui e non in Intl perché in it-CH
       `formatRange` cambia separatore rispetto alle date singole (§ nota in
       format.ts). Un'altra lingua lo riscrive a modo suo. */
    weekRange: "{from} – {to}",

    deliveredOnlyNote:
      "Il riepilogo conta solo le sessioni già erogate. Quelle in programma entrano nel compenso del mese in cui si tengono.",
  },

  app: {
    greeting: "Buongiorno {name}",
    healthProfileTitle: "Profilo salute",
    healthProfileScore: "{score} su 100",
    healthProfileWeakArea: "Area che merita attenzione: {area}",
    sessionsUsed: "Hai usato {used} delle tue {total} sessioni",
    sessionsRemaining: "Ti restano {remaining} sessioni quest'anno",
    extraSessionPrice: "Sessione aggiuntiva: {price}",
    nextAppointment: "Prossimo appuntamento",
    noAppointment: "Non hai appuntamenti in programma",
    appointmentWhen: "{weekday} alle {time}",
    professionalRating: "Valutazione {rating} su 5",
    professionalLanguages: "Parla {languages}",
    sameProfessional: "Stesso professionista, ogni volta",

    quickBook: "Prenota",
    quickDoctor: "Medico virtuale",
    joinSession: "Entra",
    backToHome: "Torna alla home",
    back: "Indietro",
  },

  onboarding: {
    welcomeTitle: "Benvenuta in KORA",
    welcomeBody:
      "Dieci domande, meno di un minuto. Servono a costruire il tuo profilo salute: nessuno in azienda vedrà le tue risposte.",
    welcomeAction: "Inizia",
    /* Scorciatoia per chi presenta col tempo contato: volutamente in secondo
       piano, non un pulsante. */
    skipToResult: "Salta all'esito",
    progress: "Domanda {current} di {total}",
    generatingTitle: "Sto costruendo il tuo profilo",
    generatingStepAnswers: "Risposte raccolte",
    generatingStepAreas: "Aree di benessere confrontate",
    generatingStepProfile: "Profilo salute pronto",
    resultTitle: "Ecco il tuo profilo salute",
    resultAction: "Vai alla home",
  },

  /*
   * Il questionario. Sta qui e non nei componenti perché è testo da leggere,
   * e domani va tradotto come tutto il resto. La scala è la stessa per tutte
   * le domande: si risponde con un tocco, e il tocco fa avanzare da solo.
   */
  assessment: {
    scale: ["mai", "raramente", "spesso", "sempre"],
    questions: [
      "Ti svegli riposata al mattino?",
      "Riesci a staccare dal lavoro la sera?",
      "Ti senti in grado di gestire il carico della giornata?",
      "Trovi il tempo per muoverti durante la settimana?",
      "Mangi con regolarità nei giorni di lavoro?",
      "Riesci a concentrarti su un compito senza interruzioni?",
      "Hai qualcuno con cui parlare quando la giornata è pesante?",
      "Il fine settimana ti basta per recuperare?",
      "Ti capita di dormire almeno sette ore per notte?",
      "Guardando al prossimo mese, ti senti in equilibrio?",
    ],
  },

  booking: {
    title: "Prenota una sessione",
    stepProfessional: "Scegli il professionista",
    stepSlot: "Scegli l'orario",
    noSlots: "Nessun orario libero per questo professionista",
    confirmTitle: "Confermi la prenotazione?",
    confirmDetail: "{professional} · {weekday} alle {time}",
    confirmDuration: "{minutes} minuti",
    confirmAction: "Conferma",
    doneTitle: "Prenotazione confermata",
    doneDetail: "Ti aspettiamo {weekday} alle {time}",
    doneCounter: "Ora hai usato {used} delle tue {total} sessioni",
    filterAll: "tutti",
  },

  /*
   * Attenzione al registro: titolo, sottotitolo, disclaimer e suggerimenti
   * sono la voce dell'app, quindi danno del tu (§4.4). I messaggi del medico
   * no: è una persona reale che parla, e dà del lei.
   */
  doctor: {
    title: "Medico virtuale",
    /* Il piano Plus promette il medico virtuale entro 4 ore (§7): l'ora
       secca è l'Executive. Un tempo più corto implicherebbe un presidio
       continuo che il modello a mandato non ha. */
    subtitle: {
      one: "Risposta entro {hours} ora · piano {plan}",
      other: "Risposta entro {hours} ore · piano {plan}",
    },
    disclaimer:
      "Questa conversazione non sostituisce una visita medica. Per un'urgenza medica chiama il 144. Se stai attraversando un momento difficile, il 143 di Telefono Amico risponde giorno e notte.",
    typing: "sta scrivendo",
    /* Tocca per rivelare tutto: in un pitch l'attesa realistica è tempo morto. */
    skipHint: "Tocca per mostrare tutta la conversazione",
    bookFromChat: "Vedi gli orari della Dr.ssa Meier",
    messages: [
      {
        from: "employee",
        text: "Buongiorno, da qualche settimana faccio fatica a dormire.",
      },
      {
        from: "doctor",
        text: "Buongiorno Laura, grazie per avermi scritto. Da quanto tempo le succede, più o meno?",
      },
      {
        from: "employee",
        text: "Circa un mese, da quando è cambiato il carico in ufficio.",
      },
      {
        from: "doctor",
        text: "Si sveglia durante la notte oppure fa fatica ad addormentarsi?",
      },
      {
        from: "employee",
        text: "Fatica ad addormentarmi, soprattutto la domenica.",
      },
      {
        from: "doctor",
        text: "È un segnale frequente quando il pensiero del lunedì resta acceso. Prima di parlare di farmaci, due cose aiutano quasi sempre: un orario di sveglia fisso e mezz'ora senza schermi prima di dormire.",
      },
      {
        from: "doctor",
        text: "Le propongo anche un colloquio con la Dr.ssa Meier, che segue proprio il sonno.",
      },
    ],
  },

  call: {
    connecting: "Connessione in corso",
    inCall: "Sessione in corso",
    muteOn: "Disattiva il microfono",
    muteOff: "Attiva il microfono",
    videoOn: "Disattiva la telecamera",
    videoOff: "Attiva la telecamera",
    end: "Chiudi la sessione",
    endedTitle: "Sessione conclusa",
    endedBody: "Durata {duration}",
  },

  /*
   * Etichette dei valori di dominio. I tipi sono in `data/types.ts`: se un
   * giorno si aggiunge un livello o una specialità, TypeScript segnala qui
   * la chiave mancante.
   */
  domain: {
    planName: {
      essenziale: "Essenziale",
      plus: "Plus",
      executive: "Executive",
    } as Record<PlanId, string>,

    stressLevel: {
      low: "basso",
      medium: "medio",
      high: "alto",
    } as Record<StressLevel, string>,

    healthSummary: {
      balanced: "in buon equilibrio",
      attention: "da tenere d'occhio",
      at_risk: "sotto pressione",
    } as Record<HealthProfile["summaryKey"], string>,

    healthArea: {
      sleep: "sonno",
      stress: "stress",
      activity: "movimento",
      nutrition: "alimentazione",
    } as Record<HealthArea, string>,

    specialty: {
      work_stress: "stress lavorativo",
      burnout_anxiety: "burnout e ansia",
      sleep: "sonno",
      coaching: "coaching",
    } as Record<ProfessionalSpecialty, string>,

    language: {
      it: "italiano",
      de: "tedesco",
      fr: "francese",
      en: "inglese",
    } as Record<ProfessionalLanguage, string>,

    languageShort: {
      it: "IT",
      de: "DE",
      fr: "FR",
      en: "EN",
    } as Record<ProfessionalLanguage, string>,

    appointmentKind: {
      psychologist: "psicologo",
      virtual_doctor: "medico virtuale",
      checkup: "check-up",
    } as Record<AppointmentKind, string>,
  },
};

/**
 * Forma del dizionario. Un file di lingua futuro si dichiara
 * `const de: Dictionary = { ... }` e il compilatore pretende le stesse chiavi.
 */
export type Dictionary = typeof dictionary;

export const it: Dictionary = dictionary;

/**
 * Sostituisce i segnaposto {nome} in una frase del dizionario.
 *
 * Un segnaposto senza valore resta visibile a schermo invece di sparire in
 * silenzio: è un errore che si deve notare durante una prova, non durante
 * la presentazione.
 */
export function t(
  template: string,
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
    const value = values[key];
    return value === undefined ? placeholder : String(value);
  });
}

/**
 * Sceglie la forma giusta fra singolare e plurale.
 *
 * La scelta la fa Intl e non un `count === 1` scritto a mano: quante forme ha
 * una lingua, e quali numeri cadono in quale forma, è una proprietà della
 * lingua. Il francese per esempio tratta lo zero come singolare, quindi la
 * regola cablata in italiano sbaglierebbe appena si aggiunge fr-CH.
 *
 * Le lingue della piattaforma (IT, DE, FR, EN) usano tutte le due forme
 * `one` e `other`: qualunque altra categoria ricade su `other`.
 */
export function plural(
  count: number,
  forms: { one: string; other: string },
  locale = "it-CH",
): string {
  return new Intl.PluralRules(locale).select(count) === "one"
    ? forms.one
    : forms.other;
}

/**
 * Elenco leggibile: ["italiano", "tedesco"] → "italiano e tedesco".
 * Usa Intl, perché la congiunzione e la punteggiatura cambiano con la lingua.
 */
export function formatList(items: string[], locale = "it-CH"): string {
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(items);
}
