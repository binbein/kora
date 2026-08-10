import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
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
  const { data: company } = useCompany();
  const { data: currentQuarter } = useCurrentQuarter();
  const { data: snapshot } = useRoiSnapshot(currentQuarter);
  const { data: departments } = useDepartments();
  const { data: directory } = useEmployeeDirectory();

  if (!company || !snapshot || !departments || !directory) return null;

  const departmentName = (id: string) =>
    departments.find((department) => department.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.hr.employees.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 tabular-nums">
          {interpolate(t.hr.employees.subtitle, {
            enrolled: formatNumber(snapshot.enrolledEmployees),
            total: formatNumber(company.employeeCount),
          })}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-accent/60 border border-secondary/20 rounded-lg px-4 py-3">
        <Lock className="w-5 h-5 text-secondary flex-shrink-0" />
        <p className="text-sm text-muted-foreground">{t.hr.employees.privacyNote}</p>
      </div>

      <Card>
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
                    className={entry.enrolled ? 'bg-secondary/10 text-secondary' : ''}
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
      </Card>

      <p className="text-xs text-muted-foreground">
        {interpolate(t.hr.employees.sampleNote, {
          n: formatNumber(directory.length),
        })}
      </p>
    </div>
  );
}
