import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { it } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Reparto sotto la soglia di anonimato: al posto del numero c'è un trattino
 * e un tooltip che spiega perché (§6, Direzione).
 *
 * Non è un dato nascosto in UI: `StressRecord` con `suppressed: true` non
 * porta proprio nessun punteggio, quindi non c'è niente da far trapelare.
 *
 * Il tooltip non ripete più la soglia: ogni riga mostra ormai le risposte del
 * reparto e la nota sotto il grafico dichiara il minimo, quindi al passaggio
 * del mouse resta solo la ragione, che a schermo non c'è.
 */
export function MaskedValue({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "inline-flex cursor-help items-center gap-1 text-gray-500",
          className,
        )}
      >
        <span aria-hidden="true">{it.common.notAvailable}</span>
        <Lock className="size-3.5" aria-hidden="true" />
        <span className="sr-only">{it.hr.suppressedShort}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        {it.hr.suppressedTooltip}
      </TooltipContent>
    </Tooltip>
  );
}
