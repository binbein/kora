import type { Dictionary } from "./index";

/*
 * Il dizionario francese (CLAUDE.md §4, blocco e di M5, tranche 2).
 *
 * SI DICHIARA `Dictionary`, ED È LÌ CHE STA LA GARANZIA: la forma è quella di
 * `it.ts`, quindi una chiave mancante o rinominata è un errore di typecheck e
 * non una stringa italiana che sbuca in francese. "Stesse chiavi" smette di
 * essere una promessa.
 *
 * L'annotazione arriva **con il commit che completa il file**, non prima: su un
 * dizionario parziale dichiarerebbe il falso e romperebbe il typecheck
 * sull'albero, perché `tsc` legge il filesystem e non git. È la stessa
 * sequenza della tranche tedesca.
 *
 * FRANCESE DI SVIZZERA. Le cifre non si scrivono mai in lettere — passano
 * tutte da `format.ts` — quindi la questione *septante/huitante*, che è ciò
 * che separa la Svizzera romanda dalla Francia, qui non si pone: se un giorno
 * un numero andasse scritto a parole, è una domanda per la revisione
 * madrelingua e non una scelta da prendere nel diff.
 *
 * IL REGISTRO SEGUE IL §7, e in francese diventa la distinzione tu/vous:
 *   - `employee.*` dà del **tu** — è il portale della persona, registro caldo;
 *   - tutto il resto dà del **vous** — HR, pubblica, professionista,
 *     back-office.
 *
 * LE TRE STRINGHE CHE ATTRAVERSANO IL CONFINE non prendono posizione, ed è la
 * regola ereditata dal tedesco (founder, 13.08.2026): `common.state.retry`,
 * `common.accessDenied.toPortal` e `.toHome`. Il francese le neutralizza con
 * **l'infinito e la forma nominale**, che sui pulsanti sono la sua convenzione
 * — `Réessayer`, `Retour à l'accueil` — e dove il possessivo era inevitabile
 * usa la **prima persona** (`mon`), che non sceglie fra tu e vous. Il tedesco
 * ci era arrivato con il nominale puro; l'italiano tiene l'imperativo, che è
 * neutro per prassi.
 *
 * TIPOGRAFIA: LO SPAZIO PRIMA DI `:` E DI `?` È QUELLO DELLA TASTIERA, ED È UN
 * PUNTO APERTO PER LA REVISIONE MADRELINGUA.
 *
 * Fino al 16.08.2026 questa testata dichiarava lo spazio unificatore U+00A0 —
 * `Focus : {area}`, `Comment te sens-tu aujourd'hui ?` — e **il file non lo
 * rispettava in nessun punto**, **compresi i due esempi che la testata portava
 * a modello**. Misurato, non dedotto: in tutto `fr.ts` gli U+00A0 erano **zero**.
 *
 * **Il conto, con il suo criterio** — si contano le occorrenze dentro i
 * *letterali di stringa* del dizionario, cioè ciò che va a schermo, non la prosa
 * dei commenti che li nomina: **35**, cioè 25 davanti ai due punti e 10 davanti
 * al punto interrogativo (16.08.2026). Il criterio è quello del `CLAUDE.md`
 * §5.6 applicato qui: un conteggio sul file intero si muove ogni volta che
 * qualcuno tocca un commento, e sarebbe il numero senza criterio che quella
 * sezione esiste per non produrre.
 *
 * **La regola non è stata applicata, la dichiarazione è stata tolta**, e la
 * scelta ha tre ragioni:
 *
 *   1. **quale carattere** non è deciso, ed è esattamente ciò che un revisore
 *      madrelingua decide: la forma stretta vuole l'espace fine U+202F davanti
 *      a `; : ! ?`, quella corrente ammette U+00A0 davanti ai due punti. Questa
 *      testata mandava già la seconda metà della domanda alla revisione;
 *   2. **sarebbe il quinto carattere invisibile di questo codice**, ed è la
 *      ragione per cui il `CLAUDE.md` §2.7 ha rifiutato U+202F nei numeri —
 *      lì per una resa che si vede, qui per una che non si vede;
 *   3. **il momento in cui servirebbe non arriva prima della revisione.** Il
 *      suo innesco è *"prima di qualunque presentazione non in italiano"*, e
 *      `docs/PITCH.md` dichiara che la lingua non si cambia in sala. Chi arriva
 *      prima non è un lettore francese: è chi apre questo file e legge una
 *      promessa che il file non mantiene.
 *
 * Resta vera la ragione per cui la voce esisteva: **se un giorno lo spazio
 * unificatore entra, va dichiarato qui**, perché è invisibile e un `grep`
 * scritto con lo spazio normale non trova la stringa — la stessa trappola dello
 * spazio di `formatCHF` (M1).
 *
 * I SEGNAPOSTO SONO QUELLI DELL'ITALIANO, alla lettera: `{n}`, `{max}`,
 * `{company}`. Rinominarne uno compila e rende `{nombre}` a schermo, quindi a
 * sorvegliarli c'è il guardrail di `placeholders.ts`, che li confronta chiave
 * per chiave con `it`.
 *
 * NON SI RIFORMULA IL SIGNIFICATO. Dove l'italiano è ambiguo la traduzione lo
 * segnala invece di sceglierne una lettura; i punti aperti sono elencati in
 * fondo a questa intestazione e nella sezione M5.e di `docs/PROGRESS.md`.
 *
 * LA REVISIONE MADRELINGUA RESTA DA FARE, ed è a verbale: questo file rende il
 * francese verificabile e presentabile, non ratificato. Prima di un pitch in
 * francese va riletto da chi la lingua ce l'ha.
 *
 * DA PORTARE A QUELLA REVISIONE, nominate qui perché non si perdano nel diff.
 * Non sono errori: sono scelte su cui **non siamo il giudice giusto**.
 *
 *   1. `cancellationReason.*`, `professional.patients.*` — le forme sono al
 *      **maschile generico**, come in italiano e **al contrario del tedesco**,
 *      che qui ha scelto il femminile. Dei pazienti si conoscono le sole
 *      iniziali e il genere non sta nel dominio: una forma marcata direbbe a
 *      schermo qualcosa che il dataset non dice. Se la revisione preferisse
 *      l'epicena, in francese costa una riformulazione per ogni riga.
 *   2. "dipendenti" è reso **collaborateurs** ovunque, che è il termine delle
 *      risorse umane in Svizzera romanda; `employés` è più letterale e meno
 *      idiomatico. È la parola più ripetuta del file, quindi cambiarla dopo
 *      costa in proporzione.
 *   3. `hr.quarterLabel` — `Trimestre 3 2026` invece dell'ordinale. Il francese
 *      dice `1er` e `3e`, quindi una stringa sola non li rende entrambi e il
 *      selettore mostra anche il primo trimestre (vedi il commento su `hr`). La
 *      revisione può preferire `T3 2026`; quello che non si può fare è
 *      l'ordinale con un suffisso solo.
 *   4. `admin.professionals.kpiSessions` — "sessioni di carriera" è reso `Total
 *      des séances`, e la distinzione dagli altri due conteggi si sposta nel
 *      sottotitolo. È lo stesso punto che il tedesco ha portato alla sua
 *      revisione con `Sitzungen gesamt`.
 *   5. Lo **spazio prima di `:` e di `?`** è quello della tastiera, in tutte e
 *      35 le occorrenze a schermo. La regola francese ne vuole uno unificatore, e
 *      **quale** è la domanda: la forma stretta dà l'espace fine U+202F davanti
 *      a `; : ! ?`, quella corrente ammette U+00A0 davanti ai due punti. Va
 *      deciso qui e applicato in un colpo solo, mai una stringa alla volta —
 *      la ragione per esteso è in testa a questo file.
 */
