import { Check } from "lucide-react";
import type { Plan } from "@/lib/data/types";
import { formatCHF, formatNumber } from "@/lib/format";
import { it, plural, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Card di un piano nel listino della landing (§8.C.3). Registro strumento:
 * bordo sottile, raggi da 10, nessuna ombra.
 *
 * Le voci elencate sono esattamente quelle che il §7 dichiara per quel piano,
 * e da quando il §7 riporta anche il medico virtuale dell'Essenziale tutti e
 * tre i piani hanno lo stesso numero di righe.
 */

/**
 * La riga del medico virtuale, che tutti e tre i piani includono.
 *
 * Dove c'è un tetto di consulti lo dice, dove non c'è lo tace: l'Essenziale
 * ne dà tre all'anno, gli altri due non pongono limiti, e scrivere
 * "illimitato" accanto agli altri sposterebbe l'attenzione su un confronto
 * che il listino non deve fare. Un piano che non dichiara il tempo di
 * risposta non promette nulla e la riga non compare.
 */
function doctorFeature(plan: Plan): string[] {
  const hours = plan.virtualDoctorSlaHours;
  if (hours === undefined) return [];

  const consults = plan.virtualDoctorConsultsPerYear;
  if (consults === "unlimited") {
    return [
      t(plural(hours, it.site.plans.featureDoctor), {
        hours: formatNumber(hours),
      }),
    ];
  }

  return [
    t(plural(hours, it.site.plans.featureDoctorCapped), {
      count: formatNumber(consults),
      hours: formatNumber(hours),
    }),
  ];
}

export function PlanCard({
  plan,
  highlighted = false,
}: {
  plan: Plan;
  highlighted?: boolean;
}) {
  const features = [
    t(it.site.plans.featureSessions, {
      count: formatNumber(plan.sessionsPerYear),
    }),
    t(it.site.plans.featureExtra, {
      price: formatCHF(plan.extraSessionPrice),
    }),
    ...doctorFeature(plan),
  ];

  return (
    <div
      className={cn(
        "flex flex-col rounded-card border bg-white p-5",
        highlighted
          ? "border-petrol-700 ring-1 ring-petrol-700"
          : "border-gray-200",
      )}
    >
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-petrol-900">
          {it.domain.planName[plan.id]}
        </h3>
        {highlighted ? (
          <span className="rounded-chip bg-teal-50 px-2 py-0.5 text-xs font-medium text-petrol-800">
            {it.site.plans.recommended}
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-2xl font-semibold text-petrol-900 tabular-nums">
        {formatCHF(plan.monthlyPricePerEmployee)}
      </p>
      <p className="mt-0.5 text-xs text-gray-600">{it.site.plans.priceUnit}</p>

      <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-gray-700">
            <Check
              className="mt-0.5 size-4 shrink-0 text-petrol-700"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
