import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User, Building2, Mail, Heart, Brain, Activity, Moon, Zap } from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';

const profile = {
  name: 'Giulia Rossi',
  email: 'giulia.rossi@alpinefinance.ch',
  company: 'Alpine Finance SA',
  plan: 'HealthOS Plus',
  since: 'Gennaio 2026',
  healthScore: 74,
  stress: 'Medio',
  sleep: 'Da migliorare',
  energy: 'Buona',
  psyUsed: 3, psyLimit: 10,
  coachUsed: 1, coachLimit: 4,
  checkup: 'Disponibile',
  doctorConsults: '2 di ∞',
};

export default function Profilo() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Il tuo profilo</h1>

      <PrivacyBanner message="La tua salute resta tua. Nessun dato individuale viene condiviso con la tua azienda." />

      {/* Personal Info */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-xl font-bold text-secondary">
            GR
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Azienda</p>
            <p className="text-sm font-medium flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {profile.company}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Piano</p>
            <p className="text-sm font-medium">{profile.plan}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Membro dal</p>
            <p className="text-sm font-medium">{profile.since}</p>
          </div>
        </div>
      </Card>

      {/* Health Summary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-secondary" /> Riepilogo salute
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Heart, label: 'Health Score', value: `${profile.healthScore}/100` },
            { icon: Activity, label: 'Stress', value: profile.stress },
            { icon: Moon, label: 'Sonno', value: profile.sleep },
            { icon: Zap, label: 'Energia', value: profile.energy },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
              <Icon className="w-4 h-4 text-secondary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-secondary" /> Utilizzo servizi
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Sessioni psicologo', value: `${profile.psyUsed}/${profile.psyLimit}` },
            { label: 'Sessioni coach', value: `${profile.coachUsed}/${profile.coachLimit}` },
            { label: 'Check-up annuale', value: profile.checkup },
            { label: 'Medico virtuale', value: profile.doctorConsults },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Badge variant="outline">{value}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 text-secondary" />
        <span>I tuoi dati sanitari sono protetti e non vengono mai condivisi con terzi.</span>
      </div>
    </div>
  );
}