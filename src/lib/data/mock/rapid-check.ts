import { assertInDev } from "../guardrails";
import type { RapidCheckEntry, RapidCheckLink, RapidCheckValue } from "../types";
import { COMPANY, DEPARTMENTS } from "./company";
import { HISTORY_MONTHS, MONTHS_OF_HISTORY } from "./measurement";
import { DEMO_TODAY } from "./demo-date";

/*
 * Il link anonimo del check rapido (CLAUDE.md §8, §10.A.5).
 *
 * È la metà del modello di misurazione che rende il dato indipendente
 * dall'adozione: chi non ha attivato l'account risponde comunque, e il reparto
 * lo porta il link invece della persona. Il §8 lo descriveva da agosto e la
 * privacy HR lo prometteva al cliente; qui c'è l'oggetto.
 *
 * UNO SOLO, ED È IL REPARTO DELLA STORIA. Le Vendite sono quelle che si
 * staccano fra il mese 9 e il 12 e su cui scatta l'alert precoce, quindi il
 * link porta dove chi guarda la dashboard è già stato.
 *
 * IL TOKEN SI LEGGE, E IN PRODUZIONE NON DEVE. `demo-sa-vendite` è
 * pronunciabile perché la demo lo mostra, e davanti a un investitore un
 * indirizzo che si può dire a voce vale più di trentadue caratteri casuali. Un
 * token leggibile è però indovinabile: lunghezza, entropia, generazione e
 * revoca sono lavoro dell'MVP (`docs/CONTRATTO-DATI.md` §8.3), e questo è
 * l'esempio, non lo schema.
 */

const LINK_TOKEN = "demo-sa-vendite";
const LINK_DEPARTMENT_ID = "sales";

/*
 * Il reparto si **trova**, non si riscrive: il nome vive in `company.ts`, e una
 * seconda copia qui sarebbe la stessa cosa detta due volte, cioè due valori che
 * possono divergere (§5.5).
 *
 * Il `throw` accanto al guardrail è l'idioma di `platform.ts`: il guardrail
 * spiega in sviluppo, il lancio ferma ovunque — anche in produzione, dove i
 * guardrail tacciono e un reparto mancante diventerebbe altrimenti un link che
 * dichiara un nome vuoto.
 */
const linkDepartment = DEPARTMENTS.find(
  (department) => department.id === LINK_DEPARTMENT_ID,
);

assertInDev(
  linkDepartment !== undefined,
  `Il link anonimo "${LINK_TOKEN}" punta al reparto "${LINK_DEPARTMENT_ID}", che non è fra i reparti di ${COMPANY.name} (§8).`,
);

if (linkDepartment === undefined) {
  throw new Error(
    `Nessun reparto con id "${LINK_DEPARTMENT_ID}" per il link anonimo del check rapido.`,
  );
}

/*
 * La scadenza si deriva da `DEMO_TODAY` (§5.4): l'ultimo giorno del mese in cui
 * la demo è ambientata, cioè il 30.09.2026. Una data assoluta invecchierebbe da
 * sola, come il rinnovo del contratto di Demo SA in `company.ts`.
 *
 * `new Date(anno, mese + 1, 0)` è l'ultimo giorno del mese corrente: il giorno
 * zero del mese successivo.
 */
const VALID_UNTIL = new Date(
  DEMO_TODAY.getFullYear(),
  DEMO_TODAY.getMonth() + 1,
  0,
);

/*
 * `| undefined` sul valore, ed è il tipo che dice la verità: una ricerca per
 * token può non trovare niente, e senza questa metà TypeScript prometterebbe un
 * link a ogni stringa del mondo.
 */
const LINKS: Record<string, RapidCheckLink | undefined> = {
  [LINK_TOKEN]: {
    companyName: COMPANY.name,
    departmentId: linkDepartment.id,
    departmentName: linkDepartment.name,
    validUntil: VALID_UNTIL,
  },
};

/**
 * A quale reparto porta un token, se porta ancora da qualche parte.
 *
 * **Token ignoto e link scaduto rispondono uguale**, ed è deliberato: a chi
 * apre un link morto la differenza non serve, e dirgliela direbbe a chi prova
 * token a caso quali token sono esistiti.
 *
 * La regola sta qui e non nel provider perché la leggono in due — la schermata
 * che apre il link e la scrittura che ci risponde dentro — e una scadenza
 * controllata in un punto solo dei due sarebbe un link che non si può aprire e
 * a cui si può comunque rispondere.
 */
export function resolveRapidCheckLink(token: string): RapidCheckLink | null {
  const link = LINKS[token];
  if (link === undefined) return null;
  return link.validUntil >= DEMO_TODAY ? link : null;
}

/*
 * La curva personale di Laura (CLAUDE.md §8, founder 10.09.2026).
 *
 * SCALA ROVESCIATA RISPETTO ALL'ASSESSMENT, e il commento sta qui perché è il
 * punto in cui si sbaglierebbe: **1 è "molto bene", 5 "molto male"**. Là 5 è il
 * meglio, e mescolare le due capovolgerebbe una curva senza che niente si
 * rompa.
 *
 * NON RACCONTANO NIENTE CHE IL §8 NON RACCONTI. Media 2.58, nessuna corsa
 * monotona più lunga di due, e il primo valore uguale all'ultimo: non c'è trend
 * da leggere, che è precisamente ciò che serve — una persona "in buon
 * equilibrio" oscilla fra "bene" e "così così".
 *
 * L'UNICO 4 È MARZO 2026, il mese del referto del check-up che segnala il sonno.
 * È una coerenza **scelta** e nessun codice la tiene: un guardrail su quella
 * coincidenza la trasformerebbe in un invariante che non è.
 *
 * NON ALIMENTANO NESSUN AGGREGATO, come il tocco fatto durante la demo: la
 * serie di Operations non si muove di un punto per le risposte della sua
 * dipendente (`docs/CONTRATTO-DATI.md` §7).
 */
const LAURA_RAPID_CHECK: RapidCheckValue[] = [
  3, 2, 2, 3, 2, 4, 2, 3, 2, 2, 3, 3,
];

/**
 * La curva, un punto al mese, dal più vecchio.
 *
 * I mesi sono quelli della finestra dei dodici — non una seconda griglia — così
 * la curva della persona e il trend della dashboard parlano degli stessi mesi
 * (§5.5).
 */
export const RAPID_CHECK_HISTORY: RapidCheckEntry[] = HISTORY_MONTHS.map(
  (month, index) => ({ month, value: LAURA_RAPID_CHECK[index] }),
);

/*
 * Un valore per ogni mese della finestra. Senza, la curva mostrerebbe meno punti
 * del trend che le sta accanto in un'altra schermata, o cadrebbe su mesi che la
 * finestra non contiene — e a schermo si legge come un dato mancante invece che
 * come una serie scritta male.
 */
assertInDev(
  LAURA_RAPID_CHECK.length === MONTHS_OF_HISTORY,
  `Il check rapido di Laura ha ${LAURA_RAPID_CHECK.length} valori, la finestra ne conta ${MONTHS_OF_HISTORY}.`,
);
