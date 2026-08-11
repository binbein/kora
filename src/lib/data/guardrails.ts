/*
 * I guardrail del CLAUDE.md §5.6: controlli sui disallineamenti che a schermo
 * non si vedono — il trimestre corrente fuori dal dataset, uno snapshot
 * mancante, una serie che sale dove dovrebbe scendere.
 *
 * Vengono chiamati mentre i moduli del dataset si inizializzano, cioè prima che
 * qualunque schermata possa mostrare il numero sbagliato.
 *
 * TRE MODI, E LA DECISIONE STA SOLO QUI. Ogni call site chiama `assertInDev` e
 * non sa in quale modo gira: sono 96, e ripetere la condizione in ognuno
 * significherebbe poterla sbagliare in 96 posti.
 *
 * COME SI CONTANO I 96, perché la prossima rilevazione non produca un terzo
 * numero: sono le **chiamate** a `assertInDev(` e `assertInDevOutsidePromise(`
 * sotto `src/`, escluso questo file che le definisce — oggi 90 + 6. Non si
 * contano le righe di `import`, non si conta la prosa dei commenti che le
 * nomina, e si tiene presente che il nome lungo **contiene** quello corto.
 * `prefetch.ts` sta fuori benché chiami `raiseOutsideCurrentStack`: legge
 * `GUARDRAIL_MODE` da sé, quindi non è un call site che ignora il modo. Il
 * 114 dichiarato fino all'11.08.2026 era il grep grezzo — 90 + 6 + 16 import
 * + 2 righe di prosa — cioè un numero senza criterio (`CLAUDE.md` §5.6).
 *
 *   sviluppo (`vite`)                    → **lancia**
 *   build demo (`vite build --mode demo`) → **logga** con `console.error`
 *   build di produzione (`vite build`)    → **tace**, e sparisce dal bundle
 *
 * In sviluppo lancia invece di registrare un avviso, e l'errore è una pagina
 * bianca: impossibile da non vedere. Un `console.warn` in una console che
 * durante il lavoro ne contiene altri quindici non è un guardrail.
 *
 * LA BUILD DEMO PROSEGUE CON I DATI SBAGLIATI. È il punto da capire prima di
 * fidarsi di questo modo: dopo il log l'inizializzazione continua, quindi le
 * schermate si disegnano lo stesso, con i numeri che il guardrail ha appena
 * dichiarato sbagliati. È voluto — davanti a un investitore una schermata rotta
 * è peggio di una schermata con un numero storto — ma vuol dire che **un log
 * della build demo dice "i numeri a schermo potrebbero essere sbagliati", mai
 * "è tutto a posto"**. Chi lo trova durante la prova del giorno prima si ferma:
 * la regola operativa è in `docs/PITCH.md`.
 *
 * PERCHÉ IL MODO DI PRODUZIONE SPARISCE DAVVERO. Vite sostituisce
 * `import.meta.env.DEV` e `import.meta.env.MODE` con letterali al momento del
 * build, quindi `GUARDRAIL_MODE` diventa una costante e il minificatore butta
 * via i rami morti insieme ai messaggi. In produzione non resta né il controllo
 * né il testo che avrebbe stampato: è zero overhead misurato sul bundle, non
 * promesso.
 *
 * `import.meta.env` e non `process.env`: questa è una SPA servita da Vite, e nel
 * browser `process` non esiste. Il modulo che lo nominasse esploderebbe in
 * valutazione lasciando la pagina bianca anche in produzione.
 */

type GuardrailMode = "throw" | "report" | "off";

/*
 * `--mode demo` basta da solo: Vite popola `MODE` dal flag, e **non serve un
 * file `.env.demo`**. È anche l'unica strada percorribile, perché `.gitignore`
 * esclude `.env*` (§2.5): un file d'ambiente necessario alla build non potrebbe
 * stare nel repository, e la build si romperebbe su una macchina appena clonata.
 */
export const GUARDRAIL_MODE: GuardrailMode = import.meta.env.DEV
  ? "throw"
  : import.meta.env.MODE === "demo"
    ? "report"
    : "off";

/** Lancia in sviluppo se la condizione è falsa; logga in build demo; in produzione non fa nulla. */
export function assertInDev(condition: boolean, message: string): void {
  if (GUARDRAIL_MODE === "off") return;
  if (condition) return;

  const text = `[dataset] ${message}`;
  if (GUARDRAIL_MODE === "report") {
    console.error(text);
    return;
  }
  throw new Error(text);
}

/**
 * Come `assertInDev`, ma per i controlli che stanno **dentro una Promise**.
 *
 * Un `throw` in un metodo `async` diventa una promise rifiutata, e react-query
 * la cattura nello stato della mutation: il guardrail sparirebbe dentro un
 * `isError` che nessuno guarda, invece di fermare chi sta lavorando.
 */
export function assertInDevOutsidePromise(
  condition: boolean,
  message: string,
): void {
  if (GUARDRAIL_MODE === "off") return;
  if (condition) return;
  raiseOutsideCurrentStack(`[dataset] ${message}`);
}

/*
 * Solleva il messaggio fuori dallo stack in cui siamo.
 *
 * Serve solo al modo `throw`, ed è il rimedio alla cattura descritta qui sopra:
 * rilanciare da un microtask porta l'errore fuori dalla catena della promise,
 * dove Vite lo mostra nel suo overlay. In modo `report` il rimedio non serve —
 * `console.error` non lo cattura nessuno — quindi il messaggio esce subito, con
 * il vantaggio di comparire in console nell'ordine in cui il difetto è successo.
 *
 * L'altro chiamante è il controllo sulla cache fredda in `prefetch.ts`, che ha
 * lo stesso problema da un'altra porta: gira dentro un callback di react-query.
 */
export function raiseOutsideCurrentStack(text: string): void {
  if (GUARDRAIL_MODE === "off") return;
  if (GUARDRAIL_MODE === "report") {
    console.error(text);
    return;
  }
  queueMicrotask(() => {
    throw new Error(text);
  });
}
