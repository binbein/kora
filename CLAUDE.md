# KORA — frontend

Questo file è la costituzione del progetto. Ogni sessione di lavoro deve rispettarlo.
Le decisioni qui dentro sono CONGELATE: si cambiano solo su richiesta esplicita dei
founder, mai per iniziativa autonoma. Se una richiesta sembra in conflitto con questo
file, segnalarlo prima di procedere.

## 1. Cos'è questo progetto

KORA è una piattaforma B2B di salute aziendale per il mercato svizzero (abbonamento
mensile per dipendente: psicologo con cap annuale, coach, medico virtuale, check-up
fisico, prevenzione AI, dashboard HR con ROI).

Questo repository ha **due obiettivi insieme**, e l'ordine conta:

1. **Oggi: la demo per gli investitori.** Deve convincere in una presentazione dal
   vivo di 30 minuti. Tutti i dati sono finti e costruiti ad arte (§8). Tutti i
   servizi complessi (video, pagamenti, AI, chat medica, referti) sono simulati.
2. **Domani: il frontend dell'MVP.** Quando arriva il funding, il passaggio alla
   produzione deve essere **sostituire l'implementazione mock con le chiamate
   all'API vera**, non riscrivere le schermate. Ogni scelta di architettura qui
   dentro serve a rendere vera questa frase.

Il secondo obiettivo non deve mai ritardare il primo. Costruiamo la casa con gli
attacchi dell'acqua già al posto giusto; i sanitari si montano dopo il term sheet.

### Da dove viene questo codice

È il **fork della demo generata su base44**, di cui teniamo grafica, layout,
navigazione ed esperienza utente. Ci viene innestato il **layer dati, il modello
economico e la disciplina sui numeri** della precedente demo Next.js.

Il sorgente di quella demo vive in **`reference/`**: è un magazzino di sola
lettura da cui si copia, **non si modifica e non si importa**. Nessun file di
`src/` deve mai avere un `import` che punta là dentro. Sparisce a fine M3, quando
non c'è più niente da prendere; resta comunque nella storia di git.

Dove le due divergono, la regola è: **layout e grafica di base44, logica e numeri
della demo Next.** Le uniche eccezioni sono le regole di §6 e §11 che non sono
estetica ma correttezza (contrasto, formattazione svizzera, cifre tabulari).

## 2. Regole d'oro (non negoziabili)

1. **Nessun dato dentro i componenti.** Mai un array di dati in cima a una pagina,
   mai un numero scritto in JSX. Tutto viene dal provider (§5) e passa da
   `format.ts`. È la regola che rende vero l'obiettivo §1.2, ed è quella che il
   codice ereditato viola in ogni singola pagina: sistemarla è metà del lavoro.
2. **Il provider è asincrono ed è la specifica dell'API.** Il backend post-funding
   sarà nostro e dovrà rispettare questo contratto. Si progetta con quella cura.
3. **Sempre presentabile.** Nessuna migrazione "big-bang": ogni passo finisce con
   una demo che funziona da capo a fondo. Non esiste lo stato "è tutto rotto ma fra
   tre giorni è meglio". Si migra un'area alla volta, completa.
4. **Numeri solo da §8 e §9.** Prezzi, cap sessioni, formule ROI, dataset. Non si
   inventa mai una cifra nuova. Se ne serve una che non c'è, si chiede ai founder
   e poi si scrive qui.
5. **Nessun backend reale, nessuna credenziale nel codice.** Niente database, niente
   API server, niente auth vera. `.env*` è in `.gitignore` dal giorno 1.
6. **Scope congelato.** Le schermate sono quelle di §10. Nessuna schermata, feature o
   sezione nuova senza approvazione esplicita dei founder. Se un'idea sembra buona,
   proporla e fermarsi: la decisione spetta a loro.
7. **Lingua: italiano — con architettura pronta per 4 lingue.** La piattaforma avrà
   IT, DE, FR, EN; oggi resta SOLO italiano (it-CH: valuta CHF, numeri 14'200, date
   gg.mm.aaaa). Niente language switcher. Ma valgono da subito:
   - Stringhe UI in `src/lib/i18n/it.ts` (oggetto tipizzato, niente testo cablato
     nei componenti). Aggiungere una lingua domani = aggiungere un file con le
     stesse chiavi. **Retrofittare l'i18n su ventisei schermate dopo costa dieci volte
     tanto: si fa mentre si tocca ogni schermata, non alla fine.**
   - **Mai concatenare stringhe per comporre frasi** (l'ordine delle parole cambia
     tra lingue). Sempre frasi complete con segnaposto:
     `"Hai usato {n} delle tue {max} sessioni"`, mai `"Hai usato " + n + ...`.
   - `format.ts` riceve il locale come parametro (oggi fisso a `it-CH`). Il
     separatore delle migliaia è l'apostrofo in tutte le varianti svizzere secondo
     CLDR, ma date, valuta e liste cambiano — fr-CH scrive `14'200 CHF`, con la
     valuta dopo. Nessun formato numerico o di data cablato nei componenti.
   - **Layout che regge il tedesco** (parole ~30% più lunghe): niente larghezze
     fisse su etichette e pulsanti.
8. **Commit piccoli e frequenti**, messaggi in inglese, conventional commits
   (`feat: hr dashboard reads from provider`). Mai commit giganti multi-feature.
   Le decisioni non ovvie finiscono in questo file con un commit `docs:` separato
   dal codice.
9. **Prima di implementare task non banali: proporre un piano breve e attendere ok.**

## 3. Stack tecnico

Ereditato da base44, **e non è lo stack della demo precedente**: chi arriva dal
repository Next non dia niente per scontato.

- **Vite 6 + React 18 + react-router-dom 6.** Nessun server, nessun SSR: è una SPA
  che si serve come file statici.
- **TypeScript.** Vite compila `.ts`/`.tsx` nativamente e la convivenza con il
  `.jsx` esistente è indolore. **Tutto il codice nuovo si scrive in TypeScript**;
  le pagine ereditate si convertono quando le si tocca (§10), non tutte insieme.
  Il layer dati (§5) è TS strict senza `any` — è il contratto con l'API futura e
  in JavaScript quel contratto non esisterebbe.
- **Tailwind CSS 3** con i token in `src/index.css` come variabili HSL, e
  `tailwind.config.js` che li mappa. **Non è Tailwind 4**: esiste ancora
  `tailwind.config.js`, non c'è il blocco `@theme`.
