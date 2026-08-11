import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, MapPin, Building } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import { useCheckupProviders, usePlatformMonths } from "@/lib/data/queries";
import { formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * La rete convenzionata vista dal back-office (CLAUDE.md §10.E).
 *
 * È **la stessa rete** che il portale dipendente propone, letta dallo stesso
 * metodo: il codice ereditato ne teneva due elenchi, ed è così che l'admin
 * dichiarava il Centro Diagnostico Basalto non ancora convenzionato mentre la
 * schermata check-up lo offriva in prenotazione (§8).
 *
 * DUE COLONNE SONO SPARITE. "Servizi" elencava un listino per struttura che il
 * §8 non contiene — inventarlo sarebbe stato un dato nuovo — e "prenotazioni"
 * dava un numero per struttura che nessun dato produce: il totale dei check-up
 * esiste, la sua ripartizione fra le strutture no. Il totale resta come KPI,
 * derivato dalla serie di piattaforma; la distanza prende il loro posto in
 * tabella, ed è un dato che esiste davvero.
 */
export default function AdminProvider() {
  const { data: providers } = useCheckupProviders();
  const { data: months } = usePlatformMonths();

  if (!providers || !months) return null;

  const active = providers.filter((provider) => provider.status === "active");
  const cities = new Set(providers.map((provider) => provider.city));

  /*
   * I check-up prenotati sui dodici mesi vengono dalla serie di piattaforma,
   * non da un contatore per struttura: è lo stesso numero che l'analytics
   * mostra nella ripartizione per servizio.
   */
  const bookings = months.reduce(
    (sum, month) => sum + month.sessions.checkup,
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">
        {t.admin.checkupProviders.title}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.admin.checkupProviders.kpiActive}
          value={formatNumber(active.length)}
          icon={Building}
        />
        <KPICard
          title={t.admin.checkupProviders.kpiCities}
          value={formatNumber(cities.size)}
          icon={MapPin}
        />
        <KPICard
          title={t.admin.checkupProviders.kpiBookings}
          value={formatNumber(bookings)}
          subtitle={t.admin.checkupProviders.kpiBookingsHint}
          icon={CheckCircle2}
          variant="accent"
        />
        <KPICard
          title={t.admin.checkupProviders.kpiPending}
          value={formatNumber(providers.length - active.length)}
          icon={Clock}
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.checkupProviders.colName}</TableHead>
              <TableHead>{t.admin.checkupProviders.colCity}</TableHead>
              <TableHead>{t.admin.checkupProviders.colAddress}</TableHead>
              <TableHead>{t.admin.checkupProviders.colDistance}</TableHead>
              <TableHead>{t.admin.checkupProviders.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {provider.city}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {provider.address}
                </TableCell>
                <TableCell className="tabular-nums whitespace-nowrap">
                  {interpolate(t.admin.checkupProviders.distance, {
                    km: formatNumber(provider.distanceKm, undefined, {
                      decimals: provider.distanceKm % 1 === 0 ? 0 : 1,
                    }),
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      provider.status === "active"
                        ? "bg-secondary/10 text-secondary-strong"
                        : "bg-warning/20 text-foreground"
                    }
                  >
                    {provider.status === "active"
                      ? t.admin.checkupProviders.statusActive
                      : t.admin.checkupProviders.statusPending}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="text-sm text-muted-foreground">
        {t.admin.checkupProviders.pendingNote}
      </p>
    </div>
  );
}
