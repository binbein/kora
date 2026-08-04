import type { SessionEntitlement } from "@/lib/data/types";
import { formatCHF, type Locale, DEFAULT_LOCALE } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Contatore sessioni del percorso dipendente (§8.B.2). Registro app: forme
 * a pillola, tono caldo e in seconda persona.
 *
 * La frase è completa nel dizionario ("Hai usato {used} delle tue {total}
 * sessioni"): in tedesco e francese l'ordine delle parole cambia, quindi
 * comporla a pezzi qui la renderebbe intraducibile (§2.6).
 */
export function SessionMeter({
  entitlement,
  locale = DEFAULT_LOCALE,
  className,
}: {
  entitlement: SessionEntitlement;
  locale?: Locale;
  className?: string;
}) {
  const { used, total, extraSessionPrice } = entitlement;
  const remaining = Math.max(total - used, 0);
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      <p className="font-medium text-petrol-900">
        {t(it.app.sessionsUsed, { used, total })}
      </p>

      <div
        className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-teal-200"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={t(it.app.sessionsUsed, { used, total })}
      >
        <div
          className="h-full rounded-full bg-petrol-700 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-gray-600">
          {t(it.app.sessionsRemaining, { remaining })}
        </p>
        <p className="text-xs text-gray-500">
          {t(it.app.extraSessionPrice, {
            price: formatCHF(extraSessionPrice, locale),
          })}
        </p>
      </div>
    </div>
  );
}