- **shadcn/ui** stile *new-york*, su Radix, già installato: `src/components/ui/`
  contiene **45 componenti**, uno per file.
  **Attenzione alle varianti che i componenti shadcn danno
  per esistenti**: nel loro codice compaiono classi come `data-active:` e
  `data-horizontal:`, che Tailwind compila in selettori su attributi
  `[data-active]` e `[data-horizontal]`, mentre Radix scrive `data-state` e
  `data-orientation`. La regola non aggancia nulla e non segnala niente. È già
  costato dei Tabs disposti in colonna nella demo precedente: aggiungendo un
  componente shadcn, controllare **a schermo** che le sue varianti `data-*`
  corrispondano ad attributi che Radix scrive davvero.

  **Nei file di oggi non ce n'è nessuna**: cercate una per una in apertura di
  M3, le 194 varianti presenti usano tutte la sintassi a parentesi
  (`data-[state=open]:`), che Tailwind 3 compila giusta. Le classi rotte stanno in
  `reference/`, cioè nella generazione Tailwind 4. **La cautela riguarda ciò che si
  aggiunge, non ciò che c'è.**

  **Per la stessa ragione i componenti inutilizzati non si cancellano**, ed è
  un'eccezione dichiarata al §11: 33 dei 45 non li importa nessuno, ma sono
  **l'ultima copia buona della generazione Tailwind 3**. Cancellarli non è
  reversibile a buon mercato — un `shadcn add` domani riporta la generazione
  Tailwind 4 con le varianti che non agganciano — e diversi servono già: slider e
  switch al check rapido, popover e scroll-area alla dashboard (M3), `form` alla
  validazione con `zod` e `react-hook-form`, che il §3 tiene installati apposta
  (M5).

  **L'eccezione all'eccezione: il sistema di toast è stato rimosso**, il
  07.08.2026 su decisione dei founder. `toast`, `toaster` e `use-toast` non
  erano la copia buona di niente: il `toast` ereditato non è quello di shadcn ma
  una riscrittura su `div` semplici senza Radix, che non sa chiudere una
  notifica — `dismiss()` mette `open: false` e nulla la nasconde. Conservare un
  componente rotto non è conservare l'ultima copia buona, è lasciare una
  trappola per la prima schermata che chiami `toast()`.

  **La via di ritorno, se servono le notifiche**: si aggiunge il toast Radix
  vero di shadcn, `@radix-ui/react-toast`. È una dipendenza nuova e **passa dal
  §3**: si chiede prima. Non si recupera da git il componente tolto, che è
  quello rotto.

  **Ai componenti shadcn si possono aggiungere i tipi.** È un'eccezione esplicita
  alla regola per cui `src/components/ui/` non si tocca, decisa dai founder il
  07.08.2026, e senza di essa la regola «le pagine ereditate si convertono quando
  le si tocca» era ineseguibile: i file erano `.jsx` e i loro `forwardRef` non
  dichiaravano i prop, quindi TypeScript inferiva `P = {}`. Da un `.tsx`, `Card`
  rifiutava `children` e `Badge` pretendeva `className` e `variant` come
  obbligatori. M2 ci si è fermata contro e ha lasciato l'area professionista in
  `.jsx`; M3 tocca venti schermate e non poteva ripetere la rinuncia. **Fatto in
  apertura di M3**: i 45 file sono tipizzati, e la regola vale per chi ne
  aggiunge uno.

  **Solo annotazioni.** Nessun cambiamento di comportamento, nessuna variante
  nuova, nessun refactoring: il diff deve leggersi come "stesso codice, con i
  tipi", e in review si rifiuta se non lo è. La cautela sulle varianti `data-*`
  qui sopra resta intatta — è il motivo per cui questi file erano congelati, e
  tipizzarli non la scioglie.

  **In apertura di M3, prima della prima area.** Dopo, ogni schermata si converte
  mentre la si migra; prima, non si converte affatto; in mezzo, si toccano due
  volte le stesse schermate (§11).
- **@tanstack/react-query 5** — già installato e mai usato. Diventa l'unico modo in
  cui le schermate leggono e mutano dati (§5).
- **recharts 2** per i grafici, **lucide-react** per le icone, **framer-motion**
  per le animazioni di ingresso della landing.
- **Font: Inter (testo) + DM Sans (display), self-hostati.** Arrivano da
  `@fontsource-variable`, in variante variabile, con un `@import` per famiglia in
  `index.css`. **Non si torna all'`@import` di Google Fonts**, per comodità o per
  qualunque altra ragione: una richiesta a runtime verso i server di Google
  trasmette l'IP dell'utente, ed è incompatibile con quello che le nostre stesse
  schermate promettono (hosting in Svizzera, LPD, GDPR). Non è un dettaglio di
  performance, è coerenza con l'argomento di vendita. Da qui **le richieste
  esterne a runtime sono zero**, ed è una proprietà da non perdere: vale anche per
  CDN, icone, analytics e mappe.

### Dipendenze

I pacchetti che il `package.json` ereditava senza che nessuno li importasse sono
stati rimossi in M1: pesavano sul bundle di un frontend che diventerà produzione.
La regola con cui sono stati tolti resta, perché la prossima passata di pulizia la
rifarà: **prima di rimuovere una dipendenza, cercarla nel codice.**

Due gruppi sono installati e inutilizzati **di proposito**, e non vanno tolti
trovandoli senza `import`:

- `jspdf` e `html2canvas` servono al report scaricabile (§10.C.3), che è M4;
- `zod`, `react-hook-form` e `@hookform/resolvers` serviranno alla validazione dei
  form (§10, milestone M5).

Prima di aggiungere qualunque dipendenza nuova: **chiedere.**

### Il plugin base44 e il Builder

**Decisione dei founder: il repository è forkato e git è la fonte di verità.** Il
Builder rigenera codice da prompt e un refactoring profondo fatto a mano o viene
sovrascritto o diverge; un frontend di produzione non può avere due autori che non
si parlano. Il plugin, l'SDK e l'unico punto che li usava davvero sono stati
rimossi in M1, e non rientrano: **niente base44 nel repository**, né come
dipendenza né come servizio chiamato a runtime.

**L'alias `@/` è definito in `vite.config.js` sotto `resolve.alias`, e non si
toglie.** Ogni file del progetto importa con quell'alias, e Vite **non legge** i
`paths` di `tsconfig.json`: senza quel blocco ogni import smette di risolvere in
un colpo solo. Prima di M1 lo iniettava il plugin base44, che è esattamente il
motivo per cui oggi è scritto lì.

Deploy: **Vercel**, progetto collegato al repo, preview automatica per branch.
L'app sta alla radice del repository, quindi non serve impostare una Root
Directory. L'alias pubblico è l'unico indirizzo da condividere: gli URL con l'hash
del singolo deployment sono protetti da Vercel Authentication e chiedono a chi li
riceve di autenticarsi, quindi non vanno mai mandati a un investitore.

### Struttura del repository

```
kora/
  CLAUDE.md              ← questo file: le regole, l'unica fonte
  docs/PROGRESS.md       ← cosa esiste e perché, milestone per milestone
  docs/CONTRATTO-DATI.md ← output di M2: la specifica per il backend futuro
  src/
    pages/
      public/            ← landing, prezzi, richiesta demo
      employee/          ← portale dipendente
      hr/                ← portale HR
      professional/      ← portale professionista
      admin/             ← back-office interno
    components/
      ui/                ← shadcn, non si tocca se non per i bug di §3
      shared/            ← KPICard, PrivacyBanner, logo
      public|employee|hr|professional|admin/  ← layout e navigazione per area
      kora/              ← componenti di dominio nuovi (StressBar, SessionMeter…)
    lib/
      data/              ← il contratto dati e l'implementazione mock (§5),
                           più i guardrail e il prefetch della cache
      i18n/it.ts         ← tutte le stringhe UI
      format.ts          ← formatCHF, formatDate, formatPercent — unico punto
      dates.ts           ← aritmetica sui giorni: calcola, non formatta
      roi-model.ts       ← formule del calcolatore ROI (§9)
      earnings.ts        ← righe settimanali e totali dei compensi (§10.D)
      schedule.ts        ← la griglia del calendario, costruita dalle sedute
      query-client.ts    ← configurazione react-query
  base44/entities/       ← i 12 schemi del progetto originale: lista di controllo
                           della copertura del dominio (§5.3), non un vincolo
  reference/             ← sorgente della vecchia demo Next: sola lettura, si
                           cancella a fine M3. Contiene solo il suo `src/`:
                           niente package.json, niente config, niente app viva
```

`earnings.ts` e `schedule.ts` sono presentazione, non dominio: raggruppare per
settimana è una decisione della schermata e per questo non sta nel provider
(`docs/CONTRATTO-DATI.md` §2).

**Un solo `CLAUDE.md` in tutto l'albero.** È il file che orienta ogni sessione:
averne due significa due costituzioni in conflitto, e quella della vecchia demo
descrive Next 16, Tailwind 4 e un provider sincrono. `reference/` contiene
sorgenti e basta, mai una seconda costituzione.

`reference/` va escluso da ESLint e da `tsconfig`: è codice che non manteniamo e
che non deve produrre errori né entrare nel build. Vite non lo tocca comunque,
perché parte da `index.html` e da `src/`.

**Due file di documentazione, due mestieri diversi.** Le regole stanno solo qui:
palette, formule, dataset, definizione di "finito". `docs/PROGRESS.md` racconta
cosa esiste, milestone per milestone, ed è l'indice con cui ci si orienta
riprendendo il lavoro — non decide niente e non duplica: cita e rimanda qui.

**Il Business Plan sta in `docs/`, e resta una fonte da consultare, non da citare.**
Decisione dei founder del 07.08.2026: durante la costruzione della demo più
sessioni e strumenti diversi lavorano sullo stesso repository, e tenere i
documenti altrove significa che metà di loro non li ha. **Non cambia niente sui
numeri**: quelli ammessi restano i soli trascritti in §8 e §9 (§2.4). Se una cifra
del BP serve e qui non c'è, si chiede ai founder e si aggiunge qui — non la si
legge dal PDF e la si scrive in un componente.

