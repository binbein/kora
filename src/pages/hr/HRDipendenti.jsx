import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PrivacyBanner from '@/components/shared/PrivacyBanner';

const employees = [
  { name: 'G. R.', dept: 'Finance', activated: true, checkup: 'Completato' },
  { name: 'M. B.', dept: 'Operations', activated: true, checkup: 'Prenotato' },
  { name: 'E. K.', dept: 'Legal', activated: true, checkup: 'Disponibile' },
  { name: 'L. B.', dept: 'Finance', activated: false, checkup: '—' },
  { name: 'S. C.', dept: 'HR', activated: true, checkup: 'Completato' },
  { name: 'F. M.', dept: 'IT', activated: true, checkup: 'Prenotato' },
  { name: 'A. T.', dept: 'Operations', activated: true, checkup: 'Disponibile' },
  { name: 'P. V.', dept: 'Marketing', activated: false, checkup: '—' },
];

export default function HRDipendenti() {
  const activated = employees.filter(e => e.activated).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dipendenti</h1>
        <p className="text-sm text-muted-foreground mt-1">{activated}/{employees.length} attivati — Solo dati anonimi</p>
      </div>

      <PrivacyBanner message="I nomi sono abbreviati. Kora non mostra mai dati sanitari individuali all'HR." />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dipendente</TableHead>
              <TableHead>Reparto</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Check-up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((e, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                <TableCell>
                  <Badge variant={e.activated ? 'default' : 'outline'} className={e.activated ? 'bg-secondary/10 text-secondary' : ''}>
                    {e.activated ? 'Attivo' : 'In attesa'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{e.checkup}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}