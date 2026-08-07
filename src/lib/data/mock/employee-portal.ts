import { assertInDev } from "../guardrails";
import type {
  CappedServiceKind,
  SessionEntitlement,
  VirtualDoctorConsult,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { LAURA } from "./people";
import {
  entitlementFor,
  PORTAL_PATIENT_EMPLOYEE_ID,
} from "./professional-portal";
import { SERVICE_USAGE } from "./service-usage";

/*
 * I contatori personali di Laura (CLAUDE.md §8, §10.B).
 *
 * Il file esiste per tenere in chiaro una distinzione che il §8 fa e il codice
 * deve rispettare: **dei suoi contatori uno si deriva e gli altri sono semi**.
 * Lo psicologo si conta dall'agenda della Dr.ssa Meier, che esiste; il coach no,
 * perché dietro il Dr. Fontana non c'è nessun portale. Scriverli tutti allo
 * stesso modo avrebbe fatto sembrare derivato anche ciò che non lo è.
 */

/*
 * IL COACH È UN SEME, DICHIARATO DAL §8: 1 seduta su 4.
 *
 * Non c'è un'agenda da cui contarla — il portale professionista della demo è
 * quello di una psicologa — quindi qui non si finge una derivazione. Il tetto
 * invece viene dal piano, come per lo psicologo: è il contratto commerciale a
 * dire quante sedute comprende, e ripeterlo qui vorrebbe dire poterlo
 * contraddire.
 *
 * Il giorno in cui un'agenda coach esistesse, `used` si conterebbe da lì con la
 * stessa funzione dello psicologo e questa costante sparirebbe.
 */
const COACH_SESSIONS_USED = 1;

/*
 * `extraSessionPrice` resta assente, e non è una dimenticanza: il §9 dà il
 * prezzo della seduta oltre il cap per lo psicologo (CHF 28 sul Plus) e non ne
 * dà nessuno per il coaching. Inventarlo violerebbe il §2.4, e uno zero direbbe
 * "gratis", che il Business Plan non promette. La schermata salta la riga.
 */
function coachEntitlement(): SessionEntitlement {
  return {
    used: COACH_SESSIONS_USED,
    total: COMPANY.plan.coachSessionsPerYear ?? 0,
  };
}

/** Il diritto alle sedute di Laura, per uno dei due servizi cappati dal Plus. */
export function employeeEntitlement(
  kind: CappedServiceKind,
): SessionEntitlement {
  if (kind === "coach") return coachEntitlement();
  return entitlementFor(PORTAL_PATIENT_EMPLOYEE_ID);
}

/*
 * I due consulti di medico virtuale del §8.
 *
 * **Il secondo è la conversazione che la schermata mostra**, aperta il giorno
 * della demo: senza quella coincidenza il Profilo direbbe "2" mentre chi guarda
 * è dentro il terzo, e il conto sarebbe già vecchio nel momento in cui lo si
 * legge.
 *
 * Il primo cade a maggio, dentro la finestra di dodici mesi della serie di
 * utilizzo — il guardrail in fondo verifica che sia un mese in cui l'azienda
 * qualche consulto lo ha fatto davvero, altrimenti il conto personale
 * contraddirebbe quello aziendale.
 */
export const LAURA_VIRTUAL_DOCTOR_CONSULTS: VirtualDoctorConsult[] = [
  {
    id: "consult-laura-1",
    startedAt: new Date(DEMO_TODAY.getFullYear(), 4, 12, 9, 20),
  },
  {
    id: "consult-laura-2",
    startedAt: DEMO_TODAY,
  },
];

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

for (const kind of ["psychologist", "coach"] as CappedServiceKind[]) {
  const entitlement = employeeEntitlement(kind);
  assertInDev(
    entitlement.total > 0,
    `Il piano di Demo SA non comprende il servizio "${kind}", ma il contatore di Laura lo mostra.`,
  );
  assertInDev(
    entitlement.used <= entitlement.total,
    `Laura ha usato ${entitlement.used} sedute di "${kind}" su ${entitlement.total} incluse.`,
  );
}

assertInDev(
  employeeEntitlement("coach").used === 1 &&
    employeeEntitlement("coach").total === 4,
  "Il §8 dà a Laura 1 seduta di coach su 4.",
);

assertInDev(
  employeeEntitlement("coach").extraSessionPrice === undefined,
  "Il §9 non dà un prezzo per la seduta di coaching oltre il cap: non se ne inventa uno.",
);

assertInDev(
  LAURA_VIRTUAL_DOCTOR_CONSULTS.length === 2,
  `Il §8 dà a Laura 2 consulti di medico virtuale, il dataset ne ha ${LAURA_VIRTUAL_DOCTOR_CONSULTS.length}.`,
);

const lastConsult =
  LAURA_VIRTUAL_DOCTOR_CONSULTS[LAURA_VIRTUAL_DOCTOR_CONSULTS.length - 1];

assertInDev(
  lastConsult.startedAt.getTime() === DEMO_TODAY.getTime(),
  "L'ultimo consulto di Laura non è quello aperto oggi: il Profilo conterebbe uno in meno di quelli che si vedono.",
);

for (const consult of LAURA_VIRTUAL_DOCTOR_CONSULTS) {
  assertInDev(
    consult.startedAt >= LAURA.memberSince && consult.startedAt <= DEMO_TODAY,
    "Un consulto di Laura cade fuori dall'anno di piano.",
  );

  const monthOfConsult = SERVICE_USAGE.find(
    (entry) =>
      entry.month.getFullYear() === consult.startedAt.getFullYear() &&
      entry.month.getMonth() === consult.startedAt.getMonth(),
  );

  assertInDev(
    monthOfConsult !== undefined &&
      monthOfConsult.sessions.virtual_doctor > 0,
    "Un consulto di Laura cade in un mese in cui l'azienda non ne ha fatto nessuno.",
  );
}
