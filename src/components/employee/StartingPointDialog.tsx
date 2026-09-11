import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EMERGENCY_NUMBER } from "@/lib/emergency";
import { interpolate, t } from "@/lib/i18n";
import type { Plan } from "@/lib/data/types";
import {
  orientationFor,
  type OrientationAnswers,
  type OrientationBurden,
  type OrientationDuration,
  type OrientationImpact,
  type OrientationService,
} from "@/lib/orientation";

/*
 * «Non sai da dove partire?» (CLAUDE.md §10.B.7).
 *
 * TRE DOMANDE E UNA PORTA, E NIENTE CHE ASSOMIGLI A UNA DIAGNOSI. La regola di
 * scelta sta in `lib/orientation.ts`, con la tabella e con il commento che dice
 * cosa questa cosa non è; qui c'è solo il modo in cui la si chiede.
 *
 * NESSUNA RISPOSTA VIENE SALVATA, e non è una semplificazione della demo: non
 * c'è niente da conservare. Un orientamento vale nel momento in cui lo si
 * chiede, e tenerne traccia vorrebbe dire costruire un profilo di ciò che a una
 * persona pesa — cioè esattamente il dato che il prodotto tiene lontano da tutti
 * (§10.B.6). Lo stato muore con il dialogo, e riaprirlo riparte dalla prima
 * domanda.
 *
 * I PULSANTI E NON UN `radio-group`. Sono gli stessi bersagli dei cinque volti
 * del check rapido: una risposta e si prosegue, senza un conferma che chiederebbe
 * due gesti per una scelta sola. Nessun componente nuovo esce dal magazzino
 * (§3).
 *
 * LE ROTTE D'USCITA SONO QUELLE DEL MENU, non indirizzi nuovi: il coach è la
 * pagina degli psicologi con il suo filtro, come nel contatore della home.
 */

const ROUTES: Record<OrientationService, string> = {
  virtual_doctor: "/employee/doctor",
  psychologist: "/employee/psychologists",
  coach: "/employee/psychologists?service=coach",
  checkup: "/employee/checkup",
};

const BURDENS: OrientationBurden[] = [
  "body",
  "mind",
  "work",
  "postponed_check",
];
const DURATIONS: OrientationDuration[] = ["days", "weeks", "months"];
const IMPACTS: OrientationImpact[] = ["low", "medium", "high"];

/* Un bersaglio pieno riga per riga: la risposta è la scelta, e l'hover dice che
   si può premere. La coppia `accent` dà 10.66:1 sul testo (§6.1). */
const OPTION =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-secondary/40 hover:bg-accent/50 hover:text-accent-foreground";

function Question({
  question,
  options,
  label,
  onPick,
}: {
  question: string;
  options: readonly string[];
  label: (option: string) => string;
  onPick: (option: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{question}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={OPTION}
            onClick={() => onPick(option)}
          >
            {label(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StartingPointDialog({
  open,
  plan,
  onClose,
}: {
  open: boolean;
  /** Il piano dell'azienda: decide se il coach e il check-up esistono (§9). */
  plan: Plan;
  onClose: () => void;
}) {
  const copy = t.employee.startingPoint;
  const [burden, setBurden] = useState<OrientationBurden | null>(null);
  const [duration, setDuration] = useState<OrientationDuration | null>(null);
  const [impact, setImpact] = useState<OrientationImpact | null>(null);

  const restart = () => {
    setBurden(null);
    setDuration(null);
    setImpact(null);
  };

  /* Chiudere azzera: riaprendo si riparte dalla prima domanda, perché non c'è
     nessuna risposta da riprendere. */
  const close = () => {
    restart();
    onClose();
  };

  const answers: OrientationAnswers | null =
    burden !== null && duration !== null && impact !== null
      ? { burden, duration, impact }
      : null;
  const service = answers === null ? null : orientationFor(answers, plan);

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.dialogTitle}</DialogTitle>
        </DialogHeader>

        {burden === null && (
          <Question
            question={copy.burden.question}
            options={BURDENS}
            label={(option) => copy.burden[option as OrientationBurden]}
            onPick={(option) => setBurden(option as OrientationBurden)}
          />
        )}

        {burden !== null && duration === null && (
          <Question
            question={copy.duration.question}
            options={DURATIONS}
            label={(option) => copy.duration[option as OrientationDuration]}
            onPick={(option) => setDuration(option as OrientationDuration)}
          />
        )}

        {burden !== null && duration !== null && impact === null && (
          <Question
            question={copy.impact.question}
            options={IMPACTS}
            label={(option) => copy.impact[option as OrientationImpact]}
            onPick={(option) => setImpact(option as OrientationImpact)}
          />
        )}

        {service !== null && (
          <div className="space-y-4">
            <p className="text-sm font-medium">{copy.outcome[service]}</p>

            {/* L'unico effetto della seconda domanda, e solo su "da mesi". */}
            {duration === "months" && (
              <p className="text-sm text-muted-foreground">
                {copy.longRunning}
              </p>
            )}

            <Button asChild className="w-full">
              <Link to={ROUTES[service]} onClick={close}>
                {copy.action[service]}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full" onClick={restart}>
              {copy.restart}
            </Button>
          </div>
        )}

        {/*
          * STA SOTTO OGNI PASSO, non solo sotto l'esito: chi apre il dialogo
          * legge cosa sta per fare prima di rispondere, non dopo. È la frase che
          * dichiara lo scopo — orientare, non valutare — e senza di lei le tre
          * domande sembrerebbero misurare qualcosa (§7).
          */}
        <p className="text-xs text-muted-foreground border-t border-border pt-4">
          {interpolate(copy.disclaimer, { number: EMERGENCY_NUMBER })}
        </p>
      </DialogContent>
    </Dialog>
  );
}
