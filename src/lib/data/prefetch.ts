import type { QueryClient } from "@tanstack/react-query";
import { dataProvider } from "./index";
import { monthKey, queryKeys } from "./query-keys";
import { quarterKey, type CappedServiceKind } from "./types";

/** I due servizi cappati dal piano: la home ne mostra i contatori affiancati. */
const CAPPED_SERVICES: CappedServiceKind[] = ["psychologist", "coach"];

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
  // il reparto in allarme si sa solo chiedendolo, e la dashboard ne mostra la
  // serie accanto a quella aziendale: senza, il grafico del trend parte freddo
  const alert = await dataProvider.getEarlyAlert();
  // la pagina di prenotazione mostra tutto il corpo professionale, e di ognuno
  // la disponibilità: le chiavi si sanno solo dopo aver chiesto chi c'è
  const professionals = await dataProvider.getProfessionals();
  // il referto si chiede per id, e l'id lo porta il check-up già fatto
  const lastCheckup = (await dataProvider.getCheckupEligibility()).lastCompleted;
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
    ...(alert
      ? [
          queryClient.prefetchQuery({
            queryKey: queryKeys.company.stressHistory(alert.departmentId),
            queryFn: () => dataProvider.getStressHistory(alert.departmentId),
          }),
        ]
      : []),
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
      queryKey: queryKeys.company.roiSnapshots(),
      queryFn: () => dataProvider.getRoiSnapshots(),
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
    // percorso dipendente: i due contatori della home, gli appuntamenti, il
    // piano e il check-up. La disponibilità di ogni professionista si scalda
    // più sotto, insieme al corpo professionale
    queryClient.prefetchQuery({
      queryKey: queryKeys.employee.profile(),
      queryFn: () => dataProvider.getEmployeeProfile(),
    }),
    ...CAPPED_SERVICES.map((kind) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.employee.entitlement(kind),
        queryFn: () => dataProvider.getEntitlement(kind),
      }),
    ),
    queryClient.prefetchQuery({
      queryKey: queryKeys.employee.appointments(),
      queryFn: () => dataProvider.getAppointments(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.employee.virtualDoctorConsults(),
      queryFn: () => dataProvider.getVirtualDoctorConsults(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.employee.aiPlan(),
      queryFn: () => dataProvider.getAiHealthPlan(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.employee.rapidCheck(),
      queryFn: () => dataProvider.getRapidCheckAnswer(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.checkup.providers(),
      queryFn: () => dataProvider.getCheckupProviders(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.checkup.eligibility(),
      queryFn: () => dataProvider.getCheckupEligibility(),
    }),
    // il referto si apre in un dialogo, che è un montaggio come un altro: senza
    // questa riga il guardrail lancerebbe al primo clic
    ...(lastCheckup
      ? [
          queryClient.prefetchQuery({
            queryKey: queryKeys.checkup.report(lastCheckup.id),
            queryFn: () => dataProvider.getCheckupReport(lastCheckup.id),
          }),
        ]
      : []),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.all(),
      queryFn: () => dataProvider.getProfessionals(),
    }),

    // back-office: il portafoglio clienti, le dodici mensilità di piattaforma,
    // gli utenti e le richieste demo — che partono da un elenco vuoto e si
    // riempiono durante la demo
    queryClient.prefetchQuery({
      queryKey: queryKeys.platform.clients(),
      queryFn: () => dataProvider.getClientCompanies(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.platform.months(),
      queryFn: () => dataProvider.getPlatformMonths(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.platform.users(),
      queryFn: () => dataProvider.getPlatformUsers(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.platform.demoRequests(),
      queryFn: () => dataProvider.getDemoRequests(),
    }),
    ...professionals.map((professional) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.professional.slots(professional.id),
        queryFn: () => dataProvider.getAvailableSlots(professional.id),
      }),
    ),

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
