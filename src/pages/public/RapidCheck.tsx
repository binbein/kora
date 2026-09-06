import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import KoraLogo from "@/components/shared/KoraLogo";
import RapidCheckCard from "@/components/kora/RapidCheckCard";
import { EmptyNotice, ErrorNotice } from "@/components/kora/StateNotice";
import { loadState, useRapidCheckLink } from "@/lib/data/queries";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il link anonimo del check rapido (CLAUDE.md §8, §10.A.5).
 *
 * È la metà del modello di misurazione che rende il dato indipendente
 * dall'adozione: chi non ha attivato l'account risponde comunque, e il reparto
 * lo porta il link. Il §8 lo descriveva, il riquadro "Anche senza account"
 * della privacy HR lo prometteva al cliente e `docs/PITCH.md` ci costruiva
 * sopra una risposta — e non esisteva.
 *
 * NON HA LA BARRA PUBBLICA, E NON È UNA DIMENTICANZA. Chi apre questo
 * indirizzo non sta navigando l'applicazione: ha ricevuto un link, e la
 * schermata deve chiedergli una cosa sola. Una nav con "Piani" e "Prenota una
 * demo" sopra la domanda "come ti senti oggi?" trasformerebbe una misurazione
 * in una pagina di marketing.
 *
 * NON HA NEMMENO UNA GUARDIA, per la stessa ragione: `RequireRole` concede un
 * ruolo entrando in un portale, e qui non si entra in nessun portale.
 */
export default function RapidCheck() {
  /*
   * La rotta è `/check/:token` e non può combaciare con un segmento vuoto: il
   * default esiste perché `useParams` tipizza tutti i parametri come
   * facoltativi, non perché quel caso si presenti.
   */
  const { token = "" } = useParams();
  const linkQuery = useRapidCheckLink(token);
  const page = loadState([linkQuery]);
  const link = linkQuery.data;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <KoraLogo />
        </div>

        {/*
          * I tre casi di M5.b, e il vuoto qui vale doppio: `null` vuol dire
          * token ignoto **oppure** scaduto, che il contratto non distingue di
          * proposito (`docs/CONTRATTO-DATI.md` §3).
          *
          * Gli stati sono quelli del **registro consumer** — `employee.state`,
          * non `common.state` — perché a leggerli è la persona a cui si sta
          * chiedendo come sta, non un cliente davanti a una dashboard (§6.4).
          */}
        {page.state === "error" ? (
          <Card>
            <ErrorNotice copy={t.employee.state.error} onRetry={page.retry} />
          </Card>
        ) : link === undefined ? null : link === null ? (
          <Card>
            <EmptyNotice text={t.public.check.invalid} />
          </Card>
        ) : (
          <>
            <h1 className="text-center text-xl font-bold font-display">
              {interpolate(t.public.check.subject, {
                company: link.companyName,
                department: link.departmentName,
              })}
            </h1>

            <RapidCheckCard token={token} />

            {/* Sotto la card e non sopra: la domanda viene prima di come
                funziona. */}
            <p className="text-center text-xs text-muted-foreground">
              {t.public.check.intro}
            </p>
          </>
        )}

        {/*
          * L'uscita c'è in tutti e quattro i casi, risposta compresa: una
          * pagina senza via d'uscita è il vicolo cieco che il §10.B vieta, e
          * durante il pitch è ciò che eviterebbe il tasto Indietro del browser
          * — che ricarica, e ricaricare azzera la demo (§10).
          */}
        <p className="text-center">
          <Link
            to="/"
            className="rounded-sm text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t.public.check.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
