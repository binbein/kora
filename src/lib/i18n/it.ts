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
 * Oggi il dizionario è quasi vuoto di proposito: le stringhe entrano una
 * schermata alla volta mentre M3 la migra, che è l'unico modo in cui il §2.7
 * non costa dieci volte tanto.
 */
export const it = {
  common: {
    appName: "Kora",
  },
} as const;
