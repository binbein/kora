import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Globe, Star, Award, CheckCircle2, Briefcase } from 'lucide-react';

const profile = {
  name: 'Dr.ssa Laura Bianchi',
  title: 'Psicologa FSP',
  certification: 'FSP-2019-4521',
  languages: ['Italiano', 'Deutsch'],
  specializations: ['Stress', 'Ansia', 'Burnout', 'Gestione del lavoro'],
  rate: 75,
  rating: 4.9,
  totalSessions: 340,
  bio: 'Psicologa clinica con 8 anni di esperienza nella gestione dello stress lavorativo e burnout. Approccio cognitivo-comportamentale. Specializzata in ambienti corporate.',
  documentsVerified: true,
  mandateSigned: true,
  availability: 'Martedì e Giovedì, 09:00 – 18:00',
};

export default function ProProfilo() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Profilo professionale</h1>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-executive/10 flex items-center justify-center text-2xl font-bold text-executive flex-shrink-0">
            LB
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-secondary/10 text-secondary"><Award className="w-3 h-3 mr-1" /> {profile.certification}</Badge>
              <Badge className="bg-executive/10 text-executive"><Star className="w-3 h-3 mr-1" /> {profile.rating}/5</Badge>
              <Badge variant="outline">{profile.totalSessions} sessioni</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Lingue</h3>
          <div className="flex gap-2">
            {profile.languages.map(l => <Badge key={l} variant="outline">{l}</Badge>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-secondary" /> Specializzazioni</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Bio</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-executive" /> Collaborazione</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Tariffa sessione</span>
            <span className="font-semibold">CHF {profile.rate}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Disponibilità</span>
            <span className="font-medium">{profile.availability}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Documenti verificati</span>
            <Badge className="bg-secondary/10 text-secondary"><CheckCircle2 className="w-3 h-3 mr-1" /> Verificati</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Contratto a mandato</span>
            <Badge className="bg-secondary/10 text-secondary"><CheckCircle2 className="w-3 h-3 mr-1" /> Firmato</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Collaborazione a mandato (Auftrag). Nessun vincolo di assunzione. HealthOS porta i pazienti, gestisce prenotazioni, video e pagamenti.
        </p>
      </Card>
    </div>
  );
}