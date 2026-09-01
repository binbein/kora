import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Stethoscope,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import PrivacyBanner from "@/components/shared/PrivacyBanner";
import RapidCheckCard from "@/components/kora/RapidCheckCard";
import { ErrorNotice } from "@/components/kora/StateNotice";
import { formatDate, formatNumber, formatTime, formatWeekday } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";
import {
  loadState,
  useAiHealthPlan,
  useAppointments,
  useCheckupEligibility,
  useCompany,
  useEmployeeProfile,
  useEntitlement,
  useProfessionals,
  useVirtualDoctorConsults,
} from "@/lib/data/queries";
import {
  professionalDisplayName,
  type Appointment,
  type CappedServiceKind,
  type Professional,
} from "@/lib/data/types";

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display tabular-nums">
          {formatNumber(score)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {t.employee.home.scoreOutOf}
        </span>
      </div>
    </div>
  );
}

/*
 * Il contatore di un servizio cappato.
 *
 * Le usate e le prenotate sono due numeri diversi e la frase li tiene distinti:
 * `used` conta le sedute erogate, e prenotare non lo fa salire (§10.B). La barra
 * segue le usate, che è ciò che il piano consuma.
 */
/*
 * Le classi arrivano intere e non composte da un tono: Tailwind genera solo le
 * classi che trova scritte nel sorgente, quindi un `bg-${tone}/10` non
 * produrrebbe nessuno stile e il riquadro uscirebbe senza sfondo.
 */
