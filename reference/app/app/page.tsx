"use client";

import { useState } from "react";
import { PhoneFrame } from "@/components/kora/phone-frame";
import { Button } from "@/components/ui/button";
import { dataProvider } from "@/lib/data";
import { it } from "@/lib/i18n/it";
import { AppBar } from "./_screens/app-bar";
import { Booking } from "./_screens/booking";
import { DoctorChat } from "./_screens/doctor-chat";
import { Home } from "./_screens/home";
import { Assessment, Generating, Welcome } from "./_screens/onboarding";
import { VideoCall } from "./_screens/video-call";

/*
 * Percorso dipendente (CLAUDE.md §8.B), mobile-first e presentato dentro una
 * cornice telefono quando lo si apre da desktop.
 *
 * Le schermate non sono route separate ma stati di questa pagina: dentro un
 * telefono la navigazione è uno stack, e tenerlo qui evita che il frame si
 * rimonti a ogni passo. Ogni schermata ha una via d'uscita — è la condizione
 * di "finito" del §8.B: nessun vicolo cieco.
 *
 * Lo stato della demo (sessioni usate, appuntamenti) vive nel provider, che è
 * un modulo: un ricaricamento della pagina lo ricrea da zero e riporta tutto
 * ai valori del §6. Non serve nessun pulsante di reset a schermo.
 */

type Screen =
  | "welcome"
  | "assessment"
  | "generating"
  | "home"
  | "booking"
  | "doctor"
  | "call";

export default function EmployeeAppPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [bookingProfessionalId, setBookingProfessionalId] = useState<
    string | undefined
  >(undefined);

  const employee = dataProvider.getEmployeeProfile();
  const appointments = dataProvider.getAppointments();
  const nextAppointment = appointments[0];
  const callProfessional = nextAppointment
    ? dataProvider.getProfessionalById(nextAppointment.professionalId)
    : undefined;

  const goHome = () => {
    setBookingProfessionalId(undefined);
    setScreen("home");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <PhoneFrame>
        {screen === "welcome" ? (
          <Welcome onStart={() => setScreen("assessment")} />
        ) : null}

        {screen === "assessment" ? (
          <Assessment
            onComplete={() => setScreen("generating")}
            onSkip={() => setScreen("generating")}
          />
        ) : null}

        {screen === "generating" ? (
          <Generating
            profile={employee.healthProfile}
            onDone={() => setScreen("home")}
          />
        ) : null}

        {screen === "home" ? (
          <Home
            onBook={() => setScreen("booking")}
            onDoctor={() => setScreen("doctor")}
            onJoinCall={callProfessional ? () => setScreen("call") : undefined}
          />
        ) : null}

        {screen === "booking" ? (
          <Booking
            initialProfessionalId={bookingProfessionalId}
            onBack={goHome}
            onDone={goHome}
          />
        ) : null}

        {screen === "doctor" ? (
          <DoctorChat
            onBack={goHome}
            onBook={() => {
              setBookingProfessionalId("meier");
              setScreen("booking");
            }}
          />
        ) : null}

        {screen === "call" ? (
          callProfessional ? (
            <VideoCall professional={callProfessional} onEnd={goHome} />
          ) : (
            /* Non dovrebbe capitare: senza appuntamento la home non offre
               l'ingresso alla sessione. Se capita, si torna indietro. */
            <div className="flex h-full flex-col">
              <AppBar title={it.call.inCall} onBack={goHome} />
              <div className="p-6">
                <Button className="w-full rounded-pill" onClick={goHome}>
                  {it.app.backToHome}
                </Button>
              </div>
            </div>
          )
        ) : null}
      </PhoneFrame>
    </div>
  );
}
