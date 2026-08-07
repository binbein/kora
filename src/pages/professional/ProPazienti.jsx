import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { formatCHF, formatDate } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { usePortalProfessionalId, useProfessionalPatients } from '@/lib/data/queries';

/*
 * Il diritto alle sedute, detto come lo legge il professionista.
 *
 * Il cap annuale con co-payment è il meccanismo su cui il Business Plan regge
 * il margine (§9): un paziente che lo supera senza che la riga lo dica
 * contraddice il documento che l'investitore ha in mano.
 */
function EntitlementLine({ entitlement }) {
  const extra = entitlement.used - entitlement.total;

  if (extra > 0) {
    return (
      <p className="text-[11px] text-muted-foreground tabular-nums">
        {interpolate(t.professional.patients.overCap, {
          total: String(entitlement.total),
          extra: String(extra),
          price: formatCHF(entitlement.extraSessionPrice),
        })}
      </p>
    );
  }

  if (entitlement.used === entitlement.total) {
    return (
      <p className="text-[11px] text-muted-foreground">
        {t.professional.patients.capReached}
      </p>
    );
  }

  return (
    <p className="text-[11px] text-muted-foreground tabular-nums">
      {interpolate(t.professional.patients.withinCap, {
        used: String(entitlement.used),
        total: String(entitlement.total),
      })}
    </p>
  );
}

export default function ProPazienti() {
  const { data: professionalId } = usePortalProfessionalId();
  const { data: patients } = useProfessionalPatients(professionalId);

  if (!patients) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.professional.patients.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 tabular-nums">
          {interpolate(t.professional.patients.count, { n: String(patients.length) })}
        </p>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/60 border border-secondary/20 rounded-lg p-3">
        <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
        <span>{t.professional.patients.privacy}</span>
      </div>

      <div className="space-y-3">
        {patients.map((patient) => (
          <Card key={patient.patientId} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-executive/10 flex items-center justify-center text-sm font-bold text-executive flex-shrink-0">
                  {patient.patientInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {interpolate(t.professional.patients.name, {
                      initials: patient.patientInitials,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {interpolate(t.professional.patients.delivered, {
                      n: String(patient.entitlement.used),
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
