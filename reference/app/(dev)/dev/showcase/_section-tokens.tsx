import { Section, SubHeading } from "./_shell";

/*
 * Sezioni dei token: colori, contrasti, tipografia, raggi.
 * È l'unico posto in cui i valori del §4 compaiono in chiaro — serve
 * proprio a leggerli.
 */

// --- Contrasto (WCAG 2.1) -------------------------------------------------

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

// --- Dati dei token -------------------------------------------------------

type Swatch = { token: string; hex: string; usage: string };

const PETROL: Swatch[] = [
  {
    token: "petrol-900",
    hex: "#04342C",
    usage: "header, testi su tinte chiare, card scura app",
  },
  {
    token: "petrol-800",
    hex: "#085041",
    usage: "pulsanti primari scuri, hover",
  },
  {
    token: "petrol-700",
    hex: "#0F6E56",
    usage: "pulsanti primari, testi di accento, icone attive",
  },
];

const TEAL: Swatch[] = [
  {
    token: "teal-500",
    hex: "#1D9E75",
    usage: "barre dati, stati positivi/medi",
  },
  {
    token: "teal-300",
    hex: "#5DCAA5",
    usage: "barre dati leggere, accenti secondari",
  },
  {
    token: "teal-200",
    hex: "#9FE1CB",
    usage: "tracce progress, testi secondari su petrolio",
  },
  { token: "teal-50", hex: "#E1F5EE", usage: "tinte di sfondo, chip, avatar" },
];

const WARN: Swatch[] = [
  { token: "warn", hex: "#EF9F27", usage: "bordo e icona degli alert" },
  { token: "warn-bg", hex: "#FAEEDA", usage: "fondo del banner alert" },
  { token: "warn-text", hex: "#854F0B", usage: "testo su warn-bg" },
  { token: "warn-dark", hex: "#633806", usage: "testo enfatico su warn-bg" },
];

const DANGER: Swatch[] = [
  { token: "danger", hex: "#E24B4A", usage: "barra reparto in stato critico" },
  { token: "danger-bg", hex: "#FCEBEB", usage: "fondo degli stati critici" },
  { token: "danger-text", hex: "#A32D2D", usage: "testo su danger-bg" },
];

/*
 * Le classi vanno scritte per intero: Tailwind scansiona il sorgente come
 * testo, quindi una classe composta a runtime non verrebbe mai generata.
 */
const NEUTRAL_STEPS: { step: string; className: string }[] = [
  { step: "50", className: "bg-gray-50" },
  { step: "100", className: "bg-gray-100" },
  { step: "200", className: "bg-gray-200" },
  { step: "300", className: "bg-gray-300" },
  { step: "400", className: "bg-gray-400" },
  { step: "500", className: "bg-gray-500" },
  { step: "600", className: "bg-gray-600" },
  { step: "700", className: "bg-gray-700" },
  { step: "800", className: "bg-gray-800" },
  { step: "900", className: "bg-gray-900" },
  { step: "950", className: "bg-gray-950" },
];

const PAIRS: { label: string; fg: string; bg: string; fgToken: string }[] = [
  {
    label: "testo su teal-50",
    fg: "#04342C",
    bg: "#E1F5EE",
    fgToken: "petrol-900",
  },
  {
    label: "testo su teal-50",
    fg: "#085041",
    bg: "#E1F5EE",
    fgToken: "petrol-800",
  },
  {
    label: "testo su teal-200",
    fg: "#04342C",
    bg: "#9FE1CB",
    fgToken: "petrol-900",
  },
  {
    label: "testo su teal-300",
    fg: "#04342C",
    bg: "#5DCAA5",
    fgToken: "petrol-900",
  },
  {
    label: "testo su teal-500",
    fg: "#04342C",
    bg: "#1D9E75",
    fgToken: "petrol-900",
  },
  {
    label: "testo su bianco",
    fg: "#0F6E56",
    bg: "#FFFFFF",
    fgToken: "petrol-700",
  },
  {
    label: "testo su petrol-900",
    fg: "#FFFFFF",
    bg: "#04342C",
    fgToken: "bianco",
  },
  {
    label: "testo su petrol-800",
    fg: "#FFFFFF",
    bg: "#085041",
    fgToken: "bianco",
  },
  {
    label: "testo su petrol-700",
    fg: "#FFFFFF",
    bg: "#0F6E56",
    fgToken: "bianco",
  },
  {
    label: "testo secondario su petrol-900",
    fg: "#9FE1CB",
    bg: "#04342C",
    fgToken: "teal-200",
  },
  {
    label: "testo su warn-bg",
    fg: "#854F0B",
    bg: "#FAEEDA",
    fgToken: "warn-text",
  },
  {
    label: "testo su warn-bg",
    fg: "#633806",
    bg: "#FAEEDA",
    fgToken: "warn-dark",
  },
  {
    label: "testo su danger-bg",
    fg: "#A32D2D",
    bg: "#FCEBEB",
    fgToken: "danger-text",
  },
];

