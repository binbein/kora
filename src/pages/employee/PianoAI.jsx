import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Moon, Activity, Footprints, Apple, ClipboardCheck, Brain, Target, Sparkles } from 'lucide-react';

const plans = [
  { icon: Activity, title: 'Stress', color: 'text-warning', bg: 'bg-warning/10',
    goal: 'Ridurre stress percepito del 15% in 8 settimane',
    progress: 35,
    tips: ['Pratica 10 minuti di respirazione al giorno', 'Programma pause regolari ogni 90 minuti', 'Prenota sessione coach per tecniche di gestione'] },
  { icon: Moon, title: 'Sonno', color: 'text-executive', bg: 'bg-executive/10',
    goal: 'Migliorare sonno da 6h a 7h per notte',
    progress: 40,
    tips: ['Evita schermi 30 minuti prima di dormire', 'Mantieni orari regolari', 'Riduci caffeina dopo le 14:00'] },
  { icon: Footprints, title: 'Movimento', color: 'text-secondary', bg: 'bg-secondary/10',
    goal: 'Raggiungere 2 sessioni di attività fisica a settimana',
    progress: 50,
    tips: ['Inizia con camminate di 30 minuti', 'Usa le scale al posto dell\'ascensore', 'Prova una lezione di yoga online'] },
  { icon: Apple, title: 'Alimentazione', color: 'text-destructive', bg: 'bg-destructive/10',
    goal: 'Ridurre colesterolo con alimentazione equilibrata',
    progress: 25,
    tips: ['Aumenta consumo di fibre e vegetali', 'Riduci grassi saturi', 'Consulta la nutrizionista inclusa nel piano'] },
  { icon: ClipboardCheck, title: 'Check-up', color: 'text-primary', bg: 'bg-primary/10',
    goal: 'Prenotare check-up entro 30 giorni',
    progress: 0,
    tips: ['Il tuo check-up annuale è disponibile', 'Prenota presso un centro convenzionato', 'Ripeti controllo colesterolo tra 6 mesi'] },
  { icon: Brain, title: 'Salute mentale', color: 'text-secondary', bg: 'bg-secondary/10',
    goal: 'Fare 2 sessioni coach nel prossimo mese',
    progress: 50,
    tips: ['Hai completato 1/2 sessioni coach', 'Prosegui il percorso con la psicologa', 'Usa le tecniche apprese in sessione'] },
];

export default function PianoAI() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Piano Prevenzione AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalizzato per te, aggiornato ogni 6 mesi.</p>
        </div>
        <Badge className="bg-accent text-accent-foreground">
          <Sparkles className="w-3 h-3 mr-1" /> Aggiornato: Aprile 2026
        </Badge>
      </div>

      {/* Goals Summary */}
      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Target className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Obiettivi principali</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>• Ridurre stress percepito del 15% in 8 settimane</li>
              <li>• Migliorare sonno da 6h a 7h per notte</li>
              <li>• Prenotare check-up entro 30 giorni</li>
              <li>• Fare 2 sessioni coach nel prossimo mese</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Plan Sections */}
      <div className="space-y-4">
        {plans.map(({ icon: Icon, title, color, bg, goal, progress, tips }) => (
          <Card key={title} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${bg} rounded-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{goal}</p>
              </div>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <ul className="space-y-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}