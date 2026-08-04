import { cn } from "@/lib/utils";
import { it } from "@/lib/i18n/it";

/*
 * Logotipo testuale. Eredita il colore dal contenitore (`currentColor`),
 * così funziona sia sull'header petrolio sia su fondo bianco senza varianti.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-lg font-semibold tracking-[0.18em]", className)}
      aria-label={it.common.appName}
    >
      {it.common.appName}
    </span>
  );
}
