import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardList,
  Info,
  MapPin,
  Menu,
  Users,
  X,
} from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import { t } from "@/lib/i18n";

/*
 * Il guscio del back-office (CLAUDE.md §10.E).
 *
 * Il banner "dati dimostrativi" è di M0 e **resta**: chiunque abbia il link
 * vede il back-office con l'elenco dei clienti, e finché non c'è una guardia di
 * ruolo — che è M5, e va scritta da zero sui nostri ruoli — il banner è ciò che
 * impedisce di scambiarlo per un ambiente vero.
 */
const navItems = [
  { path: "/admin", icon: Building2, label: t.admin.nav.companies },
  { path: "/admin/utenti", icon: Users, label: t.admin.nav.users },
  {
    path: "/admin/professionisti",
    icon: Briefcase,
    label: t.admin.nav.professionals,
  },
  { path: "/admin/sessioni", icon: ClipboardList, label: t.admin.nav.sessions },
  {
    path: "/admin/provider",
    icon: MapPin,
    label: t.admin.nav.checkupProviders,
  },
  { path: "/admin/analytics", icon: BarChart3, label: t.admin.nav.analytics },
];

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          <KoraLogo size="sm" />
          <p className="text-xs text-muted-foreground mt-1">
            {t.admin.portalName}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-destructive/10 text-destructive"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <KoraLogo size="sm" />
          <button
            onClick={() => setOpen(!open)}
            className="p-2"
            aria-label={t.public.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-border px-4 py-3 space-y-1 bg-card">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path
                    ? "bg-destructive/10 text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-start gap-3 bg-muted border border-border rounded-lg px-4 py-3">
            <Info className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm text-foreground">{t.admin.demoBanner}</p>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
