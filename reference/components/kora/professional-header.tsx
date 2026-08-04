import { professionalDisplayName, type Professional } from "@/lib/data/types";
import { it, t } from "@/lib/i18n/it";
import { InitialsAvatar } from "./initials-avatar";
import { Wordmark } from "./wordmark";

/*
 * Header del portale professionista (§8.D). Stesso fondo petrolio della
 * dashboard HR: sono due strumenti di lavoro, e devono somigliarsi.
 *
 * A destra c'è chi ha effettuato l'accesso, che è l'informazione che manca
 * all'header della dashboard e serve qui: il portale mostra i compensi di una
 * persona precisa, e deve essere evidente di chi.
 */
export function ProfessionalHeader({
  professional,
}: {
  professional: Professional;
}) {
  return (
    <header className="bg-petrol-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <Wordmark />
        <p className="text-teal-200">{it.pro.portalName}</p>

        <div className="ml-auto flex items-center gap-2.5">
          <InitialsAvatar name={professional.lastName} size="sm" />
          <p>
            {t(it.pro.headerSubtitle, {
              name: professionalDisplayName(professional),
              specialty: it.domain.specialty[professional.specialty],
            })}
          </p>
        </div>
      </div>
    </header>
  );
}
