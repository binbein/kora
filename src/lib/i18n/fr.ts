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
 * TIPOGRAFIA: SPAZIO UNIFICATORE PRIMA DI `:` E DI `?`. È il carattere U+00A0,
 * non lo spazio della tastiera, ed è la convenzione francese — `Focus : {area}`,
 * `Comment te sens-tu aujourd'hui ?`. Sta dichiarato qui perché è **invisibile**:
 * un `grep` scritto con lo spazio normale non trova la stringa, che è la stessa
 * trappola dello spazio di `formatCHF` (M1). La forma più stretta della regola
 * vuole l'espace fine (U+202F) davanti a `?`: è una scelta di finezza
 * tipografica e sta fra i punti da portare alla revisione madrelingua.
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
 */
export const fr = {
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
} as const;
