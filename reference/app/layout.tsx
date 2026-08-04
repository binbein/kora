import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { it } from "@/lib/i18n/it";

/*
 * Font self-hosted via next/font: nessuna richiesta esterna a runtime (§3).
 * Inter è il font di UI e dashboard; Source Serif 4 serve solo ai titoli
 * display della landing, quindi resta disponibile ma non applicato al body.
 *
 * Nota: `shadcn init` aggiunge di sua iniziativa il font Geist su
 * `--font-sans`. È stato rimosso: §4.2 ammette solo Inter e Source Serif 4.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

/*
 * Da dove si risolvono gli URL assoluti dell'anteprima.
 *
 * Senza questa base Next li costruisce su `localhost:3000`: il link
 * condiviso porterebbe l'anteprima a cercare l'immagine sulla macchina di
 * chi lo apre, e non si vedrebbe niente.
 *
 * Vercel espone il dominio di produzione al momento del build, quindi in
 * produzione il valore è giusto senza configurare nulla; `NEXT_PUBLIC_SITE_URL`
 * resta come scavalco per un dominio proprio. Nessuno dei due è un segreto:
 * è l'indirizzo pubblico del sito.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/*
 * L'anteprima del link conta quanto la schermata: la demo viene mandata agli
 * investitori per email e messaggio, e senza questi dati arriva come un
 * rettangolo vuoto con dentro un URL.
 *
 * L'immagine non è dichiarata qui: la genera `opengraph-image.tsx`, e Next
 * aggiunge da sé i tag con misure e tipo.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: it.meta.title,
  description: it.meta.description,
  openGraph: {
    title: it.meta.title,
    description: it.meta.description,
    siteName: it.meta.title,
    locale: "it_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: it.meta.title,
    description: it.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it-CH" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
