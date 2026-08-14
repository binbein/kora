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
} as const;
