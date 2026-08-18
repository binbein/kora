import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, FileText, Shield, Building2, Menu, X } from 'lucide-react';
import KoraLogo from '@/components/shared/KoraLogo';
import { formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import { useCompany } from '@/lib/data/queries';

/*
 * La navigazione dell'area HR, condivisa dalle cinque rotte.
 *
 * Il riquadro in fondo leggeva "150 dipendenti" scritto a mano, cioè un organico
 * diverso da quello che la dashboard accanto dichiarava. Ora viene dal provider:
 * è la stessa azienda, quindi è lo stesso numero (§5.5).
 */
export default function HRNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { data: company } = useCompany();

  /* Le etichette si leggono al render, non all'import: vedi `PublicNav`. */
  const navItems = [
    { path: '/hr', icon: LayoutDashboard, label: t.hr.navDashboard },
    { path: '/hr/dipendenti', icon: Users, label: t.hr.navEmployees },
    { path: '/hr/report', icon: FileText, label: t.hr.navReport },
    { path: '/hr/fatturazione', icon: CreditCard, label: t.hr.navBilling },
    { path: '/hr/privacy', icon: Shield, label: t.hr.navPrivacy },
  ];

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          {/* L'uscita dall'area: senza, da qui si torna alla landing solo col
              tasto Indietro, e ogni ancora del portale punta dentro il portale
              — cioè il vicolo cieco del §10, lo stesso che `/admin` aveva. */}
          <Link to="/" className="flex items-center">
            <KoraLogo size="sm" />
          </Link>
          <p className="text-xs text-muted-foreground mt-1">{t.hr.portalName}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        {company && (
          <div className="p-4 border-t border-border">
            {/*
              * LA STESSA DISPOSIZIONE DEL RIQUADRO DIPENDENTE, NON LO STESSO
              * RIQUADRO (§6.5).
              *
              * Icona a sinistra come là, ma **l'icona di un'azienda**: qui non
              * c'è una persona, ci sono un cliente, il suo organico e il suo
              * piano. E **non è un link**, perché `/hr/profilo` non esiste ed è
              * una decisione (§2.6), non una dimenticanza.
              *
              * Da qui la scelta dell'icona: un'icona da profilo su un riquadro
              * che non porta da nessuna parte è l'affordance che mente — lo
              * stesso difetto che le voci del footer hanno costretto a
              * correggere l'08.08.2026, dove l'affordance era nel layout invece
              * che nell'elemento.
              */}
            <div className="flex items-center gap-3 bg-accent rounded-lg p-3">
              <Building2
                className="w-4 h-4 text-accent-foreground flex-shrink-0"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {company.name}
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums truncate">
                  {interpolate(t.hr.navCompanyMeta, {
                    count: formatNumber(company.employeeCount),
                    plan: t.plan[company.plan.id],
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center flex-shrink-0">
            <KoraLogo size="sm" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2"
            aria-label={t.public.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-border px-4 py-3 space-y-1 bg-card">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}>
                <Icon className="w-4 h-4" aria-hidden="true" /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}