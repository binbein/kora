import { BadgeCheck, Clock, Coins, Receipt } from "lucide-react";
import { StatCard } from "@/components/kora/stat-card";
import type { ProfessionalEarnings } from "@/lib/data/types";
import {
  DEFAULT_LOCALE,
  formatCHF,
  formatDate,
  formatMonthYear,
  formatNumber,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";

/*
 * Riepilogo compensi mensile (§8.D, seconda schermata).
 *
 * Il mese in corso è marcato come tale, come il trimestre della dashboard HR:
 * un totale più basso del solito, a tre giorni dalla fine del mese, sembra un
 * errore finché non si dice che il mese non è chiuso.
 *
 * La tabella settimanale esiste perché un totale da solo non si verifica.
 * Sommando le righe si ottiene il totale, e il totale diviso la tariffa dà il
 * numero di sessioni: chi vuole controllare, controlla.
 */

/** Ore da minuti, senza decimali quando l'ora è piena. */
function hoursLabel(minutes: number): string {
  const hours = minutes / 60;
  return t(it.pro.hoursValue, {
    hours: formatNumber(hours, DEFAULT_LOCALE, {
      decimals: Number.isInteger(hours) ? 0 : 1,
    }),
  });
}

export function EarningsView({ earnings }: { earnings: ProfessionalEarnings }) {
  /* Le sessioni durano tutte uguale: la media è quella durata, e ricavarla
     dai dati evita di ricopiare qui una costante del dataset. */
  const sessionMinutes =
    earnings.sessionsDelivered === 0
      ? 0
      : earnings.minutesDelivered / earnings.sessionsDelivered;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard
          label={it.pro.kpiSessions}
          value={formatNumber(earnings.sessionsDelivered)}
          hint={
            earnings.sessionsDelivered === 0
              ? undefined
              : t(it.pro.sessionsHint, {
                  minutes: formatNumber(sessionMinutes),
                })
          }
          badge={earnings.inProgress ? it.pro.monthInProgress : undefined}
          icon={<BadgeCheck className="size-4" />}
        />
        <StatCard
          label={it.pro.kpiGross}
          value={formatCHF(earnings.grossChf)}
          hint={t(it.pro.grossHint, {
            sessions: formatNumber(earnings.sessionsDelivered),
            fee: formatCHF(earnings.feePerSession),
          })}
          icon={<Coins className="size-4" />}
        />
        <StatCard
          label={it.pro.kpiHours}
          value={hoursLabel(earnings.minutesDelivered)}
          icon={<Clock className="size-4" />}
        />
        <StatCard
          label={it.pro.kpiFee}
          value={formatCHF(earnings.feePerSession)}
          hint={it.pro.feeHint}
          icon={<Receipt className="size-4" />}
        />
      </section>

      {/*
       * Il regime sta attaccato alle KPI, non in fondo alla schermata: è la
       * prima cosa da sapere per leggere il totale, non una postilla.
       */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-xs font-medium text-petrol-900">
          {t(it.pro.regimeNote, {
            sessions: formatNumber(earnings.sessionsPerWeek),
          })}
        </p>
        <p className="text-xs text-gray-600">
          {t(it.pro.fullCapacityNote, {
            sessions: formatNumber(earnings.fullCapacity.sessionsPerWeek),
            min: formatCHF(earnings.fullCapacity.monthlyMinChf),
            max: formatCHF(earnings.fullCapacity.monthlyMaxChf),
          })}
        </p>
      </div>

      <section className="rounded-card border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-petrol-900">
          {t(it.pro.earningsTitle, {
            month: formatMonthYear(earnings.month),
          })}
        </h2>

        <table className="mt-4 w-full">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-600">
              <th className="py-2 text-left font-medium">{it.pro.tableWeek}</th>
              <th className="py-2 text-right font-medium">
                {it.pro.tableSessions}
              </th>
              <th className="py-2 text-right font-medium">
                {it.pro.tableHours}
              </th>
              <th className="py-2 text-right font-medium">
                {it.pro.tableGross}
              </th>
            </tr>
          </thead>
          <tbody>
            {earnings.weeks.map((week) => (
              <tr
                key={week.start.getTime()}
                className="border-b border-gray-200 text-gray-800"
              >
                <td className="py-2.5">
                  {t(it.pro.weekRange, {
                    from: formatDate(week.start),
                    to: formatDate(week.end),
                  })}
                </td>
                <td className="py-2.5 text-right">
                  {formatNumber(week.sessions)}
                </td>
                <td className="py-2.5 text-right">
                  {hoursLabel(week.minutes)}
                </td>
                <td className="py-2.5 text-right">
                  {formatCHF(week.grossChf)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-petrol-900">
              <td className="py-2.5">{it.pro.tableTotal}</td>
              <td className="py-2.5 text-right">
                {formatNumber(earnings.sessionsDelivered)}
              </td>
              <td className="py-2.5 text-right">
                {hoursLabel(earnings.minutesDelivered)}
              </td>
              <td className="py-2.5 text-right">
                {formatCHF(earnings.grossChf)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-4 text-xs text-gray-500">{it.pro.deliveredOnlyNote}</p>
      </section>
    </div>
  );
}
