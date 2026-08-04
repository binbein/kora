import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';

const patients = [
  { id: 'G.R.', sessions: 3, lastSession: '22 Apr 2026', nextSession: '29 Apr 2026', status: 'Attivo' },
  { id: 'M.B.', sessions: 5, lastSession: '18 Apr 2026', nextSession: '29 Apr 2026', status: 'Attivo' },
  { id: 'E.K.', sessions: 0, lastSession: '—', nextSession: '29 Apr 2026', status: 'Nuovo' },
  { id: 'S.C.', sessions: 8, lastSession: '24 Apr 2026', nextSession: '6 Mag 2026', status: 'Attivo' },
  { id: 'L.B.', sessions: 2, lastSession: '24 Apr 2026', nextSession: '1 Mag 2026', status: 'Attivo' },
  { id: 'A.T.', sessions: 0, lastSession: '—', nextSession: '1 Mag 2026', status: 'Nuovo' },
];

export default function ProPazienti() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Pazienti</h1>
        <p className="text-sm text-muted-foreground mt-1">{patients.length} pazienti attivi</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/60 border border-secondary/20 rounded-lg p-3">
        <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
        <span>I nomi sono abbreviati per privacy. Le note cliniche sono visibili solo a te.</span>
      </div>

      <div className="space-y-3">
        {patients.map((p) => (
          <Card key={p.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-executive/10 flex items-center justify-center text-sm font-bold text-executive">
                  {p.id}
                </div>
                <div>
                  <p className="text-sm font-semibold">Paziente {p.id}</p>
                  <p className="text-xs text-muted-foreground">{p.sessions} sessioni completate</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={p.status === 'Nuovo' ? 'outline' : 'default'} className={p.status === 'Nuovo' ? 'border-warning text-warning' : 'bg-secondary/10 text-secondary'}>
                  {p.status}
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">Prossima: {p.nextSession}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}