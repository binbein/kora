import { QueryClient } from "@tanstack/react-query";

/*
 * Il client di react-query, unico per l'applicazione (CLAUDE.md §5.2).
 *
 * `refetchOnWindowFocus: false` c'è dal primo commit e non si toglie: durante
 * una presentazione dal vivo si passa continuamente fra finestra e schermate,
 * e un refetch al focus rimetterebbe in movimento dati che erano fermi.
 *
 * `staleTime: Infinity` completa la stessa idea: la cache viene scaldata prima
 * del primo paint (`data/prefetch.ts`) e da lì niente diventa stantio da solo.
 * L'unico modo in cui un dato si rinfresca è che una mutation invalidi la sua
 * chiave, che è la meccanica che il §5.2 vuole — esplicita e tracciabile,
 * invece di un timer che decide per conto suo mentre qualcuno presenta.
 */
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      /*
       * NESSUN TENTATIVO AUTOMATICO, e la ragione non è la comodità.
       *
       * Fino a M5.b qui c'era `retry: 1`, configurazione ereditata mai
       * documentata e **mai esercitata**: il mock non fallisce, quindi non
       * c'era niente da ritentare. È diventata una decisione quando il blocco
       * b) ha reso i fallimenti producibili a comando
       * (`data/fault-injection.ts`), e li ha misurati.
       *
       * IL RETRYER DI REACT-QUERY PAUSA FRA UN TENTATIVO E L'ALTRO se la
       * scheda non è in primo piano: `canContinue()` richiede
       * `focusManager.isFocused()`, che legge `document.visibilityState`. Una
       * query in pausa è `fetchStatus: "paused"` con `data === undefined`,
       * cioè **indistinguibile da una in caricamento** — un quarto caso che la
       * regola dei tre casi non ammette, e in cui la schermata resta sul ramo
       * di sospensione finché la scheda non torna davanti. Misurato: con
       * `retry: 1` una query rotta non arriva mai in errore; con `retry: 0`
       * arriva in un millisecondo.
       *
       * A zero è anche l'unica riga coerente con le due qui sopra: la cache si
       * scalda prima del primo paint, niente diventa stantio da solo, e
       * l'unico modo in cui un dato si rilegge è un gesto — una mutation che
       * invalida, o il "Riprova" dello stato d'errore. **Questa app è
       * costruita perché niente si muova da sé.**
       *
       * Il giorno di `http/` il tentativo automatico si ridecide con la rete
       * vera in mano, sapendo della pausa sul focus: è annotato in
       * `docs/CONTRATTO-DATI.md` §5, che è dove lo legge chi scrive il
       * backend.
       */
      retry: 0,
    },
  },
});
