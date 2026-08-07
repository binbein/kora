# KORA frontend — stato di avanzamento

Riferimento rapido per riprendere il lavoro senza perdere accuratezza rispetto a
`CLAUDE.md`, che resta l'unica fonte di regole. Questo file racconta **cosa esiste e
perché**; le regole (palette, formule, dataset, definizione di "finito") stanno solo
lì.

## Come si tiene aggiornato

- Si scrive **alla chiusura di ogni milestone**, non a ogni commit.
- Una decisione non ovvia va in `CLAUDE.md` con un commit `docs:` separato dal
  codice; qui si cita e si rimanda, non si duplica.
- Ogni voce dice **cosa è stato fatto, perché quella scelta e cosa è stato
  verificato a schermo** — non l'elenco dei file toccati, che sta in git.
- Se una milestone chiude con difetti noti e accettati, si scrivono qui: è il posto
  in cui chi riprende scopre cosa non deve rifare da capo.

## Stato

**M0, M1 e M2 chiuse.** La demo è condivisibile — non nomina soggetti reali, il marchio è
uno solo, non ha vicoli ciechi, e le schermate mediche dichiarano di essere
simulazioni — e il repository è nostro: niente base44, niente chiamate verso
l'esterno, TypeScript configurato, i file puri al loro posto.

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. In `reference/` c'è il sorgente della
precedente demo Next.js — `app/`, `components/` e `lib/`, senza configurazioni né
app eseguibile — come magazzino di sola lettura; si cancella a fine M3. Il
repository della vecchia demo è archiviato e non si tocca. I PDF del Business Plan
stanno in `docs/` dal 07.08.2026 (decisione qui sotto), ma restano una fonte da
consultare: le cifre ammesse sono solo quelle trascritte in `CLAUDE.md` §8 e §9.

### M0 — Messa in sicurezza

Undici commit. In sintesi: nomi reali sostituiti con il set verificato e
congelato in `CLAUDE.md` §8 (aziende, cliniche, email su TLD `.example`);
marchio unificato su Kora e favicon non più servita da `base44.com`; link
morto riparato e 404 ripulita; `/admin` marcato dimostrativo con un banner (la
guardia vera è M5); disclaimer sulle schermate mediche simulate; piano
"Personalizzato" nascosto; la stima "CHF 1'400–2'900 per dipendente" — assente
dal Business Plan — rimossa da prezzi e fatturazione (torna col calcolatore in
M3, calcolata da `roi-model.ts`); estensione partner corretta in
"+ CHF 15/dipendente/mese"; form demo che si risolve invece di restare su
"Invio in corso…"; ESLint allargato a `src/**` e 36 import inutilizzati
rimossi. In revisione: i tre riquadri informativi portati da `warning` a
`bg-muted` (il warning è riservato agli alert, §6.1) e il logo sui token della
palette. Il dettaglio, commit per commit, è in git.

**Verificato a schermo**: 25 rotte navigate dalla landing usando solo i link, zero
404; nessuna richiesta verso `base44.com` in nessun percorso, invio del form
compreso; `/pricing` a 1280 e 768; i due disclaimer; il banner admin.

**Difetti noti e accettati, da non riscoprire:**

- **Tre voci delle card prezzi non corrispondono al Business Plan.** Restano così
  fino a M3, che le fa leggere da `Plan` invece di elencarle a mano in JSX — a quel
  punto la card non può più divergere dal piano. Sono in `Pricing.jsx` e, per le
  prime due, anche nell'anteprima piani della landing:
  - Il **Plus** elenca "Colloquio conoscitivo gratuito", ma il BP (p.9) lo dà solo
    all'Essenziale;
  - l'**Executive** dice "Coach + psichiatra se necessario": il §9 vuole il tetto
    di **6 sessioni di coaching all'anno**, e lo psichiatra è **incluso**, non
    condizionato a un "se necessario";
  - l'**Executive** dice "Consulenza HR trimestrale", ma il BP (p.10) dà **report
    mensile e call mensile col team clinico**. È l'unica delle tre che sottostima
    il piano invece di gonfiarlo.

  Le tre voci restano aperte, ma **da M2 il §9 contiene il dato con cui M3 le
  chiude**: la trascrizione dell'Executive saltava tre righe della p.10, fra cui
  proprio la dashboard HR mensile. Chi fosse andato a correggere la card leggendo
  la costituzione non ci avrebbe trovato la riga, e avrebbe lasciato il trimestrale
  al suo posto.
- **Le iniziali dei pazienti e l'elenco dipendenti HR sono lo stesso insieme di
  persone.** `HRDipendenti.jsx` elenca G.R., M.B., E.K., L.B., S.C., F.M., A.T. e
  P.V.; il dataset del portale professionista (M2) usa G.R., M.B., E.K., S.C.,
  L.B. e A.T. fra gli attivi e introduce D.F., P.M. e R.T. fra i percorsi
  conclusi. Oggi non c'è conflitto, ma in M3 quella schermata leggerà dal
  provider: **stesse iniziali devono voler dire la stessa persona**, e due
  persone diverse non possono condividerle. `L.B.` è Laura Bernasconi in
  entrambe, ed è il caso che rende la regola non teorica.
