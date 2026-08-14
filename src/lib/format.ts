/*
 * Unico punto di formattazione di numeri, valute, date e percentuali
 * (CLAUDE.md §11). Nessun componente costruisce un formato a mano.
 *
 * Il locale è sempre un parametro, mai una costante cablata: in Svizzera la
 * formattazione dipende dalla lingua, quindi aggiungendo DE/FR/EN non è stata
 * toccata nessuna schermata — la promessa scritta qui da M1 è stata mantenuta
 * da M5.e, e questo file ne è la prova.
 *
 * IL DEFAULT È LA LINGUA ATTIVA, non una costante (M5.e): nessuna delle 27
 * schermate passa un locale, quindi se il default fosse rimasto `it-CH` il
 * cambio lingua avrebbe tradotto le parole e lasciato i numeri in italiano —
 * il caso peggiore, perché a schermo sembra funzionare. Il parametro resta,
 * per chi un giorno dovrà formattare in una lingua diversa da quella attiva.
 *
 * COSA CAMBIA DAVVERO FRA I QUATTRO LOCALE, misurato e non ripetuto a memoria:
 * fr-CH mette la **valuta dopo** il numero (`14'200 CHF`) e usa la **virgola**
 * come separatore decimale (`2,35`); gli altri tre tengono `CHF 14'200` e il
 * punto. Lo spazio unificatore U+00A0 fra valuta e cifre vale in tutti e
 * quattro, e l'apostrofo delle migliaia pure — ma in francese **glielo imponiamo
 * noi**: vedi `groupWithApostrophes`.
 */

import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";


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

/*
 * L'APOSTROFO DELLE MIGLIAIA ANCHE IN FRANCESE, E GLIELO IMPONIAMO NOI
 * (founder, 14.08.2026).
 *
 * ICU dà a `fr-CH` lo **spazio unificatore stretto** U+202F come separatore di
 * gruppo: senza questa funzione il francese scriverebbe `14 200 CHF` dove le
 * altre tre lingue scrivono `14'200`. Non è un difetto di ICU — è la
 * convenzione tipografica francese — ed è il motivo per cui il `CLAUDE.md` §2.7
 * ha smesso di attribuire l'apostrofo a CLDR: fino a M5.e lo dichiarava come
 * fatto di "tutte le varianti svizzere", ed era vero per due lingue su tre.
 *
 * PERCHÉ SI FORZA, e perché **non è la stessa domanda del decimale**. La
 * virgola di `2,35` è correttezza: per chi legge in francese è l'unica forma
 * giusta, e infatti resta. Il raggruppamento è **registro**, e `14'200` è la
 * convenzione finanziaria svizzera in tutte le lingue nazionali — la scrivono
 * così i bilanci e i testi federali in francese.
 *
 * Due ragioni in più, che valgono per questa demo in particolare:
 *
 *   - **i numeri di ancoraggio del pitch tengono una sola forma visiva nelle
 *     quattro lingue.** CHF 14'200, CHF 1'289'500, 1'200 sessioni sono i numeri
 *     che l'investitore ha letto sul Business Plan: cambiarne la sagoma
 *     cambiando lingua li fa sembrare altri numeri;
 *   - **non si introduce U+202F.** Sarebbe il quinto carattere invisibile di
 *     questo codice — dopo lo spazio unificatore di `formatCHF`, il meno
 *     tipografico, l'apostrofo stesso e lo spazio francese davanti a `:` — e
 *     l'unico che avremmo scelto noi. Ogni `grep` scritto con lo spazio da
 *     tastiera sarebbe fallito su un numero che a schermo sembra normale.
 *
 * SI PASSA DA `formatToParts` E NON DA UNA SOSTITUZIONE SUL TESTO: il pezzo da
 * cambiare è quello che `Intl` dichiara `group`, quindi lo spazio unificatore
 * fra cifre e valuta — che è un altro pezzo, e va lasciato dov'è — non si tocca
 * per sbaglio.
 */
