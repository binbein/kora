import { Link } from "react-router-dom";
import KoraLogo from "@/components/shared/KoraLogo";
import { Shield, MapPin } from "lucide-react";
import { useReferenceDate } from "@/lib/data/queries";
import { interpolate, t } from "@/lib/i18n";

/*
 * Le voci senza destinazione — "Chi siamo", "Contatti", "Carriere", "Blog" e i
 * tre documenti legali — restano come elenco di sezioni previste, e sono le
 * uniche righe di questo file che non sono `<Link>`.
 *
 * Nel codice ereditato erano `<p>` con `cursor-pointer` e hover: non link
 * rotti in senso tecnico, ma a schermo si comportavano da link e non
 * portavano da nessuna parte, che è la definizione di vicolo cieco del §10 —
 * e il footer sta su tutte e quattro le rotte pubbliche. Creare le pagine
 * sarebbe scope nuovo (§2.6), quindi i founder hanno deciso l'08.08.2026 di
 * togliere l'affordance e lasciare il testo. Le pagine vere sono M5.
 */
export default function Footer() {
  const { data: referenceDate } = useReferenceDate();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <KoraLogo size="sm" light />
            <p className="text-sm opacity-70 leading-relaxed">
              {t.public.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm opacity-60">
              <MapPin className="w-4 h-4" />
              <span>{t.public.footer.city}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">
              {t.public.footer.platformTitle}
            </h4>
            <Link
              to="/pricing"
              className="block text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.public.footer.platformPricing}
            </Link>
            <Link
              to="/roi"
              className="block text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.public.footer.platformRoi}
            </Link>
            <Link
              to="/employee"
              className="block text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.public.footer.platformEmployee}
            </Link>
            <Link
              to="/hr"
              className="block text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.public.footer.platformHr}
            </Link>
            <Link
              to="/professional"
              className="block text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              {t.public.footer.platformProfessional}
            </Link>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">
              {t.public.footer.companyTitle}
            </h4>
            <p className="text-sm opacity-80">{t.public.footer.companyAbout}</p>
            <p className="text-sm opacity-80">
              {t.public.footer.companyContact}
            </p>
            <p className="text-sm opacity-80">
              {t.public.footer.companyCareers}
            </p>
            <p className="text-sm opacity-80">{t.public.footer.companyBlog}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60">
              {t.public.footer.privacyTitle}
            </h4>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 opacity-60" />
              <p className="text-sm opacity-80 leading-relaxed">
                {t.public.footer.privacyBody}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* L'anno viene dalla data della demo: nessun componente chiama new Date() (§5.4). */}
          <p className="text-xs opacity-50">
            {referenceDate
              ? interpolate(t.public.footer.copyright, {
                  year: String(referenceDate.getFullYear()),
                })
              : null}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <p className="text-xs opacity-50">{t.public.footer.legalPrivacy}</p>
            <p className="text-xs opacity-50">{t.public.footer.legalTerms}</p>
            <p className="text-xs opacity-50">{t.public.footer.legalCookies}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
