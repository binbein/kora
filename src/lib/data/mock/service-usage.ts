import { assertInDev } from "../guardrails";
import {
  quarterOf,
  type AppointmentKind,
  type Quarter,
  type ServiceUsageMonth,
} from "../types";
import { COMPANY } from "./company";
import { HISTORY_MONTHS, MONTHS_OF_HISTORY } from "./measurement";
import { PORTAL_SESSIONS } from "./professional-portal";

/*
 * L'utilizzo dei servizi, mese per mese (CLAUDE.md §8, §10.C.1).
 *
 * È la serie da cui la dashboard ricava le barre mensili e la ciambella, e da
 * cui il ROI ricava le sessioni consumate. Un solo dato, letto su periodi
 * diversi: è ciò che impedisce alla ciambella di dire 180 dove la KPI dice 142,
 * che è il difetto della schermata ereditata.
 *
 * LO PSICOLOGO NON SI SCRIVE, SI COMPONE. La Dr.ssa Meier è una dei
 * professionisti dell'azienda e la sua agenda esiste già (§10.D): le sue sedute
 * erogate sono un sottoinsieme di quelle aziendali, quindi il totale del mese
 * si ottiene sommando alla sua agenda la quota degli altri psicologi della
 * rete. Scriverlo a mano voleva dire poterlo contraddire — ed è successo: la
 * prima stesura di questa serie dava 10 sedute aziendali a settembre, mese in
 * cui la sola Meier ne eroga 14.
 */

/** Quante sedute ha erogato la Dr.ssa Meier in ogni mese della finestra. */
const MEIER_DELIVERED: number[] = HISTORY_MONTHS.map(
  (month) =>
    PORTAL_SESSIONS.filter(
      (session) =>
        session.status === "completed" &&
        session.start.getFullYear() === month.getFullYear() &&
        session.start.getMonth() === month.getMonth(),
    ).length,
);

/*
 * La quota degli altri psicologi della rete — Colombo e Rossi — mese per mese.
 *
 * Resta quasi piatta e cala di poco verso la fine: la crescita dell'ultimo
 * semestre è capacità nuova, non un travaso. La Dr.ssa Meier prende i primi
 * pazienti a marzo, e da lì l'agenda aziendale cresce perché cresce lei.
 */
const OTHER_PSYCHOLOGISTS = [7, 7, 8, 8, 8, 7, 7, 6, 6, 6, 5, 4];

/*
 * Gli altri tre servizi, approvati dai founder il 07.08.2026 (§8).
 *
 * Stessa forma dello psicologo: crescono con l'adozione, che nell'anno passa da
 * 39 a 82 iscritti (§9), e l'ultimo mese scende perché è parziale — la demo è
 * al 23 di settembre, cioè al 77% del mese.
 *
 * I tetti che li vincolano vivono sul piano e sull'organico, non qui: coach e
 * check-up sono verificati contro il monte del Plus dai guardrail in fondo.
 */
const VIRTUAL_DOCTOR = [5, 6, 8, 9, 10, 10, 11, 12, 12, 13, 12, 10];
const COACH = [4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 7];
const CHECKUP = [2, 3, 3, 4, 4, 5, 5, 5, 6, 5, 5, 4];

export const SERVICE_USAGE: ServiceUsageMonth[] = HISTORY_MONTHS.map(
  (month, index) => ({
    month,
    sessions: {
      psychologist: MEIER_DELIVERED[index] + OTHER_PSYCHOLOGISTS[index],
      virtual_doctor: VIRTUAL_DOCTOR[index],
      coach: COACH[index],
      checkup: CHECKUP[index],
    },
  }),
);

/*
 * Ordine totale sui trimestri, per confrontarli senza passare dalle date.
 *
 * **Sta anche in `HRDashboard.tsx`, ed è voluto.** Condividerla vorrebbe dire
 * spostarla, perché la regola di lint del §5.7 vieta alle schermate di importare
 * da `lib/data/mock/`: il seam vale più di sei righe di duplicazione. Il giorno
 * in cui una terza copia servisse, il posto è `types.ts` accanto ad
 * `addQuarters` e `sameQuarter` — non un file nuovo.
 */
