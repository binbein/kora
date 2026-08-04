"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * Numero che raggiunge il nuovo valore invece di saltarci (§8.C.2).
 *
 * Anima solo i cambiamenti, mai il primo render: il valore iniziale è già
 * quello giusto sia nell'HTML statico sia dopo l'idratazione, quindi non c'è
 * nessun momento in cui la pagina mostra uno zero che poi si arrampica.
 *
 * Chi ha chiesto meno animazioni al sistema operativo vede il valore
 * cambiare di colpo: `prefers-reduced-motion` non è una preferenza estetica.
 *
 * La formattazione arriva da fuori, come per StatCard: questo componente
 * conta, non sa se sta contando franchi o giorni.
 */

const DURATION_MS = 420;

export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  /** Di norma una funzione di format.ts, es. `formatCHF` */
  format: (value: number) => string;
  className?: string;
}) {
  const [shown, setShown] = useState(value);

  /*
   * L'ultimo valore disegnato, non l'ultimo richiesto: se il cursore si muove
   * mentre l'animazione è in corso, la successiva riparte da dove si vede
   * adesso e non da dove sarebbe dovuta arrivare.
   */
  const shownRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /*
     * Con le animazioni ridotte la durata è zero e il primo frame porta già
     * al valore finale. Passare comunque dal frame invece di aggiornare lo
     * stato qui dentro evita il render a cascata che React sconsiglia, e
     * tiene un percorso solo da leggere invece di due.
     */
    const duration = reducedMotion ? 0 : DURATION_MS;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress =
        duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
      // ease-out cubica: parte veloce e si posa, invece di frenare di colpo
      const eased = 1 - (1 - progress) ** 3;
      const next = progress === 1 ? value : from + (value - from) * eased;

      shownRef.current = next;
      setShown(next);

      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== undefined)
        cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <span className={cn("tabular-nums", className)}>{format(shown)}</span>;
}