Sono documenti riservati e il repository è privato: **verificare che lo resti**
prima di aggiungere collaboratori o di rendere pubblico alcunché. Il repository
del backend nascerà con `docs/CONTRATTO-DATI.md`, non con i PDF.

**La decisione nasce con la sua scadenza: i PDF escono prima che gli accessi si
allarghino.** Al primo ingresso di qualcuno che non sia un founder — un'assunzione,
un collaboratore esterno — si tolgono dal repository e si ripulisce la storia con
`git filter-repo`, perché toglierli da `HEAD` non li toglie dai commit passati. **A
uscire sono i PDF, non il repository**: il codice e la sua storia restano qui, e il
§5.7 vale intero — non esiste un frontend nuovo per l'MVP.

## 4. Come si lavora — le milestone

Il piano approvato dai founder. Ogni milestone finisce con una demo funzionante
(§2.3). Non si passa alla successiva lasciando indietro un'area a metà.

- **M0 — Messa in sicurezza.** Le cose che rendono il codice ereditato pericoloso o
  rotto se qualcuno apre il link: nomi di aziende e cliniche reali, marchio, link
  morti, `/admin` esposto, disclaimer medico, piano "Personalizzato" nascosto.
  Da qui in poi la demo è **sempre condivisibile**.
- **M1 — Fondamenta tecniche.** Fork pulito, TypeScript, deploy proprio, trapianto
  dei file puri (`format.ts`, `dates.ts`, `roi-model.ts`), struttura `i18n`.
  A schermo non cambia niente.
- **M2 — Il contratto dati.** `DataProvider` asincrono, `types.ts`, implementazione
  mock, react-query, `DEMO_TODAY`, guardrail. Chiude con **una sola area migrata**,
  la più piccola: il portale professionista (§10.D), autocontenuto e capace di
  mettere subito sotto stress date, denaro e aggregazioni.
  **Un'area, non una rotta.** L'identità della Dr.ssa Meier vive in `ProNav` e
  `ProProfilo`, che tutte e cinque le rotte condividono: migrandone una sola,
  l'intestazione direbbe un nome e il corpo un altro nella stessa schermata. E la
  definizione di "finito" del §10.D è scritta per l'area — le righe settimanali che
  sommano al mese, i pazienti che coincidono con la KPI — non per una schermata.
- **M3 — Area per area, più il calcolatore.** HR → dipendente → **calcolatore
  ROI pubblico (§10.A.2)** → admin; il professionista è già migrato in M2 e non
  si ritocca. Il calcolatore passa qui da M4 per decisione dei founder del
  07.08.2026: è il terzo dei tre pezzi che il pitch ordina per importanza —
  dashboard HR, percorso dipendente, calcolatore — il motore `roi-model.ts` è
  trapiantato e verificato dai tempi di M1, e il back-office non ha valore
  narrativo. Ogni area viene
  migrata **e** rinarrata nello stesso passaggio: dati dal provider, stringhe in
  i18n, importi da `format.ts`, microcopy nel registro giusto. Toccare due volte la
  stessa schermata è lavoro sprecato. **Chiude cancellando `reference/`**: se
  serve ancora qualcosa da lì, l'area non è finita.
- **M4 — Il report scaricabile** (§10.C.3). Il calcolatore ROI, che stava qui,
  è passato in M3.
- **M5 — Verso la produzione.** Differibile, non blocca niente: guardie di rotta per
  ruolo, stati di errore e vuoto veri, validazione dei form, accessibilità
  completa, le altre tre lingue. **Le schermate di M3 vanno costruite in modo da
  poterli ospitare, non da doverli rimandare.**

## 5. Architettura dati — il cuore del progetto

Principio: **le schermate non sanno che i dati sono finti.** Consumano
un'interfaccia; oggi l'implementazione è mock, post-funding sarà l'API. Questo è il
pezzo di codice che sopravvive alla demo, ed è la specifica che il backend dovrà
rispettare.

### 5.1 Il provider è asincrono

```ts
// src/lib/data/provider.ts
export interface DataProvider {
  getCompany(): Promise<Company>
  getDepartments(): Promise<Department[]>
  getStressHistory(departmentId?: string): Promise<StressRecord[]>
  getRoiSnapshot(period: Quarter): Promise<RoiSnapshot>
  bookAppointment(slot: AppointmentSlot): Promise<Appointment>
  // ...
}
```

**Ogni metodo restituisce una Promise, senza eccezioni.** È l'unica scelta di questo
file che non si recupera dopo: se una schermata chiama il provider aspettandosi un
oggetto, il giorno in cui dietro c'è una `fetch` non si sostituisce
l'implementazione — si riscrive ogni schermata, perché ognuna deve imparare a
gestire attesa, errore e vuoto. La demo precedente aveva metodi sincroni ed era
giusto così, perché doveva solo essere una demo. Questa no.

L'implementazione mock risolve immediatamente da un dataset già in memoria, quindi
**durante il pitch non si vede mai uno spinner**. Non aggiungere ritardi artificiali
"per realismo": in una presentazione dal vivo l'attesa è tempo morto da spiegare.

### 5.2 react-query è l'unico modo di leggere e mutare

Nessun `useState` che copia dati, nessun `useEffect` che carica, nessuno store
globale. Le letture sono query con chiavi stabili; le scritture sono mutation che
invalidano le query toccate. Una prenotazione fatta nel portale dipendente deve
comparire nel calendario del professionista **perché la query si invalida**, non
perché qualcuno passa lo stato a mano.

`src/lib/query-client.ts` porta `refetchOnWindowFocus: false` dal primo commit —
niente refetch al focus della finestra durante una presentazione.

### 5.3 Il dominio, per intero

`types.ts` copre tutto il dominio delle schermate di §10, non solo quello della
vecchia demo: azienda, reparti, dipendente, professionista, appuntamenti, sessioni,
compensi, check-up e strutture, piano di prevenzione, piani di abbonamento, report,
richieste demo, utenti e ruoli.

I 12 schemi in `base44/entities/*.jsonc` del progetto originale sono una **lista di
controllo della copertura**, non un vincolo di forma: il backend sarà nostro e il
contratto lo disegniamo noi. Servono a ricordarci quali entità esistono, non a
dettarne i campi.

**Le granularità sono una scelta del dominio, non della schermata.** Le serie
aziendali — stress, utilizzo servizi — sono **mensili**; gli aggregati
economici dell'azienda — risparmio, giorni evitati — sono **trimestrali**; il
lato professionista rendiconta **al mese**. Oggi è già vero nei fatti, e va
tenuto vero: è la prima cosa che chi costruisce una dashboard decide
diversamente senza accorgersene. La regola vale anche per il backend e sta
anche in `docs/CONTRATTO-DATI.md`.

### 5.4 Il tempo ha una sola sorgente

`DEMO_TODAY` in `src/lib/data/mock/demo-date.ts`. Da lì derivano lo storico dello
stress, il trimestre corrente, la data dell'alert, il mese del riepilogo compensi,
la settimana del calendario, il marcatore "oggi" e il confine fra sessione erogata
e in programma.

**Nessun componente chiama `new Date()`.** Se lo facesse, le schermate cambierebbero
da sole col passare dei giorni — il calendario mostrerebbe una settimana vuota, il
trimestre "in corso" diventerebbe chiuso — e la demo provata non sarebbe quella
presentata. Il codice ereditato lo fa in un punto (la scelta della data nella
prenotazione psicologo) e va corretto.

**`DEMO_TODAY` è mercoledì 23.09.2026.** Tre proprietà di quel giorno, tutte e
tre vincoli e non preferenze:

- **è infrasettimanale**, quindi la colonna "oggi" del calendario del
  professionista non è vuota — di sabato lo sarebbe;
- **è il 23 del mese**, quindi il riepilogo compensi non apre su un totale
  prossimo allo zero, come farebbe il 2;
- **chiude il terzo trimestre 2026 al 92%** (85 giorni su 92), quindi i CHF
  14'200 e i 16 giorni di assenza evitati del §8 descrivono un trimestre quasi
  concluso e non quattro settimane. È l'unica delle tre prove che la data della
  vecchia demo non passava: mercoledì 29.07.2026 era infrasettimanale e lontano
  dall'inizio del mese, ma stava a ventotto giorni dall'inizio del trimestre, e
  un risparmio trimestrale letto su un terzo di trimestre non regge la domanda
  successiva.

