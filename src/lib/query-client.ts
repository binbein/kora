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
 *
 * `gcTime: Infinity` NON È LA STESSA MANOPOLA, ed è la riga senza la quale
 * quella qui sopra non basta. Sono due decisioni distinte su due momenti
 * diversi:
 *
 *   - `staleTime` decide quando un dato va **rifatto**;
 *   - `gcTime` decide quando una query **senza osservatori** viene **buttata**.
 *
 * Le query che `prefetchDemo` scalda e che nessuno ha ancora montato non hanno
 * osservatori: con il default di **cinque minuti** sparivano dalla cache, e chi
 * arrivava in `/admin` a fine giro le trovava fredde — cioè uno sfarfallio di
 * scheletro davanti a un investitore, che è precisamente ciò che il prefetch
 * esiste per evitare. **Il guardrail della cache fredda lo diceva**, ed era nel
 * giusto: a essere sbagliata era la configurazione, non il controllo.
 *
 * A `Infinity` non si perde niente e non si raccoglie niente: il provider vive
 * in memoria per la durata della sessione, il dataset non cambia, e la cache è
 * riempita prima del primo paint per costruzione. Il giorno di `http/` questa
 * riga si ridecide con la rete vera in mano, come il tentativo automatico qui
 * sotto.
 *
 * È LA SECONDA VOLTA CHE QUESTO FILE CONFONDE DUE COMPORTAMENTI DI
 * REACT-QUERY, e vale la pena scriverlo: la prima fu `retry: 1`, tolto in M5.b
 * perché il retryer mette in pausa a scheda nascosta. Tutte e due le volte il
 * difetto era invisibile finché nessuno esercitava il caso — un fallimento
 * allora, cinque minuti di attesa adesso.
 */
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: Infinity,
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
