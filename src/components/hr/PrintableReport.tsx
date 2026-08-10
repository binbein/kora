import { Lock } from "lucide-react";
import { formatCHF, formatDate, formatNumber, formatPercent, formatSigned } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";
import type { Company, HrReport, Plan, Quarter, RoiSnapshot } from "@/lib/data/types";

/*
 * La vista di stampa del report (CLAUDE.md §10.C.3).
 *
 * NON È UN DOCUMENTO PARALLELO. Riceve gli stessi oggetti che la schermata
 * mostra — `HrReport` e `RoiSnapshot` del trimestre scelto — quindi il PDF e la
 * pagina dicono lo stesso numero perché leggono lo stesso dato, non perché
 * qualcuno li ha riallineati (§5.5).
 *
 * LARGHEZZA FISSA IN PIXEL, e non è una scelta di layout: lo spike ha misurato
 * che a scheda nascosta `innerWidth` vale 0 e con lui collassa **ogni catena
 * `width: 100%`** — documentElement, body, e qualunque contenitore che erediti
 * la larghezza. Un contenitore in px è immune, ed è ciò che rende la cattura
 * identica alla cifra tra scheda in primo piano e scheda nascosta. Per la
 * stessa ragione qui non c'è nessun `ResponsiveContainer`.
 *
 * Il componente non ha stato, non chiama hook e non legge il provider: lo monta
 * il generatore, lo cattura e lo smonta. Tenerlo puro è ciò che permette di
 * renderizzarlo fuori schermo senza che si comporti diversamente.
 */

/** A4 a 96 dpi. La misura che il §10.C.3 chiede di rispettare. */
export const PRINT_WIDTH = 794;

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export default function PrintableReport({
  company,
  plan,
  period,
  periodLabel,
  report,
  snapshot,
  generatedOn,
}: {
  company: Company;
  plan: Plan;
  period: Quarter;
  periodLabel: string;
  report: HrReport;
  snapshot: RoiSnapshot;
  generatedOn: Date;
}) {
  return (
    <div
      /*
       * `width` inline e non una classe: la larghezza del documento è un dato
       * del formato, non uno stile, e deve restare leggibile da chi cattura.
       */
      style={{ width: PRINT_WIDTH, background: "#ffffff" }}
      className="p-10 font-inter text-foreground"
      data-print-period={`${period.year}-Q${period.quarter}`}
    >
      <div className="flex items-baseline justify-between gap-6 pb-4 border-b-2 border-primary">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            {t.hr.report.pdf.documentTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {interpolate(t.hr.report.pdf.documentSubtitle, {
              company: company.name,
              employees: formatNumber(company.employeeCount),
              plan: t.plan[plan.id],
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums">
            {interpolate(t.hr.report.pdf.period, { quarter: periodLabel })}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums mt-1">
            {interpolate(t.hr.report.pdf.generatedOn, {
              date: formatDate(generatedOn),
            })}
          </p>
        </div>
      </div>

      {/*
        Le due cifre che il consiglio guarda per prime, in evidenza. Sono le
        stesse dello snapshot che la dashboard mostra: qui cambia il corpo del
        carattere, non il numero.
      */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-accent/40 rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t.hr.report.savings}
          </p>
          <p className="font-display text-3xl font-bold tabular-nums mt-1">
            {formatCHF(report.savedChf)}
          </p>
          <p className="text-sm text-muted-foreground mt-1 tabular-nums">
            {interpolate(t.hr.report.daysValue, {
              days: formatNumber(report.avoidedAbsenceDays),
            })}
          </p>
        </div>
        <div className="border-2 border-primary/20 rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t.hr.report.adoption}
          </p>
          <p className="font-display text-3xl font-bold tabular-nums mt-1">
            {formatPercent(report.adoptionPercent)}
          </p>
          <p className="text-sm text-muted-foreground mt-1 tabular-nums">
            {interpolate(t.hr.kpiAdoptionHint, {
              enrolled: formatNumber(snapshot.enrolledEmployees),
              total: formatNumber(company.employeeCount),
            })}
          </p>
        </div>
      </div>

      <h2 className="font-semibold mt-8 mb-2">{t.hr.report.metricsTitle}</h2>
      <div>
        <Metric
          label={t.hr.report.pdf.active}
          value={formatNumber(snapshot.activeEmployees)}
        />
        <Metric
          label={t.hr.report.pdf.sessions}
          value={interpolate(t.hr.report.pdf.sessionsValue, {
            used: formatNumber(snapshot.sessionsUsed),
            total: formatNumber(snapshot.sessionsTotal),
          })}
        />
        <Metric
          label={t.hr.report.usage}
          value={formatPercent(report.usagePercent)}
        />
        <Metric
          label={t.hr.report.checkup}
          value={formatPercent(report.checkupCompletionPercent)}
        />
        {/*
          Il "—" del trimestre più vecchio è `common.none`, come a schermo: un
          trimestre senza precedente non ha un trend, e uno zero direbbe
          "invariato" dove il dato non esiste.
        */}
        <Metric
          label={t.hr.report.stress}
          value={
            report.stressTrendPoints === null
              ? t.common.none
              : interpolate(t.hr.report.stressValue, {
                  points: formatSigned(report.stressTrendPoints),
                })
          }
        />
      </div>

      <h2 className="font-semibold mt-8 mb-2">
        {t.hr.report.recommendationsTitle}
      </h2>
      <ol className="space-y-1.5">
        {report.recommendationKeys.map((key, index) => (
          <li key={key} className="flex gap-2 text-sm text-muted-foreground">
            <span className="tabular-nums font-semibold text-foreground">
              {formatNumber(index + 1)}.
            </span>
            {
              t.hr.report.recommendation[
                key as keyof typeof t.hr.report.recommendation
              ]
            }
          </li>
        ))}
      </ol>

      <div className="flex items-start gap-2 mt-8 pt-4 border-t border-border">
        <Lock className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {t.hr.report.pdf.privacyNote}
        </p>
      </div>
    </div>
  );
}
