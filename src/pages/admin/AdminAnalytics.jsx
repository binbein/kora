import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

const monthlyRevenue = [
  { month: 'Nov', revenue: 38000, sessions: 180 },
  { month: 'Dic', revenue: 41000, sessions: 195 },
  { month: 'Gen', revenue: 55000, sessions: 240 },
  { month: 'Feb', revenue: 62000, sessions: 268 },
  { month: 'Mar', revenue: 71000, sessions: 310 },
  { month: 'Apr', revenue: 81000, sessions: 352 },
];

const planMix = [
  { name: 'Essenziale', value: 1, color: '#94a3b8' },
  { name: 'Plus', value: 3, color: '#1BAA9A' },
  { name: 'Executive', value: 1, color: '#5B4E8A' },
];

const sessionsByType = [
  { type: 'Psicologia', count: 198 },
  { type: 'Medico', count: 87 },
  { type: 'Coaching', count: 45 },
  { type: 'Nutrizione', count: 22 },
];

const activationTrend = [
  { month: 'Gen', rate: 68 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 78 },
  { month: 'Apr', rate: 84 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Analytics piattaforma</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Revenue Apr" value="CHF 81K" icon={TrendingUp} variant="secondary" trend={{ percent: 14, goodWhen: 'up', label: 'vs Mar' }} />
        <KPICard title="Sessioni Apr" value="352" icon={Briefcase} trend={{ percent: 13, goodWhen: 'up', label: 'vs Mar' }} />
        <KPICard title="Utenti attivi" value="618" icon={Users} trend={{ percent: 8, goodWhen: 'up', label: 'vs Mar' }} />
        <KPICard title="Activation rate" value="84%" icon={BarChart3} trend={{ percent: 6, goodWhen: 'up', label: 'vs Mar' }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue mensile (CHF)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v/1000}K`} />
                <Tooltip formatter={(v) => `CHF ${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(172, 73%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Sessioni mensili</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="hsl(207, 68%, 21%)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Mix piani aziendali</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={planMix} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {planMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Activation rate %</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={activationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={v => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="hsl(172, 73%, 39%)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Sessioni per tipo (Aprile 2026)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sessionsByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(207, 68%, 21%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}