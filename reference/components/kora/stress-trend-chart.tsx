"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  STRESS_BANDS,
  type EarlyAlert,
  type StressRecord,
} from "@/lib/data/types";
import {
  formatMonthShort,
  formatPercent,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Trend stress a 12 mesi: media azienda contro il reparto in difficoltà
 * (§8.A.5).
 *
 * Tre scelte deliberate, tutte al servizio della stessa frase — la media non
 * mostrava nulla, il dettaglio per reparto sì:
 *
 * 1. Asse Y bloccato a 0–100. Recharts di suo scalerebbe sull'intervallo dei
 *    dati (qui 48–78) e la divergenza sembrerebbe molto più drammatica di
 *    quanto sia: un asse troncato in una demo davanti a investitori è una
 *    cosa che si nota, e toglie credibilità al resto.
 * 2. Le due soglie di fascia come guide leggere, così "alto" si legge
 *    dall'altezza della linea senza dover consultare una legenda.
 * 3. La legenda porta gli estremi di ogni serie: il contrasto fra piatta e in
 *    salita deve capirsi guardando, non ascoltando.
 */

type ChartPoint = {
  label: string;
  company: number | null;
  department: number | null;
};

function toScore(record: StressRecord | undefined): number | null {
  if (!record || record.suppressed) return null;
  return record.score;
}

export function StressTrendChart({
  companyHistory,
  departmentHistory,
  departmentName,
  alert,
  locale = DEFAULT_LOCALE,
  /*
   * Altezza dell'area del grafico. In dashboard è quella di default; il
   * report trimestrale la abbassa, perché lì il grafico divide un A4 con la
   * tabella dei reparti e la sintesi. La proporzione fra le due linee non
   * cambia: l'asse resta bloccato a 0–100.
   */
  chartClassName,
}: {
  companyHistory: StressRecord[];
  departmentHistory: StressRecord[];
  departmentName: string;
  alert?: EarlyAlert;
  locale?: Locale;
  chartClassName?: string;
}) {
  const data: ChartPoint[] = companyHistory.map((record, index) => ({
    label: formatMonthShort(record.month, locale),
    company: toScore(record),
    department: toScore(departmentHistory[index]),
  }));

  const alertIndex = alert
    ? departmentHistory.findIndex(
        (record) => record.month.getTime() === alert.triggeredAt.getTime(),
      )
    : -1;
  const alertPoint = alertIndex >= 0 ? data[alertIndex] : undefined;

  const firstCompany = toScore(companyHistory[0]);
  const lastCompany = toScore(companyHistory[companyHistory.length - 1]);
  const firstDepartment = toScore(departmentHistory[0]);
  const lastDepartment = toScore(
    departmentHistory[departmentHistory.length - 1],
  );

  const percent = (value: number | null) =>
    value === null ? it.common.notAvailable : formatPercent(value, locale);

  return (
    <div>
      <div
        className={cn("h-72 w-full", chartClassName)}
        role="img"
        aria-label={t(it.hr.trendSalesLegend, {
          from: percent(firstDepartment),
          to: percent(lastDepartment),
          month: alertIndex + 1,
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            /* Il margine destro fa posto alle etichette delle due soglie,
               che stanno fuori dall'area del grafico. */
            margin={{ top: 16, right: 52, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-gray-200)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--color-gray-200)" }}
              tick={{ fill: "var(--color-gray-600)", fontSize: 12 }}
            />

            {/*
             * domain fisso e allowDataOverflow: senza questi Recharts adatta
             * l'asse ai dati e il grafico mente sulla proporzione.
             */}
            <YAxis
              domain={[0, 100]}
              allowDataOverflow={false}
              ticks={[0, STRESS_BANDS.mediumFrom, STRESS_BANDS.highFrom, 100]}
              tickFormatter={(value: number) => formatPercent(value, locale)}
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "var(--color-gray-600)", fontSize: 12 }}
            />

            {/* Le due soglie di fascia, leggere: guide, non dati. */}
            <ReferenceLine
              y={STRESS_BANDS.mediumFrom}
              stroke="var(--color-gray-300)"
              strokeDasharray="2 4"
              label={{
                value: it.hr.trendBandMedium,
                position: "right",
                fill: "var(--color-gray-500)",
                fontSize: 12,
              }}
            />
            <ReferenceLine
              y={STRESS_BANDS.highFrom}
              stroke="var(--color-danger)"
              strokeOpacity={0.35}
              strokeDasharray="2 4"
              label={{
                value: it.hr.trendBandHigh,
                position: "right",
                fill: "var(--color-danger-text)",
                fontSize: 12,
              }}
            />

            {/*
             * Marker dell'alert: una verticale sottile più un punto pieno sul
             * reparto. Si vede subito, non urla.
             */}
            {alertPoint ? (
              <ReferenceLine
                x={alertPoint.label}
                stroke="var(--color-warn)"
                strokeDasharray="4 4"
                label={{
                  value: it.hr.trendAlertMarker,
                  position: "top",
                  fill: "var(--color-warn-dark)",
                  fontSize: 12,
                }}
              />
            ) : null}

            <Line
              type="monotone"
              dataKey="company"
              name={it.hr.trendCompany}
              stroke="var(--color-petrol-700)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="department"
              name={departmentName}
              stroke="var(--color-danger)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />

            {alertPoint && alertPoint.department !== null ? (
              <ReferenceDot
                x={alertPoint.label}
                y={alertPoint.department}
                r={5}
                fill="var(--color-danger)"
                stroke="var(--color-white)"
                strokeWidth={2}
              />
            ) : null}

            <Tooltip
              cursor={{ stroke: "var(--color-gray-300)" }}
              formatter={(value) =>
                typeof value === "number"
                  ? formatPercent(value, locale)
                  : it.common.notAvailable
              }
              contentStyle={{
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-gray-200)",
                fontSize: 13,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/*
       * Legenda scritta a mano invece di quella di Recharts: deve dire come
       * si muovono le due serie, non solo come si chiamano.
       */}
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2.5">
          <span
            className="mt-1.5 h-0.5 w-4 shrink-0 rounded-full bg-petrol-700"
            aria-hidden="true"
          />
          <div>
            <dt className="font-medium text-petrol-900">
              {it.hr.trendCompany}
            </dt>
            <dd className="text-gray-600">
              {t(it.hr.trendCompanyLegend, {
                from: percent(firstCompany),
                to: percent(lastCompany),
              })}
            </dd>
          </div>
        </div>

        <div className="flex gap-2.5">
          <span
            className="mt-1.5 h-0.5 w-4 shrink-0 rounded-full bg-danger"
            aria-hidden="true"
          />
          <div>
            <dt className="font-medium text-danger-text">{departmentName}</dt>
            <dd className="text-gray-600">
              {t(it.hr.trendSalesLegend, {
                from: percent(firstDepartment),
                to: percent(lastDepartment),
                month: alertIndex + 1,
              })}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
