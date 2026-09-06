import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Angry, CheckCircle2, Frown, Laugh, Meh, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { dataProvider } from "@/lib/data";
import { loadState, useRapidCheckAnswer } from "@/lib/data/queries";
import { queryKeys } from "@/lib/data/query-keys";
import type { RapidCheckAnswer } from "@/lib/data/types";
import { interpolate, t } from "@/lib/i18n";
import { ErrorNotice } from "@/components/kora/StateNotice";

/*
 * Il check rapido nella home (CLAUDE.md §8, §10.B).
 *
 * È il segnale su cui poggia ogni dato di stress della dashboard HR, e finora
 * la demo non lo mostrava da nessuna parte: a un investitore che chiedeva da
 * dove arrivano quei numeri non c'era niente da indicare.
 *
 * Il tocco è una mutation vera, e la risposta si **rilegge** dal provider invece
 * di restare in uno stato locale (§5.2): è la stessa meccanica della nota
 * privata del professionista, sulla scrittura più piccola del dominio.
 *
 * CINQUE VOLTI, DA CHIOSCO. Sono le icone di lucide e **non emoji**: il §7 le
 * vieta senza eccezioni, e la decisione del 07.08.2026 sul 👋 della home dice
 * perché — un'emoji che sostituisce il calore rende infantile un registro che
 * deve restare caldo. Un'icona vettoriale eredita anche il colore del testo e
 * la dimensione, cosa che un carattere emoji non fa.
 */

type Face = {
  value: RapidCheckAnswer["value"];
  icon: LucideIcon;
};

/** Dal migliore al peggiore, come le etichette 1–5 di `it.ts`. */
const FACES: Face[] = [
  { value: 1, icon: Laugh },
  { value: 2, icon: Smile },
  { value: 3, icon: Meh },
  { value: 4, icon: Frown },
  { value: 5, icon: Angry },
];

/*
 * I VOLTI SONO TUTTI NEUTRI, e il colore sta sulla scelta.
 *
 * Una scala colorata dal verde al rosso userebbe `destructive`, che il §6.1
 * riserva agli alert e agli stati critici — è il suo essere raro a farlo
 * notare. E dipingerebbe di rosso una risposta sincera sul proprio stato
 * d'animo, il che in un registro consumer (§7) giudica invece di accogliere.
 *
 * La coppia `accent` dà 10.7:1 sul testo, quindi la selezione si vede senza
 * toccare il debito AA aperto sul verde pieno.
 */
const FACE_BASE =
  "flex flex-1 min-w-[4.5rem] flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-colors";
const FACE_IDLE =
  "border-border bg-card text-muted-foreground hover:border-secondary/40 hover:bg-accent/50 hover:text-accent-foreground";

/*
 * A risposta data, il segnale è **l'anello**, non il fondo.
 *
 * Il primo tentativo dava `bg-accent` alla scelta, e a schermo non si vedeva:
 * la card risposta è già `bg-accent/40`, quindi il volto acceso e i quattro
 * spenti finivano sulla stessa tinta. L'anello teal su un chip bianco si
 * stacca dal fondo menta, e il testo resta scuro — `text-secondary` su bianco
 * darebbe 2.9:1, sotto l'AA per un'etichetta da 11px (§6.1).
 */
const FACE_CHOSEN =
  "border-secondary bg-card text-foreground ring-2 ring-secondary shadow-sm";

/*
 * I NON SCELTI RESTANO PREMIBILI, e l'hover è ciò che lo dice.
 *
 * A riposo sono spenti, perché il segno della risposta è la scelta e non il
 * resto della riga; ma un bersaglio che si può premere deve reagire, o si
 * legge come disabilitato. L'hover è quello di `FACE_IDLE` — la coppia
 * `accent` del §6.1 — quindi passandoci sopra il volto torna leggibile senza
 * togliere l'anello alla scelta corrente.
 */
const FACE_MUTED =
  "border-transparent bg-transparent text-muted-foreground/40 hover:border-secondary/40 hover:bg-accent/50 hover:text-accent-foreground";

/*
 * I NUMERI D'EMERGENZA DELLA DEMO, SVIZZERA (CLAUDE.md §8): 144 il soccorso
 * sanitario, 143 il Telefono Amico.
 *
 * Stanno qui e non nelle stringhe perché **lo stesso valore alimenta il testo e
 * il link `tel:`** (§5.5): scritti due volte potrebbero divergere, e qui
 * divergere vuol dire comporre una chiamata sbagliata.
 *
 * Non vengono dal provider, e non è una dimenticanza: in produzione dipendono
 * dal **paese della persona** — 144 in Svizzera, 112 in Italia — e il profilo
 * del dipendente un paese non ce l'ha. Il modulo paese è lavoro dell'MVP
 * (`docs/CONTRATTO-DATI.md` §8.1); un campo che il dataset non sa riempire non
 * si aggiunge al contratto per anticiparlo (§11).
 */
const EMERGENCY_NUMBER = "144";
const HELPLINE_NUMBER = "143";

