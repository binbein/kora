import { MockDataProvider } from "./mock/provider";
import type { DataProvider } from "./provider";

/*
 * L'unico punto da cui le schermate prendono i dati.
 *
 * Le pagine importano `dataProvider`, non `MockDataProvider`: il giorno in cui
 * dietro c'è una API vera si cambia questa riga, e nient'altro.
 */
export const dataProvider: DataProvider = new MockDataProvider();

export type { DataProvider } from "./provider";
export * from "./types";
