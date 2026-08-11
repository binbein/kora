import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Calculator, Info } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import Footer from "@/components/public/Footer";
import { usePlans } from "@/lib/data/queries";
import type { PlanId } from "@/lib/data/types";
import {
  clampEmployees,
  computeRoi,
  DEFAULT_EMPLOYEES,
  EMPLOYEE_RANGE,
  ROI_MODEL,
  roundToHundreds,
  type RoiLossId,
} from "@/lib/roi-model";
import { formatCHF, formatNumber, formatPercent, formatRatio } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * Il calcolatore ROI (CLAUDE.md §10.A.2), la ventiseiesima rotta.
 *
 * Il motore è `roi-model.ts` e questa pagina non lo duplica: non contiene
 * nessuna costante economica, solo le formule chiamate una volta. Le cifre del
 * §9 stanno tutte lì, e i cinque numeri di ancoraggio a N=100 sono sorvegliati
 * da un guardrail in `lib/data/mock/roi.ts`, dove il prezzo esiste già.
 *
 * IL PREZZO ARRIVA DAL PROVIDER. `computeRoi` lo prende come parametro proprio
 * per non essere una seconda fonte di quella cifra: qui viene da `Plan`, come
 * nelle card di `/pricing`, così le due schermate non possono dire due prezzi
 * diversi.
 */

/*
 * Il calcolatore ragiona sul Plus, e lo dichiara a schermo.
 *
 * Il §9 fissa `costo = N × 55 × 12`, quindi è il Plus a produrre i CHF 66'000 e
 * il 2.35:1 dell'ancoraggio. Un selettore di piano darebbe ~3.4:1
 * sull'Essenziale e ~1.2:1 sull'Executive, e il numero che l'investitore ha
 * letto sul documento smetterebbe di essere *il* numero. Chi confronta i piani
 * va su `/pricing`, che è la pagina che risponde a quella domanda.
 */
const CALCULATOR_PLAN_ID: PlanId = "plus";

/** L'ordine in cui le quattro voci si elencano, uguale a quello del modello. */
const LOSS_ROWS: RoiLossId[] = [
  "absenteeism",
  "presenteeism",
  "burnout",
  "turnover",
];

/**
 * Il dettaglio sotto ogni voce: le costanti del §9, dette a parole.
 *
 * Vive qui e non in `it.ts` perché sono valori, non testo: le frasi complete
 * stanno nel dizionario con i segnaposto, e questi sono i numeri che ci
 * entrano dentro, presi dal modello invece che riscritti.
 */
function lossHint(id: RoiLossId): string {
  switch (id) {
    case "absenteeism":
      return interpolate(t.public.roi.lossHint.absenteeism, {
        days: formatNumber(ROI_MODEL.absenceDaysPerEmployee, undefined, {
          decimals: 1,
        }),
        cost: formatCHF(ROI_MODEL.costPerAbsenceDay),
      });
    case "presenteeism":
      return interpolate(t.public.roi.lossHint.presenteeism, {
        cost: formatCHF(ROI_MODEL.presenteeismPerEmployee),
      });
    case "burnout":
      return interpolate(t.public.roi.lossHint.burnout, {
        share: formatPercent(ROI_MODEL.burnoutRiskShare * 100),
        loss: formatPercent(ROI_MODEL.burnoutProductivityLoss * 100),
      });
    case "turnover":
      return interpolate(t.public.roi.lossHint.turnover, {
        rate: formatPercent(ROI_MODEL.turnoverRate * 100, undefined, {
          decimals: 1,
        }),
      });
  }
}

