import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Brain, CalendarCheck, Calculator, Lock, Stethoscope, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import KPICard from '@/components/shared/KPICard';
import { formatCHF, formatDate, formatMonthShort, formatNumber, formatPercent, formatSigned } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { quarterKey, quarterOf, stressLevelFromScore, type AppointmentKind, type Quarter, type StressRecord } from '@/lib/data/types';
import {
  useCompany,
  useCurrentQuarter,
  useDepartments,
  useEarlyAlert,
  useHrReport,
  useLatestStressByDepartment,
  useQuarters,
  useRoiSnapshot,
  useRoiSnapshots,
  useServiceUsage,
  useStressHistory,
} from '@/lib/data/queries';

/*
 * La dashboard HR (CLAUDE.md §10.C.1).
 *
 * Ogni numero viene dal provider e passa da `format.ts`. Il selettore del
 * trimestre cambia davvero i dati: risparmio, adozione, attivi, sessioni e
 * ciambella si rileggono tutti dal periodo scelto.
 *
 * I GRAFICI NON SI ANIMANO IN INGRESSO. Non è una preferenza estetica: la
 * ciambella disegnava i settori vuoti quando l'animazione non completava, cioè
 * la schermata più importante del pitch mostrava un buco a seconda della
 * macchina. Un'animazione d'ingresso è tempo morto da spiegare quanto uno
 * spinner (§5.1), e toglierla rende il rendering deterministico.
 */

const SERVICE_COLORS: Record<AppointmentKind, string> = {
  psychologist: 'hsl(var(--secondary))',
  virtual_doctor: 'hsl(var(--primary))',
  coach: 'hsl(var(--executive))',
  checkup: 'hsl(var(--warning))',
};

const SERVICE_ORDER: AppointmentKind[] = [
  'psychologist',
  'virtual_doctor',
  'coach',
  'checkup',
];

/*
 * Ordine totale sui trimestri: serve a sommare la serie "fino al trimestre
 * scelto" senza passare dalle date, che sui confini di anno sbagliano da sole.
 */
function quarterRank(period: Quarter): number {
  return period.year * 4 + period.quarter;
}

function quarterLabel(period: Quarter, current: Quarter): string {
  const pattern =
    quarterKey(period) === quarterKey(current)
      ? t.hr.quarterLabelInProgress
      : t.hr.quarterLabel;
  return interpolate(pattern, {
    quarter: String(period.quarter),
    year: String(period.year),
  });
}

function scoreOf(record: StressRecord): number | null {
  return record.suppressed ? null : record.score;
}

