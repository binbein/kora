import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  CreditCard,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import { formatCHF } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";
import { professionalDisplayName } from "@/lib/data/types";
import { usePortalProfessional } from "@/lib/data/queries";

function ProfessionalBadge({ onNavigate }: { onNavigate?: () => void }) {
  const { data: professional } = usePortalProfessional();
  /*
   * Qui i tre casi collassano di proposito (M5.b): in attesa, profilo assente,
   * lettura fallita — la cosa giusta è non disegnarlo. La nav deve restare coi
   * suoi link, che sono la via d'uscita: un errore al suo posto toglierebbe la
   * navigazione all'area (§10).
   *
   * **Da quando il riquadro è un link questo ramo toglie anche una porta**, e
   * resta com'è: la voce del menu non c'è più, quindi con il profilo illeggibile
   * `/professional/profilo` è irraggiungibile dalla barra. È il caso in cui la
   * destinazione è **proprio ciò che non si è potuto leggere** — un link verso
   * la schermata di un profilo che non arriva porterebbe a una pagina vuota.
   */
  if (!professional) return null;

  /*
   * IL RIQUADRO È LA PORTA DEL PROFILO (17.08.2026), come nel portale
   * dipendente e per la stessa ragione: "Profilo" è uscito dalle voci del menu
   * ed è entrato qui. La rotta non cambia, cambia come ci si arriva.
   *
   * La disposizione è quella del §6.5 — **icona a sinistra**, nome, dettaglio
   * sotto — e l'icona è una persona perché è una persona quello che il riquadro
   * mostra: dice cosa c'è dentro, non dove porta. Il nome accessibile dice
   * invece la destinazione, che è l'unica cosa che serve a chi ci arriva
   * tabulando.
   */
  return (
    <Link
      to="/professional/profilo"
      onClick={onNavigate}
      aria-label={t.professional.identityAction}
      className="flex items-center gap-3 bg-accent rounded-lg p-3 hover:bg-accent/70 transition-colors"
    >
      <User
        className="w-4 h-4 text-accent-foreground flex-shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground truncate">
          {professionalDisplayName(professional)}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {t.qualification[professional.qualificationKey]} ·{" "}
          {interpolate(t.professional.feePerSession, {
            fee: formatCHF(professional.sessionFee),
          })}
        </p>
      </div>
    </Link>
  );
}

export default function ProNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  /* Le etichette si leggono al render, non all'import: vedi `PublicNav`. */
  const navItems = [
    { path: "/professional", icon: Calendar, label: t.professional.nav.calendar },
    {
      path: "/professional/sessioni",
      icon: ClipboardList,
      label: t.professional.nav.sessions,
    },
    {
      path: "/professional/pazienti",
      icon: Users,
      label: t.professional.nav.patients,
    },
    {
      path: "/professional/pagamenti",
      icon: CreditCard,
      label: t.professional.nav.payments,
    },
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
          <p className="text-xs text-muted-foreground mt-1">
            {t.professional.portalName}
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
                    ? "bg-executive/10 text-executive"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <ProfessionalBadge />
        </div>
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
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path
                    ? "bg-executive/10 text-executive"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                {label}
              </Link>
            ))}
            {/*
              * Anche qui, come in `EmployeeNav` e per la stessa ragione: il
              * riquadro vive nella barra laterale, che sotto `lg` non esiste.
              * Senza questa riga `/professional/profilo` non sarebbe
              * raggiungibile da nessuna parte su schermo stretto — una rotta
              * senza porta, cioè il vicolo cieco del §10.
              */}
            <div className="pt-2">
              <ProfessionalBadge onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
