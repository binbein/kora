import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
  // Non manteniamo questo codice e non deve produrre errori: `reference/` e' il
  // magazzino di sola lettura della vecchia demo (CLAUDE.md §3), `dist/` e' il build.
  {
    ignores: ["reference/**", "dist/**"],
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
  {
    files: [
      "src/**/*.{js,mjs,cjs,jsx,ts,tsx}",
    ],
    // I componenti shadcn non si toccano se non per i bug di CLAUDE.md §3.
    ignores: ["src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
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
  // riscrittura. Vale anche per `new Date()`: una schermata che legge
  // l'orologio vero cambia da sola col passare dei giorni, e la demo provata
  // non e' quella presentata (§5.4).
  {
    files: ["src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: ["src/components/ui/**/*", "src/lib/data/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/data/mock/*", "**/lib/data/mock/*"],
              message:
                "Il dataset finto si legge solo attraverso il provider (@/lib/data): CLAUDE.md §5.7.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message:
            "Nessun componente chiama new Date(): la data della demo arriva dal provider (CLAUDE.md §5.4).",
        },
      ],
    },
  },
];
