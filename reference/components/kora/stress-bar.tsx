import type { StressLevel, StressRecord } from "@/lib/data/types";
import {
  formatNumber,
  formatPercent,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";
import { LevelBadge } from "./level-badge";
import { MaskedValue } from "./masked-value";

/*
 * Barra orizzontale dello stress per reparto (§8.A.4).
 *
 * L'etichetta e il valore stanno FUORI dalla barra: §4.1 vieta il testo
 * normale su teal-500, dove il contrasto si ferma a 4.04. Tenerli fuori
 * risolve il problema invece di aggirarlo con un peso più grande.
 *
 * Un reparto sotto soglia non ha un punteggio da disegnare: il tipo
 * `StressRecord` lo rende esplicito, e la barra mostra il trattino spiegato.
 */

const LEVEL_FILL: Record<StressLevel, string> = {
  low: "bg-teal-300",
  medium: "bg-teal-500",
  high: "bg-danger",
};

export function StressBar({
  departmentName,
  employeeCount,
  respondents,
  record,
  locale = DEFAULT_LOCALE,
  className,
}: {
  departmentName: string;
  employeeCount?: number;
  /** Risposte al questionario: è questo numero, non l'organico, a decidere
   *  se il reparto è pubblicabile. */
  respondents?: number;
  record: StressRecord;
  locale?: Locale;
  className?: string;
}) {
  return (
    <div className={cn("py-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium text-petrol-900">{departmentName}</p>
        <div className="flex shrink-0 items-center gap-2">
          {record.suppressed ? (
            <MaskedValue />
          ) : (
            <>
              <LevelBadge level={record.level} />
              <span className="font-medium text-petrol-900 tabular-nums">
                {formatPercent(record.score, locale)}
              </span>
            </>
          )}
        </div>
      </div>

      {/*
       * Organico e risposte stanno su ogni riga, non solo su quelle sotto
       * soglia: Direzione e HR + Legale hanno gli stessi 15 dipendenti e
       * esiti opposti, e senza le risposte la differenza non si vede.
       */}
      {employeeCount !== undefined && respondents !== undefined ? (
        <p className="mt-0.5 text-xs text-gray-500">
          {t(it.hr.departmentMeta, {
            employees: formatNumber(employeeCount, locale),
            respondents: formatNumber(respondents, locale),
          })}
        </p>
      ) : null}

      {/*
       * Sotto soglia la barra non è vuota: è assente. Una traccia piena a
       * zero si leggerebbe come "stress nullo", che è l'opposto di
       * "non lo misuriamo". Al suo posto una linea tratteggiata.
       */}
      {record.suppressed ? (
        <div
          className="mt-2 h-2 w-full border-t-2 border-dashed border-gray-300"
          role="img"
          aria-label={`${departmentName}: ${it.hr.suppressedShort}`}
        />
      ) : (
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-teal-50"
          role="img"
          aria-label={`${departmentName}: ${formatPercent(record.score, locale)}`}
        >
          <div
            className={cn("h-full rounded-full", LEVEL_FILL[record.level])}
            style={{ width: `${record.score}%` }}
          />
        </div>
      )}
    </div>
  );
}
