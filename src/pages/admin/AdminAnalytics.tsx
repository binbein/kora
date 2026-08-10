import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Briefcase, TrendingUp, Users } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import { useClientCompanies, usePlatformMonths } from "@/lib/data/queries";
import {
  activationPercent,
  currentPlatformMonth,
} from "@/lib/platform-metrics";
import type { AppointmentKind, PlanId } from "@/lib/data/types";
import {
  formatCHF,
  formatMonthShort,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * L'analytics di piattaforma (CLAUDE.md §10.E).
 *
 * OGNI NUMERO È DERIVATO. La schermata ereditata teneva quattro array di
 * costanti in cima al file, e da lì venivano i suoi difetti: "618 utenti
 * attivi" accanto a un tasso di attivazione dell'84% che ne implicava 767, e
 * un revenue mensile che non tornava con l'elenco delle aziende della
 * schermata accanto. Qui il portafoglio clienti è la sola sorgente, e i due
 * numeri del ricavo si confermano a vicenda: il mensile per dodici è la somma
 * dei ricavi annui dell'elenco, e un guardrail lo verifica sul dataset.
 *
 * NESSUNA ANIMAZIONE D'INGRESSO, su nessuna delle cinque serie (§6.2): il
 * rendering è deterministico, e un difetto di dati si distingue da un
 * fotogramma catturato troppo presto. È la regola nata dalla ciambella della
 * dashboard HR, che mostrava i settori vuoti perché l'animazione non
 * completava — e questa è l'area che il §6.2 nomina come quella che la eredita.
 */

const SERVICE_COLOR: Record<AppointmentKind, string> = {
  psychologist: "hsl(var(--secondary))",
  virtual_doctor: "hsl(var(--primary))",
  coach: "hsl(var(--executive))",
  checkup: "hsl(var(--warning))",
};

const PLAN_COLOR: Record<PlanId, string> = {
  essenziale: "hsl(var(--muted-foreground))",
  plus: "hsl(var(--secondary))",
  executive: "hsl(var(--executive))",
};

const SERVICE_KINDS: AppointmentKind[] = [
  "psychologist",
  "virtual_doctor",
  "coach",
  "checkup",
];

export default function AdminAnalytics() {
  const { data: months } = usePlatformMonths();
  const { data: companies } = useClientCompanies();

  if (!months || !companies) return null;

  const current = currentPlatformMonth(months);
  if (!current) return null;

  const currentSessions = SERVICE_KINDS.reduce(
    (sum, kind) => sum + current.sessions[kind],
    0,
  );

  const activation = activationPercent(current);

  const series = months.map((entry) => ({
    label: formatMonthShort(entry.month),
    revenue: entry.recurringRevenueChf,
    sessions: SERVICE_KINDS.reduce(
      (sum, kind) => sum + entry.sessions[kind],
      0,
    ),
    activation: activationPercent(entry),
  }));

  /* Il mix piani conta le aziende, non i dipendenti: è la domanda "che taglio
     ha il portafoglio", non "quanti posti abbiamo venduto". */
  const planMix = (["essenziale", "plus", "executive"] as PlanId[])
    .map((planId) => ({
      planId,
      name: t.plan[planId],
      value: companies.filter((company) => company.planId === planId).length,
    }))
    .filter((entry) => entry.value > 0);

  /* La ripartizione per servizio è la somma della serie sui dodici mesi, non
     un secondo conteggio: è la stessa regola della ciambella della dashboard
     HR (§5.5). */
  const serviceMix = SERVICE_KINDS.map((kind) => ({
    kind,
    name: t.hr.service[kind],
    value: months.reduce((sum, entry) => sum + entry.sessions[kind], 0),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">
        {t.admin.analytics.title}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.admin.analytics.kpiRevenue}
          value={formatCHF(current.recurringRevenueChf)}
          subtitle={interpolate(t.admin.analytics.kpiRevenueHint, {
            amount: formatCHF(current.recurringRevenueChf * 12),
          })}
          icon={TrendingUp}
          variant="accent"
        />
        <KPICard
          title={t.admin.analytics.kpiSessions}
          value={formatNumber(currentSessions)}
          icon={Briefcase}
        />
        <KPICard
          title={t.admin.analytics.kpiEnrolled}
          value={formatNumber(current.enrolledEmployees)}
          icon={Users}
        />
        <KPICard
          title={t.admin.analytics.kpiActivation}
          value={formatPercent(activation)}
          subtitle={interpolate(t.admin.analytics.kpiActivationHint, {
            enrolled: formatNumber(current.enrolledEmployees),
            covered: formatNumber(current.coveredEmployees),
          })}
          icon={BarChart3}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t.admin.analytics.revenueChart}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={series}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) => formatNumber(value / 1000)}
                />
                <Tooltip formatter={(value) => formatCHF(Number(value))} />
                <Bar
                  dataKey="revenue"
                  name={t.admin.analytics.revenueChart}
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t.admin.analytics.sessionsChart}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={series}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name={t.admin.analytics.sessionsChart}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t.admin.analytics.planMixChart}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={planMix}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                  label={({ name, value }) =>
                    interpolate(t.admin.analytics.planMixEntry, {
                      plan: String(name),
                      count: formatNumber(Number(value)),
                    })
                  }
                >
                  {planMix.map((entry) => (
                    <Cell key={entry.planId} fill={PLAN_COLOR[entry.planId]} />
                  ))}
                </Pie>
                {/* "1 azienda" e "2 aziende" sono due frasi: il singolare
                    cambia la parola, non solo il numero (§2.7). */}
                <Tooltip
                  formatter={(value) =>
                    Number(value) === 1
                      ? t.admin.analytics.planMixOne
                      : interpolate(t.admin.analytics.planMixMany, {
                          count: formatNumber(Number(value)),
                        })
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t.admin.analytics.activationChart}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={series}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) => formatPercent(value)}
                />
                <Tooltip formatter={(value) => formatPercent(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="activation"
                  name={t.admin.analytics.activationChart}
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t.admin.analytics.serviceMixChart}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={serviceMix} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                // largo abbastanza da non mandare a capo "Medico virtuale", e
                // con margine per il tedesco, che allunga di circa un terzo
                width={140}
              />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar
                dataKey="value"
                name={t.admin.analytics.serviceMixChart}
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {serviceMix.map((entry) => (
                  <Cell key={entry.kind} fill={SERVICE_COLOR[entry.kind]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
