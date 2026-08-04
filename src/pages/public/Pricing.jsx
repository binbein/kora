import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, ArrowRight, Calculator } from 'lucide-react';
import PublicNav from '@/components/public/PublicNav';
import Footer from '@/components/public/Footer';

const plans = [
  {
    name: 'Essenziale', price: 38, target: 'Aziende 20–100 dipendenti',
    features: [
      '6 sessioni psicologo online / anno per dipendente',
      'Colloquio conoscitivo iniziale gratuito',
      'Medico virtuale 3 consulti / anno',
      'Assessment salute iniziale',
      'Dashboard HR anonima base',
      'Co-payment oltre soglia: CHF 35 / sessione',
    ],
  },
  {
    name: 'Plus', price: 55, target: 'Aziende 100–300 dipendenti', recommended: true,
    features: [
      '10 sessioni psicologo online / anno per dipendente',
      'Colloquio conoscitivo gratuito',
      '4 sessioni coach benessere e performance / anno',
      'Medico virtuale illimitato',
      'Check-up fisico annuale',
      'Piano prevenzione AI aggiornato ogni 6 mesi',
      'Dashboard HR per reparto con report trimestrale',
      'Co-payment oltre soglia: CHF 28 / sessione',
      'Estensione partner: + CHF 15/dipendente/mese (opzionale)',
    ],
  },
  {
    name: 'Executive', price: 82, target: 'Aziende 300+ dipendenti',
    features: [
      '16 sessioni psicologo online / anno per dipendente',
      'Psicologo dedicato',
      'Coach + psichiatra se necessario',
      'Medico virtuale illimitato entro 1h',
      'Check-up fisico executive completo annuale',
      '4 sessioni nutrizionista / anno',
      'Piano prevenzione AI aggiornato ogni mese',
      'Dashboard HR avanzata',
      'Consulenza HR trimestrale',
      'Familiari inclusi: partner + 1 figlio',
      '2 workshop live per team / anno',
      'Co-payment oltre soglia: CHF 22 / sessione',
    ],
  },
];

export default function Pricing() {
  const [employees, setEmployees] = useState(150);
  const [selectedPlan, setSelectedPlan] = useState('Plus');
  const [billing, setBilling] = useState('annual');

  const plan = plans.find(p => p.name === selectedPlan);
  const monthlyTotal = plan ? employees * plan.price : 0;
  const annualTotal = monthlyTotal * 12;
  const displayTotal = billing === 'annual' ? annualTotal : monthlyTotal;

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Piani trasparenti, valore concreto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un abbonamento per dipendente. Nessun costo nascosto. ROI misurabile dal primo trimestre.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tre colonne, non quattro: il quarto piano "Personalizzato" resta
              nascosto in attesa della decisione dei founder (CLAUDE.md §10.A.3).
              FlexiblePlanCard.jsx resta nel repository per riattivarlo. */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((p) => (
              <Card key={p.name} className={`p-6 relative ${p.recommended ? 'ring-2 ring-secondary shadow-xl' : 'hover:shadow-lg'} transition-all`}>
                {p.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Piano consigliato
                  </div>
                )}
                <h3 className="text-xl font-bold font-display">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{p.target}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold font-display">CHF {p.price}</span>
                  <span className="text-sm text-muted-foreground"> / dipendente / mese</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${p.recommended ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`} asChild>
                  <Link to="/demo">Richiedi preventivo</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 bg-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-secondary/10 rounded-xl">
                <Calculator className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold font-display">Calcola il costo</h2>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Numero dipendenti</Label>
                <Input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value) || 0)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium">Piano</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essenziale">Essenziale — CHF 38/mese</SelectItem>
                    <SelectItem value="Plus">Plus — CHF 55/mese</SelectItem>
                    <SelectItem value="Executive">Executive — CHF 82/mese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Fatturazione</Label>
                <Select value={billing} onValueChange={setBilling}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensile</SelectItem>
                    <SelectItem value="annual">Annuale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Totale {billing === 'annual' ? 'annuale' : 'mensile'}</span>
                <span className="text-3xl font-bold font-display">CHF {displayTotal.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {employees} dipendenti × CHF {plan?.price} × {billing === 'annual' ? '12 mesi' : '1 mese'}
              </p>
              {/* La stima "CHF 1'400–2'900 per dipendente" non era nel Business
                  Plan (CLAUDE.md §9). Il risparmio torna qui in M4, calcolato da
                  roi-model.ts e etichettato come scenario conservativo. */}
            </div>

            <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90" asChild>
              <Link to="/demo">Prenota una demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}