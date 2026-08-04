"use client";

import { useState } from "react";
import { AppointmentCard } from "@/components/kora/appointment-card";
import { FilterChip } from "@/components/kora/filter-chip";
import { HealthScoreCard } from "@/components/kora/health-score-card";
import { InitialsAvatar } from "@/components/kora/initials-avatar";
import { PhoneFrame } from "@/components/kora/phone-frame";
import { ProfessionalCard } from "@/components/kora/professional-card";
import { SessionMeter } from "@/components/kora/session-meter";
import { LevelBadge } from "@/components/kora/level-badge";
import { Button } from "@/components/ui/button";
import type { ProfessionalSpecialty } from "@/lib/data/types";
import { it, t } from "@/lib/i18n/it";
import { dataProvider } from "@/lib/data";
import { useData } from "@/lib/data/use-data";
import { Section, SubHeading } from "./_shell";

const SPECIALTIES: ProfessionalSpecialty[] = [
  "sleep",
  "work_stress",
  "burnout_anxiety",
  "coaching",
];

/*
 * Registro app: arioso, da consumer, seconda persona. Raggi ampi, pulsanti a
 * pillola. Montato dentro PhoneFrame perché è così che verrà presentato da
 * desktop durante il pitch (§8.B).
 *
 * Filtri e selezione sono interattivi: servono a controllare che ogni tocco
 * dia un riscontro, non a simulare la schermata vera.
 */
export function AppRegisterSection() {
  const [specialty, setSpecialty] = useState<ProfessionalSpecialty>("sleep");
  const [selectedId, setSelectedId] = useState<string>("meier");

  /*
   * Letto dal provider e riabbonato alle mutazioni: se in un'altra scheda
   * della demo si prenota, questa sezione si aggiorna da sola.
   */
  const employee = dataProvider.getEmployeeProfile();
  const entitlement = useData((provider) => provider.getEntitlement());
  const appointments = useData((provider) => provider.getAppointments());
  const nextAppointment = appointments[0];
  const nextProfessional = nextAppointment
    ? dataProvider.getProfessionalById(nextAppointment.professionalId)
    : undefined;
  const visible = dataProvider.getProfessionals({ specialty });

  return (
    <Section
      id="registro-app"
      title="Registro app dipendente"
      note="Percorso dipendente: forme morbide, tono caldo e in seconda persona, densità ariosa. I filtri e la selezione qui sotto rispondono davvero."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,390px)_1fr]">
        <PhoneFrame>
          <div className="space-y-4 bg-gray-50 p-4">
            <div>
              <p className="text-gray-600">
                {t(it.app.greeting, { name: employee.firstName })}
              </p>
            </div>

            <HealthScoreCard profile={employee.healthProfile} />

            <div className="rounded-card-app border border-gray-200 bg-white px-4 py-4">
              <SessionMeter entitlement={entitlement} />
            </div>

            <div className="bg-white">
              <AppointmentCard
                appointment={nextAppointment}
                professional={nextProfessional}
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 rounded-pill">Prenota</Button>
              <Button variant="outline" className="flex-1 rounded-pill">
                Medico virtuale
              </Button>
            </div>
          </div>
        </PhoneFrame>

        <div className="space-y-8">
          <div>
            <SubHeading>Filtri a chip</SubHeading>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIALTIES.map((value) => (
                <FilterChip
                  key={value}
                  label={it.domain.specialty[value]}
                  selected={specialty === value}
                  onClick={() => setSpecialty(value)}
                />
              ))}
            </div>
          </div>

          <div>
            <SubHeading>Professionisti</SubHeading>
            <div className="mt-3 space-y-3">
              {visible.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  selected={selectedId === professional.id}
                  onSelect={() => setSelectedId(professional.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <SubHeading>Stato vuoto e varianti</SubHeading>
            <div className="mt-3 space-y-3">
              <AppointmentCard />
              <div className="flex flex-wrap items-center gap-3">
                <LevelBadge level="low" register="app" />
                <LevelBadge level="medium" register="app" />
                <LevelBadge level="high" register="app" />
                <InitialsAvatar name="Laura Bernasconi" size="sm" />
                <InitialsAvatar name="Laura Bernasconi" />
                <InitialsAvatar name="Meier" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
