/**
 * Il giorno in cui la demo è ambientata: mercoledì 23 settembre 2026.
 *
 * È l'unica data di partenza di tutto il dataset (CLAUDE.md §5.4). Da qui
 * derivano i dodici mesi dello storico stress, il trimestre corrente, la data
 * dell'alert, il mese del riepilogo compensi, la settimana del calendario, il
 * marcatore "oggi" e il confine fra una sessione erogata e una in programma.
 *
 * Tre proprietà di questo giorno, tutte e tre vincoli e non preferenze:
 *
 *   è infrasettimanale, quindi la colonna "oggi" del calendario del
 *   professionista non è vuota — di sabato lo sarebbe;
 *
 *   è il 23 del mese, quindi il riepilogo compensi non apre su un totale
 *   prossimo allo zero, come farebbe il 2;
 *
 *   chiude il terzo trimestre 2026 al 92% (85 giorni su 92), quindi i
 *   CHF 14'200 e i 16 giorni di assenza evitati del §8 descrivono un trimestre
 *   quasi concluso e non quattro settimane. È l'unica delle tre prove che la
 *   data della vecchia demo non passava.
 *
 * Nessun componente chiama `new Date()`, e una regola di lint lo impedisce. Se
 * lo facesse, le schermate cambierebbero da sole col passare dei giorni — il
 * calendario mostrerebbe una settimana vuota, il trimestre "in corso"
 * diventerebbe chiuso — e la demo provata non sarebbe quella presentata.
 *
 * QUANTO GIRA LA MANOPOLA. Diceva "l'unica da girare se la demo va presentata a
 * distanza di mesi", e non è vero: **il mese deve restare settembre.** Misurato
 * spostandola davvero, con i guardrail accesi:
 *
 *   cambiare **anno** funziona — 22.09.2027 disegna tutto, perché i
 *   `clientSince` del portafoglio derivano da `DEMO_TODAY.getFullYear()` e si
 *   spostano con lei;
 *
 *   cambiare **giorno** dentro settembre non fa lanciare niente, ma le tre
 *   proprietà qui sopra non le sorveglia nessun guardrail: sono il motivo per
 *   cui il 23 è stato scelto, e restano da rileggere a mano;
 *
 *   cambiare **mese** rompe. A ottobre lancia `service-usage.ts` — dodici mesi
 *   che non finiscono con un trimestre ne coprono cinque invece di quattro — e
 *   a dicembre lancia `platform.ts`, perché Demo SA sta esattamente sul primo
 *   mese della finestra (§8) e la finestra le scivola sotto. Per spostarla di
 *   mese vanno rivisti i `clientSince` di `platform.ts`.
 *
 * Il pericolo non è il lancio, è dove non lancia: **in produzione i guardrail
 * tacciono** (§5.6), quindi una manopola girata male non si vede in un build
 * di pitch. Si gira in sviluppo e si guarda.
 */
export const DEMO_TODAY = new Date(2026, 8, 23);
