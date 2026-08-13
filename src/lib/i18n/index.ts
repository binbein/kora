import { DEFAULT_LOCALE, type Locale } from "@/lib/format";
import { it } from "./it";

/**
 * La forma che ogni altra lingua deve rispettare, chiave per chiave.
 *
 * Non è una promessa: `de.ts`, `fr.ts` ed `en.ts` si dichiarano `Dictionary`,
 * quindi **una chiave mancante è un errore di typecheck** e non una stringa
 * italiana che sbuca in tedesco.
 */
export type Dictionary = typeof it;

/*
 * I dizionari disponibili. Cresce di una riga per lingua, e il tipo del
 * record impone che ci siano tutte: togliere una voce non compila.
 *
 * Finché una lingua non esiste, `it` resta la sola registrata — e questo è
 * l'unico posto in cui si vede quali lingue l'applicazione ha davvero.
 */
const DICTIONARIES: Partial<Record<Locale, Dictionary>> = {
  "it-CH": it,
};

/** Le lingue effettivamente disponibili, nell'ordine in cui si mostrano. */
export const AVAILABLE_LOCALES = Object.keys(DICTIONARIES) as Locale[];

/*
 * IL DIZIONARIO ATTIVO, E PERCHÉ È UN `let` (M5.e).
 *
 * Le schermate scrivono `t.area.chiave` e non sanno che lingua sia: sono 40
 * file e circa 700 letture, e trasformarle in un hook sarebbe un diff enorme
 * su schermate che funzionano. `export let` è un **binding vivo** dell'ES
 * module: chi importa `t` vede il valore corrente al momento dell'accesso, non
 * quello dell'import. Riassegnarlo qui cambia la lingua ovunque.
 *
 * PERCHÉ QUESTO BASTA A FAR RIDISEGNARE LO SCHERMO. Un binding non è uno stato
 * di React: da solo non ridisegna niente. A farlo è `LocaleGate` in `App.tsx`,
 * che si iscrive a questo store e **rirenderizza l'albero senza rimontarlo** —
 * quindi lo stato locale sopravvive, e una prenotazione fatta in italiano
 * esiste ancora in tedesco. Il rimontaggio con `key` avrebbe azzerato la chat
 * del medico virtuale e la conferma della richiesta demo, che durante il pitch
 * sono a schermo.
 *
 * IL VINCOLO CHE NE DISCENDE: nessun componente può essere memoizzato, o il
 * re-render non lo raggiunge e resta nella lingua vecchia. Non è una speranza,
 * è una regola di lint (`eslint.config.js`), perché chi introdurrà il primo
 * `React.memo` deve inciampare nella ragione invece di rompere il cambio
 * lingua in silenzio.
 *
 * NIENTE LETTURE A LIVELLO DI MODULO. Un `const X = t.area.chiave` fuori da un
 * componente cattura il dizionario di quel momento e non cambia più: le dieci
 * catture che esistevano sono state spostate dentro i componenti prima di
 * questo commit.
 */
export let t: Dictionary = it;

let currentLocale: Locale = DEFAULT_LOCALE;
const listeners = new Set<() => void>();

/** La lingua attiva. */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Cambia lingua.
 *
 * Non fa niente se la lingua è già quella, così un clic ripetuto sulla sigla
 * accesa non ridisegna l'applicazione.
 *
 * NON SI RICORDA FRA UN RICARICAMENTO E L'ALTRO, ed è una scelta: con
 * `localStorage` la demo si aprirebbe in tedesco a chi ha provato il tedesco
 * il giorno prima, e il §5.4 vuole che la demo provata sia quella presentata.
 * Il default è l'italiano ovunque, build demo compresa.
 *
 * IL GIORNO DEL PROFILO UTENTE questa riga non cambia: la lingua arriverà
 * dalla sessione e si scriverà **una volta al boot**, dove già si scalda la
 * cache. Per questo il locale sta qui e non nel provider — a differenza del
 * ruolo di M5.d, che le guardie leggono come dato a ogni rotta, la lingua non
 * la legge nessuno come dato.
 */
export function setLocale(next: Locale): void {
  if (next === currentLocale) return;

  const dictionary = DICTIONARIES[next];
  if (!dictionary) return;

  currentLocale = next;
  t = dictionary;

  /*
   * L'attributo `lang` del documento segue la lingua, ed è accessibilità e non
   * cosmesi: è quello che dice a un lettore di schermo con che pronuncia
   * leggere la pagina (WCAG 3.1.1). Restava `it` in `index.html` perché la
   * lingua era una sola.
   */
  document.documentElement.lang = languageTag(next);

  for (const listener of listeners) listener();
}

/** `it-CH` → `it`: l'attributo `lang` vuole la lingua, non il locale intero. */
function languageTag(locale: Locale): string {
  return locale.split("-")[0];
}

/** Si iscrive ai cambi di lingua. Restituisce la disiscrizione. */
export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Riempie i segnaposto `{nome}` di una frase completa.
 *
 * I valori arrivano già formattati da `format.ts`: qui si sostituisce testo,
 * non si decide come si scrive un numero.
 *
 *   interpolate(t.employee.sessions, { n: "3", max: "10" })
 */
export function interpolate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in values ? values[key] : placeholder,
  );
}
