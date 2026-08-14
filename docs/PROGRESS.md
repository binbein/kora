# KORA frontend — stato di avanzamento

Riferimento rapido per riprendere il lavoro senza perdere accuratezza rispetto a
`CLAUDE.md`, che resta l'unica fonte di regole. Questo file racconta **cosa esiste e
perché**; le regole (palette, formule, dataset, definizione di "finito") stanno solo
lì.

## Come si tiene aggiornato

- Si scrive **alla chiusura di ogni milestone**, non a ogni commit.
- E **alla chiusura di una passata di refinement fra due milestone**. Non sono
  milestone e non hanno una definizione di "finito" nel `CLAUDE.md` §4, ma
  cambiano cose che chi riprende deve sapere prima di riscoprirle — un seam che
  non era acceso, un guardrail nuovo, un modulo che ha cambiato posto. Senza
  questa riga il loro unico racconto è git, che ha il dettaglio e non il quadro.
- Una decisione non ovvia va in `CLAUDE.md` con un commit `docs:` separato dal
  codice; qui si cita e si rimanda, non si duplica.
- Ogni voce dice **cosa è stato fatto, perché quella scelta e cosa è stato
  verificato a schermo** — non l'elenco dei file toccati, che sta in git.
- Se una milestone chiude con difetti noti e accettati, si scrivono qui: è il posto
  in cui chi riprende scopre cosa non deve rifare da capo.

## Stato

**M0, M1, M2, M3 e M4 chiuse. M5 è aperta.** La demo è condivisibile e **tutte e
cinque le aree leggono dal provider**: nessuna schermata dichiara più le proprie
costanti, le stringhe stanno in `i18n`, ogni importo passa da `format.ts` e ogni
data da `DEMO_TODAY`. Le rotte sono 26, il repository è nostro — niente base44,
zero richieste esterne a runtime — e `reference/` è stato cancellato, che era la
prova che M3 fosse davvero finita.

**Cinque blocchi di M5 su sei sono chiusi** — accessibilità, stati di errore e
vuoto, validazione dei form, guardie di rotta e **le altre tre lingue**: la
demo parla italiano, tedesco, francese e inglese, e il selettore le mostra
tutte e quattro. **Resta il solo blocco f)**, le pagine del footer, che dipende
dai testi legali dei founder e dalla decisione sulla residenza dei dati.

**M5 è l'ultima milestone del piano, e si articola in sei blocchi** approvati
dai founder l'11.08.2026 — accessibilità, stati di errore e vuoto, validazione
dei form, guardie di rotta, le altre tre lingue, pagine del footer. Stanno in
`CLAUDE.md` §4 con le dipendenze e le decisioni che ognuno porta con sé;
**ognuno chiude con una demo funzionante** (§2.3), quindi non è un cantiere
unico che resta aperto fino alla fine.

**Le PR di M5 sono la milestone e non entrano nel conto delle passate di
refinement.** Vale il criterio già scritto in quella sezione, che esclude la
milestone: M4 è #19 e ha la sua sezione, e i blocchi di M5 hanno la loro qui
sotto. **Il conto vive in un posto solo**, la sezione «Refinement fra le
milestone», e oggi dice **diciassette**: questa riga ne dichiarava undici mentre
quella ne diceva tredici, ed erano due misure dello stesso insieme prese in due
momenti — il difetto che questo file racconta di aver già avuto con le CTA e con
i guardrail. Qui non si ripete il numero: si rimanda.

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. Il magazzino della precedente demo
Next.js è vissuto in `reference/` fino alla chiusura di M3 e resta nella storia
di git; il suo repository è archiviato e non si tocca. I PDF del Business Plan
stanno in `docs/` dal 07.08.2026 (decisione qui sotto), ma restano una fonte da
consultare: le cifre ammesse sono solo quelle trascritte in `CLAUDE.md` §8 e §9.

**M4 è chiusa**: da `/hr/report` si scarica un PDF di una pagina per il
trimestre scelto. Da lì il lavoro è **refinement fra le milestone** — passate
che non aggiungono schermate e mettono in ordine layer dati, seam e dizionario;
la sintesi sta nella sezione dedicata, sotto M4. **La prossima milestone è M5.**

**La palette è decisa ed eseguita** (riunione del 10.08.2026): le CTA piene sono
passate su `primary`, 13 punti su 9 file, e nessun call site usa più
`variant="secondary"`. **Il debito AA è chiuso dal blocco a) di M5**: il caso
inverso — testo e icone teal su fondo chiaro — era censito in fondo alla sezione
refinement con destinazione M5, e ci è arrivato; il censimento di chiusura sta a
zero punti informativi su 27 rotte, nella sezione M5.a.

~~**Resta un residuo dichiarato, e non è un difetto lasciato indietro**:
l'anello di focus è invisibile sui 12 CTA pieni.~~ → **chiuso dal blocco c)**,
insieme all'altra decisione della stessa famiglia: i founder hanno preso
entrambe il 12.08.2026, e il blocco le ha eseguite prima di scrivere una riga
di validazione. Le misure stanno nella sezione M5.c e in `CLAUDE.md` §6.1.

Delle altre due esecuzioni rimandate dalla stessa riunione, **una è fatta**: la
**build "demo"** in cui i guardrail loggano e la **checklist pre-pitch** sono la
passata del 10.08.2026, in fondo alla sezione refinement — da lì `npm run
build:demo` è ciò che `vercel.json` deploya, e `docs/PITCH.md` è il terzo
documento del repository. ~~Resta **`Intl.ListFormat`**, che è dentro M5.~~ →
**fatto da M5.e**: `formatList` in `format.ts` chiama `Intl.ListFormat`, e con lui
è sparita la chiave `t.common.listSeparator`. Le tre esecuzioni rimandate dalla
riunione del 10.08.2026 sono quindi **tutte fatte**.

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

- ~~**Tre voci delle card prezzi non corrispondono al Business Plan.**~~ →
  **chiuse in M3** con l'area pubblica, e chiuse come previsto: le card leggono
  da `Plan` tramite `plan-features.ts` invece di elencare le voci a mano, quindi
  non è stato corretto niente a mano e non c'è più niente da cui divergere.
  Erano in `Pricing.jsx` e, per le prime due, anche nell'anteprima piani della
  landing:
  - Il **Plus** elenca "Colloquio conoscitivo gratuito", ma il BP (p.9) lo dà solo
    all'Essenziale;
  - l'**Executive** dice "Coach + psichiatra se necessario": il §9 vuole il tetto
    di **6 sessioni di coaching all'anno**, e lo psichiatra è **incluso**, non
    condizionato a un "se necessario";
  - l'**Executive** dice "Consulenza HR trimestrale", ma il BP (p.10) dà **report
    mensile e call mensile col team clinico**. È l'unica delle tre che sottostima
    il piano invece di gonfiarlo.

  **Da M2 il §9 conteneva il dato con cui M3 le ha chiuse**: la trascrizione
  dell'Executive saltava tre righe della p.10, fra cui proprio la dashboard HR
  mensile. Chi fosse andato a correggere la card leggendo la costituzione non ci
  avrebbe trovato la riga, e avrebbe lasciato il trimestrale al suo posto.
- **Le iniziali dei pazienti e l'elenco dipendenti HR sono lo stesso insieme di
  persone.** `HRDipendenti.jsx` elenca G.R., M.B., E.K., L.B., S.C., F.M., A.T. e
  P.V.; il dataset del portale professionista (M2) usa G.R., M.B., E.K., S.C.,
  L.B. e A.T. fra gli attivi e introduce D.F., P.M. e R.T. fra i percorsi
  conclusi. Oggi non c'è conflitto, ma in M3 quella schermata leggerà dal
  provider: **stesse iniziali devono voler dire la stessa persona**, e due
  persone diverse non possono condividerle. `L.B.` è Laura Bernasconi in
  entrambe, ed è il caso che rende la regola non teorica.
- ~~**Cinque numeri d'albo inventati in `AdminProfessionisti.jsx`**~~ — FSP-2019-4521,
  FMH-2015-8830, ICF-ACC-3310, FSP-2021-9901, SVDE-2018-7712 → **spariti in M3**
  con la migrazione dell'area admin, insieme al roster inventato che li portava.
  Il §8 li vietava da M2: un identificatore di formato plausibile su una persona
  inventata può collidere con l'iscrizione di un professionista vero, e nessuno
  se ne accorge leggendo. Il campo non esiste nemmeno nel tipo.
- ~~**L'organico resta 150, non i 120 del §8.**~~ → **chiuso in M3 con la
  passata HR**, portando il codice a 120 e mai il contrario (`CLAUDE.md` §8).
  L'inventario resta qui come storia: è il conto di ciò che la passata ha
  toccato, e la sua ultima riga dice anche ciò che non andava toccato.
  Verificato occorrenza per occorrenza:
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
- ~~Il 👋 nella home dipendente resta: decisione in sospeso~~ → **tolto**, con la
  decisione dei founder del 07.08.2026 fra quelle chiuse. Era l'ultima emoji del
  codice, e da lì il `CLAUDE.md` §7 non ha più eccezioni.

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

- ~~**Restano 2 vulnerabilità moderate**, entrambe lo stesso open redirect di
  `react-router` via backslash in `<Link>`.~~ → **chiuse dal blocco d) di M5**
  (12.08.2026), che ha portato il router alla **7.18.2**: `npm audit` esce a
  zero. La previsione era giusta nella sostanza — *"si riapre quando il router
  si tocca per altri motivi"* — ed è andata esattamente così: a riaprirla sono
  state le guardie di rotta, non la sicurezza.

  **Due cose che questa riga diceva e non erano esatte**, corrette qui perché
  chi legge la storia veda anche gli sbagli:

  - **non sono la stessa vulnerabilità.** La prima è l'open redirect via
    backslash in `<Link>`; la seconda è *Arbitrary Constructor Injection via
    `deserializeErrors()` in SSR Hydration*
    ([CVE-2026-53666](https://github.com/advisories/GHSA-337j-9hxr-rhxg),
    verificata dai founder prima di scrivere questa riga). **Nessuna delle due
    ci riguardava**: la prima ha bisogno di URL forniti dall'utente, che questa
    demo non ha, e la seconda di idratazione SSR, che una SPA non fa;
  - **`npm audit fix` non era un no-op per la ragione scritta.** Restava alla
    6.30.4 perché il range vulnerabile arriva fino alla **7.17.0**: il rimedio
    non era "la 7", era una 7 che allora non esisteva ancora. Il fatto pratico
    — non lanciare `--force` — era comunque giusto.

  **Il major è costato quasi niente**, ed è la parte che vale per il futuro: la
  superficie del router qui è `Link`, `useLocation`, `Outlet`,
  `useSearchParams` e i tre di `App.tsx`, tutte immutate in v7. Una modifica di
  scope va pesata su quanto codice tocca, non su quanto è grande il numero di
  versione.
- **La rewrite di `vercel.json` risolve il 404 sui link profondi, non lo stato.** Il
  provider vivrà in memoria (§10, "Come si naviga durante la demo"), quindi un
  ricaricamento azzera comunque la demo: `/hr/report` aperto da zero mostrerà la
  dashboard nello stato iniziale, non quello in cui l'aveva lasciata chi ha
  condiviso il link. Sono due problemi diversi e solo il primo è chiuso.
- **`formatCHF` separa `CHF` dalle cifre con uno spazio unificatore** (U+00A0), non
  con uno spazio normale. È la resa corretta, ma un'asserzione o un `grep` scritti
  con lo spazio da tastiera falliscono contro una stringa che sembra identica.
- ~~**`src/utils/index.ts` è ancora lì e non lo importa nessuno**~~ →
  cancellato in `1eb5eb3`. `createPageUrl` non aveva chiamanti dal primo commit
  e si vedeva da quando ESLint legge il TypeScript; la rimozione è arrivata in
  un commit suo, come vuole il §11.
- ~~**Resta un warning di lint**, ora visibile perché lo script non usa più
  `--quiet`: `bookingStep` in `Psicologi.jsx`, stato morto di un wizard a più
  passi~~ → sparito in M3 con la riscrittura della prenotazione. Da lì
  `npm run lint` esce **a zero warning**, non solo a zero errori.
- ~~**La console mostra due avvisi di `react-router`** sui future flag della 7
  (`v7_startTransition`, `v7_relativeSplatPath`).~~ → **spariti col major del
  blocco d)**, e senza configurare niente: nella 7 quei due comportamenti sono
  il default, quindi i flag non esistono più. Da qui la console di sviluppo
  porta i soli avvisi di vite e di React DevTools. La previsione era giusta —
  *"spariscono con la stessa migrazione"* — e la decisione di scope è arrivata
  con le guardie di rotta, come l'altra riga qui sopra prevedeva.

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
  due pazienti sopra il cap che mostrano il co-payment — il **deterrente** che
  tiene il consumo dentro il cap, messo a schermo. *(Questa riga diceva «il
  meccanismo su cui il Business Plan regge il margine»: era una parafrasi
  sbagliata fin dall'inizio. Il §5 del BP, riquadro «Principio fondamentale», dà
  come fonte principale del margine **il gap fra sessioni incluse ed erogate**, e
  il §9 mette il co-payment fra gli stream con margine «—» e funzione di
  fidelizzazione. Corretta il 15.08.2026.)*
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

### M3 — Area per area

#### La tipizzazione del layer shadcn

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

- ~~**`App.jsx` e `main.jsx` restano `.jsx` di proposito**: `App.jsx` si converte
  quando M3 aggiunge `/roi`~~ → convertiti in `ab4d57e`, esattamente lì: è
  l'ultimo commit a toccare `App` prima di quello che aggiunge la rotta.
  `index.html` è andato con loro, perché `main` importa `App` e `index.html`
  punta a `main`: sono una modifica sola, non tre.
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

#### L'area HR (§10.C)

La prima delle quattro aree, e quella su cui il pitch si regge. Cinque rotte dal
provider, stringhe in i18n, importi e date da `format.ts`.

**Il dataset ha corretto il §9, non il contrario.** La serie di utilizzo dei
servizi doveva contenere l'agenda della Dr.ssa Meier, e non ci stava: la sola
Meier eroga 41 sedute nel trimestre corrente, dove i semi ne attribuivano 37
all'azienda intera. Lo psicologo ora **si compone** — la sua agenda più la quota
dichiarata degli altri psicologi della rete — e `sessionsUsed` ha smesso di
essere un seme: si somma dalla serie. I cumulati passano da 142 / 105 / 64 / 28 a
**142 / 86 / 50 / 22**; risparmio, giorni evitati, iscritti e attivi non si sono
mossi. Gli altri tre servizi sono stati approvati il 07.08.2026 (§8).

**Lo "Stress medio −8%" non era riproducibile.** Dalla serie di M2 escono −2
punti trimestre su trimestre, −13% sui dodici mesi; il −8% usciva solo scegliendo
una finestra di sei mesi, cioè cercando la finestra che dava il numero voluto.
Ora si mostra il valore calcolato e l'etichetta dice su cosa — §6.1 aggiornato.

**Quattro difetti chiusi**: la ciambella che diceva 180 dove la KPI diceva 142
(ora è la stessa somma, quindi lo stesso numero); l'organico a 150, comprese le
due cifre di `AdminAziende`; le iniziali dell'elenco HR, dove L.B. era "in
attesa" e in Finance mentre Laura Bernasconi ha tre sedute erogate ed è in
Operations; le date di fatturazione ferme ad aprile su una demo di settembre.

**Verificato a schermo a 1280px**, con le asserzioni del §10.C:

- fetta psicologo della ciambella = KPI sessioni, in tutti i periodi: 142 sul
  trimestre corrente, 50 sul primo del 2026, 22 sul più vecchio;
- media pesata dell'ultimo mese ricalcolata a mano — 13×78 + 26×52 + 16×44 +
  15×31 + 14×26 su 84 misurati = 46.4 → **46** — che è dove cade il punto del
  grafico;
- marker dell'alert sul **decimo mese**, misurato sulle coordinate del tick;
- **Direzione "—" col lucchetto in tutti i periodi**, e i misurati su ogni riga:
  è l'unico modo di vedere perché HR + Legale è pubblicabile e la Direzione no,
  visto che hanno lo stesso organico;
- "Stress medio **−2 punti**" verde con la freccia in giù;
- il selettore cambia risparmio, adozione, attivi, sessioni, check-up e
  ciambella; sul trimestre più vecchio lo stress mostra "—" perché un precedente
  non ce l'ha.

**Difetti trovati in questa passata:**

- **La ciambella disegnava i settori vuoti.** I gruppi `recharts-pie-sector`
  c'erano e non contenevano nessun `path`: l'animazione d'ingresso non
  completava. Cioè la schermata più importante del pitch poteva mostrare un buco
  a seconda della macchina. Da qui la regola del `CLAUDE.md` §6.2 — **nessuna
  animazione d'ingresso sui grafici** — che l'area admin, con i suoi cinque
  grafici, eredita.
- **"Pianifica review" era un vicolo cieco** nella pagina report: un pulsante che
  non faceva niente e non era in nessun elenco di scope. Rimosso.
- **`kpiCheckupHint` diceva "sugli {enrolled} iscritti"**, e l'articolo si
  accorda con come si legge il numero — "sugli 82" ma "sui 58". Il selettore fa
  passare dall'uno all'altro, quindi la frase era sbagliata su metà dei periodi.
  Riscritta con "su", che è invariabile: è il §2.7 applicato a una preposizione.

**Aperto e dichiarato:**

- **La tabella stress per reparto non segue il selettore**: mostra l'ultimo mese,
  perché lo stress è una serie mensile (§5.3) mentre il selettore governa gli
  aggregati trimestrali. Il titolo lo dice. Se un giorno dovrà seguirlo, serve un
  metodo nuovo sul provider.
- **L'elenco dipendenti è un estratto di otto righe su 120**, dichiarato a
  schermo e in `CONTRATTO-DATI.md` §7. ~~La paginazione è M5.~~ → **non era di
  M5**, e nessuno dei sei blocchi la contiene: è lavoro dell'MVP, dichiarato in
  `CONTRATTO-DATI.md` §8.7 dalla passata del 15.08.2026.

#### L'area dipendente (§10.B)

La seconda delle quattro aree. Sei rotte dal provider, più la card del check
rapido approvata il 06.08.2026, e **le prime due scritture del percorso**.

**La prova del marketplace, rimandata da M2, è chiusa.** Prenotando uno slot
della Dr.ssa Meier dal portale dipendente succedono tutte e quattro le cose del
§10.B, e succedono perché è **un record solo**: `bookAppointment` scrive una
seduta, e le due proiezioni la rileggono da due radici invalidate. Non c'è nessun
stato allineato a mano.

**Il contatore non sale, e non deve.** Il §10.B chiedeva che prenotando "il
contatore salga"; `used` conta le erogate e una prenotazione nasce `scheduled`,
quindi a muoversi è la parte in programma — decisione dei founder, e ora il §10.B
lo dice. Da lì due guardrail: `used` invariato dopo una prenotazione, e nessun
numero dell'area HR che si muove.

**Dei quattro contatori di Laura, uno si derivava e tre no.** Il §8 dava 3/10
psicologo e 1/4 coach senza dire che hanno origini diverse: il primo si conta
dall'agenda della Dr.ssa Meier, il secondo è un seme, perché dietro il coach non
c'è nessun portale. Ora la distinzione è scritta nel §8 e nel dataset. I due
conteggi nuovi — 2 consulti di medico virtuale, check-up già fatto — sono stati
approvati il 07.08.2026, e **il secondo consulto è la chat che la schermata
mostra**: senza quella coincidenza il Profilo direbbe "2" mentre chi guarda è
dentro il terzo.

**Sette punti dicevano "Giulia Rossi".** Cinque schermate, il riquadro della
sidebar e l'avatar. G.R. nel dataset è un'altra persona — un'iscritta di Finanza
che compare nell'elenco HR e fra i pazienti della Dr.ssa Meier — quindi non era
solo il nome sbagliato: era il difetto "stesse iniziali, stessa persona" che M0
aveva segnalato come da chiudere in M3.

**Verificato a schermo**, con le asserzioni del §10.B:

- prenotando mercoledì 30.09 alle 17:30 con la Dr.ssa Meier: lo slot sparisce
  dai liberi (restano 25, 28, 29), l'appuntamento compare in home al posto
  giusto fra il 24.09 e il 01.10, la seduta compare nelle sedute in programma
  del professionista;
- prenotando venerdì 25.09 alle 10:00, cioè dentro la settimana visibile, la
  seduta compare **nella griglia del calendario**: "sedute questa settimana"
  passa da 5 a 6 e "in agenda questo mese" da 22 a 23;
- dopo due prenotazioni il contatore dice "3 su 10 sessioni usate · 4 in
  programma" — `used` fermo — e la dashboard HR non si muove di un numero:
  CHF 14'200, 16 giorni, 68%, 41 attivi, 142 sessioni, 62% check-up;
- il check-up dice la stessa cosa sui tre lati: referto del 15.03.2026 nel
  portale dipendente, `completed` nell'elenco HR, e il Centro Diagnostico
  Basalto — che l'admin dà in convenzionamento — non è fra i quattro
  prenotabili;
- il check rapido si salva e si rilegge: "Grazie, registrato." con la risposta
  scelta, tornando in home;
- 25 rotte percorse, **zero errori e zero promise rifiutate**, nessuna schermata
  vuota; `npm run lint` a **zero warning**, che è la prima volta da M1.

**I guardrail nuovi, provati al contrario**: la prenotazione del check-up
spostata su una struttura in convenzionamento, l'elenco HR che dà il check-up di
Laura come "available", l'ultimo consulto spostato via dal giorno della demo e
il piano di prevenzione senza una delle cinque aree fanno tutti fallire il
dataset con il messaggio giusto.

**Difetti trovati in questa passata:**

- **Il guardrail della prenotazione era due volte inutile**, e l'ha detto
  proprio il test al contrario. *Era tautologico*: verificava che lo slot fosse
  fra quelli di `getAvailableSlots`, cioè si appoggiava alla funzione che
  avrebbe dovuto sorvegliare, e rompendo il filtro degli occupati la stessa
  rottura faceva passare il controllo. *E spariva*: un `throw` in un metodo
  `async` diventa una promise rifiutata, e react-query la cattura nello stato
  della mutation. Ora confronta con l'agenda, che è indipendente, e usa
  `assertInDevOutsidePromise`, che rilancia da un microtask — lo stesso rimedio
  del controllo sulla cache fredda. **È la regola generale per ogni guardrail
  dentro una mutation**, e la prossima area ne avrà.
- **Il bianco su `secondary` non passa l'AA**: 2.83:1 su testo da 14px in peso
  normale, contro il minimo di 4.5. Riguardava i chip selezionati della
  prenotazione, la bolla del medico e il badge del check-up, tutti portati sulla
  coppia `accent`/`accent-foreground`, che dà 10.7:1. Il §6.1 chiedeva di
  verificare caso per caso, ed è la prima volta che qualcuno lo ha fatto con un
  numero in mano. **Il caso grosso resta aperto**: sotto.
- **Il "Piano AI" prometteva la nutrizionista**, che il §9 dà solo
  all'Executive mentre Demo SA è su Plus, e ripeteva un contatore di sedute
  coach in una forma diversa da quella del §8.
- **La schermata check-up si contraddiceva con l'HR**, e offriva in prenotazione
  una struttura che l'admin dichiarava non ancora convenzionata.

**Aperto e dichiarato:**

- **La CTA verde piena non passa l'AA, in tutta la demo.** `bg-secondary` con
  testo bianco a 14px in peso 500 è lo stesso 2.83:1, e compare in **19 punti su
  11 file** — pubblica, dipendente, HR, professionista, admin. Non è stato
  toccato: cambiarlo è una decisione di palette dei founder, non una correzione
  di passata, e `--secondary-foreground` è bianco nei token, quindi la scelta è
  incorporata nel design system. Le due strade sono scurire `--secondary` o
  portare le CTA su `primary`. ~~Va deciso prima di M5, che ha "accessibilità
  completa" in elenco.~~ → **deciso ed eseguito il 10.08.2026**. I 19 punti su 11
  file erano la rilevazione di allora; il conteggio rifatto con un criterio
  scritto dà **13 punti su 9 file**, ed è in fondo alla sezione refinement.