function quarterRank(period: Quarter): number {
  return period.year * 4 + period.quarter;
}

/**
 * L'utilizzo **cumulato** dall'inizio della finestra alla fine del trimestre
 * dato.
 *
 * Cumulato e non "del trimestre" perché è la stessa grandezza della KPI delle
 * sessioni, che il §9 dichiara cumulata sui dodici mesi del monte annuo: la
 * fetta psicologo della ciambella e il numeratore della KPI devono essere lo
 * stesso numero, non due che si somigliano.
 */
export function usageThrough(period: Quarter): Record<AppointmentKind, number> {
  const limit = quarterRank(period);
  const total: Record<AppointmentKind, number> = {
    psychologist: 0,
    virtual_doctor: 0,
    coach: 0,
    checkup: 0,
  };

  for (const entry of SERVICE_USAGE) {
    if (quarterRank(quarterOf(entry.month)) > limit) continue;
    for (const kind of Object.keys(total) as AppointmentKind[]) {
      total[kind] += entry.sessions[kind];
    }
  }

  return total;
}

/** Le sedute di psicologo consumate dall'azienda fino a fine trimestre. */
export function sessionsUsedThrough(period: Quarter): number {
  return usageThrough(period).psychologist;
}

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

/*
 * I quattro totali sui dodici mesi che il §8 dichiara. Erano verificati solo
 * per lo psicologo: gli altri tre avevano un controllo sul **tetto** — che è
 * un'altra domanda, e passa anche con la metà delle sessioni — quindi la
 * ciambella poteva allontanarsi dal documento senza che niente lo dicesse.
 */
const COMPANY_SESSIONS_PER_YEAR = 142;
const VIRTUAL_DOCTOR_PER_YEAR = 118;
const COACH_PER_YEAR = 85;
const CHECKUP_PER_YEAR = 51;

const psychologistTotal = SERVICE_USAGE.reduce(
  (sum, entry) => sum + entry.sessions.psychologist,
  0,
);
assertInDev(
  psychologistTotal === COMPANY_SESSIONS_PER_YEAR,
  `Le sedute di psicologo sui dodici mesi sono ${psychologistTotal}, non le ${COMPANY_SESSIONS_PER_YEAR} del §8: la ciambella e la KPI direbbero due numeri diversi.`,
);

const virtualDoctorTotal = SERVICE_USAGE.reduce(
  (sum, entry) => sum + entry.sessions.virtual_doctor,
  0,
);
assertInDev(
  virtualDoctorTotal === VIRTUAL_DOCTOR_PER_YEAR,
  `I consulti di medico virtuale sui dodici mesi sono ${virtualDoctorTotal}, non i ${VIRTUAL_DOCTOR_PER_YEAR} del §8.`,
);

/*
 * IL VINCOLO DELLA CIAMBELLA (§8): il medico virtuale sta **sotto** lo
 * psicologo. La frase che il pitch pronuncia è che il supporto psicologico è
 * la fetta più grande, e senza questo controllo un servizio illimitato e a
 * bassa frizione la supererebbe alla prima volta che qualcuno ritocca le
 * curve — il grafico direbbe il contrario del discorso, mentre è a schermo.
 */
assertInDev(
  virtualDoctorTotal < psychologistTotal,
  `Il medico virtuale (${virtualDoctorTotal}) supera lo psicologo (${psychologistTotal}): la ciambella smentirebbe la frase del §8 sulla fetta più grande.`,
);

