import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calculator, FileText } from 'lucide-react';

export default function HRFatturazione() {
  const [employees, setEmployees] = useState(150);
  const [plan, setPlan] = useState('Plus');
  const [billing, setBilling] = useState('annual');

  const prices = { Essenziale: 38, Plus: 55, Executive: 82 };
  const price = prices[plan];
  const monthly = employees * price;
  const annual = monthly * 12;
  const total = billing === 'annual' ? annual : monthly;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Fatturazione</h1>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Piano attivo
          </h3>
          <Badge className="bg-secondary/10 text-secondary">Plus</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Dipendenti</p>
            <p className="text-lg font-bold">150</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Costo mensile</p>
            <p className="text-lg font-bold">CHF 8.250</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contratto annuale</p>
            <p className="text-lg font-bold">CHF 99.000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Scadenza</p>
            <p className="text-lg font-bold">Dic 2026</p>
          </div>
        </div>
      </Card>

      {/* Invoices */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Fatture recenti
        </h3>
        <div className="space-y-3">
          {['Aprile 2026', 'Marzo 2026', 'Febbraio 2026', 'Gennaio 2026'].map((month) => (
            <div key={month} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{month}</p>
                <p className="text-xs text-muted-foreground">150 dipendenti × CHF 55</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">CHF 8.250</span>
                <Badge className="bg-secondary/10 text-secondary text-xs">Pagata</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Calculator */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-secondary" /> Simulatore costi
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-xs">Dipendenti</Label>
            <Input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value) || 0)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Piano</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Essenziale">Essenziale (CHF 38)</SelectItem>
                <SelectItem value="Plus">Plus (CHF 55)</SelectItem>
                <SelectItem value="Executive">Executive (CHF 82)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Frequenza</Label>
            <Select value={billing} onValueChange={setBilling}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensile</SelectItem>
                <SelectItem value="annual">Annuale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-accent rounded-xl p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Totale {billing === 'annual' ? 'annuale' : 'mensile'}</span>
            <span className="text-2xl font-bold font-display">CHF {total.toLocaleString()}</span>
          </div>
          <p className="text-sm text-secondary font-medium mt-2">
            💡 Risparmio potenziale stimato: CHF {Math.round(employees * 1400).toLocaleString()} – {Math.round(employees * 2900).toLocaleString()} / anno
          </p>
        </div>
      </Card>
    </div>
  );
}