- **La home elenca tutti gli appuntamenti in programma**, che oggi sono tre più
  quelli che si prenotano durante la demo. È voluto — è così che si vede
  comparire quello nuovo — ma se l'elenco crescesse troppo andrebbe accorciato.
- **Il calendario del professionista mostra solo la settimana corrente.**
  Prenotando oltre il 27.09 la seduta compare nelle sedute in programma e non
  nella griglia. Non è un difetto di questa passata — il calendario è di M2 e non
  ha navigazione fra settimane — ma è la ragione per cui la prova a schermo è
  stata fatta due volte, una dentro la settimana e una fuori.

#### L'area pubblica (§10.A)

La terza delle quattro aree, e la prima che contiene **una schermata costruita
da zero**: il calcolatore ROI, che porta le rotte da 25 a 26.

**Il calcolatore collega il motore, non lo riscrive.** `roi-model.ts` è
trapiantato e verificato da M1; la pagina non contiene nessuna costante
economica, e il prezzo arriva da `Plan` — `computeRoi` lo prende come parametro
proprio per non essere una seconda fonte di quella cifra. Sta sul **Plus** e lo
dichiara a schermo: il §9 fissa `costo = N × 55 × 12`, quindi è il Plus a
produrre i CHF 66'000 e il 2.35:1, e un selettore di piano mostrerebbe ~1.2:1
sull'Executive — il numero che l'investitore ha letto sul documento smetterebbe
di essere *il* numero.

**Il campo tiene il testo, non il numero.** Con lo stato già ristretto
all'intervallo non si potrebbe digitare "50": la "5" diventerebbe 20 sotto le
dita. Il clamp governa il calcolo, la normalizzazione avviene all'uscita dal
campo, e un campo vuoto calcola sul minimo invece di mostrare NaN.

**Le card leggono da `Plan`, e i tre difetti di M0 si sono chiusi da soli.**
`plan-features.ts` deriva le righe del listino, e ha due chiamanti — `/pricing`
e l'anteprima della landing — quindi le due schermate possono mostrare un numero
diverso di voci ma non una voce diversa. Nel codice ereditato la landing diceva
"Coach + psichiatra" e `/pricing` "Coach + psichiatra se necessario" dello
stesso piano.

**`Plan` ha un campo nuovo**, `hrDashboard`, che chiude il terzo difetto. È
nato come cadenza in mesi per la sola dashboard dell'Executive — l'unica che il
§9 trascrivesse — e le card Essenziale e Plus erano rimaste senza. **I founder
hanno trascritto le altre due dalla p.9 del BP l'08.08.2026** (§2.4), e con
tutti e tre i piani serviti il campo è diventato **obbligatorio e
un'enumerazione**: `base | department | advanced`.

Le cadenze non ci stanno apposta. Il BP dà "trimestrale" al Plus e "mensile"
all'Executive, mentre sulla riga dell'Essenziale "mensile" si riferisce alla
dashboard e non a un report: un numero avrebbe costretto a decidere quel punto,
cioè a inventarlo. I tre livelli sono tre frasi intere in `i18n`, come i due
check-up — la base dice cosa mostra, quella del Plus introduce il taglio per
reparto e l'alert burnout precoce (che è l'alert del §8, il pezzo su cui si
regge la dashboard del §10.C), quella dell'Executive aggiunge report e call
mensili.

**L'hero della landing sbagliava quattro cifre su quattro**, sulla prima
schermata che un investitore vede: 74 di punteggio dove Laura ne ha 78, un
"Sonno 6.2h" che il §8 non contiene, un'adozione dell'"82%" che era il numero
degli **iscritti** letto come percentuale — la vera è 68% — e uno "Stress −8%"
che la migrazione HR aveva già dimostrato non riproducibile. Più la Dr.ssa
Bianchi, che non è nel roster, a un "domani 10:00" scritto a mano. Ora è una
proiezione vera; il sonno resta come **area debole del profilo**, che è un
valore del dominio, non come un numero di ore che non esiste.

**`submitDemoRequest` è la terza mutation e non invalida niente.** A leggere le
richieste sarà il back-office, che è l'ultima area: la lettura e la sua
invalidazione nascono lì, insieme, invece di essere indovinate adesso. Il record
si salva comunque, quindi l'admin lo troverà. Lo stato di successo **è il record
restituito** e nomina l'azienda che ha scritto: non può comparire se la scrittura
non è avvenuta, dove l'`handleSubmit` ereditato metteva `submitted = true` e non
chiamava niente.

**Verificato a schermo a 1280px**, con le asserzioni del §10.A:

- a N=100 escono i cinque numeri di ancoraggio: perdite CHF 1'289'500, risparmio
  CHF 221'150, costo CHF 66'000, netto CHF 155'150, ROI 2.35:1;
- le quattro voci sommano al totale mostrato a N=20 (257'900), N=100
  (1'289'500) e N=1000 (12'895'000), e il rapporto resta 2.35:1 su tutti e tre;
- digitando 5000 il calcolo si ferma a 1000, un campo vuoto calcola su 20, e
  "50" si digita cifra per cifra senza che il clamp lo contrasti;
- le tre card corrispondono al §9 riga per riga, e il simulatore deriva sia le
  opzioni sia i totali: 150 sul Plus annuale dà CHF 99'000, 120 dà **CHF
  79'200** — la fatturazione di Demo SA del §8 — l'Executive annuale CHF
  147'600 e mensile CHF 12'300;
- l'hero dice 78/100, "In buon equilibrio", "Focus: sonno", "gio 17:30 · Dr.ssa
  Meier", "Adozione 68% · Stress −2 punti";
- il form registra la richiesta e la conferma nomina l'azienda; un invio vuoto è
  bloccato con i tre campi obbligatori segnalati;
- **26 rotte percorse, zero 404, zero schermate vuote, zero errori in console**;
  `npm run lint` e `npm run typecheck` a zero.

**La nav regge il tedesco.** Con le sei etichette sostituite dai loro
equivalenti tedeschi — Preise, ROI-Rechner, Demo, Mitarbeitende, HR,
Fachpersonen, più Anmelden e Demo vereinbaren — la barra sta su una riga a
1280px con 184px di margine e senza scorrimento orizzontale (§2.7).

**Difetti trovati in questa passata:**

- **L'Executive diceva "risposta entro 1 ore".** L'SLA di un'ora è nel §9 ed è
  sulla card più cara: derivando le voci da `Plan` è saltato fuori subito, e la
  correzione è quattro frasi complete invece di due con un numero dentro. È il
  §2.7 nel suo caso più piccolo, e la stessa trappola aspetta in tedesco, dove
  cambia anche l'ordine delle parole.
- **La stessa stringa usciva due volte nell'hero**, come badge e come sigillo
  del riquadro, a mezzo schermo di distanza.
- **Le voci morte del footer** erano `<p>` con `cursor-pointer` e hover su tutte
  e quattro le rotte pubbliche: si comportavano da link e non portavano da
  nessuna parte. Tolta l'affordance, il testo resta come elenco di sezioni —
  decisione dei founder dell'08.08.2026. **Privacy policy, termini e cookie
  policy veri sono lavoro di M5**, insieme a "Chi siamo", "Contatti", "Carriere"
  e "Blog".

**Aperto e dichiarato:**

- **L'animazione d'ingresso della landing non completa a scheda nascosta.**
  Verificato: con `document.visibilityState === "hidden"` il browser congela
  `requestAnimationFrame` e framer-motion resta fermo — misurato a **opacità
  0.068** dopo due secondi. A scheda visibile completa regolarmente, ed è la
  ragione per cui gli screenshot dell'hero vanno presi con la scheda in primo
  piano. **Non si tocca** — il §6.2 vieta l'animazione d'ingresso sui
  *grafici*, e il §3 tiene framer-motion apposta per questa schermata — ma la
  conseguenza è scritta dove serve: il §10, "Come si naviga durante la demo",
  dice ora che la landing non si pre-apre in una scheda di sfondo. È script del
  pitch, non un difetto da correggere (founder, 08.08.2026).
- **`FlexiblePlanCard.jsx` resta `.jsx` e senza chiamanti**, ed è voluto: il
  piano "Personalizzato" è in sospeso, e i suoi undici prezzi non stanno nel
  Business Plan, quindi non potrebbe leggere da `Plan` nemmeno volendo. È
  l'eccezione dichiarata del §11, non una dimenticanza.
- **Il debito AA sulla CTA verde è sceso ma non è chiuso.** Le schermate nuove e
  rifatte usano `primary` o la coppia `accent`, quindi il debito non si è
  allargato, ma i punti che restano nelle aree non toccate vanno chiusi con la
  decisione di palette. → **Presa ed eseguita il 10.08.2026** — CTA su
  `primary`. Che le schermate di questa passata avessero già scelto `primary` è
  la ragione per cui la decisione è costata poco: la direzione era di fatto
  quella, e `Roi.tsx` è diventata il precedente che la passata ha seguito.

#### Il back-office (§10.E) — e la chiusura di M3

L'ultima delle cinque aree. Sei rotte, e una regola sola: **i totali si ricavano
dai dati e non si scrivono.** Era l'area che quella regola violava più di ogni
altra — "618 utenti attivi" accanto a un tasso di attivazione che ne implicava
767, e un fatturato mensile che non tornava con l'elenco delle aziende sulla
schermata a fianco.

**Il portafoglio clienti è stato ratificato, non ereditato.** M0 aveva congelato
i cinque nomi; organici e piani erano ancora quelli di base44 e da loro discende
ogni totale. I founder li hanno ratificati l'08.08.2026 insieme ai nove valori
nuovi — cinque date di ingresso e quattro conteggi di iscritti — e hanno spostato
**Betulla dal Plus all'Essenziale**: 85 dipendenti sul Plus contraddicevano
`/pricing`, che quel piano lo dichiara per aziende da 100 a 300.

**Da lì non si scrive più nessun numero di piattaforma.** Il ricavo di
un'azienda è organico × prezzo × 12; il ricorrente mensile è la somma delle
attive in quel mese, quindi una curva a gradini; l'attivazione è iscritti ÷
coperti. **Due strade portano allo stesso numero e un guardrail lo verifica**: i
CHF 54'414 del mese per dodici sono i CHF 652'968 dell'elenco.

**Le sessioni di piattaforma non hanno richiesto nessun numero nuovo**: ogni
cliente è la curva di adozione di Demo SA scalata sul rapporto fra gli iscritti,
contata dal mese di ingresso, con i servizi che il piano non include azzerati.
Demo SA entra nel totale a rapporto 1, cioè con le sue 142 sedute esatte — ed è
un guardrail, non una speranza.

**I cinque numeri d'albo inventati sono spariti**, difetto aperto da M0: al loro
posto la qualifica e i due controlli che la piattaforma fa davvero. "Prenotabile"
si **deriva** da `documentsVerified && mandateSigned`, senza uno stato accanto
che possa contraddirli.

**Il quinto professionista mette a schermo il vetting.** La Dr.ssa Keller ha
documenti verificati e mandato non firmato, zero sedute e nessuna valutazione —
`rating` è diventato `number | null`, perché uno zero si legge come la peggiore
possibile. Non è prenotabile, con la stessa regola del Centro Diagnostico
Basalto, e la prenotazione del dipendente filtra su `isBookable`.

**Il giro della richiesta demo è chiuso.** `getDemoRequests` è nato con il suo
consumatore e `submitDemoRequest` ora invalida: la riga "nessuna, oggi" del
`CONTRATTO-DATI.md` §4 è diventata una chiave vera.

**Verificato a schermo a 1280px:**

- 4 clienti attivi, 798 dipendenti coperti, **CHF 652'968** di ricavo annuo e
  **415 iscritti** — lo stesso 415 che l'analytics chiama utenti iscritti, e
  un'attivazione del **52%** che è quei due divisi;
- 5 professionisti, 4 prenotabili, 1 in verifica, **1'147 sedute erogate**, dove
  la schermata ereditata ne scriveva 783;
- compilando il form da `/demo` per "Ontano Logistica SA" e camminando fino a
  `/admin` con la sola navigazione interna, la richiesta è in tabella, datata
  23.09.2026;
- **la Dr.ssa Keller non compare nella prenotazione** del dipendente;
- i cinque grafici disegnano dodici mesi da ott a set, e la curva di attivazione
  racconta l'onboarding: parte al 68% con la sola Demo SA, scende a ogni nuovo
  cliente e si assesta al 52%;
- **nessun numero dell'area HR si è mosso**: CHF 14'200, 16 giorni, 68%, 82 su
  120, 41 attivi, 142 di 1'200.

**Difetti trovati in questa passata:**

- **La riga di KPI degli utenti ripeteva il difetto del 618/767**, in forma
  nuova: un conteggio di piattaforma (415) accanto a tre calcolati sull'estratto
  di sette righe. Ora ognuna dichiara su cosa è calcolata.
- **La ripartizione per servizio mandava a capo "Medico virtuale"** sull'asse.

**Aperto e dichiarato:**

- **Il pulsante "Approva" del dialogo professionisti è stato rimosso**, con la
  decisione dei founder qui sotto. La scrittura vera dell'admin arriva con le
  guardie di ruolo di M5.
- **I grafici recharts misurano zero a scheda nascosta.** Il difetto segnalato
  in apertura di M3 è stato capito: non è il `ResponsiveContainer`, è che a
  scheda nascosta `innerWidth` vale **0** e l'intera pagina misura zero. Con una
  scheda visibile i cinque grafici disegnano correttamente. È la stessa causa
  dell'animazione della landing che resta congelata (§10), e la conseguenza è la
  stessa: **le verifiche a schermo si fanno con la scheda in primo piano.**

#### M3 è chiusa

`reference/` è stato cancellato, che è la prova che il §4 chiedeva: se fosse
servito ancora qualcosa da lì, un'area non sarebbe stata finita. Verificato
prima di cancellare — nessun `import` da `src/`, e ogni file di
`reference/lib/` ha il suo corrispettivo, tranne `use-data.ts`, che è il
provider sincrono che non doveva entrare. Le sue esclusioni escono da ESLint e
da `tsconfig`; resta nella storia di git.

**La prova finale non è stata l'area ma la demo intera**: 26 rotte percorse con
la sola navigazione interna, **zero 404, zero schermate vuote e zero link
morti** — ogni `href` interno di ogni pagina punta a una rotta che esiste —
console pulita, `npm run lint` e `npm run typecheck` a zero, build che passa.

#### Dopo la chiusura — il check rapido a cinque volti

Richiesta dei founder dell'08.08.2026, sullo stesso branch. La card passa dalle
cinque pillole di testo a **cinque volti da chiosco**, icone lucide da `Laugh`
ad `Angry`. **Icone e mai emoji**: il §7 le vieta senza eccezioni, e un'icona
vettoriale eredita colore e dimensione, cosa che un carattere emoji non fa.

**I volti sono neutri e il colore sta sulla scelta, non sull'umore.** Una scala
dal verde al rosso userebbe `destructive`, che il §6.1 riserva agli alert, e
dipingerebbe di rosso una risposta sincera sul proprio stato d'animo — che in
un registro consumer giudica invece di accogliere.

I cinque volti **restano dopo la risposta**, con la scelta accesa: è il "già
risposto oggi" detto mostrando *cosa* si è risposto. La riga non cambia forma
fra i due stati, quindi la card non salta sotto le dita al tocco.

**L'etichetta resta visibile e non ha un `aria-label` sopra**, ed è una scelta:
il testo dentro il pulsante è già il suo nome accessibile, e un `aria-label` lo
sostituirebbe — chi legge lo schermo sentirebbe una parola e chi lo vede ne
leggerebbe un'altra. Le icone sono decorative e nascoste; i cinque pulsanti
formano un gruppo che la domanda nomina.

**Difetto trovato:** la prima stesura dava `bg-accent` al volto scelto, e a
schermo non si vedeva — la card risposta è già `bg-accent/40`, quindi acceso e
spenti finivano sulla stessa tinta. Il segnale è diventato **l'anello**: teal su
un chip bianco contro il fondo menta, con l'etichetta lasciata scura perché
`text-secondary` su bianco dà 2.9:1, sotto l'AA per un testo da 11px.

### M4 — Il report scaricabile

Sei commit. Il pulsante del §10.C.3 smette di non fare niente: da `/hr/report`
si scarica un PDF A4 **di una pagina** con le metriche del trimestre scelto.

**Il PDF non è un documento parallelo.** `PrintableReport` riceve gli stessi
oggetti che la schermata mostra — `HrReport` e `RoiSnapshot` del periodo
selezionato — quindi il documento e la pagina dicono lo stesso numero perché
leggono lo stesso dato, non perché qualcuno li ha riallineati (§5.5). Il
generatore non sa cosa cattura, e non deve.

**Il selettore del trimestre è entrato in `/hr/report`**, che prima mostrava il
solo trimestre corrente (decisione dei founder del 10.08.2026, qui sotto). Senza,
il guardrail del §5.6 non era eseguibile: «il trimestre del PDF è quello
mostrato» non si verifica se il trimestre non si può cambiare.

**La tecnica viene da uno spike misurato**, non da una scelta di gusto: il branch
`spike/report-pdf` ha campionato i pixel di html2canvas 1.4.1 contro
`getComputedStyle` e ha trovato **delta 0** su tutti i token — `bg-accent/40`,
`bg-primary/20`, `border-primary/20` e il teal pieno — quindi nessun workaround
sui colori. `scale: 2` e non 1, perché a scale 1 il foglio esce a ~104 dpi
effettivi. Le due librerie si importano **dinamicamente**: la landing non paga il
report di un'area che non visita.

**La larghezza fissa in px è la scoperta che conta.** Lo spike ha corretto il
modo in cui questo file raccontava il difetto dei grafici: non è
`ResponsiveContainer` a misurare zero, è che a scheda nascosta `innerWidth` vale
0 e con lui collassa **ogni catena `width: 100%`** — `documentElement`, `body`,
qualunque contenitore che erediti. Un contenitore in px è immune, e persino un
`ResponsiveContainer` annidato in lui misura giusto. Da qui la regola della vista
di stampa: **non ereditare la larghezza dal viewport.**

**Verificato a schermo, con la scheda in primo piano:**

- il PDF esce di **una pagina** per il trimestre scelto, con nome derivato —
  `kora-report-demo-sa-2026-q3.pdf` — e cambiando trimestre cambia con esso:
  provati Q3 2026, Q2 2026 e Q4 2025, aperti e riletti;
- i numeri del PDF coincidono con la dashboard su **tutti e quattro i periodi**:
  risparmio CHF 14'200 / 11'800 / 9'400 / 6'200, adozione 68 / 59 / 48 / 33%,
  attivi 41 / 34 / 27 / 18, sessioni 142 / 86 / 50 / 22, check-up
  62 / 52 / 36 / 21%, e lo **stress a "—" sul trimestre più vecchio**, che è
  `common.none` come a schermo;
- la formattazione svizzera regge dentro il documento, verificata alla
  codepoint: `CHF` + spazio unificatore U+00A0 + `14'200`, il meno tipografico
  U+2212 sul trend, le date `23.09.2026`;
- **la larghezza della vista di stampa non dipende dal viewport**: portando la
  finestra a 400px la catena `width: 100%` la segue, il nodo di stampa resta a
  794 e la cattura è **identica alla cifra** — stesso canvas 1588×1610, stessi
  277'559 pixel di inchiostro;
- la generazione non muove nessun numero a schermo, non lascia canvas né iframe
  nel DOM, e il pulsante si riabilita;
- 26 rotte percorse, zero schermate vuote, console pulita su scheda nuova,
  `npm run lint` e `npm run typecheck` a zero.

**Il guardrail, provato al contrario**: falsando il marcatore del periodo a
`2026-Q2` mentre il chiamante passa Q3, la console riporta *"Il PDF sta per
uscire per il trimestre 2026-Q3 ma la vista di stampa dichiara 2026-Q2"*.
Confronta due sorgenti indipendenti — il marcatore che la vista scrive su di sé
e il periodo che il chiamante dichiara — perché leggere due volte la stessa
variabile non verificherebbe niente.

**Il debito, dichiarato:**

- **il testo del PDF è raster.** Non è selezionabile né cercabile, e il file pesa
  ~200 KB contro i ~4 KB dello stesso foglio disegnato a vettori — misurato sullo
  spike. Va bene per un allegato di pitch. Il giorno in cui il report diventerà un
  artefatto di prodotto le strade sono due: `window.print()` con `@page`, che dà
  testo vero e i font giusti ma non produce un file, oppure jsPDF nativo con Inter
  e DM Sans incorporati, che costa un passo di build e il layout scritto a mano. Si
  ridiscute allora: non è un ripiego, è una scelta con una scadenza.
- **Il browser blocca i download automatici ravvicinati.** Generando due PDF di
  seguito dalla stessa pagina senza un gesto in mezzo, il secondo non arriva. Non
  riguarda l'uso vero — un clic è un gesto — ma è emerso provando due trimestri di
  fila da console, e chi lo rifà deve saperlo.
- **La vista di stampa non contiene grafici.** Le metriche e le raccomandazioni
  stanno in una pagina; il trend a dodici mesi e la ciambella non ci sono, e
  aggiungerli vorrebbe dire decidere se il documento resta di una pagina. È scope,
  quindi è dei founder.

### M5 — Verso la produzione

Sei blocchi, in `CLAUDE.md` §4, ognuno con la sua demo funzionante.

#### a) Accessibilità completa — chiuso

Dodici commit. **Il censimento a schermo passa da 79 punti sotto soglia a
zero**, su 27 rotte: le 26 più la 404.

**Il censimento vecchio era da grep e sbagliava in difetto.** Diceva 27 testi e
40 icone; a schermo, con il viewport reale, i punti distinti erano **79** — 60
icone e 19 testi — per 259 occorrenze. Il confine testo/icone che `PROGRESS`
dichiarava approssimativo non era l'unico problema: mancavano il **rosso**
(`text-destructive`, 3.30:1 sulla voce attiva della nav admin), un'**icona
`warning`** a 1.53:1, e l'**anello di focus**, che a `/50` di opacità dava
2.83:1 — cioè il colore dell'indicatore di focus era esso stesso un difetto.

**La lettura che ha riorganizzato il lavoro: nessuna icona aveva
`aria-hidden`.** Zero su tutte. Ma un'icona dichiarata decorativa è **esente**
dalla 1.4.11, e in questa demo ogni icona sta accanto a un'etichetta che porta
già il significato. Quindi il debito icone non era di colore, era di `aria`:
**114 icone dichiarate decorative**, nessuna informativa. L'esito del blocco è
quindi *"zero punti **informativi** sotto soglia"*, che è la formulazione
corretta della norma (founder, 11.08.2026).

**Hanno richiesto un nome, non un'esenzione**, i tre pulsanti hamburger di
`ProNav`, `HRNav` e `EmployeeNav`: avvolgevano solo un'icona e non avevano
`aria-label`, quindi nasconderla li avrebbe lasciati **senza nome
accessibile**. Sono nello stesso commit della stampigliatura perché nasconderle
e nominarli sono la stessa modifica: separarli avrebbe prodotto un commit in
cui l'app sta peggio.

**Due varianti di solo testo**, `secondary-strong` e `destructive-strong`
(`CLAUDE.md` §6.1). Servivano perché il colore che porta significato non può
essere illeggibile: la polarità del 07.08.2026 vuole il verde sulla metrica che
migliora, e portarlo su `primary` avrebbe chiuso il debito **spegnendo la
regola** — sul rosso non c'era nemmeno dove spostarlo.

**Si tarano sul fondo peggiore, e la prima taratura era sbagliata.** A `30%` il
teal dava 4.56 su bianco e **4.13 su `bg-secondary/10`**: passava la misura che
nessuno guarda e falliva quella che si vede, perché quel testo vive dentro
badge e card tinte. Corretto a `26%` e `44%`, verificati su bianco, tinta `/10`
e `accent` — peggior caso 4.93. **L'ha trovato il censimento di chiusura**, che
è la ragione per cui si rifà invece di dichiarare l'inventario a memoria.

**La nav admin lascia il rosso** e passa a `bg-primary/10 text-primary`, come
`HRNav` già faceva (9.97:1). Il contrasto è la metà minore: il §6.1 riserva
`destructive` ad alert e stati critici ed è il suo essere raro a farlo notare,
quindi una voce di nav sempre accesa in rosso era la diluizione che quella riga
vieta.

**`PageNotFound` è diventata `.tsx` con le stringhe in `i18n`**, perché la
passata l'ha toccata e il §3 non ha eccezioni. L'indirizzo ha perso lo `<span>`
colorato: la frase è una sola con segnaposto, come vuole il §2.7. Restano i
`.jsx` che il `CLAUDE.md` §3 elenca — da qui tre, più il caso a parte: il conto
lo tiene quella voce, con il criterio accanto, perché tenerne un secondo qui
significherebbe poterlo far divergere.

**Verificato a schermo, viewport 1280×900 e scheda in primo piano** (§11):

- **censimento di chiusura a zero** su 27 rotte, rifatto due volte;
- **il focus si vede da tastiera**: con `Tab` reale `:focus-visible` aggancia,
  `outline: auto` in `primary` a piena opacità, **11.93:1**;
- **la coreografia di `/admin` regge**: tabella vuota a freddo, uscita col
  logo, richiesta inviata, due Indietro, riga in tabella — **una sola
  navigazione** per tutto il giro;
- 27 rotte percorse, **zero schermate vuote**, console pulita con i soli due
  avvisi `react-router` noti da M1;
- **nessun numero si è mosso**: CHF 14'200, 16 giorni, 68%, 82 su 120, 41
  attivi, 142 di 1'200, 62%, soglia 12, −2 punti — ancora verde, e ora
  leggibile;
- `lint`, `typecheck` e `build:demo` a posto.

**Il residuo motivato, e non è chiudibile da qui:**

- **L'anello di focus è invisibile sui CTA pieni.** `--ring` è il blu di
  `primary` e i CTA sono su `bg-primary`: anello primary su fondo primary,
  **1.00:1**. Sono **12 pulsanti** sulle rotte pubbliche e nel portale
  dipendente. Il rimedio sta in `src/components/ui/button.tsx` — un
  `ring-offset` o un colore d'anello diverso — e quel file è **congelato**
  (§3), che per l'aria e per il focus non ha eccezioni. È il caso previsto
  dalla regola del blocco: si dichiara e ci si ferma. **Va deciso dai founder**,
  ed è la stessa famiglia di decisioni della guardia di `useFormField` che il
  blocco c) porta con sé.

  → **Chiuso dal blocco c)**, con la decisione del 12.08.2026: `ring-offset-2`
  alla base della `cva`. **La regola del blocco ha funzionato come doveva**:
  dichiarare e fermarsi non ha rimandato il rimedio, gli ha fatto trovare una
  decisione già presa quando è arrivato il suo turno — e il rimedio è costato
  una riga perché il blocco a) aveva già misurato di che difetto si trattava.
