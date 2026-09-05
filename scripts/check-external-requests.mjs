/*
 * ZERO RICHIESTE ESTERNE A RUNTIME (CLAUDE.md §3), verificata sul RISULTATO.
 *
 * È l'altra metà del controllo. La regola di lint in `eslint.config.js` guarda
 * il **sorgente** e vieta `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`
 * e `sendBeacon` fuori da `lib/data/http/`; questa guarda ciò che finisce nel
 * bundle, e vede tre cose che quella non può vedere:
 *
 *   - cosa fa una **dipendenza** al suo interno — il lint non entra in
 *     `node_modules`, e il rischio vero è lì;
 *   - un URL che entra da un `<link>`, da un `<img>` o da un `@import` del CSS,
 *     che non è una chiamata e nessun selettore di sintassi aggancia;
 *   - un font o un'icona serviti da un CDN, cioè il caso che il §3 nomina per
 *     primo e che ha già fatto togliere l'`@import` di Google Fonts.
 *
 * Nessuna dipendenza: Node puro, così gira in CI e su una macchina appena
 * clonata senza aggiungere niente al `package.json`.
 *
 * COSA NON PUÒ FARE, detto qui perché non lo si scopra dopo: una richiesta
 * verso un host **già in allowlist** passa. Le due metà si coprono a vicenda
 * proprio su questo — quella riga di codice il lint la vedrebbe.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const DIST = "dist";
const EXTENSIONS = new Set([".js", ".css", ".html"]);

/*
 * GLI HOST AMMESSI, OGNUNO CON LA SUA RAGIONE.
 *
 * Non è una lista di host di cui ci fidiamo: è la lista di stringhe che il
 * bundle contiene **senza chiamarle**. Quasi tutte sono banner di licenza,
 * attribuzioni in commento e URL dentro messaggi d'errore delle dipendenze —
 * il rumore che una ricerca di `https?://` trova per forza, e che va
 * classificato una volta invece di riscoprirlo a ogni build.
 *
 * Chi ne aggiunge una scrive la ragione accanto, e la ragione dice **perché
 * non è una richiesta**. Se non riesce a scriverla, ha trovato quello che
 * questo controllo cerca.
 */
const ALLOWED = [
  // Namespace XML, non indirizzi: `xmlns` degli SVG e dei documenti che
  // html2canvas e jsPDF costruiscono. Nessun browser li risolve.
  { host: "www.w3.org", why: "namespace XML degli SVG, non un indirizzo" },
  {
    host: "jspdf.default.namespaceuri",
    why: "namespace XMP di default di jsPDF: non è nemmeno un host",
  },

  // Banner di licenza e attribuzioni, dentro i commenti che i minificatori
  // conservano perché marcati `/*!`.
  {
    host: "html2canvas.hertzen.com",
    why: "banner di licenza di html2canvas",
  },
  { host: "hertzen.com", why: "autore di html2canvas, nello stesso banner" },
  { host: "opensource.org", why: "URL della licenza MIT in un commento di jsPDF" },
  { host: "www.phpied.com", why: "attribuzione del parser di colori di jsPDF" },
  { host: "www.myersdaily.org", why: "attribuzione dell'MD5 di jsPDF" },
  { host: "www.fpdf.org", why: "riferimento in un commento di jsPDF" },
  { host: "www.cs.cmu.edu", why: "riferimento in un commento di jsPDF" },

  // URL dentro messaggi d'errore: sono testo che una libreria stampa in
  // console, non qualcosa che va a prendere.
  { host: "reactjs.org", why: "decodificatore d'errore di React, in un messaggio" },
  { host: "reactrouter.com", why: "URL di documentazione in un messaggio d'errore" },
  { host: "fb.me", why: "URL di documentazione in un messaggio di prop-types" },
  {
    host: "github.com",
    why: "riferimenti in messaggi d'errore e commenti di react-router e jsPDF",
  },

  // Base fittizia con cui react-router costruisce un `new URL()` quando non
  // c'è un `location`. Non esce dalla macchina per definizione.
  { host: "localhost", why: "base fittizia di react-router per parsare un URL" },

  // Il ramo `output("pdfobjectnewwindow")` di jsPDF caricherebbe pdfobject da
  // CDN. Il nostro chiamante non lo percorre — `lib/report-pdf.ts` usa
  // `save()` — quindi la stringa è nel bundle e il ramo è irraggiungibile.
  // Resta in elenco perché **è l'unica di questa lista che sarebbe una
  // richiesta vera** se qualcuno cambiasse modo di uscita.
  {
    host: "cdnjs.cloudflare.com",
    why: "ramo pdfobjectnewwindow di jsPDF, che report-pdf.ts non percorre (usa save())",
  },

  // Il TLD riservato del dataset (RFC 2606, CLAUDE.md §8). Oggi le email non
  // portano uno schema, quindi questa voce non aggancia niente; c'è perché il
  // giorno in cui un valore del dataset ne avesse uno, la build fallirebbe per
  // un indirizzo che nessuno può registrare e che nessuno chiama.
  { suffix: ".example", why: "TLD riservato del dataset finto (RFC 2606, §8)" },
];

function isAllowed(host) {
  return ALLOWED.some((entry) =>
    entry.suffix ? host.endsWith(entry.suffix) : host === entry.host,
  );
}

function collect(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, out);
    else if (EXTENSIONS.has(extname(entry.name))) out.push(full);
  }
  return out;
}

/*
 * `dist/` mancante è un fallimento, non un successo.
 *
 * Un controllo che passa quando non ha niente da guardare è il censimento che
 * dichiara zero su ciò che non ha percorso — la trappola che il §6.1 registra
 * per il contrasto. Per la stessa ragione il riepilogo dice **quanti file ha
 * letto**: è l'unico numero che distingue "non c'è niente" da "non ho
 * guardato".
 */
if (!existsSync(DIST)) {
  console.error(
    `[rete] ${DIST}/ non esiste: il controllo va eseguito dopo il build.`,
  );
  process.exit(1);
}

const files = collect(DIST);
const found = new Map();

for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/https?:\/\/([^/"'`\s)>\\]+)/g)) {
    const host = match[1];
    if (isAllowed(host)) continue;
    if (!found.has(host)) found.set(host, new Set());
    found.get(host).add(relative(DIST, file));
  }
}

if (found.size > 0) {
  const quanti =
    found.size === 1 ? "1 host non dichiarato" : `${found.size} host non dichiarati`;
  console.error(
    `\n[rete] ${quanti} nel bundle. La demo promette zero richieste esterne a runtime (CLAUDE.md §3).\n`,
  );
  for (const [host, where] of [...found].sort()) {
    console.error(`  ${host}`);
    for (const file of [...where].sort()) console.error(`      ${file}`);
  }
  console.error(
    `\n  Se non è una richiesta, aggiungilo all'allowlist di ${import.meta.url.split("/").pop()} con la ragione accanto.`,
  );
  console.error(
    `  Se lo è, non ci va: il posto delle chiamate è src/lib/data/http/ (CLAUDE.md §5.7).\n`,
  );
  process.exit(1);
}

console.log(
  `[rete] ${files.length} file di ${DIST}/ letti, nessun host fuori dall'allowlist (CLAUDE.md §3).`,
);
