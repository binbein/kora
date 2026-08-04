import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, CheckCircle2, Brain, Stethoscope, TrendingDown, Calculator, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard from '@/components/shared/KPICard';
import PrivacyBanner from '@/components/shared/PrivacyBanner';

const usageData = [
  { month: 'Gen', psicologi: 22, coach: 8, medico: 12, checkup: 5 },
  { month: 'Feb', psicologi: 28, coach: 10, medico: 15, checkup: 12 },
  { month: 'Mar', psicologi: 35, coach: 14, medico: 18, checkup: 22 },
  { month: 'Apr', psicologi: 32, coach: 12, medico: 16, checkup: 18 },
  { month: 'Mag', psicologi: 38, coach: 15, medico: 14, checkup: 8 },
  { month: 'Giu', psicologi: 25, coach: 11, medico: 19, checkup: 3 },
];

const stressData = [
  { month: 'Gen', stress: 68 },
  { month: 'Feb', stress: 65 },
  { month: 'Mar', stress: 62 },
  { month: 'Apr', stress: 58 },
  { month: 'Mag', stress: 55 },
  { month: 'Giu', stress: 52 },
];

const serviceDistribution = [
  { name: 'Psicologi', value: 180, color: 'hsl(var(--secondary))' },
  { name: 'Coach', value: 70, color: 'hsl(var(--executive))' },
  { name: 'Medico', value: 94, color: 'hsl(var(--primary))' },
  { name: 'Check-up', value: 68, color: 'hsl(var(--warning))' },
];

const roiData = [
  { quarter: 'Q1', roi: 8200 },
  { quarter: 'Q2', roi: 14200 },
  { quarter: 'Q3', roi: 18500 },
  { quarter: 'Q4', roi: 24000 },
];

export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard HR</h1>
          <p className="text-sm text-muted-foreground mt-1">Demo SA — Piano HealthOS Plus</p>
        </div>
      </div>

      <PrivacyBanner />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Dipendenti iscritti" value="124/150" subtitle="Attivazione: 82%" icon={Users} trend={5} trendLabel="questo mese" />
        <KPICard title="Check-up completati" value="68%" icon={CheckCircle2} trend={12} trendLabel="vs mese scorso" />
        <KPICard title="Supporto mentale" value="22%" subtitle="180 sessioni erogate" icon={Brain} />
        <KPICard title="ROI stimato Q2" value="CHF 14.200" icon={Calculator} trend={8} trendLabel="vs Q1" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Stress medio" value="-8%" subtitle="vs mese scorso" icon={TrendingDown} trend={-8} trendLabel="" />
        <KPICard title="Sessioni psicologiche" value="180" icon={Brain} />
        <KPICard title="Medico virtuale" value="94 consulti" icon={Stethoscope} />
        <KPICard title="Assenze evitate" value="16 giorni" icon={Calendar} trend={4} trendLabel="stima" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Utilizzo servizi mensile</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="psicologi" fill="hsl(var(--secondary))" radius={[4,4,0,0]} name="Psicologi" />
              <Bar dataKey="coach" fill="hsl(var(--executive))" radius={[4,4,0,0]} name="Coach" />
              <Bar dataKey="medico" fill="hsl(var(--primary))" radius={[4,4,0,0]} name="Medico" />
              <Bar dataKey="checkup" fill="hsl(var(--warning))" radius={[4,4,0,0]} name="Check-up" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Trend stress aziendale</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[40, 80]} />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--secondary))' }} name="Indice stress" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Distribuzione servizi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={serviceDistribution} innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={4}>
                {serviceDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {serviceDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                {s.name}: {s.value}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">ROI nel tempo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `CHF ${v.toLocaleString()}`} />
              <Bar dataKey="roi" fill="hsl(var(--secondary))" radius={[4,4,0,0]} name="ROI stimato" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}