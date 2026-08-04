/**
 * Il giorno in cui la demo è ambientata: mercoledì 29 luglio 2026.
 *
 * È l'unica data di partenza di tutto il dataset. Da qui derivano i dodici
 * mesi dello storico stress, il trimestre corrente, il mese del riepilogo
 * compensi, la settimana del calendario, il marcatore "oggi" e il confine fra
 * una sessione erogata e una in programma.
 *
 * Sta in un file suo perché la usano cinque moduli del dataset: tenerla
 * dentro `company.ts` la faceva sembrare un dettaglio dell'azienda, e ogni
 * modulo che la voleva doveva importare l'anagrafica di Demo SA per averla.
 *
 * Nessun componente chiama `new Date()`. Se lo facesse, le schermate
 * cambierebbero da sole col passare dei giorni: il calendario del portale
 * mostrerebbe una settimana vuota, il trimestre "in corso" diventerebbe
 * chiuso, e la demo che è stata provata non sarebbe quella che si presenta.
 * È anche ciò che rende il build statico riproducibile.
 *
 * È l'unica manopola da girare se la demo va presentata a distanza di mesi.
 */
export const DEMO_TODAY = new Date(2026, 6, 29);