export const fr: Dictionary = {
  common: {
    appName: "Kora",
    none: "—",
    state: {
      /* Infinito: la stessa chiave è resa in entrambi i registri (vedi sopra). */
      retry: "Réessayer",
      error: {
        title: "Données indisponibles",
        body: "Réessayez dans un instant.",
      },
      boot: {
        title: "Kora n'a pas démarré",
        body: "Rechargez la page pour réessayer. Ce que vous avez fait jusqu'ici n'est pas conservé.",
      },
    },

    accessDenied: {
      title: "Section réservée",
      body: "Cette section appartient à un autre rôle.",
      /* Neutri: `RequireRole` sta sopra ogni layout e non ha un registro da cui
         ereditare. `mon` è la prima persona, quindi non sceglie fra tu e vous. */
      toPortal: "Accéder à mon espace",
      toHome: "Retour à l'accueil",
    },
  },

  notFound: {
    title: "Page introuvable",
    body: "L'adresse {path} ne correspond à aucune page.",
    home: "Retour à l'accueil",
  },

  plan: {
    essenziale: "Essenziale",
    plus: "Plus",
    executive: "Executive",
  },

  /* "Psychologue" è epiceno in francese, quindi le due chiavi rendono la stessa
     stringa: non è una svista, è la lingua che non distingue dove l'italiano e
     il tedesco distinguono. FSP è anche la sigla francese — Fédération Suisse
     des Psychologues — quindi la qualifica resta leggibile senza tradurla. */
  qualification: {
    psychologist_f: "Psychologue FSP",
    psychologist_m: "Psychologue FSP",
    coach_m: "Coach",
  },

  specialty: {
    work_stress: "Stress au travail",
    burnout_anxiety: "Burnout et anxiété",
    sleep: "Sommeil",
    coaching: "Coaching",
  },

  language: {
    it: "Italiano",
    de: "Deutsch",
    fr: "Français",
    en: "English",
  },

  healthArea: {
    sleep: "Sommeil",
    stress: "Stress",
    activity: "Activité physique",
    nutrition: "Alimentation",
    mental: "Santé mentale",
  },

  healthSummary: {
    balanced: "En bon équilibre",
    attention: "À surveiller",
    at_risk: "À risque",
  },

  sessionType: {
    first_visit: "Premier entretien",
    session: "Séance",
    follow_up: "Suivi",
  },

  /* Maschile generico, come l'italiano e **a differenza del tedesco**, che qui
     ha scelto le forme femminili. Dei pazienti si conoscono le sole iniziali e
     il loro genere non sta nel dominio, quindi una scelta marcata direbbe a
     schermo qualcosa che il dataset non dice. È il primo dei punti da portare
     alla revisione madrelingua. */
  cancellationReason: {
    by_patient: "Annulée par le patient",
    by_professional: "Annulée par le professionnel",
  },

  /*
   * Percorso dipendente (§10.B). **È l'unica area che dà del tu.**
   *
   * IL MEDICO VIRTUALE DÀ DEL VOUS ANCHE QUI DENTRO, ed è il §7 applicato alla
   * lettera: un professionista parla come parlerebbe lui, non come parla il
   * prodotto. In `doctor` convivono quindi due registri — il prodotto che si
   * rivolge a Laura (titolo, sottotitolo, campo, disclaimer) dà del tu, e i
   * messaggi del medico (`greeting`, `reply.*.text`, `fallback`) danno del
   * vous, dall'inizio alla fine della conversazione.
   */
  employee: {
    nav: {
      home: "Accueil",
      psychologists: "Psychologues",
      doctor: "Médecin",
      checkup: "Check-up",
      aiPlan: "Plan IA",
      profile: "Profil",
    },

    identity: "{company} · {plan}",

    privacy:
      "Ton entreprise ne voit que des données agrégées et anonymes. Ta santé reste la tienne.",

    state: {
      error: {
        title: "Cette partie ne s'est pas chargée",
        body: "Réessaie dans un instant.",
      },
    },

    service: {
      psychologist: "Psychologue",
      coach: "Coach",
    },

    home: {
      /* "Bonjour" copre tutta la giornata come "Buongiorno", quindi il saluto
         statico non ha il problema che il tedesco ha avuto con "Guten Morgen". */
      greeting: "Bonjour {name}",
      subtitle: "Ta santé, en un seul endroit.",

      healthTitle: "Ton état de santé",
      scoreOutOf: "/100",
      weakestArea: {
        sleep: "Le sommeil mérite de l'attention",
        stress: "Le stress mérite de l'attention",
        activity: "L'activité physique mérite de l'attention",
        nutrition: "L'alimentation mérite de l'attention",
        mental: "La santé mentale mérite de l'attention",
      },
      weakestAreaHint: "C'est le point de départ de ton plan de prévention.",

      appointmentsTitle: "Tes prochains rendez-vous",
      appointmentsEmpty: "Tu n'as aucun rendez-vous prévu.",
      appointmentWhen: "{weekday} {date}, à {time}",

      /* I segnaposto ci sono tutti e cambiano posto: in francese "sur {total}"
         segue il sostantivo, e il guardrail confronta gli insiemi proprio per
         questo (§2.7). */
      sessions: "{used} séances utilisées sur {total}",
      sessionsWithScheduled:
        "{used} séances utilisées sur {total} · {scheduled} prévues",
      book: "Réserver une séance",

      quickAction: {
        doctor: "Médecin virtuel",
        checkup: "Check-up annuel",
        aiPlan: "Plan de prévention",
        profile: "Profil santé",
      },
      checkupDone: "Fait",

      planTitle: "De ton plan de prévention",
      planCta: "Voir le plan",
    },

    rapidCheck: {
      question: "Comment te sens-tu aujourd'hui ?",
      hint: "Une question, un geste. Ta réponse n'entre que dans la moyenne de ton département.",
      option: {
        1: "Très bien",
        2: "Bien",
        3: "Comme ci comme ça",
        4: "Pas bien",
        5: "Très mal",
      },
      error: {
        title: "Nous n'avons pas pu l'enregistrer",
        body: "Appuie à nouveau pour réessayer.",
      },
      done: "Merci, c'est enregistré.",
      doneHint: "On te redemandera comment tu vas dans quelques jours.",
    },

    psychologists: {
      title: "Parle à quelqu'un",
      subtitle:
        "Psychologues et coachs du réseau Kora. Choisis qui t'accompagne et réserve quand cela t'arrange.",
      filter: {
        psychologist: "Psychologues",
        coach: "Coachs",
      },
      empty: "Aucun professionnel disponible pour ce service.",
      totalSessions: "{n} séances effectuées",
      book: "Réserver",

      dialog: {
        title: "Réserver avec {professional}",
        chooseDay: "Choisis un jour",
        chooseTime: "Choisis un horaire",
        noSlots:
          "Aucun horaire n'est libre pour le moment. Réessaie dans quelques jours.",
        summary: "Récapitulatif",
        summaryWhen: "{weekday} {date}, à {time}",
        dayOption: "{weekday} {date}",
        included: "Séance comprise dans ton plan",
        overCapWithPrice:
          "Les séances comprises sont épuisées : celle-ci coûte {price}",
        overCapWithoutPrice:
          "Tu as épuisé les séances de ce service comprises dans ton plan pour cette année. Pour en obtenir d'autres, parles-en à ton interlocuteur RH.",
        confirm: "Confirmer la réservation",
        error: {
          title: "La réservation n'a pas abouti",
          body: "Le créneau est encore libre : réessaie.",
        },
        confirmedTitle: "Réservation confirmée",
        confirmedWith: "avec {professional}",
        confirmedNote:
          "Tu la retrouves sur ton accueil. Le lien pour la vidéo t'arrive par e-mail.",
        close: "Fermer",
      },
    },

    doctor: {
      title: "Médecin virtuel",
      subtitle: "Décris tes symptômes : un médecin te répond.",
      sla: "Réponse sous {hours} heures",
      online: "En ligne",
      placeholder: "Décris tes symptômes",
      send: "Envoyer",
      typing: "Le médecin écrit",

      /*
       * Le parole chiave sono francesi, ed è il motivo per cui stanno nel
       * dizionario: il confronto è sul testo che scrive chi legge, e nessuno
       * scriverebbe "schiena" in francese. Sono minuscole perché `replyTo`
       * confronta su `toLowerCase()`.
       *
       * `tête` porta l'accento, quindi chi scrive "tete" non aggancia: è lo
       * stesso limite di `rücken` in tedesco, e la parola giusta è quella.
       *
       * DA QUI IN GIÙ PARLA IL MEDICO, QUINDI SI DÀ DEL VOUS (§7).
       */
      greeting:
        "Bonjour. Je suis le médecin de garde du service Kora. Dites-moi : quel trouble vous amène aujourd'hui ?",
      reply: {
        back: {
          keyword: "dos",
          text: "Je suis désolé pour cette douleur. Je vous pose quelques questions : la douleur descend-elle le long de la jambe ? Avez-vous de la fièvre ou des fourmillements ?",
        },
        head: {
          keyword: "tête",
          text: "Le mal de tête peut avoir plusieurs causes. Est-il localisé ou diffus ? Prenez-vous des médicaments en ce moment ?",
        },
        stress: {
          keyword: "stress",
          text: "Le stress peut se manifester de bien des façons. Je vous conseille de réserver une séance avec un psychologue depuis la section dédiée. En attendant, je peux vous aider sur les symptômes physiques.",
        },
        sleep: {
          keyword: "sommeil",
          text: "Les troubles du sommeil sont très fréquents. Depuis combien de temps avez-vous des difficultés ? Vous réveillez-vous la nuit ou avez-vous du mal à vous endormir ?",
        },
      },
      fallback:
        "Je comprends. Pouvez-vous mieux décrire le trouble ? Depuis combien de temps le ressentez-vous ?",

      disclaimer:
        "Cette conversation est une simulation de démonstration. Les réponses ne sont pas un avis médical et ne remplacent pas une consultation. En cas d'urgence, appelle le 144.",
      privacy:
        "Les conversations sont privées et protégées. Ton entreprise n'accède jamais à ces informations.",
    },

    checkup: {
      title: "Check-up annuel",
      subtitle: "Le check-up physique compris dans ton plan.",

      openReport: "Ouvrir ton dernier rapport",
      lastTitle: "Ton dernier rapport",
      lastDone: "Fait le {date} · {provider}",
      lastOpen: "Appuie pour le voir",

      nextFrom: "Tu peux en réserver un nouveau dès le {date}.",

      networkTitle: "Les centres conventionnés",
      networkHint:
        "Ce sont les structures dans lesquelles Kora réserve ton check-up, avec les coûts déjà couverts par le plan.",
      networkEmpty: "Aucune structure disponible pour le moment.",
      distance: "{km} km",
      providerAddress: "{address}, {city}",
      bookFrom: "Dès le {date}",
      notInPlan: "Non inclus dans le forfait",

      report: {
        title: "Rapport du {date}",
        empty: "Aucun rapport à afficher pour ce bilan de santé.",
        measurement: {
          blood_pressure: "Tension",
          cholesterol: "Cholestérol",
          ecg: "ECG",
          bmi: "IMC",
          stress_risk: "Risque lié au stress",
        },
        status: {
          normal: "Dans la norme",
          attention: "À surveiller",
        },
        explanationTitle: "Ce que cela veut dire",
        explanation: {
          laura:
            "Le cholestérol est légèrement au-dessus de la valeur conseillée et le risque lié au stress est modéré. Ce n'est pas une urgence : suis le plan de prévention et refais le contrôle au prochain check-up.",
        },
        disclaimer:
          "Rapport de démonstration avec des valeurs d'exemple. Ce n'est pas un document clinique et il ne remplace pas le rapport du centre qui effectue le check-up.",
      },
    },

    profile: {
      title: "Ton profil",
      privacy:
        "Ta santé reste la tienne. Aucune donnée individuelle n'est partagée avec ton entreprise.",

      company: "Entreprise",
      plan: "Plan",
      memberSince: "Inscrite depuis",

      healthTitle: "Résumé santé",
      score: "Score santé",
      scoreValue: "{score}/100",
      summary: "Synthèse",
      weakest: "Point à suivre",

      usageTitle: "Utilisation des services",
      usage: {
        psychologist: "Séances psychologue",
        coach: "Séances coach",
        checkup: "Check-up annuel",
        doctor: "Consultations médecin virtuel",
      },
      outOf: "{used} sur {total}",
      checkupDone: "Fait le {date}",
      checkupToBook: "À réserver",
      consults: "{n} cette année",

      dataNote:
        "Tes données de santé sont visibles par les professionnels que tu choisis.",
    },

    aiPlan: {
      title: "Plan de prévention",
      subtitle: "Construit sur ton profil de santé.",
      generated: "Mis à jour en {month}",
      nextUpdate: "La prochaine mise à jour est en {month}.",

      goal: {
        sleep_hours: "Passer de 6 à 7 heures de sommeil par nuit",
        stress_reduction: "Réduire le stress perçu de 15 % en 8 semaines",
        activity_weekly: "Atteindre 2 séances d'activité physique par semaine",
        nutrition_cholesterol:
          "Ramener le cholestérol dans la norme avec une alimentation équilibrée",
        mental_coaching: "Faire 2 séances avec le coach le mois prochain",
      },

      tip: {
        sleep_screens: "Évite les écrans dans les 30 minutes avant de dormir",
        sleep_schedule: "Couche-toi et lève-toi toujours à la même heure",
        sleep_caffeine: "Pas de caféine après 14 h",
        stress_breathing: "Consacre 10 minutes par jour à la respiration",
        stress_breaks: "Prévois une pause toutes les 90 minutes",
        stress_coach:
          "Réserve une séance avec le coach pour les techniques de gestion",
        activity_walk: "Commence par des marches de 30 minutes",
        activity_stairs: "Prends les escaliers plutôt que l'ascenseur",
        activity_yoga: "Essaie un cours de yoga en ligne",
        nutrition_fibre: "Augmente les fibres et les légumes à chaque repas",
        nutrition_fats: "Réduis les graisses saturées",
        nutrition_recheck:
          "Refais le contrôle du cholestérol au prochain check-up",
        mental_continue: "Poursuis le suivi avec la psychologue",
        mental_techniques:
          "Utilise en dehors des séances les techniques que tu apprends",
        mental_journal: "Note comment tu te sens les jours difficiles",
      },
    },
  },

  /*
   * Portale professionista (§10.D). Registro strumento: **vous**, dalla prima
   * riga all'ultima.
   *
   * È il portale della Dr.ssa Meier, ma il titolo resta un campo del dataset
   * (`people.ts`) e non una stringa di qui: in francese non si traduce, come in
   * tedesco. Dei pazienti si conoscono le sole iniziali, quindi le forme sono
   * al maschile generico come in italiano — la scelta è dichiarata in
   * `cancellationReason` e va alla revisione madrelingua.
   */
  professional: {
    portalName: "Portail professionnels",

    nav: {
      calendar: "Calendrier",
      sessions: "Séances",
      patients: "Patients",
      payments: "Paiements",
      profile: "Profil",
    },

    feePerSession: "{fee} par séance",

    calendar: {
      title: "Calendrier",
      week: "Semaine du {from} au {to}",
      sessionsThisWeek: "Séances cette semaine",
      nextSession: "Prochaine séance",
      sessionsThisMonth: "À l'agenda ce mois-ci",
      activePatients: "Patients actifs",
      noNextSession: "Aucune",
      nextSessionValue: "{weekday} {time}",
      legendBooked: "Réservée",
      legendFree: "Libre",
      legendPast: "Passée",
      today: "aujourd'hui",
      empty: "Aucune séance cette semaine.",
    },

    sessions: {
      title: "Séances",
      upcoming: "Prévues ({n})",
      completed: "Effectuées ({n})",
      cancelled: "Annulées ({n})",
      startUnavailable: "Visioconférence inactive dans cette démo",
      addNote: "Ajouter une note",
      editNote: "Note",
      emptyUpcoming: "Aucune séance prévue.",
      emptyCompleted: "Aucune séance effectuée.",
      emptyCancelled: "Aucune séance annulée.",
      note: {
        title: "Note privée — {patient}",
        notes: "Notes de la séance",
        notesPlaceholder: "Notes cliniques privées",
        nextGoal: "Prochain objectif",
        nextGoalPlaceholder: "Objectif pour la séance suivante",
        followUp: "Suivi suggéré",
        followUpPlaceholder: "Séance suivante conseillée dans",
        save: "Enregistrer la note",
        saving: "Enregistrement",
        error: {
          title: "Note non enregistrée",
          body: "Le texte est encore là : réessayez.",
        },
                loadError: {
          title: "Note indisponible",
          body: "La note de cette séance n'a pas pu être chargée. L'enregistrer maintenant l'écraserait.",
        },
        saved: "Note enregistrée",
        privacy:
          "Les notes sont privées et ne sont pas partagées avec l'entreprise du patient.",
      },
    },

    patients: {
      title: "Patients",
      count: "{n} patients actifs",
      privacy:
        "Les noms sont abrégés pour des raisons de confidentialité. Les notes cliniques ne sont visibles que par vous.",
      name: "Patient {initials}",
      delivered: "{n} séances effectuées",
      next: "Prochaine : {date}",
      noNext: "Aucune séance prévue",
      new: "Nouveau",
      withinCap: "{used} sur {total} comprises",
      overCap: "{total} comprises + {extra} à {price}",
      capReached: "Séances comprises épuisées",
    },

    payments: {
      title: "Paiements",
      sessionsThisMonth: "Séances effectuées",
      feePerSession: "Tarif par séance",
      monthTotal: "Total du mois",
      yearTotal: "Total de l'année",
      monthInProgress: "{month} · en cours",
      model:
        "Paiement par séance effectuée. Kora émet la facture et paie avant le 5 du mois suivant.",
      capacityTitle: "Votre régime",
      capacity:
        "Vous tenez {sessions} séances par semaine. À plein régime, ce sont {full} par semaine, qui valent {min}–{max} par mois : la collaboration démarre avec une disponibilité minimale de {minHours} heures par semaine et croît avec l'agenda.",
      weeks: "Semaines du mois",
      weeksEmpty: "Aucune séance effectuée ce mois-ci.",
      payoutsEmpty: "Aucun paiement pour le moment.",
      weekRange: "du {from} au {to}",
      weekDetail: "{sessions} séances · {minutes} min",
      paid: "Payé",
      pending: "En attente",
      paidOn: "le {date}",
      sessionsTimesFee: "{sessions} séances × {fee}",
      empty: "Aucune rémunération à ce jour.",
    },

    profile: {
      title: "Profil professionnel",
      empty: "Aucun profil à afficher.",
      languages: "Langues",
      specialty: "Spécialisation",
      collaboration: "Collaboration",
      fee: "Tarif par séance",
      documents: "Documents",
      verified: "Vérifiés",
      documentsPending: "En cours de vérification",
      mandate: "Contrat de mandat",
      signed: "Signé",
      mandatePending: "À signer",
      totalSessions: "{n} séances effectuées",
      /* "(Auftrag)" resta: l'italiano nomina apposta l'istituto del CO, e in
         francese il mandato è lo stesso articolo di legge visto dall'altra
         lingua nazionale. */
      mandateNote:
        "Collaboration sous contrat de mandat (Auftrag). Aucun lien de subordination : Kora amène les patients et gère les réservations, la vidéo et les paiements.",
    },
  },

  /*
   * Portale HR (§10.C). Registro strumento: **vous**, e la schermata su cui il
   * pitch si regge.
   *
   * DUE SCELTE DI QUESTO NAMESPACE, ENTRAMBE DA PORTARE ALLA REVISIONE:
   *
   *   - "dipendenti" è reso **collaborateurs**, che è il termine delle risorse
   *     umane in Svizzera romanda; `employés` sarebbe più letterale e meno
   *     idiomatico. Vale in tutte le aree, non solo qui.
   *   - "reparto" è reso **département**, e il nome del reparto **non si
   *     traduce**: `Vendite` è un campo del dataset (`mock/company.ts`), come
   *     i titoli professionali. La raccomandazione del report lo nomina, quindi
   *     dice "département Vendite" — la stessa cosa che il banner dell'alert
   *     mostra due schermate più in là.
   *
   * IL TRIMESTRE NON PORTA L'ORDINALE, e non è una preferenza. L'italiano fa
   * "3° trimestre" e il tedesco "3. Quartal" con lo stesso suffisso per tutti e
   * quattro i valori; il francese no — si dice `1er trimestre` ma `3e
   * trimestre`, e una stringa sola non può renderli entrambi. Il selettore
   * mostra anche il primo trimestre 2026, quindi "1e trimestre" sarebbe uscito
   * a schermo. `Trimestre {quarter} {year}` è corretto per tutti e quattro, e
   * la sigla dell'asse diventa `T{quarter}`, che è come si abbrevia in
   * francese.
   */
  hr: {
    portalName: "Portail RH",
    navDashboard: "Tableau de bord",
    navEmployees: "Collaborateurs",
    navReport: "Rapport",
    navBilling: "Facturation",
    navPrivacy: "Confidentialité",
    navCompanyMeta: "{count} collaborateurs · Plan {plan}",

    dashboardTitle: "Tableau de bord RH",
    companySubtitle: "{name} · {count} collaborateurs · Plan {plan}",

    quarterSelectorLabel: "Trimestre",
    quarterLabel: "Trimestre {quarter} {year}",
    quarterLabelInProgress: "Trimestre {quarter} {year} · en cours",
    quarterShort: "T{quarter}",

    privacyNote:
      "Données agrégées et anonymes · seuil minimum de {threshold} collaborateurs mesurés par département",

    kpiSavings: "Économies du trimestre",
    kpiSavingsHint: "{days} jours d'absence évités",
    kpiAdoption: "Adoption",
    kpiAdoptionHint: "{enrolled} inscrits sur {total}",
    kpiActive: "Collaborateurs actifs",
    kpiActiveHint: "au moins un service dans le trimestre",
    kpiStress: "Stress moyen",
    kpiStressValue: "{points} points",
    kpiStressHint: "vs trimestre précédent",
    kpiStressEmpty: "aucun trimestre précédent dans la fenêtre",

    quarterEmpty:
      "Aucune donnée pour le trimestre sélectionné. Choisissez-en un autre dans la liste ci-dessus.",
    kpiSessions: "Séances utilisées",
    kpiSessionsHint: "{used} sur {total} séances annuelles",
    kpiCheckup: "Check-up réalisés",
    kpiCheckupHint: "{done} sur {enrolled} inscrits",

    alertTitle: "Alerte précoce — département {department} · dernier relevé",
    alertDescription:
      "Le stress du département est en zone haute depuis {months} mois consécutifs, depuis {since}.",

    usageTitle: "Utilisation des services · {months} derniers mois",
    distributionTitle: "Répartition des services",
    distributionSubtitle:
      "cumulée depuis le début de la fenêtre jusqu'à {quarter}",
    distributionEntry: "{service} : {count}",

    stressByDepartment: "Stress par département · dernier mois",
    departmentMeta: "{employees} collaborateurs · {measured} mesurés",
    departmentScore: "{percent} · {level}",
    suppressed: "Sous le seuil",
    suppressedTooltip:
      "Sous le seuil, la donnée n'est pas calculée, pour qu'elle ne puisse pas être rattachée à des personnes.",

    trendTitle: "Tendance du stress · {months} derniers mois",
    trendCompany: "Moyenne entreprise",
    trendAlertMarker: "alerte",
    trendCompanyLegend: "de {from} à {to} · toujours en zone moyenne",
    trendDepartmentLegend: "de {from} à {to} · en zone haute depuis le mois {month}",

    roiTitle: "Économies par trimestre",

    stressLevel: {
      low: "Bas",
      medium: "Moyen",
      high: "Élevé",
    },

    service: {
      psychologist: "Psychologue",
      virtual_doctor: "Médecin virtuel",
      coach: "Coach",
      checkup: "Check-up",
    },

    employees: {
      title: "Collaborateurs",
      subtitle: "{enrolled} inscrits sur {total} · données anonymes uniquement",
      sampleNote: "Le tableau montre un extrait de {n} collaborateurs.",
      empty: "Aucun collaborateur à afficher.",
      privacyNote:
        "Les noms sont abrégés. Kora ne montre jamais de données de santé individuelles à l'entreprise.",
      columnEmployee: "Collaborateur",
      columnDepartment: "Département",
      columnStatus: "Statut",
      columnCheckup: "Check-up",
      enrolled: "Actif",
      notEnrolled: "En attente",
      checkup: {
        completed: "Réalisé",
        booked: "Réservé",
        available: "Disponible",
      },
    },

    billing: {
      title: "Facturation",
      planTitle: "Plan actif",
      employees: "Collaborateurs",
      monthlyCost: "Coût mensuel",
      annualContract: "Contrat annuel",
      renewal: "Échéance",
      invoicesTitle: "Factures récentes",
      invoicesEmpty: "Aucune facture émise à ce jour.",
      invoiceDetail: "{count} collaborateurs × {price}",
      invoicePaid: "Payée",
      invoicePending: "En attente",
      simulatorTitle: "Simulateur de coûts",
      simulatorEmployees: "Collaborateurs",
      simulatorPlan: "Plan",
      simulatorBilling: "Fréquence",
      billingMonthly: "Mensuelle",
      billingAnnual: "Annuelle",
      totalMonthly: "Total mensuel",
      totalAnnual: "Total annuel",
      planOption: "{name} ({price})",
    },

    report: {
      title: "Rapport santé d'entreprise",
      subtitle: "{quarter} · {company}",
      download: "Télécharger le PDF",
      downloadError: {
        title: "Le PDF n'a pas été créé",
        body: "Réessayez le téléchargement.",
      },
      metricsTitle: "Indicateurs clés",
      adoption: "Taux d'activation",
      usage: "Séances sur le volume annuel",
      checkup: "Check-up réalisés",
      stress: "Stress moyen",
      stressValue: "{points} points",
      savings: "Économies estimées",
      avoidedDays: "Jours d'absence évités",
      daysValue: "{days} jours",
      recommendationsTitle: "Recommandations",
      recommendation: {
        salesWorkshop:
          "Programmer une intervention sur le département Vendite, en zone haute depuis trois mois.",
        checkupPush:
          "Rappeler le check-up annuel aux personnes qui ont activé leur compte et ne l'ont pas encore réservé.",
        coachAwareness:
          "Faire connaître le coach : c'est la prestation du plan la moins utilisée.",
        partnerExtension:
          "Évaluer l'extension aux proches, en option sur le plan Plus.",
      },

      pdf: {
        documentTitle: "Rapport santé d'entreprise",
        documentSubtitle:
          "{company} · {employees} collaborateurs · Plan {plan}",
        period: "Période · {quarter}",
        generatedOn: "Généré le {date}",
        active: "Collaborateurs actifs",
        sessions: "Séances utilisées",
        sessionsValue: "{used} sur {total}",
        privacyNote:
          "Données agrégées et anonymes. Kora ne communique à l'entreprise ni données de santé individuelles ni réservations rattachables à des personnes.",
      },
    },

    privacy: {
      title: "Confidentialité et sécurité",
      subtitle: "La confidentialité est au cœur de Kora.",
      neverSeenTitle: "L'entreprise ne voit jamais :",
      neverSeen: {
        healthData: "Données de santé individuelles",
        names: "Qui a consulté un psychologue",
        notes: "Notes cliniques ou rapports",
        diagnoses: "Diagnostics ou traitements",
        bookings: "Réservations individuelles",
      },
      measurementTitle: "D'où viennent les données de stress",
      measurementBody:
        "La donnée de stress vient du check rapide : une question, un geste, auto-déclarée par le collaborateur. Elle ne se déduit jamais du comportement — ni des séances réservées, ni des ouvertures de l'application.",
      anonymousLinkTitle: "Même sans compte",
      anonymousLinkBody:
        "Le check rapide se répond dans l'application ou depuis un lien anonyme, qui ne demande pas d'avoir activé un compte. Mesurer uniquement les personnes inscrites reviendrait à mesurer uniquement celles déjà engagées, alors que la donnée sert surtout là où l'adoption n'est pas encore arrivée.",
      thresholdTitle: "Seuil d'anonymat",
      thresholdBody:
        "La donnée d'un département n'est publiée que si, sur cette période, au moins {threshold} collaborateurs mesurés ont répondu. Sous le seuil, le tableau de bord affiche un tiret et non un score.",
      principle: {
        noIndividual: {
          title: "Aucune donnée individuelle",
          body: "L'entreprise ne voit jamais les séances, rapports, diagnostics ou données de santé de collaborateurs identifiés.",
        },
        aggregated: {
          title: "Uniquement des données agrégées",
          body: "Le tableau de bord montre des statistiques anonymes, agrégées par département ou par entreprise.",
        },
        encryption: {
          title: "Chiffrement de bout en bout",
          body: "Les données de santé sont chiffrées en transit et au repos, avec le standard AES-256.",
        },
        hosting: {
          title: "Hébergement en Suisse",
          body: "Les données résident sur des serveurs en Suisse, conformes à la Loi fédérale sur la protection des données.",
        },
        compliance: {
          title: "Conformité RGPD et LPD",
          body: "Kora est conforme au RGPD européen et à la LPD suisse.",
        },
        consent: {
          title: "Consentement du collaborateur",
          body: "Chaque collaborateur confirme son consentement lors de l'activation et peut le révoquer à tout moment.",
        },
      },
    },
  },

  /*
   * L'area pubblica (§10.A). Registro strumento, **vous**: queste quattro
   * schermate parlano a un'azienda che valuta, non a un collaboratore che usa.
   *
   * RGPD È LA SIGLA FRANCESE DEL GDPR, e LPD è già francese — *Loi fédérale sur
   * la protection des données* — quindi la coppia resta la stessa dell'italiano
   * senza doverla spiegare.
   */
  public: {
    nav: {
      pricing: "Plans",
      roi: "Calculateur ROI",
      demo: "Démo",
      employees: "Collaborateurs",
      hr: "RH",
      professionals: "Professionnels",
      login: "Se connecter",
      bookDemo: "Réserver une démo",
      menu: "Ouvrir le menu",
      language: "Langue",
    },

    footer: {
      tagline: "Le système d'exploitation de la santé pour les entreprises suisses.",
      city: "Lugano, Suisse",

      platformTitle: "Plateforme",
      platformPricing: "Plans et tarifs",
      platformRoi: "Calculateur ROI",
      platformEmployee: "Portail collaborateurs",
      platformHr: "Portail RH",
      platformProfessional: "Pour les professionnels",

      companyTitle: "Entreprise",
      companyAbout: "À propos",
      companyContact: "Contact",
      companyCareers: "Carrières",
      companyBlog: "Blog",

      privacyTitle: "Confidentialité et sécurité",
      privacyBody:
        "Données de santé protégées. Conformité RGPD et LPD. Hébergement en Suisse.",

      legalPrivacy: "Politique de confidentialité",
      legalTerms: "Conditions de service",
      legalCookies: "Politique de cookies",

      copyright: "© {year} Kora Switzerland SA. Tous droits réservés.",
    },

    roi: {
      title: "Ce que coûte aujourd'hui la santé des collaborateurs",
      empty: "Le calculateur n'est pas disponible pour le moment.",
      subtitle:
        "Les pertes qu'une entreprise suisse supporte chaque année, et ce qu'elle en récupère avec Kora. Scénario conservateur.",

      employeesLabel: "Nombre de collaborateurs",
      employeesRange: "De {min} à {max} collaborateurs",

      lossesTitle: "Pertes annuelles estimées",
      loss: {
        absenteeism: "Absentéisme",
        presenteeism: "Présentéisme",
        burnout: "Burnout pré-clinique",
        turnover: "Rotation liée à la santé",
      },
      lossHint: {
        absenteeism: "{days} jours d'absence par collaborateur, à {cost} par jour",
        presenteeism: "{cost} de productivité perdue par collaborateur",
        burnout: "{share} de la population à risque, {loss} de productivité perdue",
        turnover: "{rate} de départs liés à la santé, plus le coût de remplacement",
      },
      lossesTotal: "Total des pertes",

      savingsTitle: "Avec Kora",
      savings: "Économies estimées",
      savingsHint:
        "{absence} sur l'absentéisme et le présentéisme, {burnout} sur le burnout et la rotation",
      cost: "Coût Kora",
      costHint: "Sur le plan {plan}, {price} par collaborateur et par mois",
      /* Il meno è U+2212 come in italiano: è lo stesso glifo di `formatSigned`,
         e sostituirlo col trattino da tastiera fa uscire due segni diversi
         nella stessa schermata. */
      costValue: "− {amount}",
      netSavings: "Économies nettes",
      ratio: "Retour sur investissement",
      /* Il rapporto esce con la virgola decimale in fr-CH — `2,35:1` — ed è
         `format.ts` a deciderlo, non questa stringa (CLAUDE.md §11). */
      ratioValue: "{ratio}:1",
      ratioHint: "Économies nettes pour chaque franc investi",

      perEmployee:
        "≈ {amount} par collaborateur et par an, scénario conservateur",

      linearityNote:
        "Chaque poste croît proportionnellement à l'effectif : le rapport reste {ratio} quel que soit le nombre de collaborateurs.",

      sources: "Scénario conservateur. Sources : SECO, Job Stress Index.",

      ctaTitle: "Ces chiffres, sur votre entreprise",
      ctaBody:
        "Une démo de trente minutes sur les données de votre secteur et de votre effectif.",
      ctaButton: "Réserver une démo",
      ctaPricing: "Voir les plans",
    },

    plans: {
      title: "Des plans transparents, une valeur concrète",
      empty: "Aucun plan à afficher pour le moment.",
      subtitle:
        "Un abonnement par collaborateur. Aucun coût caché. ROI mesurable dès le premier trimestre.",

      target: {
        essenziale: "Entreprises de 20 à 100 collaborateurs",
        plus: "Entreprises de 100 à 300 collaborateurs",
        executive: "Entreprises de 300 collaborateurs et plus",
      },

      recommended: "Plan conseillé",
      priceUnit: "/ collaborateur / mois",
      cta: "Demander une offre",

      feature: {
        sessions: "{count} séances de psychologue par an",
        intro: "Entretien de découverte gratuit, une fois",
        coach: "{count} séances de coach par an",
        psychiatrist: "Psychiatre sur demande inclus",
        nutritionist: "{count} séances de nutritionniste par an",
        virtualDoctorUnlimited:
          "Médecin virtuel illimité, réponse sous {hours} heures",
        virtualDoctorUnlimitedOneHour:
          "Médecin virtuel illimité, réponse en une heure",
        virtualDoctorCapped:
          "{count} consultations de médecin virtuel par an, réponse sous {hours} heures",
        virtualDoctorCappedOneHour:
          "{count} consultations de médecin virtuel par an, réponse en une heure",
        checkup: {
          annual: "Check-up physique annuel",
          executive:
            "Check-up executive complet : ECG, échographie abdominale, ophtalmologue, bilan sanguin complet",
        },
        aiPlanMonthly: "Plan de prévention IA mis à jour chaque mois",
        aiPlanEveryMonths:
          "Plan de prévention IA mis à jour tous les {months} mois",
        hrDashboard: {
          base: "Tableau de bord RH et ROI de base : utilisation, stress anonymisé, économies en CHF",
          department:
            "Tableau de bord RH par département, avec rapport trimestriel et alerte burnout précoce",
          advanced:
            "Tableau de bord RH avancé, avec rapport mensuel et call mensuel avec l'équipe clinique",
        },
        workshops: "{count} ateliers live par an inclus",
        family: "Proches inclus : partenaire et un enfant",
        partnerExtension:
          "Extension aux proches : + {price} par collaborateur et par mois, en option",
        extraSession: "Séance au-delà du plafond : {price}",
      },
    },

    costSimulator: {
      title: "Calculez le coût",
      employeesLabel: "Nombre de collaborateurs",
      planLabel: "Plan",
      planOption: "{plan} — {price} par mois",
      billingLabel: "Facturation",
      billingMonthly: "Mensuelle",
      billingAnnual: "Annuelle",
      totalMonthly: "Total mensuel",
      totalAnnual: "Total annuel",
      breakdownAnnual: "{employees} collaborateurs × {price} × 12 mois",
      breakdownMonthly: "{employees} collaborateurs × {price} × 1 mois",
      cta: "Réserver une démo",
      roiLink: "Ce que vous perdez déjà sans Kora",
    },

    landing: {
      badge: "Plateforme suisse, privacy-first",
      mockupSeal: "Privacy-first",
      heroTitleLead: "La santé en entreprise,",
      heroTitleAccent: "enfin intégrée.",
      heroBody:
        "Kora réunit psychologues en ligne, médecin virtuel, check-up physiques, prévention IA et tableau de bord RH anonyme dans un seul abonnement par collaborateur.",
      heroCtaRoi: "Calculer le retour",
      heroCtaDemo: "Réserver une démo",
      heroCompliance: "Hébergement en Suisse. Conforme au RGPD et à la LPD.",

      mockup: {
        scoreLabel: "Profil santé",
        scoreOutOf: "/100",
        focus: "Focus : {area}",
        nextSessionLabel: "Prochaine séance",
        nextSessionValue: "{weekday} {time} · {professional}",
        analyticsLabel: "Tableau de bord RH (anonyme)",
        analyticsValue: "Adoption {adoption} · Stress {trend} points",
        analyticsValueNoTrend: "Adoption {adoption}",

        panelEmployee: "Espace collaborateur",
        panelHr: "Espace RH",
        panelProfessional: "Espace professionnel",
        panelShow: "Afficher {panel}",

        savingsLabel: "Économie du trimestre",
        avoidedDaysLabel: "Absences évitées",
        avoidedDaysValue: "{days} jours sur le trimestre",

        earningsLabel: "Honoraires du mois",
        sessionsValue: "{sessions} séances × {fee}",
        patientsLabel: "Patients actifs",
      },

      problemTitle: "Le coût caché de la santé en entreprise",
      problem: {
        burnout: "Burnout en hausse",
        absenteeism: "Absentéisme coûteux",
        waitingLists: "Listes d'attente chez les psychologues",
        fragmented: "Prestations santé fragmentées",
        noData: "RH sans données mesurables",
      },

      valueTitle: "Une plateforme. Trois niveaux de valeur.",
      value: {
        employee: {
          title: "Pour le collaborateur",
          body: "Un accès simple à la santé mentale, au médecin virtuel et à la prévention. Tout est privé, tout est au même endroit.",
        },
        company: {
          title: "Pour l'entreprise",
          body: "Des insights anonymes, un retour mesurable, une meilleure rétention et moins d'absentéisme.",
        },
        professional: {
          title: "Pour les professionnels",
          body: "Une nouvelle demande, moins de bureaucratie, des paiements automatiques. Une collaboration sous mandat, sans engagement.",
        },
      },

      roiTeaser: {
        title: "Le retour, avant la signature",
        losses: "Une entreprise de {employees} collaborateurs perd {amount} par an.",
        net: "Avec Kora, elle en récupère {amount} nets : {ratio}, scénario conservateur.",
        cta: "Ouvrir le calculateur",
      },

      plansTitle: "Des plans transparents, une valeur concrète",
      plansSubtitle:
        "Un abonnement par collaborateur. Aucun coût caché. Un retour mesurable.",
      plansAll: "Comparer les trois plans",

      privacyTitleLead: "La confidentialité n'est pas un détail.",
      privacyTitleAccent: "C'est le cœur du produit.",
      privacyBody:
        "L'entreprise ne voit jamais de données individuelles, de séances, de rapports ou de diagnostics. Uniquement des insights agrégés et anonymes. Les données de santé restent à qui les produit.",
      privacyChip: {
        hosting: "Hébergement en Suisse",
        gdpr: "Conforme au RGPD",
        lpd: "Conforme à la LPD",
        encryption: "Chiffrement de bout en bout",
      },

      finalTitle: "Amenez Kora dans votre entreprise.",
      finalBody: "Trente minutes pour voir la plateforme sur vos chiffres.",
      finalCta: "Réserver une démo",
    },

    demoRequest: {
      title: "Réserver une démo",
      subtitle:
        "Trente minutes avec notre équipe, sur les chiffres de votre entreprise.",

      companyLabel: "Nom de l'entreprise",
      contactLabel: "Nom et prénom",
      emailLabel: "E-mail professionnel",
      phoneLabel: "Téléphone",
      employeesLabel: "Nombre de collaborateurs",
      messageLabel: "Message",
      optional: "facultatif",
      privacy:
        "Les données seront traitées conformément à la LPD suisse et au RGPD.",
      submit: "Envoyer la demande",
      submitting: "Envoi en cours",
      error: {
        title: "L'envoi n'a pas abouti",
        body: "Les données que vous avez saisies sont encore là : réessayez.",
      },

      validation: {
        companyRequired: "Le nom de l'entreprise est obligatoire.",
        contactRequired: "Le nom de la personne de contact est obligatoire.",
        emailRequired: "L'e-mail est obligatoire.",
        emailInvalid: "L'adresse e-mail ne semble pas valide.",
        employeesInvalid:
          "Le nombre de collaborateurs doit s'écrire en chiffres entiers, ou être laissé vide.",
      },

      successTitle: "Demande reçue",
      successBody:
        "Merci de votre intérêt. Notre équipe vous contactera dans un jour ouvrable.",
      successHome: "Retour à l'accueil",
      successRoi: "En attendant, calculez le retour",
    },
  },

  /*
   * Il back-office (§10.E). Registro strumento, **vous**: parla a chi gestisce
   * la piattaforma.
   */
  admin: {
    portalName: "Admin interne",
    nav: {
      companies: "Entreprises",
      users: "Utilisateurs",
      professionals: "Professionnels",
      sessions: "Séances",
      checkupProviders: "Prestataires check-up",
      analytics: "Analytics",
    },
    demoBanner:
      "Back-office interne · données de démonstration. Les entreprises, les personnes et les structures de cette section sont fictives et ne décrivent pas des clients réels.",

    extractNote:
      "Extrait de {shown} lignes sur {total}. La recherche complète arrive avec la mise en production.",

    companies: {
      empty: "Aucune entreprise cliente.",
      title: "Entreprises clientes",
      kpiActive: "Clients actifs",
      kpiEmployees: "Collaborateurs couverts",
      kpiRevenue: "Revenu annuel",
      kpiRevenueHint: "Sur les clients actifs",
      kpiEnrolled: "Inscrits",
      kpiEnrolledHint: "{enrolled} sur {covered} collaborateurs couverts",

      colName: "Entreprise",
      colIndustry: "Secteur",
      colEmployees: "Collaborateurs",
      colPlan: "Plan",
      colCity: "Siège",
      colClientSince: "Client depuis",
      colRevenue: "Revenu/an",
      colStatus: "Statut",

      statusActive: "Active",
      statusOnboarding: "En activation",
      revenuePotential: "{amount} potentiel",
    },

    industry: {
      finance: "Finance",
      pharma: "Pharmaceutique",
      legal: "Juridique",
      tech: "Technologie",
      insurance: "Assurances",
    },

    users: {
      title: "Utilisateurs",
      searchPlaceholder: "Rechercher par nom ou entreprise",
      kpiTotal: "Utilisateurs inscrits",
      kpiTotalHint: "Sur tous les clients en portefeuille",
      kpiActive: "Actifs",
      kpiWithAssessment: "Assessment initial terminé",
      kpiAverageScore: "Profil santé moyen",
      kpiOnExtract: "Sur les {shown} lignes affichées",

      colName: "Nom",
      colEmail: "E-mail",
      colCompany: "Entreprise",
      colRole: "Rôle",
      colStatus: "Statut",
      colJoined: "Inscrit",

      statusActive: "Actif",
      statusInactive: "Inactif",
      empty: "Aucun utilisateur ne correspond à la recherche.",
    },

    role: {
      employee: "Collaborateur",
      hr: "RH",
      professional: "Professionnel",
      admin: "Admin",
    },

    professionals: {
      title: "Professionnels",
      empty: "Aucun professionnel dans le réseau.",
      kpiTotal: "Professionnels",
      kpiBookable: "Réservables",
      kpiVetting: "En vérification",
      /* "Sedute di carriera" non ha un composto corto in francese che non
         suoni come storia d'impiego: la distinzione dagli altri due conteggi
         si sposta tutta nel sottotitolo, come in tedesco. */
      kpiSessions: "Total des séances",
      kpiSessionsHint: "Somme de tous les professionnels du réseau",

      colName: "Nom",
      colQualification: "Qualification",
      colSpecialty: "Spécialité",
      colLanguages: "Langues",
      colFee: "Rémunération",
      colSessions: "Séances",
      colDocuments: "Documents",
      colMandate: "Mandat",
      colStatus: "Statut",

      statusBookable: "Réservable",
      statusVetting: "En vérification",
      vettingNote:
        "Un professionnel est réservable quand ses documents sont vérifiés et son mandat signé. Tant que ce n'est pas le cas, il n'apparaît pas dans la réservation.",
    },

    sessions: {
      title: "Séances",
      subtitle: "Agenda de {professional}",
      kpiTotal: "Séances",
      kpiDelivered: "Effectuées",
      kpiScheduled: "Prévues",
      kpiVolume: "Rémunérations acquises",
      kpiVolumeHint: "Uniquement les séances effectuées",

      colPatient: "Patient",
      colProfessional: "Professionnel",
      colDate: "Date",
      colType: "Type",
      colFee: "Rémunération",
      colStatus: "Statut",

      statusScheduled: "Prévue",
      statusCompleted: "Effectuée",
      statusCancelled: "Annulée",
      privacyNote: "Des patients ne sortent que les initiales, jamais le nom.",
    },

    checkupProviders: {
      empty: "Aucune structure dans le réseau.",
      title: "Prestataires check-up",
      kpiActive: "Structures actives",
      kpiCities: "Villes couvertes",
      kpiBookings: "Check-up réservés",
      kpiBookingsHint: "Sur la plateforme, sur les douze mois",
      kpiPending: "En conventionnement",

      colName: "Structure",
      colCity: "Ville",
      colAddress: "Adresse",
      colDistance: "Distance",
      colStatus: "Statut",

      statusActive: "Active",
      statusPending: "En conventionnement",
      distance: "{km} km",
      pendingNote:
        "Une structure en conventionnement n'est pas réservable depuis le portail collaborateur.",
    },

    analytics: {
      title: "Analytics plateforme",
      empty: "Aucune donnée de plateforme pour le mois en cours.",
      kpiRevenue: "Revenu du mois",
      kpiRevenueHint: "{amount} annualisés",
      kpiSessions: "Séances du mois",
      kpiEnrolled: "Utilisateurs inscrits",
      kpiActivation: "Activation",
      kpiActivationHint: "{enrolled} sur {covered} collaborateurs couverts",

      revenueChart: "Revenu récurrent mensuel",
      sessionsChart: "Séances de plateforme par mois",
      planMixChart: "Mix des plans",
      activationChart: "Activation",
      serviceMixChart: "Séances par service, douze mois",

      planMixOne: "1 entreprise",
      planMixMany: "{count} entreprises",
      planMixEntry: "{plan} : {count}",
    },

    demoRequests: {
      title: "Demandes de démo",
      empty:
        "Aucune demande. Les demandes envoyées depuis le formulaire public apparaissent ici.",
      colCompany: "Entreprise",
      colContact: "Personne de contact",
      colEmail: "E-mail",
      colPhone: "Téléphone",
      colEmployees: "Collaborateurs",
      colReceived: "Reçue",
    },
  },
};
