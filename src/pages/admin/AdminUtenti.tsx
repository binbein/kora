import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Search, UserCheck, Users } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import {
  useClientCompanies,
  usePlatformMonths,
  usePlatformUsers,
} from "@/lib/data/queries";
import { currentPlatformMonth } from "@/lib/platform-metrics";
import { formatMonthYear, formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Gli utenti della piattaforma (CLAUDE.md §10.E).
 *
 * NIENTE COLONNA "PIANO". Il piano è dell'azienda, non della persona: la
 * schermata ereditata lo ripeteva su ogni riga, cioè teneva lo stesso dato in
 * due posti liberi di divergere dall'elenco aziende (§5.5). L'azienda c'è, e
 * il suo piano si legge di là.
 *
 * L'AZIENDA SI RISOLVE PER ID, non è una stringa scritta sulla riga: così un
 * utente non può appartenere a un'azienda che l'elenco accanto non contiene —
 * e un guardrail lo verifica sul dataset.
 *
 * È un estratto e la schermata lo dichiara, come l'elenco dipendenti dell'HR:
 * la paginazione è M5, e sette righe presentate come "tutti gli utenti"
 * direbbero che la piattaforma ne ha sette.
 */
export default function AdminUtenti() {
  const [search, setSearch] = useState("");
  const { data: users } = usePlatformUsers();
  const { data: companies } = useClientCompanies();
  const { data: months } = usePlatformMonths();

  if (!users || !companies || !months) return null;

  const currentMonth = currentPlatformMonth(months);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name ?? "";

  const needle = search.trim().toLowerCase();
  const filtered =
    needle === ""
      ? users
      : users.filter(
          (user) =>
            `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(needle) ||
            companyName(user.companyId).toLowerCase().includes(needle),
        );

  /*
   * Il punteggio medio conta i soli utenti che hanno fatto l'assessment: chi
   * non l'ha fatto non ha un punteggio, e metterlo a zero abbasserebbe la media
   * con un dato che non esiste (§11).
   */
  const scored = users.filter((user) => user.healthScore !== null);
  const averageScore =
    scored.length === 0
      ? null
      : Math.round(
          scored.reduce((sum, user) => sum + (user.healthScore ?? 0), 0) /
            scored.length,
        );

  /*
   * Il denominatore dell'estratto è il numero che l'analytics chiama "utenti
   * iscritti", e ora è **lo stesso dato**, non un secondo conto che gli somiglia.
   *
   * Prima questa riga sommava gli iscritti dei soli clienti attivi, mentre la
   * serie di piattaforma li somma tutti: due definizioni diverse che davano lo
   * stesso numero solo perché l'unico cliente non attivo ha zero iscritti. Il
   * giorno in cui un contratto firmato e non avviato avesse qualche iscritto,
   * le due schermate avrebbero detto due cifre — ed è il difetto del 618/767
   * che questa area esiste per non ripetere (§5.5).
   */
  const totalEnrolled = currentMonth?.enrolledEmployees ?? 0;

  const onExtract = interpolate(t.admin.users.kpiOnExtract, {
    shown: formatNumber(users.length),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">{t.admin.users.title}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/*
          * La prima KPI conta tutta la piattaforma, le altre tre l'estratto, e
          * ognuna lo dichiara. Quattro numeri affiancati senza dirlo
          * sembrerebbero parlare della stessa popolazione: è la forma in cui il
          * back-office ereditato metteva "618 utenti attivi" accanto a un tasso
          * di attivazione che ne implicava 767.
          */}
        <KPICard
          title={t.admin.users.kpiTotal}
          value={formatNumber(totalEnrolled)}
          subtitle={t.admin.users.kpiTotalHint}
          icon={Users}
        />
        <KPICard
          title={t.admin.users.kpiActive}
          value={formatNumber(users.filter((user) => user.active).length)}
          subtitle={onExtract}
          icon={UserCheck}
          variant="accent"
        />
        <KPICard
          title={t.admin.users.kpiWithAssessment}
          value={formatNumber(scored.length)}
          subtitle={onExtract}
          icon={Activity}
        />
        <KPICard
          title={t.admin.users.kpiAverageScore}
          value={averageScore === null ? t.common.none : formatNumber(averageScore)}
          subtitle={onExtract}
          icon={Activity}
        />
      </div>

      <Card>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder={t.admin.users.searchPlaceholder}
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.users.colName}</TableHead>
                <TableHead>{t.admin.users.colEmail}</TableHead>
                <TableHead>{t.admin.users.colCompany}</TableHead>
                <TableHead>{t.admin.users.colRole}</TableHead>
                <TableHead>{t.admin.users.colScore}</TableHead>
                <TableHead>{t.admin.users.colStatus}</TableHead>
                <TableHead>{t.admin.users.colJoined}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {companyName(user.companyId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.admin.role[user.role]}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {user.healthScore === null ? (
                      <span className="text-muted-foreground">
                        {t.common.none}
                      </span>
                    ) : (
                      formatNumber(user.healthScore)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.active
                          ? "bg-secondary/10 text-secondary-strong"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {user.active
                        ? t.admin.users.statusActive
                        : t.admin.users.statusInactive}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
                    {formatMonthYear(user.joinedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* La lista vuota è un caso, non un imprevisto: cercando "zzz" la
            tabella resta con la sua intestazione e una riga che lo dice. */}
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            {t.admin.users.empty}
          </p>
        ) : null}
      </Card>

      <p className="text-sm text-muted-foreground">
        {interpolate(t.admin.extractNote, {
          shown: formatNumber(users.length),
          total: formatNumber(totalEnrolled),
        })}
      </p>
    </div>
  );
}
