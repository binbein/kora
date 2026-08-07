import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, Mail, Heart, Brain } from "lucide-react";
import PrivacyBanner from "@/components/shared/PrivacyBanner";
import {
  useCheckupEligibility,
  useCompany,
  useEmployeeProfile,
  useEntitlement,
  useVirtualDoctorConsults,
} from "@/lib/data/queries";
import {
  employeeDisplayName,
  type SessionEntitlement,
} from "@/lib/data/types";
import { formatDate, formatMonthYear, formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il profilo (CLAUDE.md §10.B).
 *
 * È l'unica schermata in cui i quattro contatori stanno tutti insieme, quindi è
 * anche quella in cui una divergenza si vedrebbe subito: ognuno arriva dalla
 * stessa fonte che lo mostra altrove — lo psicologo dall'agenda della Dr.ssa
 * Meier, il check-up dallo stesso record che l'HR dichiara `completed`, i
 * consulti dalla lista di cui l'ultimo è la chat aperta oggi.
 *
 * Il codice ereditato dava questa persona per "Giulia Rossi", con un punteggio
 * diverso da quello del §8 e un check-up "Disponibile" che l'elenco HR
 * smentiva. G.R. nel dataset è un'altra persona.
 */

function entitlementValue(entitlement: SessionEntitlement): string {
  return interpolate(t.employee.profile.outOf, {
    used: formatNumber(entitlement.used),
    total: formatNumber(entitlement.total),
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant="outline" className="tabular-nums flex-shrink-0">
        {value}
      </Badge>
    </div>
  );
}

export default function Profilo() {
  const { data: profile } = useEmployeeProfile();
  const { data: company } = useCompany();
  const { data: psychologist } = useEntitlement("psychologist");
  const { data: coach } = useEntitlement("coach");
  const { data: checkup } = useCheckupEligibility();
  const { data: consults } = useVirtualDoctorConsults();

  if (!profile || !company || !psychologist || !coach || !checkup || !consults) {
    return null;
  }

  const lastCheckup = checkup.lastCompleted;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">
        {t.employee.profile.title}
      </h1>

      <PrivacyBanner message={t.employee.profile.privacy} />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-xl font-bold text-secondary">
            {profile.firstName[0]}
            {profile.lastName[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold">{employeeDisplayName(profile)}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              {profile.email}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {t.employee.profile.company}
            </p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {company.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t.employee.profile.plan}
            </p>
            <p className="text-sm font-medium">{t.plan[company.plan.id]}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t.employee.profile.memberSince}
            </p>
            <p className="text-sm font-medium">
              {formatMonthYear(profile.memberSince)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-secondary" />
          {t.employee.profile.healthTitle}
        </h2>
        {/*
         * Tre voci, non le quattro dell'ereditato: stress, sonno ed energia
         * erano etichette scritte in pagina, e nel dominio `HealthProfile` non
         * esistono. Qui c'è quello che il profilo dice davvero.
         */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: t.employee.profile.score,
              value: interpolate(t.employee.profile.scoreValue, {
                score: formatNumber(profile.healthProfile.score),
              }),
            },
            {
              label: t.employee.profile.summary,
              value: t.healthSummary[profile.healthProfile.summaryKey],
            },
            {
              label: t.employee.profile.weakest,
              value: t.healthArea[profile.healthProfile.weakestArea],
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-secondary" />
          {t.employee.profile.usageTitle}
        </h2>
        <div className="space-y-1">
          <Row
            label={t.employee.profile.usage.psychologist}
            value={entitlementValue(psychologist)}
          />
          <Row
            label={t.employee.profile.usage.coach}
            value={entitlementValue(coach)}
          />
          <Row
            label={t.employee.profile.usage.checkup}
            value={
              lastCheckup
                ? interpolate(t.employee.profile.checkupDone, {
                    date: formatDate(lastCheckup.start),
                  })
                : t.employee.profile.checkupToBook
            }
          />
          <Row
            label={t.employee.profile.usage.doctor}
            value={interpolate(t.employee.profile.consults, {
              n: formatNumber(consults.length),
            })}
          />
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
        <span>{t.employee.profile.dataNote}</span>
      </div>
    </div>
  );
}
