"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Download,
  FileText,
  PiggyBank,
  TrendingUp,
  Users,
} from "lucide-react";
import { AlertBanner } from "@/components/kora/alert-banner";
import { HrHeader } from "@/components/kora/hr-header";
import { PrivacyNote } from "@/components/kora/privacy-note";
import { QuarterSelector } from "@/components/kora/quarter-selector";
import { StatCard } from "@/components/kora/stat-card";
import { StressBar } from "@/components/kora/stress-bar";
import { StressTrendChart } from "@/components/kora/stress-trend-chart";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import {
  adoptionPercent,
  quarterKey,
  quarterOf,
  sameQuarter,
  type Quarter,
  type StressRecord,
} from "@/lib/data/types";
import {
  formatCHF,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Dashboard HR (CLAUDE.md §8.A). Registro strumento: compatto, terza persona,
 * densità alta. Regge da 1280px in su.
 *
 * Il selettore trimestre cambia davvero i dati: risparmio, adozione, sessioni
 * e stress aziendale vengono tutti dallo snapshot del periodo scelto. Il
 * grafico a 12 mesi resta invece una finestra mobile sull'ultimo anno, ed è
 * per questo che il titolo lo dice.
 */

/*
 * Il report è un PDF statico, generato a parte e messo in `/public` (§8.A.6).
 * Dentro ha i numeri di un trimestre preciso, e il nome del file lo dichiara.
 *
 * È l'unica cosa della dashboard che `DEMO_TODAY` non si porta dietro: girando
 * quella manopola (§5) il selettore aprirebbe su un altro periodo e il pulsante
 * continuerebbe a scaricare questo documento, con dentro le cifre di un
 * trimestre che non è più quello a schermo. Il controllo qui sotto lo dice in
 * sviluppo, come quello di `mock/roi.ts`, perché è un disallineamento che a
 * schermo non si vede: il pulsante funziona lo stesso.
 *
 * Il periodo è quindi l'unico dato: l'indirizzo si costruisce da lì. Tenerli
 * come due costanti separate voleva dire poterli far divergere fra loro — un
 * nome file aggiornato e un periodo no, e il controllo qui sotto avrebbe
 * taciuto proprio nel caso che deve prendere. Rigenerando il report si cambia
 * `REPORT_PERIOD`, si rinomina il file di conseguenza, e basta.
 */
const REPORT_PERIOD: Quarter = { year: 2026, quarter: 3 };

function reportHref(period: Quarter): string {
  return `/kora-report-trimestrale-${period.year}-q${period.quarter}.pdf`;
}

if (process.env.NODE_ENV === "development") {
  const current = dataProvider.getCurrentQuarter();
  if (!sameQuarter(REPORT_PERIOD, current)) {
    throw new Error(
      `Il report in /public è di ${quarterKey(REPORT_PERIOD)}, ma il trimestre corrente è ${quarterKey(current)}: va rigenerato e rinominato, altrimenti la dashboard scarica i numeri di un altro periodo.`,
    );
  }
}

/** Ultima rilevazione dell'azienda che cade dentro il trimestre scelto. */
function companyStressForQuarter(
  history: StressRecord[],
  period: Quarter,
): StressRecord | undefined {
  const inQuarter = history.filter((record) =>
    sameQuarter(quarterOf(record.month), period),
  );
  return inQuarter[inQuarter.length - 1];
}

export default function HrDashboardPage() {
  const company = dataProvider.getCompany();
  const departments = dataProvider.getDepartments();
  const latestStress = dataProvider.getLatestStressByDepartment();
  const quarters = dataProvider.getQuarters();
  const alert = dataProvider.getEarlyAlert();

  const currentQuarter = dataProvider.getCurrentQuarter();
  const [period, setPeriod] = useState<Quarter>(currentQuarter);
  const roi = dataProvider.getRoiSnapshot(period);

  /*
   * Il trimestre in corso è parziale, e i trimestri chiusi mostrano solo
   * dati: niente alert, che è un segnale sullo stato di oggi, e niente
   * pulsante di download, che è un'azione.
   */
  const isCurrentQuarter = sameQuarter(period, currentQuarter);

  const companyHistory = dataProvider.getStressHistory();
  const companyStress = companyStressForQuarter(companyHistory, period);

  const alertDepartment = alert
    ? departments.find((department) => department.id === alert.departmentId)
    : undefined;
  const alertHistory = alert
    ? dataProvider.getStressHistory(alert.departmentId)
    : [];

  /*
   * Quanti reparti sono migliorati sull'intera finestra, sui soli reparti
   * pubblicabili.
   *
   * Il denominatore contava tutti e sei, Direzione compresa, ma la Direzione
   * è sotto soglia ed è esclusa dalla media aziendale: non può comparire nel
   * conteggio che descrive quella media. Il numeratore la escludeva già, per
   * il semplice fatto che una serie tutta soppressa non può calare, quindi
   * "4 su 6" metteva a confronto due insiemi diversi.
   *
   * Entrambi i numeri vengono dai dati, non da una stringa.
   */
  const publishableDepartments = departments.filter((department) =>
    dataProvider
      .getStressHistory(department.id)
      .some((record) => !record.suppressed),
  );

  const decliningCount = publishableDepartments.filter((department) => {
    const series = dataProvider
      .getStressHistory(department.id)
      .filter((record) => !record.suppressed);
    if (series.length < 2) return false;
    const first = series[0];
    const last = series[series.length - 1];
    return !first.suppressed && !last.suppressed && last.score < first.score;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <HrHeader
        company={company}
        action={
          <QuarterSelector
            quarters={quarters}
            value={period}
            currentQuarter={currentQuarter}
            onChange={setPeriod}
          />
        }
      />

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/*
         * Sui trimestri chiusi il banner sparisce ma il suo spazio resta:
         * `invisible` toglie la vista senza togliere l'ingombro, così
         * cambiando periodo il resto della pagina non salta sotto gli occhi.
         * `inert` lo tiene fuori da tastiera e screen reader.
         */}
        {alert && alertDepartment ? (
          <div
            inert={!isCurrentQuarter}
            className={cn(!isCurrentQuarter && "invisible")}
          >
            <AlertBanner
              title={t(it.hr.alertTitle, { department: alertDepartment.name })}
              description={t(it.hr.alertDescription, {
                months: formatNumber(alert.consecutiveMonths),
                since: formatDate(alert.triggeredAt),
              })}
            />
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-4">
          <StatCard
            label={it.hr.kpiSavings}
            value={formatCHF(roi.savedChf)}
            hint={t(it.hr.savingsHint, {
              days: formatNumber(roi.avoidedAbsenceDays),
            })}
            badge={isCurrentQuarter ? it.hr.quarterInProgress : undefined}
            icon={<PiggyBank className="size-4" />}
          />
          <StatCard
            label={it.hr.kpiAdoption}
            value={formatPercent(adoptionPercent(company, roi))}
            hint={t(it.hr.adoptionHint, {
              enrolled: formatNumber(roi.enrolledEmployees),
              active: formatNumber(roi.activeEmployees),
            })}
            icon={<Users className="size-4" />}
          />
          <StatCard
            label={it.hr.kpiStress}
            value={
              companyStress && !companyStress.suppressed
                ? it.domain.stressLevel[companyStress.level]
                : it.common.notAvailable
            }
            hint={t(it.hr.stressHint, {
              declining: formatNumber(decliningCount),
              total: formatNumber(publishableDepartments.length),
              months: formatNumber(companyHistory.length),
            })}
            tone="warn"
            icon={<TrendingUp className="size-4" />}
          />
          {/*
           * Il valore è il solo numero di sessioni consumate: "142/1'200" a
           * schermo intero si legge male a distanza, e il denominatore è già
           * nel sottotitolo. La quota resta, come barra sottile.
           */}
          <StatCard
            label={it.hr.kpiSessions}
            value={formatNumber(roi.sessionsUsed)}
            hint={t(it.hr.sessionsHint, {
              used: formatNumber(roi.sessionsUsed),
              total: formatNumber(roi.sessionsTotal),
            })}
            progressPercent={
              roi.sessionsTotal > 0
                ? (roi.sessionsUsed / roi.sessionsTotal) * 100
                : 0
            }
            icon={<BadgeCheck className="size-4" />}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-card border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-petrol-900">
              {it.hr.stressByDepartment}
            </h2>
            <div className="mt-3 divide-y divide-gray-200">
              {departments.map((department, index) => (
                <StressBar
                  key={department.id}
                  departmentName={department.name}
                  employeeCount={department.employeeCount}
                  respondents={department.respondents}
                  record={latestStress[index]}
                />
              ))}
            </div>
            <PrivacyNote className="mt-4" />
          </section>

          <section className="rounded-card border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-petrol-900">
              {t(it.hr.trendTitle, {
                months: formatNumber(companyHistory.length),
              })}
            </h2>
            <p className="mt-1 text-xs text-gray-500">{it.hr.trendNote}</p>
            <div className="mt-4">
              <StressTrendChart
                companyHistory={companyHistory}
                departmentHistory={alertHistory}
                departmentName={alertDepartment?.name ?? it.hr.trendSales}
                alert={alert}
              />
            </div>
          </section>
        </div>

        <section className="flex flex-wrap items-center gap-4 rounded-card border border-gray-200 bg-white p-5">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-card bg-teal-50 text-petrol-700"
            aria-hidden="true"
          >
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-petrol-900">{it.hr.reportTitle}</h2>
            <p className="mt-0.5 text-gray-600">
              {isCurrentQuarter
                ? t(it.hr.reportDescription, {
                    quarter: t(it.hr.quarterLabel, {
                      quarter: period.quarter,
                      year: period.year,
                    }),
                  })
                : it.hr.reportOnlyCurrent}
            </p>
          </div>
          {/*
           * Nessun pulsante sui trimestri chiusi. Il PDF esiste solo per il
           * trimestre in corso, e un pulsante che scarica il documento di un
           * altro periodo sarebbe peggio della sua assenza.
           */}
          {isCurrentQuarter ? (
            <Button asChild>
              <a href={reportHref(REPORT_PERIOD)} download>
                <Download className="size-4" />
                {it.hr.reportAction}
              </a>
            </Button>
          ) : null}
        </section>
      </main>
    </div>
  );
}