### 5.5 Niente si scrive a mano se si può derivare

È la lezione più cara della demo precedente e il difetto principale di quella
ereditata. Vanno **calcolati, non scritti**:

- la serie di stress aziendale = media dei reparti pesata sui dipendenti misurati,
  esclusi i reparti sotto soglia;
- l'alert precoce = scansione delle serie, così il marker sul grafico si sposta da
  sé se i punteggi cambiano;
- i giorni di assenza evitati = risparmio ÷ costo di una giornata (§9);
- il monte sessioni annuo = organico × sessioni del piano;
- i trimestri = contati a ritroso dal trimestre corrente;
- i totali di riga e di colonna di ogni tabella.

Due numeri che descrivono la stessa cosa non devono poter divergere, perché devono
essere lo stesso numero.

### 5.6 Guardrail che falliscono in sviluppo

Controlli che lanciano in `import.meta.env.DEV` e tacciono in produzione, per i
disallineamenti che a schermo non si vedono: il trimestre del PDF diverso da quello
mostrato, il trimestre corrente fuori dal dataset, uno snapshot mancante, un id di
professionista inesistente. Uno svarione si deve vedere mentre si lavora, non
durante il pitch.

### 5.7 Il giorno del passaggio alla produzione

Non ci sarà un repository nuovo, e non ci sarà una riscrittura. **Questo è già il
frontend dell'MVP**, in una fase in cui l'implementazione dietro l'interfaccia è
finta. Il passaggio ha questa forma e nessun'altra:

```
src/lib/data/
  provider.ts     ← l'interfaccia: non cambia
  types.ts        ← i tipi: non cambiano
  mock/           ← si cancella
  http/           ← si aggiunge: stessa interfaccia, fetch dentro
  index.ts        ← una riga che decide quale implementazione istanziare
```

Si cambia quella riga, si cancella `mock/`, e **le schermate non le tocca
nessuno**. Da `CLAUDE.md` sparisce il §1.1 e il resto continua a valere.

L'unico repository nuovo sarà quello del **backend**, e nascerà con in mano
`docs/CONTRATTO-DATI.md`, che è l'output di M2.

Questa sezione è anche un test: se durante il lavoro viene il pensiero *"a questo
punto conviene rifarlo da capo pulito"*, vuol dire che qualcosa del seam non ha
tenuto. È un segnale da riportare ai founder, non un piano da eseguire.

## 6. Design system — quello di base44, documentato

**Direzione approvata**: si tiene la resa visiva della demo base44. Questa sezione
la mette per iscritto perché finora non lo era.

### 6.1 Palette

Token HSL in `src/index.css`, mappati in `tailwind.config.js`. Gli esadecimali sono
indicativi, la fonte è la variabile.

```css
--primary:      207 68% 21%;   /* #11395A — blu petrolio: header, testi forti, CTA scure */
--secondary:    172 73% 39%;   /* #1BAC99 — teal: azione primaria, dati positivi, accenti */
--executive:    260 28% 35%;   /* #514072 — viola: piano Executive, portale professionista */
--accent:       155 68% 92%;   /* #DDF8ED — menta chiara: fondi di riquadro, chip */
--background:   150 20% 98%;   /* #F9FBFA */
--foreground:   207 28% 15%;   /* #1C2731 */
--muted:        150 20% 95%;   --muted-foreground: 210 15% 44%;
--border:       210 20% 90%;
--warning:      42 90% 68%;    /* #F7CB64 */
--destructive:  0 84% 60%;     /* #EF4444 */
--radius:       0.75rem;
```

Regole:

- `warning` e `destructive` sono riservati ad alert e stati critici: è il loro essere
  rari a farli notare.
- **Mai testo normale su `secondary` pieno.** Il teal a 39% di luminosità non regge
  il minimo AA di 4.5 con testo scuro. Le etichette vanno fuori dalla barra, oppure
  in testo grande (≥19px, o ≥14px in peso 600), dove la soglia AA scende a 3.0.
  Testo bianco su `secondary` va verificato caso per caso.
- **Solo light mode.** `index.css` definisce una palette `.dark` completa che nessun
  componente attiva: resta lì, inerte. Nessun toggle e nessun `next-themes` finché
  non è una decisione dei founder.
- **Sulle KPI di trend il colore segue il beneficio, la freccia segue il
  segno.** Verde quando la metrica migliora, `destructive` quando peggiora, e
  ogni KPI dichiara se scendere è un bene: "Stress medio **−2 punti** vs
  trimestre precedente" è la buona notizia della dashboard ed esce verde con la
  freccia in giù. Un rosso su ogni segno meno racconta il contrario della storia
  del §8. Deciso dai founder il 07.08.2026; si implementa in M3, quando la
  dashboard legge dal provider.

  **L'esempio diceva −8%, che dal dataset non esce.** La serie aziendale di M2 fa
  `53 52 52 51 50 50 49 48 48 48 47 46`: trimestre su trimestre sono −2 punti,
  sui dodici mesi −13%, e il −8% si otteneva solo scegliendo una finestra di sei
  mesi, cioè cercando la finestra che dà il numero voluto — l'opposto del §5.5.
  Corretto il 07.08.2026: si mostra il valore calcolato, e **l'etichetta dice su
  cosa è calcolato**, altrimenti "−2" da solo non è verificabile da chi guarda.

### 6.2 Tipografia

- Testo e UI: **Inter**.
- Titoli e numeri di rilievo: **DM Sans** (`font-display`).
- Numeri importanti (CHF, percentuali, orari, contatori): **`tabular-nums`**. Senza,
  le cifre ballano quando un valore cambia — e in questa demo cambiano di continuo.

### 6.3 Due registri di forme e densità

| | HR · landing · professionista · admin | App dipendente |
|---|---|---|
| Densità | compatta, da strumento | ariosa, da consumer |
| Raggi | quelli derivati da `--radius` | più morbidi (`rounded-2xl`) |
| Tono | professionale, terza persona | caldo, seconda persona |

## 7. Microcopy

- **Registro strumento** (HR, landing, professionista, admin): professionale,
  metrico, terza persona. Parla di soglie, trimestri, CHF. *"Risparmio del
  trimestre"*, *"Alert precoce — reparto Vendite"*.
- **Registro consumer** (app dipendente): caldo, seconda persona, nome proprio,
  incoraggiante ma mai infantile. *"Buongiorno Laura"*, *"Il sonno merita
  attenzione"*.
- Ovunque: **sentence case** (niente Title Case), niente punti esclamativi nel testo
  di sistema, **niente emoji**. Ne resta una sola nel codice, il 👋 del saluto in
  `EmployeeHome.jsx`: è l'unico punto in cui il registro consumer potrebbe
  giustificarne una, e la decisione dei founder è aperta — sta in `PROGRESS.md`,
  "Decisioni in sospeso". Il 💡 del riquadro prezzi è sparito in M0 con la riga che
  lo conteneva.
- **Un professionista parla come parlerebbe lui**, non come parla il prodotto: il
  medico virtuale dà del lei ed è coerente dall'inizio alla fine della
  conversazione. Il codice ereditato oscilla fra "lei" e "tu" nella stessa chat.
- La privacy è un argomento di vendita: la nota *"Dati aggregati e anonimi · soglia
  minima {n} dipendenti misurati per reparto"* con icona lucchetto è sempre visibile
  in dashboard. Dice **"misurati"**, non "dipendenti" né "iscritti": la soglia conta
  chi ha risposto al check rapido nel periodo (§8). **La soglia nella stringa è
  `{n}`, non il numero**, e resta tale ora che il §8 l'ha fissata a 12: una cifra
  dentro una frase del dizionario è testo cablato quanto qualunque altro (§2.7),
  ogni numero a schermo passa da `format.ts` (§11), e la soglia è un valore del
  dominio come gli altri — arriva dal provider, così il giorno in cui un'azienda
  cliente ne ha una diversa la frase non cambia.
