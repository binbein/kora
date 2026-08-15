import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "./index";
import { monthKey, queryKeys } from "./query-keys";
import { quarterKey, type CappedServiceKind, type Quarter } from "./types";

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

/*
 * LA REGOLA DEI TRE CASI, scritta una volta (CLAUDE.md §4, blocco b di M5).
 *
 *   data === undefined  → in attesa      (si sospende, mai su `isFetching`)
 *   isError             → guasto         (stato d'errore, con "Riprova")
 *   qualunque altro      → arrivato      — e può essere `null` o una lista
 *                                          vuota, che sono valori legittimi
 *                                          (`docs/CONTRATTO-DATI.md` §2)
 *
 * Fino a M5.b le schermate scrivevano `if (!dato) return null`, che confonde
 * tutti e tre: un trimestre senza snapshot — `null` per contratto — usciva
 * identico a un dato non ancora arrivato e a uno che non arriverà mai, cioè
 * una pagina bianca senza spiegazione.
 *
 * QUESTA FUNZIONE NON CONOSCE LE FORME, ed è la sua unica regola: non sa cosa
 * sia vuoto, perché il vuoto di una lista è `[]` e quello di uno slot è
 * `null`, e un classificatore che li conoscesse tutti sarebbe il secondo
 * elenco che diverge dal primo. **A decidere il vuoto è la schermata**, che
 * quel dato lo mostra.
 *
 * L'errore vince sull'attesa: se qualcosa è già fallito, aspettare il resto
 * lascerebbe a schermo una sospensione che non finisce.
 *
 * `retry` rilegge **le sole query rotte**, non tutte: dopo una lettura fallita
 * non c'è ragione di far rileggere mezza schermata a chi è arrivato bene.
 */
export type LoadState = "loading" | "error" | "ready";

/** La superficie di `useQuery` che serve a classificare, e nient'altro. */
type QueryLike = {
  data: unknown;
  isError: boolean;
  refetch: () => unknown;
};

export function loadState(queries: readonly QueryLike[]): {
  state: LoadState;
  retry: () => void;
} {
  const state: LoadState = queries.some((query) => query.isError)
    ? "error"
    : queries.some((query) => query.data === undefined)
      ? "loading"
      : "ready";

  return {
    state,
    retry: () => {
      for (const query of queries) if (query.isError) query.refetch();
    },
  };
}

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

/**
 * La nota privata di una seduta, per riaprirla dove la si era lasciata.
 *
 * È **il primo lettore di `getSessionNote`**, che il contratto esponeva senza
 * chiamanti (§2). La chiave sta sotto la radice del professionista, quindi
 * `saveSessionNote` — che invalida la radice — se la porta dietro: è la ragione
 * per cui il commento di `query-keys.ts` la mise lì, e questo è il momento in
 * cui quella scelta si dimostra invece di restare una precauzione.
 */
export function useSessionNote(
  professionalId: string | undefined,
  sessionId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.professional.sessionNote(
      professionalId ?? "",
      sessionId ?? "",
    ),
    queryFn: () => dataProvider.getSessionNote(sessionId ?? ""),
    enabled: professionalId !== undefined && sessionId !== undefined,
    /*
     * QUESTA CHIAVE NON È SCALDABILE, e lo dice qui invece di farlo scoprire al
     * guardrail della cache fredda (`prefetch.ts`).
     *
     * Dipende dalla seduta aperta: c'è una chiave per ognuna delle 63 erogate,
     * e quale serva lo decide un clic. `prefetchDemo` non può conoscerla prima,
     * e scaldarle tutte vorrebbe dire tirare **la nota clinica di ogni seduta
     * di ogni paziente** nella cache del client prima che qualcuno apra un
     * dialogo — il contrario di ciò che il §10.D promette di quel testo, e la
     * decisione peggiore da lasciare in eredità a `prefetchDemo` il giorno in
     * cui dietro c'è una `fetch`.
     *
     * Non è la stessa cosa del referto del check-up, che si scalda: quello è il
     * documento di chi sta guardando la propria pagina, questa è la nota che
     * una professionista ha scritto su un paziente.
     */
    meta: { coldOnPurpose: true },
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

/*
 * Le query del percorso dipendente (§10.B).
 *
 * Le due scritture — la prenotazione e il check rapido — non stanno qui ma nelle
 * schermate che le usano, come `saveSessionNote`: hanno un chiamante solo, e una
 * `useMutation` avvolta in un hook che nessun altro chiama è il wrapper che il
 * §11 non vuole. Le letture invece sono qui perché più di una schermata legge lo
 * stesso dato — i contatori stanno in home e nel profilo, gli appuntamenti in
 * home e nella prenotazione.
 */

/** Il corpo professionale, per chi deve sceglierne uno. */
export function useProfessionals() {
  return useQuery({
    queryKey: queryKeys.professional.all(),
    queryFn: () => dataProvider.getProfessionals(),
  });
}

export function useAvailableSlots(professionalId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.professional.slots(professionalId ?? ""),
    queryFn: () => dataProvider.getAvailableSlots(professionalId ?? ""),
    enabled: professionalId !== undefined,
  });
}

