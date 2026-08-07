import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Brain,
  Stethoscope,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import PrivacyBanner from "@/components/shared/PrivacyBanner";
import RapidCheckCard from "@/components/kora/RapidCheckCard";
import { formatDate, formatNumber, formatTime, formatWeekday } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";
import {
  useAiHealthPlan,
  useAppointments,
  useCheckupEligibility,
  useEmployeeProfile,
  useEntitlement,
  useProfessionals,
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
  const { data: entitlement } = useEntitlement(kind);
  if (!entitlement) return null;

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
          <Icon className={`w-5 h-5 ${iconClass}`} />
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
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </Button>
    </Card>
  );
}

function AppointmentRow({
  appointment,
  professional,
}: {
  appointment: Appointment;
  professional: Professional | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">
          {professional ? professionalDisplayName(professional) : ""}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {interpolate(t.employee.home.appointmentWhen, {
            weekday: formatWeekday(appointment.start),
            date: formatDate(appointment.start),
            time: formatTime(appointment.start),
          })}
        </p>
      </div>
      <Badge variant="outline" className="flex-shrink-0">
        {t.sessionType[appointment.type]}
      </Badge>
    </div>
  );
}

export default function EmployeeHome() {
  const { data: profile } = useEmployeeProfile();
  const { data: appointments } = useAppointments();
  const { data: professionals } = useProfessionals();
  const { data: plan } = useAiHealthPlan();
  const { data: checkup } = useCheckupEligibility();

  if (!profile || !appointments || !professionals || !plan || !checkup) {
    return null;
  }

  const scheduledFor = (kind: CappedServiceKind) =>
    appointments.filter((appointment) => appointment.kind === kind).length;

  /*
   * Il consiglio viene dall'area su cui il piano si apre, che è quella debole
   * del profilo. Nel codice ereditato era un testo scritto in pagina che
   * consigliava di prenotare un check-up entro 30 giorni — a una persona che il
   * check-up l'ha già fatto a marzo.
   */
  const weakest = plan.areas[0];
  // le chiavi degli obiettivi sono un insieme aperto sul contratto, quindi la
  // mappa si legge come tale invece di far finta che siano cinque note
  const goals: Record<string, string> = t.employee.aiPlan.goal;

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
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/10">
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
          <CalendarDays className="w-4 h-4 text-secondary" />
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
          buttonClass="bg-secondary hover:bg-secondary/90"
          to="/employee/psicologi"
        />
        <ServiceCounter
          kind="coach"
          icon={Sparkles}
          scheduled={scheduledFor("coach")}
          iconWrapClass="bg-executive/10"
          iconClass="text-executive"
          buttonClass="bg-executive hover:bg-executive/90"
          to="/employee/psicologi?servizio=coach"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Stethoscope,
            label: t.employee.home.quickAction.doctor,
            path: "/employee/medico",
            color: "bg-primary/10 text-primary",
            badge: null,
          },
          {
            icon: ClipboardCheck,
            label: t.employee.home.quickAction.checkup,
            path: "/employee/checkup",
            color: "bg-secondary/10 text-secondary",
            // il check-up è già stato fatto: il badge lo dice invece di
            // proporlo come disponibile, che è ciò che l'elenco HR smentirebbe
            badge:
              checkup.lastCompleted?.status === "completed"
                ? t.employee.home.checkupDone
                : null,
          },
          {
            icon: Sparkles,
            label: t.employee.home.quickAction.aiPlan,
            path: "/employee/piano-ai",
            color: "bg-executive/10 text-executive",
            badge: null,
          },
          {
            icon: Heart,
            label: t.employee.home.quickAction.profile,
            path: "/employee/profilo",
            color: "bg-accent text-accent-foreground",
            badge: null,
          },
        ].map(({ icon: Icon, label, path, color, badge }) => (
          <Link key={path} to={path}>
            <Card className="p-4 hover:shadow-md transition-shadow text-center relative h-full">
              {badge && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] hover:bg-secondary">
                  {badge}
                </Badge>
              )}
              <div className={`p-2.5 ${color} rounded-xl w-fit mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">
              {t.employee.home.planTitle}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {goals[weakest.goalKey]}
            </p>
            <Button size="sm" variant="outline" className="mt-3" asChild>
              <Link to="/employee/piano-ai">{t.employee.home.planCta}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