- **Spazi JSX attorno agli elementi inline.** Quando il testo che segue un `<code>`,
  `<strong>`, `<a>` o `<span>` va a capo nel sorgente, la trasformazione JSX ne
  mangia lo spazio iniziale e le parole si attaccano. Un `{" "}` esplicito non
  basta, perché il formattatore riaccorpa la riga e lo rimuove: va riscritta la
  frase tenendo corto il testo fra un elemento inline e l'altro. Dopo aver scritto
  una sezione con molti inline, **rileggere il testo reso, non il sorgente**.

## 8. Il dataset demo — la storia dei 12 mesi

Azienda: **Demo SA**, Lugano, 120 dipendenti, Piano Plus (CHF 55/dip/mese).

> *Il rename da "Alpine Finance SA" a **Demo SA** è già stato fatto in M0.
> L'organico no: il codice dichiara ancora **150** in più punti, e la divergenza
> si chiude portando il codice a 120, **mai il contrario**: tutte le cifre di
> questa sezione e della §9 sono congelate e verificate su 120, mentre
> allineare questo file al codice imporrebbe di riderivare gli snapshot ROI e
> il monte sessioni — cioè rifare lavoro già approvato. A 120 la fatturazione è
> CHF 6'600 al mese e CHF 79'200 l'anno. L'inventario esatto delle occorrenze —
> compresa quella che un `grep 150` non trova e quelle che non vanno toccate —
> sta nei difetti noti di `docs/PROGRESS.md`, ed è lavoro di M3.*

6 reparti: Vendite (24), Operations (31), Finanza (18), IT (17), HR + Legale (15),
Direzione (15). Il codice ereditato ha reparti diversi e **senza le Vendite**, che è
il reparto della storia: vanno sostituiti con questi.

Persona dipendente: **Laura Bernasconi**, 34, Operations, profilo salute 78/100
("In buon equilibrio", area debole: sonno), 3/10 sessioni psicologo usate, 1/4
sessioni coach, prossimo appuntamento Dr.ssa Meier giovedì 17:30.

La narrazione (deve emergere dai grafici senza spiegazioni):

- Mesi 1–8: stress aziendale stabile su "Medio", in lieve calo. Vendite in linea.
- Mesi 9–12: Vendite si stacca e sale costantemente fino ad "Alto".
- **Mese 10: scatta l'alert precoce** (evidenziato sul grafico con un marker).
- Adozione: 68% iscritti (82), 41 attivi nel trimestre — "attivo" è chi ha
  usato almeno un servizio nel trimestre, la definizione è nella tabella KPI di
  `docs/CONTRATTO-DATI.md`. Sessioni azienda: 142 usate.
- ROI trimestre corrente: **CHF 14'200 risparmiati, 16 giorni di assenza evitati**.
- Stress per reparto (ultimo mese): Vendite Alto (78%), Operations Medio (52%),
  Finanza Medio (44%), IT Basso (31%), HR + Legale Basso (26%). Direzione: sotto
  soglia anonimato → la UI mostra "—" con un lucchetto.

**Come si misura lo stress: due strumenti, e nessuno dei due è un questionario
mensile.**

1. **Assessment iniziale** — all'attivazione dell'account, 10 domande in circa 8
   minuti (BP §6-B1). Genera il Profilo Salute e fissa la **baseline** del
   dipendente: reparto, sonno, stress, le cinque aree. Non è una fotografia una
   tantum: è il primo punto della sua serie, e tutto quello che viene dopo si legge
   come scostamento da lì.
2. **Check rapido ricorrente** — una domanda, un tocco, auto-riportato. È il segnale
   che alimenta il trend per reparto. Vive **dentro l'app** per chi ha l'account e su
   **link anonimo** per chi non ce l'ha: rispondere non richiede un account.

Il link anonimo non è una comodità. Misurare solo chi ha attivato l'account
significa misurare solo chi è già ingaggiato — il campione sbagliato, e quello che
del prodotto ha meno bisogno. **I dipendenti misurati possono quindi essere più
degli iscritti**, ed è una proprietà voluta del modello: il dato vale anche dove
l'adozione non è ancora arrivata.

**Lo stress non si deduce mai dal comportamento** — non dalle sessioni prenotate,
non dalle aperture dell'app, non da un wearable. Un segnale comportamentale non
distingue "il reparto sta peggio" da "il reparto ha adottato bene il prodotto", e
legge come in miglioramento chi si sta ritirando. La dashboard HR afferma la prima
cosa, quindi il dato deve misurare quella e non un suo surrogato. È un vincolo, non
una preferenza: nessuna metrica di stress, in nessuna schermata, si calcola a
partire dall'uso del prodotto.

**I tre conteggi che erano sospesi, decisi.** Il dataset di M2 si costruisce su
questi.

**Soglia di anonimato: 12 dipendenti misurati nel periodo** — non l'organico,
non gli iscritti: a decidere se il dato di un reparto è pubblicabile è quante
persone hanno risposto al check rapido in quel periodo, e con una regola
sull'organico i due reparti da 15 (HR + Legale e Direzione) sarebbero
indistinguibili. E non 15: con la soglia a 15, HR + Legale sarebbe pubblicabile
solo con il 100% di risposte in tutti e dodici i mesi, e basterebbe una persona
che salta il check perché la riga sparisca dalla dashboard — il dataset
funzionerebbe grazie a un numero implausibile. A 12 c'è margine sopra, e la
Direzione resta sotto.

**Iscritti: 82**, il 68% di 120. Gli iscritti sono chi ha attivato l'account
per prenotare le sessioni: essere iscritto ed essere misurato sono
indipendenti, nessuno dei due implica l'altro, e il cambio di modello di
misurazione non li tocca.

**Misurati per reparto: una serie derivata, non una cifra congelata** (§5.5), e
**il conteggio sta sul record mensile del reparto, non su `Department`**:
l'anagrafica porta un numero solo, e con quello si peserebbero tutti e dodici i
mesi e si deciderebbe l'esclusione una volta sola per tutta la storia — senza
che niente si rompa, esce solo una curva diversa da quella descritta. Non è un
caso di scuola: l'adesione al check rapido è proprio ciò che si muove quando un
reparto va sotto pressione, ed è così che le Vendite calano fra il mese 9 e il
12. Su `Department` può restare al massimo il valore del periodo corrente,
derivato dal record mensile. M2 la costruisce sotto questi vincoli, che vanno
verificati a schermo:

- misurati ≤ organico del reparto, in ogni mese;
- la Direzione sta sotto soglia in tutti e dodici i mesi;
- gli altri cinque reparti stanno sopra soglia in tutti e dodici i mesi;
- l'adesione delle Vendite cala fra il mese 9 e il 12;
- la serie aziendale derivata resta piatta o in lieve calo su tutti e dodici i
  mesi. Se sale, è sbagliato il dataset, non la regola;
- il totale dei misurati può superare gli 82 iscritti: è una proprietà voluta del
  modello, già dichiarata sopra.

**I misurati si mostrano su ogni riga**, non solo su quelle sotto soglia: con il
solo organico, i due reparti da 15 sarebbero due righe identiche con esiti opposti,
e una delle due sembrerebbe rotta.

**La serie aziendale è derivata, mai scritta a mano**: media dei punteggi di
reparto pesata sui dipendenti misurati, con i reparti sotto soglia esclusi —
anche dal denominatore, perché un punteggio non pubblicabile non può rientrare
da una porta di servizio dentro un aggregato, e "reparti in calo su N" conta i
soli reparti pubblicabili. Le
curve vanno disegnate in modo che l'aggregato resti **piatto o in lieve calo**: se
la linea aziendale sale, contraddice la narrazione, che è *"la media non mostrava
nulla, il dettaglio per reparto sì"*. Il codice ereditato ha una sola linea che
scende da 68 a 52, senza reparti: racconta "va tutto bene" invece di "l'abbiamo
visto prima".

**I giorni di assenza evitati sono un quoziente**: risparmio ÷ CHF 900 (§9). Danno
16 sul trimestre corrente, 13 / 10 / 7 sui precedenti.

**Il monte sessioni annuo è 1'200**: 120 dipendenti × 10 sessioni del piano Plus. A
142 usate la quota è il 12%, quindi la KPI mostra il numero grande e la proporzione
come barra sottile — una traccia spessa e quasi vuota si legge come un errore di
rendering.

