/*
 * Piccole operazioni su date, condivise fra il dataset e le schermate.
 *
 * Stanno fuori da `format.ts` perché non producono testo: quel file traduce
 * una data in stringa, questo la sposta. Tenerli separati evita che una
 * funzione di formattazione finisca a fare aritmetica sui giorni.
 *
 * Tutte lavorano sulla data locale e azzerano l'ora quando restituiscono un
 * giorno: un confronto fra giorni non deve dipendere dall'orario.
 */

/** Il lunedì della settimana in cui cade la data; la domenica la chiude. */
export function startOfWeek(date: Date): Date {
  const weekday = date.getDay();
  const shift = weekday === 0 ? 6 : weekday - 1;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - shift);
}

/**
 * Sposta di N giorni e azzera l'ora, come tutte le funzioni di questo file.
 * Non conserva l'orario: per costruire un appuntamento delle 17:30 si prende
 * il giorno da qui e l'ora si mette dopo. Passa da `Date` per i fine mese.
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * Se due fasce si sovrappongono. **Estremi esclusi**: una che finisce alle 17:30
 * e una che comincia alle 17:30 non si sovrappongono, si toccano.
 *
 * STA QUI, IN UN POSTO SOLO, PERCHÉ LO CHIEDONO IN CINQUE (16.08.2026). Due
 * guardrail statici, il filtro degli slot liberi e due controlli della
 * prenotazione facevano la stessa aritmetica, e **tre di loro la facevano
 * diversa**: confrontavano il solo istante d'inizio, quindi vedevano due sedute
 * che cominciano insieme e non una che ne invade un'altra di venti minuti. È il
 * difetto corretto su un lato il 15.08.2026 e lasciato asimmetrico sull'altro.
 *
 * Sopravvive alla cancellazione di `mock/` (§5.7), ed è voluto: la regola non è
 * del dataset finto, è del dominio, e il backend dovrà applicarla.
 */
export function overlaps(
  aStart: Date,
  aMinutes: number,
  bStart: Date,
  bMinutes: number,
): boolean {
  const aEnd = aStart.getTime() + aMinutes * 60_000;
  const bEnd = bStart.getTime() + bMinutes * 60_000;
  return aStart.getTime() < bEnd && bStart.getTime() < aEnd;
}

/**
 * Quante settimane separano due date, contate fra i loro lunedì.
 *
 * **`Math.round` non è pigrizia, ed è la riga da non semplificare.** Due
 * mezzanotti locali a sette giorni di distanza distano `7 × 86'400'000`
 * millisecondi **solo se in mezzo non cambia l'ora**: attraversando il confine
 * dell'ora legale ne distano un'ora in meno, e una divisione intera dà **6**
 * dove le settimane sono 7. Non è un caso di scuola — l'agenda della demo
 * comincia il 02.03.2026 e in Europa l'ora legale entra il 29.03.2026, quindi
 * il confine cade **dentro** l'intervallo navigabile: il mini calendario
 * evidenzierebbe una settimana e la griglia ne mostrerebbe un'altra.
 *
 * STA QUI E NON NEL SUO UNICO CHIAMANTE, ed è una scelta contro il §11 di
 * `CLAUDE.md` fatta con gli occhi aperti (18.08.2026). La regola dice che una
 * funzione con un chiamante solo è di solito una riga dentro il chiamante; qui
 * ha vinto l'altra ragione, la stessa di `overlaps`: **questo è il file in cui
 * chi incontra la trappola la viene a cercare**, ed è aritmetica sui giorni,
 * non presentazione. Dentro una schermata, il commento qui sopra sarebbe
 * archeologia che la prima ripulitura toglie.
 */
export function weeksBetween(from: Date, to: Date): number {
  const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
  return Math.round(
    (startOfWeek(to).getTime() - startOfWeek(from).getTime()) / WEEK_IN_MS,
  );
}

/** Due istanti che cadono nello stesso giorno di calendario. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
