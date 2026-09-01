import type { QueryClient } from "@tanstack/react-query";
import { GUARDRAIL_MODE, raiseOutsideCurrentStack } from "./guardrails";
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
 *
 * SEI METODI BLOCCANO IL BOOT, TUTTI GLI ALTRI NO, e la differenza è dove
 * stanno scritti. I sei `await` qui sotto servono a **sapere le chiavi** —
 * l'id del professionista, il reparto in allarme, chi c'è nel corpo
 * professionale — quindi la loro risposta arriva prima che si possa chiedere
 * il resto: se uno di loro fallisce, `prefetchDemo` rifiuta e l'albero non si
 * monta. È il fallimento del bootstrap, e `main.tsx` lo tratta come uno stato.
 * Tutto ciò che passa da `prefetchQuery`, invece, **non può far rifiutare
 * niente**: react-query cattura al suo interno e lascia la query in errore,
 * che è il caso che le schermate mostrano. Da qui la regola per chi aggiunge
 * una chiave: se la si può chiedere senza sapere niente prima, va nel
 * `Promise.all` e non fra gli `await`.
 *
 * In produzione la stessa riga si legge come un costo: sei andate e ritorni
 * prima del primo paint.
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
    /*
     * La sessione (M5.d). Sta fra le `prefetchQuery` e non fra gli `await`
     * perché si può chiedere senza sapere niente prima, che è la regola scritta
     * qui sopra. Scaldarla non è un'ottimizzazione: la legge la guardia di ogni
     * portale, e a cache fredda il guardrail del §5.6 lo direbbe subito.
     */
    queryClient.prefetchQuery({
      queryKey: queryKeys.session(),
      queryFn: () => dataProvider.getSession(),
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
    /*
     * LE FASCE STANNO QUI E NON NEL BLOCCO SU TUTTI I PROFESSIONISTI, ed è la
     * distinzione che le chiavi fanno già.
     *
     * `professional.slots` è una lettura del **marketplace**: chi prenota
     * guarda la disponibilità di chiunque, quindi si scalda per ognuno del
     * corpo professionale, in fondo a questa lista. `ownSlots` è una lettura
     * del **portale**: le fasce le amministra chi le tiene, e di portali ce
     * n'è uno solo — scaldarle per tutti vorrebbe dire precaricare agende che
     * nessuna schermata chiede. Per questo sta nel blocco che ha già
     * `professionalId` in mano, accanto a profilo, sedute, pazienti e
     * compensi: sono tutte letture di quella professionista lì.
     *
     * Senza questa riga il guardrail della cache fredda parlava **a ogni
     * ingresso nel calendario** (02.09.2026). La chiave è nata con la chiusura
     * delle fasce del 01.09.2026 e nessuno l'aveva aggiunta all'elenco: è il
     * punto debole che la testata di questa funzione dichiara — una chiave
     * dimenticata non rompe niente — e in build demo era un `console.error`
     * sulla schermata che il pitch percorre.
     */
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.ownSlots(professionalId),
      queryFn: () => dataProvider.getProfessionalSlots(professionalId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.patients(professionalId),
      queryFn: () => dataProvider.getProfessionalPatients(professionalId),
    }),
    /*
     * La proiezione del back-office è una chiave sua, quindi va scaldata sua:
     * legge le stesse sedute della riga qui sopra, ma per il guardrail della
     * cache fredda sono due letture distinte, come lo sono per il tipo.
     */
    queryClient.prefetchQuery({
      queryKey: queryKeys.professional.platformSessions(professionalId),
      queryFn: () => dataProvider.getPlatformSessions(professionalId),
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
 * Segnala fuori dal ciclo di render — dentro, React lo inghiottirebbe — così in
 * sviluppo Vite lo mostra nel suo overlay. Non tocca il refetch dopo una
 * mutation: lì il dato precedente c'è già, ed è esattamente il caso che non
 * deve allarmare.
 *
 * Il modo lo decide `guardrails.ts` e non questo file (§5.6): in build demo
 * questo controllo logga come tutti gli altri, che è il caso in cui serve di
 * più — uno sfarfallio di scheletro davanti a un investitore è il difetto che
 * `prefetchDemo` esiste per evitare, ed è quello che a schermo si vede meno.
 */
export function assertQueriesArePrewarmed(queryClient: QueryClient): void {
  if (GUARDRAIL_MODE === "off") return;

  queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "observerAdded") return;
    if (event.query.state.data !== undefined) return;
    /*
     * Una query che ha già sbagliato non è una cache fredda, ed è
     * `errorUpdateCount` a dirlo — non `status`.
     *
     * `status === "error"` sembrava bastare, e non bastava: quando un
     * osservatore monta su una query in errore, react-query la **rifà**
     * (`retryOnMount`), e per la durata di quella lettura lo stato torna
     * `pending` con `error: null`. Il secondo osservatore della stessa chiave
     * — la nav e la pagina leggono entrambe l'azienda — arriva proprio lì
     * dentro e vede uno stato indistinguibile da una chiave mai scaldata,
     * quindi si prendeva l'accusa. Misurato: `status: pending`,
     * `fetchStatus: fetching`, `errorUpdateCount: 1`.
     *
     * `errorUpdateCount` conta gli errori registrati e **non si azzera** alla
     * lettura successiva, quindi sopravvive alla finestra in cui `status`
     * mente. Il controllo non poteva sbagliare prima di M5.b, perché niente
     * poteva fallire: è la prima volta che questo ramo viene esercitato.
     */
    if (event.query.state.errorUpdateCount > 0) return;
    /*
     * Una query disabilitata è vuota **di proposito**: `enabled: false` dice
     * che il dato non serve ancora — un id che arriva da un'altra query, un
     * dialogo che non è stato aperto — e prefetcharla riempirebbe la cache di
     * risposte che nessuno ha chiesto. Segnalarla sarebbe chiedere di
     * riparare la cosa giusta.
     *
     * Col dataset di oggi non capita, perché nessuna query è disabilitata: è
     * la prima `enabled` che qualcuno scriverà a incontrare questo controllo,
     * e la troverebbe che accusa lei invece del prefetch.
     */
    const { enabled, meta } = event.observer.options;
    if (enabled === false) return;

    /*
     * Una query può dichiarare che **non è scaldabile**, e allora il controllo
     * non ha niente da chiedere: la sua chiave non si conosce prima del gesto
     * che la produce, quindi `prefetchDemo` non avrebbe potuto metterla in
     * elenco nemmeno volendo. È il caso della nota di sessione, che ha una
     * chiave per seduta e la sceglie un clic.
     *
     * La dichiarazione sta sulla query e non qui, per la stessa ragione per cui
     * `enabled` sta lì: la sa il chiamante, non il guardrail. Chi ne scriverà
     * una seconda non deve tornare a toccare questo file, e chi vuole
     * l'inventario delle esenzioni cerca `coldOnPurpose`.
     *
     * Si legge da `event.observer.options` come `enabled`, non da
     * `event.query.meta`: le esenzioni devono leggersi in fila dallo stesso
     * oggetto, o la prossima somiglia a un caso speciale.
     */
    if (meta?.coldOnPurpose === true) return;

    const key = JSON.stringify(event.query.queryKey);

    /*
     * react-query 5 ammette anche `enabled: (query) => boolean`, e il
     * confronto qui sopra non la vede: una query disabilitata dalla forma
     * funzione arriverebbe in fondo e si prenderebbe l'accusa di cache
     * fredda, che è **esattamente** ciò che il commento qui sopra esiste per
     * impedire — un guardrail che indica la cosa sbagliata da riparare.
     *
     * Non la si risolve chiamandola. Il valore dipende dallo stato della
     * query nel momento in cui react-query la valuta, e replicare qui quella
     * decisione vorrebbe dire tenerne una seconda copia che può divergere
     * dalla libreria. Meglio dichiararsi incompetenti: il guardrail dice che
     * **va aggiornato lui**, e lo dice addosso a chi ha appena introdotto la
     * forma funzione invece che a chi la incontrerà per caso mesi dopo.
     *
     * Oggi non ha chiamanti: le nove `enabled` di `queries.ts` sono tutte
     * booleane. Questo ramo è la prima cosa che si accende il giorno in cui
     * smettono di esserlo.
     */
    if (typeof enabled === "function") {
      raiseOutsideCurrentStack(
        `[query] ${key} decide \`enabled\` con una funzione, e il controllo sulla cache fredda non sa risolverla: aggiorna assertQueriesArePrewarmed in prefetch.ts prima di fidarti di questo avviso.`,
      );
      return;
    }

    raiseOutsideCurrentStack(
      `[query] ${key} si monta a cache fredda: aggiungila a prefetchDemo, altrimenti la schermata parte con uno scheletro.`,
    );
  });
}
