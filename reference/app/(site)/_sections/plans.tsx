import { PlanCard } from "@/components/kora/plan-card";
import type { Plan, PlanId } from "@/lib/data/types";
import { it } from "@/lib/i18n/it";

/*
 * Listino (§8.C.3). Il piano evidenziato non è deciso qui: arriva da chi
 * compone la pagina, ed è lo stesso su cui gira il calcolatore. Così la frase
 * "il calcolatore qui sopra usa il piano Plus" non può smentire la card
 * evidenziata due schermate più giù.
 */
export function Plans({
  plans,
  highlightedPlanId,
}: {
  plans: Plan[];
  highlightedPlanId: PlanId;
}) {
  return (
    <section className="border-t border-gray-200 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-2xl font-semibold text-petrol-900">
          {it.site.plans.title}
        </h2>
        <p className="mt-3 max-w-2xl text-gray-600">{it.site.plans.subtitle}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              highlighted={plan.id === highlightedPlanId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