- **Cinque numeri d'albo inventati in `AdminProfessionisti.jsx`** — FSP-2019-4521,
  FMH-2015-8830, ICF-ACC-3310, FSP-2021-9901, SVDE-2018-7712. Il §8 li vieta da M2:
  un identificatore di formato plausibile su una persona inventata può collidere con
  l'iscrizione di un professionista vero, e nessuno se ne accorge leggendo. Restano
  fino a M3, che ripulisce quella schermata una volta sola — il roster è comunque da
  rifare per intero (§8). Nel portale professionista la riga esce già in M2, con la
  migrazione dell'area.
- **L'organico resta 150, non i 120 del §8.** La divergenza si chiude portando
  il codice a 120, mai il contrario (`CLAUDE.md` §8); è lavoro di M3.
  L'inventario, verificato occorrenza per occorrenza:
  - **sei occorrenze letterali** di `150` in quattro file: il riquadro azienda
    in fondo alla sidebar di `HRNav.jsx` (navigazione condivisa dalle cinque
    rotte HR, non una schermata); tre in `HRFatturazione.jsx` (stato iniziale
    del simulatore, riquadro "Piano attivo", righe delle fatture); la KPI
    "Dipendenti iscritti" di `HRDashboard.jsx`; la riga di Demo SA in
    `AdminAziende.jsx`. La KPI non è una sostituzione secca: "124/150 ·
    Attivazione 82%" diventa 82 su 120 con l'attivazione al 68%, le cifre del
    §8.
  - **un settimo punto che un `grep 150` non trova**: `revenue: 99000` in
    `AdminAziende.jsx`, che è 150 × 55 × 12 e diventa **79'200**. Non contiene
    il numero, discende dal numero: si sistemano i sei letterali e nel
    back-office resta un fatturato calcolato su un organico che l'elenco
    accanto non dichiara più.
  - **gli altri `150` non sono l'organico e non si toccano**: il valore di
    apertura del simulatore pubblico in `Pricing.jsx` e le tre soglie di sconto
    a volume del piano nascosto in `FlexiblePlanCard.jsx` (§10.A.3).
- Il 👋 nella home dipendente resta: decisione in sospeso qui sotto.

### M1 — Fondamenta tecniche

Undici commit, uno per passo. **A schermo non cambia niente**, verificato
confrontando le rotte con gli screenshot di M0. In sintesi: fuori il plugin e
l'SDK base44 (636 righe; prima, in un commit a sé, l'alias `@/` è passato in
`vite.config.js` — lo iniettava il plugin, e Vite non legge i `paths` di
`tsconfig.json`); `tsconfig.json` con `strict: true`, `allowJs: true` e
`checkJs: false`, typecheck da 405 errori a 0; via 13 dipendenze mai importate
più `sonner` e `next-themes`; Inter e DM Sans self-hostati in variante
variabile — da qui **le richieste esterne sono zero**; `format.ts`, `dates.ts`
e `roi-model.ts` trapiantati da `reference/`; scheletro i18n (dizionario
tipizzato e interpolatore, niente libreria); `vercel.json` con la rewrite SPA.
Due dipendenze nuove approvate (§3): `typescript-eslint` — solo parser e
regole `recommended` — e i due `@fontsource-variable`. Il dettaglio è in git.

