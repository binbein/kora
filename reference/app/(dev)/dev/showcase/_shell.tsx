import type { ReactNode } from "react";

/*
 * Impalcatura della pagina di controllo interna (CLAUDE.md §8).
 * Non è codice di prodotto: vive qui, non in `components/`, e il suo testo
 * non passa da `it.ts` perché non è interfaccia da tradurre.
 */

export function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-gray-200 py-12">
      <h2 className="text-xl font-semibold text-petrol-900">{title}</h2>
      {note ? <p className="mt-1 max-w-2xl text-gray-600">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
      {children}
    </h3>
  );
}

/** Riquadro attorno a un campione, con la sua etichetta sotto. */
export function Specimen({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="rounded-card border border-gray-200 p-4">{children}</div>
      <p className="mt-2 text-xs text-gray-500">{label}</p>
    </div>
  );
}
