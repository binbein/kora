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

/** Due istanti che cadono nello stesso giorno di calendario. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
