import type { QueryClient } from "@tanstack/react-query";
import { dataProvider } from "./index";
import { monthKey, queryKeys } from "./query-keys";
import { quarterKey } from "./types";

/*
 * La cache si scalda prima del primo paint (CLAUDE.md §5.1).
 *
 * Il provider è asincrono, ma durante il pitch non si deve vedere uno spinner.
 * Il mock risolve in un microtask, e questo da solo non basta: React
 * renderizzerebbe comunque una volta con la query ancora vuota, cioè un
 * fotogramma di scheletri. Riempiendo la cache **prima** di montare l'albero,
 * ogni schermata trova il dato già lì e il primo render è pieno.
 *
 * L'attesa è invisibile perché il dataset è in memoria. Il giorno in cui dietro
 * c'è una `fetch` vera questa funzione diventa il punto in cui si decide cosa
 * vale la pena precaricare e cosa no — ed è una decisione sola, in un file
 * solo, invece che venticinque decisioni sparse.
 *
 * L'elenco cresce con le aree. È anche il suo punto debole: una chiave
 * dimenticata non rompe niente, fa uno sfarfallio — e lo fa davanti a un
 * investitore. Per questo c'è il controllo qui sotto.
 */
export async function prefetchDemo(queryClient: QueryClient): Promise<void> {
  const professionalId = await dataProvider.getPortalProfessionalId();
  const referenceDate = await dataProvider.getReferenceDate();
  const quarters = await dataProvider.getQuarters();
  const month = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
  );

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.referenceDate(),
      queryFn: () => dataProvider.getReferenceDate(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.portalId(),
      queryFn: () => dataProvider.getPortalProfessionalId(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.profile(professionalId),
      queryFn: () => dataProvider.getProfessional(professionalId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.sessions(professionalId),
      queryFn: () => dataProvider.getProfessionalSessions(professionalId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.patients(professionalId),
      queryFn: () => dataProvider.getProfessionalPatients(professionalId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.earnings(professionalId, monthKey(month)),
      queryFn: () => dataProvider.getProfessionalEarnings(professionalId, month),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.payouts(professionalId),
      queryFn: () => dataProvider.getProfessionalPayouts(professionalId),
    }),

    // area HR: il selettore può aprire qualunque trimestre senza attese, quindi
    // si scaldano tutti e quattro invece del solo corrente
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.profile(),
      queryFn: () => dataProvider.getCompany(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.departments(),
      queryFn: () => dataProvider.getDepartments(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.plans(),
      queryFn: () => dataProvider.getPlans(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.stressHistory(undefined),
      queryFn: () => dataProvider.getStressHistory(undefined),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.latestStress(),
      queryFn: () => dataProvider.getLatestStressByDepartment(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.earlyAlert(),
      queryFn: () => dataProvider.getEarlyAlert(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.quarters(),
      queryFn: () => dataProvider.getQuarters(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.currentQuarter(),
      queryFn: () => dataProvider.getCurrentQuarter(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.serviceUsage(),
      queryFn: () => dataProvider.getServiceUsage(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.directory(),
      queryFn: () => dataProvider.getEmployeeDirectory(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.company.invoices(),
      queryFn: () => dataProvider.getInvoices(),
    }),
    ...quarters.flatMap((period) => [
      queryClient.prefetchQuery({
        queryKey: queryKeys.company.roiSnapshot(quarterKey(period)),
        queryFn: () => dataProvider.getRoiSnapshot(period),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.company.report(quarterKey(period)),
        queryFn: () => dataProvider.getHrReport(period),
      }),
    ]),
  ]);
}

/*
 * Guardrail (§5.6): segnala una query che si monta a cache fredda.
 *
 * È il controllo che protegge la promessa del §5.1, e l'unico modo per
 * accorgersi che `prefetchDemo` ha perso una chiave: senza, il difetto si vede
 * solo come un lampo di scheletro, cioè in un fotogramma, cioè quasi mai
 * mentre si lavora e sempre davanti a chi guarda.
 *
 * Lancia fuori dal ciclo di render — dentro, React lo inghiottirebbe — così
 * Vite lo mostra nel suo overlay. Non tocca il refetch dopo una mutation: lì il
 * dato precedente c'è già, ed è esattamente il caso che non deve allarmare.
 */
export function assertQueriesArePrewarmed(queryClient: QueryClient): void {
  if (!import.meta.env.DEV) return;

  queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "observerAdded") return;
    if (event.query.state.data !== undefined) return;
    if (event.query.state.status === "error") return;

    const key = JSON.stringify(event.query.queryKey);
    queueMicrotask(() => {
      throw new Error(
        `[query] ${key} si monta a cache fredda: aggiungila a prefetchDemo, altrimenti la schermata parte con uno scheletro.`,
      );
    });
  });
}
