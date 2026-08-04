import type { Appointment, AppointmentSlot } from "@/lib/data/types";
import { addDays, isSameDay, startOfWeek } from "@/lib/dates";
import { formatDate, formatTime, formatWeekdayShort } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Calendario del professionista (§8.D, prima schermata).
 *
 * Una settimana per volta, quella della data di riferimento: sette colonne,
 * fine settimana compreso, perché una griglia che salta sabato e domenica
 * nasconde il fatto che quei giorni sono liberi per scelta.
 *
 * Ogni voce si spiega da sola con la propria etichetta, quindi non serve una
 * legenda: il colore aiuta a leggere la settimana a colpo d'occhio, ma non è
 * l'unica cosa che distingue una sessione erogata da uno slot libero.
 */

type Entry = {
  key: string;
  start: Date;
  status: "delivered" | "scheduled" | "free";
};

const ENTRY_STYLES: Record<Entry["status"], string> = {
  delivered: "border-teal-200 bg-teal-50 text-petrol-800",
  scheduled: "border-petrol-700 bg-white text-petrol-900",
  free: "border-dashed border-gray-300 bg-white text-gray-500",
};

const ENTRY_LABELS: Record<Entry["status"], string> = {
  delivered: it.pro.statusDelivered,
  scheduled: it.pro.statusScheduled,
  free: it.pro.statusFree,
};

const DAYS_IN_WEEK = 7;

export function CalendarView({
  sessions,
  freeSlots,
  referenceDate,
}: {
  sessions: Appointment[];
  freeSlots: AppointmentSlot[];
  referenceDate: Date;
}) {
  const weekStart = startOfWeek(referenceDate);
  const days = Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
    addDays(weekStart, index),
  );

  const entries: Entry[] = [
    ...sessions.map((session) => ({
      key: session.id,
      start: session.start,
      status: (session.status === "completed" ? "delivered" : "scheduled") as
        "delivered" | "scheduled",
    })),
    ...freeSlots.map((slot) => ({
      key: `free-${slot.start.getTime()}`,
      start: slot.start,
      status: "free" as const,
    })),
  ];

  return (
    <section className="rounded-card border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-petrol-900">
        {t(it.pro.calendarTitle, { date: formatDate(weekStart) })}
      </h2>
      <p className="mt-1 text-xs text-gray-600">{it.pro.calendarNote}</p>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isToday = isSameDay(day, referenceDate);
          const dayEntries = entries
            .filter((entry) => isSameDay(entry.start, day))
            .sort((a, b) => a.start.getTime() - b.start.getTime());

          return (
            <div
              key={day.getTime()}
              className={cn(
                "rounded-card border p-2.5",
                isToday
                  ? "border-petrol-700 bg-teal-50/40"
                  : "border-gray-200 bg-gray-50/60",
              )}
            >
              <p className="flex items-center gap-1.5 text-xs font-medium text-petrol-900">
                {formatWeekdayShort(day)}
                {isToday ? (
                  <span className="rounded-chip bg-petrol-700 px-1.5 text-xs font-medium text-white">
                    {it.pro.today}
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-gray-500 tabular-nums">
                {formatDate(day)}
              </p>

              <ul className="mt-2.5 space-y-1.5">
                {dayEntries.length === 0 ? (
                  <li className="text-xs text-gray-400">{it.pro.dayEmpty}</li>
                ) : (
                  dayEntries.map((entry) => (
                    <li
                      key={entry.key}
                      className={cn(
                        "rounded-chip border px-2 py-1.5",
                        ENTRY_STYLES[entry.status],
                      )}
                    >
                      <p className="font-medium tabular-nums">
                        {formatTime(entry.start)}
                      </p>
                      <p className="text-xs">{ENTRY_LABELS[entry.status]}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