- **Le icone dentro `src/components/ui/`** non sono state dichiarate, per la
  stessa ragione.

#### b) Stati di errore e vuoto veri — chiuso

Undici commit. **Le 27 schermate distinguono tre casi dove ne confondevano
uno**, e il blocco ha due consegne di cui la seconda è la condizione della
prima: gli stati, e il modo di dimostrarli.

**Il difetto era più preciso di "manca la gestione errori".** Ogni schermata
scriveva `if (!dato) return null`, che mette insieme **in caricamento**
(`undefined`), **legittimamente assente** (`null`, che quattro metodi
restituiscono per contratto) e **errore**. La dashboard HR aveva un `if` a
undici condizioni di cui due erano slot nullable: un trimestre senza dati
usciva identico a una pagina in caricamento e a una rotta, cioè bianca. Il
precedente giusto esisteva già dentro casa, in `RapidCheckCard`, che
confrontava `=== undefined`.

**La regola sta scritta una volta**, in `loadState` (`lib/data/queries.ts`):
errore, poi attesa su `undefined` e solo lui, poi arrivato — e il vuoto lo
decide la schermata. **Il classificatore non conosce le forme**, ed è la sua
unica regola: il vuoto di una lista è `[]` e quello di uno slot è `null`, e chi
li conoscesse tutti sarebbe il secondo elenco che diverge dal primo. L'errore
vince sull'attesa, perché aspettare il resto lascerebbe a schermo una
sospensione che non finisce.

**Due componenti e non uno con una variante**, in `components/kora/`: un vuoto
è un caso previsto, un errore è un guasto, e solo il secondo ha un gesto da
offrire — `EmptyNotice` non può ricevere `onRetry`, e a impedirlo è il tipo.
**Nessuno dei due disegna il proprio contenitore**, ed è la scelta che ha reso
inutile il secondo componente: senza scatola non c'è raggio né densità da
cambiare, quindi i due registri del §6.4 restano una questione di **copy**,
scelto al call site fra `t.common.state.*` e `t.employee.state.*`.

**Il ramo è per pagina, e non c'è nessun boundary.** Un `ErrorBoundary` sarebbe
meno codice ma non vede il `null` — un'assenza legittima non è un'eccezione,
quindi metà del blocco gli passerebbe accanto — e sostituirebbe l'area intera,
nav compresa, fabbricando il vicolo cieco che il §10 vieta. Un boundary di
radice catturerebbe solo errori di render, che nessun percorso produce: sarebbe
il codice non verificabile che questo blocco esiste per non scrivere.

**Dove il ramo non è di pagina, c'è una ragione scritta**: la landing tiene il
listino su due sezioni su otto e non blocca le altre sei; il riquadro prodotto
dell'hero e il badge della nav professionista **collassano i tre casi in "non
disegnare"**, perché un riquadro d'errore sulla prima schermata che un
investitore vede direbbe che il prodotto è rotto, e un errore al posto della nav
toglierebbe la via d'uscita.

**Il bootstrap è il primo errore, e sta fuori dalle schermate.**
`prefetchDemo` attende sei metodi direttamente — le loro risposte sono le
chiavi di tutto il resto — quindi un loro guasto faceva rifiutare il prefetch,
`.then()` non girava e restava una **pagina bianca muta**, in tutti e tre i
modi. Ora monta React con lo stesso componente e la stessa stringa di `i18n`,
con resa minima e senza layout d'area (founder, §2.6): il gesto utile è
ricaricare, che per un provider in memoria è anche il reset, e il copy lo dice.

**Le quattro mutation dicono cosa non è successo**, non cosa è andato storto:
la prenotazione dichiara che lo slot è ancora libero, la nota e il form che il
testo è ancora nel campo. Il messaggio sta sotto il pulsante che l'ha causato e
**non porta un "Riprova"**: a ritentare è quel pulsante.

##### La dimostrazione: due manopole, e solo in sviluppo

`data/fault-injection.ts` è un `Proxy` sull'implementazione mock, montato da
`index.ts` **solo** quando `GUARDRAIL_MODE` vale `"throw"`. `?fail=metodo[:n]`
produce il guasto, `?empty=metodo` il vuoto legittimo — e senza la seconda
metà del blocco sarebbe indimostrabile, perché il dataset del §8 ha tutti e
quattro i trimestri pieni e nessuna lista vuota. `?empty` svuota **la risposta
e non la chiamata**, per forma del valore vero: lista → `[]`, resto → `null`.

**Il rischio dichiarato di `?empty`**: puntata su un metodo non nullable
fabbrica uno stato che i tipi vietano e l'app si rompe forte, spesso lontano
dal punto. È errore d'uso, non difetto — distinguere richiederebbe l'elenco dei
metodi nullable, cioè il secondo elenco che diverge.

**A riposo è trasparente, ed è parte del criterio di accettazione**: in
sviluppo il decoratore è montato sempre, così il ramo di passaggio si esercita
a ogni sessione invece che la prima volta che qualcuno usa la manopola.

**`retry: 1` è diventato `retry: 0`, ed è una decisione.** Era configurazione
ereditata mai documentata e **mai esercitata** — il mock non fallisce, quindi
non c'era niente da ritentare. Il retryer di react-query **pausa fra i
tentativi se la scheda non è in primo piano**, e una query in pausa è
`data === undefined`: un **quarto caso** indistinguibile dalla sospensione, che
la regola dei tre non ammette. Costava anche l'albero intero, perché una
`prefetchQuery` in pausa non si risolve e `Promise.all` restava appeso.
Misurato: con `retry: 1` una query rotta non arriva mai in errore, con
`retry: 0` ci arriva in un millisecondo. La nota per chi scriverà il backend è
in `CONTRATTO-DATI.md` §5.

**La soglia `:n` non è sparita, si è spostata.** Con la cache scaldata prima
del paint, **la prima chiamata se la prende il prefetch**, e una query in
errore viene rifatta al montaggio perché `retryOnMount` di react-query vale
`true`. Quindi `:1` fa fallire il solo prefetch e la schermata si rimette a
posto da sé, mentre **`:2` mostra l'errore e lascia riuscire il primo
"Riprova"**: con `:n` i montaggi coperti sono `n − 1`. `retryOnMount` resta al
default: la guarigione su navigazione è innescata da un gesto e non da un
timer, ed è comportamento buono in produzione.

**Il guardrail della cache fredda accusava le query in errore**, e il ramo non
era mai stato esercitato perché prima di questo blocco niente poteva fallire.
Esentava `status === "error"`, che non basta: quando un osservatore monta su
una query in errore react-query la rifà, e per la durata di quella lettura lo
stato torna `pending` con `error: null` — il secondo osservatore della stessa
chiave (nav e pagina leggono entrambe l'azienda) cade lì dentro. Misurato:
`status: pending`, `fetchStatus: fetching`, `errorUpdateCount: 1`. Ora legge
**`errorUpdateCount`**, che sopravvive alla finestra in cui `status` mente.

##### L'inventario delle 27 schermate

Per ognuna: il registro, e cosa rende nei tre casi. **Il registro si decide al
call site e niente lo forza** — una pagina del dipendente che pescasse
`t.common.state.*` compilerebbe senza avvisi — quindi è dichiarato qui perché
la review lo campioni invece di fidarsi.

| schermata | registro | attesa | vuoto | errore |
|---|---|---|---|---|
| `/` landing | strumento | `null` | — | `ErrorNotice` nella sola sezione piani |
| `/` hero preview | — | `null` | `null` | `null` (mockup: i tre collassano) |
| `/roi` | strumento | `null` | `EmptyNotice` `public.roi.empty` | `ErrorNotice` sotto la nav |
| `/pricing` | strumento | `null` | `EmptyNotice` `public.plans.empty` | `ErrorNotice` sotto la nav |
| `/demo` | strumento | — | — | `ErrorNotice` `public.demoRequest.error` sotto il pulsante |
| `/employee` home | consumer | `null` | frase esistente sugli appuntamenti | `ErrorNotice` di pagina |
| `/employee` contatori | consumer | `null` | — | `ErrorNotice` nella sola card |
| `/employee` check rapido | consumer | `null` | — | `ErrorNotice` `employee.rapidCheck.error` |
| `/employee/psicologi` | consumer | `null` | frase esistente sull'elenco | `ErrorNotice` di pagina |
| `/employee/psicologi` dialogo | consumer | `null` | frase esistente sugli slot | `ErrorNotice`, e `…dialog.error` sulla prenotazione |
| `/employee/medico` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/employee/checkup` | consumer | `null` | `EmptyNotice` `…checkup.networkEmpty` | `ErrorNotice` di pagina, e uno nel dialogo referto |
| `/employee/piano-ai` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/employee/profilo` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/hr` dashboard | strumento | `null` | `EmptyNotice` `hr.quarterEmpty`, **con intestazione e selettore** | `ErrorNotice` di pagina |
| `/hr/dipendenti` | strumento | `null` | `EmptyNotice` `hr.employees.empty`; sottotitolo tolto se manca lo snapshot | `ErrorNotice` di pagina |
| `/hr/report` | strumento | `null` | `EmptyNotice` `hr.quarterEmpty`, **senza il pulsante di download** | `ErrorNotice` di pagina |
| `/hr/fatturazione` | strumento | `null` | `EmptyNotice` `hr.billing.invoicesEmpty` | `ErrorNotice` di pagina |
| `/hr/privacy` | strumento | `null` | — | `ErrorNotice` di pagina |
| `/professional` calendario | strumento | `null` | frase esistente sulla settimana | `ErrorNotice` di pagina |
| `/professional/sessioni` | strumento | `null` | frasi esistenti sui tre pannelli | `ErrorNotice` di pagina, e `…note.error` sul salvataggio |
| `/professional/pazienti` | strumento | `null` | — | `ErrorNotice` di pagina |
| `/professional/pagamenti` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/professional/profilo` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/professional` badge nav | — | `null` | `null` | `null` (decorativo: i tre collassano) |
| `/admin` aziende | strumento | `null` | `EmptyNotice` su clienti e su richieste | `ErrorNotice` sui due blocchi |
| `/admin/utenti` | strumento | `null` | frase esistente sulla ricerca | `ErrorNotice` di pagina |
| `/admin/professionisti` | strumento | `null` | `EmptyNotice` `admin.professionals.empty` | `ErrorNotice` di pagina |
| `/admin/sessioni` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/admin/provider` | strumento | `null` | `EmptyNotice` `admin.checkupProviders.empty` | `ErrorNotice` di pagina |
| `/admin/analytics` | strumento | `null` | `EmptyNotice` `admin.analytics.empty` | `ErrorNotice` di pagina |
| 404 | strumento | — | — | — (non legge dal provider) |
| bootstrap | strumento | — | — | `ErrorNotice` `common.state.boot`, senza layout |

**Verificato a schermo, viewport 1280×900 e scheda in primo piano** (§11):

- **27 rotte percorse sulla build demo**, zero schermate vuote, **zero stati
  d'errore raggiungibili**, console pulita;
- **le manopole non esistono nella build demo**: `?fail=getCompany&empty=getRoiSnapshot`
  su `/hr` lascia CHF 14'200, 16 giorni e 68% al loro posto;
- **il decoratore è assente da entrambi i bundle**, su sette marcatori
  distinti; nella demo `[dataset]` c'è e in produzione no, che è la controprova
  che il grep sta leggendo la build giusta;
- **i numeri del pitch non si sono mossi**: CHF 14'200, 16 giorni, 68%, 82 su
  120, 142 di 1'200, 62%, soglia 12, −2 punti; i cinque di ancoraggio del §9 a
  N=100; CHF 652'968, 415 e 798 nel back-office; CHF 1'120 nei compensi;
- **la coreografia di `/admin` regge sulla build demo**: tabella vuota, uscita
  col logo, richiesta inviata, due Indietro, riga in tabella col telefono;
- **"Riprova" riesce davvero**: `?fail=getInvoices:2` su `/hr/fatturazione`
  mostra l'errore e un clic riporta CHF 6'600 e CHF 79'200;
- **il vuoto tiene la via d'uscita**: `?empty=getRoiSnapshot` su `/hr` lascia
  intestazione e selettore;
- **la prenotazione fallita non perde niente**: giorno e ora restano
  selezionati, il riepilogo resta, il pulsante resta premibile;
- **contrasti** del componente nuovo sul fondo vero: titolo **5.39:1**, corpo
  **4.90:1**, icona `aria-hidden`;
- `lint`, `typecheck`, `build` e `build:demo` a posto; i guardrail restano
  **90 + 6**.

##### Tre lezioni, e sono la stessa

**`visibilityState` ha una terza faccia.** M3 l'ha incontrata come animazioni
congelate, M5.a come misure sbagliate — `innerWidth` a zero — e qui come
**stati che non arrivano**: a scheda non visibile il retryer pausa, e la query
resta in un limbo che si traveste da caricamento. Le tre vanno lette insieme,
perché la causa è una e il sintomo cambia ogni volta.

**La quarta è di metodo, e ha fatto dichiarare due volte un difetto che non
c'era**: "Riprova" sembrava non funzionare perché il DOM veniva letto **nello
stesso tick del clic**, prima che React ri-renderizzasse. Con 800 ms di attesa
la pagina è piena. È la stessa famiglia — **misurare prima che lo stato
esista** — e insieme alla trappola dello spazio unificatore di M1 forma la
regola operativa: prima di concludere che qualcosa non c'è, verificare che lo
strumento potesse vederlo.

**I contrasti del §6.1 sono misurati su bianco puro, il fondo dell'app no.**
`--background` è `150 20% 98%`, quindi sul fondo vero i rapporti calano di
circa 0.2: `destructive-strong` dà **5.39** dove la tabella dichiara 5.62.
Restano tutti sopra soglia, e lo scarto è scritto qui una volta perché la
prossima verifica non lo legga come un errore di taratura.

**Aperto e dichiarato:**

- **Gli stati vuoti preesistenti non sono stati consolidati su `EmptyNotice`.**
  Sono testo attenuato e centrato come il componente, quindi a schermo la
  differenza è di padding e allineamento, non di resa; consolidarli sarebbe un
  diff su schermate che già funzionano. L'inventario qui sopra li dichiara
  riga per riga come "frase esistente", così chi vorrà unificarli sa dove
  sono. Il solo consolidato è quello delle richieste demo, perché è il vuoto su
  cui il pitch apre `/admin` e doveva somigliare agli altri.
- **`?empty` non copre le liste già vuote per costruzione**: svuota la risposta
  di un metodo, quindi un vuoto che nasce da un filtro di schermata — la
  ricerca utenti senza risultati, gli slot di una settimana piena — si produce
  a mano come prima.
- ~~**L'anello di focus sui CTA pieni resta il residuo di M5.a**~~, e il
  "Riprova" non lo toccava: è un `variant="outline"`, quindi il suo anello si
  vedeva già. → **chiuso dal blocco c)**, e il "Riprova" è servito da controllo
  nell'altro verso — è il pulsante chiaro su cui si è verificato che la banda
  di offset non tolga niente a chi il focus lo mostrava già.

#### c) Validazione dei form — chiuso

Sei commit, e **due dei sei non sono validazione**: sono le due decisioni sui
file congelati che il blocco portava con sé, prese dai founder il 12.08.2026 ed
eseguite prima di scrivere una riga di schema. Sono in fondo alla sezione,
perché la validazione è il mestiere del blocco e quelle sono il suo bagaglio.

**La superficie è più piccola della milestone che la nomina, e questo è il
primo esito.** Il §4 dice "validazione dei form", ma i punti di input sono
tre e solo uno è un form: `/demo`. Gli altri due sono il dialogo nota del
professionista e la chat del medico virtuale, e **nessuno dei due ha preso uno
schema**. Il blocco vale anche per quello che non ha fatto.

##### `/demo` — l'unico schema

Lo schema dice quello che dice il contratto (`CONTRATTO-DATI.md` §2): azienda,
referente ed email obbligatori, telefono, dipendenti e messaggio facoltativi.
Non è una traduzione libera del form: è `DemoRequestInput` letto riga per riga.

**Quello che non c'è è scritto accanto a quello che c'è**, perché la prossima
passata non lo aggiunga credendo di completare un lavoro: nessun formato sul
telefono — il tipo lo dà opzionale e nessun documento ne fissa la forma, quindi
un pattern svizzero sarebbe una cifra inventata (§2.4); nessun tetto sui
dipendenti, perché i 20–1000 sono il dominio del calcolatore e non di questo
form; nessuna lunghezza sul messaggio; e nessun controllo che l'email sia
"aziendale", che l'etichetta suggerisce e nessuna regola chiede.

**Un validatore solo.** `noValidate` sul form spegne quello del browser, e i
`required` e il `min={0}` sono usciti: due validatori sono due fonti che possono
divergere, e la prima a farlo sarebbe quella che non conosce le nostre stringhe.
I `type` restano — `email`, `tel`, `number` — perché scelgono la tastiera del
telefono, non cosa passa.

**Lo schema non trasforma, ed è un limite della versione installata.**
`zodResolver` **4.1.3** ha un generico solo e restituisce
`Resolver<z.infer<schema>>`: un `.transform()` renderebbe il tipo dei campi
diverso da quello del risultato, e il resolver smetterebbe di tipizzare. Le
uscite erano tre, e due sono state scartate con un motivo: zittirlo con un `as`
è il cast che nasconde un errore vero (M3 ne accettò dieci, e nessuno zittiva
niente), e alzare `@hookform/resolvers` alla 5 è una **decisione di dipendenza**
che passa dal §3. Quindi *"vuoto vale zero"* — la regola che questo form ha da
sempre — vive in `toEmployeeCount`, subito sotto lo schema. **Senza `Math.max`
né `Math.round` attorno**: lo schema ha già escluso segno e decimali, e
difendersene di nuovo sarebbe il ramo irraggiungibile che il §11 vieta. La riga
è annotata nel sorgente, ed è il punto da rileggere il giorno in cui la
dipendenza sale.

##### `form.tsx` non si usa, e la previsione del §3 si corregge

`CLAUDE.md` §3 teneva `form` fra i componenti conservati *"alla validazione con
`zod` e `react-hook-form` (M5)"*. **Non è andata così**, e la riga è stata
corretta con la sua data invece di restare smentita in silenzio.

Il motivo è una misura: `FormMessage` rende `text-destructive` e `FormLabel`
colora con lo stesso token l'etichetta in errore — **3.76:1**, sotto l'AA per il
testo (§6.1). Sul messaggio si sovrascrive dal call site, perché `cn` usa
`twMerge`; **sull'etichetta no**, perché il colore è condizionato all'errore e da
fuori si può solo spegnerlo sempre. Usarlo avrebbe riaperto il debito che il
blocco a) ha chiuso a zero, e correggerlo dentro `ui/` sarebbe stata una
**quarta eccezione** al congelamento, che nessuno ha concesso.

**È il caso in cui la regola del congelamento ha lavorato davvero**: due
eccezioni concesse e una rifiutata nello stesso blocco. Con un form solo,
`register` più un `<p>` costano meno di quanto costerebbe aggirare il
componente (§11), e `FieldError` esiste perché ha quattro chiamanti — senza, la
classe e il controllo sul vuoto starebbero scritti quattro volte.

##### Il dialogo nota — nessuno schema, una regola di contratto

Le tre textarea sono testo libero e `SessionNote` non pone vincoli su nessuna:
una textarea che ammette tutto non ha regole da raccontare, quindi zod qui
sarebbe una macchina più grande del caso.

**L'unica regola che esiste non riguarda il testo ma il fatto.**
`ProfessionalSession.hasNote` esiste perché le proiezioni sappiano che una nota
c'è (`CONTRATTO-DATI.md` §3): salvarne una vuota lo renderebbe vero su qualcosa
che non esiste, ed è il §5.5 applicato a un booleano invece che a un numero. Da
qui **"Salva nota" è spento finché i tre campi sono vuoti al trim**, e **senza
messaggio d'errore**: non c'è niente da segnalare finché non si è scritto
niente, e un pulsante spento è il modo più quieto di dirlo (founder,
12.08.2026).

##### La chat del medico — niente da fare, e si dichiara

`send` fa già `draft.trim()` ed esce sul vuoto (`Medico.tsx:74`). Dietro non c'è
un contratto: la conversazione è una simulazione dichiarata e non scrive sul
provider. **Il file non è stato toccato**, e sta qui perché "verificato che non
serviva" e "dimenticato" si distinguono solo se qualcuno lo scrive.

##### Le due decisioni sui file congelati

**La guardia di `useFormField`** (`form.tsx`): il controllo stava dopo la
chiamata che doveva proteggere e il default del context era `{}`, cioè truthy —
non scattava mai. Tre righe: guardia sopra l'uso, default che può essere falso,
**un `as` in meno**. *(I dieci `as` della passata di tipizzazione di M3 sono
quindi nove, e i due di `form` uno solo. La voce di M3 non è stata riscritta:
è il verbale di quella passata, e la correzione sta qui.)*

**Il confine, e non è aggirabile da qui**: la guardia copre il caso vero — un
`FormItem` dentro un `<Form>` ma fuori da un `<FormField>`. Fuori anche dal
`<Form>` non ci arriva, perché `useFormContext()` restituisce `null` e la
destrutturazione lancia prima. È comportamento di react-hook-form, e
restringerlo sarebbe stata una seconda modifica oltre la decisione presa.

**L'anello di focus** (`button.tsx`): `ring-offset-2` più
`ring-offset-background` alla base della `cva`, che è **una riga alla sorgente e
non dodici rattoppi ai call site**. L'anello si disegna ora come 2px di
`--background` più 1px di `--ring`.

| | misura |
|---|---|
| anello / banda di offset | **11.50:1** |
| banda / riempimento del CTA | **11.50:1** |
| anello / fondo dietro il pulsante | **11.50 – 11.95:1** |
| anello / riempimento *(il difetto)* | 1.00:1, e non confinano più |

