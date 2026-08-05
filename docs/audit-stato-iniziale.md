# KORA frontend — audit dello stato iniziale

Verifica del repository contro `CLAUDE.md` e `docs/PROGRESS.md`, prima di qualunque
intervento. Prodotto nella prima sessione di lavoro, sul commit `init`.

Questo file è un **riscontro**, non una fonte di regole: le regole stanno in
`CLAUDE.md`, lo stato di avanzamento in `docs/PROGRESS.md`. Serve a correggere la
mappa prima di usarla, e va letto una volta sola — quando M0 è chiusa, quello che
resta valido migra nei due file ufficiali e questo si può cancellare.

Metodo: lettura di tutti i 25 file di pagina e dei componenti condivisi, esecuzione
di `npm run lint` e `npm run typecheck`, verifica a schermo su `localhost:5173`,
e ricalcolo di ogni cifra citata dai documenti.

---

# 1. Riscontro sullo stato reale

## 1.1 Le rotte: sono 25, non 21

Prima correzione alla mappa, ed è strutturale perché il numero compare tre volte
(`CLAUDE.md` §2.7 "21 schermate", §10 "21 rotte", `PROGRESS.md` "21 rotte").

| Area | Rotte in `src/App.jsx` | §10 dice |
|---|---|---|
| Pubblica | 3 — `/`, `/pricing`, `/demo` | 3 ✓ |
| Dipendente | 6 — `/employee` + psicologi, medico, checkup, **piano**, profilo | "+5 sottopagine" = 6 ✓ |
| HR | 5 | 5 ✓ |
| Professionista | 5 | 5 ✓ |
| Admin | 6 — `/admin` + utenti, professionisti, sessioni, provider, analytics | "+5 sottopagine" = 6 ✓ |
| **Totale** | **25** (+ catch-all 404) | header dice 21 |

Le sotto-liste del §10 sono giuste una per una: è solo il totale in testa alla
sezione a essere sbagliato. Nessuna rotta in più o in meno rispetto a quelle
descritte — l'inventario è corretto, il conto no.

## 1.2 Nessun layer dati — confermato, ed è peggio di "costanti in cima al file"

Le costanti in cima ci sono (36 dichiarazioni `const X = [...]` su 25 pagine), ma il
problema vero è che **le stesse grandezze divergono fra schermate adiacenti**.
Numeri verificati:

| Grandezza | Dove dice X | Dove dice Y |
|---|---|---|
| Organico Demo/Alpine | 150 (`HRNav.jsx:42`, `HRFatturazione.jsx:36`, `AdminAziende.jsx:10`) | §8 dice 120 |
| Attivati | "124/150 · 82%" (`HRDashboard.jsx:54`) | "6/8 attivati" (`HRDipendenti.jsx:25`) |
| Sessioni psicologo | 180 (`HRDashboard.jsx`, 3 volte) | §8 dice 142 |
| Pazienti Dr.ssa | KPI "18" (`ProCalendario.jsx:39`) | "6 pazienti attivi" (`ProPazienti.jsx:20`) |
| Utenti piattaforma | "Totale utenti 7" (`AdminUtenti.jsx:40`) | "Utenti attivi 618" (`AdminAnalytics.jsx:44`) |

I due conti dell'admin che il §10.E cita, calcolati:

- **618 vs 767** ✓ confermato. Le aziende in `AdminAziende.jsx:10-14` sommano 913
  dipendenti; 913 × 84% (l'*activation rate* dichiarato accanto) = **766,9**. La KPI
  ne dichiara 618.
- **Fatturato che non torna** ✓ confermato. Le cinque aziende sommano
  CHF 728'868/anno → **60'739/mese**; `AdminAnalytics.jsx` dichiara
  "Revenue Apr CHF 81K".

Ci sono anche **tre roster di professionisti diversi** che non si parlano:
Bianchi/Keller/Bernasconi (`Psicologi.jsx:8`), Bianchi/Ferretti/Sergi/Kramer/Valli
(`AdminProfessionisti.jsx:10`), e Colombo/Rossi/Meier/Fontana (§8). Il portale
professionista è quello della **Dr.ssa Bianchi**, non della Meier che §10.D
prescrive; e il medico virtuale si chiama "Dr. Andrea Fontana" (`Medico.jsx:11`)
mentre in §8 Fontana è il coach.

Nota metodologica: due pagine mostrano `0` costanti nel conteggio
(`HRFatturazione.jsx`, `DemoRequest.jsx`) non perché siano pulite, ma perché tengono
i numeri **direttamente in JSX** — che è il caso peggiore.

## 1.3 I difetti di PROGRESS.md, uno per uno

### ✅ Link di menu rotto — confermato, e sono 3 punti non 1

`/employee/piano-ai` in `EmployeeNav.jsx:11`, `EmployeeHome.jsx:123` e
`EmployeeHome.jsx:156`. La rotta registrata è `/employee/piano` (`App.jsx:81`).
Incrociando tutti i `to=` e `path:` del progetto contro la tabella delle rotte:
**è l'unico target rotto in tutto il repository**. Verificato a schermo — porta a un
404 in inglese, senza navigazione, con solo un pulsante "Go Home".

### ✅ Date con giorno della settimana sbagliato — confermato, ma sono 4 coppie (7 occorrenze), non 5

Tutte in `ProSessioni.jsx:12-24`, tutte sbagliate:

| Nel codice | Giorno reale nel 2026 |
|---|---|
| Mar 29 Apr | **mercoledì** |
| Gio 24 Apr | **venerdì** |
| Mar 22 Apr | **mercoledì** |
| Lun 21 Apr | **martedì** |

Sono sbagliate tutte **dello stesso identico scarto: un giorno indietro**. È il
calendario 2025 con l'anno riscritto a mano. Il difetto è meccanico, non casuale —
il che è una buona notizia per M3.

Altre 4 date con lo stesso odore, che i documenti non citano:

- "Check-up 15 Marzo 2026" (`Checkup.jsx:45`) → **domenica**
- Pagamento "5 Apr 2026" (`ProPagamenti.jsx:9`) → **domenica**
- Seduta "18 Apr 2026" (`ProPazienti.jsx:8`) → **sabato**
- "1 Mag" e "6 Mag" (`ProPazienti.jsx`) → venerdì e mercoledì, mentre
  `ProProfilo.jsx:19` dichiara disponibilità **"Martedì e Giovedì"**

### ✅ Importi non formattati in svizzero — confermato, due difetti distinti

- **6 importi scritti a mano all'italiana**: `CHF 8.250` e `CHF 99.000`
  (`HRFatturazione.jsx`, 3 punti), `CHF 14.200` (`HRDashboard.jsx`), `CHF 1.800` e
  `CHF 6.300` (`ProPagamenti.jsx`).
- **9 `toLocaleString()` senza locale**. A schermo, nel browser, escono **en-US**:
  fotografato `/admin` che mostra `CHF 99,000` / `CHF 413,280` / `CHF 138,600`.

### ✅ Marchio a metà — confermato, ed è più esteso del previsto

"HealthOS" compare in **10 stringhe visibili all'utente** (PrivacyBanner di default,
HRDashboard "Piano HealthOS Plus", HRPrivacy ×2, HRDipendenti, Medico, Profilo
"HealthOS Plus", ProPagamenti, ProProfilo, Checkup "HealthOS Partner Clinic"). Il
componente si chiama `HealthOSLogo` (`src/components/shared/HealthOSLogo.jsx`) ed è
importato da 7 file — ma il testo che disegna è "Kora". A schermo la sidebar HR dice
**Kora** e la riga sotto dice **"Piano HealthOS Plus"**: si vedono insieme.

Fuori dai documenti: `index.html` ha `<title>Kora — **Salud** aziendale
svizzera</title>` (spagnolo), `lang="en"`, la favicon puntata a
`https://base44.com/logo_v2.svg` (**richiesta a terzi a ogni caricamento**, su un
sito che vende hosting svizzero) e un `<link rel="manifest">` che fa 404 perché
`public/` non esiste. Il `name` in `package.json` è ancora `base44-app` e il README è
quello di base44.

### ✅ Nomi di aziende e cliniche reali — confermato, ed è la cosa più seria