**L'utilizzo dei quattro servizi è una serie mensile**, approvata dai founder il
07.08.2026 e costruita in M3. I totali sui dodici mesi: **psicologo 142** (il
numero qui sopra), **medico virtuale 118**, **coach 85**, **check-up 51**. Le
curve crescono con l'adozione e l'ultimo mese è parziale, perché la demo cade al
23 di settembre.

Le tre cifre nuove hanno ognuna una ragione, e vanno lette insieme: il medico
virtuale sta **sotto** lo psicologo perché la ciambella deve dire che il supporto
psicologico è la fetta più grande — è la frase del pitch, e senza quel vincolo un
servizio illimitato e a bassa frizione lo supererebbe; il coach sta al 18% del suo
monte (480 = 120 × 4) perché è la voce meno matura dell'offerta; i check-up sono
il **62% degli iscritti**, non il 68%, per non affiancare all'adozione una seconda
percentuale identica che si legge come lo stesso numero copiato due volte.

**Lo psicologo non si scrive, si compone.** La Dr.ssa Meier è una delle
professioniste dell'azienda e la sua agenda esiste già (§10.D): il totale del mese
è la sua agenda più la quota degli altri psicologi della rete. Scriverlo a mano
vuol dire poterlo contraddire, ed è successo — la prima stesura dava all'azienda
10 sedute a settembre, mese in cui la sola Meier ne eroga 14.

Professionisti (minimo 4): Dr.ssa Colombo (stress lavorativo, IT/DE, 4.9),
Dr. Rossi (burnout e ansia, IT/FR, 4.8), Dr.ssa Meier (sonno, IT/DE, 4.9),
Dr. Fontana (coaching, IT, 4.7). Foto: **avatar a iniziali**, niente foto stock di
persone — evita questioni di licenza e sembra più pulito.

**Nomi di aziende, cliniche e strutture: solo di fantasia.** Il codice ereditato usa
società e ospedali reali come clienti paganti e partner convenzionati. Non è una
questione di stile: è una dichiarazione falsa su soggetti reali, e va corretta
prima di qualunque altra cosa.

### I nomi inventati, congelati in M0

Ogni nome è stato verificato con una ricerca prima di entrare nel codice. **Si
riusano questi, non se ne inventano altri**: due schermate che nominano la stessa
azienda in due modi sono lo stesso difetto dei numeri che divergono (§5.5). Se ne
serve uno nuovo, si verifica allo stesso modo e si aggiunge qui.

Aziende clienti (back-office admin) — **Demo SA** (finance, Lugano, l'azienda della
storia), **Larice Pharma SA** (pharma, Mendrisio), **Studio Legale Rovere** (legale,
Lugano), **Genziana Tech SA** (tech, Bellinzona), **Betulla Assicurazioni SA**
(assicurazioni, Locarno).

Rete convenzionata per i check-up — **Centro Medico Ardesia** (Lugano),
**Poliambulatorio Quarzo** (Bellinzona), **Centro Salute Onice** (Locarno),
**Clinica Zaffiro** (Lugano), **Centro Diagnostico Basalto** (Mendrisio). È **una
sola rete**: il portale dipendente e il back-office elencano le stesse strutture con
gli stessi indirizzi, non due elenchi scollegati.

Tre vincoli che vengono dalla verifica, non dal gusto:

- **Niente toponimi lacustri o vallivi** (Verbano, Ceresio, Monteverde…): esistono
  identici sulla sponda italiana e collidono con strutture sanitarie vere. Due
  candidati su cinque sono stati scartati per questo.
- **Niente "Centro Medico" + nome di città**: è il modo in cui si chiamano le
  strutture vere (il codice ereditato aveva "Centro Medico Lugano", che a Lugano
  esiste).
- **Anche gli indirizzi sono generici.** Una via reale con il numero civico giusto
  identifica la struttura anche dopo che il nome è cambiato: il codice ereditato
  aveva l'indirizzo esatto dell'ospedale di Mendrisio.

Domini email: TLD riservato **`.example`** (RFC 2606), che nessuno può registrare —
`m.bianchi@demo-sa.example`. Si vedono solo nel back-office, che dichiara di essere
dimostrativo. Le persone inventate non devono comparire su domini di terzi.

**Non si inventano identificatori di albi professionali.** Nessun numero FSP, FMH,
SVDE, ICF o equivalente compare nel dataset o a schermo. La qualifica sì —
"Psicologa FSP" è l'informazione che conta a chi guarda — e lo stato dei documenti
pure, perché è quello che la piattaforma verifica davvero.

È lo stesso ragionamento degli indirizzi e delle email: un numero di formato
plausibile attaccato a una persona inventata può collidere con l'iscrizione di un
professionista vero, e a differenza di un nome nessuno se ne accorge leggendo. Lì
però esisteva un modo di essere inequivocabilmente finti, il TLD `.example`; per un
numero d'albo quell'equivalente non esiste, perché un formato dichiaratamente falso
si legge come segnaposto proprio sulla card che promette credenziali verificate.
Non si sceglie fra sembrare finti e rischiare di essere veri: **si toglie il dato.**

Il campo non esiste nemmeno nei tipi — un campo opzionale che nessuno riempie è
codice che il §11 non vuole, e messo lì invita a riempirlo. L'esclusione si dichiara
in `docs/CONTRATTO-DATI.md` fra le cose lasciate fuori di proposito: è lì che la
legge chi scrive il backend, ed è lì che serve, perché in produzione quel numero
esisterà davvero.

## 9. Numeri ufficiali dal Business Plan (unici ammessi)

Piani: **Essenziale CHF 38** (6 sessioni/anno, extra CHF 35, medico virtuale 12h con
3 consulti/anno, colloquio conoscitivo gratuito una volta) · **Plus CHF 55** (10
sessioni/anno, extra CHF 28, coach 4 sessioni/anno, medico 4h consulti illimitati,
check-up annuale, piano AI ogni 6 mesi) · **Executive CHF 82** (16 sessioni/anno,
extra CHF 22, medico 1h illimitato, nutrizionista 4/anno, coaching 6 sessioni/anno,
psichiatra su richiesta incluso, 2 workshop live/anno inclusi, familiari inclusi,
check-up executive completo 1 volta/anno — ECG, eco addome, oculista, sangue
completo —, piano prevenzione AI aggiornato mensilmente, dashboard HR avanzata con
report mensile e call mensile col team clinico). La demo usa il piano Plus.

**Le ultime tre voci dell'Executive mancavano da questa trascrizione**, non dal
Business Plan (p.10). La conseguenza era che il piano più caro risultava offrire
meno di quanto offre, e che un difetto già noto non era chiudibile: `PROGRESS.md`
segnala da M0 che la card dice "Consulenza HR trimestrale" mentre il BP dà mensile,
e chi fosse andato a correggerla leggendo il §9 non avrebbe trovato la riga.

**I due check-up non sono lo stesso check-up.** Il Plus ha quello annuale, l'Executive
ne ha uno più esteso: sono due voci diverse e la card deve poterle distinguere.

**Il colloquio conoscitivo dell'Essenziale è una volta sola**, non uno per
sessione: la card deve dirlo, altrimenti si legge come un extra ricorrente.

**Sull'Executive, "incluso" è l'informazione**: psichiatra e workshop non sono
opzioni a pagamento e non hanno un prezzo da mostrare. Il coaching ha un tetto
(6/anno) e va detto, come i 4/anno del Plus.

**Tutti e tre i piani includono il medico virtuale.** Il tetto di consulti vive su
`Plan` insieme all'SLA, così la card lo dice dove esiste e lo tace dove non c'è.

**Estensione partner sul piano Plus: + CHF 15 per dipendente al mese**, opzionale
(BP p.9). Va detto **per dipendente**: scritto "+ CHF 15/mese" si legge come una
tariffa unica per l'azienda, che a 120 dipendenti sbaglia di due ordini di
grandezza. L'Executive include già i familiari (partner + 1 figlio) e non ha
l'estensione.

**Compenso ai professionisti: CHF 70–80 a sessione erogata.** Il BP dà la banda, non
la tariffa del singolo: dove cade ognuno dei quattro è una scelta della demo, da
dichiarare nel file del dataset.

