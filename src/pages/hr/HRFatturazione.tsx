import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calculator, FileText } from 'lucide-react';
import { formatCHF, formatMonthYear, formatNumber } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import type { PlanId } from '@/lib/data/types';
import { loadState, useCompany, useInvoices, usePlans } from '@/lib/data/queries';
import { EmptyNotice, ErrorNotice } from '@/components/kora/StateNotice';

/*
 * La fatturazione dell'area HR (CLAUDE.md §10.C).
 *
 * Nessun importo è scritto: il costo mensile è organico per prezzo del piano, e
 * l'annuale è il mensile per dodici. Il codice ereditato aveva CHF 8.250 e
 * CHF 99.000 scritti a mano — su un organico di 150 e con il punto delle
 * migliaia all'italiana, che in Svizzera si legge "otto virgola due" (§11).
 *
 * Il simulatore legge i tre piani dal provider invece di tenersi un listino
 * locale: due listini divergono, e quello locale non lo aggiorna nessuno.
 */
/**
 * Il numero di dipendenti del simulatore, o `null` per "torna all'organico".
 *
 * IL VUOTO DEVE TORNARE `null`, ed è più di un clamp: `simulatedEmployees` è
 * `employees ?? company.employeeCount`, quindi con `Number("") || 0` quel
 * fallback funzionava **una volta sola** — dopo il primo tasto `employees` non
 * era più `null` e svuotare il campo portava il totale a CHF 0 su un contratto
 * attivo. La riga era morta dal primo tasto in poi.
 *
 * Il pavimento è 1 come l'attributo `min`, che da solo è decorativo: un negativo
 * digitato dava un totale negativo.
 *
 * NON CONDIVIDE IL CORPO con `clampEmployees` di `roi-model.ts`, che riporta
 * nell'intervallo 20–1000: è il dominio di validità del **modello ROI**, e qui
 * sarebbe semanticamente falso — un'azienda da 120 dipendenti che simula il
 * costo per 5 persone sta facendo una domanda legittima, e un clamp a 20 le
 * risponderebbe con un numero che non ha chiesto.
 */
function toSimulated(raw: string): number | null {
  if (raw.trim() === "") return null;
  return Math.max(1, Math.round(Number(raw) || 1));
}

