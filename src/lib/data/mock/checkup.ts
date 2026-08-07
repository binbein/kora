import { assertInDev } from "../guardrails";
import type {
  CheckupBooking,
  CheckupEligibility,
  CheckupProvider,
  CheckupReport,
} from "../types";
import { COMPANY } from "./company";
import { DEMO_TODAY } from "./demo-date";
import { EMPLOYEE_DIRECTORY } from "./hr";
import { LAURA } from "./people";

/*
 * Il check-up di Laura e la rete convenzionata (CLAUDE.md §8, §10.B).
 *
 * È l'unico pezzo del dominio che tre aree diverse raccontano: il portale
 * dipendente lo prenota, l'elenco HR ne dichiara lo stato, il back-office segue
 * i convenzionamenti della rete. Tenerlo in un file solo è ciò che impedisce le
 * tre versioni — e le tre versioni c'erano: il codice ereditato dava a Laura un
 * check-up "disponibile" nella home mentre l'HR la dava "completata", e offriva
 * in prenotazione una struttura che l'admin dichiarava non ancora convenzionata.
 */

/*
 * Le cinque strutture del §8, con gli indirizzi generici che il §8 impone: una
 * via reale con il numero civico giusto identifica la struttura anche dopo che
 * il nome è cambiato.
 *
 * Le distanze sono dalla sede di Demo SA, che è a Lugano. Quattro vengono dalla
 * schermata ereditata; quella della Clinica Zaffiro è **una scelta di questo
 * file**, perché lì la struttura non compariva — è lo stesso caso delle tariffe
 * in `people.ts`, dove il documento dà la banda e non il singolo, e si dichiara
 * invece di far finta che il numero venga da qualche parte.
 */
export const CHECKUP_PROVIDERS: CheckupProvider[] = [
  {
    id: "ardesia",
    name: "Centro Medico Ardesia",
    city: "Lugano",
    address: "Via al Parco 4",
    distanceKm: 2.1,
    status: "active",
  },
  {
    id: "zaffiro",
    name: "Clinica Zaffiro",
    city: "Lugano",
    address: "Viale dei Faggi 30",
    distanceKm: 3.4,
    status: "active",
  },
  {
    id: "quarzo",
    name: "Poliambulatorio Quarzo",
    city: "Bellinzona",
    address: "Via delle Scuole 12",
    distanceKm: 28,
    status: "active",
  },
  {
    id: "onice",
    name: "Centro Salute Onice",
    city: "Locarno",
    address: "Via Campagna 7",
    distanceKm: 45,
    status: "active",
  },
  /*
   * In convenzionamento, e per questo non prenotabile: il back-office lo segue
   * con zero prenotazioni. È l'unico dei cinque.
   */
  {
    id: "basalto",
    name: "Centro Diagnostico Basalto",
    city: "Mendrisio",
    address: "Via Industria 18",
    distanceKm: 32,
    status: "pending",
  },
];

/*
 * Il check-up che Laura ha già fatto.
 *
 * Giorno e mese sono scritti, l'anno viene da `DEMO_TODAY`: è lo stesso schema
 * di `memberSince` e `contractRenewsOn`, e serve a non lasciare nel dataset una
 * data assoluta che invecchia mentre il giorno della demo resta l'unica manopola
 * (§5.4). A marzo, cioè abbastanza indietro perché il referto sia una cosa
 * archiviata e non l'appuntamento della settimana scorsa.
 */
export const LAURA_CHECKUP: CheckupBooking = {
  id: "checkup-laura",
  providerId: "ardesia",
  start: new Date(DEMO_TODAY.getFullYear(), 2, 15),
  status: "completed",
};

/*
 * Il piano Plus dà un check-up all'anno (§9), quindi il prossimo si apre dodici
 * mesi dopo quello fatto. Si calcola: scriverlo vorrebbe dire poter smentire la
 * cadenza del piano da cui discende.
 */
const CHECKUPS_PER_YEAR = 1;

