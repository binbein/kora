"use client";

import { useState } from "react";
import { AnimatedNumber } from "@/components/kora/animated-number";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/data/types";
import {
  DEFAULT_LOCALE,
  formatCHF,
  formatNumber,
  formatPercent,
  formatRatio,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import {
  clampEmployees,
  computeRoi,
  DEFAULT_EMPLOYEES,
  EMPLOYEE_RANGE,
  ROI_MODEL,
  type RoiLossId,
} from "@/lib/roi-model";
import { CALCULATOR_ID } from "./anchors";

/*
 * Calcolatore ROI (§8.C.2). Le formule stanno in `lib/roi-model.ts`, qui c'è
 * solo la schermata: se un numero non torna, si guarda un file solo.
 *
 * I due pannelli hanno la stessa struttura — importo grande in alto, dettaglio
 * sotto — così le cifre da confrontare stanno alla stessa altezza. Il costo di
 * KORA è mostrato positivo: in it-CH un importo negativo diventa "CHF-66'000",
 * con il segno incastrato fra valuta e cifra, che a proiezione si legge come
 * un refuso. È l'etichetta a dire che si sottrae.
 */

const PRESETS = [50, 100, 250, 500];

const LOSS_LABELS: Record<RoiLossId, string> = {
  absenteeism: it.site.calculator.lossAbsenteeism,
  presenteeism: it.site.calculator.lossPresenteeism,
  burnout: it.site.calculator.lossBurnout,
  turnover: it.site.calculator.lossTurnover,
};

/*
 * Le ipotesi dietro ogni voce, scritte accanto alla voce stessa: sono le
 * costanti del §7 e non dipendono dal numero di dipendenti, quindi si
 * compongono una volta sola. Averle a schermo è metà dell'argomento — un
 * numero che dichiara da dove viene si controlla, e regge il controllo.
 */
const LOSS_HINTS: Record<RoiLossId, string> = {
  absenteeism: t(it.site.calculator.lossAbsenteeismHint, {
    days: formatNumber(ROI_MODEL.absenceDaysPerEmployee, DEFAULT_LOCALE, {
      decimals: 1,
    }),
    cost: formatCHF(ROI_MODEL.costPerAbsenceDay),
  }),
  presenteeism: t(it.site.calculator.lossPresenteeismHint, {
    cost: formatCHF(ROI_MODEL.presenteeismPerEmployee),
  }),
  burnout: t(it.site.calculator.lossBurnoutHint, {
    share: formatPercent(ROI_MODEL.burnoutRiskShare * 100),
    loss: formatPercent(ROI_MODEL.burnoutProductivityLoss * 100),
  }),
  turnover: t(it.site.calculator.lossTurnoverHint, {
    rate: formatPercent(ROI_MODEL.turnoverRate * 100, DEFAULT_LOCALE, {
      decimals: 1,
    }),
  }),
};

export function RoiCalculator({ plan }: { plan: Plan }) {
  const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
  /* Quello che si sta scrivendo nel campo, che non è ancora un valore valido. */
  const [draft, setDraft] = useState(String(DEFAULT_EMPLOYEES));

  const roi = computeRoi(employees, plan);

  function apply(value: number) {
    const next = clampEmployees(value);
    setEmployees(next);
    setDraft(String(next));
  }

  /*
   * Mentre si digita, il modello segue solo i valori già dentro l'intervallo:
   * per arrivare a 100 si passa da "1" e "10", e nessuno vuole vedere i conti
   * rifarsi per un'azienda di una persona, né vedersi correggere il campo
   * sotto le dita. Quello che resta fuori scala si sistema quando il campo
   * perde il fuoco.
   */
  function handleTyping(raw: string) {
    setDraft(raw);
    const parsed = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(parsed)) return;
    if (parsed < EMPLOYEE_RANGE.min || parsed > EMPLOYEE_RANGE.max) return;
    setEmployees(Math.round(parsed));
  }

  return (
    <section
      id={CALCULATOR_ID}
      className="scroll-mt-6 border-t border-gray-200 bg-gray-50 py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-2xl font-semibold text-petrol-900">
          {it.site.calculator.title}
        </h2>
        <p className="mt-3 max-w-2xl text-gray-600">
          {it.site.calculator.intro}
        </p>

        {/* --- input ------------------------------------------------------ */}
        <div className="mt-8 rounded-card border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
            <div>
              <label
                htmlFor="employees"
                className="text-xs font-medium text-gray-600"
              >
                {it.site.calculator.employeesLabel}
              </label>
              <input
                id="employees"
                type="number"
                inputMode="numeric"
                min={EMPLOYEE_RANGE.min}
                max={EMPLOYEE_RANGE.max}
                value={draft}
                onChange={(event) => handleTyping(event.target.value)}
                onBlur={() => apply(Number(draft))}
                className="mt-1 block w-28 rounded-btn border border-gray-300 px-3 py-2 text-xl font-semibold text-petrol-900 tabular-nums"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                {t(it.site.calculator.employeesHelp, {
                  min: formatNumber(EMPLOYEE_RANGE.min),
                  max: formatNumber(EMPLOYEE_RANGE.max),
                })}
              </p>
            </div>

            <div className="min-w-56 flex-1">
              <input
                type="range"
                aria-label={it.site.calculator.employeesLabel}
                min={EMPLOYEE_RANGE.min}
                max={EMPLOYEE_RANGE.max}
                step={EMPLOYEE_RANGE.step}
                value={employees}
                onChange={(event) => apply(Number(event.target.value))}
                className="w-full cursor-pointer accent-petrol-700"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{formatNumber(EMPLOYEE_RANGE.min)}</span>
                <span>{formatNumber(EMPLOYEE_RANGE.max)}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600">
                {it.site.calculator.presetsLabel}
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={employees === preset ? "secondary" : "outline"}
                    aria-pressed={employees === preset}
                    onClick={() => apply(preset)}
                    className="tabular-nums"
                  >
                    {formatNumber(preset)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- risultato -------------------------------------------------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-card border border-gray-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-petrol-900">
              {it.site.calculator.lossesTitle}
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              {it.site.calculator.lossesCaption}
            </p>

            <AnimatedNumber
              value={roi.totalLossesChf}
              format={formatCHF}
              className="mt-4 block text-3xl font-semibold text-danger-text"
            />

            <p className="mt-6 text-xs font-medium text-gray-600">
              {it.site.calculator.lossesBreakdown}
            </p>
            <ul className="mt-2 divide-y divide-gray-200 border-t border-gray-200">
              {roi.losses.map((loss) => (
                <li
                  key={loss.id}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block text-gray-800">
                      {LOSS_LABELS[loss.id]}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {LOSS_HINTS[loss.id]}
                    </span>
                  </span>
                  <AnimatedNumber
                    value={loss.chf}
                    format={formatCHF}
                    className="shrink-0 font-medium text-petrol-900"
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* Colonna in flex per poter spingere il rapporto in fondo: le due
              card hanno un numero di righe diverso, e senza ancoraggio quella
              con meno righe resterebbe con un vuoto sotto. */}
          <section className="flex flex-col rounded-card border border-teal-200 bg-teal-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-petrol-900">
                {it.site.calculator.koraTitle}
              </h3>
              <span className="rounded-chip bg-white px-2 py-0.5 text-xs font-medium text-petrol-800">
                {it.site.calculator.conservativeBadge}
              </span>
            </div>
            <p className="mt-1 text-xs text-petrol-800">
              {it.site.calculator.netLabel}
            </p>

            <AnimatedNumber
              value={roi.netSavingsChf}
              format={formatCHF}
              className="mt-3 block text-3xl font-semibold text-petrol-900"
            />

            <p className="mt-6 text-xs font-medium text-petrol-800">
              {it.site.calculator.netBreakdown}
            </p>
            <ul className="mt-2 divide-y divide-teal-200 border-t border-teal-200">
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="text-petrol-900">
                  {it.site.calculator.savingsLabel}
                </span>
                <AnimatedNumber
                  value={roi.savingsChf}
                  format={formatCHF}
                  className="shrink-0 font-medium text-petrol-900"
                />
              </li>
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="min-w-0">
                  <span className="block text-petrol-900">
                    {it.site.calculator.costLabel}
                  </span>
                  <span className="block text-xs text-petrol-800">
                    {t(it.site.calculator.costHint, {
                      employees: formatNumber(roi.employees),
                      price: formatCHF(plan.monthlyPricePerEmployee),
                    })}
                  </span>
                </span>
                <AnimatedNumber
                  value={roi.koraCostChf}
                  format={formatCHF}
                  className="shrink-0 font-medium text-petrol-900"
                />
              </li>
            </ul>

            <div className="mt-auto pt-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-card bg-white px-4 py-3">
                <span className="text-2xl font-semibold text-petrol-900 tabular-nums">
                  {t(it.site.calculator.roiValue, {
                    ratio: formatRatio(roi.roiRatio),
                  })}
                </span>
                <span className="text-xs text-gray-600">
                  {it.site.calculator.roiCaption}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 space-y-1 text-xs text-gray-500">
          <p>
            {t(it.site.calculator.assumptions, {
              absence: formatPercent(ROI_MODEL.savingRateAbsence * 100),
              burnout: formatPercent(ROI_MODEL.savingRateBurnout * 100),
            })}
          </p>
          <p>
            {t(it.site.calculator.planNote, {
              plan: it.domain.planName[plan.id],
            })}
          </p>
          <p>{it.site.calculator.sources}</p>
        </div>
      </div>
    </section>
  );
}