export default function HRDashboard() {
  const { data: company } = useCompany();
  const { data: quarters } = useQuarters();
  const { data: currentQuarter } = useCurrentQuarter();
  const { data: departments } = useDepartments();
  const { data: latestStress } = useLatestStressByDepartment();
  const { data: companyHistory } = useStressHistory();
  const { data: alert } = useEarlyAlert();
  const { data: usage } = useServiceUsage();
  const { data: snapshots } = useRoiSnapshots();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected =
    quarters?.find((period) => quarterKey(period) === selectedKey) ??
    currentQuarter;

  const { data: snapshot } = useRoiSnapshot(selected);
  const { data: report } = useHrReport(selected);
  const { data: alertHistory } = useStressHistory(alert?.departmentId);

  if (
    !company ||
    !quarters ||
    !currentQuarter ||
    !selected ||
    !departments ||
    !latestStress ||
    !companyHistory ||
    !usage ||
    !snapshots ||
    !snapshot ||
    !report
  ) {
    return null;
  }

  const departmentName = (id: string) =>
    departments.find((department) => department.id === id)?.name ?? id;

  /*
   * La ciambella non ha dati suoi: è la serie sommata fino al trimestre scelto,
   * cioè la stessa grandezza della KPI delle sessioni. Con un dato proprio i
   * due potrebbero divergere, ed è il difetto della schermata ereditata — che
   * diceva 180 sessioni di psicologo accanto a una KPI da 142 (§5.5).
   */
  const cumulative = usage
    .filter((entry) => quarterRank(quarterOf(entry.month)) <= quarterRank(selected))
    .reduce(
      (total, entry) => {
        for (const kind of SERVICE_ORDER) total[kind] += entry.sessions[kind];
        return total;
      },
      { psychologist: 0, virtual_doctor: 0, coach: 0, checkup: 0 } as Record<AppointmentKind, number>,
    );

  const distribution = SERVICE_ORDER.map((kind) => ({
    kind,
    name: t.hr.service[kind],
    value: cumulative[kind],
    color: SERVICE_COLORS[kind],
  }));

  const usageChart = usage.map((entry) => ({
    month: formatMonthShort(entry.month),
    ...entry.sessions,
  }));

  const trendChart = companyHistory.map((record, index) => ({
    month: formatMonthShort(record.month),
    company: scoreOf(record),
    department: alertHistory ? scoreOf(alertHistory[index]) : null,
  }));

  const alertIndex = alert
    ? companyHistory.findIndex(
        (record) => record.month.getTime() === alert.triggeredAt.getTime(),
      )
    : -1;
  const alertPoint =
    alertIndex >= 0 && alertHistory ? scoreOf(alertHistory[alertIndex]) : null;

  const roiChart = [...(snapshots ?? [])].reverse().map((entry) => ({
    short: interpolate(t.hr.quarterShort, {
      quarter: String(entry.period.quarter),
    }),
    saved: entry.savedChf,
    selected: quarterKey(entry.period) === quarterKey(selected),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{t.hr.dashboardTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {interpolate(t.hr.companySubtitle, {
              name: company.name,
              count: formatNumber(company.employeeCount),
              plan: t.plan[company.plan.id],
            })}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Select
            value={quarterKey(selected)}
            onValueChange={(value) => setSelectedKey(value)}
          >
            <SelectTrigger className="w-full sm:w-64" aria-label={t.hr.quarterSelectorLabel}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {quarters.map((period) => (
                <SelectItem key={quarterKey(period)} value={quarterKey(period)}>
                  {quarterLabel(period, currentQuarter)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {alert && (
        <Card className="p-5 bg-warning/15 border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-sm">
                {interpolate(t.hr.alertTitle, {
                  department: departmentName(alert.departmentId),
                })}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {interpolate(t.hr.alertDescription, {
                  months: formatNumber(alert.consecutiveMonths),
                  since: formatDate(alert.triggeredAt),
                })}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center gap-3 bg-accent/60 border border-secondary/20 rounded-lg px-4 py-3">
        <Lock className="w-5 h-5 text-secondary flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          {interpolate(t.hr.privacyNote, {
            threshold: formatNumber(company.anonymityThreshold),
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title={t.hr.kpiSavings}
          value={formatCHF(snapshot.savedChf)}
          subtitle={interpolate(t.hr.kpiSavingsHint, {
            days: formatNumber(snapshot.avoidedAbsenceDays),
          })}
          icon={Calculator}
          variant="secondary"
        />
        <KPICard
          title={t.hr.kpiAdoption}
          value={formatPercent(report.adoptionPercent)}
          subtitle={interpolate(t.hr.kpiAdoptionHint, {
            enrolled: formatNumber(snapshot.enrolledEmployees),
            total: formatNumber(company.employeeCount),
          })}
          icon={Users}
        />
        <KPICard
          title={t.hr.kpiActive}
          value={formatNumber(snapshot.activeEmployees)}
          subtitle={t.hr.kpiActiveHint}
          icon={Brain}
        />
        <KPICard
          title={t.hr.kpiStress}
          value={
            report.stressTrendPoints === null
              ? t.common.none
              : interpolate(t.hr.kpiStressValue, {
                  points: formatSigned(report.stressTrendPoints),
                })
          }
          subtitle={
            report.stressTrendPoints === null
              ? t.hr.kpiStressEmpty
              : t.hr.kpiStressHint
          }
          icon={Stethoscope}
          polarity={
            report.stressTrendPoints === null
              ? undefined
              : { sign: report.stressTrendPoints, goodWhen: 'down' }
          }
        />
        <KPICard
          title={t.hr.kpiSessions}
          value={formatNumber(snapshot.sessionsUsed)}
          subtitle={
            <>
              {interpolate(t.hr.kpiSessionsHint, {
                used: formatNumber(snapshot.sessionsUsed),
                total: formatNumber(snapshot.sessionsTotal),
              })}
              {/* barra sottile: una traccia spessa e quasi vuota si legge come
                  un errore di rendering, e la quota è il 12% (§8) */}
              <span className="mt-2 block h-1 w-full rounded-full bg-muted">
                <span
                  className="block h-1 rounded-full bg-secondary"
                  style={{
                    width: `${(snapshot.sessionsUsed / snapshot.sessionsTotal) * 100}%`,
                  }}
                />
              </span>
            </>
          }
          icon={Brain}
        />
        <KPICard
          title={t.hr.kpiCheckup}
          value={formatPercent(report.checkupCompletionPercent)}
          subtitle={interpolate(t.hr.kpiCheckupHint, {
            done: formatNumber(cumulative.checkup),
            enrolled: formatNumber(snapshot.enrolledEmployees),
          })}
          icon={CalendarCheck}
        />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">{t.hr.stressByDepartment}</h3>
        <div className="space-y-3">
          {latestStress.map((record) => {
            const department = departments.find(
              (entry) => entry.id === record.departmentId,
            );
            if (!department) return null;
            const score = scoreOf(record);
            return (
              <div key={department.id} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-sm font-medium">{department.name}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {interpolate(t.hr.departmentMeta, {
                      employees: formatNumber(department.employeeCount),
                      measured: formatNumber(record.measuredEmployees),
                    })}
                  </p>
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  {score !== null && (
                    <div
                      className={`h-2 rounded-full ${
                        stressLevelFromScore(score) === 'high'
                          ? 'bg-destructive'
                          : stressLevelFromScore(score) === 'medium'
                            ? 'bg-warning'
                            : 'bg-secondary'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  )}
                </div>
                <div className="w-32 flex-shrink-0 text-right">
                  {score === null ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                      title={t.hr.suppressedTooltip}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {t.common.none}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold tabular-nums">
                      {interpolate(t.hr.departmentScore, {
                        percent: formatPercent(score),
                        level: t.hr.stressLevel[stressLevelFromScore(score)],
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">
            {interpolate(t.hr.trendTitle, { months: formatNumber(companyHistory.length) })}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="company"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
                name={t.hr.trendCompany}
              />
              {alert && (
                <Line
                  type="monotone"
                  dataKey="department"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  name={departmentName(alert.departmentId)}
                />
              )}
              {alertPoint !== null && alertIndex >= 0 && (
                <ReferenceDot
                  x={trendChart[alertIndex].month}
                  y={alertPoint}
                  r={6}
                  fill="hsl(var(--warning))"
                  stroke="hsl(var(--foreground))"
                  label={{ value: t.hr.trendAlertMarker, position: 'top', fontSize: 11 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">
            {interpolate(t.hr.usageTitle, { months: formatNumber(usage.length) })}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usageChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {SERVICE_ORDER.map((kind) => (
                <Bar
                  key={kind}
                  dataKey={kind}
                  stackId="services"
                  isAnimationActive={false}
                  fill={SERVICE_COLORS[kind]}
                  name={t.hr.service[kind]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">{t.hr.distributionTitle}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            {interpolate(t.hr.distributionSubtitle, {
              quarter: quarterLabel(selected, currentQuarter),
            })}
          </p>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={distribution} innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={4} isAnimationActive={false}>
                {distribution.map((entry) => (
                  <Cell key={entry.kind} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {distribution.map((entry) => (
              <div key={entry.kind} className="flex items-center gap-1.5 text-xs tabular-nums">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                {interpolate(t.hr.distributionEntry, {
                  service: entry.name,
                  count: formatNumber(entry.value),
                })}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">{t.hr.roiTitle}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roiChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="short" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCHF(value)} />
              {/* il trimestre scelto è pieno, gli altri smorzati: il grafico
                  dice dove si è, senza una legenda che lo spieghi */}
              <Bar dataKey="saved" radius={[4, 4, 0, 0]} isAnimationActive={false} name={t.hr.roiTitle}>
                {roiChart.map((entry) => (
                  <Cell
                    key={entry.short}
                    fill="hsl(var(--secondary))"
                    fillOpacity={entry.selected ? 1 : 0.35}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
