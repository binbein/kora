import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, CreditCard, FileText, TrendingUp } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import { earningsWeeks } from '@/lib/earnings';
import { formatCHF, formatDate, formatMonthYear, formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  usePortalProfessionalId,
  useProfessional,
  useProfessionalEarnings,
  useProfessionalPayouts,
  useProfessionalSessions,
  useReferenceDate,
} from '@/lib/data/queries';

export default function ProPagamenti() {
  const { data: today } = useReferenceDate();
  const { data: professionalId } = usePortalProfessionalId();
  const { data: professional } = useProfessional(professionalId);
  const { data: sessions } = useProfessionalSessions(professionalId);
  const month = today ? new Date(today.getFullYear(), today.getMonth(), 1) : undefined;
  const { data: earnings } = useProfessionalEarnings(professionalId, month);
  const { data: payouts } = useProfessionalPayouts(professionalId);

  if (!today || !professional || !sessions || !earnings || !payouts || !month) return null;

  const weeks = earningsWeeks(sessions, month, earnings.feePerSession);
  const yearTotal = payouts
    .filter((payout) => payout.month.getFullYear() === today.getFullYear())
    .reduce((total, payout) => total + payout.grossChf, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.professional.payments.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="capitalize">{formatMonthYear(month)}</span>
          {earnings.inProgress ? ` · ${t.professional.payments.inProgress}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.professional.payments.sessionsThisMonth}
          value={formatNumber(earnings.sessionsDelivered)}
          icon={CheckCircle2}
        />
        <KPICard
          title={t.professional.payments.feePerSession}
          value={formatCHF(earnings.feePerSession)}
          icon={CreditCard}
        />
        <KPICard
          title={t.professional.payments.monthTotal}
          value={formatCHF(earnings.grossChf)}
          icon={CreditCard}
          variant="secondary"
        />
        <KPICard
          title={t.professional.payments.yearTotal}
          value={formatCHF(yearTotal)}
          icon={FileText}
        />
      </div>

      {/*
        Il regime accanto al totale (§9): senza, CHF 1'120 contro i CHF
        5'600–6'400 del Business Plan si legge come "Kora paga poco" invece che
        come una collaborazione part-time.
      */}
      <Card className="p-5 bg-accent/40 border-secondary/20">
        <h3 className="font-semibold mb-1 flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-secondary" /> {t.professional.payments.capacityTitle}
        </h3>
        <p className="text-sm text-muted-foreground">
          {interpolate(t.professional.payments.capacity, {
            sessions: formatNumber(earnings.sessionsPerWeek),
            full: formatNumber(earnings.fullCapacity.sessionsPerWeek),
            min: formatCHF(earnings.fullCapacity.monthlyMinChf),
            max: formatCHF(earnings.fullCapacity.monthlyMaxChf),
            minHours: formatNumber(earnings.fullCapacity.minHoursPerWeek),
          })}
        </p>
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">{t.professional.payments.weeks}</h2>
        <Card>
          <div className="divide-y divide-border">
            {weeks.map((week) => (
              <div key={week.start.toISOString()} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium tabular-nums">
                    {interpolate(t.professional.payments.weekRange, {
                      from: formatDate(week.start),
                      to: formatDate(week.end),
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {interpolate(t.professional.payments.weekDetail, {
                      sessions: formatNumber(week.sessions),
                      minutes: formatNumber(week.minutes),
                    })}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums">{formatCHF(week.grossChf)}</span>
              </div>
            ))}
            <div className="p-4 flex items-center justify-between bg-muted/40">
              <span className="text-sm font-semibold">{t.professional.payments.monthTotal}</span>
              <span className="text-sm font-bold tabular-nums">{formatCHF(earnings.grossChf)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-muted border-border">
        <p className="text-sm text-muted-foreground">{t.professional.payments.model}</p>
      </Card>

      <Card>
        <div className="divide-y divide-border">
          {payouts.map((payout) => (
            <div key={payout.month.toISOString()} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold capitalize">{formatMonthYear(payout.month)}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {interpolate(t.professional.payments.sessionsTimesFee, {
                    sessions: formatNumber(payout.sessions),
                    fee: formatCHF(payout.feePerSession),
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tabular-nums">{formatCHF(payout.grossChf)}</span>
                <Badge
                  className={
                    payout.status === 'paid'
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {payout.status === 'paid' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> {t.professional.payments.paid}</>
                  ) : (
                    <><Clock className="w-3 h-3 mr-1" /> {t.professional.payments.pending}</>
                  )}
                </Badge>
                {payout.paidOn && (
                  <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
                    {interpolate(t.professional.payments.paidOn, {
                      date: formatDate(payout.paidOn),
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
