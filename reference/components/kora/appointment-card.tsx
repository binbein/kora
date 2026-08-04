import type { ReactNode } from "react";
import { CalendarClock } from "lucide-react";
import {
  professionalDisplayName,
  type Appointment,
  type Professional,
} from "@/lib/data/types";
import {
  formatTime,
  formatWeekday,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";
import { InitialsAvatar } from "./initials-avatar";

/*
 * Prossimo appuntamento in home app (§8.B.2). Registro app.
 *
 * Senza appuntamento la card non sparisce: mostra lo stato vuoto, così la
 * home non cambia struttura fra prima e dopo una prenotazione.
 */
export function AppointmentCard({
  appointment,
  professional,
  action,
  locale = DEFAULT_LOCALE,
  className,
}: {
  appointment?: Appointment;
  professional?: Professional;
  /** Azione sull'appuntamento, es. entrare nella sessione. */
  action?: ReactNode;
  locale?: Locale;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card-app border border-gray-200 px-4 py-4",
        className,
      )}
    >
      <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-gray-600 uppercase">
        <CalendarClock className="size-3.5" aria-hidden="true" />
        {it.app.nextAppointment}
      </p>

      {appointment && professional ? (
        <div className="mt-3 flex items-center gap-3">
          <InitialsAvatar
            name={[professional.firstName, professional.lastName]
              .filter(Boolean)
              .join(" ")}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-petrol-900">
              {professionalDisplayName(professional)}
            </p>
            <p className="mt-0.5 text-gray-600">
              {t(it.app.appointmentWhen, {
                weekday: formatWeekday(appointment.start, locale),
                time: formatTime(appointment.start, locale),
              })}
            </p>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : (
        <p className="mt-3 text-gray-600">{it.app.noAppointment}</p>
      )}
    </div>
  );
}
