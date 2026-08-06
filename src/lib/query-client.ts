import { QueryClient } from "@tanstack/react-query";

/*
 * Il client di react-query, unico per l'applicazione (CLAUDE.md §5.2).
 *
 * `refetchOnWindowFocus: false` c'è dal primo commit e non si toglie: durante
 * una presentazione dal vivo si passa continuamente fra finestra e schermate,
 * e un refetch al focus rimetterebbe in movimento dati che erano fermi.
 */
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
