import { useEffect, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Send, Clock, Shield, AlertTriangle } from "lucide-react";
import { useCompany } from "@/lib/data/queries";
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

const REPLIES = [
  t.employee.doctor.reply.back,
  t.employee.doctor.reply.head,
  t.employee.doctor.reply.stress,
  t.employee.doctor.reply.sleep,
];

function replyTo(question: string): string {
  const asked = question.toLowerCase();
  const match = REPLIES.find((reply) => asked.includes(reply.keyword));
  return match?.text ?? t.employee.doctor.fallback;
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
  const { data: company } = useCompany();
  const [messages, setMessages] = useState<Message[]>([
    { from: "doctor", text: t.employee.doctor.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!company) return null;

  const send = (event: FormEvent) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    setMessages((previous) => [...previous, { from: "patient", text: question }]);
    setDraft("");
    setTyping(true);

    const answer = replyTo(question);
    setTimeout(() => {
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
          <Clock className="w-3 h-3 mr-1" />
          {interpolate(t.employee.doctor.sla, {
            hours: formatNumber(company.plan.virtualDoctorSlaHours),
          })}
        </Badge>
      </div>

      <Card className="flex flex-col h-[calc(100vh-280px)] lg:h-[calc(100vh-220px)]">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" />
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

        <form onSubmit={send} className="p-4 border-t border-border flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t.employee.doctor.placeholder}
            className="flex-1"
          />
          <Button
            type="submit"
            className="bg-secondary hover:bg-secondary/90"
            aria-label={t.employee.doctor.send}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-xs text-foreground">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
        <span>{t.employee.doctor.disclaimer}</span>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 mt-0.5 text-secondary flex-shrink-0" />
        <span>{t.employee.doctor.privacy}</span>
      </div>
    </div>
  );
}
