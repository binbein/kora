import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/lib/data';
import { queryKeys } from '@/lib/data/query-keys';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Globe, Star, CheckCircle2, Video } from 'lucide-react';

const professionals = [
  {
    id: 1, name: 'Dr.ssa Laura Bianchi', title: 'Psicologa FSP',
    specializations: ['Stress', 'Ansia', 'Burnout'],
    languages: ['Italiano', 'Deutsch'],
    availability: 'Disponibile domani',
    rating: 4.9, sessions: 340,
    avatar: 'LB',
  },
  {
    id: 2, name: 'Dr. Marco Keller', title: 'Psicologo clinico',
    specializations: ['Performance', 'Lavoro', 'Relazioni'],
    languages: ['Italiano', 'English'],
    availability: 'Disponibile venerdì',
    rating: 4.8, sessions: 210,
    avatar: 'MK',
  },
  {
    id: 3, name: 'Dr.ssa Sofia Bernasconi', title: 'Psicoterapeuta',
    specializations: ['Sonno', 'Equilibrio', 'Stress'],
    languages: ['Italiano', 'Français'],
    availability: 'Disponibile oggi',
    rating: 4.9, sessions: 285,
    avatar: 'SB',
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function Psicologi() {
  const [selectedPro, setSelectedPro] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [booked, setBooked] = useState(false);

  const openBooking = (pro) => {
    setSelectedPro(pro);
    setBookingStep(1);
    setBooked(false);
    setSelectedTime('');
    setSelectedDate('');
  };

  const confirmBooking = () => {
    setBooked(true);
    setBookingStep(3);
  };

  // I giorni proponibili partono dal giorno della demo, non dall'orologio vero
  // (CLAUDE.md §5.4). La schermata resta di M3: qui si sposta solo la sorgente
  // della data, che e' cio' che la regola di lint impone da subito.
  const { data: referenceDate } = useQuery({
    queryKey: queryKeys.referenceDate(),
    queryFn: () => dataProvider.getReferenceDate(),
  });

  const dates = [];
  if (referenceDate) {
    for (let i = 1; i <= 5; i++) {
      const day = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        referenceDate.getDate() + i,
      );
      // non `toISOString`: converte in UTC e in Svizzera riporta indietro di un
      // giorno, facendo comparire oggi fra le date prenotabili da domani
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const date = String(day.getDate()).padStart(2, '0');
      dates.push(`${day.getFullYear()}-${month}-${date}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Psicologi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Parla con un professionista entro 24 ore. 3/10 sessioni usate.
        </p>
      </div>

      <div className="space-y-4">
        {professionals.map((pro) => (
          <Card key={pro.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-lg font-bold text-secondary">
                  {pro.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{pro.name}</h3>
                    <p className="text-sm text-muted-foreground">{pro.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span className="font-medium">{pro.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {pro.specializations.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {pro.languages.join(', ')}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pro.availability}</span>
                  <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {pro.sessions} sessioni</span>
                </div>
              </div>
              <div className="flex-shrink-0 self-center">
                <Button className="bg-secondary hover:bg-secondary/90" onClick={() => openBooking(pro)}>
                  Prenota
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedPro} onOpenChange={() => setSelectedPro(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {booked ? 'Prenotazione confermata!' : `Prenota con ${selectedPro?.name}`}
            </DialogTitle>
          </DialogHeader>

          {booked ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 bg-accent rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </div>
              <div>
                <p className="font-semibold">Sessione prenotata</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedDate} alle {selectedTime}</p>
                <p className="text-sm text-muted-foreground">con {selectedPro?.name}</p>
              </div>
              <Badge className="bg-secondary/10 text-secondary">Inclusa nel piano — nessun costo</Badge>
              <p className="text-xs text-muted-foreground">Riceverai il link per la sessione video via email.</p>
              <Button onClick={() => setSelectedPro(null)} className="bg-secondary hover:bg-secondary/90">Chiudi</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Scegli una data</p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedDate === d ? 'bg-secondary text-white border-secondary' : 'bg-card border-border hover:border-secondary/50'
                      }`}
                    >
                      {new Date(d).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <p className="text-sm font-medium mb-2">Scegli un orario</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          selectedTime === t ? 'bg-secondary text-white border-secondary' : 'bg-card border-border hover:border-secondary/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div className="bg-accent/60 rounded-lg p-3 text-sm">
                  <p className="font-medium">Riepilogo</p>
                  <p className="text-muted-foreground">{selectedPro?.name} — {selectedDate} alle {selectedTime}</p>
                  <p className="text-secondary font-medium mt-1">✓ Sessione inclusa nel piano</p>
                </div>
              )}

              <Button
                className="w-full bg-secondary hover:bg-secondary/90"
                disabled={!selectedDate || !selectedTime}
                onClick={confirmBooking}
              >
                Conferma prenotazione
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}