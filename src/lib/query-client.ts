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
      retry: 1,
    },
  },
});
