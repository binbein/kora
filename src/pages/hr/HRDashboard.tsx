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
import PrivacyBanner from '@/components/shared/PrivacyBanner';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';
import { formatCHF, formatDate, formatMonthShort, formatNumber, formatPercent, formatSigned } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { quarterKey, quarterOf, stressLevelFromScore, type AppointmentKind, type Company, type Quarter, type StressRecord } from '@/lib/data/types';
import {
  loadState,
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

/**
 * Il primo e l'ultimo punto pubblicabile di una serie, per la legenda.
 *
 * Salta i mesi soppressi invece di prendere gli estremi dell'array: un reparto
 * sotto soglia non ha un punteggio, e leggerlo come "da null a 46" darebbe una
 * frase rotta. `null` quando la serie non ha nemmeno due punti da confrontare.
 */
function extremesOf(
  series: (number | null)[],
): { from: number; to: number } | null {
  const published = series.filter((value): value is number => value !== null);
  if (published.length < 2) return null;
  return { from: published[0], to: published[published.length - 1] };
}

/** Il titolo della pagina e l'azienda a cui si riferisce. */
function DashboardHeader({
  company,
}: {
  company: Company;
}) {
  return (
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
  );
}

/*
 * LA CORNICE DEL TRIMESTRE (founder, 17.08.2026).
 *
 * Il selettore stava nell'intestazione della pagina e sembrava comandarla
 * tutta. Non è così, ed è misurato: **lo seguono otto elementi** — le sei KPI,
 * la ciambella della distribuzione (cumulata fino al trimestre scelto) e
 * l'evidenziazione nel grafico del risparmio. Non lo seguono il banner
 * dell'alert, lo stress per reparto (che mostra l'ultimo mese), il trend a
 * dodici mesi e l'utilizzo dei servizi.
 *
 * La cornice è la risposta: **quello che segue il trimestre sta dentro, con il
 * selettore in cima**, e tutto il resto sta fuori e sotto. Il selettore non è
 * più un comando della pagina, è il comando di questo blocco — e la posizione
 * lo dice senza una frase che lo spieghi.
 *
 * **I due banner restano sopra la cornice**, e non ci entrano: sono avvisi, e
 * la loro posizione è parte dell'informazione.
 */
function QuarterFrame({
  quarters,
  currentQuarter,
  selected,
  onSelect,
  children,
}: {
  quarters: Quarter[];
  currentQuarter: Quarter;
  selected: Quarter;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 space-y-6 border-2 bg-muted/40">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="font-semibold">{t.hr.quarterFrameTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t.hr.quarterFrameHint}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Select value={quarterKey(selected)} onValueChange={onSelect}>
            <SelectTrigger
              className="w-full sm:w-64 bg-card"
              aria-label={t.hr.quarterSelectorLabel}
            >
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
      {children}
    </Card>
  );
}

export default function HRDashboard() {
  const companyQuery = useCompany();
  const quartersQuery = useQuarters();
  const currentQuarterQuery = useCurrentQuarter();
  const departmentsQuery = useDepartments();
  const latestStressQuery = useLatestStressByDepartment();
  const companyHistoryQuery = useStressHistory();
  const alertQuery = useEarlyAlert();
  const usageQuery = useServiceUsage();
  const snapshotsQuery = useRoiSnapshots();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected =
    quartersQuery.data?.find((period) => quarterKey(period) === selectedKey) ??
    currentQuarterQuery.data;

  const snapshotQuery = useRoiSnapshot(selected);
  const reportQuery = useHrReport(selected);
  const alertHistoryQuery = useStressHistory(alertQuery.data?.departmentId);

  /*
   * I TRE CASI, DISTRICATI (CLAUDE.md §4, blocco b di M5). Qui c'era un `if` a
   * undici condizioni con `!dato`, e due di quelle condizioni erano slot che il
   * contratto dichiara **nullable**: `getRoiSnapshot` e `getHrReport`
   * restituiscono `null` per un trimestre che non ha dati
   * (`docs/CONTRATTO-DATI.md` §2). Un trimestre legittimamente vuoto usciva
   * quindi identico a una pagina in caricamento e a una rotta — cioè bianca.
   */
  const page = loadState([
    companyQuery,
    quartersQuery,
    currentQuarterQuery,
    departmentsQuery,
    latestStressQuery,
    companyHistoryQuery,
    alertQuery,
    alertHistoryQuery,
    usageQuery,
    snapshotsQuery,
    snapshotQuery,
    reportQuery,
  ]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const company = companyQuery.data;
  const quarters = quartersQuery.data;
  const currentQuarter = currentQuarterQuery.data;
  const departments = departmentsQuery.data;
  const latestStress = latestStressQuery.data;
  const companyHistory = companyHistoryQuery.data;
  const alert = alertQuery.data;
  const usage = usageQuery.data;
  const snapshots = snapshotsQuery.data;
  const snapshot = snapshotQuery.data;
  const report = reportQuery.data;

  /*
   * IN ATTESA: si guarda `undefined`, e solo lui. Il `null` non entra qui — è
   * un valore arrivato, e sotto ha il suo ramo.
   */
  if (
    company === undefined ||
    quarters === undefined ||
    currentQuarter === undefined ||
    selected === undefined ||
    departments === undefined ||
    latestStress === undefined ||
    companyHistory === undefined ||
    alert === undefined ||
    usage === undefined ||
    snapshots === undefined ||
    snapshot === undefined ||
    report === undefined
  ) {
    return null;
  }

  /*
   * VUOTO LEGITTIMO: il trimestre scelto non ha né snapshot né report. Non è un
   * guasto e non si dice con un errore. **L'intestazione resta**, perché il
   * selettore è il modo di uscirne: senza, cambiare trimestre porterebbe in un
   * vicolo cieco (§10).
   */
  if (snapshot === null || report === null) {
    return (
      <div className="space-y-6">
        <DashboardHeader company={company} />
        {/*
          * La cornice resta anche qui, e non è simmetria: **il selettore è il
          * modo di uscire da un trimestre senza dati**, e ora vive lì dentro.
          * Senza, questo ramo sarebbe il vicolo cieco che il §10 vieta.
          */}
        <QuarterFrame
          quarters={quarters}
          currentQuarter={currentQuarter}
          selected={selected}
          onSelect={setSelectedKey}
        >
          <EmptyNotice text={t.hr.quarterEmpty} />
        </QuarterFrame>
      </div>
    );
  }

  /*
   * La serie del reparto in allerta esiste solo se l'allerta esiste.
   * `useStressHistory(undefined)` è per contratto la serie **aziendale**,
   * quindi senza questa riga un dataset senza alert disegnerebbe due volte la
   * stessa linea, una sopra l'altra, chiamandone una col nome di un reparto.
   */
  const alertHistory = alert ? alertHistoryQuery.data : undefined;

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

  /*
   * LE DUE SERIE SI ALLINEANO PER MESE, NON PER POSIZIONE.
   *
   * Il punto del reparto si prendeva con l'indice della serie aziendale, che
   * vale finché le due hanno la stessa lunghezza — cosa che il contratto non
   * promette da nessuna parte. Un reparto entrato in azienda a metà finestra ha
   * meno record, e la schermata su cui si regge il pitch disegnerebbe il mese
   * sbagliato sotto il mese giusto, o leggerebbe un record che non c'è.
   *
   * La chiave è il tempo del mese, cioè la stessa con cui `alertIndex` qui
   * sotto trova il mese dell'alert: quel calcolo era già per mese, ed è la
   * ragione per cui il difetto si vedeva solo di lato — l'indice giusto veniva
   * poi usato per pescare da un'altra serie. `alertIndex` resta un indice
   * perché indicizza `trendChart`, che nasce da `companyHistory` uno a uno.
   */
  const departmentByMonth = new Map(
    (alertHistory ?? []).map((record) => [record.month.getTime(), record]),
  );

  const trendChart = companyHistory.map((record) => {
    const department = departmentByMonth.get(record.month.getTime());
    return {
      month: formatMonthShort(record.month),
      company: scoreOf(record),
      department: department ? scoreOf(department) : null,
    };
  });

  const alertIndex = alert
    ? companyHistory.findIndex(
        (record) => record.month.getTime() === alert.triggeredAt.getTime(),
      )
    : -1;

  const alertRecord = alert
    ? departmentByMonth.get(alert.triggeredAt.getTime())
    : undefined;
  const alertPoint = alertRecord ? scoreOf(alertRecord) : null;

  /*
   * Le due frasi della legenda del trend.
   *
   * Il contrasto fra la media piatta e le Vendite che si staccano è la frase
   * che il pitch pronuncia, e `it.ts` la dichiarava da M3 senza che nessuno la
   * rendesse: la <Legend/> di recharts mostrava i soli nomi delle serie.
   *
   * Gli estremi si **leggono dalle serie** (§5.5): scritti a mano sarebbero il
   * quinto e il sesto numero pinnato sugli stessi dodici mesi, e smetterebbero
   * di corrispondere alla linea disegnata sopra di loro.
   */
  const companyEnds = extremesOf(trendChart.map((point) => point.company));
  const departmentEnds = extremesOf(trendChart.map((point) => point.department));

  const trendLegend: Record<string, string | null> = {
    company: companyEnds
      ? interpolate(t.hr.trendCompanyLegend, {
          from: formatPercent(companyEnds.from),
          to: formatPercent(companyEnds.to),
        })
      : null,
    department:
      departmentEnds && alertIndex >= 0
        ? interpolate(t.hr.trendDepartmentLegend, {
            from: formatPercent(departmentEnds.from),
            to: formatPercent(departmentEnds.to),
            month: formatNumber(alertIndex + 1),
          })
        : null,
  };

  const roiChart = [...(snapshots ?? [])].reverse().map((entry) => ({
    short: interpolate(t.hr.quarterShort, {
      quarter: String(entry.period.quarter),
    }),
    saved: entry.savedChf,
    selected: quarterKey(entry.period) === quarterKey(selected),
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader company={company} />

      {alert && (
        <Card className="p-5 bg-warning/15 border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
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

      <PrivacyBanner
        icon={Lock}
        message={interpolate(t.hr.privacyNote, {
          threshold: formatNumber(company.anonymityThreshold),
        })}
      />

      {/*
        * Dentro la cornice: le sei KPI, la ciambella e il grafico del
        * risparmio. Sono gli otto elementi che seguono il selettore, e sono
        * tutti e soli quelli.
        */}
      <QuarterFrame
        quarters={quarters}
        currentQuarter={currentQuarter}
        selected={selected}
        onSelect={setSelectedKey}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title={t.hr.kpiSavings}
            value={formatCHF(snapshot.savedChf)}
            subtitle={interpolate(t.hr.kpiSavingsHint, {
              days: formatNumber(snapshot.avoidedAbsenceDays),
            })}
            icon={Calculator}
            variant="accent"
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

        <div className="grid lg:grid-cols-2 gap-6">
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
              {/* Ogni numero a schermo passa da `format.ts` (§11), e il tooltip
                  di recharts è a schermo quanto il resto: senza `formatter` i
                  valori escono dal formattatore predefinito della libreria. */}
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
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
          <h3 className="font-semibold">{t.hr.roiTitle}</h3>
          {/* Dentro una cornice che dice "trimestre selezionato" un grafico a
              quattro barre va spiegato: senza, sembra che dovrebbe mostrarne
              una sola. */}
          <p className="text-xs text-muted-foreground mb-4">{t.hr.roiSubtitle}</p>
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
      </QuarterFrame>

      {/*
        * Fuori dalla cornice: quello che parla dell'ultimo mese o dei dodici,
        * e che il selettore non tocca. **Ognuno dichiara il proprio periodo nel
        * titolo** — "ultimo mese", "ultimi {months} mesi" — perché spostare i
        * blocchi senza dirlo sposterebbe la confusione invece di toglierla.
        */}
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
                {/*
                  * `w-40` E NON `w-32`, E A DECIDERLO È IL TEDESCO.
                  *
                  * L'etichetta più lunga della colonna è "Unter der Schwelle",
                  * che con il lucchetto e il suo gap misura **146px**: in
                  * `w-32` (128px) andava a capo, e `w-36` (144) non sarebbe
                  * bastato per due pixel. L'inglese ne chiede 126, l'italiano
                  * 98. I punteggi degli altri reparti stanno sotto i 98 in
                  * tutte e quattro le lingue, quindi la larghezza la detta
                  * questa riga (§2.7: niente larghezze fisse che il tedesco
                  * non regge).
                  */}
                <div className="w-40 flex-shrink-0 text-right">
                  {score === null ? (
                    /*
                     * L'ETICHETTA DICE PERCHÉ, E NON LO DICE UN HOVER.
                     *
                     * Qui c'era `t.common.none`, cioè un trattino, e il motivo
                     * stava nel solo `title`: un tooltip nativo compare dopo un
                     * secondo di fermata, non esiste sul touch, e in una demo
                     * proiettata non lo vede nessuno. Questa è la riga che
                     * dimostra la garanzia di privacy dell'intero prodotto, e
                     * si leggeva come un dato mancante.
                     *
                     * Il `title` resta, ed è diventato la spiegazione lunga di
                     * un'etichetta che ora si legge da sola.
                     */
                    <span
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                      title={t.hr.suppressedTooltip}
                    >
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.hr.suppressed}
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
              {/* Punteggi di stress: la tabella qui sopra li scrive con
                  `formatPercent`, e due rese dello stesso numero nella stessa
                  schermata sono due numeri che possono divergere (§5.5). */}
              <Tooltip formatter={(value) => formatPercent(Number(value))} />
              <Legend
                content={({ payload }) => (
                  <ul className="mt-2 space-y-1">
                    {(payload ?? []).map((item) => (
                      <li
                        key={String(item.dataKey)}
                        className="flex items-baseline gap-2 text-xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 translate-y-0.5"
                          style={{ background: item.color }}
                        />
                        <span className="font-medium">{item.value}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {trendLegend[String(item.dataKey)]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              />
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
                  /* L'ETICHETTA HA UN COLORE, E PRIMA NO. Senza `fill`
                     recharts la disegna con il proprio grigio predefinito,
                     `#808080`, che su fondo bianco dà **3.95:1** a 11px: sotto
                     l'AA per il testo normale, su un testo informativo — dice
                     su quale mese cade l'alert. Era il nodo che teneva falso
                     lo "zero" del §6.1 dal 18.08.2026, e non l'aveva visto
                     nessun censimento perché è un `fill` dentro un `<svg>` e
                     non un nodo di testo del DOM.

                     `muted-foreground` e non `foreground`: **5.10:1**, sopra
                     la soglia, e resta nella gerarchia del grafico — il
                     marker è il segno, l'etichetta lo nomina e non deve
                     competere con lui. */
                  label={{
                    value: t.hr.trendAlertMarker,
                    position: 'top',
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
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
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
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
      </div>
    </div>
  );
}
