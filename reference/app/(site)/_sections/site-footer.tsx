import Link from "next/link";
import { Wordmark } from "@/components/kora/wordmark";
import { it } from "@/lib/i18n/it";

/*
 * Footer sobrio (§8.C.4): marchio, posizionamento, la nota che questa è una
 * demo e i tre percorsi che la compongono.
 *
 * I percorsi non sono link di prodotto ed è la loro etichetta a dirlo: chi
 * riceve il link della demo deve poter arrivare da solo alla dashboard, al
 * percorso dipendente e al portale del professionista, senza che la landing
 * sembri offrire l'accesso a un'area riservata. Restano gli unici link della
 * pagina — verso schermate che esistono davvero.
 *
 * Sono anche il modo in cui la demo va navigata: il provider vive in memoria,
 * quindi questi link mantengono lo stato mentre digitare l'indirizzo ricarica
 * la pagina e azzera le prenotazioni fatte durante la presentazione (§8.D).
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <Wordmark className="text-petrol-900" />
        <p className="mt-3 text-gray-600">{it.site.footer.tagline}</p>
        <p className="mt-1 text-xs text-gray-500">{it.site.footer.demoNote}</p>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span>{it.site.footer.demoPathsLabel}</span>
          <Link href="/hr" className="text-petrol-700 hover:underline">
            {it.site.footer.demoPathHr}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/app" className="text-petrol-700 hover:underline">
            {it.site.footer.demoPathApp}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/pro" className="text-petrol-700 hover:underline">
            {it.site.footer.demoPathPro}
          </Link>
        </p>
      </div>
    </footer>
  );
}
