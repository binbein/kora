import { withFaultInjection } from "./fault-injection";
import { GUARDRAIL_MODE } from "./guardrails";
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
 *
 * IN SVILUPPO L'ISTANZA È AVVOLTA dall'iniezione di guasto, che è il modo in
 * cui gli stati d'errore si dimostrano a schermo (`fault-injection.ts`). Il
 * confronto su `GUARDRAIL_MODE` è la stessa lettura che fa `prefetch.ts`, e
 * per la stessa ragione: la decisione su come si gira sta in `guardrails.ts`,
 * qui si legge soltanto (§5.6). Nelle altre due build è un letterale falso,
 * quindi il ramo è morto e il decoratore esce dal bundle — misurato col grep,
 * non promesso.
 *
 * Il giorno del passaggio a produzione questo ternario sparisce con `mock/`:
 * il decoratore esiste perché il mock non fallisce mai, e una `fetch` vera
 * fallisce da sé.
 */
export const dataProvider: DataProvider =
  GUARDRAIL_MODE === "throw"
    ? withFaultInjection(new MockDataProvider())
    : new MockDataProvider();