**Nessun CTA pieno sta su una sezione tinta o scura**, censito su tutte le rotte
che ne hanno: è il caso che poteva non passare, e in questa demo non esiste. La
riga è scritta perché una schermata futura che ne metta uno sappia cosa
rimisurare. **La base è condivisa, quindi ogni variante guadagna lo stacco**:
sui pulsanti chiari la banda è del colore della pagina ed è invisibile, e si
vede l'anello contro la pagina a 11.95:1 — cioè il valore che il blocco a)
aveva già misurato.

##### Verificato a schermo, viewport 1280×900 e scheda in primo piano (§11)

- **invio vuoto bloccato**: tre messaggi, `aria-invalid` sui tre campi, e il
  fuoco sul primo — "Il nome dell'azienda è obbligatorio.";
- **email malformata bloccata**, e il suo messaggio che passa da "obbligatoria"
  a "non sembra valido" mentre si scrive; **12.5 bloccato** sui dipendenti;
- **il campo corretto pulisce il suo messaggio** e la sua `aria`, e gli altri
  restano — provato campo per campo, che è il caso che un controllo sul solo
  totale non vedrebbe;
- **da tastiera**: `Tab` percorre i sei campi e il pulsante, e arrivando su un
  campo in errore l'`aria-describedby` punta al messaggio visibile — provato
  su due campi consecutivi, ognuno col proprio;
- **la coreografia di `/admin` regge con il form nuovo**: tabella vuota a
  freddo, uscita col logo, richiesta compilata **da sola tastiera** e inviata,
  due Indietro, riga in tabella — `Ontano Logistica SA`, `+41 91 000 00 00`, il
  trattino di `common.none` sui dipendenti lasciati vuoti, 23.09.2026. **Una
  sola navigazione** per tutto il giro;
- **il dialogo nota**: "Salva nota" spento all'apertura, spento con tre spazi,
  acceso al primo carattere vero, e la nota che si salva senza ricaricare —
  "aggiungi nota" da 8 a 7, come in M2;
- **contrasto del messaggio d'errore sul fondo vero**: **5.60:1**, `14px`, peso
  normale;
- **27 rotte percorse**, zero schermate vuote, zero stati d'errore
  raggiungibili, `console.error` mai chiamato;
- **i numeri del pitch non si sono mossi**: CHF 14'200, 16 giorni, 68%, 41
  attivi, 142 di 1'200, 62%, soglia 12; i cinque di ancoraggio a N=100; CHF
  652'968, 415 e 798 nel back-office; CHF 1'120 nei compensi;
- `lint`, `typecheck`, `build` e `build:demo` a posto; i guardrail restano
  **90 + 6**.

##### Due cose imparate misurando, e sono due trappole di strumento

**`grep` ha mentito sul bundle, e la controprova l'ha smascherato.** Il
controllo di M5.b — il decoratore assente da entrambe le build — rifatto senza
`-F` dava *"`[dataset]` presente in produzione"* e *"`fault` presente in
entrambe"*. Nessuna delle due era vera: **`[dataset]` è una classe di
caratteri**, quindi matcha qualunque `d`, `a`, `t`, `s` o `e`, e **`fault` sta
dentro `default`**. Con `-F` e con marcatori presi dalle stringhe vere del file
— `[fault]`, `iniezione attiva`, `Esiste solo in sviluppo` — l'esito è quello
di M5.b: assenti da entrambi i bundle, `[dataset]` presente nella sola demo. È
la stessa famiglia dello spazio unificatore di M1 e del DOM letto troppo presto
di M5.b: **prima di concludere, verificare che lo strumento potesse vedere la
cosa giusta.**

**L'`Enter` dell'automazione non invia un form**, e non è un difetto della
pagina. Con un listener sul `keydown` l'evento arriva — `Enter@BUTTON`,
`Enter@INPUT` — ma nessun evento `submit` parte: l'invio implicito è un'azione
di default che il tasto sintetico non riproduce. Quindi **il percorso
"Enter sul pulsante" non è verificato a schermo**, ed è l'unica asserzione di
questo blocco che resta sulla parola dello standard invece che su una misura.
Tutto il resto del giro da tastiera — `Tab`, `shift+Tab`, digitazione, `aria`
sul campo in errore — è misurato.

**Aperto e dichiarato:**

- **Gli altri due punti di input non hanno uno schema**, ed è la scelta del
  blocco, non un residuo: il giorno in cui il dialogo nota o la chat avranno
  regole vere — un tetto di caratteri, un campo obbligatorio — è quello il
  momento di dargliene uno, non prima.
- **`@hookform/resolvers` resta alla 4**, e con lei il vincolo che tiene la
  conversione fuori dallo schema. Non è urgente e non è un difetto: è una
  dipendenza da alzare quando qualcuno la alza per altri motivi (§3).
- **`form.tsx` non ha consumatori**, come 32 degli altri componenti di `ui/`. È
  l'eccezione dichiarata del §3 e ora è la sua versione migliore: da questo
  blocco è **l'ultima copia buona con la guardia che funziona**.

#### d) Guardie di rotta per ruolo — chiuso

Otto commit, e il blocco è nato **in due stadi**: una proposta approvata dai
founder il 12.08.2026 e solo dopo l'esecuzione. È il primo blocco di M5 con
quella forma, e il motivo sta nel primo esito.

##### Il fatto che ha deciso il blocco, e si è visto solo provando a scriverlo

Provando i tre modelli contro i tre vincoli del `CLAUDE.md` §4 ne è uscita una
cosa sola: **sotto quei vincoli, in demo nessuna guardia può negare l'accesso a
niente.** `PublicNav` porta in tutti e tre i portali con un clic, `/admin` deve
aprirsi **come prima schermata a freddo** (`docs/PITCH.md`), e un link profondo
dopo un ricaricamento deve servire la pagina — è ciò che M1 ha riparato con la
rewrite di `vercel.json`. Tre porte che devono restare aperte sono tutte le
porte che ci sono.

Da lì il criterio non è stato "quanto blocca" ma **quanto rende reale e
verificabile la guardia che servirà in produzione, senza fingere di bloccare
oggi** — e la risposta era già in casa: è lo stesso problema del blocco b), che
per gli stati d'errore aveva costruito le manopole invece di accontentarsi di
codice non raggiungibile.

##### Il modello scelto: la porta concede, la manopola nega

**Il ruolo vive nel provider**, non in un context di React, e questa è la scelta
che il §5.7 governa: con un context, il giorno in cui il ruolo arriva dal server
il codice che lo legge andrebbe spostato. `getSession()` non prende parametri
**come `getCompany()` e `getEmployeeProfile()`**, che il contratto dichiara già
servite dalla sessione; `enterAs(role)` è la scrittura che in demo sostituisce
il login e in produzione sparisce.

**Il portale è una porta, non un muro**: entrando, la guardia concede il ruolo
che quel portale richiede — anche a freddo, anche su un link profondo — quindi i
tre momenti passano per costruzione e non per eccezione. Il ramo che nega resta
vero e si raggiunge con `?role=`, la terza manopola di sviluppo.

**Una schermata nuova non c'è**: lo stato di accesso negato è uno *stato*, resa
minima e senza layout d'area, della stessa famiglia di `EmptyNotice` e
`ErrorNotice`. Porta **due uscite** — il portale del ruolo che si ha davvero e
la landing — perché un accesso negato senza via d'uscita è il vicolo cieco che
il §10 vieta, e lo sarebbe anche essendo raggiungibile solo in sviluppo
(founder, 12.08.2026).

##### `react-router` 7, e il router toccato una volta sola

Il major è entrato **per primo, verificato da solo**, prima di una riga di
guardia. La superficie del router qui è cinque API — `Link`, `useLocation`,
`Outlet`, `useSearchParams` e i tre di `App.tsx` — tutte immutate in v7, quindi
il major è costato quasi un bump di versione. `npm audit` esce a zero e i due
avvisi sui future flag sono spariti senza configurare niente, perché nella 7
quei comportamenti sono il default.

**Le due righe di M1 erano imprecise e sono corrette dove stavano** (sezione
M1): le due advisory non erano la stessa, e `npm audit fix` non era un no-op per
il motivo scritto — il range vulnerabile arriva alla 7.17.0, quindi il rimedio
non era "la 7" ma una 7 che allora non esisteva. **Nessuna delle due ci
riguardava** comunque, e per questo l'argomento vero non era la sicurezza: era
non toccare il router due volte.

##### Il difetto che la verifica ha trovato, e la prima diagnosi era sbagliata

Alla prima passata sulla build demo **sedici rotte su ventisette erano negate** —
HR, professionista e admin per intero.

**La causa: React riusa la stessa istanza di `RequireRole` fra due portali.** Le
quattro rotte montano lo stesso componente nella stessa posizione dell'albero,
quindi passando da un portale all'altro non c'è rimontaggio: cambia `role` e lo
**stato della mutation sopravvive**. Con la porta chiamata senza argomenti,
quella già usata non era più `idle` e non concedeva mai il secondo ruolo.

**La prima diagnosi diceva "lampeggia", ed era falsa.** Sembrava una corsa fra
la mutation conclusa e la query invalidata, e a sostenerla c'era una misura
letta male: `/hr` a 1500 ms era intera — ma quello era un **caricamento a
freddo**, non un passaggio fra portali. Misurando il passaggio vero, la
negazione restava a 30 ms come a 2000 ms. È la quinta volta che questo file
annota lo stesso errore di metodo — **misurare una cosa diversa da quella che si
sta spiegando** — dopo lo spazio unificatore di M1, il DOM letto nello stesso
tick di M5.b, il `grep` senza `-F` di M5.c e le tre facce di `visibilityState`.

**Il rimedio è il ruolo come variabile della mutation**: `enter.variables` dice
per quale ruolo la porta ha già risposto, quindi cambiare portale rende quella
risposta *vecchia* invece che definitiva. Sta in un posto solo, ed è la ragione
per cui non serve un `key={role}` ai quattro call site. La decisione legge la
risposta della porta quando c'è e la cache altrimenti: leggere solo la cache
costerebbe un fotogramma di accesso negato a ogni concessione riuscita, e dietro
una `fetch` vera quel fotogramma durerebbe l'intera richiesta.

##### La manopola `?role=`, con la disciplina di b) per intero

Letta **una volta all'istanza** nel layer dati, `GUARDRAIL_MODE` come porta,
trasparente a riposo, nomi verificati e un valore sbagliato segnalato invece che
ignorato in silenzio. Il pin è controllato **dopo** guasto e vuoto, quindi
`?fail=getSession` vince: sono stati diversi e uno solo si vede.

**La semantica sta scritta nel file**: una sessione fissata **non viene
riconcessa**. `getSession` risponde con quel ruolo ed `enterAs` non lo cambia,
il che è insieme ciò che rende raggiungibile la negazione e ciò che impedisce
alla guardia di ciclare.

L'elenco dei ruoli è un `Record<UserRole, true>` e non un array di stringhe,
perché così **la duplicazione è verificata**: un tipo non si interroga a
runtime, e aggiungere un ruolo all'unione ora rompe la compilazione lì, che è il
momento giusto per accorgersene.

##### Verificato a schermo, viewport 1280×900

- **il router da solo, prima della guardia**: `npm audit` a zero, console senza
  i due avvisi, 27 rotte, i tre momenti, e ogni numero del pitch alla cifra;
- **27 rotte sulla build demo**, zero schermate vuote, **zero negate**,
  `console.error` mai chiamato;
- **otto passaggi fra portali di fila**, ripetizioni e sotto-rotte comprese,
  nessuno negato — è il caso che era rotto;
- **la coreografia di `/admin` su scheda nuova**: tabella vuota a freddo, uscita
  col logo, richiesta inviata, due Indietro, riga in tabella con telefono e
  `common.none` sui dipendenti vuoti. **Una sola navigazione**;
- **link profondo a freddo**: `/professional/pagamenti` apre intera, CHF 1'120 al
  suo posto;
- **la negazione**: `/hr?role=employee` e `/admin?role=hr` mostrano lo stato
  negato, restano negati, non ciclano, e "Vai alla tua area" porta al portale del
  ruolo davvero posseduto senza ricaricare;
- **la manopola non esiste nella build demo**: `/hr?role=employee` disegna la
  dashboard HR con CHF 14'200 al suo posto. Assente da entrambi i bundle su
  cinque marcatori letterali, `grep -F`;
- **i numeri del pitch fermi**: CHF 14'200, 16 giorni, 68%, 41 attivi, 142 di
  1'200, 62%, soglia 12; i cinque di ancoraggio a N=100; CHF 652'968, 415, 798,
  1'147; CHF 1'120;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **90 + 6**.

**Due trappole dello strumento, non del codice**, annotate perché sono costate
tempo: `history.back()` dentro uno script del browser **interrompe la
valutazione**, quindi la coreografia va spezzata in passi; e una scheda riusata
porta i residui di cronologia delle prove precedenti, che fanno atterrare "due
Indietro" nel posto sbagliato — la coreografia si prova su **scheda nuova**, che
è anche la condizione vera del pitch.

**Aperto e dichiarato:**

- **I tre portali non hanno nessuna uscita verso la landing.** Censito in questa
  passata: `/employee`, `/hr` e `/professional` non hanno **nessuna ancora** che
  esca dal portale; solo `/admin` ce l'ha, dalla passata dell'11.08.2026. Il
  giro del pitch funziona lo stesso, con Indietro fra un portale e l'altro — è
  come è stato verificato — ma è lo stesso difetto che per `/admin` fu
  riconosciuto come vicolo cieco (§10), e la sua correzione fu otto righe e
  passò dai founder. **Non è stato toccato**: è scope (§2.6) e non è ciò che
  questo blocco doveva fare. `docs/PITCH.md` oggi non dice che fra un portale e
  l'altro si torna con Indietro.
- **La guardia non nega mai in demo**, per costruzione. È l'esito voluto e non
  un residuo, ma va riletto il giorno in cui `/admin` avesse una vera ragione di
  essere protetto davanti a qualcuno.
- **`enterAs` è la sola mutation che in produzione può sparire** — il ruolo lo
  concederà l'autenticazione — ed è annotato in `CONTRATTO-DATI.md` §4 e §6.

#### e) Le altre tre lingue — chiuso

**Trentatré commit su quattro PR.** Il blocco più voluminoso di M5, spezzato in
tre tranche — **infrastruttura + DE**, poi **FR**, poi **EN** — di cui la prima
si è a sua volta divisa in due PR quando è stato chiaro che le 663 stringhe non
sono un commit ma il grosso del lavoro. **La demo parla quattro lingue**, il
selettore le mostra tutte e quattro, e ogni schermata è stata percorsa in
ognuna.

**Le sei decisioni che il blocco ha preso**, e nessuna era scritta prima:

1. **Il language switcher esiste** — il §2.7 lo vietava, il §4.e prevedeva che
   il blocco decidesse. È caduto per la sua stessa ragione: con un dizionario
   solo è un comando che non comanda, e una sigla spenta è un'affordance morta.
   Mostra **le sole lingue registrate**, quindi è passato da due sigle a
   quattro senza che nessuno lo toccasse.
2. **Il contratto delle chiavi non era il tipo che sembrava.** `Dictionary =
   typeof it` portava i **letterali** italiani — `readonly home: "Home"` — e
   nessuna traduzione avrebbe compilato. `Translated<T>` tiene le chiavi e
   libera il testo; è il difetto più grosso del blocco, ed era invisibile
   finché esisteva una lingua sola.
3. **Il separatore decimale segue il locale** (§11): punto in it-CH, de-CH ed
   en-CH, **virgola in fr-CH**. La regola precedente era vera e verificata su
   una lingua sola.
4. **L'apostrofo delle migliaia è una decisione di stile, non un fatto CLDR**
   (§2.7): ICU dà a fr-CH lo spazio stretto U+202F, e `format.ts` lo riporta
   all'apostrofo in tutte e quattro. La virgola è correttezza, il raggruppamento
   è registro.
5. **Il registro del §7 si rende con lo strumento che ogni lingua ha**: T-V in
   tedesco (`du`/`Sie`) e in francese (`tu`/`vous`), **lessico e contrazioni**
   in inglese, che il T-V non ce l'ha. Le tre stringhe che attraversano il
   confine sono nominali in tedesco, infinito e forma nominale in francese, e in
   inglese non pongono il problema.
6. **Il medico virtuale cambia registro dentro l'area del dipendente**, in tutte
   e tre le lingue: dà del `Sie`, del `vous`, e in inglese perde le contrazioni.
   È il §7 applicato alla lettera — un professionista parla come parlerebbe lui.

**Tre cose che il francese e l'inglese hanno trovato e che l'italiano non poteva
mostrare**: l'ordinale del trimestre, che in quelle due lingue non ha un
suffisso solo; il separatore delle migliaia, che CLDR non uniforma; e i nomi
dei reparti, che vengono dal dataset e non si traducono — la riga tedesca che li
traduceva è stata corretta dopo, quando il francese l'ha resa visibile.

**La revisione madrelingua resta da fare per tutte e tre le lingue**, ed è la
sola cosa che questo blocco lascia aperta di proposito: i tre file sono
**verificabili e presentabili, non ratificati**. Le scelte da portare a quella
revisione sono nominate in testa a ogni dizionario — quattro in `de.ts`, cinque
in `fr.ts`, cinque in `en.ts` — perché una revisione senza domande diventa una
lettura.

##### 1a — l'infrastruttura (quattro commit)

**L'ostacolo non era `t`, erano i dieci file che lo leggevano a livello di
modulo**: cinque array di nav, lo schema zod di M5.c, le risposte del medico e
tre mappe — 43 stringhe. Nessuna meccanica di switch le raggiunge, perché
nessuna rivaluta lo scope di modulo. Sono state spostate dentro i componenti in
un commit suo, prima che il binding esistesse.

**La meccanica scelta è il binding vivo** (`export let t`) con un solo
sottoscrittore alla radice. `LocaleGate` **crea** `<AppRoutes />` invece di
riceverlo come `children`: con `children` il sottoalbero sarebbe lo stesso
oggetto elemento a ogni render, React lo salterebbe, e la lingua non cambierebbe
da nessuna parte. Nessun `key`, quindi **nessun rimontaggio** — la chat del
medico, la conferma della richiesta demo e il trimestre selezionato
sopravvivono.

**Il vincolo su cui poggia è diventato eseguibile**: nessun componente può
essere memoizzato, o il re-render non lo raggiunge. È una regola di lint con due
selettori, provata al contrario, e quando è stata scritta i componenti
memoizzati erano **zero** — non vieta niente che esista, esiste per chi
introdurrà il primo. Il censimento degli `useMemo` che leggono `t` ha dato lo
stesso esito: **nessuno**, in tutto `src/`.

**Il locale vive in `lib/i18n/` e non nel provider**, a differenza del ruolo di
M5.d: le guardie leggono il ruolo come dato a ogni rotta, la lingua non la legge
nessuno come dato, e il giorno del profilo utente è una riga di seed al boot.

**`format.ts` ha il locale vero**, e `formatList` ha sostituito
`t.common.listSeparator`. Quella chiave era **sbagliata anche in italiano**: un
separatore non può produrre una congiunzione, e le due schermate rendevano
"Italiano, Deutsch" dove si dice "Italiano **e** Deutsch".

##### 1b — il dizionario tedesco (dieci commit)

**663 chiavi, cinque namespace, un commit per namespace** perché la review
campioni per registro. Il file era nato parziale e **senza `: Dictionary`**:
l'annotazione è arrivata con il commit che l'ha completato, quando la promessa
era vera — su un file parziale avrebbe dichiarato il falso e rotto il typecheck
sull'albero.

**Il contratto delle chiavi non avrebbe compilato, ed è il difetto più grosso
del blocco.** La tranche 1a definiva `Dictionary = typeof it`, ma `it.ts`
finisce con `as const`: `typeof it` porta i **tipi letterali** —
`readonly home: "Home"` — non la forma. `"Start"` non è assegnabile a `"Home"`,
quindi il primo `de.ts` annotato sarebbe fallito su ogni singola stringa. **La
garanzia dichiarata dalla 1a era invecchiata prima di nascere**, e nessuno
poteva accorgersene finché esisteva una lingua sola. `Translated<T>` tiene le
chiavi e libera il testo; `it.ts` non si tocca.

**Il registro segue il §7 e in tedesco diventa la distinzione T-V**: `du` in
`employee.*`, `Sie` ovunque. **Il medico virtuale dà del Sie dentro l'area del
du**, perché un professionista parla come parlerebbe lui — e le sue parole
chiave sono tedesche, perché il confronto è sul testo che scrive chi legge.

**Le tre stringhe che attraversano il confine sono nominali** (founder,
13.08.2026): `Erneut versuchen`, `Zum eigenen Bereich`, `Zur Startseite`.
L'italiano tiene l'imperativo, che sui pulsanti è la convenzione del software
italiano ed è neutro per prassi.

**Il guardrail dei segnaposto** confronta gli **insiemi** e non le sequenze — in
tedesco i segnaposto si spostano, ed è il motivo per cui le frasi sono intere.
Gira dentro un confronto su `GUARDRAIL_MODE`, quindi in produzione non c'è né il
controllo né il costo di percorrere 663 chiavi.

**Lo switcher mostra le sole lingue registrate.** `FR` ed `EN` non compaiono
finché i loro dizionari non esistono: una sigla spenta che non fa niente è
un'affordance morta, e davanti a un investitore invita la domanda "perché è
grigia?" dentro trenta minuti contati. Compariranno da sé — il componente non
cambia.

##### Il protocollo di verifica, punto per punto

| | esito |
|---|---|
| 1 · Eszett | **zero occorrenze**, e il carattere non compare nemmeno nei commenti: nominarlo renderebbe il controllo una lettura invece di un conteggio |
| 3 · guardrail al contrario | `{used}` → `{genutzt}` fa uscire `employee.home.sessions: l'italiano usa [total, used], la traduzione [genutzt, total]` |
| 4 · chiavi al contrario | tolta `hr.kpiSavings`: *"Property 'kpiSavings' is missing in type … but required in type"* |
| 5 · DE su 27 rotte | zero troncamenti, zero overflow **causati dal tedesco** |
| 6 · switch a metà demo | prenotazione viva, sette numeri fermi, `<html lang>` a `de` |

**Il punto 5 ha trovato un overflow, e non è del tedesco.** La landing sfonda di
24px a 1280 — `scrollWidth` 1304 — ed è **identico in italiano**: è il sigillo
"Privacy-first" posizionato in negativo sull'hero. Preesistente, dichiarato, non
corretto qui: una tranche di traduzione non porta una correzione di layout.

→ **Chiuso dalla passata del 14.08.2026** (sezione refinement), che ha anche
corretto la diagnosi: il sigillo da solo non sfonda, a sfondare è l'ingresso del
mockup che se lo porta dietro — quindi il difetto **si vede solo mentre
l'animazione corre**, e resta stabile su una scheda in secondo piano, dove
`requestAnimationFrame` è sospeso. Il 1304 di questo censimento è coerente: è la
stessa misura presa dove la barra di scorrimento non toglie i suoi 15px.

**Il punto 6, per esteso**: prenotata la Dr.ssa Meier venerdì 25.09 alle 10:00
in italiano, poi `IT → DE`. La prenotazione è ancora nella home — `Freitag
25.09.2026, um 10:00` — il contatore dice `3 von 10 Sitzungen genutzt · 4
geplant`, e sulla dashboard HR CHF 14'200, 16, 68%, 41, 142, 1'200 e 62% non si
sono mossi.

**I guardrail passano da 96 a 97**, ed è la prima volta che il numero si muove:
`91 + 6`. Un guardrail nuovo è un call site nuovo, e il criterio del §5.6 dà 97
applicando le sue stesse regole — è una misura che cambia, non il criterio che
sbaglia.

**La quarta trappola di misura**, e vale più del numero. Il file si chiamava
`i18n/guardrails.ts`, e il criterio esclude `guardrails.ts` **per nome**: il
call site nuovo spariva dal conto, che continuava a dire 90 + 6. Rinominato
`placeholders.ts`. Dopo lo spazio unificatore, il `grep` senza `-F` e il DOM
letto troppo presto, è la quarta volta che una misura risponde a una domanda
diversa da quella posta.

##### Cosa resta a verbale, e non è un difetto

- **La revisione madrelingua non è stata fatta.** Il file rende il tedesco
  verificabile e presentabile, **non ratificato**: prima di un pitch in tedesco
  va riletto da chi la lingua ce l'ha. Sta scritto anche nell'intestazione di
  `de.ts`, che è dove lo legge chi ci mette mano.
