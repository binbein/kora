import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { formatCHF, formatDate, formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { loadState, usePortalProfessionalId, useProfessionalPatients } from '@/lib/data/queries';
import { ErrorNotice } from '@/components/kora/StateNotice';
import {
  patientDisplayName,
  patientInitials,
  type SessionEntitlement,
} from '@/lib/data/types';

/*
 * Il diritto alle sedute, detto come lo legge il professionista.
 *
 * Il cap annuale con co-payment è il meccanismo su cui il Business Plan regge
 * il margine (§9): un paziente che lo supera senza che la riga lo dica
 * contraddice il documento che l'investitore ha in mano.
 */
function EntitlementLine({ entitlement }: { entitlement: SessionEntitlement }) {
  const extra = entitlement.used - entitlement.total;

  /*
   * Il co-payment si mostra solo dove il piano ne dichiara il prezzo. Sul
   * coaching il §9 non ne dà nessuno, e una riga "2 a CHF 0" prometterebbe
   * gratis ciò che il Business Plan non promette: lì si dice che le sedute
   * incluse sono finite, e basta.
   */
  if (extra > 0 && entitlement.extraSessionPrice !== undefined) {
    return (
      <p className="text-[11px] text-muted-foreground tabular-nums">
        {interpolate(t.professional.patients.overCap, {
          total: formatNumber(entitlement.total),
          extra: formatNumber(extra),
          price: formatCHF(entitlement.extraSessionPrice),
        })}
      </p>
    );
  }

  if (entitlement.used >= entitlement.total) {
    return (
      <p className="text-[11px] text-muted-foreground">
        {t.professional.patients.capReached}
      </p>
    );
  }

  return (
    <p className="text-[11px] text-muted-foreground tabular-nums">
      {interpolate(t.professional.patients.withinCap, {
        used: formatNumber(entitlement.used),
        total: formatNumber(entitlement.total),
      })}
    </p>
  );
}

export default function ProPazienti() {
  const portalIdQuery = usePortalProfessionalId();
  const patientsQuery = useProfessionalPatients(portalIdQuery.data);

  /* I tre casi (M5.b), registro strumento. */
  const page = loadState([portalIdQuery, patientsQuery]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const patients = patientsQuery.data;
  if (patients === undefined) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.professional.patients.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 tabular-nums">
          {interpolate(t.professional.patients.count, { n: formatNumber(patients.length) })}
        </p>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/60 border border-secondary/20 rounded-lg p-3">
        <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" aria-hidden="true" />
        <span>{t.professional.patients.privacy}</span>
      </div>

      <div className="space-y-3">
        {patients.map((patient) => (
          <Card key={patient.patientId} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-executive/10 flex items-center justify-center text-sm font-bold text-executive flex-shrink-0">
                  {patientInitials(patient)}
                </div>
                <div className="min-w-0">
                  {/* Il nome, e non "Paziente L.B.": chi cura il nome lo
                      conosce, e l'abbreviazione qui non protegge nessuno
                      (17.08.2026). L'avatar tiene le iniziali perché è un
                      avatar. */}
                  <p className="text-sm font-semibold truncate">
                    {patientDisplayName(patient)}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {interpolate(t.professional.patients.delivered, {
                      n: formatNumber(patient.entitlement.used),
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {patient.entitlement.used === 0 && (
                  <Badge variant="outline" className="border-warning text-foreground mb-1">
                    {t.professional.patients.new}
                  </Badge>
                )}
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {patient.nextSessionAt
                    ? interpolate(t.professional.patients.next, {
                        date: formatDate(patient.nextSessionAt),
                      })
                    : t.professional.patients.noNext}
                </p>
                <EntitlementLine entitlement={patient.entitlement} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
