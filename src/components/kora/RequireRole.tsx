import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import { loadState } from "@/lib/data/queries";
import { queryKeys } from "@/lib/data/query-keys";
import type { UserRole } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { ErrorNotice } from "@/components/kora/StateNotice";

/*
 * La guardia di rotta per ruolo (CLAUDE.md §4, blocco d di M5).
 *
 * IL PORTALE È UNA PORTA, NON UN MURO, ed è la sola cosa da capire di questo
 * file. Entrando in un portale la guardia **concede** il ruolo che quel
 * portale richiede, e solo dopo controlla. Non è un compromesso al ribasso: è
 * ciò che i tre momenti che una guardia non può rompere richiedono, e sono tre
 * requisiti scritti, non tre eccezioni.
 *
 *   - il giro del pitch entra in ogni portale con un clic da `PublicNav`,
 *     quindi nessun ingresso può essere negato;
 *   - `/admin` si apre **come prima schermata della sessione** e ci si rientra
 *     col tasto Indietro (`docs/PITCH.md`), quindi la porta deve concedere
 *     anche a freddo;
 *   - un link profondo dopo un ricaricamento deve servire la pagina — è ciò
 *     che la rewrite di `vercel.json` ha riparato in M1 — quindi `/hr/report`
 *     aperto da zero concede `hr` al montaggio.
 *
 * NE DISCENDE CHE IN DEMO LA GUARDIA NON NEGA MAI, e va detto invece di
 * lasciarlo scoprire: tre porte che devono restare aperte sono tutte le porte
 * che ci sono. **Il ramo che nega è comunque vero e raggiungibile**, con la
 * manopola di sviluppo `?role=` (`lib/data/fault-injection.ts`), che fissa la
 * sessione e impedisce alle porte di riconcederla. È la stessa disciplina del
 * blocco b): uno stato che nessun percorso produce è codice che il §11 non
 * vuole e che nessuno può verificare, quindi il percorso si costruisce.
 *
 * IN PRODUZIONE QUESTO FILE NON CAMBIA. A concedere sarà l'autenticazione
 * invece della porta: `getSession()` risponderà dal server e `enterAs`
 * diventerà il login. Il controllo — ruolo della sessione contro ruolo della
 * rotta — è già quello definitivo (§5.7).
 */

/** Dove torna chi ha sbagliato porta: l'area del ruolo che ha davvero. */
const PORTAL_OF: Record<UserRole, string> = {
  employee: "/employee",
  hr: "/hr",
  professional: "/professional",
  admin: "/admin",
};

export default function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => dataProvider.getSession(),
  });

  /*
   * Concedere è una scrittura, quindi è una mutation (§5.2) — non una `queryFn`
   * che scrive di nascosto. Invalida la sola sessione: un cambio di porta non
   * muove nessun dato, e far rileggere altro sarebbe rileggere mezza
   * applicazione per un ruolo.
   */
  const enter = useMutation({
    mutationFn: () => dataProvider.enterAs(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session() });
    },
  });

  const session = sessionQuery.data;
  const granted = session?.role === role;

  /*
   * La porta si apre in un effetto perché è una scrittura, e una scrittura non
   * si fa durante il render.
   *
   * NON CICLA, e la ragione è la manopola: quando la sessione è fissata
   * `enterAs` non la cambia, quindi `session.role` resta lo stesso e le
   * dipendenze di questo effetto non si muovono. Senza la manopola la prima
   * concessione riesce e `granted` diventa vero.
   */
  useEffect(() => {
    if (session && session.role !== role && enter.isIdle) {
      enter.mutate();
    }
  }, [session, role, enter]);

  const page = loadState([sessionQuery]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  if (granted) return <>{children}</>;

  /*
   * La concessione non è ancora arrivata: un fotogramma, invisibile con il
   * provider in memoria. È la stessa sospensione delle schermate — `null`,
   * niente scheletri (§5.1).
   */
  if (session === undefined || enter.isIdle || enter.isPending) return null;

  /*
   * La porta ha concesso e il ruolo è ancora un altro: la sessione è fissata,
   * cioè siamo dietro la manopola di sviluppo. Questo è il ramo che nega.
   *
   * DUE USCITE, e non è ornamento: un "accesso negato" senza via d'uscita è il
   * vicolo cieco che il §10 vieta. La prima porta all'area del ruolo che si ha
   * davvero, che è la cosa utile; la seconda alla home, che funziona sempre.
   * La resa è minima come gli stati di M5.b — nessun layout d'area attorno,
   * perché questo è uno stato e non una schermata (§2.6).
   */
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-destructive-strong">
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          {t.common.accessDenied.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.common.accessDenied.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {session?.role && (
            <Button asChild>
              <Link to={PORTAL_OF[session.role]}>
                {t.common.accessDenied.toPortal}
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/">{t.common.accessDenied.toHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