- **Due errori miei sono stati corretti guardando lo schermo**, e nessuno dei
  tre controlli automatici poteva vederli: `die Dashboard` per `das Dashboard`,
  e `Guten Morgen` per `Guten Tag` — "Buongiorno" copre tutta la giornata, il
  tedesco no, e il saluto è statico. È la ragione per cui il protocollo chiede
  le 27 rotte a schermo e non solo i tre controlli.
- **I titoli professionali non si traducono**: `Dr.ssa` è un campo del dataset
  (`people.ts`), non una stringa del dizionario, quindi in tedesco resta
  italiano. Correggerlo è una modifica al contratto dati — un titolo che segue
  il locale — quindi è scope.
- **Le scelte da portare alla revisione nativa sono nominate in testa a
  `de.ts`**, non lasciate al diff (founder, 14.08.2026). Sono quattro, e non
  sono errori: sono punti su cui **non siamo il giudice giusto** — `Sitzungen
  gesamt` per "sedute di carriera", `In Vertragsprüfung` per "in
  convenzionamento", `Guten Tag` contro `Hallo` sul saluto caldo, e le forme
  femminili del portale professionista. La promessa generica di rilettura c'era
  già; l'elenco la rende eseguibile, perché una revisione senza domande diventa
  una lettura.

##### 2 — il dizionario francese (otto commit, 14.08.2026)

**663 chiavi, cinque namespace, un commit per namespace**, con la stessa
sequenza della tranche tedesca: `: Dictionary` arriva con il commit che
completa il file, e la registrazione in `DICTIONARIES` è un commit a sé — è
quello che fa comparire `FR` nello switcher, senza toccare il componente.

**L'infrastruttura ha retto senza una riga di modifica**, ed è la prova che la
1a valeva: `Locale` conteneva già `fr-CH`, il guardrail dei segnaposto gira sul
dizionario nuovo perché scorre `DICTIONARIES`, e `LocaleSwitcher` mostra `FR`
perché legge le lingue registrate. **`EN` continua a non comparire.**

**Il francese rompe due schemi che l'italiano e il tedesco condividevano**, e
sono i due esiti che valgono oltre la traduzione.

**Il primo: l'ordinale del trimestre.** L'italiano fa `3° trimestre` e il
tedesco `3. Quartal` — stesso suffisso per tutti e quattro i valori. Il francese
dice `1er` ma `3e`, e una stringa sola non li rende entrambi. **Il selettore
mostra anche il primo trimestre 2026**, quindi `1e trimestre` sarebbe finito a
schermo: la resa è `Trimestre {quarter} {year}`, corretta per tutti e quattro, e
la sigla dell'asse diventa `T{quarter}`. È il §2.7 in un caso che le prime due
lingue non potevano mostrare.

**Il secondo: la virgola decimale**, che era già una decisione dei founder presa
con l'approvazione della proposta di M5.e. `CLAUDE.md` §11 diceva *"il
separatore decimale è il punto"* con la motivazione della convenzione svizzera,
ed era **verificato su una lingua sola**: con il solo italiano a schermo,
"svizzero" e "it-CH" non si distinguevano. Ora la regola è di locale — punto in
it-CH, de-CH ed en, virgola in fr-CH — e a schermo `/roi` dice **2,35:1**. Il
2.35:1 del §9 resta l'ancoraggio del Business Plan: cambia la resa, non la
cifra.

**Il registro segue il §7 e in francese diventa la distinzione tu/vous**: `tu`
in `employee.*`, `vous` ovunque; il medico virtuale dà del vous dentro l'area
del tu, come in tedesco. **Le tre stringhe che attraversano il confine** —
`common.state.retry` e le due uscite di `RequireRole` — il francese le
neutralizza con **l'infinito e la forma nominale**, che sui pulsanti sono la sua
convenzione: `Réessayer`, `Retour à l'accueil`. Dove il possessivo era
inevitabile usa la prima persona, `Accéder à mon espace`, che non sceglie fra
tu e vous.

**Lo spazio unificatore davanti a `:` e `?`** è la regola tipografica francese, ed
è dichiarata in testa a `fr.ts` per la stessa ragione per cui il tedesco dichiara
l'Eszett: è **invisibile**, e un `grep` scritto con lo spazio da tastiera non
trova la stringa. È la trappola di `formatCHF` di M1, in un'altra lingua.

###### Il protocollo di verifica, punto per punto

| | esito |
|---|---|
| typecheck al contrario | tolta `hr.kpiSavings`: *"Property 'kpiSavings' is missing in type … but required in type"* |
| guardrail dei segnaposto al contrario | `{used}` → `{utilisees}` fa uscire `[i18n] fr-CH non rispetta i segnaposto dell'italiano: employee.home.sessions: l'italiano usa [total, used], la traduzione [total, utilisees]` |
| FR su 27 rotte a 1280 | tutte rese, **zero vuote, zero overflow orizzontale**, intestazioni francesi |
| valuta posposta | dashboard `14 200 CHF`, simulatore `150 collaborateurs × 55 CHF × 12 mois`, compensi `1 120 CHF` e `14 séances × 80 CHF` |
| PDF in francese | **una pagina**, generata chiamando la funzione vera: 546.8 pt disegnati su 785.89 disponibili, **239 pt di margine**, e **zero elementi troncati** dentro il nodo di stampa |
| switch IT→FR a metà demo | prenotazione viva, nove numeri fermi, `<html lang>` a `fr` |
| switcher | `IT DE FR`, e **nessun EN** |

**Il PDF è il punto che il francese poteva rompere**, perché la vista di stampa
è a larghezza fissa e la valuta posposta allarga le celle. Non le allarga
abbastanza: il documento resta una pagina con un terzo di foglio libero, e
nessun elemento interno ha `scrollWidth` maggiore del proprio `clientWidth`. La
misura è stata presa chiamando `downloadReportPdf` per davvero — restituisce
`1` — e guardando l'immagine catturata, non solo le proporzioni.

**Il punto 6, per esteso**: prenotata la Dr.ssa Meier venerdì 25.09 alle 10:00
in italiano, poi `IT → FR`. La prenotazione è ancora nella home — `vendredi
25.09.2026, à 10:00` — il contatore dice `3 séances utilisées sur 10 · 4
prévues`, e sulla dashboard HR CHF 14'200, 16, 68%, 82 su 120, 41, 142 di
1'200, 62%, soglia 12 e −2 punti non si sono mossi.

**I nomi dei reparti restano italiani**, perché vengono dal dataset: la tabella
per reparto dice `Vendite`, `Finanza`, `Direzione` dentro una schermata
francese, ed è voluto — è la stessa regola dei titoli professionali. Per questo
la raccomandazione del report dice **"département Vendite"**: nomina il reparto
come lo nomina il banner dell'alert due schermate più in là. **In tedesco non era
così**: `de.ts` traduceva quella riga in `Abteilung Verkauf` mentre il banner
mostra `Vendite`, quindi lo stesso reparto compariva con due nomi.

~~Una parola, non toccata qui perché è la tranche sbagliata.~~ → **sanata lo
stesso giorno e dentro questa stessa PR**, dal commit `9716004`, che porta la
raccomandazione tedesca a dire `Vendite` con il commento che spiega la regola.
La riga è rimasta a dichiararla aperta per le ore fra la stesura della sintesi e
il commit — ed è **l'esempio più netto del difetto che la coda documentale del
15.08.2026 ha chiuso**: una prosa che sopravvive al codice che descriveva, e che
a distanza di ore ha fatto segnalare come da fare qualcosa di già fatto.

###### Il difetto trovato, e la decisione che ha portato

**Il separatore delle migliaia in fr-CH non è l'apostrofo.** ICU dà a `fr-CH`
lo **spazio unificatore stretto** (U+202F): prima della decisione qui sotto il
francese scriveva `14 200 CHF`, `1 289 500 CHF`, `142 sur 1 200`. `CLAUDE.md`
§2.7 dichiarava invece *"l'apostrofo in tutte le varianti svizzere secondo
CLDR"* — vero per it-CH e de-CH, **falso per fr-CH**, e verificato misurando
`Intl` sulle tre lingue nella stessa pagina.

È **la stessa famiglia dell'errore sul decimale**, e ha la stessa origine: una
regola scritta guardando una lingua sola e attribuita alla Svizzera intera.

**I founder hanno deciso di forzare l'apostrofo** (14.08.2026), e la ragione
separa i due casi invece di trattarli allo stesso modo: **la virgola di `2,35`
è correttezza** — per chi legge in francese è l'unica forma giusta, e resta —
mentre **il raggruppamento è registro**, e `14'200` è la convenzione finanziaria
svizzera in tutte le lingue nazionali. Due ragioni in più, che valgono per
questa demo: i numeri di ancoraggio del pitch **tengono una sola forma visiva**
cambiando lingua, e **non si introduce U+202F**, che sarebbe il quinto carattere
invisibile di questo codice — dopo lo spazio unificatore di `formatCHF`, il meno
tipografico, l'apostrofo stesso e lo spazio francese davanti ai due punti — e
**l'unico scelto da noi**.

Sta in `format.ts`, in `groupWithApostrophes`, e passa da `formatToParts` invece
che da una sostituzione sul testo: si cambia il pezzo che `Intl` dichiara
`group`, quindi lo spazio unificatore fra cifre e valuta resta dov'è.
**Verificato a schermo**: in francese la dashboard dice `14'200 CHF` e `142 sur
1'200`, `/roi` dice `1'289'500 CHF` e `De 20 à 1'000 collaborateurs`, e il giro
`FR → IT → DE → FR` sullo stesso numero dà `1'289'500` in tutte e tre con il
rapporto che resta `2,35:1` in francese e `2.35:1` nelle altre due.

**Il §2.7 è stato corretto tenendo la storia**: l'apostrofo non è più un fatto
attribuito a CLDR ma una decisione di stile con la sua data.

###### Cosa resta a verbale

- **La revisione madrelingua non è stata fatta**, come per il tedesco: il file
  rende il francese verificabile e presentabile, **non ratificato**.
- **Le scelte da portarle sono cinque, nominate in testa a `fr.ts`**: il
  maschile generico su pazienti e professionisti — **al contrario del tedesco**,
  che ha scelto il femminile, e la divergenza fra i due file è essa stessa una
  domanda per i revisori; `collaborateurs` invece di `employés` per
  "dipendenti", che è la parola più ripetuta del dizionario; il trimestre senza
  ordinale; `Total des séances` per "sedute di carriera", cioè lo stesso punto
  che il tedesco ha portato con `Sitzungen gesamt`; e lo spazio fine U+202F
  davanti a `?`, dove la regola stretta e quella corrente divergono.
- **`tête` è la parola chiave del medico virtuale e porta l'accento**, quindi
  chi scrive "tete" non aggancia la risposta. È lo stesso limite di `rücken` in
  tedesco: la parola giusta è quella, e la simulazione non ha un correttore.
- **Nessuna cifra scritta in lettere**, quindi la questione *septante/huitante*
  — ciò che separa il francese svizzero da quello di Francia — non si pone: se
  un giorno si porrà, è una domanda per la revisione e non una scelta da
  prendere in un diff.

##### 3 — il dizionario inglese (sette commit, 14.08.2026)

L'ultima tranche, e quella che ha chiuso il blocco. Stessa sequenza delle altre
due: un namespace per commit, `: Dictionary` con il commit che completa il file,
registrazione a parte.

**`en-CH` è un locale di formato svizzero, e la scelta è tutto.** Misurato prima
di scrivere una riga: `en-CH` rende `CHF 14'200`, `24.09.2026`, `17:30` e
`2.35`, mentre `en-GB` darebbe `CHF 14,200` e `24/09/2026`. Le date restano
puntate, la valuta sta prima del numero come in italiano e tedesco, il decimale
è il punto. **L'inglese è britannico** — `organisation`, `centre`, `speciality`,
`cancelled`, `fibre`, `lift` — perché è la variante che si scrive in Svizzera.

**Il registro non passa dai pronomi, perché l'inglese non ha il T-V**, ed è
l'esito che vale oltre questa lingua: la distinzione del §7 si è fatta con il
**lessico e la forma della frase**. `employee.*` usa la seconda persona e le
**contrazioni** — *"You've used 3 of your 10 sessions"* — e le aree strumento
usano forme nominali senza contrazioni — *"3 of 10 sessions used"*. Il medico
virtuale, che in tedesco e in francese passa a `Sie` e `vous`, qui **perde le
contrazioni**: *"I am sorry about the pain"*, non *"I'm sorry"*.

**Ne discende che le tre stringhe di confine qui non sono un problema**:
`Try again`, `Go to your area`, `Back to home` sono imperativi piani, e
l'imperativo inglese non prende posizione. Il vincolo che ha costretto tedesco e
francese alla forma nominale **non esiste in questa lingua**, e dichiararlo vale
quanto risolverlo.

**Il trimestre non porta l'ordinale, per la seconda volta e con un'altra
grammatica**: l'inglese dice `1st`, `2nd`, `3rd`, `4th`, quindi un suffisso
fisso ne sbaglierebbe tre su quattro. `Quarter {quarter} {year}`, come in
francese, e `Q{quarter}` sull'asse — dove in inglese la sigla è quella naturale.

**Con la quarta lingua `DICTIONARIES` ha smesso di essere `Partial`.** Il
commento prometteva a parole che «il tipo impone che ci siano tutte» mentre il
tipo era parziale, perché una lingua mancava davvero; ora il record è pieno e la
promessa è verificata — aggiungere un locale all'unione senza il suo dizionario
non compila, e si rompe lì. Ne è discesa la sparizione della guardia
`if (!dictionary) return` in `setLocale`, che era diventata il ramo
irraggiungibile che il §11 vieta.

###### Il protocollo di verifica, punto per punto

| | esito |
|---|---|
| typecheck al contrario | tolta `hr.kpiSavings`: *"Property 'kpiSavings' is missing in type … but required in type"* |
| guardrail dei segnaposto al contrario | `{used}` → `{count}` fa uscire `[i18n] en-CH … l'italiano usa [total, used], la traduzione [count, total]` |
| EN su 27 rotte a 1280 | tutte rese, **zero vuote, zero overflow orizzontale** |
| switch IT→EN a metà demo | prenotazione viva — `Friday 25.09.2026 at 10:00` — contatore `You've used 3 of your 10 sessions · 4 scheduled`, dieci numeri fermi |
| `<html lang>` | `en` |
| switcher | **`IT DE FR EN`**, tutte e quattro |
| PDF di `/hr/report` in EN | **una pagina**: 546.8 pt su 785.89 disponibili, zero elementi troncati, `downloadReportPdf` restituisce `1` |
| lint, typecheck | a zero |
| guardrail | **97 = 91 + 6**, invariati |

**I numeri del pitch in inglese**: CHF 14'200, 16 absence days avoided, 68%, 82
enrolled of 120, 41 active, 142 of 1'200 annual sessions, 62%, soglia 12, −2
points, `Quarter 3 2026 · in progress`. E l'alert dice **"Early alert — Vendite
department"**, cioè il nome del reparto come lo scrive il dataset.

###### Cosa resta a verbale, per l'inglese

- **Le cinque scelte in testa a `en.ts`**: `Hello {name}` per "Buongiorno" —
  stesso inciampo del tedesco, perché "Good morning" mente sull'ora; **LPD →
  FADP**, che è il nome inglese della stessa legge e compare in sei stringhe;
  `company` nel copy commerciale contro `organisation` nelle promesse di
  privacy, dove l'italiano ha una parola sola; il trimestre senza ordinale; e le
  scelte di casa dell'inglese britannico, `speciality` contro `specialty`.
- **Le parole chiave del medico sono corte e comuni** — `back`, `head` — quindi
  agganciano anche dove non dovrebbero: *"come back"*, *"ahead"*. È un limite
  del confronto per sottostringa, non del dizionario, e in inglese morde più
  che nelle altre due lingue.

### Refinement fra le milestone

**Diciassette passate mergiate fra la chiusura di M3 e oggi**: quattro
nell'intervallo M3 → M4 (PR #15–#18), sette dopo M4 (PR #20–#24, #26 e #28),
**#34** — le uscite dai tre portali, che arriva dopo i primi quattro blocchi di
M5 — **#39**, l'overflow della landing del 14.08.2026, fra la tranche tedesca e
quella francese di M5.e, e le quattro della **revisione del 15.08.2026**: #43 e
#44 sulla coerenza del dominio e sugli stati limite, #45 sul perimetro del
contratto, e **questa passata**, la coda documentale che chiude la serie. Non
aggiungono
schermate e non spostano un numero a schermo — sono igiene del layer dati, del
seam e del dizionario, più le sette che hanno una sottosezione loro qui sotto:
le due che **eseguono** una decisione della riunione del 10.08.2026,
l'allineamento documentale pre-M5, i due fix pre-M5, l'uscita da `/admin`, le
uscite dai portali e l'overflow della landing. La sintesi sta qui perché **il
dettaglio è in git e il quadro no**: chi riprende deve sapere che queste cose
esistono prima di riscoprirle.

**La PR docs-only del 14.08.2026 sulla costituzione non è la quattordicesima**:
allinea `CLAUDE.md` a ciò che la tranche 1b ha cambiato — conteggio dei
guardrail, language switcher, default di `format.ts` — quindi è **contabilità di
M5.e**, e la milestone questa sezione la esclude per criterio.

**Non è un intervallo, e i buchi hanno un motivo**: #25 e #27 sono fuori per le
due eccezioni qui sotto, e **#29–#33 sono M5**, cioè la milestone, che questa
sezione esclude per criterio.

**#34 è la prova del criterio, non un'eccezione**: tocca `docs/PITCH.md`, ma
**non solo lui** — cambia tre nav — quindi la seconda esclusione qui sotto non
la copre, ed è scope fuori milestone. Si conta.

