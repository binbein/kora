import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, Mail, Heart, Brain } from "lucide-react";
import PrivacyBanner from "@/components/shared/PrivacyBanner";
import { ErrorNotice } from "@/components/kora/StateNotice";
import {
  loadState,
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
  const profileQuery = useEmployeeProfile();
  const companyQuery = useCompany();
  const psychologistQuery = useEntitlement("psychologist");
  const coachQuery = useEntitlement("coach");
  const checkupQuery = useCheckupEligibility();
  const consultsQuery = useVirtualDoctorConsults();

  /* I tre casi (M5.b), registro consumer. Nessuna di queste sei letture è
     nullable per contratto: qui il vuoto è al massimo una lista senza righe,
     e i consulti la mostrano come conteggio, non come elenco. */
  const page = loadState([
    profileQuery,
    companyQuery,
    psychologistQuery,
    coachQuery,
    checkupQuery,
    consultsQuery,
  ]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.employee.state.error} onRetry={page.retry} />;
  }

  const profile = profileQuery.data;
  const company = companyQuery.data;
  const psychologist = psychologistQuery.data;
  const coach = coachQuery.data;
  const checkup = checkupQuery.data;
  const consults = consultsQuery.data;
  if (
    profile === undefined ||
    company === undefined ||
    psychologist === undefined ||
    coach === undefined ||
    checkup === undefined ||
    consults === undefined
  ) {
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
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-xl font-bold text-secondary-strong">
            {profile.firstName[0]}
            {profile.lastName[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold">{employeeDisplayName(profile)}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
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
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
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
          <Heart className="w-4 h-4 text-secondary" aria-hidden="true" />
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
          <Brain className="w-4 h-4 text-secondary" aria-hidden="true" />
          {t.employee.profile.usageTitle}
        </h2>
        <div className="space-y-1">
          <Row
            label={t.employee.profile.usage.psychologist}
            value={entitlementValue(psychologist)}
          />
          {/*
            * LA RIGA COACH ESISTE SOLO SE IL PIANO HA IL COACH, ed è la stessa
            * regola della home — `coachSessionsPerYear` assente significa che
            * il contratto commerciale non prevede il servizio (§9), non che il
            * tetto sia zero.
            *
            * Senza, su un Essenziale questa riga direbbe "1 su 0": il diritto
            * lo costruisce `?? 0` perché il tipo vuole un numero, e a saltarla
            * deve essere la schermata finché `getEntitlement` non risponde
            * `null` (`docs/CONTRATTO-DATI.md` §3). La home lo faceva già e il
            * profilo no, cioè due schermate della stessa area con due regole.
            *
            * **La lettura resta dov'è**: `useEntitlement("coach")` è un hook e
            * si chiama sempre, a piano o senza. A cambiare è la resa.
            */}
          {company.plan.coachSessionsPerYear !== undefined && (
            <Row
              label={t.employee.profile.usage.coach}
              value={entitlementValue(coach)}
            />
          )}
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
        <Shield className="w-3.5 h-3.5 text-secondary flex-shrink-0" aria-hidden="true" />
        <span>{t.employee.profile.dataNote}</span>
      </div>
    </div>
  );
}
