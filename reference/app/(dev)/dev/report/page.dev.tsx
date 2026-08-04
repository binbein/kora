import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { StressTrendChart } from "@/components/kora/stress-trend-chart";
import { Wordmark } from "@/components/kora/wordmark";
import { dataProvider } from "@/lib/data";
import {
  adoptionPercent,
  ANONYMITY_THRESHOLD,
  quarterKey,
  type StressRecord,
} from "@/lib/data/types";
import {
  formatCHF,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { PrintStyles } from "./_print-styles";

/*
 * Sorgente del report trimestrale che la dashboard offre in download
 * (CLAUDE.md §8.A.6).
 *
 * È una pagina interna: si chiama `page.dev.tsx`, quindi in produzione non
 * esiste (§3). Serve a una cosa sola — stamparla in PDF da Chrome e salvare il
 * file in `demo/public/` — e il PDF che ne esce è l'unico artefatto della demo
 * che non si aggiorna da solo: va rifatto ogni volta che cambiano i numeri
 * della dashboard o `DEMO_TODAY` (§5).
 *
 * Ogni cifra viene dal provider e ogni stringa da `it.ts`. È la regola di
 * sempre, ma qui conta il doppio: il documento che un investitore si porta via
 * dopo la presentazione non può dire numeri diversi dallo schermo su cui li ha
 * visti — ed era esattamente ciò che era già successo al file scritto a mano
 * che questa pagina sostituisce.
 */

/* Registro strumento del §4.3: la stessa griglia compatta della dashboard. */
const SECTION_TITLE = "mt-3 text-lg font-semibold text-petrol-900";

/*
 * Il titolo della pagina diventa il titolo del PDF: Chrome ci scrive dentro
 * `document.title`, ed è quello che il lettore vede nella scheda del suo
 * visualizzatore. Ereditando dal layout sarebbe stato "KORA" e basta, che per
 * un allegato del consiglio dice troppo poco.
 */
export const metadata: Metadata = {
  title: t(it.report.documentTitle, {
    company: dataProvider.getCompany().name,
  }),
};

export default function QuarterlyReportPage() {
  const company = dataProvider.getCompany();
  const period = dataProvider.getCurrentQuarter();
  const roi = dataProvider.getRoiSnapshot(period);
  const departments = dataProvider.getDepartments();
  const latestStress = dataProvider.getLatestStressByDepartment();
  const companyHistory = dataProvider.getStressHistory();
  const alert = dataProvider.getEarlyAlert();

  const alertDepartment = alert
    ? departments.find((department) => department.id === alert.departmentId)
    : undefined;
  const alertHistory = alert
    ? dataProvider.getStressHistory(alert.departmentId)
    : [];

  const quarterLabel = t(it.hr.quarterLabel, {
    quarter: period.quarter,
    year: period.year,
  });

  /*
   * Il nome con cui salvare il PDF, costruito dal periodo corrente e non dato
   * per scontato: è la stessa regola che `hr/page.tsx` applica all'indirizzo
   * del download, e le due cose devono coincidere.
   */
  const fileName = `kora-report-trimestrale-${period.year}-q${period.quarter}.pdf`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <PrintStyles />

      {/* Barra di lavoro: non finisce nel PDF. */}
      <div className="no-print mx-auto mb-6 w-[210mm] rounded-card border border-gray-200 bg-white px-5 py-4">
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          KORA · pagina interna
        </p>
        <p className="mt-2 text-gray-700">
          Stampa questa pagina in PDF da Chrome e salvala in{" "}
          <code className="text-petrol-800">demo/public/</code>.
        </p>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-gray-600 sm:grid-cols-[auto_1fr]">
          <dt className="font-medium text-petrol-900">Nome file</dt>
          <dd>
            <code className="text-petrol-800">{fileName}</code>
          </dd>
          <dt className="font-medium text-petrol-900">Impostazioni</dt>
          <dd>
            A4 verticale · margini predefiniti · grafica di sfondo attiva ·
            intestazioni e piè di pagina disattivati
          </dd>
          <dt className="font-medium text-petrol-900">Periodo</dt>
          <dd>{quarterKey(period)}</dd>
        </dl>
      </div>

      {/*
       * Il foglio: A4 pieno a schermo, margini compresi, così quello che si
       * vede è la pagina che esce. In stampa il margine lo mette `@page` e il
       * padding va tolto, altrimenti si sommerebbero.
       *
       * Le misure sono in millimetri e non in unità relative alla finestra: il
       * grafico Recharts si dimensiona misurando il contenitore, che così vale
       * 180mm tanto a schermo quanto in stampa. Vedi `_print-styles.tsx`.
       */}
      <article className="report-sheet mx-auto w-[210mm] bg-white p-[15mm] print:w-full print:p-0">
        <header className="report-block border-b border-gray-200 pb-2">
          <Wordmark className="text-petrol-900" />
          <h1 className="mt-2 text-2xl font-semibold text-petrol-900">
            {t(it.report.documentTitle, { company: company.name })}
          </h1>
          <p className="mt-1 text-gray-600">
            {t(it.report.subtitle, {
              quarter: quarterLabel,
              city: company.city,
              employees: formatNumber(company.employeeCount),
              plan: it.domain.planName[company.plan.id],
            })}
          </p>
        </header>

        {/* --- Sintesi del trimestre ------------------------------------- */}
        <section className="report-block">
          <h2 className={SECTION_TITLE}>{it.report.summaryTitle}</h2>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-6 border-t border-gray-200">
            <SummaryRow
              label={it.report.savingsLabel}
              value={formatCHF(roi.savedChf)}
            />
            <SummaryRow
              label={it.report.avoidedDaysLabel}
              value={formatNumber(roi.avoidedAbsenceDays)}
            />
            <SummaryRow
              label={it.report.adoptionLabel}
              value={formatPercent(adoptionPercent(company, roi))}
              note={t(it.report.adoptionValue, {
                enrolled: formatNumber(roi.enrolledEmployees),
                active: formatNumber(roi.activeEmployees),
              })}
            />
            <SummaryRow
              label={it.report.sessionsLabel}
              value={t(it.report.sessionsValue, {
                used: formatNumber(roi.sessionsUsed),
                total: formatNumber(roi.sessionsTotal),
              })}
            />
          </dl>
        </section>

        {/* --- Stress per reparto ---------------------------------------- */}
        <section className="report-block">
          <h2 className={SECTION_TITLE}>{it.report.stressTitle}</h2>
          <table className="mt-2 w-full text-left">
            <thead>
              <tr className="border-y border-gray-200 text-xs text-gray-600">
                <th className="py-1.5 font-medium">
                  {it.report.columnDepartment}
                </th>
                <th className="py-1.5 text-right font-medium">
                  {it.report.columnHeadcount}
                </th>
                <th className="py-1.5 text-right font-medium">
                  {it.report.columnRespondents}
                </th>
                <th className="py-1.5 pl-6 font-medium">
                  {it.report.columnLevel}
                </th>
                <th className="py-1.5 text-right font-medium">
                  {it.report.columnScore}
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department, index) => (
                <DepartmentRow
                  key={department.id}
                  name={department.name}
                  employeeCount={department.employeeCount}
                  respondents={department.respondents}
                  record={latestStress[index]}
                />
              ))}
            </tbody>
          </table>
        </section>

        {/* --- Trend 12 mesi ---------------------------------------------- */}
        <section className="report-block">
          <h2 className={SECTION_TITLE}>
            {t(it.report.trendTitle, {
              months: formatNumber(companyHistory.length),
            })}
          </h2>
          <p className="mt-1 text-xs text-gray-500">{it.hr.trendNote}</p>
          <div className="mt-2">
            <StressTrendChart
              companyHistory={companyHistory}
              departmentHistory={alertHistory}
              departmentName={alertDepartment?.name ?? it.hr.trendSales}
              alert={alert}
              /* Più basso che in dashboard: qui il grafico divide un A4 con
                 la sintesi e la tabella dei reparti. */
              chartClassName="h-36"
            />
          </div>
        </section>

        {/* --- Alert precoce ---------------------------------------------- */}
        {alert && alertDepartment ? (
          <section className="report-block">
            <h2 className={SECTION_TITLE}>{it.report.alertTitle}</h2>
            <p className="mt-2 text-gray-800">
              {t(it.report.alertBody, {
                department: alertDepartment.name,
                months: formatNumber(alert.consecutiveMonths),
                since: formatDate(alert.triggeredAt),
              })}
            </p>
            <p className="mt-1 text-gray-800">{it.report.alertContrast}</p>
          </section>
        ) : null}

        {/* --- Note di chiusura -------------------------------------------- */}
        <footer className="report-block mt-4 border-t border-gray-200 pt-2">
          <p className="flex items-center gap-1.5 text-xs text-gray-600">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            {t(it.hr.privacyNote, { threshold: ANONYMITY_THRESHOLD })}
          </p>
          <p className="mt-1 text-xs text-gray-500">{it.report.disclaimer}</p>
        </footer>
      </article>
    </div>
  );
}