export const LAURA_CHECKUP_ELIGIBILITY: CheckupEligibility = {
  lastCompleted: LAURA_CHECKUP,
  availableFrom: COMPANY.plan.checkup
    ? new Date(
        LAURA_CHECKUP.start.getFullYear() + CHECKUPS_PER_YEAR,
        LAURA_CHECKUP.start.getMonth(),
        LAURA_CHECKUP.start.getDate(),
      )
    : null,
};

/*
 * Il referto. I valori sono quelli della schermata ereditata: sono
 * dichiaratamente dimostrativi — la schermata lo dice con il disclaimer di M0 —
 * e non se ne inventano di nuovi.
 *
 * Due misure su cinque sono fuori norma, ed è la spiegazione a doverle coprire
 * entrambe: commentarne una sola lascerebbe l'altra segnalata in rosso e senza
 * risposta, che è il caso scoperto del §11.
 */
export const LAURA_CHECKUP_REPORT: CheckupReport = {
  bookingId: LAURA_CHECKUP.id,
  measurements: [
    { key: "blood_pressure", value: "120/80 mmHg", status: "normal" },
    { key: "cholesterol", value: "215 mg/dL", status: "attention" },
    { key: "ecg", value: "Ritmo sinusale", status: "normal" },
    { key: "bmi", value: "24.1", status: "normal" },
    { key: "stress_risk", value: "Moderato", status: "attention" },
  ],
  explanationKey: "laura",
};

// ---------------------------------------------------------------------------
// Guardrail (§5.6)
// ---------------------------------------------------------------------------

const providerIds = new Set(CHECKUP_PROVIDERS.map((provider) => provider.id));

assertInDev(
  providerIds.size === CHECKUP_PROVIDERS.length,
  "Due strutture della rete condividono lo stesso id.",
);

assertInDev(
  CHECKUP_PROVIDERS.filter((provider) => provider.status === "pending")
    .length === 1,
  "Il §8 dà una sola struttura in convenzionamento, il Centro Diagnostico Basalto.",
);

assertInDev(
  providerIds.has(LAURA_CHECKUP.providerId),
  `Il check-up di Laura è a "${LAURA_CHECKUP.providerId}", che non è nella rete.`,
);

/*
 * Un check-up non si fa in una struttura non ancora convenzionata: se un giorno
 * il dataset ce ne mettesse uno, la schermata mostrerebbe un referto emesso da
 * un centro che il back-office dichiara ancora in trattativa.
 */
assertInDev(
  CHECKUP_PROVIDERS.find((provider) => provider.id === LAURA_CHECKUP.providerId)
    ?.status === "active",
  "Il check-up di Laura è in una struttura non ancora convenzionata.",
);

assertInDev(
  LAURA_CHECKUP.start < DEMO_TODAY,
  "Il check-up di Laura è già stato fatto, quindi cade prima del giorno della demo.",
);

/*
 * Il vincolo che tiene unita la storia sui tre lati (§8): l'elenco che l'azienda
 * vede dichiara `completed` per la riga di Laura, e il portale dipendente non
 * può dire un'altra cosa. Se qualcuno cambia una delle due, questa riga lo ferma
 * invece di lasciare due schermate che si contraddicono.
 */
const lauraInDirectory = EMPLOYEE_DIRECTORY.find(
  (entry) => entry.employeeId === LAURA.id,
);

assertInDev(
  lauraInDirectory?.checkupStatus === "completed",
  `L'elenco HR dà il check-up di Laura come "${lauraInDirectory?.checkupStatus}", il portale dipendente lo dà come fatto.`,
);

assertInDev(
  LAURA_CHECKUP_ELIGIBILITY.availableFrom !== null &&
    LAURA_CHECKUP_ELIGIBILITY.availableFrom > DEMO_TODAY,
  "Il prossimo check-up di Laura si apre prima del giorno della demo: la pagina proporrebbe di prenotarne uno appena fatto.",
);

assertInDev(
  LAURA_CHECKUP_REPORT.bookingId === LAURA_CHECKUP.id,
  "Il referto non è quello del check-up che Laura ha fatto.",
);
