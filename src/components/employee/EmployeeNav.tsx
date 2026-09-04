import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Brain,
  Stethoscope,
  ClipboardCheck,
  Sparkles,
  User,
  Menu,
  X,
} from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import { useCompany, useEmployeeProfile } from "@/lib/data/queries";
import { employeeDisplayName } from "@/lib/data/types";
import { interpolate, t } from "@/lib/i18n";

/*
 * Chi è connesso, in fondo alla barra.
 *
 * Legge dal provider come tutto il resto: il codice ereditato scriveva "Giulia
 * Rossi" qui e in cinque schermate, e G.R. nel dataset è un'altra persona —
 * un'iscritta di Finanza che compare nell'elenco HR e fra i pazienti della
 * Dr.ssa Meier. Stesse iniziali devono voler dire la stessa persona.
 */
function Identity({ onNavigate }: { onNavigate?: () => void }) {
  const { data: profile } = useEmployeeProfile();
  const { data: company } = useCompany();

  if (!profile || !company) return null;

  /*
   * IL RIQUADRO È LA PORTA DEL PROFILO (17.08.2026).
   *
   * "Profilo" è uscito dalle voci del menu ed è entrato qui, che è dove chi usa
   * un'app va a cercare le proprie cose. La rotta non cambia: cambia come ci si
   * arriva, quindi il §2.6 è soddisfatto — nessuna schermata nasce e nessuna
   * muore.
   *
   * **Il nome accessibile dice la destinazione, non il contenuto.** Un link il
   * cui testo è "Laura Bernasconi · Demo SA · Plus" annuncia chi sei, non dove
   * porta, e la seconda è l'unica informazione che serve a chi lo incontra
   * tabulando. È la stessa eccezione dichiarata per il pulsante del referto, e
   * vale la stessa condizione: l'etichetta **non contraddice** il testo
   * visibile, lo completa.
   */
  return (
    <Link
      to="/employee/profile"
      onClick={onNavigate}
      aria-label={t.employee.identityAction}
      className="flex items-center gap-3 bg-accent rounded-lg p-3 hover:bg-accent/70 transition-colors"
    >
      <User
        className="w-4 h-4 text-accent-foreground flex-shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground truncate">
          {employeeDisplayName(profile)}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {interpolate(t.employee.identity, {
            company: company.name,
            plan: t.plan[company.plan.id],
          })}
        </p>
      </div>
    </Link>
  );
}

export default function EmployeeNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  /* Le etichette si leggono al render, non all'import: vedi `PublicNav`. */
  const navItems = [
    { path: "/employee", icon: Home, label: t.employee.nav.home },
    {
      path: "/employee/psychologists",
      icon: Brain,
      label: t.employee.nav.psychologists,
    },
    { path: "/employee/doctor", icon: Stethoscope, label: t.employee.nav.doctor },
    {
      path: "/employee/checkup",
      icon: ClipboardCheck,
      label: t.employee.nav.checkup,
    },
    {
      path: "/employee/wellbeing-plan",
      icon: Sparkles,
      label: t.employee.nav.aiPlan,
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          {/* L'uscita dall'area: senza, da qui si torna alla landing solo col
              tasto Indietro, e ogni ancora del portale punta dentro il portale
              — cioè il vicolo cieco del §10, lo stesso che `/admin` aveva. */}
          <Link to="/" className="flex items-center">
            <KoraLogo size="sm" />
          </Link>
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
                    ? "bg-secondary/10 text-secondary-strong"
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
          <Identity />
        </div>
      </aside>

      {/* Mobile header */}
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
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    active ? "bg-secondary/10 text-secondary-strong" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
            {/*
              * Anche qui, e non è una ripetizione: `Identity` sta nella barra
              * laterale, che sotto `lg` non esiste. Senza questa riga
              * `/employee/profile` non sarebbe raggiungibile da nessuna parte
              * su schermo stretto — cioè una rotta senza porta, che è il
              * vicolo cieco del §10 visto dall'altro lato.
              */}
            <div className="pt-2">
              <Identity onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="flex justify-around py-2">
          {/*
            * LA BARRA IN BASSO LE MOSTRA TUTTE, e prima no.
            *
            * Diceva `.slice(0, 5)` su un elenco di sei: la sesta voce —
            * Profilo — su mobile **non compariva affatto**, e la troncatura
            * era silenziosa. Con Profilo passato al riquadro dell'identità le
            * voci sono cinque e la barra è completa, quindi lo `slice` non
            * toglieva più niente: restava solo il modo di far sparire in
            * silenzio la prossima voce che qualcuno aggiunge.
            */}
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
                  active ? "text-secondary-strong" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