**Aziende clienti** (`AdminAziende.jsx:13-14`): **Swisscom Innovation Lab** e
**Reale Mutua Ticino**, con tanto di fatturato annuo attribuito.

**Persone inventate con email su dominio reale** (`AdminUtenti.jsx:16-17`):
`c.verdi@swisscom.ch`, `r.neri@swisscom.ch` — con Health Score associato.

**Strutture sanitarie** (`AdminProvider.jsx:10-14`): **Clinica Moncucco**,
**Hirslanden Lugano**, **Ospedale Mendrisio** — presentate come partner
convenzionati, con volumi di prenotazioni. Più Medicheck SA e Centro Medico Locarno,
e in `Checkup.jsx:9` Centro Medico Lugano / Centro Diagnostico Chiasso / CDS Partner
Network.

Verificato a schermo: `/admin` si apre senza alcuna barriera e mostra Swisscom e
Reale Mutua in tabella con il fatturato accanto.

### ✅ `/admin` non protetto — confermato, con un problema che i documenti non prevedono

`src/components/ProtectedRoute.jsx` esiste, non è usato da nessuna rotta — ma
**dipende da `useAuth()` di base44**. Usarlo oggi manderebbe l'utente al login di
base44. Non è quindi la soluzione per M0: serve una scelta diversa (§3.4 sotto).

## 1.4 Dipendenze mai importate

Incrociata ogni dipendenza contro tutti i sorgenti (`src/` + `index.html` + i file di
config).

**Rimovibili senza discussione (13):** `three`, `react-leaflet`, `react-quill`,
`moment`, `lodash`, `@stripe/react-stripe-js`, `@stripe/stripe-js`,
`canvas-confetti`, `@hello-pangea/dnd`, `react-markdown`, `react-hot-toast`,
`date-fns`, **`@radix-ui/react-toast`**.

Due correzioni alla lista del §3:

- **`tailwindcss-animate` NON è inutilizzato**: è caricato da `tailwind.config.js`
  come plugin. Una scansione del solo `src/` lo darebbe per morto — la lista del §3
  fa bene a non citarlo.
- **`@radix-ui/react-toast` è inutilizzato e i documenti non lo dicono**:
  `src/components/ui/toast.jsx` è una reimplementazione senza Radix (`ToastProvider`
  è un `<div>`). Il `<Toaster />` montato in `App.jsx:125` funziona ma non è il
  componente shadcn che sembra.

**Da tenere:** `zod`, `react-hook-form`, `@hookform/resolvers` (§3, M5).
`react-hook-form` è già usato indirettamente da `ui/form.jsx`.

**Decisione dei founder:** `jspdf` e `html2canvas` — oggi non li importa nessuno, e
il ragionamento del §3 sul report scaricabile (§10.C.3) è confermato.

**Terzo caso non previsto:** `next-themes` ha un solo import, in `ui/sonner.jsx` —
che a sua volta non è usato da nessuno. Il §6.1 dice esplicitamente "nessun
`next-themes`". Sono due file morti che si tengono in piedi a vicenda.

## 1.5 `npm run lint` e `npm run typecheck`: la conclusione è giusta, la causa no

**La premessa su `reference/` è sbagliata: non entra già oggi in nessuno dei due.**
Verificato eseguendoli.

- **ESLint** non lo tocca perché `eslint.config.js:9-13` ha un `files` che elenca
  solo `src/components/**` e `src/pages/**`: in flat config un file che non matcha
  nessun `files` non viene lintato. (Per lo stesso motivo `src/lib`, `src/api`,
  `src/App.jsx`, `src/main.jsx` **non sono lintati affatto**.)
- **tsc** non lo tocca perché `jsconfig.json:19` ha `include` limitato a
  `src/components/**/*.js` e `src/pages/**/*.jsx`, e nessun file di `src/` importa da
  `reference/`. Errori per directory: **0 da `reference/`**.

**Ma sono comunque inutilizzabili**, per altri motivi:

| | `npm run lint` | `npm run typecheck` |
|---|---|---|
| Esito | exit **1** — 36 errori | exit **2** — **421 errori** |
| Natura | tutti `unused-imports/no-unused-imports`, tutti auto-fixabili | rumore ereditato |
| Copertura | solo `components/` e `pages/` | vedi sotto |

