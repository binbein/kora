import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const companies = [
  { name: 'Alpine Finance SA', industry: 'Finance', employees: 150, plan: 'Plus', location: 'Lugano', status: true, revenue: 99000 },
  { name: 'Ticino Pharma Group', industry: 'Pharma', employees: 420, plan: 'Executive', location: 'Mendrisio', status: true, revenue: 413280 },
  { name: 'Studio Legale Bernasconi', industry: 'Legal', employees: 48, plan: 'Essenziale', location: 'Lugano', status: true, revenue: 21888 },
  { name: 'Swisscom Innovation Lab', industry: 'Tech', employees: 210, plan: 'Plus', location: 'Bellinzona', status: true, revenue: 138600 },
  { name: 'Reale Mutua Ticino', industry: 'Insurance', employees: 85, plan: 'Plus', location: 'Locarno', status: false, revenue: 56100 },
];

const planColors = {
  Essenziale: 'bg-muted text-muted-foreground',
  Plus: 'bg-secondary/10 text-secondary',
  Executive: 'bg-executive/10 text-executive',
};

export default function AdminAziende() {
  const active = companies.filter(c => c.status);
  const totalRevenue = companies.reduce((s, c) => s + c.revenue, 0);
  const totalEmployees = companies.reduce((s, c) => s + c.employees, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Aziende</h1>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Aggiungi</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Aziende attive" value={active.length} icon={Building2} />
        <KPICard title="Dipendenti totali" value={totalEmployees.toLocaleString()} icon={Building2} />
        <KPICard title="Revenue annuale" value={`CHF ${(totalRevenue / 1000).toFixed(0)}K`} icon={Building2} variant="secondary" />
        <KPICard title="Piano più comune" value="Plus" icon={Building2} />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Azienda</TableHead>
              <TableHead>Industria</TableHead>
              <TableHead>Dipendenti</TableHead>
              <TableHead>Piano</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead>Revenue/anno</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((c) => (
              <TableRow key={c.name} className="cursor-pointer hover:bg-muted/40">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.industry}</TableCell>
                <TableCell>{c.employees}</TableCell>
                <TableCell><Badge className={planColors[c.plan]}>{c.plan}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{c.location}</TableCell>
                <TableCell className="font-medium">CHF {c.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={c.status ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}>
                    {c.status ? 'Attiva' : 'Inattiva'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}