**Il criterio, perché il conto sia rifacibile.** Si contano le PR mergiate dopo
quella che chiude M3 (#14), **esclusa la milestone**: M4 è #19 e ha la sua
sezione. Le **docs-only si contano**, e non è una scelta nuova — #15 è
docs-only ed era già dentro i "quattro" della frase originale. **Oggi è l'unica
fra quelle contate**: #25 è docs-only ma esce per l'eccezione qui sotto, e #21
sembra docs-only dal nome del branch ma tocca `src/lib/data/mock/people.ts`.

**L'unica eccezione, e chiude una ricorsione.** Una PR il cui **solo contenuto
è la sintesi retrospettiva di una passata già mergiata** appartiene a quella
passata e **non si conta a sé**. Non contraddice la riga qui sopra: a
distinguere non è il tipo di file toccato ma se la PR ha un oggetto suo — #15
è docs-only e ne ha uno, mentre una sintesi è il verbale di un'altra passata,
non una passata. Senza questa riga il conto si insegue da solo: ogni sintesi
scritta dopo il merge diventerebbe la passata successiva, che a sua volta
chiederebbe la propria sintesi.

**Il caso vero è #25**, che tocca solo questo file e scrive la sintesi di #24:
è l'unica esclusa per questa regola, ed è la ragione per cui il conto salta da
#24 a #26. Da lì la sintesi si scrive come **ultimo commit della passata
stessa** — è quello che ha fatto #26 — così il conto d'apertura è già giusto
al merge e non c'è una PR in più da contare.

**La seconda esclusione: le PR che toccano solo `docs/PITCH.md`.** Non sono
passate di refinement, e non è una deroga a "le docs-only si contano": lo
script del pitch **cambierà a ogni prova generale**, perché è il verbale di
come si presenta e non di com'è fatto il prodotto. Contarlo qui riempirebbe di
righe una sezione che ha un altro mestiere — raccontare cosa è cambiato nel
codice e nel layer dati fra due milestone — e il conto smetterebbe di dire
qualcosa.

**Il caso che l'ha resa necessaria è #27**, le quattro note operative allo
script: tocca solo `docs/PITCH.md`, e letta col criterio di allora sarebbe
stata l'undicesima passata. È stata mergiata senza commit di chiusura proprio
perché questa riga arriva qui, nella prima passata che conta davvero — se
fosse arrivata in una PR sua, quella PR sarebbe stata docs-only con un oggetto
proprio, quindi avrebbe contato, quindi avrebbe chiesto la propria sintesi.
**È l'unico posto in cui aggiungerla senza che la contabilità conti sé
stessa.**

> *La frase diceva **cinque**, e si fermava a #20. Le due passate del
> 10.08.2026 — la pre-pitch e quella di palette — erano documentate qui sotto
> con una sottosezione ciascuna ma non entravano nel conto d'apertura, e la
> #21 non era contata affatto: chi riprendeva ne contava cinque e ne trovava
> otto. Corretto l'11.08.2026 dalla passata di allineamento, che con il merge
> è poi diventata lei stessa la nona.*

**Il seam era dichiarato e non tutto acceso.** I due preset di ESLint —
`eslint:recommended` e `react/recommended` — stavano nello stesso oggetto di
configurazione della chiave `rules:` scritta a mano, che arrivando dopo li
sovrascriveva **per intero**: nessuno dei due era attivo, e il lint usciva verde
perché non stava guardando. Ora ognuno sta nel proprio elemento dell'array, con
`src/components/ui/` fuori da entrambi — un avviso su un file congelato è
pressione a modificarlo, e la regola che serve lì è quella del blocco
typescript-eslint. Nella stessa passata il divieto di importare `mock/` ha perso
il buco della cartella nuda, e il divieto di leggere l'orologio vero è stato
esteso **al layer dati stesso**: `new Date()` e `Date.now()` restano leciti solo
dove `DEMO_TODAY` nasce.

**Quattro guardrail nuovi**, tutti su invarianti che a schermo non si vedono: i
sei reparti sommano all'organico dell'azienda; i quattro totali di servizio sono
fissati con il vincolo che tiene la ciambella (lo psicologo resta la fetta più
grande); ogni tariffa cade dentro la banda CHF 70–80 del §9; e — dopo M4 — gli
iscritti non superano mai i dipendenti coperti.

**Il predicato dei mesi di piattaforma è diventato uno solo** (PR #20). Ricavo,
coperti, iscritti e sedute rispondevano a domande leggermente diverse:
`coveredEmployees` filtrava i clienti avviati e `enrolledEmployees` no, cioè
numeratore e denominatore dell'attivazione contavano due insiemi. Nel dataset
demo non si vedeva, perché l'unica azienda non avviata ha zero iscritti; in
produzione quella coincidenza cade e l'attivazione può superare il 100%. Ora i
quattro campi applicano `ClientCompany.active` una volta sola, e un guardrail
verifica l'invariante su ogni mese (`CONTRATTO-DATI.md` §3).

**`platform-metrics.ts` è nato da un vincolo del seam.** Ricavo, attivazione e
mese corrente sono conti sui dati e non dati — «il tasso di attivazione non è un
campo» — quindi vivevano in `lib/data/mock/platform.ts`, dove **nessuna
schermata poteva importarli**: è il divieto del §5.7, e il risultato era che le
pagine del back-office li riscrivevano. Da lì una divisione ripetuta in due
punti e un `if (!plan) return 0`. Ora stanno in `lib/`, come `earnings.ts` e
`schedule.ts`, e il giorno in cui `mock/` si cancella quel file non si tocca
(`CLAUDE.md` §3).

**Il layer dati ha chiuso quattro punti di forma.** Il dipendente demo ha un id
opaco invece di uno parlante; la chiave della nota di sessione è passata **sotto
la radice del professionista**, così l'invalidazione della radice se la porta
dietro come tutto il resto (`CONTRATTO-DATI.md` §4); la proiezione letta di una
richiesta demo e il nome proprio del professionista hanno preso la forma che il
contratto prescrive (§2); e un id di professionista inesistente ora **lancia
invece di restituire vuoto** — un metodo che tace su una chiave sbagliata fa
sembrare la schermata un caso legittimo di lista vuota.

**Il dizionario ha assorbito le stringhe rimaste in JSX** — etichette della
dashboard HR, della ciambella, dei mesi, l'indirizzo, il segno, il giorno — e i
numeri del portale professionista passano da `format.ts`. Il trattino di
"nessun dato" è consolidato su `common.none`, che è la stessa chiave che il PDF
di M4 verifica.

**Una cosa scoperta misurando, e vale per il pitch**: `DEMO_TODAY` gira meno di
quanto il suo commento prometteva. Cambiare **anno** funziona; cambiare
**giorno** dentro settembre non fa lanciare niente ma non è sorvegliato da
nessun guardrail — le tre proprietà del §5.4 restano da rileggere a mano;
cambiare **mese** rompe, e il commento del file dice ora dove. Il pericolo non è
il lancio, è che **in produzione i guardrail tacciono** (§5.6): una manopola
girata male non si vede in un build di pitch. Si gira in sviluppo e si guarda.

#### La passata pre-pitch (10.08.2026)

La prima passata di refinement che **esegue** una decisione invece di metterne in
ordine gli effetti: la build "demo" e la checklist, decise dalla riunione del
10.08.2026.

**Il build del pitch era cieco, ed è la ragione per cui la passata esiste.** I
guardrail giravano solo in `import.meta.env.DEV`, quindi ogni controllo che
protegge i numeri era compilato via **proprio dall'unica build che qualcuno fuori
dal team vede**. Ora i modi sono tre: sviluppo lancia, `npm run build:demo` logga
con `console.error`, `npm run build` tace.

**La decisione sta in `guardrails.ts` e in nessun altro punto.** Dopo questa
passata **nessun file fuori da lì legge `import.meta.env`**: i 96 call site
chiamano `assertInDev` senza sapere in che modo girano, ed è la proprietà che
rende la modalità una cosa sola da sbagliare invece di 96. I nomi restano —
rinominarli sarebbe un commit meccanico su 96 chiamate, che sommergerebbe il
diff di questa (`CLAUDE.md` §5.6).

> *La passata dichiarò **114**, ed era il numero sbagliato in tutti e tre i
> posti che lo scrivevano — qui, in `CLAUDE.md` §5.6 e nel commento di
> `guardrails.ts`. Corretto a **96** l'11.08.2026. Non era invecchiato: era
> `grep -c "assertInDev"` grezzo, cioè 90 chiamate + 6 chiamate lunghe + 16
> righe di `import` + 2 righe di prosa nei commenti. **È il difetto del 19/11
> contro il 13/9 delle CTA, ripetuto altrove**: un conteggio senza criterio
> scritto accanto. Il criterio ora sta in `CLAUDE.md` §5.6, e dice anche
> perché `prefetch.ts` non entra nei 96. ~~Un 97 futuro è un errore di criterio,
> non una correzione.~~ → **ribaltato dal `CLAUDE.md` §5.6 il 14.08.2026**: le
> regole si scrivono sui criteri, non sui valori che i criteri producono. Il 97
> è arrivato il giorno dopo con la tranche tedesca, e oggi il conto è **99**.*

**`--mode demo` non ha bisogno di nessun file `.env.demo`**, ed è l'unica strada
percorribile: `.gitignore` esclude `.env*` (§2.5), quindi una build che ne
dipendesse si romperebbe su una macchina appena clonata.

**`vercel.json` esegue la build demo**, così l'alias condiviso serve quella in cui
i guardrail parlano. Anche le preview di branch diventano build demo, ed è un
beneficio: chi revisiona vede i log prima del merge.

**Verificato rompendo il dataset ad arte** — la tariffa della Dr.ssa Colombo
portata a CHF 95, fuori dalla banda del §9 — e provando i tre modi con lo stesso
valore rotto:

- **sviluppo**: lancia, schermata vuota, messaggio in console con il file e la
  riga. È il comportamento di prima, invariato;
- **build demo**: `[dataset] Colombo prende CHF 95 a seduta, fuori dalla banda
  CHF 70-80 del §9.` in console, e **la landing si disegna intera** — hero,
  riquadro profilo, entrambe le CTA;
- **build di produzione**: **console vuota**, stesso valore rotto.

Ripristinato il valore, la build demo torna a console pulita su **26 rotte
percorse con la navigazione interna**, nessuna vuota e nessun 404.

**Lo zero overhead è misurato sul bundle, non promesso**: nel bundle di
produzione `grep` non trova né `[dataset]`, né il messaggio della cache fredda,
né il testo di un guardrail preso a caso — Vite sostituisce il modo con un
letterale e il minificatore porta via i rami morti insieme alle stringhe. La
build demo costa **8 KB su ~1.1 MB**.

**La conseguenza da non perdere**: la build demo **prosegue con i dati sbagliati**
dopo il log. È il compromesso voluto — davanti a un investitore una schermata
rotta è peggio di un numero storto — ma da lì la regola operativa di `PITCH.md`:
qualunque log durante la prova del giorno prima è un **blocco**, si riproduce in
sviluppo dove il guardrail lancia, si corregge, si rifà la prova.

**`docs/PITCH.md` è il terzo documento del repository**, e il §3 ha acquisito il
suo mestiere: né regole né storia, ma lo script operativo della presentazione.
Consolida ciò che era sparso — la scheda in primo piano, il divieto di
ricaricare, un clic per PDF — e porta le risposte pronte alle quattro domande
che il pitch riceve: da dove viene il dato di stress, perché il ROI è 2.35:1 e
non 19.5:1, il co-payment come deterrente che tiene il consumo dentro il cap —
la riga diceva «meccanismo di margine», ed è la stessa parafrasi sbagliata
corretta il 15.08.2026 — Keller e Basalto come
vetting a schermo. Le cifre sono verificate contro §8 e §9 alla cifra.

#### La passata di palette (10.08.2026)

La seconda passata che esegue una decisione della riunione: le CTA verdi piene
passano su `primary` (`CLAUDE.md` §6.1). Nessun cambiamento oltre ai colori.

**L'inventario autoritativo è 13 punti su 9 file**, e sostituisce i 19/11 di M3 e
i ~9/7 della ricognizione: quelli erano stime, questo è un conteggio con un
criterio scritto. Da 21 occorrenze grezze di `bg-secondary` pieno o
`variant="secondary"` in 14 file:

| destinazione | punti | dove |
|---|---|---|
| `primary` | 8 CTA | `PublicNav` ×2, `PageNotFound`, `EmployeeHome`, `Psicologi` ×3, `ProSessioni` |
| `accent` | 2 KPI | `HRDashboard`, `ProPagamenti` |
| coppia `accent` | 2 badge | `Psicologi`, `ProProfilo` |
| rimossa | 1 variante | `KPICard.bgMap.secondary` |

**Fuori, con la ragione**: `button.tsx`, `badge.tsx` e `sheet.tsx` (congelato);
`FlexiblePlanCard.jsx` (codice morto); il pallino di `Medico` e i due
riempimenti di barra di `HRDashboard` (nessun testo).

**Due errori dell'inventario, trovati verificandolo invece che fidandosene.**
Vanno tenuti perché sono il modo in cui il conteggio sbaglia:

- **un `grep -v "bg-secondary/"` esclude la riga, non l'occorrenza**, quindi
  `className="bg-secondary hover:bg-secondary/90"` — cioè *la CTA*, il caso
  centrale — spariva dal conto perché la stessa riga contiene anche la tinta
  trasparente. È probabilmente l'origine del ~9/7;
- **`Medico.tsx:159` è un pulsante a sola icona** con `aria-label`, non testo.
  Era nell'inventario approvato a 14 punti e ne è uscito: per il criterio
  — «il debito è il testo che non passa l'AA» — un'icona non è testo. È il
  motivo per cui `/employee/medico` conserva un pulsante teal.

**Un call site non è un rendering.** Il censimento a runtime sulle 26 rotte
conta 18 pulsanti "Avvia" su `/professional/sessioni` e tre badge di specialità
su `/employee/psicologi`, ma sono **un** call site ciascuno. L'inventario conta i
punti da correggere, non le volte che si vedono.

**Le destinazioni non sono state scelte, sono state ereditate**: `Roi.tsx` porta
il commento che motiva le CTA su `primary` da quando è stata costruita in M3, e
tutte e sei le schermate admin usano `variant="accent"` per la KPI di rilievo.
`variant="primary"` di `KPICard` non lo usava nessuno, ed è uscito in un commit
suo come codice morto preesistente (§11).

**`PageNotFound.jsx` resta `.jsx`.** Il §3 converte le pagine ereditate «il
giorno in cui qualcuno ci mette mano», e cambiare una classe non è quel giorno:
un diff di palette deve leggersi come palette. Stessa deroga di `KoraLogo` nella
passata di igiene. La regola non cambia.

**Verificato**: i contrasti misurati punto per punto — 2.83:1 prima, 11.45:1 su
`primary`, 10.66:1 sulla coppia `accent`, 13.53:1 sulla KPI — 26 rotte sulla
build demo, console pulita, `lint` e `typecheck` a zero, e screenshot prima/dopo
delle otto schermate toccate, approvati dai founder prima del merge.

**Il debito residuo, censito e non toccato.** Il suo rimedio **non è coperto
dalla decisione del 10.08.2026**, che ha scelto la strada per il riempimento
pieno. Destinazione **M5**, che ha l'accessibilità completa in elenco. Censito
ora perché un inventario preciso è ciò che rende quella voce eseguibile senza una
terza rilevazione:

| caso | soglia | punti | file |
|---|---|---|---|
| **testo** `text-secondary` su fondo chiaro | 4.5 (1.4.3) | **27** | 20 |
| **icone** teal su fondo chiaro | 3.0 (1.4.11) | **40** | 20 |
| **icona su riempimento teal pieno** | 3.0 (1.4.11) | **1** | 1 |
| in `FlexiblePlanCard.jsx` | — | 3 | 1 (escluso, codice morto) |

Misure: `text-secondary` su card bianca **2.83:1**, su `bg-secondary/10`
**2.57:1**. Le icone su fondo chiaro non arrivano alla soglia del non-testo.

**La terza riga è il caso che le prime due non coprono, ed è una riga sola:** il
pulsante di invio di `Medico.tsx:159`, uscito dall'inventario della passata
perché non porta testo. Non è teal su chiaro — è **un'icona chiara su teal
pieno**, cioè il verde pieno visto dal lato del non-testo, e senza una riga sua
sarebbe scomparso fra due liste che parlano d'altro. **2.72:1** contro la soglia
di 3.0, misurato a schermo: è più basso del 2.83 del testo bianco perché l'icona
eredita `text-primary-foreground`, che è 98% e non bianco puro. Il pallino
pulsante di `Medico.tsx:112` resta fuori, perché è decorativo e non veicola
informazione.

**Il confine fra le prime due righe è approssimativo**: `iconClass:
"text-secondary"` passa da una variabile e va letto a schermo, non da un grep.

#### La passata di allineamento pre-M5 (11.08.2026)

L'ultima prima di M5, e la sola che non esegue una decisione né migra un'area:
una revisione incrociata docs ↔ codice. Sette commit, sei `docs:` e uno solo
che tocca comportamento.

**La lezione che le tiene insieme, in una riga: un numero dichiarato senza il
criterio scritto accanto produce sempre un secondo numero.** Era già la storia
del 19/11 contro il 13/9 delle CTA; questa passata l'ha trovata ripetuta in
altri due punti e ha attaccato il criterio a ognuno dei tre.

**I 114 call site dei guardrail erano 96.** Il numero non era invecchiato: era
`grep -c "assertInDev"` grezzo — 90 chiamate + 6 chiamate lunghe + **16 righe
di `import` + 2 di prosa nei commenti** — e il nome lungo contiene quello
corto, quindi le sei si contavano due volte. Stava sbagliato in otto occorrenze
su tre file, corrette in un commit solo: è un fatto scritto in tre punti, e
spezzarlo avrebbe lasciato due posti a dire 114 e uno 96. Il criterio ora vive
in `CLAUDE.md` §5.6 e nomina anche l'esclusione che sorprende — `prefetch.ts`
chiama `raiseOutsideCurrentStack` ma legge `GUARDRAIL_MODE` da sé, quindi non è
un call site che ignora il modo. ~~Un 97 futuro è un errore di criterio, non una
correzione.~~ → **ribaltato dal `CLAUDE.md` §5.6 il 14.08.2026**, e vale doppio
ora che il numero vero è oltre il 97: una regola scritta su un valore fa
respingere come errore la misura giusta, ed è esattamente quello che sarebbe
successo — il 97 è arrivato con un guardrail nuovo, cioè per la ragione più
ordinaria che ci sia.

**Il conto delle passate diceva cinque e se ne trovavano otto**, e il 9/7 delle
CTA era rimasto nella voce del 10.08.2026 accanto all'inventario autoritativo
13/9 che lo aveva superato. Barrato, non cancellato: è il terzo dei tre numeri
che hanno reso necessario un criterio.

**Due semplificazioni che il codice non dichiarava.** `computeEarlyAlert` esce
al **primo** reparto con una risalita in corso e `EarlyAlert` è un valore
singolo: con due reparti in allerta simultanea il secondo sparirebbe in
silenzio, e nessun guardrail se ne accorgerebbe — il dato non è
contraddittorio, è incompleto. Nel dataset demo l'alert è uno per costruzione;
in produzione il contratto dovrà restituire una lista, ed è in
`CONTRATTO-DATI.md` §7. L'altra è in `hr.ts`: tutte le fatture sono `paid`,
**compreso il mese in corso**, mentre `payoutHistory` mette il mese in corso a
`pending`. Sono i due versi del flusso di cassa — l'azienda paga in anticipo,
il professionista a consuntivo entro il 5 del mese dopo — ma il lato
professionista lo dichiarava e quello HR taceva, quindi i due file letti di
seguito si leggevano come una contraddizione.

**Il guardrail sulla cache fredda aveva un varco.** react-query 5 ammette
`enabled: (query) => boolean`, che il confronto `=== false` non vede: una query
disabilitata così si sarebbe presa l'accusa di cache fredda, cioè **proprio ciò
che il commento sopra quel controllo esiste per impedire**. Non lo risolve
chiamando la funzione — il valore dipende dallo stato della query quando
react-query la valuta, e replicarlo qui sarebbe una seconda copia che può
divergere dalla libreria — ma si dichiara incompetente e chiede di aggiornare
sé stesso. È costruito su `raiseOutsideCurrentStack` e non sulle due primitive
contate, così i 96 restano esatti.

**La residenza dei dati è entrata fra le decisioni in sospeso.** Cinque
stringhe di `i18n` promettono "Hosting in Svizzera" mentre il §2.1 di *"Dubbi
Business per CEO"* dà la promessa commerciale come domanda ancora aperta, da
chiudere prima del primo pilot. Per la demo non cambia niente; la voce esiste
perché il primo contratto non si firmi su una promessa non ratificata.

**Verificato**, con il riconteggio fatto sull'albero finale e non durante:
96 = 90 + 6; il conto delle passate — **otto** allora, nove da quando il merge
ha aggiunto questa; **5 stringhe di residenza più 6 adiacenti** che promettono
conformità LPD/GDPR senza dire dove stanno i dati, cioè 5 + 6, non 11 e nemmeno
6. `lint` e `typecheck` a zero, `build:demo` che passa, console pulita su
scheda nuova con i soli due avvisi `react-router` noti da M1, e nessun numero
della dashboard HR mosso di una cifra.

**Il varco di `enabled` è stato provato a due vie**, come ogni guardrail qui:
con la forma funzione su una chiave fredda esce il messaggio nuovo, con un
booleano sulla stessa chiave esce quello di cache fredda. Sono due rami
distinti, non uno che copre l'altro.

**Il `114` compare ancora nell'albero, ed è voluto**: `CLAUDE.md` §5.6, il
commento di `guardrails.ts`, la passata pre-pitch che lo aveva dichiarato e
questa sintesi ne trascrivono la scomposizione, perché spiega da dove veniva il
numero sbagliato meglio di qualunque nota. **Nessuna occorrenza lo dichiara più
come conteggio**, ed è quello l'invariante da verificare: un `grep 114` le
trova tutte, e non è una verifica fallita. *Il numero delle occorrenze non si
scrive qui apposta — sarebbe la prima cifra a invecchiare, visto che è questo
stesso testo ad aggiungerne.*

#### I due fix pre-M5 (11.08.2026)

Due difetti piccoli trovati dalla revisione incrociata, più una riga di
archeologia. Tre commit, uno per fix, come vuole il §11 per ciò che si toglie.

**Il form richiesta demo raccoglieva il telefono e lo buttava via.** Il campo
era nello stato e nel markup, ma la `mutationFn` non lo passava e `DemoRequest`
non aveva dove metterlo: input dell'utente raccolto e perso in silenzio, che è
il difetto peggiore della famiglia — a schermo il form si comporta come se
avesse funzionato.

Collegato seguendo il percorso già documentato per `message`, che resta
l'esempio lavorato del `CONTRATTO-DATI.md` §2: **`phone?: string` sull'input**,
perché su un payload di scrittura un campo che si può lasciare vuoto non deve
obbligare ogni chiamante a passare `null`; **il confine normalizza**, con
`trim()` o `null` una volta sola nel provider, che è dove lo farà il backend
ricevendo la richiesta; **`phone: string | null` in lettura**, sempre presente
nella risposta. È lo stesso campo che **cambia forma attraversando il
confine**, cioè il caso che il §2 esiste per spiegare.

Si vede nel back-office come colonna sua, che è il criterio di quella tabella —
una colonna per campo — con `common.none` sull'assente, esattamente come
`employeeCount === 0` già faceva. **La colonna nuova non contraddice il "non
spostano un numero a schermo" di questa sezione**: mostra un dato in più, non
muove una metrica.

**Le lingue dell'admin si univano con un `", "` cablato**, mentre la
prenotazione del dipendente usava già `t.common.listSeparator` sulla stessa
lista. Era l'ultimo separatore cablato a schermo: gli altri `join(", ")` stanno
dentro i messaggi dei guardrail, che sono testo per chi sviluppa e non passano
dal dizionario. ~~`Intl.ListFormat` resta M5~~ — qui si chiudeva l'incoerenza
interna, non l'enumerazione che segue il locale, e **quella l'ha chiusa M5.e**
sostituendo la chiave con `formatList`.

**Un commento orfano è uscito dal dizionario**: *"Quando il form non dichiara
l'organico"* descriveva una chiave che non esiste più, perché quel caso è
passato a `common.none` e il commento è rimasto indietro. In un commit suo,
come il §11 chiede.

**Verificato a schermo**, e il caso che conta è il secondo:

- inviata una richiesta **con** telefono, `Ontano Logistica SA`, e una
  **senza**, `Sorbo Manifattura SA`: la prima porta il numero in tabella, la
  seconda il trattino di `common.none`, entrambe datate 23.09.2026 e ordinate
  dalla più recente. **Provare solo il caso pieno avrebbe lasciato scoperta
  proprio la cella vuota**, che è il caso che il §11 chiede di guardare;
- **nessun numero dell'area HR si è mosso** dopo i due invii: CHF 14'200, 16
  giorni, 68%, 82 su 120, 41 attivi, 142 di 1'200, 62%, soglia 12, −2 punti;
- le lingue escono `Italiano, Deutsch` e `Deutsch, English`, e chi ne ha una
  sola — il Dr. Fontana — non mostra nessun separatore;
- 26 rotte percorse senza ricaricare, **zero schermate vuote**, console pulita
  su scheda nuova con i soli due avvisi `react-router` noti da M1; `lint` e
  `typecheck` a zero.

**Due cose incontrate e non toccate**, perché fuori dallo scope della passata:
`/admin` non è linkata da nessuna schermata fuori dal suo layout, quindi
"camminare fino a `/admin` con la sola navigazione interna" regge se "interna"
vuol dire **senza ricaricare** — che è la proprietà che conta, visto che il
provider vive in memoria — e non "cliccando link". E dopo l'invio, cliccare
"Demo" nella nav non ripropone il form: la rotta è la stessa e il componente
non si rimonta, quindi resta la conferma e si esce dal "Torna alla home".

#### L'uscita da `/admin` (11.08.2026)

Otto righe di codice, e sbloccano un momento del pitch che non era eseguibile.

**`/admin` era un vicolo cieco in tutti e due i sensi.** Nessuna schermata la
linkava — zero ancore verso di lei su tutte e sette le rotte, censite a schermo
— e dal suo layout non si usciva: le sue sei ancore puntavano tutte dentro
`/admin`, e il logo era un `div`, non un link. L'unico modo di entrarci era
digitare l'indirizzo, cioè ricaricare, cioè azzerare il provider.

**La conseguenza non era estetica**: il momento *"la richiesta demo compilata
davanti all'investitore compare nel back-office"* **non si poteva mostrare**. La
richiesta si salvava, ma per vederla bisognava ricaricare, e ricaricando spariva
con il provider che la teneva. La verifica di M3 che lo dava per fatto era stata
condotta arrivando su `/admin` da console, che non è un gesto che si fa durante
una presentazione.

**Il logo è diventato un link nei due punti del layout**, sidebar e header
mobile, con l'idioma che `PublicNav` usava già. `KoraLogo.jsx` non è stato
toccato, quindi la regola del §3 sulla conversione delle pagine ereditate non
si è attivata: il diff si legge come "il logo diventa un link" e nient'altro.
È scope, quindi è passato dai founder (§2.6).

**Da lì `docs/PITCH.md` ha una coreografia invece di un vincolo**, e l'ordine è
obbligato: `/admin` si apre **per prima**, si esce col logo, si fa il giro con i
link interni compresa la richiesta, si torna con Indietro. Due cose sono emerse
solo eseguendola, e stanno nel testo: **Indietro va premuto una volta per ogni
passo fatto**, non una in totale — dal logo diretto a `/demo` sono due passi e
due Indietro, ed è la ragione per tenere corto quel tratto — e **il caso a
freddo è scritto come modo di fallire**, perché digitare `/admin` alla fine
invece di tornarci riproduce la tabella vuota di partenza e da fuori si legge
come una scrittura che non ha funzionato.

**Il criterio del conto ha una seconda esclusione**: le PR che toccano solo
`docs/PITCH.md` non sono passate di refinement. Lo script del pitch cambierà a
ogni prova generale, ed è il verbale di come si presenta, non di com'è fatto il
prodotto. Il caso che l'ha resa necessaria è #27, ed è nominato lì.

**Verificato a schermo con il link vero**, non con la simulazione che gli aveva
fatto da controfigura in fase di piano:

- `/admin` a freddo mostra "Nessuna richiesta" e due uscite verso `/`;
- clic sul logo → landing, clic su "Demo" → form, richiesta inviata con
  telefono;
- **due Indietro** → `/admin`, con la riga in tabella —
  `Ontano Logistica SA`, `+41 91 000 00 00`, 23.09.2026;
- per tutto il giro il browser registra **una sola navigazione**: nessun
  ricaricamento in nessuno dei quattro passi;
- 26 rotte percorse, zero schermate vuote, console pulita su scheda nuova;
  `lint`, `typecheck` e `build:demo` a posto, e nessuna KPI dell'area HR mossa.

**Una trappola in cui si cade ancora**, e il file la documenta da M1: il primo
controllo sulle KPI dava sei valori su otto assenti, perché `formatCHF` separa
`CHF` dalle cifre con lo **spazio unificatore** U+00A0 e l'asserzione era
scritta con lo spazio da tastiera. Normalizzando, tornano tutte. Chi scrive un
controllo su un importo lo normalizzi prima di concludere che il numero non c'è.

#### Le uscite dai tre portali — #34 (13.08.2026)

Speculare alla #28, e la chiude: quella aprì l'uscita da `/admin`, questa fa lo
stesso per gli altri tre portali. Due commit di codice e docs, e il difetto lo
aveva censito il blocco d) di M5 mentre verificava le guardie.

**Il difetto era lo stesso di `/admin`, e nessuno lo aveva visto perché il
pitch lo aggirava.** `/employee`, `/hr` e `/professional` non avevano **nessuna
ancora** che uscisse dal portale: ogni `href` puntava dentro. Il giro fra i
portali passava dal tasto Indietro, e `docs/PITCH.md` — che prescrive "solo i
link interni" — non lo diceva, perché non c'era altro modo di farlo. **È il
motivo per cui è emerso solo ora**: un vicolo cieco che ha una via d'uscita fuori
dall'applicazione non si vede finché qualcuno non conta le ancore.

Il logo diventa un link nei **due punti che ogni nav ha**, sidebar desktop e
header mobile, con l'idioma di `AdminLayout`. `KoraLogo` non è stato toccato e i
tre nav erano già `.tsx`, quindi la regola del §3 sulla conversione non si è
attivata: il diff si legge come "il logo diventa un link". **27 inserzioni e 6
rimozioni su tre file** — le otto righe dell'admin, per tre.

**`docs/PITCH.md` è stato riscritto dopo aver percorso il giro**, non prima, che
è l'ordine seguito dalla #28. Porta due righe che servono a non far sbagliare:
cosa concludere se ci si ritrova a premere Indietro fra i portali — che si sta
guardando la build vecchia — e che **le uscite non toccano la coreografia di
`/admin`**, perché il logo porta *fuori* da un'area e lì c'era già; a mancare è
un link che porti *dentro*, ed è la ragione per cui quella coreografia esiste.

**Verificato a schermo, 1280×900:** le quattro aree hanno ora esattamente
un'ancora che esce; il giro del pitch coi soli link — landing, dipendente, logo,
HR, logo, professionista, logo — **sei clic, nessun Indietro, una sola
navigazione**; la coreografia di `/admin` intatta su scheda nuova, con la riga in
tabella; 27 rotte, zero vuote, zero negate, `console.error` mai chiamato; numeri
del pitch fermi; `lint`, `typecheck`, `build:demo`, `npm audit` a zero, guardrail
90 + 6.

**Questa sintesi è arrivata dopo il merge, ed è uno scarto dalla regola di #26.**
Doveva essere l'ultimo commit della passata; è rimasta indietro perché aspettava
il numero della PR, che si conosce solo aprendola, e il merge è arrivato prima.
**Non gonfia il conto**: è una sintesi retrospettiva, quindi ricade nella prima
eccezione e appartiene a #34. La regola di #26 resta quella giusta — se il numero
non si sa in tempo, la si scrive **senza il numero** e lo si aggiunge, invece di
rimandare l'intero commit.

#### L'overflow orizzontale della landing (14.08.2026)

Un commit di codice, una riga di classe. Il difetto lo aveva censito la verifica
tedesca della tranche 1b — *"la landing sfonda di 24px a 1280, ed è identico in
italiano"* — che lo dichiarò senza correggerlo, perché una tranche di traduzione
non porta una correzione di layout.

**La causa non era quella scritta, e si è vista solo misurando.** Il censimento
la attribuiva al sigillo "Privacy-first", posizionato in negativo sul mockup
dell'hero. Il sigillo sta a `-right-4`, cioè 16px fuori dal bordo della card, e
**da solo non sfonda niente**: a 1280 il suo bordo destro cade a 1249 dentro un
viewport di 1265. A sfondare è **l'ingresso**, non la posizione — il mockup entra
da destra con `x: 40`, e per la durata dell'animazione porta se stesso e il
sigillo 24px oltre il bordo dello schermo.

| stato | pre | post |
|---|---|---|
| inizio animazione (`x: 40`) | scrollWidth 1289 su 1265 → **24px** | 1265 → **0** |
| animazione conclusa | 1265 → 0 | 1265 → 0 |
| bordo destro del sigillo | 1249 a riposo, 1289 all'ingresso | **identici** |

**Ne discende una cosa che vale più della correzione**: il difetto è
**permanente su una scheda in secondo piano**, dove `requestAnimationFrame` è
sospeso e l'animazione resta ferma al suo primo fotogramma. È la quarta faccia
di `visibilityState` — dopo le animazioni congelate di M3, `innerWidth` a zero di
M5.a e le query in pausa di M5.b — e stavolta il sintomo è una barra di
scorrimento orizzontale sulla prima schermata che un investitore vede. Il §10 e
`docs/PITCH.md` vietano già di pre-aprire la landing in una scheda di sfondo, e
questa è una ragione in più che quelle righe non nominavano.

**`overflow-x-clip` sulla sezione hero, e non `hidden`.** `hidden` su un asse
rende l'altro `auto`, cioè fabbricherebbe un contenitore di scorrimento
verticale dentro l'hero; `clip` taglia e lascia l'asse verticale `visible`. Il
taglio cade su pixel che stanno **fuori dal viewport** — raggiungibili solo con
lo scorrimento che si sta togliendo — quindi la resa approvata non cambia in
nessuno dei due stati, ed è il criterio con cui la passata era stata autorizzata.
L'animazione non è stata toccata.

**Verificato a 1280 e 1440, in italiano e in tedesco**, con gli stati imposti
esplicitamente invece che attesi: `scrollWidth === clientWidth` in tutti e
quattro i casi, sigillo alla stessa coordinata prima e dopo, console pulita,
`lint` e `typecheck` a zero, un solo file toccato. A 1440 non sfondava nemmeno
prima — il difetto è di 1280 e delle larghezze sotto — ed è servito da controllo.
A 768 la correzione toglie anche i 32px che il mockup a colonna singola
produceva all'ingresso, e il sigillo resta interamente dentro il viewport: il
`clip` non taglia niente di visibile a nessuna delle larghezze provate.

**Due cose sullo strumento, e sono la quinta e la sesta del filone.** Il pannello
del browser di questa sessione riporta `visibilityState: hidden` **anche con la
scheda in primo piano e il focus attivo**, quindi l'animazione non parte e non è
stato possibile guardarla scorrere: le misure sono di **geometria imposta** —
inizio e fine dell'animazione scritti a mano sull'elemento — e gli screenshot
sono presi nello stato finale forzato. È la lettura più onesta disponibile qui,
e va rifatta su un browser vero prima della prova generale del pitch. E una
misura intermedia era stata presa in uno stato che credevo congelato e non lo
era più: il numero tornava lo stesso della resa conclusa, cioè lo strumento
rispondeva a un'altra domanda — di nuovo (`CLAUDE.md` §11).

**Una nota sul criterio di accettazione**, perché la prossima verifica non lo
riscriva sbagliato: `scrollWidth === innerWidth` non può valere quando c'è una
barra di scorrimento verticale, che ne prende 15 — `innerWidth` la comprende,
`clientWidth` no. L'uguaglianza che dice "non si scorre in orizzontale" è
**`scrollWidth === clientWidth`**, ed è quella misurata qui.

#### La coerenza del dominio (14.08.2026)

Dieci commit, e **nessun numero a schermo si muove**: è una passata su difetti
che oggi non si vedono e che il backend erediterebbe. Tocca il layer dati e i
tre punti in cui una schermata leggeva due sorgenti per lo stesso fatto.

**Il filo che tiene insieme le otto correzioni**: un dato ha una sorgente sola,
e chi ha già quella sorgente in mano gliela passa invece di farla ricostruire.
Cinque delle otto sono la stessa forma vista da lati diversi.

| | cosa impediva |
|---|---|
| **I compensi ricevono le sedute, non l'id** | `monthlyEarnings` e `payoutHistory` leggevano `PORTAL_SESSIONS`, cioè l'agenda della sola Dr.ssa Meier: `getProfessionalEarnings("keller")` dichiarava **14 sedute e CHF 1'050** per chi ne ha zero e il mandato non firmato, mentre `getProfessionalSessions("keller")` restituiva la lista vuota. Due metodi dello stesso contratto che si contraddicono (§5.5) |
| **Un guardrail incrociato fra i semi HR e quelli di piattaforma** | l'organico 120 sta in `company.ts` e in `platform.ts`, gli iscritti 82 in `roi.ts` e in `platform.ts`, e niente li confrontava: cambiandone uno, la dashboard HR e il back-office descrivevano due aziende diverse senza rompersi. È il **618 contro il 767** che M3 ha chiuso a valle, sopravvissuto un livello più sopra |
| **L'azienda di riferimento si cerca per id** | era `CLIENT_COMPANIES[0]` e il guardrail verificava la presenza, non la posizione: riordinare l'array cambiava la base di ogni curva di piattaforma in silenzio |
| **Una seduta annullata libera la sua fascia** | l'insieme degli orari occupati non filtrava le annullate, quindi quell'ora non tornava prenotabile da nessuno — cioè il caso che dà un senso all'annullamento |
| **Due divisioni senza guardia sullo zero** | `usagePercent` e `checkupCompletionPercent` stampavano "∞%" su un trimestre a zero iscritti, che in produzione è il primo trimestre di ogni cliente nuovo |
| **`getLatestStressByDepartment` senza fallback** | un reparto senza serie metteva `undefined` nell'array e la dashboard esplodeva leggendo `measuredEmployees` |
| **Le due serie di stress si allineano per mese** | il punto del reparto si prendeva con l'indice della serie aziendale: con lunghezze diverse la schermata su cui si regge il pitch avrebbe disegnato il mese sbagliato sotto il mese giusto |
| **`employeeCount` dice l'assenza con `null`** | usava lo **zero come sentinella** e il back-office lo ridecodificava, quindi un'azienda con zero dipendenti dichiarati era indistinguibile da una che non aveva risposto. `phone` e `message` attraversavano già il confine con `?? null` (`CONTRATTO-DATI.md` §2); questo era il terzo e non lo faceva |

Più due sottrazioni: `stressTrendFor` usa l'`addQuarters` che `types.ts` già
espone invece di rifare il conto sul confine d'anno, e `quarterRank` **resta
duplicata** fra `mock/service-usage.ts` e `HRDashboard.tsx` con un commento che
dice perché — condividerla vorrebbe dire spostarla, e la regola di lint del §5.7
vieta alla schermata di importare da `mock/`. Il seam vale più di sei righe.

**Il `?? []` da solo non bastava**, ed è la correzione dentro la correzione: su
una serie vuota l'ultimo elemento resta `undefined` e il buco finisce comunque
nell'array di ritorno. Il crash si sarebbe spostato di una riga invece di
sparire.

**Verificato a schermo, dev e build demo, viewport 1280 e scheda in primo piano:**

- **in sviluppo nessun guardrail lancia** — la pagina bianca è il test, e le 27
  rotte si disegnano tutte; sulla build demo **console senza un solo log**;
- **nessuna delle cifre del §8 e del §9 si è mossa**: CHF 14'200, 16 giorni,
  68%, 82 su 120, 41 attivi, 142 di 1'200, 62%, soglia 12, −2 punti; la serie
  `53 … 46` con l'alert al decimo mese sulle Vendite e la Direzione a "—" con 11
  misurati; Meier 14 sedute e CHF 1'120 a settembre, 63 sedute e CHF 5'040
  nell'anno, righe settimanali 240 + 320 + 400 + 160, regime 5 su 20, 6 pazienti
  di cui 2 sopra il cap; back-office 798 coperti, CHF 652'968, 415 iscritti,
  52%, 1'147 sedute; ROI a N=100 con i cinque numeri di ancoraggio;
- **il giro della richiesta demo con e senza organico**, camminando da `/admin`
  al form e tornando con Indietro senza ricaricare: `Ontano Logistica SA` porta
  **250** in tabella e `Sorbo Manifattura SA` il trattino di `common.none`.
  Provare solo il caso pieno avrebbe lasciato scoperta proprio la cella che
  questa passata cambia;
- `lint`, `typecheck`, `build` e `build:demo` a posto.

**I guardrail passano da 97 a 99**, cioè `93 + 6`: il commit sul portafoglio ne
aggiunge **due** — organico e iscritti sono due fatti con due messaggi — e
quello sulla lookup rialloca il controllo di presenza senza aggiungerne. Il
criterio del §5.6 è applicato per intero, quindi a muoversi è la misura e non la
regola.

**La trappola dello spazio unificatore ha colpito di nuovo**, e vale annotarla
perché è la sesta volta che questo file registra la stessa famiglia: il primo
controllo su `CHF 14'200` dava assente, perché `formatCHF` separa la valuta
dalle cifre con U+00A0 e l'asserzione era scritta con lo spazio da tastiera.
Normalizzando, torna. Prima di concludere che un numero non c'è, verificare che
lo strumento potesse vederlo (§11).

#### Gli stati limite delle schermate (15.08.2026)

Undici commit. È il §11 applicato alla lettera — *cosa succede con zero
elementi, con un dato assente, al primo e all'ultimo periodo del dataset* — su
dieci punti che oggi non si vedono perché il dataset non li produce. **Nessun
numero del §8 si muove.**

| | cosa impediva |
|---|---|
| **Il contatore coach salta se il piano non ha il coach** | `coachEntitlement` fa `?? 0`, quindi su un Essenziale la card diceva "1 su 0" e la barra riceveva un valore non finito. Il guardrail che lo vieta vive solo in sviluppo: **nella build che si deploya si rompeva in silenzio** |
| **Il cap coach esaurito ha una via d'uscita** | il coach non ha `extraSessionPrice` — il §9 non ne dà uno — quindi a cap finito la conferma restava spenta per sempre: il vicolo cieco che il §10.B vieta. Ora la frase rimanda all'HR, che è l'unico gesto che esiste |
| **Il simulatore di fatturazione ha un clamp** | svuotando il campo il totale andava a CHF 0 su un contratto attivo, con un negativo diventava negativo. Il difetto vero era il vuoto: con `Number("") \|\| 0` il fallback all'organico **funzionava una volta sola**, e dalla prima modifica in poi quella riga era morta |
| **Il download del PDF ha un `catch`** | era l'unica scrittura dell'app senza stato d'errore: un fallimento lasciava una promise rifiutata, nessun messaggio e il pulsante di nuovo attivo come se il file fosse partito |
| **"Nota" precarica la nota esistente** | il dialogo si apriva bianco e salvando sovrascriveva quella che c'era |
| **Quattro insiemi di chiavi i18n sono unioni** | `explanationKey`, `goalKey`, `tipKeys` e `recommendationKeys` erano `string`: una chiave sbagliata compilava e rendeva vuoto. A valle costringevano a due `as keyof typeof` e a tre `Record<string, string>`, che dichiarano `string` su un accesso che può dare `undefined` |
| **`fault-injection.ts` non conta più i metodi** | diceva 42 e sono 44. Il numero si toglie e si rimanda al tipo: è la stessa lezione che quel file racconta di aver già imparato |
| **Il badge di annullamento nasce col motivo** | il motivo è opzionale sul tipo, e senza usciva un rettangolo rosso vuoto |
| **La chat del medico spegne il timer** | `setTimeout` senza cleanup: uscendo prima della risposta scattava su un componente smontato |
| **Un mese senza compensi lo dice** | restava la sola riga "Totale del mese CHF 0". Nello stesso commit lo storico pagamenti vuoto, che apriva un riquadro bordato e vuoto |

**Il regime tenuto è diventato una funzione** nel commit sui compensi della
passata precedente; qui la conseguenza si è vista dal lato opposto, ed è il
motivo per cui il mese vuoto era **finalmente raggiungibile**: prima, ogni
professionista rispondeva con l'agenda della Dr.ssa Meier, quindi non esisteva
nessun percorso che producesse un mese a zero. Una correzione ne ha resa
verificabile un'altra.

##### Come si sono visti i casi che il dataset non produce

Tre casi non li raggiunge nessuna manopola — `?fail` e `?empty` producono
guasti e vuoti di risposta, non configurazioni diverse — e due dei tre fanno
scattare un guardrail del dataset, quindi in sviluppo darebbero una pagina
bianca invece della schermata da guardare.

Si sono visti **sulla build demo**, dove i guardrail loggano e la schermata si
disegna lo stesso (§5.6): è il compromesso dichiarato di quella build, usato
qui come strumento. Il dato tornava al suo posto prima del commit, e l'albero è
stato verificato pulito.

- **piano su Essenziale** → il contatore coach sparisce, resta "3 su 6 sessioni
  usate", nessun "su 0" e una barra sola;
- **coach a 4 su 4** → scegliendo uno slot esce *"Hai finito le sessioni di
  questo servizio incluse nel piano per quest'anno. Per averne altre, parlane
  con il tuo referente HR."*, con la conferma spenta;
- **mese senza compensi** → nessun dato toccato: basta puntare il portale sulla
  Dr.ssa Keller, che un'agenda non ce l'ha. Escono "Nessuna seduta erogata
  questo mese." e "Nessun pagamento ancora.", con 0 sedute e CHF 0.

##### Verificato a schermo, viewport 1280 e scheda in primo piano

- **il simulatore di fatturazione**: vuoto → 120 e CHF 79'200, cioè il
  contratto vero; `-5` → 1 e CHF 660; `5` → CHF 3'300, che è la domanda
  legittima che un clamp a 20 avrebbe rifiutato;
- **il PDF che fallisce**: con il generatore rotto ad arte esce *"Il PDF non è
  stato creato · Riprova a scaricarlo."* e il pulsante torna premibile;
  ripristinato, il download riesce e nessun messaggio compare;
- **la nota**: salvata su M.B., le sedute senza nota passano da 8 a 7 — la
  stessa asserzione di M2 — e **riaprendo quella seduta i due campi sono
  pieni**, dove prima si apriva un foglio bianco;
- `lint` e `typecheck` a zero; i guardrail restano **99 = 93 + 6**, invariati.

**Una trappola dello strumento, la settima di questo file**: il conteggio dei
pulsanti con `innerText` dava 7 dove `textContent` ne dà 63, perché `innerText`
dipende dal layout e salta ciò che il modale rende invisibile. E l'etichetta di
una nota esistente è `Nota`, non "Modifica nota": cercando la seconda si
concludeva che il salvataggio non fosse avvenuto. Due misure che rispondevano a
una domanda diversa da quella posta (§11).

**Aperto e dichiarato:**

- **La query della nota si monta a cache fredda**, e il guardrail del §5.6 lo
  dice: `useSessionNote` è la prima lettura che nasce da un gesto e non dal
  primo paint, e `prefetchDemo` non può scaldarla — le chiavi sono una per
  seduta. Il controllo esenta le query `enabled: false`, che è il caso del
  dialogo chiuso, ma non quello del dialogo appena aperto. **Va deciso**: o si
  scaldano le note al boot, o il controllo impara a distinguere un montaggio
  successivo al primo paint.
- **`hasNote` è derivato e non ha una nota dietro.** 56 sedute su 63 lo
  dichiarano vero — il paziente ha una seduta più recente — ma `getSessionNote`
  per loro risponde `null`, quindi "Nota" apre comunque un foglio bianco. Il
  precaricamento morde sulle note scritte davvero, e sul resto il dato dice una
  cosa che dietro non c'è: è la famiglia "due sorgenti per lo stesso fatto", ed
  è materia di dataset.

#### Il perimetro del contratto (15.08.2026)

Nove commit su `docs/CONTRATTO-DATI.md` soltanto: **nessun file di codice è stato
toccato, e nessun tipo è cambiato.** È la passata che consegna a chi scriverà il
backend le definizioni che il codice interpretava diversamente dal testo, e il
perimetro di ciò che il prodotto non ha ancora.

**Sei definizioni precisate**, tutte invisibili nella demo e tutte incontrate da
chi implementa: `used` conta le erogate «dell'anno di piano» e un anno non c'è —
in produzione un cap senza periodo non riparte mai; il conteggio autorevole è
quello **centrale sul paziente**, e il lato professionista è una proiezione, che
con due psicologi fa scattare il co-payment in ritardo; `bookAppointment` deve
poter **rifiutare**, e nessun tetto governa le prenotazioni in programma; il tetto
dei consulti del medico virtuale è dichiarato su `Plan` e **non applicato da
nessuno**; il check rapido non ha periodo, storico né correzione; l'alert precoce
dovrà essere una lista — e quello era **già scritto** nel §7, quindi si è aggiunto
il rimando invece di una seconda copia.

**Cinque punti raccolti dai blocchi precedenti**: l'invariante che lega i tre
metodi del professionista allo stesso insieme di sedute — la regola che mancava,
non la storia del difetto; `employeeCount` che chiude l'ultima eccezione alla
convenzione `null`, e con lei la frase «il codice la rispetta per intero», che
**era falsa dal giorno in cui è stata scritta**; il reparto senza record mensili,
che oggi sparisce dalla tabella HR e in produzione va deciso; `getEntitlement` che
per un servizio non previsto deve dire `null` e non un totale a zero; e `hasNote`,
che deriva da un surrogato invece che dalle note.

**Il perimetro è il §8 nuovo**, sette gruppi nell'ordine in cui vanno affrontati:
escalation clinica, consenso e diritti dell'interessato, ciclo di vita di azienda
e dipendente, ciclo dell'appuntamento, autorizzazione e multi-tenant, realtà del
personale, paginazione. I primi due non sono funzioni ma **decisioni dei founder
che cambiano l'architettura** — il protocollo clinico prima del primo utente
attivo, titolarità del trattamento e segreto professionale prima del codice.

**Il §6 ha guadagnato il criterio che lo separa dal §8**, ed è la parte che vale
oltre questa passata: due sezioni che dicono entrambe *"qui non c'è"* divergono
se nessuno sa in quale aggiungere la voce successiva. La domanda che smista è
*«se il backend lo costruisse domani, staremmo violando una scelta o colmando un
vuoto?»*. Il primo caso di confine è dichiarato: l'**autenticazione resta nel
§6**, perché quella voce descrive la forma che il contratto ha già preso e
spezzarla in due la renderebbe illeggibile.

**La paginazione ha trovato la sua collocazione.** Il §7 del contratto la mandava
a M5; **nessuno dei sei blocchi di M5 la contiene**, e non è una dimenticanza —
paginare un estratto di otto righe curate non aggiunge niente alla demo. È lavoro
dell'MVP, sta nel §8.7, e da qui smette di essere orfana fra un documento e
l'altro.

**Resta a una passata di codice**, e non è di questo blocco: la correzione di
`hasNote` nel dataset, che oggi lo deriva da *"il paziente ha una seduta più
recente"* — 56 sedute su 63 lo dichiarano vero e `getSessionNote` per tutte
risponde `null` — e la decisione sul controllo della cache fredda contro
`useSessionNote`, aperta dalla passata del 15.08.2026.

### Punto di partenza — cosa c'è e cosa manca

Ereditato e funzionante: 25 rotte su cinque aree (pubblica, dipendente, HR,
professionista, admin), design system e navigazione, 47 componenti shadcn
(**oggi sono 45**: il sistema di toast, che ne contava tre, è uscito il
07.08.2026 — decisione qui sotto), grafici recharts.

Ereditato e **non** funzionante. Questa è la fotografia del primo commit, e le
righe barrate sono quelle che una milestone ha chiuso: serve a non riscoprire un
difetto già risolto, e a non rifarne uno già dichiarato aperto. Il dettaglio è in
`CLAUDE.md` §10.

- nessun layer dati: ogni pagina dichiara le proprie costanti in cima al file, e le
  stesse grandezze divergono fra schermate vicine — 618 vs 767 utenti, 18 vs 6
  pazienti, 180 vs 142 sessioni, tre roster di professionisti che non si parlano.
  **Chiuso**: i pazienti in M2, le sessioni in M3 con la dashboard HR, gli
  utenti e i tre roster con l'area admin — che era l'ultima a tenere le proprie
  costanti in cima al file;
- ~~le prenotazioni non producono effetti: nessun contatore si muove, nessun
  appuntamento compare, nessuno slot si occupa~~ → chiuso in M3 con l'area
  dipendente, e con la prova a schermo sui due lati del marketplace;
- ~~manca il calcolatore ROI pubblico~~ → costruito in M3 su `/roi`, la
  ventiseiesima rotta;
- ~~mancano stress per reparto, alert precoce e selettore trimestre nella
  dashboard HR~~ → costruiti in M3 con la migrazione dell'area HR;
- ~~importi non formattati in svizzero (6 scritti a mano all'italiana, 9
  `toLocaleString()` senza locale, che a schermo escono in formato en-US)~~ →
  **chiuso a fine M3**: tutte e cinque le aree passano da `format.ts`;
- ~~**quattro** coppie giorno/data sbagliate — non cinque — tutte in
  `ProSessioni.jsx` e tutte con lo stesso scarto di un giorno: è il calendario
  2025 con l'anno riscritto a mano~~ → sparite in M2 con la lista che le
  conteneva;
- ~~link di menu che porta a una pagina inesistente~~ → chiuso in M0;
- ~~marchio a metà, aziende e cliniche reali, `/admin` aperto~~ → chiuso in M0.

### Milestone previste

Il piano completo è in `CLAUDE.md` §4. In breve:

| | Milestone | Stato |
|---|---|---|
| M0 | Messa in sicurezza | **fatta** |
| M1 | Fondamenta tecniche | **fatta** |
| M2 | Il contratto dati | **fatta** |
| M3 | Migrazione area per area + calcolatore ROI | **fatta** |
| M4 | Report scaricabile | **fatta** |
| M5 | Verso la produzione (differibile) | **in corso** — a–e chiusi; f in attesa di input dei founder sulla residenza dei dati |

## Decisioni chiuse

Decisioni dei founder, con la data in cui sono state prese. Alcune le eseguirà una
milestone, ma la decisione è un fatto a sé e va trovata qui senza dover leggere
`CLAUDE.md` per intero. La regola vive lì; qui restano la data e il motivo.

- **14.08.2026 — La risposta sul margine si riscrive sul divario fra sessioni
  incluse ed erogate** (`docs/PITCH.md`). Diceva che il margine viene dal
  co-payment e teneva nella stessa frase i CHF 28 incassati e i CHF 70–80 pagati
  al professionista: chi ascolta fa la sottrazione e sente l'opposto di ciò che
  la frase vuole dire. Ora è il **12%** — 142 sedute su un monte di 1'200 — che è
  anche l'unico dei tre numeri già a schermo, e il co-payment è il deterrente che
  tiene il consumo dentro il cap. Il testo sta in `PITCH.md`, che è il suo
  mestiere; qui restano la data e il motivo. La stessa parafrasi viveva in cinque
  punti fra documentazione e commenti, corretti il 15.08.2026.

- **14.08.2026 — La demo si presenta in italiano, e il selettore si mostra senza
  usarlo** (`docs/PITCH.md`). Quattro sigle accese sono la prova che
  l'architettura a quattro lingue esiste, e indicarle basta: cambiare lingua
  davanti a un investitore che quella lingua la parla mette a giudizio la
  formulazione invece dell'architettura, e DE, FR ed EN non sono ratificati da
  una revisione madrelingua — che è la voce aperta qui sopra.

- **12.08.2026 — Le guardie di rotta, in due stadi** (`CLAUDE.md` §4,
  `CONTRATTO-DATI.md` §6). La proposta prima dell'esecuzione, ed è il primo
  blocco di M5 con quella forma: il modello di impersonificazione andava
  scelto, non scritto mentre lo si costruiva.

  **Approvato il modello della porta che concede**: entrare in un portale
  assegna il ruolo, e la negazione si raggiunge con una manopola di sviluppo.
  Nasce da un fatto emerso provando i modelli — sotto i tre vincoli del §4, in
  demo **nessuna guardia può negare niente** — quindi il criterio è diventato
  rendere vera e verificabile la guardia che servirà in produzione, invece di
  fingere di bloccare oggi.

  **Approvata `react-router` 7 subito**, prima delle guardie, con l'argomento
  vero: il router si tocca una volta sola. Le due advisory non ci riguardavano.

  **Approvata la riscrittura del §6 del contratto**, che teneva
  l'autenticazione, i ruoli e le guardie fuori dall'interfaccia: la sessione
  entra, `UserRole` prende un secondo mestiere, e la posizione vecchia resta
  citata perché chi scrive il backend veda l'evoluzione e non solo l'esito.

  **Lo stato di accesso negato ha due uscite**, ed è una decisione: un accesso
  negato senza via d'uscita è il vicolo cieco del §10 anche quando solo lo
  sviluppo può raggiungerlo.

- **12.08.2026 — Due cambiamenti di comportamento su `src/components/ui/`, e
  uno rifiutato** (`CLAUDE.md` §3, §6.1). Presi all'apertura del blocco c) di
  M5, perché **un cambiamento di comportamento su un file congelato non si
  prende mentre lo si scrive**.

  **La guardia di `useFormField` si ripara** invece di restare documentata: il
  controllo stava dopo l'uso che doveva proteggere e il default del context era
  truthy, quindi non scattava mai. La cornice è l'argomento del toast alla
  rovescia — lì si rimosse perché una copia rotta non è una copia buona, qui si
  ripara perché la riparazione costa tre righe, e `form.tsx` diventa per la
  prima volta davvero l'ultima copia buona che il §3 dichiara di tenere.

  **L'anello di focus dei CTA pieni si chiude in `button.tsx`**, con il
  `ring-offset` e con **una modifica alla base del componente, non dodici
  rattoppi ai call site**. Chiude il residuo del blocco a).

  **La terza è stata rifiutata dallo stesso blocco**, e vale quanto le due
  concesse: `FormMessage` e `FormLabel` rendono l'errore a 3.76:1, e invece di
  correggerli dentro `ui/` la validazione è stata costruita **senza**
  `form.tsx`. Da qui la previsione del §3 che dava `form` per usato in M5 è
  corretta con la sua data.

