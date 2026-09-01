import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Lock } from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';
import { SortableHead, useSortedRows } from '@/components/kora/SortableTable';
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
import type { EmployeeDirectoryEntry } from '@/lib/data/types';

/*
 * IL CHECK-UP SI ORDINA PER IL PERCORSO, NON PER LA PAROLA. Le tre voci stanno
 * su una linea — disponibile, prenotato, fatto — quindi l'ordine è un fatto del
 * dominio e non cambia con la lingua. Chi non ha attivato l'account ha `null`,
 * che non è un quarto gradino: è il vuoto, e sta in fondo in tutte e due le
 * direzioni.
 */
const CHECKUP_RANK: Record<
  NonNullable<EmployeeDirectoryEntry['checkupStatus']>,
  number
> = { available: 1, booked: 2, completed: 3 };

const NO_ENTRIES: EmployeeDirectoryEntry[] = [];

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

  const departmentName = (id: string) =>
    departmentsQuery.data?.find((department) => department.id === id)?.name ?? id;

  /* L'ordinamento sta prima dei tre casi perché è un hook: la lista è vuota
     finché il dato non arriva, e ordinare zero righe non costa niente. */
  const { rows: entries, sortProps } = useSortedRows(
    directoryQuery.data ?? NO_ENTRIES,
    {
      employee: (entry) => entry.initials,
      department: (entry) => departmentName(entry.departmentId),
      enrolled: (entry) => entry.enrolled,
      checkup: (entry) =>
        entry.checkupStatus === null ? null : CHECKUP_RANK[entry.checkupStatus],
    },
    (entry) => entry.initials,
  );

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
              <SortableHead {...sortProps('employee')}>
                {t.hr.employees.columnEmployee}
              </SortableHead>
              <SortableHead {...sortProps('department')}>
                {t.hr.employees.columnDepartment}
              </SortableHead>
              <SortableHead {...sortProps('enrolled')}>
                {t.hr.employees.columnStatus}
              </SortableHead>
              <SortableHead {...sortProps('checkup')}>
                {t.hr.employees.columnCheckup}
              </SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.employeeId}>
                <TableCell className="font-medium">{entry.initials}</TableCell>
                <TableCell className="text-muted-foreground">
                  {departmentName(entry.departmentId)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={entry.enrolled ? 'default' : 'outline'}
                    className={entry.enrolled ? 'bg-secondary/10 text-secondary-strong hover:bg-secondary/10' : ''}
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
          niente da dichiarare, e l'`EmptyNotice` lo dice già.

          DALL'ORDINAMENTO IN POI DICE ANCHE SU QUANTI, e che a ordinarsi è
          l'estratto: chi ordina per stato vede in cima i non iscritti di
          queste otto righe e potrebbe crederli tutti quelli dell'azienda,
          che sono 120 (§7 del contratto, la paginazione è lavoro dell'MVP). */}
      {directory.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {interpolate(t.hr.employees.sampleNote, {
            n: formatNumber(directory.length),
            total: formatNumber(company.employeeCount),
          })}
        </p>
      )}
    </div>
  );
}
