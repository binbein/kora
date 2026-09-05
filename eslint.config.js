import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/*
 * I SELETTORI STANNO QUI PERCHE' `no-restricted-syntax` NON SI SOMMA FRA
 * BLOCCHI: l'ultimo blocco che la dichiara **sostituisce per intero** quelli
 * prima, per i file che entrambi coprono. E' la stessa trappola che questo file
 * gia' racconta dei due preset piu' sotto — il lint usciva verde perche' non
 * stava guardando — e questa volta e' costata una misura: aggiungendo le regole
 * di rete in un blocco proprio, `new Date()` ha smesso di essere segnalato in
 * tutto `src/` e nessuno se ne sarebbe accorto.
 *
 * Da qui i due perimetri si **compongono** invece di essere riscritti: un solo
 * elenco per famiglia, e nessuna coppia di liste da tenere allineata a mano.
 */

/*
 * NESSUNO LEGGE L'OROLOGIO VERO, nemmeno il dataset. Una schermata che lo
 * facesse cambierebbe da sola col passare dei giorni — il calendario
 * mostrerebbe una settimana vuota, il trimestre "in corso" diventerebbe chiuso
 * — e la demo provata non sarebbe quella presentata (§5.4).
 *
 * I selettori prendono solo le forme **senza argomenti**, quindi
 * `new Date(2026, 8, 23)` di `demo-date.ts` non ha bisogno di un'esenzione, e
 * nemmeno le aritmetiche di `dates.ts`.
 */
const CLOCK_SELECTORS = [
  {
    selector: "NewExpression[callee.name='Date'][arguments.length=0]",
    message:
      "Nessuno chiama new Date(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
  },
  {
    // `Date.now()` e' lo stesso orologio con un'altra faccia, e il
    // `docs/CONTRATTO-DATI.md` §1 dice "nessun new Date()" senza qualificare.
    // Senza questa riga passava.
    selector:
      "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    message:
      "Nessuno chiama Date.now(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
  },
  {
    // `Date()` senza `new` restituisce una stringa invece di una data, ma legge
    // lo stesso orologio: e' la stessa cosa scritta peggio.
    selector: "CallExpression[callee.name='Date'][arguments.length=0]",
    message:
      "Nessuno chiama Date(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
  },
];

/*
 * Il cambio lingua (M5.e) passa da un re-render dell'albero intero: `t` e' un
 * binding vivo, e a farlo rileggere e' `LocaleGate`, che rirenderizza senza
 * rimontare. Un componente memoizzato non viene raggiunto da quel re-render e
 * resta nella lingua vecchia — a schermo, senza che niente segnali l'errore.
 *
 * La regola esiste perche' il vincolo sia **eseguibile** invece che verificato
 * una volta: al momento in cui e' stata scritta i componenti memoizzati erano
 * zero, e chi introduce il primo deve inciampare qui invece di rompere il
 * cambio lingua in silenzio.
 */
const MEMO_SELECTORS = [
  {
    selector: "CallExpression[callee.property.name='memo']",
    message:
      "Un componente memoizzato non riceve il re-render che cambia lingua e resta nella lingua vecchia: vedi il commento su `t` in src/lib/i18n/index.ts (M5.e).",
  },
  {
    // La stessa cosa importata come `memo` invece che `React.memo`.
    selector: "CallExpression[callee.name='memo']",
    message:
      "Un componente memoizzato non riceve il re-render che cambia lingua e resta nella lingua vecchia: vedi il commento su `t` in src/lib/i18n/index.ts (M5.e).",
  },
];

/*
 * ZERO RICHIESTE ESTERNE A RUNTIME (CLAUDE.md §3), resa eseguibile.
 *
 * La proprieta' era vera e non la imponeva nessuno: i font sono self-hostati
 * apposta perche' una richiesta ai server di Google trasmette l'IP di chi
 * guarda, ed e' incompatibile con quello che le nostre stesse schermate
 * promettono (hosting in Svizzera, LPD, GDPR). Non e' performance, e' coerenza
 * con l'argomento di vendita — quindi il prossimo widget che la perde non deve
 * poterla perdere in silenzio.
 *
 * E' meta' del controllo. L'altra sta in `scripts/check-external-requests.mjs`
 * e guarda il **risultato** invece del sorgente: questa regola non vede cosa
 * una dipendenza fa al suo interno, ne' un URL che entra da un `<link>` o da un
 * `@import`.
 */
