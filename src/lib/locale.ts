/*
 * Il locale come tipo, e il suo default.
 *
 * Sta in un file suo e non in `format.ts` perché lo leggono in due:
 * `format.ts`, che formatta numeri e date, e `lib/i18n`, che tiene il
 * dizionario attivo. Con il tipo dentro `format.ts` i due file si sarebbero
 * importati a vicenda — `format` chiede a `i18n` qual è la lingua corrente — e
 * un ciclo di import fra due moduli che si inizializzano al boot è il genere
 * di guasto che si manifesta lontano dalla causa.
 *
 * È un modulo foglia: non importa niente e non importerà niente.
 */

export type Locale = "it-CH" | "de-CH" | "fr-CH" | "en-CH";

/**
 * L'italiano, ovunque e in ogni build.
 *
 * Il §2.7 tiene la demo in italiano; le altre tre lingue si raggiungono dal
 * selettore e la scelta non sopravvive a un ricaricamento (`lib/i18n`).
 */
export const DEFAULT_LOCALE: Locale = "it-CH";
