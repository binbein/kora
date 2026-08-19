import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar as DayPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock, User, Video } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import { addDays, startOfWeek, weeksBetween } from '@/lib/dates';
import { formatDate, formatMonthYear, formatNumber, formatTime, formatWeekday, formatWeekdayShort } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
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

  /* Stato del popover, non del dominio: si apre, si sceglie, si chiude. */
  const [pickerOpen, setPickerOpen] = useState(false);

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

  /*
   * I BORDI DELL'AGENDA SI DERIVANO DALLE SEDUTE (§5.5), non da due date
   * scritte qui: vanno su `fromDate`/`toDate`, che limitano **insieme** la
   * selezione e la navigazione dei mesi — così le frecce del mese si spengono
   * ai bordi invece di portare su un mese interamente spento.
   */
  const starts = sessions.map((session) => session.start.getTime());
  const agendaFrom = new Date(Math.min(...starts));
  const agendaTo = new Date(Math.max(...starts));

  /* I giorni con almeno una seduta: il puntino nel mini calendario. Le
     annullate non contano, come per la griglia. */
  const daysWithSessions = sessions
    .filter((session) => session.status !== 'cancelled')
    .map((session) => session.start);

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
          {/*
            * IL SALTO A DATA SI APRE DALL'ETICHETTA (founder, 18.08.2026).
            *
            * Il trigger è l'elemento che dice **dove sei**, quindi la riga dei
            * comandi non cresce di un elemento: l'agenda copre sette mesi e
            * mezzo, e a sole frecce un percorso concluso sta a ventotto clic.
            *
            * La griglia cambia sotto senza che il focus si muova, quindi
            * l'etichetta resta `aria-live`: chi legge con uno screen reader
            * preme una freccia e sente la settimana nuova.
            */}
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-sm font-medium tabular-nums"
              >
                <span aria-live="polite">
                  {interpolate(t.professional.calendar.week, {
                    from: formatDate(monday),
                    to: formatDate(addDays(monday, 6)),
                  })}
                </span>
                <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              {/*
                * `mode="single"` **senza `selected`**: qui il clic sposta la
                * settimana, non seleziona un giorno. Un giorno selezionato
                * accenderebbe `day_selected`, che è `bg-primary` pieno, e
                * finirebbe sopra la banda della settimana — due riempimenti
                * nello stesso calendario si leggono come due stati dello
                * stesso tipo.
                *
                * NIENTE `date-fns`: non è in `package.json`, è una dipendenza
                * transitiva di react-day-picker, e importarla per passarne la
                * `locale` significherebbe dipendere da qualcosa che nessuno ha
                * dichiarato (§3). Al suo posto `formatters` e `labels`
                * instradati su `format.ts`, che è l'unico punto da cui passa
                * ciò che si legge (§11) — senza, la caption, le iniziali dei
                * giorni e i nomi accessibili escono **in inglese** su un
                * prodotto che parla quattro lingue.
                */}
              <DayPicker
                mode="single"
                defaultMonth={monday}
                fromDate={agendaFrom}
                toDate={agendaTo}
                /* Esplicito: senza una locale react-day-picker aprirebbe la
                   settimana di domenica, mentre `startOfWeek` è lunedì — la
                   banda e la griglia sotto direbbero due settimane sfalsate. */
                weekStartsOn={1}
                /*
                 * OGGI È QUELLO DELLA DEMO, NON QUELLO DELLA MACCHINA.
                 *
                 * Senza questa riga react-day-picker prende `new Date()` per
                 * sé, quindi l'anello di "oggi" cadrebbe sulla data vera del
                 * computer — cioè su un giorno qualunque dell'agenda, o su
                 * nessuno — mentre tutto il resto della demo deriva da
                 * `DEMO_TODAY` (§5.4). È il modo in cui una libreria chiama
                 * `new Date()` al posto nostro.
                 */
                today={today}
                modifiers={{
                  shownWeek: { from: monday, to: addDays(monday, 6) },
                  hasSessions: daysWithSessions,
                }}
                /*
                 * LE CLASSI DI react-day-picker NON SI FONDONO, ed è la
                 * trappola di questo blocco: né `classNames` con i default di
                 * `ui/calendar.tsx` — lo spread `...classNames` **sostituisce**
                 * la voce, non la estende — né due utility in conflitto fra
                 * loro, perché la libreria concatena stringhe e non passa da
                 * `twMerge` come fa `cn`. Fra `rounded-none` e `rounded-md`
                 * decide l'ordine con cui Tailwind le emette nel foglio, che
                 * non è una regola su cui appoggiarsi.
                 *
                 * È la stessa famiglia della cautela sulle varianti `data-*`
                 * (§3): una cosa che sembra funzionare, e funziona per
                 * un'altra ragione.
                 *
                 * Da qui le due righe qui sotto: la voce `day` si **ricompone**
                 * a partire da `buttonVariants`, e la banda impone i suoi
                 * angoli con `!` invece di sperare di arrivare dopo.
                 */
                modifiersClassNames={{
                  /* La settimana è **una banda**, non sette pillole: gli angoli
                     quadrati sono ciò che la fa leggere come un blocco solo, e
                     `!rounded-none` li impone contro il `rounded-md` che
                     `buttonVariants` porta su ogni giorno. */
                  shownWeek: 'bg-accent text-accent-foreground !rounded-none',
                  /* `secondary-strong` e non `secondary`: il puntino è
                     l'unico portatore visivo dell'informazione "qui c'è una
                     seduta", quindi vale la soglia 3:1 del non-testo — e il
                     token base sta a 2.53:1 sulla banda (§6.1). */
                  hasSessions:
                    "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-secondary-strong after:content-['']",
                }}
                classNames={{
                  /* Oggi è un anello e non un riempimento: il default di
                     `ui/calendar.tsx` è `bg-accent`, cioè lo stesso fondo
                     della banda, e sotto la banda sparirebbe. Si sovrascrive
                     **dal call site** — `Calendar` mette `...classNames` in
                     coda — invece di toccare un file congelato (§3). */
                  day_today: 'ring-1 ring-inset ring-primary font-semibold',
                  /* La cella si allarga perché ci stia "lun": la forma a due
                     lettere Intl non la produce, e scriverla qui sarebbe un
                     formato cablato (§11). */
                  head_cell:
                    'text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]',
                  /* Ricomposta e non riscritta: `ui/calendar.tsx` mette qui
                     `buttonVariants({ variant: 'ghost' })`, che porta l'hover e
                     **l'anello di focus** del blocco a) di M5 (§6.1).
                     Sostituendo la voce per intero i giorni li avevano persi, e
                     da tastiera restava l'outline del browser. L'unica cosa che
                     cambia è la larghezza, `w-8` → `w-10`. */
                  day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-8 w-10 p-0 font-normal aria-selected:opacity-100',
                  ),
                }}
                formatters={{
                  formatCaption: (month) => formatMonthYear(month),
                  formatWeekdayName: (day) => formatWeekdayShort(day),
                }}
                labels={{
                  labelPrevious: () => t.professional.calendar.pickerPreviousMonth,
                  labelNext: () => t.professional.calendar.pickerNextMonth,
                  labelWeekday: (day) => formatWeekday(day),
                }}
                /*
                 * IL PUNTINO LO DEVE DIRE ANCHE A PAROLE, e `labels.labelDay`
                 * non serve a niente: in react-day-picker 8.10 è **definito e
                 * mai consumato** — verificato nel sorgente distribuito, dove
                 * `labelPrevious`, `labelNext` e `labelWeekday` finiscono su un
                 * `aria-label` e `labelDay` non compare da nessuna parte. I
                 * pulsanti dei giorni non hanno nome accessibile oltre al
                 * numero.
                 *
                 * La frase arriva quindi da `DayContent`, sempre **dal call
                 * site**: il numero come prima, più un testo per i soli lettori
                 * di schermo dove c'è una seduta. Il colore non è mai l'unica
                 * cosa che porta un significato (§6.1).
                 *
                 * `components` sostituisce quello di `ui/calendar.tsx` invece
                 * di fondersi — `{...props}` sta in coda — quindi le due icone
                 * delle frecce vanno ripassate qui, o le frecce del mese
                 * resterebbero vuote.
                 */
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                  IconRight: () => <ChevronRight className="h-4 w-4" />,
                  DayContent: ({ date, activeModifiers }) => (
                    <>
                      {formatNumber(date.getDate())}
                      {activeModifiers.hasSessions === true && (
                        <span className="sr-only">
                          {interpolate(
                            t.professional.calendar.pickerDayWithSessions,
                            { date: formatDate(date) },
                          )}
                        </span>
                      )}
                    </>
                  ),
                }}
                onSelect={(day) => {
                  if (day === undefined) return;
                  setWeekOffset(weeksBetween(today, day));
                  setPickerOpen(false);
                }}
              />
              <p className="px-3 pb-3 text-xs text-muted-foreground tabular-nums">
                {interpolate(t.professional.calendar.pickerRange, {
                  from: formatDate(agendaFrom),
                  to: formatDate(agendaTo),
                })}
              </p>
            </PopoverContent>
          </Popover>
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

      {/* La legenda spiega le celle, quindi vive con loro: su una settimana
          senza sedute restava a descrivere tre colori che non c'erano. */}
      {slots.length > 0 && (
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
      )}
    </div>
  );
}
