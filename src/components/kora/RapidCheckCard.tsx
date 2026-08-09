import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Angry, CheckCircle2, Frown, Laugh, Meh, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { dataProvider } from "@/lib/data";
import { useRapidCheckAnswer } from "@/lib/data/queries";
import { queryKeys } from "@/lib/data/query-keys";
import type { RapidCheckAnswer } from "@/lib/data/types";
import { t } from "@/lib/i18n";

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
const FACE_MUTED = "border-transparent bg-transparent text-muted-foreground/40";

export default function RapidCheckCard() {
  const queryClient = useQueryClient();
  const { data: answer } = useRapidCheckAnswer();

  const submit = useMutation({
    mutationFn: (value: RapidCheckAnswer["value"]) =>
      dataProvider.submitRapidCheck(value),
    /*
     * Invalida la sola risposta e non la radice del dipendente: il check rapido
     * non muove i contatori né gli appuntamenti, e invalidare più del necessario
     * farebbe rileggere mezza schermata per un tocco.
     */
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.rapidCheck() }),
  });

  if (answer === undefined) return null;

  const answered = answer !== null;

  return (
    <Card className={`p-5 ${answered ? "bg-accent/40 border-secondary/20" : ""}`}>
      <div className="flex items-start gap-3">
        {answered ? (
          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
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
              disabled={answered || submit.isPending}
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
    </Card>
  );
}