**A pieno regime, 20 sessioni a settimana valgono CHF 5'600–6'400 al mese.** Serve
al portale professionista: **il regime va sempre detto accanto al totale**,
altrimenti chi ha letto il BP legge uno scarto di un ordine di grandezza come un
errore.

### Formule del calcolatore ROI (§10.A.2), per N dipendenti

- Assenteismo: `N × 6.5 giorni × CHF 900`
- Presenteismo: `N × CHF 1'500`
- Burnout pre-clinico: `N × 0.30 × CHF 65'000 × 0.15`
- Turnover da salute: `N × 0.043 × CHF 50'000 + stima sostituzione`
- Risparmio (scenario conservativo): 15% su assenteismo e presenteismo, 20% su
  burnout e turnover.
- Costo KORA: `N × 55 × 12`. Mostrare risparmio netto e ROI.
- Etichettare sempre come **"scenario conservativo"** con fonti (SECO, Job Stress
  Index).

**Il punto di ancoraggio è N = 100.** A cento dipendenti il calcolatore deve dare
esattamente: perdite **CHF 1'289'500**, risparmio **CHF 221'150**, costo KORA
**CHF 66'000**, risparmio netto **CHF 155'150**, ROI **2.35:1**. È il primo
confronto che fa un investitore col documento in mano: qualunque modifica alle
costanti va verificata contro quei cinque numeri. Il calcolatore si apre su 100.

**ROI = risparmio netto / costo**, non risparmio lordo / costo (che darebbe 3.35:1).
**Il 19.5:1 dell'executive summary non va usato da nessuna parte**: è un terzo
rapporto ancora (perdite totali / costo), e mescolare due definizioni di ROI
indebolisce quella buona.

**La "stima sostituzione" vale CHF 470 per dipendente**, ricavata per differenza dal
totale del BP. Vive in `roi-model.ts`: se arriva la cifra vera, si sostituisce lì.

**Ogni voce è lineare in N**, quindi da 20 a 1000 dipendenti gli importi crescono ma
il rapporto 2.35:1 non cambia mai. È una proprietà del modello: la UI non deve far
credere che il ROI reagisca all'input.

**Il "risparmio potenziale CHF 1'400–2'900 per dipendente"** che compare oggi nella
pagina prezzi e nella fatturazione HR **non è nel Business Plan**: va sostituito con
le cifre derivate dal modello.

### Trimestri diversi da quello corrente

Il §8 fissa solo il trimestre in corso, ma il selettore della dashboard deve
cambiare davvero i dati. I trimestri precedenti non si inventano: si derivano da
quattro semi dichiarati qui. **Nemmeno i periodi stanno nei semi**: si contano a
ritroso dal trimestre corrente, che viene da `DEMO_TODAY`.

**I semi sono le persone, non il denaro.** Un importo arrotondato non si inverte:
risalire agli attivi da CHF 11'800 darebbe 34.07 persone — cioè la cifra scritta a
mano *e* la persona finta. Si parte dai conteggi e si scende verso gli importi, mai
il contrario.

| Trimestre | Iscritti | Attivi |
|---|---|---|
| corrente | 82 | 41 |
| −1 | 71 | 34 |
| −2 | 58 | 27 |
| −3 | 39 | 18 |

**Le sessioni non sono più un seme.** Erano una quarta colonna — 142 / 105 / 64 /
28 — scelta prima che l'agenda della Dr.ssa Meier esistesse, e non la conteneva:
la sola Meier eroga 41 sedute nel trimestre corrente, dove quella colonna ne
attribuiva 37 all'azienda intera. Si sommano dalla serie di utilizzo dei servizi
(§8), cumulate dall'inizio della finestra, e danno **142 / 86 / 50 / 22**.
Correzione dei founder del 07.08.2026: la regola "si deriva, non si scrive" vale
anche per i numeri che questo file aveva già fissato.

L'adozione che ne esce — **68 → 59 → 48 → 33%** su 120 dipendenti — è la stessa
curva che il §8 già racconta.

Da qui si deriva il resto, e si deriva davvero (§5.5):

