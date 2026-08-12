import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import Footer from "@/components/public/Footer";
import { loadState, usePlans } from "@/lib/data/queries";
import { EmptyNotice, ErrorNotice } from "@/components/kora/StateNotice";
import type { Plan, PlanId } from "@/lib/data/types";
import { planFeatures } from "@/lib/plan-features";
import { formatCHF, formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il listino (CLAUDE.md §10.A.3).
 *
 * LE CARD NON ELENCANO PIÙ LE PROPRIE VOCI. Vengono da `plan-features.ts`, che
 * le deriva da `Plan`: è così che si chiudono i tre disallineamenti col §9
 * aperti da M0 — colloquio conoscitivo solo sull'Essenziale, coaching con
 * tetto e psichiatra incluso sull'Executive, dashboard mensile al posto della
 * consulenza trimestrale — senza correggere tre righe di JSX che la prima
 * riscrittura riaprirebbe.
 *
 * IL PIANO "PERSONALIZZATO" RESTA NASCOSTO. `FlexiblePlanCard` è ancora nel
 * repository e nessuno lo importa: la decisione del CEO è in sospeso
 * (`PROGRESS.md`), i suoi undici prezzi non stanno nel Business Plan e quindi
 * non potrebbe leggere da `Plan` nemmeno volendo. È l'eccezione dichiarata del
 * §11, non una dimenticanza.
 */

/** Il piano evidenziato nel listino. Demo SA è su Plus, ed è quello di mezzo. */
const RECOMMENDED_PLAN_ID: PlanId = "plus";

type Billing = "monthly" | "annual";

function PlanCard({ plan }: { plan: Plan }) {
  const recommended = plan.id === RECOMMENDED_PLAN_ID;

  return (
    <Card
      className={`p-6 relative flex flex-col ${
        recommended ? "ring-2 ring-secondary shadow-xl" : "hover:shadow-lg"
      } transition-all`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-4 py-1 rounded-full">
          {t.public.plans.recommended}
        </div>
      )}
      <h3 className="text-xl font-bold font-display">{t.plan[plan.id]}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {t.public.plans.target[plan.id]}
      </p>
      <div className="mb-6">
        <span className="text-3xl font-bold font-display tabular-nums">
          {formatCHF(plan.monthlyPricePerEmployee)}
        </span>
        <span className="text-sm text-muted-foreground">
          {" "}
          {t.public.plans.priceUnit}
        </span>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {planFeatures(plan).map((feature) => (
          <li key={feature.key} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${recommended ? "bg-primary hover:bg-primary/90" : ""}`}
        variant={recommended ? "default" : "outline"}
        asChild
      >
        <Link to="/demo">{t.public.plans.cta}</Link>
      </Button>
    </Card>
  );
}

function CostSimulator({ plans }: { plans: Plan[] }) {
  /*
   * Il campo tiene il testo, non il numero: il simulatore non ha un intervallo
   * da imporre — un'azienda digita il proprio organico — quindi qui basta
   * leggere il numero e trattare il vuoto come zero.
   *
   * I 150 di apertura non sono l'organico di Demo SA, che è 120 (§8): sono il
   * valore con cui il simulatore pubblico si apre, ed è dichiarato nel §8 fra
   * i `150` che non si toccano.
   */
  const [rawEmployees, setRawEmployees] = useState("150");
  const [planId, setPlanId] = useState<PlanId>(RECOMMENDED_PLAN_ID);
  const [billing, setBilling] = useState<Billing>("annual");

  const plan = plans.find((candidate) => candidate.id === planId);
  if (!plan) return null;

  const employees = Math.max(0, Math.round(Number(rawEmployees) || 0));
  const monthlyTotal = employees * plan.monthlyPricePerEmployee;
  const total = billing === "annual" ? monthlyTotal * 12 : monthlyTotal;

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-secondary/10 rounded-xl">
          <Calculator className="w-6 h-6 text-secondary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold font-display">
          {t.public.costSimulator.title}
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="cost-employees" className="text-sm font-medium">
            {t.public.costSimulator.employeesLabel}
          </Label>
          <Input
            id="cost-employees"
            type="number"
            inputMode="numeric"
            min={0}
            value={rawEmployees}
            onChange={(event) => setRawEmployees(event.target.value)}
            onBlur={() => setRawEmployees(String(employees))}
            className="mt-1.5 tabular-nums"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">
            {t.public.costSimulator.planLabel}
          </Label>
          <Select
            value={planId}
            onValueChange={(value) => setPlanId(value as PlanId)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Le etichette si derivano dal piano: un listino e un menu che
                  dicono due prezzi diversi sono lo stesso difetto di due KPI
                  che divergono (§5.5). */}
              {plans.map((candidate) => (
                <SelectItem key={candidate.id} value={candidate.id}>
                  {interpolate(t.public.costSimulator.planOption, {
                    plan: t.plan[candidate.id],
                    price: formatCHF(candidate.monthlyPricePerEmployee),
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">
            {t.public.costSimulator.billingLabel}
          </Label>
          <Select
            value={billing}
            onValueChange={(value) => setBilling(value as Billing)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">
                {t.public.costSimulator.billingMonthly}
              </SelectItem>
              <SelectItem value="annual">
                {t.public.costSimulator.billingAnnual}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 p-6 bg-accent rounded-xl space-y-3">
        <div className="flex justify-between items-center gap-4">
          <span className="text-sm text-accent-foreground/80">
            {billing === "annual"
              ? t.public.costSimulator.totalAnnual
              : t.public.costSimulator.totalMonthly}
          </span>
          <span className="text-3xl font-bold font-display tabular-nums text-accent-foreground whitespace-nowrap">
            {formatCHF(total)}
          </span>
        </div>
        <p className="text-sm text-accent-foreground/80 tabular-nums">
          {interpolate(
            billing === "annual"
              ? t.public.costSimulator.breakdownAnnual
              : t.public.costSimulator.breakdownMonthly,
            {
              employees: formatNumber(employees),
              price: formatCHF(plan.monthlyPricePerEmployee),
            },
          )}
        </p>
      </div>

      <Button className="w-full mt-6 bg-primary hover:bg-primary/90" asChild>
        <Link to="/demo">
          {t.public.costSimulator.cta}
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Link>
      </Button>
      <p className="text-center mt-4">
        <Link
          to="/roi"
          className="text-sm text-secondary-strong hover:underline font-medium"
        >
          {t.public.costSimulator.roiLink}
        </Link>
      </p>
    </Card>
  );
}

export default function Pricing() {
  const plansQuery = usePlans();

  /* I tre casi (M5.b), registro strumento. Senza listino la pagina prezzi non
     ha contenuto: qui il ramo è di pagina davvero. */
  const page = loadState([plansQuery]);
  if (page.state === 'error') {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />
      </div>
    );
  }

  const plans = plansQuery.data;
  if (plans === undefined) return null;
  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <EmptyNotice text={t.public.plans.empty} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            {t.public.plans.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.public.plans.subtitle}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <CostSimulator plans={plans} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
