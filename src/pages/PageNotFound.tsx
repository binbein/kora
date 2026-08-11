import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import KoraLogo from "@/components/shared/KoraLogo";
import { interpolate, t } from "@/lib/i18n";

/*
 * La 404 (CLAUDE.md §10).
 *
 * Convertita in `.tsx` con le sue stringhe in `i18n` quando il blocco
 * accessibilità di M5 le ha messo mano: è la regola del §3, si converte il
 * giorno in cui qualcuno la tocca.
 *
 * L'indirizzo non porta più il proprio `<span>` colorato. La frase è una sola
 * con un segnaposto, come vuole il §2.7 — cucirla attorno a un elemento inline
 * l'avrebbe spezzata in due pezzi, e in tedesco l'indirizzo non cade dove cade
 * in italiano. È un cambio di stile, non di copy (founder, 11.08.2026).
 */
export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <KoraLogo size="sm" />
        </div>

        <div className="space-y-2">
          <p className="text-7xl font-light font-display text-muted-foreground/40">
            404
          </p>
          <div className="h-0.5 w-16 bg-border mx-auto" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold font-display">
            {t.notFound.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {interpolate(t.notFound.body, { path: location.pathname })}
          </p>
        </div>

        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            {t.notFound.home}
          </Link>
        </Button>
      </div>
    </div>
  );
}
