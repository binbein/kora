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
import { SortableHead, useSortedRows } from "@/components/kora/SortableTable";
import { professionalDisplayName } from "@/lib/data/types";
import type { AppointmentStatus, PlatformSession } from "@/lib/data/types";
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
 * La scala dello stato, e **non è una scelta di questa schermata**: è l'ordine
 * delle tre schede di `/professional/sessions`, che il portale mostra da M2 —
 * in programma, erogate, annullate. Due ordini per la stessa enumerazione
 * sarebbero due rese dello stesso fatto che possono divergere (§5.5), quindi
 * qui si cita quello che c'è invece di sceglierne uno.
 */
const STATUS_RANK: Record<AppointmentStatus, number> = {
  scheduled: 1,
  completed: 2,
  cancelled: 3,
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

const NO_SESSIONS: PlatformSession[] = [];

export default function AdminSessioni() {
  const portalIdQuery = usePortalProfessionalId();
  const professionalQuery = usePortalProfessional();
  const sessionsQuery = usePlatformSessions(portalIdQuery.data);

  /*
   * È LA TABELLA PER CUI L'ORDINAMENTO ESISTE: 82 righe, contro le cinque-otto
   * delle altre sei.
   *
   * UNA COLONNA NON SI ORDINA: **il professionista**, perché nella demo porta
   * lo stesso valore su tutte le righe — l'agenda è quella della Dr.ssa Meier e
   * la schermata lo dichiara nel sottotitolo (`docs/CONTRATTO-DATI.md` §7). Una
   * freccia che non cambia niente è un comando che non comanda. Torna il giorno
   * in cui il back-office aggrega più agende, che è la stessa riga del
   * contratto.
   *
   * LO STATO SI ORDINA SU UNA SCALA DEL DOMINIO, come il percorso del check-up
   * nell'elenco HR e i tre piani del portafoglio: il rango è `STATUS_RANK`, che
   * cita l'ordine delle schede del portale professionista invece di sceglierne
   * uno qui.
   *
   * **Fino al 19.08.2026 non si ordinava**, e la ragione stava in due metà di
   * cui una sola reggeva. Quella vera — l'alfabetico sulla parola tradotta
   * darebbe quattro ordini in quattro lingue — vale se si ordina l'etichetta, ed
   * è precisamente ciò che una mappa di rango evita: questa schermata ne aveva
   * già due sotto gli occhi, `CHECKUP_RANK` e `PLAN_RANK`, scritte nella stessa
   * passata. Quella falsa era la prima: **l'ordine non stava da inventare**,
   * esisteva già nel prodotto a due schermate di distanza.
   *
   * IL PAZIENTE SI ORDINA PER INIZIALI, cioè per una **resa** e non per un
   * nome: qui il nome non arriva, ed è la garanzia del §3 del contratto. Nella
   * demo tiene perché stesse iniziali vogliono dire stessa persona — un vincolo
   * del dataset con un guardrail dietro — e in produzione cade insieme a lui
   * (§8.8): due omonimi finirebbero adiacenti senza essere la stessa persona.
   */
  const { rows: sessionRows, sortProps } = useSortedRows(
    sessionsQuery.data ?? NO_SESSIONS,
    {
      patient: (session) => session.patientInitials,
      date: (session) => session.start,
      type: (session) => t.sessionType[session.type],
      fee: (session) =>
        session.status === "completed"
          ? (professionalQuery.data?.sessionFee ?? null)
          : null,
      status: (session) => STATUS_RANK[session.status],
    },
    (session) => session.start.toISOString(),
  );

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
              <SortableHead {...sortProps("patient")}>
                {t.admin.sessions.colPatient}
              </SortableHead>
              {/* L'unica non ordinabile, e la ragione sta in testa al file. */}
              <TableHead>{t.admin.sessions.colProfessional}</TableHead>
              <SortableHead {...sortProps("date")}>
                {t.admin.sessions.colDate}
              </SortableHead>
              <SortableHead {...sortProps("type")}>
                {t.admin.sessions.colType}
              </SortableHead>
              <SortableHead {...sortProps("fee")}>
                {t.admin.sessions.colFee}
              </SortableHead>
              <SortableHead {...sortProps("status")}>
                {t.admin.sessions.colStatus}
              </SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionRows.map((session) => (
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
