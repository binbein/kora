import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, CheckCircle2, ClipboardCheck, Heart, Activity } from 'lucide-react';

const providers = [
  { id: 1, name: 'Centro Medico Lugano', city: 'Lugano', address: 'Via Nassa 15', distance: '2.1 km', slots: ['Lun 9:00', 'Mar 10:30', 'Gio 14:00'] },
  { id: 2, name: 'HealthOS Partner Clinic Bellinzona', city: 'Bellinzona', address: 'Viale Stazione 8', distance: '28 km', slots: ['Mer 8:30', 'Ven 11:00'] },
  { id: 3, name: 'Centro Diagnostico Chiasso', city: 'Chiasso', address: 'Corso San Gottardo 42', distance: '32 km', slots: ['Lun 14:00', 'Gio 9:30', 'Ven 15:00'] },
  { id: 4, name: 'CDS Partner Network', city: 'Locarno', address: 'Via della Posta 3', distance: '45 km', slots: ['Mar 10:00', 'Gio 16:00'] },
];

const mockReport = {
  pressione: { value: '120/80 mmHg', status: 'Nella norma' },
  colesterolo: { value: '215 mg/dL', status: 'Leggermente elevato' },
  ecg: { value: 'Ritmo sinusale', status: 'Nella norma' },
  bmi: { value: '24.1', status: 'Nella norma' },
  stress_risk: { value: 'Moderato', status: 'Medio' },
};

export default function Checkup() {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [booked, setBooked] = useState(false);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Check-up Annuale</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Prenota il tuo check-up fisico incluso nel piano Plus.
        </p>
      </div>

      {/* Report Card */}
      <Card className="p-5 bg-accent/40 border-secondary/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowReport(true)}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-secondary/10 rounded-xl">
            <ClipboardCheck className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Ultimo referto disponibile</p>
            <p className="text-xs text-muted-foreground">Check-up 15 Marzo 2026 — Tocca per visualizzare</p>
          </div>
        </div>
      </Card>

      {/* Providers */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Centri disponibili</h2>
        {providers.map((p) => (
          <Card key={p.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.address}, {p.city}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{p.distance}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.slots.map((slot) => (
                    <Badge key={slot} variant="outline" className="text-xs cursor-pointer hover:bg-secondary/10 hover:border-secondary/50">
                      <Calendar className="w-3 h-3 mr-1" /> {slot}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 self-center" onClick={() => { setSelectedProvider(p); setBooked(false); }}>
                Prenota
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{booked ? 'Check-up prenotato!' : 'Conferma prenotazione'}</DialogTitle>
          </DialogHeader>
          {booked ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 bg-accent rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Check-up prenotato presso {selectedProvider?.name}.
                Riceverai i dettagli via email.
              </p>
              <Badge className="bg-secondary/10 text-secondary">Incluso nel piano Plus</Badge>
              <Button onClick={() => setSelectedProvider(null)} className="w-full bg-secondary hover:bg-secondary/90">Chiudi</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm"><strong>{selectedProvider?.name}</strong></p>
              <p className="text-sm text-muted-foreground">{selectedProvider?.address}, {selectedProvider?.city}</p>
              <p className="text-sm">Prossimo slot: <strong>{selectedProvider?.slots[0]}</strong></p>
              <div className="bg-accent/60 rounded-lg p-3 text-xs">
                <p className="font-medium">Esami inclusi (Piano Plus):</p>
                <p className="text-muted-foreground mt-1">Analisi sangue, ECG, pressione, BMI, visita generale</p>
              </div>
              <Button onClick={() => setBooked(true)} className="w-full bg-secondary hover:bg-secondary/90">Conferma</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Referto Check-up — 15 Marzo 2026</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(mockReport).map(([key, { value, status }]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium capitalize">{key.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
                <Badge variant={status === 'Nella norma' ? 'secondary' : 'outline'} className={status !== 'Nella norma' ? 'border-warning text-warning' : 'bg-secondary/10 text-secondary'}>
                  {status}
                </Badge>
              </div>
            ))}
            <div className="bg-accent/60 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Spiegazione</p>
              <p className="text-muted-foreground leading-relaxed">
                Il tuo colesterolo è leggermente sopra il valore consigliato. Non è un'emergenza, ma ti consigliamo di seguire il piano nutrizionale e ripetere il controllo tra 6 mesi.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}