import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const sessions = [
  { id: 'APT-001', patient: 'G.R.', pro: 'Dr.ssa Bianchi', type: 'Psicologia', date: '29 Apr 2026, 09:00', status: 'booked', included: true, amount: 75 },
  { id: 'APT-002', patient: 'M.B.', pro: 'Dr.ssa Bianchi', type: 'Psicologia', date: '29 Apr 2026, 10:00', status: 'booked', included: true, amount: 75 },
  { id: 'APT-003', patient: 'E.K.', pro: 'Dr. Ferretti', type: 'Medico', date: '29 Apr 2026, 11:00', status: 'booked', included: true, amount: 90 },
  { id: 'APT-004', patient: 'S.C.', pro: 'Dr.ssa Bianchi', type: 'Psicologia', date: '24 Apr 2026, 15:00', status: 'completed', included: true, amount: 75 },
  { id: 'APT-005', patient: 'L.B.', pro: 'Coach Sergi', type: 'Coaching', date: '24 Apr 2026, 09:00', status: 'completed', included: false, amount: 60 },
  { id: 'APT-006', patient: 'F.M.', pro: 'Dr.ssa Bianchi', type: 'Psicologia', date: '21 Apr 2026, 16:00', status: 'cancelled', included: true, amount: 0 },
  { id: 'APT-007', patient: 'C.V.', pro: 'Dr. Ferretti', type: 'Medico', date: '20 Apr 2026, 10:00', status: 'completed', included: true, amount: 90 },
];

const statusColors = {
  booked: 'bg-secondary/10 text-secondary',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
  no_show: 'bg-warning/20 text-foreground',
};

export default function AdminSessioni() {
  const completed = sessions.filter(s => s.status === 'completed');
  const totalVolume = completed.reduce((s, a) => s + a.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Sessioni</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Totale sessioni" value={sessions.length} icon={ClipboardList} />
        <KPICard title="Completate" value={completed.length} icon={CheckCircle2} variant="secondary" />
        <KPICard title="Annullate" value={sessions.filter(s => s.status === 'cancelled').length} icon={XCircle} />
        <KPICard title="Volume CHF" value={`CHF ${totalVolume}`} icon={ClipboardList} />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Paziente</TableHead>
              <TableHead>Professionista</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Inclusa</TableHead>
              <TableHead>CHF</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-xs text-muted-foreground font-mono">{s.id}</TableCell>
                <TableCell className="font-medium">{s.patient}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{s.pro}</TableCell>
                <TableCell><Badge variant="outline">{s.type}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.date}</TableCell>
                <TableCell>
                  {s.included
                    ? <CheckCircle2 className="w-4 h-4 text-secondary" />
                    : <XCircle className="w-4 h-4 text-muted-foreground" />}
                </TableCell>
                <TableCell className="font-medium">{s.amount > 0 ? `CHF ${s.amount}` : '—'}</TableCell>
                <TableCell><Badge className={statusColors[s.status]}>{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}