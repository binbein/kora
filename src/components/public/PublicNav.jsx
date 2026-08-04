import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import HealthOSLogo from '@/components/shared/HealthOSLogo';

export default function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <HealthOSLogo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Piani</Link>
            <Link to="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
            <Link to="/employee" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dipendenti</Link>
            <Link to="/hr" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">HR</Link>
            <Link to="/professional" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Professionisti</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/employee">Accedi</Link>
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground" asChild>
              <Link to="/demo">Prenota una demo</Link>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
          <Link to="/pricing" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Piani</Link>
          <Link to="/demo" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Demo</Link>
          <Link to="/employee" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Dipendenti</Link>
          <Link to="/hr" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>HR</Link>
          <Link to="/professional" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Professionisti</Link>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-2" asChild>
            <Link to="/demo">Prenota una demo</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}