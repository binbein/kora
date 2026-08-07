import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, ClipboardCheck, AlertTriangle, CalendarClock } from "lucide-react";
import {
  useCheckupEligibility,
  useCheckupProviders,
  useCheckupReport,
} from "@/lib/data/queries";
import { formatDate, formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";
import type { CheckupProvider } from "@/lib/data/types";

/*
 * Il check-up (CLAUDE.md §10.B).
 *
 * Laura l'ha già fatto a marzo (§8), quindi questa schermata **non** ripropone
 * una prenotazione: mostra il referto e dice quando si apre il prossimo. È la
 * stessa cosa che l'elenco dipendenti dell'HR dichiara della riga `L.B.`, ed è
 * il punto in cui la storia deve restare una sola sui tre lati — il codice
 * ereditato dava il check-up per "disponibile" qui e per fatto là.
 *
 * La rete è quella del §8, la stessa del back-office. Il Centro Diagnostico
 * Basalto non compare: è in convenzionamento, e l'admin lo dichiara con zero
 * prenotazioni. Filtrare sullo stato è ciò che impedisce di offrire una
 * struttura che l'altra schermata dice non ancora attiva.
 */

/*
 * Le chiavi della spiegazione sono un insieme aperto sul contratto, quindi la
 * mappa si legge come tale invece di far finta che ne esista una sola.
 */
const explanations: Record<string, string> =
  t.employee.checkup.report.explanation;

/**
 * Le distanze si scrivono con il decimale solo quando ce l'hanno: "2.1 km" e
 * "28 km", non "28.0 km".
 */
function distance(km: number): string {
  return interpolate(t.employee.checkup.distance, {
    km: formatNumber(km, undefined, { decimals: Number.isInteger(km) ? 0 : 1 }),
  });
}

function ProviderRow({
  provider,
  availableFrom,
}: {
  provider: CheckupProvider;
  availableFrom: Date | null;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{provider.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {provider.address}, {provider.city}
            </span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full tabular-nums">
              {distance(provider.distanceKm)}
            </span>
          </div>
        </div>
        {/*
         * Il pulsante resta e dice perché non si può premere: toglierlo
         * lascerebbe una scheda senza esito, e un pulsante che si preme senza
         * conseguenze sarebbe il vicolo cieco che il §10.B vieta.
         */}
        <Button variant="outline" className="self-center tabular-nums" disabled>
          {availableFrom
            ? interpolate(t.employee.checkup.bookFrom, {
                date: formatDate(availableFrom),
              })
            : ""}
        </Button>
      </div>
    </Card>
  );
}

export default function Checkup() {
  const { data: eligibility } = useCheckupEligibility();
  const { data: providers } = useCheckupProviders();
  const [reportOpen, setReportOpen] = useState(false);

  const lastCompleted = eligibility?.lastCompleted ?? null;
  const { data: report } = useCheckupReport(lastCompleted?.id);

  if (!eligibility || !providers) return null;

  const bookable = providers
    .filter((provider) => provider.status === "active")
    .slice()
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const providerOf = (id: string) =>
    providers.find((provider) => provider.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {t.employee.checkup.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.employee.checkup.subtitle}
        </p>
      </div>

      {lastCompleted && (
        <Card
          className="p-5 bg-accent/40 border-secondary/20 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setReportOpen(true)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary/10 rounded-xl">
              <ClipboardCheck className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {t.employee.checkup.lastTitle}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {interpolate(t.employee.checkup.lastDone, {
                  date: formatDate(lastCompleted.start),
                  provider: providerOf(lastCompleted.providerId)?.name ?? "",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.employee.checkup.lastOpen}
              </p>
            </div>
          </div>
        </Card>
      )}

      {eligibility.availableFrom && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
          <CalendarClock className="w-4 h-4 flex-shrink-0 text-secondary" />
          <span>
            {interpolate(t.employee.checkup.nextFrom, {
              date: formatDate(eligibility.availableFrom),
            })}
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t.employee.checkup.networkTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.employee.checkup.networkHint}
          </p>
        </div>
        {bookable.map((provider) => (
          <ProviderRow
            key={provider.id}
            provider={provider}
            availableFrom={eligibility.availableFrom}
          />
        ))}
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lastCompleted
                ? interpolate(t.employee.checkup.report.title, {
                    date: formatDate(lastCompleted.start),
                  })
                : ""}
            </DialogTitle>
          </DialogHeader>
          {report && (
            <div className="space-y-3">
              {report.measurements.map((measurement) => (
                <div
                  key={measurement.key}
                  className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t.employee.checkup.report.measurement[measurement.key]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {measurement.value}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      measurement.status === "attention"
                        ? "border-warning text-foreground flex-shrink-0"
                        : "bg-secondary/10 text-secondary flex-shrink-0"
                    }
                  >
                    {t.employee.checkup.report.status[measurement.status]}
                  </Badge>
                </div>
              ))}

              <div className="bg-accent/60 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">
                  {t.employee.checkup.report.explanationTitle}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {explanations[report.explanationKey]}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-xs text-foreground">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <span>{t.employee.checkup.report.disclaimer}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