- **12.08.2026 — La nota di sessione vuota non si salva** (`CLAUDE.md` §10.D,
  `CONTRATTO-DATI.md` §3). "Salva nota" è spento finché i tre campi sono vuoti
  al trim, **e non c'è nessun messaggio d'errore**: non c'è niente da segnalare
  finché non si è scritto niente. La ragione è di contratto e non di gusto —
  `ProfessionalSession.hasNote` esiste perché le proiezioni sappiano che una
  nota c'è, e una nota vuota lo renderebbe vero su un fatto che non esiste: è
  il §5.5 applicato a un booleano invece che a un numero.

- **10.08.2026 — Riunione founder: tre ratifiche e tre esecuzioni rimandate.**
  Le regole vivono in `CLAUDE.md`, come sempre; qui restano la data e il motivo.

  **Ratificati i totali di carriera dei cinque professionisti** (`CLAUDE.md`
  §8) — 340, 285, 312, 210, 0 — che erano nel dataset e non fra le cifre
  ammesse, e che `CONTRATTO-DATI.md` §7 dava "in attesa di ratifica". La somma
  1'147 è la KPI del back-office e si somma dai cinque. Restano dichiarati:
  solo la Dr.ssa Meier ha un'agenda dietro cui rispondere, e solo lei è
  sorvegliata da un guardrail.

  **Ratificata la collocazione dentro la banda dei compensi** (`CLAUDE.md` §9):
  con una valutazione la tariffa la segue, senza valutazione è la tariffa
  d'ingresso a metà banda, CHF 75. Serviva perché la Dr.ssa Keller ha
  `rating: null` — da un `null` non si scende e non si sale — e la sua era
  l'unica tariffa del dataset senza un motivo dichiarato.

  **Le 8 ore settimanali minime entrano fra i numeri ufficiali** (`CLAUDE.md`
  §9). Verificate sul Business Plan prima di trascriverle: **p.11, parte C1**,
  *"disponibilità min. 8h/settimana"*. È un dato del BP, non una stima, e sta
  sulla stessa riga delle due condizioni da cui la demo deriva "prenotabile".

  **Il debito AA si chiude portando le CTA su `primary`** (`CLAUDE.md` §6.1), e
  la voce esce dalle decisioni in sospeso. Scurire `--secondary` avrebbe
  cambiato di luminosità ogni schermata già approvata, mentre spostare le CTA
  lascia al teal il suo mestiere — dati positivi e accenti. **Si esegue in una
  passata dedicata**, e l'inventario autoritativo dei punti lo produce lei: il
  conteggio di oggi è ~~dell'ordine di **9 punti su 7 file**~~, contro i 19 su
  11 della prima rilevazione, ma **dipende dal criterio** e va riletto con il
  criterio in mano — sotto.

  → **L'inventario autoritativo è 13 punti su 9 file**, prodotto dalla passata
  di palette come questa voce prevedeva: sta in "La passata di palette
  (10.08.2026)". Il 9/7 resta barrato e non cancellato perché è la stima del
  giorno della riunione, ed è il terzo dei tre numeri — 19/11, 9/7, 13/9 — che
  hanno reso necessario scrivere un criterio. Una lettura veloce lo prendeva
  per il conteggio buono.

  **In una build "demo" i guardrail loggano invece di tacere** (`CLAUDE.md`
  §5.6). Il build che si porta al pitch è di produzione, quindi oggi tacciono
  tutti: `DEMO_TODAY` spostata di mese è il caso che l'ha fatto emergere.
  **Passata dedicata pre-pitch, non M5**, insieme alla checklist pre-pitch
  consolidata.

  **`Intl.ListFormat` entra in M5** (`CLAUDE.md` §4). Le liste sono la terza
  cosa che cambia col locale dopo date e valuta, e `format.ts` non le tratta.
  → **Eseguito da M5.e**, tranche 1a: `formatList` lo chiama e la chiave
  `t.common.listSeparator` è sparita con il suo ultimo chiamante — era sbagliata
  anche in italiano, perché un separatore non produce una congiunzione.

  **Il piano "Personalizzato" resta in sospeso**: la riunione non l'ha
  discusso, e il suo trigger è il listino a moduli.

  **Il criterio con cui si contano i punti della CTA**, perché la prossima
  rilevazione non produca un terzo numero dopo 19/11 e 9/7. Si contano i punti
  che **rendono** bianco su teal, e si dichiara di ognuno se è correggibile:
  i **call site** che scelgono `variant="secondary"` su `Button` e `Badge` —
  correggibili, ed è lì che si interviene; le **definizioni** di quelle
  varianti in `button.tsx` e `badge.tsx` — **non** correggibili, perché
  `src/components/ui/` è congelato (§3), quindi si cambia la variante scelta e
  non la variante; `KPICard`, che è fuori dal congelamento e la cui variante si
  può toccare; e `FlexiblePlanCard.jsx`, **escluso**, codice morto del piano
  nascosto. È la differenza fra contare le sorgenti e contare le occorrenze, ed
  è ciò che ha prodotto due numeri diversi sullo stesso codice.

