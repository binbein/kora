import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Eye, EyeOff, FileText, Link2, Lock, Server, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { useCompany } from '@/lib/data/queries';

/*
 * Privacy e sicurezza (CLAUDE.md §10.C).
 *
 * Due cose nuove rispetto alla schermata ereditata, e nessuna delle due è
 * decorazione: **da dove vengono i numeri di stress** e **il link anonimo del
 * check rapido** (§8). Sono la risposta alla domanda che un investitore fa
 * subito dopo aver visto il grafico per reparto, e finora non la dava nessuna
 * schermata.
 */

const PRINCIPLES: { key: keyof typeof t.hr.privacy.principle; icon: LucideIcon }[] = [
  { key: 'noIndividual', icon: EyeOff },
  { key: 'aggregated', icon: Eye },
  { key: 'encryption', icon: Lock },
  { key: 'hosting', icon: Server },
  { key: 'compliance', icon: FileText },
  { key: 'consent', icon: Shield },
];

const NEVER_SEEN: (keyof typeof t.hr.privacy.neverSeen)[] = [
  'healthData',
  'names',
  'notes',
  'diagnoses',
  'bookings',
];

export default function HRPrivacy() {
  const { data: company } = useCompany();
  if (!company) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.hr.privacy.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.hr.privacy.subtitle}</p>
      </div>

      <Card className="p-6 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-xl flex-shrink-0">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">{t.hr.privacy.neverSeenTitle}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {NEVER_SEEN.map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  {t.hr.privacy.neverSeen[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.hr.privacy.measurementTitle}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t.hr.privacy.measurementBody}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.hr.privacy.anonymousLinkTitle}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t.hr.privacy.anonymousLinkBody}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
            <Lock className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.hr.privacy.thresholdTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {interpolate(t.hr.privacy.thresholdBody, {
                threshold: formatNumber(company.anonymityThreshold),
              })}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {PRINCIPLES.map(({ key, icon: Icon }) => (
          <Card key={key} className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {t.hr.privacy.principle[key].title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {t.hr.privacy.principle[key].body}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
