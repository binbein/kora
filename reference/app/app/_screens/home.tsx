"use client";

import { CalendarPlus, Stethoscope } from "lucide-react";
import { AppointmentCard } from "@/components/kora/appointment-card";
import { HealthScoreCard } from "@/components/kora/health-score-card";
import { SessionMeter } from "@/components/kora/session-meter";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import { useData } from "@/lib/data/use-data";
import { it, t } from "@/lib/i18n/it";

/*
 * Home del percorso dipendente (§8.B.2).
 *
 * Contatore sessioni e appuntamento arrivano dal provider tramite `useData`:
 * dopo una prenotazione questa schermata si aggiorna da sé, senza che nessuno
 * le passi il nuovo stato.
 */
export function Home({
  onBook,
  onDoctor,
  onJoinCall,
}: {
  onBook: () => void;
  onDoctor: () => void;
  onJoinCall?: () => void;
}) {
  const employee = dataProvider.getEmployeeProfile();
  const entitlement = useData((provider) => provider.getEntitlement());
  const appointments = useData((provider) => provider.getAppointments());

  const next = appointments[0];
  const professional = next
    ? dataProvider.getProfessionalById(next.professionalId)
    : undefined;

  return (
    <div className="min-h-full space-y-4 bg-gray-50 p-4 pb-8">
      <p className="px-1 pt-2 text-gray-600">
        {t(it.app.greeting, { name: employee.firstName })}
      </p>

      <HealthScoreCard profile={employee.healthProfile} />

      <div className="rounded-card-app border border-gray-200 bg-white px-4 py-4">
        <SessionMeter entitlement={entitlement} />
      </div>

      <div className="bg-white">
        <AppointmentCard
          appointment={next}
          professional={professional}
          action={
            next && onJoinCall ? (
              <Button
                size="sm"
                className="rounded-pill px-4"
                onClick={onJoinCall}
              >
                {it.app.joinSession}
              </Button>
            ) : undefined
          }
        />
      </div>

      <div className="flex gap-2">
        <Button className="h-11 flex-1 rounded-pill" onClick={onBook}>
          <CalendarPlus className="size-4" aria-hidden="true" />
          {it.app.quickBook}
        </Button>
        <Button
          variant="outline"
          className="h-11 flex-1 rounded-pill bg-white"
          onClick={onDoctor}
        >
          <Stethoscope className="size-4" aria-hidden="true" />
          {it.app.quickDoctor}
        </Button>
      </div>
    </div>
  );
}
