import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Heart, Brain, Stethoscope, ClipboardCheck, Sparkles, Moon,
  Zap, Activity, ArrowRight, Shield, Calendar
} from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';

const demo = {
  name: 'Giulia',
  healthScore: 74,
  stress: 'medio',
  sleep: 'da migliorare',
  energy: 'buona',
  psyUsed: 3, psyLimit: 10,
  coachUsed: 1, coachLimit: 4,
};

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display">{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

function MetricBadge({ icon: Icon, label, value, color }) {
  const colorMap = {
    green: 'bg-secondary/10 text-secondary',
    yellow: 'bg-warning/20 text-foreground',
    blue: 'bg-primary/10 text-primary',
  };
  return (
    <div className={`flex items-center gap-2.5 ${colorMap[color]} rounded-xl px-4 py-3`}>
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-[10px] uppercase tracking-wider opacity-70">{label}</p>
        <p className="text-sm font-semibold capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function EmployeeHome() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold font-display">Ciao, {demo.name} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">La tua salute, in un unico posto.</p>
      </div>

      <PrivacyBanner message="La tua azienda vede solo dati aggregati e anonimi. La tua salute resta tua." />

      {/* Health Score + Metrics */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={demo.healthScore} />
          <div className="flex-1 w-full">
            <h3 className="font-semibold mb-3">Il tuo stato di salute</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <MetricBadge icon={Activity} label="Stress" value={demo.stress} color="yellow" />
              <MetricBadge icon={Moon} label="Sonno" value={demo.sleep} color="yellow" />
              <MetricBadge icon={Zap} label="Energia" value={demo.energy} color="green" />
            </div>
          </div>
        </div>
      </Card>

      {/* Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Brain className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Psicologo</p>
              <p className="text-xs text-muted-foreground">{demo.psyUsed}/{demo.psyLimit} sessioni usate</p>
            </div>
          </div>
          <Progress value={(demo.psyUsed / demo.psyLimit) * 100} className="h-2 mb-3" />
          <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90" asChild>
            <Link to="/employee/psicologi">Prenota sessione <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
          </Button>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-executive/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-executive" />
            </div>
            <div>
              <p className="text-sm font-semibold">Coach</p>
              <p className="text-xs text-muted-foreground">{demo.coachUsed}/{demo.coachLimit} sessioni usate</p>
            </div>
          </div>
          <Progress value={(demo.coachUsed / demo.coachLimit) * 100} className="h-2 mb-3" />
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link to="/employee/psicologi">Prenota sessione <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Stethoscope, label: 'Medico virtuale', path: '/employee/medico', color: 'bg-primary/10 text-primary' },
          { icon: ClipboardCheck, label: 'Check-up annuale', path: '/employee/checkup', color: 'bg-secondary/10 text-secondary', badge: 'Disponibile' },
          { icon: Sparkles, label: 'Piano AI', path: '/employee/piano-ai', color: 'bg-executive/10 text-executive' },
          { icon: Heart, label: 'Profilo salute', path: '/employee/profilo', color: 'bg-accent text-accent-foreground' },
        ].map(({ icon: Icon, label, path, color, badge }) => (
          <Link key={path} to={path}>
            <Card className="p-4 hover:shadow-md transition-shadow text-center relative">
              {badge && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-white text-[10px]">{badge}</Badge>
              )}
              <div className={`p-2.5 ${color} rounded-xl w-fit mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* AI Recommendation */}
      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Raccomandazione AI</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In base al tuo profilo, ti consigliamo di prenotare un check-up entro 30 giorni e una sessione con un coach per la gestione dello stress.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" asChild>
                <Link to="/employee/checkup">Prenota check-up</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/employee/piano-ai">Vedi piano completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}