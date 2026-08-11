import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CheckCircle2, Globe, Star, Video } from "lucide-react";
import { dataProvider } from "@/lib/data";
import {
  useAvailableSlots,
  useEntitlement,
  useProfessionals,
} from "@/lib/data/queries";
import { queryKeys } from "@/lib/data/query-keys";
import {
  isBookable,
  professionalDisplayName,
  serviceOf,
  type Appointment,
  type AppointmentSlot,
  type CappedServiceKind,
  type Professional,
} from "@/lib/data/types";
import {
  formatCHF,
  formatDate,
  formatNumber,
  formatRating,
  formatTime,
  formatWeekday,
} from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * La prenotazione (CLAUDE.md §10.B).
 *
 * È la schermata su cui si regge la prova del marketplace: prenotando qui, lo
 * slot sparisce, l'appuntamento compare in home e la stessa seduta compare nel
 * calendario della Dr.ssa Meier — perché è **un record solo**, non tre stati
 * allineati a mano (§5.2).
 *
 * Il codice ereditato aveva qui un terzo elenco di professionisti, inventato e
 * scollegato dagli altri due, in cui la Dr.ssa Meier — quella con cui Laura ha
 * l'appuntamento — non compariva nemmeno.
 */

/** Quale servizio la schermata sta mostrando: sta nell'URL, così la home ci arriva. */
const SERVICE_PARAM = "servizio";

function serviceFromParam(value: string | null): CappedServiceKind {
  return value === "coach" ? "coach" : "psychologist";
}

function initials(professional: Professional): string {
  const { firstName, lastName } = professional;
  return `${firstName?.[0] ?? ""}${lastName[0]}`;
}

/*
 * Lo stato "selezionato" dei chip usa la coppia `accent`/`accent-foreground` e
 * non il teal pieno con testo bianco che il codice ereditato aveva qui: il §6.1
 * chiede di verificare caso per caso il bianco su `secondary`, e su testo da
 * 14px in peso normale il rapporto è 2.83:1, sotto il minimo AA di 4.5. Menta
 * chiara con il blu petrolio dà 10.7:1, e il bordo teal dice comunque quale
 * chip è scelto.
 */

/** Gli slot di un giorno, nell'ordine in cui il giorno li propone. */
type SlotDay = { key: string; date: Date; slots: AppointmentSlot[] };

function groupByDay(slots: AppointmentSlot[]): SlotDay[] {
  const days: SlotDay[] = [];
  for (const slot of slots) {
    const key = formatDate(slot.start);
    const day = days.find((entry) => entry.key === key);
    if (day) {
      day.slots.push(slot);
      continue;
    }
    days.push({ key, date: slot.start, slots: [slot] });
  }
  return days;
}

