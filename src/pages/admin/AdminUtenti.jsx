import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import KPICard from '@/components/shared/KPICard';

const users = [
  { name: 'Marco Bianchi', email: 'm.bianchi@alpinefinance.ch', company: 'Alpine Finance SA', plan: 'Plus', status: 'active', score: 74, joined: 'Gen 2026' },
  { name: 'Sara Conti', email: 's.conti@alpinefinance.ch', company: 'Alpine Finance SA', plan: 'Plus', status: 'active', score: 82, joined: 'Gen 2026' },
  { name: 'Luca Ferrari', email: 'l.ferrari@tpgroup.ch', company: 'Ticino Pharma Group', plan: 'Executive', status: 'active', score: 61, joined: 'Feb 2026' },
  { name: 'Elena Russo', email: 'e.russo@tpgroup.ch', company: 'Ticino Pharma Group', plan: 'Executive', status: 'active', score: 88, joined: 'Feb 2026' },
  { name: 'Giorgio Motta', email: 'g.motta@slb.ch', company: 'Studio Legale Bernasconi', plan: 'Essenziale', status: 'pending', score: null, joined: 'Apr 2026' },
  { name: 'Chiara Verdi', email: 'c.verdi@swisscom.ch', company: 'Swisscom Innovation Lab', plan: 'Plus', status: 'active', score: 79, joined: 'Mar 2026' },
  { name: 'Roberto Neri', email: 'r.neri@swisscom.ch', company: 'Swisscom Innovation Lab', plan: 'Plus', status: 'inactive', score: 55, joined: 'Mar 2026' },
];

const statusColors = {
  active: 'bg-secondary/10 text-secondary',
  pending: 'bg-warning/20 text-foreground',
  inactive: 'bg-muted text-muted-foreground',
};

export default function AdminUtenti() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Utenti</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Totale utenti" value={users.length} icon={Users} />
        <KPICard title="Attivi" value={users.filter(u => u.status === 'active').length} icon={Users} variant="secondary" />
        <KPICard title="In attesa" value={users.filter(u => u.status === 'pending').length} icon={Users} />
        <KPICard title="Score medio" value="73" icon={Users} />
      </div>

      <Card>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cerca per nome o azienda..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Azienda</TableHead>
              <TableHead>Piano</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Iscritto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.email} className="cursor-pointer hover:bg-muted/40">
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{u.company}</TableCell>
                <TableCell><Badge variant="outline">{u.plan}</Badge></TableCell>
                <TableCell>
                  {u.score ? (
                    <span className={`font-bold ${u.score >= 75 ? 'text-secondary' : u.score >= 60 ? 'text-warning' : 'text-destructive'}`}>
                      {u.score}
                    </span>
                  ) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell><Badge className={statusColors[u.status]}>{u.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{u.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}