import { assertInDev } from "../guardrails";
import type { RapidCheckLink } from "../types";
import { COMPANY, DEPARTMENTS } from "./company";
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