const NETWORK_SELECTORS = [
  {
    selector: "CallExpression[callee.name='fetch']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
  {
    // `window.fetch(...)` e `globalThis.fetch(...)`: la stessa chiamata scritta
    // per esteso, come `Date.now()` sta accanto a `new Date()`.
    selector: "CallExpression[callee.property.name='fetch']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
  {
    selector: "NewExpression[callee.name='XMLHttpRequest']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
  {
    selector: "NewExpression[callee.name='WebSocket']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
  {
    selector: "NewExpression[callee.name='EventSource']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
  {
    // Preso dalla proprieta' e non da `navigator.`: e' l'unica forma che
    // aggancia anche `window.navigator.sendBeacon`.
    selector: "CallExpression[callee.property.name='sendBeacon']",
    message: "Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3.",
  },
];

export default [
  // `dist/` e' il build e non si lint-a. (Qui c'era anche `reference/`, il
  // magazzino della vecchia demo: cancellato alla chiusura di M3.)
  {
    ignores: ["dist/**"],
  },
  // Solo parser e regole `recommended`: le varianti type-aware caricherebbero il
  // programma TypeScript a ogni lint, e con `checkJs: false` coprirebbero comunque
  // solo meta' del codice.
  // I file tipizzati di `src/components/ui/` entrano qui, e solo qui. La regola
  // che conta e' `no-explicit-any`: sorveglia esattamente cio' che l'eccezione
  // del CLAUDE.md §3 ci ha autorizzato ad aggiungere. Il blocco React piu' sotto
  // invece li lascia fuori: quelle regole sorveglierebbero il codice che la
  // stessa eccezione vieta di toccare, e un warning li' e' pressione a
  // modificare un componente congelato.
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ["src/**/*.{ts,tsx}"],
  })),
  // I due preset stanno ognuno nel proprio elemento dell'array, e non e' uno
  // stile: dentro un oggetto solo, i loro `rules` arrivano da uno spread e la
  // chiave `rules:` scritta a mano piu' sotto li sovrascriveva **per intero**.
  // Ne' eslint:recommended ne' react/recommended erano attivi, e il lint usciva
  // verde perche' non stava guardando.
  //
  // `src/components/ui/` resta fuori da entrambi: sono i file congelati del
  // CLAUDE.md §3, e un avviso li' e' pressione a modificarli. Restano coperti
  // dal blocco typescript-eslint qui sopra, che e' dove sta la regola che serve.
  {
    ...pluginJs.configs.recommended,
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: ["src/components/ui/**/*"],
  },
  {
    ...pluginReact.configs.flat.recommended,
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: ["src/components/ui/**/*"],
  },
  // Questo blocco resta **dopo** i due preset, ed e' un vincolo di ordine: e'
  // lui a spegnere `react/prop-types` e `react/react-in-jsx-scope`, che
  // react/recommended accende e che con il transform JSX moderno segnalerebbero
  // ogni componente del progetto.
  {
    files: [
      "src/**/*.{js,mjs,cjs,jsx,ts,tsx}",
    ],
    // I componenti shadcn non si toccano se non per i bug di CLAUDE.md §3.
    ignores: ["src/components/ui/**/*"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": ["error", { ignore: ["cmdk-input-wrapper"] }],
      "react-hooks/rules-of-hooks": "error",
    },
  },
  // Il seam del CLAUDE.md §5.7, reso eseguibile. Il giorno in cui `mock/` si
  // cancella per lasciare posto a `http/`, se il lint era verde nessuna
  // schermata se ne accorge — ed e' l'unica prova che quel giorno non sara' una
  // riscrittura.
  //
  // Questa meta' vale **fuori** dal layer dati: dentro, il mock si importa per
  // mestiere. Il divieto sull'orologio, che ha uno scopo diverso, sta nel
  // blocco successivo.
  {
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: ["src/components/ui/**/*", "src/lib/data/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Il buco che `mock/*` lasciava aperto e' **la cartella nuda**:
              // un `from "@/lib/data/mock"` — cioe' il barrel `mock/index.ts`,
              // la forma piu' comoda da scrivere — non veniva segnalato.
              // Verificato: le sottocartelle `mock/a/b` invece gia' passavano
              // dalla regola, quindi il pattern nudo e' l'unica aggiunta che
              // cambia qualcosa. Ci sono tutte e due per non doverlo riscoprire.
              group: [
                "@/lib/data/mock",
                "@/lib/data/mock/**",
                "**/lib/data/mock",
                "**/lib/data/mock/**",
              ],
              message:
                "Il dataset finto si legge solo attraverso il provider (@/lib/data): CLAUDE.md §5.7.",
            },
          ],
        },
      ],
    },
  },
  // I DUE PERIMETRI, COMPOSTI DAGLI ELENCHI IN TESTA.
  //
  // Coprono `src/` per intero, `src/lib/data/` e `src/components/ui/`
  // compresi: i file congelati del §3 non contengono nessuna di queste forme,
  // quindi coprirli costa zero avvisi oggi e chiude il varco per chi ne
  // aggiungera' uno.
  //
  // I due blocchi sono **disgiunti**, ed e' cio' che li rende sicuri: se si
  // sovrapponessero, il secondo cancellerebbe il primo per i file in comune —
  // vedi il commento in testa al file.
  {
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: ["src/lib/data/http/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...CLOCK_SELECTORS,
        ...MEMO_SELECTORS,
        ...NETWORK_SELECTORS,
      ],
    },
  },
  // `src/lib/data/http/**` oggi non esiste: e' il posto del §5.7 dove le
  // chiamate vivranno il giorno in cui `mock/` si cancella. Il blocco c'e' gia'
  // perche' quel giorno la regola di rete si spenga **solo li'** senza che
  // nessuno debba toccare il resto — e perche' l'orologio e il divieto di
  // memoizzare continuino a valere anche dentro.
  {
    files: ["src/lib/data/http/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...CLOCK_SELECTORS, ...MEMO_SELECTORS],
    },
  },
];