/* Testo leggibile e link riconoscibile: `foreground` dà 13.53:1 sulla card,
   mentre `secondary` come testo starebbe a 2.83:1 (§6.1). */
const CRISIS_LINK =
  "inline-block rounded-sm text-sm text-foreground underline underline-offset-4 hover:text-secondary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/*
 * IL TOKEN CAMBIA TRE COSE, E SONO TUTTE LA STESSA (§10.A.5).
 *
 * Con il token la card sta sulla pagina del link anonimo, dove **non c'è un
 * account**: da lì la risposta di chi ha l'account non è né la sua né una
 * risposta a una domanda che qualcuno abbia fatto. Quindi la lettura si spegne,
 * l'esito arriva dalla mutation — l'unico posto in cui esiste — e non si
 * invalida niente.
 *
 * È una prop e non un secondo componente perché a cambiare è **da dove viene il
 * reparto**, non cosa la card mostra: i cinque volti, la correzione e il blocco
 * dei numeri d'emergenza sono gli stessi, e duplicarli vorrebbe dire due card
 * che possono divergere sulla parte che conta di più.
 */
export default function RapidCheckCard({ token }: { token?: string }) {
  const queryClient = useQueryClient();
  const anonymous = token !== undefined;
  const answerQuery = useRapidCheckAnswer(!anonymous);

  const submit = useMutation({
    mutationFn: (value: RapidCheckAnswer["value"]) =>
      dataProvider.submitRapidCheck(
        value,
        token === undefined ? undefined : { token },
      ),
    /*
     * Invalida la sola risposta e non la radice del dipendente: il check rapido
     * non muove i contatori né gli appuntamenti, e invalidare più del necessario
     * farebbe rileggere mezza schermata per un tocco.
     *
     * **Dal link anonimo non invalida niente**: quella chiave è la risposta di
     * chi ha l'account, e farla rileggere restituirebbe ciò che c'era prima —
     * una lettura in più per confermare che niente è cambiato.
     */
    onSuccess: () => {
      if (anonymous) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.employee.rapidCheck(),
      });
    },
  });

  /*
   * LA LETTURA HA IL SUO STATO, E FINO AL 16.08.2026 NON CE L'AVEVA.
   *
   * `isError` veniva scartato e `undefined` faceva `return null`, quindi una
   * lettura fallita **faceva sparire la card dalla home** senza che niente lo
   * dicesse — e questa è la card su cui poggia la risposta a "da dove vengono i
   * numeri di stress?" (`docs/PITCH.md`). L'`ErrorNotice` più in basso copre
   * un'altra cosa: il tocco che non si salva.
   */
  const read = loadState([answerQuery]);

  const answer = anonymous ? (submit.data ?? null) : answerQuery.data;

  /*
   * L'errore resta **dentro la card**, e non al posto della home: il check
   * rapido è un blocco della schermata, e sostituire l'area intera per una
   * lettura che riguarda cinque volti toglierebbe di mezzo gli appuntamenti e i
   * contatori, che sono arrivati benissimo (M5.b).
   */
  if (!anonymous && read.state === "error") {
    return (
      <Card className="p-5">
        <ErrorNotice copy={t.employee.state.error} onRetry={read.retry} />
      </Card>
    );
  }
  if (answer === undefined) return null;

  const answered = answer !== null;

  return (
    <Card className={`p-5 ${answered ? "bg-accent/40 border-secondary/20" : ""}`}>
      <div className="flex items-start gap-3">
        {answered ? (
          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
        ) : null}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" id="rapid-check-question">
            {answered
              ? t.employee.rapidCheck.done
              : t.employee.rapidCheck.question}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {answered
              ? t.employee.rapidCheck.doneHint
              : t.employee.rapidCheck.hint}
          </p>
        </div>
      </div>

      {/*
        * Dopo la risposta i cinque volti restano, con la scelta accesa: è il
        * "già risposto oggi" detto mostrando *cosa* si è risposto, invece di un
        * badge che lo racconta a parole. La riga non cambia forma fra i due
        * stati, quindi la card non salta sotto le dita al tocco.
        */}
      <div
        className="flex gap-2 mt-4"
        role="group"
        aria-labelledby="rapid-check-question"
      >
        {FACES.map(({ value, icon: Icon }) => {
          const chosen = answer?.value === value;
          const tone = answered
            ? chosen
              ? FACE_CHOSEN
              : FACE_MUTED
            : FACE_IDLE;

          return (
            <button
              key={value}
              type="button"
              onClick={() => submit.mutate(value)}
              /*
               * SI PUÒ CORREGGERE FINCHÉ È OGGI, e non c'è nessuna conferma.
               *
               * I cinque bersagli sono larghi e affiancati, quindi il tocco
               * sbagliato è un caso normale e non un incidente. Le due strade
               * erano interporre un dialogo o rendere il gesto reversibile:
               * un dialogo raddoppierebbe **una domanda, un tocco** (§8) sulla
               * scrittura più piccola del dominio, e nel pitch trasformerebbe
               * in una procedura la card che risponde a "da dove vengono i
               * numeri di stress?".
               *
               * Da qui `answered` non disabilita più niente: resta solo
               * l'attesa della scrittura in corso. Chi rimette `answered ||`
               * qui davanti riapre il difetto, non ne chiude uno — il
               * provider riscrive la risposta senza guardare cosa c'era.
               */
              disabled={submit.isPending}
              /*
               * L'etichetta è visibile e **non c'è un `aria-label` sopra**: il
               * testo dentro il pulsante è già il suo nome accessibile, e un
               * `aria-label` lo sostituirebbe: chi legge lo schermo sentirebbe
               * una parola e chi lo vede ne leggerebbe un'altra, che è un
               * difetto di accessibilità, non una cortesia in più. L'icona è
               * decorativa e viene nascosta.
               */
              className={`${FACE_BASE} ${tone} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default`}
            >
              <Icon className="w-7 h-7" aria-hidden="true" />
              <span className="text-[11px] font-medium leading-tight text-center">
                {t.employee.rapidCheck.option[value]}
              </span>
            </button>
          );
        })}
      </div>

      {/*
        * IL NUMERO STA DOVE QUALCUNO DICHIARA DI STARE MALISSIMO.
        *
        * Compare **solo** sulla risposta peggiore, e sparisce se la risposta
        * cambia: non c'è nessuno stato nuovo, si legge dal valore registrato —
        * che è anche il motivo per cui sopravvive a un cambio di schermata e
        * non a una risposta diversa.
        *
        * STA SOTTO I VOLTI E NON SOTTO "Grazie, registrato", ed è una scelta:
        * inserito fra l'intestazione e la riga dei volti sposterebbe i cinque
        * bersagli **sotto il dito** nel momento del tocco, che è precisamente
        * ciò che il commento della riga dei volti esiste per evitare. Qui la
        * card cresce verso il basso e la scelta resta dov'era.
        *
        * NON È UN ALLARME, e la riga in fondo lo dice invece di lasciarlo
        * intendere: il prodotto non avvisa nessuno al posto di chi risponde.
        * La presa in carico e il consenso al contatto sono il vuoto del
        * `docs/CONTRATTO-DATI.md` §8.1, e questo blocco non lo chiude — mette
        * un numero dove non ce n'era nessuno.
        */}
      {answer?.value === 5 && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">
            {t.employee.rapidCheck.crisis.title}
          </p>

          <ul className="mt-2 space-y-1.5">
            <li>
              <a href={`tel:${EMERGENCY_NUMBER}`} className={CRISIS_LINK}>
                {interpolate(t.employee.rapidCheck.crisis.emergency, {
                  number: EMERGENCY_NUMBER,
                })}
              </a>
            </li>
            <li>
              <a href={`tel:${HELPLINE_NUMBER}`} className={CRISIS_LINK}>
                {interpolate(t.employee.rapidCheck.crisis.helpline, {
                  number: HELPLINE_NUMBER,
                })}
              </a>
            </li>
          </ul>

          {/*
            * DAL LINK ANONIMO NON SI PRENOTA, ED È UNA SCELTA (§10.A.5).
            *
            * La CTA porta nel portale dipendente, e chi risponde da un link un
            * account non ce l'ha: in produzione sarebbe una porta chiusa, e la
            * demo non disegna una strada che il prodotto non ha. Al suo posto
            * una riga che nomina l'account **senza linkarlo** — l'attivazione è
            * lavoro dell'MVP (`docs/CONTRATTO-DATI.md` §8.3), e quel giorno la
            * riga guadagna il suo link.
            *
            * I due numeri restano su tutte e due le strade: sono il punto del
            * §8, e qui vale doppio perché di interlocutori non ce n'è nessuno.
            */}
          {anonymous ? (
            /*
              * LA RIGA HA GUADAGNATO IL SUO LINK (06.09.2026), ed era la cosa
              * che il 05.09 le aveva lasciato in sospeso: nominava l'account
              * senza poterci portare, perché l'attivazione non esisteva. Adesso
              * esiste (§10.A.6), quindi la frase non è più un vicolo cieco.
              *
              * **Resta un link e non un pulsante**: prenotare è ciò che chi ha
              * l'account fa da dentro, e qui l'invito è ad averlo — il gesto
              * primario di questa card resta rispondere.
              */
            <p className="text-sm text-muted-foreground mt-3">
              <Link to="/activate" className={CRISIS_LINK}>
                {t.public.check.withAccount}
              </Link>
            </p>
          ) : (
            <Button size="sm" className="mt-3" asChild>
              <Link to="/employee/psychologists">
                {t.employee.rapidCheck.crisis.cta}
              </Link>
            </Button>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            {t.employee.rapidCheck.crisis.note}
          </p>
        </div>
      )}

      {/*
        * Il fallimento della scrittura si dice **dove sta il gesto**, e senza
        * "Riprova": a ritentare è lo stesso volto, che resta toccabile. Un
        * secondo pulsante direbbe la stessa cosa due volte (§11).
        */}
      {submit.isError && <ErrorNotice copy={t.employee.rapidCheck.error} />}
    </Card>
  );
}
