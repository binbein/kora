import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCHF, formatNumber, formatPercent, formatSigned } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { useCompany, useCurrentQuarter, useHrReport } from '@/lib/data/queries';

/*
 * Il report trimestrale (CLAUDE.md §10.C.2).
 *
 * Le metriche vengono da `getHrReport`, che le deriva dallo snapshot e dalle
 * serie: la schermata e il PDF di M4 diranno lo stesso numero perché leggono lo
 * stesso dato, non perché qualcuno li ha riallineati.
 *
 * Il pulsante del PDF resta com'è: il report scaricabile è M4.
 */

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
          improving === null ? '' : improving ? 'text-secondary' : 'text-destructive'
        }`}
      >
        {improving !== null &&
          (polarity!.sign > 0 ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          ))}
        {value}
      </span>
    </div>
  );
}

export default function HRReport() {
  const { data: company } = useCompany();
  const { data: currentQuarter } = useCurrentQuarter();
  const { data: report } = useHrReport(currentQuarter);

  if (!company || !currentQuarter || !report) return null;

  const quarterText = interpolate(t.hr.quarterLabel, {
    quarter: String(currentQuarter.quarter),
    year: String(currentQuarter.year),
  });

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
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> {t.hr.report.download}
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> {t.hr.report.metricsTitle}
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
              ? t.hr.report.stressEmpty
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
    </div>
  );
}
