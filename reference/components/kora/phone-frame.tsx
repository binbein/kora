"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Cornice telefono per mostrare il percorso dipendente da desktop (§8.B).
 * L'app dentro è disegnata su 390px e resta 390px: quello che cambia da
 * schermo grande è solo l'ingrandimento.
 *
 * L'ingrandimento usa `zoom` e non `transform: scale`. Con zoom il layout si
 * ricalcola alla misura finale, quindi il testo viene disegnato grande invece
 * di essere una immagine stirata: durante un pitch, su un proiettore, la
 * differenza fra le due cose si vede. In cambio non serve riservare lo spazio
 * a mano, perché l'elemento occupa davvero la sua misura ingrandita.
 *
 * L'ingrandimento è calcolato sull'altezza della finestra, non fisso.
 * Un valore fisso ingrandiva più di quanto lo schermo potesse contenere: a
 * 1280×800 restavano fuori 314px, e per arrivare ai controlli in fondo al
 * telefono bisognava prima scorrere la pagina e poi scorrere dentro il
 * telefono — due aree di scorrimento annidate, in una demo dal vivo.
 * Adesso la cornice si adatta e la pagina non scorre mai: chi presenta ha
 * una cosa sola da muovere.
 *
 * Su schermo stretto la cornice sparisce e resta il contenuto: è la stessa
 * app, non una versione ridotta.
 */

/** Non ingrandire oltre: più grande di così il telefono non sembra un telefono. */
const MAX_ZOOM = 1.35;

/** Sotto questa soglia si smette di rimpicciolire e si accetta lo scorrimento. */
const MIN_ZOOM = 0.8;

/** Il breakpoint `lg` di Tailwind: sotto, nessun ingrandimento. */
const DESKTOP_FROM_PX = 1024;

/** Il bordo della cornice (`sm:border-8`), sopra e sotto. */
const FRAME_BORDER_PX = 8;

/** Lo spazio verticale che la pagina lascia attorno (`sm:py-10`). */
const PAGE_PADDING_PX = 80;

function fittedZoom(screenHeight: number): number | undefined {
  if (window.innerWidth < DESKTOP_FROM_PX) return undefined;

  const naturalHeight = screenHeight + FRAME_BORDER_PX * 2;
  const available = window.innerHeight - PAGE_PADDING_PX;

  /*
   * Arrotondato per difetto al centesimo: arrotondando per eccesso la
   * cornice supererebbe di un pixel o due l'altezza disponibile, e
   * ricomparirebbe la barra di scorrimento che stiamo togliendo.
   */
  const exact = available / naturalHeight;
  const zoom = Math.floor(exact * 100) / 100;

  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function PhoneFrame({
  children,
  /** Altezza dello schermo simulato, in px alla misura nativa. */
  screenHeight = 780,
  className,
}: {
  children: ReactNode;
  screenHeight?: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  /*
   * Lo zoom si scrive sul nodo invece di passare da uno stato React: è una
   * misura, non un dato: tenerla nello stato significherebbe un render in
   * più a ogni pixel di ridimensionamento della finestra.
   *
   * `useLayoutEffect` applica il valore prima che il browser dipinga, così
   * non si vede la cornice alla misura nativa per un fotogramma.
   */
  useLayoutEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const apply = () => {
      const zoom = fittedZoom(screenHeight);
      node.style.zoom = zoom === undefined ? "" : String(zoom);
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [screenHeight]);

  return (
    <div
      ref={frameRef}
      className={cn(
        "mx-auto w-full max-w-[390px] sm:rounded-[2.5rem] sm:border-8 sm:border-gray-900 sm:shadow-lg",
        className,
      )}
    >
      <div
        className="w-full overflow-y-auto overscroll-contain bg-white sm:rounded-[2rem]"
        style={{ height: screenHeight }}
      >
        {children}
      </div>
    </div>
  );
}
