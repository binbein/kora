"use client";

import { ChevronLeft } from "lucide-react";
import { it } from "@/lib/i18n/it";

/*
 * Barra superiore delle schermate interne del percorso dipendente.
 * Registro app: nessuna ombra, tocco ampio, freccia a sinistra.
 */
export function AppBar({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white/95 px-2 py-2.5 backdrop-blur">
      <button
        type="button"
        onClick={onBack}
        aria-label={it.app.back}
        className="flex size-9 shrink-0 items-center justify-center rounded-pill text-petrol-800 transition-colors hover:bg-teal-50"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <h1 className="font-medium text-petrol-900">{title}</h1>
        {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
      </div>
    </header>
  );
}
