import { cn } from "@/lib/utils";

/*
 * Avatar a iniziali su teal-50 (§6): niente foto stock di persone, così
 * non si aprono questioni di licenza e il risultato è più pulito.
 *
 * Riceve il nome così come lo conosce il dominio, non nome e cognome
 * separati: dei professionisti il §6 dà solo il cognome, e inventare un nome
 * proprio per riempire due iniziali sarebbe dato finto non richiesto.
 */

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-base",
  lg: "size-12 text-lg",
} as const;

export type InitialsAvatarSize = keyof typeof SIZES;

/** Prime lettere di al massimo due parole: "Laura Bernasconi" → LB, "Colombo" → C. */
function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export function InitialsAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: InitialsAvatarSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-teal-50 font-medium text-petrol-800",
        SIZES[size],
        className,
      )}
      /*
       * Le iniziali sono decorative: il nome per esteso è sempre accanto
       * nell'interfaccia, quindi ripeterlo qui sarebbe rumore per lo screen reader.
       */
      aria-hidden="true"
    >
      {toInitials(name)}
    </span>
  );
}
