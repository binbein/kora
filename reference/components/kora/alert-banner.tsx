import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Banner di alert della dashboard HR (§8.A.2). Tono professionale, terza
 * persona: "Alert precoce — reparto Vendite".
 *
 * warn e danger sono rari per scelta (§4.1): se questo banner diventa
 * abituale, ha perso la sua funzione.
 */

export type AlertVariant = "warn" | "danger";

const VARIANT_STYLES: Record<AlertVariant, string> = {
  warn: "border-warn/50 bg-warn-bg text-warn-dark",
  danger: "border-danger/50 bg-danger-bg text-danger-text",
};

const ICON_STYLES: Record<AlertVariant, string> = {
  warn: "text-warn-dark",
  danger: "text-danger-text",
};

export function AlertBanner({
  variant = "warn",
  title,
  description,
  action,
  className,
}: {
  variant?: AlertVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-card border px-4 py-3",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      <AlertTriangle
        className={cn("mt-0.5 size-4 shrink-0", ICON_STYLES[variant])}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        {description ? <p className="mt-0.5">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
