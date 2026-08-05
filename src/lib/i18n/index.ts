import { it } from "./it";

/*
 * Il dizionario attivo. Oggi è sempre l'italiano (§2.7: niente language
 * switcher), quindi non serve né un context né un provider: i componenti
 * importano `t` e leggono `t.area.chiave`.
 *
 * Le altre tre lingue sono M5. Quel giorno questo file sceglie fra i
 * dizionari; le schermate non cambiano, perché già oggi non conoscono `it`.
 */
export const t = it;

/** La forma che ogni altra lingua dovrà rispettare, chiave per chiave. */
export type Dictionary = typeof it;

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
