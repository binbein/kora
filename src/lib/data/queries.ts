import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "./index";
import { monthKey, queryKeys } from "./query-keys";

/*
 * Le query dell'area professionista (CLAUDE.md §5.2).
 *
 * Stanno insieme perché ognuna ha più di un chiamante — la stessa lista di
 * sedute alimenta il calendario, le KPI e il conteggio del mese — e perché la
 * coppia chiave/funzione deve restare una sola: scritta due volte diventa due
 * cache per lo stesso dato, e la mutation ne invalida una.
 *
 * Nessuna di queste è mai in caricamento a schermo: `prefetch.ts` le riempie
 * prima del primo paint (§5.1). Le pagine leggono `data` e non `isFetching`,
 * altrimenti un refetch dopo una mutation farebbe lampeggiare la schermata.
 */

export function useReferenceDate() {
  return useQuery({
    queryKey: queryKeys.referenceDate(),
    queryFn: () => dataProvider.getReferenceDate(),
  });
}

export function usePortalProfessionalId() {
  return useQuery({
    queryKey: queryKeys.professional.portalId(),
    queryFn: () => dataProvider.getPortalProfessionalId(),
  });
}

/**
 * Il professionista di cui la demo mostra il portale, in una chiamata sola.
 *
 * Le cinque rotte condividono la sua identità — `ProNav` e `ProProfilo` la
 * mostrano nella stessa schermata — quindi comporre le due query qui evita che
 * una pagina dica un nome e un'altra un altro mentre la seconda si risolve.
 */
export function usePortalProfessional() {
  const { data: professionalId } = usePortalProfessionalId();
  return useProfessional(professionalId);
}

export function useProfessional(professionalId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.professional.profile(professionalId ?? ""),
    queryFn: () => dataProvider.getProfessional(professionalId ?? ""),
    enabled: professionalId !== undefined,
  });
}

/**
 * Tutte le sedute del professionista.
 *
 * Una sola query, non una per periodo: la settimana del calendario, il totale
 * del mese e il conteggio dei pazienti sono **domande diverse sulla stessa
 * lista**, e filtrarla in memoria è ciò che rende impossibile che divergano
 * (§5.5).
 *
 * Il giorno in cui l'agenda vera sarà troppo grande per arrivare tutta, questo
 * metodo prenderà un intervallo e le schermate smetteranno di filtrare — è in
 * `docs/CONTRATTO-DATI.md` §6, che è dove lo legge chi scrive il backend.
 */
export function useProfessionalSessions(professionalId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.professional.sessions(professionalId ?? ""),
    queryFn: () => dataProvider.getProfessionalSessions(professionalId ?? ""),
    enabled: professionalId !== undefined,
  });
}

export function useProfessionalPatients(professionalId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.professional.patients(professionalId ?? ""),
    queryFn: () => dataProvider.getProfessionalPatients(professionalId ?? ""),
    enabled: professionalId !== undefined,
  });
}

export function useProfessionalEarnings(
  professionalId: string | undefined,
  month: Date | undefined,
) {
  return useQuery({
    queryKey: queryKeys.professional.earnings(
      professionalId ?? "",
      month ? monthKey(month) : "",
    ),
    queryFn: () =>
      dataProvider.getProfessionalEarnings(professionalId ?? "", month as Date),
    enabled: professionalId !== undefined && month !== undefined,
  });
}

export function useProfessionalPayouts(professionalId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.professional.payouts(professionalId ?? ""),
    queryFn: () => dataProvider.getProfessionalPayouts(professionalId ?? ""),
    enabled: professionalId !== undefined,
  });
}