function BookingDialog({
  professional,
  onClose,
}: {
  professional: Professional;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const kind = serviceOf(professional);
  const { data: slots } = useAvailableSlots(professional.id);
  const { data: entitlement } = useEntitlement(kind);

  /*
   * Stato del dialogo, non stato del dominio (§5.2): quale slot è selezionato e
   * quale conferma è a schermo muoiono con il dialogo. Ciò che resta lo scrive
   * la mutation e lo rileggono le query.
   */
  const [selected, setSelected] = useState<AppointmentSlot | null>(null);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const book = useMutation({
    mutationFn: (slot: AppointmentSlot) => dataProvider.bookAppointment(slot),
    onSuccess: (appointment, slot) => {
      /*
       * La stessa seduta vive sui due lati del marketplace, quindi si invalidano
       * le due radici: quella del professionista porta con sé sedute, pazienti e
       * disponibilità, quella del dipendente appuntamenti e contatori.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.professional.root(slot.professionalId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.root() });
      setConfirmed(appointment);
    },
  });

  if (!slots || !entitlement) return null;

  const name = professionalDisplayName(professional);
  const overCap = entitlement.used >= entitlement.total;
  const canConfirm =
    selected !== null &&
    !book.isPending &&
    (!overCap || entitlement.extraSessionPrice !== undefined);

  if (confirmed) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex p-4 bg-accent rounded-2xl">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        <div>
          <p className="font-semibold">
            {t.employee.psychologists.dialog.confirmedTitle}
          </p>
          <p className="text-sm text-muted-foreground mt-1 tabular-nums">
            {interpolate(t.employee.psychologists.dialog.summaryWhen, {
              weekday: formatWeekday(confirmed.start),
              date: formatDate(confirmed.start),
              time: formatTime(confirmed.start),
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {interpolate(t.employee.psychologists.dialog.confirmedWith, {
              professional: name,
            })}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {t.employee.psychologists.dialog.confirmedNote}
        </p>
        <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {t.employee.psychologists.dialog.close}
        </Button>
      </div>
    );
  }

  const days = groupByDay(slots);
  const selectedDay = days.find((day) =>
    day.slots.some((slot) => slot.start.getTime() === selected?.start.getTime()),
  );

  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        {t.employee.psychologists.dialog.noSlots}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">
          {t.employee.psychologists.dialog.chooseDay}
        </p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelected(day.slots[0])}
              className={`rounded-lg border px-3 py-2 text-sm tabular-nums transition-colors ${
                selectedDay?.key === day.key
                  ? "border-secondary bg-accent font-semibold text-accent-foreground"
                  : "border-border bg-card hover:border-secondary/50"
              }`}
            >
              {interpolate(t.employee.psychologists.dialog.dayOption, {
                weekday: formatWeekday(day.date),
                date: formatDate(day.date),
              })}
            </button>
          ))}
        </div>
      </div>

      {selectedDay && (
        <div>
          <p className="text-sm font-medium mb-2">
            {t.employee.psychologists.dialog.chooseTime}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot.start.getTime()}
                onClick={() => setSelected(slot)}
                className={`rounded-lg border px-3 py-2 text-sm tabular-nums transition-colors ${
                  selected?.start.getTime() === slot.start.getTime()
                    ? "border-secondary bg-accent font-semibold text-accent-foreground"
                    : "border-border bg-card hover:border-secondary/50"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="bg-accent/60 rounded-lg p-3 text-sm">
          <p className="font-medium">
            {t.employee.psychologists.dialog.summary}
          </p>
          <p className="text-muted-foreground tabular-nums">
            {interpolate(t.employee.psychologists.dialog.summaryWhen, {
              weekday: formatWeekday(selected.start),
              date: formatDate(selected.start),
              time: formatTime(selected.start),
            })}
          </p>
          {!overCap && (
            <p className="text-secondary-strong font-medium mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {t.employee.psychologists.dialog.included}
            </p>
          )}
          {overCap && entitlement.extraSessionPrice !== undefined && (
            <p className="font-medium mt-1 tabular-nums">
              {interpolate(
                t.employee.psychologists.dialog.overCapWithPrice,
                { price: formatCHF(entitlement.extraSessionPrice) },
              )}
            </p>
          )}
          {overCap && entitlement.extraSessionPrice === undefined && (
            <p className="font-medium mt-1">
              {t.employee.psychologists.dialog.overCapWithoutPrice}
            </p>
          )}
        </div>
      )}

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={!canConfirm}
        onClick={() => selected && book.mutate(selected)}
      >
        {t.employee.psychologists.dialog.confirm}
      </Button>
    </div>
  );
}

function ProfessionalCard({
  professional,
  onBook,
}: {
  professional: Professional;
  onBook: () => void;
}) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-lg font-bold text-secondary-strong">
            {initials(professional)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">
                {professionalDisplayName(professional)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.qualification[professional.qualificationKey]}
              </p>
            </div>
            {/* Chi non ha ancora erogato sedute non ha una valutazione: la
                riga sparisce invece di mostrare uno zero (§11). */}
            {professional.rating !== null ? (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                <span className="font-medium tabular-nums">
                  {formatRating(professional.rating)}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {/* stessa scelta dei chip di questo file, per la stessa ragione */}
            <Badge
              variant="outline"
              className="text-xs border-transparent bg-accent text-accent-foreground"
            >
              {t.specialty[professional.specialty]}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {professional.languages
                .map((language) => t.language[language])
                .join(t.common.listSeparator)}
            </span>
            <span className="flex items-center gap-1 tabular-nums">
              <Video className="w-3 h-3" />
              {interpolate(t.employee.psychologists.totalSessions, {
                n: formatNumber(professional.totalSessions),
              })}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 self-center">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onBook}
          >
            {t.employee.psychologists.book}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProfessionalList({
  professionals,
  onBook,
}: {
  professionals: Professional[];
  onBook: (professional: Professional) => void;
}) {
  if (professionals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t.employee.psychologists.empty}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          professional={professional}
          onBook={() => onBook(professional)}
        />
      ))}
    </div>
  );
}

export default function Psicologi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: professionals } = useProfessionals();
  const [booking, setBooking] = useState<Professional | null>(null);

  /*
   * Il servizio scelto vive nell'URL e non in uno stato locale: la home ci
   * manda con il filtro già scelto quando il contatore su cui hai toccato è
   * quello del coach.
   */
  const service = serviceFromParam(searchParams.get(SERVICE_PARAM));

  if (!professionals) return null;

  /*
   * Solo i prenotabili. Il provider restituisce il roster intero perché il
   * back-office deve seguire chi è in verifica (§10.E), e chi prenota vede i
   * soli professionisti con documenti **e** mandato in ordine — la stessa
   * regola con cui la rete check-up non propone il Centro Diagnostico Basalto.
   */
  const byService = (kind: CappedServiceKind) =>
    professionals.filter(
      (professional) =>
        isBookable(professional) && serviceOf(professional) === kind,
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {t.employee.psychologists.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.employee.psychologists.subtitle}
        </p>
      </div>

      <Tabs
        value={service}
        onValueChange={(value) =>
          setSearchParams({ [SERVICE_PARAM]: value }, { replace: true })
        }
      >
        <TabsList>
          <TabsTrigger value="psychologist">
            {t.employee.psychologists.filter.psychologist}
          </TabsTrigger>
          <TabsTrigger value="coach">
            {t.employee.psychologists.filter.coach}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="psychologist" className="mt-4">
          <ProfessionalList
            professionals={byService("psychologist")}
            onBook={setBooking}
          />
        </TabsContent>
        <TabsContent value="coach" className="mt-4">
          <ProfessionalList
            professionals={byService("coach")}
            onBook={setBooking}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={booking !== null}
        onOpenChange={(open) => !open && setBooking(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {booking
                ? interpolate(t.employee.psychologists.dialog.title, {
                    professional: professionalDisplayName(booking),
                  })
                : ""}
            </DialogTitle>
          </DialogHeader>
          {booking && (
            <BookingDialog
              professional={booking}
              onClose={() => setBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
