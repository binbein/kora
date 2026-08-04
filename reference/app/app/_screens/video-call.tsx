"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { InitialsAvatar } from "@/components/kora/initials-avatar";
import { Button } from "@/components/ui/button";
import { professionalDisplayName, type Professional } from "@/lib/data/types";
import { it } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";

/*
 * Videochiamata simulata (§8.B.5). Nessun accesso a camera o microfono: è una
 * scena, e i controlli cambiano solo il proprio stato.
 *
 * Card petrolio a tutta altezza, avatar a iniziali al centro, timer che parte
 * dopo una connessione breve — abbastanza da sembrare vera, non abbastanza da
 * far aspettare chi guarda.
 */

const CONNECTING_MS = 900;

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function VideoCall({
  professional,
  onEnd,
}: {
  professional: Professional;
  onEnd: () => void;
}) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setConnected(true), CONNECTING_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [connected]);

  const name = professionalDisplayName(professional);

  return (
    <div className="flex h-full flex-col justify-between bg-petrol-900 p-6 text-white">
      <div className="pt-6 text-center">
        <p className="text-xs tracking-wide text-teal-200 uppercase">
          {connected ? it.call.inCall : it.call.connecting}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {connected ? formatDuration(seconds) : "—"}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <InitialsAvatar
          name={[professional.firstName, professional.lastName]
            .filter(Boolean)
            .join(" ")}
          size="lg"
          className={cn(
            "size-24 text-2xl transition-opacity duration-500",
            connected ? "opacity-100" : "opacity-60",
          )}
        />
        <p className="mt-4 text-lg">{name}</p>
        {/* La specialità, non di nuovo il nome: sopra c'è già. */}
        <p className="mt-0.5 text-xs text-teal-200">
          {it.domain.specialty[professional.specialty]}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pb-4">
        <ControlButton
          label={muted ? it.call.muteOff : it.call.muteOn}
          active={muted}
          onClick={() => setMuted((value) => !value)}
        >
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </ControlButton>

        <ControlButton
          label={cameraOff ? it.call.videoOff : it.call.videoOn}
          active={cameraOff}
          onClick={() => setCameraOff((value) => !value)}
        >
          {cameraOff ? (
            <VideoOff className="size-5" />
          ) : (
            <Video className="size-5" />
          )}
        </ControlButton>

        <Button
          onClick={onEnd}
          aria-label={it.call.end}
          className="size-12 rounded-full bg-danger p-0 text-white hover:bg-danger-text"
        >
          <PhoneOff className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-12 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-white text-petrol-900"
          : "bg-petrol-800 text-white hover:bg-petrol-700",
      )}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
