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
import { Building2, Users, TrendingUp, UserCheck } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import { loadState, useClientCompanies, useDemoRequests, usePlans } from "@/lib/data/queries";
import { EmptyNotice, ErrorNotice } from "@/components/kora/StateNotice";
import { annualRevenueOf } from "@/lib/platform-metrics";
import type { PlanId } from "@/lib/data/types";
import {
  formatCHF,
  formatDate,
  formatMonthYear,
  formatNumber,
} from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Le richieste arrivate dal form pubblico, sotto il portafoglio: sono i clienti
 * di domani accanto a quelli di oggi, quindi stanno su questa rotta e non su
 * una nuova (§2.6).
 *
 * **Parte vuota di proposito.** Il §8 non contiene richieste demo e non se ne
 * inventano (§2.4): l'elenco si riempie inviando il form da `/demo`, ed è la
 * prova che il giro `submitDemoRequest` → invalidazione → rilettura è chiuso
 * (`docs/CONTRATTO-DATI.md` §4).
 */
function DemoRequests() {
  const requestsQuery = useDemoRequests();

  /* I tre casi (M5.b): la tabella richieste ha una lettura sua, e il vuoto —
     nessuna richiesta ancora arrivata — è lo stato in cui il pitch la apre. */
  const block = loadState([requestsQuery]);
  if (block.state === "error") {
    return <ErrorNotice copy={t.common.state.error} onRetry={block.retry} />;
  }
  const requests = requestsQuery.data;
  if (requests === undefined) return null;

  return (
    <Card className="overflow-x-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">{t.admin.demoRequests.title}</h2>
      </div>
      {requests.length === 0 ? (
        <EmptyNotice text={t.admin.demoRequests.empty} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.demoRequests.colCompany}</TableHead>
              <TableHead>{t.admin.demoRequests.colContact}</TableHead>
              <TableHead>{t.admin.demoRequests.colEmail}</TableHead>
              <TableHead>{t.admin.demoRequests.colPhone}</TableHead>
              <TableHead>{t.admin.demoRequests.colEmployees}</TableHead>
              <TableHead>{t.admin.demoRequests.colReceived}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.companyName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {request.contactName}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {request.email}
                </TableCell>
                {/* Niente `tabular-nums` benché sia una colonna di cifre: il
                    §6.3 lo vuole dove le cifre ballano cambiando valore, e un
                    numero di telefono non cambia e non si confronta in
                    colonna. `whitespace-nowrap` sì — un prefisso mandato a
                    capo si legge come due numeri. */}
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {request.phone ?? t.common.none}
                </TableCell>
                <TableCell className="tabular-nums">
                  {request.employeeCount === null
                    ? t.common.none
                    : formatNumber(request.employeeCount)}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
                  {formatDate(request.submittedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

/*
 * Il portafoglio clienti (CLAUDE.md §10.E).
 *
 * IL RICAVO NON È UN DATO, È UNA MOLTIPLICAZIONE: organico × prezzo del piano ×
 * 12. La schermata ereditata lo teneva scritto accanto all'organico, ed è così
 * che Demo SA arrivava a dichiarare CHF 99'000 su 150 dipendenti mentre il §8
 * ne dà 120 — due numeri sullo stesso fatto, liberi di divergere (§5.5).
 *
 * I totali contano i **clienti attivi** e l'etichetta lo dice: chi non è ancora
 * avviato non fattura, e sommarlo gonfierebbe il ricavo con un contratto che
 * non produce un franco.
 */

const PLAN_BADGE: Record<PlanId, string> = {
  essenziale: "bg-muted text-muted-foreground",
  plus: "bg-secondary/10 text-secondary-strong",
  executive: "bg-executive/10 text-executive",
};

export default function AdminAziende() {
  const companiesQuery = useClientCompanies();
  const plansQuery = usePlans();

  /* I tre casi (M5.b), registro strumento. */
  const page = loadState([companiesQuery, plansQuery]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const companies = companiesQuery.data;
  const plans = plansQuery.data;
  if (companies === undefined || plans === undefined) return null;

  const active = companies.filter((company) => company.active);
  const coveredEmployees = active.reduce(
    (sum, company) => sum + company.employeeCount,
    0,
  );
  const enrolled = active.reduce(
    (sum, company) => sum + company.enrolledEmployees,
    0,
  );
  const revenue = active.reduce(
    (sum, company) => sum + annualRevenueOf(company, plans),
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">
        {t.admin.companies.title}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.admin.companies.kpiActive}
          value={formatNumber(active.length)}
          icon={Building2}
        />
        <KPICard
          title={t.admin.companies.kpiEmployees}
          value={formatNumber(coveredEmployees)}
          icon={Users}
        />
        <KPICard
          title={t.admin.companies.kpiRevenue}
          value={formatCHF(revenue)}
          subtitle={t.admin.companies.kpiRevenueHint}
          icon={TrendingUp}
          variant="accent"
        />
        <KPICard
          title={t.admin.companies.kpiEnrolled}
          value={formatNumber(enrolled)}
          subtitle={interpolate(t.admin.companies.kpiEnrolledHint, {
            enrolled: formatNumber(enrolled),
            covered: formatNumber(coveredEmployees),
          })}
          icon={UserCheck}
        />
      </div>

      <Card className="overflow-x-auto">
        {companies.length === 0 ? (
          <EmptyNotice text={t.admin.companies.empty} />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.companies.colName}</TableHead>
              <TableHead>{t.admin.companies.colIndustry}</TableHead>
              <TableHead>{t.admin.companies.colEmployees}</TableHead>
              <TableHead>{t.admin.companies.colPlan}</TableHead>
              <TableHead>{t.admin.companies.colCity}</TableHead>
              <TableHead>{t.admin.companies.colClientSince}</TableHead>
              <TableHead>{t.admin.companies.colRevenue}</TableHead>
              <TableHead>{t.admin.companies.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {t.admin.industry[company.industry]}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(company.employeeCount)}
                </TableCell>
                <TableCell>
                  <Badge className={PLAN_BADGE[company.planId]}>
                    {t.plan[company.planId]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {company.city}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatMonthYear(company.clientSince)}
                </TableCell>
                {/* Il ricavo di un cliente non avviato è potenziale, e la
                    frase lo dice invece di lasciarlo sommare con gli altri. */}
                <TableCell className="font-medium tabular-nums whitespace-nowrap">
                  {company.active
                    ? formatCHF(annualRevenueOf(company, plans))
                    : interpolate(t.admin.companies.revenuePotential, {
                        amount: formatCHF(annualRevenueOf(company, plans)),
                      })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      company.active
                        ? "bg-secondary/10 text-secondary-strong"
                        : "bg-warning/20 text-foreground"
                    }
                  >
                    {company.active
                      ? t.admin.companies.statusActive
                      : t.admin.companies.statusOnboarding}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Card>

      <DemoRequests />
    </div>
  );
}
