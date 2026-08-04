/*
 * I due registri di forme del §4.3. Stessa palette ovunque, due grammatiche:
 * "hr" è compatto e da strumento (dashboard HR + landing), "app" è arioso e
 * da consumer (percorso dipendente).
 *
 * I componenti condivisi ricevono il registro come prop invece di essere
 * duplicati: meno codice da tenere allineato quando la demo diventa MVP.
 */
export type Register = "hr" | "app";
