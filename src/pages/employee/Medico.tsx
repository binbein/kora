import { useEffect, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Send, Clock, Shield, AlertTriangle } from "lucide-react";
import { loadState, useCompany } from "@/lib/data/queries";
import { ErrorNotice } from "@/components/kora/StateNotice";
import { formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il medico virtuale (CLAUDE.md §10.B).
 *
 * Il servizio non ha un nome: quello ereditato, "Dr. Andrea Fontana", prendeva
 * il cognome del coach del §8 e ci attaccava un nome proprio inventato, che il
 * §8 vieta. Qui parla il servizio, e parla dando del **lei** dall'inizio alla
 * fine — l'unico punto dell'area dipendente in cui il tu non vale, perché un
 * professionista parla come parlerebbe lui (§7).
 *
 * La conversazione è **il secondo dei due consulti del §8**, quello aperto oggi:
 * per questo scrivere qui non ne apre un terzo, e il conto del Profilo non si
 * muove mentre lo si guarda.
 */

type Message = { from: "doctor" | "patient"; text: string };

/*
 * L'ARCO: quattro scambi, e finisce con un consiglio (17.08.2026).
 *
 * Prima la chat rispondeva per parola chiave e, quando non la trovava, ripeteva
 * la stessa frase **all'infinito**: chi la prova due volte lo vede, ed è la
 * prima cosa che un investitore fa. Ora c'è un arco — orientamento, e poi si
 * chiude — che è anche il modo di dire a schermo cosa il servizio è: un medico
 * che ascolta e indirizza.
 *
 * IL LIMITE È NORMATIVO PRIMA CHE EDITORIALE. Il medico **consiglia e orienta,
 * non diagnostica e non prescrive**: un software che fa diagnosi o triage può
 * ricadere nella normativa sui dispositivi medici in Svizzera e in UE
 * (*"Dubbi Business per CEO"* §2.2), con certificazioni lunghe e care. Nessuna
 * frase dell'arco nomina un farmaco o afferma una causa, e l'ultima lo dice
 * esplicitamente prima di indirizzare.
 */
const ARC_LENGTH = 4;

/*
 * Le risposte si leggono alla chiamata, non all'import (M5.e): a livello di
 * modulo `t` sarebbe valutato una volta sola, e con il cambio lingua il medico
 * continuerebbe a rispondere in italiano — in una schermata che è a video
 * durante il pitch.
 */
function replyTo(question: string, turn: number): string {
  /*
   * Dal secondo scambio in poi la risposta **non dipende più da cosa si
   * scrive**, ed è una scelta: le tre frasi sono scritte per valere su
   * qualunque disturbo — quanto dura, quali altri sintomi, come orientarsi —
   * quindi un secondo giro di parole chiave darebbe l'illusione di una
   * comprensione che la simulazione non ha.
   */
  if (turn > 0) {
    const arc = [
      t.employee.doctor.arc.duration,
      t.employee.doctor.arc.symptoms,
      t.employee.doctor.arc.guidance,
    ];
    return arc[Math.min(turn, arc.length) - 1];
  }

  const replies = [
    t.employee.doctor.reply.back,
    t.employee.doctor.reply.head,
    t.employee.doctor.reply.stress,
    t.employee.doctor.reply.sleep,
  ];
  const asked = question.toLowerCase();
  const match = replies.find((reply) => mentions(asked, reply.keyword));
  return match?.text ?? t.employee.doctor.fallback;
}

/*
 * La parola chiave si cerca **come parola intera**, non come sottostringa.
 *
 * Il confronto per sottostringa era un difetto già a verbale: in francese `dos`
 * sta dentro `dose`, `dossier` e `adosser`, e in inglese `head` sta dentro
 * `ahead`. Le due lookaround su `\p{L}` chiudono quei casi in tutte e quattro
 * le lingue insieme, e reggono le lettere accentate — che `\b` non regge,
 * perché in JavaScript conosce solo l'ASCII e `tête` gli finisce a metà.
 *
 * **Non chiude tutto, e va detto**: `back` dentro *"come back"* è una parola
 * intera, quindi aggancia ancora. Lì a sbagliare non è il confine, è che la
 * parola è la stessa — e distinguerle vorrebbe dire capire la frase.
 *
 * Le chiavi sono quattro per lingua e le scriviamo noi: se un giorno ne
 * arrivasse una con un carattere speciale di espressione regolare, va
 * protetta qui.
 */
function mentions(text: string, keyword: string): boolean {
  return new RegExp(`(?<!\\p{L})${keyword}(?!\\p{L})`, "u").test(text);
}

/*
 * Il medico non risponde nell'istante in cui si preme invio.
 *
 * Non è il ritardo artificiale che il §5.1 vieta — quello riguarda i dati, e
 * qui non si sta caricando niente: è una persona che scrive. Una risposta
 * istantanea contraddirebbe la riga sopra, che promette un medico entro le ore
 * dichiarate dal piano, e leggerebbe come un automatismo.
 */
const TYPING_MS = 1500;

export default function Medico() {
  const companyQuery = useCompany();
  const [messages, setMessages] = useState<Message[]>([
    { from: "doctor", text: t.employee.doctor.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /*
   * Il timer della risposta del medico, tenuto per poterlo spegnere.
   *
   * Senza il cleanup, uscendo dalla chat prima che la risposta arrivi il
   * `setTimeout` scatta su un componente smontato: React lo segnala e, con una
   * simulazione più lunga, sarebbe una risposta che si scrive da sola dopo che
   * si è cambiata schermata.
   */
  const replyTimer = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(
    () => () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  /* I tre casi (M5.b), registro consumer: qui si dà del tu. */
  const page = loadState([companyQuery]);
  if (page.state === "error") {
    return <ErrorNotice copy={t.employee.state.error} onRetry={page.retry} />;
  }
  const company = companyQuery.data;
  if (company === undefined) return null;

  /*
   * Gli scambi si contano dai messaggi, non da un secondo stato: due numeri
   * che descrivono la stessa cosa devono essere lo stesso numero (§5.5).
   */
  const asked = messages.filter((message) => message.from === "patient").length;
  /*
   * Chiusa **appena parte l'ultima domanda**, non quando arriva l'ultima
   * risposta: fra le due c'è il tempo di scrittura, e una casella ancora viva
   * lì in mezzo accetterebbe una quinta domanda a cui l'arco non risponde.
   */
  const closed = asked >= ARC_LENGTH;

  const send = (event: FormEvent) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || closed) return;

    setMessages((previous) => [...previous, { from: "patient", text: question }]);
    setDraft("");
    setTyping(true);

    const answer = replyTo(question, asked);
    replyTimer.current = window.setTimeout(() => {
      replyTimer.current = null;
      setMessages((previous) => [...previous, { from: "doctor", text: answer }]);
      setTyping(false);
    }, TYPING_MS);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display">
            {t.employee.doctor.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.employee.doctor.subtitle}
          </p>
        </div>
        <Badge className="bg-accent text-accent-foreground hover:bg-accent flex-shrink-0">
          <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
          {interpolate(t.employee.doctor.sla, {
            hours: formatNumber(company.plan.virtualDoctorSlaHours),
          })}
        </Badge>
      </div>

      <Card className="flex flex-col h-[calc(100vh-280px)] lg:h-[calc(100vh-220px)]">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t.employee.doctor.title}</p>
            <p className="text-xs text-muted-foreground">
              {t.employee.doctor.online}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-secondary-strong font-medium">
              {t.employee.doctor.online}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === "patient" ? "justify-end" : "justify-start"
              }`}
            >
              {/* la bolla di chi scrive è menta chiara e non teal pieno: il
                  bianco su `secondary` a 14px è 2.83:1, sotto l'AA (§6.1) */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.from === "patient"
                    ? "bg-accent text-accent-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground">
                {t.employee.doctor.typing}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/*
          * A conversazione finita la casella **si spegne e dice perché**, che è
          * il registro già usato dal pulsante del check-up e da quello della
          * videochiamata: spento, con il motivo nell'etichetta. Un campo che
          * accetta testo e non risponde più sembra rotto, ed è il modo peggiore
          * di dichiarare una simulazione.
          */}
        <form onSubmit={send} className="p-4 border-t border-border flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={
              closed ? t.employee.doctor.closed : t.employee.doctor.placeholder
            }
            disabled={closed}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={closed}
            className="bg-secondary hover:bg-secondary/90"
            aria-label={t.employee.doctor.send}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </Button>
        </form>
      </Card>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-xs text-foreground">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>{t.employee.doctor.disclaimer}</span>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 mt-0.5 text-secondary flex-shrink-0" aria-hidden="true" />
        <span>{t.employee.doctor.privacy}</span>
      </div>
    </div>
  );
}
