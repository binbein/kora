import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
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
 */

const SCALE: RapidCheckAnswer["value"][] = [1, 2, 3, 4, 5];

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

  if (answer !== null) {
    return (
      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold">{t.employee.rapidCheck.done}</p>
            <p className="text-xs text-muted-foreground">
              {t.employee.rapidCheck.doneHint}
            </p>
          </div>
          <Badge variant="outline" className="flex-shrink-0">
            {t.employee.rapidCheck.option[answer.value]}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <p className="text-sm font-semibold">{t.employee.rapidCheck.question}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {t.employee.rapidCheck.hint}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {SCALE.map((value) => (
          <button
            key={value}
            onClick={() => submit.mutate(value)}
            disabled={submit.isPending}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-secondary/50 hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {t.employee.rapidCheck.option[value]}
          </button>
        ))}
      </div>
    </Card>
  );
}