I 421 errori di tsc hanno una causa precisa e istruttiva: `exclude` elenca
`src/components/ui` e `src/lib`, ma **`exclude` non ferma gli import transitivi**. Le
pagine importano i componenti shadcn non tipizzati, quindi tsc li controlla lo
stesso: 47 errori da `components/ui/`, 8 da `lib/app-params.js` (`import.meta.env`
non riconosciuto, perché `types: []` e manca `vite/client`). Poi 161 `TS2322` e 124
`TS2559` che sono la stessa cosa moltiplicata: ogni `<Card className=…>` risolve a
`RefAttributes<any>` senza `children`.

Una buona notizia: **tsc non emette file.** TypeScript, quando il config si chiama
`jsconfig.json`, forza `noEmit`. Controllato `git status` prima e dopo: pulito.

## 1.6 Cose che i documenti non prevedono e vanno messe sulla mappa

1. **Il §5 del CLAUDE.md e `reference/lib/data/` sono incompatibili per costruzione,
   non per dettaglio.** `reference/lib/data/provider.ts` è **sincrono di proposito** e
   lo dichiara in un commento che cita CLAUDE.md; la reattività passa da
   `use-data.ts`, che è un `useSyncExternalStore` su un contatore di versione. Non è
   react-query, e non è convertibile per copia. `PROGRESS.md` ("Note per chi
   riprende") dice che *"tutto `lib/data/`… va **copiato** invece che riscritto"*: per
   `types.ts`, `format.ts`, `dates.ts`, `roi-model.ts`, `i18n/it.ts` e i dataset è
   vero; per `provider.ts`, `index.ts`, `use-data.ts` e le firme dei mock non lo è.
   Vedi punto 2.
2. **`reference/` non contiene `src/`** ma direttamente `app/`, `components/`, `lib/`
   (82 file). CLAUDE.md dice "contiene solo il suo `src/`" — cambia i percorsi da
   citare.
3. **Esiste già un file TypeScript in `src/`**: `src/utils/index.ts`, con
   `createPageUrl`, **mai importato da nessuno**. Il repo non è "tutto .jsx".
4. **`src/lib/PageNotFound.jsx` è una perdita del Builder**: è in inglese, fa una
   chiamata a `base44.auth.me()` che fallisce, e ha un blocco che recita *"This could
   mean that the AI hasn't implemented this page yet. Ask it to implement it in the
   chat."* Ci si arriva dal link rotto del menu dipendente.
5. **Il form demo si pianta per sempre.** `DemoRequest.jsx:24` fa
   `await base44.entities.DemoRequest.create(...)` senza try/catch: la promise
   rigetta, `setLoading(false)` non viene mai eseguito, il pulsante resta su "Invio in
   corso…". È il CTA primario della landing, ripetuto 4 volte fra hero, prezzi e CTA
   finale.
6. **`ProtectedRoute` non è riutilizzabile per M0** (vedi sopra).
7. **Polarità dei colori invertita nella KPI più importante della dashboard.**
   `KPICard.jsx:37-43` tratta ogni trend negativo come `destructive`: "Stress medio
   −8%" — che è la buona notizia della storia — esce **in rosso con la freccia in
   giù**.
8. **Il piano AI consiglia un servizio che il piano non include**: `PianoAI.jsx:23`
   dice *"Consulta la nutrizionista inclusa nel piano"* a una persona su Plus, mentre
   §9 dà la nutrizionista solo a Executive.
9. **Un prezzo non nel Business Plan oltre a quelli già noti**: *"Estensione partner:
   + CHF 15/mese"* (`Pricing.jsx:36`). Viola §2.4 come il "CHF 1'400–2'900".
10. **Nascondere il piano Personalizzato lascia un buco**: la griglia è
    `lg:grid-cols-4` con 3 piani + `<FlexiblePlanCard />`. Togliendo la card servono
    3 colonne, altrimenti resta una cella vuota.
11. **`Psicologi.jsx:130` mostra la data grezza ISO** (`2026-08-05`) nel riepilogo e
    nella conferma, mentre i pulsanti la formattano. Ed è `it-IT`, non `it-CH`.
12. **Il `logLevel: 'error'` che nasconde l'indirizzo è del repository, non del
    plugin**: sta in `vite.config.js:7`. Il plugin lo imposta solo dentro il sandbox
    di base44. Togliendo il plugin l'indirizzo resta invisibile finché non si toglie
    quella riga.
13. **Verificato l'allarme del §3 sull'alias `@/`**: è reale. Il plugin lo inietta in
    `node_modules/@base44/vite-plugin/dist/index.js:17` come
    `resolve.alias { "@/": "/src/" }`. Nessun altro punto del repo lo definisce.
14. **I cinque numeri di ancoraggio del §9 tornano tutti.** Ricalcolati dalle
    formule: perdite 1'289'500 · risparmio 221'150 · costo 66'000 · netto 155'150 ·
    ROI 2,3507 → **2.35:1**. Il §9 è internamente coerente; è l'unica parte della
    mappa verificabile per intero, e regge.

Verificato anche il conto del §10.A.3 sul piano Personalizzato: la preselezione
(psy6 18 + medico 8 + check-up 10 + AI 6 = 42) a 150 dipendenti con sconto 10% dà
`round(37,8)` = **CHF 38**, identico all'Essenziale, offrendo medico illimitato e
check-up che l'Essenziale non ha. E i prezzi dei moduli sono **esattamente undici**.
Confermato alla cifra.

---

# 2. I tre punti di attrito col §5

Non un piano ottimista: dove il contratto dati farà fatica davvero.

### Attrito 1 — Il magazzino non contiene il pezzo che serve di più (il più costoso)

È il punto più preoccupante perché **è quello su cui i documenti sono più sicuri di
sé**. `PROGRESS.md` promette che `lib/data/` si copia. In realtà si copiano
`types.ts`, i dataset e i file puri; **`provider.ts`, `index.ts`, `use-data.ts` e ogni
firma dei mock vanno riprogettati**, perché il provider di riferimento è sincrono per
scelta dichiarata e la reattività passa da un contatore di versione su
`useSyncExternalStore`.

Il rischio non è il lavoro in più: è che M2 **cominci copiando** e si accorga a metà
che il modello reattivo non regge, con react-query e il version counter che convivono
per un po'. Quello è esattamente lo stato in cui, secondo il §5.7, viene il pensiero
*"conviene rifarlo pulito"* — cioè il segnale da riportare ai founder.

Proposta: in M2 **trattare `reference/lib/data/` come una specifica da leggere, non
come sorgente da copiare**, e copiare per davvero solo `types.ts` e i dataset. È una
scelta che cambia la stima di M2 e il testo di `PROGRESS.md`.

### Attrito 2 — Il §5.5 ("niente si scrive a mano se si può derivare") è in conflitto con dati che oggi si contraddicono

Derivare è facile quando c'è **una** verità. Qui ce ne sono due o tre per grandezza:
618 vs 767 utenti, 18 vs 6 pazienti, 180 vs 142 sessioni, 81K vs 60,7K di fatturato,
tre roster di professionisti.

Nel momento in cui la dashboard HR e l'admin leggono dallo stesso provider, **una
delle due cifre di ogni coppia sparisce a schermo** — e sparisce anche il modo in cui
base44 aveva riempito quello spazio. Un esempio concreto: il §8 dice che le sessioni
azienda sono 142 su un monte di 1'200 → 12%. Oggi la stessa card dice "Supporto
mentale 22%" con "180 sessioni erogate". Migrando, quella KPI passa da 22% a 12% e il
numero grande da 180 a 142: **la schermata racconta una storia diversa**, non solo
numeri diversi. Moltiplicato per cinque aree, M3 non è "sostituisci la fonte", è
"ridisegna la card perché il numero vero ha una forma diversa".

Il §8 lo prevede in un punto (la barra sottile per il 12%), il che è un ottimo segno.
Ma è previsto per **una** KPI su decine.

### Attrito 3 — Il §5.2 vieta `useState` per i dati, e le pagine oggi lo usano per l'interazione

Nessuna pagina copia dati in `useState`, quindi la regola sembra a costo zero. Non lo
è, per un motivo più sottile: **oggi l'interazione non produce effetti, quindi non c'è
stato da propagare**. La prenotazione in `Psicologi.jsx:52` è `setBooked(true)` e
finisce lì.

Il §10.B chiede che quella prenotazione muova il contatore, compaia in home, tolga lo
slot e appaia nel calendario del professionista. Quel giorno lo `useState` locale che
oggi è legittimo (`selectedPro`, `bookingStep`, `selectedTime`) deve convivere con una
mutation che invalida quattro query in tre aree — e il confine fra "stato del dialogo"
e "stato del dominio" passa **dentro** quel componente, non fra componenti. È il punto
in cui la regola "react-query è l'unico modo" smette di essere una regola di import e
diventa una decisione di design per ogni schermata interattiva.

C'è poi il vincolo del §5.1 che rende tutto più stretto: **provider asincrono ma
nessuno spinner**. Con react-query si ottiene, ma solo se le query sono pre-riempite o
risolte nello stesso tick — e va deciso *come* in M2, non scoperto in M3 davanti a un
flash di scheletri durante il pitch.

**Dove NON si prevede attrito**, per contrasto: `DEMO_TODAY` è quasi indolore — c'è
**un solo** `new Date()` in tutto `src/` (`Psicologi.jsx:59`), esattamente come dice
il §5.4. E i guardrail del §5.6 hanno già oggi quattro bersagli veri e misurabili (le
coppie divergenti del punto 1.2).

---

# 3. Proposta operativa per M0

Vincoli: **nessun TypeScript, nessun file nuovo in `src/lib`, nessun tocco
all'architettura dati, nessuna schermata nuova**. Ogni punto è un commit conventional
separato. Dopo ogni punto la demo resta navigabile.

## 3.0 — Prima di M0: la base di verifica

**Le esclusioni di lint non servono, e quello che serve al loro posto va fatto prima
di M0.**

Non c'è niente da escludere: `reference/` è già fuori da entrambi i comandi. Il
problema è un altro, ed è che oggi non esiste **nessun** riferimento verde su cui
appoggiarsi.

Proposta in due tempi:

- **Prima di M0 (piccolo, 15 minuti):** correggere lo `files` di `eslint.config.js`
  perché copra anche `src/lib`, `src/api`, `src/App.jsx`, `src/main.jsx` (oggi non
  lintati), aggiungere un `ignores: ["reference/**", "dist/**"]` esplicito — che non
  cambia il comportamento ma rende leggibile l'intenzione — e passare `--fix` sui 36
  import inutilizzati. **Da lì `npm run lint` esce 0**, e per tutta M0 c'è un
  controllo binario. È configurazione, non architettura.
- **In M1, non prima:** `jsconfig.json`. Sistemarlo bene significa decidere cosa fare
  dei 421 errori ereditati — il candidato naturale è `tsconfig.json` con `strict` sul
  codice nuovo e i `.jsx` shadcn fuori dal perimetro, ma è la stessa decisione che M1
  prende quando introduce TypeScript. Farla ora significa farla due volte.

Per M0 il typecheck resta rotto: si annota **421** come baseline e si verifica solo
che non cresca.

## 3.1 — Nomi di aziende e strutture reali *(sblocca il deploy — primo per questo motivo)*

| File | Interventi |
|---|---|
| `AdminAziende.jsx:9` | 5 ragioni sociali → nomi di fantasia |
| `AdminUtenti.jsx:10` | 7 nominativi: aziende + **domini email** |
| `AdminProvider.jsx:9` | 5 strutture sanitarie + indirizzi |
| `Checkup.jsx:8` | 4 centri check-up |
| 6 punti | `Alpine Finance SA` → `Demo SA` |

**Due cose in attesa di decisione:**

**(a) Serve un criterio di naming, e §8 dà solo "Demo SA".** Proposta da approvare o
cambiare: aziende con nome palesemente costruito e coerente col settore
(`Verbano Logistica SA`, `Ceresio Assicurazioni SA`…), strutture sanitarie con
toponimo generico + qualificatore (`Centro Salute Ceresio`, `Poliambulatorio
Verbano`), domini email `@` + slug dell'azienda + `.example` o `.ch` inventato. Il
punto che conta: **nessun nome che una ricerca possa far coincidere con un soggetto
esistente**.

**(b) `150 → 120` non va fatto in M0.** Il rename di stringa è gratis; il cambio di
organico no: trascina `CHF 8.250 → 6.600`, `CHF 99.000 → 79.200`, `124/150`, il
fatturato in `AdminAziende` e la coerenza con le percentuali. Sono ricalcoli su cifre
derivate, cioè precisamente il lavoro che M3 farà leggendo dal provider. Farlo a mano
ora significa scriverle due volte. **M0 lascia 150 e lo dichiara.**

## 3.2 — Marchio

- 10 stringhe `HealthOS` → `Kora`
- `HealthOSLogo.jsx` → `KoraLogo.jsx` + 7 import
- `index.html`: `Salud` → `Salute`, `lang="en"` → `lang="it"`, favicon base44 → SVG
  locale (elimina la richiesta a terzi), rimuovere il `<link rel="manifest">` che fa
  404
- `package.json` `name`, e README riscritto (oggi dice che i push si riflettono nel
  Builder — non è più vero e chi legge ci crede)

## 3.3 — Link morti e vicoli ciechi

- **Una riga**: `App.jsx:81` `path="piano"` → `path="piano-ai"`. Nessun file punta a
  `/employee/piano`, quindi correggere la rotta costa 1 modifica invece di 3 e allinea
  l'URL all'etichetta "Piano AI".
- `PageNotFound.jsx`: tradurre in italiano, **eliminare il blocco "Admin Note" del
  Builder**, eliminare la `useQuery` su `base44.auth.me()` che resta senza scopo (è
  l'unico punto in cui M0 sfiora l'SDK di M1 — e solo per cancellare), e
  `window.location.href` → `<Link>` per non ricaricare la pagina.

## 3.4 — `/admin` *(serve una decisione)*

`ProtectedRoute` è inservibile (dipende dall'auth base44). Il §10.E dice "protetto
**o** marcato come dati dimostrativi". **Raccomandata la seconda**: un banner fisso in
cima ad `AdminLayout.jsx` — "Back-office interno · dati dimostrativi" — zero
architettura, e onesto.

Vale la pena dirlo esplicitamente: dopo il 3.1 in `/admin` non c'è più niente di
reale, quindi **è il 3.1 che toglie il rischio**, non il banner. Una vera guardia di
rotta è M5. Se si preferisce comunque una barriera in M0 (passphrase in
`sessionStorage`) è un meccanismo nuovo e non va introdotto senza approvazione.

## 3.5 — Disclaimer medico

- `Medico.jsx`: nota persistente sotto la chat — servizio dimostrativo, le risposte
  non sono un parere medico, in caso di urgenza il 144.
- `Checkup.jsx:113`: stessa nota nel dialogo del referto, che oggi mostra valori
  clinici **e un consiglio** ("il tuo colesterolo è leggermente sopra…") senza alcuna
  qualificazione.

**L'oscillazione lei/tu non va toccata in M0**, pur essendo confermata (2 risposte
danno del tu, 4 del lei, nella stessa conversazione). È registro, non sicurezza:
appartiene alla rinarrazione di M3, e quelle 6 stringhe finiranno comunque in
`i18n/it.ts`. Toccarle ora è il "toccare due volte" che il §4 vieta.

## 3.6 — Piano "Personalizzato" nascosto

`Pricing.jsx:113`: rimuovere `<FlexiblePlanCard />` **e** portare la griglia da
`lg:grid-cols-4` a `lg:grid-cols-3`, altrimenti resta una colonna vuota. Il file
`FlexiblePlanCard.jsx` **resta nel repo** (undici prezzi già scritti, se il CEO decide
di riattivarlo). Verificare a 1280 e a 768.

## 3.7 — Fuori dall'elenco del §4: quattro cose in attesa di ok

Rientrano nello spirito di M0 ("pericoloso o rotto se qualcuno apre il link"), ma non
sono nell'elenco:

1. **Le due 💡** (`Pricing.jsx:166`, `HRFatturazione.jsx:112`). Il §7 dice "va tolto
   senz'altro". Cancellazione di un carattere. → **da fare.**
2. **Il form demo che si pianta.** `try/catch/finally` in `DemoRequest.jsx:21` così
   mostra comunque la conferma. Sono 3 righe, nessuna architettura, e chiude l'unico
   percorso completo che un investitore proverà. → **da fare**, sapendo che ingoia un
   errore che oggi non ha destinazione.
3. **"Risparmio potenziale CHF 1'400–2'900"** (2 punti) e **"Estensione partner
   + CHF 15/mese"** (1 punto). Sono cifre non nel BP mostrate a chi il BP l'ha letto.
   Sostituirle richiede `roi-model.ts` (M1/M4); **cancellare le righe** è M0. →
   **decisione dei founder.**
4. **Il 👋** di `EmployeeHome.jsx:63`. `PROGRESS.md` lo mette già fra le decisioni in
   sospeso. → **non si tocca.**

## 3.8 — Ordine e commit

```
chore: track package-lock.json
build: widen eslint scope and clear unused imports      ← il 3.0
fix: replace real company and clinic names with fictional ones
feat: unify brand on Kora
fix: repair dead employee nav link and localise 404 page
feat: mark admin back-office as demo data
feat: add medical disclaimers to virtual doctor and check-up report
feat: hide the modular custom plan from pricing
```

## 3.9 — Cosa si verifica a schermo per dichiarare M0 chiusa

Asserzioni concrete, non "sembra a posto". Screenshot allegati per i punti visivi.

1. `grep -rniE "swisscom|hirslanden|moncucco|mendrisio|reale mutua|alpine finance" src/ index.html` → **0 risultati**
2. `grep -rn "HealthOS" src/ index.html` → **0 risultati**
3. Partendo da `/employee`, cliccare tutte e 6 le voci del menu: **6/6 aprono una
   pagina, 0 aprono un 404**. Screenshot di `/employee/piano-ai` che mostra il Piano
   AI.
4. Percorso completo dalla landing su tutte e **25** le rotte usando solo i link, mai
   la barra degli indirizzi (§10): nessun 404, nessuna schermata bianca.
5. `/admin` mostra il banner "dati dimostrativi" sopra la piega — screenshot.
6. `/employee/medico` e il dialogo del referto in `/employee/checkup` mostrano il
   disclaimer — 2 screenshot.
7. `/pricing` a **1280** e a **768**: 3 card, nessuna cella vuota — 2 screenshot.
8. Navigazione deliberata su una rotta inesistente: 404 in italiano, nessun testo del
   Builder, e **nessuna chiamata di rete verso base44** (verificata nel pannello
   Network) — screenshot.
9. Landing → "Prenota una demo" → compilazione → invio: si arriva a "Richiesta
   inviata" (se approvato il 3.7.2).
10. `npm run lint` esce **0**. `npm run typecheck` non supera **421** errori.
11. Nel Network al primo caricamento: **nessuna richiesta a `base44.com`** (favicon) e
    **nessun 404 su `/manifest.json`**.

---

# Decisioni in attesa

| # | Decisione | Raccomandazione |
|---|---|---|
| 1 | Criterio per i nomi di fantasia (§3.1a) | schema proposto sopra — serve l'ok |
| 2 | `150 → 120` in M0 o in M3? | **M3** |
| 3 | `/admin`: banner o barriera? | **banner** |
| 4 | Lei/tu del medico virtuale: M0 o M3? | **M3** |
| 5 | "CHF 1'400–2'900" e "+CHF 15/mese": cancellare in M0 o tenere fino a M4? | **cancellare** |
| 6 | Fix del form demo in M0? | **sì** |
| 7 | Le due 💡 in M0? | **sì** |
| 8 | Correggere "21 rotte" → 25 in `CLAUDE.md` e `PROGRESS.md`? | **sì**, commit `docs:` separato |
| 9 | Correggere la promessa di `PROGRESS.md` sul copia-incolla di `lib/data/` (attrito 1)? | **sì**, ed è la decisione più pesante delle nove |