export function useEmployeeProfile() {
  return useQuery({
    queryKey: queryKeys.employee.profile(),
    queryFn: () => dataProvider.getEmployeeProfile(),
  });
}

export function useEntitlement(kind: CappedServiceKind) {
  return useQuery({
    queryKey: queryKeys.employee.entitlement(kind),
    queryFn: () => dataProvider.getEntitlement(kind),
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.employee.appointments(),
    queryFn: () => dataProvider.getAppointments(),
  });
}

export function useVirtualDoctorConsults() {
  return useQuery({
    queryKey: queryKeys.employee.virtualDoctorConsults(),
    queryFn: () => dataProvider.getVirtualDoctorConsults(),
  });
}

export function useAiHealthPlan() {
  return useQuery({
    queryKey: queryKeys.employee.aiPlan(),
    queryFn: () => dataProvider.getAiHealthPlan(),
  });
}

export function useRapidCheckAnswer() {
  return useQuery({
    queryKey: queryKeys.employee.rapidCheck(),
    queryFn: () => dataProvider.getRapidCheckAnswer(),
  });
}

export function useCheckupProviders() {
  return useQuery({
    queryKey: queryKeys.checkup.providers(),
    queryFn: () => dataProvider.getCheckupProviders(),
  });
}

export function useCheckupEligibility() {
  return useQuery({
    queryKey: queryKeys.checkup.eligibility(),
    queryFn: () => dataProvider.getCheckupEligibility(),
  });
}

/*
 * Le query del back-office (§10.E).
 *
 * Nessuna di queste esisteva prima: il §5.2 vuole che una lettura nasca quando
 * il dato esiste, e il portafoglio clienti non aveva nessuno che lo leggesse
 * finché l'area viveva sulle proprie costanti.
 */

export function useClientCompanies() {
  return useQuery({
    queryKey: queryKeys.platform.clients(),
    queryFn: () => dataProvider.getClientCompanies(),
  });
}

export function usePlatformMonths() {
  return useQuery({
    queryKey: queryKeys.platform.months(),
    queryFn: () => dataProvider.getPlatformMonths(),
  });
}

export function usePlatformUsers() {
  return useQuery({
    queryKey: queryKeys.platform.users(),
    queryFn: () => dataProvider.getPlatformUsers(),
  });
}

/**
 * Le richieste arrivate dal form pubblico.
 *
 * È la lettura che chiude il giro di `submitDemoRequest`: da qui la mutation ha
 * qualcosa da invalidare, e una richiesta compilata durante la demo compare qui
 * senza ricaricare (`docs/CONTRATTO-DATI.md` §4).
 */
export function useDemoRequests() {
  return useQuery({
    queryKey: queryKeys.platform.demoRequests(),
    queryFn: () => dataProvider.getDemoRequests(),
  });
}

export function useCheckupReport(bookingId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.checkup.report(bookingId ?? ""),
    queryFn: () => dataProvider.getCheckupReport(bookingId ?? ""),
    enabled: bookingId !== undefined,
  });
}
