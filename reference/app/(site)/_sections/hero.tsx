import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { it } from "@/lib/i18n/it";
import { CALCULATOR_ID } from "./anchors";

/*
 * Hero della landing (§8.C.1). È l'unico posto della demo dove compare il
 * serif: §4.2 lo riserva ai titoli display della landing, ed è quello che gli
 * dà il tono da documento istituzionale.
 *
 * I cinque servizi sono l'elenco del §1, senza cifre: i numeri cominciano
 * subito sotto, nel calcolatore, dove sono verificabili.
 */

const PILLARS = [
  { icon: HeartPulse, label: it.site.hero.pillarPsychologist },
  { icon: Stethoscope, label: it.site.hero.pillarDoctor },
  { icon: ClipboardCheck, label: it.site.hero.pillarCheckup },
  { icon: Sparkles, label: it.site.hero.pillarPrevention },
  { icon: BarChart3, label: it.site.hero.pillarDashboard },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <p className="text-xs font-medium tracking-[0.18em] text-petrol-700 uppercase">
        {it.site.hero.eyebrow}
      </p>

      <h1 className="mt-4 max-w-2xl font-serif text-3xl font-semibold text-petrol-900">
        {it.site.hero.title}
      </h1>

      <p className="mt-4 max-w-xl text-lg text-gray-600">
        {it.site.hero.subtitle}
      </p>

      <Button asChild className="mt-8 h-10 px-5 text-base">
        <a href={`#${CALCULATOR_ID}`}>
          {it.site.hero.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </Button>

      <ul className="mt-12 grid gap-3 border-t border-gray-200 pt-6 sm:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map((pillar) => (
          <li key={pillar.label} className="flex items-start gap-2">
            <pillar.icon
              className="mt-0.5 size-4 shrink-0 text-petrol-700"
              aria-hidden="true"
            />
            <span className="text-gray-700">{pillar.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
