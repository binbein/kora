import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import { loadState, useProfessionals } from "@/lib/data/queries";
import { EmptyNotice, ErrorNotice } from "@/components/kora/StateNotice";
import { SortableHead, useSortedRows } from "@/components/kora/SortableTable";
import { isBookable, professionalDisplayName } from "@/lib/data/types";
import type { Professional } from "@/lib/data/types";
import { formatCHF, formatList, formatNumber, formatRating } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * Il roster (CLAUDE.md §10.E).
 *
 * NIENTE NUMERI D'ALBO. Il codice ereditato ne aveva cinque inventati —
 * FSP-2019-4521 e compagnia — ed è il difetto che M0 ha segnalato e il §8
 * vieta: un identificatore di formato plausibile su una persona inventata può
 * collidere con l'iscrizione di un professionista vero, e a differenza di un
 * nome nessuno se ne accorge leggendo. Il campo non esiste nemmeno nel tipo.
 * Al suo posto c'è la **qualifica**, che è l'informazione che conta, più i due
 * controlli che la piattaforma fa davvero: documenti e mandato.
 *
 * "Prenotabile" si **deriva** da quei due, non è uno stato accanto: il
 * back-office elenca tutti perché seguire chi è in verifica è il suo mestiere,
 * la prenotazione filtra su `isBookable`.
 */
const NO_PROFESSIONALS: Professional[] = [];

export default function AdminProfessionisti() {
  const professionalsQuery = useProfessionals();

  /* Le due colonne dei controlli si ordinano sul booleano, non sull'icona:
     `false` prima in ordine crescente, cioè chi deve ancora essere verificato
     in cima — che è la domanda per cui il back-office esiste. */
  const { rows: professionalRows, sortProps } = useSortedRows(
    professionalsQuery.data ?? NO_PROFESSIONALS,
    {
      name: (professional) => professionalDisplayName(professional),
      qualification: (professional) =>
        t.qualification[professional.qualificationKey],
      specialty: (professional) => t.specialty[professional.specialty],
      languages: (professional) =>
        formatList(
          professional.languages.map((language) => t.language[language]),
        ),
      fee: (professional) => professional.sessionFee,
      sessions: (professional) => professional.totalSessions,
      documents: (professional) => professional.documentsVerified,
      mandate: (professional) => professional.mandateSigned,
      status: (professional) => isBookable(professional),
    },
    (professional) => professionalDisplayName(professional),
  );

  /* I tre casi (M5.b), registro strumento. */
  const page = loadState([professionalsQuery]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }
  const professionals = professionalsQuery.data;
  if (professionals === undefined) return null;
  if (professionals.length === 0) {
    return (
      <Card>
        <EmptyNotice text={t.admin.professionals.empty} />
      </Card>
    );
  }

  const bookable = professionals.filter(isBookable);
  const deliveredSessions = professionals.reduce(
    (sum, professional) => sum + professional.totalSessions,
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">
        {t.admin.professionals.title}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.admin.professionals.kpiTotal}
          value={formatNumber(professionals.length)}
          icon={Briefcase}
        />
        <KPICard
          title={t.admin.professionals.kpiBookable}
          value={formatNumber(bookable.length)}
          icon={CheckCircle2}
          variant="accent"
        />
        <KPICard
          title={t.admin.professionals.kpiVetting}
          value={formatNumber(professionals.length - bookable.length)}
          icon={Clock}
        />
        <KPICard
          title={t.admin.professionals.kpiSessions}
          value={formatNumber(deliveredSessions)}
          subtitle={t.admin.professionals.kpiSessionsHint}
          icon={Star}
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead {...sortProps("name")}>
                {t.admin.professionals.colName}
              </SortableHead>
              <SortableHead {...sortProps("qualification")}>
                {t.admin.professionals.colQualification}
              </SortableHead>
              <SortableHead {...sortProps("specialty")}>
                {t.admin.professionals.colSpecialty}
              </SortableHead>
              <SortableHead {...sortProps("languages")}>
                {t.admin.professionals.colLanguages}
              </SortableHead>
              <SortableHead {...sortProps("fee")}>
                {t.admin.professionals.colFee}
              </SortableHead>
              <SortableHead {...sortProps("sessions")}>
                {t.admin.professionals.colSessions}
              </SortableHead>
              <SortableHead {...sortProps("documents")}>
                {t.admin.professionals.colDocuments}
              </SortableHead>
              <SortableHead {...sortProps("mandate")}>
                {t.admin.professionals.colMandate}
              </SortableHead>
              <SortableHead {...sortProps("status")}>
                {t.admin.professionals.colStatus}
              </SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionalRows.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {professionalDisplayName(professional)}
                  {/* Senza valutazione per chi non ha ancora erogato sedute:
                      uno zero si leggerebbe come la peggiore possibile. */}
                  <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                    {professional.rating === null
                      ? t.common.none
                      : formatRating(professional.rating)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {t.qualification[professional.qualificationKey]}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {t.specialty[professional.specialty]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatList(
                    professional.languages.map(
                      (language) => t.language[language],
                    ),
                  )}
                </TableCell>
                <TableCell className="tabular-nums whitespace-nowrap">
                  {formatCHF(professional.sessionFee)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(professional.totalSessions)}
                </TableCell>
                <TableCell>
                  {professional.documentsVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </TableCell>
                <TableCell>
                  {professional.mandateSigned ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      isBookable(professional)
                        ? "bg-secondary/10 text-secondary-strong hover:bg-secondary/10"
                        : "bg-waiting text-waiting-foreground hover:bg-waiting"
                    }
                  >
                    {isBookable(professional)
                      ? t.admin.professionals.statusBookable
                      : t.admin.professionals.statusVetting}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="text-sm text-muted-foreground">
        {t.admin.professionals.vettingNote}
      </p>
    </div>
  );
}
