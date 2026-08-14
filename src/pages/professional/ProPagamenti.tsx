import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, CreditCard, FileText, TrendingUp } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import { earningsWeeks } from '@/lib/earnings';
import { formatCHF, formatDate, formatMonthYear, formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  loadState,
  usePortalProfessionalId,
  useProfessional,
  useProfessionalEarnings,
  useProfessionalPayouts,
  useProfessionalSessions,
  useReferenceDate,
} from '@/lib/data/queries';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';

export default function ProPagamenti() {
  const todayQuery = useReferenceDate();
  const portalIdQuery = usePortalProfessionalId();
  const professionalId = portalIdQuery.data;
  const professionalQuery = useProfessional(professionalId);
  const sessionsQuery = useProfessionalSessions(professionalId);
  const today = todayQuery.data;
  const month = today ? new Date(today.getFullYear(), today.getMonth(), 1) : undefined;
  const earningsQuery = useProfessionalEarnings(professionalId, month);
  const payoutsQuery = useProfessionalPayouts(professionalId);

  /*
   * I tre casi (M5.b), registro strumento. Le due query in fondo dipendono da
   * `today` e dall'id, quindi restano disabilitate finché quelli non arrivano:
   * mettere nel gruppo anche le due letture da cui derivano è ciò che impedisce
   * a un loro guasto di travestirsi da attesa che non finisce.
   */
  const page = loadState([
    todayQuery,
    portalIdQuery,
    professionalQuery,
    sessionsQuery,
    earningsQuery,
    payoutsQuery,
  ]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const professional = professionalQuery.data;
  const sessions = sessionsQuery.data;
  const earnings = earningsQuery.data;
  const payouts = payoutsQuery.data;
  if (
    today === undefined ||
    month === undefined ||
    professional === undefined ||
    sessions === undefined ||
    earnings === undefined ||
    payouts === undefined
  ) {
    return null;
  }

  /* `getProfessional` è nullable per contratto: senza di lui non c'è la
     tariffa con cui si compongono le righe, quindi il vuoto è di pagina. */
  if (professional === null) {
    return (
      <Card>
        <EmptyNotice text={t.professional.profile.empty} />
      </Card>
    );
  }

  const weeks = earningsWeeks(sessions, month, earnings.feePerSession);
  const yearTotal = payouts
    .filter((payout) => payout.month.getFullYear() === today.getFullYear())
    .reduce((total, payout) => total + payout.grossChf, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.professional.payments.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 first-letter:uppercase">
          {earnings.inProgress
            ? interpolate(t.professional.payments.monthInProgress, {
                month: formatMonthYear(month),
              })
            : formatMonthYear(month)}
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
          variant="accent"
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
          <TrendingUp className="w-4 h-4 text-secondary" aria-hidden="true" /> {t.professional.payments.capacityTitle}
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
          {/* Un mese senza sedute erogate lasciava la sola riga "Totale del mese
              CHF 0", senza una frase che lo spiegasse: le fatture dell'area HR
              hanno il loro `EmptyNotice` e questa non ce l'aveva. */}
          {weeks.length === 0 && (
            <EmptyNotice text={t.professional.payments.weeksEmpty} />
          )}
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
        {/* Stesso caso della card sopra, un piano più in là: un professionista
            senza storico — chi è appena entrato nella rete — apriva un riquadro
            bordato e vuoto. */}
        {payouts.length === 0 && (
          <EmptyNotice text={t.professional.payments.payoutsEmpty} />
        )}
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
                      ? 'bg-secondary/10 text-secondary-strong'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {payout.status === 'paid' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.payments.paid}</>
                  ) : (
                    <><Clock className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.payments.pending}</>
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
