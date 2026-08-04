import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ClipboardList, Users, CreditCard, User, Menu, X } from 'lucide-react';
import HealthOSLogo from '@/components/shared/HealthOSLogo';

const navItems = [
  { path: '/professional', icon: Calendar, label: 'Calendario' },
  { path: '/professional/sessioni', icon: ClipboardList, label: 'Sessioni' },
  { path: '/professional/pazienti', icon: Users, label: 'Pazienti' },
  { path: '/professional/pagamenti', icon: CreditCard, label: 'Pagamenti' },
  { path: '/professional/profilo', icon: User, label: 'Profilo' },
];

export default function ProNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          <HealthOSLogo size="sm" />
          <p className="text-xs text-muted-foreground mt-1">Portale Professionisti</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-executive/10 text-executive' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                <Icon className="w-4.5 h-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="bg-accent rounded-lg p-3">
            <p className="text-xs font-medium text-foreground">Dr.ssa Laura Bianchi</p>
            <p className="text-[10px] text-muted-foreground">Psicologa FSP · CHF 75/sessione</p>
          </div>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <HealthOSLogo size="sm" />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-border px-4 py-3 space-y-1 bg-card">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path ? 'bg-executive/10 text-executive' : 'text-muted-foreground'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}