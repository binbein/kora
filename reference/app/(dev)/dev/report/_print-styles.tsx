/*
 * CSS di stampa del report trimestrale.
 *
 * Sta in un `<style>` dentro la pagina e non in `globals.css` di proposito:
 * riguarda una pagina che esiste solo in sviluppo (§3), e regole @page nel CSS
 * globale finirebbero nel bundle di produzione per non servire a nessuno.
 *
 * Il foglio ha una larghezza fissa in millimetri anche a schermo. È la scelta
 * che tiene insieme le due rese: il grafico Recharts si dimensiona misurando
 * il contenitore, e se quel contenitore fosse fluido misurerebbe la finestra a
 * schermo e la pagina in stampa, cioè due valori diversi — il grafico
 * uscirebbe dai margini proprio nel PDF, dove nessuno lo rimisura. Fisso in
 * millimetri, quello che si vede è quello che si stampa.
 */
export function PrintStyles() {
  return (
    <style>{`
      /* A4 verticale, margini 15mm: restano 180 x 267mm di contenuto. */
      @page {
        size: A4 portrait;
        margin: 15mm;
      }

      @media print {
        /* Le tinte del design system sono dati, non decorazione: la fascia
           "alto" in danger-bg distingue la riga delle Vendite, e senza colori
           di sfondo la tabella perde quella lettura. */
        html,
        body {
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* La barra di lavoro è per chi genera il PDF, non per chi lo legge. */
        .no-print {
          display: none !important;
        }

        /* A schermo il foglio è un A4 intero su fondo grigio, margini
           compresi, per vedere dove cade il taglio. In stampa il margine lo
           mette la regola @page: lasciare anche il padding lo raddoppierebbe. */
        .report-sheet {
          box-shadow: none !important;
          margin: 0 !important;
        }

        /* Nessun blocco spezzato fra due pagine: un titolo di sezione da solo
           in fondo, o una tabella tagliata a metà, si notano subito. */
        .report-block {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        tr,
        thead {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `}</style>
  );
}
