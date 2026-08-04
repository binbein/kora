import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Plus, CheckCircle2 } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const providers = [
  { name: 'Clinica Moncucco', city: 'Lugano', address: 'Via Moncucco 10', services: 'Check-up Base, Plus, Executive', bookings: 42, status: 'active' },
  { name: 'Medicheck SA', city: 'Bellinzona', address: 'Piazza Governo 3', services: 'Check-up Base, Plus', bookings: 28, status: 'active' },
  { name: 'Centro Medico Locarno', city: 'Locarno', address: 'Via Vallemaggia 5', services: 'Check-up Base', bookings: 15, status: 'active' },
  { name: 'Hirslanden Lugano', city: 'Lugano', address: 'Via Dr. Agostino Nobile 21', services: 'Check-up Executive', bookings: 9, status: 'active' },
  { name: 'Ospedale Mendrisio', city: 'Mendrisio', address: 'Via Turconi 23', services: 'Check-up Base, Plus', bookings: 0, status: 'pending' },
];

export default function AdminProvider() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Provider Check-up</h1>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Aggiungi provider</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Provider attivi" value={providers.filter(p => p.status === 'active').length} icon={MapPin} />
        <KPICard title="Città coperte" value={[...new Set(providers.map(p => p.city))].length} icon={MapPin} />
        <KPICard title="Prenotazioni totali" value={providers.reduce((s, p) => s + p.bookings, 0)} icon={CheckCircle2} variant="secondary" />
        <KPICard title="In integrazione" value={providers.filter(p => p.status === 'pending').length} icon={MapPin} />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Città</TableHead>
              <TableHead>Indirizzo</TableHead>
              <TableHead>Servizi</TableHead>
              <TableHead>Prenotazioni</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((p) => (
              <TableRow key={p.name} className="hover:bg-muted/40 cursor-pointer">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.city}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.address}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.services}</TableCell>
                <TableCell className="font-medium">{p.bookings}</TableCell>
                <TableCell>
                  <Badge className={p.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-warning/20 text-foreground'}>
                    {p.status === 'active' ? 'Attivo' : 'In integrazione'}
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