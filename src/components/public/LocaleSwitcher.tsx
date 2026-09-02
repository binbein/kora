import { AVAILABLE_LOCALES, getLocale, setLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

/*
 * Il selettore di lingua (CLAUDE.md §2.7, blocco e di M5).
 *
 * STA SOLO IN `PublicNav`, e non nelle quattro nav dei portali. Il giro del
 * pitch entra in un portale e ne esce col logo, quindi la barra pubblica si
 * attraversa comunque; ripeterlo in cinque punti sarebbe lo stesso comando in
 * cinque posti, e nel portale dipendente occuperebbe spazio in un layout che
 * il §6.4 vuole arioso.
 *
 * SIGLE E NON UN MENÙ A TENDINA: due o quattro voci corte stanno su una riga,
 * non aprono niente, e si vedono cambiare. Un menù nasconderebbe la lingua
 * attiva dietro un clic proprio mentre la si sta mostrando.
 *
 * LE SIGLE NON STANNO NEL DIZIONARIO: `IT` e `DE` si scrivono uguali in tutte
 * e quattro le lingue, e si derivano dal codice del locale. A stare in `i18n`
 * è il nome del gruppo, che è l'unica cosa qui dentro che si traduce.
 *
 * SI MOSTRANO LE SOLE LINGUE DISPONIBILI, cioè quelle che `DICTIONARIES`
 * registra davvero — **oggi quattro** (§2.7). È la regola, e non un conto: una
 * sigla spenta che non fa niente è un'affordance morta — il vicolo cieco del
 * §10 in miniatura — e davanti a un investitore invita la domanda "perché è
 * grigia?" nel mezzo di trenta minuti contati.
 *
 * **La regola si è già vista lavorare**: il componente è passato da due sigle a
 * quattro quando `fr.ts` ed `en.ts` sono stati registrati, il 14.08.2026,
 * **senza che nessuno lo toccasse**. Chi registra la quinta lingua non viene
 * qui.
 */

/** `it-CH` → `IT`. La sigla è il codice lingua, in maiuscolo. */
function shortLabel(locale: Locale): string {
  return locale.split("-")[0].toUpperCase();
}

export default function LocaleSwitcher() {
  const active = getLocale();

  /*
   * Con una lingua sola non c'è niente da scegliere, e un gruppo con un
   * pulsante solo sarebbe un comando che non comanda (§11).
   */
  if (AVAILABLE_LOCALES.length < 2) return null;

  return (
    <div
      role="group"
      aria-label={t.public.nav.language}
      className="flex items-center gap-1"
    >
      {AVAILABLE_LOCALES.map((locale) => {
        const current = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => setLocale(locale)}
            /*
             * `aria-pressed` e non un `aria-current`: sono pulsanti che
             * cambiano uno stato dell'applicazione, non link a una posizione.
             * Senza, chi legge lo schermo sente due pulsanti identici e non
             * sa quale lingua è attiva — il colore da solo non lo dice (§6.1).
             */
            aria-pressed={current}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              current
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {shortLabel(locale)}
          </button>
        );
      })}
    </div>
  );
}
