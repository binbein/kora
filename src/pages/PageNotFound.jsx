import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import KoraLogo from '@/components/shared/KoraLogo';

export default function PageNotFound() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <KoraLogo size="sm" />
                </div>

                <div className="space-y-2">
                    <p className="text-7xl font-light font-display text-muted-foreground/40">404</p>
                    <div className="h-0.5 w-16 bg-border mx-auto" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold font-display">Pagina non trovata</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        L&apos;indirizzo <span className="font-medium text-foreground">{location.pathname}</span> non
                        corrisponde a nessuna pagina.
                    </p>
                </div>

                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link to="/">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Torna alla home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
