import { assertInDev, GUARDRAIL_MODE } from "@/lib/data/guardrails";
import type { Locale } from "@/lib/locale";
import { it } from "./it";

/*
 * IL CONTROLLO CHE IL TIPO NON PUÒ FARE (M5.e).
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
 * resta né il controllo né il costo di percorrere 663 chiavi.
 */

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