/** Una riga del riepilogo: etichetta a sinistra, importo a destra. */
function SummaryRow({
  label,
  hint,
  value,
  strong,
}: {
  label: string;
  hint?: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <div className="min-w-0">
        <p
          className={`text-sm ${strong ? "font-semibold text-foreground" : "text-foreground"}`}
        >
          {label}
        </p>
        {hint ? (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        ) : null}
      </div>
      <span
        className={`tabular-nums whitespace-nowrap font-display ${
          strong ? "text-lg font-bold" : "text-sm font-medium"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function Roi() {
  /*
   * Il campo tiene il testo, non il numero. Con lo stato già ristretto
   * all'intervallo non si potrebbe digitare "50": la "5" diventerebbe 20 sotto
   * le dita. Il clamp governa il calcolo, la normalizzazione avviene
   * all'uscita dal campo.
   */
  const [rawEmployees, setRawEmployees] = useState(String(DEFAULT_EMPLOYEES));
  const { data: plans } = usePlans();

  const plan = plans?.find((candidate) => candidate.id === CALCULATOR_PLAN_ID);
  if (!plan) return null;

  const employees = clampEmployees(Number(rawEmployees));
  const estimate = computeRoi(employees, plan.monthlyPricePerEmployee);

  /*
   * Il risparmio per dipendente sostituisce la stima "CHF 1'400–2'900" che il
   * Business Plan non contiene, uscita in M0 (§9). Si deriva dal modello e si
   * arrotonda al centinaio: essendo ogni voce lineare, è la stessa cifra a
   * qualunque organico, e al franco sarebbe finta precisione su una stima.
   */
  const savingsPerEmployee = roundToHundreds(
    estimate.savingsChf / estimate.employees,
  );

  const ratio = formatRatio(estimate.roiRatio);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="pt-28 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-secondary/10 rounded-2xl mb-5">
            <Calculator className="w-7 h-7 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            {t.public.roi.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t.public.roi.subtitle}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="p-6 md:p-8">
            <Label htmlFor="roi-employees" className="text-sm font-medium">
              {t.public.roi.employeesLabel}
            </Label>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-5">
              <Input
                id="roi-employees"
                type="number"
                inputMode="numeric"
                min={EMPLOYEE_RANGE.min}
                max={EMPLOYEE_RANGE.max}
                value={rawEmployees}
                onChange={(event) => setRawEmployees(event.target.value)}
                onBlur={() => setRawEmployees(String(employees))}
                className="sm:w-40 text-lg font-semibold tabular-nums"
              />
              <Slider
                className="flex-1"
                value={[employees]}
                min={EMPLOYEE_RANGE.min}
                max={EMPLOYEE_RANGE.max}
                step={EMPLOYEE_RANGE.step}
                onValueChange={([next]) => setRawEmployees(String(next))}
                aria-label={t.public.roi.employeesLabel}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {interpolate(t.public.roi.employeesRange, {
                min: formatNumber(EMPLOYEE_RANGE.min),
                max: formatNumber(EMPLOYEE_RANGE.max),
              })}
            </p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Le perdite di oggi */}
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold font-display mb-2">
                {t.public.roi.lossesTitle}
              </h2>
              <div className="divide-y divide-border">
                {LOSS_ROWS.map((id) => {
                  const loss = estimate.losses.find((row) => row.id === id);
                  if (!loss) return null;
                  return (
                    <SummaryRow
                      key={id}
                      label={t.public.roi.loss[id]}
                      hint={lossHint(id)}
                      value={formatCHF(loss.chf)}
                    />
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-border flex items-baseline justify-between gap-6">
                <p className="text-sm font-semibold">
                  {t.public.roi.lossesTotal}
                </p>
                <span className="text-3xl font-bold font-display tabular-nums text-destructive whitespace-nowrap">
                  {formatCHF(estimate.totalLossesChf)}
                </span>
              </div>
            </Card>

            {/* Il recupero con Kora */}
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold font-display mb-2">
                {t.public.roi.savingsTitle}
              </h2>
              <div className="divide-y divide-border">
                <SummaryRow
                  label={t.public.roi.savings}
                  hint={interpolate(t.public.roi.savingsHint, {
                    absence: formatPercent(ROI_MODEL.savingRateAbsence * 100),
                    burnout: formatPercent(ROI_MODEL.savingRateBurnout * 100),
                  })}
                  value={formatCHF(estimate.savingsChf)}
                />
                <SummaryRow
                  label={t.public.roi.cost}
                  hint={interpolate(t.public.roi.costHint, {
                    plan: t.plan[plan.id],
                    price: formatCHF(plan.monthlyPricePerEmployee),
                  })}
                  value={interpolate(t.public.roi.costValue, {
                    amount: formatCHF(estimate.koraCostChf),
                  })}
                />
                <SummaryRow
                  label={t.public.roi.netSavings}
                  value={formatCHF(estimate.netSavingsChf)}
                  strong
                />
              </div>

              <div className="mt-5 p-5 bg-accent rounded-xl">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold text-accent-foreground">
                    {t.public.roi.ratio}
                  </p>
                  <span className="text-3xl font-bold font-display tabular-nums text-accent-foreground whitespace-nowrap">
                    {interpolate(t.public.roi.ratioValue, { ratio })}
                  </span>
                </div>
                <p className="text-xs text-accent-foreground/80 mt-1">
                  {t.public.roi.ratioHint}
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-4 tabular-nums">
                {interpolate(t.public.roi.perEmployee, {
                  amount: formatCHF(savingsPerEmployee),
                })}
              </p>
            </Card>
          </div>

          {/* Il rapporto non reagisce all'input, e va detto (§9) */}
          <div className="flex items-start gap-3 bg-muted rounded-xl p-4">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                {interpolate(t.public.roi.linearityNote, {
                  ratio: interpolate(t.public.roi.ratioValue, { ratio }),
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.public.roi.sources}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold font-display">
            {t.public.roi.ctaTitle}
          </h2>
          <p className="text-muted-foreground">{t.public.roi.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/*
             * CTA su `primary` e non su `secondary` pieno: il bianco su teal dà
             * 2.83:1 contro il minimo AA di 4.5 (§6.1). Questa schermata l'ha
             * scelto quando il debito era ancora aperto, per non allargarlo, ed
             * è diventata il precedente che la passata del 10.08.2026 ha seguito
             * per portarci le altre otto CTA.
             */}
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              asChild
            >
              <Link to="/demo">
                {t.public.roi.ctaButton}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link to="/pricing">{t.public.roi.ctaPricing}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
