"use client";

import { cn } from "@/lib/utils";

/*
 * Chip di filtro del percorso dipendente (§8.B.3). Registro app: pillola.
 *
 * Nessuna larghezza fissa: l'etichetta detta la misura, così una parola
 * tedesca del 30% più lunga non trova il muro (§2.6).
 */
export function FilterChip({
  label,
  selected = false,
  onClick,
  className,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-pill border px-3.5 py-1.5 transition-colors",
        selected
          ? "border-petrol-700 bg-petrol-700 text-white"
          : "border-gray-300 text-gray-700 hover:bg-teal-50",
        className,
      )}
    >
      {label}
    </button>
  );
}
