"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { HealthScoreCard } from "@/components/kora/health-score-card";
import { Button } from "@/components/ui/button";
import type { HealthProfile } from "@/lib/data/types";
import { formatNumber } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Onboarding (§8.B.1): benvenuto → dieci domande → generazione del profilo.
 *
 * Il ritmo è la cosa che conta. Un tocco sulla risposta avanza da solo, senza
 * pulsante "avanti": il flusso completo si percorre in una ventina di secondi,
 * che è quanto vale la pena spenderci in una presentazione. La risposta resta
 * evidenziata per un istante prima di passare oltre, così il tocco si vede.
 *
 * "Salta all'esito" è volutamente in secondo piano — testo, non pulsante —
 * perché serve a chi presenta col tempo contato, non al dipendente.
 */

const ANSWER_FEEDBACK_MS = 160;

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="pt-10">
        <p className="text-xs font-medium tracking-[0.18em] text-petrol-700 uppercase">
          KORA
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-petrol-900">
          {it.onboarding.welcomeTitle}
        </h1>
        <p className="mt-3 text-gray-600">{it.onboarding.welcomeBody}</p>

        <p className="mt-6 flex items-start gap-2 rounded-card-app bg-teal-50 px-3.5 py-3 text-xs text-petrol-800">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {it.hr.privacyNote.replace("{threshold}", "15")}
        </p>
      </div>

      <Button className="h-11 w-full rounded-pill" onClick={onStart}>
        {it.onboarding.welcomeAction}
      </Button>
    </div>
  );
}

export function Assessment({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) {
  const questions = it.assessment.questions;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | undefined>(undefined);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  /*
   * L'avanzamento parte dal tocco, non da un effetto.
   *
   * Con un effetto il timer veniva riprogrammato a ogni render del genitore —
   * le callback che questa schermata riceve sono funzioni nuove ogni volta —
   * e il primo tocco su ogni domanda andava perso: servivano due tocchi per
   * avanzare di uno. Qui il timer nasce dall'evento e nessun render lo tocca.
   */
  const answer = (answerIndex: number) => {
    if (picked !== undefined) return;
    setPicked(answerIndex);

    const isLast = index + 1 >= questions.length;
    advanceTimer.current = setTimeout(() => {
      setPicked(undefined);
      if (isLast) onComplete();
      else setIndex(index + 1);
    }, ANSWER_FEEDBACK_MS);
  };

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="flex h-full flex-col p-6">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-teal-200"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label={t(it.onboarding.progress, {
          current: formatNumber(index + 1),
          total: formatNumber(questions.length),
        })}
      >
        <div
          className="h-full rounded-full bg-petrol-700 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {t(it.onboarding.progress, {
          current: formatNumber(index + 1),
          total: formatNumber(questions.length),
        })}
      </p>

      <h1 className="mt-8 text-xl font-medium text-petrol-900">
        {questions[index]}
      </h1>

      <div className="mt-6 space-y-2.5">
        {it.assessment.scale.map((label, answerIndex) => (
          <button
            key={label}
            type="button"
            onClick={() => answer(answerIndex)}
            className={cn(
              "w-full rounded-pill border px-4 py-3 text-left transition-colors",
              picked === answerIndex
                ? "border-petrol-700 bg-petrol-700 text-white"
                : "border-gray-300 text-gray-700 hover:bg-teal-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="mt-auto self-center py-2 text-xs text-gray-400 underline underline-offset-4 transition-colors hover:text-petrol-700"
      >
        {it.onboarding.skipToResult}
      </button>
    </div>
  );
}

const GENERATING_STEP_MS = 550;

export function Generating({
  profile,
  onDone,
}: {
  profile: HealthProfile;
  onDone: () => void;
}) {
  const steps = [
    it.onboarding.generatingStepAnswers,
    it.onboarding.generatingStepAreas,
    it.onboarding.generatingStepProfile,
  ];
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= steps.length) return;
    const timer = setTimeout(() => setDone(done + 1), GENERATING_STEP_MS);
    return () => clearTimeout(timer);
  }, [done, steps.length]);

  const ready = done >= steps.length;

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="pt-10">
        <h1 className="text-xl font-medium text-petrol-900">
          {ready ? it.onboarding.resultTitle : it.onboarding.generatingTitle}
        </h1>

        <ul className="mt-6 space-y-3">
          {steps.map((step, stepIndex) => {
            const complete = stepIndex < done;
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2.5 transition-opacity duration-300",
                  complete ? "opacity-100" : "opacity-35",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    complete
                      ? "border-petrol-700 bg-petrol-700 text-white"
                      : "border-gray-300",
                  )}
                  aria-hidden="true"
                >
                  {complete ? <Check className="size-3" /> : null}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "mt-8 transition-all duration-500",
            ready ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <HealthScoreCard profile={profile} />
        </div>
      </div>

      <Button
        className="h-11 w-full rounded-pill"
        disabled={!ready}
        onClick={onDone}
      >
        {it.onboarding.resultAction}
      </Button>
    </div>
  );
}
