import { AppRegisterSection } from "./_section-app";
import { FormattingSection } from "./_section-formatting";
import { HrRegisterSection } from "./_section-hr";
import { StatesSection } from "./_section-states";
import {
  ColorsSection,
  ContrastSection,
  RadiiSection,
  TypographySection,
} from "./_section-tokens";

/*
 * Pagina di controllo interna (CLAUDE.md §8): tutti i componenti base montati
 * in un posto solo, da mostrare a un occhio esterno prima di costruire le
 * schermate.
 *
 * Non è una schermata di prodotto. Il suo testo sta nei file di sezione e non
 * in `it.ts`, perché non è interfaccia da tradurre; i valori di esempio
 * vengono invece dal provider, come in ogni altra schermata (§5), così i
 * provini non possono raccontare numeri diversi da quelli della demo.
 */

const INDEX = [
  { href: "#colori", label: "Colori" },
  { href: "#contrasti", label: "Contrasti" },
  { href: "#tipografia", label: "Tipografia" },
  { href: "#raggi", label: "Raggi" },
  { href: "#formattazione", label: "Formattazione" },
  { href: "#registro-hr", label: "Registro HR" },
  { href: "#registro-app", label: "Registro app" },
  { href: "#stati", label: "Stati" },
];

export default function ShowcasePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-12 pb-24 sm:px-8 sm:pt-16">
      <header>
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          KORA · pagina interna
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-petrol-900">
          Design system
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Token congelati del §4 e tutti i componenti base nei due registri. La
          palette e le scale di default di Tailwind sono azzerate, quindi le
          utility fuori da questi valori non generano CSS e l&apos;elemento
          resta visibilmente non stilato, invece di introdurre di nascosto un
          colore fuori dal design system.
        </p>
        {/*
         * Gli esempi stanno in un paragrafo a parte, con testi brevissimi fra
         * un <code> e l'altro: quando il testo dopo un elemento va a capo, SWC
         * ne mangia lo spazio iniziale e le parole si attaccano.
         */}
        <p className="mt-2 max-w-2xl text-gray-600">
          Vale per <code>bg-red-500</code>, <code>font-bold</code>,{" "}
          <code>text-4xl</code>, <code>rounded-2xl</code>.
        </p>

        <nav aria-label="Sezioni" className="mt-6 flex flex-wrap gap-2">
          {INDEX.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              className="rounded-chip border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-teal-50 hover:text-petrol-800"
            >
              {entry.label}
            </a>
          ))}
        </nav>
      </header>

      <ColorsSection />
      <ContrastSection />
      <TypographySection />
      <RadiiSection />
      <FormattingSection />
      <HrRegisterSection />
      <AppRegisterSection />
      <StatesSection />
    </main>
  );
}
