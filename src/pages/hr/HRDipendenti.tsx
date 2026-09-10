import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Lock } from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';
import { SortableHead, useSortedRows } from '@/components/kora/SortableTable';
import { formatNumber, formatPercent } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  loadState,
  useCompany,
  useCurrentQuarter,
  useDepartmentEnrollment,
  useDepartments,
  useRoiSnapshot,
} from '@/lib/data/queries';
import type { DepartmentEnrollment } from '@/lib/data/types';

const NO_ROWS: DepartmentEnrollment[] = [];

/*
 * L'area HR conta per reparto (CLAUDE.md §10.C.5).
 *
 * L'AZIENDA VEDE QUANTI, MAI CHI (founder, 10.09.2026). Fino a quel giorno qui
 * c'era una riga per persona — iniziali, reparto, iscrizione, stato del
 * check-up — cioè un segnale individuale su un servizio sanitario, e in un
 * reparto da sei persone due iniziali identificano. La schermata è rimasta,
 * è cambiato cosa mostra: **a sparire non è una colonna, è la riga**.
 *
 * L'intestazione conta l'azienda e non la tabella, come prima: il codice
 * ereditato diceva "6/8 attivati" accanto a una dashboard che ne dichiarava 82
 * su 120, e chi leggeva entrambe trovava due aziende diverse. Adesso le due
 * cifre non possono divergere — un guardrail verifica che gli iscritti per
 * reparto sommino a quelli dello snapshot.
 */
export default function HRDipendenti() {
  const companyQuery = useCompany();
  const currentQuarterQuery = useCurrentQuarter();
  const snapshotQuery = useRoiSnapshot(currentQuarterQuery.data);
  const departmentsQuery = useDepartments();
  const enrollmentQuery = useDepartmentEnrollment();

  const departmentName = (id: string) =>
    departmentsQuery.data?.find((department) => department.id === id)?.name ?? id;

  /* L'ordinamento sta prima dei tre casi perché è un hook: la lista è vuota
     finché il dato non arriva, e ordinare zero righe non costa niente.

     I CHECK-UP SOPPRESSI SI ORDINANO COME UN VUOTO, non come uno zero: `null`
     è "non pubblicabile", e leggerlo come zero metterebbe la Direzione in
     fondo dichiarando un dato che non abbiamo. È la stessa scelta che lo
     stato del check-up aveva quando le righe erano persone. */
  const { rows, sortProps } = useSortedRows(
    enrollmentQuery.data ?? NO_ROWS,
    {
      department: (row) => departmentName(row.departmentId),
      headcount: (row) => row.employeeCount,
      enrolled: (row) => row.enrolled,
      checkup: (row) => row.checkupCompleted,
    },
    (row) => row.departmentId,
  );

  /* I tre casi (M5.b). */
  const page = loadState([
    companyQuery,
    currentQuarterQuery,
    snapshotQuery,
    departmentsQuery,
    enrollmentQuery,
  ]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const company = companyQuery.data;
  const snapshot = snapshotQuery.data;
  const departments = departmentsQuery.data;
  const enrollment = enrollmentQuery.data;
  if (
    company === undefined ||
    snapshot === undefined ||
    departments === undefined ||
    enrollment === undefined
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.hr.employees.title}</h1>
        {/* Senza snapshot il conto degli iscritti non esiste — `null` per
            contratto — ma la tabella sì: si toglie la riga, non la pagina. */}
        {snapshot !== null && (
          <p className="text-sm text-muted-foreground mt-1 tabular-nums">
            {interpolate(t.hr.employees.subtitle, {
              enrolled: formatNumber(snapshot.enrolledEmployees),
              total: formatNumber(company.employeeCount),
            })}
          </p>
        )}
      </div>

      {/*
        * IL CODICE DI ATTIVAZIONE STA QUI PERCHÉ È L'HR CHE LO CONSEGNA
        * (founder, 09.09.2026).
        *
        * Fino ad allora non si vedeva da nessuna parte: `/activate` lo chiede e
        * il dataset lo dichiara (CLAUDE.md §8), ma nessuna schermata lo mostrava
        * a chi deve distribuirlo — nemmeno a chi presenta. Non sta nel
        * back-office, dove nascerà con l'onboarding dell'azienda
        * (`docs/CONTRATTO-DATI.md` §8.3), che non esiste.
        *
        * `select-all` e non un pulsante "Copia": il gesto che serve è
        * selezionarlo per dettarlo o incollarlo, e un comando che promette di
        * aver copiato qualcosa va verificato dove non tutti i browser lo
        * concedono.
        */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold">
          {t.hr.employees.activationCode.title}
        </h2>
        <p className="font-display text-2xl font-bold tabular-nums mt-2 select-all">
          {company.activationCode}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {t.hr.employees.activationCode.hint}
        </p>
        {/* La riga che il 09.09.2026 non poteva esserci: allora l'HR vedeva
            ancora chi si era iscritto, riga per riga, e la frase sarebbe stata
            falsa proprio sulla schermata che la porta. */}
        <p className="text-sm text-muted-foreground mt-1">
          {t.hr.employees.activationCode.privacy}
        </p>
      </Card>

      <PrivacyBanner icon={Lock} message={t.hr.employees.privacyNote} />

      <Card>
        {enrollment.length === 0 ? (
          <EmptyNotice text={t.hr.employees.empty} />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead {...sortProps('department')}>
                {t.hr.employees.columnDepartment}
              </SortableHead>
              <SortableHead {...sortProps('headcount')}>
                {t.hr.employees.columnHeadcount}
              </SortableHead>
              <SortableHead {...sortProps('enrolled')}>
                {t.hr.employees.columnEnrolled}
              </SortableHead>
              <SortableHead {...sortProps('checkup')}>
                {t.hr.employees.columnCheckup}
              </SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.departmentId}>
                <TableCell className="font-medium">
                  {departmentName(row.departmentId)}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatNumber(row.employeeCount)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {interpolate(t.hr.employees.enrolledValue, {
                    n: formatNumber(row.enrolled),
                    percent: formatPercent(
                      (row.enrolled / row.employeeCount) * 100,
                    ),
                  })}
                </TableCell>
                <TableCell className="text-sm">
                  {/* LA STESSA ETICHETTA DELLA TABELLA DELLO STRESS, e non una
                      seconda: è la stessa soppressione con un denominatore
                      diverso, e due parole per lo stesso fatto sono due parole
                      che possono divergere (§7). */}
                  {row.checkupCompleted === null ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-muted-foreground"
                      title={t.hr.suppressedTooltip}
                    >
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.hr.suppressed}
                    </span>
                  ) : (
                    <span className="tabular-nums">
                      {formatNumber(row.checkupCompleted)}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Card>
    </div>
  );
}
