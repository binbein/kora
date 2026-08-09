import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Briefcase, CheckCircle2, Globe, Star } from 'lucide-react';
import { formatCHF, formatRating } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { professionalDisplayName } from '@/lib/data/types';
import type { Professional } from '@/lib/data/types';
import { usePortalProfessional } from '@/lib/data/queries';

function initialsOf(professional: Professional) {
  return [professional.firstName, professional.lastName]
    .filter((part): part is string => Boolean(part))
    .map((part) => part[0])
    .join('');
}

export default function ProProfilo() {
  const { data: professional } = usePortalProfessional();
  if (!professional) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">{t.professional.profile.title}</h1>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-executive/10 flex items-center justify-center text-2xl font-bold text-executive flex-shrink-0">
            {initialsOf(professional)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{professionalDisplayName(professional)}</h2>
            <p className="text-sm text-muted-foreground">
              {t.qualification[professional.qualificationKey]}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {professional.rating !== null ? (
                <Badge className="bg-executive/10 text-executive">
                  <Star className="w-3 h-3 mr-1" />
                  <span className="tabular-nums">
                    {formatRating(professional.rating)}
                  </span>
                </Badge>
              ) : null}
              <Badge variant="outline">
                <Award className="w-3 h-3 mr-1" />
                <span className="tabular-nums">
                  {interpolate(t.professional.profile.totalSessions, {
                    n: String(professional.totalSessions),
                  })}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> {t.professional.profile.languages}
          </h3>
          <div className="flex flex-wrap gap-2">
            {professional.languages.map((code) => (
              <Badge key={code} variant="outline">{t.language[code]}</Badge>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-secondary" /> {t.professional.profile.specialty}
          </h3>
          <Badge variant="secondary">{t.specialty[professional.specialty]}</Badge>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-executive" /> {t.professional.profile.collaboration}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t.professional.profile.fee}</span>
            <span className="font-semibold tabular-nums">{formatCHF(professional.sessionFee)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t.professional.profile.documents}</span>
            {professional.documentsVerified && (
              <Badge className="bg-secondary/10 text-secondary">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {t.professional.profile.verified}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">{t.professional.profile.mandate}</span>
            {professional.mandateSigned && (
              <Badge className="bg-secondary/10 text-secondary">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {t.professional.profile.signed}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">{t.professional.profile.mandateNote}</p>
      </Card>
    </div>
  );
}