function ServiceCounter({
  kind,
  icon: Icon,
  scheduled,
  iconWrapClass,
  iconClass,
  buttonClass,
  to,
}: {
  kind: CappedServiceKind;
  icon: typeof Brain;
  scheduled: number;
  iconWrapClass: string;
  iconClass: string;
  buttonClass: string;
  to: string;
}) {
  const entitlementQuery = useEntitlement(kind);

  /* La card ha una lettura sua, quindi ha i suoi tre casi: un contatore che
     non arriva non porta via la home. */
  const card = loadState([entitlementQuery]);
  if (card.state === "error") {
    return (
      <Card className="p-5 rounded-2xl">
        <ErrorNotice copy={t.employee.state.error} onRetry={card.retry} />
      </Card>
    );
  }
  const entitlement = entitlementQuery.data;
  if (entitlement === undefined) return null;

  const line =
    scheduled > 0
      ? interpolate(t.employee.home.sessionsWithScheduled, {
          used: formatNumber(entitlement.used),
          total: formatNumber(entitlement.total),
          scheduled: formatNumber(scheduled),
        })
      : interpolate(t.employee.home.sessions, {
          used: formatNumber(entitlement.used),
          total: formatNumber(entitlement.total),
        });

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${iconWrapClass}`}>
          <Icon className={`w-5 h-5 ${iconClass}`} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold">{t.employee.service[kind]}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{line}</p>
        </div>
      </div>
      <Progress
        value={(entitlement.used / entitlement.total) * 100}
        className="h-2 mb-3"
      />
      <Button size="sm" className={`w-full ${buttonClass}`} asChild>
        <Link to={to}>
          {t.employee.home.book}
          <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
        </Link>
      </Button>
    </Card>
  );
}

/*
 * LA RIGA DICE ANCHE CHE UNA SEDUTA È STATA ANNULLATA (18.08.2026).
 *
 * Prima la lettura dava le sole `scheduled`, quindi una disdetta della
 * professionista faceva sparire la riga: chi aveva prenotato non aveva nessun
 * modo di saperlo. Adesso la seduta **resta al suo posto** con il suo stato e
 * con chi l'ha annullata.
 *
 * SENZA NESSUN GESTO, ed è una scelta: un avviso che si toglie sarebbe una
 * scrittura nuova sul provider per un gesto che nessuno ha chiesto, e uno che
 * resta per sempre sarebbe il vicolo cieco del §10. Sparisce da sé quando la
 * sua ora passa, perché da lì non è più un appuntamento.
 *
 * Il tono è quello del portale professionista, dove l'annullata ha già una
 * resa: `destructive-strong` sul testo, token base sul bordo (§6.1).
 */
function AppointmentRow({
  appointment,
  professional,
}: {
  appointment: Appointment;
  professional: Professional | undefined;
}) {
  const cancelled = appointment.status === "cancelled";
  const professionalName = professional
    ? professionalDisplayName(professional)
    : "";

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{professionalName}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {interpolate(t.employee.home.appointmentWhen, {
            weekday: formatWeekday(appointment.start),
            date: formatDate(appointment.start),
            time: formatTime(appointment.start),
          })}
        </p>
        {/* Il motivo è opzionale sul tipo — assente vuol dire che la seduta non
            è annullata — quindi la frase nasce con lui. La **nota** della
            professionista non arriva da questa parte: non è un campo di
            `Appointment` (§3 del contratto). Il **messaggio** sì, ed è la riga
            qui sotto. */}
        {cancelled && appointment.cancellationReasonKey && (
          <p className="text-xs text-destructive-strong mt-1">
            {appointment.cancellationReasonKey === "by_professional"
              ? interpolate(
                  t.employee.home.appointmentCancelledByProfessional,
                  { professional: professionalName },
                )
              : t.employee.home.appointmentCancelledByPatient}
          </p>
        )}
        {/*
          * LA RIGA CHE LA PROFESSIONISTA HA SCRITTO AL PAZIENTE (01.09.2026).
          *
          * Sta sotto chi ha annullato perché è il seguito di quella frase: la
          * disdetta è il fatto, questa è la voce di chi l'ha decisa. **Si
          * stacca dal testo di sistema** — filetto a sinistra, testo su
          * `foreground` e un corpo più grande delle due righe sopra — perché a
          * parlare non è più la piattaforma, e leggerla nel grigio degli avvisi
          * la farebbe sembrare un'altra riga di log.
          *
          * **Ed è attribuita**: senza il nome davanti, un "sono malata" senza
          * soggetto è la piattaforma che dice una cosa che non può aver detto.
          *
          * Nasce con il campo, che è `?`: assente vuol dire che un messaggio
          * non c'è — la seduta non è annullata, oppure lo è senza che nessuno
          * abbia scritto niente.
          */}
        {appointment.cancellationMessage && (
          <div className="mt-2 border-l-2 border-secondary/40 pl-3">
            <p className="text-xs text-muted-foreground">
              {interpolate(t.employee.home.appointmentMessageFrom, {
                professional: professionalName,
              })}
            </p>
            <p className="text-sm text-foreground mt-0.5">
              {appointment.cancellationMessage}
            </p>
          </div>
        )}
      </div>
      <Badge
        variant="outline"
        className={
          cancelled
            ? "flex-shrink-0 text-destructive-strong border-destructive/30"
            : "flex-shrink-0"
        }
      >
        {cancelled
          ? t.employee.home.appointmentCancelled
          : t.sessionType[appointment.type]}
      </Badge>
    </div>
  );
}

export default function EmployeeHome() {
  const profileQuery = useEmployeeProfile();
  const appointmentsQuery = useAppointments();
  const professionalsQuery = useProfessionals();
  const planQuery = useAiHealthPlan();
  const checkupQuery = useCheckupEligibility();
  /* I consulti si contano dalla lista, non da uno scalare: due numeri che
     descrivono la stessa cosa devono essere lo stesso numero (§5.5), ed è la
     stessa lettura che il profilo mostra come conteggio. */
  const consultsQuery = useVirtualDoctorConsults();
  /* L'azienda serve per il suo piano: quali servizi cappati esistono lo dice il
     contratto commerciale, non il contatore. Vedi i due `ServiceCounter`. */
  const companyQuery = useCompany();

  /* I tre casi (M5.b), registro consumer. Gli appuntamenti vuoti sono un caso
     previsto e hanno già la loro frase più sotto. */
  const page = loadState([
    profileQuery,
    appointmentsQuery,
    professionalsQuery,
    planQuery,
    checkupQuery,
    consultsQuery,
    companyQuery,
  ]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.employee.state.error} onRetry={page.retry} />;
  }

  const profile = profileQuery.data;
  const appointments = appointmentsQuery.data;
  const professionals = professionalsQuery.data;
  const plan = planQuery.data;
  const checkup = checkupQuery.data;
  const consults = consultsQuery.data;
  const company = companyQuery.data;
  if (
    profile === undefined ||
    appointments === undefined ||
    professionals === undefined ||
    plan === undefined ||
    checkup === undefined ||
    consults === undefined ||
    company === undefined
  ) {
    return null;
  }

  /*
   * IL FILTRO SULLO STATO STA QUI, NON NELLA LETTURA (18.08.2026).
   *
   * `getAppointments` porta anche le annullate ancora future, perché la riga
   * qui sopra deve poterle mostrare; **il contatore conta le sole in
   * programma**, o la frase "{scheduled} in programma" salirebbe di uno
   * annullando — cioè direbbe il falso nel momento esatto in cui il dipendente
   * scopre che la seduta non c'è più.
   */
  const scheduledFor = (kind: CappedServiceKind) =>
    appointments.filter(
      (appointment) =>
        appointment.kind === kind && appointment.status === "scheduled",
    ).length;

  /*
   * Il consiglio viene dall'area su cui il piano si apre, che è quella debole
   * del profilo. Nel codice ereditato era un testo scritto in pagina che
   * consigliava di prenotare un check-up entro 30 giorni — a una persona che il
   * check-up l'ha già fatto a marzo.
   */
  const weakest = plan.areas[0];
  const goals = t.employee.aiPlan.goal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {interpolate(t.employee.home.greeting, { name: profile.firstName })}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.employee.home.subtitle}
        </p>
      </div>

      <PrivacyBanner message={t.employee.privacy} />

      <RapidCheckCard />

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={profile.healthProfile.score} />
          <div className="flex-1 w-full">
            <h2 className="font-semibold mb-2">{t.employee.home.healthTitle}</h2>
            <Badge className="bg-secondary/10 text-secondary-strong hover:bg-secondary/10">
              {t.healthSummary[profile.healthProfile.summaryKey]}
            </Badge>
            <p className="text-sm font-medium mt-3">
              {t.employee.home.weakestArea[profile.healthProfile.weakestArea]}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.employee.home.weakestAreaHint}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-secondary" aria-hidden="true" />
          {t.employee.home.appointmentsTitle}
        </h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">
            {t.employee.home.appointmentsEmpty}
          </p>
        ) : (
          <div className="mt-2">
            {appointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                professional={professionals.find(
                  (entry) => entry.id === appointment.professionalId,
                )}
              />
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ServiceCounter
          kind="psychologist"
          icon={Brain}
          scheduled={scheduledFor("psychologist")}
          iconWrapClass="bg-secondary/10"
          iconClass="text-secondary"
          buttonClass="bg-primary hover:bg-primary/90 text-primary-foreground"
          to="/employee/psychologists"
        />
        {/*
          * IL CONTATORE COACH ESISTE SOLO SE IL PIANO HA IL COACH.
          *
          * A dirlo è il piano e non il contatore: `coachSessionsPerYear`
          * assente significa che il contratto commerciale non prevede il
          * servizio (§9), ed è la stessa convenzione con cui le card del
          * listino saltano le voci che il piano non ha.
          *
          * Senza questa riga, su un Essenziale la card diceva "1 su 0" e la
          * barra riceveva un valore non finito — `coachEntitlement` fa
          * `?? 0` perché il tipo vuole un numero. Il guardrail che lo vieta
          * vive in sviluppo, quindi nella build che si deploya si sarebbe
          * rotto in silenzio.
          */}
        {company.plan.coachSessionsPerYear !== undefined && (
          <ServiceCounter
            kind="coach"
            icon={Sparkles}
            scheduled={scheduledFor("coach")}
            iconWrapClass="bg-executive/10"
            iconClass="text-executive"
            buttonClass="bg-executive hover:bg-executive/90"
            to="/employee/psychologists?service=coach"
          />
        )}
      </div>

      {/*
        * DUE DATI AL POSTO DI QUATTRO SCORCIATOIE (17.08.2026).
        *
        * Qui c'erano quattro tessere verso medico virtuale, check-up, piano di
        * prevenzione e profilo: **quattro delle sei voci del menu di sinistra**,
        * cioè la stessa strada disegnata due volte. Al loro posto due cose che
        * la home non diceva e che stavano solo dentro `/employee/profile`.
        *
        * **Non sono link, ed è la ragione per cui esistono**: rifarli
        * cliccabili rimetterebbe la duplicazione da cui si è partiti. Al medico
        * virtuale e al check-up si va dal menu, che è dove si va per andare da
        * qualche parte.
        *
        * Nessun dato nuovo: `getCheckupEligibility` e
        * `getVirtualDoctorConsults` erano già letti da questa pagina e dal
        * profilo.
        */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/*
          * Il check-up c'è solo se il piano lo prevede, con la stessa regola
          * del contatore coach: a dirlo è il contratto commerciale (§9), non la
          * card. Sull'Essenziale `availableFrom` è `null` per quel motivo, e
          * "Da prenotare" direbbe che manca un gesto invece che un servizio.
          */}
        {company.plan.checkup && (
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <ClipboardCheck className="w-5 h-5 text-secondary" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                  {t.employee.home.checkupTitle}
                  {/*
                    * Il badge "Fatto" non è decorazione: il §8 vuole che il
                    * check-up completato di Laura si legga uguale in home, nel
                    * profilo e nell'elenco dell'HR. Sta su menta chiara e non
                    * sul teal pieno: a 10px il bianco su `secondary` è molto
                    * sotto l'AA (§6.1).
                    */}
                  {checkup.lastCompleted?.status === "completed" && (
                    <Badge className="bg-accent text-accent-foreground text-[10px] hover:bg-accent">
                      {t.employee.home.checkupDone}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {checkup.availableFrom
                    ? interpolate(t.employee.home.checkupNext, {
                        date: formatDate(checkup.availableFrom),
                      })
                    : t.employee.home.checkupToBook}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Stethoscope className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {t.employee.home.doctorTitle}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {interpolate(t.employee.home.doctorConsults, {
                  n: formatNumber(consults.length),
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-secondary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">
              {t.employee.home.planTitle}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {goals[weakest.goalKey]}
            </p>
            <Button size="sm" variant="outline" className="mt-3" asChild>
              <Link to="/employee/ai-plan">{t.employee.home.planCta}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
