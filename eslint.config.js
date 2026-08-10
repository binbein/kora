import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

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
  // L'altra meta' del seam: **nessuno legge l'orologio vero**, nemmeno il
  // dataset. Una schermata che lo facesse cambierebbe da sola col passare dei
  // giorni — il calendario mostrerebbe una settimana vuota, il trimestre "in
  // corso" diventerebbe chiuso — e la demo provata non sarebbe quella
  // presentata (§5.4).
  //
  // Copre `src/` per intero, `src/lib/data/` compreso: li' l'unica sorgente
  // ammessa e' `DEMO_TODAY`, e prima questa regola non ci arrivava. Non serve
  // esentare `demo-date.ts`, perche' i selettori prendono solo le forme senza
  // argomenti e `new Date(2026, 8, 23)` ne ha tre — come le aritmetiche di
  // `dates.ts` e i due usi legittimi nelle pagine del professionista.
  //
  // `src/components/ui/` e' dentro: i file congelati del §3 non contengono
  // nessuna delle tre forme, quindi coprirli costa zero avvisi oggi e chiude il
  // varco per chi ne aggiungera' uno.
  {
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message:
            "Nessuno chiama new Date(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
        },
        {
          // `Date.now()` e' lo stesso orologio con un'altra faccia, e il
          // `docs/CONTRATTO-DATI.md` §1 dice "nessun new Date()" senza
          // qualificare. Senza questa riga passava.
          selector:
            "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message:
            "Nessuno chiama Date.now(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
        },
        {
          // `Date()` senza `new` restituisce una stringa invece di una data, ma
          // legge lo stesso orologio: e' la stessa cosa scritta peggio.
          selector: "CallExpression[callee.name='Date'][arguments.length=0]",
          message:
            "Nessuno chiama Date(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
        },
      ],
    },
  },
];
