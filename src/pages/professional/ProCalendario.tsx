import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Video } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import { addDays, startOfWeek } from '@/lib/dates';
import { formatDate, formatNumber, formatTime, formatWeekday, formatWeekdayShort } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  slotsOfWeek,
  nextSession,
  sessionsOfMonth,
  sessionsOfWeek,
  weekGrid,
} from '@/lib/schedule';
import {
  loadState,
  usePortalProfessionalId,
  useProfessionalPatients,
  useProfessionalSessions,
  useReferenceDate,
} from '@/lib/data/queries';
import { ErrorNotice } from '@/components/kora/StateNotice';
import CancelSessionDialog from '@/components/professional/CancelSessionDialog';
import { patientDisplayName, type ProfessionalSession } from '@/lib/data/types';

export default function ProCalendario() {
  const todayQuery = useReferenceDate();
  const portalIdQuery = usePortalProfessionalId();
  const sessionsQuery = useProfessionalSessions(portalIdQuery.data);
  const patientsQuery = useProfessionalPatients(portalIdQuery.data);

  /* Stato del dialogo, non del dominio: quale seduta si sta annullando. */
  const [cancelling, setCancelling] = useState<ProfessionalSession | null>(null);

  /*
   * LA SETTIMANA MOSTRATA, IN SETTIMANE DA OGGI (18.08.2026).
   *
   * È uno scostamento e non una data perché `today` arriva dal provider: uno
   * stato inizializzato con una data che non c'è ancora sarebbe `null` per un
   * render, e ogni riga sotto dovrebbe saperlo.
   *
   * **Nessun limite**, in nessuno dei due versi: una settimana senza sedute è
   * uno stato vero e la card lo dice a parole. Una freccia disabilitata a un
   * confine inventato invita la domanda "perché è grigia?" dentro trenta
   * minuti contati.
   */
  const [weekOffset, setWeekOffset] = useState(0);

  /*
   * I tre casi (M5.b), registro strumento. `portalIdQuery` entra nel gruppo
   * benché la pagina non ne mostri il valore: le altre due query sono abilitate
   * solo quando l'id è arrivato, quindi senza di lui resterebbero `undefined`
   * per sempre e il guasto si travestirebbe da attesa.
   */
  const page = loadState([todayQuery, portalIdQuery, sessionsQuery, patientsQuery]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const today = todayQuery.data;
  const sessions = sessionsQuery.data;
  const patients = patientsQuery.data;
  if (today === undefined || sessions === undefined || patients === undefined) {
    return null;
  }

  /*
   * IL SEAM C'ERA GIÀ: `weekGrid` prende la settimana mostrata e oggi come due
   * parametri distinti, e questa pagina gli passava `today` a tutti e due.
   * Adesso il primo è la settimana navigata e il secondo resta oggi, quindi il
   * marcatore "oggi" **non segue la navigazione** — o si sposterebbe con la
   * griglia e non direbbe più niente.
   */
  const shownWeek = addDays(startOfWeek(today), weekOffset * 7);
  const week = sessionsOfWeek(sessions, shownWeek);
  const slots = slotsOfWeek(week);
  const days = weekGrid(sessions, shownWeek, today);
  const monday = startOfWeek(shownWeek);
  const next = nextSession(sessions);

  /*
   * LE KPI NON SEGUONO LA NAVIGAZIONE, ed è la disciplina della cornice del
   * trimestre letta al contrario (§10.C.1): lì ciò che segue il comando sta
   * dentro la cornice, qui **il comando comanda la sola griglia**. "Sedute
   * questa settimana", "prossima seduta" e il totale del mese rispondono a
   * *come sto adesso*, e sono ancorate a oggi; l'etichetta sopra la griglia
   * dichiara quale settimana si sta guardando.
   */
  const thisWeek = sessionsOfWeek(sessions, today);

  return (
    <div className="space-y-6">
      <div>
        {/* Il sottotitolo diceva quale settimana si sta guardando, ed è sceso
            in cima alla griglia insieme ai comandi: l'etichetta sta attaccata
            a ciò che descrive, non due blocchi più su. */}
        <h1 className="text-2xl font-bold font-display">{t.professional.calendar.title}</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t.professional.calendar.sessionsThisWeek} value={formatNumber(thisWeek.length)} icon={Calendar} />
        <KPICard
          title={t.professional.calendar.nextSession}
          value={
            next
              ? interpolate(t.professional.calendar.nextSessionValue, {
                  weekday: formatWeekday(next.start),
                  time: formatTime(next.start),
                })
              : t.professional.calendar.noNextSession
          }
          icon={Clock}
        />
        <KPICard
          title={t.professional.calendar.sessionsThisMonth}
          value={formatNumber(sessionsOfMonth(sessions, today).length)}
          icon={Video}
        />
        <KPICard title={t.professional.calendar.activePatients} value={formatNumber(patients.length)} icon={User} />
      </div>

      <Card className="p-4">
        {/*
          * I COMANDI STANNO IN CIMA ALLA CARD, NON AI SUOI LATI.
          *
          * È la stessa disciplina della cornice del trimestre: il comando sta
          * attaccato a ciò che comanda, cioè all'etichetta che dichiara quale
          * settimana si sta guardando. Due frecce ai lati della griglia,
          * centrate verticalmente, si centrerebbero su un'altezza che cambia a
          * ogni settimana — e su una settimana senza sedute su **zero** righe;
          * e l'ordine di tabulazione passerebbe da lato a lato attraversando
          * tutta la griglia.
          *
          * La riga sta **fuori** dal ramo del vuoto, o da una settimana senza
          * sedute non si potrebbe più tornare indietro.
          */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={t.professional.calendar.previousWeek}
            onClick={() => setWeekOffset((offset) => offset - 1)}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </Button>
          {/* La griglia cambia sotto senza che il focus si muova: il cambio va
              annunciato, o chi legge con uno screen reader preme e non sente
              niente. */}
          <p
            className="text-sm font-medium tabular-nums text-center"
            aria-live="polite"
          >
            {interpolate(t.professional.calendar.week, {
              from: formatDate(monday),
              to: formatDate(addDays(monday, 6)),
            })}
          </p>
          <div className="flex items-center gap-2">
            {/* Solo fuori dalla settimana corrente: sulla settimana di oggi
                sarebbe un comando che non fa niente. Senza, durante la
                presentazione ci si allontana e non si torna. */}
            {weekOffset !== 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset(0)}
              >
                {t.professional.calendar.backToThisWeek}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={t.professional.calendar.nextWeek}
              onClick={() => setWeekOffset((offset) => offset + 1)}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {slots.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {t.professional.calendar.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
            <div className="grid grid-cols-6 gap-1">
              <div className="p-2" />
              {days.map((day) => (
                <div
                  key={day.date.toISOString()}
                  className={`p-2 text-center text-sm font-semibold ${
                    day.isToday ? 'text-executive' : 'text-muted-foreground'
                  }`}
                >
                  <span className="capitalize">{formatWeekdayShort(day.date)}</span>{' '}
                  <span className="tabular-nums font-normal">{day.date.getDate()}</span>
                </div>
              ))}
              {slots.map((minuteOfDay, row) => (
                <React.Fragment key={minuteOfDay}>
                  <div className="p-2 text-xs text-muted-foreground text-right tabular-nums">
                    {formatTime(new Date(2000, 0, 1, 0, minuteOfDay))}
                  </div>
                  {days.map((day) => {
                    const { session } = day.cells[row];
                    const past = session && session.status === 'completed';
                    const cellClass = `p-1.5 rounded-lg text-xs min-h-[48px] border w-full text-left ${
                      session
                        ? past
                          ? 'bg-muted/60 border-border'
                          : 'bg-secondary/10 border-secondary/30'
                        : 'bg-card border-border'
                    }`;
                    const content = session && (
                      <div>
                        {/* Il cognome, non le iniziali: la cella è stretta
                            e il nome intero non ci sta, ma "Bianchi" dice
                            chi è dove "M.B." chiedeva di ricordarselo. */}
                        <p className={`font-medium truncate ${past ? 'text-muted-foreground' : 'text-secondary-strong'}`}>
                          {session.patientLastName}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          {t.sessionType[session.type]}
                        </p>
                      </div>
                    );

                    /*
                     * LA CELLA IN PROGRAMMA È IL GESTO, ed è un `button` vero e
                     * non un `div` con un `onClick`: da tastiera dev'essere
                     * raggiungibile e premibile come tutto il resto (§11), e il
                     * nome accessibile dice **cosa fa il clic** — dentro la
                     * cella c'è un cognome, che dice chi è ma non dove porta.
                     *
                     * Le altre celle restano `div`: una casella vuota o una
                     * seduta passata non hanno niente da offrire, e un bersaglio
                     * focalizzabile che non fa niente è peggio di nessun
                     * bersaglio.
                     */
                    if (session && session.status === 'scheduled') {
                      return (
                        <button
                          key={`${day.date.toISOString()}-${minuteOfDay}`}
                          type="button"
                          className={`${cellClass} hover:bg-secondary/20 transition-colors`}
                          aria-label={interpolate(
                            t.professional.sessions.cancel.actionLabel,
                            {
                              patient: patientDisplayName(session),
                              weekday: formatWeekday(session.start),
                              date: formatDate(session.start),
                              time: formatTime(session.start),
                            },
                          )}
                          onClick={() => setCancelling(session)}
                        >
                          {content}
                        </button>
                      );
                    }

                    return (
                      <div
                        key={`${day.date.toISOString()}-${minuteOfDay}`}
                        className={cellClass}
                      >
                        {content}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <CancelSessionDialog
        session={cancelling}
        professionalId={portalIdQuery.data}
        onClose={() => setCancelling(null)}
      />

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-secondary/10 border border-secondary/30" />
          {t.professional.calendar.legendBooked}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/60 border border-border" />
          {t.professional.calendar.legendPast}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          {t.professional.calendar.legendFree}
        </div>
      </div>
    </div>
  );
}
