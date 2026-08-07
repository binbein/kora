/*
 * I guardrail del CLAUDE.md §5.6: controlli che falliscono rumorosamente in
 * sviluppo e tacciono in produzione.
 *
 * Servono ai disallineamenti che a schermo non si vedono — il trimestre
 * corrente fuori dal dataset, uno snapshot mancante, una serie che sale dove
 * dovrebbe scendere. Uno svarione si deve vedere mentre si lavora, non durante
 * il pitch.
 *
 * Lanciano invece di registrare un avviso, e vengono chiamati mentre i moduli
 * del dataset si inizializzano: così l'errore è una pagina bianca in sviluppo,
 * cioè impossibile da non vedere. Un `console.warn` in una console che durante
 * il lavoro ne contiene altri quindici non è un guardrail.
 *
 * DA TENERE PRESENTE: girano solo in `import.meta.env.DEV`, quindi durante il
 * pitch — che è un build di produzione — non protegge nessuno di questi. Ciò
 * che protegge il pitch è la verifica a schermo alla chiusura della milestone.
 *
 * `import.meta.env.DEV` e non `process.env.NODE_ENV`: questa è una SPA servita
 * da Vite, e nel browser `process` non esiste. Il modulo che lo nominasse
 * esploderebbe in valutazione lasciando la pagina bianca anche in produzione.
 */

/** Lancia in sviluppo se la condizione è falsa; in produzione non fa nulla. */
export function assertInDev(condition: boolean, message: string): void {
  if (!import.meta.env.DEV) return;
  if (!condition) {
    throw new Error(`[dataset] ${message}`);
  }
}

/**
 * Come `assertInDev`, ma per i controlli che stanno **dentro una Promise**.
 *
 * Un `throw` in un metodo `async` diventa una promise rifiutata, e react-query
 * la cattura nello stato della mutation: il guardrail sparirebbe dentro un
 * `isError` che nessuno guarda, invece di fermare chi sta lavorando. Rilanciare
 * da un microtask lo porta fuori dalla catena, dove Vite lo mostra nel suo
 * overlay — è lo stesso rimedio che usa il controllo sulla cache fredda in
 * `prefetch.ts`.
 */
export function assertInDevOutsidePromise(
  condition: boolean,
  message: string,
): void {
  if (!import.meta.env.DEV) return;
  if (condition) return;
  queueMicrotask(() => {
    throw new Error(`[dataset] ${message}`);
  });
}
