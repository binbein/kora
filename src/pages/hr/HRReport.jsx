import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import PrivacyBanner from '@/components/shared/PrivacyBanner';

const reportData = {
  period: 'Q2 2026',
  activationRate: 82,
  usageRate: 58,
  checkupCompletion: 68,
  stressTrend: -8,
  virtualDoctor: 94,
  estimatedROI: 14200,
  absenceDaysAvoided: 16,
  recommendations: [
    'Promuovere l\'attivazione nei reparti IT e Marketing (attualmente sotto il 60%)',
    'Organizzare un webinar aziendale sulla gestione dello stress',
    'Incentivare la prenotazione del check-up annuale per i dipendenti rimanenti',
    'Valutare l\'estensione del piano ai familiari',
  ],
};

function StatRow({ label, value, trend, suffix }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{value}{suffix}</span>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs ${trend < 0 ? 'text-secondary' : 'text-destructive'}`}>
            {trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function HRReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Report Salute Aziendale</h1>
          <p className="text-sm text-muted-foreground mt-1">{reportData.period} — Demo SA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" /> Scarica PDF
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-1" /> Pianifica review
          </Button>
        </div>
      </div>

      <PrivacyBanner />

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Metriche chiave
        </h3>
        <StatRow label="Tasso di attivazione" value={reportData.activationRate} suffix="%" />
        <StatRow label="Tasso di utilizzo" value={reportData.usageRate} suffix="%" />
        <StatRow label="Check-up completati" value={reportData.checkupCompletion} suffix="%" />
        <StatRow label="Trend stress" value={reportData.stressTrend} suffix="%" trend={reportData.stressTrend} />
        <StatRow label="Consulti medico virtuale" value={reportData.virtualDoctor} suffix="" />
        <StatRow label="ROI stimato" value={`CHF ${reportData.estimatedROI.toLocaleString()}`} suffix="" />
        <StatRow label="Giorni di assenza evitati" value={reportData.absenceDaysAvoided} suffix="" />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Raccomandazioni</h3>
        <ul className="space-y-3">
          {reportData.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="mt-0.5 flex-shrink-0">{i + 1}</Badge>
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}