const TYPE_SCALE: {
  token: string;
  px: number;
  usage: string;
  className: string;
}[] = [
  {
    token: "text-xs",
    px: 12,
    usage: "note, etichette di legenda",
    className: "text-xs",
  },
  {
    token: "text-sm",
    px: 13,
    usage: "testo secondario, didascalie",
    className: "text-sm",
  },
  { token: "text-base", px: 14, usage: "base UI", className: "text-base" },
  {
    token: "text-lg",
    px: 16,
    usage: "testo di lettura, titoli di card",
    className: "text-lg",
  },
  {
    token: "text-xl",
    px: 20,
    usage: "titoli di sezione",
    className: "text-xl",
  },
  {
    token: "text-2xl",
    px: 24,
    usage: "valori KPI, titoli di pagina",
    className: "text-2xl",
  },
  {
    token: "text-3xl",
    px: 32,
    usage: "numeri di impatto, hero",
    className: "text-3xl",
  },
];

const RADII: {
  token: string;
  value: string;
  usage: string;
  className: string;
}[] = [
  {
    token: "rounded-chip",
    value: "8px",
    usage: "chip e badge — registro HR",
    className: "rounded-chip",
  },
  {
    token: "rounded-btn",
    value: "8px",
    usage: "pulsanti — registro HR + landing",
    className: "rounded-btn",
  },
  {
    token: "rounded-card",
    value: "10px",
    usage: "card — registro HR + landing",
    className: "rounded-card",
  },
  {
    token: "rounded-card-app",
    value: "20px",
    usage: "card — registro app dipendente",
    className: "rounded-card-app",
  },
  {
    token: "rounded-pill",
    value: "9999px",
    usage: "pulsanti e chip — registro app dipendente",
    className: "rounded-pill",
  },
];

// --- Sezioni --------------------------------------------------------------

