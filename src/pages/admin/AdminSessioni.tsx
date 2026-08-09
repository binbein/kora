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
  usePortalProfessional,
  usePortalProfessionalId,
  useProfessionalSessions,
} from "@/lib/data/queries";
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
 * `ProfessionalSession` non ha nessun campo su cui un nome possa arrivare
 * (§10.D). Non è una scelta di rendering che qualcuno possa disfare.
 */

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  scheduled: "bg-secondary/10 text-secondary",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: t.admin.sessions.statusScheduled,
  completed: t.admin.sessions.statusCompleted,
  cancelled: t.admin.sessions.statusCancelled,
};

export default function AdminSessioni() {
  const { data: professionalId } = usePortalProfessionalId();
  const { data: professional } = usePortalProfessional();
  const { data: sessions } = useProfessionalSessions(professionalId);

  if (!professional || !sessions) return null;

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
                {/* Una seduta annullata non matura compenso: la riga mostra un
                    trattino invece di un importo che nessuno incassa. */}
                <TableCell className="tabular-nums whitespace-nowrap">
                  {session.status === "cancelled"
                    ? t.common.none
                    : formatCHF(professional.sessionFee)}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_BADGE[session.status]}>
                    {STATUS_LABEL[session.status]}
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
