import type { ReactNode } from "react";
import type { Company } from "@/lib/data/types";
import { formatNumber, type Locale, DEFAULT_LOCALE } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { Wordmark } from "./wordmark";

/*
 * Header della dashboard HR (§8.A.1). Fondo petrolio, wordmark a sinistra,
 * azienda e selettore a destra.
 *
 * Il sottotitolo usa teal-200 su petrol-900: 9.20 di contrasto, il tono
 * secondario previsto dal §4.1 per il testo su petrolio.
 */
export function HrHeader({
  company,
  action,
  locale = DEFAULT_LOCALE,
}: {
  company: Company;
  action?: ReactNode;
  locale?: Locale;
}) {
  return (
    <header className="bg-petrol-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <Wordmark />
        <p className="text-teal-200">
          {t(it.hr.companySubtitle, {
            name: company.name,
            count: formatNumber(company.employeeCount, locale),
          })}
        </p>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
    </header>
  );
}
