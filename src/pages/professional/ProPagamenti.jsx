import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, FileText, CheckCircle2, Clock } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const payments = [
  { month: 'Aprile 2026', sessions: 24, rate: 75, total: 1800, status: 'pending', date: '—' },
  { month: 'Marzo 2026', sessions: 22, rate: 75, total: 1650, status: 'paid', date: '5 Apr 2026' },
  { month: 'Febbraio 2026', sessions: 20, rate: 75, total: 1500, status: 'paid', date: '5 Mar 2026' },
  { month: 'Gennaio 2026', sessions: 18, rate: 75, total: 1350, status: 'paid', date: '5 Feb 2026' },
];

export default function ProPagamenti() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Pagamenti</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Sessioni mese" value="24" icon={CheckCircle2} />
        <KPICard title="Tariffa media" value="CHF 75" icon={CreditCard} />
        <KPICard title="Totale mese" value="CHF 1.800" icon={CreditCard} variant="secondary" />
        <KPICard title="Totale anno" value="CHF 6.300" icon={FileText} />
      </div>

      <Card className="p-5 bg-accent/40 border-secondary/20">
        <p className="text-sm">
          <strong>Modello di collaborazione:</strong> Pagamento per sessione completata. Kora genera automaticamente la fattura e il pagamento viene effettuato entro il 5 del mese successivo.
        </p>
      </Card>

      <Card>
        <div className="divide-y divide-border">
          {payments.map((p) => (
            <div key={p.month} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{p.month}</p>
                <p className="text-xs text-muted-foreground">{p.sessions} sessioni × CHF {p.rate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">CHF {p.total.toLocaleString()}</span>
                <Badge className={p.status === 'paid' ? 'bg-secondary/10 text-secondary' : 'bg-warning/20 text-foreground'}>
                  {p.status === 'paid' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Pagato</>
                  ) : (
                    <><Clock className="w-3 h-3 mr-1" /> In attesa</>
                  )}
                </Badge>
                {p.status === 'paid' && (
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}