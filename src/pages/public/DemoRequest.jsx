import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ArrowLeft, Calendar, Shield } from 'lucide-react';
import PublicNav from '@/components/public/PublicNav';
import Footer from '@/components/public/Footer';

export default function DemoRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '', employee_count: '', message: ''
  });

  // TODO M2: mutation del provider (createDemoRequest), invalida la query di /admin.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <div className="pt-32 pb-20 max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="inline-flex p-4 bg-accent rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold font-display">Richiesta inviata!</h1>
          <p className="text-muted-foreground">
            Grazie per l'interesse. Il nostro team ti contatterà entro 24 ore per pianificare la demo.
          </p>
          <Button variant="outline" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Torna alla home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex p-3 bg-secondary/10 rounded-2xl">
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Prenota una demo</h1>
            <p className="text-muted-foreground">
              Scopri come Kora può migliorare il benessere dei tuoi dipendenti.
            </p>
          </div>

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Nome azienda *</Label>
                <Input className="mt-1.5" value={form.company_name} onChange={(e) => setForm({...form, company_name: e.target.value})} required />
              </div>
              <div>
                <Label>Nome e cognome *</Label>
                <Input className="mt-1.5" value={form.contact_name} onChange={(e) => setForm({...form, contact_name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email aziendale *</Label>
                  <Input type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <Label>Telefono</Label>
                  <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Numero dipendenti</Label>
                <Input type="number" className="mt-1.5" value={form.employee_count} onChange={(e) => setForm({...form, employee_count: e.target.value})} />
              </div>
              <div>
                <Label>Messaggio (opzionale)</Label>
                <Textarea className="mt-1.5" rows={3} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/60 rounded-lg p-3">
                <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <span>I tuoi dati saranno trattati in conformità con la LPD svizzera e il GDPR.</span>
              </div>

              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                Prenota la demo
              </Button>
            </form>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}