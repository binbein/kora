"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { it, plural, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";
import { AppBar } from "./app-bar";

/*
 * Medico virtuale (§8.B.4): conversazione pre-scritta che si rivela con
 * l'effetto digitazione.
 *
 * Il ritmo è tarato sulla presentazione, non sul realismo. Un'attesa vera fra
 * un messaggio e l'altro, davanti a una platea, è tempo morto: qui ogni
 * messaggio compare in meno di un secondo, indicatore "sta scrivendo"
 * compreso. E un tocco in qualunque punto rivela tutto il resto in un colpo,
 * per quando le domande arrivano prima della fine.
 */

const EMPLOYEE_DELAY_MS = 280;
const DOCTOR_TYPING_MS = 620;

export function DoctorChat({
  onBack,
  onBook,
}: {
  onBack: () => void;
  onBook: () => void;
}) {
  const messages = it.doctor.messages;

  /*
   * Il tempo di risposta promesso qui sopra viene dal piano dell'azienda, non
   * dalla stringa: è lo stesso numero che la landing mostra nel listino, e
   * due punti che dicono la stessa cosa non devono poter divergere. Un piano
   * che non dichiara il medico non promette nulla, quindi resta senza
   * sottotitolo invece di prometterlo "entro 0 ore".
   */
  const plan = dataProvider.getCompany().plan;
  const slaHours = plan.virtualDoctorSlaHours;
  const [shown, setShown] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const complete = shown >= messages.length;

  /*
   * "Sta scrivendo" non è uno stato da tenere: è vero esattamente quando il
   * prossimo messaggio è del medico e non è ancora comparso. Derivarlo evita
   * di dover sincronizzare due variabili che dicono la stessa cosa.
   */
  const typing = !complete && messages[shown].from === "doctor";

  useEffect(() => {
    if (complete) return;
    const delay = typing ? DOCTOR_TYPING_MS : EMPLOYEE_DELAY_MS;
    const timer = setTimeout(() => setShown((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [shown, complete, typing]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown]);

  const revealAll = () => setShown(messages.length);

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <AppBar
        title={it.doctor.title}
        subtitle={
          slaHours === undefined
            ? undefined
            : t(plural(slaHours, it.doctor.subtitle), {
                hours: formatNumber(slaHours),
                plan: it.domain.planName[plan.id],
              })
        }
        onBack={onBack}
      />

      <p className="flex items-start gap-2 bg-white px-4 py-2.5 text-xs text-gray-500">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {it.doctor.disclaimer}
      </p>

      {/*
       * L'area della conversazione è essa stessa il bersaglio del tocco che
       * salta l'attesa: un pulsante dedicato sarebbe rumore in una schermata
       * che deve sembrare una chat.
       */}
      <button
        type="button"
        onClick={revealAll}
        aria-label={it.doctor.skipHint}
        disabled={complete}
        className="flex-1 space-y-2.5 p-4 text-left disabled:cursor-default"
      >
        {messages.slice(0, shown).map((message, index) => (
          <Bubble key={index} from={message.from} text={message.text} />
        ))}

        {typing ? <TypingIndicator /> : null}

        {!complete ? (
          <p className="pt-1 text-center text-xs text-gray-400">
            {it.doctor.skipHint}
          </p>
        ) : null}
        <div ref={bottomRef} />
      </button>

      {complete ? (
        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
          <Button className="h-11 w-full rounded-pill" onClick={onBook}>
            {it.doctor.bookFromChat}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Bubble({ from, text }: { from: string; text: string }) {
  const isEmployee = from === "employee";
  return (
    <div className={cn("flex", isEmployee ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] px-3.5 py-2.5",
          isEmployee
            ? "rounded-[1.25rem_1.25rem_0.25rem_1.25rem] bg-petrol-700 text-white"
            : "rounded-[1.25rem_1.25rem_1.25rem_0.25rem] border border-gray-200 bg-white text-petrol-900",
        )}
      >
        {text}
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <p
        className="rounded-[1.25rem_1.25rem_1.25rem_0.25rem] border border-gray-200 bg-white px-3.5 py-2.5 text-gray-500"
        aria-live="polite"
      >
        <span className="inline-flex items-center gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
          <span className="sr-only">{it.doctor.typing}</span>
        </span>
      </p>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-bounce rounded-full bg-teal-300"
      style={{ animationDelay: delay, animationDuration: "900ms" }}
      aria-hidden="true"
    />
  );
}
