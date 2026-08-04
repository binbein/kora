import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye, EyeOff, Server, CheckCircle2, FileText } from 'lucide-react';

const principles = [
  { icon: EyeOff, title: 'Nessun dato individuale', desc: 'L\'HR non vede mai sessioni, referti, diagnosi o dati sanitari di singoli dipendenti.' },
  { icon: Eye, title: 'Solo dati aggregati', desc: 'La dashboard mostra esclusivamente statistiche anonime e aggregate per reparto o azienda.' },
  { icon: Lock, title: 'Crittografia end-to-end', desc: 'Tutti i dati sanitari sono crittografati in transito e a riposo con standard AES-256.' },
  { icon: Server, title: 'Hosting in Svizzera', desc: 'I dati risiedono su server in Svizzera, conformi alla Legge Federale sulla Protezione dei Dati (LPD).' },
  { icon: FileText, title: 'Conformità GDPR e LPD', desc: 'HealthOS è pienamente conforme al GDPR europeo e alla LPD svizzera.' },
  { icon: Shield, title: 'Consenso del dipendente', desc: 'Ogni dipendente conferma il proprio consenso durante l\'onboarding. Può revocare in ogni momento.' },
];

export default function HRPrivacy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Privacy e Sicurezza</h1>
        <p className="text-sm text-muted-foreground mt-1">La privacy è il cuore di HealthOS.</p>
      </div>

      <Card className="p-6 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-xl">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">La tua azienda non vede mai:</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Dati sanitari individuali</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Nomi di chi usa lo psicologo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Note cliniche o referti</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Diagnosi o trattamenti</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Prenotazioni individuali</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {principles.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}