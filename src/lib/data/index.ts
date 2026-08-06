import { MockDataProvider } from "./mock/provider";
import type { DataProvider } from "./provider";

/*
 * Il punto in cui si decide quale implementazione del contratto è attiva
 * (CLAUDE.md §5.7).
 *
 * Il giorno del passaggio alla produzione questo file cambia di una riga:
 * `new HttpDataProvider()` al posto di `new MockDataProvider()`, e `mock/` si
 * cancella. Le schermate non le tocca nessuno — è la forma che tutto il resto
 * di M2 serve a rendere vera.
 *
 * L'istanza è una sola per tutta l'applicazione: lo stato che le mutation
 * scrivono vive qui, e sopravvive alla navigazione interna ma non a un
 * ricaricamento (§10, "Come si naviga durante la demo").
 */
export const dataProvider: DataProvider = new MockDataProvider();
