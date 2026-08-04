import { dataProvider } from "@/lib/data";
import {
  formatCHF,
  formatDate,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatRating,
  formatTime,
  formatWeekday,
} from "@/lib/format";
import { Section } from "./_shell";

/*
 * Ogni numero a schermo passa da qui (§9). La tabella mostra input e output
 * affiancati, così un errore di formattazione si vede senza aprire il codice:
 * l'apostrofo delle migliaia, la data gg.mm.aaaa, la valuta prima dell'importo.
 *
 * Le date degli esempi vengono dal provider e non sono ricopiate: erano scritte
 * a mano come 29 e 30 luglio 2026, cioè una copia di `DEMO_TODAY` che restava
 * indietro il giorno in cui si gira quella manopola (§5). Qui la tabella
 * mostrerebbe una data e le schermate un'altra, proprio nella pagina che serve
 * a controllare le date.
 */

const REFERENCE = dataProvider.getReferenceDate();

/*
 * L'appuntamento di Laura con la Dr.ssa Meier: il giovedì alle 17:30 del §6.
 *
 * Cercato per id e non preso in testa alla lista: gli appuntamenti sono
 * ordinati per data, quindi una prenotazione fatta durante la demo su uno slot
 * più vicino passerebbe davanti e l'esempio mostrerebbe un altro orario.
 */
const APPOINTMENT =
  dataProvider
    .getAppointments()
    .find((appointment) => appointment.id === "appointment-meier-1")?.start ??
  REFERENCE;

const ROWS: { call: string; output: string; note: string }[] = [
  {
    call: "formatCHF(14200)",
    output: formatCHF(14200),
    note: "migliaia con apostrofo, nessun decimale",
  },
  {
    call: "formatCHF(55)",
    output: formatCHF(55),
    note: "piano Plus, CHF/dipendente/mese",
  },
  {
    call: "formatCHF(1234.5, 'it-CH', { decimals: 2 })",
    output: formatCHF(1234.5, "it-CH", { decimals: 2 }),
    note: "decimali su richiesta",
  },
  {
    call: "formatNumber(120)",
    output: formatNumber(120),
    note: "dipendenti di Demo SA",
  },
  {
    call: "formatNumber(14200)",
    output: formatNumber(14200),
    note: "stesso separatore, senza valuta",
  },
  {
    call: "formatPercent(68)",
    output: formatPercent(68),
    note: "riceve 0–100, non 0–1",
  },
  {
    call: "formatPercent(4.35, 'it-CH', { decimals: 1 })",
    output: formatPercent(4.35, "it-CH", { decimals: 1 }),
    note: "un decimale",
  },
  {
    call: "formatDate(getReferenceDate())",
    output: formatDate(REFERENCE),
    note: "gg.mm.aaaa",
  },
  {
    call: "formatTime(appuntamento.start)",
    output: formatTime(APPOINTMENT),
    note: "orario dell'appuntamento",
  },
  {
    call: "formatWeekday(appuntamento.start)",
    output: formatWeekday(APPOINTMENT),
    note: "giorno per esteso, minuscolo",
  },
  {
    call: "formatMonthShort(getReferenceDate())",
    output: formatMonthShort(REFERENCE),
    note: "asse dei grafici a 12 mesi",
  },
  {
    call: "formatRating(4.9)",
    output: formatRating(4.9),
    note: "sempre un decimale",
  },
];

/*
 * Confronto fra locale: la demo è solo it-CH, ma il locale è un parametro e
 * questa riga lo dimostra. Se un giorno arriva fr-CH, la valuta si sposta
 * dopo l'importo da sola.
 */
const LOCALES = ["it-CH", "de-CH", "fr-CH"] as const;

export function FormattingSection() {
  return (
    <Section
      id="formattazione"
      title="Formattazione"
      note="Nessun componente costruisce un formato a mano: numeri, valuta, date e percentuali escono tutti da format.ts, che riceve il locale come parametro."
    >
      <div className="overflow-x-auto rounded-card border border-gray-200">
        <table className="w-full min-w-[38rem] text-left">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-4 py-2.5 font-medium">Chiamata</th>
              <th className="px-4 py-2.5 font-medium">Risultato</th>
              <th className="px-4 py-2.5 font-medium">Nota</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.call} className="border-t border-gray-200">
                <td className="px-4 py-2.5">
                  <code className="text-xs text-petrol-800">{row.call}</code>
                </td>
                <td className="px-4 py-2.5 font-medium text-petrol-900 tabular-nums">
                  {row.output}
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-600">
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-gray-200">
        <table className="w-full min-w-[30rem] text-left">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-4 py-2.5 font-medium">Locale</th>
              <th className="px-4 py-2.5 font-medium">Valuta</th>
              <th className="px-4 py-2.5 font-medium">Numero</th>
              <th className="px-4 py-2.5 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {LOCALES.map((locale) => (
              <tr key={locale} className="border-t border-gray-200">
                <td className="px-4 py-2.5">
                  <code className="text-xs text-petrol-800">{locale}</code>
                  {locale === "it-CH" ? (
                    <span className="ml-2 text-xs text-gray-500">
                      in uso nella demo
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {formatCHF(14200, locale)}
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {formatNumber(14200, locale)}
                </td>
                <td className="px-4 py-2.5 tabular-nums">
                  {formatDate(REFERENCE, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
