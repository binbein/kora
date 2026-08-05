import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, User, Plus, Lock } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'];
const hours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const sessions = {
  'Mar-09:00': { name: 'G.R.', type: 'Sessione', status: 'booked' },
  'Mar-10:00': { name: 'M.B.', type: 'Sessione', status: 'booked' },
  'Mar-14:00': { name: 'E.K.', type: 'Prima visita', status: 'booked' },
  'Mar-15:00': { name: 'S.C.', type: 'Sessione', status: 'booked' },
  'Gio-09:00': { name: 'L.B.', type: 'Sessione', status: 'booked' },
  'Gio-10:00': { name: 'A.T.', type: 'Prima visita', status: 'booked' },
  'Gio-14:00': { name: 'G.R.', type: 'Follow-up', status: 'booked' },
  'Gio-16:00': { name: 'F.M.', type: 'Sessione', status: 'booked' },
};

const blocked = ['Mer-09:00', 'Mer-10:00', 'Mer-11:00', 'Mer-12:00', 'Mer-14:00', 'Mer-15:00', 'Mer-16:00', 'Mer-17:00'];

export default function ProCalendario() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-1">Settimana corrente — Aprile 2026</p>
        </div>
        <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Aggiungi disponibilità</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Sessioni questa settimana" value="8" icon={Calendar} />
        <KPICard title="Prossima sessione" value="Mar 09:00" icon={Clock} />
        <KPICard title="Sessioni mese" value="24" icon={Video} />
        <KPICard title="Pazienti attivi" value="18" icon={User} />
      </div>

      {/* Weekly Grid */}
      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-6 gap-1">
            <div className="p-2" />
            {days.map(d => (
              <div key={d} className="p-2 text-center text-sm font-semibold text-muted-foreground">{d}</div>
            ))}
            {hours.map(h => (
              <React.Fragment key={h}>
                <div className="p-2 text-xs text-muted-foreground text-right">{h}</div>
                {days.map(d => {
                  const key = `${d}-${h}`;
                  const session = sessions[key];
                  const isBlocked = blocked.includes(key);
                  return (
                    <div key={key} className={`p-1.5 rounded-lg text-xs min-h-[48px] transition-colors ${
                      session ? 'bg-secondary/10 border border-secondary/30 cursor-pointer hover:bg-secondary/20' :
                      isBlocked ? 'bg-muted/50' :
                      'bg-card border border-border hover:bg-accent cursor-pointer'
                    }`}>
                      {session && (
                        <div>
                          <p className="font-medium text-secondary">{session.name}</p>
                          <p className="text-muted-foreground text-[10px]">{session.type}</p>
                        </div>
                      )}
                      {isBlocked && (
                        <div className="flex items-center justify-center h-full">
                          <Lock className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-secondary/10 border border-secondary/30" /> Prenotata</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-card border border-border" /> Disponibile</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-muted/50" /> Bloccata</div>
      </div>
    </div>
  );
}