- **10.08.2026 — Il selettore del trimestre entra in `/hr/report`, e il PDF
  porta anche attivi e sessioni** (`CLAUDE.md` §10.C.3). Due decisioni di scope
  prese insieme all'apertura di M4, perché la seconda dipende dalla prima.

  **Il selettore**: la pagina report mostrava il solo trimestre corrente, mentre
  la dashboard sceglie da M3. Un report trimestrale che ne mostra uno solo è
  monco, ed è anche la UI minima che rende eseguibile il guardrail del §5.6 —
  «il trimestre del PDF è quello mostrato» non è verificabile se il trimestre
  non si può cambiare. Le alternative sono state scartate con un motivo:
  spostare il pulsante sulla dashboard contraddice il §10.C.3, che lo colloca
  sul report; condividere la selezione fra le due schermate è architettura che
  nessuno ha chiesto.

  **Il contenuto del PDF**: le sei metriche del report **più attivi e sessioni**
  dello snapshot. Nessun numero nuovo — è dato del provider che la dashboard già
  mostra — e un allegato per il consiglio senza "quante persone l'hanno usato" è
  più povero della dashboard che riassume. **La pagina a schermo non cambia**:
  si allarga solo la vista di stampa.

- **08.08.2026 — Il pulsante "Approva" del back-office si toglie**
  (`CLAUDE.md` §10.E). Nel dialogo dei professionisti chiudeva il dialogo e
  basta, come "Salva nota" prima di M2. **Non diventa una mutation**: è l'unica
  scrittura del back-office, la scrittura vera arriverà con le guardie di ruolo
  di M5, e un pulsante che finge di approvare un professionista è peggio di
  nessun pulsante. Rimozione di scope, quindi la decisione è dei founder (§2.6).

- **08.08.2026 — Il portafoglio clienti è ratificato, e Betulla passa
  all'Essenziale** (`CLAUDE.md` §8). M0 aveva congelato i cinque nomi ma non
  organici e piani, che erano ancora quelli di base44 e da cui discende ogni
  totale del back-office. Ratificati con i nove valori nuovi — date di ingresso
  e iscritti. Betulla lascia il Plus perché 85 dipendenti contraddicevano
  `/pricing`, che quel piano lo dichiara per aziende da 100 a 300, e a schermo si
  legge **"in attivazione"**: su una schermata che un investitore può vedere
  "inattiva" si legge come abbandono, mentre il caso è un contratto firmato due
  mesi prima della demo.

- **08.08.2026 — Il quinto professionista, in verifica** (`CLAUDE.md` §8). La
  Dr.ssa Keller esiste per mettere a schermo il **flusso di vetting**, non per
  aggiungere offerta: senza di lei la KPI "in verifica" mostra zero e la
  piattaforma sembra non controllare nessuno. Scegliendo il cognome è emersa una
  regola che vale oltre il caso: **per le persone il cognome comune è più sicuro
  di quello raro**, al contrario che per i luoghi. *Steiner* e *Balmelli* hanno
  restituito ognuno uno psicologo FSP reale e identificabile in Ticino alla
  prima ricerca; *Keller*, *Galli* e *Brunner* nessuno. La prova è cercare
  cognome + professione + cantone.

- **08.08.2026 — Le voci morte del footer perdono l'affordance da link**
  (`CLAUDE.md` §10). "Chi siamo", "Contatti", "Carriere", "Blog" e i tre
  documenti legali erano `<p>` con `cursor-pointer` e hover: non link rotti in
  senso tecnico, ma a schermo si comportavano da link e non portavano da nessuna
  parte — che è la definizione di vicolo cieco del §10, ripetuta su tutte e
  quattro le rotte pubbliche. Costruire le pagine sarebbe scope nuovo (§2.6),
  quindi si toglie l'affordance e il testo resta come **elenco di sezioni
  previste**. Privacy policy, termini di servizio e cookie policy veri sono
  lavoro di M5, insieme alle quattro pagine istituzionali.

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

- **07.08.2026 — Una prenotazione non fa salire `used`** (`CLAUDE.md` §10.B). Il
  §10.B chiedeva che prenotando "il contatore salga", e letto alla lettera
  avrebbe portato 3/10 a 4/10. Ma `used` conta le sedute **erogate** — è la
  definizione della tabella KPI di `CONTRATTO-DATI.md` §3, ed è la stessa
  funzione che alimenta il co-payment dell'elenco pazienti — mentre una
  prenotazione nasce `scheduled`. Farlo salire sarebbe un secondo numero pinnato
  sullo stesso fatto (§5.5) e direbbe al dipendente che ha consumato una seduta
  che non ha ancora fatto. A muoversi è la parte in programma: *"3 su 10 sessioni
  usate · 1 in programma"*. Da qui due guardrail dell'area dipendente — `used`
  invariato dopo una prenotazione, e nessun numero HR che si muove.

- **07.08.2026 — Il 👋 della home dipendente si toglie** (`CLAUDE.md` §7). Era
  l'unica emoji rimasta nel codice e l'unico punto in cui il registro consumer
  avrebbe potuto giustificarne una. I founder hanno deciso di non fare
  l'eccezione: il calore lo fa il copy, e un'emoji che lo sostituisce rende
  infantile un registro che il §7 vuole caldo. Chiude la voce che stava fra le
  decisioni in sospeso; il §7 non ha più eccezioni.

- **07.08.2026 — Il terzo blocco di M3 è l'area pubblica intera** (`CLAUDE.md`
  §4, §10.A). Non il solo `/roi`: landing, prezzi e richiesta demo entrano nello
  stesso passaggio. Erano l'unica parte del §10 che nessun blocco di M3
  reclamava, e restarci fuori aveva una conseguenza concreta — i **tre
  disallineamenti delle card prezzi** elencati qui sopra fra i difetti noti di
  M0 dicono "restano così fino a M3", ma M3 non prevedeva la passata che li
  chiude. Si chiudono facendo leggere le card da `Plan`: corretti a mano
  resterebbero tre righe di JSX che la prima riscrittura riapre.

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

  *(I 47 sono il conto di quel giorno: `src/components/ui/` ne aveva 48, 47
  componenti più l'hook `use-toast`. La rimozione del toast, decisa poche ore
  dopo, ne ha tolti tre e ha lasciato i **45** di oggi. Le due cifre non sono in
  disaccordo, contano lo stesso albero prima e dopo.)*

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

- **Il protocollo clinico e il referente non esistono, e il prodotto ne ha
  bisogno prima degli utenti** (15.08.2026). Il §2.6 di *"Dubbi Business per
  CEO"* — verificato aprendo il documento prima di scrivere questa voce — è la
  **quarta delle sei domande prioritarie** e la pone così: l'Head Medical
  Network è previsto a T2 mentre i pilot con pazienti veri partono in Fase 1,
  quindi «dal primo giorno in cui un dipendente parla con uno psicologo tramite
  KORA, qualcuno deve essere responsabile della qualità clinica e dei protocolli
  di emergenza (es. ideazione suicidaria durante una sessione: chi viene
  allertato, con quale procedura?)».

  **Cosa manca nel prodotto**: nessun percorso di presa in carico urgente, il
  check rapido accetta il valore peggiore senza che succeda niente, la chat del
  medico non rileva il rischio e non espone numeri d'emergenza. Il perimetro sta
  in `CONTRATTO-DATI.md` §8.1, che lo mette **primo** perché non è una funzione
  ma una condizione per operare.

  **Il trigger è prima del primo utente attivo**, non prima del primo contratto,
  ed è la formula del documento stesso: il rischio nasce con la prima persona
  che parla con uno psicologo attraverso la piattaforma, non con la firma. Serve
  «almeno un medico/psicologo senior come advisor con questo ruolo formalizzato».

  Questa voce esiste perché `docs/PITCH.md` dichiara già che il percorso non c'è
  e che la demo non lo simula: era un'affermazione senza corrispettivo nel
  repository, ed è la stessa asimmetria che questa serie ha chiuso altrove.

- **La revisione madrelingua dei tre dizionari non è stata fatta, e non ha né
  proprietario né data** (15.08.2026). Le tre tranche di M5.e dichiarano tedesco,
  francese e inglese **verificabili e presentabili, non ratificati**, e nessuna
  dice da chi né quando: con quattro lingue a schermo e un selettore pubblico è
  la voce aperta con l'esposizione più alta.

  **Proprietario: i founder** — è una scelta di lingua e di registro, non di
  codice, e le domande da portare alla revisione sono già nominate in testa a
  ogni dizionario (quattro in `de.ts`, cinque in `fr.ts`, cinque in `en.ts`).

  **Il trigger: prima di qualunque presentazione non in italiano.** Finché non è
  fatta, `docs/PITCH.md` dice cosa si fa in sala — il selettore si mostra come
  prova che l'architettura esiste, la lingua non si cambia.

  **Il blocco sugli stati limite ha aggiunto chiavi dopo le tranche**, e vanno
  lette insieme al resto: `overCapWithoutPrice` riscritta, più
  `hr.report.downloadError`, `professional.payments.weeksEmpty` e `.payoutsEmpty`
  nuove, in tutte e quattro le lingue. L'elenco con il testo sta nella sintesi di
  quella passata.

- **Residenza dei dati: la UI la promette, la decisione commerciale non è
  presa** (founder, 11.08.2026). Il §2.1 di *"Dubbi Business per CEO"* dà la
  promessa come **domanda ancora aperta**: verificato aprendo il documento
  prima di scrivere questa voce, dice che i dati si possono tenere legalmente
  in UE, che serve l'avvocato per il minimo legale e il CEO per il minimo
  commerciale, e che va chiarito **prima del primo pilot** — *"rinegoziare un
  contratto firmato è molto peggio che spostare dati"*. Compare anche fra le
  domande da chiudere in fondo al documento.

  **Quante stringhe la promettono, con il criterio**, perché è la cifra che
  servirà il giorno in cui vanno cambiate e non deve produrne una seconda:
  in `src/lib/i18n/it.ts` sono **5** le stringhe che nominano la **residenza**
  — "Hosting in Svizzera" o "server in Svizzera" — cioè il titolo e il corpo
  del riquadro privacy della landing, il footer, la riga di conformità
  dell'hero e il badge. **Altre 6 promettono conformità LPD/GDPR o
  "piattaforma svizzera" senza dire dove stanno i dati**, fra cui
  l'informativa in fondo alla richiesta demo: sono adiacenti e vanno rilette
  quel giorno, ma non sono la stessa promessa e **non si sommano alle prime
  cinque**. Sono 5 + 6, non 11, e nemmeno 6.

  **Per la demo va bene così e non si tocca niente.** La promessa è coerente
  con il prodotto che il pitch racconta, ed è la stessa coerenza per cui il §3
  self-hosta i font invece di chiamare i server di Google: una richiesta a
  runtime verso l'estero contraddirebbe la frase mentre la si mostra.

  **La voce esiste per il momento dopo**: il primo contratto non si firma con
  una promessa non ratificata, e chi lo scriverà deve sapere che quelle cinque
  stringhe non sono una decisione presa. Il giorno in cui il minimo
  commerciale è deciso, o si conferma la Svizzera o **le cinque stringhe
  cambiano** — sono in `i18n`, quindi è un file solo, che è esattamente il
  motivo per cui il §2.7 non le vuole cablate nei componenti.

- **Piano "Personalizzato" della pagina prezzi.** Nascosto in M0 in attesa della
  decisione del CEO: gli undici prezzi dei moduli non sono nel Business Plan, gli
  sconti a volume nemmeno, e a 150 dipendenti la preselezione esce a **CHF 38** —
  identico all'Essenziale — offrendo medico virtuale illimitato e check-up annuale
  che l'Essenziale non ha. Verificato alla cifra.
*(Erano in sospeso anche l'emoji nel saluto della home dipendente, decisa il
07.08.2026 — si toglie — e la **palette con la CTA verde piena**, decisa il
10.08.2026 — le CTA passano su `primary`. Entrambe fra le decisioni chiuse, ed
entrambe **eseguite**: la palette dalla passata dedicata dello stesso 10.08.2026,
13 punti su 9 file. ~~La seconda resta da eseguire~~ era vero per le poche ore
che separano la riunione dalla passata.)*

## Migliorie rimandate al refinement

Cose **giuste in produzione e sbagliate nella demo**, che è una distinzione a
sé: non sono difetti da chiudere né decisioni in sospeso, sono pattern che
aspettano dati veri. Vanno riprese quando l'MVP ha la sua prima disponibilità
reale.

- **Professionisti non disponibili in grigio invece che nascosti.** Oggi chi
  prenota vede i soli prenotabili e gli altri non compaiono; il pattern
  corretto, con agende vere, è mostrarli **disattivati** — chi cerca una
  persona specifica capisce che esiste ed è occupata, invece di concludere che
  non è nella rete.

  **Nella demo non si può fare**, e per due ragioni distinte. L'unico
  professionista non prenotabile è la **Dr.ssa Keller**, che è in verifica:
  mostrarla in grigio direbbe "occupata" di qualcuno che non è ancora nella
  rete, cioè la cosa sbagliata. L'alternativa sarebbe inventare uno stato
  tutto-occupato sui quattro veri, e quello **contraddice il Business Plan
  davanti a un investitore**: la promessa è "primo appuntamento entro 24 ore,
  nessuna lista d'attesa", e una schermata di caselle grigie la smentisce nel
  momento in cui la si sta vendendo.

  Da rifare quando esistono disponibilità reali: allora il grigio dirà una cosa
  vera, e la promessa la sosterranno i dati invece di una schermata costruita.

## Note per chi riprende

- **`reference/` non c'è più**, cancellato alla chiusura di M3: era il magazzino
  di sola lettura della vecchia demo Next, e la sua cancellazione è la prova che
  il §4 chiedeva. Resta nella storia di git. Quello che ne è uscito, e come:
  `format.ts`, `dates.ts` e `roi-model.ts` copiati in M1 perché file puri già
  verificati; `people.ts`, `scheduling.ts`, `professional-portal.ts` e `roi.ts`
  come struttura in M2; `i18n/it.ts` **una chiave alla volta**, mentre M3
  migrava la schermata che la usava. `provider.ts` e `types.ts` sono stati
  **letti come specifica e riprogettati**, non copiati: quel provider era
  sincrono per scelta e la reattività passava da un contatore di versione, che
  con react-query non convive. `use-data.ts` non è mai entrato.

  **La lezione che vale oltre il caso**: il rischio non era copiare troppo poco,
  era cominciare copiando e accorgersene a metà — lo stato in cui, secondo il
  §5.7, viene il pensiero "conviene rifarlo pulito". Vale per qualunque sorgente
  si erediti in futuro.
- **Il passaggio alla produzione avviene in questo repository**, sostituendo
  `lib/data/mock/` con `lib/data/http/` dietro la stessa interfaccia
  (`CLAUDE.md` §5.7). Se viene il pensiero di ricominciare da capo con un repo
  nuovo, è il segnale che il seam non ha tenuto: va riportato ai founder.
- Ogni milestone chiude con una demo che funziona da capo a fondo (`CLAUDE.md`
  §2.3). Se una migrazione non entra in una sessione, si chiude l'area corrente e si
  comincia la prossima dopo, mai a metà.
- ~~Un `✓` testuale in `Psicologi.jsx`~~ → sostituito con l'icona lucide quando
  M3 ha rifatto la prenotazione, insieme al `bookingStep` morto. Era l'unico
  caso in `src/`.