function SwatchGrid({
  title,
  swatches,
}: {
  title: string;
  swatches: Swatch[];
}) {
  return (
    <div className="mb-8">
      <SubHeading>{title}</SubHeading>
      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
        {swatches.map((swatch) => (
          <div
            key={swatch.token}
            className="overflow-hidden rounded-card border border-gray-200"
          >
            <div className="h-20" style={{ backgroundColor: swatch.hex }} />
            <div className="px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <code className="font-medium text-petrol-800">
                  {swatch.token}
                </code>
                <code className="text-xs text-gray-500 tabular-nums">
                  {swatch.hex}
                </code>
              </div>
              <p className="mt-1 text-xs text-gray-600">{swatch.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorsSection() {
  return (
    <Section
      id="colori"
      title="Colori"
      note="Petrolio e teal sono la voce del prodotto. Warn e danger sono riservati ad alert e stati critici: è il loro essere rari a farli notare."
    >
      <SwatchGrid title="Petrolio" swatches={PETROL} />
      <SwatchGrid title="Teal" swatches={TEAL} />
      <SwatchGrid title="Warn" swatches={WARN} />
      <SwatchGrid title="Danger" swatches={DANGER} />

      <div className="mb-2">
        <SubHeading>Neutri — gray</SubHeading>
        <div className="mt-3 flex overflow-hidden rounded-card border border-gray-200">
          {NEUTRAL_STEPS.map((neutral) => (
            <div key={neutral.step} className="flex-1">
              <div className={`h-14 ${neutral.className}`} />
              <p className="py-1.5 text-center text-xs text-gray-600">
                {neutral.step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ContrastSection() {
  return (
    <Section
      id="contrasti"
      title="Coppie testo/fondo"
      note="Il testo su una tinta usa sempre il tono scuro della stessa famiglia, mai nero puro. Rapporto WCAG 2.1: AA richiede 4.5 per il testo normale, 3.0 per il testo grande."
    >
      <div className="overflow-x-auto rounded-card border border-gray-200">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-4 py-2.5 font-medium">Anteprima</th>
              <th className="px-4 py-2.5 font-medium">Testo</th>
              <th className="px-4 py-2.5 font-medium">Contesto</th>
              <th className="px-4 py-2.5 text-right font-medium">Rapporto</th>
              <th className="px-4 py-2.5 text-right font-medium">AA</th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((pair) => {
              const ratio = contrastRatio(pair.fg, pair.bg);
              const passesNormal = ratio >= 4.5;
              const passesLarge = ratio >= 3;
              return (
                <tr
                  key={`${pair.fgToken}-${pair.bg}`}
                  className="border-t border-gray-200"
                >
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-block rounded-chip px-2.5 py-1"
                      style={{ backgroundColor: pair.bg, color: pair.fg }}
                    >
                      CHF 14&apos;200
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="text-petrol-800">{pair.fgToken}</code>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{pair.label}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {ratio.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {passesNormal ? (
                      <span className="font-medium text-petrol-700">
                        testo normale
                      </span>
                    ) : passesLarge ? (
                      <span className="font-medium text-warn-dark">
                        solo testo grande
                      </span>
                    ) : (
                      <span className="font-medium text-danger-text">no</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export function TypographySection() {
  return (
    <Section
      id="tipografia"
      title="Tipografia"
      note="Inter per UI e dashboard, pesi 400 / 500 / 600. Scala 12 / 13 / 14 / 16 / 20 / 24 / 32: non esistono valori intermedi."
    >
      <div className="divide-y divide-gray-200 rounded-card border border-gray-200">
        {TYPE_SCALE.map((step) => (
          <div
            key={step.token}
            className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-3"
          >
            <code className="w-28 shrink-0 text-xs text-petrol-800">
              {step.token}
            </code>
            <span className="w-10 shrink-0 text-xs text-gray-500 tabular-nums">
              {step.px}px
            </span>
            <span className={step.className}>Risparmio del trimestre</span>
            <span className="ml-auto text-xs text-gray-500">{step.usage}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">font-normal · 400</p>
          <p className="mt-1 text-lg font-normal">Alert precoce</p>
        </div>
        <div className="rounded-card border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">font-medium · 500</p>
          <p className="mt-1 text-lg font-medium">Alert precoce</p>
        </div>
        <div className="rounded-card border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">font-semibold · 600</p>
          <p className="mt-1 text-lg font-semibold">Alert precoce</p>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-gray-200 px-4 py-5">
        <p className="text-xs text-gray-500">
          Source Serif 4 · 600 — solo titoli display della landing
        </p>
        <p className="mt-2 font-serif text-3xl font-semibold text-petrol-900">
          La salute dei dipendenti, misurata
        </p>
      </div>
    </Section>
  );
}

export function RadiiSection() {
  return (
    <Section
      id="raggi"
      title="Raggi"
      note="Due registri di forme: compatto e da strumento per HR e landing, morbido e da consumer per l'app dipendente. Il nome del token dice a quale registro appartiene."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-4">
        {RADII.map((radius) => (
          <div key={radius.token}>
            <div
              className={`h-24 border border-teal-300 bg-teal-50 ${radius.className}`}
            />
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <code className="text-xs font-medium text-petrol-800">
                {radius.token}
              </code>
              <span className="text-xs text-gray-500 tabular-nums">
                {radius.value}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-600">{radius.usage}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
