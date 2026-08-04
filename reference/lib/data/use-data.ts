"use client";

import { useCallback, useSyncExternalStore } from "react";
import { dataProvider } from "./index";

/*
 * Il ponte fra le mutazioni in memoria del provider e React.
 *
 * `useDataVersion` restituisce un numero che cambia a ogni mutazione. Un
 * componente che lo legge si ridisegna dopo una prenotazione e può continuare
 * a chiamare i metodi del provider direttamente, senza copiare i dati in uno
 * stato locale che poi va tenuto allineato.
 *
 * Il valore è un numero e non un oggetto di proposito: `useSyncExternalStore`
 * confronta gli snapshot per identità, e restituire un array nuovo a ogni
 * chiamata manderebbe React in un ciclo infinito di render.
 */
export function useDataVersion(): number {
  const subscribe = useCallback(
    (listener: () => void) => dataProvider.subscribe(listener),
    [],
  );
  return useSyncExternalStore(
    subscribe,
    () => dataProvider.getVersion(),
    // durante il prerender statico non c'è ancora stata nessuna mutazione
    () => 0,
  );
}

/**
 * Legge dal provider e si riabbona alle mutazioni.
 *
 * `select` viene rieseguito a ogni cambio di versione, quindi può restituire
 * tranquillamente array e oggetti nuovi: il confronto per identità lo fa
 * `useDataVersion` sul numero, non su questo risultato.
 */
export function useData<T>(select: (provider: typeof dataProvider) => T): T {
  useDataVersion();
  return select(dataProvider);
}
