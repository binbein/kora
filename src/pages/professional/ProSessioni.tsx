import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarX, FileText, Save, Video } from 'lucide-react';
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
import CancelSessionDialog from '@/components/professional/CancelSessionDialog';
import {
  patientDisplayName,
  patientInitials,
  type ProfessionalSession,
  type SessionNote,
} from '@/lib/data/types';

/** Il callback esiste solo dove le sedute possono avere una nota: le erogate. */
type NoteHandler = (session: ProfessionalSession) => void;

/** E questo solo dove si può annullare: le sessioni in programma. */
type CancelHandler = (session: ProfessionalSession) => void;

function SessionRow({
  session,
  onNote,
  onCancel,
}: {
  session: ProfessionalSession;
  onNote?: NoteHandler;
  onCancel?: CancelHandler;
}) {
  /*
   * `-strong` sul testo, token base sul riempimento (§6.1). Lo stato annullato
   * stava su `text-destructive`, cioè **3.30:1** sulla tinta `/10` mentre il
   * `Badge` di shadcn è testo normale: la soglia è 4.5. Con
   * `destructive-strong` sono 4.93:1, e il riempimento non si muove — è il
   * verde accanto che questa riga ha sempre fatto giusto.
   */
  const tone = {
    scheduled: 'bg-secondary/10 text-secondary-strong',
    completed: 'bg-primary/10 text-primary',
    cancelled: 'bg-destructive/10 text-destructive-strong',
  }[session.status];

  /*
   * LA RIGA CEDE IN DUE MODI, E PRIMA NON NE AVEVA NESSUNO (16.08.2026).
   *
   * Il difetto: il blocco di destra è `flex-shrink-0` e il pulsante eredita
   * `whitespace-nowrap` da shadcn, quindi non cede mai; quello di sinistra
   * aveva `min-w-0` e **nessun troncamento**, quindi si stringeva fino a niente
   * e il testo continuava a **dipingere fuori dalla propria scatola**, sopra il
   * pulsante. Misurato a 420px: la data chiedeva 72px in una scatola da 17.
   *
   * Non è un difetto di mobile — la soglia dichiarata resta 1280px (§10.C) — è
   * il §2.7: niente larghezze fisse su etichette e pulsanti, e un layout che
   * regge parole più lunghe. Le etichette di questa riga cambiano con la lingua
   * e con lo stato della seduta, quindi la larghezza del pulsante non è nota a
   * chi scrive la riga.
   *
   * I due modi:
   *   - `truncate` sulle due righe di testo: dentro la propria scatola il testo
   *     si accorcia con i puntini invece di uscirne;
   *   - `flex-wrap` più una base sul blocco di sinistra: sotto quella larghezza
   *     il pulsante **scende sotto** invece di schiacciare il testo. La base non
   *     è una larghezza fissa su un'etichetta — è la soglia sotto la quale la
   *     riga smette di leggersi come "iniziali + data", cioè il punto in cui è
   *     giusto che a spostarsi sia il pulsante.
   *
   * A 1280 non cambia niente, in nessuna delle quattro lingue: i due blocchi
   * stanno sulla stessa riga con ~370px di margine.
   */
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1 basis-64">
          <div className={`w-10 h-10 rounded-xl ${tone} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {patientInitials(session)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{patientDisplayName(session)}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="capitalize">{formatWeekday(session.start)}</span>{' '}
              <span className="tabular-nums">
                {formatDate(session.start)}, {formatTime(session.start)}
              </span>{' '}
              · {t.sessionType[session.type]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/*
            * IL PULSANTE RESTA E DICE PERCHÉ NON SI PREME, come quello del
            * check-up (`Checkup.tsx`): è lo stesso caso, un'azione che il
            * prodotto avrà e la demo non simula (§1.1).
            *
            * Fino al 16.08.2026 era abilitato e senza `onClick`: l'unico
            * controllo attivo dell'applicazione che non faceva niente, sulla
            * prima scheda che si apre entrando nel portale. Toglierlo avrebbe
            * lasciato la seduta in programma senza esito visibile; il motivo
            * sta nell'etichetta, perché è lì che lo cerca chi ha appena
            * provato a premere.
            */}
          {session.status === 'scheduled' && (
            <>
              <Button size="sm" variant="outline" disabled>
                <Video className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                {t.professional.sessions.startUnavailable}
              </Button>
              {/*
                * Il gesto esiste **solo dove il metodo lo accetta**: una
                * sessione erogata o annullata non si annulla, e il provider la
                * rifiuta — ma un pulsante che compare e viene respinto è un
                * invito a sbagliare, non una difesa (§11).
                */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel?.(session)}
              >
                <CalendarX className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                {t.professional.sessions.cancel.action}
              </Button>
            </>
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
            <Badge variant="outline" className="text-destructive-strong border-destructive/30">
              {t.cancellationReason[session.cancellationReasonKey]}
            </Badge>
          )}
        </div>
      </div>
      {/* La nota di annullamento sta su una riga sua e non nel blocco di
          destra: è testo libero, e schiacciato accanto al badge tornerebbe a
          dipingere fuori dalla propria scatola come faceva la data. Vive solo
          su questa proiezione — il back-office non ha il campo. */}
      {session.cancellationNote && (
        <p className="text-xs text-muted-foreground mt-3">
          {interpolate(t.professional.sessions.cancel.noteShown, {
            note: session.cancellationNote,
          })}
        </p>
      )}
    </Card>
  );
}

function SessionList({
  sessions,
  emptyLabel,
  onNote,
  onCancel,
}: {
  sessions: ProfessionalSession[];
  emptyLabel: string;
  onNote?: NoteHandler;
  onCancel?: CancelHandler;
}) {
  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">{emptyLabel}</Card>
    );
  }
  return sessions.map((session) => (
    <SessionRow
      key={session.id}
      session={session}
      onNote={onNote}
      onCancel={onCancel}
    />
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

  /* La sessione che si sta annullando: stesso stato di dialogo, altro dialogo. */
  const [cancelling, setCancelling] = useState<ProfessionalSession | null>(null);

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

  /*
   * I TRE CASI VALGONO ANCHE QUI, E IL RAMO D'ERRORE RIAPRIVA IL DIFETTO CHE
   * QUESTA QUERY ESISTE PER CHIUDERE (16.08.2026).
   *
   * `stored` resta `undefined` sia mentre la nota arriva sia quando non
   * arriverà mai: senza distinguerli, una lettura fallita su una seduta che una
   * nota **ce l'ha** apriva tre campi bianchi sotto l'etichetta "Modifica
   * nota", e "Salva" ci scriveva sopra il vuoto. Il guasto di rete diventava
   * una cancellazione.
   *
   * La query non entra nel gruppo della pagina: è disabilitata finché non c'è
   * un dialogo aperto, e lì dentro direbbe "in attesa" a una schermata che non
   * aspetta niente. Ha il suo stato, dentro il dialogo che la usa.
   */
  const note = loadState([noteQuery]);
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
          <SessionList
            sessions={upcoming}
            emptyLabel={t.professional.sessions.emptyUpcoming}
            onCancel={setCancelling}
          />
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

      <CancelSessionDialog
        session={cancelling}
        professionalId={professionalId}
        onClose={() => setCancelling(null)}
      />

      <Dialog open={!!openSession} onOpenChange={() => setOpenSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {interpolate(t.professional.sessions.note.title, {
                patient: openSession ? patientDisplayName(openSession) : '',
              })}
            </DialogTitle>
          </DialogHeader>
          {/*
            * Sull'errore il modulo non si disegna affatto, e non è severità: tre
            * campi vuoti accanto a "non è stato possibile leggere la nota" si
            * leggono comunque come una nota vuota, che è precisamente
            * l'equivoco da cui nasce la sovrascrittura. Il gesto utile è
            * rileggere, e ce l'ha il "Riprova".
            */}
          {note.state === "error" ? (
            <ErrorNotice
              copy={t.professional.sessions.note.loadError}
              onRetry={note.retry}
            />
          ) : (
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
            {/*
              * `note.state !== "ready"` è la terza condizione, e sorveglia
              * l'attesa: finché la nota salvata non è arrivata non si sa cosa
              * si sovrascriverebbe. Il corpo del dialogo **non** si sospende —
              * lo si è deciso il 15.08.2026, perché sospenderlo toccherebbe
              * anche le 55 sedute senza nota, dove il modulo vuoto è già la
              * resa giusta: a non essere disponibile è il salvataggio, non la
              * schermata.
              */}
            <Button
              className="w-full bg-executive hover:bg-executive/90"
              disabled={
                saveNote.isPending ||
                isNoteEmpty(current) ||
                note.state !== "ready"
              }
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
