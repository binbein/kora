import React from 'react';
import { Link } from 'react-router-dom';
import HealthOSLogo from '@/components/shared/HealthOSLogo';
import { Shield, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <HealthOSLogo size="sm" light />
            <p className="text-sm opacity-70 leading-relaxed">
              Il sistema operativo della salute per le aziende svizzere.
            </p>
            <div className="flex items-center gap-2 text-sm opacity-60">
              <MapPin className="w-4 h-4" />
              <span>Lugano, Svizzera</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">Piattaforma</h4>
            <Link to="/pricing" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">Piani e Prezzi</Link>
            <Link to="/employee" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">Portale Dipendenti</Link>
            <Link to="/hr" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">Portale HR</Link>
            <Link to="/professional" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">Per Professionisti</Link>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">Azienda</h4>
            <p className="text-sm opacity-80">Chi siamo</p>
            <p className="text-sm opacity-80">Contatti</p>
            <p className="text-sm opacity-80">Carriere</p>
            <p className="text-sm opacity-80">Blog</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">Privacy e Sicurezza</h4>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 opacity-60" />
              <p className="text-sm opacity-80 leading-relaxed">
                Dati sanitari protetti. Conformità GDPR e LPD. Hosting in Svizzera.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">© 2026 Kora Switzerland SA. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <p className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Privacy Policy</p>
            <p className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Termini di Servizio</p>
            <p className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Cookie Policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
}