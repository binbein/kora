import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Moon, Activity, Footprints, Apple, Brain, Sparkles } from "lucide-react";
import { useAiHealthPlan } from "@/lib/data/queries";
import type { HealthArea } from "@/lib/data/types";
import { formatMonthYear, formatPercent } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il piano di prevenzione (CLAUDE.md §10.B).
 *
 * Cinque aree, quelle di `HealthArea`: nel codice ereditato ce n'era una sesta,
 * "Check-up", con la sua barra di avanzamento allo 0% — cioè un servizio che si
 * prenota travestito da abitudine su cui si progredisce.
 *
 * Le due date si derivano dall'iscrizione e dalla cadenza del piano, e non sono
 * scritte: la schermata ereditata diceva "Aggiornato: Aprile 2026" su una demo
 * ambientata a settembre, che è quello che succede a una data scritta a mano.
 *
 * Non c'è più il riquadro "Obiettivi principali": elencava gli stessi obiettivi
 * che le card qui sotto già mostrano, e due punti che dicono la stessa cosa
 * sono due punti che possono smettere di dirla (§5.5).
 */

/** L'icona e i colori di ogni area. Sono presentazione, quindi stanno qui. */
const AREA_STYLE: Record<
  HealthArea,
  { icon: typeof Moon; iconClass: string; wrapClass: string }
> = {
  sleep: {
    icon: Moon,
    iconClass: "text-executive",
    wrapClass: "bg-executive/10",
  },
  stress: { icon: Activity, iconClass: "text-primary", wrapClass: "bg-primary/10" },
  activity: {
    icon: Footprints,
    iconClass: "text-secondary",
    wrapClass: "bg-secondary/10",
  },
  nutrition: {
    icon: Apple,
    iconClass: "text-foreground",
    wrapClass: "bg-muted",
  },
  mental: { icon: Brain, iconClass: "text-secondary", wrapClass: "bg-secondary/10" },
};

// le chiavi di obiettivi e suggerimenti sono un insieme aperto sul contratto,
// quindi le mappe si leggono come tali
const goals: Record<string, string> = t.employee.aiPlan.goal;
const tips: Record<string, string> = t.employee.aiPlan.tip;

export default function PianoAI() {
  const { data: plan } = useAiHealthPlan();
  if (!plan) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display">
            {t.employee.aiPlan.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.employee.aiPlan.subtitle}
          </p>
          <p className="text-sm text-muted-foreground">
            {interpolate(t.employee.aiPlan.nextUpdate, {
              month: formatMonthYear(plan.nextUpdateAt),
            })}
          </p>
        </div>
        <Badge className="bg-accent text-accent-foreground hover:bg-accent flex-shrink-0">
          <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
          {interpolate(t.employee.aiPlan.generated, {
            month: formatMonthYear(plan.generatedAt),
          })}
        </Badge>
      </div>

      <div className="space-y-4">
        {plan.areas.map((area) => {
          const { icon: Icon, iconClass, wrapClass } = AREA_STYLE[area.area];
          return (
            <Card key={area.area} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${wrapClass}`}>
                  <Icon className={`w-5 h-5 ${iconClass}`} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-sm">
                    {t.healthArea[area.area]}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {goals[area.goalKey]}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  {formatPercent(area.progressPercent)}
                </span>
              </div>
              <Progress value={area.progressPercent} className="h-2 mb-3" />
              <ul className="space-y-1.5">
                {area.tipKeys.map((tipKey) => (
                  <li
                    key={tipKey}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-secondary-strong mt-0.5">•</span>
                    {tips[tipKey]}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
