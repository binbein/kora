import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * KPI della dashboard HR (§8.A.3). Registro strumento: compatta, bordo
 * sottile, nessuna ombra decorativa (§4.1).
 *
 * Il valore arriva già formattato: la card non sa se sono franchi, giorni o
 * percentuali, e non deve saperlo. Formattare è compito di `format.ts` (§9).
 */

export type StatCardTone = "default" | "warn" | "danger";

const TONE_STYLES: Record<StatCardTone, string> = {
  default: "border-gray-200",
  warn: "border-warn/40 bg-warn-bg/40",
  danger: "border-danger/40 bg-danger-bg/40",
};

const VALUE_TONE: Record<StatCardTone, string> = {
  default: "text-petrol-900",
  warn: "text-warn-dark",
  danger: "text-danger-text",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  badge,
  progressPercent,
  tone = "default",
  className,
}: {
  label: string;
  /** Già formattato tramite format.ts */
  value: string;
  hint?: ReactNode;
  icon?: ReactNode;
  /** Qualificatore accanto all'etichetta, es. "in corso" su un periodo parziale. */
  badge?: string;
  /**
   * Avanzamento 0–100 da mostrare sotto il valore.
   *
   * Volutamente sottile: il numero resta il protagonista della card e la
   * barra dice solo a che punto siamo. Su una quota bassa — 142 sessioni su
   * 1'200 sono il 12% — una traccia spessa e quasi vuota si legge come un
   * errore di rendering, mentre una riga sottile si legge come "siamo
   * all'inizio dell'anno".
   */
  progressPercent?: number;
  tone?: StatCardTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border px-4 py-3.5",
        TONE_STYLES[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/*
         * min-h pari all'altezza del badge: la card è alta uguale con o senza,
         * così cambiando trimestre nulla si sposta sotto.
         */}
        <p className="flex min-h-5 flex-wrap items-center gap-1.5 text-xs font-medium text-gray-600">
          {label}
          {badge ? (
            <span className="rounded-chip bg-teal-50 px-1.5 py-0.5 text-petrol-800">
              {badge}
            </span>
          ) : null}
        </p>
        {icon ? (
          <span className="shrink-0 text-petrol-700" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold tabular-nums",
          VALUE_TONE[tone],
        )}
      >
        {value}
      </p>
      {/*
       * La barra è decorativa e resta fuori dall'albero accessibile:
       * l'informazione sta tutta nel valore sopra e nel sottotitolo sotto,
       * che dà anche il denominatore. Annunciarla ripeteva la stessa cifra
       * una terza volta senza dire nulla della proporzione.
       */}
      {progressPercent !== undefined ? (
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-teal-50"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-petrol-700"
            style={{
              width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
            }}
          />
        </div>
      ) : null}

      {hint ? <div className="mt-1 text-xs text-gray-600">{hint}</div> : null}
    </div>
  );
}
