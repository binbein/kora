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

/** Due istanti che cadono nello stesso giorno di calendario. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
