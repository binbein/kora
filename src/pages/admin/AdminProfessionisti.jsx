import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, CheckCircle2, Clock, XCircle, Star } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const professionals = [
  { name: 'Dr.ssa Laura Bianchi', type: 'Psicologa', cert: 'FSP-2019-4521', languages: 'IT, DE', rate: 75, sessions: 340, rating: 4.9, docsOk: true, mandateOk: true, status: 'active' },
  { name: 'Dr. Marco Ferretti', type: 'Medico', cert: 'FMH-2015-8830', languages: 'IT, FR', rate: 90, sessions: 210, rating: 4.8, docsOk: true, mandateOk: true, status: 'active' },
  { name: 'Coach Anna Sergi', type: 'Coach', cert: 'ICF-ACC-3310', languages: 'IT', rate: 60, sessions: 88, rating: 4.7, docsOk: true, mandateOk: false, status: 'pending' },
  { name: 'Dr.ssa Sofia Kramer', type: 'Psicologa', cert: 'FSP-2021-9901', languages: 'DE, EN', rate: 75, sessions: 0, rating: null, docsOk: false, mandateOk: false, status: 'pending' },
  { name: 'Dr. Paolo Valli', type: 'Nutrizionista', cert: 'SVDE-2018-7712', languages: 'IT, FR', rate: 65, sessions: 145, rating: 4.6, docsOk: true, mandateOk: true, status: 'active' },
];

const statusColors = {
  active: 'bg-secondary/10 text-secondary',
  pending: 'bg-warning/20 text-foreground',
  inactive: 'bg-destructive/10 text-destructive',
};

export default function AdminProfessionisti() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Professionisti</h1>
        <Button size="sm"><Briefcase className="w-4 h-4 mr-1" /> Invita professionista</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Totale" value={professionals.length} icon={Briefcase} />
        <KPICard title="Attivi" value={professionals.filter(p => p.status === 'active').length} icon={Briefcase} variant="secondary" />
        <KPICard title="In verifica" value={professionals.filter(p => p.status === 'pending').length} icon={Clock} />
        <KPICard title="Sessioni totali" value="783" icon={Star} />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Certificazione</TableHead>
              <TableHead>Lingue</TableHead>
              <TableHead>Tariffa</TableHead>
              <TableHead>Sessioni</TableHead>
              <TableHead>Documenti</TableHead>
              <TableHead>Mandato</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((p) => (
              <TableRow key={p.name} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(p)}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.cert}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.languages}</TableCell>
                <TableCell>CHF {p.rate}</TableCell>
                <TableCell>{p.sessions}</TableCell>
                <TableCell>
                  {p.docsOk
                    ? <CheckCircle2 className="w-4 h-4 text-secondary" />
                    : <Clock className="w-4 h-4 text-warning" />}
                </TableCell>
                <TableCell>
                  {p.mandateOk
                    ? <CheckCircle2 className="w-4 h-4 text-secondary" />
                    : <XCircle className="w-4 h-4 text-destructive" />}
                </TableCell>
                <TableCell><Badge className={statusColors[p.status]}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span>{selected.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Certificazione</span><span>{selected.cert}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lingue</span><span>{selected.languages}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tariffa/sessione</span><span className="font-bold">CHF {selected.rate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sessioni totali</span><span>{selected.sessions}</span></div>
              {selected.rating && <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-secondary font-bold">{selected.rating}/5</span></div>}
              <div className="flex gap-2 pt-2">
                {selected.status === 'pending' && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 flex-1" onClick={() => setSelected(null)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approva
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                  Chiudi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}