import { assertInDevOutsidePromise } from "./data/guardrails";
import type { Quarter } from "./data/types";

/*
 * Il generatore del report scaricabile (CLAUDE.md §10.C.3).
 *
 * Cattura un nodo già montato e ne compone un PDF A4 di una pagina. Non sa
 * cosa contiene quel nodo, e non deve: il contenuto è `PrintableReport`, che
 * riceve i dati dal provider come ogni altra schermata.
 *
 * LA TECNICA È QUELLA MISURATA DALLO SPIKE, non una scelta di gusto:
 * html2canvas 1.4.1 rende i token HSL con opacità a **delta 0** — verificato
 * campionando i pixel, `bg-accent/40`, `bg-primary/20`, `border-primary/20` e
 * il teal pieno — quindi non serve nessun workaround sui colori. `scale: 2` e
 * non 1: a scale 1 il documento esce a ~104 dpi effettivi, che è troppo
 * morbido per un foglio che qualcuno stamperà.
 *
 * IL DEBITO, DICHIARATO: il testo di questo PDF è **raster**. Non è
 * selezionabile né cercabile, e il peso è quello di un'immagine (~160 KB
 * contro i ~4 KB dello stesso foglio disegnato a vettori). Va bene per un
 * allegato di pitch, e il giorno in cui il report diventerà un artefatto di
 * prodotto le strade sono due — `window.print()` con `@page`, che dà testo
 * vero e i font giusti ma non produce un file, oppure jsPDF nativo con Inter e
 * DM Sans incorporati, che costa un passo di build e il layout scritto a mano.
 * Si ridiscute allora: non è un ripiego, è una scelta con una scadenza.
 *
 * Le due librerie si importano **dinamicamente**: pesano insieme più della
 * landing, e la landing non deve pagare il report di un'area che non visita.
 */

/** A4 in punti tipografici, come li conta jsPDF. */
const A4_WIDTH_PT = 595.28;
const MARGIN_PT = 28;

/**
 * Un pezzo di nome file da un testo libero: minuscolo, senza accenti, con i
 * trattini al posto degli spazi.
 *
 * Serve al nome del documento, che è **derivato** dall'azienda e dal periodo e
 * non cablato: un file che si chiama sempre uguale è un file che si sovrascrive
 * nella cartella dei download.
 */
function slug(value: string): string {
  return value
    .normalize("NFD")
    // i segni combinanti come escape e non come caratteri letterali: in un
    // sorgente sono invisibili, e il primo editor che normalizza il file li
    // mangia senza che nessuno se ne accorga
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "kora-report-demo-sa-2026-q3.pdf" */
export function reportFileName(companyName: string, period: Quarter): string {
  return `kora-report-${slug(companyName)}-${period.year}-q${period.quarter}.pdf`;
}

/** Come il nodo di stampa marca il proprio periodo: `2026-Q3`. */
export function printPeriodMark(period: Quarter): string {
  return `${period.year}-Q${period.quarter}`;
}

/**
 * Cattura il nodo e fa scaricare il PDF.
 *
 * Restituisce il numero di pagine prodotte, che è ciò che il chiamante
 * controlla: il §10.C.3 vuole **una pagina sola**.
 */
export async function downloadReportPdf(
  node: HTMLElement,
  fileName: string,
  period: Quarter,
): Promise<number> {
  /*
   * IL GUARDRAIL CHE IL §5.6 NOMINA PER NOME: «il trimestre del PDF diverso da
   * quello mostrato».
   *
   * È il difetto che a schermo non si vede — il PDF esce, ha l'aria giusta, e
   * porta i numeri di un altro trimestre. Può nascere in un modo solo e
   * plausibile: il nodo di stampa si aggiorna a un ritmo diverso dallo stato
   * che governa il nome del file, e chi scarica si ritrova "q3" nel nome e i
   * dati del Q2 dentro.
   *
   * Confronta il marcatore che la vista di stampa scrive su di sé con il
   * periodo che il chiamante dichiara: due sorgenti indipendenti, non la stessa
   * variabile letta due volte, che non verificherebbe niente.
   */
  const marked = node.querySelector("[data-print-period]")?.getAttribute(
    "data-print-period",
  );
  assertInDevOutsidePromise(
    marked === printPeriodMark(period),
    `Il PDF sta per uscire per il trimestre "${period.year}-Q${period.quarter}" ma la vista di stampa dichiara "${marked}": il documento porterebbe i numeri di un altro periodo.`,
  );

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const usableWidth = A4_WIDTH_PT - MARGIN_PT * 2;
  const drawnHeight = (canvas.height / canvas.width) * usableWidth;

  doc.addImage(
    canvas.toDataURL("image/jpeg", 0.92),
    "JPEG",
    MARGIN_PT,
    MARGIN_PT,
    usableWidth,
    drawnHeight,
  );

  doc.save(fileName);
  return doc.getNumberOfPages();
}
