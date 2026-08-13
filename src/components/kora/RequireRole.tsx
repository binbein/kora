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
  /*
   * IL RUOLO È LA VARIABILE DELLA MUTATION, NON UNA CHIUSURA, e questa è la
   * riga che tiene in piedi tutto il resto del file.
   *
   * REACT RIUSA QUESTA ISTANZA FRA DUE PORTALI. Le quattro rotte montano lo
   * stesso componente nella stessa posizione dell'albero, quindi passando da
   * `/hr` a `/employee` React non rimonta: aggiorna `role` e **conserva lo
   * stato della mutation**. Con la porta chiamata senza argomenti, quella già
   * usata non era più `idle` e non concedeva mai il secondo ruolo: la
   * schermata restava sull'accesso negato **per sempre**, non per un
   * fotogramma. Misurato sulle sedici rotte di HR, professionista e admin, a
   * 30 ms e a 2000 ms dallo stesso passaggio.
   *
   * Con il ruolo come variabile, `enter.variables` dice **per quale ruolo la
   * porta ha già risposto**, e cambiare portale rende quella risposta vecchia
   * invece di definitiva. È anche il motivo per cui non serve un `key={role}`
   * ai call site: il meccanismo sta qui, in un posto solo.
   */
  const enter = useMutation({
    mutationFn: (wanted: UserRole) => dataProvider.enterAs(wanted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session() });
    },
  });

  /** La porta ha già risposto **per questo ruolo**. */
  const asked = enter.variables === role;

  /*
   * La verità è la risposta della porta quando c'è, la cache altrimenti.
   *
   * Leggere solo la cache costerebbe un fotogramma di accesso negato a ogni
   * concessione riuscita — fra la mutation conclusa e la query invalidata la
   * sessione in cache è ancora quella di prima — e con una `fetch` vera dietro
   * sarebbe un cartello per tutta la durata della richiesta, non un lampo.
   */
  const session = asked && enter.data ? enter.data : sessionQuery.data;
  const granted = session?.role === role;

  /*
   * La porta si apre in un effetto perché è una scrittura, e una scrittura non
   * si fa durante il render.
   *
   * NON CICLA, e le due ragioni sono distinte: a porta libera la concessione
   * riesce e `granted` diventa vero; a sessione fissata dalla manopola
   * `enterAs` non la cambia, ma `enter.variables` diventa comunque questo
   * ruolo, quindi `asked` è vero e la condizione si spegne. È la seconda a
   * rendere raggiungibile la negazione senza farla ciclare.
   */
  useEffect(() => {
    if (session && !granted && !asked) {
      enter.mutate(role);
    }
  }, [session, granted, asked, role, enter]);

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
  if (session === undefined || !asked || enter.isPending) return null;

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
