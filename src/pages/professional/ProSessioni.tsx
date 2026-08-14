import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Save, Video } from 'lucide-react';
import { formatDate, formatNumber, formatTime, formatWeekday } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { dataProvider } from '@/lib/data';
import { queryKeys } from '@/lib/data/query-keys';
import {
  loadState,
  usePortalProfessionalId,
  useProfessionalSessions,
  useSessionNote,
} from '@/lib/data/queries';
import { ErrorNotice } from '@/components/kora/StateNotice';
import type { ProfessionalSession, SessionNote } from '@/lib/data/types';

/** Il callback esiste solo dove le sedute possono avere una nota: le erogate. */
type NoteHandler = (session: ProfessionalSession) => void;

function SessionRow({
  session,
  onNote,
}: {
  session: ProfessionalSession;
  onNote?: NoteHandler;
}) {
  const tone = {
    scheduled: 'bg-secondary/10 text-secondary-strong',
    completed: 'bg-primary/10 text-primary',
    cancelled: 'bg-destructive/10 text-destructive',
  }[session.status];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${tone} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {session.patientInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{session.patientInitials}</p>
            <p className="text-xs text-muted-foreground">
              <span className="capitalize">{formatWeekday(session.start)}</span>{' '}
              <span className="tabular-nums">
                {formatDate(session.start)}, {formatTime(session.start)}
              </span>{' '}
              · {t.sessionType[session.type]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {session.status === 'scheduled' && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Video className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> {t.professional.sessions.start}
            </Button>
          )}
          {session.status === 'completed' && (
            <Button size="sm" variant="outline" onClick={() => onNote?.(session)}>
              <FileText className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              {session.hasNote ? t.professional.sessions.editNote : t.professional.sessions.addNote}
            </Button>
          )}
          {/* Il motivo è opzionale sul tipo — assente significa che la seduta
              non è annullata (`CONTRATTO-DATI.md` §2) — quindi il badge nasce
              con lui: senza, usciva un rettangolo rosso vuoto. */}
          {session.status === 'cancelled' && session.cancellationReasonKey && (
            <Badge variant="outline" className="text-destructive border-destructive/30">
              {t.cancellationReason[session.cancellationReasonKey]}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

function SessionList({
  sessions,
  emptyLabel,
  onNote,
}: {
  sessions: ProfessionalSession[];
  emptyLabel: string;
  onNote?: NoteHandler;
}) {
  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">{emptyLabel}</Card>
    );
  }
  return sessions.map((session) => (
    <SessionRow key={session.id} session={session} onNote={onNote} />
  ));
}

type NoteDraft = { notes: string; nextGoal: string; suggestedFollowUp: string };

const EMPTY_DRAFT: NoteDraft = { notes: '', nextGoal: '', suggestedFollowUp: '' };

/** Nessuno dei tre campi dice niente: non c'è una nota da salvare. */
function isNoteEmpty(draft: NoteDraft) {
  return !draft.notes.trim() && !draft.nextGoal.trim() && !draft.suggestedFollowUp.trim();
}

export default function ProSessioni() {
  const queryClient = useQueryClient();
  const portalIdQuery = usePortalProfessionalId();
  const professionalId = portalIdQuery.data;
  const sessionsQuery = useProfessionalSessions(professionalId);

  /*
   * Stato del dialogo, non stato del dominio (CLAUDE.md §5.2): quale seduta è
   * aperta e cosa si sta scrivendo muoiono con il dialogo. Ciò che resta lo
   * scrive la mutation e lo rilegge la query.
   */
  const [openSession, setOpenSession] = useState<ProfessionalSession | null>(null);

  /*
   * `null` vuol dire "non ha ancora scritto niente", e non è la stessa cosa di
   * tre campi vuoti: finché è `null` a schermo c'è la nota salvata, dal primo
   * tasto in poi vince quello che sta scrivendo.
   *
   * È il motivo per cui qui non serve nessun effetto che semini la bozza quando
   * la nota arriva — e un effetto del genere avrebbe dovuto ricordarsi per
   * quale seduta l'aveva già fatto, per non sovrascrivere il testo appena
   * digitato.
   */
  const [draft, setDraft] = useState<NoteDraft | null>(null);

  /* Il primo lettore di `getSessionNote`: "Modifica nota" apriva un foglio
     bianco e salvando sovrascriveva quella che c'era. */
  const noteQuery = useSessionNote(professionalId, openSession?.id);
  const stored = noteQuery.data;
  const current: NoteDraft =
    draft ??
    (stored
      ? {
          notes: stored.notes,
          nextGoal: stored.nextGoal,
          suggestedFollowUp: stored.suggestedFollowUp,
        }
      : EMPTY_DRAFT);

  const saveNote = useMutation({
    mutationFn: (note: Omit<SessionNote, "updatedAt">) =>
      dataProvider.saveSessionNote(note),
    onSuccess: () => {
      // invalidare la radice porta con sé sedute, pazienti, compensi e pagamenti
      queryClient.invalidateQueries({
        queryKey: queryKeys.professional.root(professionalId ?? ""),
      });
      setOpenSession(null);
    },
  });

  /* I tre casi (M5.b), registro strumento. */
  const page = loadState([portalIdQuery, sessionsQuery]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const sessions = sessionsQuery.data;
  if (sessions === undefined) return null;

  const upcoming = sessions.filter((session) => session.status === 'scheduled');
  const completed = sessions
    .filter((session) => session.status === 'completed')
    .slice()
    .reverse();
  const cancelled = sessions.filter((session) => session.status === 'cancelled');

  const openNote: NoteHandler = (session) => {
    setDraft(null);
    setOpenSession(session);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">{t.professional.sessions.title}</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            {interpolate(t.professional.sessions.upcoming, { n: formatNumber(upcoming.length) })}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {interpolate(t.professional.sessions.completed, { n: formatNumber(completed.length) })}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            {interpolate(t.professional.sessions.cancelled, { n: formatNumber(cancelled.length) })}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-3 mt-4">
          <SessionList sessions={upcoming} emptyLabel={t.professional.sessions.emptyUpcoming} />
        </TabsContent>
        <TabsContent value="completed" className="space-y-3 mt-4">
          <SessionList
            sessions={completed}
            emptyLabel={t.professional.sessions.emptyCompleted}
            onNote={openNote}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-3 mt-4">
          <SessionList sessions={cancelled} emptyLabel={t.professional.sessions.emptyCancelled} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!openSession} onOpenChange={() => setOpenSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {interpolate(t.professional.sessions.note.title, {
                patient: openSession ? openSession.patientInitials : '',
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.professional.sessions.note.notes}</Label>
              <Textarea
                className="mt-1.5"
                rows={4}
                value={current.notes}
                onChange={(e) => setDraft({ ...current, notes: e.target.value })}
                placeholder={t.professional.sessions.note.notesPlaceholder}
              />
            </div>
            <div>
              <Label>{t.professional.sessions.note.nextGoal}</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={current.nextGoal}
                onChange={(e) => setDraft({ ...current, nextGoal: e.target.value })}
                placeholder={t.professional.sessions.note.nextGoalPlaceholder}
              />
            </div>
            <div>
              <Label>{t.professional.sessions.note.followUp}</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={current.suggestedFollowUp}
                onChange={(e) => setDraft({ ...current, suggestedFollowUp: e.target.value })}
                placeholder={t.professional.sessions.note.followUpPlaceholder}
              />
            </div>
            {/*
              * Le tre textarea non hanno uno schema: sono testo libero, e
              * `SessionNote` non pone vincoli su nessuna delle tre. Una
              * textarea che ammette tutto non ha regole da raccontare, quindi
              * la macchina di zod qui sarebbe più grande del caso (§11).
              *
              * L'UNICA REGOLA È DI CONTRATTO, e non riguarda il testo ma il
              * fatto: `ProfessionalSession.hasNote` esiste perché le proiezioni
              * sappiano che una nota c'è, e salvarne una vuota lo renderebbe
              * vero su qualcosa che non esiste — il §5.5 applicato a un
              * booleano. Il pulsante spento è il modo più quieto di dirlo: non
              * c'è niente da segnalare finché non si è scritto niente.
              */}
            <Button
              className="w-full bg-executive hover:bg-executive/90"
              disabled={saveNote.isPending || isNoteEmpty(current)}
              onClick={() =>
                openSession && saveNote.mutate({ sessionId: openSession.id, ...current })
              }
            >
              <Save className="w-4 h-4 mr-1" aria-hidden="true" />
              {saveNote.isPending
                ? t.professional.sessions.note.saving
                : t.professional.sessions.note.save}
            </Button>
            {/* Il testo scritto resta nel campo: `draft` è stato locale e la
                mutation fallita non lo tocca, quindi ritentare non costa di
                riscriverla. La frase lo dice. */}
            {saveNote.isError && (
              <ErrorNotice copy={t.professional.sessions.note.error} />
            )}
            <p className="text-xs text-muted-foreground text-center">
              {t.professional.sessions.note.privacy}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
