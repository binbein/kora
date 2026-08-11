import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock } from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';
import { formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  loadState,
  useCompany,
  useCurrentQuarter,
  useDepartments,
  useEmployeeDirectory,
  useRoiSnapshot,
} from '@/lib/data/queries';

/*
 * L'elenco dipendenti dell'area HR (CLAUDE.md §10.C).
 *
 * L'intestazione conta l'azienda, non la tabella: il codice ereditato diceva
 * "6/8 attivati" accanto a una dashboard che ne dichiarava 82 su 120, e chi
 * leggeva entrambe trovava due aziende diverse. La tabella è un estratto e lo
 * dichiara.
 */
export default function HRDipendenti() {
  const companyQuery = useCompany();
  const currentQuarterQuery = useCurrentQuarter();
  const snapshotQuery = useRoiSnapshot(currentQuarterQuery.data);
  const departmentsQuery = useDepartments();
  const directoryQuery = useEmployeeDirectory();

  /* I tre casi (M5.b). */
  const page = loadState([
    companyQuery,
    currentQuarterQuery,
    snapshotQuery,
    departmentsQuery,
    directoryQuery,
  ]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const company = companyQuery.data;
  const snapshot = snapshotQuery.data;
  const departments = departmentsQuery.data;
  const directory = directoryQuery.data;
  if (
    company === undefined ||
    snapshot === undefined ||
    departments === undefined ||
    directory === undefined
  ) {
    return null;
  }

  const departmentName = (id: string) =>
    departments.find((department) => department.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.hr.employees.title}</h1>
        {/* Senza snapshot il conto degli iscritti non esiste — `null` per
            contratto — ma l'elenco sì: si toglie la riga, non la pagina. */}
        {snapshot !== null && (
          <p className="text-sm text-muted-foreground mt-1 tabular-nums">
            {interpolate(t.hr.employees.subtitle, {
              enrolled: formatNumber(snapshot.enrolledEmployees),
              total: formatNumber(company.employeeCount),
            })}
          </p>
        )}
      </div>

      <PrivacyBanner icon={Lock} message={t.hr.employees.privacyNote} />

      <Card>
        {directory.length === 0 ? (
          <EmptyNotice text={t.hr.employees.empty} />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.hr.employees.columnEmployee}</TableHead>
              <TableHead>{t.hr.employees.columnDepartment}</TableHead>
              <TableHead>{t.hr.employees.columnStatus}</TableHead>
              <TableHead>{t.hr.employees.columnCheckup}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {directory.map((entry) => (
              <TableRow key={entry.employeeId}>
                <TableCell className="font-medium">{entry.initials}</TableCell>
                <TableCell className="text-muted-foreground">
                  {departmentName(entry.departmentId)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={entry.enrolled ? 'default' : 'outline'}
                    className={entry.enrolled ? 'bg-secondary/10 text-secondary-strong' : ''}
                  >
                    {entry.enrolled ? t.hr.employees.enrolled : t.hr.employees.notEnrolled}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.checkupStatus === null
                    ? t.common.none
                    : t.hr.employees.checkup[entry.checkupStatus]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Card>

      {/* La nota dichiara che la tabella è un estratto: senza righe non ha
          niente da dichiarare, e l'`EmptyNotice` lo dice già. */}
      {directory.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {interpolate(t.hr.employees.sampleNote, {
            n: formatNumber(directory.length),
          })}
        </p>
      )}
    </div>
  );
}
