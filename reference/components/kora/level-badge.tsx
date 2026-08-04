import { cn } from "@/lib/utils";
import { it } from "@/lib/i18n/it";
import type { StressLevel } from "@/lib/data/types";
import type { Register } from "./register";

/*
 * Fascia di stress come etichetta. `alto` è l'unico stato in danger: warn e
 * danger si notano perché sono rari (§4.1).
 *
 * Il testo non poggia mai su teal-500 (§4.1): le tinte di fondo qui sono
 * teal-50 e danger-bg, entrambe ampiamente sopra AA col loro tono scuro.
 */

const LEVEL_STYLES: Record<StressLevel, string> = {
  low: "bg-teal-50 text-petrol-800",
  medium: "bg-teal-50 text-petrol-800",
  high: "bg-danger-bg text-danger-text",
};

export function LevelBadge({
  level,
  register = "hr",
  className,
}: {
  level: StressLevel;
  register?: Register;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium",
        register === "app" ? "rounded-pill px-2.5" : "rounded-chip",
        LEVEL_STYLES[level],
        className,
      )}
    >
      {it.domain.stressLevel[level]}
    </span>
  );
}
