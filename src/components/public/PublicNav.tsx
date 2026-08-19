import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import LocaleSwitcher from "@/components/public/LocaleSwitcher";
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
export default function PublicNav() {
  const [open, setOpen] = useState(false);

  /*
   * LE ETICHETTE SI LEGGONO AL RENDER, NON ALL'IMPORT (M5.e). Questo array
   * stava a livello di modulo, dove `t` viene valutato una volta sola: con il
   * dizionario che cambia lingua, le sei voci sarebbero rimaste in italiano
   * per sempre — e in silenzio, perché a schermo si vede una nav che
   * funziona.
   *
   * Ricostruirlo a ogni render costa sei oggetti e toglie l'unico modo di
   * sbagliare.
   */
  const navItems = [
    { path: "/plans", label: t.public.nav.pricing },
    { path: "/roi", label: t.public.nav.roi },
    /*
     * "Demo" è uscita, "Admin" è entrata (founder, 17.08.2026), e le due
     * ragioni sono opposte.
     *
     * La voce "Demo" **ripeteva una strada invece di aggiungerne una**: a
     * `/demo` si arriva da sette link, due dei quali in questa stessa barra —
     * il pulsante "Prenota una demo", desktop e mobile.
     *
     * A `/admin` invece **non portava niente**, e costava: l'unico modo di
     * entrarci era digitare l'indirizzo, digitare ricarica, e un ricaricamento
     * azzera il provider, che vive in memoria (§10). È da lì che nasceva la
     * coreografia in quattro passi di `docs/PITCH.md`, che con questa voce non
     * serve più.
     *
     * Il banner "dati dimostrativi" di `/admin` resta, ed è ancora l'unica
     * difesa a schermo (§10.E): la guardia di ruolo concede per costruzione.
     */
    { path: "/employee", label: t.public.nav.employees },
    { path: "/hr", label: t.public.nav.hr },
    { path: "/professional", label: t.public.nav.professionals },
    { path: "/admin", label: t.public.nav.admin },
  ];

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
            <LocaleSwitcher />
            <Button variant="ghost" asChild>
              <Link to="/employee">{t.public.nav.login}</Link>
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
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
            {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
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
          <div className="pt-2">
            <LocaleSwitcher />
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
            asChild
          >
            <Link to="/demo">{t.public.nav.bookDemo}</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
