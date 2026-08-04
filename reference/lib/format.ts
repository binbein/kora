/*
 * Unico punto di formattazione di numeri, valute, date e percentuali
 * (CLAUDE.md §9). Nessun componente costruisce un formato a mano.
 *
 * Il locale è sempre un parametro, mai una costante cablata: in Svizzera la
 * formattazione dipende dalla lingua, quindi il giorno in cui si aggiunge
 * DE/FR/EN non va toccata nessuna schermata. Oggi la demo è solo it-CH (§2.6).
 */

export type Locale = "it-CH" | "de-CH" | "fr-CH" | "en-CH";

export const DEFAULT_LOCALE: Locale = "it-CH";

/*
 * CLDR dà a it-CH e de-CH `minimumGroupingDigits: 2`, quindi di suo Intl NON
 * separa i numeri di quattro cifre: 14'200 ma 6200. In una dashboard dove il
 * selettore trimestre fa passare da CHF 14'200 a CHF 6200 la differenza si
 * legge come un difetto, non come una convenzione. `useGrouping: "always"`
 * tiene l'apostrofo su tutte le migliaia, che è anche come i documenti
 * finanziari svizzeri scrivono gli importi.
 *
 * Vale per importi e conteggi. Gli anni non passano da qui: hanno `formatDate`.
 */
const GROUPING = { useGrouping: "always" } as const;

/**
 * Importi in franchi. Di default senza decimali: le cifre della demo sono
 * grandezze di bilancio (CHF 14'200), non prezzi al centesimo.
 *
 * it-CH separa le migliaia con l'apostrofo: CHF 14'200.
 */
export function formatCHF(
  amount: number,
  locale: Locale = DEFAULT_LOCALE,
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...GROUPING,
  }).format(amount);
}

/** Numeri senza valuta: 120 dipendenti, 142 sessioni, 31 giorni. */
export function formatNumber(
  value: number,
  locale: Locale = DEFAULT_LOCALE,
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...GROUPING,
  }).format(value);
}

/**
 * Percentuali. Riceve la percentuale già in scala 0–100 (68 → "68%"),
 * perché è così che i dati arrivano dal provider.
 */
export function formatPercent(
  percent: number,
  locale: Locale = DEFAULT_LOCALE,
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(percent / 100);
}

/** Data completa: it-CH usa gg.mm.aaaa (29.07.2026). */
export function formatDate(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Solo l'ora: 17:30. */
export function formatTime(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Giorno della settimana per esteso: "giovedì". */
export function formatWeekday(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}

/**
 * Giorno della settimana abbreviato per le colonne del calendario: "lun".
 *
 * Nota sugli intervalli di date: `Intl.DateTimeFormat.formatRange` sembrerebbe
 * la scelta giusta per "dal … al …", ma in it-CH restituisce 27/07/2026 con le
 * barre mentre `format` dà 27.07.2026 con i punti, a parità di opzioni. Due
 * separatori nella stessa schermata si notano, quindi gli intervalli si
 * compongono con `formatDate` alle due estremità e il pattern sta nel
 * dizionario, dove un'altra lingua può scriverlo a modo suo.
 */
export function formatWeekdayShort(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

/** Mese per esteso con l'anno, per i titoli di periodo: "luglio 2026". */
export function formatMonthYear(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Mese abbreviato per gli assi dei grafici: "lug". */
export function formatMonthShort(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(date);
}

/**
 * Rapporto del calcolatore ROI: 2.35, che a schermo diventa "2.35:1".
 *
 * Due decimali sempre, anche quando il secondo è zero: un rapporto che passa
 * da "2.35" a "2.4" mentre si muove il cursore sembra instabile. Nota che
 * it-CH separa i decimali con il punto, non con la virgola.
 */
export function formatRatio(
  ratio: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return formatNumber(ratio, locale, { decimals: 2 });
}

/** Valutazione dei professionisti: 4.9 (un decimale, sempre). */
export function formatRating(
  rating: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return formatNumber(rating, locale, { decimals: 1 });
}