/** Una riga della sintesi: etichetta a sinistra, valore a destra. */
function SummaryRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <>
      <dt className="border-b border-gray-200 py-1 text-gray-700">{label}</dt>
      <dd className="border-b border-gray-200 py-1 text-right font-medium text-petrol-900 tabular-nums">
        {value}
        {note ? (
          <span className="ml-2 font-normal text-gray-600">{note}</span>
        ) : null}
      </dd>
    </>
  );
}

/*
 * Una riga della tabella stress.
 *
 * Organico e risposte stanno su ogni riga, non solo su quelle sotto soglia:
 * HR + Legale e Direzione hanno lo stesso organico ed esiti opposti (§6), e su
 * carta non c'è un tooltip che possa spiegare la differenza.
 */
function DepartmentRow({
  name,
  employeeCount,
  respondents,
  record,
}: {
  name: string;
  employeeCount: number;
  respondents: number;
  record: StressRecord | undefined;
}) {
  const suppressed = !record || record.suppressed;

  return (
    <tr className="border-b border-gray-200 text-gray-800">
      <td className="py-1">{name}</td>
      <td className="py-1 text-right tabular-nums">
        {formatNumber(employeeCount)}
      </td>
      <td className="py-1 text-right tabular-nums">
        {formatNumber(respondents)}
      </td>
      <td className="py-1 pl-6">
        {suppressed ? (
          <span className="text-gray-600">{it.report.suppressedReason}</span>
        ) : (
          <LevelChip level={record.level} />
        )}
      </td>
      <td className="py-1 text-right tabular-nums">
        {suppressed ? (
          <span className="text-gray-500">{it.common.notAvailable}</span>
        ) : (
          formatPercent(record.score)
        )}
      </td>
    </tr>
  );
}

/*
 * La fascia come chip, con la tinta del §4.1. Il testo sta sempre nel tono
 * scuro della stessa famiglia: mai testo normale su `teal.500` (§4.1).
 */
const LEVEL_STYLE = {
  low: "bg-teal-50 text-petrol-800",
  medium: "bg-warn-bg text-warn-text",
  high: "bg-danger-bg text-danger-text",
} as const;

function LevelChip({ level }: { level: "low" | "medium" | "high" }) {
  return (
    <span
      className={`rounded-chip px-2 py-0.5 text-xs font-medium ${LEVEL_STYLE[level]}`}
    >
      {it.domain.stressLevel[level]}
    </span>
  );
}