**Verificato**: i cinque numeri di ancoraggio del §9 a N=100 (perdite 1'289'500,
risparmio 221'150, costo 66'000, netto 155'150, ROI 2.35), le quattro voci che
sommano al totale, il rapporto invariato a N=20 e N=1000, `formatCHF(6200)` =
`CHF 6'200`, `git status` pulito dopo `npm run typecheck`, 25 rotte senza 404 né
schermate vuote, zero richieste esterne a schermo, console del browser senza
errori, `npm run lint` e `npm run typecheck` a 0.

**Difetti noti di M1:**

- **Restano 2 vulnerabilità moderate**, entrambe lo stesso open redirect di
  `react-router` via backslash in `<Link>`. `npm audit fix` è un **no-op**: resta
  alla 6.30.4, perché il fix è `react-router` **7**, un major che cambia l'API del
  router. **È una modifica di scope da approvare (§2.6), non una patch**, e per una
  demo senza URL forniti dall'utente non è sfruttabile. Si riapre quando il router
  si tocca per altri motivi. Non lanciare `npm audit fix --force`.
- **La rewrite di `vercel.json` risolve il 404 sui link profondi, non lo stato.** Il
  provider vivrà in memoria (§10, "Come si naviga durante la demo"), quindi un
  ricaricamento azzera comunque la demo: `/hr/report` aperto da zero mostrerà la
  dashboard nello stato iniziale, non quello in cui l'aveva lasciata chi ha
  condiviso il link. Sono due problemi diversi e solo il primo è chiuso.
- **`formatCHF` separa `CHF` dalle cifre con uno spazio unificatore** (U+00A0), non
  con uno spazio normale. È la resa corretta, ma un'asserzione o un `grep` scritti
  con lo spazio da tastiera falliscono contro una stringa che sembra identica.
- **`src/utils/index.ts` è ancora lì e non lo importa nessuno** (`createPageUrl`,
  zero chiamanti dal primo commit). Ora che ESLint legge il TypeScript si vede; è un
  candidato alla cancellazione, non fatta perché fuori dai passi approvati.
- **Resta un warning di lint**, ora visibile perché lo script non usa più `--quiet`:
  `bookingStep` in `Psicologi.jsx`, stato morto di un wizard a più passi. Sparisce
  in M3 quando la prenotazione viene rifatta. `npm run lint` esce comunque 0 —
  ESLint non fallisce sui warning.
- **La console mostra due avvisi di `react-router`** sui future flag della 7
  (`v7_startTransition`, `v7_relativeSplatPath`). Non sono errori e non si vedono
  in produzione; spariscono con la stessa migrazione alla 7 che chiuderebbe le due
  vulnerabilità, ed è la stessa decisione di scope.

### M2 — Il contratto dati

Ventisei commit. Chiude con **l'area professionista intera**, cinque rotte, e con
`docs/CONTRATTO-DATI.md`, che è il documento con cui nascerà il repository del
backend.

- **`reference/lib/data/` è stato letto, non copiato.** Il provider di riferimento
  è sincrono per scelta dichiarata e la reattività passa da un contatore di
  versione su `useSyncExternalStore`: `use-data.ts` non è mai entrato, e
  react-query non ha mai convissuto con il version counter. Si sono copiati
  davvero solo `people.ts` e la struttura di `professional-portal.ts`, `roi.ts` e
  `scheduling.ts` — quest'ultimo con `process.env.NODE_ENV` sostituito da
  `import.meta.env.DEV`, che in una SPA Vite è la differenza fra un guardrail e
  una pagina bianca.
- **Il dataset è due matrici e nient'altro scritto a mano**: misurati e punteggi
  per reparto e per mese. Pubblicabilità, serie aziendale, alert precoce,
  percentuali di adesione e denominatori si derivano. La serie aziendale esce
  `53 52 52 51 50 50 49 48 48 48 47 46` — non crescente ogni mese, sempre in
  fascia "Medio" — e l'alert cade sulle Vendite al decimo mese, come il §8.
- **Il cap del piano ha deciso la forma dell'agenda.** Sei pazienti valgono al
  massimo 60 sedute l'anno: un'agenda da cinque sedute settimanali descrive molti
  percorsi brevi che si avvicendano, non sei percorsi lunghi. Da qui tre percorsi
  conclusi, che stanno fuori dall'elenco pazienti e dentro lo storico compensi, e
  due pazienti sopra il cap che mostrano il co-payment — il meccanismo su cui il
  Business Plan regge il margine, messo a schermo.
- **L'appuntamento di Laura è un record solo**, proiettato da due lati. Il
  contatore del dipendente è il conto delle sue sedute erogate, non un numero a
  parte: in M3 la prenotazione lo farà salire come conseguenza.
- **Guardrail che lanciano in sviluppo e tacciono in produzione**, provati anche
  al contrario: una serie che risale, la Direzione sopra soglia, misurati oltre
  l'organico, l'adesione delle Vendite che smette di calare, l'alert spostato di
  un mese e le sessioni cumulate che smettono di crescere fanno tutti fallire il
  dataset con il messaggio giusto.
- **Il seam è eseguibile**: due regole ESLint vietano di importare `lib/data/mock/`
  e di chiamare `new Date()` fuori dal layer dati. L'unica violazione esistente è
  stata corretta nello stesso commit, e correggendola è emerso che `toISOString()`
  riportava indietro di un giorno le date prenotabili.

**Verificato a schermo, non solo con tsc e lint** (le asserzioni del §10.D):

- le righe settimanali sommano al totale del mese: CHF 240 + 320 + 400 + 160 =
  CHF 1'120, e 3 + 4 + 5 + 2 = 14 sedute;
- i pazienti elencati sono lo stesso numero della KPI: **6 e 6**, dove il codice
  ereditato diceva 18 ed elencava 6;
- date e giorni della settimana coincidono col calendario vero: mercoledì
  23.09.2026, giovedì 24.09 alle 17:30, venerdì 25.09, lunedì 28.09, martedì
  29.09 — le quattro coppie sbagliate sono sparite con la lista che le conteneva;
- il regime sta accanto al totale: 5 sedute a settimana contro le 20 del pieno
  regime, con le CHF 5'600–6'400 del §9 e la disponibilità minima di 8 ore;
- la nota privata si salva davvero: aprendo la seduta di M.B. del 21.09,
  scrivendo e salvando, "aggiungi nota" diventa "nota" senza ricaricare — le
  sedute senza nota passano da 8 a 7.

**Difetti noti di M2:**

- ~~Le pagine dell'area sono rimaste `.jsx`~~ → **chiuso in apertura di M3**. Le
  cinque rotte sono `.tsx`, insieme a `KPICard` che ne condivide il muro. Il nodo
  era che i componenti shadcn non dichiaravano i prop; i founder hanno autorizzato
  il 07.08.2026 l'aggiunta dei tipi (`CLAUDE.md` §3) e la passata è quella qui
  sotto.
- ~~Il `range` di `getProfessionalSessions` non ha chiamanti~~ → il parametro è
  stato tolto subito dopo la chiusura di M2: un'opzione che nessuno passa è ciò
  che il §11 vieta, e dichiararla non la curava. L'informazione che serve — che
  in produzione quel metodo un intervallo lo prenderà — è in
  `CONTRATTO-DATI.md` §6.
- **Il totale dell'anno nei pagamenti copre l'anno solare**, non i dodici mesi
  mobili: con la demo a settembre sono i mesi da marzo, e a gennaio sarebbe una
  riga sola. Nessuna conseguenza sulla demo, che è ambientata a settembre.
- **Il dominio dell'utilizzo servizi mancava.** Il §10.C.1 lo mette fra i
  contenuti della dashboard HR e il §5.3 dichiarava la copertura completa del
  dominio, ma `types.ts` non aveva l'entità: `HrReport.usagePercent` è uno
  scalare. `ServiceUsageMonth` è stato aggiunto **dopo la chiusura di M2**,
  insieme alla regola sulle granularità (`CLAUDE.md` §5.3): la dichiarazione di
  copertura era ottimista, ed è sfuggita perché l'area di prova era il portale
  professionista. Dataset e guardrail (psicologo sommato sui dodici mesi = 142)
  arrivano in M3 con la dashboard; i conteggi di coach, medico virtuale e
  check-up non sono nel §8 e vanno approvati allora (§2.4).

### M3 — in corso: la tipizzazione del layer shadcn

Il primo passo di M3, prima della prima area (`CLAUDE.md` §3). **Non chiude la
milestone**: le aree sono ancora tutte da migrare.

Fatto in due passate: **tutti e 45 i componenti di `src/components/ui/`** — zero
`.jsx` rimasti — più `lib/utils.ts`, `hooks/use-mobile.tsx`, `KPICard` e le
cinque pagine del professionista. Un pattern solo, ripetuto — `React.ElementRef` e `React.ComponentPropsWithoutRef`
sull'elemento sottostante, `VariantProps` dove c'è `cva` — e nessun `any`:
`src/components/ui/` è entrato nel blocco TypeScript di ESLint apposta, perché
`no-explicit-any` sorvegli le annotazioni appena aggiunte. Nel blocco React resta
fuori: quelle regole sorveglierebbero il codice che l'eccezione del §3 vieta di
toccare.

**Dieci `as` in tutto, tutti nei tre compositi finali**, e nessuno zittisce un
errore: due in `form` (i context nascono con `{}`, che non è assegnabile al loro
tipo), cinque in `chart` e tre in `sidebar`. Di questi otto, quattro sono
proprietà CSS custom — `--color-bg`, `--sidebar-width`, `--skeleton-width` —
che non stanno in `React.CSSProperties`, e quattro sono indicizzazioni con una
chiave nota solo a runtime, che TypeScript non restringe. In ogni caso
l'alternativa era cambiare il codice di un componente congelato. Nel sorgente
ereditato il posto del cast si riconosce: è il doppio paio di graffe attorno
allo stile inline, rimasto dove base44 aveva tolto l'annotazione.

**Come si prova che a runtime non è cambiato niente.** Un diff di cinquanta file
non si legge riga per riga: per ognuno si transpila con esbuild la versione
`master` e quella nuova e si confrontano. I tipi si cancellano, quindi l'output
deve essere identico byte a byte. Lo è su tutti i file convertiti tranne due,
`ProSessioni` e `ProProfilo`, cioè esattamente i punti in cui i tipi hanno
trovato qualcosa (elencati nel commit che li converte). È la verifica da rifare
se qualcuno rimette mano a questa passata.

Il controllo ha anche deciso una scelta di stile: in `form` i due
`React.createContext` stanno su una riga sola perché mandarli a capo cambiava
l'output transpilato — a parità di semantica, ma la prova non lo sa.

**Le varianti `data-*` rotte non c'erano.** Cercate una per una: le 194 varianti
usano tutte la sintassi a parentesi, che Tailwind 3 compila giusta.
Le classi che ruppero i Tabs stanno in `reference/`, cioè nella generazione
Tailwind 4. La cautela del §3 riguarda ciò che si aggiunge, e resta.

**Verificato a schermo**, che qui è il punto: 25 rotte percorse, zero errori in
console, nessuna schermata vuota. In particolare i Tabs delle sedute sono in
riga e cambiano pannello; il Select del simulatore si apre con i tre piani e la
scelta si riflette sul trigger; la nota privata si salva ancora senza ricaricare
— "aggiungi nota" diventa "nota" — che è la mutation di M2 sopravvissuta alla
conversione.

**I quattro compositi**, chiusi nella seconda passata, uno per commit:
`form` porta i generici di react-hook-form, `carousel` deriva l'API di embla
dalla libreria invece di riscriverla, `chart` prende i props di tooltip e
legenda da recharts, `sidebar` dichiara il context che tiene insieme il file —
da lì `state` resta `"expanded" | "collapsed"` invece di allargarsi a `string`.

**Il sistema di toast è stato rimosso** (decisione del 07.08.2026 qui sotto).

**Cosa resta aperto:**

- **`App.jsx` e `main.jsx` restano `.jsx` di proposito**: `App.jsx` si converte
  quando M3 aggiunge `/roi`, perché è la stessa riga di codice che si tocca.
- **I grafici recharts si vedono schiacciati su una colonna sola** nelle
  catture del browser di sviluppo — `/admin/analytics` e la dashboard HR.
  **Non è una regressione**: verificato passando a `master` e ripetendo la
  cattura, si comporta identico, e nessuna delle due schermate usa il
  `chart` di shadcn (importano recharts direttamente). È il
  `ResponsiveContainer` che misura zero al primo layout in quel contesto. Da
  verificare in un browser vero prima di costruire la dashboard HR, che di
  grafici ne ha quattro.
- **La guardia di `useFormField` in `form.tsx` non scatta mai.** Il codice fa
  `getFieldState(fieldContext.name, formState)` e *poi* controlla
  `if (!fieldContext) throw new Error(…)`: il controllo sta dopo l'uso che
  dovrebbe proteggere, e comunque non scatterebbe, perché il valore di default
  del context è `{}`, che è truthy. Fuori da un `<FormField>` il componente non
  lancia il messaggio che ha scritto apposta — sbaglia più avanti, in un punto
  che non lo dice.

  Emerso tipizzando il file: è la ragione per cui i due `createContext` hanno un
  `as`, e il default `{}` è esattamente ciò che il tipo deve mentire per stare
  in piedi. **Sta anche a monte in shadcn**, quindi non è un guasto di base44 e
  non si chiude riallineandosi ai sorgenti ufficiali.

  Non corretto: `src/components/ui/` è congelato e l'eccezione del `CLAUDE.md`
  §3 copre le sole annotazioni. Spostare la guardia prima dell'uso e darle un
  default che possa essere falso è un **cambio di comportamento**, e va deciso
  dai founder. Nessuna urgenza: `form` non ha consumatori, e ne avrà quando M5
  costruirà la validazione con `zod` e `react-hook-form` — è quello il momento
  di deciderlo, non prima.

### Punto di partenza — cosa c'è e cosa manca

Ereditato e funzionante: 25 rotte su cinque aree (pubblica, dipendente, HR,
professionista, admin), design system e navigazione, 47 componenti shadcn, grafici
recharts.

Ereditato e **non** funzionante. Le ultime due righe sono state chiuse da M0; le
altre restano aperte (il dettaglio è in `CLAUDE.md` §10):

- nessun layer dati: ogni pagina dichiara le proprie costanti in cima al file, e le
  stesse grandezze divergono fra schermate vicine — 618 vs 767 utenti, 18 vs 6
  pazienti, 180 vs 142 sessioni, tre roster di professionisti che non si parlano;
- le prenotazioni non producono effetti: nessun contatore si muove, nessun
  appuntamento compare, nessuno slot si occupa;
- manca il calcolatore ROI pubblico, mancano stress per reparto, alert precoce e
  selettore trimestre nella dashboard HR;
- importi non formattati in svizzero (6 scritti a mano all'italiana, 9
  `toLocaleString()` senza locale, che a schermo escono in formato en-US);
  **quattro** coppie giorno/data sbagliate — non cinque — tutte in `ProSessioni.jsx`
  e tutte con lo stesso scarto di un giorno: è il calendario 2025 con l'anno
  riscritto a mano;
- ~~link di menu che porta a una pagina inesistente~~ → chiuso in M0;
- ~~marchio a metà, aziende e cliniche reali, `/admin` aperto~~ → chiuso in M0.

### Milestone previste

Il piano completo è in `CLAUDE.md` §4. In breve:

| | Milestone | Stato |
|---|---|---|
| M0 | Messa in sicurezza | **fatta** |
| M1 | Fondamenta tecniche | **fatta** |
| M2 | Il contratto dati | **fatta** |
| M3 | Migrazione area per area + calcolatore ROI | da fare |
| M4 | Report scaricabile | da fare |
| M5 | Verso la produzione (differibile) | da fare |

## Decisioni chiuse

Decisioni dei founder, con la data in cui sono state prese. Alcune le eseguirà una
milestone, ma la decisione è un fatto a sé e va trovata qui senza dover leggere
`CLAUDE.md` per intero. La regola vive lì; qui restano la data e il motivo.

- **07.08.2026 — Il sistema di toast si rimuove** (`CLAUDE.md` §3). `toast`,
  `toaster` e `use-toast` escono dal repository insieme al `<Toaster />` montato
  in `App.jsx`. Il componente ereditato non era quello di shadcn ma una
  riscrittura su `div` semplici senza Radix, che non sa chiudere una notifica:
  `dismiss()` mette `open: false` e niente la nasconde. **Conservarlo non era
  conservare l'ultima copia buona della generazione Tailwind 3** — l'eccezione
  al §11 scritta il giorno prima — perché quella copia era rotta: era lasciare
  una trappola alla prima schermata che chiamasse `toast()`. A schermo non
  cambia niente, `toast()` non ha mai avuto chiamanti.

  **La via di ritorno è annotata di proposito**: se una schermata futura avrà
  bisogno di notifiche si aggiunge `@radix-ui/react-toast`, che è una dipendenza
  nuova e passa dal §3. Non si recupera da git il componente tolto.

- **07.08.2026 — `null` e `?` dicono due cose diverse** (`CONTRATTO-DATI.md` §2).
  La regola «assente si dice `null`, mai `undefined`» leggeva come un divieto
  dell'opzionale, e i tipi lo usano in due posti — gli opzionali di `Plan` e
  `cancellationReasonKey`. Nessuno dei due la violava: `| null` è per gli slot
  di valore che il caso prevede e possono essere vuoti, `?` è per i campi che al
  caso non pertengono. Un motivo di annullamento `null` su una seduta erogata
  sarebbe un campo che non dovrebbe stare lì, dichiarato vuoto. Per il backend
  la differenza è concreta: `| null` sta sempre nella risposta, `?` non c'è.
  Nessun tipo è cambiato. Chiude il rilievo della passata precedente.

- **07.08.2026 — Il calcolatore ROI ha una rotta sua, `/roi`** (`CLAUDE.md` §10.A).
  Le rotte passano da 25 a **26**: è la prima aggiunta all'inventario ereditato da
  base44. Il §10.A elencava quattro voci su tre rotte e non diceva dove vivesse il
  calcolatore; ora lo dice. Sta fuori da `/pricing` perchè le due pagine
  risponderebbero a domande diverse con lo stesso campo "numero di dipendenti", e
  fuori dalla landing perchè un pezzo che il pitch mostra da solo ha bisogno di un
  indirizzo. Resta lavoro di M3, nell'ordine già fissato.

- **07.08.2026 — Il Business Plan sta in `docs/`** (`CLAUDE.md` §3). La regola
  precedente lo teneva fuori dal repository; la costruzione della demo procede su
  più sessioni e strumenti che condividono solo questo repository, e i documenti
  fuori significa che metà di loro non li ha. **Sui numeri non cambia niente**: gli
  unici ammessi restano quelli trascritti in §8 e §9 (§2.4), e una cifra che serve e
  lì non c'è si chiede ai founder e si aggiunge lì — non si legge dal PDF. Sono
  documenti riservati: il repository deve restare privato. La regola `*.pdf` di
  `.gitignore` è caduta con la decisione (era comunque inerte: i due file erano già
  tracciati).

- **07.08.2026 — "Dipendente attivo" è un conteggio trimestrale** (`CLAUDE.md`
  §8, `CONTRATTO-DATI.md` §3). Il 41 della dashboard conta chi ha usato almeno
  un servizio nel trimestre, non nel mese: è lo stesso periodo del risparmio
  che ne deriva, è coerente con gli altri due semi del selettore, e non
  contraddice il 15–25% di utilizzo mensile su cui il Business Plan fonda il
  margine. Il §8 diceva "nel mese" ed era l'unico punto in disaccordo con
  `types.ts`, che il trimestre lo dichiarava già.

- **06.08.2026 — I semi dei trimestri precedenti** (`CLAUDE.md` §9, "Trimestri
  diversi da quello corrente"). Il selettore della dashboard ha quattro righe di
  partenza — iscritti, attivi e sessioni cumulate — e da lì si derivano risparmio,
  giorni di assenza evitati e percentuale di adozione. I semi sono conteggi di
  persone e non importi, perché un importo arrotondato non si inverte senza
  produrre una persona frazionaria. Nella stessa passata sono diventate esplicite
  due cose che erano implicite e senza le quali il §9 non era riproducibile:
  **l'arrotondamento del risparmio al centinaio** e **il periodo delle sessioni
  consumate**, che sono cumulate sui dodici mesi del monte annuo.

- **07.08.2026 — Il calcolatore ROI passa da M4 a M3, prima dell'area admin**
  (`CLAUDE.md` §4). Ordine di M3: HR → dipendente → calcolatore → admin. È
  l'ordine di importanza del pitch: se le conversazioni con gli investitori
  partono prima della fine del piano, esistono i tre pezzi che contano e a
  mancare è il back-office, che non ha valore narrativo. Il motore è pronto:
  `roi-model.ts` è trapiantato da M1 e verificato sui cinque numeri di
  ancoraggio.

- **07.08.2026 — Polarità dei colori sulle KPI di trend** (`CLAUDE.md` §6.1).
  Il colore segue il beneficio, la freccia segue il segno: "Stress medio −8%"
  esce verde con la freccia in giù, e ogni KPI dichiara se scendere è un bene.
  Chiude la voce che stava fra le decisioni in sospeso; si implementa in M3,
  quando la dashboard legge dal provider.

- **07.08.2026 — Si possono tipizzare i componenti shadcn** (`CLAUDE.md` §3).
  Eccezione esplicita al congelamento di `src/components/ui/`, limitata alle sole
  annotazioni di tipo: nessun cambiamento di comportamento, nessuna variante
  nuova. Senza, la regola del §3 sulla conversione delle pagine ereditate non è
  eseguibile — i `forwardRef` dei 47 file non dichiarano i prop, quindi da un
  `.tsx` `Card` rifiuta `children` — e M2 lo ha dimostrato fermandocisi contro. Si
  fa in apertura di M3, prima della prima area.

- **06.08.2026 — La nota privata di sessione si salva** (`CLAUDE.md` §10.D). Il
  pulsante "Salva nota" del portale professionista, che oggi chiude il dialogo e
  basta, diventa una mutation vera. Il motivo non è la completezza della schermata:
  è che **la prenotazione — l'unica altra scrittura del dominio — sta sul lato
  dipendente, cioè in M3**, quindi senza questa M2 chiuderebbe senza aver mai
  eseguito una mutation, e il pattern che il §5.2 esiste per fissare verrebbe
  replicato venticinque volte senza essere stato provato una volta. Il dialogo esiste
  già nel codice ereditato, quindi non è una schermata nuova ai sensi del §2.6.
  Aggiunge `SessionNote` al dominio; la nota resta privata e il tipo lo rende
  impossibile da aggirare, non solo la JSX.

- **06.08.2026 — Il check rapido nella home del dipendente** (`CLAUDE.md` §10.B).
  Approvata la card del check rapido ricorrente: **una domanda, un tocco**. È una
  decisione di scope ai sensi del §2.6, ed è la prima schermata nuova rispetto
  all'inventario ereditato — ma è una card dentro la home, non una rotta: **le
  rotte restano 25**. È lavoro di M3, e qui si è approvata l'esistenza della
  schermata, non la sua resa. Il motivo per cui esiste sta in §10.B.

- **05.08.2026 — Come si misura lo stress** (`CLAUDE.md` §8). Il dato di reparto
  non viene più da un questionario mensile. All'attivazione dell'account c'è un
  **assessment iniziale** che fissa la baseline del dipendente; da lì in poi il
  segnale è un **check rapido ricorrente**, in app per chi ha l'account e su link
  anonimo per chi non ce l'ha.

  Il motivo è uno solo: **rendere la misurazione indipendente dall'adozione.**
  Misurare solo chi ha attivato l'account significa misurare solo chi è già
  ingaggiato, cioè il campione sbagliato — e dedurre lo stress dal comportamento
  (sessioni prenotate, aperture dell'app, wearable) sarebbe peggio ancora, perché
  non distingue un reparto che sta peggio da uno che ha adottato bene il prodotto,
  e legge come in miglioramento chi si sta ritirando. La dashboard HR afferma la
  prima cosa, quindi il dato deve misurare quella.

  Conseguenza sul contratto dati, da tenere presente in M2: la soglia di anonimato
  conta i **dipendenti misurati nel periodo** — non l'organico, non gli iscritti.
  Il conteggio è `measuredEmployees` **sul record mensile del reparto, non su
  `Department`**: l'anagrafica porta un numero solo, e con quello si peserebbero
  tutti e dodici i mesi della serie e si deciderebbe l'esclusione una volta sola
  per l'intera storia. È il difetto che non si vede — non rompe niente, disegna
  solo una curva diversa da quella descritta — ed è concreto, perché l'adesione al
  check rapido è proprio ciò che si muove quando le Vendite si staccano fra il
  mese 9 e il 12. La meccanica non cambia: soglia su ogni riga, reparti sotto
  soglia fuori dal denominatore, serie aziendale come media pesata dei reparti
  sopra soglia.

  **I conteggi sono decisi e stanno in `CLAUDE.md` §8**: soglia a 12 dipendenti
  misurati, 82 iscritti, e i misurati per reparto come serie derivata sotto
  vincoli dichiarati invece che come cifra congelata. Le motivazioni stanno lì.
  Perché erano rimasti sospesi: sotto il modello a questionario, cinque reparti
  alla soglia di 15 più gli 11 della Direzione facevano 86 misurati contro 82
  iscritti, e chi rispondeva non poteva che essere un iscritto — i tre numeri non
  stavano insieme. Questo modello ammette la relazione, ma i valori andavano
  comunque scelti.

- **05.08.2026 — `DEMO_TODAY` fissata a mercoledì 23.09.2026** (`CLAUDE.md`
  §5.4). A scartare la data della vecchia demo (29.07.2026) è stata la posizione
  nel trimestre, non il giorno della settimana: le prove "infrasettimanale" e
  "lontano dall'inizio del mese" le passavano entrambe. Al 29 luglio il terzo
  trimestre è a poco meno di un terzo, quindi i CHF 14'200 di risparmio
  trimestrale sarebbero stati letti su quattro settimane; al 23 settembre è al
  92%. Le tre ragioni per esteso stanno in §5.4.

## Decisioni in sospeso

- **Piano "Personalizzato" della pagina prezzi.** Nascosto in M0 in attesa della
  decisione del CEO: gli undici prezzi dei moduli non sono nel Business Plan, gli
  sconti a volume nemmeno, e a 150 dipendenti la preselezione esce a **CHF 38** —
  identico all'Essenziale — offrendo medico virtuale illimitato e check-up annuale
  che l'Essenziale non ha. Verificato alla cifra.
- **Emoji nel saluto della home dipendente.** Il §7 di `CLAUDE.md` vieta le emoji
  nel testo di sistema; il 👋 della home è l'unico caso in cui il registro consumer
  potrebbe giustificarla. Da chiedere ai founder. (Il 💡 del riquadro prezzi è
  sparito in M0 insieme alla riga che lo conteneva.)

## Note per chi riprende

- `reference/` è il **magazzino, ma non tutto si copia.** Non si modifica, non si
  importa: nessun file di `src/` deve avere un `import` che punta dentro
  `reference/`. E soprattutto va distinto cosa è pronto da cosa non lo è:
  - **Si copiano davvero**: `lib/format.ts`, `lib/dates.ts` e `lib/roi-model.ts`
    — già trapiantati in M1 — e i dataset di `lib/data/mock/` che non toccano il
    modello di misurazione: `people.ts`, `scheduling.ts`,
    `professional-portal.ts`, `roi.ts`. Sono file puri, già scritti e verificati.
  - **Si copia una chiave alla volta**: `lib/i18n/it.ts`. Sono 592 righe scritte
    per le schermate della vecchia demo, e il §2.7 vuole che le stringhe entrino
    mentre M3 migra la schermata che le usa. Da lì si prende la chiave che serve,
    mai il file.
  - **Si leggono come specifica e si riprogettano**: `lib/data/provider.ts`,
    `lib/data/index.ts`, `lib/data/use-data.ts` e le firme dei mock. Quel provider è
    **sincrono per scelta dichiarata** (lo dice un commento nel file) e la reattività
    passa da `useSyncExternalStore` su un contatore di versione. `CLAUDE.md` §5.1
    e §5.2 impongono provider asincrono e react-query: sono due modelli diversi, e
    convertirli per copia non funziona.

    Qui stanno anche **`lib/data/types.ts`, `lib/data/mock/company.ts` e
    `lib/data/mock/stress.ts`**: i primi due portano `respondents` su
    `Department`, cioè sull'anagrafica — la posizione che la decisione del 05.08
    vieta — e i loro commenti descrivono il questionario mensile, che è il
    modello superato. `stress.ts` legge quel campo due volte, per decidere la
    pubblicabilità e per pesare la media aziendale, quindi segue i primi due.
  - I componenti di dominio in `components/kora/` stanno in mezzo: la resa si tiene,
    ma sono Next/TSX e leggono dal provider sincrono, quindi si adattano.

  Il rischio da evitare in M2 è **cominciare copiando** e accorgersene a metà, con
  react-query e il contatore di versione che convivono. È lo stato in cui, secondo
  §5.7, viene il pensiero "conviene rifarlo pulito" — cioè il segnale da riportare
  ai founder.
- **Il passaggio alla produzione avviene in questo repository**, sostituendo
  `lib/data/mock/` con `lib/data/http/` dietro la stessa interfaccia
  (`CLAUDE.md` §5.7). Se viene il pensiero di ricominciare da capo con un repo
  nuovo, è il segnale che il seam non ha tenuto: va riportato ai founder.
- Ogni milestone chiude con una demo che funziona da capo a fondo (`CLAUDE.md`
  §2.3). Se una migrazione non entra in una sessione, si chiude l'area corrente e si
  comincia la prossima dopo, mai a metà.
- **Un `✓` testuale in `Psicologi.jsx`**, nel riepilogo della prenotazione
  ("✓ Sessione inclusa nel piano"). Non è
  un'emoji e il §7 non lo vieta, quindi non è un difetto da correggere subito: è un
  glifo dove tutto il resto del progetto usa un'icona lucide, e uno screen reader lo
  legge come "segno di spunta" in mezzo alla frase. Da sostituire con l'icona
  quando M3 rifà la prenotazione, che è la stessa passata in cui sparisce il
  `bookingStep` morto. È l'unico caso: cercato in tutto `src/`.