/*
 * IL VINCOLO CHE HA RIDISEGNATO LA SERIE: l'azienda non può consumare meno
 * sedute di quante ne eroghi una sola delle sue professioniste.
 *
 * Oggi non può fallire, perché la serie somma proprio la sua agenda; serve nel
 * caso in cui qualcuno torni a scrivere i totali a mano, che è come è nata la
 * contraddizione la prima volta. In produzione salta insieme all'assunzione che
 * tutti i pazienti della Dr.ssa Meier siano di Demo SA
 * (`docs/CONTRATTO-DATI.md` §7), ed è il suo mestiere.
 */
SERVICE_USAGE.forEach((entry, index) => {
  assertInDev(
    entry.sessions.psychologist >= MEIER_DELIVERED[index],
    `Nel mese ${index + 1} l'azienda consuma ${entry.sessions.psychologist} sedute di psicologo, meno delle ${MEIER_DELIVERED[index]} che la Dr.ssa Meier eroga da sola.`,
  );
});

/*
 * Il coach e il check-up hanno un tetto e vanno verificati contro quello, non
 * contro un numero copiato: il monte del coaching è organico per sessioni del
 * piano, il check-up è annuale e uno a testa.
 */
const coachTotal = SERVICE_USAGE.reduce(
  (sum, entry) => sum + entry.sessions.coach,
  0,
);
const coachAllowance =
  COMPANY.employeeCount * (COMPANY.plan.coachSessionsPerYear ?? 0);
assertInDev(
  coachTotal <= coachAllowance,
  `Il coaching consuma ${coachTotal} sessioni su un monte di ${coachAllowance}.`,
);
assertInDev(
  coachTotal === COACH_PER_YEAR,
  `Le sessioni di coaching sui dodici mesi sono ${coachTotal}, non le ${COACH_PER_YEAR} del §8.`,
);

const checkupTotal = SERVICE_USAGE.reduce(
  (sum, entry) => sum + entry.sessions.checkup,
  0,
);
assertInDev(
  checkupTotal <= COMPANY.employeeCount,
  `I check-up sono ${checkupTotal} su un organico di ${COMPANY.employeeCount}, e il piano ne dà uno a testa.`,
);
assertInDev(
  checkupTotal === CHECKUP_PER_YEAR,
  `I check-up sui dodici mesi sono ${checkupTotal}, non i ${CHECKUP_PER_YEAR} del §8.`,
);

/*
 * Le curve crescono con l'adozione, e si verifica **per trimestre**: il mese
 * ha oscillazioni che vengono dall'agenda vera — la Dr.ssa Meier non eroga lo
 * stesso numero di sedute ogni mese — e imporre una crescita mensile
 * costringerebbe a inventare una regolarità che nessuna agenda ha.
 *
 * L'ultimo trimestre è parziale ma cresce lo stesso: se un giorno smettesse di
 * farlo, la KPI "sessioni usate" scenderebbe passando al trimestre in corso, e
 * a schermo si leggerebbe come un calo dell'adozione invece che come un mese
 * non ancora finito.
 */
const QUARTERS_IN_WINDOW = HISTORY_MONTHS.map((month) => quarterOf(month))
  .map(quarterRank)
  .filter((rank, index, all) => all.indexOf(rank) === index);

assertInDev(
  QUARTERS_IN_WINDOW.length === MONTHS_OF_HISTORY / 3,
  `La finestra di ${MONTHS_OF_HISTORY} mesi copre ${QUARTERS_IN_WINDOW.length} trimestri invece di ${MONTHS_OF_HISTORY / 3}: i totali per trimestre non sarebbero somme di tre mesi.`,
);

const perQuarter = QUARTERS_IN_WINDOW.map((rank) =>
  SERVICE_USAGE.filter(
    (entry) => quarterRank(quarterOf(entry.month)) === rank,
  ).reduce((sum, entry) => sum + entry.sessions.psychologist, 0),
);

for (let index = 1; index < perQuarter.length; index += 1) {
  assertInDev(
    perQuarter[index] > perQuarter[index - 1],
    `Le sedute di psicologo non crescono di trimestre in trimestre: ${perQuarter.join(", ")}.`,
  );
}