export default function HRFatturazione() {
  const companyQuery = useCompany();
  const plansQuery = usePlans();
  const invoicesQuery = useInvoices();

  const [employees, setEmployees] = useState<number | null>(null);
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [annual, setAnnual] = useState(true);

  /* I tre casi (M5.b). Nessuno di questi tre è nullable per contratto: qui
     l'unico vuoto possibile è una lista di fatture senza righe, ed è sotto. */
  const page = loadState([companyQuery, plansQuery, invoicesQuery]);
  if (page.state === 'error') {
    return <ErrorNotice copy={t.common.state.error} onRetry={page.retry} />;
  }

  const company = companyQuery.data;
  const plans = plansQuery.data;
  const invoices = invoicesQuery.data;
  if (company === undefined || plans === undefined || invoices === undefined) {
    return null;
  }

  // il simulatore parte dai valori dell'azienda: è il caso di gran lunga più
  // frequente, e apre su un totale che chi guarda può verificare sulla card sopra
  const simulatedEmployees = employees ?? company.employeeCount;
  const simulatedPlan =
    plans.find((plan) => plan.id === (planId ?? company.plan.id)) ?? company.plan;

  const monthlyCost = company.employeeCount * company.plan.monthlyPricePerEmployee;
  const simulatedMonthly =
    simulatedEmployees * simulatedPlan.monthlyPricePerEmployee;
  const simulatedTotal = annual ? simulatedMonthly * 12 : simulatedMonthly;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">{t.hr.billing.title}</h1>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" aria-hidden="true" /> {t.hr.billing.planTitle}
          </h3>
          {/*
            * IL FONDO È RIPETUTO IN `hover:`, E NON È DI TROPPO.
            *
            * `badge.tsx` ha `defaultVariants: { variant: "default" }`, e quella
            * variante porta `hover:bg-primary/80`: un `className` che passa
            * solo il fondo a riposo sovrascrive quello e **non** l'`hover:`,
            * che è un'altra classe. Il risultato è un badge che diventa blu
            * petrolio pieno al passaggio del mouse — cioè un'etichetta che
            * finge di essere premibile, mentre è un `<div>` senza `onClick`.
            *
            * Si corregge **al call site e non nella definizione**, perché
            * `src/components/ui/` è congelato e il §6.1 lo dice per questo file
            * esatto. Chi toglie l'`hover:` credendolo un duplicato riapre il
            * difetto.
            */}
          <Badge className="bg-secondary/10 text-secondary-strong hover:bg-secondary/10">
            {t.plan[company.plan.id]}
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t.hr.billing.employees}</p>
            <p className="text-lg font-bold tabular-nums">
              {formatNumber(company.employeeCount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.hr.billing.monthlyCost}</p>
            <p className="text-lg font-bold tabular-nums">{formatCHF(monthlyCost)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.hr.billing.annualContract}</p>
            <p className="text-lg font-bold tabular-nums">{formatCHF(monthlyCost * 12)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.hr.billing.renewal}</p>
            <p className="text-lg font-bold tabular-nums">
              {formatMonthYear(company.contractRenewsOn)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" /> {t.hr.billing.invoicesTitle}
        </h3>
        {invoices.length === 0 && (
          <EmptyNotice text={t.hr.billing.invoicesEmpty} />
        )}
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.month.toISOString()}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium capitalize">
                  {formatMonthYear(invoice.month)}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {interpolate(t.hr.billing.invoiceDetail, {
                    count: formatNumber(invoice.employeeCount),
                    price: formatCHF(invoice.unitPriceChf),
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums">
                  {formatCHF(invoice.employeeCount * invoice.unitPriceChf)}
                </span>
                {/* LA FATTURA IN ATTESA NON SI RENDE COME LA PAGATA. Fino al
                    19.08.2026 le due uscivano con la stessa classe e a cambiare
                    era la sola parola, quindi chi leggeva in fretta leggeva
                    "pagato" su una fattura che non lo è. L'attesa ha un token
                    suo (§6.1). */}
                <Badge
                  className={
                    invoice.status === 'paid'
                      ? 'bg-secondary/10 text-secondary-strong text-xs hover:bg-secondary/10'
                      : 'bg-waiting text-waiting-foreground text-xs hover:bg-waiting'
                  }
                >
                  {invoice.status === 'paid'
                    ? t.hr.billing.invoicePaid
                    : t.hr.billing.invoicePending}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-secondary" aria-hidden="true" /> {t.hr.billing.simulatorTitle}
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-xs">{t.hr.billing.simulatorEmployees}</Label>
            <Input
              type="number"
              min={1}
              value={simulatedEmployees}
              onChange={(event) => setEmployees(toSimulated(event.target.value))}
              className="mt-1 tabular-nums"
            />
          </div>
          <div>
            <Label className="text-xs">{t.hr.billing.simulatorPlan}</Label>
            <Select
              value={simulatedPlan.id}
              onValueChange={(value) => setPlanId(value as PlanId)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {interpolate(t.hr.billing.planOption, {
                      name: t.plan[plan.id],
                      price: formatCHF(plan.monthlyPricePerEmployee),
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t.hr.billing.simulatorBilling}</Label>
            <Select
              value={annual ? 'annual' : 'monthly'}
              onValueChange={(value) => setAnnual(value === 'annual')}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t.hr.billing.billingMonthly}</SelectItem>
                <SelectItem value="annual">{t.hr.billing.billingAnnual}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-accent rounded-xl p-5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {annual ? t.hr.billing.totalAnnual : t.hr.billing.totalMonthly}
            </span>
            <span className="text-2xl font-bold font-display tabular-nums">
              {formatCHF(simulatedTotal)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
