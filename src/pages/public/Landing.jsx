import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Brain, Shield, BarChart3,
  Heart, Clock, TrendingDown, AlertTriangle, Puzzle,
  UserCheck, Building2, Briefcase, ArrowRight, CheckCircle2
} from 'lucide-react';
import PublicNav from '@/components/public/PublicNav';
import Footer from '@/components/public/Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function HeroDashboardMockup() {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Health Score</p>
            <p className="text-3xl font-bold font-display text-primary">74<span className="text-lg text-muted-foreground">/100</span></p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center">
            <Heart className="w-6 h-6 text-secondary" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-accent rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Stress</p>
            <p className="text-sm font-semibold text-foreground">Medio</p>
          </div>
          <div className="bg-accent rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Sonno</p>
            <p className="text-sm font-semibold text-foreground">6.2h</p>
          </div>
          <div className="bg-accent rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Energia</p>
            <p className="text-sm font-semibold text-foreground">Buona</p>
          </div>
        </div>
        <div className="bg-secondary/10 rounded-lg p-3 flex items-center gap-3">
          <Brain className="w-5 h-5 text-secondary" />
          <div>
            <p className="text-xs font-medium">Prossima sessione</p>
            <p className="text-[10px] text-muted-foreground">Dr.ssa Bianchi — Domani 10:00</p>
          </div>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-medium">HR Analytics (anonime)</p>
            <p className="text-[10px] text-muted-foreground">Attivazione: 82% • Stress: -8%</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 bg-secondary text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
        <Shield className="w-3 h-3" /> Privacy-first
      </div>
    </div>
  );
}

function ProblemCard({ icon: Icon, title }) {
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow group">
      <div className="p-2.5 bg-destructive/10 rounded-xl w-fit mb-3 group-hover:bg-destructive/15 transition-colors">
        <Icon className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
    </Card>
  );
}

function ValueCard({ icon: Icon, title, description, color }) {
  const bgMap = { primary: 'bg-primary/10', secondary: 'bg-secondary/10', executive: 'bg-executive/10' };
  const textMap = { primary: 'text-primary', secondary: 'text-secondary', executive: 'text-executive' };
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className={`p-3 ${bgMap[color]} rounded-xl w-fit mb-4`}>
        <Icon className={`w-6 h-6 ${textMap[color]}`} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}

function PlanCard({ name, price, target, features, recommended }) {
  return (
    <Card className={`p-6 relative ${recommended ? 'ring-2 ring-secondary shadow-xl' : 'hover:shadow-lg'} transition-all`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-semibold px-4 py-1 rounded-full">
          Piano consigliato
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold font-display">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{target}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold font-display">CHF {price}</span>
        <span className="text-sm text-muted-foreground"> / dipendente / mese</span>
      </div>
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${recommended ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`} asChild>
        <Link to="/demo">Richiedi preventivo</Link>
      </Button>
    </Card>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs font-medium text-secondary">Swiss Privacy-First Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight text-foreground">
                La salute aziendale,{' '}
                <span className="text-secondary">finalmente integrata.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Kora unisce psicologi online, medico virtuale, check-up fisici, prevenzione AI e dashboard HR anonima in un unico abbonamento per dipendente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-base px-8" asChild>
                  <Link to="/pricing">Calcola il costo <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8" asChild>
                  <Link to="/demo">Prenota una demo</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Hosting in Svizzera. Conforme GDPR e LPD.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <HeroDashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Il costo nascosto della salute aziendale
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <ProblemCard icon={AlertTriangle} title="Burnout in aumento" />
            <ProblemCard icon={TrendingDown} title="Assenteismo costoso" />
            <ProblemCard icon={Clock} title="Liste d'attesa per psicologi" />
            <ProblemCard icon={Puzzle} title="Benefit sanitari frammentati" />
            <ProblemCard icon={BarChart3} title="HR senza dati misurabili" />
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Una piattaforma. Tre livelli di valore.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={UserCheck}
              title="Per il dipendente"
              description="Accesso semplice a salute mentale, medico virtuale e prevenzione. Tutto privato, tutto in un unico posto."
              color="secondary"
            />
            <ValueCard
              icon={Building2}
              title="Per l'azienda"
              description="Insight anonimi, ROI misurabile, retention migliorata e riduzione dell'assenteismo."
              color="primary"
            />
            <ValueCard
              icon={Briefcase}
              title="Per i professionisti"
              description="Nuova domanda, meno burocrazia, pagamenti automatici. Collaborazione a mandato senza vincoli."
              color="executive"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-card" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Piani trasparenti, valore concreto
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un abbonamento per dipendente. Nessun costo nascosto. ROI misurabile.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PlanCard name="Essenziale" price="38" target="Aziende 20–100 dipendenti" features={[
              "6 sessioni psicologo / anno",
              "Medico virtuale 3 consulti / anno",
              "Assessment salute iniziale",
              "Dashboard HR base",
              "Co-payment: CHF 35 oltre soglia",
            ]} />
            <PlanCard name="Plus" price="55" target="Aziende 100–300 dipendenti" recommended features={[
              "10 sessioni psicologo / anno",
              "4 sessioni coach / anno",
              "Medico virtuale illimitato",
              "Check-up fisico annuale",
              "Piano prevenzione AI",
              "Dashboard HR per reparto",
              "Co-payment: CHF 28 oltre soglia",
            ]} />
            <PlanCard name="Executive" price="82" target="Aziende 300+ dipendenti" features={[
              "16 sessioni psicologo / anno",
              "Psicologo dedicato",
              "Coach + psichiatra",
              "Medico virtuale entro 1h",
              "Check-up executive completo",
              "4 sessioni nutrizionista",
              "Familiari inclusi",
              "Workshop live per team",
            ]} />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex p-4 bg-accent rounded-2xl">
              <Shield className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              La privacy non è un dettaglio.{' '}
              <span className="text-secondary">È il cuore del prodotto.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              La tua azienda non vede mai dati individuali, sessioni, referti o diagnosi. Solo insight aggregati e anonimizzati. I dati sanitari restano tuoi.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {['Hosting in Svizzera', 'Conforme GDPR', 'Conforme LPD', 'Crittografia end-to-end'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-accent/60 rounded-full px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Porta Kora nella tua azienda.
          </h2>
          <p className="text-lg opacity-80">
            Siamo qui per aiutarti prima che diventi urgente.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-base px-10" asChild>
            <Link to="/demo">Prenota una demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}