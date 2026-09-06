import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ErrorNotice } from "@/components/kora/StateNotice";
import { dataProvider } from "@/lib/data";
import { queryKeys } from "@/lib/data/query-keys";
import type { Appointment } from "@/lib/data/types";
import { formatDate, formatTime, formatWeekday } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * La disdetta di un appuntamento, dal lato del dipendente (CLAUDE.md §10.B.5).
 *
 * È UN `AlertDialog` E NON UN `Dialog`, ed è la differenza fra i due gesti: la
 * disdetta della professionista si scrive — c'è una nota, un messaggio, dei
 * campi da compilare — mentre questa è una domanda con due risposte. Un
 * `AlertDialog` è modale sul serio: non si chiude cliccando fuori, e il fuoco
 * parte dentro. Per un gesto che non si ritira è la forma giusta.
 *
 * INVALIDA DUE RADICI, come `cancelSession` e `bookAppointment`: la seduta è
 * **un record solo** visto da due lati (`docs/CONTRATTO-DATI.md` §4). Dal lato
 * del dipendente cambiano gli appuntamenti e il contatore in programma; da
 * quello della professionista, agenda, pazienti e disponibilità — e l'ora torna
 * libera davvero, perché `getAvailableSlots` sottrae le sole sedute non
 * annullate.
 *
 * NON PORTA TESTI, e non è una versione ridotta dell'altro verso: una riga
 * scritta da qui avrebbe un terzo destinatario — chi cura la riceverebbe — e con
 * lui le domande su quando la legge e come le arriva, che sono la notifica del
 * §8.5 e non sono decise.
 */
export default function CancelAppointmentDialog({
  appointment,
  professionalName,
  onClose,
}: {
  /** L'appuntamento da disdire; `null` tiene il dialogo chiuso. */
  appointment: Appointment | null;
  professionalName: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const cancel = useMutation({
    mutationFn: (appointmentId: string) =>
      dataProvider.cancelAppointment(appointmentId),
    onSuccess: (cancelled) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.root() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.professional.root(cancelled.professionalId),
      });
      onClose();
    },
  });

  /* Chiudendo si torna puliti: riaprendo, l'errore di un tentativo precedente
     non deve ricomparire su un appuntamento diverso. */
  const close = () => {
    cancel.reset();
    onClose();
  };

  return (
    <AlertDialog
      open={appointment !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <AlertDialogContent className="max-w-md">
        {appointment && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t.employee.home.cancel.title}
              </AlertDialogTitle>
              {/*
                * IL RIEPILOGO È LA DESCRIZIONE DEL DIALOGO, non un paragrafo
                * accanto: `AlertDialogDescription` è ciò che Radix annuncia
                * dopo il titolo, quindi chi ascolta sente **quale**
                * appuntamento sta per disdire prima di arrivare ai due
                * pulsanti.
                */}
              <AlertDialogDescription>
                {interpolate(t.employee.home.cancel.summary, {
                  weekday: formatWeekday(appointment.start),
                  date: formatDate(appointment.start),
                  time: formatTime(appointment.start),
                  professional: professionalName,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Dice **l'invariante e non la policy**, come la frase gemella del
                portale professionista: che l'ora torni proponibile dipende dal
                fatto che sia una fascia dichiarata, e il preavviso non è deciso
                (`docs/CONTRATTO-DATI.md` §8.5). Quello che è sempre vero è che
                l'ora non è più occupata, e che si può riprenotare. */}
            <p className="text-sm text-muted-foreground">
              {t.employee.home.cancel.effect}
            </p>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={cancel.isPending}>
                {t.employee.home.cancel.keep}
              </AlertDialogCancel>
              {/*
                * `preventDefault` PERCHÉ LA CHIUSURA LA DECIDE L'ESITO.
                *
                * `AlertDialogAction` chiude il dialogo al clic, e con una
                * scrittura che può fallire quella è la chiusura sbagliata: lo
                * stato d'errore comparirebbe sotto un dialogo che non c'è più.
                * Chiude `onSuccess`, che è anche l'unico momento in cui c'è
                * qualcosa da chiudere.
                */}
              <AlertDialogAction
                disabled={cancel.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  cancel.mutate(appointment.id);
                }}
              >
                {cancel.isPending
                  ? t.employee.home.cancel.confirming
                  : t.employee.home.cancel.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>

            {/* Dice cosa **non** è successo, come le altre mutation (M5.b):
                l'appuntamento è ancora in programma, e ritentare è lo stesso
                pulsante. */}
            {cancel.isError && (
              <ErrorNotice copy={t.employee.home.cancel.error} />
            )}
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
