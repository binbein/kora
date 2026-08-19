import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Briefcase, CheckCircle2, Clock, Globe, Star } from 'lucide-react';
import { formatCHF, formatNumber, formatRating } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { professionalDisplayName } from '@/lib/data/types';
import type { Professional } from '@/lib/data/types';
import { loadState, usePortalProfessional } from '@/lib/data/queries';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';

function initialsOf(professional: Professional) {
  return [professional.firstName, professional.lastName]
    .filter((part): part is string => Boolean(part))
    .map((part) => part[0])
    .join('');
}

export default function ProProfilo() {
  const professionalQuery = usePortalProfessional();

  /* I tre casi (M5.b). `getProfessional` è nullable per contratto, quindi il
     profilo assente è un vuoto e non un guasto. */
  const page = loadState([professionalQuery]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const professional = professionalQuery.data;
  if (professional === undefined) return null;
  if (professional === null) {
    return (
      <Card>
        <EmptyNotice text={t.professional.profile.empty} />
      </Card>
    );
  }

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
                  <Star className="w-3 h-3 mr-1" aria-hidden="true" />
                  <span className="tabular-nums">
                    {formatRating(professional.rating)}
                  </span>
                </Badge>
              ) : null}
              <Badge variant="outline">
                <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                <span className="tabular-nums">
                  {interpolate(t.professional.profile.totalSessions, {
                    n: formatNumber(professional.totalSessions),
                  })}
                </span>
              </Badge>
            </div>
            {/* La bio è una frase del dizionario e non un campo di testo del
                dataset: il tipo porta la chiave, come per la qualifica. */}
            <p className="text-sm text-muted-foreground mt-4">
              {t.professionalBio[professional.bioKey]}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" aria-hidden="true" /> {t.professional.profile.languages}
          </h3>
          <div className="flex flex-wrap gap-2">
            {professional.languages.map((code) => (
              <Badge key={code} variant="outline">{t.language[code]}</Badge>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-secondary" aria-hidden="true" /> {t.professional.profile.specialty}
          </h3>
          {/* coppia `accent` e non teal pieno: il bianco su `secondary` è
              2.83:1, sotto l'AA (§6.1). La variante `secondary` di `badge.tsx`
              è la sorgente, ma quel file è congelato: si sceglie qui */}
          <Badge variant="outline" className="border-transparent bg-accent text-accent-foreground">
            {t.specialty[professional.specialty]}
          </Badge>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-executive" aria-hidden="true" /> {t.professional.profile.collaboration}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t.professional.profile.fee}</span>
            <span className="font-semibold tabular-nums">{formatCHF(professional.sessionFee)}</span>
          </div>
          {/*
           * I DUE BADGE RENDONO ANCHE IL `false`. Prima uscivano solo a `true`, e
           * il ramo mancante non è teorico: la Dr.ssa Keller ha i documenti
           * verificati e il mandato **non** firmato (§8), quindi la riga
           * mostrava l'etichetta a sinistra e il nulla a destra — che si legge
           * come un dato mancante invece che come lo stato che è.
           *
           * IL NON-ANCORA È UN'ATTESA, e dal 19.08.2026 ha un token suo
           * (§6.1). Non è `destructive` — quel token è riservato ad alert e
           * stati critici, e un mandato da firmare è un passo del vetting, non
           * un guasto — e non è più nemmeno neutro: il grigio dice "spento",
           * non "in corso", ed era la terza resa che questo prodotto dava alla
           * stessa cosa. Le altre due erano il giallo del back-office e la
           * fattura HR, che si leggeva come pagata.
           */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t.professional.profile.documents}</span>
            {professional.documentsVerified ? (
              <Badge className="bg-secondary/10 text-secondary-strong">
                <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.profile.verified}
              </Badge>
            ) : (
              <Badge className="bg-waiting text-waiting-foreground">
                <Clock className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.profile.documentsPending}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">{t.professional.profile.mandate}</span>
            {professional.mandateSigned ? (
              <Badge className="bg-secondary/10 text-secondary-strong">
                <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.profile.signed}
              </Badge>
            ) : (
              <Badge className="bg-waiting text-waiting-foreground">
                <Clock className="w-3 h-3 mr-1" aria-hidden="true" /> {t.professional.profile.mandatePending}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">{t.professional.profile.mandateNote}</p>
      </Card>
    </div>
  );
}
