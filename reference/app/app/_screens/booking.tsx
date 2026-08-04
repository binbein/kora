"use client";

import { useState } from "react";
import { CalendarCheck, Check } from "lucide-react";
import { FilterChip } from "@/components/kora/filter-chip";
import { ProfessionalCard } from "@/components/kora/professional-card";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import {
  professionalDisplayName,
  type AppointmentSlot,
  type Professional,
  type ProfessionalSpecialty,
} from "@/lib/data/types";
import { useData } from "@/lib/data/use-data";
import { formatNumber, formatTime, formatWeekday } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";
import { AppBar } from "./app-bar";

/*
 * Prenotazione psicologo (§8.B.3): filtri a chip → professionista → slot →
 * conferma. La conferma passa dal provider, quindi l'appuntamento compare in
 * home e il contatore sale senza che questa schermata debba dirlo a nessuno.
 *
 * Tre passi su una schermata sola: in un telefono scorrere è più naturale che
 * navigare, e per la demo significa un vicolo cieco in meno.
 */

const SPECIALTIES: ProfessionalSpecialty[] = [
  "sleep",
  "work_stress",
  "burnout_anxiety",
  "coaching",
];

export function Booking({
  onBack,
  onDone,
  initialProfessionalId,
}: {
  onBack: () => void;
  onDone: () => void;
  initialProfessionalId?: string;
}) {
  const [specialty, setSpecialty] = useState<ProfessionalSpecialty | undefined>(
    initialProfessionalId
      ? dataProvider.getProfessionalById(initialProfessionalId)?.specialty
      : undefined,
  );
  const [professionalId, setProfessionalId] = useState<string | undefined>(
    initialProfessionalId,
  );
  const [slot, setSlot] = useState<AppointmentSlot | undefined>(undefined);
  const [confirmed, setConfirmed] = useState<AppointmentSlot | undefined>(
    undefined,
  );

  const entitlement = useData((provider) => provider.getEntitlement());
  const professionals = dataProvider.getProfessionals(
    specialty ? { specialty } : undefined,
  );
  const selected = professionalId
    ? dataProvider.getProfessionalById(professionalId)
    : undefined;
  const slots = useData((provider) =>
    professionalId ? provider.getAvailableSlots(professionalId) : [],
  );

  const confirm = () => {
    if (!slot) return;
    dataProvider.bookAppointment(slot);
    setConfirmed(slot);
  };

  if (confirmed && selected) {
    return (
      <Confirmation
        professional={selected}
        slot={confirmed}
        used={entitlement.used}
        total={entitlement.total}
        onDone={onDone}
      />
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <AppBar title={it.booking.title} onBack={onBack} />

      <div className="space-y-6 p-4 pb-8">
        <div>
          <p className="font-medium text-petrol-900">
            {it.booking.stepProfessional}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label={it.booking.filterAll}
              selected={specialty === undefined}
              onClick={() => setSpecialty(undefined)}
            />
            {SPECIALTIES.map((value) => (
              <FilterChip
                key={value}
                label={it.domain.specialty[value]}
                selected={specialty === value}
                onClick={() => setSpecialty(value)}
              />
            ))}
          </div>

          <div className="mt-3 space-y-2.5">
            {professionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                selected={professionalId === professional.id}
                onSelect={() => {
                  setProfessionalId(professional.id);
                  setSlot(undefined);
                }}
              />
            ))}
          </div>
        </div>

        {selected ? (
          <div>
            <p className="font-medium text-petrol-900">{it.booking.stepSlot}</p>
            {slots.length === 0 ? (
              <p className="mt-2 text-gray-600">{it.booking.noSlots}</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {slots.map((option) => {
                  const active =
                    slot?.start.getTime() === option.start.getTime();
                  return (
                    <button
                      key={option.start.toISOString()}
                      type="button"
                      onClick={() => setSlot(option)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-card-app border px-3 py-2.5 text-left transition-colors",
                        active
                          ? "border-petrol-700 bg-teal-50"
                          : "border-gray-200 bg-white hover:border-petrol-700",
                      )}
                    >
                      <span className="block font-medium text-petrol-900">
                        {formatWeekday(option.start)}
                      </span>
                      <span className="block text-gray-600 tabular-nums">
                        {formatTime(option.start)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {slot && selected ? (
        <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white p-4">
          <p className="font-medium text-petrol-900">
            {it.booking.confirmTitle}
          </p>
          <p className="mt-0.5 text-gray-600">
            {t(it.booking.confirmDetail, {
              professional: professionalDisplayName(selected),
              weekday: formatWeekday(slot.start),
              time: formatTime(slot.start),
            })}
          </p>
          <Button className="mt-3 h-11 w-full rounded-pill" onClick={confirm}>
            {it.booking.confirmAction}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Confirmation({
  professional,
  slot,
  used,
  total,
  onDone,
}: {
  professional: Professional;
  slot: AppointmentSlot;
  used: number;
  total: number;
  onDone: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="pt-12">
        <span
          className="flex size-14 items-center justify-center rounded-full bg-teal-50 text-petrol-700"
          aria-hidden="true"
        >
          <Check className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-petrol-900">
          {it.booking.doneTitle}
        </h1>
        <p className="mt-2 text-gray-600">
          {t(it.booking.doneDetail, {
            weekday: formatWeekday(slot.start),
            time: formatTime(slot.start),
          })}
        </p>

        <div className="mt-5 flex items-center gap-2.5 rounded-card-app border border-gray-200 px-4 py-3">
          <CalendarCheck
            className="size-4 shrink-0 text-petrol-700"
            aria-hidden="true"
          />
          <p className="text-gray-700">
            {professionalDisplayName(professional)}
          </p>
        </div>

        <p className="mt-3 rounded-card-app bg-teal-50 px-4 py-3 text-petrol-800">
          {t(it.booking.doneCounter, {
            used: formatNumber(used),
            total: formatNumber(total),
          })}
        </p>
      </div>

      <Button className="h-11 w-full rounded-pill" onClick={onDone}>
        {it.app.backToHome}
      </Button>
    </div>
  );
}
