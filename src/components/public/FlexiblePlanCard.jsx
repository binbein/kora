import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Brain, HeartPulse, Plus, Users, Check, Minus } from 'lucide-react';

const GROUPS = [
  {
    id: 'mental',
    title: 'Salute mentale',
    icon: Brain,
    items: [
      { id: 'psy6', label: 'Psicologo (6 sessioni/anno)', price: 18 },
      { id: 'psy12', label: 'Psicologo (12 sessioni/anno)', price: 32 },
      { id: 'coach', label: 'Coach benessere (4 sessioni/anno)', price: 12 },
      { id: 'psyq', label: 'Psichiatra (su richiesta)', price: 14 },
    ],
  },
  {
    id: 'physical',
    title: 'Salute fisica',
    icon: HeartPulse,
    items: [
      { id: 'medico', label: 'Medico virtuale illimitato', price: 8 },
      { id: 'checkup', label: 'Check-up fisico annuale', price: 10 },
      { id: 'nutri', label: 'Nutrizionista (4 sessioni/anno)', price: 10 },
    ],
  },
  {
    id: 'extra',
    title: 'Extra & strumenti',
    icon: Plus,
    items: [
      { id: 'ai', label: 'Piano prevenzione AI', price: 6 },
      { id: 'family', label: 'Familiari inclusi', price: 12 },
      { id: 'workshop', label: 'Workshop live per team', price: 8 },
      { id: 'hrdash', label: 'Dashboard HR avanzata', price: 5 },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap(g => g.items);

export default function FlexiblePlanCard() {
  const [selected, setSelected] = useState({
    psy6: true, medico: true, checkup: true, ai: true
  });
  const [employees, setEmployees] = useState(100);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const base = ALL_ITEMS.reduce((sum, a) => sum + (selected[a.id] ? a.price : 0), 0);

  let discount = 0;
  let nextTier = null;
  if (employees >= 300) discount = 0.15;
  else if (employees >= 150) { discount = 0.10; nextTier = 300; }
  else if (employees >= 50) { discount = 0.05; nextTier = 150; }
  else { nextTier = 50; }

  const perEmployee = Math.round(base * (1 - discount));
  const monthlyTotal = perEmployee * employees;

  return (
    <Card className="p-6 relative ring-2 ring-executive shadow-xl flex flex-col">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-executive text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
        <Sparkles className="w-3 h-3" /> Su misura
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold font-display">Personalizzato</h3>
        <p className="text-sm text-muted-foreground mt-1">Scegli i moduli, noi calcoliamo il prezzo.</p>
      </div>

      {/* Add-on groups */}
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1 -mr-1">
        {GROUPS.map((g) => {
          const GIcon = g.icon;
          const groupSelected = g.items.filter(a => selected[a.id]).length;
          return (
            <div key={g.id}>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <GIcon className="w-3.5 h-3.5 text-executive" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</span>
                {groupSelected > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-executive text-white px-1.5 py-0.5 rounded-full">
                    {groupSelected}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {g.items.map((a) => {
                  const active = !!selected[a.id];
                  return (
                    <label
                      key={a.id}
                      className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${active ? 'bg-accent border-secondary/30' : 'border-transparent hover:bg-muted/50'}`}
                    >
                      <Checkbox checked={active} onCheckedChange={() => toggle(a.id)} />
                      <span className={`text-sm flex-1 leading-tight ${active ? 'font-medium' : ''}`}>{a.label}</span>
                      <span className={`text-xs font-semibold whitespace-nowrap ${active ? 'text-secondary' : 'text-muted-foreground'}`}>+CHF {a.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee stepper */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Numero dipendenti
          </Label>
          {nextTier && (
            <span className="text-[10px] text-muted-foreground">
              +{nextTier - employees} per sconto volume
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={() => setEmployees(e => Math.max(1, e - 10))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <input
            type="range"
            min={1}
            max={500}
            value={Math.min(employees, 500)}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="flex-1 accent-secondary h-1.5"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={() => setEmployees(e => e + 10)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <div className="flex-shrink-0 w-20 text-right">
            <span className="text-lg font-bold font-display">{employees}</span>
          </div>
        </div>
        {/* Discount tier indicator */}
        <div className="flex gap-1 mt-2">
          {[[50, '5%'], [150, '10%'], [300, '15%']].map(([tier, label]) => (
            <div
              key={tier}
              className={`flex-1 text-center text-[10px] font-medium py-1 rounded-md transition-colors ${employees >= tier ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {tier}+ · {label}
            </div>
          ))}
        </div>
      </div>

      {/* Price summary */}
      <div className="p-4 bg-accent rounded-xl space-y-2.5 mb-4 mt-auto">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Costo / dipendente / mese</span>
          <span className="text-2xl font-bold font-display text-secondary">CHF {perEmployee}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <Check className="w-3 h-3" /> Sconto volume {Math.round(discount * 100)}% applicato
          </div>
        )}
        <div className="flex justify-between text-sm pt-2 border-t border-border">
          <span className="text-muted-foreground">Totale mensile ({selectedCount} moduli)</span>
          <span className="font-semibold">CHF {monthlyTotal.toLocaleString()}</span>
        </div>
      </div>

      <Button className="w-full bg-executive hover:bg-executive/90 text-executive-foreground" asChild>
        <Link to="/demo">Richiedi preventivo</Link>
      </Button>
    </Card>
  );
}