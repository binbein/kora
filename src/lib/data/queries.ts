import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "./index";
import { monthKey, queryKeys } from "./query-keys";
import { quarterKey, type Quarter } from "./types";

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

/*
 * Le query dell'area HR (§10.C).
 *
 * Il periodo entra nella chiave come stringa e non come oggetto: due `Quarter`
 * con gli stessi campi sono due oggetti diversi, e react-query confronta le
 * chiavi per struttura — una chiave con dentro una `Date` o un oggetto nuovo a
 * ogni render rifarebbe la query a ogni giro.
 */

export function useCompany() {
  return useQuery({
    queryKey: queryKeys.company.profile(),
    queryFn: () => dataProvider.getCompany(),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.company.departments(),
    queryFn: () => dataProvider.getDepartments(),
  });
}

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.company.plans(),
    queryFn: () => dataProvider.getPlans(),
  });
}

/** Senza `departmentId` è la serie aggregata dell'azienda. */
export function useStressHistory(departmentId?: string) {
  return useQuery({
    queryKey: queryKeys.company.stressHistory(departmentId),
    queryFn: () => dataProvider.getStressHistory(departmentId),
  });
}

export function useLatestStressByDepartment() {
  return useQuery({
    queryKey: queryKeys.company.latestStress(),
    queryFn: () => dataProvider.getLatestStressByDepartment(),
  });
}

export function useEarlyAlert() {
  return useQuery({
    queryKey: queryKeys.company.earlyAlert(),
    queryFn: () => dataProvider.getEarlyAlert(),
  });
}

export function useQuarters() {
  return useQuery({
    queryKey: queryKeys.company.quarters(),
    queryFn: () => dataProvider.getQuarters(),
  });
}

export function useCurrentQuarter() {
  return useQuery({
    queryKey: queryKeys.company.currentQuarter(),
    queryFn: () => dataProvider.getCurrentQuarter(),
  });
}

export function useRoiSnapshot(period: Quarter | undefined) {
  return useQuery({
    queryKey: queryKeys.company.roiSnapshot(period ? quarterKey(period) : ""),
    queryFn: () => dataProvider.getRoiSnapshot(period as Quarter),
    enabled: period !== undefined,
  });
}

export function useRoiSnapshots() {
  return useQuery({
    queryKey: queryKeys.company.roiSnapshots(),
    queryFn: () => dataProvider.getRoiSnapshots(),
  });
}

export function useServiceUsage() {
  return useQuery({
    queryKey: queryKeys.company.serviceUsage(),
    queryFn: () => dataProvider.getServiceUsage(),
  });
}

export function useHrReport(period: Quarter | undefined) {
  return useQuery({
    queryKey: queryKeys.company.report(period ? quarterKey(period) : ""),
    queryFn: () => dataProvider.getHrReport(period as Quarter),
    enabled: period !== undefined,
  });
}

export function useEmployeeDirectory() {
  return useQuery({
    queryKey: queryKeys.company.directory(),
    queryFn: () => dataProvider.getEmployeeDirectory(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.company.invoices(),
    queryFn: () => dataProvider.getInvoices(),
  });
}
