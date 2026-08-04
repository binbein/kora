import { Lock } from "lucide-react";
import { it, t } from "@/lib/i18n/it";
import { ANONYMITY_THRESHOLD } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/*
 * La privacy è un argomento di vendita, non una nota a piè di pagina (§4.4):
 * questa riga resta sempre visibile in dashboard.
 */
export function PrivacyNote({
  threshold = ANONYMITY_THRESHOLD,
  className,
}: {
  threshold?: number;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-gray-600",
        className,
      )}
    >
      <Lock className="size-3.5 shrink-0" aria-hidden="true" />
      {t(it.hr.privacyNote, { threshold })}
    </p>
  );
}
