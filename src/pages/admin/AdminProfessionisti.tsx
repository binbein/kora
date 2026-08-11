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
import { Briefcase, CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import KPICard from "@/components/shared/KPICard";
import { useProfessionals } from "@/lib/data/queries";
import { isBookable, professionalDisplayName } from "@/lib/data/types";
import { formatCHF, formatNumber, formatRating } from "@/lib/format";
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
export default function AdminProfessionisti() {
  const { data: professionals } = useProfessionals();

  if (!professionals) return null;

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
              <TableHead>{t.admin.professionals.colName}</TableHead>
              <TableHead>{t.admin.professionals.colQualification}</TableHead>
              <TableHead>{t.admin.professionals.colSpecialty}</TableHead>
              <TableHead>{t.admin.professionals.colLanguages}</TableHead>
              <TableHead>{t.admin.professionals.colFee}</TableHead>
              <TableHead>{t.admin.professionals.colSessions}</TableHead>
              <TableHead>{t.admin.professionals.colDocuments}</TableHead>
              <TableHead>{t.admin.professionals.colMandate}</TableHead>
              <TableHead>{t.admin.professionals.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((professional) => (
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
                  {professional.languages
                    .map((language) => t.language[language])
                    .join(t.common.listSeparator)}
                </TableCell>
                <TableCell className="tabular-nums whitespace-nowrap">
                  {formatCHF(professional.sessionFee)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(professional.totalSessions)}
                </TableCell>
                <TableCell>
                  {professional.documentsVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  {professional.mandateSigned ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      isBookable(professional)
                        ? "bg-secondary/10 text-secondary"
                        : "bg-warning/20 text-foreground"
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
