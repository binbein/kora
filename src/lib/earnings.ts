import { addDays, startOfWeek } from "./dates";
import type { ProfessionalSession } from "./data/types";

/*
 * Le righe settimanali del riepilogo compensi.
 *
 * Non è un campo di `ProfessionalEarnings`: la settimana è un raggruppamento di
 * presentazione, e domani la stessa pagina potrebbe raggrupparle per paziente
 * senza toccare l'API (CLAUDE.md §5.1).
 *
 * La conseguenza è quella che il §10.D chiede: **"le righe settimanali sommano
 * al totale del mese" smette di essere una proprietà da verificare e diventa
 * un'identità**, perché righe e totale nascono dalla stessa lista di sedute.
 */

export type EarningsWeek = {
  /** Lunedì della settimana */
  start: Date;
  /** Domenica della stessa settimana */
  end: Date;
  sessions: number;
  minutes: number;
  grossChf: number;
};

/**
 * Raggruppa per settimana di calendario le sedute **erogate** di un mese.
 *
 * Le settimane senza sedute non compaiono: una riga vuota in un riepilogo di
 * compensi si legge come un pagamento mancante, non come una settimana di
 * vacanza.
 */
export function earningsWeeks(
  sessions: ProfessionalSession[],
  month: Date,
  feePerSession: number,
): EarningsWeek[] {
  const delivered = sessions.filter(
    (session) =>
      session.status === "completed" &&
      session.start.getFullYear() === month.getFullYear() &&
      session.start.getMonth() === month.getMonth(),
  );

  const byWeek = new Map<number, EarningsWeek>();
  for (const session of delivered) {
    const start = startOfWeek(session.start);
    const week = byWeek.get(start.getTime()) ?? {
      start,
      end: addDays(start, 6),
      sessions: 0,
      minutes: 0,
      grossChf: 0,
    };
    week.sessions += 1;
    week.minutes += session.durationMinutes;
    week.grossChf += feePerSession;
    byWeek.set(start.getTime(), week);
  }

  return [...byWeek.values()].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
}
