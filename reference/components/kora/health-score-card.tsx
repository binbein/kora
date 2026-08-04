import type { HealthProfile } from "@/lib/data/types";
import { formatNumber, type Locale, DEFAULT_LOCALE } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Card petrolio del Profilo Salute (§8.B.2). È l'elemento più caldo della
 * app: raggio ampio del registro consumer, testo in seconda persona.
 *
 * Sul fondo petrol-900 il testo secondario usa teal-200 (§4.1): 9.20 di
 * contrasto, ben sopra AA.
 */
export function HealthScoreCard({
  profile,
  locale = DEFAULT_LOCALE,
  className,
}: {
  profile: HealthProfile;
  locale?: Locale;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card-app bg-petrol-900 px-5 py-5 text-white",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-wide text-teal-200 uppercase">
        {it.app.healthProfileTitle}
      </p>

      {/*
       * Una frase sola, non un numero grande più un "su 100" accanto:
       * spezzarla significherebbe comporre testo a pezzi, e in tedesco o
       * francese i pezzi non tornano nello stesso ordine (§2.6).
       */}
      <p className="mt-3 text-3xl font-semibold tabular-nums">
        {t(it.app.healthProfileScore, {
          score: formatNumber(profile.score, locale),
        })}
      </p>

      <p className="mt-1 text-lg">
        {it.domain.healthSummary[profile.summaryKey]}
      </p>

      <p className="mt-4 text-xs text-teal-200">
        {t(it.app.healthProfileWeakArea, {
          area: it.domain.healthArea[profile.weakestArea],
        })}
      </p>
    </div>
  );
}
