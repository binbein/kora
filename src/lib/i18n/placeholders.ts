import { assertInDev, GUARDRAIL_MODE } from "@/lib/data/guardrails";
import type { Locale } from "@/lib/locale";
import { it } from "./it";

/*
 * I DUE CONTROLLI CHE IL TIPO NON PUÒ FARE (M5.e, e il secondo dal 17.08.2026).
 *
 * Il file ne ospita due perché fanno la stessa cosa nello stesso momento —
 * percorrono le chiavi all'avvio, dove i guardrail parlano — e il nome resta
 * quello del primo: rinominarlo `i18n/guardrails.ts` rimetterebbe il call site
 * dentro il nome che il criterio del §5.6 esclude, che è esattamente come quel
 * conteggio perse una chiamata la prima volta.
 *
 * `Dictionary` verifica le **chiavi**: una mancante o rinominata non compila.
 * Non verifica i **segnaposto**, che sono dentro le stringhe — e una stringa è
 * una stringa. Tradurre `"Hai usato {n} di {max}"` con `"{anzahl} von {max}"`
 * compila senza un avviso e rende `{anzahl}` a schermo, cioè una parentesi
 * graffa davanti a un investitore.
 *
 * È lo stesso difetto dei numeri che divergono (§5.5) applicato al testo: due
 * stringhe che descrivono la stessa frase devono nominare le stesse variabili.
 *
 * SI CONFRONTA CON L'ITALIANO, che è la forma di riferimento come lo è per le
 * chiavi. L'ordine non conta — in tedesco i segnaposto si spostano, ed è
 * proprio il motivo per cui le frasi sono intere (§2.7) — quindi si confrontano
 * gli **insiemi**, non le sequenze.
 *
 * GIRA SOLO DOVE I GUARDRAIL PARLANO. La scansione intera è dentro il
 * confronto su `GUARDRAIL_MODE`, quindi in produzione il modo è un letterale
 * falso, il ramo è morto e il minificatore porta via funzione e messaggi: non
 * resta né il controllo né il costo di percorrere tutte le chiavi.
 *
 * *(Questa testata ha portato la cifra due volte e l'ha sbagliata due volte:
 * prima 663, che era falso già quando fu scritto, poi 731, invecchiato alla
 * prima passata che aggiunse una chiave. Non la porta più, e non perché il
 * numero se ne sia andato: **è sceso di due righe, dentro `EXPECTED_KEYS`**,
 * dove non è più una cifra da rileggere ma un valore che l'avvio confronta. La
 * frase qui sopra non ne ha comunque bisogno: il costo è percorrerle tutte,
 * quante che siano.)*
 */

/*
 * QUANTE CHIAVI STRINGA HA UN DIZIONARIO, E PERCHÉ IL NUMERO VIVE QUI.
 *
 * Il conteggio esisteva già come **criterio** nel `CLAUDE.md` §2.7, con il
 * comando che lo esegue sull'albero sintattico e l'obbligo, per chi aggiunge o
 * toglie una stringa, di muovere la cifra dichiarata lì. È andato fuori
 * sincrono tre volte, e la terza **subito dopo che l'obbligo era stato
 * scritto**: la passata della cornice del trimestre aveva perfino misurato il
 * numero giusto e l'aveva scritto nel proprio verbale, senza riportarlo dove
 * era dichiarato. Il difetto non era la distrazione — era chiedere a una
 * persona di copiare una cifra da un file all'altro.
 *
 * Qui non si copia niente: il numero atteso sta accanto al codice che lo
 * verifica, e in sviluppo una chiave in più fa pagina bianca al primo avvio,
 * cioè nel minuto in cui l'ha aggiunta chi l'ha aggiunta.
 *
 * **SI CONTA `it` E BASTA.** Che i quattro dizionari abbiano lo stesso numero
 * non è una misura ma una garanzia di `Translated<Dictionary>`, che non
 * compila se una chiave manca: contarli tutti e quattro sarebbe verificare il
 * typecheck a runtime.
 *
 * **IL CONTO A RUNTIME È LO STESSO DEL CRITERIO DEL §2.7**, che lavora
 * sull'albero sintattico: i commenti non sono valori, e una proprietà o ha una
 * stringa per valore o è un oggetto da percorrere. Verificato sui quattro
 * dizionari — 750 e 750 — il giorno in cui questo controllo è nato. Il criterio
 * non è cambiato: è cambiato chi lo applica.
 */
