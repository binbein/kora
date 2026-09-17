/*
 * I numeri d'emergenza della demo, Svizzera (CLAUDE.md §8): 144 il soccorso
 * sanitario, 143 il Telefono Amico.
 *
 * STANNO QUI E NON NELLE STRINGHE perché **lo stesso valore alimenta il testo e
 * il link `tel:`** (§5.5): scritti due volte potrebbero divergere, e qui
 * divergere vuol dire comporre una chiamata sbagliata. Le frasi dei dizionari
 * portano `{number}`, non la cifra.
 *
 * STANNO IN `lib/` E NON IN UN COMPONENTE dal 10.09.2026, quando i punti che li
 * mostrano sono diventati due — il check rapido alla risposta peggiore e il
 * disclaimer di «Non sai da dove partire?». Vivevano dentro `RapidCheckCard`
 * perché avevano un consumatore solo; con due, un dato dentro un componente è
 * esattamente ciò che il §2.1 vieta.
 *
 * OGGI I LETTORI SONO QUATTRO (16.09.2026): il check rapido, «Non sai da dove
 * partire?», la chat del medico virtuale — che fino a quel giorno aveva il 144
 * scritto nei dizionari — e la guida per i manager. I cinque punti a schermo
 * sono elencati per nome nel §8, che è l'unico posto che li conta.
 *
 * NON VENGONO DAL PROVIDER, E QUEL GIORNO ARRIVERANNO DA LÌ. In produzione
 * dipendono dal **paese della persona** — 144 in Svizzera, 112 in Italia — e
 * `EmployeeProfile` un paese non ce l'ha: il modulo paese è lavoro dell'MVP
 * (`docs/CONTRATTO-DATI.md` §8.1). Finché non esiste, un campo che il dataset
 * non sa riempire non si aggiunge al contratto per anticiparlo (§11); il giorno
 * in cui esiste, **questo file diventa una lettura del provider** e queste due
 * costanti spariscono con la demo svizzera che descrivono.
 */

/** Soccorso sanitario, 24 ore su 24. */
export const EMERGENCY_NUMBER = "144";

/** Telefono Amico — Die Dargebotene Hand, La Main Tendue. */
export const HELPLINE_NUMBER = "143";