- **Risparmio** = attivi × (14'200 / 41), **arrotondato al centinaio**. Il trimestre
  corrente non passa dal calcolo: usa i CHF 14'200 esatti del §8, che sono
  l'ancoraggio. Gli altri tre danno 11'775.6 → **11'800**, 9'351.2 → **9'400**,
  6'234.1 → **6'200**, cioè i tre importi che questa sezione già dichiarava.
  **L'arrotondamento al centinaio è parte della regola, non un dettaglio di
  formattazione**: senza, quei tre numeri non sono riproducibili, e una cifra al
  franco su un risparmio stimato è finta precisione.
- **Giorni di assenza evitati** = risparmio ÷ CHF 900 (§8): 16 / 13 / 10 / 7.

**Le sessioni sono cumulate sui dodici mesi, non consumate nel trimestre.** È l'unica
lettura che tiene in piedi la KPI del §8: il monte di 1'200 è annuo, e "142 su 1'200"
confronta due grandezze solo se coprono lo stesso periodo. I quattro trimestri del
selettore sono i quattro trimestri di quel monte, quindi il valore del trimestre
corrente è anche il totale dell'anno. Il consumo del singolo trimestre — 22 / 28 /
36 / 56 — si ricava per differenza e non si scrive.

## 10. Scope — le schermate e la definizione di "finito"

**26 rotte su cinque aree** (4 + 6 + 5 + 5 + 6). Venticinque sono ereditate da
base44; la ventiseiesima è `/roi`, approvata dai founder il 07.08.2026. **Nessuna
schermata nuova senza
approvazione** (§2.6); nessuna schermata esistente si elimina senza dirlo.

### A. Pubblica — `/`, `/roi`, `/pricing`, `/demo`
1. **Landing**: hero, problema, tre livelli di valore, anteprima piani, privacy, CTA.
2. **Calcolatore ROI** — *da costruire, non esiste*. Perdite oggi vs risparmio con
   KORA, il dettaglio delle quattro voci che si aggiorna con N, formule §9.
   Va costruito con la grafica e il layout di base44; il motore è `roi-model.ts`.

   **Sta su una rotta sua, `/roi`**, decisa dai founder il 07.08.2026: è il terzo
   dei tre pezzi che il pitch mostra (§4), e un pezzo che si mostra da solo deve
   avere un indirizzo a cui portarlo, non una sezione da raggiungere scorrendo.
   Tenerlo fuori da `/pricing` evita anche due campi "numero di dipendenti" nella
   stessa pagina: lì il simulatore risponde *"quanto costa"*, qui il calcolatore
   risponde *"quanto stai già perdendo"*, e sono due domande che non si mescolano.
3. **Prezzi**: i tre piani + simulatore di costo. Il quarto piano
   "Personalizzato" a moduli **resta nascosto** finché i founder non decidono:
   i suoi undici prezzi non sono nel BP e a 150 dipendenti la preselezione esce
   allo stesso prezzo dell'Essenziale offrendo più di lui.
4. **Richiesta demo**: form che oggi si risolve in locale e diventerà una
   mutation del provider.

**Finita quando:** il calcolatore è corretto per qualsiasi N fra 20 e 1000, le
quattro voci sommano al totale mostrato, e a N=100 escono i cinque numeri di §9.

### B. Portale dipendente — `/employee` + 5 sottopagine
Home, Psicologi, Medico virtuale, Check-up, Piano AI, Profilo.

1. **Check rapido nella home** — *da costruire, non esiste*. **Una domanda, un
   tocco** (§8). È il segnale su cui poggia ogni dato di stress della dashboard HR,
   e oggi la demo non lo mostra da nessuna parte: a un investitore che chiede da
   dove arrivano quei numeri non abbiamo niente da indicare. Il Business Plan lo
   chiama "cuore di KORA" e ne descrive tre mensili: dove i due divergono vince
   questo file, e il documento si aggiorna.
   È una card nella home, **non una rotta nuova**: non entra nel conto delle 26.
   Approvato dai founder il **06.08.2026** ai sensi del §2.6. È lavoro di M3, e qui
   si approva l'esistenza della schermata e basta: la resa si decide migrando l'area.

**Finita quando:** prenotare uno psicologo **fa succedere qualcosa** — il contatore
sale, l'appuntamento compare in home, lo slot sparisce dalla disponibilità e compare
nel calendario del professionista. Oggi la conferma si perde chiudendo il dialogo.
Nessun vicolo cieco: ogni schermata ha una via d'uscita, e ogni voce del menu porta
a una rotta che esiste.

### C. Portale HR — `/hr` + 4 sottopagine
Dashboard, Dipendenti, Report, Fatturazione, Privacy.

1. **Dashboard**: KPI, utilizzo servizi, **stress per reparto** (da costruire),
   **trend 12 mesi azienda vs Vendite con marker dell'alert** (da costruire),
   **banner alert precoce** (da costruire), selettore trimestre che cambia i dati.
2. **Report**: le metriche del trimestre e le raccomandazioni.
3. **Report scaricabile** — *il pulsante esiste e non fa niente*. Il PDF non si
   scrive a mano: si genera da una pagina che legge dal provider come tutte le
   altre. Deve restare **una pagina sola**: è un allegato per il consiglio, non un
   fascicolo.

**Finita quando:** la storia dei 12 mesi si capisce senza parlare; il selettore
trimestre cambia davvero i dati; la soglia di anonimato si legge dai numeri in
tabella; tutto regge da 1280px in su.

### D. Portale professionista — `/professional` + 4 sottopagine
Calendario, Sessioni, Pazienti, Pagamenti, Profilo.

È il portale della **Dr.ssa Meier**, la professionista che il dipendente prenota in
§10.B: i tre lati del marketplace raccontano la stessa storia invece di essere tre
demo scollegate.

1. **La nota privata di sessione si salva davvero.** Il dialogo esiste già nel codice
   ereditato con i suoi tre campi e un pulsante che oggi chiude e basta. Collegarlo
   aggiunge `SessionNote` al dominio ed è **l'unica scrittura che M2 può dimostrare**:
   la prenotazione è sul lato dipendente, che è M3, quindi senza questa il pattern
   scrittura → invalidazione → riletto dalla query verrebbe replicato venticinque
   volte in M3 senza essere mai stato provato una volta (§5.2).
   **La nota è privata e non esce mai verso l'azienda**, e a impedirlo è il tipo, non
   la JSX: il testo vive solo sulle proiezioni che il professionista riceve e non
   compare su nessun tipo che l'area HR o l'admin possano leggere. Approvato dai
   founder il **06.08.2026**; non è una schermata nuova, quindi il §2.6 è soddisfatto.

**Finita quando:** le righe settimanali sommano al totale del mese; i pazienti
elencati sono lo stesso numero che dichiara la KPI; le date e i giorni della
settimana coincidono con il calendario vero (oggi sbagliano in tutti e quattro i
punti in cui compaiono, §11).

**Eccezione dichiarata.** «Una prenotazione fatta in §10.B compare nel calendario»
non si verifica alla chiusura di M2, perché il lato dipendente è M3. Il contratto
dati deve già reggerla — stessa entità, stessa query invalidata (§5.2) — e la prova
a schermo arriva con l'area dipendente. Non è un requisito mancato: è un requisito
che ha bisogno dell'altra metà del marketplace.

### E. Back-office admin — `/admin` + 5 sottopagine
Aziende, Utenti, Professionisti, Sessioni, Provider check-up, Analytics.

Non ha valore narrativo diretto ma ha valore di prodotto: serve dopo. **Va protetto
o marcato come dati dimostrativi**: M0 lo marca con un banner, perché chiunque abbia
il link vede il back-office con l'elenco dei "clienti". La guardia vera è M5 e va
scritta da zero sui nostri ruoli: il `ProtectedRoute` ereditato è stato cancellato
in M1 insieme all'SDK, perché dipendeva dall'auth di base44 e usarlo avrebbe mandato
al login del Builder.

**Finita quando:** i totali di ogni schermata si ricavano dai dati e non sono
scritti a mano — oggi "618 utenti attivi" convive con un tasso di attivazione che ne
implica 767, e il fatturato del mese non torna con l'elenco delle aziende accanto.

### Come si naviga durante la demo

Il provider vive in memoria: lo stato sopravvive alla navigazione interna, non a un
ricaricamento. Si parte dalla landing e si usano i link, mai la barra degli
indirizzi.

## 11. Qualità e revisione

- TypeScript senza `any` nel codice nuovo; ESLint pulito, zero warning.
- Componenti piccoli e componibili; le pagine sono composizione.
- **Il minimo che risolve il problema.** Niente astrazioni per un solo caso d'uso,
  niente opzioni che nessuno passa, niente wrapper che rigirano props. Se una
  funzione ha un solo chiamante, di solito è una riga dentro il chiamante. Vale
  soprattutto in questa fase: il codice che non c'è non va mantenuto quando arriva
  il backend.
- **Minimo nell'astrazione, completo nel comportamento.** Le due cose non sono in
  conflitto e non si scambiano: "il minimo" riguarda quante astrazioni si
  costruiscono, mai quanti casi si gestiscono. Un componente che ignora la lista
  vuota, il valore mancante o il reparto sotto soglia non è minimale, è incompleto,
  e il caso scoperto si presenta durante il pitch. Prima di chiudere un pezzo:
  cosa succede con zero elementi, con un dato assente, al primo e all'ultimo
  periodo del dataset, e quando il valore cade esattamente sulla soglia.
- **Il codice che non serve non si scrive e non si conserva.** Niente boilerplate
  messo per abitudine: file barrel che riesportano e basta, props opzionali che
  nessuno passa, `try/catch` che ingoiano l'errore, rami irraggiungibili, codice
  commentato "che magari serve". Quello che va tolto si toglie in un commit suo:
  git lo ricorda e `PROGRESS.md` spiega perché. L'unica eccezione è ciò che questo
  file o `PROGRESS.md` dichiarano sospeso in attesa di una decisione dei founder.
- **Chiarezza prima di brevità.** Conciso vuol dire senza parti inutili, non
  compresso: un nome esplicito batte un nome corto, e una funzione che si legge in
  ordine batte una catena di `map`/`reduce` da rileggere due volte. Questo codice
  lo erediterà chi scriverà il backend con in mano `CONTRATTO-DATI.md`, e non avrà
  a disposizione la conversazione in cui è stato scritto.
- **I commenti si guadagnano il posto.** Resta solo il commento che impedisce un
  errore che il codice da solo non impedisce (perché quel TLD, perché quell'indirizzo
  è generico). Spiegare cosa è stato tolto e perché è mestiere di
  `docs/PROGRESS.md`: nel sorgente diventa archeologia che nessuno cancella più. Un
  `TODO` vale solo con una destinazione: `TODO M2: …`.
- **Ogni numero a schermo passa da `format.ts`.** CHF con apostrofo: `CHF 14'200`.
  Il codice ereditato usa `toLocaleString()` senza locale e importi scritti a mano
  all'italiana (`CHF 8.250`, che in Svizzera si legge "otto virgola due").
- **`useGrouping: "always"` in `format.ts`, non toglierlo.** CLDR dà a it-CH e de-CH
  `minimumGroupingDigits: 2`, quindi Intl di suo NON separa i numeri di quattro
  cifre: `14'200` ma `6200`. In una dashboard dove il selettore fa passare dall'uno
  all'altro la differenza si legge come un difetto.
- **Il separatore decimale è il punto**: `2.35:1`, non `2,35:1`. È la convenzione
  svizzera ed è coerente con l'apostrofo delle migliaia.
- **Nessuna data scritta a mano.** Le date si derivano da `DEMO_TODAY` e si
  formattano con `format.ts`. Le quattro coppie giorno/data sbagliate di
  `ProSessioni.jsx` — l'anno riscritto a mano su date del 2025 — sono sparite
  con la migrazione di M2; nelle aree non migrate le date scritte a mano ci
  sono ancora (i mesi delle fatture HR, le iscrizioni dell'admin) e spariscono
  con M3, area per area.
- Accessibilità di base: contrasti AA, focus visibili, alt text. La demo si presenta
  anche da tastiera durante un pitch: i focus contano.
- **A fine sessione**: riepilogo di cosa è stato fatto e screenshot delle schermate
  toccate, così i founder revisionano a colpo d'occhio. Le verifiche si fanno **a
  schermo con asserzioni concrete**, non solo con `tsc` e lint puliti.