const EXPECTED_KEYS = 865;

const PLACEHOLDER = /\{(\w+)\}/g;

/** I segnaposto di una frase, ordinati: `"{a} e {b}"` → `"a, b"`. */
function placeholdersOf(text: string): string {
  return [...text.matchAll(PLACEHOLDER)]
    .map((match) => match[1])
    .sort()
    .join(", ");
}

/** Percorre le due forme in parallelo e raccoglie le discrepanze. */
function collect(
  reference: unknown,
  translated: unknown,
  path: string,
  problems: string[],
): void {
  if (typeof reference === "string") {
    if (typeof translated !== "string") return;
    const expected = placeholdersOf(reference);
    const actual = placeholdersOf(translated);
    if (expected !== actual) {
      problems.push(
        `${path}: l'italiano usa [${expected || "nessuno"}], la traduzione [${actual || "nessuno"}]`,
      );
    }
    return;
  }

  if (reference && typeof reference === "object") {
    for (const [key, value] of Object.entries(reference)) {
      const next = (translated as Record<string, unknown> | null)?.[key];
      collect(value, next, path ? `${path}.${key}` : key, problems);
    }
  }
}

/** Le chiavi foglia di tipo stringa di un dizionario, a qualunque profondità. */
function countStrings(node: unknown): number {
  if (typeof node === "string") return 1;
  if (!node || typeof node !== "object") return 0;

  let total = 0;
  for (const value of Object.values(node)) total += countStrings(value);
  return total;
}

/**
 * Verifica che il dizionario abbia le chiavi che `EXPECTED_KEYS` dichiara.
 *
 * Si chiama una volta all'inizializzazione di `index.ts`, come il controllo sui
 * segnaposto.
 */
export function assertKeyCountMatches(): void {
  if (GUARDRAIL_MODE === "off") return;

  const actual = countStrings(it);

  /*
   * Il messaggio lo legge quasi sempre chi ha appena aggiunto una stringa e non
   * sa perché la pagina è bianca: dice il numero trovato, quello atteso e
   * **dove si aggiorna**, così la correzione è la riga successiva invece di una
   * ricerca in tre file.
   */
  assertInDev(
    actual === EXPECTED_KEYS,
    `[i18n] il dizionario ha ${actual} chiavi stringa, EXPECTED_KEYS ne dichiara ${EXPECTED_KEYS}. ` +
      `Se hai appena aggiunto o tolto una stringa il numero giusto è ${actual}: ` +
      `scrivilo in EXPECTED_KEYS, src/lib/i18n/placeholders.ts. Il criterio sta nel CLAUDE.md §2.7.`,
  );
}

/**
 * Verifica che una traduzione nomini gli stessi segnaposto dell'italiano.
 *
 * Si chiama una volta per dizionario, all'inizializzazione di `index.ts`: è il
 * momento in cui il dizionario esiste e nessuna schermata l'ha ancora letto.
 */
export function assertPlaceholdersMatch(
  locale: Locale,
  dictionary: unknown,
): void {
  if (GUARDRAIL_MODE === "off") return;

  const problems: string[] = [];
  collect(it, dictionary, "", problems);

  assertInDev(
    problems.length === 0,
    `[i18n] ${locale} non rispetta i segnaposto dell'italiano:\n  ${problems.join("\n  ")}`,
  );
}
