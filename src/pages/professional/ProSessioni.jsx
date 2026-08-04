import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Video, CheckCircle2, X, Clock, FileText, Save } from 'lucide-react';

const upcoming = [
  { id: 1, patient: 'G.R.', date: 'Mar 29 Apr, 09:00', type: 'Sessione', duration: '50 min' },
  { id: 2, patient: 'M.B.', date: 'Mar 29 Apr, 10:00', type: 'Sessione', duration: '50 min' },
  { id: 3, patient: 'E.K.', date: 'Mar 29 Apr, 14:00', type: 'Prima visita', duration: '50 min' },
];

const completed = [
  { id: 4, patient: 'S.C.', date: 'Gio 24 Apr, 15:00', type: 'Sessione', duration: '50 min', hasNote: true },
  { id: 5, patient: 'L.B.', date: 'Gio 24 Apr, 09:00', type: 'Follow-up', duration: '50 min', hasNote: true },
  { id: 6, patient: 'G.R.', date: 'Mar 22 Apr, 09:00', type: 'Sessione', duration: '50 min', hasNote: false },
];

const cancelled = [
  { id: 7, patient: 'F.M.', date: 'Lun 21 Apr, 16:00', type: 'Sessione', reason: 'Annullata dal paziente' },
];

function SessionCard({ session, type, onNote }) {
  const statusColors = {
    upcoming: 'bg-secondary/10 text-secondary',
    completed: 'bg-primary/10 text-primary',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${statusColors[type]} flex items-center justify-center text-sm font-bold`}>
            {session.patient}
          </div>
          <div>
            <p className="text-sm font-semibold">{session.patient}</p>
            <p className="text-xs text-muted-foreground">{session.date} · {session.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {type === 'upcoming' && (
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              <Video className="w-3.5 h-3.5 mr-1" /> Avvia
            </Button>
          )}
          {type === 'completed' && (
            <Button size="sm" variant="outline" onClick={() => onNote(session)}>
              <FileText className="w-3.5 h-3.5 mr-1" /> {session.hasNote ? 'Nota' : 'Aggiungi nota'}
            </Button>
          )}
          {type === 'cancelled' && (
            <Badge variant="outline" className="text-destructive border-destructive/30">{session.reason}</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ProSessioni() {
  const [noteDialog, setNoteDialog] = useState(null);
  const [note, setNote] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Sessioni</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Prossime ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completate ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Annullate ({cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.map(s => <SessionCard key={s.id} session={s} type="upcoming" />)}
        </TabsContent>
        <TabsContent value="completed" className="space-y-3 mt-4">
          {completed.map(s => <SessionCard key={s.id} session={s} type="completed" onNote={setNoteDialog} />)}
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-3 mt-4">
          {cancelled.map(s => <SessionCard key={s.id} session={s} type="cancelled" />)}
        </TabsContent>
      </Tabs>

      {/* Note Dialog */}
      <Dialog open={!!noteDialog} onOpenChange={() => setNoteDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nota privata — {noteDialog?.patient}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note della sessione</Label>
              <Textarea className="mt-1.5" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Appunti clinici privati..." />
            </div>
            <div>
              <Label>Prossimo obiettivo</Label>
              <Textarea className="mt-1.5" rows={2} placeholder="Obiettivo per la prossima sessione..." />
            </div>
            <div>
              <Label>Follow-up suggerito</Label>
              <Textarea className="mt-1.5" rows={2} placeholder="Prossima sessione consigliata tra..." />
            </div>
            <Button onClick={() => setNoteDialog(null)} className="w-full bg-executive hover:bg-executive/90">
              <Save className="w-4 h-4 mr-1" /> Salva nota
            </Button>
            <p className="text-xs text-muted-foreground text-center">Le note sono private e non vengono condivise con l'azienda del paziente.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}