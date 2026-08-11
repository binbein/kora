import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCHF, formatNumber, formatPercent, formatSigned } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { quarterKey, type Quarter } from '@/lib/data/types';
import {
  useCompany,
  useCurrentQuarter,
  useHrReport,
  useQuarters,
  useReferenceDate,
  useRoiSnapshot,
} from '@/lib/data/queries';
import PrintableReport, { PRINT_WIDTH } from '@/components/hr/PrintableReport';
import { downloadReportPdf, reportFileName } from '@/lib/report-pdf';

/*
 * Il report trimestrale (CLAUDE.md §10.C.2).
 *
 * Le metriche vengono da `getHrReport`, che le deriva dallo snapshot e dalle
 * serie: la schermata e il PDF di M4 diranno lo stesso numero perché leggono lo
 * stesso dato, non perché qualcuno li ha riallineati.
 *
 * IL SELETTORE DEL TRIMESTRE è entrato qui in M4 (decisione dei founder del
 * 10.08.2026): un report trimestrale che mostra un trimestre solo è monco, ed è
 * la UI minima che rende eseguibile il guardrail del §5.6 — «il trimestre del
 * PDF è quello mostrato» non è verificabile se il trimestre non si può
 * cambiare. Usa le stesse chiavi della dashboard, perché è lo stesso gesto.
 */

/**
 * L'etichetta del periodo, col suffisso "in corso" sul trimestre aperto.
 *
 * È la gemella di quella della dashboard, e come lei compone da una frase
 * intera invece che concatenare (§2.7).
 */
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

function StatRow({
  label,
  value,
  polarity,
}: {
  label: string;
  value: string;
  polarity?: { sign: number; goodWhen: 'up' | 'down' };
}) {
  const improving =
    polarity === undefined || polarity.sign === 0
      ? null
      : polarity.goodWhen === 'up'
        ? polarity.sign > 0
        : polarity.sign < 0;

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`flex items-center gap-1.5 text-sm font-semibold tabular-nums ${
          improving === null ? '' : improving ? 'text-secondary-strong' : 'text-destructive-strong'
        }`}
      >
        {improving !== null &&
          (polarity!.sign > 0 ? (
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
          ))}
        {value}
      </span>
    </div>
  );
}

export default function HRReport() {
  const { data: company } = useCompany();
  const { data: currentQuarter } = useCurrentQuarter();
  const { data: quarters } = useQuarters();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected =
    quarters?.find((period) => quarterKey(period) === selectedKey) ??
    currentQuarter;

  const { data: report } = useHrReport(selected);
  const { data: snapshot } = useRoiSnapshot(selected);
  const { data: today } = useReferenceDate();

  /*
   * Il nodo che il generatore cattura. È montato sempre, e sempre fuori
   * schermo: montarlo al clic vorrebbe dire catturare un albero appena
   * inserito, cioè prima che i font siano applicati e i grafici disegnati.
   */
  const printRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  if (
    !company ||
    !currentQuarter ||
    !quarters ||
    !selected ||
    !report ||
    !snapshot ||
    !today
  ) {
    return null;
  }

  const quarterText = quarterLabel(selected, currentQuarter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{t.hr.report.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {interpolate(t.hr.report.subtitle, {
              quarter: quarterText,
              company: company.name,
            })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
          <Button
            variant="outline"
            size="sm"
            disabled={generating}
            onClick={async () => {
              const node = printRef.current;
              if (!node) return;
              setGenerating(true);
              try {
                await downloadReportPdf(
                  node,
                  reportFileName(company.name, selected),
                  selected,
                );
              } finally {
                setGenerating(false);
              }
            }}
          >
            <Download className="w-4 h-4 mr-1" aria-hidden="true" /> {t.hr.report.download}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" /> {t.hr.report.metricsTitle}
        </h3>
        <StatRow
          label={t.hr.report.adoption}
          value={formatPercent(report.adoptionPercent)}
        />
        <StatRow label={t.hr.report.usage} value={formatPercent(report.usagePercent)} />
        <StatRow
          label={t.hr.report.checkup}
          value={formatPercent(report.checkupCompletionPercent)}
        />
        <StatRow
          label={t.hr.report.stress}
          value={
            report.stressTrendPoints === null
              ? t.common.none
              : interpolate(t.hr.report.stressValue, {
                  points: formatSigned(report.stressTrendPoints),
                })
          }
          polarity={
            report.stressTrendPoints === null
              ? undefined
              : { sign: report.stressTrendPoints, goodWhen: 'down' }
          }
        />
        <StatRow label={t.hr.report.savings} value={formatCHF(report.savedChf)} />
        <StatRow
          label={t.hr.report.avoidedDays}
          value={interpolate(t.hr.report.daysValue, {
            days: formatNumber(report.avoidedAbsenceDays),
          })}
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">{t.hr.report.recommendationsTitle}</h3>
        <ul className="space-y-3">
          {report.recommendationKeys.map((key, index) => (
            <li key={key} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="mt-0.5 flex-shrink-0 tabular-nums">
                {formatNumber(index + 1)}
              </Badge>
              {t.hr.report.recommendation[key as keyof typeof t.hr.report.recommendation]}
            </li>
          ))}
        </ul>
      </Card>

      {/*
        LA VISTA DI STAMPA, fuori schermo.

        `position: fixed` con un offset negativo, e non `display: none` né
        `visibility: hidden`: il primo non misura — un nodo senza layout dà un
        canvas vuoto — e il secondo misura ma si cattura trasparente. Spostarlo
        fuori dal viewport lo lascia disegnato e misurabile, che è ciò che
        html2canvas legge.

        `aria-hidden` perché è un duplicato della schermata: chi legge con uno
        screen reader sentirebbe due volte gli stessi numeri.
      */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: -10000,
          width: PRINT_WIDTH,
          pointerEvents: "none",
        }}
      >
        <div ref={printRef}>
          <PrintableReport
            company={company}
            plan={company.plan}
            period={selected}
            periodLabel={quarterText}
            report={report}
            snapshot={snapshot}
            generatedOn={today}
          />
        </div>
      </div>
    </div>
  );
}
