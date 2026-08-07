import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import { t } from "@/lib/i18n";

/*
 * Le destinazioni della barra pubblica: l'area pubblica (§10.A) e le porte dei
 * tre portali. Durante la demo si naviga da qui, mai dalla barra degli
 * indirizzi (§10).
 *
 * Le larghezze restano tutte derivate dal testo e la spaziatura si stringe
 * sotto `lg`, perché il §2.7 chiede un layout che regga parole tedesche circa
 * un terzo più lunghe — e la barra sta per prendere la voce del calcolatore.
 */
const navItems = [
  { path: "/pricing", label: t.public.nav.pricing },
  { path: "/roi", label: t.public.nav.roi },
  { path: "/demo", label: t.public.nav.demo },
  { path: "/employee", label: t.public.nav.employees },
  { path: "/hr", label: t.public.nav.hr },
  { path: "/professional", label: t.public.nav.professionals },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center flex-shrink-0">
            <KoraLogo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-7">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" asChild>
              <Link to="/employee">{t.public.nav.login}</Link>
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap"
              asChild
            >
              <Link to="/demo">{t.public.nav.bookDemo}</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label={t.public.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="block py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-2"
            asChild
          >
            <Link to="/demo">{t.public.nav.bookDemo}</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
