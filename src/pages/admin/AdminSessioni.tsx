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
import { CalendarClock, CheckCircle2, ClipboardList, Coins } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import {
  loadState,
  usePlatformSessions,
  usePortalProfessional,
  usePortalProfessionalId,
} from "@/lib/data/queries";
import { EmptyNotice, ErrorNotice } from "@/components/kora/StateNotice";
import { professionalDisplayName } from "@/lib/data/types";
import type { AppointmentStatus } from "@/lib/data/types";
import { formatCHF, formatDate, formatNumber, formatTime } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Le sedute viste dal back-office (CLAUDE.md §10.E).
 *
 * È l'agenda della Dr.ssa Meier, e la schermata lo dichiara nel sottotitolo: il
 * dataset demo ha **un portale professionista solo**, ed è una semplificazione
 * dichiarata (`docs/CONTRATTO-DATI.md` §7), non un elenco che finge di essere
 * tutta la piattaforma. In produzione questo metodo prenderà un intervallo e
 * una pagina.
 *
 * Le date vengono da `DEMO_TODAY` come ovunque. La schermata ereditata aveva
 * sette righe di aprile con "Dr.ssa Bianchi", che non è nel roster del §8, su
 * una demo ambientata a settembre.
 *
 * DEI PAZIENTI ESCONO LE SOLE INIZIALI, e a garantirlo è il tipo:
 * `PlatformSession` non ha nessun campo su cui un nome possa arrivare. Non è
 * una scelta di rendering che qualcuno possa disfare.
 *
 * **Fino al 17.08.2026 la garanzia veniva da un'altra parte**, e leggere quella
 * riga oggi porterebbe fuori strada: la schermata leggeva
 * `getProfessionalSessions`, cioè la proiezione di chi cura, e la garanzia
 * teneva perché **nemmeno lì** c'era un nome. Il giorno in cui la professionista
 * ha cominciato a ricevere il nome dei propri pazienti quella lettura è
 * diventata la strada per cui il nome sarebbe arrivato anche qui, e le due viste
 * si sono separate in due tipi.
 */

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  scheduled: "bg-secondary/10 text-secondary-strong",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-muted text-muted-foreground",
};

/*
 * L'etichetta si legge alla chiamata, non all'import (M5.e): una mappa
 * costruita a livello di modulo cattura il dizionario di allora, e con il
 * cambio lingua resterebbe in italiano in silenzio.
 */
function statusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    scheduled: t.admin.sessions.statusScheduled,
    completed: t.admin.sessions.statusCompleted,
    cancelled: t.admin.sessions.statusCancelled,
  };
  return labels[status];
}

export default function AdminSessioni() {
  const portalIdQuery = usePortalProfessionalId();
  const professionalQuery = usePortalProfessional();
  const sessionsQuery = usePlatformSessions(portalIdQuery.data);

  /* I tre casi (M5.b), registro strumento. `portalIdQuery` entra nel gruppo
     perché le altre due dipendono da lui e senza resterebbero in attesa. */
  const page = loadState([portalIdQuery, professionalQuery, sessionsQuery]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const professional = professionalQuery.data;
  const sessions = sessionsQuery.data;
  if (professional === undefined || sessions === undefined) return null;
  /* `getProfessional` è nullable per contratto. */
  if (professional === null) {
    return (
      <Card>
        <EmptyNotice text={t.professional.profile.empty} />
      </Card>
    );
  }

  const delivered = sessions.filter(
    (session) => session.status === "completed",
  );
  const scheduled = sessions.filter(
    (session) => session.status === "scheduled",
  );

  /*
   * I compensi contano le sole sedute **erogate**: quelle in programma non sono
   * un compenso maturato, ed è la stessa definizione del riepilogo del portale
   * professionista (`docs/CONTRATTO-DATI.md` §3). Due schermate che contano lo
   * stesso denaro devono contarlo allo stesso modo.
   */
  const grossChf = delivered.length * professional.sessionFee;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {t.admin.sessions.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {interpolate(t.admin.sessions.subtitle, {
            professional: professionalDisplayName(professional),
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.admin.sessions.kpiTotal}
          value={formatNumber(sessions.length)}
          icon={ClipboardList}
        />
        <KPICard
          title={t.admin.sessions.kpiDelivered}
          value={formatNumber(delivered.length)}
          icon={CheckCircle2}
          variant="accent"
        />
        <KPICard
          title={t.admin.sessions.kpiScheduled}
          value={formatNumber(scheduled.length)}
          icon={CalendarClock}
        />
        <KPICard
          title={t.admin.sessions.kpiVolume}
          value={formatCHF(grossChf)}
          subtitle={t.admin.sessions.kpiVolumeHint}
          icon={Coins}
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.sessions.colPatient}</TableHead>
              <TableHead>{t.admin.sessions.colProfessional}</TableHead>
              <TableHead>{t.admin.sessions.colDate}</TableHead>
              <TableHead>{t.admin.sessions.colType}</TableHead>
              <TableHead>{t.admin.sessions.colFee}</TableHead>
              <TableHead>{t.admin.sessions.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">
                  {session.patientInitials}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {professionalDisplayName(professional)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                  {formatDate(session.start)} · {formatTime(session.start)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{t.sessionType[session.type]}</Badge>
                </TableCell>
                {/* Il compenso lo matura la seduta **erogata**, e la riga porta
                    l'importo solo lì: la KPI accanto somma le erogate e dice
                    "solo sedute erogate", quindi chi somma questa colonna deve
                    ottenere quel numero. Con l'importo anche sulle sedute in
                    programma le due cifre divergevano nella stessa schermata,
                    che è ciò che il §5.5 vieta — e l'annullata, che il trattino
                    già mostrava, era solo metà del caso. */}
                <TableCell className="tabular-nums whitespace-nowrap">
                  {session.status === "completed"
                    ? formatCHF(professional.sessionFee)
                    : t.common.none}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_BADGE[session.status]}>
                    {statusLabel(session.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="text-sm text-muted-foreground">
        {t.admin.sessions.privacyNote}
      </p>
    </div>
  );
}
