import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, Briefcase, ClipboardList, MapPin, BarChart3, Menu, X, Info } from 'lucide-react';
import KoraLogo from '@/components/shared/KoraLogo';

const navItems = [
  { path: '/admin', icon: Building2, label: 'Aziende' },
  { path: '/admin/utenti', icon: Users, label: 'Utenti' },
  { path: '/admin/professionisti', icon: Briefcase, label: 'Professionisti' },
  { path: '/admin/sessioni', icon: ClipboardList, label: 'Sessioni' },
  { path: '/admin/provider', icon: MapPin, label: 'Provider Check-up' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          <KoraLogo size="sm" />
          <p className="text-xs text-muted-foreground mt-1">Admin Interno</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                <Icon className="w-4.5 h-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <KoraLogo size="sm" />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-border px-4 py-3 space-y-1 bg-card">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Il back-office non ha una guardia di rotta: ProtectedRoute dipende
              dall'auth di base44 e mandarebbe al login del Builder. Fino a M5 la
              schermata si dichiara per quello che e' (CLAUDE.md §10.E). */}
          <div className="flex items-start gap-3 bg-warning/20 border border-warning/40 rounded-lg px-4 py-3">
            <Info className="w-5 h-5 flex-shrink-0 text-foreground/70" />
            <p className="text-sm text-foreground">
              Back-office interno · dati dimostrativi. Aziende, persone e strutture di
              questa sezione sono di fantasia e non descrivono clienti reali.
            </p>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}