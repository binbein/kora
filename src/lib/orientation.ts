import type { Plan } from "@/lib/data/types";

/*
 * «Non sai da dove partire?»: tre domande e un servizio (CLAUDE.md §10.B.7).
 *
 * NON È UN TRIAGE, E NON LO DIVENTA AGGIUNGENDO DOMANDE. Un triage stabilisce
 * quanto è grave e con che urgenza va visto qualcuno; questa funzione sceglie
 * **a quale porta bussare** fra quelle che il piano ha già aperto. Non guarda
 * sintomi, non nomina cause, non produce un punteggio e non classifica lo stato
 * di salute di nessuno — cioè non fa nessuna delle cose che renderebbero il
 * software un dispositivo medico (§7). La schermata lo dichiara a parole sotto
 * l'esito: *è un orientamento, non una valutazione*.
 *
 * NE DISCENDE UN VINCOLO SU CHI LA MODIFICA: ogni ramo nuovo deve poter essere
 * spiegato dicendo *"questo bisogno lo copre quel servizio"*. Nel momento in cui
 * un ramo si spiega dicendo *"questo sintomo è più serio di quell'altro"*, la
 * funzione ha cambiato mestiere e la decisione non è più di chi scrive il
 * codice.
 *
 * LA TABELLA, PER INTERO (founder, 10.09.2026):
 *
 * | cosa pesa            | condizione                          | dove porta      |
 * |----------------------|-------------------------------------|-----------------|
 * | il corpo             | —                                   | medico virtuale |
 * | i pensieri e l'umore | —                                   | psicologo       |
 * | il lavoro            | il piano ha il coach e l'impatto     | coach           |
 * |                      | non è «molto»                        |                 |
 * | il lavoro            | altrimenti                          | psicologo       |
 * | un controllo         | il piano ha il check-up             | check-up        |
 * | un controllo         | altrimenti                          | medico virtuale |
 *
 * **«Molto» cambia una strada sola**, ed è una scelta: una regola che portasse
 * tutto allo psicologo avrebbe reso irraggiungibili due delle quattro uscite —
 * e avrebbe detto, senza dirlo, che un impatto alto è una faccenda psicologica.
 * Il caso in cui «molto» vuol dire «adesso» lo copre il 144 del disclaimer, che
 * sta sotto ogni esito e non dipende da nessuna risposta.
 *
 * LA DURATA NON SCEGLIE NIENTE, ed è voluto: serve a distinguere *"vediamo"* da
 * *"non aspettare"*, non a classificare. Sull'unico valore in cui quella
 * differenza conta — «da mesi» — la schermata aggiunge una riga; è la schermata
 * a farlo, perché è una cosa che si dice, non un servizio che cambia.
 *
 * IL PIANO ENTRA COME ARGOMENTO e non si legge qui dentro: la funzione resta
 * pura e verificabile, e chi la chiama ha già l'azienda in mano (§5.5).
 */

/** Cosa pesa di più: la prima domanda. */
export type OrientationBurden = "body" | "mind" | "work" | "postponed_check";

/** Da quanto: la seconda. Non sceglie il servizio, per costruzione. */
export type OrientationDuration = "days" | "weeks" | "months";

/** Quanto condiziona la giornata: la terza. */
export type OrientationImpact = "low" | "medium" | "high";

export type OrientationAnswers = {
  burden: OrientationBurden;
  duration: OrientationDuration;
  impact: OrientationImpact;
};

/** I quattro servizi verso cui l'orientamento può portare. */
export type OrientationService =
  | "virtual_doctor"
  | "psychologist"
  | "coach"
  | "checkup";

/**
 * Il servizio da indicare, dato ciò che la persona ha risposto e il piano della
 * sua azienda.
 *
 * I due ripieghi seguono la stessa regola dei contatori della home: **a dire se
 * un servizio esiste è il contratto commerciale** (§9), non la schermata. Un
 * piano senza coach manda al servizio che copre lo stesso bisogno e c'è su tutti
 * e tre — lo psicologo per il lavoro, il medico virtuale per un controllo
 * rimandato — invece di offrire una porta chiusa.
 */
export function orientationFor(
  answers: OrientationAnswers,
  plan: Plan,
): OrientationService {
  switch (answers.burden) {
    case "body":
      return "virtual_doctor";

    case "mind":
      return "psychologist";

    case "work":
      return plan.coachSessionsPerYear !== undefined &&
        answers.impact !== "high"
        ? "coach"
        : "psychologist";

    case "postponed_check":
      return plan.checkup !== undefined ? "checkup" : "virtual_doctor";
  }
}
