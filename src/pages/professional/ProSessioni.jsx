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
import { formatDate, formatTime, formatWeekday } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { dataProvider } from '@/lib/data';
import { queryKeys } from '@/lib/data/query-keys';
import { usePortalProfessionalId, useProfessionalSessions } from '@/lib/data/queries';

function SessionRow({ session, onNote }) {
  const tone = {
    scheduled: 'bg-secondary/10 text-secondary',
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
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              <Video className="w-3.5 h-3.5 mr-1" /> {t.professional.sessions.start}
            </Button>
          )}
          {session.status === 'completed' && (
            <Button size="sm" variant="outline" onClick={() => onNote(session)}>
              <FileText className="w-3.5 h-3.5 mr-1" />
              {session.hasNote ? t.professional.sessions.editNote : t.professional.sessions.addNote}
            </Button>
          )}
          {session.status === 'cancelled' && (
            <Badge variant="outline" className="text-destructive border-destructive/30">
              {t.cancellationReason[session.cancellationReasonKey]}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

function SessionList({ sessions, emptyLabel, onNote }) {
  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">{emptyLabel}</Card>
    );
  }
  return sessions.map((session) => (
    <SessionRow key={session.id} session={session} onNote={onNote} />
  ));
}

export default function ProSessioni() {
  const queryClient = useQueryClient();
  const { data: professionalId } = usePortalProfessionalId();
  const { data: sessions } = useProfessionalSessions(professionalId);

  /*
   * Stato del dialogo, non stato del dominio (CLAUDE.md §5.2): quale seduta è
   * aperta e cosa si sta scrivendo muoiono con il dialogo. Ciò che resta lo
   * scrive la mutation e lo rilegge la query.
   */
  const [openSession, setOpenSession] = useState(null);
  const [draft, setDraft] = useState({ notes: '', nextGoal: '', suggestedFollowUp: '' });

  const saveNote = useMutation({
    mutationFn: (note) => dataProvider.saveSessionNote(note),
    onSuccess: () => {
      // invalidare la radice porta con sé sedute, pazienti, compensi e pagamenti
      queryClient.invalidateQueries({
        queryKey: queryKeys.professional.root(professionalId),
      });
      setOpenSession(null);
    },
  });

  if (!sessions) return null;

  const upcoming = sessions.filter((session) => session.status === 'scheduled');
  const completed = sessions
    .filter((session) => session.status === 'completed')
    .slice()
    .reverse();
  const cancelled = sessions.filter((session) => session.status === 'cancelled');

  const openNote = (session) => {
    setDraft({ notes: '', nextGoal: '', suggestedFollowUp: '' });
    setOpenSession(session);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">{t.professional.sessions.title}</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            {interpolate(t.professional.sessions.upcoming, { n: String(upcoming.length) })}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {interpolate(t.professional.sessions.completed, { n: String(completed.length) })}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            {interpolate(t.professional.sessions.cancelled, { n: String(cancelled.length) })}
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
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder={t.professional.sessions.note.notesPlaceholder}
              />
            </div>
            <div>
              <Label>{t.professional.sessions.note.nextGoal}</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={draft.nextGoal}
                onChange={(e) => setDraft({ ...draft, nextGoal: e.target.value })}
                placeholder={t.professional.sessions.note.nextGoalPlaceholder}
              />
            </div>
            <div>
              <Label>{t.professional.sessions.note.followUp}</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={draft.suggestedFollowUp}
                onChange={(e) => setDraft({ ...draft, suggestedFollowUp: e.target.value })}
                placeholder={t.professional.sessions.note.followUpPlaceholder}
              />
            </div>
            <Button
              className="w-full bg-executive hover:bg-executive/90"
              disabled={saveNote.isPending}
              onClick={() => saveNote.mutate({ sessionId: openSession.id, ...draft })}
            >
              <Save className="w-4 h-4 mr-1" />
              {saveNote.isPending
                ? t.professional.sessions.note.saving
                : t.professional.sessions.note.save}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t.professional.sessions.note.privacy}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