function groupWithApostrophes(
  formatter: Intl.NumberFormat,
  value: number,
): string {
  return formatter
    .formatToParts(value)
    .map((part) => (part.type === "group" ? "'" : part.value))
    .join("");
}

/**
 * Importi in franchi. Di default senza decimali: le cifre della demo sono
 * grandezze di bilancio (CHF 14'200), non prezzi al centesimo.
 *
 * it-CH separa le migliaia con l'apostrofo: CHF 14'200.
 */
export function formatCHF(
  amount: number,
  locale: Locale = getLocale(),
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return groupWithApostrophes(
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...GROUPING,
    }),
    amount,
  );
}

/** Numeri senza valuta: 120 dipendenti, 142 sessioni, 31 giorni. */
export function formatNumber(
  value: number,
  locale: Locale = getLocale(),
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return groupWithApostrophes(
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...GROUPING,
    }),
    value,
  );
}

/**
 * Percentuali. Riceve la percentuale già in scala 0–100 (68 → "68%"),
 * perché è così che i dati arrivano dal provider.
 */
export function formatPercent(
  percent: number,
  locale: Locale = getLocale(),
  options: { decimals?: number } = {},
): string {
  const decimals = options.decimals ?? 0;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(percent / 100);
}

/**
 * Un numero con il segno sempre davanti: `+5`, `−2`, `0`.
 *
 * Serve alle KPI di trend, dove il segno è metà dell'informazione (§6.1): un
 * `2` senza segno sull'altro caso si legge come un valore assoluto. Il meno è
 * il segno tipografico U+2212 e non il trattino della tastiera, perché è
 * allineato alle cifre e della loro larghezza — che con `tabular-nums` è
 * esattamente il punto.
 */
export function formatSigned(
  value: number,
  locale: Locale = getLocale(),
  options: { decimals?: number } = {},
): string {
  const magnitude = formatNumber(Math.abs(value), locale, options);
  if (value > 0) return `+${magnitude}`;
  if (value < 0) return `−${magnitude}`;
  return magnitude;
}

/** Data completa: it-CH usa gg.mm.aaaa (29.07.2026). */
export function formatDate(
  date: Date,
  locale: Locale = getLocale(),
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
  locale: Locale = getLocale(),
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Giorno della settimana per esteso: "giovedì". */
export function formatWeekday(
  date: Date,
  locale: Locale = getLocale(),
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
  locale: Locale = getLocale(),
): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

/** Mese per esteso con l'anno, per i titoli di periodo: "luglio 2026". */
export function formatMonthYear(
  date: Date,
  locale: Locale = getLocale(),
): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Mese abbreviato per gli assi dei grafici: "lug". */
export function formatMonthShort(
  date: Date,
  locale: Locale = getLocale(),
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
  locale: Locale = getLocale(),
): string {
  return formatNumber(ratio, locale, { decimals: 2 });
}

/** Valutazione dei professionisti: 4.9 (un decimale, sempre). */
export function formatRating(
  rating: number,
  locale: Locale = getLocale(),
): string {
  return formatNumber(rating, locale, { decimals: 1 });
}

/**
 * Un'enumerazione in linea: "Italiano, Deutsch e English".
 *
 * Le liste sono la terza cosa che cambia col locale dopo date e valuta (§2.7),
 * e fino a M5.e questo file non le trattava: le due schermate che ne mostrano
 * una univano con `t.common.listSeparator`, cioè un `", "` nel dizionario. Con
 * quello, in italiano si leggeva "Italiano, Deutsch" dove si dice "Italiano e
 * Deutsch" — la congiunzione sull'ultimo elemento non è un separatore, e
 * nessun dizionario può fabbricarla.
 *
 * `Intl.ListFormat` la mette dove va in ognuna delle quattro lingue: `e`,
 * `und`, `et`, `and`. La chiave `listSeparator` è sparita con il suo ultimo
 * chiamante.
 */
export function formatList(
  items: readonly string[],
  locale: Locale = getLocale(),
): string {
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(items);
}
