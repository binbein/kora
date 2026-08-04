"use client";

import { Star } from "lucide-react";
import { professionalDisplayName, type Professional } from "@/lib/data/types";
import { formatRating, type Locale, DEFAULT_LOCALE } from "@/lib/format";
import { formatList, it, t } from "@/lib/i18n/it";
import { cn } from "@/lib/utils";
import { InitialsAvatar } from "./initials-avatar";

/*
 * Card professionista in prenotazione (§8.B.3). Registro app.
 *
 * Le lingue si compongono con Intl.ListFormat, non con `join(", ")`:
 * la congiunzione finale cambia da lingua a lingua.
 */
export function ProfessionalCard({
  professional,
  selected = false,
  onSelect,
  locale = DEFAULT_LOCALE,
  className,
}: {
  professional: Professional;
  selected?: boolean;
  onSelect?: (professional: Professional) => void;
  locale?: Locale;
  className?: string;
}) {
  const { firstName, lastName, specialty, languages, rating } = professional;
  const fullName = professionalDisplayName(professional);
  const avatarName = [firstName, lastName].filter(Boolean).join(" ");
  const languageNames = languages.map((code) => it.domain.language[code]);

  const content = (
    <>
      <InitialsAvatar name={avatarName} size="lg" />
      <div className="min-w-0 flex-1 text-left">
        <p className="font-medium text-petrol-900">{fullName}</p>
        <p className="mt-0.5 text-gray-600">{it.domain.specialty[specialty]}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {t(it.app.professionalLanguages, {
            languages: formatList(languageNames, locale),
          })}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Star className="size-3.5 fill-current text-warn" aria-hidden="true" />
        <span className="font-medium text-petrol-900 tabular-nums">
          {formatRating(rating, locale)}
        </span>
        <span className="sr-only">
          {t(it.app.professionalRating, {
            rating: formatRating(rating, locale),
          })}
        </span>
      </div>
    </>
  );

  const shared = cn(
    "rounded-card-app flex w-full items-start gap-3.5 border px-4 py-4 transition-colors",
    selected ? "border-petrol-700 bg-teal-50" : "border-gray-200 bg-white",
    className,
  );

  if (!onSelect) {
    return <div className={shared}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(professional)}
      aria-pressed={selected}
      className={cn(shared, "text-left hover:border-petrol-700")}
    >
      {content}
    </button>
  );
}
