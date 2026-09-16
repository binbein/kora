import type { HealthArea } from "@/lib/data/types";

/*
 * Il catalogo delle risorse del portale dipendente (CLAUDE.md §10.B.9).
 *
 * NON PASSA DAL PROVIDER, ed è una scelta e non una scorciatoia: è contenuto
 * editoriale, uguale per tutti, e non un dato della piattaforma. Nessuna
 * risorsa dipende dall'azienda, dal piano o dalla persona, e nessuna scrittura
 * la tocca — quindi non c'è niente che un backend debba restituire. Il giorno
 * in cui il catalogo diventa gestito — voci che si pubblicano, si ritirano, si
 * traducono fuori dal codice — entra nel contratto, e non prima.
 *
 * QUI STA SOLO LA FORMA: quali voci esistono, di che area e di che tipo. Il
 * testo è nei dizionari, sotto `employee.resources.item.<id>`, come ogni testo a
 * schermo. È anche questo catalogo a decidere se la card di un'area del piano di
 * benessere porta il link alle risorse: un'area senza voci non lo mostra, e non
 * lo decide la JSX.
 *
 * NESSUNA DURATA E NESSUN CONTEGGIO. Una voce non dice quanti minuti richiede:
 * sarebbe un numero a schermo senza una casa nel §8.
 */

export type ResourceId =
  | "sleep_breathing"
  | "sleep_room"
  | "stress_pause"
  | "stress_close_day"
  | "activity_walk"
  | "nutrition_lunch"
  | "mental_journal"
  | "mental_talk";

/** Un esercizio si fa, una lettura si legge. */
export type ResourceKind = "exercise" | "reading";

export type Resource = {
  id: ResourceId;
  area: HealthArea;
  kind: ResourceKind;
};

/** L'ordine è quello in cui la pagina le mostra: per area, come il profilo. */
export const RESOURCES: Resource[] = [
  { id: "sleep_breathing", area: "sleep", kind: "exercise" },
  { id: "sleep_room", area: "sleep", kind: "reading" },
  { id: "stress_pause", area: "stress", kind: "exercise" },
  { id: "stress_close_day", area: "stress", kind: "reading" },
  { id: "activity_walk", area: "activity", kind: "exercise" },
  { id: "nutrition_lunch", area: "nutrition", kind: "reading" },
  { id: "mental_journal", area: "mental", kind: "exercise" },
  { id: "mental_talk", area: "mental", kind: "reading" },
];
