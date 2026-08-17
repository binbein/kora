import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorNotice } from "@/components/kora/StateNotice";
import { dataProvider } from "@/lib/data";
import { queryKeys } from "@/lib/data/query-keys";
import { patientDisplayName, type ProfessionalSession } from "@/lib/data/types";
import { formatDate, formatTime, formatWeekday } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * L'annullamento di una sessione in programma (CLAUDE.md §10.D).
 *
 * STA IN UN COMPONENTE PERCHÉ I PUNTI DA CUI SI ANNULLA SONO DUE — il
 * calendario e la lista sessioni — e la mutation è una sola cosa: scritta due
 * volte sarebbero due superfici di invalidazione da tenere allineate a mano, che
 * è precisamente ciò che il §5.2 evita. Non è il wrapper che il §11 vieta: quel
 * divieto riguarda un hook attorno a una `useMutation` con un chiamante solo, e
 * qui il componente porta anche il dialogo, la nota e i tre stati.
 *
 * INVALIDA DUE RADICI, come `bookAppointment` e per la stessa ragione: la seduta
 * è **un record solo** visto da due lati (`docs/CONTRATTO-DATI.md` §4). Dal lato
 * del professionista cambiano agenda, pazienti e disponibilità; dal lato del
 * dipendente sparisce l'appuntamento dalla home. Il compenso non si muove perché
 * conta le erogate, e il contatore nemmeno — ma stanno sotto la stessa radice, e
 * rileggerli è più onesto che decidere qui cosa non è cambiato.
 */
export default function CancelSessionDialog({
  session,
  professionalId,
  onClose,
}: {
  /** La seduta da annullare; `null` tiene il dialogo chiuso. */
  session: ProfessionalSession | null;
  professionalId: string | undefined;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  /* Stato del dialogo, non del dominio: muore con il dialogo (§5.2). */
  const [note, setNote] = useState("");

  const cancel = useMutation({
    mutationFn: (input: { sessionId: string; note: string }) =>
      dataProvider.cancelSession(input.sessionId, input.note),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.professional.root(professionalId ?? ""),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.root() });
      onClose();
    },
  });

  const close = () => {
    setNote("");
    cancel.reset();
    onClose();
  };

  return (
    <Dialog open={session !== null} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.professional.sessions.cancel.title}</DialogTitle>
        </DialogHeader>
        {session && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {interpolate(t.professional.sessions.cancel.summary, {
                patient: patientDisplayName(session),
                weekday: formatWeekday(session.start),
                date: formatDate(session.start),
                time: formatTime(session.start),
              })}
            </p>

            <div>
              <Label htmlFor="cancel-note">
                {t.professional.sessions.cancel.noteLabel}
              </Label>
              <Textarea
                id="cancel-note"
                className="mt-1.5"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t.professional.sessions.cancel.notePlaceholder}
              />
              {/* La nota resta di chi cura, come quella di sessione: è la
                  stessa garanzia, e la frase la dice dove si scrive. */}
              <p className="text-xs text-muted-foreground mt-1.5">
                {t.professional.sessions.cancel.notePrivacy}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              {t.professional.sessions.cancel.effect}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={close}>
                {t.professional.sessions.cancel.keep}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={cancel.isPending}
                onClick={() =>
                  cancel.mutate({ sessionId: session.id, note })
                }
              >
                {cancel.isPending
                  ? t.professional.sessions.cancel.confirming
                  : t.professional.sessions.cancel.confirm}
              </Button>
            </div>

            {/* Dice cosa **non** è successo, come le altre tre mutation
                (M5.b): la seduta è ancora in programma, e ritentare è lo
                stesso pulsante. */}
            {cancel.isError && (
              <ErrorNotice copy={t.professional.sessions.cancel.error} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
