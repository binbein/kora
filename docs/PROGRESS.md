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
- **La data di un verbale e di una correzione è quella di `date` sulla macchina
  al momento del commit**, non quella che la sessione ricorda — verificata con
  `git log -1 --format='%ci'` prima di scriverla. Sono due comandi, e servono
  perché l'errore è già arrivato **in tutti e due i versi in due giorni**: tre
  passate datate un giorno avanti, e quella che le correggeva datata un giorno
  indietro. Una sessione lunga ricorda il giorno in cui è cominciata, o quello
  di cui ha appena scritto per un'ora, e nessuno dei due è necessariamente oggi.

### Come una passata conta i propri commit

Quasi ogni voce di questo file si apre dichiarando quanti commit ha, e finora
quel conteggio non aveva un criterio scritto — a differenza dei call site
(`CLAUDE.md` §5.6) e dei `.jsx` (`CLAUDE.md` §3), che ce l'hanno e per questo
hanno smesso di divergere. Il criterio, deciso dai founder il 15.08.2026, **con
la conclusione a cui è arrivato il 19.08.2026: il verbale non scrive più né il
totale né la ripartizione, e il conto lo fa git.**

- **codice** è `feat:`, `fix:` e `refactor:`; **documenti** è `docs:`. Non ci
  sono altre categorie, e un commit sta in una sola;
- **si conta sul branch, a chiusura avvenuta**, non a memoria e non durante:
  `git log --format='%s' <merge>^..<merge>^2` elenca esattamente i commit della
  passata, e `| sed 's/:.*//' | sort | uniq -c` ne dà la ripartizione;
- ~~**se si scrive la ripartizione si scrive anche il totale, dalla stessa
  misura.**~~ → **non si scrive né l'una né l'altro** (19.08.2026), e la ragione
  per cui la clausola era nata resta vera: il difetto che ha fatto scrivere
  questa regola aveva il **totale giusto e la ripartizione sbagliata** —
  «cinque commit di codice e uno di documenti» su un branch di tre e tre — ed è
  la firma di due numeri presi in due momenti. Un solo comando li dà entrambi;
  il punto è che **nel verbale non ci vanno**;
- **il commit di chiusura conta sé stesso**, quindi il numero della sua
  sottosezione era l'unico che non si poteva misurare mentre lo si scriveva: si
  scriveva `n + 1`, cioè si prediceva. Ne discese l'obbligo di chiudere il
  buco — **chi aggiunge un commit dopo la chiusura aggiorna quel numero nello
  stesso commit**, perché da lì in poi la predizione era falsa. *(Clausola aggiunta il
  15.08.2026 dalla seconda passata che ha usato il criterio, ed è il buco che ha
  trovato usandolo: la sua sottosezione dichiarò sei con cinque commit sul
  branch, ed è invecchiata appena la passata ne ha guadagnato un settimo.)*
- **E se nessuno lo aggiorna, la predizione resta scritta**: è successo il
  17.08.2026, alla prima passata in cui qualcosa è arrivato dopo il verbale, e
  l'obbligo qui sopra c'era già. Da qui la clausola del 18.08.2026: un commit
  che arriva dopo il verbale **riapre la cifra**, e chi non se la sente di
  riaprirla ha la seconda strada — **il verbale dichiara la ripartizione e non
  il totale**, che lo dica git;
- **e da qui la conclusione, che è la sola forma che regge** (19.08.2026): **il
  verbale non conta i commit**. Dice cosa la passata ha fatto, e chi vuole il
  numero lo prende dal comando qui sopra, che lo dà per intero e in qualunque
  momento. È la stessa scelta che il `CLAUDE.md` §2.7 ha fatto per le chiavi e
  il §5.6 per i call site: **il conto lo fa chi può rifarlo da solo.**

**Perché la clausola del 18.08 non bastava, e la misura sono tre cifre
sbagliate.** Copriva il totale e lasciava scoperta la ripartizione, che è la
metà che nessuno riapre — e il totale, nell'unico verbale scritto sotto quella
clausola, non era nemmeno stato scritto. Le tre:

1. **15.08.2026** — «cinque commit di codice e uno di documenti» su un branch di
   tre e tre: totale giusto, ripartizione sbagliata, due numeri presi in due
   momenti;
2. **17.08.2026** — il conteggio che diventa un guardrail dichiarò **sei**
   commit; `06a1b88` è arrivato dopo il verbale e nessuno è risalito a riaprire
   la cifra. Corretta il giorno dopo, dalla clausola che ne è nata;
3. **18.08.2026** — l'annullamento visibile dichiarò «`feat:` ×3, `fix:` ×1»
   sulle due PR insieme, e i `fix:` erano **tre**. Era già sbagliata **alla
   riapertura** — `6a056c6` stava dentro #65 dal principio — e lo è diventata di
   due quando `eff29d8` è arrivato dopo il verbale. È la clausola nuova
   smentita dal primo verbale che l'ha usata, sulla metà che non copriva.

**Tre non è una distrazione: è una proprietà del modo in cui si contava.** Una
cifra che vive nella prosa può essere rinfrescata solo da una persona, e
riaprirla è una promessa di tornare — la stessa promessa che il §2.7 del
`CLAUDE.md` ha visto non mantenere da chi il numero giusto l'aveva appena
misurato. Tolta la cifra, non c'è niente da riaprire.

Vale da questa passata in avanti, **che è anche la prima scritta nella forma
nuova**. Le voci più vecchie non si riscrivono: sono verbali, e un conteggio
sbagliato che qualcuno trova si corregge lì con la sua data, come è stato fatto
per quello del residuo della nota di sessione.

## Stato

**M0, M1, M2, M3, M4 e M5 sono chiuse: il piano non ha più milestone aperte.** La
demo è condivisibile e **tutte e
cinque le aree leggono dal provider**: nessuna schermata dichiara più le proprie
costanti, le stringhe stanno in `i18n`, ogni importo passa da `format.ts` e ogni
data da `DEMO_TODAY`. Le rotte sono 26, il repository è nostro — niente base44,
zero richieste esterne a runtime — e `reference/` è stato cancellato, che era la
prova che M3 fosse davvero finita.

**Cinque blocchi di M5 su sei sono stati eseguiti** — accessibilità, stati di
errore e vuoto, validazione dei form, guardie di rotta e **le altre tre lingue**:
la demo parla italiano, tedesco, francese e inglese, e il selettore le mostra
tutte e quattro. **Il sesto, le pagine del footer, è stato ritirato dallo scope
della demo** il 15.08.2026, **e il suo lavoro è passato al perimetro dell'MVP**,
che ha la sua sezione in fondo ai refinement: non è cancellato, ha cambiato
milestone. Da lì **M5 è chiusa e non ha più niente di aperto a schermo**.

**M5 è l'ultima milestone del piano, e si articola in sei blocchi** approvati
dai founder l'11.08.2026 — accessibilità, stati di errore e vuoto, validazione
dei form, guardie di rotta, le altre tre lingue, pagine del footer. **I blocchi
restano sei**: è così che la milestone è stata approvata, ed è il numero su cui
altre righe di questo file e del contratto dati hanno misurato davvero. A
cambiare non è il conto, è che uno dei sei **non si costruisce qui**. Stanno in
`CLAUDE.md` §4 con le dipendenze e le decisioni che ognuno porta con sé;
**ognuno chiude con una demo funzionante** (§2.3), quindi non è un cantiere
unico che resta aperto fino alla fine.

**Le PR di M5 sono la milestone e non entrano nel conto delle passate di
refinement.** Vale il criterio già scritto in quella sezione, che esclude la
milestone: M4 è #19 e ha la sua sezione, e i blocchi di M5 hanno la loro qui
sotto. **Il conto vive in un posto solo**, la sezione «Refinement fra le
milestone», ed è lì che si legge: questa riga non lo ripete.

**Ha già sbagliato due volte a ripeterlo**, ed è la ragione per cui ora non lo
fa. Dichiarava **undici** mentre la sezione diceva tredici; corretta a
**diciassette**, è tornata a divergere in tre giorni, perché la sezione è salita
a venti e nessuno è risalito fin qui. Erano ogni volta due misure dello stesso
insieme prese in due momenti — il difetto che questo file racconta di aver già
avuto con le CTA e con i guardrail — e la seconda correzione lo ha ripetuto
mentre scriveva, nella stessa frase, che il numero non si ripete. **Il rimedio
non era allinearlo meglio: era toglierlo** (founder, 15.08.2026).

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. Il magazzino della precedente demo
Next.js è vissuto in `reference/` fino alla chiusura di M3 e resta nella storia
di git; il suo repository è archiviato e non si tocca. I PDF del Business Plan
stanno in `docs/` dal 07.08.2026 (decisione qui sotto), ma restano una fonte da
consultare: le cifre ammesse sono solo quelle trascritte in `CLAUDE.md` §8 e §9.

**M4 è chiusa**: da `/hr/report` si scarica un PDF di una pagina per il
trimestre scelto — e da **16.08.2026 quella pagina è verificata**, non promessa:
prima il controllo restituiva un numero che valeva sempre uno. Da lì il lavoro è **refinement fra le milestone** — passate
che non aggiungono schermate e mettono in ordine layer dati, seam e dizionario;
la sintesi sta nella sezione dedicata, sotto M4.

~~**La prossima milestone è M5.**~~ → **M5 è chiusa**, e con lei il piano: la
riga lo dice cinquanta righe più su. *(Barrata il 17.08.2026. Era vera il
giorno in cui è stata scritta ed è sopravvissuta alla chiusura, nel punto che
chi riprende legge per primo — la stessa forma della versione del router nel
`CLAUDE.md` §3, e lo stesso posto: la sezione che orienta prima di tutte le
altre. A trovarla non è stato un conteggio, perché qui non c'era un numero;
l'ha trovata la riga che la smentisce, come per le passate di refinement.)*

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

  **Resta aperto, e dal 17.08.2026 smette di *sembrare* un errore**: la
  riorganizzazione della dashboard ha messo il selettore dentro una cornice
  insieme ai soli otto elementi che lo seguono, e questa tabella è finita fuori,
  dove il suo titolo — "ultimo mese" — è la cosa che ci si aspetta di leggere. La
  posizione ha tolto la contraddizione apparente; **il difetto è dov'era**.
- **L'elenco dipendenti è un estratto di otto righe su 120**, dichiarato a
  schermo e in `CONTRATTO-DATI.md` §7. ~~La paginazione è M5.~~ → **non era di
  M5**, e nessuno dei sei blocchi la contiene: è lavoro dell'MVP, dichiarato in
  `CONTRATTO-DATI.md` §8, gruppo «Paginazione», dalla passata del 15.08.2026.

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
- ~~**Il calendario del professionista mostra solo la settimana corrente.**
  Prenotando oltre il 27.09 la seduta compare nelle sedute in programma e non
  nella griglia. Non è un difetto di questa passata — il calendario è di M2 e non
  ha navigazione fra settimane — ma è la ragione per cui la prova a schermo è
  stata fatta due volte, una dentro la settimana e una fuori.~~ → **chiuso il
  18.08.2026**: il calendario si sposta di settimana, senza limiti, con il
  ritorno a oggi in un clic. Il seam c'era dai tempi di M2 e non era mai stato
  usato — `weekGrid` prende la settimana mostrata e oggi come due parametri
  distinti — e a chiuderlo è stata la contraddizione fra due schermate dello
  stesso portale: l'elenco pazienti dichiarava una prossima seduta che il
  calendario non poteva raggiungere. Il racconto sta nella passata del
  18.08.2026, in fondo alla sezione refinement.

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
  decisione dei founder dell'08.08.2026. ~~**Privacy policy, termini e cookie
  policy veri sono lavoro di M5**, insieme a "Chi siamo", "Contatti", "Carriere"
  e "Blog".~~ → **non più di M5** dal 15.08.2026: il blocco f) è stato ritirato
  dallo scope della demo e **il lavoro è passato al perimetro dell'MVP**, che ha
  la sua sezione in fondo ai refinement. L'elenco di sezioni resta com'era.

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
  decisione dei founder qui sotto. ~~La scrittura vera dell'admin arriva con le
  guardie di ruolo di M5.~~ → **non è arrivata con loro** (corretto il
  02.09.2026): le guardie sono state scritte il 12.08.2026 e non hanno portato
  nessuna scrittura del back-office — `provider.ts` non ne ha una, e la tabella
  delle mutation del `docs/CONTRATTO-DATI.md` §4 non ne elenca nessuna. È
  **lavoro dell'MVP** (`docs/CONTRATTO-DATI.md` §8), e il rimando è al perimetro
  e non a un gruppo perché **nessuno dei dodici la nomina**: §8.3 ha
  l'onboarding dell'azienda e §8.6 il catalogo delle strutture, l'approvazione
  di un professionista non sta né lì né altrove.
- **Anche i due pulsanti "Aggiungi" sono spariti con questa passata**, e la
  ragione è la stessa dell'"Approva": `AdminAziende` ne aveva uno e
  `AdminProvider` uno — *"Aggiungi"* e *"Aggiungi provider"* — e nessuno dei due
  faceva niente. Creare un cliente o convenzionare una struttura sono scritture
  vere, e stanno nel `CONTRATTO-DATI.md` §8.3 e §8.6, cioè fra il lavoro
  dell'MVP.

  *(Riga scritta il 17.08.2026. Il gemello "Approva" ha la sua decisione
  dell'08.08 e la sua riga qui; questi due sono usciti nello stesso commit —
  `bf116ae`, insieme ai due `.jsx` che li contenevano — **senza che niente li
  nominasse**, quindi a saperlo era solo git. È lo stesso difetto delle
  affermazioni invecchiate che questa serie di passate insegue, in negativo: lì
  una riga sopravvive al codice, qui il codice se n'è andato senza lasciarne
  una.)*
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
zero**, su **27 schermate** — il criterio che distingue rotte e schermate sta nel
`CLAUDE.md` §10, che è l'unico punto che le conta. *(Questa riga portava il
criterio — "27 rotte: le 26 più la 404" — e stava nel file che non decide: dal
15.08.2026 lo dichiara la costituzione e qui si rimanda.)*

> **Quello zero era falso di quattro nodi, dall'11.08.2026 al 15.08.2026.** I tre
> link legali e il copyright del footer stavano a `opacity-50` su `bg-primary`:
> **4.08:1** contro 4.5, e 12px è testo normale. Il verbale resta com'è perché è
> il resoconto di ciò che quel censimento misurò; a essere sbagliata non era la
> conta, era **ciò che lo strumento poteva vedere**. La spiegazione, la misura e
> la correzione stanno nella passata del 15.08.2026, in fondo ai refinement.

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

*(Diceva due, ed era vero quando è stato scritto: le manopole sono **tre**, e
la terza è `?role=`, arrivata col blocco d). Titolo e corpo restano — è un
verbale — e la spiegazione sta nel `CLAUDE.md` §4, blocco b), che è dove va
letta; il `README.md` diceva già tre. Nota aggiunta il 20.08.2026: il
18.08.2026 lo stesso fatto era stato corretto là e nel `README.md`, e questo
punto, che è il più visibile del file sull'argomento, era rimasto indietro.)*

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
| `/plans` | strumento | `null` | `EmptyNotice` `public.plans.empty` | `ErrorNotice` sotto la nav |
| `/demo` | strumento | — | — | `ErrorNotice` `public.demoRequest.error` sotto il pulsante |
| `/employee` home | consumer | `null` | frase esistente sugli appuntamenti | `ErrorNotice` di pagina |
| `/employee` contatori | consumer | `null` | — | `ErrorNotice` nella sola card |
| `/employee` check rapido | consumer | `null` | — | `ErrorNotice` `employee.state.error` sulla lettura, `…rapidCheck.error` sulla scrittura |
| `/employee/psychologists` | consumer | `null` | frase esistente sull'elenco | `ErrorNotice` di pagina |
| `/employee/psychologists` dialogo | consumer | `null` | frase esistente sugli slot | `ErrorNotice`, e `…dialog.error` sulla prenotazione |
| `/employee/doctor` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/employee/checkup` | consumer | `null` | `EmptyNotice` `…checkup.networkEmpty` | `ErrorNotice` di pagina, e uno nel dialogo referto |
| `/employee/ai-plan` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/employee/profile` | consumer | `null` | — | `ErrorNotice` di pagina |
| `/hr` dashboard | strumento | `null` | `EmptyNotice` `hr.quarterEmpty`, **con intestazione e selettore** | `ErrorNotice` di pagina |
| `/hr/employees` | strumento | `null` | `EmptyNotice` `hr.employees.empty`; sottotitolo tolto se manca lo snapshot | `ErrorNotice` di pagina |
| `/hr/report` | strumento | `null` | `EmptyNotice` `hr.quarterEmpty`, **senza il pulsante di download** | `ErrorNotice` di pagina |
| `/hr/billing` | strumento | `null` | `EmptyNotice` `hr.billing.invoicesEmpty` | `ErrorNotice` di pagina |
| `/hr/privacy` | strumento | `null` | — | `ErrorNotice` di pagina |
| `/professional` calendario | strumento | `null` | frase esistente sulla settimana | `ErrorNotice` di pagina |
| `/professional/sessions` | strumento | `null` | frasi esistenti sui tre pannelli | `ErrorNotice` di pagina, e `…note.error` sul salvataggio |
| `/professional/patients` | strumento | `null` | `EmptyNotice` `professional.patients.empty` *(dal 18.08.2026; qui c'era un `—`, ed era la sola casella sbagliata della tabella)* | `ErrorNotice` di pagina |
| `/professional/payments` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/professional/profile` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/professional` badge nav | — | `null` | `null` | `null` (decorativo: i tre collassano) |
| `/admin` aziende | strumento | `null` | `EmptyNotice` su clienti e su richieste | `ErrorNotice` sui due blocchi |
| `/admin/users` | strumento | `null` | frase esistente sulla ricerca | `ErrorNotice` di pagina |
| `/admin/professionals` | strumento | `null` | `EmptyNotice` `admin.professionals.empty` | `ErrorNotice` di pagina |
| `/admin/sessions` | strumento | `null` | `EmptyNotice` `professional.profile.empty` | `ErrorNotice` di pagina |
| `/admin/providers` | strumento | `null` | `EmptyNotice` `admin.checkupProviders.empty` | `ErrorNotice` di pagina |
| `/admin/analytics` | strumento | `null` | `EmptyNotice` `admin.analytics.empty` | `ErrorNotice` di pagina |
| 404 | strumento | — | — | — (non legge dal provider) |
| bootstrap | strumento | — | — | `ErrorNotice` `common.state.boot`, senza layout |

> **Quella riga confondeva lettura e scrittura, e la card non era coperta.**
> `employee.rapidCheck.error` è il fallimento del **tocco**; la **lettura** non
> aveva nessun ramo — `isError` era scartato e `undefined` faceva `return null`,
> quindi con `?fail=getRapidCheckAnswer` la card spariva dalla home in silenzio.
> Il verbale resta il resoconto di ciò che quel blocco costruì; la casella è
> stata riempita davvero il **16.08.2026**, e la riga sopra porta ora tutte e
> due le metà. *(È la stessa forma della correzione dei quattro nodi del footer:
> non la conta era sbagliata, era la cosa contata.)*

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

- ~~**I tre portali non hanno nessuna uscita verso la landing.** Censito in
  questa passata: `/employee`, `/hr` e `/professional` non hanno **nessuna
  ancora** che esca dal portale; solo `/admin` ce l'ha, dalla passata
  dell'11.08.2026. Il giro del pitch funziona lo stesso, con Indietro fra un
  portale e l'altro — è come è stato verificato — ma è lo stesso difetto che per
  `/admin` fu riconosciuto come vicolo cieco (§10), e la sua correzione fu otto
  righe e passò dai founder. **Non è stato toccato**: è scope (§2.6) e non è ciò
  che questo blocco doveva fare. `docs/PITCH.md` oggi non dice che fra un
  portale e l'altro si torna con Indietro.~~ → **chiuso da #34** il 13.08.2026,
  che ha aperto le tre uscite e riscritto `docs/PITCH.md` — che oggi dice il
  contrario, *"sei clic, e non serve il tasto Indietro"*. La passata ha la sua
  sottosezione fra i refinement.

  **Non è un difetto chiuso qui: è una voce rimasta aperta in un posto e chiusa
  in un altro**, per due giorni. Costava più delle altre della stessa famiglia
  perché sta sotto un titolo che si chiama «Aperto e dichiarato» e riguarda il
  giro del pitch: chi la leggesse preparando una prova generale crederebbe di
  dover premere Indietro fra un portale e l'altro, e cercherebbe a schermo una
  cosa che non serve più. *(Barrata il 15.08.2026. È l'unica correzione di
  quella passata che non riguarda un numero — il mandato erano le affermazioni
  vere quando sono state scritte e non più vere adesso, e questa lo è per
  intero.)*
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

**Le passate mergiate fra la chiusura di M3 e oggi, per nome**: quattro
nell'intervallo M3 → M4 (PR #15–#18), sette dopo M4 (PR #20–#24, #26 e #28),
**#34** — le uscite dai tre portali, che arriva dopo i primi quattro blocchi di
M5 — **#39**, l'overflow della landing del 14.08.2026, fra la tranche tedesca e
quella francese di M5.e, le quattro della **revisione del 15.08.2026** — #43 e
#44 sulla coerenza del dominio e sugli stati limite, #45 sul perimetro del
contratto, #46 la coda documentale che l'ha chiusa — l'allineamento del
`README.md`, il residuo della nota di sessione, gli slot sovrapposti e i periodi
non dichiarati, i fatti corretti nei documenti, il perimetro e le promesse in
sospeso, il footer fuori dalla demo, i terzi e la simmetria del footer,
l'identità collisa e gli stati limite, le simmetrie e le verifiche vere, la riga
della sessione e i criteri che si contraddicevano, le parole e il perimetro,
l'anteprima a tre pannelli e la voce Admin, la home e il medico, la cornice del
trimestre, il conteggio che diventa un guardrail, l'annullamento e l'identità,
l'allineamento fra codice e verbali, l'igiene del repository, l'annullamento
visibile con la navigazione fra settimane e il salto a data, i criteri e i
conteggi, le attese e l'ordinamento, l'ordinamento dello stato della seduta, la
rinomina delle rotte in inglese, la demo pronta, le cifre nelle
parentetiche, i rimandi del contratto, i fatti del Business Plan, il check
rapido con la soglia e i badge, il messaggio di annullamento, la chiusura
delle fasce, la griglia delle fasce, lo scope delle fasce con le mutation che
non si contano, l'allineamento fra verbali e commenti, e le parole che espongono
con le promesse che non teniamo, e la soglia di anonimato con la sottrazione che
non deve esistere, e il numero d'emergenza dove la persona dichiara di stare
malissimo, e le zero richieste esterne rese eseguibili, e **il link anonimo del
check rapido**, e **la disdetta dal lato del dipendente**, e **l'attivazione
dell'account**. Non aggiungono
schermate — **tranne il link anonimo e l'attivazione**, ed è la riga qui sotto.

**~~e non spostano un numero a schermo~~ — l'ultima ne sposta uno, ed è la prima
volta** (04.09.2026): il listino porta ora *"prima sessione entro 72 ore"*, che è
un numero **nuovo del §9** e non un dato del dataset che si muove. La distinzione
è quella del §2.4 — una cifra entra a schermo solo dopo essere entrata in §8 o
§9, con l'attribuzione — e la riga si corregge invece di restare smentita: quello
che resta vero di tutte, ed era la parte utile della frase, è che **una passata
di refinement non allarga lo scope del §10**.

**I numeri sono tre e contano tre cose diverse**, ed è la riga che mancava
accanto all'elenco (20.08.2026): le **PR mergiate** sotto il criterio in fondo
a questa sezione, le **passate**, che sono i nomi di questo elenco, e i
**verbali scritti**, che sono le sottosezioni `####` qui sotto. Nessuno dei tre
conteggi vale per gli altri due. **Il criterio non si riscrive qui**: sta dov'è,
con le sue esclusioni, e questa riga rimanda invece di duplicarlo — un secondo
criterio è la stessa cosa di un secondo elenco.

**Perché divergono, con un caso nominato per ragione.** Fra PR e passate ce n'è
una: **una passata può alimentare due PR**, e
`feat-annullamento-visibile-e-settimane` è stato riaperto dopo il primo merge —
#65 e #66 escono dallo stesso branch, e nell'elenco sono un nome solo, che
nomina il contenuto di entrambe. Fra passate e verbali le ragioni sono tre, e
insieme coprono tutti i nomi che non hanno una sottosezione:

- le più vecchie sono **nominate collettivamente** e non una per una — sono
  dentro «quattro nell'intervallo M3 → M4» e «sette dopo M4», che sono gruppi
  con un intervallo di PR e non nomi singoli;
- una passata può essere **verbalizzata dentro la sottosezione di un'altra**:
  #69, l'ordinamento dello stato della seduta, sta dentro «Le attese e
  l'ordinamento», che glielo attribuisce per data;
- una passata può **non avere un verbale da nessuna parte**, ed è la sola delle
  tre che descrive qualcosa che manca invece di qualcosa che sta altrove: #47,
  l'allineamento del `README.md`, di questo file ha cambiato la sola riga con
  cui si è aggiunta all'elenco.

**Il criterio in fondo conta PR e non passate, e non è una svista**: le sue
esclusioni sono tutte di forma PR — *una PR il cui solo contenuto è la sintesi
di una passata già mergiata*, *tocca solo `docs/PITCH.md`* — quindi un criterio
che contasse passate dovrebbe rifondarle una per una. Si lascia dov'è e si dice
cosa conta.

**Il numero è uscito da questa riga il 19.08.2026, ed è la terza volta che
invecchiava.** Diceva *"Trentatré passate"* mentre l'elenco si fermava
all'annullamento e all'identità, cioè al 17.08.2026: mancavano le tre che
seguono, e **"questa passata"** — un deittico dentro un file che cresce —
indicava ormai la penultima. Prima aveva detto cinque quando erano otto e
undici quando erano tredici. **Non è stato riportato a trentasei**: sarebbe
stata la quarta stesura dello stesso difetto, e la dottrina è già scritta —
**si cita ciò che non si muove**, che il `CLAUDE.md` §5.6 ha fissato per i
guardrail e che il perimetro dell'MVP applica nominando i gruppi invece di
numerarli. **I nomi non si muovono**, e l'elenco per nome dice la stessa cosa.
**Chi vuole una cifra dice prima quale insieme conta**: contare l'elenco non è
applicare il criterio in fondo alla sezione, e non è contare le sottosezioni —
sono tre insiemi e nessuno dei tre conteggi vale per gli altri, per le ragioni
scritte sotto l'elenco.

**Le due cifre datate restano dove sono**: il «totale — 31» della parentesi qui
sotto e quello del verbale del 17.08.2026 sono resoconti di misure fatte quel
giorno. È il criterio del `CLAUDE.md` §10 — un verbale è un resoconto datato, un
criterio è rivolto a chi verrà — e si corregge la riga viva, non il verbale.

**Fino al 17.08.2026 la riga finiva con "sono igiene del layer dati, del seam e
del dizionario", e da quella passata non è più vero di tutte.** Le due metà si
sono separate: *nessuna schermata nuova e nessun numero mosso* restava vero
dell'elenco intero — le rotte dello scope erano ancora **26**, `/admin` c'era già
e a cambiare era il link che ci porta — mentre *igiene* descriveva le prime
ventotto e non la ventinovesima, che **cambia come ci si comporta a schermo** su
richiesta dei founder. La distinzione utile non era fra igiene e prodotto: era
che una passata di refinement **non allarga lo scope del §10**.

**E quella distinzione è caduta il 06.09.2026, per decisione dei founder** — due
volte nello stesso giorno. Il link anonimo del check rapido e l'attivazione
dell'account sono **due rotte nuove**: le rotte passano a **28** e le schermate a
**29**, quindi le ultime due dell'elenco allargano lo scope del §10, che è
esattamente ciò che nessuna delle precedenti faceva.

**Non ne discende un permesso, e la riga si scrive perché non ne discenda**: una
passata di refinement continua a non allargare lo scope **di propria
iniziativa** (`CLAUDE.md` §2.6). A cambiare è chi decide, non chi esegue — la
decisione sta in «Decisioni chiuse» con la sua data — e la prova che la regola
tiene è che questa passata **non l'ha proposta**: è arrivata già approvata.

~~Le due passate del 16.08.2026 si sono dichiarate **l'ultima**, «da qui la demo
è congelata».~~ → **Non lo erano**, e non per un imprevisto: la prima è stata
smentita dalla review della propria PR, la seconda da una decisione dei founder
arrivata dopo. **Da qui non si predice più quale sia l'ultima** (17.08.2026): una
passata sa cosa ha fatto, non cosa verrà chiesto domani, ed è la stessa
distinzione fra misurare e prevedere che il criterio di conteggio in testa a
questo file tiene su un numero. Quello che resta vero, e che era il contenuto
utile di quella frase, è **dove va il lavoro quando non c'è una richiesta
aperta**: il perimetro dell'MVP (`docs/CONTRATTO-DATI.md` §8) e le decisioni in
sospeso. **Le passate che hanno una sottosezione loro sono le
sottosezioni qui sotto**, e si contano leggendole invece di fidarsi di una cifra
in prosa: la riga diceva **sette** quando erano già tredici, ed è lo stesso
difetto della testa di questo file due schermate più su — un numero scritto
accanto alla lista che lo smentisce. **Stesso difetto, misure diverse**
(20.08.2026): il «sette» conta le **sottosezioni**, cioè l'antenato di quello
che oggi si ottiene contandole, mentre la cifra in testa al file conta le
**passate**. Sono due delle quattro progressioni di questo file, e senza questa
mezza riga si leggono in fila come se fossero una sola. *(Corretta il 15.08.2026
togliendo il conteggio, non allineandolo. A trovarla non è stata la spazzata
degli avverbi, che cerca «oggi» e «ora» accanto a un numero: qui l'avverbio non
c'era, e a denunciarla è stata la lista. Chi rifà quella spazzata deve saperlo
prima — il criterio «numero + avverbio» non copre tutta la famiglia.)*

*(**Il terzo membro è il numero dentro una parentetica** (20.08.2026), e la
prova che il posto è questo — e insieme che questa riga da sola non basta — è
che **la spazzata del 19.08.2026 ce l'aveva davanti e non l'ha applicata**: le
cifre che le sono sfuggite stavano in incisi, corsivi e note fra parentesi,
cioè dove una passata che cerca **righe** non guarda. Da qui si cerca la cosa
che sta invecchiando, cioè **le cifre**: si passano in rassegna i numeri del
testo, in lettere e in numeri, e per ognuno si chiede se accanto ha il criterio
che lo rifà. L'avverbio è un indizio, non la ricerca — e una riga che dice dove
si nascondono senza dire come si cercano invecchia come quelle che denuncia.)*
La sintesi sta qui
perché **il dettaglio è in git e il quadro no**: chi riprende deve sapere che
queste cose esistono prima di riscoprirle.

**La PR docs-only del 14.08.2026 sulla costituzione non è la quattordicesima**:
allinea `CLAUDE.md` a ciò che la tranche 1b ha cambiato — conteggio dei
guardrail, language switcher, default di `format.ts` — quindi è **contabilità di
M5.e**, e la milestone questa sezione la esclude per criterio.

**Non è un intervallo, e i buchi hanno un motivo — tutti, ed è la seconda
stesura di questa riga.** Fuori per le due eccezioni qui sotto: **#25 e #35**,
che sono sintesi retrospettive, e **#27 e #42**, che toccano solo
`docs/PITCH.md`. Fuori come milestone: **#29–#33** e **#36–#38, #40 e #41**,
cioè M5 con le quattro PR della tranche linguistica e la coda documentale della
1b, che la riga qui sopra dichiara contabilità di M5.e.

*(Fino al 17.08.2026 questa riga si fermava a «#25 e #27 … e #29–#33 sono M5»,
cioè copriva metà dei buchi e si fermava dove la lista dei numeri diventava
scomoda. Il costo non è teorico e si paga a valle: chi rifà il conto trova #35,
non trova la ragione, e apre una segnalazione su un difetto che non c'è. È
appena successo. Il totale — 31 — non si è mosso: a essere incompleto era
l'elenco, non la misura.)*

**#34 è la prova del criterio, non un'eccezione**: tocca `docs/PITCH.md`, ma
**non solo lui** — cambia tre nav — quindi la seconda esclusione qui sotto non
la copre, ed è scope fuori milestone. Si conta.

**Il criterio, perché il conto sia rifacibile.** Si contano le PR mergiate dopo
quella che chiude M3 (#14), **esclusa la milestone**: M4 è #19 e ha la sua
sezione. Le **docs-only si contano**, e non è una scelta nuova — #15 è
docs-only ed era già dentro i "quattro" della frase originale. Due casi che
sembrano contraddire la regola e non la contraddicono: #25 è docs-only ma esce
per l'eccezione qui sotto, e #21 sembra docs-only dal nome del branch ma tocca
`src/lib/data/mock/people.ts`.

*(Fino al 19.08.2026 la riga aggiungeva che #15 era «oggi l'unica fra quelle
contate», ed era falso dal 15.08.2026: docs-only e contate sono anche #45, #50,
#51, #52, #64 e la passata che sta togliendo questa frase. **La regola resta e
la fotografia esce**, come per le altre tre cifre dello stesso giorno: quante
siano invecchia a ogni passata documentale che si mergia, e sono già sei.)*

**L'unica eccezione, e chiude una ricorsione.** Una PR il cui **solo contenuto
è la sintesi retrospettiva di una passata già mergiata** appartiene a quella
passata e **non si conta a sé**. Non contraddice la riga qui sopra: a
distinguere non è il tipo di file toccato ma se la PR ha un oggetto suo — #15
è docs-only e ne ha uno, mentre una sintesi è il verbale di un'altra passata,
non una passata. Senza questa riga il conto si insegue da solo: ogni sintesi
scritta dopo il merge diventerebbe la passata successiva, che a sua volta
chiederebbe la propria sintesi.

**I casi sono due, e il primo è #25**: tocca solo questo file e scrive la
sintesi di #24, ed è la ragione per cui il conto salta da #24 a #26. Da lì la
sintesi si scrive come **ultimo commit della passata stessa** — è quello che ha
fatto #26 — così il conto d'apertura è già giusto al merge e non c'è una PR in
più da contare.

**Il secondo è #35**, la sintesi di #34, e non è un secondo caso della stessa
scoperta: la disciplina della riga qui sopra c'era già — l'aveva inaugurata #26
— e #34 non l'ha seguita, mergiata com'era in mezzo a M5, fra il blocco d) e la
tranche linguistica. **L'eccezione ha retto lo stesso**, che è la ragione per
cui vale la pena nominarla: #35 non si conta, il totale non si muove, e dopo di
lei ogni passata ha chiuso con la propria sintesi dentro la propria PR.

*(Questa riga arriva il 17.08.2026. Fino ad allora #35 non compariva in nessun
punto di questo file, e la riga qui sopra la dichiarava inesistente dicendo che
#25 era «l'unica»: è la forma difficile del difetto delle affermazioni
invecchiate — non una frase falsa da rileggere, ma una cosa che non c'è e
avrebbe dovuto esserci.)*

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
> è arrivato il giorno dopo con la tranche tedesca, e **al 14.08.2026 il conto
> era 99** — poi è salito ancora due volte. **Il valore corrente sta nel
> `CLAUDE.md` §5.6, che è l'unico punto che lo dichiara**: qui la cifra è datata
> perché serve a mostrare che il conto si muove per ragioni ordinarie, non a
> dire quanto vale adesso. Fino al 15.08.2026 questa riga diceva "oggi il conto
> è 99", e quell'avverbio la faceva invecchiare a ogni guardrail nuovo.*

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

**Aperto e dichiarato:** questa passata lasciò due voci, il controllo sulla
cache fredda contro `useSessionNote` e `hasNote` derivato da un surrogato.
**Le ha chiuse entrambe la passata sul residuo della nota**, qui sotto, che le
ha prese insieme perché erano due facce della stessa cosa.

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
dell'MVP, sta nel §8 sotto «Paginazione», e da qui smette di essere orfana fra un
documento e l'altro.

**Restava a una passata di codice**, e non era di questo blocco: la correzione di
`hasNote` nel dataset e la decisione sul controllo della cache fredda contro
`useSessionNote`. **Quella passata c'è stata**, ed è l'ultima di questa sezione.

#### La coda dell'analisi, e la chiusura della revisione (15.08.2026)

Diciotto commit, e **una classe sola di difetti**: sintesi di secondo livello che
avevano smesso di descrivere il repository — la testa di questo file, la tabella
delle milestone, alcune parentesi di chiusura, tre punti della costituzione e la
testata di `guardrails.ts` — più **una parafrasi sbagliata fin dall'inizio**, il
margine attribuito al co-payment, che viveva in cinque punti fra documentazione e
commenti. Nei file di codice cambiano solo commenti.

Sono tutte righe vere quando sono state scritte, tranne l'ultima: per questo si
barrano con la data invece di sparire, che è la convenzione di questo file.

**Chiude una serie di cinque passate del 14–15.08.2026**, che è la revisione
dell'intero repository: le risposte pronte del pitch (#42), la coerenza del
dominio (#43), gli stati limite delle schermate (#44), il perimetro del contratto
(#45) e questa. Le prime quattro hanno la loro sezione o, per la #42, le due voci
fra le decisioni chiuse.

**Cosa resta aperto, e a chi appartiene.** Al codice non resta niente: le due
voci che stavano qui — `hasNote` derivato da un surrogato e il controllo sulla
cache fredda contro `useSessionNote` — le ha chiuse la passata sul residuo della
nota, l'ultima di questa sezione. Ai founder,
nelle decisioni in sospeso qui sopra: la **residenza dei dati**, il **protocollo
clinico**, la **revisione madrelingua**, e fuori dal repository il **cap table**
con il CTO co-founder (§4.2 dei *Dubbi*, sesta domanda prioritaria). Senza
risposta pronta resta il **margine lordo**, che `docs/PITCH.md` vieta di
improvvisare: la sua è la quinta domanda prioritaria, validare la curva di
utilizzo reale come metrica n. 1 dei pilot.

#### Il residuo della nota di sessione (15.08.2026)

Sei commit: **tre di codice** — due `fix:` e un `refactor:` — **e tre di
documenti**. *(Diceva "cinque di codice e uno di documenti": il totale era
giusto e la ripartizione no, cioè due numeri presi in due momenti invece che
dalla stessa misura. Corretto il 15.08.2026, ed è l'esemplare che ha fatto
scrivere il criterio in testa a questo file — il difetto si è riprodotto qui, in
una passata attenta, mentre le correzioni della stessa famiglia erano già
pianificate.)* Chiude le due voci che la passata
sugli stati limite aveva lasciato aperte e che questo file assegnava
esplicitamente a «una passata di codice». **Sono state prese insieme perché sono
due facce della stessa cosa**: la nota di sessione, che nessuno leggeva finché
`useSessionNote` non è nato, e che appena letta ha mostrato tutti e due i
difetti nello stesso gesto.

**Nessun numero del §8 e del §9 si muove**, e non c'è stato niente da cercare:
`hasNote` non alimenta nessuna KPI, nessun totale, nessuna serie. È letto in un
punto solo fuori dal layer dati, `ProSessioni.tsx:67`. A cambiare è un rapporto
fra **etichette**.

##### Il guardrail smetteva di essere utile proprio dove serviva

`useSessionNote` è la prima lettura dell'applicazione che nasce da un gesto e
non dal primo paint: c'è una chiave per ognuna delle 63 sedute erogate, e quale
serva lo decide un clic. `prefetchDemo` non può metterla in elenco, quindi il
controllo sulla cache fredda parlava **a ogni apertura del dialogo** — un
guardrail che accusa il codice giusto di un difetto che non ha è un guardrail
che si impara a ignorare.

Le due strade erano scaldare le note al boot o insegnare al controllo a
distinguere un montaggio successivo al primo paint. **Nessuna delle due**, e le
ragioni valgono oltre il caso:

- **scaldarle avrebbe messo in `prefetchDemo` la decisione peggiore da lasciare
  in eredità**: tirare la nota clinica di ogni seduta di ogni paziente nella
  cache del client prima che qualcuno apra un dialogo. Il §10.D promette di quel
  testo il contrario, e il commento di quella funzione dice già che il giorno di
  `http/` è lì che si decide cosa vale la pena precaricare. Non vale il
  precedente di `checkup.report`, che si scalda perché è **il documento di chi
  sta guardando la propria pagina**;
- **«dopo il primo paint» avrebbe spento il guardrail su ogni navigazione.**
  `/hr/fatturazione` raggiunta con un clic monta i suoi osservatori esattamente
  come il dialogo, e quello è il caso in cui il controllo guadagna il suo posto.
  Sarebbe stato comprare il silenzio su una query pagandolo con la copertura di
  venticinque rotte.

**La query dichiara di non essere scaldabile** — `meta: { coldOnPurpose: true }`
— e il controllo rispetta la dichiarazione. È la terza esenzione della stessa
famiglia delle due che c'erano già, si legge in fila dallo stesso oggetto
(`event.observer.options`, come `enabled`), e la ragione sta sulla query perché
è il chiamante a saperla: chi ne scriverà una seconda non deve tornare a toccare
`prefetch.ts`, e chi vuole l'inventario delle esenzioni cerca `coldOnPurpose`.

##### `hasNote` era 55 su 63, ed era un surrogato

Il campo si derivava da *"il paziente ha una seduta più recente"*, cioè da
un'euristica su **quando una nota si scriverebbe**, non dall'esistenza della
nota. **La misura, rifatta eseguendo `buildSessions()`: 55 sedute erogate su 63
dichiaravano `hasNote: true`, e per tutte `getSessionNote` rispondeva `null`.**

I documenti dicevano 56 in due punti, e **non era invecchiato: non è mai stato
vero.** L'euristica toglie la nota all'ultima erogata di ogni paziente, e i
pazienti con almeno una erogata sono otto — 63 − 8 = 55. L'aritmetica lo forza,
e nessuno l'aveva rifatta. Le voci che portavano il 56 sono uscite da questo file
e dal `CONTRATTO-DATI.md`, quindi **nessuna occorrenza lo dichiara più come
misura**: resta nominato solo qui, per dire che era sbagliato. È la stessa
convenzione con cui questo file tiene il 114 dei guardrail.

**Le note esistono, e sono otto: una per prima visita erogata.** È il criterio,
e la ragione per cui è quella seduta va tenuta in chiaro — è la presa in carico,
l'unica che si verbalizza sempre. Le altre restano da scrivere, ed è ciò che
tiene vivo "aggiungi nota": senza almeno una erogata senza nota quel pulsante
sparirebbe dallo schermo, e con lui il caso che il dialogo serve a mostrare.

**Il testo è di processo e mai clinico** — cosa si è fatto, cosa si è
concordato, quando ci si rivede. Non per pudore: sono persone inventate, e una
nota clinica verosimile su una persona inventata è contenuto che nessuno ha
approvato (§2.4). Le otto si somigliano, **ed è la scelta meno peggiore**:
variare la sostanza avrebbe voluto dire inventare un sintomo o un obiettivo
terapeutico a testa. La ripetizione è un difetto estetico, l'altro no.

**`updatedAt` è la fine della seduta**, `start + durationMinutes`, non
`DEMO_TODAY`: una nota di marzo datata al giorno della demo direbbe di essere
stata scritta sette mesi dopo. Deriva dal record, quindi si muove con
`DEMO_TODAY` e non introduce costanti — e qualunque ritardo più verosimile
sarebbe una cifra che nessuno ha approvato, per un campo che **nessuna schermata
rende**.

**Il rapporto si ribalta: 55/8 diventa 8/55.** È accettato, e la ragione per cui
costa poco è che **prime visite e ultime-erogate sono insiemi disgiunti** su
tutti e otto i pazienti: le 8 righe che dicevano "aggiungi nota" continuano a
dirlo — M.B. 21.09, il bersaglio della prova del pitch, compresa — e a
ribaltarsi sono le 47 in mezzo.

##### L'archivio non può più portare quel campo

`hasNote` nasce ora in **proiezione**, dentro `sessionsOf`, che è l'unico punto
che produce un `ProfessionalSession`: non è un allineamento fra due valori, è lo
stesso valore letto in due modi (§5.5). L'archivio è tipizzato
`StoredSession = Omit<ProfessionalSession, "hasNote">`, e i due archivi sono
diventati due — anche `bookedByProfessional`, o il varco si sarebbe richiuso a
metà.

**Non è stile.** `PORTAL_SESSIONS` lo leggono anche `service-usage.ts` ed
`employee-portal.ts`, che **scavalcano la proiezione**: con un campo memorizzato
sempre `false`, chi lo leggesse domani ne ricaverebbe una curva sbagliata senza
rompere niente — la famiglia di difetto che questo file teme più di tutte. Costa
nove firme allargate e un alias esportato da `professional-portal.ts`, non da
`types.ts`: il backend non avrà nessun archivio senza `hasNote`.

##### Il guardrail nuovo, che non era previsto: 99 → 100

La proposta approvata prevedeva che il conteggio restasse a 99. **È salito a
100**, e la ragione non si ricostruisce da sola leggendo il diff:
`noUncheckedIndexedAccess` è **spento** in `tsconfig.json`, quindi indicizzare
per stringa il record dei testi restituisce il tipo pieno invece di
`T | undefined`. Un nono paziente aggiunto a `PATIENTS` senza il suo testo
produrrebbe una nota con tre campi `undefined` — e `hasNote` direbbe di sì su
una nota che non si può leggere — **senza che il typecheck se ne accorga**. Il
controllo fallisce davvero, ed è il solo di questa passata.

**Due guardrail sono stati invece rifiutati**, e vale quanto quello aggiunto:

- **sull'invariante `hasNote` ⇔ la nota esiste**: verificherebbe
  `notes.has(id) === notes.has(id)`. È il guardrail della prenotazione che si
  appoggiava alla funzione che doveva sorvegliare, ripetuto;
- **sulla data della nota**: sui semi confronterebbe l'espressione con sé stessa
  una riga sotto dove è scritta, e su `saveSessionNote` non è raggiungibile
  perché il pulsante nota esiste solo su `completed`, cioè su un passato.
  L'invariante è vero e **violabile in produzione**, quindi è andato in
  `CONTRATTO-DATI.md` §3 — con scritto anche **perché non è sorvegliato**, che
  è la domanda che si fa chi legge un invariante dichiarato e non controllato.

##### La verifica, e la prova che è andata storta per prima

**A schermo, build demo, viewport 1280×900 e scheda in primo piano** (§11):

- **8 "Nota" e 55 "Aggiungi nota"** fra le 63 erogate, che è la misura del layer
  dati vista dall'altro lato;
- dialogo su **M.B. 21.09**, che una nota non ce l'ha: **console muta** — è il
  criterio di chiusura del blocco — e tre campi vuoti;
- dialogo sulla **prima visita di G.R. del 13.07**, che ce l'ha: **console
  muta**, tre campi pieni col testo seminato;
- **salvataggio**: la riga passa da "Aggiungi nota" a "Nota" senza ricaricare, e
  le erogate senza nota scendono da 55 a 54;
- **riapertura**: i tre campi tornano pieni;
- **prova al contrario**: tolto il `meta`, il guardrail torna a parlare con la
  chiave esatta della seduta aperta. È insieme la prova che il difetto era reale
  e che a chiuderlo è l'esenzione e non altro;
- numeri del pitch fermi: 3 su 10 · 3 in programma, 1 su 4, 63 erogate, 14
  sedute, CHF 1'120, CHF 14'200, 16 giorni, 68%, 82 su 120, 142 di 1'200, 62%,
  soglia 12, −2 punti;
- `lint`, `typecheck`, `build` e `build:demo` a posto.

**Lo sfarfallio: guardato, non si vede, non è stato fatto niente.** Il dialogo di
una seduta con nota rende necessariamente un primo fotogramma coi campi vuoti —
la query parte all'apertura — e la domanda era se quel fotogramma arrivi allo
schermo. Non arriva. Il rimedio abbozzato era sospendere il corpo del dialogo su
`loadState`, e aveva un tranello: avrebbe toccato anche le 55 sedute *senza*
nota, dove il form vuoto è già la resa giusta, scambiando un lampo di campi
vuoti con un lampo di niente. **Una segnalazione chiusa con "guardato, niente"
vale quanto una correzione, e vale più di una correzione inventata per non
lasciarla senza esito** (founder, 15.08.2026).

**Che l'`Omit` non cambi il runtime è stato provato transpilando** il file prima
e dopo e confrontando l'output, perché i tipi si cancellano. Le differenze sono
**quattro delta di codice** — i due letterali `hasNote: false`, il blocco di
derivazione, e il `session.hasNote ||` che cade — più il commento nuovo su
`sessionsOf`, che esbuild conserva. Nessuna in più, e **l'`Omit` non compare in
nessuna**: i letterali perdono il campo perché il tipo li costringe, non perché
l'annotazione emetta qualcosa.

**Il primo giro di quella prova ha confrontato due file da zero byte**, e ha
risposto *"nessuna differenza"*. L'invocazione passava a esbuild un `--loader`
che con un file su disco non si applica, e `stderr` era silenziato: l'errore non
si vedeva e i due output erano vuoti. **È la terza volta che questo file registra
la stessa famiglia** — la scheda nascosta del 14.08, il censimento da grep di
M5.a — e la terza vale la formulazione generale: **uno strumento che risponde
esattamente quello che speravi va rifatto, non creduto.** Qui la risposta
sbagliata era anche la più desiderabile, che è ciò che la rende pericolosa.

**Il pannello del browser ha dato e tolto**, ed è annotato perché costa tempo a
chi lo riprende: riporta `visibilityState: hidden` anche a scheda in primo piano,
quindi la pagina non ridipinge, gli screenshot escono bianchi e i timer sono
throttled a **~388 ms reali** — un campionatore scritto a 1 ms non risolve
niente. Gli input arrivano su alcune schede e non su altre, e la scheda iniziale
del pannello non li consegnava affatto. I due punti del salvataggio sono stati
eseguiti **su un browser vero dai founder**, non qui.

#### Slot sovrapposti e periodi non dichiarati (15.08.2026)

Sei commit di codice e quattro di documenti. Cinque difetti verificati, nessuno
dei quali rompeva la demo — ma **il primo era a un clic dal giro che apre il
pitch**. Nessun numero del §8 e del §9 si muove.

##### Due slot prenotabili si sovrapponevano, e uno era quello del pitch

Lo slot del venerdì del Dr. Rossi andava 09:30→10:20, dentro quello della Dr.ssa
Meier delle 10:00→10:50 — cioè **lo slot che `docs/PITCH.md` prescrive di
prenotare durante la demo**. Chi li prenotava entrambi si ritrovava due sedute
accavallate nella home di Laura, e non parlava nessuno. Misurato: **una sola
coppia su sedici**.

Lo slot passa alle **09:00**, e rimisurando escono **zero coppie sovrapposte**.
Ma il dataset corretto non impedisce il prossimo, quindi arrivano **due
controlli, e sono due cose diverse**:

- **il gemello statico, in `scheduling.ts`**: nessuna coppia di slot proponibili
  si sovrappone, **nemmeno fra professionisti diversi**, perché a prenotarli è
  una persona sola. È quello che avrebbe trovato la coppia da solo, e sta accanto
  al controllo sul fine settimana che c'era già;
- **il controllo sull'agenda del paziente, in `bookAppointment`**: i due che
  c'erano guardano **un professionista alla volta**, quindi nessuno dei due
  poteva rispondere alla domanda che conta — il dipendente ha già qualcosa in
  quella fascia? Due slot di professionisti diversi passavano entrambi.

Tutti e due confrontano **intervalli e non istanti**: sullo stesso istante di
inizio rispondeva già il controllo esistente, e il caso vero era una fascia che
ne invade un'altra di venti minuti.

**La trappola del prossimo che tocca la durata, misurata e lasciata scritta.** Il
gemello statico confronta gli slot **fra loro**, non gli slot con le sedute già
in agenda del paziente. Oggi il caso più stretto è lo slot Fontana del giovedì,
16:30→17:20, contro la seduta di Laura delle 17:30: **dieci minuti di margine**.
Portando `SESSION_DURATION_MINUTES` da 50 a 60 il margine si azzera esattamente —
16:30 + 60 = 17:30, si toccano — e la sovrapposizione comincia a **61**. Il
controllo a runtime lo prende, ma **solo se qualcuno prenota davvero** quello
slot; quello statico non può prenderlo, perché importare `PORTAL_SESSIONS` in
`scheduling.ts` sarebbe un ciclo — `professional-portal.ts` importa
`SESSION_DURATION_MINUTES` da lì. Non è stato cambiato niente: è scritto perché
60 è l'ultimo valore sicuro, e chi lo supera non ha un controllo statico che lo
avverta.

##### "Compenso" voleva dire due cose nella stessa schermata

In `/admin/sessioni` la colonna stampava la tariffa anche sulle sedute **in
programma**, mentre la KPI accanto somma le erogate e porta il sottotitolo "solo
sedute erogate" — e il commento sopra quella KPI dichiarava che «due schermate
che contano lo stesso denaro devono contarlo allo stesso modo» senza vedere che
le due schermate erano la stessa. Chi sommava la colonna non otteneva la KPI.

Ora l'importo sta solo sulle erogate, con il trattino che le annullate già
usavano: quello era **metà del caso**.

##### Il banner dell'alert precoce non dichiarava il suo periodo

Selezionando il trimestre più vecchio, la dashboard mostrava "Alert precoce —
reparto Vendite" con `triggeredAt` al **01.07.2026**, cioè un evento datato sette
mesi dopo la fine del periodo scelto, in cima alla schermata su cui si regge il
pitch. La tabella accanto dice già "ultimo mese" e i due grafici "ultimi 12
mesi": il banner era **l'unico dei tre che taceva**.

**Etichettato, non nascosto** (founder, 15.08.2026). Nascondere sui trimestri
vecchi sembrava più pulito e sarebbe stata una finzione: `getEarlyAlert()` non
prende un periodo, quindi l'alert corrente è l'unico che esista e la dashboard
non ne conosce di storici. Un banner assente si legge come *"in quel trimestre
non c'era un alert"*, che è una cosa che questa schermata **non è in grado di
affermare**. Misurato, il costo sarebbe stato: banner visibile su **un trimestre
su quattro**, cioè solo sul corrente.

Dice **"ultimo rilevamento"** e non "in corso", che su questa schermata vuol già
dire un'altra cosa — il trimestre parziale del selettore, `3° trimestre 2026 · in
corso`. Il qualificatore sta **nel titolo**, dove le altre due lo tengono.

##### Due stati limite latenti, gemelli di due chiusi lo stesso giorno

- **`Checkup.tsx`**: con `availableFrom === null` — piano senza check-up — il
  pulsante disabilitato usciva **senza nome accessibile**, cioè `: ""`. Gemello
  del contatore coach: stessa ipotesi di piano, schermata accanto.
- **`ProProfilo.tsx`**: `documentsVerified` e `mandateSigned` rendevano il badge
  solo a `true`, lasciando l'etichetta a sinistra e **il nulla a destra**.
  Gemello del badge di annullamento senza motivo. Il non-ancora è **neutro e non
  `destructive`**: il §6.1 riserva quel token agli alert, e un mandato da firmare
  è un passo del vetting, non un guasto.

Tre stringhe nuove in tutte e quattro le lingue.

##### I guardrail passano da 100 a 102

Due call site, e **sono due controlli distinti**, non lo stesso in due posti: il
gemello statico sugli slot proponibili e il controllo sull'agenda del paziente in
`bookAppointment`. Il primo guarda il dataset a freddo, il secondo guarda ciò che
succede mentre qualcuno prenota, e nessuno dei due copre l'altro — la nota sulla
durata qui sopra dice esattamente dove il primo non arriva.

> **La ripartizione si muove qui, ed è la riga che mancava** (aggiunta il
> 16.08.2026). Dei due, quello in `bookAppointment` è **una chiamata lunga** —
> `assertInDevOutsidePromise`, perché sta dentro un metodo `async` e il lancio
> deve uscire dallo stack corrente — quindi il conto passa da `93 + 6` a
> **`95 + 7`**: è la prima volta che il secondo addendo si muove da quando
> esiste. Questo file si fermava al `93 + 6` della passata precedente e la
> ripartizione corrente viveva solo nel `CLAUDE.md` §5.6, che è dove il criterio
> sta di casa — e resta lì. Questa riga non apre un secondo elenco: dice **dove**
> il settimo è nato, che è l'unica cosa che il §5.6 non può dire.

##### Verificato

**Il punto 1 provato nei due versi, sullo stesso codice:**

| dataset | esito |
|---|---|
| rossi 09:30, rotto ad arte | il gemello statico parla all'inizializzazione, e quello della prenotazione parla al secondo slot prenotato |
| rossi 09:00 | tutti e tre gli slot del venerdì si prenotano, **nessuno dei due parla** |

**A schermo, build demo, viewport 1280×900 e scheda in primo piano:**

- il dialogo di Rossi offre **09:00**, e prenotandolo la conferma dice *"venerdì
  25.09.2026, alle 09:00"* — console muta; quello di Meier offre **10:00**, con
  la stessa data e la console muta;
- **`/admin/sessioni`: la somma della colonna è CHF 5'040 e la KPI dice CHF
  5'040.** 82 righe, 63 con importo — tutte "Erogata" — e 19 col trattino, 18 in
  programma più l'annullata;
- **il banner regge il tedesco**: `Frühwarnung — Abteilung Vendite · letzte
  Erhebung` sta su **una riga**, 675px di testo in una card da 960, zero overflow
  di pagina. Il nome del reparto resta `Vendite`, che è la regola di M5.e;
- **la più lunga delle tre stringhe nuove è il francese**, `En cours de
  vérification`: una riga, badge da 175px in una riga da 918, zero overflow. Non
  si vede col dataset di oggi — nessun professionista ha i documenti non
  verificati — quindi è stata misurata girando il flag della Dr.ssa Keller;
- **il punto 5 riprodotto prima di correggerlo**, puntando
  `PORTAL_PROFESSIONAL_ID` sulla Dr.ssa Keller, che è la stessa manopola usata
  per il mese senza compensi: prima la riga "Contratto a mandato" aveva **zero
  badge**, dopo dice "Da firmare". Ripristinata la manopola, Meier torna a
  "Verificati" e "Firmato";
- `lint`, `typecheck` e `build:demo` a posto.

**Due asserzioni le ha eseguite un umano**, perché il pannello del browser non
poteva — la ragione è qui sotto, e non è una scusa: sono le due che chiudono i
punti 1 e 2, quindi il modo in cui sono state prese va scritto accanto all'esito.

- **le due prenotazioni del venerdì nella stessa sessione** — Rossi 09:00 e Meier
  10:00 — compaiono **entrambe** nella home, console muta. È il caso che prima si
  accavallava, visto dal lato del dipendente;
- **la vista Q4 2025 col banner etichettato**: il qualificatore "· ultimo
  rilevamento" fa il suo lavoro, e la data di luglio 2026 non salta all'occhio.

##### Due cose sullo strumento, e insieme dicono una regola

**Il pannello del browser non apre due dialoghi nella stessa scheda.** Il secondo
resta un guscio vuoto con il solo pulsante di chiusura: la scheda riporta
`visibilityState: hidden`, non ridipinge, e l'animazione di uscita di Radix non
completa. Per la stessa ragione non si apre il popover del selettore del
trimestre. **Sono le due asserzioni passate a un umano** qui sopra: il pannello
non poteva prenderle, e ciò che poteva dare — le due prenotazioni una per scheda,
e il testo del banner in italiano e in tedesco — non era la stessa cosa. Il
provider era comunque provato headless, che è lo stesso codice; a mancare era
**la schermata**, ed è esattamente ciò che un umano ha guardato.

**Il primo script che misurava le sovrapposizioni è crollato**, perché passava lo
*slot* dove la funzione voleva la *data*. Ed è la **coppia esatta** dell'errore
della passata precedente: là lo strumento rispose *"nessuna differenza"*
confrontando due file vuoti, qui si è denunciato da solo. Le due insieme dicono
la cosa che serve, ed è più utile di ciascuna: **uno strumento che risponde
quello che speravi va rifatto, uno che crolla si è già denunciato.** Il pericoloso
è il primo.

##### Aperto e dichiarato

- **Su un trimestre vecchio il banner mostra ancora una data di luglio 2026.**
  L'etichetta chiude l'errore di categoria — dice che il banner non parla del
  trimestre scelto — e **la stranezza temporale resta a schermo**: è il prezzo
  accettato per non affermare un'assenza che il provider non può sostenere. Vive
  accanto al limite gemello di questa stessa schermata, la **tabella stress che
  non segue il selettore**: sono i due punti in cui la dashboard mostra un
  periodo diverso da quello scelto, ed entrambi lo dicono nel titolo. Il giorno
  in cui il contratto avrà alert storici — `getEarlyAlert(period)` — la scelta si
  rifà, e allora nascondere smetterebbe di essere una finzione.

#### I fatti corretti nei documenti (15.08.2026)

**Diciassette commit, tutti `docs:`, zero di codice** — contati sul branch con il
criterio scritto in testa a questo file, che questa passata inaugura e che è nata
da uno dei difetti che chiudeva. `git diff --stat` non tocca **nessun file sotto
`src/`**, `lint` e `typecheck` restano a zero, e nessun numero del §8 o del §9 si
muove.

**Nove correzioni, e sei sono lo stesso difetto in sei punti**: un numero o un
elenco scritto in prosa accanto a ciò che lo smentisce. È la famiglia che questo
file racconta di aver già avuto tre volte — 19/11 contro 13/9 delle CTA, 114
contro 96 dei guardrail, undici contro tredici delle passate — e la scoperta di
questa passata è che **non è storica: si riproduce**. Uno degli esemplari è stato
scritto **il giorno prima**, da una passata attenta, mentre le correzioni erano
già pianificate.

Da lì il criterio di ogni rimedio: **stabilire una regola, non allineare un
valore**. Dove il numero serviva al racconto è stato **datato**; dove ripeteva
una lista che gli stava accanto è stato **tolto**; dove mancava un criterio, il
criterio è stato scritto — ed è ciò che il §5.6 aveva già fatto per i guardrail e
il §3 per i `.jsx`, cioè i due conteggi che hanno smesso di divergere.

##### Cosa è stato corretto

| | dove | rimedio |
|---|---|---|
| tre `97` dei call site | `CLAUDE.md` §5.6 | allineati a **102**, con la regola che la riga datata e la prosa si muovono insieme |
| «oggi il conto è 99» | questo file, blocco del 114 | **datato** al 14.08.2026 e rimandato al §5.6 |
| «la chat non espone numeri d'emergenza» | `CONTRATTO-DATI.md` §8.1, `PITCH.md`, questo file | **è falso**: il 144 c'è, nel disclaimer della chat, in quattro lingue. Il buco vero è che **non è nel check rapido** |
| «tariffa del mercato privato» sui CHF 70–80 | `PITCH.md` | il mercato privato è **CHF 120–150** (BP p.9), trascritto in §9; la risposta ora regge sul 4–5× |
| margine lordo | `CLAUDE.md` §9 | **79 / 73 / 68%** trascritti con l'avvertenza: solo l'Essenziale si deriva dai costi esposti |
| 15–25% contro il 12% | `PITCH.md` | **risposta pronta nuova**, con le due letture del BP trascritte in §9 |
| `README.md` assente dal §3 | `CLAUDE.md` §3 | riga nell'albero: **è la porta, non un quarto mestiere** |
| due file su otto in `lib/data/` | `CLAUDE.md` §3 | **nominati tutti e otto**, con il criterio dell'albero |
| 26 contro 27 rotte | `CLAUDE.md` §10 | **26 rotte dello scope, 27 schermate**, e il §10 è l'unico punto che le conta |
| «diciassette» e «sette» | questo file | **tolti**: rimandano alla lista invece di contarla |
| «cinque commit di codice e uno» | questo file | erano **tre e tre**, e da qui il criterio di conteggio |
| le uscite dai portali | questo file, M5.d | **barrata**: chiusa da #34 due giorni prima, aperta qui e chiusa altrove |

##### La spazzata, con i suoi numeri

Fatta su `CLAUDE.md` e su questo file, cercando ogni punto in cui un numero è
accompagnato da un avverbio che lo dichiara corrente — «oggi», «ora», «adesso»,
«attualmente». **Diciassette punti esaminati, cinque invecchiati**: i tre `97`, il
«diciassette» e il «99». Gli altri dodici sono stati verificati contro il codice e
**tengono** — i tre `.jsx` convertibili, «nessuna variante `data-*` rotta», i due
chiamanti di `raiseOutsideCurrentStack`, i 45 componenti shadcn, i tre
appuntamenti in home, «nessun professionista con i documenti non verificati». Le
cifre già barrate sono state escluse: sono correzioni in luogo, non dichiarazioni.

**Due difetti della stessa famiglia stanno fuori da quel criterio**, ed è
l'informazione che serve a chi rifarà la spazzata:

- **«le sette che hanno una sottosezione»** non aveva nessun avverbio. A trovarlo
  è stata la lista che smentiva, non la ricerca;
- **«`docs/PITCH.md` oggi non dice…»** aveva l'avverbio ma **non un numero**, ed
  è la sola correzione di questa passata che non riguarda una cifra. Era anche la
  più cara: sta sotto un titolo «Aperto e dichiarato» e riguarda il giro del
  pitch.

Il criterio «numero + avverbio» è quindi un buon punto di partenza e non un
perimetro. Quello vero è più largo: **un'affermazione che era vera quando è stata
scritta e non lo è più**, che sia una cifra o una frase.

##### Due correzioni sono nate da errori del prompt che le chiedeva

Va a verbale perché è la prova migliore che il criterio di conteggio non è
burocrazia — **la famiglia si riproduce dentro il lavoro che la sta chiudendo**:

- la risposta pronta sul 15–25% ancorava il confronto all'esempio **Essenziale**
  del BP e ne derivava le persone con le **cinque sedute a testa del Plus**: due
  righe diverse usate come una. Con le tre dell'Essenziale sarebbe uscito il
  **39%** invece del **23%**, cioè una risposta sbagliata proprio davanti a chi ha
  il documento in mano. L'àncora è l'esempio del **Plus**, che è il piano di Demo
  SA, e da lì persone e sedute vengono dalla stessa riga;
- la banda **68–79%** era data a p.2 e p.16: **p.2 è l'indice**. La banda sta a
  **p.4** e a **p.16**, e la fonte scritta in §9 le nomina entrambe — citarne una
  quando ce ne sono due è lo stesso difetto in scala ridotta.

Entrambe sono state trovate riaprendo il Business Plan invece di fidarsi della
lista, che era la prima istruzione della passata.

##### Fuori da git

`reference/` è stata cancellata dal filesystem: conteneva solo un `.DS_Store`,
git non la tracciava dalla chiusura di M3, e `README.md` e il `CLAUDE.md` §1 la
davano già per cancellata.

**`_to_delete/` resta dov'è e `.gitignore` non è stato toccato.** La proposta di
aggiungercela partiva da una premessa falsa — è già esclusa, in
`.git/info/exclude`, quindi nessun `git add -A` la raccoglie. Metterla in un file
tracciato imporrebbe a tutti la convenzione di una macchina sola.

#### Il perimetro e le promesse in sospeso (15.08.2026)

**Sette commit: sette di documenti e zero di codice** — totale e ripartizione
dalla stessa misura, `git log --format='%s' master..HEAD`, come vuole il criterio
in testa a questo file. Due soli file toccati, `CONTRATTO-DATI.md` e questo:
**nessun file sotto `src/`, e nessun tipo è cambiato**; `lint` e `typecheck`
restano a zero. Non ci sono verifiche a schermo perché non c'è niente di nuovo a
schermo, ed è la stessa forma della passata sul perimetro del contratto, che è il
suo modello.

Quattro vuoti in più nel §8 del contratto e tre promesse in più fra le decisioni
in sospeso. **Il perimetro dell'MVP passa da sette gruppi a dieci** — chi cerca
"sette gruppi" lo trova nel verbale della passata che li scrisse, ed era giusto
quel giorno.

##### I quattro vuoti, e il filo che ne tiene insieme tre

| | il vuoto | dove |
|---|---|---|
| **l'atto dichiarativo** | nessuno porta una seduta da `scheduled` a `completed`: nel mock lo fa l'orologio | §8.5, in testa al ciclo dell'appuntamento |
| **il co-payment** | l'unico ricavo variabile del modello non ha dove essere registrato, e chi lo paga non è deciso | §8.4, gruppo nuovo |
| **la prenotazione del check-up** | non esiste: nessun `bookCheckup`, pulsante disabilitato, e `CheckupBooking` è un tipo che nessun metodo crea | §8.6, gruppo nuovo |
| **`progressPercent`** | l'unico numero del dominio che non misura niente, e nessuna entità registra ciò che misurerebbe | §8.9, gruppo nuovo |

**Tre dei quattro non sono stati mancanti ma attori o oggetti mancanti**, ed è la
lettura che li tiene insieme: il gruppo sul ciclo dell'appuntamento elencava gli
*stati* che mancano — la mancata presentazione, la policy di preavviso — e non si
era accorto che **manca chi li scriverebbe**. Lo stesso vale per il
co-payment, dove non manca la forma della fattura ma **l'oggetto da fatturare**, e
per il check-up, dove non manca una schermata ma **il flusso verso un terzo
soggetto contrattuale**. Uno stato che nessuno può dichiarare non è uno stato: è
la frase che le tre voci condividono.

**Il quarto è di un'altra specie e sta bene dove sta**: `progressPercent` non
manca di un attore, manca di un fatto. Il suo unico guardrail ne verifica il range
0–100 — cioè che sia una percentuale, non che sia quella — e un controllo che può
solo verificare la forma è il segno che dietro non c'è una seconda sorgente contro
cui confrontarsi.

##### L'atto dichiarativo è il più caro dei quattro, e si vede solo contando

Le tre grandezze che dipendono da «la seduta è avvenuta» — compenso maturato,
consumo del cap, utilizzo che l'HR vede — sono **tre filtri distinti su
`status === "completed"`**, in tre file diversi, con **una sola condizione
sull'orologio** dietro. Oggi non possono divergere per costruzione; il giorno in
cui la condizione diventa un evento, possono divergere per la prima volta. È il
§5.5 di `CLAUDE.md` visto in anticipo: due numeri che descrivono lo stesso fatto e
smettono di essere lo stesso numero.

##### Le tre promesse, contate come la residenza dei dati

Stessa classe di rischio e stesso trattamento: il conto delle stringhe con il
criterio accanto, perché il giorno in cui si decide quelle stringhe o si
confermano o si cambiano.

| promessa | stringhe in `it.ts` | dove |
|---|---|---|
| crittografia end-to-end, AES-256 | **3** | titolo e corpo del principio nella privacy HR, **più il chip della landing** |
| consenso raccolto e revocabile | **2** | titolo e corpo, nella sola privacy HR |
| «ti richiediamo fra qualche giorno» | **1** | il `doneHint` del check rapido |

**La più grave è il consenso, e non per il numero**: le altre due promettono un
meccanismo che manca, questa afferma un **fatto giuridico compiuto** — che il
consenso è stato dato — su una schermata rivolta a chi su quella base tratterà i
dati dei propri dipendenti, e promette una revoca che non ha nessun percorso.
Il `CONTRATTO-DATI.md` §8.2 dice l'opposto alla lettera.

**La terza è minore e ha una forma che le altre non hanno**: una stringa a
schermo sta **decidendo ciò che il contratto lascia indeciso**. "Fra qualche
giorno" non è vago per prudenza — esclude già la cadenza settimanale e quella
mensile, cioè restringe una scelta di prodotto che nessuno ha fatto.

##### Due cose che il conteggio ha trovato e la lista non prevedeva

Sono la ragione per cui il §5 della richiesta chiedeva di **contare con un
criterio invece di stimare**, ed è servito:

- **la crittografia sta in tre punti, non in uno.** Il terzo è il **chip della
  landing**, `public.landing.privacyChip.encryption`, che non era nell'elenco —
  ed è il più esposto dei tre: la privacy HR la vede un cliente che valuta, il
  chip lo vede chiunque apra la demo, investitori compresi, ed è nel percorso del
  pitch;
- **i consumatori di `lastCompleted` sono tre, non due.** Oltre a `EmployeeHome`,
  che controlla lo status, e a `Checkup`, che non lo controlla, c'è **`Profilo`**,
  che pure non lo controlla. Il rapporto è due su tre, e rafforza il punto invece
  di cambiarlo: la promessa vive nel nome del campo e non nel tipo, quindi ogni
  chiamante decide per conto suo.

##### Una scelta di forma, perché la prossima inserzione non la ripaghi

Inserire tre gruppi in mezzo al §8 ha rinumerato quelli dopo, e i due rimandi di
questo file alla paginazione sarebbero invecchiati **a ogni inserzione futura**.
Ora nominano il gruppo invece del numero — «§8, gruppo Paginazione» — che è la
stessa disciplina delle passate precedenti applicata a un rimando anziché a un
conteggio: **si cita ciò che non si muove.** I rimandi a §8.1 restano numerici:
l'escalation clinica è prima per una ragione dichiarata, e non si sposta.

**Il §8.1 non è stato toccato**, ed è una scelta e non un caso: la passata
documentale ci aveva appena riscritto l'affermazione sul numero d'emergenza. Le
quattro voci nuove si aggiungono **accanto**, mai dentro — verificato confrontando
il gruppo con quello di `master`, identico riga per riga.

##### Il criterio di conteggio alla sua seconda passata

È la prima volta che il criterio scritto in testa a questo file viene usato da chi
non l'ha appena scritto, quindi vale dire cosa ha retto e cosa no.

**Ha retto la metà che serviva**: *totale e ripartizione dalla stessa misura*. È
la regola che ha fatto correggere il numero di questa stessa sottosezione quando
la passata ha guadagnato un commit, invece di lasciarlo invecchiare come è
successo alle CTA, ai guardrail e al conto delle passate.

**Non ha esercitato la metà che discrimina.** Qui i commit sono tutti `docs:`,
quindi la distinzione fra codice e documenti — la parte su cui la passata
precedente aveva sbagliato — **non è stata messa alla prova**. Due usi non fanno
un criterio validato: la prossima passata mista è quella che lo dirà.

**E ha mostrato un buco, che è l'esito più utile.** «Si conta sul branch, a
chiusura avvenuta» non dice **se il commit di chiusura conta sé stesso**. Deve —
è un commit della passata — e da qui discende che il numero della sottosezione di
chiusura è **l'unico che non si può misurare mentre lo si scrive**: si scrive
`n + 1`, cioè si predice. Qui è successo alla lettera — la sottosezione dichiarò
**sei** con cinque commit sul branch, era esatta al merge previsto, ed è
invecchiata appena la passata ne ha guadagnato un settimo. La clausola che chiude
il buco è ora nel criterio, e questo commit è il primo ad applicarla.

#### Il footer fuori dalla demo, e l'inventario delle promesse (15.08.2026)

**Otto commit: otto di documenti e zero di codice** — totale e ripartizione dalla
stessa misura, `git log --format='%s' master..HEAD`. Nessun file sotto `src/`,
nessun tipo cambiato, `lint` e `typecheck` a zero. Registra una decisione dei
founder e ne ricava il perimetro; non costruisce niente.

**Conta fra i refinement anche se chiude una milestone**, e il criterio regge
senza deroghe: esclude **il lavoro della milestone**, e questa passata non è un
blocco di M5 — è la decisione che ne ritira uno.

##### La decisione, e la forma che le è stata data

**Nessuna delle sette voci del footer si costruisce nella demo.** Il blocco f)
esce dallo scope e **il lavoro passa al perimetro dell'MVP**, che ha ora la sua
sezione in fondo a questo file. La ragione è scritta nel `CLAUDE.md` §4 perché
impedisca a una passata futura di portarsi avanti: **una privacy policy che non
sa dire dove stanno i dati non è una bozza da rifinire, è un documento che afferma
il falso su una schermata che un cliente firmerà.**

**M5 è chiusa con il sesto blocco ritirato, non con cinque blocchi.** Fra le tre
forme possibili è stata scelta quella che **non rende retroattivamente falso
nessun verbale**: "si articola in sei blocchi" resta vero in tre punti che quel
numero l'hanno misurato davvero — il `CLAUDE.md` §4 e le due righe del contratto
sulla paginazione — e rinumerare a cinque li avrebbe smentiti. Costava sette
punti in tre file contro i dieci della rinumerazione, e **non rompe nessun
rimando**: l'unico a «M5.f», nel §10, è stato riformulato sull'attribuzione nuova.

**«Ritirato» non viaggia mai da solo** (founder, 15.08.2026): ogni punto in cui
compare dice **dove è andato il lavoro**, perché letto fra sei mesi si leggerebbe
come "cancellato", e il lavoro non è cancellato — ha cambiato milestone.

##### La scoperta: una promessa che il modello smentisce

**«I tuoi dati sanitari non vengono mai condivisi con terzi»**, nel portale del
dipendente. È falsa: lo psicologo è un collaboratore **a mandato**, e lo dichiara
la stessa applicazione due schermate più in là; le strutture del check-up sono
soggetti distinti che producono il referto. Ha la sua voce fra le decisioni in
sospeso, ed è **di una classe peggiore delle altre tre**: quelle promettono cose
che non esistono ancora e sono debiti, questa afferma un fatto **già falso mentre
lo si legge**, ed è un errore.

**Il lato in positivo vale quanto quello**: **21 stringhe** promettono cosa
l'azienda non vede, e sono **promesse di fatto, vere**, sostenute dalla forma del
dominio. Sono ciò che la policy futura potrà affermare senza rischi — e sono anche
la riformulazione già pronta per la stringa falsa, perché *"non con la tua
azienda"* è ciò che dicono in coro.

**E lo zero della sesta famiglia è un risultato**: nessuna schermata promette
niente su conservazione, cancellazione o diritti dell'interessato, quindi su quel
terreno la policy è libera di dire ciò che sarà vero invece di rincorrere una
frase già pubblicata.

##### Il footer, e il criterio delle rotte

**Il footer è stato guardato, non corretto.** L'affordance sull'elemento non c'è e
non ha lasciato residui, e nessuna delle sette voci è un bersaglio muto da
tastiera. Il difetto è **di simmetria di colonna** — quattro `<p>` resi in modo
identico ai cinque link veri, stesso asse, stessa larghezza, 314px a fianco — e la
misura sta nella sezione del perimetro con la nota che **il trattamento giusto
esiste già nello stesso footer**, e ce l'hanno tre voci su sette.

**Il criterio delle rotte del §10 regge senza riscritture** quando f) aggiungerà
pagine: aggiungere `n` voci porta le rotte a `26 + n` e le schermate a `27 + n`
per applicazione della definizione. Verificato, ed è il primo criterio di questo
repository a essere messo alla prova contro l'evento per cui era stato scritto.

##### Il criterio di conteggio alla sua terza passata

**La metà che discrimina non è ancora provata**, ed è la seconda volta che va
detto: la passata precedente aveva segnalato che la distinzione fra codice e
documenti non era stata esercitata, e qui succede di nuovo — **otto commit su
otto sono `docs:`**. Tre usi, zero prove sulla parte che aveva prodotto il
difetto originale. Chi farà la prossima passata mista sa che tocca a lui.

**La clausola aggiunta ieri ha funzionato al primo giro**: il numero di questa
sottosezione è stato scritto `n + 1` sapendo di predirlo, e sarebbe stato da
aggiornare se la passata avesse guadagnato un nono commit.

#### I terzi e la simmetria del footer (15.08.2026)

**Sei commit: tre di codice** — `fix:` ×3 — **e tre di documenti**. È la **prima
passata di codice dopo cinque di documenti**, e la prima con commit di entrambi i
tipi. `lint` e `typecheck` a zero, nessun `any`, e i guardrail restano **102**: la
riga datata del §5.6 non si muove.

Due correzioni sole, entrambe **misurate dalla passata precedente**, che non le
poteva fare perché toccava solo documenti.

##### La stringa: il contesto ha cambiato la domanda

`employee.profile.dataNote` diceva *"non vengono mai condivisi con terzi"* ed era
falsa. La domanda posta era se **nominare il destinatario** valesse la frase in
più; a rispondere è stato il contesto, non l'argomento: **cento pixel più su, sulla
stessa schermata, il `PrivacyBanner` dice già che nessun dato individuale arriva
all'azienda**. Riscrivere `dataNote` su quella stessa affermazione l'avrebbe
duplicata, e il §11 direbbe di togliere la riga, non di riscriverla. Nominare il
destinatario non è "più forte": **è ciò che le fa guadagnare il posto.**

> *"I tuoi dati sanitari li vedono i professionisti che scegli tu."*

**Senza esclusività, e la ragione è la stessa per cui la voce esisteva.** *"Solo"*
sarebbe vero sul prodotto — nessun metodo HR o admin restituisce `SessionNote` o
`CheckupReport` — e **lasco in diritto**, perché Kora quei dati li conserva ed è
la parte che la privacy policy dovrà nominare come titolare. Sostituire una
promessa falsa in diritto con una lasca nello stesso diritto sarebbe stato lo
stesso errore una tacca più piccolo, **dentro la passata che esiste per
chiuderlo**. Va scartata proprio perché suona meglio.

##### Il footer: due correzioni, e la seconda è un'estensione di scope

**Le quattro voci "Azienda" passano da `opacity-80` a `opacity-70`.** In questo
footer **0.8 è il livello dei link e di nient'altro** — ogni altro testo non-link
a 14px sta a 0.6 o 0.7 — quindi le quattro erano l'unica cosa non interattiva al
livello interattivo. Non si scende a 0.6: è il livello degli `<h4>`, e le quattro
finirebbero alla stessa opacità del titolo che le nomina, cioè una colonna piatta
al posto di due colonne gemelle.

**Le tre voci legali e il copyright passano da `opacity-50` a `opacity-60`**, ed è
scope aggiunto dai founder **dopo la misura**: 0.5 su quel fondo dà **4.08:1**
contro la soglia di 4.5, e 12px è testo normale. La riga precedente diceva "non si
toccano", ed è stata scritta prima che qualcuno le misurasse.

| | prima | dopo |
|---|---|---|
| i cinque `<Link>` | 0.8 — 7.92:1 | **invariati** |
| le quattro "Azienda" | 0.8 — 7.92:1 | 0.7 — **6.46:1** |
| tre legali e copyright | 0.5 — **4.08:1** | 0.6 — **5.18:1** |

##### Il buco non era nelle quattro righe, era nel metodo

È la parte che vale più della correzione, e serve alla prossima passata di
accessibilità **prima** che ricominci dalle stesse assunzioni.

**Un censimento che confronta il colore calcolato con il fondo non vede la
proprietà `opacity`**, perché l'opacità non sta nel colore: sta sull'elemento, e
`getComputedStyle` la restituisce a parte. Misurato sui **20 nodi di testo** di
quel footer: **leggendo il solo colore passano tutti a 11.45:1**, e quattro di
loro stanno a 4.08.

**Il caso di opacità che M5.a aveva colto è l'altra cosa.** L'anello di focus a
`/50` è **alpha dentro il token**, quindi il colore calcolato la porta e un
censimento sul colore la vede — ed è per questo che quel difetto fu trovato e
questi no. Due sintassi che si somigliano nel nome della classe e che uno
strumento distingue.

**La portata, censita**: fuori da `src/components/ui/` — congelato, e i suoi
`opacity-50` sono stati disabilitati, che la norma esenta — la proprietà `opacity`
sul testo vive in **tre file soli**: `Footer.tsx` (25 usi), `KPICard.tsx` (2) e
`Landing.tsx` (1). I quattro nodi sotto soglia erano tutti nel footer; **gli altri
tre sono stati rimisurati col metodo giusto e passano** — 7.36:1, 5.37:1 e 7.92:1.
Il `CLAUDE.md` §6.1 porta la correzione con la sua data: quello "zero" è stato
falso di quattro nodi **dall'11.08.2026 al 15.08.2026**.

##### Verificato a schermo, e cosa passa a un umano

**Sulla build demo, viewport 1280 con `innerWidth` verificato** — e la verifica è
stata rifatta su scheda nuova perché la prima è diventata cieca a metà sessione,
`innerWidth` a **0**, cioè la trappola che il §11 descrive: le misure non erano
imprecise, erano di un'altra pagina.

- **la simmetria è rotta alla misura**: l'asserzione `stiliIdentici` fra il primo
  link e la prima voce, che la passata precedente aveva trovato **vera**, ora è
  **falsa**;
- **i link sono intatti**: cinque ancore, cinque elementi focalizzabili, `cursor:
  pointer`, 0.8;
- **zero nodi sotto soglia** sui 20 del footer, misurati con l'opacità composta;
- **la stringa in tutte e quattro le lingue, una riga e nessun troncamento**:
  it 316px, de 388px, fr 412px, en 332px in un contenitore da 832 — il francese è
  il più lungo, non il tedesco, e nessuna delle quattro sfiora il bordo;
- **il footer tedesco tiene**: le quattro voci restano su una riga ciascuna, zero
  overflow di pagina.

**Due asserzioni passano a un umano**, e sono quelle che si giudicano a occhio:
**il footer intero guardato di colpo** — le due colonne devono smettere di
leggersi come la stessa cosa — e **il puntatore che passa da "Portale HR" a "Chi
siamo"**, che è il gesto che ha rivelato il difetto. Il pannello non le poteva
prendere: dopo lo scorrimento la pagina non ridipinge e il raster del footer esce
bianco. **Se a 0.7 la lettura non cambia, la ricaduta è 0.6 e la colonna piatta è
il prezzo**, dichiarato qui perché la scelta resti ricostruibile.

##### Il criterio di conteggio, alla prova che mancava

Tre passate di fila avevano dichiarato che la metà che discrimina non era stata
esercitata. **Questa la esercita: tre `fix:` e tre `docs:`.**

**Ha retto, e nessun commit è stato ambiguo da classificare** — ma la ragione
merita di essere scritta, perché non è quella che sembra: **il criterio classifica
sul prefisso, non sul contenuto**, quindi la domanda *"cambiare quattro stringhe di
dizionario è codice o documenti?"* non si pone mai in fase di conteggio. Si pone
**a monte**, quando si sceglie il prefisso.

Ed è lì che è rimasto il giudizio: la riscrittura di `dataNote` tocca solo testo, e
`docs:` sarebbe stato difendibile a parole. È `fix:` perché **corregge
un'affermazione falsa del prodotto**, non un documento — e il prodotto è ciò che
quella stringa rende a schermo. **Il criterio decide la colonna; a scegliere il
prefisso resta chi scrive**, ed è utile saperlo prima della prossima passata mista.

#### Identità collisa e stati limite, seconda tornata (16.08.2026)

**Undici commit: sette di codice — `fix:` ×7 — e quattro di documenti.** Totale e
ripartizione dalla stessa misura, `git log --format='%s' master..HEAD`, come vuole
il criterio in testa a questo file; il numero è scritto `n + 1` perché il commit di
chiusura conta sé stesso. **È la seconda passata mista**, dopo quella sui terzi e
la simmetria del footer, e la prima in cui il codice è la parte grossa.

Sei difetti verificati, nessuno dei quali rompeva la demo. **Nessun numero del §8
e del §9 si muove** — verificati a schermo alla cifra, elenco più sotto — e il
filo che tiene insieme i primi due è lo stesso: **un dato che identifica una
persona è finito dove non doveva**, una volta per collisione e una per campo.

##### Una persona sola descritta come due, e il contrario

`S.C.` erano insieme **Sara Conti**, referente HR di Demo SA nel back-office, e la
dipendente delle Vendite che è **la paziente più lunga della Dr.ssa Meier** — dodici
sedute su un cap di dieci, cioè una delle due righe sopra cap che `docs/PITCH.md`
indica a schermo come prova che il tetto è reale. Per il §8 — *stesse iniziali,
stessa persona* — le tre schermate parlavano di lei: la referente HR risultava in
Vendite e con il percorso terapeutico più lungo della demo, accanto al proprio nome,
cognome ed email.

**A cambiare sono le iniziali, non il nome** (`sc` → `ig`, `S.C.` → `I.G.`): un nome
nuovo passa dalla verifica del §8 e da una decisione dei founder, una coppia di
iniziali libera no. Le occupate erano undici e la scelta è caduta fuori da tutte,
comprese le sette che si ricavano dai nomi del back-office — che nessun elenco
teneva.

##### Il guardrail che c'era guardava una lista sola, e non poteva vederla

L'invariante del §8 viveva dentro `EMPLOYEE_DIRECTORY`, mentre le persone di questa
demo stanno in **tre** elenchi: l'estratto dell'HR, l'agenda della professionista e
gli utenti del back-office. Ora li attraversa tutti e tre, in `platform.ts` — l'unico
dei tre file che può importare gli altri due senza chiudere un ciclo, e anche
l'elenco arrivato per ultimo, cioè quello che ha introdotto la collisione. Il
controllo vecchio **è stato spostato, non duplicato**: due guardie sulla stessa
condizione sono due posti in cui sbagliarla (§5.6).

**Quattro confronti, e il quarto è quello che serviva.** Azienda, reparto e id di
dominio non avrebbero trovato niente — il back-office non dichiara né reparto né id,
quindi per quei tre `S.C.` era coerente. A distinguere `M.B.` da `S.C.` è il
**ruolo**: chi compare nell'estratto o fra i pazienti è un dipendente in un percorso
di cura, e un ruolo diverso da `employee` sulle stesse iniziali vuol dire o due
persone o il percorso di cura di chi dipendente non è.

**È una scelta di questa passata e va portata ai founder**, perché il perimetro
chiesto erano azienda e reparto: senza il quarto confronto il guardrail sarebbe
passato su entrambi i casi, cioè non avrebbe distinto quello che gli era stato
chiesto di distinguere. Il quinto controllo — **stessa persona, stesse iniziali** —
è la direzione opposta, e non è ornamento: rinominare una lista e non l'altra è
esattamente ciò che questa passata ha fatto a mano.

**Provato nei due versi**, che è il criterio del §5.6:

| dataset | esito |
|---|---|
| `sc` / `S.C.` rimesso nel solo estratto HR | pagina bianca in sviluppo, e il messaggio esatto: *"S.C. è un dipendente secondo l'elenco dipendenti dell'HR e ha ruolo "hr" secondo gli utenti del back-office"* |
| `ig` / `I.G.` | nessun guardrail parla, le 27 rotte si disegnano |

##### Il punteggio salute individuale esce dal contratto (founder, 16.08.2026)

`PlatformUser` portava `firstName`, `lastName`, `email` **e** `healthScore`, e
`/admin/utenti` li rendeva tutti e quattro. Era l'unica eccezione a ciò che il
`CONTRATTO-DATI.md` §3 dichiara per l'intero contratto — *`CheckupReport` è l'unico
dato sanitario individuale del dominio, e nessun metodo di HR o admin lo
restituisce* — e **nessuna riga la nominava**: chi leggeva quel paragrafo non aveva
modo di scoprirla.

Il campo è uscito, la colonna con lui. Al suo posto due cose che non sono la stessa:

- **`PlatformUser.assessmentCompleted`** dice **che** l'assessment è stato fatto e
  mai cosa ha detto. È la distinzione con cui `EmployeeDirectoryEntry` porta già lo
  stato del check-up senza portarne l'esito, e senza di essa la KPI "con
  assessment" sarebbe morta con il campo che la alimentava;
- **`PlatformMonth.averageHealthScore`** è il punteggio **aggregato**, cioè la forma
  in cui può stare in un'area che vede i nomi: una media non si attribuisce a
  nessuno. Sta su quella serie perché è già *la serie sola per tutti i grafici del
  back-office* (§2 del contratto), e una seconda entità con la stessa cadenza è una
  seconda cosa che può divergere.

**Sette cifre non ratificate diventano una.** I punteggi individuali non stavano nel
§8 più di quanto ci stia la media: la differenza è che ora è **un valore dichiarato
e dichiarato tale**, come le sedute di carriera. Vale **73**, che è ciò che la media
dei sette dava — la schermata non si muove — ed è **la cifra da portare ai founder**
perché entri nel §8 o venga cambiata. La sua costanza sulla finestra è una
semplificazione della demo ed è registrata nel §7 del contratto.

**Nessun guardrail nuovo, e la ragione vale quanto uno aggiunto.** L'invariante
disponibile sarebbe *`averageHealthScore` è `null` se e solo se non c'è nessun
iscritto*, cioè il confronto dell'espressione con sé stessa una riga sotto dove è
scritta: è il guardrail che la passata sulla nota di sessione ha già rifiutato, e
rifiutarlo di nuovo è coerenza, non pigrizia.

##### La nota di sessione tornava sovrascrivibile, sul ramo d'errore

`loadState` non comprendeva `noteQuery` e il suo `isError` non era reso da nessuna
parte. Su lettura fallita `stored` restava `undefined`, la bozza cadeva su
`EMPTY_DRAFT`, e il dialogo si apriva **in bianco su una seduta che la nota ce
l'ha** — l'etichetta diceva "Nota" — con "Salva nota" premibile. **Un guasto di
rete diventava una cancellazione**, sull'unica scrittura del dominio che M2 esisteva
per dimostrare, e sul difetto che il commento sopra quella query dichiara chiuso.

Ora il dialogo rende l'errore **al posto del modulo**, e non è severità: tre campi
vuoti accanto a "non è stato possibile leggere la nota" si leggono comunque come una
nota vuota, che è precisamente l'equivoco da cui nasce la sovrascrittura. Il
salvataggio ha una terza condizione, `note.state !== "ready"`, che sorveglia
l'**attesa**.

**Il corpo non si sospende, ed è una decisione già presa**: sospenderlo toccherebbe
anche le 55 sedute senza nota, dove il modulo vuoto è la resa giusta — è il tranello
che la passata del 15.08.2026 aveva già visto e scartato. A non essere disponibile
è il salvataggio, non la schermata.

##### Tre stati limite, e uno era un pulsante che non faceva niente

- **Il pulsante "Avvia"** delle sedute in programma non aveva `onClick`: l'unico
  controllo attivo dell'applicazione che non faceva nulla, su 18 righe, nella prima
  scheda che si apre entrando nel portale. Passa al registro del pulsante del
  check-up — **disabilitato, con il motivo nell'etichetta** — perché toglierlo
  avrebbe lasciato la seduta in programma senza esito visibile. La chiave `start`
  esce dai quattro dizionari con lui: una stringa che nessuno legge è codice che il
  §11 non vuole.
- **Il check rapido spariva in silenzio.** `isError` era scartato e `undefined`
  faceva `return null`, quindi una lettura fallita **toglieva la card dalla home**
  senza che niente lo dicesse — ed è la card su cui poggia la risposta a *"da dove
  vengono i numeri di stress?"*. L'errore resta **dentro la card** e non al posto
  della pagina: appuntamenti e contatori sono arrivati benissimo.
- **Il referto del check-up non si apriva da tastiera.** Era un `div` con `onClick`,
  senza `role`, `tabIndex` né gestione dei tasti, ed era **l'unico modo** di aprire
  quel dialogo, mentre M5.a dichiara il percorso del pitch percorribile da sola
  tastiera. Ora è un `<button>` vero, che porta fuoco, `Enter` e `Spazio` senza che
  nessuno li riscriva. Nello stesso dialogo il corpo usciva solo su `report &&`:
  con `?empty=getCheckupReport` si apriva **un riquadro con il solo titolo**, e il
  vuoto ora ha il suo ramo.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **27 schermate percorse**, zero vuote, **zero stati d'errore raggiungibili**,
  nessun overflow orizzontale, console senza errori;
- **`?fail=getSessionNote` sulla prima visita di L.B., che la nota ce l'ha**: il
  dialogo dice *"Nota non disponibile — La nota di questa seduta non è stata letta.
  Salvare adesso la sovrascriverebbe."*, **zero textarea e nessun pulsante di
  salvataggio**. Senza manopola gli stessi tre campi tornano pieni e "Salva nota" è
  premibile; con `:1` il "Riprova" **riesce davvero** e i tre campi si riempiono;
- **8 "Nota" e 55 "Aggiungi nota"** fra le 63 erogate, cioè il rapporto del
  15.08.2026 invariato;
- **`?fail=getRapidCheckAnswer`**: la card mostra l'errore al posto dei cinque
  volti, e il resto della home resta intero — 78/100, i tre appuntamenti, `3 su 10
  sessioni usate · 3 in programma`. Con `:2` il "Riprova" riporta i cinque volti;
- **`?empty=getCheckupReport`**: il dialogo dice *"Per questo check-up non c'è un
  referto da mostrare."* invece del solo titolo;
- **la card del referto è un `<button type="button">`**, `tabIndex` 0, nome
  accessibile dal testo che contiene, `:focus-visible` che aggancia e anello a
  `rgb(17,57,90)` — `primary`, **11.95:1** sulla banda — con raggio `12px`, cioè
  quello della `Card` che avvolge;
- **`/admin/utenti`**: sei intestazioni e **nessuna colonna del punteggio**;
  `profilo salute medio 73` con sottotitolo *"su tutti i clienti in portafoglio"*,
  `con assessment 6` sulle sette righe, `utenti iscritti 415` fermo;
- **i 18 pulsanti video sono `disabled`**, fuori dall'ordine di tabulazione, 265px
  di etichetta in una riga da 945 e nessun overflow;
- **la prova sopra cap regge sul nome nuovo**: `I.G. · 12 sedute erogate · 10
  incluse + 2 a CHF 28`, e l'estratto HR la dà in Vendite;
- **i numeri del pitch fermi**: CHF 14'200, 16 giorni, 68%, 82 iscritti su 120, 41
  attivi, 142 di 1'200, 62%, soglia 12, −2 punti, 2.35:1, 78/100, 3 su 10 · 3 in
  programma, 1 su 4, 6 pazienti attivi, 63 erogate su 82, 14 sedute, CHF 80, CHF
  1'120, CHF 5'040, CHF 652'968, 415 e 798;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **106 = 99 + 7**.

##### Due cose sullo strumento, e la seconda è nuova

**Radix non risponde a `element.click()` in questo pannello.** Le schede di
`ProSessioni` non cambiavano né col clic sintetico né con il clic reale sul
riferimento, e il tasto freccia non muoveva il fuoco. Rispondono a una **sequenza di
eventi puntatore completa** — `pointerdown`, `mousedown`, `pointerup`, `mouseup`,
`click` — perché è il `pointerdown` che ascoltano, non il `click`. È la strada con
cui sono state prese tutte le asserzioni sui dialoghi di questa passata, e vale la
pena saperlo prima della prossima: senza, l'unica lettura possibile è *"la scheda
non cambia"*, che si legge come un difetto della pagina.

**Una scheda è diventata cieca a metà sessione**, `innerWidth` a **0** e
`read_page` che riportava *"viewport 0x0"*: la trappola del §11 esatta, e le misure
prese lì sarebbero state di un'altra pagina. Le verifiche sono state rifatte su una
scheda nuova. È la seconda volta che questo file la registra in due giorni, dopo la
passata sul footer — **non è un caso raro, è il modo normale in cui questo pannello
invecchia**, e il controllo di `innerWidth` prima di ogni misura è la sola difesa.

##### Aperto e dichiarato

- **Il quarto confronto del guardrail — il ruolo — è una scelta di questa passata**,
  non del perimetro chiesto, e va ratificata o tolta. Se i founder decidessero che
  la referente HR può comparire nell'estratto dei dipendenti della propria azienda —
  cosa vera nella realtà, e che qui produrrebbe un percorso di cura accanto a un
  nome in chiaro — quel confronto va sostituito con un reparto sul back-office, che
  oggi non c'è.
- **Il 73 non è nel §8.** È dichiarato in `platform.ts` con il suo commento, e
  finché non entra nella costituzione è una cifra del dataset che il §2.4 non
  copre: era vero anche dei sette punteggi che sostituisce, ed è il momento giusto
  per chiuderlo perché adesso è **una** riga.
- **L'attivazione da tastiera del pulsante referto resta sulla parola dello
  standard.** `Enter` sintetico non riproduce l'azione di default — è la stessa cosa
  annotata da M5.c per l'invio del form — quindi ciò che è misurato è che
  l'elemento è un `<button>` focalizzabile con l'anello visibile, non il tasto che
  apre il dialogo.

#### Simmetrie e verifiche vere — l'ultima passata sulla demo (16.08.2026)

**Quattordici commit: otto di codice — `fix:` ×8 — e sei di documenti.** Totale e
ripartizione dalla stessa misura, `git log --format='%s' master..HEAD`; il numero
è `n + 1` perché il commit di chiusura conta sé stesso. **Nessun numero del §8 e
del §9 si muove.**

**Con questa passata la demo è congelata**: il lavoro successivo è il perimetro
dell'MVP (`docs/CONTRATTO-DATI.md` §8, dieci gruppi) e le decisioni in sospeso di
questo file, che hanno una definizione di finito. Non ci sono altre passate di
refinement.

Comprende la **chiusura della passata precedente** — quattro punti che la review
di quella PR aveva sollevato — e sette difetti nuovi. Il filo che tiene insieme
la parte grossa: **un controllo che dichiara più di quanto verifica**, in cinque
forme diverse.

##### La chiusura della passata precedente

**Il guardrail sulle identità diceva una cosa falsa del dominio.** Il confronto
sul ruolo affermava che il back-office stava esponendo il percorso di cura di chi
dipendente non è: **una referente HR è una dipendente**, può stare nell'estratto
della propria azienda e può essere in cura — il prodotto ha bisogno che sia
possibile. Il controllo non è cambiato di una riga; è cambiato ciò che dichiara.
Quello che è vero e verificabile è più modesto: **in questo dataset chi ha un
ruolo non-`employee` non compare negli altri due elenchi**, perché le iniziali
sono l'unica chiave che li unisce. È una regola del dataset demo, ed è entrata
fra le semplificazioni del §7 del contratto: in produzione le liste si uniscono
per id vero e il vincolo sparisce insieme al guardrail.

**Il pulsante del referto ha un `aria-label` esplicito.** Avvolge una `Card`,
cioè *flow content*, che il modello di contenuto di `button` non ammette:
funziona in ogni browser di oggi ed è esattamente ciò che rende fragile un nome
calcolato dal contenuto. È l'eccezione dichiarata alla regola di
`RapidCheckCard`, e il testo **non contraddice quello visibile** — la card dice
già "tocca per vederlo" — quindi non apre lo scarto fra chi legge e chi ascolta
che quella regola esiste per impedire.

**«Tutti i campi di `PlatformMonth` contano lo stesso insieme» è diventato
«tutti i campi sommatori».** Con `averageHealthScore` dal predicato dipende la
**presenza** — `null` se non c'è nessun iscritto — e non il **valore**: è una
media, e sommarla sui clienti del mese darebbe un numero che non vuol dire
niente. Stessa forma della correzione tre paragrafi sopra, e stessa data.

**`fr.ts` dichiarava una regola tipografica che non ha mai seguito.** La testata
prometteva lo spazio unificatore U+00A0 davanti a `:` e `?`; nel file gli U+00A0
erano **zero**, **compresi i due esempi che la testata portava a modello**.
**Il conto, con il criterio**: si contano le occorrenze dentro i letterali di
stringa, cioè ciò che va a schermo, non la prosa dei commenti che li nomina —
**35**, 25 e 10. Un conteggio sul file intero si sposta ogni volta che qualcuno
tocca un commento, ed è il numero senza criterio che il §5.6 esiste per non
produrre.

**Delle due strade è stata tolta la dichiarazione, non applicata la regola**, e
le ragioni sono scritte nella testata perché la prossima passata non le rifaccia:
**quale** carattere è precisamente ciò che decide un revisore madrelingua — la
forma stretta vuole U+202F davanti a `; : ! ?`, quella corrente ammette U+00A0
davanti ai due punti; sarebbe **il quinto carattere invisibile** di questo
codice, che è ciò che il `CLAUDE.md` §2.7 ha rifiutato per il separatore delle
migliaia; e **il momento in cui la spazzata pagherebbe non arriva prima della
revisione**, il cui innesco è una presentazione non in italiano che
`docs/PITCH.md` dichiara di non fare. Chi arriva prima non è un lettore
francese: è chi apre il file e legge una promessa che il file non mantiene.

##### Gli slot: tre confronti su cinque guardavano l'istante

`getAvailableSlots`, il primo controllo di `bookAppointment` e il guardrail
statico sull'agenda del portale confrontavano **il solo istante di inizio**,
mentre il gemello di `scheduling.ts` e il terzo controllo della prenotazione
confrontavano intervalli — la correzione del 15.08.2026 fatta su un lato e
lasciata asimmetrica sull'altro. Uno slot che invade a metà una seduta già presa
veniva **offerto** e poi **accettato**.

**Una primitiva sola, cinque chiamanti**, e sta in `lib/dates.ts` e non in
`mock/`: la regola non è del dataset finto, è del dominio, e sopravvive alla
cancellazione di `mock/` (§5.7). Estremi esclusi — una che finisce alle 17:30 e
una che comincia alle 17:30 si toccano, non si sovrappongono.

**La trappola a verbale è chiusa, ed è un controllo nuovo.** Il gemello statico
confronta gli slot **fra loro** e non può vedere uno slot che cade su una seduta
già in agenda del paziente: il caso più stretto è Fontana del giovedì contro la
seduta di Laura delle 17:30. Ora un secondo guardrail confronta **ogni slot
proponibile con le sedute che il dipendente ha già**, con qualunque
professionista, e gira all'inizializzazione — cioè il giorno in cui qualcuno
tocca `SESSION_DURATION_MINUTES` e non prenota niente.

**Provato in isolamento**, che è il modo di distinguere i due controlli: portando
la durata a 61 parla per primo il gemello di `scheduling.ts`, quindi il caso
nuovo non si vedrebbe. Spostando invece lo slot Fontana alle 17:00 — una fascia
che non collide con nessun altro slot ma invade la seduta di Laura — parla **solo
il controllo nuovo**, con la data e il professionista giusti. È la prova che i
due non si coprono a vicenda.

##### "Una pagina sola" non era verificata da niente

`downloadReportPdf` restituiva `doc.getNumberOfPages()` dopo un `addImage` solo:
vale **sempre 1**, qualunque cosa sia stata disegnata. Il §10.C.3 chiedeva una
pagina e nessuno lo verificava; il chiamante ignorava quel numero, **a ragione**.
E il caso vero non era controllato: un contenuto più alto del foglio veniva
disegnato oltre il bordo e **ritagliato in silenzio**.

Ora l'altezza disegnata si confronta con quella utile — 785.89 pt — e chi non ci
sta **non viene salvato**: il guardrail dice di quanto si sfora, e il lancio
copre anche la build silenziosa, dove un file che arriva sembra un successo. Il
ritorno tautologico è sparito: **lo "qualcosa" del chiamante è uno stato**, non
un numero su cui nessuno ramificava.

**Misurato in tutte e quattro le lingue**: 546.8 pt in italiano, francese e
inglese, **560.3 in tedesco** — che è la più alta — su 785.89 disponibili. Il
margine più stretto è di 225.6 pt.

##### Tre scritture dello stesso fatto, e un metodo che rispondeva a un'altra domanda

**`SAVINGS_PER_ACTIVE` era `14200 / 41`**, e quel 41 stava nel primo seme tre
righe sopra mentre i CHF 14'200 stavano anche in `toSnapshot`. Cambiando gli
attivi del trimestre corrente, i tre precedenti sarebbero stati scalati con un
tasso vecchio, e **nessun guardrail se ne sarebbe accorto**: gli importi che ne
escono sono plausibili e crescono come devono. Era l'unico punto del dataset in
cui il §5.5 era violato su un numero d'ancoraggio. Il divisore viene dal seme,
l'ancoraggio resta scritto una volta, e i quattro importi non si muovono —
14'200 / 11'800 / 9'400 / 6'200, 16 / 13 / 10 / 7 giorni.

**`monthlyEarnings` accetta un mese e calcolava il regime da `DEMO_TODAY`**:
chiedendo i compensi di un mese passato si otteneva il regime di oggi.
Invisibile, perché `ProPagamenti` chiede solo il mese corrente — e nondimeno un
metodo del contratto che risponde male a una domanda che accetta. La finestra è
ora ancorata al mese chiesto, e sul mese corrente la risposta non cambia: `Tieni
5 sedute a settimana`.

##### La chiave non codificava la domanda, e il parametro è uscito

`getProfessionals` prendeva un `ProfessionalFilter` su specialità e lingua che
**nessuno dei quattro consumatori passava**, mentre la lettura sta su
`queryKeys.professional.all()`, che è costante: il primo chiamante con un filtro
avrebbe letto la risposta di un'altra domanda.

**Fra codificare il filtro nella chiave e togliere il parametro è uscito il
parametro**, per tre ragioni: il §11 non vuole opzioni che nessuno passa; **il
filtro che serve non è quello** — chi prenota filtra per prenotabilità e tipo di
servizio; e il vuoto vero, che il §8 del contratto già nomina, è che **il
dipendente non ha una lingua**, quindi nessun filtro per lingua è costruibile da
questo lato. Il giorno in cui ce l'ha, il parametro torna **insieme alla sua
chiave**. Il §8.8 è stato aggiornato: citava quel filtro come già esposto.

##### Due numeri che non dicevano di cosa parlavano

**L'asse dei ricavi era in migliaia senza unità**: leggeva `0 15 30 45 60` sotto
un titolo che dice "ricavo ricorrente mensile", accanto a una KPI che dice CHF
54'414 — due numeri sullo stesso fatto a due ordini di grandezza di distanza. In
più `formatNumber` non ha decimali, quindi un tick a 6'600 usciva **"7"**.
Rendere l'importo intero non chiede una stringa nuova e fa combaciare l'asse con
la KPI e con il tooltip: ora legge `0 15'000 30'000 45'000 60'000`.

**"Check-up prenotati · sui dodici mesi" sommava tutta la piattaforma** (212)
mentre la dashboard HR ne mostra 51 per la sola Demo SA, e l'etichetta non lo
diceva. Ora dice "di piattaforma", che è la disciplina già adottata per le tre
accezioni di "sedute".

##### I fatti corretti nei documenti, con una regola diversa per ognuno

| | dove | rimedio |
|---|---|---|
| `react-router-dom 6` | `CLAUDE.md` §3 | **7**, con la data: invecchiata dal 12.08.2026, nella sezione che ogni sessione legge per prima |
| `663 chiavi` | `placeholders.ts` | **731**, che è sorgente e si corregge al valore misurato |
| `663 chiavi` | verbali M5.e | **non riscritti**: sono resoconti datati. Il 663 **non era invecchiato, era sbagliato quando è stato scritto** — al merge della tranche tedesca le chiavi erano già ~721 |
| il criterio delle chiavi | `CLAUDE.md` §2.7 | **scritto**: chiavi foglia di tipo stringa, **tolti prima i commenti**, ed è l'unico punto che le conta |
| il settimo `assertInDevOutsidePromise` | questo file, PR #49 | **la sua riga**, dove è nato: il controllo sull'agenda del paziente, lungo perché sta in un metodo `async` |

**Il criterio delle chiavi è il quarto conteggio di questo repository a nascere
con la regola accanto**, dopo i call site del §5.6, i `.jsx` del §3 e le rotte
del §10 — ed è quello che chiude la famiglia «due conteggi dello stesso oggetto
senza criterio». La trappola qui è che **la prosa che nomina una chiave non è una
chiave**: contando senza togliere i commenti `it.ts` dà 732 e gli altri tre 731,
cioè una differenza che non esiste.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato

- **27 schermate percorse**, zero vuote, zero stati d'errore raggiungibili,
  **zero overflow orizzontale**, console senza errori;
- **il giro del marketplace regge la riscrittura dei confronti**: prenotata la
  Dr.ssa Meier venerdì 25.09 alle 10:00, la conferma lo dice, la home passa da 3
  a **4 in programma** con `used` fermo a 3, e la seduta compare nel calendario
  della professionista;
- **il dialogo di prenotazione offre gli slot giusti**: Meier il venerdì propone
  **solo le 10:00**, cioè la fascia del pitch;
- **i due controlli sugli slot provati in isolamento** (tabella sopra);
- **il PDF sta in una pagina in tutte e quattro le lingue**: 546.8 / 560.3 /
  546.8 / 546.8 pt su 785.89, e con il foglio ridotto ad arte il pulsante mostra
  *"Il PDF non è stato creato"* invece di scaricare un documento tagliato;
- **l'asse dei ricavi**: `0 15'000 30'000 45'000 60'000`, nessun overflow;
- **la KPI dei check-up dice il suo perimetro in tutte e quattro le lingue**,
  ognuna su una riga e senza overflow;
- **il pulsante della videochiamata nelle quattro lingue**: 265 / 269 / 294 / 243
  px in una riga da 945, il francese è il più largo;
- **l'`aria-label` del referto** è `Apri il tuo ultimo referto`;
- **i numeri del pitch fermi**: CHF 14'200, 16 giorni, 68%, 82 su 120, 41 attivi,
  142 di 1'200, 62%, soglia 12, −2 punti, 2.35:1, 78/100, 3 su 10 · 3 in
  programma, 1 su 4, 6 pazienti attivi, `I.G. · 12 sedute · 10 incluse + 2 a CHF
  28`, 63 erogate su 82, CHF 1'120, CHF 5'040, CHF 652'968, 415 su 798;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **108 = 100 + 8**,
  con tutte e quattro le occorrenze del §5.6 mosse insieme.

##### Una cosa sullo strumento, e vale per chi verificherà l'MVP

**Radix non risponde a `element.click()` in questo pannello**, e nemmeno al clic
reale sul riferimento: schede, dialoghi e popover restano fermi, e la lettura
naturale è *"la schermata non funziona"*. Rispondono a una **sequenza di eventi
puntatore completa** — `pointerdown`, `mousedown`, `pointerup`, `mouseup`,
`click` — perché ascoltano il `pointerdown`. È la strada con cui sono state prese
tutte le asserzioni sui dialoghi di questa passata e della precedente, ed è la
prima volta che questo file la scrive per esteso.

#### La riga della seduta e i criteri che si contraddicevano (16.08.2026)

**Quattro commit: uno di codice e tre di documenti** — totale e ripartizione dalla
stessa misura, `git log --format='%s' master..HEAD`, con il numero scritto `n + 1`
perché il commit di chiusura conta sé stesso. **Nessun numero del §8 e del §9 si
muove.**

È la passata che chiude la demo: quella precedente si era dichiarata l'ultima, e
questa raccoglie ciò che la sua review ha trovato. **Da qui il lavoro è il
perimetro dell'MVP** (`docs/CONTRATTO-DATI.md` §8) e le decisioni in sospeso.

##### La riga della seduta non sapeva cedere

Il blocco di destra è `flex-shrink-0` e il pulsante eredita `whitespace-nowrap`
da shadcn, quindi non cede mai; quello di sinistra aveva `min-w-0` e **nessun
troncamento**, quindi si stringeva fino a niente e il testo **continuava a
dipingere fuori dalla propria scatola**, sopra il pulsante. Misurato a 420px: la
data chiedeva **72px in una scatola da 17**.

**Le due scatole non si sovrapponevano mai**, ed è la ragione per cui il difetto
è sopravvissuto a tre passate di verifica: un controllo che confronta i
rettangoli dei due blocchi trova sempre il `gap-4` fra loro e risponde "nessuna
sovrapposizione". A sovrapporsi erano **i glifi**, che escono da un elemento con
`overflow: visible` senza spostarne il bordo. Il controllo giusto è
`scrollWidth > clientWidth` **insieme a** `overflow === "visible"`, ed è la
settima trappola di misura che questo file registra.

**Non è un difetto di mobile**: la soglia dichiarata resta 1280px (§10.C) e non
si sposta. È il §2.7 — niente larghezze fisse su etichette e pulsanti, layout che
regge parole più lunghe — e le etichette di quella riga cambiano con la lingua e
con lo stato della seduta, quindi **chi scrive la riga non conosce la larghezza
del pulsante**.

**Due modi di cedere, ed è la riga a cederli, non la stringa**: `truncate` tiene
il testo dentro la sua scatola, e `flex-wrap` più una base sul blocco di sinistra
manda il pulsante **sotto** quando la riga smette di leggersi come "iniziali +
data". La base non è una larghezza fissa su un'etichetta: è la soglia sotto la
quale è giusto che a spostarsi sia il pulsante.

**Un componente copre entrambe le schede.** Le sedute in programma e quelle
erogate sono lo stesso `SessionRow`, quindi l'etichetta corta riceve lo stesso
trattamento per costruzione — non c'era una seconda riga da correggere.

##### Verificato a schermo, `innerWidth` controllato prima di ogni misura

Tre larghezze, e in ognuna il conto è sulle righe rese, non su una:

| | righe | sovrapposizioni | testo che dipinge fuori | pulsante sotto |
|---|---|---|---|---|
| 1280 · it | 18 + 63 | 0 | 0 | 0 |
| 1280 · de | 18 + 63 | 0 | 0 | 0 |
| 380 · it | 18 + 63 | 0 | 0 | **tutte** |
| 380 · de, fr | 18 | 0 | 0 | tutte |

A 1280 non cambia niente in nessuna lingua: i due blocchi restano sulla stessa
riga con circa 370px di margine, e il pulsante resta a filo del bordo destro
della card.

##### Il criterio delle chiavi autorizzava i numeri che esisteva per impedire

Il §2.7 diceva *"chiavi foglia di tipo stringa, tolti prima i commenti"*, e **due
motivi di ricerca entrambi fedeli a quella frase danno numeri diversi**: 669 e
731. La ragione è una proprietà del file e non della fretta di chi conta —
**62 delle 731 chiavi hanno il valore sulla riga successiva**, perché la stringa
non ci stava — quindi un motivo per riga le prende o le perde a seconda che il
suo `\s*` attraversi l'a capo.

**Il conto si fa sull'albero sintattico**, e il comando sta nel §2.7. Sull'albero
non c'è niente da togliere: i commenti non sono nodi, e una proprietà o ha un
letterale stringa per valore o non è una chiave foglia. Verificato: **731
proprietà con inizializzatore letterale stringa, 109 oggetti, zero proprietà di
altro tipo**, identici sui quattro dizionari.

È la stessa forma delle correzioni al conteggio dei call site e dei `.jsx` — con
la differenza che qui a essere invecchiato non era il numero, era **il criterio**,
scritto due giorni fa da questa stessa serie di passate.

##### Cosa vuol dire "occupato", scritto per il backend

Il §4 del contratto diceva già che `bookAppointment` deve poter rifiutare uno
slot occupato, e non diceva cosa sia occupato. Ora che la regola vive in un punto
solo e **sopravvive alla cancellazione di `mock/`**, la definizione sta nel §8.5:
stesso professionista **o stesso paziente**, intervalli e non istanti, estremi
esclusi, e le annullate liberano la fascia.

La metà che si dimentica è il **paziente**, perché ogni agenda guardata da sola è
coerente — ed è esattamente il difetto trovato il 15.08.2026 e chiuso il giorno
dopo.

##### Due cose trovate e **non** difetti, registrate perché nessuno le corregga

Sono l'esito più utile della review della passata precedente, e stanno qui per la
ragione opposta a quella solita: **non perché qualcuno le sistemi, ma perché
nessuno lo faccia in buona fede.**

- **L'asse dell'attivazione di `AdminAnalytics` va da 0 a 100%, ed è giusto
  così.** La serie scende da **~68% a ~52%** sui dodici mesi — misurata sul
  grafico, 16 punti di dislivello — perché ogni cliente nuovo entra con
  un'adozione più bassa e diluisce il totale: è la curva dell'onboarding che il
  §8 racconta. Troncare l'asse sul range dei dati trasformerebbe quella
  diluizione in una **caduta** che i dati non sostengono. Si legge poco
  pronunciata perché 16 punti su 100 sono poco pronunciati; se un giorno
  l'onboarding deve vedersi, **si annota, non si riscala**.

  *(Due cifre sbagliate hanno accompagnato questa voce prima che qualcuno la
  misurasse: «fra il 44% e il 52%», nella segnalazione che l'ha aperta, e «otto
  punti percentuali», nella richiesta che l'ha chiusa. Sono 16, e nessuna delle
  due cambia la conclusione — ma è la famiglia che questo file insegue da tre
  passate, riprodotta su una riga che nessuno considerava un conteggio.)*

- **`getStressHistory(departmentId?)` non è il caso del filtro tolto da
  `getProfessionals`.** Si somigliano — un parametro opzionale su una lettura —
  e le due proprietà che contano sono opposte: **la chiave lo codifica**,
  `["company", "stress", departmentId ?? "all"]`, e **ha due chiamanti veri**,
  `HRDashboard.tsx:164` per la serie aziendale e `:176` per quella del reparto in
  alert. Il filtro dei professionisti non aveva né l'una né l'altra cosa. È la
  distinzione da tenere a mente: a rendere tossico un parametro opzionale non è
  l'opzionalità, è **una chiave che non distingue le due domande**.

#### Le parole e il perimetro (17.08.2026)

**Dieci commit: quattro di codice — `refactor:` ×2, `fix:` ×2 — e sei di
documenti.** Totale e ripartizione dalla stessa misura,
`git log --format='%s' master..HEAD`. *(La sottosezione ne dichiarava nove: il
commit di chiusura conta sé stesso, quindi il numero si scrive `n + 1`, cioè si
predice — e la passata ne ha guadagnato uno dopo. Aggiornato nello stesso commit
che l'ha aggiunto, che è l'obbligo scritto in testa a questo file dalla prima
passata a cui è successo.)* **Nessuna
logica cambia**: solo stringhe e documenti, e **nessun numero del §8 e del §9 si
muove** — l'elenco verificato è più sotto.

##### Una parola sola per la stessa cosa

Il prodotto diceva **"sedute"** nel portale professionista e nel back-office e
**"sessioni"** nei piani, nel portale dipendente e nelle KPI dell'HR. Non era una
distinzione: era abitudine, e il §7 non la nominava. I founder hanno deciso
**"sessioni"** (17.08.2026), e la ragione chiude la questione senza arbitrare fra
due gusti — **è la parola del Business Plan**, quindi il listino e il portale
dicono la stessa cosa, e un coach non tiene una seduta. La regola generale è ora
nel `CLAUDE.md` §7.

**Il difetto era in una lingua sola, ed è l'esito che vale oltre il caso.** Le
38 stringhe da cambiare sono **tutte italiane**: tedesco, francese e inglese
usavano già un termine solo — `Sitzung`, `séance`, `session` — per entrambe le
parole italiane. **Chi traduce non eredita il difetto**, perché traduce il
significato e non la parola, quindi da un confronto fra i quattro dizionari la
doppia parola **non emerge**: i quattro file avevano già lo stesso numero di
chiavi e nessuna incoerenza fra loro. Si trova solo contando le parole **dentro
i valori di stringa di una lingua alla volta**, ed è il criterio scritto accanto
alla regola.

**Le tre accezioni restano tre.** I commenti che dichiarano cosa conta ognuna —
carriera, singola agenda, piattaforma — sono stati riscritti e non tolti: a
cambiare è il sostantivo, non la disciplina chiusa il 10.08.2026. Per la stessa
ragione `kpiSessions` non è diventato "Totali".

**Tre citazioni dell'etichetta italiana sono invecchiate insieme alla parola**, e
stanno in posti che una ricerca sulle stringhe non guarda: il `CLAUDE.md` §8
citava la KPI del back-office come *"sedute erogate"* — che non è mai stato il
suo testo — e le testate di `de.ts` e `fr.ts` citano *"sedute di carriera"*
nell'elenco delle domande per la revisione madrelingua. Allineate: una citazione
di un'etichetta è **l'etichetta**, e vale la regola anche dentro un commento.

**`docs/PITCH.md` è stato allineato per intero**, venti occorrenze, e non solo
dove cita un'etichetta: è il testo che una persona **pronuncia stando davanti
allo schermo**, quindi è l'unico documento in cui le due parole finiscono
affiancate davvero. Le citazioni testuali del Business Plan restano com'erano.
La prosa di dominio del `CLAUDE.md` §8 e §9 e quella del contratto dati **non**
sono state riscritte a tappeto: non sono interfaccia, e la regola lo dichiara.

##### Tre etichette che non dicevano quello che contavano

| prima | dopo | perché |
|---|---|---|
| "Con assessment" | **"Assessment iniziale completato"** | gergo interno: non diceva **quale** assessment né che si conta la sola esecuzione. È quello del §8 — dieci domande all'attivazione — e la KPI non dice mai l'esito, come `assessmentCompleted` |
| "Nel roster" | **"Professionisti"** | titolava un conteggio di professionisti. Non "Totali", che riaprirebbe l'ambiguità fra le tre accezioni accanto a `kpiSessions` |
| "Nessun professionista nel roster." | **"…nella rete."** | "rete" è la parola che il prodotto già usa: le strutture del check-up dicono "nella rete" da sempre |

`roster` era on-screen in **due** lingue su quattro — italiano e tedesco — mentre
francese e inglese dicevano già `réseau` e `network`: la stessa forma del caso
qui sopra, un difetto che il confronto fra dizionari non mostra.

##### La conferma della richiesta demo non nomina più l'azienda

Il testo è generico (founder, 17.08.2026): *"Grazie per l'interesse. Il nostro
team ti contatterà entro un giorno lavorativo."* **Lo stato resta il record e non
un booleano**, perché la garanzia che la conferma non possa comparire senza una
scrittura sta lì e non nella frase — a riempirlo è `onSuccess` con ciò che il
provider ha risposto.

**Quello che si perde è dichiarato nel sorgente, insieme a dove si ritrova**: il
nome era la prova **a schermo** che il record era tornato dal provider, e quella
prova ora vive in `/admin`, cioè nel passo 4 della coreografia di
`docs/PITCH.md`. Non è una prova più debole: è la stessa, spostata nel punto in
cui la demo la mostra già.

##### Sette voci nuove per il perimetro dell'MVP

Sei nel `CONTRATTO-DATI.md` §8, una qui. Nessuna è lavoro di codice oggi, e
ognuna dice **perché** oggi non c'è.

| voce | dove | il vincolo che la decide |
|---|---|---|
| le tre voci del profilo — stress, sonno, energia | §8.10, **gruppo nuovo** | non è rimettere tre etichette: è decidere cadenza, storico e "rispetto a cosa". Sta accanto al §8.9 perché è lo stesso problema |
| le recensioni dei professionisti | §8.11, **gruppo nuovo** | **anonimo non basta**: una data e un dettaglio identificano su una rete da sei pazienti attivi, e la protezione non può stare nella forma del tipo perché una recensione nasce pubblica |
| cosa può modificare il dipendente | dentro §8.3 | la domanda vera è a monte: chi crea l'account decide quali campi vengono dall'azienda |
| "Pianifica review" | dentro §8.3 | non è una schermata: è un'integrazione con un calendario di terzi, e la cadenza dipende dal piano |
| servizi e prenotazioni per struttura | dentro §8.6 | il catalogo decide se il check-up **executive** è erogabile lì, e le prenotazioni si derivano invece di essere una colonna |
| l'omonimia | dentro §8.8 | il contratto aveva la metà sui dati — id veri — e non quella visibile: due `M.B.` rendono ambigue le righe anonime, e un id accanto alle iniziali è lo pseudonimo che quelle schermate esistono per non dare |
| le animazioni d'ingresso dei grafici | «Migliorie rimandate al refinement» | il §6.2 **resta intero**: si registra che nacque da un difetto misurato su **una macchina sola**, e che una delle sue due ragioni vale solo in presentazione dal vivo |

**I gruppi del §8 passano da dieci a dodici**, e Paginazione da §8.10 a §8.12.
Nessun rimando si è rotto: i rimandi a quel gruppo lo **nominano** invece di
numerarlo, che è la disciplina lasciata dall'inserzione precedente — «si cita ciò
che non si muove». Chi cerca "dieci gruppi" lo trova nei due verbali che lo
scrissero, dove era giusto.

##### Il verbale che mancava, e le due righe invecchiate

**I due pulsanti "Aggiungi"** — `AdminAziende` e `AdminProvider` — sono usciti
con la migrazione del back-office del 09.08.2026 senza che niente li nominasse,
a differenza del gemello "Approva". La riga ora c'è, accanto alla sua. **È il
difetto delle affermazioni invecchiate visto in negativo**: lì una riga
sopravvive al codice che descriveva, qui il codice se n'è andato senza lasciarne
una — e la seconda forma è più difficile da trovare, perché non c'è niente da
rileggere che sia falso.

Le due righe corrette in questo file: **«La prossima milestone è M5»** nella
sezione *Stato*, vera il giorno in cui fu scritta e sopravvissuta alla chiusura
nel punto che chi riprende legge per primo; e le **«728 chiavi stringa»**
dell'inventario delle promesse, che non è un verbale ma **un criterio vivo**,
scritto per essere rieseguito da chi costruirà l'MVP — 731, con il rimando al
`CLAUDE.md` §2.7 invece della ripetizione del criterio. La riga 4647 **non è
stata toccata**: è dentro un blocco barrato del 15.08, cioè un resoconto datato.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **zero occorrenze di "sedut*"** in tutte le schermate percorse, e nessuna
  parola nuova al suo posto oltre a "sessioni";
- **i numeri del pitch fermi**: CHF 14'200, 16 giorni, 68%, 82 su 120, 41 attivi,
  142 di 1'200, 62%, soglia 12, −2 punti; i cinque di ancoraggio a N=100 —
  1'289'500 / 221'150 / 66'000 / 155'150 / 2.35:1; 78/100, `3 su 10 sessioni
  usate · 3 in programma`, 1 su 4; 6 pazienti attivi con **due sopra il cap**
  — `I.G. 12 · 10 incluse + 2 a CHF 28` e `G.R. 11 · 10 incluse + 1` —, 18 in
  programma e 63 erogate; CHF 80, CHF 1'120, CHF 5'040 e le righe settimanali
  3+4+5+2 che sommano a 14; CHF 54'414, CHF 652'968, 415 su 798, 1'147, 195;
  CHF 38 / 55 / 82 a listino;
- **le quattro KPI di `/admin/utenti` restano alte uguali** — 170px, stessa `y`
  — con il titolo nuovo su tre righe e **zero overflow**; misurato anche nelle
  altre tre lingue con il font e la larghezza veri: due righe in tedesco e
  francese, tre in inglese, nessuna che sfori;
- **la conferma demo nelle quattro lingue**: nessuna nomina l'azienda, nessuna
  sfora, e le due uscite restano — provata cambiando lingua **a conferma già a
  schermo**, che non la rimonta;
- **la coreografia di `/admin` regge**: tabella vuota a freddo, uscita col logo,
  richiesta inviata da `/demo`, due Indietro, e in tabella `Ontano Logistica SA`
  con `+41 91 000 00 00` e 23.09.2026. **Una sola navigazione** per tutto il giro;
- **nessun overflow orizzontale** su nessuna delle schermate percorse, console
  senza errori;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **108 = 100 + 8**,
  invariati; **731 chiavi** in tutti e quattro i dizionari, invariate.

##### Una cosa sullo strumento, ed è la stessa di due giorni fa

**La prima scheda era cieca dal primo comando**: `innerWidth` a 0 con
`visibilityState: hidden`, e il primo censimento è stato preso lì. I valori di
testo erano giusti — `innerText` non dipende dal layout — ma per la regola del
§11 una misura presa a larghezza zero non si usa, e tutto è stato rifatto su
scheda nuova. È la terza volta in tre giorni: **non è un caso raro**, è il modo
normale in cui questo pannello invecchia, e il controllo di `innerWidth` prima di
ogni misura è la sola difesa.

**La trappola dello spazio unificatore è tornata**, ed è la stessa di M1: cercare
`"CHF 80"` con lo spazio da tastiera dà **falso** su una pagina che lo mostra,
perché fra `CHF` e la cifra c'è U+00A0. Verificato leggendo i codepoint invece
di fidarsi del primo `includes`.

##### Aperto e dichiarato

- **"Sedute" resta nei commenti del sorgente fuori da `i18n` e nella prosa dei
  documenti di dominio**, ed è la scelta della regola, non un residuo: sono 69
  occorrenze nel `CONTRATTO-DATI.md`, più i commenti di `lib/` e di `mock/`. Si
  allineano quando qualcuno tocca il punto in cui stanno, come i `.jsx` del §3.
- **Il "ti" della conferma demo è una scelta di registro da rileggere.** Il §7
  vuole l'area pubblica in terza persona, e la frase dei founder dà del tu; nella
  stessa schermata `error.body` lo faceva già — *"I dati che hai scritto…"* —
  quindi non introduce un caso nuovo, ma **è il secondo**. In tedesco e francese
  la stessa frase esce con `Sie` e `vous`, perché lì il registro dell'area è
  quello: la divergenza è voluta e sta nella convenzione delle lingue, non in una
  svista.
- **`Assessment initial terminé` tiene il prestito che `fr.ts` aveva già.** Non è
  una scelta lessicale nuova — la stessa chiave diceva "Avec assessment" — quindi
  non è stata aggiunta alle cinque domande in testa a quel file. Se la revisione
  madrelingua preferisse *évaluation initiale*, cambia una stringa sola.

#### L'anteprima a tre pannelli e la voce Admin (17.08.2026)

**Quattro commit: due di codice — `feat:` ×2 — e due di documenti.** Totale e
ripartizione dalla stessa misura, `git log --format='%s' master..HEAD`; il numero
è `n + 1` perché il commit di chiusura conta sé stesso. **Nessun numero del §8 e
del §9 si muove**, e **le rotte dello scope restano 26**: `/admin` esisteva già,
a nascere è il link che ci porta.

È la prima passata di refinement che cambia **come ci si comporta a schermo**
invece di mettere in ordine il layer dati, ed è la ragione per cui la riga in
testa a questa sezione ha dovuto separare le sue due metà.

##### L'anteprima dell'hero: tre pannelli, e li comanda chi guarda

Un riquadro solo mescolava il punteggio di Laura, il suo prossimo appuntamento e
una fetta di dashboard HR. Ora sono **tre pannelli, uno per lato del prodotto**,
nell'ordine in cui il pitch li percorre — dipendente, HR, professionista — quindi
il riquadro è **il sommario di quel giro** e l'ordine non è decorativo.

**Nessuna cifra nuova** (§2.4), ed è il vincolo che ha deciso il contenuto: il
risparmio e i giorni evitati sono `HrReport` del trimestre corrente, i compensi e
i pazienti sono `getProfessionalEarnings` e `getProfessionalPatients` del portale
della Dr.ssa Meier. Tutte e quattro **erano già scaldate da `prefetchDemo`**,
quindi non è servito aggiungere una chiave e il guardrail della cache fredda non
ha niente da dire — se non lo fossero state, la landing sarebbe partita con uno
sfarfallio proprio sulla prima schermata.

**Il primo clic ferma la rotazione per sempre** (founder), non finché non
ricomincia: durante la presentazione si clicca una volta all'inizio e da lì
comanda chi parla. Non esiste nessun gesto che la rimetta in moto, ed è voluto —
l'unico momento in cui servirebbe è ricaricare, che durante la demo non si fa.

**Due obblighi sul cambio automatico, e nessuno dei due è un dettaglio.** Non
avanza a **scheda nascosta**, perché il browser sospende i timer e al ritorno il
pannello risulterebbe saltato — è la quarta faccia dello stesso
`visibilityState` che questo file registra da M3. E **non parte affatto** con
`prefers-reduced-motion`, dove restano i soli pallini: a sparire è il movimento,
non il comando. Il valore si legge una volta al montaggio, perché chi ha
quell'impostazione ce l'ha prima di aprire la pagina.

**L'altezza non si muove.** I tre pannelli stanno impilati nella **stessa cella di
griglia**, quindi il riquadro è alto quanto il più alto dei tre e resta tale al
cambio: un carosello che accorcia la pagina sposta tutto ciò che gli sta sotto
mentre qualcuno legge. Misurato **259px in tutte e quattro le lingue e a tutte e
due le larghezze provate**.

**Il §6.2 non c'entra e non è stato toccato**: vieta le animazioni d'ingresso dei
**grafici**, e qui non ci sono grafici. Il passaggio è una dissolvenza di opacità
e non un movimento.

##### La barra: via "Demo", dentro "Admin"

**Le due ragioni sono opposte, e vale la pena tenerle distinte.** "Demo"
**ripeteva una strada invece di aggiungerne una**: a `/demo` si arriva da sette
link, due dei quali nella barra stessa — il pulsante "Prenota una demo", desktop
e mobile. A `/admin` invece **non portava niente**, e quella scelta costava più
di quanto proteggesse.

**Non era una difesa.** Un indirizzo non linkato non protegge da chi ha il link,
che è precisamente il caso che il §10.E descrive; e digitare un indirizzo
**ricarica**, cioè azzera il provider, che vive in memoria. Il risultato era che
la richiesta demo inviata durante il giro spariva **proprio mentre la si andava a
mostrare** — ed è da lì che nasceva la coreografia in quattro passi di
`docs/PITCH.md`, con l'obbligo di aprire `/admin` per primo e i due Indietro
contati.

**Da qui la presentazione si percorre tutta in avanti**: era l'ultimo punto che
chiedeva il tasto Indietro, e il §10 aveva un solo posto in cui la regola «mai la
barra degli indirizzi» si contraddiceva — questo. Il banner dei dati dimostrativi
**resta**, ed è ora l'unica difesa a schermo, come il §10.E dichiara.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

Il giro del pitch nuovo, **per intero e sulla build demo**, con la console
aperta:

- **una sola navigazione** per tutto il giro (`performance.getEntriesByType`),
  console **senza un solo messaggio** — nessun log di guardrail;
- clic su un pallino, portale dipendente, **prenotata la Dr.ssa Meier venerdì
  25.09 alle 10:00**: `used` fermo a **3**, in programma da **3 a 4**;
- logo → HR: CHF 14'200, 16, 68%, 82, 41, 142 di 1'200, 62%, soglia 12, −2;
- logo → professionista: la settimana passa da **5 a 6 sessioni** e il mese da
  **21 a 22**, cioè la stessa prenotazione vista dall'altro lato;
- logo → "Prenota una demo" → richiesta inviata, la conferma **non nomina
  l'azienda**, poi **Admin dalla barra**: `Ontano Logistica SA`, `+41 91 000 00
  00`, 23.09.2026 in tabella, banner dei dati dimostrativi presente, CHF 652'968
  / 415 / 798 fermi;
- **i tre pannelli in tutte e quattro le lingue**, altezza **259px** ognuna,
  zero testo che dipinge fuori dalla propria scatola, zero overflow di pagina;
- **a scheda nascosta non avanza**: dopo 7s il pannello è ancora il primo. Con
  `document.hidden` forzato a `false` avanza, e **dopo un clic non si muove più**
  — provato per 10s, cioè due cicli;
- **con `prefers-reduced-motion`** (rimontando la landing con `matchMedia`
  sostituito): nessuna rotazione dopo 10s, e i pallini comandano ancora;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **108 = 100 +
  8** invariati; **741 chiavi** in tutti e quattro i dizionari — 731 più le dieci
  nuove dell'anteprima, con `nav.demo` che esce e `nav.admin` che entra.

##### Una trappola nuova, ed è la quinta faccia della stessa

**A scheda realmente nascosta le transizioni CSS non avanzano**, quindi
l'opacità calcolata resta al valore di partenza mentre la classe è già quella
giusta. Per un quarto d'ora la misura ha detto *"`aria-current` dice il pannello
2 e l'opacità dice il pannello 1"*, che si legge come un difetto di stato. Non lo
era: spegnendo la transizione con `style.transition = "none"`, classe, `aria` e
opacità calcolata coincidono.

Va accanto alle altre quattro — animazioni congelate, `innerWidth` a zero, il
retryer in pausa, i timer sospesi — e la regola operativa è la stessa: **prima di
concludere, verificare che lo strumento potesse vedere la cosa giusta.** Qui in
più c'è che il difetto apparente era *interno alla cosa che si stava
costruendo*, cioè il posto in cui è più facile crederci.

##### Aperto e dichiarato

- **A 768px la barra pubblica in tedesco sfora, e non è di questa passata.**
  Misurato su `master` prima della modifica: l'ultimo blocco arriva a **952px** in
  una riga che finisce a 744. Con "Admin" al posto di "Demo" arriva a **956**,
  cioè **4px in più** — la differenza fra le due parole. La soglia dichiarata
  resta 1280px (§10.C), dove la riga ha 257px di margine anche in tedesco.
- **"Fokus: schlaf" è tedesco sbagliato**, e la riga è preesistente: la chiave
  `focus` interpola l'area con `.toLowerCase()`, che in una lingua che scrive i
  sostantivi con la maiuscola produce una minuscola dove non va. Si vede sul
  primo pannello dell'hero, cioè sulla prima schermata, in una lingua che la demo
  offre dal selettore. **Non toccata**: è fuori dal perimetro di questa passata,
  ed è una riga sola.
- **Il guardo dell'anteprima è uno solo per tutti e tre i pannelli**, quindi il
  guasto di una qualunque delle dieci letture toglie il riquadro intero invece di
  un pannello. È voluto: i pallini annunciano tre pannelli, e tre che diventano
  due sono un comando che porta a una scatola vuota. `company` resta nell'elenco
  pur non essendo reso da nessuno, ed è il comportamento che aveva già.

#### La home e il medico (17.08.2026)

**Otto commit: quattro di codice — `feat:` ×3, `fix:` ×1 — e quattro di
documenti.** Totale e ripartizione dalla stessa misura,
`git log --format='%s' master..HEAD`; il numero è `n + 1` perché il commit di
chiusura conta sé stesso. **Nessun numero del §8 e del §9 si muove**, e **le
rotte restano 26**: `/employee/profilo` cambia porta, non esistenza.

Si apre con la **chiusura della passata precedente** — due punti che la sua
review ha trovato — e prosegue con tre decisioni dei founder sull'area
dipendente.

##### La chiusura: un numero in sei posti e una minuscola tedesca

**Il conteggio delle chiavi era invecchiato alla prima passata utile.** Il §2.7
gli aveva dato un criterio ma **non l'obbligo** che il §5.6 dà ai guardrail, e la
cifra stava in **sei punti** invece che in uno: le dieci chiavi dell'anteprima
dell'hero l'hanno mossa e nessuno l'ha seguita. Ora il numero vive **solo** nella
riga datata del §2.7, con l'obbligo accanto, e gli altri cinque rimandano lì.

**Il sesto punto è quello che insegna qualcosa**, ed è nostro: il criterio
dell'inventario delle promesse, in questo file, corretto da 728 a 731 **due
giorni prima proprio in nome di questa regola**, e invecchiato di nuovo. Non è
l'invecchiamento il difetto, è **la ripetizione** — un numero ripetuto è una
promessa di tornare a rileggerlo, e non la mantiene nemmeno chi l'ha appena
scritta.

**L'obbligo è stato corretto mezz'ora dopo essere stato scritto.** Diceva "nello
stesso commit", e il §2.8 vuole le decisioni della costituzione in un commit
`docs:` **separato dal codice**: due regole che non possono valere insieme. Dice
"nella stessa passata", perché **a proteggere è il merge** e la passata è
l'unità che il merge misura.

**`Fokus: schlaf`** è sparito togliendo `.toLowerCase()` invece di aggiungere
chiavi. Era **l'unico punto di `src/`** in cui quella trasformazione toccava
testo da mostrare: gli altri quattro normalizzano una ricerca o compongono un
nome di file, e sono stati controllati uno per uno.

##### La home: due fatti al posto di quattro scorciatoie

Le quattro tessere portavano a medico virtuale, check-up, piano e profilo —
**quattro delle sei voci del menu**. Al loro posto la **data del prossimo
check-up** e i **consulti di medico virtuale dell'anno**, che si vedevano solo
dentro `/employee/profilo`.

**Non sono link**, ed è la ragione per cui esistono: renderli cliccabili
rimetterebbe la duplicazione da cui si è partiti. Il **badge "Fatto" resta**,
perché è il vincolo del §8 — il check-up completato di Laura si legge uguale in
tre schermate — e la card del check-up **esiste solo se il piano ce l'ha**, con
la stessa regola del contatore coach.

**La home si è accorciata**: 1296px prima, **1282px** dopo, misurati sulla stessa
larghezza. Quattro tessere via, due card dentro.

##### Il profilo cambia porta, e la barra mobile guarisce

"Profilo" esce dal menu ed entra nel riquadro dell'identità. **La rotta resta**:
cambia come ci si arriva.

**L'effetto collaterale era un difetto vero.** La barra in basso su mobile
faceva `.slice(0, 5)` su sei voci, quindi **Profilo lì non compariva affatto** e
la troncatura era silenziosa. Con cinque voci la barra è completa e lo `slice`
non toglieva più niente: restava solo il modo di far sparire in silenzio la
prossima voce. È uscito.

**Una cosa che il prompt non prevedeva, e senza la quale la rotta restava
orfana**: `Identity` vive nella barra laterale, che sotto `lg` non esiste — con
"Profilo" fuori dal menu, `/employee/profilo` non sarebbe stato raggiungibile da
nessuna parte su schermo stretto. `Identity` è ora anche in fondo al menu
mobile.

##### Il medico: un arco che finisce

Quattro scambi — la risposta a parola chiave, quanto dura, quali altri sintomi,
l'orientamento — e poi la casella **si spegne e dice perché**. Prima ripeteva la
stessa frase all'infinito: chi la prova due volte lo vede, ed è la prima cosa
che si fa con una chat.

**Il limite è normativo**: il medico consiglia e orienta, non diagnostica e non
prescrive (*"Dubbi Business per CEO"* §2.2). Nessuna frase nomina un farmaco o
afferma una causa, e l'ultima lo dice prima di indirizzare. Sta nel `CLAUDE.md`
§10.B come vincolo su **ogni frase futura** di quella chat.

**Il 144 esce dal solo disclaimer**, ed è il secondo punto del prodotto. **Il
vuoto del §8.1 non si muove di un centimetro**, e le tre righe che dicevano "in
un punto solo" sono state corrette dicendolo: due numeri nella stessa schermata
restano zero percorsi dove il segnale arriva.

**Le parole chiave si cercano come parola intera**, e chiude un difetto a
verbale in due lingue insieme: `dos` non aggancia più `dose`, `dossier`,
`adosser`, e `head` non aggancia `ahead`. Le lookaround sono su `\p{L}` e non
`\b`, che in JavaScript conosce solo l'ASCII e taglia `tête` a metà. **Non
chiude `back` dentro "come back"**: lì la parola è davvero la parola, e
distinguerle vorrebbe dire capire la frase.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **la home non si è allungata**: 1282 contro i 1296 di `master`, misurati sulla
  stessa larghezza e su schede diverse perché la prima è andata cieca;
- **i tre stati della lettura nuova**: `?fail=getVirtualDoctorConsults` mostra
  l'errore di pagina con la nav intera, `:2` fa riuscire il "Riprova" e riporta
  "2 consulti quest'anno", `?empty=` dà **"0 consulti quest'anno"**, che è il
  vuoto legittimo;
- **la lettura del check-up non è fallibile a livello di pagina**, ed è
  preesistente: `getCheckupEligibility` è uno dei sei metodi che bloccano il boot
  in `prefetchDemo`, quindi `?fail=` su di lui dà lo stato di bootstrap — *"Kora
  non si è avviata"* — e non arriva mai alla home. Era così anche prima, perché
  quella lettura era già nel `loadState` della pagina;
- **l'arco per intero**: 9 bolle, l'ultima è l'orientamento, e a quel punto
  `input.disabled` e `button.disabled` sono veri con il motivo nel placeholder.
  La frase finale contiene il 144, non nomina farmaci e non afferma cause;
- **la parola intera provata nei due versi** su undici casi: `dose`, `dossier`,
  `adosser`, `ahead`, `schienale` non agganciano più; `dos`, `tête`, `head`,
  `rücken`, `schiena` sì; `come back` aggancia ancora, come dichiarato;
- **il placeholder di chiusura sta nel campo in tutte e quattro le lingue**: 278
  / 213 / 303 / 288 px in un campo utile da 718;
- **il giro del pitch sulla build demo**, con la console aperta: **una sola
  navigazione**, console **senza un solo messaggio**, prenotazione Meier venerdì
  25.09 con `used` fermo a 3 e in programma da 3 a 4, HR con tutti e dieci i
  numeri, professionista da 5 a 6 sessioni e da 21 a 22 in agenda, richiesta demo
  in tabella da **Admin** con telefono e banner, CHF 652'968 / 415 / 798;
- **home e profilo dicono la stessa cosa senza ripetersi**: "Prossimo dal
  15.03.2027" e "Fatto il 15.03.2026", "2 consulti quest'anno" e "2 quest'anno";
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **108 = 100 +
  8** invariati; **746 chiavi** ×4.

##### Aperto e dichiarato

- **`back` dentro "come back"** resta agganciato, ed è il residuo dichiarato
  della parola intera. Chiuderlo vorrebbe dire capire la frase, che è un'altra
  categoria di lavoro.
- **La prima frase dell'arco chiede la durata dopo risposte che a volte la
  chiedono già** — `sleep` e il `fallback` finiscono entrambi con "da quanto
  tempo?". È scritta per non ripetersi ("mi aiuti a inquadrarlo… giorni,
  settimane o più?"), ma la sovrapposizione c'è, e la si vede solo aprendo con
  la parola "sonno". Il rimedio vero sarebbe una seconda frase per quei due
  casi, cioè rimettere le parole chiave dove l'arco le ha tolte.
- **La scheda del pannello va cieca quasi a ogni ricaricamento**, `innerWidth` a
  0: è successo **quattro volte in questa passata**, e ogni misura geometrica è
  stata rifatta su una scheda nuova. Non è più una trappola da annotare, è la
  condizione normale in cui questo strumento lavora.

#### La cornice del trimestre (17.08.2026)

**Sette commit: quattro di codice — `feat:` ×2, `fix:` ×2 — e tre di
documenti.** Totale e ripartizione dalla stessa misura,
`git log --format='%s' master..HEAD`; il numero è `n + 1` perché il commit di
chiusura conta sé stesso. **Nessun numero del §8 e del §9 cambia valore**, e la
riorganizzazione non ne muove nessuno: le sei KPI dicono oggi quello che
dicevano ieri.

Si apre con la **chiusura della passata precedente** — quattro punti della sua
review — e prosegue con due decisioni dei founder sull'area HR.

##### La chiusura: una domanda ripetuta e due riquadri d'identità

**La prima frase dell'arco chiedeva la durata, e due delle cinque aperture la
chiedono già.** Non era teorico: l'area debole di Laura è il sonno, quindi è la
strada che il pitch percorre per prima. **Il rimedio è la domanda, non una
variante**: l'arco ora chiede **l'impatto sulla giornata**, che nessuna delle
cinque aperture chiede, quindi la sovrapposizione sparisce anche sul fallback e
resta una stringa per lingua.

**I due riquadri d'identità hanno l'icona a sinistra, e trattamenti diversi.**
Quello del dipendente è un link e porta l'icona di una persona; **quello
dell'HR non è un link** — `/hr/profilo` non esiste per decisione — e porta
l'icona di un'azienda, perché è un'azienda quello che mostra. Un'icona da
profilo su un riquadro che non porta da nessuna parte è **l'affordance che
mente**, lo stesso difetto delle voci del footer dell'08.08.2026 visto dal lato
opposto: lì era rimasta nel layout dopo essere uscita dall'elemento, qui la si
sarebbe messa in un elemento che non la merita.

**La disposizione è ora una regola**, nel `CLAUDE.md` §6.5: icona a sinistra in
tutti e tre i portali, link solo dove esiste una schermata di profilo — oggi il
dipendente, domani il professionista, mai l'HR — e **l'icona dice cosa c'è
dentro il riquadro, non dove porta**. È stata decisa due volte in due passate, e
una terza ne avrebbe prodotto una terza forma.

##### La cornice: il selettore comanda un blocco, non la pagina

Il selettore stava in alto a destra dell'intestazione e sembrava comandare tutto.
**Lo seguono otto elementi** — le sei KPI, la ciambella (cumulata fino al
trimestre scelto) e l'evidenziazione nel grafico del risparmio — e **non lo
seguono** il banner dell'alert, lo stress per reparto, il trend a dodici mesi e
l'utilizzo servizi.

La cornice mette insieme gli otto **con il selettore in cima**, e lascia gli
altri fuori e sotto. **I due banner restano sopra**: sono avvisi, e la loro
posizione è informazione.

**La cornice avvolge anche il ramo del trimestre senza dati**, e non è
simmetria: quel ramo teneva l'intestazione perché **il selettore è il modo di
uscirne**, e il selettore ora vive lì dentro. Senza, sarebbe tornato il vicolo
cieco del §10.

**Le tre righe fuori dichiaravano già il proprio periodo** — "ultimo mese",
"ultimi 12 mesi" — quindi non è stato aggiunto niente. **Il grafico del
risparmio invece sì**: dentro una cornice intitolata al trimestre selezionato,
quattro barre vanno spiegate, e il sottotitolo dice che è un confronto.

**Il difetto noto della tabella stress non si chiude qui**, ed è annotato dove
vive (voce di M3): la posizione ha tolto la contraddizione apparente, il difetto
è dov'era.

##### Il medico virtuale nel report

Il campo torna su `HrReport` e si **deriva** dalla serie mensile di utilizzo,
sommando i **soli mesi del trimestre**. È la scelta dei founder fra le due, e il
motivo si vede subito: il cumulato darebbe **118** su tutti e quattro i
trimestri, cioè un numero che non si muove accanto a un selettore che si muove.

**I quattro trimestri danno 19 + 29 + 35 + 35 = 118**, che è il totale dei dodici
mesi del §8. Nessuna cifra nuova entra nel dataset: la somma delle parti è il
tutto che era già dichiarato.

**L'etichetta dichiara il periodo** — "nel trimestre" — perché la riga sta
accanto a `usagePercent`, che invece **si cumula** sul monte annuo. Le due
definizioni stanno ora affiancate nella tabella delle KPI del contratto, con la
ragione della differenza: **il medico virtuale non ha un monte da consumare**,
sul Plus è illimitato.

**La riga entra anche nella vista di stampa, ed è una decisione dichiarata**: il
PDF è lo stesso report visto come allegato, e una metrica a schermo assente
dall'allegato è la coppia di viste che divergono.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **la prova che conta, fatta cambiando trimestre**: con il passaggio da 3° a 1°
  trimestre 2026 il testo della cornice **cambia** e il testo dei blocchi fuori è
  **identico carattere per carattere**, confrontato per intero e non a campione;
- **i numeri della cornice sul trimestre corrente non si sono mossi**: CHF
  14'200, 16 giorni, 68%, 82 su 120, 41 attivi, 142 di 1'200, 62%, −2 punti; e
  sul 1° trimestre 2026 escono i valori derivati del §9 — CHF 9'400, 10 giorni,
  48%, 58 iscritti, 27 attivi, 50 sessioni;
- **l'ordine dei blocchi**: titolo, alert, banner privacy, cornice, stress per
  reparto, trend + utilizzo. Sei blocchi, quello che deve stare sopra sta sopra;
- **il contrasto sul fondo nuovo della cornice** (rgb 245,249,247): titolo
  **14.26:1**, sottotitolo **4.79:1** a 12px e peso normale, sopra la soglia AA.
  Va misurato perché il §6.1 censiva su `--background`, e questo è un fondo che
  prima non c'era;
- **i consulti cambiano con il trimestre**: 19 / 29 / 35 / 35, che sommano a 118;
- **il PDF regge**: la riga nuova costa **23.7 pt** su 785.89 utili, contro un
  margine più stretto già misurato di 225.6 pt in tedesco. Lo scarico
  end-to-end non fa parlare il guardrail — che **in sviluppo lancia** — e sulla
  build demo la console resta muta;
- **una sola navigazione** per il giro, console senza un messaggio, nessun
  overflow orizzontale;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **108 = 100 +
  8** invariati; **750 chiavi** ×4.

##### Una cosa sullo strumento, e completa quella di due passate fa

**Le opzioni di un `Select` Radix vogliono anche il `pointermove`.** La sequenza
registrata il 16.08 — `pointerdown`, `mousedown`, `pointerup`, `mouseup`,
`click` — apre il menu ma **non seleziona**: l'opzione resta lì e il valore non
cambia, che si legge come "il selettore non funziona". Con `pointermove` in
testa la selezione avviene. È la stessa famiglia già a verbale, con un evento in
più, e vale la pena saperlo prima della prossima verifica su un selettore.

##### Aperto e dichiarato

- **La tabella stress per reparto non segue il selettore**, e non è stato
  chiuso qui: la cornice lo rende leggibile, non lo risolve. Servirebbe un
  metodo nuovo sul provider, ed è annotato nella voce di M3.
- **La seconda frase dell'arco cita ancora "cambiamenti nel sonno"** fra i
  sintomi associati, quindi su un'apertura che parla di sonno c'è una
  sovrapposizione residua — più piccola di quella chiusa oggi, e sulla stessa
  strada del pitch. È una parola, non una frase: si toglie il giorno in cui
  qualcuno decide che vale la pena.
- **Il PDF è stato verificato in italiano end-to-end**, non nelle altre tre
  lingue: il costo della riga è di 23.7 pt e il margine più stretto già misurato
  era di 225.6, quindi la conclusione regge per differenza — ma è una deduzione,
  non una misura, e va detto quale delle due è.

#### Il conteggio che diventa un guardrail (17.08.2026)

**Sette commit: quattro di codice — `feat:` ×1, `fix:` ×3 — e tre di
documenti**, misurati a chiusura avvenuta con
`git log --format='%s' ff2ca80^..ff2ca80^2`. *(La sottosezione dichiarava
**sei**, con `fix:` ×2, ed era la predizione `n + 1` scritta nel commit di
chiusura: `06a1b88` è arrivato dopo, e nessuno è risalito a riaprire la cifra.
Corretta il 18.08.2026, insieme alla clausola che quel buco lo chiude — sta in
«Come una passata conta i propri commit».)* **Nessun numero
del §8 e del §9 si muove**, le rotte restano **26** e a schermo cambia una
frase sola.

È la chiusura delle due passate precedenti, e l'unica delle tre voci che
costruisce qualcosa è la prima — le altre due sono code della passata delle
parole, chiuse in pochi minuti.

##### Il numero delle chiavi passa dalla prosa al codice

**Il difetto misurato tre volte, ed è la terza che decide.** Il conteggio delle
chiavi di `it.ts` è stato scritto nel `CLAUDE.md` §2.7 prima con il solo
criterio, poi con il criterio **e l'obbligo** di muoverlo nella stessa passata:
tutte e due le volte è invecchiato alla prima passata che aggiungeva una
stringa. La seconda volta **il giorno dopo che l'obbligo era stato scritto**, e
per mano di una passata — la cornice del trimestre — che il numero giusto
**l'aveva misurato**, scrivendo `750 chiavi ×4` nel proprio verbale mentre il
§2.7 continuava a dichiarare 746.

Da lì la diagnosi, che è tutto il valore della voce: **il difetto non è la
distrazione, è il compito.** Chiedere a una persona di copiare una cifra da un
file all'altro non funziona quando la persona è attenta, ha appena misurato il
numero e ha l'obbligo scritto davanti. La stessa famiglia di `docs/PROGRESS.md`
sui conteggi ripetuti, portata al suo caso limite: qui il numero era **in un
posto solo** e non è bastato.

**Il rimedio sta in `src/lib/i18n/placeholders.ts`**, che percorre già tutte le
chiavi all'avvio dove i guardrail parlano: `EXPECTED_KEYS` accanto al codice che
la verifica, una funzione ricorsiva che somma le foglie di tipo stringa, e un
`assertInDev`. In sviluppo una chiave in più è **pagina bianca al primo
ricaricamento**, cioè nel minuto in cui l'ha aggiunta chi l'ha aggiunta.

**Il messaggio è scritto per chi non sa perché la pagina è bianca** — dice il
numero trovato, quello atteso e la riga da cambiare:

```
[dataset] [i18n] il dizionario ha 750 chiavi stringa, EXPECTED_KEYS ne dichiara
749. Se hai appena aggiunto o tolto una stringa il numero giusto è 750:
scrivilo in EXPECTED_KEYS, src/lib/i18n/placeholders.ts. Il criterio sta nel
CLAUDE.md §2.7.
```

**Si conta `it` e basta.** Che i quattro dizionari abbiano lo stesso numero non
è una misura ma una garanzia di `Translated<Dictionary>`: contarli tutti e
quattro sarebbe verificare il typecheck a runtime.

**Il criterio non cambia, cambia chi lo applica.** Il conto a runtime
sull'oggetto e quello del §2.7 sull'albero sintattico danno lo stesso numero —
750 e 750, verificato sui quattro dizionari — perché i commenti non sono nodi
sull'albero e non sono valori a runtime. Il comando resta nel §2.7: è il modo di
rifare la misura senza avviare l'applicazione.

**Il file non è stato rinominato**, benché ora ospiti due guardie e il nome ne
dica una. `i18n/guardrails.ts` rimetterebbe il call site dentro il nome che il
criterio del §5.6 esclude, ed è esattamente **come quel conteggio perse una
chiamata** alla tranche tedesca: il file fu rinominato `placeholders.ts` per
uscire da lì. La ragione sta ora nella sua testata.

**Il §2.7 perde la cifra e tiene il criterio**; l'obbligo di muoverla a mano è
uscito, perché a ricordarlo è la macchina. **I guardrail passano da 108 a 109** —
`101 + 8` — e sono state mosse **tutte e quattro** le occorrenze della sezione,
non la sola riga datata.

##### Le due code della passata delle parole

**`fr.ts` ed `en.ts` citavano un'etichetta che non esiste più**: "Sedute di
carriera", accanto a `kpiSessions`, cioè il testo italiano com'era prima che
quella passata lo portasse a "sessioni". Le testate di `de.ts` e `fr.ts` erano
state allineate, i due commenti inline no, ed `en.ts` non era stato nominato. È
la regola che quella passata si è data — **dentro `i18n` la citazione di
un'etichetta è l'etichetta**, anche in un commento — e la sua stessa voce
"aperto e dichiarato" collocava il residuo **fuori** da `i18n`. Ora ci sta
davvero: zero occorrenze di "sedut\*" nei quattro dizionari.

**La seconda frase dell'arco del medico chiedeva del sonno a chi aveva appena
parlato di sonno.** Fra i sintomi associati elencava "cambiamenti nel sonno", e
aprire con "sonno" è la strada che il pitch percorre per prima — l'area debole
di Laura è quella. È la sovrapposizione che la passata precedente aveva chiuso
sulla **prima** frase spostandola sull'impatto, una taglia più piccola: una voce
in meno in un elenco di tre, in ognuna delle quattro lingue, e la congiunzione
regge le due che restano.

##### L'eccezione che il conto delle passate non dichiarava

Il criterio diceva che **#25** era «l'unica» PR esclusa come sintesi
retrospettiva, e l'elenco dei buchi si fermava a #33. **#35
(`docs-sintesi-34`) è la stessa cosa** — un commit, un file, la sintesi di una
passata già mergiata — e non compariva da nessuna parte in questo file.

**Il totale non si muove**: 31 era giusto e 31 resta, perché #35 era già fuori
per applicazione della regola. A essere incompleto era l'elenco delle ragioni, e
il costo è concreto — chi rifà il conto trova #35, non trova la ragione, e apre
una segnalazione su un difetto che non c'è. Adesso i buchi sono nominati tutti:
#25 e #35, #27 e #42, #29–#33 e #36–#41.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **il guardrail lancia davvero**: con `EXPECTED_KEYS` a 749 la pagina resta
  bianca e la console porta il messaggio per intero; riportato a 750 la landing
  torna, console pulita. È il ramo che nessun percorso produce da solo, provato
  nei due versi;
- **assente dalla produzione, presente nella demo**: `grep -F` su quattro
  marcatori letterali — `chiavi stringa`, `EXPECTED_KEYS`, `Il criterio sta nel
  CLAUDE.md`, e il `[dataset]` che fa da controprova — dà **0 in `build` e 1 in
  `build:demo`** su tutti e quattro;
- **l'arco del medico nelle quattro lingue**, aperto ogni volta con la parola
  del sonno: la seconda frase non nomina più il sonno in nessuna — *"febbre,
  stanchezza o cambiamenti nell'appetito?"*, `Fieber, Müdigkeit oder
  Veränderungen beim Appetit?`, `fièvre, fatigue ou changements de l'appétit ?`,
  `fever, tiredness or changes in appetite?` — e nessuna bolla né pagina va in
  overflow;
- **l'arco finisce come prima**: 9 bolle, l'ultima è l'orientamento con il 144,
  campo e pulsante spenti con il motivo nel placeholder;
- **i numeri del pitch fermi** su `/hr`: CHF 14'200, 16, 68%, 82, 41, 142 di
  1'200, 62%, soglia 12, −2; e in home `3 su 10 sessioni usate · 3 in
  programma`, `1 su 4`, "Fatto", "Prossimo dal 15.03.2027", "2 consulti
  quest'anno";
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **109 = 101 +
  8**; **750 chiavi** ×4, e da oggi non è più una cifra che qualcuno riporta.

##### Aperto e dichiarato

- ~~**`EmployeeHome` annida un `<div>` dentro un `<p>`**, ed è preesistente:
  arriva da `f3ff66e`, la passata della home, dove il badge "Fatto" sta dentro
  il `<p>` del titolo della card check-up. React lo segnala in sviluppo —
  `validateDOMNesting` — e il browser chiude il paragrafo prima del `div`. **Non
  toccato**: è fuori dal perimetro di questa passata, ed è una riga.~~ →
  **chiuso da questa stessa passata**, con `06a1b88`, che ha portato quel titolo
  a `<div>`: il commit è arrivato **dopo** il verbale, e nessuna riga lo ha
  collegato a questa — è lo stesso commit che ha lasciato indietro la
  ripartizione qui sopra. *(Barrato il 18.08.2026.)* Non contraddice il
  *"console senza un solo messaggio"* di questo verbale: quella misura era sulla
  build demo, dove React non emette questi avvisi.
- **Il conteggio dei `.jsx`, delle rotte e dei call site resta prosa**, e questa
  passata non lo cambia. Solo quello delle chiavi aveva un oggetto che il codice
  può contare da sé all'avvio: le rotte si contano su `App.tsx` e i call site su
  un grep, e un guardrail che li verificasse dovrebbe leggere il proprio
  sorgente, che è un'altra cosa.

#### L'annullamento e l'identità (17.08.2026)

**Nove commit: cinque di codice — `feat:` ×4, `refactor:` ×1 — e quattro di
documenti.** Totale e ripartizione dalla stessa misura,
`git log --format='%s' master..HEAD`; il numero è `n + 1` perché il commit di
chiusura conta sé stesso. **Nessun numero del §8 e del §9 si muove**, e le rotte
restano **26**.

È la passata più pesante di questa serie e **l'unica che allarga il contratto
dati**: un metodo nuovo, un tipo nuovo, un campo nuovo su due proiezioni. Non
allarga lo scope del §10 — nessuna schermata nasce.

##### Una sessione in programma si può annullare

Il dataset aveva **una** sessione annullata, seminata a mano, e nessun metodo
che annullasse: la disdetta era fra i vuoti dell'MVP
(`docs/CONTRATTO-DATI.md` §8.5). Adesso `cancelSession` esiste, dal lato del
professionista, e si raggiunge dal calendario e dalla lista sessioni.

**Rifiuta ciò che non è in programma e futuro, e le due metà non sono la stessa
cosa.** Oggi coincidono perché lo stato si deriva dall'orologio; in produzione
lo stato è un evento che qualcuno dichiara, e una seduta di ieri che nessuno ha
chiuso resta `scheduled` — annullarla toglierebbe un compenso maturato. Sono
una precondizione sola e non due rami: il secondo non è codice irraggiungibile,
è la metà che tiene il metodo onesto il giorno del passaggio.

**L'annullamento è una sovrapposizione, non una modifica**: `PORTAL_SESSIONS` è
il dataset curato del §8 e resta intatto, la proiezione applica l'annullamento —
come `hasNote`, che nasce dalle note e non dal record. Sta in una funzione sola
perché la usano lettura e scrittura, e due punti che costruiscono la stessa
forma sono due punti che possono divergere.

**La nota libera è facoltativa e vive solo dove vive `SessionNote`**: sulla
proiezione di chi cura. `PlatformSession` è la prova che non può arrivare
altrove, perché il campo lì non c'è.

**Il resto teneva già, e la verifica lo ha confermato invece di darlo per
fatto**: lo slot torna prenotabile, il compenso non matura, il contatore non si
muove, la cella si svuota. Tutti e quattro leggono `status`, ed è la ragione per
cui non è stato necessario toccarne nessuno.

##### Il professionista vede il nome. L'amministratore no

Decisione dei founder, e la ragione è che **mostrare le iniziali a chi ha la
persona in seduta non protegge nessuno**: quel nome glielo dice la paziente. La
garanzia del contratto non cade, **cambia verso** — vale verso l'azienda e verso
l'amministratore di piattaforma.

**La scorciatoia avrebbe riaperto un difetto chiuso il 16.08.** `/admin/sessioni`
leggeva `getProfessionalSessions`: aggiungere il nome a quel tipo lo avrebbe
consegnato **anche al back-office**, accanto alla data di una seduta di
psicologia — cioè il dato individuale che quel giorno è uscito da `PlatformUser`.
E non si risolve facendo scegliere alla schermata cosa rendere, perché una
scelta di rendering qualcuno può disfarla: si risolve nella forma del dato.

`PlatformSession` è quindi la **terza vista dello stesso record**, dopo
`Appointment` e `ProfessionalSession`, e il mock la costruisce campo per campo e
non con uno spread — uno spread porterebbe con sé ogni campo che l'altra
proiezione guadagnerà domani.

**Le iniziali non sono più un campo**: si derivano dal nome. Con un campo
accanto sarebbero stati due valori per lo stesso fatto, e sarebbero divergiuti
**fra due schermate che ne mostrano una ciascuna**.

**Otto nomi nuovi**, cognomi comuni per la regola del §8 letta al contrario di
come vale per il roster: un paziente non è pubblico né cercabile, non ha una
professione né un cantone accanto, quindi la terna che identifica una persona
vera non esiste. **M.B. non è uno degli otto**: è Marco Bianchi, l'utente del
back-office, e il guardrail delle identità ha guadagnato l'invariante che ne
discende — stesse iniziali non possono portare due nomi diversi. È il buco da
cui passò S.C., visto dal lato che il nome apre.

##### Le biografie, e il verbale che mancava

Il campo era nella demo ereditata come stringa scritta in pagina, ed è sparito
il 07.08.2026 **senza che nessuna riga lo nominasse** — a differenza del numero
d'albo, che ha la sua voce nel contratto. È la forma in negativo del difetto
delle affermazioni invecchiate, e si chiude qui nel verso opposto: il campo
torna **con la sua regola scritta**.

Il tipo porta la chiave e il testo sta nei dizionari, come per la qualifica. Il
vincolo, in tutte e quattro le lingue: **nessun nome di università, ospedale,
clinica o associazione** — un cognome poco frequente più un ateneo preciso punta
a una persona vera — e **nessun anno di esperienza**, che accanto alle zero
sedute della Dr.ssa Keller sarebbe una contraddizione nella stessa schermata.

##### Il profilo esce dal menu anche qui

Stesso trattamento del portale dipendente e stessa disposizione del §6.5, che
questa regola l'aveva già scritta prevedendo il professionista: icona a
sinistra, link perché la schermata esiste, nome accessibile che dice la
destinazione. Il riquadro è anche nel menu mobile, perché la barra laterale
sotto `lg` non esiste — senza, la rotta sarebbe rimasta senza porta.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

Il giro del marketplace per intero, **sulla build demo e con la console
aperta**:

- **una sola navigazione** per tutto il giro, console **senza un solo
  messaggio**;
- prenotata la Dr.ssa Meier **venerdì 25.09 alle 10:00**: `used` fermo a **3**,
  in programma da **3 a 4**; la settimana del professionista passa da 5 a **6**
  e il mese da 21 a **22**;
- **annullata dal calendario** con una nota: settimana **6 → 5**, mese
  **22 → 21**, la cella di venerdì alle 10:00 vuota;
- **i quattro effetti**: lo slot delle 10:00 di venerdì **torna fra i
  proponibili**, i compensi restano **14 sessioni, CHF 1'120, CHF 5'040**, il
  contatore torna a `3 su 10 · 3 in programma`, e l'appuntamento sparisce dalla
  home;
- **la scheda "Annullate" mostra le due**, quella del dataset *"Annullata dal
  paziente"* e la nuova *"Annullata dal professionista"* con la nota sotto;
- **`/admin/sessioni` non porta un nome**: cercati tutti e otto più i due nomi
  di battesimo di Laura e Marco, **zero occorrenze**; le righe portano le
  iniziali e il totale resta **83**. La controprova statica è che nessuna delle
  sei pagine admin chiama uno dei tre metodi che il nome ce l'hanno;
- **i numeri del pitch fermi**: CHF 14'200, 16, 68%, 82, 41, 142 di 1'200, 62%,
  −2;
- **il dialogo di annullamento nelle quattro lingue**: nessun overflow di pagina
  né di elemento, e le tre bio più lunghe fanno una riga in più in tedesco e
  francese senza sfondare la card (212px contro 192);
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **111 = 102 +
  9**; **768 chiavi** ×4, e a dirlo è `EXPECTED_KEYS`, che le ha contate tre
  volte durante la passata.

##### Aperto e dichiarato

- **La disdetta esiste da un lato solo.** `by_patient` resta un valore che solo
  il dataset può scrivere: il metodo per il dipendente, la policy di preavviso,
  chi paga una disdetta tardiva e la riprogrammazione sono nel
  `docs/CONTRATTO-DATI.md` §8.5, che questa passata ha riscritto invece di
  cancellare.
- **La revisione madrelingua vale anche per le stringhe nuove** — le quattordici
  del dialogo e le cinque bio — ed è la stessa voce in sospeso di M5.e. Due
  domande nelle testate di `de.ts` e `fr.ts` sono state corrette qui: quella
  tedesca citava una chiave che non esiste più, quella francese motivava il
  maschile generico con un'assenza di dato che il nome ha smentito.
- ~~**`EmployeeHome` annida un `<div>` dentro un `<p>`**, dichiarato dalla
  passata precedente e ancora fuori perimetro.~~ → **era già chiuso mentre
  questa riga lo dichiarava aperto**: `06a1b88`, nella passata precedente, aveva
  portato quel titolo a `<div>` dopo che il suo verbale era stato scritto.
  **Il commit ha corpo vuoto e nessun trailer**, quindi non dice cosa chiude, e
  questo è il difetto vero: due verbali hanno dichiarato aperto un difetto che
  il repository non aveva più. *(Barrato il 18.08.2026, dopo aver verificato
  che in tutto `src/` non resta nessun annidamento proibito.)*

#### L'allineamento fra codice e verbali (18.08.2026)

**Undici di documenti e due di codice — `fix:` ×2 — più il commit di chiusura,
che è un `docs:`.** La ripartizione è misurata con
`git log --format='%s' master..HEAD | sed 's/:.*//' | sort | uniq -c`; **il
totale non si scrive**, e lo dice git. È la clausola che questa stessa passata
ha aggiunto al criterio del 15.08 (in testa a questo file), applicata dal primo
verbale che poteva applicarla: un totale predetto è la cosa che il commit
successivo smentisce in silenzio.

**Ed è servita subito, che è la prova che valeva la pena scriverla.** La review
ha aggiunto quattro commit dopo questo verbale — la seconda qualifica dello zero
del §6.1, i nove commenti che rimandavano a M5, la formattazione e questa
riga — e **si è riaperta la sola ripartizione**, da sette a undici: il totale
non c'era da riaprire, perché non era stato scritto. La differenza fra le due
metà del criterio si vede meglio qui che in qualunque spiegazione.

**Nessun numero del §8 e del §9 si muove**, le rotte restano **26**, e nessun
colore, token o riga del §6.1 è stato toccato. A schermo cambiano due cose: una
frase dove non ce n'era nessuna, e tre tooltip che ora passano da `format.ts`.

È la passata che chiude i disallineamenti fra il codice e i verbali accumulati
fino a #62. Non costruisce niente: rimette d'accordo ciò che è scritto con ciò
che è, e prepara la sesta passata senza anticiparla.

##### Le cifre della costituzione, rimisurate

Il `CLAUDE.md` §2.7 aveva le **ultime due cifre ripetute a mano** della sezione
che ha consegnato al codice il conteggio delle chiavi. Erano invecchiate
entrambe, ognuna a modo suo.

**Gli oggetti erano 109 e sono 112**, cresciuti con le chiavi di #62, e la riga
diceva *"e non si sono mossi"*. La cifra resta — è l'altra metà della prova che
l'albero sintattico non lascia fuori nessuna proprietà — e la clausola che ne
dichiarava l'immobilità è uscita.

**Le chiavi con il valore sulla riga successiva erano dichiarate 62 e sono 69**,
e questa cifra è uscita del tutto: non è la stessa nelle quattro lingue — 69,
77, 76, 72 — perché ogni traduzione va a capo dove capita, quindi un numero solo
sarebbe falso su tre dizionari su quattro. **A reggere la clausola sull'albero
sintattico è il fatto, non la misura**: un motivo di ricerca per riga le prende
o le perde a seconda che il suo `\s*` attraversi l'a capo, e questo è vero a 62
come a 69.

##### Le tre manopole, e l'esempio del contatore

**`?role=` esisteva dal blocco d) di M5 e il §4 ne dichiarava due.** Non è un
dettaglio di conteggio: è la manopola che rende raggiungibile il ramo che nega
di `RequireRole`, cioè ciò su cui il §10.E poggia la frase «in demo le guardie
non negano l'accesso a niente». Il `README.md` diceva già tre.

**Il §10.B citava il contatore come *"3 su 10 sessioni usate · 1 in
programma"*, e l'uno è tre.** Le sedute future di Laura sono tre — la sua
ricorrenza del giovedì, generata fino all'orizzonte del dataset — e i due
conteggi arrivano da due letture diverse: `used` da `getEntitlement`, la parte
in programma dal conto degli appuntamenti. **La cifra è stata tolta, non
corretta**: la frase con i segnaposto dice esattamente ciò che quel paragrafo
esiste per dire, e non può invecchiare a ogni seduta che entra nell'orizzonte —
che è come è invecchiata questa, in silenzio, perché nessun guardrail la
sorveglia.

##### Il criterio che mancava al §7

La parola vecchia — "sedute" — si conta **sui valori dei dizionari e non sui
commenti**, ed è la stessa disciplina dei call site e delle chiavi. Serviva
perché la misura senza criterio è già arrivata: un `grep` su `it.ts` trova due
occorrenze, tutte e due nel commento che regola le biografie, e il §7 esenta i
commenti da sempre. **Il commento resta e il verbale di #61 non si tocca** —
era vero quando fu scritto: a mancare era la riga che dice su cosa si conta.

##### Quattro commenti smentiti dal proprio codice

Nessuno cambia comportamento, e tutti dicevano al lettore successivo qualcosa
che il file accanto aveva smesso di fare: `submitDemoRequest` che «non invalida
nessuna query» mentre invalida le richieste del back-office, la stessa
affermazione nella testata di `DemoRequest.tsx` **smentita dal corpo dello
stesso file**, `query-keys.ts` che dichiara `getSessionNote` senza chiamanti
mentre `useSessionNote` si presenta come «il primo lettore», e `HRNav` che cita
il §6.4 per una regola che è il §6.5. Più il blocco che descrive la richiesta
demo in `mock/provider.ts`, che stava sopra `getSession()`.

**Sono la stessa famiglia dei verbali qui sotto**: un'affermazione vera il
giorno in cui è stata scritta, in un punto che nessuno rilegge quando la cosa
descritta cambia.

##### I due difetti di comportamento

**`ProPazienti` non rendeva la lista vuota**, ed era l'unica delle 27 schermate:
con `?empty=getProfessionalPatients` restavano il titolo, «0 pazienti attivi»,
il banner privacy e poi il nulla. Ora usa `EmptyNotice` dentro una `Card`, come
le sei schermate che già lo facevano, e la casella `—` della tabella di M5.b è
stata corretta con la data. La stringa è nei quattro dizionari, quindi
`EXPECTED_KEYS` passa da **768 a 769**.

**Tre `<Tooltip>` di recharts sulla dashboard HR non avevano `formatter`**, cioè
tre numeri a schermo che non passavano da `format.ts` (§11) sulla schermata su
cui il pitch si regge. `AdminAnalytics` li formatta tutti e cinque, quindi la
forma era già nel repository. I conteggi vanno su `formatNumber`, il trend dello
stress su `formatPercent`, che è come la tabella dei reparti scrive già gli
stessi punteggi. **Oggi non si vedeva** — due o tre cifre — e si sarebbe visto
al primo dato a quattro cifre o in francese.

##### Liberare un'ora non è riproporla

Il §10.D.3 diceva che annullando «lo slot torna prenotabile» e il contratto che
l'annullamento «libera la fascia». **Provandolo, le due frasi divergono**: le
disponibilità sono le fasce dichiarate della professionista meno le occupate,
quindi annullando la ricorrente del giovedì di Laura quell'ora smette di
occupare e **non compare** fra i proponibili, perché non è una fascia del piano.

La garanzia vera è quella del contratto. Il ricomparire vale per le fasce del
piano, cioè per **la seduta che il pitch ha appena prenotato** — ed è per questo
che `docs/PITCH.md` adesso dice quale annullamento si mostra: annullare una
seduta seminata davanti a un investitore si legge come «l'annullamento non ha
liberato nulla».

##### Le tre cose trovate in review

Sono arrivate dopo il verbale, sullo stesso branch, e sono tutte di documenti.

**Lo zero del §6.1 è falso una seconda volta, di un nodo.** L'etichetta "alert"
del marker sul trend sta a 3.95:1, ed è testo informativo: la riga è stata
qualificata con la data, come la prima volta con i quattro nodi del footer.
**La lezione di metodo si allarga**, ed è la parte che serve: le prime due
volte il difetto era *come* si legge un nodo — l'alpha dentro il token si vede,
l'`opacity` sull'elemento no — questa volta è **quali nodi si percorrono**. Un
`fill` dentro un `<svg>` non entra nell'insieme che uno strumento sul DOM HTML
guarda, quindi il censimento dichiarava zero su ciò che non aveva guardato. Il
difetto **resta aperto**: il rimedio cambia un colore.

**I commenti che rimandavano a M5 erano nove, non uno.** Il `Footer.tsx`
dichiarato qui sotto era la punta di una famiglia, e la famiglia si chiude
insieme perché il criterio è uno solo — che ora sta nel `CLAUDE.md` §11,
accanto alla regola sui `TODO` con una destinazione. **Tre dicevano il contrario
di quello che il codice accanto faceva**: due volte il banner del back-office
«finché non c'è una guardia di ruolo, che è M5» — in `AdminLayout` e nella
testata admin di `it.ts`, scritta il 12.08 — e la validazione «vera è M5»,
mentre `noValidate` spegne apposta quella del browser dal blocco c). **Sei
mandavano a una milestone lavoro passato al perimetro dell'MVP**: la
paginazione in quattro punti e le pagine del footer in due.

**La review ne aveva contati sette**: gli ultimi due sono usciti cercando `M5`
su tutto `src/` mentre si chiudevano i primi, e sono duplicati esatti di due
difetti già in elenco. È l'argomento del criterio contro l'elenco, capitato
dentro il commit che scriveva il criterio.

**E un a capo mancante**, che in Markdown fondeva in uno i due paragrafi finali
del §7, più tre righe di prosa oltre le ~80 colonne del file — una a 110,
perché un ritorno a capo aveva incollato la parentesi di chiusura alla frase
successiva.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **il vuoto e l'errore dei pazienti nei due versi**:
  `?empty=getProfessionalPatients` rende «Nessun paziente in carico.» sotto il
  banner privacy, `?fail=` sullo stesso metodo rende l'`ErrorNotice` di prima
  con il suo «Riprova»;
- **i tre tooltip, con il puntatore vero**: 142 sulla ciambella, *"Media
  azienda : 50% · Vendite : 51%"* sul trend, e i quattro conteggi di servizio
  sulle barre dell'utilizzo;
- **27 rotte percorse in sviluppo**: `p div, p p, p ul, p ol, p h1…, p table,
  p form` a **zero** su tutte, e nessun `validateDOMNesting` in console — è la
  verifica che ha permesso di barrare il difetto dichiarato aperto in due
  verbali;
- **i numeri del pitch fermi** su `/hr`: CHF 14'200, 16, 68%, 82, 41, 142 di
  1'200, 62%, soglia 12, −2;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **111 = 102 +
  9**, invariati; **769 chiavi** ×4, e a dirlo è `EXPECTED_KEYS`.

##### Rilevato e non toccato — l'inventario del giallo

Serve alla decisione dei founder che sblocca la sesta passata, e **niente di ciò
che segue è stato cambiato**: nessun colore, nessun token, nessuna riga del
§6.1. Misurato a schermo con `innerWidth` controllato prima di ogni numero, sul
colore composito effettivo e non sulla classe.

| dove | cosa dice | resa | contrasto |
|---|---|---|---|
| `HRDashboard.tsx:419` banner alert precoce | **allarme** | `bg-warning/15`, bordo pieno | titolo **13.76:1**, corpo **4.62:1**, icona decorativa |
| `HRDashboard.tsx:633` barra stress "medio" | **dato** | `bg-warning` pieno | nessun testo sopra |
| `HRDashboard.tsx:718` marker dell'alert sul trend | **allarme** | punto `warning` con bordo `foreground` | l'etichetta è testo di recharts, sotto |
| `HRDashboard.tsx:60`, `AdminAnalytics.tsx:55` serie check-up | **dato** | tinta della fetta e della barra | nessun testo sopra |
| `AdminProfessionisti.tsx:157` "In verifica" | **attesa** | `bg-warning/20 text-foreground` | **13.93:1** |
| `AdminProvider.tsx:130` "In convenzionamento" | **attesa** | `bg-warning/20 text-foreground` | **13.93:1** |
| `AdminAziende.tsx:236` "In attivazione" | **attesa** | `bg-warning/20 text-foreground` | **13.93:1** |
| `ProPazienti.tsx:122` "Nuovo" | **dato** | `border-warning`, fondo bianco | testo **15.17:1**, bordo **1.53:1** |
| `Checkup.tsx:290` "Da tenere d'occhio" | **allarme** (misurazione fuori norma) | `border-warning`, fondo `muted/50` | testo **14.18:1**, bordo **1.43:1** |
| `Psicologi.tsx:327` stella della valutazione | **dato** | `fill-warning text-warning` | **1.53:1**, `aria-hidden`, con la cifra accanto |
| `StateNotice.tsx:28` | — | solo il commento che cita la regola del §6.1 | — |

**La misura che conta più delle altre**: le tre attese stanno a `bg-warning/20`
e l'allarme della dashboard a `bg-warning/15`, cioè **l'attesa è più forte
dell'allarme**. È il contrario di ciò che la sesta passata dà per scontato, e va
saputo prima di decidere: il giallo oggi non distingue i tre significati, e i
tre significati esistono — un'attesa, un allarme e un dato.

**Due cose che l'elenco di partenza non aveva**, e che il censimento ha trovato:
la **stella della valutazione** in `Psicologi.tsx`, che è un uso del giallo come
dato puro, e il fatto che `AdminAziende` non si raggiunge da `/admin/aziende` ma
da `/admin`.

##### Aperto e dichiarato

- **L'etichetta "alert" del marker sul trend sta a 3.95:1**, 11px, e non è un
  uso del token `warning`: è il grigio predefinito di recharts, `#808080`, su
  fondo bianco. È **sotto l'AA per il testo normale**, ed è testo informativo —
  dice dove cade il mese dell'alert. **Non toccato**: è fuori dal perimetro di
  questa passata, che non doveva cambiare colori. Va portato con l'inventario
  qui sopra alla decisione dei founder, perché è sulla schermata del pitch e
  perché il censimento di M5.a non poteva vederlo — misurava il colore
  calcolato dei nodi HTML, e questo è un `fill` dentro un `<svg>`. **Dalla
  review il `CLAUDE.md` §6.1 lo dichiara**: quello "zero informativi" è falso
  di questo nodo dal 18.08.2026, ed è la seconda volta che va qualificato.
- ~~**Il commento di `Footer.tsx` dice ancora «Le pagine vere sono M5»**,
  mentre il blocco f) è stato ritirato dallo scope della demo il 15.08.2026.~~ →
  **chiuso dalla review, sullo stesso branch**, e non da solo: era uno di
  **nove**, e la famiglia è stata chiusa insieme con il criterio che le
  discende nel `CLAUDE.md` §11. Il racconto sta qui sopra, «Le tre cose trovate
  in review».
- **Il piano delle passate mandava i verbali fuori dal repository.**
  `.claude/refinement-plan/kora-piano-migliorie.md` diceva di scrivere il
  verbale in `../../../../Downloads/PROGRESS.md`. Corretto sul posto in
  `docs/PROGRESS.md`, **e registrato qui perché quel file non è versionato**:
  `.claude/` è in `.gitignore`, quindi la correzione non ha un commit e questa
  riga è l'unica prova che è stata fatta. Le passate 6 e 7 leggono quella riga
  per prima.
- **`.git/index.lock` era rimasto da una sessione precedente** — file vuoto del
  17.08 alle 23:31, nessun processo git attivo — e bloccava il primo commit.
  Rimosso.

#### L'igiene del repository (18.08.2026)

**Un commit, di documenti: questo.** Niente di `src/` cambia, e non cambia
nessun documento tranne questa voce — il resto della passata non è un diff, è
roba tolta da attorno al repository.

**Due branch morti, cancellati dopo averli verificati.** `spike/report-pdf`
aveva **un commit solo** — `a845a98`, lo spike di html2canvas e jspdf del
10.08 — e `git log master..spike/report-pdf` dava quello e nient'altro: lo
spike ha già dato il suo esito, `lib/report-pdf.ts` esiste e M4 è chiusa dalla
PR #19 dello stesso giorno, quindi tenerlo era conservare materiale che il §11
non vuole. `m5e-lingue-infrastruttura-de` era **interamente dentro master** —
zero commit avanti — e non era mai stato cancellato dopo la PR #36.

**Su origin non c'era più niente da cancellare, e vale la pena saperlo**: i due
`git push --delete` hanno risposto *remote ref does not exist*. I rami erano già
spariti da GitHub e a sopravvivere erano i **riferimenti di tracciamento
locali**, che nessun `branch -a` distingue da un ramo vero: li ha tolti
`git fetch --prune`. Chi ricontrolla con `branch -a` senza aver mai fatto prune
vede rami che non esistono.

**`_to_delete/` è stata cancellata, e con lei l'esclusione locale.** Era esclusa
in `.git/info/exclude`, che non si eredita clonando — quindi il repository non
la ignorava affatto: la ignorava **questa macchina**. Delle due strade si è
presa la seconda, e la ragione è che il contenuto non era materiale da tenere:
68 file, 1.6 MB, fermi dal 15.08 — due tarball e 66 fra lock git orfani e
oggetti temporanei. **Verificato voce per voce prima di cancellare**: ogni file
dei due archivi esiste ancora oggi nell'albero di lavoro, quindi non portavano
niente che git e il disco non abbiano già. E `kora-analysis.tar.gz` conteneva
**una seconda copia non tracciata dei due PDF riservati**, cioè l'opposto di ciò
che il §3 chiede il giorno in cui quei PDF dovranno uscire anche dalla storia.

**Nessuna riga è finita in `.gitignore`**: ignorare per tutti una cartella che
non deve esistere è la stessa cosa che il §11 rifiuta altrove — codice, o
configurazione, messo lì per un caso che non c'è.

**I PDF non si toccano, ed è la verifica che è stata chiesta.** La riga del §3
regge come obbligo con un innesco — *"al primo ingresso di qualcuno che non sia
un founder … si tolgono dal repository e si ripulisce la storia con
`git filter-repo`"* — e non come nota. Niente da correggere.

**Nota a margine, riportata e non corretta**: il file si chiama
`KORA_BusinessPlan_v6.pdf` e alla prima pagina dichiara **«VERSIONE 5.0 · Giugno
2026»**; *"Dubbi Business per CEO"* cita a sua volta *"Business Plan KORA v5.0"*.
Il nome del file e il documento non dicono lo stesso numero, e a essere isolato è
il nome. Non è un difetto del repository e non si rinomina qui: è una cosa da
chiedere ai founder, insieme alla decisione di quando i PDF escono.

#### L'annullamento visibile e le settimane (18.08.2026)

~~**Quattro di codice — `feat:` ×3, `fix:` ×1 — e sette di documenti, contando
il commit di chiusura.**~~ → **erano `feat:` ×3, `fix:` ×3 e `docs:` ×7** sulle
due PR insieme, rimisurati il 19.08.2026 con il comando che questa riga già
citava —
`git log --format='%s' <base>..HEAD | sed 's/:.*//' | sort | uniq -c`. I `fix:`
erano tre: `6a056c6`, i badge dell'annullata portati ad AA, **stava dentro #65
dal principio**, quindi la cifra era già sbagliata di uno quando la passata l'ha
riaperta; `eff29d8`, l'anello di focus dei giorni, è arrivato **dopo** il
verbale, e nessuno l'ha riaperta una seconda volta. Documenti e `feat:`
tornavano.

**È il verbale che ha smentito la clausola del 18.08 usandola**, ed è da qui che
nasce la conclusione del 19.08.2026 in testa a questo file: **i verbali non
contano più i commit**, e questa riga resta come l'ultima che ci ha provato.

**LA RIPARTIZIONE SI RIAPRE, ED È LA SECONDA VOLTA IN DUE GIORNI.** Diceva *tre
di codice e quattro di documenti*, e la seconda metà della passata — il salto a
data, approvato dai founder dopo un mock — è arrivata dopo il verbale, su una
PR sua. **Si aggiorna la sezione invece di aprirne una seconda**: è la stessa
passata, e il criterio in testa a questo file dice che un commit arrivato dopo
riapre la cifra. Che sia servito **due volte in due giorni** è il modo in cui si
sa che serviva: la prima volta l'aveva scritto una review, questa volta un
blocco di lavoro nuovo.

*(Il conto va fatto dalla base della passata e non da `master`: la prima metà è
stata mergiata prima che la seconda cominciasse, quindi da lì `master..HEAD`
misura solo il seguito.)*

**Nessun numero del §8 e del §9 si muove**, le rotte restano **26**, nessuna
schermata nasce. Il contratto cresce in tre punti e **solo in lettura**: un
campo su `Appointment`, una riga sul periodo dei metodi del professionista, e
una policy separata da un invariante.

È la passata che chiude ciò che si vede **provando** l'annullamento costruito il
17.08: tre difetti che nessun documento nominava, e che si trovano solo facendo
il giro intero. **Poi il calendario ha guadagnato il salto a data**, e la sezione
lo racconta in fondo.

##### Il dipendente sa che la sua seduta è stata annullata

Era il più visibile dei tre e nessuna riga lo diceva: `getAppointments`
restituiva le sole `scheduled`, quindi la disdetta della professionista faceva
**sparire la riga** dal lato del dipendente. Non è una delle quattro voci che il
`docs/CONTRATTO-DATI.md` §8.5 dichiarava mancanti — quelle riguardano il
preavviso, chi paga, la riprogrammazione e la disdetta dal lato del paziente —
era un buco che nessuno aveva nominato.

**La lettura porta anche le annullate ancora future**, non le erogate: la
domanda che risponde è *cosa c'è sul mio calendario*, e una seduta annullata di
domani ci sta finché domani non passa. Le erogate restano il contatore.

**IL PUNTO IN CUI QUESTA MODIFICA SI ROMPEVA IN SILENZIO, ed è il motivo per cui
i consumatori si cercano prima**: `EmployeeHome` costruisce `{scheduled}`
contando la lista filtrata per servizio, quindi con le annullate dentro la frase
*"3 su 10 sessioni usate · N in programma"* sarebbe **salita di uno** nel momento
esatto in cui il dipendente scopre che la seduta non c'è più. Il filtro sullo
stato sta nel punto che conta. **E il secondo consumatore non era la home**: la
`HeroProductPreview` della landing mostra `appointments[0]` come "prossimo
appuntamento", e avrebbe annunciato una seduta disdetta.

**Nessun gesto per togliere l'avviso**, ed è una decisione: toglierlo sarebbe una
scrittura nuova sul provider per un gesto che nessuno ha chiesto, tenerlo per
sempre sarebbe il vicolo cieco del §10. Sparisce da sé quando la sua ora passa,
che è il comportamento che la lettura già dà.

**La nota di annullamento non esce verso il dipendente**: vive su
`ProfessionalSession`, e `Appointment` non ha il campo — la stessa forma di
`SessionNote`. Chi la legge è una decisione di prodotto che nessuno ha preso.

**Il §8.5 guadagna la voce che mancava: la notifica non esiste.** Il dipendente
l'annullamento lo vede **solo se apre l'applicazione**, e questa passata rende
quel vuoto visibile proprio perché ne costruisce metà.

##### Il calendario si sposta di settimana

Difetto dichiarato da M3, e a schermo produceva una contraddizione fra due
schermate dello stesso portale: `/professional/pazienti` diceva *"prossima
seduta 01.10"* e il calendario non poteva arrivarci.

**Il seam c'era dai tempi di M2 e non era mai stato usato**: `weekGrid` prende la
settimana mostrata e oggi come **due parametri distinti**, e la pagina passava
`today` a tutti e due. Adesso il primo è la settimana navigata, quindi il
marcatore "oggi" non viaggia con la griglia.

**Le KPI non seguono la navigazione** (decisione della passata): sedute della
settimana, prossima seduta, agenda del mese e pazienti attivi restano ancorate a
oggi, perché rispondono a *come sto adesso*. È la disciplina della cornice del
trimestre letta al contrario — lì ciò che segue il comando sta dentro la
cornice, qui **il comando comanda la sola griglia** — e l'etichetta sopra la
griglia dichiara quale settimana mostra. Per questo l'etichetta è **scesa** dal
sottotitolo di pagina alla riga dei comandi.

**I comandi in cima alla card e non ai lati**, per due ragioni che si vedono: le
righe della griglia si ricavano dalle sedute della settimana, quindi la sua
altezza cambia navigando e su una settimana vuota è **zero** — due frecce
centrate verticalmente si centrerebbero su niente — e l'ordine di tabulazione
attraverserebbe tutta la griglia. **La riga sta fuori dal ramo del vuoto**, o da
una settimana senza sedute non si tornerebbe più indietro.

**Nessun limite in nessuno dei due versi.** Una settimana senza sedute è uno
stato vero e la card lo dice a parole; una freccia disabilitata a un confine
inventato invita la domanda "perché è grigia?" dentro trenta minuti contati. Il
ritorno a oggi è un clic e compare **solo** fuori dalla settimana corrente.

**Il contratto guadagna una riga e non cambia**: il §6 diceva già che in
produzione `getProfessionalSessions` prenderà un intervallo. Adesso il chiamante
che lo vorrà **esiste**, perché la navigazione esce davvero dalla finestra di
sedute che il provider tiene — e quel giorno "vuota" e "non caricata" smettono
di essere la stessa cosa a schermo.

##### Il badge "Annullata" era sotto l'AA, ed è il terzo zero falso

`bg-destructive/10 text-destructive` misurava **3.30:1** e il badge del motivo
**3.76:1**, mentre il `Badge` di shadcn è testo normale: la soglia è 4.5. Il
rimedio non era una decisione nuova — `destructive-strong` esiste dall'11.08 per
questo — e ora misurano **4.92** e **5.60**.

**Perché il censimento non li aveva visti**: stanno dentro
`TabsContent value="cancelled"`, e Radix **non monta i contenuti dei tab
chiusi**. Non erano nodi difficili da leggere: **non erano nodi**. È la terza
forma della stessa famiglia — dopo l'`opacity` che il colore non porta e il
`fill` dentro un `<svg>` — e da qui il `CLAUDE.md` §6.1 chiede che un censimento
dichiari **quanti nodi ha percorso**, perché è l'unico numero che distingue
"niente sotto soglia" da "non ho guardato".

##### Il censimento rifatto su ciò che il DOM non contiene

Viewport 1280×900, `innerWidth` verificato prima di ogni misura, e per ogni
superficie il numero di **nodi percorsi** e di **nodi di testo controllati**:

| superficie | percorsi | controllati | sotto soglia |
|---|---|---|---|
| `/professional` calendario, settimana corrente | 141 | 46 | 0 |
| dialogo di annullamento | 16 | 8 | 0 |
| `/professional/sessioni` · In programma | 292 | 120 | 0 |
| · Erogate | 796 | 390 | 0 |
| · Annullate | 51 | 18 | **0, dopo il fix** |
| dialogo nota di sessione | 19 | 6 | 0 |
| `/employee/psicologi` · Psicologi | 109 | 39 | 0 |
| · Coach | 65 | 21 | 0 |
| dialogo di prenotazione, con giorno e ora scelti | 23 | 12 | 0 |
| `/employee/checkup` | 88 | 28 | 0 |
| dialogo referto (i due badge "Da tenere d'occhio") | 38 | 20 | 0 |
| `/hr?fail=getCompany` | 31 | 10 | 0 |
| `/hr?empty=getRoiSnapshot` | 46 | 15 | 0 |
| `/hr?role=employee`, accesso negato | 11 | 4 | 0 |

**I controlli disabilitati sono esenti dalla 1.4.3 e vanno saltati**: la sola
lista sessioni ne ha **18**, tutti a 3.10:1 per l'`opacity` che shadcn mette su
`:disabled`. Uno strumento che non li salta trova diciotto difetti che non
esistono — ed è il modo più rapido per far perdere fiducia in un censimento che
altrove ha ragione.

##### La policy che il contratto affermava come invariante

Il `docs/CONTRATTO-DATI.md` §8.5 diceva al backend che *"da quando una seduta è
annullata, quell'ora torna prenotabile da chiunque"*. **La prima metà è un
invariante e resta**; la seconda è una **policy di prodotto che nessuno ha
deciso**: una professionista che annulla può non volere nessun altro a
quell'ora. Le due sono state separate con la data, e la decisione è nominata
accanto alla **pubblicazione della disponibilità**, di cui è la faccia che si
vede per prima.

##### Verificato a schermo, viewport 1280×900

Il giro intero del marketplace, nell'ordine:

- **prenotato** venerdì 25.09 alle 10:00 dal portale dipendente: settimana del
  professionista **5 → 6**, mese **21 → 22**, la cella compare nella griglia;
- **annullato dal calendario** con una nota: settimana **6 → 5**, mese
  **22 → 21**, la cella si svuota;
- **tornato dal dipendente**: la riga **resta** con *"Dr.ssa Meier ha annullato
  questo appuntamento."* e il badge "Annullato", e il contatore in programma
  **scende** da 4 a 3 — non sale;
- **letta la prossima seduta** nell'elenco pazienti e **raggiunta dal
  calendario** con la freccia avanti: la settimana 28.09–04.10 mostra Kunz il 29
  e Bernasconi il 1° ottobre;
- **navigazione oltre il dataset**: la settimana del 19.10 è vuota, la card lo
  dice, e "Questa settimana" riporta a oggi in un clic;
- **le manopole sui metodi toccati**: `?fail=getAppointments` e
  `?fail=getProfessionalSessions` rendono l'errore di sempre,
  `?empty=getAppointments` la frase esistente sugli appuntamenti,
  `?empty=getProfessionalSessions` la settimana vuota **con i comandi ancora
  lì**;
- **in tedesco** la riga dei comandi tiene — "Vorherige Woche", "Diese Woche",
  "Nächste Woche", nessun overflow orizzontale su calendario, home e sessioni;
- **11 rotte percorse con un listener sugli errori**: zero;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **111 = 102 +
  9**, invariati; **775 chiavi** ×4.

##### Il salto a data (seconda metà, 18.08.2026)

**Approvato dai founder dopo un mock**, e la ragione è una misura: la
navigazione a frecce costruita poche ore prima non basta su un'agenda che copre
**sette mesi e mezzo** — dal 03.03.2026 al 13.10.2026, derivati dalle sedute e
non scritti — dove rivedere un percorso concluso costa ventotto clic.

**Il trigger è l'etichetta della settimana**, cioè l'elemento che dice dove sei:
la riga dei comandi non cresce di un elemento. Dentro, il `Popover` e il
`Calendar` che il repository aveva già.

**La settimana è una banda, non una selezione.** `mode="single"` senza
`selected`: un giorno selezionato accenderebbe `day_selected`, che è `bg-primary`
pieno, e finirebbe sopra la banda — due riempimenti nello stesso calendario si
leggono come due stati dello stesso tipo. Qui il clic **sposta la settimana**.
Oggi resta un anello, sovrascritto **dal call site** perché il default di
`ui/calendar.tsx` è lo stesso `bg-accent` della banda: sotto la banda sparirebbe.

**I bordi dell'agenda si derivano** e vanno su `fromDate`/`toDate`, che limitano
insieme selezione e navigazione dei mesi — le frecce del mese si spengono ai
bordi invece di portare su un mese interamente spento. Niente navigazione per
anno.

##### Le tre cose che la libreria ha fatto trovare

**`date-fns` non si importa**, ed è la prima: react-day-picker genera testo suo
— caption, iniziali dei giorni, nomi accessibili — e senza intervento esce
**tutto in inglese**. La strada ovvia sarebbe passargli una `locale` di
`date-fns`, che però è una **dipendenza transitiva** che nessuno ha dichiarato
(§3). Al suo posto `formatters` e `labels` instradati su `format.ts`, con i due
formattatori che esistevano già.

**`today` va passato, o la libreria chiama `new Date()` per noi.** Senza,
l'anello di "oggi" cade sulla data vera della macchina mentre tutto il resto
della demo deriva da `DEMO_TODAY` (§5.4). È una violazione del §5.4 **scritta
dentro una libreria**, e si trova solo guardando dove cade l'anello.

**`labels.labelDay` è morto in react-day-picker 8.10**: definito e mai
consumato — verificato nel sorgente distribuito, dove `labelPrevious`,
`labelNext` e `labelWeekday` finiscono su un `aria-label` e `labelDay` non
compare. I pulsanti dei giorni non hanno nome accessibile oltre al numero,
quindi il puntino dice la sua informazione **a parole** da `DayContent`, con
una frase per i soli lettori di schermo. Passare `components` dal call site
**sostituisce** quello di `ui/calendar.tsx` invece di fondersi, quindi le due
icone delle frecce sono state ripassate lì — o le frecce del mese restavano
vuote. Tutto dal call site: `ui/calendar.tsx` e `ui/popover.tsx` non sono stati
toccati.

##### L'aritmetica delle settimane, e il cambio d'ora dentro l'agenda

`weeksBetween` sta in `dates.ts` e usa `Math.round`. **Non è pigrizia**: due
mezzanotti locali a sette giorni di distanza distano `7 × 86'400'000`
millisecondi **solo se in mezzo non cambia l'ora**, e l'agenda comincia il
03.03.2026 mentre l'ora legale entra il 29.03.2026 — il confine cade **dentro**
l'intervallo navigabile. Misurato: dal lunedì di oggi a quello del 02.03.2026 il
quoziente è **−28.994**, che troncato dà −28 e arrotondato −29. Con la divisione
secca il mini calendario avrebbe evidenziato una settimana e la griglia ne
avrebbe mostrata un'altra.

**Sta in `dates.ts` benché abbia un chiamante solo**, ed è una scelta dichiarata
contro il §11: ha vinto la ragione di `overlaps` — è il file in cui chi incontra
la trappola la viene a cercare, ed è aritmetica sui giorni, non presentazione.
Dentro la schermata, il commento che spiega il cambio d'ora sarebbe archeologia
che la prima ripulitura toglie.

##### Il puntino era sotto soglia, ed è un difetto del mock

Il segno che dice *"qui c'è almeno una seduta"* stava su `secondary`: **2.53:1**
sulla banda e **2.83:1** sul bianco, mentre è un elemento non testuale che porta
un'informazione — soglia **3:1** (1.4.11). Su `secondary-strong` misura **5.10**
e **5.72**, misurati a schermo. Il `CLAUDE.md` §6.1 guadagna la clausola che
mancava: la regola diceva che le varianti `-strong` si usano dove il colore è
testo, e non copriva il caso di un segno che è l'unico portatore visivo.

##### Verificato a schermo, viewport 1280×900

- **il salto funziona nei due sensi**: dal 21–27.09 a 31.08–06.09 con un clic, e
  l'etichetta e l'intestazione della griglia dicono la stessa settimana;
- **il cambio d'ora**: scelto il 04.03.2026, l'etichetta e la griglia dicono
  entrambe **02.03–08.03**, e riaprendo il calendarietto la banda copre 2–8 marzo;
- **i due bordi**: a marzo la freccia del mese precedente è spenta e 1 e 2 marzo
  non si scelgono; a ottobre è spenta quella successiva e i giorni dal 14 in poi
  sono spenti;
- **oggi è un anello e sta su 23**, non sulla data della macchina;
- **quattro lingue**, caption e riga dei giorni: *settembre 2026* / *September
  2026* / *septembre 2026* / *September 2026*, con `lun mar mer…`, `Mo Di Mi…`,
  `lun. mar. mer.…`, `Mon Tue Wed…`; nomi accessibili delle frecce e riga
  dell'intervallo tradotti, **zero inglese** e nessun overflow orizzontale;
- **il focus torna sul trigger** dopo la scelta, e il popover si chiude;
- `lint`, `typecheck` a zero; **779 chiavi** ×4.

##### La tastiera non è stata provata a mano, e va detto

Il pannello del browser di questa sessione **non consegna eventi di tastiera
alla pagina**: verificato, non supposto — `Tab` non muove il focus e `Escape`
non chiude un popover che il DOM dichiara aperto. Nemmeno gli eventi
sintetizzati servono, perché non producono l'attivazione nativa di un pulsante.
Nessun browser reale era collegato per rifare la prova altrove.

**Quello che è verificato**: il trigger è un `button` vero con
`aria-haspopup="dialog"` e `aria-expanded` che si muove, i giorni sono pulsanti
dentro una tabella `role="grid"`, e **il focus torna sul trigger** alla chiusura.
**Quello che resta da provare in venti secondi**: apertura con Invio, frecce fra
i giorni, Escape. È la stessa famiglia della nota del §11 sul misurare a scheda
nascosta — lo strumento mente, e conviene saperlo prima.

##### Trovato e non toccato

- **Il dialogo di annullamento promette la riproposizione**: *"L'ora torna
  prenotabile e la sessione non entra nei compensi."* È la stessa imprecisione
  che i documenti hanno corretto il 18.08 — l'ora si libera, ma ricompare fra
  le proponibili **solo** se è una fascia del piano — e per lo slot che il
  pitch annulla è vera. Non toccata: sono quattro stringhe, e la frase giusta
  dipende dalla policy che il contratto ha appena dichiarato non decisa.
- ~~**La legenda resta sotto una settimana vuota**: tre voci che spiegano celle
  che non ci sono.~~ → **chiusa dalla seconda metà della passata**, insieme
  all'altra coda: `getAppointments` assegnava `cancellationReasonKey` anche
  quando non pertiene, cioè la proprietà con dentro `undefined` — mentre il §2
  del contratto vuole che un campo `?` **non ci sia**. È la stessa famiglia
  della sentinella a zero di `employeeCount`: non la forma sbagliata, il
  significato sbagliato.

#### I criteri e i conteggi (19.08.2026)

**Questo verbale non conta i propri commit**, ed è la prima applicazione della
clausola che la passata ha appena scritto in testa a questo file: dice cosa ha
fatto, e il conto lo dà git con il comando che sta lì. **Solo documenti** —
`git diff --stat` non tocca nessun file sotto `src/`, quindi `lint` e
`typecheck` non potevano muoversi e infatti restano a zero. **Nessun numero del
§8 e del §9 si muove**, le rotte restano **26**, `EXPECTED_KEYS` e il conto dei
guardrail non sono stati toccati.

Chiude **sei cifre di prosa invecchiate** — cinque del piano più una che il
piano non aveva, chiusa dai founder mentre la passata correva — e **completa due
criteri che avevano già fallito una volta ciascuno**. Va prima della sesta
passata perché la sesta chiuderà con un verbale che dichiara una ripartizione:
correggere la regola dopo averla sbagliata una terza volta è ciò che questo file
spende energia per non fare.

##### I due criteri, e in tutti e due il rimedio è stato togliere il numero

**Il conto delle passate è uscito dal paragrafo che le elenca.** Diceva
*"Trentatré passate"* e l'elenco si fermava all'annullamento e all'identità: ne
mancavano tre — l'allineamento fra codice e verbali, l'igiene del repository, e
l'annullamento visibile con le settimane e il salto a data — e **"questa
passata"**, un deittico dentro un file che cresce, indicava ormai la penultima.
**Non è stato riportato a trentasei**: era il terzo invecchiamento della stessa
riga in dieci giorni, e la dottrina era già scritta per i guardrail — *si cita
ciò che non si muove* (`CLAUDE.md` §5.6). I nomi non si muovono; la cifra la
ottiene chi conta l'elenco.

**Il verbale non conta più i commit.** Delle due strade — riaprire la
ripartizione insieme al totale, oppure smettere di scriverli — è stata scelta la
seconda, che è quella che il `CLAUDE.md` §2.7 ha preso per le chiavi e il §5.6
per i call site: **il conto lo fa chi può rifarlo da solo**. La prima è la stessa
speranza con una cifra diversa, e ha fallito due volte su due.

**La prova che la clausola del 18.08 non bastava era già nel file.** Copriva il
totale e lasciava scoperta la ripartizione — e nel primo verbale scritto sotto
quella clausola il totale non era nemmeno stato scritto. Quel verbale —
l'annullamento visibile — dichiarava «`feat:` ×3, `fix:` ×1» sulle due PR
insieme: i `fix:` erano
**tre**. `6a056c6` stava dentro #65 dal principio, quindi la cifra era sbagliata
già alla riapertura; `eff29d8` è arrivato dopo il verbale, e nessuno l'ha
riaperta una seconda volta. **Corretta con la data**, dove sta.

**Tre cifre di commit sbagliate in cinque giorni non sono una distrazione**: una
cifra che vive nella prosa la può rinfrescare solo una persona, e riaprirla è una
promessa di tornare — la stessa che il §2.7 ha visto non mantenere da chi il
numero giusto l'aveva appena misurato.

##### L'ultima fotografia dello stesso paragrafo

**«#15 è oggi l'unica docs-only fra quelle contate»** stava dentro il criterio
del conto delle passate, cioè nella sezione che questa passata aveva appena
riscritto, ed era **falso dal 15.08.2026**: docs-only e contate sono anche #45,
#50, #51, #52, #64 e questa. **Il rimedio è quello delle altre tre cifre di
oggi** — la regola resta, *le docs-only si contano*, e la fotografia esce:
quante siano invecchia a ogni passata documentale che si mergia, e sono già sei.

Restano i due casi che sembrano contraddire la regola e non la contraddicono —
#25, docs-only ma esclusa come sintesi retrospettiva, e #21, che dal nome del
branch sembra docs-only e tocca `mock/people.ts` — perché quelli **spiegano il
criterio** invece di misurarlo.

##### Le quattro voci del `CLAUDE.md`

| | cosa diceva | rimedio |
|---|---|---|
| §3, componenti tenuti | «33 dei 45 non li importa nessuno» | **cifra tolta**: non aveva un criterio, e i conti sono due |
| §3, esempi d'uso | «slider e switch al check rapido, popover e scroll-area alla dashboard» | **corretti con la data**: tutti e quattro sbagliati |
| §2.7, oggetti | «112 oggetti» | **mezza riga di criterio**: sono le proprietà con valore oggetto, e i letterali dell'albero sono 113 |
| §5.6, bundle | «8 KB in più su ~1.1 MB» | **scarto rimisurato**, cifra assoluta tolta |

**Il «33» non è stato riallineato, ed è la ragione che conta.** A invecchiarlo
era stata la passata che il §3 racconta due paragrafi più sotto — `popover` e
`calendar` usciti dal magazzino il 18.08.2026 — ma il difetto vero è che *"non
li importa nessuno"* ha due letture: **nessun file fuori da `ui/`**, e allora
sono **31**, oppure **nessun file, nemmeno un pari**, e allora sono **26**,
perché `separator`, `sheet`, `skeleton` e `tooltip` li importa solo
`sidebar.tsx`, e `toggle` solo `toggle-group.tsx`. Senza criterio il conto non è
ripetibile; e siccome **la ragione per cui si tengono non dipende da quanti
sono**, la frase dice "la maggior parte" e non perde niente.

**I quattro esempi erano l'unica delle cinque voci che descrive il codice**, ed
è la frase che *giustifica* la conservazione: `slider` lo importa `Roi.tsx` e
non il check rapido, `popover` lo importa `ProCalendario.tsx` e non la
dashboard, `switch` e `scroll-area` non li importa nessuno. Erano previsioni,
come quella su `form` corretta il 12.08.2026, scritte prima che quelle schermate
esistessero. **La conclusione non si muove**: la conservazione poggia sulla
copia buona della generazione Tailwind 3, non sugli usi previsti — e il
18.08.2026 quella ragione si è dimostrata da sé. Le due righe, che stavano in
due paragrafi che non si parlavano, ora si citano.

##### Come sono state misurate, perché le misure si rifanno

- **gli import di `ui/`**: si scorrono i `from "@/components/ui/<nome>"` di
  `src/`, una volta escludendo `src/components/ui/` e una volta contando anche i
  pari. I due insiemi differiscono di cinque, e sono quelli nominati qui sopra;
- **gli oggetti di `it.ts`**: sull'albero di TypeScript, `PropertyAssignment` con
  inizializzatore `ObjectLiteralExpression` — 112 — contro tutti gli
  `ObjectLiteralExpression` — 113, perché c'è la radice. Identici sui quattro
  dizionari;
- **lo scarto del bundle**: due build di fila, `dist/assets/index-*.js` a
  **1'456'004** byte in demo e **1'444'319** in produzione, cioè **11'685 byte**.
  Il totale di `dist/` dà lo stesso scarto, che è la controprova che il
  differenziale sta tutto in quel chunk;
- **la ripartizione di #65 + #66**: `git log --no-merges --format='%s'` sulle due
  PR, `docs:` ×7, `feat:` ×3, `fix:` ×3.

##### Verificato

- **`git diff --stat` contro `master`: nessun file sotto `src/`**, e i soli tre
  file toccati sono `CLAUDE.md`, `docs/PROGRESS.md` e il verbale che stai
  leggendo, che sta nel secondo;
- `lint` e `typecheck` a zero, `build` e `build:demo` passano — eseguiti prima
  della prima riga, perché lo scarto del bundle è una misura di questa passata;
- **niente verifiche a schermo, e va detto perché**: non c'è niente di nuovo a
  schermo. È la stessa forma delle passate documentali del 15.08.2026, che è il
  modello di questa.

##### Trovato e non toccato

- ~~**«#15 è oggi l'unica docs-only fra quelle contate»** andrebbe corretta, ma
  è la sesta voce di un piano che ne aveva cinque.~~ → **chiusa dai founder
  nella stessa passata**, ed è la voce qui sopra: la frase stava dentro la
  sezione appena riscritta, quindi chiuderla **finisce il paragrafo invece di
  allargare il piano**.
- **Le due letture del «33 dei 45» sono uscite 31 e 26**, mentre il piano di
  questa passata le dava come 30 e 31. La divergenza è di criterio e non di
  codice — il piano non diceva quali due insiemi — e i due di qui sono scritti
  con il loro criterio proprio perché una terza misura non ne produca un terzo.
- **L'etichetta "alert" del marker sul trend resta a 3.95:1** (`CLAUDE.md` §6.1,
  passata del 18.08.2026): il rimedio cambia un colore, quindi è dei founder.
- ~~**Il 73 di `AVERAGE_HEALTH_SCORE` non è ancora nel `CLAUDE.md` §8**,
  dichiarato aperto dal 16.08.2026: è una cifra del dataset che il §2.4 non
  copre.~~ → **chiuso il 19.08.2026** (verbale «La demo pronta»).
- ~~**Il dialogo di annullamento promette ancora che l'ora "torna
  prenotabile"**, mentre i documenti hanno separato l'invariante dalla policy il
  18.08.2026.~~ → **chiuso il 19.08.2026** (verbale «La demo pronta»).
  Sono quattro stringhe, e la frase giusta dipende da una policy non decisa.
- **Il «8 KB su ~1.1 MB» del verbale pre-pitch del 10.08.2026 resta dov'è**: è un
  resoconto datato, e a essere viva era la riga del `CLAUDE.md` §5.6.

#### Le attese e l'ordinamento (19.08.2026)

**Questo verbale non conta i propri commit**, ed è la seconda passata scritta
nella forma decisa il giorno prima: dice cosa ha fatto, e il conto lo dà git con
il comando in testa a questo file. **Ed è il primo caso in cui la regola nuova
si vede lavorare**: la review ha aggiunto commit dopo il verbale — la parola
dell'elenco dipendenti e la cifra del §2.7 — e non ha imposto niente, perché non
c'era nessuna cifra da riaprire. Due giorni fa sarebbe stata la terza
riapertura in tre giorni. **Nessun numero del §8 e del §9 si muove** —
verificati a schermo alla cifra, elenco più sotto — le rotte restano **26** e
nessuna schermata nasce. `EXPECTED_KEYS` passa da **779 a 780**: la passata
aggiunge **una** stringa ai quattro dizionari.

Tre cose: un token per l'attesa, l'ordinamento di sette tabelle, e la chiusura
del difetto AA che aspettava una passata che toccasse i colori — che è questa.

##### Tutto ciò che aspetta si dice allo stesso modo, e con un colore suo

**Il difetto vero era uno solo, e stava in `HRFatturazione`**: la fattura in
attesa usciva con la **stessa classe** della pagata — `bg-secondary/10
text-secondary-strong` — e a cambiare era la sola parola. Chi legge in fretta
leggeva "pagato" su una fattura che non lo è. Gli altri cinque punti erano
disomogeneità: tre badge del back-office già gialli, il compenso in attesa del
professionista e i due badge del suo profilo, grigi neutri — e il grigio dice
"spento", non "in corso".

**La strada scelta dai founder è un token**, `--waiting`, e non un `warning` più
chiaro: due significati che si distinguono per la **trasparenza** dello stesso
colore si sfaldano al primo cambio di fondo, e qui si erano già sfaldati —
l'attesa stava a `bg-warning/20` e l'allarme a `bg-warning/15`, cioè l'attesa
era **più forte** dell'allarme. La regola del `CLAUDE.md` §6.1 su `warning` e
`destructive` **non è stata riscritta**, ed è il guadagno della strada: l'attesa
esce da `warning` invece di diluirlo.

| | misura |
|---|---|
| testo su `waiting` | **11.95:1** (`text-xs`, cioè testo normale: soglia 4.5) |
| ΔE fra `waiting` e il fondo del banner d'alert | **35.1** |
| ΔE fra `waiting` e l'ambra piena del bordo | **16.5** |
| `waiting` nella palette scura | **6.58:1**, dichiarata benché inerte |

**Le due ΔE sono misurate affiancando**, non una schermata per volta: il chip
dell'attesa è stato inserito **dentro** il banner dell'alert precoce della
dashboard HR, che è il solo punto in cui i due gialli si toccano davvero. Un
giallo che passa la soglia da solo e sparisce accanto all'allarme non
risolverebbe il problema per cui esiste.

**Due dei sei punti non sono raggiungibili nel dataset**, e sono stati provati
rompendolo ad arte — la tecnica della passata pre-pitch del 10.08.2026 — e
ripristinandolo subito: tutte le fatture sono `paid` (§ dei difetti noti di
M2), e la professionista del portale ha documenti e mandato in ordine. Con una
fattura del mese in corso portata a `pending` il chip esce giallo a 11.95:1
accanto alle tre pagate in teal; con il mandato della Dr.ssa Meier non firmato,
"Da firmare" esce giallo accanto a "Verificati" in teal, sulla stessa card.
**Senza quella prova la correzione più importante della passata sarebbe stata
verificata solo leggendo il codice.**

**Giallo non vuol dire attesa, e la metà che non si tocca vale quanto l'altra**:
restano su `warning` il banner dell'alert e il marker sul trend, che sono
l'**allarme**; restano dove sono la barra dello stress "medio", la serie dei
check-up dei due grafici, il badge "Nuovo" dei pazienti e "Da tenere d'occhio"
del referto, che sono **dati** o segnalazioni cliniche.

##### Il settimo punto non era un'attesa: era una parola

La passata aveva segnalato come settimo punto il badge **"In attesa"**
dell'elenco dipendenti dell'HR, e la review ha trovato che il difetto non era il
colore. La riga rende `enrolled` — chi ha **attivato l'account**, 82 persone — e
scriveva **"Attivo"**; un clic più in là la dashboard chiama **attivi** quelli
che hanno usato almeno un servizio nel trimestre, che sono **41** e che la
tabella delle KPI di `docs/CONTRATTO-DATI.md` §3 definisce alla lettera. Due
schermate adiacenti dello stesso portale, una parola, due conteggi: è il §7 —
*una cosa, una parola* — nella forma opposta a "sessioni/sedute", perché qui la
parola è una e i significati sono due.

**Il badge è stato rinominato, non colorato**: "Iscritto / Non iscritto", e le
parole **non sono nuove** — vengono dal sottotitolo della stessa schermata,
*"82 iscritti su 120"*, e lingua per lingua dalla stessa riga (`angemeldet`,
`inscrits`, `enrolled`). Coniarne una quinta avrebbe riaperto il difetto che la
correzione chiude.

**"Non iscritto" resta neutro, e la regola nuova non guadagna un'eccezione**:
quella riga **non aspetta** — nessuno in Kora sta lavorando su quella persona —
ed è il denominatore della curva di adozione. Il `CLAUDE.md` §6.1 lo dice
accanto alle altre cose che restano fuori dal giallo, e il §7 registra il caso:
è la seconda volta che la regola pesca una parola presa in prestito da una
definizione del contratto.

**La parola è stata cercata, non le due chiavi.** Passate in rassegna tutte le
occorrenze di "attivo" nei quattro dizionari: restano dove sono il **piano**
attivo della fatturazione, l'**azienda** e la **struttura** attiva del
back-office, il **tasso di attivazione**, la videochiamata non attiva della
demo, il **paziente attivo** del portale professionista — che ha la sua
definizione nella stessa tabella delle KPI — e l'**utente attivo** del
back-office, che è un flag di account con "Inattivo" per opposto. Il criterio è
che la parola sia libera dove descrive **una persona dell'area HR**.

##### Le sette tabelle si ordinano

**Sono sette e non sei**, ed è un conto di tabelle e non di schermate: `/admin`
ne porta **due**, il portafoglio clienti e le richieste demo. Il criterio sta
accanto al numero, come per i call site e per le rotte — si contano gli
elementi `<table>` che il §10 elenca fra le rotte dello scope: `/hr/dipendenti`,
`/admin` ×2, `/admin/utenti`, `/admin/professionisti`, `/admin/sessioni`,
`/admin/provider`.

**Un componente solo**, `components/kora/SortableTable.tsx`, perché sei tabelle
su sette hanno da cinque a otto righe e non ne avrebbero bisogno: a chiederlo è
`/admin/sessioni`, che ne ha **82**. Con una primitiva sola metterlo ovunque non
costa niente e toglie la domanda "perché qui sì e là no".

**È presentazione e non dominio**: nessuna chiave di cache cambia, nessun metodo
prende un parametro nuovo, il provider non sa che esiste — la stessa ragione per
cui il raggruppamento settimanale del calendario non sta nell'interfaccia
(`docs/CONTRATTO-DATI.md` §2). **Ordinare non è filtrare**: le righe restano
quelle.

**Tre stati e non due.** Non ordinato → crescente → decrescente → non ordinato:
il terzo clic riporta la tabella all'ordine del dato. Senza, una volta ordinata
una colonna non si tornerebbe più a com'era **senza ricaricare**, e ricaricare
durante la demo è la cosa che azzera il provider (§10).

**Su cosa si ordina, e la regola sta in tre righe.** Si ordina per il valore che
la riga **mostra**, con `localeCompare` nel locale attivo: due lingue ordinano
diversamente le stesse righe, ed è giusto — si ordina ciò che si legge. Fanno
eccezione le enumerazioni **che hanno una scala del dominio**, e sono ~~due~~
**tre**: i tre piani, che si ordinano sul **prezzo** — in tedesco e in inglese
l'alfabetico direbbe che l'Executive è il primo dei tre — il check-up
dell'elenco HR, che è un **percorso** (disponibile, prenotato, fatto), e lo
**stato di una seduta** in `/admin/sessioni`, aggiunto il 19.08.2026 dalla voce
qui sotto.

~~**Due colonne non si ordinano, e sono due ragioni diverse.**~~ → **una sola**,
il **professionista**, perché nella demo porta lo stesso valore su tutte le
righe — un portale solo (`§7` del contratto) — e una freccia che non cambia
niente è un comando che non comanda.

**Lo stato si ordina, e la ragione per cui non lo faceva stava in due metà di
cui una sola reggeva** (19.08.2026, dalla passata che ha aggiunto la colonna). La metà vera —
l'alfabetico sulla parola tradotta darebbe un ordine diverso in ognuna delle
quattro lingue — **vale se si ordina l'etichetta**, ed è precisamente ciò che
una mappa di rango evita: questa passata ne aveva già scritte due, `CHECKUP_RANK`
e `PLAN_RANK`, e la conclusione le contraddiceva senza accorgersene. La metà
falsa era l'altra: *"i tre valori non stanno su una linea"*, mentre **l'ordine
esisteva già nel prodotto** — è quello delle tre schede di
`/professional/sessioni`, che il portale mostra da M2, e `STATUS_RANK` lo cita
invece di sceglierne uno. Due ordini per la stessa enumerazione sarebbero state
due rese dello stesso fatto che possono divergere (`CLAUDE.md` §5.5).

**Resta vera la regola che quella voce enunciava** — *se un ordine difendibile
non c'è, la colonna non si ordina* — e a cadere è l'esempio che portava: era il
caso in cui l'ordine c'era, a due schermate di distanza. Il §11 chiama codice
che nessuno può verificare quello che non ha un criterio; qui il criterio c'era
già, e a mancare era la rilettura.

**I vuoti stanno in fondo in tutte e due le direzioni**: un valore che non c'è
non è né grande né piccolo, quindi non ha un posto nella scala. Si vede sulla
colonna del compenso di `/admin/sessioni`, dove le sedute non erogate portano il
trattino, e sui dipendenti non dichiarati delle richieste demo.

**La chiave secondaria è dichiarata tabella per tabella e resta crescente in
tutte e due le direzioni**: due righe con lo stesso valore hanno un ordine loro
invece di dipendere da quello in cui sono arrivate, e **non si scambiano di
posto a ogni clic**. Si vede sul portafoglio: ordinando per piano al contrario,
i due Plus restano Demo SA e poi Genziana Tech.

**Due tabelle ordinano per iniziali**, `/hr/dipendenti` e `/admin/sessioni`,
perché lì un nome non arriva — è la garanzia del §3 del contratto. Nella demo
tiene perché stesse iniziali vogliono dire stessa persona, che è un vincolo del
dataset con un guardrail dietro; **in produzione cade**, e il §8.8 lo dichiara
già: due omonimi finirebbero adiacenti senza essere la stessa persona. Non è
stato aggiunto niente al contratto.

**L'accessibilità sta dove ha significato**: `aria-sort` sul `<th>` — tutte e
sette usano `ui/table.tsx`, quindi sono tabelle vere — e il pulsante **dentro**
la cella, con l'etichetta visibile più una frase per i soli lettori di schermo.
Non è un `aria-label`: quello sostituirebbe l'etichetta della colonna, ed è lo
scarto fra chi legge e chi ascolta che `RapidCheckCard` evita dal 08.08.2026.

**La nota dell'estratto è stata rinforzata**, ed era il rischio vero
dell'ordinamento su `/hr/dipendenti`: chi ordina per stato vede in cima i non
iscritti **di otto righe** e può crederli tutti quelli dell'azienda. Ora dice su
quanti — *"un estratto di 8 dipendenti su 120: ordinarla ordina l'estratto"* — in
tutte e quattro le lingue.

##### Il difetto AA che aspettava, e il secondo che il censimento ha trovato

**L'etichetta "alert"** del marker sul trend stava a **3.95:1**: è il grigio
predefinito di recharts, `#808080`, a 11px, su un testo informativo — dice su
quale mese cade l'alert precoce. Ora ha un `fill` esplicito su
`muted-foreground`, **5.10:1**, che sta sopra la soglia e **resta sotto il
marker** nella gerarchia del grafico.

**Il censimento ne ha trovato un secondo, ed è la ragione per cui si fa.** Le
etichette della ciambella del mix piani in `/admin/analytics` restituivano una
stringa, quindi recharts le dipingeva **con il colore della fetta**: tre
etichette identiche a tre contrasti diversi — 5.10, **2.83** e 7.44 — e quella
sotto soglia era il Plus, cioè il teal. Corrette tutte e tre su `foreground`,
**15.17:1**, con posizione e ancoraggio lasciati a recharts.

**Quanti nodi sono stati percorsi**, che è il numero che distingue "non c'è
niente sotto soglia" da "non ho guardato" (`CLAUDE.md` §6.1): **88** nodi di
testo dentro gli `<svg>` della dashboard HR e **123** in `/admin/analytics`,
tutti e due a viewport reale. Dopo le correzioni: **zero** sotto soglia su
entrambe.

##### La cifra degli oggetti del §2.7 esce, e la ragione è una prova

`common.sort` ha aggiunto **un oggetto** ai quattro dizionari, quindi i 112 del
`CLAUDE.md` §2.7 sono diventati 113. **Non è stata riportata a 113: è uscita.**

**È la prova che mancava alla passata del 19.08.2026**, che a tre cifre aveva
dato un criterio e ne aveva tolte due — il conto delle passate e i componenti
shadcn inutilizzati — tenendo solo questa perché era «una prova sul metodo del
conteggio». **Le due tolte non sono invecchiate; l'unica tenuta sì, in
quarantotto ore.** Un criterio accanto a una cifra rende il conto *rifacibile*;
non lo rende *rifatto*, e a rifarlo deve tornare qualcuno.

Restano nel §2.7 il criterio — *gli oggetti sono le proprietà il cui valore è un
oggetto*, e i letterali dell'albero sono uno in più perché c'è la radice — e i
due invarianti che non dipendono dal contenuto: **zero proprietà di altro tipo**
e **i quattro dizionari identici fra loro**. Sono quelli a dire che l'albero non
lascia fuori niente.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

- **le sette tabelle ordinano**, e il giro completo è stato fatto su ognuna:
  crescente, decrescente, e il terzo clic che riporta all'ordine del dato —
  provato alla lettera sull'elenco HR e sulle richieste demo;
- **`/admin/sessioni`**: 82 righe, data crescente e decrescente, compenso
  crescente con i **trattini in fondo** e le sedute a pari importo tenute
  insieme dalla data; **"Professionista" non ha pulsante**. *(Diceva «e
  "Stato"»: corretto il 19.08.2026 con la colonna, e le sue verifiche sono
  nell'elenco qui sotto.)*
- **lo stato di `/admin/sessioni`** (19.08.2026): crescente `In programma 18 →
  Erogata 63 → Annullata 1`, decrescente che specchia i tre gruppi, terzo clic
  che riporta all'ordine del dato — dove l'annullata sta **in mezzo**, fra le
  erogate, perché quello è l'ordine dell'agenda. Dentro ogni gruppo la data
  resta crescente in tutte e due le direzioni, che è la chiave secondaria di
  questa tabella;
- **lo stesso in tedesco, e non si è mossa una riga**: le 82 righe escono nella
  **stessa identica sequenza** che in italiano — confrontate iniziali e data una
  per una — mentre l'alfabetico avrebbe messo `Abgesagt` in cima. È la prova
  diretta dell'obiezione da cui la colonna era stata esclusa;
- **una seduta annullata dal portale professionista si sposta di gruppo**:
  disdetta L.B. del 24.09 alle 17:30 dal calendario, la KPI "in programma" del
  back-office passa da 18 a 17 e la riga arriva in fondo con le annullate, che
  diventano due, senza compenso. Le tre KPI e i tre gruppi continuano a sommare
  a 82;
- **il portafoglio**: piano crescente `Essenziale ×2 → Plus ×2 → Executive`,
  cioè il prezzo e non l'alfabeto, e al contrario i due Plus restano nello
  stesso ordine fra loro;
- **`/admin/utenti`**: la ricerca filtra e l'ordinamento ordina quello che
  resta — cercando "demo" restano due righe e si ordinano;
- **le richieste demo**: due richieste inviate dal form durante il giro, e la
  tabella le ordina; il terzo clic riporta la più recente in cima;
- **da tastiera**: `Tab` porta il fuoco sui pulsanti d'intestazione, che
  rispondono a `:focus-visible` con l'anello `primary` — `outline: auto
  rgb(17,57,90)`, **11.95:1**;
- **le quattro lingue** sull'elenco HR: intestazioni tradotte, la frase per i
  lettori di schermo in ognuna, **zero overflow orizzontale**, `<html lang>`
  corretto;
- **`/hr` e `/hr/dipendenti` in fila, che è il modo in cui il difetto si
  vedeva**, e in tutte e quattro le lingue: la KPI dice *"Dipendenti attivi ·
  41 · almeno un servizio nel trimestre"* e l'elenco dice *"Iscritto / Non
  iscritto"* sotto un sottotitolo che dice *"82 iscritti su 120"* — e lo stesso
  in tedesco, francese e inglese, con la coppia presa dalla riga del
  sottotitolo;
- **26 rotte percorse con la sola navigazione interna**, zero overflow
  orizzontale, **zero errori, zero promise rifiutate e `console.error` mai
  chiamato**;
- **i numeri del pitch fermi**: CHF 14'200, 16 giorni, 68%, 82 iscritti su 120,
  41 attivi, 142 di 1'200, 62%, soglia 12, −2 punti; CHF 1'120 e CHF 5'040 nei
  compensi; CHF 652'968, 415 e 798 nel back-office;
- `lint`, `typecheck`, `build` e `build:demo` a posto; guardrail **111 = 102 +
  9**, invariati; **780 chiavi** ×4, e a dirlo è `EXPECTED_KEYS`.

##### Due cose sullo strumento, e sono due vecchie conoscenze

**La prima scheda è andata cieca a metà sessione** — `innerWidth` a **0** —
mentre censiva gli `<svg>` della dashboard: il conto dava 13 nodi di testo dove
la scheda buona ne trova 88. Tutto rifatto su scheda nuova, ed è la quarta volta
in cinque giorni che questo file la registra.

**Il DOM letto nello stesso tick del clic non è ancora cambiato**: la prima
prova sull'ordinamento diceva che le righe non si muovevano e che `aria-sort`
restava a `none`. Con 120 ms di attesa fra il clic e la lettura, tutto al suo
posto. È la stessa trappola di M5.b, e va detto che **si ripresenta identica**
alla prima verifica scritta di fretta.

**L'attivazione da tastiera resta sulla parola dello standard**, come per il
pulsante del referto del 16.08.2026: `Tab` muove il fuoco davvero e l'anello si
vede, ma `Invio` e `Spazio` sintetici non producono l'attivazione nativa, quindi
ciò che è misurato è che l'intestazione è un `<button>` focalizzabile con il suo
anello — non il tasto che la ordina.

##### Trovato e non toccato

- ~~**C'è un settimo punto che aspetta, e il piano non lo elencava**: il badge
  "In attesa" dell'elenco dipendenti dell'HR.~~ → **chiuso dalla review, e non
  come gli altri sei**: non era un'attesa ed è stato **rinominato**, perché a
  essere sbagliata era la parola. La voce sta qui sopra.
- **Il dialogo di annullamento promette ancora che l'ora "torna prenotabile"**,
  mentre i documenti hanno separato l'invariante dalla policy il 18.08.2026.
  Sono quattro stringhe e la frase giusta dipende da una policy non decisa: è la
  stessa voce lasciata aperta dalla passata precedente.
- ~~**Il 73 di `AVERAGE_HEALTH_SCORE` non è ancora nel `CLAUDE.md` §8**, aperto
  dal 16.08.2026.~~ → **chiuso il 19.08.2026** (verbale «La demo pronta»).
- **Nessun componente nuovo è uscito dal magazzino di `ui/`**: `SortableTable`
  importa `table.tsx`, che sette schermate importavano già. La riga del §3 sul
  magazzino non si è mossa.
- **Le tabelle non si filtrano**, e non è un residuo: filtrare è un'altra cosa
  da ordinare, e l'unica ricerca del prodotto — quella degli utenti — esisteva
  già. Su otto righe un filtro non serve a nessuno, e su 82 la domanda vera è la
  paginazione, che è lavoro dell'MVP (`docs/CONTRATTO-DATI.md` §8.12).
- **L'ordinamento non sopravvive alla navigazione**, ed è voluto: vive nello
  stato del componente, quindi uscire dalla schermata e tornarci riporta
  l'ordine del dato. Ricordarlo sarebbe stato uno stato in più da tenere
  allineato, per un gesto che durante la demo si rifà in un clic.

#### Le rotte in inglese (19.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Un commit per area**, più quello che scrive la regola e
quello che aggiorna i documenti: un errore si isola aprendo un commit solo.
**Nessun numero del §8 e del §9 si muove**, le rotte restano **26** e le
schermate **27**, `EXPECTED_KEYS` resta **780** e i guardrail **111 = 102 + 9**.

**Quindici indirizzi su ventisei passano in inglese**, con la mappa approvata dai
founder (`CLAUDE.md` §10). Le cinque aree non si toccano, `/professional`
compreso — è la stessa parola nelle due lingue — e **tre righe della mappa sono
decisioni e non traduzioni**: `/plans` allinea l'indirizzo all'entità del dominio,
`/employee/doctor` accorcia un termine che il prodotto scrive per intero,
`/admin/providers` pluralizza. Stanno scritte nel §10 con la loro ragione, perché
sembrano sviste e non lo sono.

##### La regola è stata scritta prima di toccare il codice

È il vincolo che valeva più del codice, ed è il primo commit del branch: **i
verbali citano gli indirizzi del giorno in cui furono scritti**, la mappa
corrente sta nel `CLAUDE.md` §10, e chi trova un indirizzo che non risolve ha
trovato un verbale, non un difetto. Senza quella riga questa passata lasciava
dietro di sé decine di righe che sembrano rotte — la gran parte in questo file —
e la prima sessione che le rilegge apre altrettante segnalazioni.

**Ma dentro questo file non è tutto verbale**, ed è la metà che è stata
aggiornata: **16 righe vive**, tutte nell'inventario delle schermate di M5.b, che
non è un resoconto datato ma la tabella che dice **cosa rende ogni schermata nei
tre casi** — chi la legge oggi la usa per sapere dove guardare. Restano com'erano
le 38 citazioni che stanno dentro verbali datati, comprese quelle della sezione
delle decisioni chiuse, che sono resoconti con la loro data in testa. Il criterio
applicato riga per riga è quello del 19.08.2026: *un verbale è un resoconto
datato, un criterio è rivolto a chi verrà*, e in caso di dubbio è un verbale.

**Gli altri quattro documenti descrivono il presente e si aggiornano**:
`CLAUDE.md`, `docs/PITCH.md`, `docs/CONTRATTO-DATI.md` e il `README.md` — che
però non nominava nessun indirizzo, quindi non è stato toccato.

##### Il codice, e i punti che si dimenticano

**I dizionari non contengono nessuna rotta**, ricontrollato prima di cominciare:
zero letterali di indirizzo nei valori dei quattro file di `i18n/`. **Le quattro
lingue non sono state toccate** e `EXPECTED_KEYS` non si muove. Le uniche
occorrenze dentro `it.ts` erano **due commenti** che nominavano `/pricing`, e
sono andate con l'indirizzo.

**Le sottorotte sono dichiarate relative in `App.tsx`**, quindi ogni area è una
manciata di letterali; a costare non è il codice ma i documenti. Fuori dai nav i
punti che un giro dei soli menu salterebbe erano sei — landing, card dei piani,
calcolatore ROI, richiesta demo, footer e `RequireRole` — e sono stati percorsi
tutti.

**`RequireRole` non è stato toccato, ed è il punto che meritava il controllo**:
costruisce un indirizzo invece di scriverlo in un `<Link>`, ma quello che
costruisce è la **radice del portale** — `/employee`, `/hr`, `/professional`,
`/admin` — cioè le quattro che la mappa lascia dove sono. Era un rischio vero e
si è risolto in una lettura.

**I nomi dei file non cambiano**, ed è una decisione scritta nel `CLAUDE.md` §3:
`Psicologi.tsx` e `HRDipendenti.tsx` restano come sono. Le rotte sono la
superficie del prodotto, i nomi dei file sono interni, e rinominarli avrebbe
raddoppiato il diff di una passata il cui unico valore è essere verificabile.

##### Verificato a schermo, viewport 1280×900

- **le 26 rotte percorse con i soli link interni**, area per area, più la **404**
  che è la ventisettesima schermata e l'unica che chiede la barra degli
  indirizzi: `/admin/utenti` risponde *"L'indirizzo /admin/utenti non corrisponde
  a nessuna pagina"*, che è insieme la prova che la 404 regge e che il vecchio
  indirizzo è davvero morto;
- **i sei punti fuori dai nav**: la landing porta `/plans`, `/roi`, `/demo` e i
  quattro portali; le card dei piani e il calcolatore rimandano a `/plans` e
  `/demo`; il footer alle cinque aree; la richiesta demo torna alla home;
- **il giro del marketplace, intero**: prenotato lo slot di **venerdì 25.09 alle
  10:00** dal portale dipendente, comparso nel calendario della professionista —
  sedute della settimana da 5 a 6, agenda del mese da 21 a 22 — annullato dalla
  lista sessioni — in programma da 19 a 18, annullate da 1 a 2 — e visto dal
  dipendente, che legge *"Annullato"* e *"Dr.ssa Meier ha annullato questo
  appuntamento"*. Attraversa cinque delle rotte rinominate;
- **i numeri del pitch fermi**: CHF 14'200 e 16 giorni, 68% e 82 su 120, 41
  attivi, 142 di 1'200, 62%, soglia 12, −2 punti; i cinque del calcolatore a
  N=100 — 1'289'500, 221'150, 66'000, 155'150 e **2.35:1**; CHF 1'120 e 5'040 nei
  compensi; 652'968, 415 e 798 nel back-office;
- **`npm run build` e `npm run build:demo` passano**, e la seconda è stata
  **servita e percorsa con la console aperta**: landing → `/plans` → `/admin` →
  `/admin/sessions` con le sue 82 righe, **zero log**, che è il caso in cui i
  guardrail parlerebbero;
- `typecheck` e `lint` a zero;
- **la spazzata dei residui**: sotto `src/` non resta **nessun** letterale di
  indirizzo in italiano.

##### Trovato e non toccato

- **il parametro di query della pagina psicologi è ancora `?servizio=coach`**, ed
  è l'unico pezzo di indirizzo rimasto in italiano — `SERVICE_PARAM` in
  `Psicologi.tsx`. **Non è nella mappa approvata**, quindi non è stato rinominato:
  è la stessa disciplina per cui le rotte le decidono i founder. Il giorno in cui
  lo si vuole inglese sono due letterali e una riga di questo elenco;
- **in sviluppo il guardrail della cache fredda ha parlato cinque volte**, su
  chiavi del back-office che `prefetchDemo` scalda davvero —
  `platform.clients`, `.users`, `.months`, `.demo-requests` e
  `professional.platform-sessions`. **Non viene da questa passata**: la rinomina
  non tocca il layer dati, le cinque chiavi sono in elenco, e la build demo
  percorsa con la console aperta non ha loggato niente. **La causa non è
  stabilita** e non è stata indagata oltre: l'ipotesi da provare per prima è il
  `gcTime` predefinito di react-query, che dopo cinque minuti scarta una query
  precaricata e mai osservata — se è quella, un giro che arriva in `/admin` a
  sessione avanzata la trova fredda, che è il caso normale di una presentazione
  di trenta minuti. Serve una misura fatta apposta, e non è lavoro da aprire
  qui;
- ~~**il dialogo di annullamento promette ancora che l'ora "torna
  prenotabile"**, e il **73** di `AVERAGE_HEALTH_SCORE` non è ancora nel
  `CLAUDE.md` §8: sono le due voci che le due passate precedenti lasciano
  aperte.~~ → **chiuse tutte e due il 19.08.2026** (verbale «La demo pronta»).

#### La demo pronta (19.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. La passata non costruisce niente: **toglie una promessa,
sistema una manopola, mette a verbale una cifra**. A schermo cambia **una frase
sola**; le rotte restano **26**, le schermate **27**, `EXPECTED_KEYS` resta
**780** ×4 — nessuna chiave nuova, si riscrive un valore — e i guardrail **111 =
102 + 9**. `typecheck` e `lint` a zero.

**Il 73 entra nel `CLAUDE.md` §8, ed è l'unico numero che si muove**, per la
decisione dei founder del 19.08.2026 (punto 4 qui sotto).

##### La cache scaldata veniva buttata dopo cinque minuti

`staleTime` e `gcTime` **non sono la stessa manopola**, e il commento di
`lib/query-client.ts` le confondeva — diceva che *"`staleTime: Infinity` completa
la stessa idea: la cache viene scaldata prima del primo paint"*, che è la ragione
per cui nessuno se n'era accorto:

- **`staleTime`** decide quando un dato va **rifatto**;
- **`gcTime`** decide quando una query **senza osservatori** viene **buttata**.

Le query che `data/prefetch.ts` scalda e che nessuno monta non hanno osservatori:
con il default di cinque minuti sparivano dalla cache, e chi arrivava in `/admin`
a fine giro le trovava fredde. **Il guardrail aveva ragione**: ha segnalato una
cache fredda vera, e a essere sbagliata era la configurazione. Il rimedio è
`gcTime: Infinity`, e la ragione stava già tutta nel progetto — il provider vive
in memoria per la sessione, il dataset non cambia, e la cache è riempita prima
del primo paint per costruzione: non c'è niente da raccogliere, e raccoglierlo
fabbrica la condizione che il guardrail esiste per vietare.

**È la seconda volta che quel file confonde due comportamenti di react-query** —
la prima fu `retry: 1`, tolto in M5.b — e tutte e due le volte il difetto si
vedeva solo in un caso che nessuno esercitava: un fallimento allora, cinque
minuti di attesa adesso. Il commento ora dice che sono due manopole e quale fa
cosa, e `docs/CONTRATTO-DATI.md` §5 annota la scelta accanto al tentativo
automatico, per chi scriverà il backend: con una rete vera una risposta tenuta
per sempre è un dato vecchio, non un risparmio.

**La verifica è stata fatta con l'attesa, ed è la parte che non si poteva
scorciare**, perché un controllo rapido passa sia prima sia dopo la correzione.
Due giri identici sulla **build demo**, ognuno in una scheda nuova — così la
console non porta la memoria del giro precedente — con la stessa strada:
`/admin` e le sue cinque sottopagine, solo link interni.

| | attesa senza toccare niente | log dei guardrail |
|---|---|---|
| **prima** della correzione | **8 minuti** | **7** |
| **dopo** la correzione | **7 minuti e 21 secondi** | **zero** |

Le sette chiavi fredde erano `["session"]` — quella che legge la guardia di ogni
portale — le quattro di piattaforma (`clients`, `demo-requests`, `users`,
`months`), `["professional","meier","platform-sessions"]` e
`["checkup","providers"]`. **Tre parlavano già entrando in `/admin`**, cioè prima
di qualunque sottopagina.

##### L'ultimo frammento d'indirizzo in italiano

`SERVICE_PARAM` passa da `servizio` a **`service`**: è quello che restava dopo la
rinomina delle rotte, e si vede nella barra accanto a `/employee/psychologists`.
**Sta nella mappa del §10 con le quindici rotte**, e non come dettaglio di
implementazione: è un indirizzo, quindi è una decisione dei founder come le
altre.

**Controllato che non ce ne siano altri**: gli unici altri parametri di query
sono le tre manopole di sviluppo — `?fail`, `?empty`, `?role` — che erano già
inglesi. Il capitolo si chiude qui.

##### Il dialogo di annullamento ha smesso di promettere

`professional.sessions.cancel.effect` diceva **"L'ora torna prenotabile e la
sessione non entra nei compensi."** La seconda metà è vera; la prima è la
promessa che i documenti hanno smesso di fare il 18.08.2026, quando hanno
separato l'invariante dalla policy: le disponibilità sono le fasce dichiarate
della professionista meno quelle occupate, quindi un'ora liberata che non è una
fascia dichiarata **non torna proponibile**, e a schermo si leggeva come un
annullamento che non libera niente.

Ora dice **"L'ora non è più occupata e la sessione non entra nei compensi."** —
l'invariante e nient'altro. **La policy non è decisa e non è stata decisa qui**:
il silenzio su cosa succeda alla fascia è la parte corretta. Una chiave, quattro
dizionari, `EXPECTED_KEYS` fermo. **È l'ultimo punto del prodotto che ancora
affermava ciò che i documenti avevano corretto**, e chiude una voce aperta da due
passate.

##### Il 73 entra nel §8

`AVERAGE_HEALTH_SCORE` stava in `mock/platform.ts` e non nel `CLAUDE.md` §8,
dichiarato aperto dal 16.08.2026: finché restava fuori era una cifra del dataset
che il §2.4 non copre. Trascritto dove vivono gli altri numeri di piattaforma —
798 coperti, 415 iscritti, il 52% di attivazione, i CHF 652'968 — **su decisione
dei founder del 19.08.2026**, e **dichiarato come valore dichiarato e non
derivato**, come le sedute di carriera del roster: dietro non c'è una seconda
sorgente, e chi legge il §8 non deve poterlo prendere per derivato. Le tre voci
di «trovato e non toccato» che lo portavano sono barrate con la data, dove
stanno.

##### Il giro del pitch, dall'inizio alla fine

Fatto sulla **build demo**, con la console aperta, viewport 1280×900, seguendo
`docs/PITCH.md`: **solo link interni e mai un ricaricamento**.

- **landing** con il clic su un pallino dell'anteprima, che ferma il carosello:
  il pannello HR dice CHF 14'200, 68%, −2 punti, 16 giorni;
- **dipendente**: check rapido toccato e registrato, prenotazione di **venerdì
  25.09 alle 10:00** con la Dr.ssa Meier, medico virtuale che risponde, check-up
  con il referto di marzo, piano di prevenzione, profilo;
- **HR**: dashboard con i sei KPI e i quattro grafici — **58 elementi disegnati
  dentro quattro `<svg>`**, quindi nessuna ciambella vuota — il selettore che
  cambia davvero i dati (2° trimestre: CHF 11'800, 13 giorni, 59%, 34 attivi, 86
  sessioni) e torna al corrente; elenco dipendenti, report, fatturazione,
  privacy;
- **professionista**: la seduta prenotata è nel calendario (settimana 5→6, mese
  21→22), la settimana successiva si raggiunge con la freccia e **le KPI non la
  seguono**, l'annullamento mostra **la frase nuova** e svuota la cella (6→5,
  22→21); sessioni, pazienti, pagamenti con CHF 1'120 e 5'040, profilo;
- **ritorno dal dipendente**: la seduta annullata resta in home con *"Annullato"*
  e *"Dr.ssa Meier ha annullato questo appuntamento"*;
- **`/roi`**: i cinque numeri di ancoraggio a N=100, e a N=300 tutto scala per
  tre mentre il rapporto resta **2.35:1**;
- **richiesta demo** compilata e inviata, con la conferma che non nomina
  l'azienda;
- **Admin per ultimo**: la richiesta è in tabella — *Prova Generale SA · Anna
  Keller · 23.09.2026* — e il resto del back-office è al suo posto, 73 compreso.

**Zero log dei guardrail sull'intero giro**, zero errori in console, zero
overflow orizzontale.

##### Trovato e non toccato

- **la tabella dello stress per reparto non segue il selettore di trimestre**, ed
  è fuori perimetro per la ragione scritta nel piano: chiuderlo richiede un metodo
  nuovo sul provider, quindi un cambio del contratto, che è una passata sua. Dalla
  riorganizzazione del 17.08 quel blocco sta fuori dalla cornice e dichiara il
  proprio periodo nel titolo — *"Stress per reparto · ultimo mese"* — quindi non
  si legge più come un errore;
- **il PDF del report non è stato scaricato in questo giro**: il pannello del
  browser blocca i download, quindi provarlo qui non direbbe niente. È lavoro di
  M4 e questa passata non lo tocca — resta da rifare a mano prima della
  presentazione, come dice `docs/PITCH.md`;
- **`Invio` nella chat del medico non è stato esercitato davvero**: il tasto
  sintetico non produce l'invio nativo, ed è la stessa nota già scritta per i
  pulsanti d'intestazione. Verificato invece che l'input **sta dentro un
  `<form>`**, cioè che un Invio vero lo invia.

#### Le cifre nelle parentetiche (20.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **Solo documenti**: `git diff --stat` contro
`master` tocca `CLAUDE.md` e questo file e **nessun file sotto `src/`**,
verificato con `git diff --name-only`. `typecheck` e `lint` escono a zero — non
potevano muoversi, e sono stati eseguiti perché è quella la prova che `src/` è
fermo. **Nessun numero del §8 e del §9 si muove**, le rotte restano **26** e le
schermate **27**, `EXPECTED_KEYS` resta **780** e i guardrail **111 = 102 + 9**.

**Cinque cifre di prosa che la passata del 19.08.2026 non ha raggiunto**, più
due cose trovate dentro righe che questa passata stava già modificando. Il
rimedio è sempre lo stesso e non è nuovo: **si toglie la cifra e si lascia il
criterio**, perché una cifra accanto a un criterio rende il conto *rifacibile* e
non lo rende *rifatto*.

##### Perché quelle cinque erano sopravvissute, ed è il rilievo che vale più delle correzioni

**Stavano in parentetiche, e una passata che cerca cifre invecchiate cerca
righe.** La spazzata del 19.08.2026 aveva davanti a sé la riga che elenca i modi
in cui una cifra sfugge — il criterio «numero + avverbio» e il numero denunciato
dalla lista accanto — e non l'ha applicata a sé stessa. Il terzo membro è
adesso scritto lì, ed è **il numero dentro una parentetica**.

**Con una clausola che la riga non aveva, e senza la quale sarebbe invecchiata
come le altre**: dice anche **cosa si cerca**, cioè le cifre e non gli avverbi.
Si passano in rassegna i numeri del testo, in lettere e in numeri, e per ognuno
si chiede se accanto ha il criterio che lo rifà. L'avverbio è un indizio, non la
ricerca.

##### Le progressioni di conteggio di questo file sono quattro, non tre

È il rilievo che la verifica ha prodotto e non ha una riga viva dove stare per
intero. Quattro oggetti diversi hanno avuto ognuno la propria serie di cifre
scritte e smentite:

| | oggetto | la serie | dove |
|---|---|---|---|
| **A** | le **passate**, contate dalla sezione refinement | 5 quando erano 8 · 11 quando erano 13 · 33 quando erano 36 | qui |
| **B** | le **passate**, contate dal paragrafo «Stato» | 11 mentre la sezione diceva 13 · 17 quando erano 20 | in testa al file |
| **C** | le **sottosezioni** | 7 quando erano già 13 | qui |
| **D** | i **commit di una passata** | tre cifre sbagliate in cinque giorni (15, 17 e 18.08.2026) | nei verbali |

**Due di loro si leggevano come una, ed è il difetto chiuso in questa passata.**
La riga che porta il «sette» di **C** aggiunge *«ed è lo stesso difetto della
testa di questo file due schermate più su»*, che rimanda a **B** — e le due
serie **finiscono sullo stesso 13**. Messe in fila senza dire cosa contano si
leggono come una progressione sola, mentre sono due oggetti diversi: le
sottosezioni e le passate. È lo stesso difetto come *famiglia* e due misure
diverse come *conteggio*, e adesso la mezza riga lo dice.

##### I tre insiemi della sezione refinement

Tre numeri vivevano sullo stesso oggetto e la sezione non diceva che sono tre:
le **PR mergiate** sotto il criterio in fondo alla sezione, le **passate** che
sono i nomi dell'elenco, e i **verbali scritti** che sono le sottosezioni.
La riga che diceva *«chi vuole la cifra la ottiene contando l'elenco — come si
contano le sottosezioni qui sotto»* asseriva **due** equivalenze, e sono false
tutte e due.

**Le ragioni della divergenza sono nominate una per una, non lasciate in
astratto**, e coprono ogni nome dell'elenco che una sottosezione non ce l'ha:

- **fra PR e passate**: una passata può alimentare due PR —
  `feat-annullamento-visibile-e-settimane` è stato riaperto dopo il primo merge,
  #65 e #66 escono dallo stesso branch, e nell'elenco sono un nome solo;
- **fra passate e verbali**, tre casi: le più vecchie sono **nominate
  collettivamente** e non una per una; una passata può essere **verbalizzata
  dentro la sottosezione di un'altra** (#69 dentro «Le attese e l'ordinamento»,
  che glielo attribuisce per data); e una passata può **non avere un verbale da
  nessuna parte** — #47, l'allineamento del `README.md`, che di questo file ha
  cambiato la sola riga con cui si è aggiunta all'elenco. La terza è l'unica che
  descrive qualcosa che **manca** invece di qualcosa che sta altrove.

**Nessuna delle tre cifre è stata scritta**, ed è la dottrina del 19.08.2026
applicata al caso che l'ha prodotta. **Il criterio in fondo non è stato
riscritto**: conta PR e non passate perché le sue esclusioni sono tutte di forma
PR — *«una PR il cui solo contenuto è la sintesi di una passata già mergiata»*,
*«tocca solo `docs/PITCH.md`»* — quindi un criterio che contasse passate
dovrebbe rifondarle una per una. La riga nuova rimanda invece di duplicarlo: un
secondo criterio è la stessa cosa di un secondo elenco.

##### Le due cifre del `CLAUDE.md`, e perché nessuna delle due era sbagliata

**§3, i componenti tenuti.** Il paragrafo nominava i due insiemi — nessun
importatore fuori da `ui/`, e nessun importatore affatto — e taceva il **secondo
asse del criterio**: se il codice morto valga come importatore. Il caso è uno
solo, `checkbox`, importato soltanto da `FlexiblePlanCard.jsx`, che a sua volta
non lo importa nessuno perché il piano "Personalizzato" è in sospeso (§10.A.3),
e contarlo o no sposta di uno **entrambi** gli insiemi — che quindi si contano
in quattro modi.

**Le due cifre che stavano lì non erano né sbagliate né invecchiate**, ed è la
parte da non leggere come una correzione: erano la lettura che il codice morto
lo esclude, cioè una scelta legittima che il paragrafo non aveva dichiarato di
aver preso. Escono per due ragioni insieme — **dipendevano da un criterio
taciuto, e si muovono al primo import** — quindi tanto riportarle quanto
lasciarle sarebbe stata la stessa promessa di tornare a rileggerle che il
19.08.2026 aveva già sciolto su quel paragrafo. Il caso sta scritto accanto al
criterio perché **una regola senza la sua istanza manda il prossimo a cercarla**.

**§7, la parola vecchia.** La parentetica diceva che un `grep -c` conta **due**
occorrenze di "sedute" in `it.ts`, *«tutte e due nel commento che regola le
biografie»*. Sono tre, e la terza sta in un commento diverso: `68a4720`, il
salto a data del calendario, l'ha portata **il 18.08.2026**, cioè il giorno
stesso in cui quella frase è stata scritta. **La regola non è mai stata
violata** — il criterio conta i valori, e nei valori non ce n'è nessuna, su
tutti e quattro i dizionari — quindi a uscire è la sola fotografia: riportarla a
tre l'avrebbe fatta invecchiare alla prima passata che tocca un commento.

##### Le due parentesi mancanti di questo file

**«Punto di partenza» correggeva una cifra su due.** Diceva *«47 componenti
shadcn (**oggi sono 45**: …)»* e *«25 rotte»* nuda, mentre oggi sono **26** — e
lo dice questo stesso file quindici righe più sotto. È un verbale, quindi le
cifre originali restano e si aggiunge la parentesi mancante, nella forma che
quella accanto usava già.

**M5.b si intitola «due manopole» e le manopole sono tre.** `?role` è arrivata
col blocco d), e il 18.08.2026 il fatto è stato corretto nel `CLAUDE.md` §4 e
nel `README.md` ma non qui, che è il punto più visibile del file
sull'argomento. È un verbale: titolo e corpo restano, la nota porta la data e
**rimanda al `CLAUDE.md` §4** invece di ripetere la spiegazione.

##### Un pronome senza soggetto, e la data è di un'altra passata

*«Quelle che hanno una sottosezione loro»* non aveva antecedente: la frase che
la precede finisce sul perimetro dell'MVP e sulle decisioni in sospeso, e
nessuno dei due ha una sottosezione qui. **Il soggetto sono le passate**, e a
dirlo è git — la stesura che quella clausola ha sostituito, in `6de0f4d`,
leggeva *«più le sette che hanno una sottosezione loro qui sotto»*.

**Si è staccato il 17.08.2026**, quando la passata che ha separato le due metà
ha riscritto la frase precedente; la clausola non è mai stata toccata. È un
difetto di quella passata e ha il suo commit, invece di sparire dentro quello
sui tre insiemi.

**Non è stata spostata**, benché stia dentro un paragrafo che parla d'altro: la
parentetica che la segue è il criterio della spazzata, e spostare la frase o
lascia la parentetica orfana o porta via un criterio dal punto in cui è nato.

##### Verificato

- **`git diff --name-only` contro `master`: nessun file sotto `src/`**, e i due
  soli file toccati sono `CLAUDE.md` e `docs/PROGRESS.md`;
- `typecheck` e `lint` a **zero**, eseguiti per provare quel «nessun file» e non
  perché qualcosa potesse muoversi;
- **gli invarianti rimisurati alla cifra**: guardrail **102 + 9 = 111** col
  criterio del `CLAUDE.md` §5.6, `EXPECTED_KEYS` **780** e i quattro dizionari a
  780 chiavi foglia sull'albero di TypeScript, rotte **26** in `App.tsx`, col
  criterio per intero perché nessuno dei tre passaggi si indovina: gli elementi
  `<Route>` sono **31** — 27 con un `path=` più 4 `<Route index>` — meno il
  catch-all fanno le **30** rotte dichiarate, e meno i quattro `path` che
  avvolgono i portali, che sono i **layout** e non rotte, fanno **26**. Un
  `grep -o '<Route'` ne dà 33, perché pesca anche `<Routes>` e `<Router>`;
- **niente verifiche a schermo, e va detto perché**: non c'è niente di nuovo a
  schermo. È la stessa forma delle passate documentali del 15.08.2026 e del
  19.08.2026.

##### Come sono state misurate, perché le misure si rifanno

- **i due insiemi di `ui/`, sui due assi**: si scorrono i `from
  "@/components/ui/<nome>"` di `src/`, una volta escludendo
  `src/components/ui/` e una volta contando anche i pari, e ogni volta
  dichiarando se `FlexiblePlanCard.jsx` vale come importatore. Due insiemi per
  due scelte fanno **quattro conti**, e le quattro cifre sono tutte diverse;
- **le occorrenze di "sedute"**: `grep -c` sul file per il totale grezzo, e
  l'albero di TypeScript per quelle nei valori — `PropertyAssignment` con
  inizializzatore letterale stringa il cui testo contiene la parola;
- **i tre insiemi della sezione**: le PR con `git log --merges` filtrato sul
  criterio in fondo alla sezione, le passate contando i nomi dell'elenco, i
  verbali contando i `####` fra l'intestazione della sezione e quella
  successiva;
- **il branch riaperto**: `git log --merges` mostra
  `feat-annullamento-visibile-e-settimane` **due volte**, ed è l'unico branch
  della storia che compaia più di una volta;
- **il soggetto perduto**: `git log -L` sulla riga, che risale alla stesura
  precedente.

##### Trovato e non toccato

- **le quindici esclusioni del criterio sono state riverificate sui file
  toccati**, non sulla prosa, e tornano tutte: #19 è M4, #25 e #35 toccano solo
  `docs/PROGRESS.md`, #27 e #42 solo `docs/PITCH.md`, #29–#33 e #36–#38, #40 e
  #41 sono M5. Non è un difetto, è la misura che regge la riga nuova;
- **`FlexiblePlanCard.jsx` è l'unico codice morto vero fuori da `ui/`**:
  controllati anche i tre `*Nav` che un conteggio ingenuo dà per orfani, e sono
  importati per percorso relativo dai rispettivi layout. Serve a chi rifarà la
  misura dei due insiemi;
- **`.git/index.lock` era rimasto da una sessione precedente**, vuoto e senza
  nessun processo git a tenerlo, e ha fatto fallire il primo commit. Rimosso.
  Non è un fatto del repository ma della macchina, ed è annotato perché la
  prossima sessione che lo incontra non lo legga come un difetto del lavoro.

#### I rimandi del contratto (20.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **È la seconda passata documentale della
giornata**, dopo «Le cifre nelle parentetiche», e tocca un file solo:
`docs/CONTRATTO-DATI.md`. `git diff --name-only` contro `master` non tocca
**nessun file sotto `src/`**; `typecheck` e `lint` a zero, eseguiti perché sono
quella prova. **Nessun numero del §8 e del §9 si muove**, le rotte restano
**26** e le schermate **27**, `EXPECTED_KEYS` **780**, i guardrail **111 = 102 +
9**.

**Nessun invariante, nessuna KPI, nessuna forma di tipo è cambiata.** Tre
riparazioni sono rimandi e conteggi, una è formattazione con effetto sul senso.

**Perché su questo documento pesa di più.** Il contratto **nasce nel repository
del backend** (`CLAUDE.md` §3, §5.7), dove `CLAUDE.md` potrebbe non esserci: un
rimando rotto lì non ha un secondo posto in cui essere verificato.

##### Il preambolo contava le sezioni, e il §8 gliele ha fatte crescere sotto

La convenzione dei rimandi dichiarava che un `§N` nudo è una sezione di questo
documento, *«che ne ha otto e nessuna sottosezione numerata»*. Le sottosezioni
numerate sono **dodici**, `8.1`–`8.12`, e il documento stesso ci rimanda.

**È invecchiata con la sezione che ha reso viva quella regola**: il §8 è nato
con sette gruppi il 15.08.2026, è passato a dieci lo stesso giorno e a dodici il
17.08. **Il conteggio esce invece di andare a dodici** — invecchierebbe alla
prossima voce del perimetro — e la riga dice il vero senza cifre: un `§N` nudo è
una sezione **o una sua sottosezione**, `§3` come `§8.5`.

##### L'elenco di ciò che manca al ciclo dell'appuntamento diceva quattro ed erano cinque

*«Manca ancora, e sono quattro cose distinte»* seguito da cinque punti. **Il
quinto si autodenuncia**: è la notifica, arrivata il 18.08.2026, e scrive
*«Nessuna delle quattro voci qui sopra la copre»*.

**Il numero esce, non va a cinque.** È la famiglia del `CLAUDE.md` §5.6 e §2.7,
e l'elenco crescerà ancora — §8.5 è il gruppo con più decisioni aperte del
documento. Quello che l'intestazione portava è che le voci sono **distinte**, e
sopravvive senza contarle.

**La frase dentro il quinto punto non è stata toccata**: le quattro voci di cui
parla sono quelle sopra di lei, ed è corretta.

##### Un rimando che mandava dove la regola non è, e dove non dovrà mai essere

*«il riepilogo mensile del portale professionista — che si consolida al quinto
del mese dopo (§3, compensi)»*. Il §3 *Compensi* non contiene quel fatto: parla
di sedute erogate, di `FullCapacityReference` e dell'invariante fra i tre
metodi.

**La regola però esiste, e sta nel posto sbagliato.** È nel docblock di
`payoutHistory`, in `src/lib/data/mock/professional-portal.ts` — *«Kora paga
entro il 5 del mese successivo, quindi il mese in corso è sempre in attesa e i
precedenti sono pagati»* — ed è implementata: `paidOn` è il giorno 5 del mese
seguente e il mese corrente è `pending`.

**Il rimando è stato tolto e la regola non è stata aggiunta al §3**, ed è una
decisione con tre ragioni. La prima: il §3 dice cosa il contratto **garantisce**,
e il consolidamento non è fra le garanzie — nessun metodo e nessun invariante ci
poggia sopra. La seconda, che è quella che decide: scriverlo lì **ratificherebbe
il 5** come regola di dominio, e quella cifra non è in `CLAUDE.md` §8 né §9,
quindi per il §2.4 è una decisione dei founder e non di una passata documentale
— è la stessa forma di `AVERAGE_HEALTH_SCORE`, rimasto aperto dal 16 al
19.08.2026. La terza: §8.5 è dove vivono le cose non decise, e lì la frase è già
formulata come domanda aperta.

##### Il blockquote del riquadro 16.08.2026 si interrompeva a metà frase

La riga perdeva il prefisso `>` dopo *«…per un'altra strada. I valori»*, quindi
*«I valori delle misure sono stringhe»* risultava spezzata fra dentro e fuori la
citazione e si leggeva come continuazione della frase su `assessmentCompleted` —
che parla di `PlatformUser`, mentre questa parla di `CheckupReport`.

**Formattazione, contenuto invariato**, e git dice che la frase è più vecchia
del riquadro: è un paragrafo a sé di `e306bff` (07.08.2026), e il riquadro
inserito il 16.08.2026 le ha inghiottito le prime due parole. È tornata fuori,
dove appartiene.

##### Aperto e dichiarato — `Payout` ha due campi e nessuna regola

**È il rilievo più azionabile della passata, e non è stato aperto qui su
decisione dei founder** (20.08.2026). Va scritto per intero perché chi aprirà
quella passata non debba rifare la scoperta:

- **i due campi sono nel contratto**: `Payout.status` (`"paid" | "pending"`) e
  `Payout.paidOn` (`Date | null`, commentato *«quando è stato pagato; `null`
  finché è in attesa»*) stanno in `src/lib/data/types.ts`, cioè fra le entità
  che il backend erediterà;
- **la regola che li decide sta in `mock/`**: il docblock e il corpo di
  `payoutHistory`, in `src/lib/data/mock/professional-portal.ts`;
- **e `mock/` si cancella** il giorno del passaggio (`CLAUDE.md` §5.7). Chi
  scrive il backend eredita due campi e nessuna regola: niente dice quando
  `status` passa da `pending` a `paid`, né da cosa si calcola `paidOn`;
- **il 5 non è ratificato**: non compare in `CLAUDE.md` §8 né §9, quindi non è
  una cifra ammessa dal §2.4.

**Perché non si apre un gruppo di §8 adesso**, e sono tre ragioni di perimetro,
non di merito: aprire un gruppo è una decisione su *quale* posto occupa —
il §8 dichiara che «l'ordine dei gruppi è quello in cui vanno affrontati»,
quindi un gruppo nuovo va collocato e non appeso in fondo; richiede di decidere
**cosa** il gruppo chiede, che non è una riga — solo la cadenza del pagamento, o
tutto il lato uscite, con documento, contestazione di una seduta e ritenute; e
va decisa **insieme al §8.4**, il co-payment, che è l'altra metà dello stesso
buco. **Il contratto non sa registrare né il denaro che entra oltre il cap né
quello che esce verso chi cura**, ed è la frase che tiene insieme i due gruppi.

##### Aperto e dichiarato — la convenzione del 17.08.2026 è stata adottata e mai estesa

Il 17.08.2026 un'inserzione di tre gruppi in mezzo al §8 ha rinumerato quelli
dopo, e i rimandi alla paginazione sono passati a **nominare il gruppo invece
del numero** — «§8, gruppo Paginazione» — con l'eccezione dichiarata di `§8.1`,
che non si sposta perché è primo per una ragione dichiarata. È la disciplina di
*si cita ciò che non si muove* applicata a un rimando.

**Non è stata estesa, e la misura sull'intero documento è questa**: dentro
`docs/CONTRATTO-DATI.md` ci sono **11 righe** con un rimando numerico a una
sottosezione di §8, per **12 occorrenze** — una riga ne porta due — su **cinque
gruppi diversi**: §8.2, §8.5, §8.6, §8.8 e §8.9. Più **una** in `CLAUDE.md`
§10.D.3.

**E i tre rimandi per nome di gruppo stanno tutti in `docs/PROGRESS.md`**:
dentro il contratto la convenzione non è applicata nemmeno una volta.

**Contata sul solo §8.5 sembrerebbe una svista** — sono quattro righe — **e su
cinque gruppi è quello che è**: una convenzione adottata e non estesa, che
invecchierà tutta insieme alla prossima inserzione nel perimetro. **La
conversione è una passata sua**, perché tocca anche `CLAUDE.md` ed è una scelta
di forma: «§8, gruppo Ciclo dell'appuntamento» è più lungo di «§8.5».

##### Verificato

- **`git diff --name-only` contro `master`: nessun file sotto `src/`**, e i due
  soli file toccati sono `docs/CONTRATTO-DATI.md` e questo;
- `typecheck` e `lint` a **zero**;
- **niente verifiche a schermo**: non c'è niente di nuovo a schermo. Stessa
  forma delle altre passate documentali.

##### Come sono state misurate

- **le sottosezioni del §8**: `grep -n '^### 8\.'` sul documento;
- **i rimandi numerici**: `grep -nE '§8\.[0-9]+'` escluse le intestazioni, per
  le righe, e `grep -oE` per le occorrenze — i due numeri differiscono di uno ed
  è la riga che ne porta due;
- **dove vive la regola del quinto del mese**: cercata in `CLAUDE.md`,
  `docs/`, `README.md` e `src/`, e trovata in un punto solo;
- **l'età della frase sulle stringhe**: `git log -L` sulla riga.

##### Trovato e non toccato

- **il §7 dichiara già la doppia sorgente dell'elenco dipendenti**, e una riga
  in più sarebbe stata il secondo elenco che questo documento vieta in apertura.
  La riga è *«l'intestazione conta l'azienda e non la tabella: in produzione
  `getEmployeeDirectory` prenderà una pagina e un filtro»*, e dice il fatto per
  intero. **Il `CLAUDE.md` §5.5 non è in tensione**: 8 righe mostrate e 82
  persone iscritte non descrivono la stessa cosa, quindi non c'è nessun
  invariante da salvare. Registrato perché la domanda si ripresenterà;
- **`.git/index.lock` si riforma fra un commit e l'altro**, e non è un fatto
  della macchina: lo creano i controlli in sola lettura del founder attraverso
  il bridge del desktop. Si rimuove prima di committare.

#### I fatti del Business Plan (20.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **È la terza passata documentale della
giornata**, dopo «Le cifre nelle parentetiche» e «I rimandi del contratto».
`git diff --name-only` contro `master` non tocca **nessun file sotto `src/`**;
`typecheck` e `lint` a zero, eseguiti perché sono quella prova. **Nessun numero
del §8 e del §9 si muove**, le rotte restano **26** e le schermate **27**,
`EXPECTED_KEYS` **780**, i guardrail **111 = 102 + 9**.

**Si chiama così perché il riallineamento non è stato fatto qui.** Una revisione
ha letto i due PDF di `docs/` contro `CLAUDE.md` e `docs/PITCH.md`, e la passata
**registra** ciò che ne è uscito invece di eseguirlo: i quattro fatti sono
difetti **del Business Plan**, che vive fuori da questo repository.

##### La decisione che regge tutta la passata: §9 non guadagna niente

**Founder, 20.08.2026, ed è il vincolo principale.** §9 è l'elenco dei numeri
**che il prodotto può mostrare**; un numero sbagliato del BP **non diventa
ammissibile perché lo abbiamo trovato** — diventa una cosa da correggere alla
fonte. Da qui:

- **§9 resta com'è**, compresa la frase *«il 19.5:1 dell'executive summary è un
  terzo rapporto ancora (perdite totali / costo)»*. Il **CHF 220–440** della p.3
  non ci entra, **e non ci entra nemmeno come rimando**;
- **`docs/PITCH.md` non è stato toccato**, e non guadagna una risposta pronta sul
  quarto rapporto: scriverla porterebbe quel numero **in sala**, che è
  esattamente ciò che la decisione evita;
- **`roi-model.ts` non è stato toccato** e i cinque numeri di ancoraggio restano
  1'289'500 / 221'150 / 66'000 / 155'150 / **2,35:1**.

**La voce di «Decisioni in sospeso» è il loro unico posto**, ed è scritta
dicendolo, perché la prossima sessione che la legge non provi a «completare» il
lavoro trascrivendo le cifre.

##### I quattro fatti, verificati sul PDF e non sulla segnalazione

| | dove | cosa dice il BP |
|---|---|---|
| soglia di anonimato | **p.11**, parte A3 | *«soglia min. 15 dip per anonimato LPD»*, e **non dice su quale insieme** |
| check rapido | **p.7** | *«ogni dipendente risponde ogni mese a 3 domande rapide (30 secondi)»* |
| quarto rapporto | **p.3** | *«per ogni CHF 55 investiti per dipendente … CHF 220–440»*, cioè fra 4:1 e 8:1 |
| aritmetica delle perdite | **p.6** | *«4,3 abbandoni × CHF 50.000»* → **217.000** (il prodotto è 215.000); ricerca e sostituzione **45.000** contro i 47'000 del modello |

**I primi due sono l'unico caso in cui una regola scritta non è stata eseguita
fuori dal repository.** `CLAUDE.md` §10.B.1 dichiara che *dove i due divergono
vince questo file e il documento si aggiorna*, e `docs/PITCH.md` la richiama alla
lettera per la soglia: il documento non si è aggiornato, né sulla soglia né sul
check rapido.

**Il 220–440 è stato ricalcolato, non dedotto.** A N=100 il risparmio netto per
dipendente è **CHF 129 al mese**, il lordo **184**, le perdite **1'074**: contro
i 55 danno 2,35 · 3,35 · 19,5. **Nessuna delle tre dà 4:1–8:1.**

**Sul punto 4 il totale regge, ed è la parte che tiene il prodotto fuori dal
difetto**: 217 + 45 fa **262.000** da entrambe le parti, ed è il valore che la
p.7 usa due volte — nella card «Al turnover» e nella tabella del ROI
conservativo. I cinque numeri di ancoraggio non si muovono.

##### Il 19,5:1 ha due difetti distinti, e il repository ne conosceva uno

Il primo lo conosciamo: è **un rapporto diverso dagli altri due**, e `CLAUDE.md`
§9 lo dichiara *«perdite totali / costo»*.

Il secondo **il repository non lo sapeva**: la **p.6** etichetta quella riga
*«ROI potenziale (perdite evitate / costo KORA)»* mentre il calcolo è
`1.289.500 / 66.000`. *«Perdite evitate»* sarebbe il **risparmio**, CHF 221'150,
che su 66'000 dà **3,35:1**.

**Sta dentro il punto 3 e non accanto perché non è un quinto difetto: è il
meccanismo che rende pericoloso il quarto rapporto.** Un rapporto **definito**
diversamente si spiega in sala; un rapporto **etichettato** come risparmio
recuperato no — chi legge non sta valutando una definizione, sta leggendo nel
nostro documento che risparmia 19,5 volte quello che paga.

**La p.4 porta lo stesso numero nudo**, sotto la sola dicitura «ROI potenziale»,
senza formula: è la p.6 a etichettarlo, e la p.4 a metterlo in vetrina.

##### La risposta pronta di `PITCH.md` regge, ed è stata verificata prima di dirlo

Non è stata corretta perché **non ne aveva bisogno**, e la verifica era dovuta:
la risposta *«Perché il ROI è 2.35:1? Nel documento ho letto 19.5:1»* spiega
**l'aritmetica** e non il titolo della riga — *«il 19.5:1 … è perdite totali ÷
costo — cioè misura quanto è grande il problema, **non quanto ne
recuperiamo**»*. Quell'ultima mezza frase nega esattamente la lettura che
l'etichetta della p.6 suggerisce, quindi tiene anche contro di lei.

**E l'attribuzione della risposta è corretta**: *«il 19.5:1 dell'executive
summary»* — la p.4 **è** l'executive summary, e il numero c'è.

##### La versione del Business Plan, e il campione su cui l'ho letta

Il file si chiama `KORA_BusinessPlan_v6.pdf` e il documento dentro è la
**versione 5.0 di giugno 2026**, su tre riscontri indipendenti: il
**frontespizio** («VERSIONE 5.0 · DATA Giugno 2026»), i **metadati** (`/Title
(KORA Business Plan v5.0)`, `/CreationDate D:20260720`) e il **piè di pagina**.
La chiusura del documento, a p.25, dice *«Documento preparato giugno 2026»*.

**Il piè di pagina l'ho letto su sette pagine e non su venticinque, e il
campione si dichiara**: **1, 2, 3, 6, 7, 11 e 25**, cioè la prima, l'ultima e
cinque in mezzo, tutte identiche. È un elemento di template di pagina, e la 25
lo porta uguale alla 1 — ma «tutte e 25» sarebbe una cifra che non ho misurato,
quindi il `CLAUDE.md` §3 dice *«il piè di pagina»* e basta. **Un campione
dichiarato è una misura, un campione taciuto è una cifra senza criterio.**

**Le pagine citate in §9 sono quelle di questo PDF** — verificate p.4 (margini
68–79%), p.7 e p.11 (disponibilità minima 8h/settimana) — quindi i rimandi del
§9 sono giusti e a mentire è soltanto il nome del file. **Nessun rename e
nessun tocco alla storia**, per decisione dei founder.

##### Il costo della clausola di scadenza, misurato

La clausola del §3 prevede `git filter-repo` al primo ingresso di qualcuno che
non sia un founder, e descriveva un'operazione **senza dirne il prezzo**.

I due PDF sono entrati **insieme, con un commit solo**: `2b81f54` del
07.08.2026, *«docs: add business plan and ceo doubts documents»*. Controprova su
tutta la storia con `git log --all`: **nessun altro commit tocca un `.pdf`**, e
ogni file ha un blob solo. La riscrittura toccherà quel commit e nient'altro.

##### Verificato

- **`git diff --name-only` contro `master`: nessun file sotto `src/`**, e i due
  soli file toccati sono `CLAUDE.md` e questo;
- `typecheck` e `lint` a **zero**;
- **`docs/PITCH.md` e `src/lib/roi-model.ts` non compaiono nel diff**, ed è la
  prova delle due cose che la decisione dei founder vietava di toccare;
- **niente verifiche a schermo**: non c'è niente di nuovo a schermo. Stessa forma
  delle altre passate documentali.

##### Come sono state misurate

- **la versione**: metadati letti dai byte del PDF (`/Title`, `/CreationDate`,
  `/Count`), e frontespizio e piè di pagina letti come pagine;
- **i quattro fatti**: aperte le pagine 3, 4, 6, 7, 11 e 25 e lette contro
  `CLAUDE.md` §8, §9 e §10.B.1, invece di fidarsi della segnalazione;
- **il 220–440**: ricalcolato dai cinque numeri di ancoraggio, dividendo per 100
  dipendenti e per 12 mesi;
- **il commit dei PDF**: `git log --oneline --all -- '*.pdf'`, più
  `git log --all --format='%h' --name-only` filtrato su `.pdf` per la
  controprova, e `git rev-list --all --objects` per i blob.

##### Trovato e non toccato

- **`/CreationDate` dice 20.07.2026 mentre il documento si dichiara di giugno
  2026.** Non è una contraddizione: è un documento datato giugno esportato in
  luglio, ed è il caso normale. Registrato perché chi rifà la verifica dei
  metadati lo incontra e non deve chiedersi se sia un difetto;
- **la riga «ROI potenziale» della p.4 non ha nessuna formula accanto**, quindi
  non è etichettata male — è solo priva di contesto. Il difetto di etichetta è
  della p.6, ed è lì che la voce lo colloca.

#### Il check rapido, la soglia e i badge (20.08.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **È la prima passata di codice dopo tre
documentali**, e tocca l'interfaccia in tre punti senza aggiungere niente al
dominio: `DataProvider`, `types.ts`, `mock/` e `docs/CONTRATTO-DATI.md` **non
compaiono nel diff**, `EXPECTED_KEYS` resta **780** — una chiave riscritta,
nessuna aggiunta — le rotte restano **26** e le schermate **27**. `build`,
`lint` e `typecheck` a zero.

**Nessuno dei tre difetti si vedeva leggendo il codice**: due si vedono solo col
mouse addosso, e il terzo solo cambiando lingua.

##### Il tocco del check rapido è reversibile, e non confermato

`disabled={answered || submit.isPending}` chiudeva i cinque volti appena la
risposta era registrata. I bersagli sono larghi e affiancati, quindi **il tocco
sbagliato è un caso normale e non un incidente**, e restava per tutta la
giornata senza nessun modo di rimediare.

**Le due strade erano una conferma o un gesto reversibile, ed è stata scelta la
seconda.** Una conferma **raddoppia «una domanda, un tocco»** (`CLAUDE.md` §8)
sulla scrittura più piccola del dominio, e nel pitch trasforma in una procedura
la card che risponde a *«da dove vengono i numeri di stress?»*. Rendere il gesto
reversibile è la stessa cosa vista dal verso giusto, e costa una riga invece di
un dialogo.

**`answered` non disabilita più niente**: resta la sola attesa della scrittura
in corso. **Chi rimette `answered ||` davanti a quel `disabled` riapre il
difetto, non ne chiude uno** — il commento accanto lo dice, perché è la riga che
sembra una dimenticanza e non lo è.

**Il provider non è stato toccato, ed è stato verificato prima e non dopo**:
`submitRapidCheck` riscrive `lastRapidCheck` senza guardare cosa c'era, quindi
la seconda risposta funzionava già. I volti non scelti riprendono l'hover di
`FACE_IDLE` — la coppia `accent` del §6.1 — perché **un bersaglio che si può
premere deve reagire, o si legge come disabilitato**; `FACE_CHOSEN` non si
muove, e l'anello teal resta il segno della scelta.

**La frase nuova non promette nessuna cadenza, ed è deliberato.** La vecchia
diceva *«ti richiediamo come stai fra qualche giorno»*, che è la decisione in
sospeso registrata più in basso in questo file — una stringa che decide ciò che
il contratto lascia indeciso. Riscriverla con una cadenza diversa avrebbe
riaperto quel difetto mentre se ne chiudeva un altro, quindi la frase dice che
la domanda torna **senza dire quando**. La decisione su quale sia la cadenza
resta dei founder, e la voce resta aperta.

##### La larghezza di una colonna la detta il tedesco, ed è il caso concreto del §2.7

La riga della Direzione usciva con un lucchetto e `t.common.none`, cioè un
trattino, e il motivo — è sotto la soglia di anonimato — stava nel solo
attributo `title`. **Un tooltip nativo compare dopo un secondo di fermata, non
esiste sul touch, e in una demo proiettata non lo vede nessuno**: la riga che
dimostra la garanzia di privacy dell'intero prodotto si leggeva come un dato
mancante. Ora rende `t.hr.suppressed`, che esisteva già in tutte e quattro le
lingue, e il `title` è diventato la spiegazione lunga di un'etichetta che si
legge da sola.

**Ma la parte che vale oltre il caso è la colonna.** L'etichetta più lunga è la
tedesca, *«Unter der Schwelle»*, che con il lucchetto e il suo gap misura
**146px**: in `w-32` (128px) andava a capo, e **`w-36` ne dà 144, cioè manca per
due pixel**. È passata a `w-40`.

| | larghezza con lucchetto e gap |
|---|---|
| **de** «Unter der Schwelle» | **146,0** |
| en «Below threshold» | 126,3 |
| fr «Sous le seuil» | 103,1 |
| it «Sotto soglia» | 97,8 |

**È il §2.7 con un numero accanto** — *niente larghezze fisse su etichette e
pulsanti, perché il tedesco è ~30% più lungo* — e resta scritto qui perché **la
prossima colonna con un'etichetta tradotta ha lo stesso problema**, e perché la
misura dice due cose che la regola da sola non dice: che il tedesco può chiedere
**il 50% in più** dell'italiano, e che il passo successivo della scala di
Tailwind può non bastare. I cinque punteggi degli altri reparti restano sotto i
94px in ogni lingua, quindi a dettare la larghezza è questa riga sola.

##### L'`hover:` ripetuto sui badge non interattivi, e perché non è un duplicato

`badge.tsx` ha `defaultVariants: { variant: "default" }`, e quella variante
porta `hover:bg-primary/80`. Un call site che passa solo `className="bg-… "`
sovrascrive il fondo **a riposo** e non l'`hover:`, **che è un'altra classe**:
al passaggio del mouse il badge diventava blu petrolio pieno. Succedeva su
`Badge` che sono `<div>`, senza `onClick` e senza link — cioè su **etichette che
fingevano di essere premibili**.

**Si corregge al call site e non nella definizione**, ed è il `CLAUDE.md` §6.1
che lo dice per questo file esatto: `src/components/ui/` è congelato (§3), e le
sue tre eccezioni sono tutte datate e nate perché senza di esse una regola era
ineseguibile. Questa non lo è: il rimedio esisteva già nel repository, in
quattro punti che ripetevano il proprio fondo in un `hover:`, ed è stato esteso
a **25 stringhe su 9 file**. La trasformazione è meccanica — `bg-X` →
`bg-X hover:bg-X`, stessa opacità — e a schermo il risultato è identico a riposo
e immobile sotto il mouse.

**I `Badge` con `variant="outline"` non ne hanno bisogno, ed è il criterio che
distingue i due insiemi**: quella variante è `"text-foreground"` e basta, senza
nessun `hover:bg-*` da sovrascrivere, quindi non hanno il difetto e un `hover:`
lì sovrascriverebbe il nulla — cioè codice che il §11 non vuole. Sono quattro
punti, e la prova è stata fatta col mouse invece che con il ragionamento: il
badge outline sotto il cursore fa `:hover`, il suo fondo non si muove, e la sua
lista di classi non contiene **nessun** `hover:`.

**Un commento in `HRFatturazione.tsx`**, dove il difetto è stato notato, dice
tutto questo accanto al primo badge corretto. È la nota che impedisce al
prossimo di togliere l'`hover:` credendolo un duplicato — che è esattamente come
il difetto tornerebbe.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

**E il controllo è servito**: il pannello riportava `visibilityState: hidden` e
`innerWidth: 0`, quindi le prime misure sarebbero state di un'altra pagina — è
la trappola del §11, alla sua ennesima comparsa, e si è sciolta imponendo il
viewport. Da lì la geometria è reale, e la controprova è che la larghezza
predetta col canvas per il tedesco — **146** — è uscita identica sul render.

- **il check rapido, i due tocchi**: toccato il primo volto, poi il terzo, e la
  scelta si è spostata; **usciti dalla home e rientrati**, la card si rimonta,
  rilegge dal provider e mostra ancora il terzo — che è la prova che a essere
  registrata è l'ultima risposta e non la prima. Tutti e cinque i volti restano
  abilitati;
- **l'hover di un volto spento**: da fondo trasparente e testo
  `rgba(95,112,129,0.4)` a `rgba(221,248,237,0.5)` con testo `rgb(17,57,90)`;
- **la riga sotto soglia in quattro lingue**, cambiando davvero lingua dal
  selettore e non solo misurando col canvas: una riga sola in tutte e quattro;
- **i badge su venti rotte**, cioè tutte quelle che ne rendono almeno uno:
  **`twMerge` rimuove del tutto `hover:bg-primary/80`**, e l'unica classe
  `hover:` rimasta ripete il fondo a riposo. Con un hover vero su `/hr/billing`
  il badge sotto il mouse e quelli fuori misurano lo stesso
  `rgba(27,172,153,0.1)`, non il `rgb(17,57,90)` del primary pieno.

##### Come sono state misurate

- **i badge difettosi**: si cercano i `<Badge` e le mappe di classi che finiscono
  su un `Badge`, si tengono quelli in variante **default** — non `outline`, che
  non ha un `hover:bg` da sovrascrivere — il cui `className` contiene un `bg-` e
  non un `hover:`. **La variante è metà del criterio**: senza, il conto sale di
  quattro punti che il difetto non ce l'hanno;
- **le larghezze delle etichette**: `measureText` su un canvas con il font
  calcolato dello `span` reale, e poi il render vero nelle quattro lingue;
- **l'effetto dell'hover**: si legge la lista di classi dopo `twMerge` e si passa
  il mouse davvero, verificando `element.matches(':hover')` prima di fidarsi del
  colore.

##### Trovato e non toccato

- **la mappa `tone` di `ProSessioni.tsx` porta un `bg-` senza `hover:` e non è
  un difetto**: finisce su un `<div>` e non su un `Badge`, quindi non c'è
  nessuna variante che porti un `hover:bg`. Registrato perché è il primo falso
  positivo che incontra chi rifà la ricerca con un grep sul solo `bg-`;
- **la decisione in sospeso sul `doneHint` resta aperta.** La stringa non
  promette più una cadenza, quindi il difetto che la voce descrive — una stringa
  che decide ciò che il contratto lascia indeciso — a schermo non c'è più; ma
  **quale sia la cadenza è una decisione dei founder**, e non si chiude
  riscrivendo una frase. La voce è stata lasciata dov'è.

#### Il messaggio di annullamento (01.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **Nessuna schermata nuova**: le rotte restano
**26** e le schermate **27**, e nessun numero del §8 e del §9 si muove.
`EXPECTED_KEYS` passa da **780 a 785** — cinque chiavi nuove nei quattro
dizionari — e i guardrail da ~~**111 a 112**~~ → **111 a 113** (corretto il
02.09.2026: duecento righe più in basso questo stesso verbale scrive *"passano
da 111 a 113 e non a 112, perché le chiamate sono due"*, ed è la cifra che il
`CLAUDE.md` §5.6 porta). `build`, `lint` e `typecheck` a zero.

**Chiude una decisione che due documenti dichiaravano non presa.** Il commento
in testa ad `Appointment` diceva *«chi la legge è una decisione di prodotto che
nessuno ha preso»*, e il `docs/CONTRATTO-DATI.md` §3 lo ripeteva: i founder
l'hanno presa il 01.09.2026, e la professionista può far arrivare al paziente
una riga sulla disdetta mentre la nota clinica e quella di seduta avvenuta
restano sue.

##### Due campi e non un interruttore, ed è la decisione

La strada scartata era **una spunta sulla nota che esiste già** — *"rendi
visibile al paziente"* sopra un testo scritto per sé — e non è stata scartata
per gusto: **è la forma che il contratto rifiuta altrove**, con le stesse
parole. Il commento su `PlatformSession` lo dice dal 17.08.2026: *non lo si
risolve facendo scegliere alla schermata cosa rendere, perché quella è una
scelta che qualcuno può disfare*.

**Il danno che quella forma rende possibile non si ripara**: una spunta lasciata
attiva per distrazione manda al paziente una valutazione clinica, e non esiste
un ritiro. Con due campi il testo che attraversa il confine è quello che
qualcuno ha scritto **per** attraversarlo, e non c'è nessuno stato da sbagliare
— al massimo si scrive un messaggio e non lo si manda.

| campo | dove vive | chi lo legge |
|---|---|---|
| `cancellationNote` | solo `ProfessionalSession` | solo chi cura |
| `cancellationMessage` | `ProfessionalSession` **e** `Appointment` | chi cura, e il paziente |

**`Appointment` continua a non avere `cancellationNote`**, e **`PlatformSession`
è identico riga per riga** — è la prova che la separazione è di forma e non di
rendering. Nessun tipo e nessun metodo dell'area HR o admin acquista campi, e
`SessionNote` non è stato toccato.

##### La firma passa a un oggetto, e la convenzione del §2 regge

`cancelSession(sessionId, note?)` diventa
`cancelSession(sessionId, { note?, message? })`. **Con due note facoltative i
parametri posizionali smettono di essere leggibili**: `cancelSession(id,
undefined, "…")` non dice quale dei due testi sta passando, e **invertirli è un
errore che compila**.

**Non contraddice il §2 del contratto, e va detto perché**: quella sezione
dichiara che *sugli input di scrittura il `?` è legittimo*, e qui vale sia
sull'oggetto sia sui suoi due campi — annullare senza scrivere niente è il caso
normale. **A normalizzare resta il confine**, come per la richiesta demo:
assente, vuoto e soli spazi diventano la stessa cosa una volta sola. L'unica
differenza rispetto a `DemoRequest` è la direzione — là il confine normalizza
verso `null` perché la lettura dice `| null`, qui verso **l'assenza** perché le
due proiezioni dicono `?` per la ragione già dichiarata sui tipi.

##### Il guardrail sorveglia il testo, non il nome del campo

Un `assertInDevOutsidePromise` verifica che **nessun `Appointment` porti mai il
testo di un `cancellationNote`**. Il campo non c'è sul tipo, quindi oggi non può
arrivarci: **esiste per domani**, contro il refactor che unifica i due campi
*«perché si assomigliano»* — che è il modo in cui questa garanzia cadrebbe senza
che nessuno se ne accorga, visto che a schermo le due righe si somigliano
davvero.

**Guarda il testo e non la chiave**, ed è la mezza riga che lo rende utile: un
campo rinominato passerebbe un controllo sul nome, mentre è il **testo** a non
dover attraversare il confine. Quando i due testi coincidono il confronto non
prova niente, e la condizione lo dichiara invece di fingere il contrario.

**`assertInDevOutsidePromise` e non `assertInDev`**: `getAppointments` lo chiama
react-query, che cattura, quindi un `throw` finirebbe nello stato d'errore della
query dove nessuno lo guarda. È la ragione già scritta su `requireProfessional`.

##### Il dialogo: la spunta apre, non pubblica

La seconda casella **non compare finché non la si chiede**, nasce **vuota** e la
spunta nasce giù. **Non si pre-riempie con la nota privata in nessuna
circostanza**: sarebbe l'interruttore travestito, con un clic in meno fra il
testo per sé e il paziente che lo legge. Togliendo la spunta il testo se ne va,
così un messaggio nascosto non può partire lo stesso, e chiudendo il dialogo si
torna puliti tutti e tre — come già faceva la nota.

**Due frasi sulla riservatezza, non una**: quella sotto la nota dice che resta
in agenda, quella sotto il messaggio dice che il paziente lo leggerà. Stanno
dove si scrive, per la stessa ragione per cui la prima ci stava già.

##### Dal lato del dipendente è una voce, non un log

Il messaggio sta **sotto la riga che dice chi ha annullato**, perché è il
seguito di quella frase: la disdetta è il fatto, questa è la voce di chi l'ha
decisa. **Si stacca dal testo di sistema** — filetto a sinistra, testo su
`foreground`, corpo più grande delle due righe sopra — perché a parlare non è
più la piattaforma, e leggerlo nel grigio degli avvisi lo farebbe sembrare
un'altra riga di log.

**Ed è attribuito**: senza il nome davanti, un *"sono malata"* senza soggetto è
la piattaforma che dice una cosa che non può aver detto. L'attribuzione è una
chiave di `i18n` e si traduce; **il messaggio no**, perché è testo di chi
scrive e non copy dell'interfaccia.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima

**I quattro casi, uno per volta e su tre sedute diverse di Laura:**

- **entrambi** (08.10): il dipendente vede il messaggio, **non** la nota;
- **solo la nota** (01.10): la riga della disdetta c'è e **nessun messaggio**
  compare; la nota non è da nessuna parte;
- **solo il messaggio** (24.09): funziona, e la nota resta assente;
- **chiudo e riapro**: i due campi sono vuoti e la spunta è giù, dopo aver
  scritto in tutti e due.

Contate le attribuzioni sulla home: **due**, una per ciascuna delle due sedute
con un messaggio, e zero sulla terza.

**Le quattro lingue**, sul dialogo e sulla home: l'etichetta della spunta sta su
**una riga sola** in tutte e quattro, il dialogo resta a 448px e non va in
overflow. L'attribuzione si traduce, il messaggio resta nella lingua in cui è
stato scritto — che è giusto, ed è la differenza fra copy e contenuto.

**`grep -rn "cancellationNote"` sulle aree dipendente, HR e admin non restituisce
niente**, ed è la verifica che vale più delle altre: nel resto di `src/` il nome
compare in quattro file, tutti dal lato di chi cura o nel layer dati.

##### Il guardrail è stato riscritto prima del merge, ed è la parte più istruttiva

La prima stesura era **una chiamata sola con tre vie d'uscita**, e ne aveva due
sbagliate in direzioni opposte. Entrambe sono state **riprodotte a schermo prima
di correggerle**, non dedotte.

**Il falso allarme su un caso normale.** Cercava il testo della nota dentro la
serializzazione dell'appuntamento, che contiene il messaggio: con nota
*"malata"* e messaggio *"Sono malata, ti ricontatto io"* scattava senza che
fosse trapelato niente. Riprodotto: l'errore esce con il testo *«La nota privata
… è finita nell'appuntamento del dipendente»*.

**E l'effetto va detto con precisione, perché non è quello che si dà per
scontato del modo `throw`**: la home **si disegna lo stesso**. Il guardrail passa
da `raiseOutsideCurrentStack`, che rilancia da un microtask per uscire dalla
cattura di react-query, quindi diventa un errore non catturato — l'overlay di
Vite in sviluppo, il `console.error` nella build demo — e non una pagina bianca.
Chi lo trova alla prova del giorno prima si ferma comunque (`docs/PITCH.md`), ma
non lo trova perché la schermata è sparita.

**La cecità sul bersaglio.** Una delle vie d'uscita era `nota === messaggio`, e
il refactor che unifica i due campi *«perché si assomigliano»* — cioè la
minaccia per cui il guardrail esiste — produce **esattamente** quell'uguaglianza.
Misurato sul caso: con il controllo vecchio l'assert passava, e **la nota era
visibile al dipendente**.

**Il rimedio è di forma accanto a quello di testo**, e i due non sono duplicati:

| controllo | coglie | non vede |
|---|---|---|
| la chiave `cancellationNote` non esiste sull'appuntamento | il refactor che **unifica** | il campo rinominato |
| nessun valore diverso da `cancellationMessage` è uguale alla nota | il campo **rinominato** | — |

**Provati rompendo il codice ad arte e ripristinandolo subito**, la tecnica della
passata pre-pitch del 10.08.2026. Con i due campi unificati scattano **tutti e
due**, con messaggi distinti; con il campo rinominato `noteForPatient` scatta
**il solo controllo testuale**, che è la prova che la forma da sola non basta.
Il caso normale non scatta più.

**`cancellationMessage` è l'unico valore escluso dal confronto**, e non è la
vecchia via d'uscita con un altro nome: là l'uguaglianza faceva passare
**l'assert intero**, qui toglie **un solo valore** dal confronto — quello che la
nota può legittimamente eguagliare, quando chi scrive mette lo stesso testo in
tutti e due.

**I guardrail passano da 111 a 113 e non a 112**, perché le chiamate sono due:
due minacce diverse meritano due messaggi diversi, e un assert solo con due
condizioni direbbe a chi lo trova che qualcosa non va senza dirgli quale delle
due. Il `CLAUDE.md` §5.6 è aggiornato in tutti i punti in cui la cifra compare.

**Ricontarli ha trovato una trappola, ed è finita accanto al conto**: un `grep`
del numero su `CLAUDE.md` pesca anche un `112` del §2.7, che conta **gli oggetti
di un dizionario** e non i call site. Una sostituzione cieca avrebbe corrotto
quella riga. Due grandezze diverse hanno avuto lo stesso valore, e l'avvertenza
sta nel §5.6 invece che nella memoria di chi l'ha scoperto.

##### Trovato e non toccato

- **`docs/CONTRATTO-DATI.md` §4 dice ancora che «l'ora annullata torna
  prenotabile»**, mentre il §8.5 dello stesso documento separa l'invariante
  dalla policy dal 18.08.2026 — *liberare una fascia e riproporla sono due
  cose* — e il dialogo ha smesso di prometterlo il 19.08.2026. È l'ultimo punto
  rimasto indietro di quella correzione, ed è fuori dal perimetro di questa
  passata, che riguarda la nota e la sua destinazione e non l'annullamento in
  generale;
- **la notifica resta la voce più vicina del §8.5, e non si è mossa**: una riga
  che il paziente legge *se apre l'applicazione* non è una riga che gli arriva.
  Il messaggio rende quella lacuna più visibile invece di ridurla, ed è scritto
  nel contratto accanto alle altre quattro.

#### La chiusura delle fasce (01.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git. **Nessuna
schermata nuova**: rotte **26**, schermate **27**, nessun numero del §8 e del §9
mosso. `EXPECTED_KEYS` passa da **785 a 789**, i guardrail da **113 a 115**.
`build`, `lint` e `typecheck` a zero.

**Chiude metà di una voce del perimetro dell'MVP.** Il
`docs/CONTRATTO-DATI.md` §8 dava «la pubblicazione della disponibilità» come
mancante intera: adesso la professionista **chiude e riapre** le fasce che ha,
mentre **dichiararne di nuove** e la **ricorrenza settimanale** restano fuori.

**Il caso che la motiva**: fino a ieri l'unico modo che aveva di liberarsi
un'ora era che ci fosse **una seduta da annullare**. Un impegno personale su
un'ora libera non aveva nessuna rappresentazione e quell'ora restava
prenotabile; e dopo una disdetta l'ora tornava proponibile e il paziente poteva
riprendersela — che a volte è giusto e a volte no.

##### Il dataset non è stato toccato, ed è stato verificato prima

`SLOT_PLAN` dà alla Dr.ssa Meier quattro fasce, e **la settimana corrente ne
contiene una**: venerdì 25.09 alle 10:00. Le altre tre stanno nella settimana
successiva, che la freccia raggiunge. Basta a mostrare la funzione senza
allargare la storia curata del §8, e la verifica è stata fatta **prima** di
scrivere codice, non dopo.

**Ne discende una conseguenza operativa, e sta in `docs/PITCH.md`**: quell'unica
fascia libera è **lo slot che il pitch prescrive di prenotare**, quindi l'ordine
del giro è vincolante — prenota, annulla, poi chiudi.

##### Un tipo di lettura separato, e non un campo in più

`ProfessionalSlot` nasce accanto ad `AppointmentSlot` invece di aggiungergli uno
stato, e la ragione è che **quello è anche l'input di `bookAppointment`**: uno
stato appeso lì vorrebbe dire che **chi prenota dichiara lo stato della fascia**,
e `bookAppointment({ …, status: "closed" })` compilerebbe. È il confine del §2
del contratto fra modelli di lettura e input di scrittura — quello che il caso
`DemoRequest` mostra al meglio — e i due tipi coincidevano finora **solo perché
la fascia non aveva stato**. Ognuno ha adesso un mestiere: `AppointmentSlot` è
ciò che si può prenotare, `ProfessionalSlot` ciò che la professionista
amministra.

**Una scrittura sola con lo stato desiderato**, non un `openSlot` e un
`closeSlot`: due metodi speculari sarebbero due superfici di invalidazione da
tenere allineate a mano per una differenza che sta in un valore, ed è la ragione
per cui `saveSessionNote` è un upsert.

**I tre rifiuti non sono della stessa natura, e il commento lo dice**: la fascia
inesistente e quella occupata da una seduta in programma sono **del dominio** —
404 e 409 per un backend vero, e valgono identiche in produzione; la fascia
passata è una **regola del dominio con un'implementazione dell'orologio della
demo**, perché "passata" si misura su `DEMO_TODAY` (`CLAUDE.md` §5.4). È la
stessa struttura a due metà che `cancelSession` dichiara sulla sua
precondizione.

**L'identità di una fascia è oggi una coppia e non lo resterà**, ed è annotato
sui tipi perché è dove lo incontra chi legge: professionista più istante
d'inizio è una chiave **finché le fasce sono generate**. Il giorno in cui la
professionista ne dichiara di nuove, una fascia diventa un record con
un'identità propria e `setSlotStatus` prende un id.

##### Le fasce non erano mai state renderizzate, e questa è la parte che costava

`weekGrid` e `slotsOfWeek` costruivano le righe **dalle sole sedute**: una
fascia libera non aveva una riga, e le celle vuote erano solo i giorni in cui
nessuno aveva preso quell'ora. Quindi «cliccare su uno slot libero» **non era un
gesto da aggiungere a una cella esistente** — prima la griglia doveva mostrare
le fasce.

`slotsOfWeek` unisce ora gli orari delle sedute e quelli delle fasce, e una
cella è una seduta, una fascia, oppure niente. **I due campi restano distinti
sul tipo e non collassano in uno stato solo**: una fascia può essere occupata, e
a decidere cosa mostrare è la schermata — la seduta vince perché dice di più —
ma la griglia non le toglie il resto. Le funzioni restano pure.

##### La resa della fascia chiusa è stata cambiata dopo la prova, non prima

Il bordo tratteggiato è **il segno primario** e non un complemento del colore:
`bg-muted/60` è già la seduta passata, quindi chiusa e passata finirebbero su
due gradazioni dello stesso token — e i due fondi differiscono di **sei punti su
255**, cioè niente.

**La prima stesura non passava la prova, ed è la parte istruttiva.** A `1px` con
`muted-foreground/50` il tratteggio **spariva nello screenshot della griglia**:
la cella chiusa era indistinguibile da una libera senza leggerne il testo, cioè
falliva esattamente il controllo per cui esiste. Portato a **`border-2` a piena
intensità**, le tre celle — passata, chiusa, libera — si riconoscono nello
screenshot ridotto senza leggere niente e senza passarci sopra il mouse.

**La prova è visiva e non si fa con `getComputedStyle`**, e va detto perché
costa tempo a chi la rifà: nel pannello del browser lo stile calcolato di quella
cella ha restituito valori che **nessuna regola del foglio produce** — bianco su
un elemento con `bg-muted`, mentre un clone dello stesso nodo fuori dalla
griglia rendeva correttamente. Le regole c'erano, colpivano l'elemento e
vincevano per specificità. **A decidere è stato lo screenshot**, che è anche il
criterio che i founder avevano posto.

##### Il guardrail sta dal lato della prenotazione

Una fascia chiusa non si prenota, e il controllo guarda **l'archivio delle
chiuse** invece dell'elenco dei proponibili: verificarlo là sarebbe stato
tautologico — è la stessa funzione che decide cosa è libero, quindi se il suo
filtro si rompe si rompe anche la verifica. È la ragione già scritta sui due
controlli accanto.

**Il caso che coglie non è teorico**: chi prenota tiene lo slot in uno stato
locale, quindi fra l'elenco e la conferma la fascia può essere stata chiusa
dall'altro lato del marketplace.

##### Verificato a schermo, viewport 1280×900

- **il giro dei tre tempi, per intero**: prenotato venerdì 25.09 alle 10:00 e lo
  slot sparisce dai proponibili; annullata la seduta e **torna**; chiusa la
  fascia e **non torna più**; riaperta e ricompare. I quattro passaggi letti dal
  portale del dipendente, non dal codice;
- **le tre celle vicine** — passata, chiusa, libera — riconoscibili nello
  screenshot senza leggere il testo;
- **le quattro lingue** sulla griglia: le due etichette del gesto, il testo della
  cella e la legenda a quattro voci;
- `build`, `lint` e `typecheck` a zero.

##### L'ultimo punto rimasto con la vecchia formulazione

Il §4 del contratto diceva *«l'ora annullata torna prenotabile, ed è il caso che
dà un senso all'annullamento»*. Era **indietro rispetto al §8.5 dal
18.08.2026**, che separa l'invariante — l'ora non è più occupata — dalla policy
— torna prenotabile da chiunque — e dichiara la seconda non decisa: era
l'ultimo punto rimasto con la formulazione vecchia, e le passate del 18 e del
19.08 lo avevano registrato senza chiuderlo.

**Questa passata non lo lascia vecchio: lo rende falso.** Un'ora annullata torna
prenotabile **a meno che la fascia non sia chiusa**, ed è il §8 riscritto qui
sopra a dirlo — *«l'ora liberata da una disdetta torna proponibile, e se non
deve tornarlo la si chiude»*. Il §4 affermava senza condizioni ciò che il §8
qualifica.

Ora dice **l'invariante** e rimanda al §8.5 per la policy invece di ripeterla.
Il resto del paragrafo non è stato toccato: le due radici invalidate, il
compenso e il contatore restano come sono.

**Cercato in tutto il contratto se qualche altro punto affermasse la policy come
invariante: ce n'era uno solo.** Gli altri otto riscontri della ricerca —
*«libera la fascia: una seduta annullata non occupa più la sua ora»*, *«questo è
l'invariante, e vale»*, *«e torna prenotabile da chiunque è un'altra cosa»* —
dichiarano l'invariante o separano esplicitamente le due cose.

##### Ricontare la cifra dei guardrail ha trovato una seconda trappola

Il conto passa a **115**, e i punti del `CLAUDE.md` in cui compare sono stati
**ricontati e non ripresi**. È uscito un secondo falso positivo, di specie
diversa dal primo: un **`113` dentro `#11395A`**, l'esadecimale di `primary` nel
§6.1, dove le cifre **non sono un numero**. Il primo, già registrato, era un
`112` del §2.7 che conta gli oggetti di un dizionario. L'avvertenza accanto al
conto adesso dice che le specie sono due e che **i riscontri si leggono uno per
uno invece di sostituirli**.

#### La griglia delle fasce (01.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **È resa e testo, più una riga di layer dati
che i founder hanno autorizzato a passata aperta**: `provider.ts`, `types.ts`,
`schedule.ts`, `mock/` e `docs/CONTRATTO-DATI.md` **non compaiono nel diff**;
`prefetch.ts` sì, ed è l'eccezione dichiarata più sotto. Nessuna schermata
nuova, rotte **26** e schermate **27**, nessun numero del §8 e del §9 mosso,
guardrail **115 = 102 + 13** invariati. `EXPECTED_KEYS` passa da **789 a
791** — due chiavi nuove nei quattro dizionari, contate sull'albero e non
stimate. `build`, `build:demo`, `lint` e `typecheck` a zero.

**Comportamento invariato, ed è la premessa**: quali celle sono un `button` e
quali no non è cambiato. A cambiare è cosa si vede.

##### La fascia libera e la cella vuota erano disegnate uguali

`bg-card border-border` era **la stessa classe** per l'offerta e per il niente.
Nella settimana della demo la Dr.ssa Meier ha **una** fascia libera — venerdì
25.09 alle 10:00 — e **diciannove** celle vuote: venti riquadri bianchi
identici, di cui uno cliccabile. Misurato dopo il rimedio, ed è il conto che
dice cos'era prima: `19` celle senza bordo, `1` con il bordo dell'offerta.

**Il segno primario della libera è il testo**, come per la chiusa e per la
stessa ragione (§6.1, 1.4.11): la cella porta la sua etichetta — `slotFree` —
invece di affidare il significato alla tinta.

**Il fondo non poteva essere una tinta, e la misura lo decide.** I cinque fondi
di questa griglia stanno tutti dentro **ΔE 6.6** l'uno dall'altro — la palette
è pallida per costruzione — quindi *nessun* verde pallido avrebbe separato la
libera dalla prenotata: `bg-secondary/10` e `bg-accent/50` distano nove punti
su 255. Il bianco è l'unica cosa che le altre quattro non hanno, e a portare il
segno è il **bordo da 2px su `secondary-strong`**, 5.72:1 sul proprio fondo,
sopra il 3:1 che la 1.4.11 chiede.

**La vuota arretra**: niente fondo e **niente bordo**. Non offre niente, e
adesso non lo promette.

**Rendere e poter cliccare si decidono sullo stesso predicato**, ed è una riga
in più che la richiesta non chiedeva: `offerta` è la fascia libera **e futura**,
cioè esattamente l'insieme che diventa un `button`. Una fascia passata arretra
con le vuote invece di disegnarsi come un'offerta che il provider
rifiuterebbe — l'affordanza che mente dell'08.08.2026, qui prevenuta invece che
corretta. Nel dataset non è raggiungibile (le fasce nascono tutte a
`DEMO_TODAY + n`, con `n ≥ 1`), e costa zero scriverla giusta.

##### La legenda insegnava il contrario di quello che c'era

Il quadratino di **«Libera» era `bg-card border-border`**, cioè il disegno
della cella **vuota**: la legenda diceva che tutti i riquadri bianchi erano
fasce libere, e ce n'era una su venti. Ora ogni voce porta il disegno vero
della cella che nomina — verificato leggendo `width`, `border-width` e
`border-style` di tutti e quattro gli swatch, in tutte e quattro le lingue.

**La cella vuota non ha una voce, e non è una dimenticanza**: non ha più un
aspetto proprio da nominare, e un quadratino invisibile manderebbe chi legge a
cercare una cosa che non c'è.

**Gli swatch passano da `w-3` a `w-4`**: su dodici pixel un bordo da due ne
lascia otto di fondo, e i due che il bordo lo hanno spesso si leggevano come
due bordi e basta.

##### Da dove vengono le fasce, e perché la frase sta nella legenda

Il nome è dei founder — **«la tua disponibilità»** — e il posto è una decisione
della passata, scritta nel commento accanto: **la griglia contiene anche le
sedute**, quindi un titolo sopra di lei mentirebbe sulle celle prenotate e
passate. La frase deve nominare le sole libere e chiuse, e l'unico posto in cui
può farlo senza ripeterne i nomi è **accanto alle voci che le nominano già**.

**Non promette il verbo che manca.** Dichiarare fasce nuove e la ricorrenza
settimanale restano lavoro dell'MVP (`docs/CONTRATTO-DATI.md` §8.5): la riga
dice da dove vengono quelle che ci sono e cosa se ne può fare, e si ferma lì.

##### La prova a cinque, e perché è in due fotogrammi

**Il dataset non le mette insieme, e va detto invece di aggirarlo.** La Dr.ssa
Meier ha **una** fascia nella settimana corrente e **tre** nella successiva
(`SLOT_PLAN`, giorni +2, +5, +6, +7 da `DEMO_TODAY`), e nessuna cade nel
passato. Quindi:

- la **settimana corrente** dà passata, prenotata, libera e vuota — le uniche
  sedute erogate della finestra stanno qui;
- la **successiva** dà prenotata, libera, chiusa e vuota, chiudendone una delle
  tre — ma non ha nessuna seduta erogata.

**Quattro per fotogramma è il massimo**, e i due condividono tre stati, quindi
il confronto è ancorato. L'alternativa era rompere il dataset ad arte per la
durata di uno screenshot — la tecnica del 10.08.2026 — e il perimetro di questa
passata dice di non toccare `mock/`.

**Le cinque non si confondono, e il discriminante non è il fondo per nessuna
coppia.** Misurato sui colori compositati veri, non sulle classi:

| coppia | cosa le separa | misura |
|---|---|---|
| libera / vuota | bordo 2px contro **nessun bordo** | 5.72:1 sul fondo della cella |
| libera / prenotata | tinta e spessore del bordo | ΔE **47.2**, 2px contro 1px |
| libera / chiusa | solido contro tratteggiato | ΔE **29.7** |
| libera / passata | tinta del bordo | ΔE **55.6** |
| chiusa / passata | **tratteggio 2px** | ΔE bordo **45.3** (deciso il 01.09) |
| chiusa / vuota | tratteggio contro niente | 4.62:1 |
| prenotata / passata | **colore del testo** | ΔE **29.7** (teal contro grigio) |
| prenotata / vuota · passata / vuota | presenza del riquadro e del testo | — |

**I fondi non separano niente, ed è il fatto da tenere**: prenotata, passata,
chiusa, libera e vuota stanno dentro **ΔE 6.6**, e passata / chiusa dentro
**1.8**. Questa griglia si legge dai **telai** e dal **colore del testo**, mai
dal riempimento — è la conclusione a cui la passata del 01.09 era arrivata per
la chiusa, misurata qui per tutte e cinque.

##### Verificato a schermo, viewport 1280×900 e `innerWidth` controllato prima di ogni misura

**E il controllo è servito**: la prima scheda riportava `innerWidth: 0`, cioè la
trappola del §11, sciolta imponendo il viewport.

- **il giro dei tre tempi regge**: prenotata, annullata, chiusa e riaperta la
  fascia di venerdì 25.09, con la cella che cambia disegno a ogni passaggio;
- **le quattro lingue, cambiate davvero dal selettore**: l'etichetta della cella
  sta su **una riga** in tutte e quattro — `Libera` 36px, `Libre` 29, `Free` 25,
  `Frei` 21 in una cella da 151 — e la più larga delle chiuse è la tedesca,
  `Geschlossen` a **73px**;
- **la riga della disponibilità sta su una riga in tutte e quattro**, in un
  contenitore da 960: `it` 405px, `de` **607**, `fr` 491, `en` 403. Il tedesco
  chiede il **50% in più** dell'italiano, che è la misura del §2.7 ripetuta su
  un'altra stringa;
- **zero overflow orizzontale** in tutte e quattro le lingue;
- **la legenda porta il disegno vero**: `1px solid`, `1px solid`, `2px solid`,
  `2px dashed`, e **nessuna voce per la vuota**;
- `build`, `build:demo`, `lint` e `typecheck` a zero; `EXPECTED_KEYS` **791**
  ×4, e a dirlo è il guardrail.

##### Trovato e non toccato

- ~~**`professional.ownSlots` non è scaldata da `prefetchDemo`**, quindi il
  guardrail della cache fredda parla **a ogni ingresso nel calendario**. Il
  rimedio è una riga in `prefetch.ts`, cioè **layer dati**, fuori dal perimetro
  di una passata di resa e testo.~~ → **chiuso qui, sullo stesso branch**: i
  founder hanno **riaperto il perimetro di una riga** a passata aperta, con la
  ragione che il perimetro era stato scritto **prima di sapere che il buco
  esistesse** — è un difetto della stessa schermata, trovato dalla stessa
  passata, su un log che `docs/PITCH.md` classifica come blocco durante la
  prova generale.

  **Era preesistente, ed è stato verificato invece che dedotto**: `git stash`,
  ricaricato su master pulito, stesso errore, `git stash pop`. Nasce con la
  chiusura delle fasce del 01.09.2026 — `prefetch.ts` scaldava
  `professional.slots` e nessuno aveva aggiunto la lettura nuova all'elenco. È
  il punto debole che la testata di quella funzione dichiara: **una chiave
  dimenticata non rompe niente**, fa uno sfarfallio, e qui faceva un
  `console.error` sulla schermata che il pitch percorre.

  **Sta nel blocco del portale e non in quello su tutti i professionisti**, ed
  è la distinzione che le chiavi facevano già: `professional.slots` è una
  lettura del **marketplace** — chi prenota guarda la disponibilità di
  chiunque, quindi si scalda per ognuno del corpo professionale — mentre
  `ownSlots` è una lettura del **portale**, e di portali ce n'è uno solo.
  Scaldarla per tutti sarebbe precaricare agende che nessuna schermata chiede.
  Va quindi dove `professionalId` è già in mano, accanto a profilo, sedute,
  pazienti e compensi, e la ragione è scritta nel commento accanto alla riga.

  **Provato nei due versi sulla build demo**, che è dove il log conta
  (`CLAUDE.md` §5.6): senza la riga, entrando nel calendario dai soli link
  interni la console porta *`["professional","meier","own-slots"] si monta a
  cache fredda`*; con la riga, **console muta** sulle cinque rotte del portale,
  chiusura e riapertura di una fascia comprese, e **una sola navigazione** per
  tutto il giro;
- ~~**il `CLAUDE.md` §10.D non nomina questa passata**, e non è stato toccato di
  proposito: è la terza voce che quella sezione dovrebbe avere e non ha — dopo
  i due testi dell'annullamento e la chiusura delle fasce, tutti e due del
  01.09.2026 — e i founder hanno la decisione in sospeso su come registrarli
  insieme. Aggiungere qui la terza avrebbe deciso al posto loro;~~ →
  **chiuse tutte e tre il 01.09.2026**, dalla passata documentale qui sotto:
  la voce 3 riscritta sui due testi, la voce 6 nuova sulla chiusura delle
  fasce, e dentro di lei la resa e la riga della disponibilità;
- **`prenotata` e `passata` si separano solo per il colore del testo**, ΔE
  29.7, perché i loro fondi distano ΔE 4.4 e i loro bordi stanno a 1.19 e
  1.23:1 sul proprio fondo. È preesistente e non è stato cambiato: è una resa
  approvata, e questa passata l'ha **misurata** invece di ereditarla senza
  numeri. Chi la rivedesse ha qui il punto di partenza.

#### Lo scope delle fasce, e le mutation che non si contano (01.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **Solo documenti**: `git diff --name-only`
contro `master` non tocca **nessun file sotto `src/`**, e `typecheck` e `lint`
escono a zero — eseguiti perché sono quella prova, non perché qualcosa potesse
muoversi. Nessun numero del §8 e del §9 si muove, rotte **26**, schermate
**27**, `EXPECTED_KEYS` **791**, guardrail **115 = 102 + 13**.

**Tre disallineamenti, tutti nati dalle due passate del 01.09.2026**, che hanno
toccato `CLAUDE.md` solo in §5.6 e §3 — cioè hanno mosso le cifre e hanno
lasciato indietro la sezione che descrive il prodotto.

##### Il §10.D descriveva un dialogo che non esiste più

La voce 3 diceva *«il dialogo accetta una nota libera facoltativa»*. Ne accetta
**due**, con **due destinatari**, dal 01.09.2026, e la decisione dei founder
non è che ce ne siano due: è che sono **due campi e non un interruttore**.
Viveva in `docs/CONTRATTO-DATI.md` §3 e nel verbale del messaggio di
annullamento, **e non nella costituzione** — cioè non nel file che il §2.8
dichiara essere il posto delle decisioni non ovvie.

**La voce porta la decisione e il rimando, non la forma.** Il ragionamento sui
tipi — `PlatformSession` che il campo non ce l'ha, e la garanzia che sta nella
forma e non nel rendering — resta nel contratto, che è dove il backend lo
eredita. Qui sta perché la spunta apre e non pubblica, e perché la strada
scartata non è stata scartata per gusto.

**Il §3 rimandava a §10.D per una cosa che §10.D non descriveva.** La riga sul
terzo componente uscito dal magazzino — `checkbox.tsx`, *«per la spunta che
apre il messaggio al paziente (§10.D)»* — è del 01.09.2026 e puntava a vuoto.
Adesso atterra: la voce 3 la spunta la descrive. **Il rimando non è stato
toccato**, è il bersaglio che è arrivato.

##### Il §10.D non aveva una voce per la chiusura delle fasce

Mancava del tutto — `setSlotStatus`, `ProfessionalSlot` e perché è separato da
`AppointmentSlot`, il gesto sul calendario, cosa il metodo rifiuta — mentre il
precedente era netto: l'annullamento del 17.08 ha preso la voce 3 e la
navigazione fra settimane del 18.08 la voce 5.

**La voce 6 è scritta sul comportamento di adesso**, non su quello del
01.09: comprende la resa delle celle e la riga *«la tua disponibilità»* della
passata mergiata con la PR #78, verificata in `master` prima di descriverla.

**Dice anche cosa non c'è**, che è metà del suo mestiere: **dichiarare fasce
nuove non esiste**, e con lui la ricorrenza settimanale. È una scelta di scope
già presa, elencata in `docs/CONTRATTO-DATI.md` §8.5 con l'altra metà che la
voce chiude, e la voce **rimanda invece di ripetere** — come rimanda a
`docs/PITCH.md` per il terzo tempo e il suo ordine vincolante.

**La voce 6 e non una voce 3-bis**, ed è la ragione per cui il numero è quello:
**quattro punti fuori da qui citano `§10.D.3`** — `docs/PITCH.md`, due verbali
di questo file e un commento di `src/lib/i18n/it.ts` — e tutti e quattro
parlano dell'annullamento. Rinumerare avrebbe rotto un rimando dentro `src/`,
che questa passata non può toccare.

##### Il §4 del contratto contava sei mutation e la tabella ne elencava sette

*«Le altre quattro restano»*, *«Sei dal 17.08.2026»*, *«le altre quattro sono
inserimenti»*: `setSlotStatus` è la settima e **non è un inserimento**.

**Le cifre non sono state aggiornate: sono state tolte.** È la stessa famiglia
che il `CLAUDE.md` §5.6 e §2.7 hanno già sciolto, e l'hanno sciolta scrivendo
il criterio invece del valore — un numero in prosa accanto alla lista che lo
smentisce invecchia a ogni passata, e portarlo a sette oggi vuol dire riaprirlo
alla prossima scrittura. **A contarle basta la tabella.**

**La distinzione che la frase portava è informazione vera e resta**, riscritta
sulle categorie invece che sui conteggi: chi **inserisce** un record
(`bookAppointment`, `submitRapidCheck`, `submitDemoRequest`), chi è un
**upsert** che prende lo stato desiderato (`saveSessionNote` e `setSlotStatus`
— ed è la ragione, scritta sul provider, per cui non esistono un `openSlot` e
un `closeSlot`), e `cancelSession`, che **cambia lo stato di un record
esistente senza riscriverlo**. `enterAs` resta a sé: non scrive un dato del
dominio ma la sessione, ed è la sola che in produzione può sparire.

##### Cosa dipendeva dal §10.D, cercato e allineato

**Nessun punto conta le voci di quella sezione**, verificato: gli unici
riferimenti numerici sono i quattro a `§10.D.3` qui sopra, e la voce 6 li
lascia dove sono.

**La definizione di "finito" dell'area portava una fotografia invecchiata da
M2.** Diceva che le date e i giorni della settimana *«oggi sbagliano in tutti e
quattro i punti in cui compaiono»*, mentre il §11 dichiara quelle quattro
coppie sparite con la lista che le conteneva e aggiunge *«da lì non ne resta
nessuna»*. È un **criterio** e non un verbale — è rivolto a chi verrà — quindi
si corregge con la data: **un criterio con dentro un «oggi» invecchia il giorno
in cui il criterio è soddisfatto**, ed è la famiglia «numero + avverbio» della
spazzata del 15.08.2026 sopravvissuta in una parentesi.

**L'inventario delle 27 schermate di M5.b non si muove**, ed è stato
controllato invece che dato per buono: la riga del calendario dichiara attesa
`null`, vuoto *«frase esistente sulla settimana»* ed `ErrorNotice` di pagina, e
tutte e tre restano vere — `ownSlots` è dentro il `loadState` della pagina,
quindi un suo guasto dà l'errore di pagina che la riga già dichiara.

**Sette punti toccati in tutto**: tre nel §10.D (voce 3 riscritta, la
qualificazione sul ricomparire, la voce 6), la definizione di "finito"
dell'area, il §4 del contratto, la voce chiusa nel verbale della passata
precedente, e questo verbale.

##### Verificato

- **`git diff --name-only` contro `master`: nessun file sotto `src/`**, e i
  tre soli file toccati sono `CLAUDE.md`, `docs/CONTRATTO-DATI.md` e questo;
- `typecheck` e `lint` a **zero**, eseguiti per provare quel «nessun file»;
- **la passata descritta è in `master`**: `78a43fd` è antenato di
  `origin/master` (PR #78), controllato con `git merge-base --is-ancestor`
  prima di scrivere la voce 6 — altrimenti avrebbe descritto uno stato
  intermedio;
- **niente verifiche a schermo, e va detto perché**: non c'è niente di nuovo a
  schermo. È la stessa forma delle passate documentali del 15.08.2026, del
  19.08.2026 e del 20.08.2026.

##### Trovato e non toccato

- **«Decisioni chiuse» si ferma al 14.08.2026**, e non è un difetto di questa
  passata né dei suoi tre disallineamenti: mancano **tutte** le decisioni dei
  founder dal 17.08 in poi — le parole, l'anteprima a tre pannelli, la cornice
  del trimestre, il nome dei pazienti, l'annullamento, il salto a data, il
  token dell'attesa, le rotte inglesi, i due testi e la chiusura delle fasce.
  La sezione dichiara di essere il posto in cui una decisione si trova *«senza
  dover leggere `CLAUDE.md` per intero»*, e da due settimane quella promessa
  non è più vera. **Aggiungere qui le sole due del 01.09 avrebbe lasciato il
  buco più difficile da vedere**, perché la sezione sembrerebbe aggiornata. È
  una passata sua, e va decisa: o si recupera l'arretrato, o la sezione
  dichiara di essersi fermata e rimanda ai verbali.

#### L'allineamento fra verbali e commenti (02.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il
comando in testa a questo file. **La ripartizione ha un criterio da dichiarare**,
perché altrimenti si legge come un errore: le modifiche dentro `src/` di questa
passata toccano **solo commenti**, quindi sono `docs:` anche se stanno in file
di codice — **il criterio del §2.8 è cosa cambia, non dove sta il file**. L'unico
`fix:` è quello che cambia una resa, e si vede a schermo.

**Nessun numero del §8 e del §9 si muove**, rotte **26**, schermate **27**,
`EXPECTED_KEYS` **791**, guardrail **115 = 102 + 13** — rimisurati con i criteri
del §2.7 e del §5.6, e nessuno dei due si è mosso. `build`, `lint` e `typecheck`
a zero.

##### Le tre passate del 01.09 si erano datate al 2 settembre

Le due passate delle fasce e quella dello scope avevano scritto **02.09.2026** in
**11 punti su 5 file** — `CLAUDE.md` (2), questo file (3),
`docs/CONTRATTO-DATI.md` (1), `prefetch.ts` (1), `ProCalendario.tsx` (4) — e
**nessun commit del repository è del 2 settembre**. La prova è il comando, non la
memoria:

```
git log -12 --format='%h %ad %s' --date=iso
```

dà #77 alle 21:36, #78 alle 22:35 e #79 alle 22:47, **tutte il 2026-09-01**.

**È la data di stesura, non il contenuto**, e la distinzione tiene in piedi la
regola per cui i verbali non si riscrivono: un resoconto datato resta quello che
è, e qui a essere sbagliata era **la data del resoconto**. Le intestazioni dei
due verbali sono cambiate con il resto, e questa riga è il posto in cui chi
legge trova scritto perché.

**E questa passata è caduta nello stesso errore, nel verso opposto** — l'ha
trovata la review, non chi scriveva. Correggeva tre passate datate un giorno
avanti e **si è datata un giorno indietro**: il verbale, la nota in «Decisioni
chiuse» e le due barrature dicevano 01.09.2026, mentre i suoi otto commit sono
del **2026-09-02**, fra le 16:59 e le 17:11. Quattro punti, corretti prima del
merge.

**La causa è la stessa in tutti e due i versi, ed è quella che vale**: la data
è stata presa **dalla memoria della sessione** invece che dall'orologio. Una
sessione lunga ricorda il giorno in cui è cominciata, o il giorno di cui ha
appena parlato per venti minuti, e nessuno dei due è necessariamente oggi —
questa passata ha passato l'ora precedente a scrivere «01.09» in prosa, ed è la
data che le è rimasta in mano. Da qui la riga aggiunta in testa a questo file:
**la data si legge da `date` e si controlla con `git log -1 --format='%ci'`
prima di scriverla**, che sono due comandi e non una convenzione.

##### Due verbali si contraddicevano

**Il messaggio di annullamento contava i guardrail in due modi.** In testa
diceva «da 111 a 112», duecento righe più in basso «da 111 a 113 e non a 112,
perché le chiamate sono due». La seconda è quella giusta e il §5.6 la porta:
**barrata con la data**, come il file fa altrove, invece di riscrivere un
resoconto.

**Un verbale di M3 mandava a M5 una scrittura che M5 non ha portato.** Diceva
*«la scrittura vera dell'admin arriva con le guardie di ruolo di M5»*: le
guardie sono del 12.08.2026 e **non hanno portato nessuna scrittura del
back-office** — verificato, non ricordato: `provider.ts` non ne ha una e la
tabella delle mutation del `docs/CONTRATTO-DATI.md` §4 non ne elenca nessuna.
Adesso rimanda al **perimetro dell'MVP**, e al perimetro e non a un gruppo per
la ragione che sta più sotto, fra le cose non toccate.

##### «Decisioni chiuse» è tornata a dire il vero

La sezione dichiara di essere il posto in cui una decisione dei founder si trova
*«senza dover leggere `CLAUDE.md` per intero»*, e la sua ultima voce era del
14.08 mentre `CLAUDE.md` e `docs/PITCH.md` ne portavano **diciannove** datate
dopo. **Per due settimane quella promessa non era vera**, ed è il difetto che la
passata precedente aveva dichiarato senza chiudere.

**Il criterio con cui sono state raccolte**, perché il recupero sia rifacibile:
si cercano le **attribuzioni datate** in `CLAUDE.md` e in `docs/PITCH.md` — la
parentetica `(founder, gg.mm.aaaa)` e le forme «decisione dei founder del …» —
si tengono le date **≥ 17.08.2026**, e si scarta ciò che è **un criterio scritto
da una passata** invece che una decisione presa: una data fra parentesi non è
un'attribuzione. `docs/PITCH.md` non ne porta nessuna dopo il 14.08, e l'unica
sua voce recuperata — la conferma demo che non nomina l'azienda — è attribuita
dal verbale che la racconta.

**Una voce per decisione**, nella forma delle esistenti e nell'ordine
cronologico inverso che la sezione usa già: **data e motivo qui, la regola resta
dove vive**. In testa alla sezione c'è ora la nota che l'arretrato è stato
recuperato, con il rimando a questo verbale per il criterio.

##### I commenti che descrivevano un prodotto che non esiste più

Quattro punti certi, più uno trovato dalla spazzata:

| dove | diceva | adesso |
|---|---|---|
| `it.ts`, testata | «Oggi c'è l'area professionista, che è quella migrata da M2» | le cinque aree sono di M3 e i dizionari sono quattro; **quante siano lo dice `EXPECTED_KEYS`** |
| `it.ts`, `admin.sessions.privacyNote` | `ProfessionalSession` non ha un campo per il nome | è **`PlatformSession`**: dal 17.08.2026 la proiezione di chi cura il nome ce l'ha |
| `LocaleSwitcher.tsx` | «Finché `fr.ts` ed `en.ts` non esistono, `FR` ed `EN` non compaiono» | esistono dal 14.08.2026: resta **la regola** — le sole lingue registrate in `DICTIONARIES`, oggi quattro |
| `mock/provider.ts` | il JSDoc di `applyCancellation` stava sopra `slotKey`, che ha il suo | spostato sopra il metodo che descrive, **testo invariato** |
| `types.ts`, `ServiceUsageMonth` | «Il guardrail arriva con il dataset … si fissano lì quando M3 li costruisce» | il guardrail è in `mock/service-usage.ts` da M3 e ne sorveglia **quattro**; i tre totali sono nel §8 dal 07.08.2026 |

**Il quinto l'ha trovato la spazzata**, ed è la famiglia che il §11 governa: *un
commento che nomina una milestone è una data che scade*.

##### La spazzata, con il criterio e l'esito

```
grep -rn -i "finché|oggi c'è|non esiste ancora|arriva con|resta da fare|TODO" \
  src --include="*.ts" --include="*.tsx" --include="*.jsx"
```

**74 riscontri, e 37 sono rumore dello strumento**: `-i` fa agganciare `TODO`
dentro la parola **«metodo»**, che in questo repository è ovunque. Vanno saltati
per primi, o la spazzata sembra tre volte più grande di quello che è — ed è la
stessa famiglia delle trappole di misura che questo file registra da M1.

**37 riscontri veri, esaminati uno per uno sul codice.** Uno era falso ed è
stato corretto; gli altri 36 tengono, e il criterio è che la frase dica una cosa
**dimostrabile oggi**:

- **falso, corretto** — `lib/data/types.ts:1061`, il guardrail «che arriva»;
- **vere e ancora aperte** — le tre testate di `de.ts`, `fr.ts` ed `en.ts` sulla
  revisione madrelingua: è una decisione in sospeso di questo file, non una
  frase invecchiata;
- **vere e a schermo** — `it.ts:312` (`doneHint`, che dal 20.08 descrive un
  tocco davvero reversibile), `it.ts:1676` (la ricerca completa è paginazione,
  §8.12), `it.ts:1797` (`isBookable`);
- **vere e storiche**, cioè frasi che raccontano com'era e lo dicono —
  `AdminLayout.tsx:28`, `query-client.ts:39` e `:63`, `platform-metrics.ts:10`,
  `i18n/index.ts:17` e `:41`, `queries.ts:420`, `provider.ts:504`,
  `DemoRequest.tsx:35`, `fault-injection.ts:43`;
- **vere e di comportamento**, cioè condizioni che il codice accanto realizza —
  `RapidCheckCard.tsx:174`, `SortableTable.tsx:14`, `it.ts:785`,
  `queries.ts:115`, `provider.ts:268` e `:487`, `types.ts:576`, `:580`, `:705`,
  `:766`, `:886`, `mock/provider.ts:160`, `mock/professional-portal.ts:403`,
  `mock/platform.ts:703`, `ProSessioni.tsx:222`, `:246`, `:399`, `:403`,
  `ProPagamenti.tsx:33`, `HRDipendenti.tsx:54`, `HRDashboard.tsx:340`,
  `Landing.tsx:196`, `Checkup.tsx:119`, `AdminSessioni.tsx:32`,
  `AdminProvider.tsx:23`.

**Il trentasettesimo è di questa passata**: il commento nuovo di `Profilo.tsx`,
che dice *«finché `getEntitlement` non risponde `null`»* — vero, ed è il §3 del
contratto.

##### La riga coach del profilo seguiva una regola sola su due schermate

La home rende il contatore coach **solo se il piano ha il coach**, con la
ragione scritta accanto: `coachSessionsPerYear` assente vuol dire che il
contratto commerciale non prevede il servizio (§9), non che il tetto sia zero.
**Il profilo la rendeva sempre**, cioè due schermate della stessa area con due
regole.

**La lettura non si è mossa**: `useEntitlement("coach")` è un hook e si chiama
su qualunque piano. A cambiare è la resa, e resta mestiere della schermata
finché `getEntitlement` non può rispondere `null`
(`docs/CONTRATTO-DATI.md` §3).

##### Verificato

- **A schermo, sulla build demo, viewport 1280×900**, con la tecnica del
  10.08.2026 — dataset rotto ad arte e **ripristinato subito**, con l'albero
  ricontrollato pulito dopo: portando Demo SA sull'Essenziale il profilo
  **prima** diceva *«Sessioni coach 1 su 0»*, **dopo** la riga sparisce e lo
  psicologo legge *«3 su 6»*. Provato nei due versi con `git stash` sulla sola
  `Profilo.tsx`;
- **su Demo SA, che è Plus, non cambia niente**: *«3 su 10»* e *«1 su 4»*, su
  scheda nuova e con la **console muta**;
- **le date del 2 settembre che restano sono le sue**, ed è la misura rifatta
  dopo la correzione della review — prima il conto era **zero secco**, ed è la
  riga che la correzione ha reso falsa. Un `grep` di `02.09.2026` dà **zero** in
  `CLAUDE.md`, in `src/`, in `docs/CONTRATTO-DATI.md` e in `docs/PITCH.md`, e
  **sei** in questo file: **quattro sono le date di questa passata** — il
  verbale, la nota in «Decisioni chiuse» e le due barrature — e **due non sono
  date**, sono il motivo di ricerca citato nel testo, una volta nella frase che
  dice cosa le tre passate avevano scritto e una in questa riga. È la trappola
  del §5.6 su un'altra cifra: **i riscontri si leggono uno per uno**;
- **la struttura delle intestazioni di questo file confrontata con `cc389ff`**:
  identica, tranne le due voci nuove — ed è il controllo che ha trovato il
  difetto qui sotto;
- `build`, `lint` e `typecheck` a zero; guardrail **102 + 13**, chiavi **791**
  sull'albero, `EXPECTED_KEYS` **791**;
- **cosa non è stato verificato a schermo**: niente delle sezioni A–E, perché
  sono date, commenti e documenti — a schermo non cambia una riga, e i due
  comandi che lo dimostrano sono `lint` e `typecheck`, che non potevano
  muoversi e infatti non si sono mossi. Le quattro lingue non sono state
  ripercorse: **nessuna stringa dei dizionari è stata toccata**, e
  `EXPECTED_KEYS` fermo a 791 è la prova.

##### Trovato e non toccato

- **L'intestazione di «Punto di partenza» era stata cancellata**, ed è un
  difetto di `0ebafed`, cioè della passata precedente e mia: il verbale nuovo
  era stato inserito sopra quella sezione senza rimetterne il titolo, quindi il
  suo contenuto si leggeva come la coda del verbale. **Rimessa in un commit
  suo**; a trovarla non è stata una rilettura ma il confronto dell'albero delle
  intestazioni contro `cc389ff`, che è il controllo da rifare dopo ogni
  inserzione in mezzo a un file lungo;
- **L'approvazione di un professionista non è in nessun gruppo del §8** del
  contratto, e per questo il rimando del verbale di M3 è al perimetro e non a un
  gruppo. Controllati tutti e dodici: §8.3 ha l'onboarding dell'azienda, §8.6 il
  catalogo delle strutture, e il vetting non sta né lì né altrove. **Non è stato
  aggiunto un gruppo**: dove va collocato è una decisione dei founder, perché il
  §8 dichiara che l'ordine dei gruppi è quello in cui vanno affrontati;
- **`fault-injection.ts:43` dice «`?role=` è la terza, e arriva con il blocco
  d)»**, e il blocco d) è chiuso dal 12.08.2026. Non è stata toccata perché non
  è una previsione: dice **da dove viene** la manopola, ed è vero. La riga è qui
  perché è il riscontro della spazzata su cui si esita più a lungo.

#### Le parole che espongono e le promesse che non teniamo (04.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Nessuna schermata nuova**: le rotte restano **26** e le
schermate **27**. Una rotta cambia indirizzo e una cifra nuova entra a schermo,
ed è la prima volta per una passata di refinement: le due cose hanno la loro riga
in testa alla sezione e in `CLAUDE.md` §9 e §10.

**Cosa muove i numeri di questo file**: `EXPECTED_KEYS` da **791** a **794** — tre
chiavi nuove, nessuna tolta — e i guardrail da **115** a **116**, `103 + 13`,
rimisurati con i criteri del §5.6 e del §2.7. `build`, `lint` e `typecheck` a zero.

**Lo scopo, detto una volta**: togliere dalla demo le parole che la espongono —
dispositivo medico, AI Act, pubblicità sanitaria — e le promesse che il prodotto
non mantiene. **Senza aggiungere funzioni**: sono stringhe, un campo di piano, una
rotta e documenti. Le decisioni sono dei founder e stanno in «Decisioni chiuse».

##### Il piano non è «AI» e non è «prevenzione»

**Il criterio è lo scopo dichiarato, ed è la ragione per cui la regola sta nel
§7** e non in una nota di copy: è il criterio con cui si decide se un software è
un dispositivo medico. Un piano *"di prevenzione"* e un punteggio *"a rischio"*
affermano che il prodotto **previene una malattia** e **classifica lo stato
clinico** di chi lo usa. Il prodotto sotto è identico; a cambiare è ciò che
dichiariamo di fare, che è la sola cosa che quel criterio guarda.

Cambiate le etichette: la voce di menu, il titolo del piano, la card della home,
le due righe del listino, l'hero e il blocco «per il dipendente» della landing, il
suggerimento sotto l'area più debole, e `healthSummary.at_risk`, che diceva **«A
rischio»** e dice **«Da seguire»**. Quattro lingue, e la rotta con loro:
`/employee/ai-plan` → **`/employee/wellbeing-plan`**.

**I riscontri sono stati valutati uno per uno, non sostituiti**, e ne restano
otto in quattro lingue — due famiglie, dichiarate nel §7:

| dove | perché resta |
|---|---|
| `public.roi.*` — *"30% della popolazione a rischio"* | è **un costo aziendale**, non una persona che legge di sé |
| `employee.checkup.report.*` — *"il rischio da stress risulta moderato"* | lo scrive **il medico del centro**, ed è l'unico dato sanitario individuale del dominio |

**Il referto ha avuto bisogno di una parola lo stesso, e non è il divieto**:
mandava a *"segui il piano di prevenzione"*, cioè a un piano che nell'app non si
chiama più così. È cambiato **il nome del piano**, non il registro clinico della
frase — *una cosa, una parola* (§7) vale anche quando la parola sta in una frase
esente.

**Due riscontri non sono stati toccati e vale la pena dire perché**, perché sono
i due su cui si esita:

- **la bio della Dr.ssa Keller** — *"con attenzione alla prevenzione"* — è **una
  professionista che descrive il proprio metodo**, e il §7 la protegge da sempre:
  *un professionista parla come parlerebbe lui*. La regola riguarda ciò che **il
  prodotto** afferma di calcolare, ed è scritta così apposta;
- **le negazioni** — *"l'azienda non vede mai sessioni, referti, diagnosi"*,
  *"una diagnosi da qui non posso farla"* — sono **la protezione**, non la
  promessa. Toglierle avrebbe indebolito ciò che la regola difende.

**I nomi interni non seguono**, per la decisione del 19.08.2026: `PianoAI.tsx`,
`AiHealthPlan`, `useAiHealthPlan` e la chiave di cache `["employee", "ai-plan"]`
restano. **E il vecchio indirizzo non redirige**: dà la 404, verificata a schermo,
come i quindici del 19.08.2026 — il giro del pitch non digita indirizzi, quindi un
redirect sarebbe un ramo che nessun percorso produce (§11).

##### Le promesse che il prodotto non mantiene

Quattro, e ognuna sostituita **dal fatto che c'è sotto** invece che ammorbidita.

**La crittografia**, che era una decisione in sospeso dal 15.08.2026 e si chiude
qui: *"Crittografia end-to-end … con standard AES-256"* diventa *"Cifratura in
transito e a riposo"* e *"I dati sanitari viaggiano cifrati (TLS) e sono
conservati cifrati"*. **Le due parole sono uscite per due ragioni diverse**:
"end-to-end" ha un significato tecnico preciso e **incompatibile** con un backend
che calcola aggregati e conserva le note; "AES-256" non è incompatibile, è **un
impegno che nessuno ha preso**, su un dettaglio che al lettore non dice niente. Il
chip della landing era il punto più esposto — lo vede chiunque apra la demo — e
porta la stessa frase della pagina privacy HR.

**La cadenza del check rapido**, anch'essa in sospeso dal 15.08.2026: il
`doneHint` perde *"Poi te lo chiediamo di nuovo"*. **Chiusa togliendo, non
decidendo** — sceglierne una sarebbe stato lo stesso difetto con una parola più
precisa — e quale sia la cadenza resta dei founder, con il vuoto dov'era già
(`docs/CONTRATTO-DATI.md` §3).

**Il colloquio conoscitivo**, che era *"gratuito"* e ora è *"incluso"*: in Ticino
le professioni sanitarie non possono offrire prestazioni gratuite. Al dipendente
la frase dice la stessa cosa e la dice dal lato che non espone chi eroga.

**L'informativa della richiesta demo**, che prometteva *"trattati in conformità
alla LPD svizzera e al GDPR"* a una persona che scrive nome, email e telefono
**veri**, con dietro nessun trattamento, nessuna conservazione e nessun titolare.
Adesso dice il fatto: **la richiesta resta nel browser e non viene inviata a
nessuno**, che è vero per costruzione perché il provider vive in memoria
(`CLAUDE.md` §10). **La stessa cosa nel footer**, sotto il copyright, in quattro
lingue — *"Demo dimostrativa · dati di fantasia · nessun dato lascia questo
browser"* — perché il footer è l'unico punto comune alle quattro rotte pubbliche.

**Le cinque stringhe della residenza dei dati non si toccano**: quella decisione
è commerciale e resta aperta. La distinzione è la sostanza della passata — si è
sostituita **la promessa che si poteva rimpiazzare con un fatto**, non quella che
aspetta qualcuno.

##### Le fonti del calcolatore, e le due voci che non ne hanno

Il calcolatore citava *"Fonti: SECO, Job Stress Index"*: due nomi senza anno e
senza perimetro, cioè una bibliografia che non si può controllare. Gli anni
vengono dalle pp. 5-7 del Business Plan e **niente è stato inventato**.

**Due delle quattro voci delle perdite non hanno nessuna fonte nel documento** —
il turnover, con i suoi CHF 50.000 per abbandono, e i CHF 65.000 di stipendio
medio che la voce pre-burnout moltiplica. Sul turnover la frase dice quello che il
BP dice di sé stesso, *stima conservativa*; l'altra è rimasta fuori. Entrambe sono
ora il **quinto fatto** fra i «Business Plan da riallineare».

**Confindustria e la scala di Stanford restano nel documento e non a schermo**
(founder): sono italiana e americana, e uno scenario conservativo svizzero che vi
si appoggia invita la domanda sbagliata.

##### Le 72 ore, che sono l'unica cosa che questa passata aggiunge

`Plan.firstSessionWithinHours` è **72 su tutti e tre i piani**, obbligatorio come
`hrDashboard` e per la stessa ragione: il §9 lo dichiara per tutti e tre, quindi
non esiste il caso *"il contratto commerciale non lo prevede"*. Oggi i tre valori
coincidono e **il campo esiste lo stesso invece di essere una costante**: è una
promessa commerciale, quindi il giorno in cui un piano la stringe cambia il dato e
non la schermata.

**Sostituisce le "24 ore, nessuna lista d'attesa" del BP** (p.11) sotto la regola
del §10.B.1, e la ragione non è prudenza: **le 24 ore il dataset non le regge**.
La prima fascia libera della rete cade il **24.09 alle 09:00** ed è della sola
Dr.ssa Colombo, quindi la promessa sarebbe vera per un professionista su quattro
davanti a una schermata che li elenca tutti. La seconda metà della frase — *nessuna
lista d'attesa* — **non si trascrive**: afferma l'assenza di un oggetto che il
prodotto non ha, e la lista d'attesa è una voce del perimetro dell'MVP. È il
**sesto fatto** da riallineare.

**È il primo numero commerciale del §9 con un guardrail dietro**, ed è ciò che lo
rende diverso da una riga di listino: `mock/scheduling.ts` verifica che almeno un
professionista **prenotabile** abbia una fascia libera nella finestra — la
Dr.ssa Keller non conta, il mandato non è firmato e la prenotazione non la propone.

**Il guardrail sa fallire, ed è stato provato invece che dedotto**: portando il
campo a 1 ora la build demo logga *"Nessun professionista prenotabile ha una fascia
libera entro 1 ore dal giorno della demo"*, e il dataset è stato rimesso a posto
subito, con l'albero ricontrollato pulito e la console muta su una scheda nuova. È
la tecnica del 10.08.2026.

A schermo la promessa sta in due punti, e tutti e due leggono dal piano: **il
listino**, dove è la **prima** voce perché è l'accesso e le righe sotto sono cosa
si ottiene una volta dentro, e **la testata della prenotazione**, dove la domanda
che risponde viene fatta davvero. `docs/PITCH.md` guadagna la risposta pronta sulla
LAMal, che prima non esisteva.

##### Verificato

- **a schermo, sulla build demo, viewport 1280×900**, su landing, `/plans`,
  `/roi`, `/demo`, `/employee`, `/employee/wellbeing-plan`,
  `/employee/psychologists` e `/hr/privacy`, **nelle quattro lingue**: ogni
  stringa cambiata è stata letta dove si vede, non nel diff;
- **il check rapido**, toccato davvero: dopo la risposta la card dice *"Grazie,
  registrato."* e *"Puoi cambiare la risposta finché è oggi."*, senza la seconda
  frase;
- **il vecchio indirizzo dà la 404** con il messaggio che nomina il percorso;
- **console muta su scheda nuova**, cioè nessun guardrail loggato dalla build
  demo — che con `assertInDev` è anche la prova che i 116 passano tutti;
- **nessun overflow orizzontale in tedesco**, che è la lingua lunga:
  `scrollWidth === clientWidth` su landing, `/plans`, `/employee`,
  `/employee/psychologists` e `/employee/wellbeing-plan`;
- **i cinque numeri di ancoraggio del §9 non si muovono**: `/roi` a N=100 mostra
  CHF 1'289'500, CHF 221'150, CHF 66'000, CHF 155'150 e 2.35:1;
- **`EXPECTED_KEYS` 794** sull'albero sintattico nei quattro dizionari, con il
  comando del §2.7, e **116 = 103 + 13** call site con il criterio del §5.6.

##### Trovato e non toccato

- **La landing non mostra le 72 ore.** L'anteprima piani dichiara le proprie voci
  per chiave (`PREVIEW_FEATURES` in `Landing.tsx`), quindi la riga nuova non entra
  finché non la si aggiunge lì — e **quale sottoinsieme mostri l'anteprima è una
  scelta editoriale di quella schermata**, non una conseguenza. Va detto perché
  chi legge *"il piano porta la promessa"* si aspetta di trovarla sulla prima
  schermata del pitch, e lì non c'è. È una decisione dei founder.
- **`docs/PROGRESS.md:1281` cita `/employee/ai-plan`** nell'inventario di M5.b:
  è un verbale datato e non si riscrive (`CLAUDE.md` §10, gli indirizzi cambiano
  e i verbali no).
- **`docs/PITCH.md` dice "sedute" in tre punti di prosa** — le KPI del
  calendario, la seduta da annullare, le sedute della professionista — mentre la
  sua stessa riga in testa prescrive *"si dice sessioni, mai sedute"*. Non è testo
  a schermo, quindi il §7 non lo copre; è il documento che non segue il proprio
  consiglio, ed è una passata di lettura, non di questa.
- **Il messaggio del guardrail nuovo dice "entro 1 ore"** quando lo si rompe con
  il valore 1. È testo per chi sviluppa e non passa da `i18n`, quindi la regola
  delle frasi intere del §2.7 non lo tocca — ma chi lo leggesse per la prima volta
  ci inciampa.
- **Il consenso resta l'unica voce aperta della sua classe.** Delle tre che
  l'intestazione delle decisioni in sospeso contava, due si chiudono qui: resta
  quella che afferma un **fatto giuridico compiuto**, che è anche la più grave, e
  non si chiude riscrivendo una frase.

#### La soglia di anonimato, e la sottrazione che non deve esistere (04.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Nessuna schermata nuova e nessuna stringa nuova**: le
rotte restano **26**, le schermate **27**, `EXPECTED_KEYS` **794**. I guardrail
passano da **116** a **119** — `106 + 13`, col criterio del §5.6 — e **nessun
numero a schermo si muove**: la passata aggiunge due invarianti e non tocca né la
media aziendale né le serie.

##### La domanda di partenza, e perché la risposta è cambiata

La richiesta era **togliere il conteggio dei misurati dalla riga soppressa**, con
la garanzia nel tipo: `StressRecord` avrebbe perso `measuredEmployees` sulla
variante `suppressed`, perché da quel numero il punteggio di un reparto sotto
soglia si ricalcola per sottrazione.

**L'aritmetica è giusta, e le condizioni in cui vale non ci sono.** Vale la pena
scriverla per esteso, perché è la ragione per cui l'invariante nuovo esiste.
Chiamando `m` i misurati e `s` i punteggi, se l'aggregato aziendale comprendesse
anche il reparto soppresso varrebbe

```
media × Σm = Σ(sᵢ × mᵢ)     su TUTTI i reparti
```

e chi guarda la dashboard ha già il lato destro per i reparti pubblicati —
punteggio e misurati stanno su ogni riga della tabella — più il proprio `m` per
il soppresso. Resta un'incognita sola, `s`, e si ricava.

**Misurato sul dataset di oggi, prima di muovere qualunque cosa**, e sono due
fatti indipendenti:

- **l'aggregato non contiene il reparto soppresso.** `buildCompanySeries`
  (`mock/measurement.ts`) lo esclude da **numeratore e denominatore**, quindi
  l'equazione qui sopra non si scrive: la media aziendale non ha dentro niente
  della Direzione. Ricalcolata a mano dai dodici mesi, la serie fa
  `53 52 52 51 50 50 49 48 48 48 47 46` — cioè esattamente quella del §8 — con
  pesi da 75 a 87, che sono la somma dei soli pubblicati;
- **la Direzione non ha punteggi.** `SCORES.board` è `null` in tutti e dodici i
  mesi: non c'è un valore soppresso, c'è un reparto che non si è mai potuto
  misurare. Anche con l'equazione risolvibile non uscirebbe niente.

##### Perché il conteggio resta

**Un conteggio di partecipazione non è un dato sanitario.** Dice quante persone
hanno risposto, non come stanno: è il denominatore della pubblicabilità, non una
misura di nessuno. Confonderlo con il punteggio è lo stesso passo falso che il
`CLAUDE.md` §8 vieta al contrario — *lo stress non si deduce mai dal
comportamento* — letto dall'altra parte.

**E toglierlo costerebbe la riga che rende leggibile la tabella.** Il §8 lo
prescrive con un caso concreto: Direzione e HR + Legale hanno **lo stesso
organico**, 15, ed esiti opposti. A schermo oggi sono

| | |
|---|---|
| `HR + Legale` | 15 dipendenti · **14 misurati** · 26% · Basso |
| `Direzione` | 15 dipendenti · **11 misurati** · 🔒 Sotto soglia |

e senza il secondo numero la seconda riga direbbe soltanto *"15 dipendenti"*
accanto a un lucchetto: chi guarda vedrebbe **che** è soppressa e non più
**perché**. È anche l'argomento su cui `docs/PITCH.md` costruisce due risposte
pronte — *"HR + Legale ha lo stesso organico ed è pubblicabile: è per questo che
i misurati stanno su ogni riga"* — e sarebbero diventate indimostrabili sulla
schermata che le sostiene.

**La difesa non è a schermo, ed è questo il punto della passata**: togliere un
termine da un'equazione è una difesa solo finché l'equazione non si riscrive. A
proteggere è che **l'equazione non esista**, cioè che l'aggregato non contenga il
reparto — e quello è un vincolo sul backend, non sul rendering.

##### Perché la via di mezzo non regge

Era la terza strada considerata: **il tipo perde il campo** — garanzia
strutturale per chi scriverà il backend — **e la schermata continua a mostrare il
numero** leggendolo da un'altra parte. Non regge, e per la regola che questo
repository ha già scritto due volte: **il provider è l'unica fonte** (§5.1), e
reintrodurre un dato da fuori è la porta di servizio che il tipo esisterebbe per
chiudere. Sarebbe la stessa forma del *"non lo si risolve facendo scegliere alla
schermata cosa rendere"* con cui il §10.D.2 tiene il nome del paziente fuori dal
back-office, applicata al contrario e per questo sbagliata.

##### I due invarianti, scritti e resi eseguibili

**Il primo: la media aziendale esclude i reparti soppressi da numeratore e
denominatore.** Era scritto in tre punti — `CLAUDE.md` §8, il commento di
`buildCompanySeries`, il `docs/CONTRATTO-DATI.md` §3 — ed **eseguito in
nessuno**. Adesso è un guardrail in `mock/stress.ts`, e la scelta di dove metterlo
è metà del lavoro:

**confronta le due serie che escono dal provider**, non la serie contro
l'espressione che l'ha prodotta. Ricalcolarla da `DEPARTMENT_MONTHS` avrebbe
verificato `buildCompanySeries` contro sé stessa — la trappola che il
`docs/CONTRATTO-DATI.md` §3 nomina a proposito della data delle note di sessione.
Il lato destro è fatto dei soli record **pubblicati**, cioè di ciò che il client
vede: se la media che gli arriva non si ricostruisce da lì, porta dentro
qualcosa che lui non ha. Sono **due assertion e non una**, perché i due modi di
sbagliare sono diversi: il punteggio, e il peso.

**Provato rompendolo**, non dedotto: spostando `weight += …` sopra la guardia di
pubblicabilità — cioè facendo rientrare il reparto soppresso nel solo
denominatore, che è il caso subdolo perché la media resta plausibile — la build
demo logga **ventiquattro righe**, due per mese. Ripristinato con `git checkout`
e riverificato con la console muta su una scheda nuova.

**In produzione quel guardrail non esiste**, perché sparisce con `mock/`: è il
motivo per cui il §3 del contratto ora scrive l'aritmetica per esteso invece di
rimandare al codice.

**Il secondo: la soglia ha un pavimento, 5** (founder, 02.09.2026). Resta una
proprietà del cliente — aziende diverse possono averne di diverse — ma sotto 5 un
punteggio di reparto è la media di un gruppo che chi ci lavora sa nominare. Un
guardrail in `mock/company.ts` lo verifica sull'unico cliente che c'è.

**Il pavimento e il default sono due numeri con due mestieri**, e il contratto lo
dice perché confonderli significa consegnare a ogni cliente il minimo legale: il
pavimento è ciò sotto cui nessuno può scendere, il **default di produzione è
10**, e **il 12 di Demo SA è un valore del dataset** con la sua ragione nel §8.

##### Verificato

- **A schermo, sulla build demo, viewport 1280×900, nelle quattro lingue**: la
  tabella «Stress per reparto» di `/hr` è **identica a prima**, riga per riga, e
  la Direzione porta ancora *"15 dipendenti · 11 misurati"* con «Sotto soglia» e
  il lucchetto — `15 Mitarbeitende · 11 gemessen`, `15 collaborateurs · 11
  mesurés`, `15 employees · 11 measured`;
- **i numeri della dashboard non si muovono**: 120, soglia 12, CHF 14'200, 16
  giorni, 68%, 82 su 120, 41 attivi, 142 su 1'200;
- **la serie aziendale ricalcolata a mano** dà i dodici valori del §8, e i pesi
  sono la somma dei soli reparti pubblicati;
- **console muta su scheda nuova** in tutte e quattro le lingue, cioè i 119
  guardrail passano;
- `build`, `lint` e `typecheck` a zero; `EXPECTED_KEYS` fermo a **794**, che è la
  prova che nessuna stringa è stata toccata.

##### Trovato e non toccato

- **Il tipo `StressRecord` continua ad ammettere `measuredEmployees` sulla
  variante soppressa**, ed è una scelta e non un residuo: è il campo che la
  tabella mostra. Chi rileggesse la richiesta di partenza in questo file deve
  sapere che la garanzia è stata spostata **dall'assenza del campo all'assenza
  dell'equazione**, non dimenticata.
- **`getLatestStressByDepartment` resta l'unico punto in cui un reparto senza
  record sparisce dall'elenco** invece di comparire soppresso: è già dichiarato
  nel `docs/CONTRATTO-DATI.md` §3 come una scelta del backend, e questa passata
  non la tocca.
- **Il guardrail nuovo confronta due serie che oggi hanno la stessa lunghezza per
  costruzione.** Se un giorno le due divergessero — dodici record aziendali e
  undici di reparto — il `record === undefined` le salterebbe invece di
  segnalarle. Non è un difetto oggi: un guardrail accanto verifica già che ogni
  reparto abbia esattamente `HISTORY_MONTHS.length` rilevazioni.

#### Il numero d'emergenza dove il segnale peggiore si dichiara (05.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Nessuna schermata nuova e nessuna scrittura nuova**: le
rotte restano **26**, le schermate **27**, i guardrail **119** — `106 + 13`, col
criterio del §5.6 — e **nessun numero della dashboard si muove**.
`EXPECTED_KEYS` passa da **794** a **799**: cinque chiavi nuove, nessuna tolta.

##### Il vuoto che questa passata riduce, e quello che non tocca

Il `docs/CONTRATTO-DATI.md` §8.1 lo diceva da sempre e lo diceva bene: il 144 era
a schermo **in due punti, tutti e due nella chat del medico virtuale** — cioè
dentro una conversazione, dove qualcuno sta già parlando — mentre **il check
rapido era il punto in cui il valore peggiore si dichiara senza parlare con
nessuno**. Una risposta, un tocco, nessun interlocutore e nessun numero.

Da oggi toccando **«Molto male»** compaiono, sotto i cinque volti: il **144**, il
**143** del Telefono Amico, un pulsante che porta alla prenotazione di uno
psicologo, e una riga che dichiara cosa il prodotto **non** fa.

**Un numero non è un percorso, e il verbale lo scrive perché la voce del §8.1
resta la prima del perimetro**: il lavoro non era *aggiungere il 144 da qualche
parte*, era **dare al segnale peggiore un posto dove arrivare**. Questa passata
toglie l'assurdo — una persona che dichiara di stare malissimo e non vede nemmeno
un numero — e **non costruisce il percorso**. Restano fuori, e sono nominati uno
per uno nel §8.1: la presa in carico, il responsabile clinico, il consenso al
contatto, e i segnali nella chat.

##### La riga che dice cosa il prodotto non fa

*«Kora non avvisa nessuno al posto tuo. Il tuo referente clinico può contattarti
solo se lo hai chiesto tu.»*

**È la frase su cui si è deciso di più**, e le sue due metà fanno due cose
diverse. La prima **dichiara l'invariante**: nessun allarme automatico, nessuna
soglia che produce una segnalazione a un essere umano. È l'unica affermazione
della passata che sia vera per costruzione, ed è quella che va detta a chi sta
male — perché l'alternativa, cioè lasciarlo intendere, è la cosa che si scopre nel
momento peggiore.

La seconda metà **nomina un consenso che non esiste**, ed è deliberato: *"solo se
lo hai chiesto tu"* descrive una condizione che oggi nessuno può soddisfare — non
c'è un campo, non c'è una scrittura, non c'è una schermata dove chiederlo (§8.2
del contratto). **Dice cosa il prodotto non fa senza promettere il meccanismo che
manca**, ed è la stessa disciplina con cui l'informativa della richiesta demo, il
04.09.2026, ha sostituito una promessa di conformità con un fatto verificabile.
Il consenso arriva quando arriva il modulo che lo raccoglie.

##### I due numeri stanno nel componente, e non è una scorciatoia

**Non sono nelle stringhe**, benché siano testo a schermo, e la ragione è il §5.5:
**lo stesso valore alimenta la frase e il link `tel:`**. Scritti due volte — una
dentro la traduzione e una dentro l'`href` — potrebbero divergere, e qui divergere
vuol dire **comporre una chiamata sbagliata**. Le stringhe portano `{number}`,
che è anche ciò che lascia al tedesco e al francese l'ordine che vogliono.

**Non vengono nemmeno dal provider**, e neanche questa è una dimenticanza: in
produzione i numeri seguono **il paese della persona** — 144 in Svizzera, 112 in
Italia — e `EmployeeProfile` un paese non ce l'ha, esattamente come non ha una
lingua (`docs/CONTRATTO-DATI.md` §8.8). Il **modulo paese è lavoro dell'MVP**, e
un campo che il dataset non sa riempire onestamente non si aggiunge al contratto
per anticiparlo (§11). I due valori entrano invece in `CLAUDE.md` §8, che è dove
il §2.4 vuole le cifre prima che vadano a schermo.

**Restano tre occorrenze del 144 nel repository**, ed è il conto che il §8.1
dichiara: le due della chat vivono **dentro frasi in prosa** — *"in caso di
emergenza chiama il 144"* — dove il numero non alimenta nessun link e non ha un
gemello da cui divergere. Non sono state toccate: unificarle avrebbe voluto dire
riscrivere due frasi in quattro lingue per una simmetria che non chiude nessun
difetto.

##### Dove sta il blocco, e perché non dove sembrava

**Sotto i volti, non sotto «Grazie, registrato».** Inserirlo fra l'intestazione e
la riga dei cinque volti li avrebbe spostati **sotto il dito** nell'istante del
tocco, che è precisamente ciò che il commento di quella riga esiste per evitare —
*"la card non salta sotto le dita al tocco"*. Così la card cresce verso il basso e
la scelta resta dov'era, verificato toccando.

**Nessuno stato nuovo**: la condizione è `answer?.value === 5`, letta dal valore
già registrato. Ne discendono due comportamenti che si vedono e che sono giusti
tutti e due — sopravvive a un cambio di schermata, perché la risposta vive nel
provider, e **non sopravvive a una risposta diversa**, perché è la risposta il
suo unico stato.

##### Verificato

- **A schermo, sulla build demo, viewport 1280×900, nelle quattro lingue**: il
  blocco compare toccando «Molto male» e **sparisce cambiando risposta** —
  provato nella sequenza `Bene → Molto male → Non bene → Molto male`, con i link
  `tel:` contati a ogni passo: **0, 2, 0, 2**;
- **i due link compongono i numeri giusti**: `tel:144` e `tel:143`, con il testo
  che li contiene — `144 — Notruf, rund um die Uhr`, `143 — La Main Tendue, 24 h
  sur 24`, `143 — Telefono Amico, around the clock`;
- **il pulsante porta davvero alla prenotazione**: cliccato in tedesco, atterra su
  `/employee/psychologists`;
- **nessun overflow orizzontale in tedesco**, che è la lingua lunga, né in
  inglese: `scrollWidth === clientWidth` su `/employee`;
- **console muta** su scheda nuova e dopo i quattro tocchi;
- `build`, `lint` e `typecheck` a zero; `EXPECTED_KEYS` **799** sull'albero
  sintattico nei quattro dizionari, guardrail **119** invariati.

##### Trovato e non toccato

- **«non restare da sola» è al femminile**, ed è la stringa che i founder hanno
  scritto. Nella demo funziona — la persona è Laura Bernasconi — ma **il prodotto
  la mostrerebbe a chiunque**, e le altre stringhe del registro consumer sono
  epicene. È una decisione di copy dei founder, non di chi scrive il codice, e
  vale per l'italiano e per il francese (*"ne reste pas seule"*); tedesco e
  inglese non hanno il problema. **Va portata alla revisione madrelingua**
  insieme al resto di quei tre file, dove il `fr.ts` ha già in testa una domanda
  della stessa famiglia.
- **Il blocco non ha un guardrail**, e non è una dimenticanza: non c'è un secondo
  numero contro cui verificarlo — è il caso che il `docs/CONTRATTO-DATI.md` §3
  descrive per la data delle note, cioè un controllo che verificherebbe
  l'espressione contro sé stessa. Quello che si può sorvegliare è già sorvegliato
  dal tipo: `value` è l'unione `1 | 2 | 3 | 4 | 5`, quindi il `=== 5` non può
  diventare irraggiungibile per un refuso.
- **La chat del medico virtuale continua a non guardare cosa la persona
  scrive.** Le sue quattro risposte seguono un arco fisso, quindi qualcuno può
  descrivere lì lo stesso stato che nel check rapido fa comparire il blocco, e
  non succede niente di diverso. È una delle quattro voci che il §8.1 tiene
  aperte, e questa passata non la sfiora.

#### Zero richieste esterne, resa eseguibile (05.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Nessuna riga di `src/` cambia**, nessuna schermata,
nessuna stringa: rotte **26**, schermate **27**, `EXPECTED_KEYS` **799**,
guardrail **119**. Non è una passata di dati — è una proprietà che nessuno
imponeva e che adesso due controlli fanno fallire.

##### La proprietà era vera e non la teneva nessuno

Il §3 lo dichiara dal 07.08.2026: **le richieste esterne a runtime sono zero**, e
i font sono self-hostati perché una richiesta ai server di Google trasmette l'IP
di chi guarda — incompatibile con quello che le nostre schermate promettono. Non
è performance, è coerenza con l'argomento di vendita.

**Ma era una frase, non un controllo.** Il prossimo widget con un'icona da CDN,
una mappa o una analytics l'avrebbe portata via **in silenzio**, e a schermo non
si sarebbe visto niente: è esattamente la famiglia dei disallineamenti che il
§5.6 descrive per i guardrail.

##### La misura, prima di scrivere qualunque cosa

**Sul sorgente: zero riscontri.** Cercando `fetch(`, `new XMLHttpRequest`,
`new WebSocket`, `new EventSource` e `navigator.sendBeacon` in tutto `src/`, non
c'è niente da correggere — la regola nasce su un albero pulito, che è la
condizione per cui è utile.

**Sul risultato: quindici host**, e classificarli è stato metà del lavoro. Una
ricerca di `https?://` in `dist/` trova per forza il rumore che una dipendenza si
porta dietro, e **quattordici dei quindici non sono richieste**:

| famiglia | host | cosa sono |
|---|---|---|
| namespace XML | `www.w3.org`, `jspdf.default.namespaceuri` | `xmlns` degli SVG; il secondo non è nemmeno un host |
| banner di licenza | `html2canvas.hertzen.com`, `hertzen.com`, `opensource.org` | commenti `/*!` che il minificatore conserva |
| attribuzioni | `www.phpied.com`, `www.myersdaily.org`, `www.fpdf.org`, `www.cs.cmu.edu` | riferimenti nei commenti di jsPDF |
| messaggi d'errore | `reactjs.org`, `reactrouter.com`, `fb.me`, `github.com` | testo che una libreria stampa in console |
| base di parsing | `localhost` | la base fittizia con cui react-router costruisce un `new URL()` senza `location` |

**Il quindicesimo è l'unico che conta, ed è `cdnjs.cloudflare.com`**: il ramo
`output("pdfobjectnewwindow")` di jsPDF caricherebbe `pdfobject` da CDN. **Il
nostro chiamante non lo percorre** — `lib/report-pdf.ts` chiude con `doc.save()`
— quindi la stringa è nel bundle e il ramo è irraggiungibile. È in allowlist con
quella frase accanto, ed è la sola voce che tornerebbe a essere una richiesta
vera se qualcuno cambiasse modo di uscita.

**I domini `.example` del dataset non compaiono nella misura**, e la voce c'è lo
stesso. Le email sono `m.bianchi@demo-sa.example`, cioè senza schema, quindi il
motivo di ricerca non le aggancia: la riga è in allowlist come **suffisso** per
il giorno in cui un valore del dataset ne avesse uno — fallirebbe la build per un
indirizzo che nessuno può registrare e che nessuno chiama. È dichiarata come tale
nel file, con scritto che oggi non aggancia niente.

##### La trappola che questa passata ha trovato su sé stessa

**Aggiungere le regole di rete in un blocco proprio ha spento la regola
dell'orologio in tutto `src/`.** `no-restricted-syntax` **non si somma fra
blocchi**: l'ultimo blocco che la dichiara sostituisce per intero i precedenti,
per i file che entrambi coprono. Il lint restava verde, e `new Date()` aveva
smesso di essere segnalato ovunque.

**A trovarla non è stato un ragionamento, è stata una prova**: una sonda con
`new Date()` accanto a un `fetch()` in `src/lib/format.ts` ha riportato **solo il
fetch**. Senza quella verifica la passata avrebbe consegnato una regola nuova e
una vecchia spenta, e nessuno se ne sarebbe accorto finché qualcuno non avesse
chiamato l'orologio.

**È la stessa trappola che `eslint.config.js` già raccontava di sé**, quattro
blocchi più su, a proposito dei due preset: *"i loro `rules` arrivano da uno
spread e la chiave `rules:` scritta a mano più sotto li sovrascriveva per
intero. Né eslint:recommended né react/recommended erano attivi, e il lint
usciva verde perché non stava guardando."* Il commento c'era e non ha impedito
niente, perché parlava dei preset e non della meccanica.

**Il rimedio non è ricordarselo**: i selettori sono diventati **tre costanti in
testa al file** — orologio, memoizzazione, rete — e i due perimetri le
**compongono** invece di riscriverle. I due blocchi sono disgiunti: `src/` meno
`src/lib/data/http/`, e `src/lib/data/http/` da solo. Un solo elenco per
famiglia, nessuna coppia di liste da tenere allineata a mano, e il commento in
testa dice la meccanica invece dell'istanza.

##### L'esenzione che esiste prima della cartella che esenta

`src/lib/data/http/` **non esiste**, ed è scritta lo stesso in tutti e due i
controlli. È il posto del §5.7 dove le chiamate vivranno il giorno in cui `mock/`
si cancella: **scriverla adesso costa una riga e toglie la tentazione di
spegnere la regola quel giorno**, che è il modo in cui una regola muore.

E il secondo blocco non è vuoto: dentro `http/` **l'orologio e il divieto di
memoizzare continuano a valere**. Quel giorno a spegnersi è la sola regola di
rete, e solo lì.

##### Perché i controlli sono due

Nessuno dei due basta, e le due lacune sono complementari:

- **il lint non entra in `node_modules`**, e il rischio vero è cosa fa una
  dipendenza al suo interno; non vede nemmeno un URL che arriva da un `<link>`,
  da un `<img>` o da un `@import` del CSS, che non è una chiamata e nessun
  selettore di sintassi aggancia;
- **il controllo sul bundle non distingue una chiamata da una stringa** — è
  tutta la ragione per cui l'allowlist esiste — e **lascia passare una richiesta
  verso un host che già ammette**. Quella riga di codice però il lint la
  vedrebbe.

Si coprono a vicenda esattamente su questo, ed è scritto in tutti e due i file.

##### Due scelte dello script, dichiarate

**`dist/` mancante è un fallimento, non un successo.** Un controllo che passa
quando non ha niente da guardare è il censimento che dichiara zero su ciò che non
ha percorso — la trappola che il §6.1 registra per il contrasto, dove un
`opacity` invisibile allo strumento aveva prodotto uno zero falso di quattro
nodi. Per la stessa ragione **il riepilogo dice quanti file ha letto**: è l'unico
numero che distingue *"non c'è niente"* da *"non ho guardato"*.

**Nessuna dipendenza nuova**: Node puro, così gira su una macchina appena clonata
e in CI senza aggiungere niente al `package.json` — che è anche la ragione per
cui non è un plugin ESLint.

##### Verificato

- **La misura prima**: zero riscontri nel sorgente, quindici host nel bundle,
  classificati uno per uno leggendo il contesto di ognuno — non il solo nome.
- **I due controlli mordono, provato rompendoli.** Con
  `fetch("https://example.org")` dentro `formatCHF`:
  - `npm run lint` esce **1** con
    *«Nessuna richiesta di rete fuori da lib/data/http: CLAUDE.md §3»* su
    `src/lib/format.ts:95`;
  - `npm run build` esce **1** con *«1 host non dichiarato nel bundle»*,
    `example.org`, e il file di `dist/` in cui sta.

  La riga è stata tolta e i due comandi sono tornati verdi. **`example.org` non
  è coperto dal suffisso `.example`** — finisce in `.org` — ed è la ragione per
  cui la sonda funziona.
- **I due perimetri del lint, provati separatamente**: una sonda fuori da
  `http/` con sette forme — `new Date()`, `Date.now()`, `fetch`, `WebSocket`,
  `EventSource`, `XMLHttpRequest`, `sendBeacon` — le riporta **tutte e sette**;
  la stessa sonda dentro `src/lib/data/http/` lascia passare il `fetch` e
  **segnala ancora l'orologio**. Le due cartelle di prova sono state cancellate.
- **`npm run build` e `npm run build:demo` verdi**, tutti e due con la riga
  `[rete] 7 file di dist/ letti, nessun host fuori dall'allowlist`.
- **`vercel.json` continua a chiamare `build:demo`** — verificato leggendolo, non
  ricordato — quindi il controllo gira anche sulle preview di branch e sul
  deploy dell'alias pubblico.
- `lint` e `typecheck` a zero.

##### Trovato e non toccato

- **Il controllo guarda `dist/`, non la rete.** Non prova che il browser non
  faccia richieste: prova che **nel bundle non ci sono host non dichiarati**. Una
  verifica sul traffico vero è un'altra cosa e chiede un browser: chi la volesse
  la fa dal pannello di rete con la demo aperta, ed è la misura che il §11
  chiederebbe. Questa è la parte che si può automatizzare senza dipendenze.
- **`node_modules` non è coperto in nessuno dei due sensi**, ed è dichiarato:
  il lint non ci entra, e il controllo sul bundle vede solo ciò che il
  minificatore ci ha lasciato dentro. Una dipendenza che costruisse un URL
  concatenando stringhe passerebbe tutti e due — è il limite di una ricerca
  testuale, non un difetto da correggere qui.
- **`scripts/` non è coperto dal lint**: i blocchi di `eslint.config.js`
  dichiarano tutti `files: ["src/**"]`, quindi il file nuovo non viene
  esaminato. Non è un difetto oggi — è uno script Node di novanta righe che non
  ha regole da rispettare — ma chi aggiungerà il secondo file lì dentro deve
  sapere che nessuno lo guarda.

#### Il link anonimo del check rapido (06.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **È la prima passata di refinement che allarga lo scope
del §10**, e non di propria iniziativa: la decisione è dei founder e sta in
«Decisioni chiuse». Rotte **26 → 27**, schermate **27 → 28**, `EXPECTED_KEYS`
**799 → 805**, guardrail **119 → 120**.

##### Il vuoto era una promessa fatta tre volte

Il link anonimo è **la metà del modello di misurazione che rende il dato
indipendente dall'adozione** (`CLAUDE.md` §8): rispondere al check rapido non
richiede un account, quindi i misurati possono essere più degli iscritti, e il
dato vale anche dove l'adozione non è arrivata. È l'argomento con cui il pitch
risponde a *"da dove vengono i numeri di stress?"*.

**E il prodotto lo dichiarava in tre punti senza averlo**: il §8 lo descrive, il
riquadro "Anche senza account" di `/hr/privacy` lo promette a un cliente, e
`docs/PITCH.md` ci costruisce sopra una risposta. Nel contratto era una voce del
perimetro dell'MVP — *"non esiste come oggetto: non c'è un token, una scadenza,
un reparto da cui derivarlo"* (`docs/CONTRATTO-DATI.md` §8.3).

**Non è la stessa famiglia dei vuoti dichiarati del §8**, ed è la ragione per cui
questo è uscito di lì mentre gli altri restano: l'escalation clinica e il consenso
sono **assenze che le schermate non affermano**, questo era un meccanismo che tre
schermate affermavano. È la distinzione che le «promesse in sospeso» di questo
file tengono da agosto, applicata al caso in cui la promessa si poteva mantenere
in una passata.

##### Il perimetro, e cosa è stato lasciato fuori apposta

Una rotta pubblica, **una lettura** e **un argomento in più** su una scrittura
che esisteva già:

- `getRapidCheckLink(token)` → `RapidCheckLink | null`, con azienda, reparto
  (id e nome) e `validUntil`;
- `submitRapidCheck(value, { token })`: con il token il reparto lo porta il link
  e la risposta **non ha `employeeId`**, che è il caso per cui quel campo del
  tipo era opzionale dal principio.

**Il `null` copre due casi e non li distingue**: token ignoto e link scaduto. È
deliberato — a chi apre un link morto la differenza non serve, e dirgliela
direbbe a chi prova token a caso quali token sono esistiti.

**Fuori restano generazione, revoca, rinnovo e distribuzione del token**, che
sono §8.3 e ci restano con la loro voce riscritta: il dataset porta **un
esempio**, non lo schema con cui se ne fanno altri. Il token è leggibile
(`demo-sa-vendite`) perché in sala un indirizzo si dice a voce; in produzione
leggibile vuol dire indovinabile, e la voce del contratto lo scrive.

##### Le due decisioni che valgono più del codice

**La risposta anonima non diventa quella di Laura.** `getRapidCheckAnswer` è la
risposta di chi ha l'account (`docs/CONTRATTO-DATI.md` §3), quindi con il token
il mock **non tocca `lastRapidCheck`**, la mutation **non invalida niente**, e la
schermata legge l'esito dalla mutation — l'unico posto in cui esiste. Scriverci
dentro avrebbe fatto comparire nella home del portale dipendente la risposta di
uno sconosciuto, che è il contrario della garanzia per cui il link è anonimo.
**Verificato a schermo**, ed è la prova che vale più delle altre: risposto dal
link, la home di Laura mostra ancora *"Come ti senti oggi?"*.

**Dal link non si prenota.** Alla risposta peggiore i due numeri d'emergenza
restano — è il punto del `CLAUDE.md` §8, e qui vale doppio perché di
interlocutori non ce n'è nessuno — ma la CTA *"Parla con qualcuno oggi"* **non si
rende**: porta in `/employee/psychologists`, dove chi non ha un account in
produzione non entra. Al suo posto una riga attenuata che nomina l'account
**senza linkarlo**, finché l'attivazione non esiste (§8.3). È la regola del §10
sui vicoli ciechi applicata al verso opposto: non si disegna una strada che il
prodotto non ha.

##### La card è una sola, con una prop

`RapidCheckCard` prende `token?`, e il token cambia tre cose che sono la stessa:
la lettura della risposta autenticata si spegne (`enabled: false`, che è anche
ciò che la esenta dal controllo sulla cache fredda), l'esito arriva da
`submit.data`, e non si invalida niente. **Non è un secondo componente** perché a
cambiare è da dove viene il reparto, non cosa la card mostra: i cinque volti, la
correzione e il blocco dei numeri sono gli stessi, e duplicarli sarebbero due
card che possono divergere sulla parte che conta di più.

**La pagina non ha la barra pubblica né una guardia**, ed è una scelta: chi apre
quell'indirizzo non sta navigando l'applicazione, ha ricevuto un link. Una nav
con "Piani" e "Prenota una demo" sopra *"come ti senti oggi?"* trasformerebbe una
misurazione in una pagina di marketing. **Non entra in `prefetchDemo`**: la
chiave dipende dal token che sta nell'indirizzo, quindi si dichiara
`coldOnPurpose` — è la seconda esenzione dopo la nota di sessione.

##### Verificato

Sulla build demo a 1280×900, console aperta, navigando **solo dai link interni**:

- `/check/demo-sa-vendite`: logo, **Demo SA · Vendite**, i cinque volti. Toccato
  "Molto male" → *"Grazie, registrato."*, il 144, il 143, la riga sull'account al
  posto del pulsante, e la nota che dice che nessuno viene avvisato. **Cambiata
  la risposta** su "Bene": il blocco dei numeri sparisce, la scelta si sposta.
- **La home di Laura non si è mossa**: raggiunta con i link interni dopo la
  risposta anonima, la card mostra ancora la domanda e non *"Grazie, registrato"*.
- `/check/xyz`: *"Questo link non è più valido"*, con l'uscita verso la landing.
  Nessun vicolo cieco in nessuno dei tre stati.
- `?fail=getRapidCheckLink` in sviluppo: lo stato d'errore con "Riprova", e
  l'uscita resta.
- **`/hr/privacy` → "Vedi un esempio di link anonimo"**: navigazione interna, la
  demo non ricarica.
- **Le quattro lingue**, raggiunte dal selettore della barra pubblica e poi con i
  link interni fino alla pagina: IT, DE, FR, EN, blocco dei numeri compreso. Il
  tedesco manda la riga d'introduzione a due righe e non sborda.
- **Da sola tastiera**: cinque volti e l'uscita, tutti con l'anello di focus
  visibile.
- **Censimento del contrasto sulla schermata nuova**: **16 nodi di testo
  percorsi** nello stato con la risposta e il blocco dei numeri, **11** in quello
  senza. Zero sotto soglia fra i nodi informativi — l'intestazione 14.6:1, la
  riga d'introduzione 4.9:1, l'uscita 4.9:1, i due numeri 15.17:1, la riga
  sull'account 5.1:1.
- Console muta in tutti i passaggi, in tutte e quattro le lingue; `npm run
  build`, `npm run build:demo`, `lint` e `typecheck` a zero, con la riga
  `[rete] 7 file di dist/ letti, nessun host fuori dall'allowlist`.

##### Trovato e non toccato

- **I numeri d'emergenza sono costanti in `RapidCheckCard`**, dalla passata del
  05.09.2026, e **dipendono dal paese**: 144 e 143 in Svizzera, 112 in Italia. Il
  posto giusto è il provider, insieme all'astrazione "paese" che oggi non esiste
  — `EmployeeProfile` un paese non ce l'ha, ed è lavoro dell'MVP
  (`docs/CONTRATTO-DATI.md` §8.1). **Non si sposta qui**: un campo che il dataset
  non sa riempire non si aggiunge al contratto per anticiparlo. Il link anonimo
  lo rende un po' più visibile — adesso quei due numeri escono anche su una
  schermata che nessuna sessione autenticata attraversa — e non lo cambia.
- **I quattro volti non scelti stanno a 1.70:1**, e **non è di questa passata**:
  `FACE_MUTED` porta `text-muted-foreground/40` dal 20.08.2026, e la misura è
  **identica sulla home del dipendente** — verificata lì, non dedotta. Sono
  etichette di bersagli premibili, quindi non sono esenti come un controllo
  disabilitato. Cambiarlo è una modifica alla resa di una schermata approvata,
  cioè dei founder, e vale per tutte e due le schermate insieme.
- **Il censimento del `CLAUDE.md` §6.1 non aveva guardato questa schermata**, e
  non poteva: è nata oggi. La riga lì è stata qualificata con la data invece di
  essere riscritta, e il censimento di questa schermata è quello qui sopra.
- **L'indirizzo del link è scritto in `HRPrivacy.tsx`.** È un indirizzo e non un
  dato — porta all'**esempio** del dataset, non al link di quell'azienda — ma è
  l'unico punto in cui il token compare fuori da `lib/data`. Il giorno in cui i
  link si generano, quella schermata mostrerà quello del cliente e l'indirizzo
  arriverà dal provider come tutto il resto.
- **La correzione della risposta non ha un periodo**, e sul link anonimo nemmeno
  una persona: la domanda *"la seconda risposta sostituisce la prima o se ne
  aggiunge una"* era già aperta nel contratto (§3) e questa passata non la
  chiude. Nella demo non si vede, perché la risposta anonima non alimenta
  nessun aggregato.

#### La disdetta dal lato del dipendente (06.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. **Nessuna rotta e nessuna schermata nuova**: restano 27 e
28. `EXPECTED_KEYS` **805 → 815**, guardrail **120 → 123**.

##### Uno stato che esisteva e che nessuno poteva scrivere

`ProfessionalSession.cancellationReasonKey` ha due valori dal 17.08.2026, e
`by_patient` era **un valore dell'enumerazione che solo il dataset poteva
scrivere**: a disdire era soltanto la professionista. Dal 18.08.2026 il
dipendente **vede** una disdetta nella sua home — la seduta resta al suo posto
con chi l'ha annullata — e non poteva farne una: vedeva un verso solo di un
verbo che il dominio dichiarava a due.

Nel contratto era la prima delle cinque voci aperte del §8.5, e la riga
diceva alla lettera che *«il metodo per il paziente non c'è»*.

##### Una mutation, un dialogo, nessuna policy

`cancelAppointment(appointmentId)` **è la stessa transizione dall'altro verso**:
scrive nella stessa mappa `cancellations` con `reasonKey: "by_patient"`, e da lì
`applyCancellation` proietta sui tre lati — calendario, lista sessioni, home —
**senza una riga di codice in più**. È la ragione per cui quella mappa portava il
motivo da prima che qualcuno potesse scrivere il secondo valore: a cambiare è chi
scrive, non la forma.

**Cerca fra gli appuntamenti di chi è autenticato**, cioè nella lista che
`getAppointments` restituisce, e non fra tutte le sedute del dominio come fa
`cancelSession` — che è il metodo di chi cura e ha davanti la propria agenda. Da
qui **"non trovato" copre già "non è tuo"**, e i rifiuti restano tre invece di
quattro: non trovato, non in programma, già cominciato. Ognuno con il suo
guardrail e il suo lancio, come l'altro verso.

**I due rifiuti sono separati dove l'altro verso li tiene insieme**, e non è
incoerenza: là le due metà coincidono per costruzione, qui la prima è
**raggiungibile davvero**, perché `getAppointments` restituisce anche le
annullate ancora future — chi tiene la home aperta mentre la professionista
disdice ha davanti un pulsante su una seduta che non è più in programma.

**Non porta testi.** La nota è di chi cura, il messaggio è la sua voce verso il
paziente: una riga scritta da questo lato avrebbe **un terzo destinatario**, e
con lui le domande su quando la legge e come le arriva — cioè la notifica, che è
una delle quattro voci che restano aperte.

##### Il guardrail che non è stato scritto, e perché

La proposta prevedeva un guardrail *"se serve"* a dimostrare che la proiezione
del professionista mostra «Annullata dal paziente». **Non serve, e scriverlo
sarebbe stato un controllo tautologico**: `applyCancellation` è l'unico punto che
produce lo stato annullato, quindi un controllo che rilegga da lì la seduta
appena scritta verificherebbe l'espressione contro sé stessa. È la ragione già
scritta su `bookAppointment` — *«appoggiarsi a `getAvailableSlots` sembrava
naturale ed era un controllo tautologico»* — e sull'invariante della media
aziendale nel contratto. La prova è a schermo, ed è nel giro qui sotto.

##### `alert-dialog` esce dal magazzino, ed è la quarta volta

Il §3 obbliga a verificare **a schermo** che le varianti `data-*` di un
componente shadcn corrispondano ad attributi che Radix scrive davvero. Fatto, e
non dedotto dalle tre volte precedenti: overlay e contenuto usano
`data-[state=open]` e `data-[state=closed]`, Radix scrive `data-state` su
entrambi, e con il dialogo aperto l'`animationName` calcolato è `enter` su tutti
e due — cioè la variante aggancia. Nessun `shadcn add`, nessuna dipendenza nuova.

**È un `AlertDialog` e non un `Dialog`**, ed è la differenza fra i due gesti: la
disdetta della professionista si **scrive**, questa è una domanda con due
risposte. Un `AlertDialog` non si chiude cliccando fuori e parte con il fuoco
dentro — per un gesto che non si ritira è la forma giusta, ed è il motivo per cui
quel componente esisteva senza chiamanti.

**Una riga di codice non ovvia**: `AlertDialogAction` chiude il dialogo al clic,
e con una scrittura che può fallire quella è la chiusura sbagliata — lo stato
d'errore comparirebbe sotto un dialogo che non c'è più. Il clic fa
`preventDefault()` e a chiudere è `onSuccess`.

##### Verificato

Il giro intero, sulla build demo a 1280×900, console aperta, **solo link
interni**:

- prenotato **venerdì 25.09 alle 10:00** dal portale dipendente; la riga compare
  in home con il suo pulsante e il contatore in programma passa da 3 a **4**;
- **annullato dalla home**: il dialogo dice *"Annullare l'appuntamento?"*,
  *"venerdì 25.09.2026, alle 10:00 con Dr.ssa Meier"* e *"L'ora torna libera. Se
  cambi idea, prenota di nuovo."*; confermando, la riga diventa **"Annullato"**
  con *"Hai annullato questo appuntamento."*, il pulsante sparisce da quella riga
  e il contatore torna a **3 in programma** — mentre **`used` resta 3**, perché
  conta le erogate;
- **nel portale professionista**, `/professional/sessions` → "Annullate (2)":
  *"Laura Bernasconi · Venerdì 25.09.2026, 10:00"* con **"Annullata dal
  paziente"**. Nel calendario la cella delle 10:00 di venerdì 25 è tornata
  **"Libera"**;
- **l'ora è di nuovo prenotabile**: riaprendo la prenotazione della Dr.ssa Meier,
  venerdì 25.09 ha di nuovo **10:00** fra gli orari. È l'invariante del §10.D.6
  che vale da sé — `getAvailableSlots` sottrae le sole sedute **non** annullate,
  e la disdetta del dipendente passa dalla stessa mappa, quindi non è stato
  necessario toccare quella sottrazione;
- **le quattro lingue sul dialogo**: IT, DE, FR, EN, raggiunte dal selettore
  della barra pubblica e poi con i link interni. Il tedesco manda la riga
  d'effetto a due righe e non sborda;
- **da tastiera**: il fuoco parte su "Torna indietro", un Tab arriva su "Annulla
  l'appuntamento" con l'anello visibile, e resta dentro il dialogo;
- **contrasto sul dialogo**: **5 nodi di testo percorsi**, zero sotto soglia —
  titolo 14.60:1, riepilogo e riga d'effetto 4.90:1, "Torna indietro" 14.60:1,
  "Annulla l'appuntamento" 11.45:1;
- **lo stato d'errore**, in sviluppo con `?fail=cancelAppointment`: il dialogo
  **resta aperto**, sotto i pulsanti compare *"Appuntamento non annullato — L'appuntamento
  è ancora in programma: riprova."*, il contatore non si muove e la seduta resta
  in programma;
- console muta in tutti i passaggi; `npm run build`, `npm run build:demo`, `lint`
  e `typecheck` a zero.

##### Trovato e non toccato

- **Il preavviso non è deciso, e da oggi pesa di più.** Nessuno dei due metodi
  guarda quanto manca alla seduta: guardano solo che sia futura. Finché a
  disdire era solo chi cura era una cortesia fra professionisti; adesso che
  disdice anche chi prenota, è la regola che decide se un'ora persa la paga
  qualcuno. Resta una delle quattro voci aperte del `docs/CONTRATTO-DATI.md`
  §8.5, insieme a chi paga la disdetta tardiva, alla riprogrammazione e alla
  notifica — e **la notifica è quella che questa passata rende più visibile**:
  la professionista scopre la disdetta solo aprendo il portale.
- **Chi disdice non può ripensarci.** Non esiste un "annulla l'annullamento": si
  riprenota, e la frase del dialogo lo dice invece di lasciarlo intendere. Nel
  caso di una seduta ricorrente — il giovedì alle 17:30 — riprenotare **non
  riporta quell'ora**, perché non è una fascia dichiarata: è la distinzione fra
  liberare e riproporre che il §8.5 tiene da agosto, e qui si vede dal lato di
  chi ha disdetto.
- **Il pulsante compare su ogni riga in programma, senza limite di tempo.**
  Nella demo le sedute future sono tutte lontane, quindi non si vede; in
  produzione, senza una policy di preavviso, questo vuol dire che si può
  disdire cinque minuti prima.

#### L'attivazione e l'assessment (06.09.2026)

**Questo verbale non conta i propri commit**, e il conto lo dà git con il comando
in testa a questo file. Rotte **27 → 28**, schermate **28 → 29**,
`EXPECTED_KEYS` **815 → 865**, guardrail **123 → 125**.

##### Due cose dichiarate e non costruite

**Il 78/100 compariva e nessuno vedeva da dove**, ed è la prima domanda che quel
numero si tira dietro guardando il portale dipendente. Era un valore scritto su
`LAURA.healthProfile`, insieme alla sintesi e all'area debole: tre cifre che
nessuna sorgente produceva.

**E il consenso era promesso come già raccolto**: la pagina privacy dell'HR
diceva *"ogni dipendente conferma il consenso durante l'attivazione e può
revocarlo in ogni momento"*, mentre il `docs/CONTRATTO-DATI.md` §8.2 diceva
l'opposto alla lettera. Era la voce che le decisioni in sospeso chiamavano **la
più grave delle tre**, e non per il numero: le altre due promettevano un
meccanismo, questa affermava un **fatto giuridico compiuto** su una schermata
rivolta a chi su quella base tratta i dati dei propri dipendenti.

##### Il punteggio smette di essere un valore e diventa un calcolo

`CLAUDE.md` §8 porta ora la formula intera, e `lib/health-profile.ts` la esegue:
dieci domande, due per area, scala 1–5 con **5 il meglio**, area = media delle sue
due × 20, totale = media delle dieci × 20 arrotondato, soglie a 70 e 50. Le
**dieci risposte di Laura** sono il dato nuovo del §8, e da loro escono 78, sonno
e "In buon equilibrio" — **verificato prima di scrivere una riga di codice**, che
era la condizione del punto 0.

**Il pareggio ha una regola**, e non è un dettaglio: a parità di minimo vince la
prima area nell'ordine fisso. Senza, l'area debole dipenderebbe dall'ordine in cui
il codice percorre una mappa — qualcosa che si cambia senza sapere di aver
cambiato un numero a schermo. È implementata con un `reduce` e non con un `sort`:
ordinare metterebbe la regola nelle mani della stabilità dell'algoritmo, che è una
proprietà del motore e non una decisione nostra. **A schermo si è vista**: in
tedesco, con dieci risposte tutte al massimo, il profilo esce 100 e l'area debole
è **Schlaf** — cioè la prima dell'ordine.

##### Il piano di benessere seguiva l'area debole, ma una volta sola

È la conseguenza che la decisione portava con sé, e che il codice **quasi**
aveva: `mock/ai-plan.ts` ordinava già le aree sull'area debole del profilo, ma al
**caricamento del modulo**. Da quando le risposte si riscrivono, un ordine
congelato all'avvio avrebbe fatto dire un'area al profilo e un'altra al piano —
mentre la home legge la prima area del piano e la chiama *"l'area da cui parte il
tuo piano di benessere"*.

Il piano è diventato una **funzione dell'area debole**, e il provider la chiama
con il profilo corrente. Il guardrail statico che c'era **non poteva coprire il
caso nuovo** — lì il profilo è quello del §8 — quindi ne è nato uno dinamico
accanto: è il secondo dei due guardrail di questa passata.

##### Quattro passi, una rotta, e il tipo che tiene il consenso

`/activate` sta fuori da ogni layout e senza guardia, come il link anonimo. Lo
stato del passo vive nel componente: quattro indirizzi sarebbero quattro pagine
apribili fuori ordine, e tre di loro non vogliono dire niente da sole.

**`consent` è il letterale `true` e non un booleano**, ed è la parte che vale più
della schermata: con un `boolean` il chiamante può passare `false`, e un metodo
che accetta *"attiva senza consenso"* è un metodo che qualcuno chiamerà così.

**Ne discende l'ordine dei passi, ed è una conseguenza e non una scelta di
comodità**: il codice si verifica **dopo** la spunta, perché prima non esiste un
modo legittimo di chiamare `activate`. Su un codice sconosciuto si torna al primo
passo con l'errore sul campo. La strada alternativa — una seconda lettura pubblica
che verifica il codice da sola — sarebbe stata un oracolo che risponde *"questa
azienda è cliente di Kora"* a chiunque provi una stringa.

**Il `null` non è un errore**, ed è la distinzione che tiene onesta la schermata:
un codice sconosciuto è la risposta a una domanda mal digitata e si dice sul
campo; `isError` è il guasto e ha il suo riquadro.

##### La scala è rovesciata rispetto al check rapido, e non riusa i volti

Nel check rapido **1 è "molto bene"**; qui **5 è il meglio**. Riusare i cinque
volti nello stesso ordine avrebbe registrato 1 dove la persona tocca la faccia
sorridente — **capovolgendo ogni punteggio in silenzio**. E su *"Mangi frutta e
verdura ogni giorno?"* una faccia non è la risposta comunque: la riga è la stessa
— cinque bersagli affiancati, stessi stati — con le etichette della frequenza,
**Mai → Sempre**, e il 5 a destra. L'avvertenza sta sul tipo, che è il punto in
cui si sbaglierebbe.

##### Verificato

Sulla build demo a 1280×900, console aperta, **solo link interni**:

- **codice sbagliato**: si arriva al consenso, si spunta, e si torna al primo
  passo con *"Codice non riconosciuto"* sul campo, il codice ancora scritto;
- **campo vuoto**: *"Scrivi il codice della tua azienda."*;
- **senza spunta**: *"Serve il consenso per continuare."*, e non si passa;
- **codice in minuscolo** (`demo-sa-2026`): entra, perché il confronto è in
  maiuscolo;
- **con le risposte del §8**: **78**, "In buon equilibrio", **Sonno** — e la home
  e `/employee/profile` mostrano gli stessi tre valori;
- **con altre risposte** (tutte "A volte" tranne l'alimentazione a "Mai"):
  **52**, "Da tenere d'occhio", **Alimentazione** — e il piano di benessere si è
  riaperto **su Alimentazione**, con il guardrail dinamico muto;
- **ricaricando**: il profilo torna **78 / sonno**, perché lo stato del provider
  muore con la pagina;
- **le quattro lingue**, tutte e quattro percorse dai quattro passi fino al
  profilo. In tedesco il layout regge e la regola del pareggio si vede
  (100 → Schlaf);
- **da tastiera**: i cinque bersagli si raggiungono con Tab, l'anello di focus si
  vede, e ogni gruppo è un `fieldset` con la domanda come `legend`;
- **contrasto sui quattro passi**: **99 nodi di testo percorsi** — 7 al codice, 13
  al consenso con l'errore a schermo, 68 alle domande, 11 al profilo — **zero
  sotto soglia** fra i nodi informativi;
- console muta ovunque; `npm run build`, `npm run build:demo`, `lint` e
  `typecheck` a zero.

##### Trovato e non toccato

- **Il consenso non viene registrato.** Il tipo impedisce di attivare senza
  spunta; non conserva **chi**, **quando** e **a quale versione** del testo — che
  è la prova che in produzione serve davvero. Con la revoca, l'export e la
  domanda se questo consenso copra gli altri punti di raccolta, resta nel
  `docs/CONTRATTO-DATI.md` §8.2. **La voce in sospeso si chiude comunque**,
  perché il difetto che descriveva era una frase che affermava il falso, e quella
  frase adesso dice il vero.
- **L'assessment si fa una volta sola.** Non c'è cadenza né storico, quindi il
  profilo non può dire *"sta migliorando"* — che è metà di quello che serve a chi
  lo legge di sé. È il §8.10 di quel documento, e non si muove.
- **Rifare l'assessment cambia Laura per il resto della sessione.** È la
  conseguenza voluta del profilo derivato, e ha un costo che sta in
  `docs/PITCH.md`: chi lo mostra durante il giro o risponde come il §8, o lo
  mostra per ultimo.
- **`/activate` non crea niente.** Nella demo c'è un dipendente solo e il suo
  account esiste già: l'attivazione dice a chi porta il codice e registra le
  risposte. L'onboarding vero — invito, creazione, passaggio da coperto a
  iscritto — è il §8.3.
- **La formula gira nel client.** Oggi è l'unico posto dove può girare; in
  produzione appartiene al backend, perché è lei a decidere cosa una persona
  legge di sé. `lib/health-profile.ts` sta fuori da `mock/` apposta, e quel
  giorno non si cancella con il dataset.

### Punto di partenza — cosa c'è e cosa manca

Ereditato e funzionante: 25 rotte su cinque aree (pubblica, dipendente, HR,
professionista, admin; **oggi sono 28**: `/roi` è stata approvata il 07.08.2026
e costruita in M3, `/check/:token` e `/activate` il 06.09.2026 —
`CLAUDE.md` §10), design system e navigazione, 47 componenti
shadcn (**oggi sono 45**: il sistema di toast, che ne contava tre, è uscito il
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
| M5 | Verso la produzione (differibile) | **fatta** — a–e eseguiti; f ritirato dallo scope della demo il 15.08.2026, e il suo lavoro è nel perimetro dell'MVP |

## Decisioni chiuse

Decisioni dei founder, con la data in cui sono state prese. Alcune le eseguirà una
milestone, ma la decisione è un fatto a sé e va trovata qui senza dover leggere
`CLAUDE.md` per intero. La regola vive lì; qui restano la data e il motivo.

> **L'arretrato dal 17.08 al 01.09 è stato recuperato il 02.09.2026**, e la
> sezione era ferma al 14.08: per due settimane la promessa qui sopra — *«senza
> dover leggere `CLAUDE.md` per intero»* — non era più vera, e la passata che se
> ne è accorta l'ha detto invece di aggiungere solo le ultime due. Le voci sono
> state raccolte cercando le attribuzioni datate in `CLAUDE.md` e in
> `docs/PITCH.md`; il criterio e cosa è rimasto fuori stanno nel verbale di
> quella passata.

- **06.09.2026 — L'attivazione dell'account è la ventottesima rotta**
  (`CLAUDE.md` §2.6, §8, §10.A.6). `/activate` esce dallo scope congelato perché
  chiude **due cose che il prodotto dichiarava e non aveva**: da dove viene il
  78/100 del profilo — la domanda che un investitore fa per prima guardando il
  portale dipendente — e **il consenso**, che la privacy HR prometteva già
  raccolto mentre nessun punto del percorso lo chiedeva.

  **Con lei entrano in `CLAUDE.md` §8 tre cose che erano codice e non dato**: il
  codice azienda di Demo SA (`DEMO-SA-2026`), la formula del profilo salute —
  dieci domande, due per area, scala 1–5 con 5 il meglio, area × 20, totale × 20
  arrotondato, soglie a 70 e 50 — e **le dieci risposte di Laura**, che
  riproducono il suo 78 con il sonno come area debole. Da qui **il punteggio non
  è più un valore scritto**: nasce dalla formula, e un guardrail lo verifica.

  **Il pareggio ha una regola**, e serve a rendere la formula deterministica: a
  parità di minimo vince la prima area nell'ordine fisso. Senza, l'area debole
  dipenderebbe dall'ordine in cui il codice percorre le aree — una cosa che
  qualcuno può cambiare senza sapere di aver cambiato un numero a schermo.

  **E il piano di benessere segue l'area debole**, che è la conseguenza che la
  decisione porta con sé: la home dice *"è l'area da cui parte il tuo piano"*
  leggendo la prima area del piano, quindi con un ordine fisso il profilo avrebbe
  detto un'area e il piano un'altra alla prima risposta diversa da quelle di
  Laura.

- **06.09.2026 — Il link anonimo del check rapido è la ventisettesima rotta**
  (`CLAUDE.md` §2.6, §8, §10.A.5). `/check/:token` esce dallo scope congelato
  perché chiude una **promessa fatta in tre punti e costruita in nessuno**: il
  §8 descrive il link come la metà del modello di misurazione che rende il dato
  indipendente dall'adozione, il riquadro "Anche senza account" della privacy HR
  lo dichiara al cliente, e `docs/PITCH.md` ci costruisce sopra una risposta —
  mentre nel contratto era una voce del perimetro dell'MVP
  (`docs/CONTRATTO-DATI.md` §8.3).

  **Il perimetro approvato è stretto**: una rotta pubblica, **una lettura**
  (`getRapidCheckLink`) e **un argomento in più** sulla scrittura che c'è già.
  Non entrano la generazione del token, la revoca, il rinnovo e la
  distribuzione, che restano §8.3: la demo mostra **un esempio di link**, non lo
  schema con cui se ne fanno altri.

  **Due scelte di resa sono parte della decisione**, e non sono dettagli di
  schermata. La risposta anonima **non diventa quella della persona
  autenticata** — la home di Laura non si muove — perché `getRapidCheckAnswer`
  è di chi ha l'account (`docs/CONTRATTO-DATI.md` §3). E alla risposta peggiore
  i due numeri d'emergenza restano, mentre la CTA verso il portale dipendente
  **non si rende**: porterebbe dove chi non ha un account non può entrare, e la
  demo non disegna una strada che il prodotto non ha. Al suo posto una riga che
  nomina l'account senza linkarlo, finché l'attivazione non esiste.

- **02.09.2026 — La soglia di anonimato ha un pavimento: 5** (`CLAUDE.md` §8,
  `docs/CONTRATTO-DATI.md` §3). Resta una proprietà del cliente, ma sotto 5 un
  punteggio di reparto è la media di un gruppo che chi ci lavora sa nominare.
  **Il default di produzione è 10**, che è un numero diverso e con un altro
  mestiere: il pavimento è ciò sotto cui nessuno scende, il default è ciò che
  riceve chi non chiede niente. Il 12 di Demo SA non è nessuno dei due — è un
  valore del dataset. *(Registrata il 04.09.2026, con la passata che l'ha
  eseguita.)*

- **04.09.2026 — «AI», «prevenzione», «rischio» e «diagnosi» non compaiono
  sulle etichette di ciò che il software calcola per una persona** (`CLAUDE.md`
  §7). Non è registro, è **lo scopo dichiarato**, che è il criterio con cui si
  decide se un software è un dispositivo medico: un piano "di prevenzione" e un
  punteggio "a rischio" affermano che il prodotto previene una malattia e
  classifica uno stato clinico. Restano fuori dalla regola la lettura economica
  del calcolatore, il referto scritto dal medico del centro, le negazioni, e chi
  parla per sé — la bio di una professionista.

- **04.09.2026 — Prima sessione entro 72 ore, su tutti e tre i piani**
  (`CLAUDE.md` §9). Sostituisce le *"24 ore, nessuna lista d'attesa"* del
  Business Plan sotto la regola del §10.B.1, e la ragione è che **il dataset non
  regge le 24**: la prima fascia libera cade il 24.09 alle 09:00 ed è di una
  professionista su quattro. Vive su `Plan`, non è una costante, ed è il primo
  numero commerciale del §9 con un guardrail dietro.

- **04.09.2026 — Il colloquio conoscitivo è "incluso", non "gratuito"**
  (`CLAUDE.md` §9). In Ticino le professioni sanitarie non possono offrire
  prestazioni gratuite. Al dipendente la frase dice la stessa cosa — non paga
  nulla in più — e la dice dal lato che non espone chi eroga. Il campo resta
  `freeIntroInterview`: è un nome interno.

- **04.09.2026 — `/employee/ai-plan` diventa `/employee/wellbeing-plan`**
  (`CLAUDE.md` §10). L'indirizzo è superficie del prodotto e portava la parola
  che le etichette hanno perso. **Non è la rinomina del 19.08.2026 che
  continua**: quella traduceva, questa cambia una parola del prodotto — ed è
  l'unica rotta che si è mossa due volte. I nomi interni non seguono.

- **04.09.2026 — La demo dichiara cosa fa dei dati di chi la visita**
  (`CLAUDE.md` §10.A.4). L'informativa della richiesta demo prometteva
  conformità LPD e GDPR a una persona che scrive nome, email e telefono veri,
  con dietro nessun trattamento e nessun titolare. Adesso dice il fatto — la
  richiesta resta nel browser — che è vero per costruzione, e il footer lo
  ripete per le quattro rotte pubbliche.

- **01.09.2026 — La griglia dice cosa sono le sue celle, e le fasce hanno un
  nome** (`CLAUDE.md` §10.D.6). La fascia libera e la cella vuota erano
  disegnate uguali, quindi la griglia prometteva venti bersagli e ne aveva uno.
  A portare il significato è **il testo** e non la tinta — i cinque fondi stanno
  dentro ΔE 6.6 — e **ciò che non offre niente non si disegna**. Il nome della
  riga che dice da dove vengono le fasce è dei founder: **«la tua
  disponibilità»**, e sta nella legenda perché la griglia contiene anche le
  sedute.

- **01.09.2026 — Una fascia dichiarata si chiude e si riapre** (`CLAUDE.md`
  §10.D.6). Fino ad allora l'unico modo che la professionista aveva di
  liberarsi un'ora era che ci fosse **una seduta da annullare**: un impegno
  personale su un'ora libera non aveva nessuna rappresentazione. È la risposta
  di chi cura alla policy che il `CONTRATTO-DATI.md` §8.5 dichiara non decisa.
  **Dichiarare fasce nuove resta fuori**, ed è scope: la pubblicazione della
  disponibilità è lavoro dell'MVP.

- **01.09.2026 — L'annullamento porta due testi, non un interruttore**
  (`CLAUDE.md` §10.D.3, §3). La professionista può far arrivare al paziente una
  riga sulla disdetta mentre la nota clinica resta sua. La strada scartata era
  una spunta *"rendi visibile al paziente"* sopra il testo che esiste già, e non
  è stata scartata per gusto: **una spunta lasciata attiva per distrazione manda
  al paziente una valutazione clinica**, e quel danno non ha un ritiro. Con due
  campi il testo che passa è quello scritto per passare. Porta con sé il terzo
  componente uscito dal magazzino di `ui/`, `checkbox.tsx`.

- **20.08.2026 — Il Business Plan non si rinomina, e la storia di git non si
  tocca** (`CLAUDE.md` §3). Il file si chiama `KORA_BusinessPlan_v6.pdf` e
  dentro è la **versione 5.0 di giugno 2026**: lo dicono frontespizio, metadati
  e piè di pagina. Le pagine citate in §9 sono quelle di questo PDF, quindi i
  rimandi sono giusti e a mentire è solo il nome del file — un rename costerebbe
  più di quanto chiarisca. Nella stessa decisione è stato misurato il costo
  della clausola di scadenza dei PDF: **un commit solo**, `2b81f54`.

- **19.08.2026 — Le rotte passano in inglese, i nomi dei file no** (`CLAUDE.md`
  §10, §3). Quindici indirizzi su ventisei, con tre righe che sono decisioni e
  non traduzioni — `/plans` allinea l'indirizzo all'entità del dominio,
  `/employee/doctor` accorcia un termine che il prodotto scrive per intero,
  `/admin/providers` pluralizza. **I file restano come sono**: le rotte sono la
  superficie del prodotto, i nomi dei file sono interni, e rinominarli avrebbe
  raddoppiato il diff di una passata il cui unico valore è essere verificabile.

- **19.08.2026 — Il 73 del profilo salute medio entra nel §8** (`CLAUDE.md` §8).
  Era in `mock/platform.ts` e non fra le cifre ammesse, dichiarato aperto dal
  16.08: finché restava fuori era un numero del dataset che il §2.4 non copre.
  Entra **come valore dichiarato e non derivato**, come le sedute di carriera
  del roster — dietro non c'è una seconda sorgente, e chi legge il §8 non deve
  poterlo prendere per derivato.

- **18.08.2026 — Il calendario del professionista salta a una data**
  (`CLAUDE.md` §10.D.5). Approvato dopo un mock, e la ragione è una misura: le
  frecce da sole non bastano su un'agenda di sette mesi e mezzo, dove rivedere
  un percorso concluso costa ventotto clic. Il salto si apre **dall'etichetta
  della settimana**, così la riga dei comandi non cresce; niente navigazione per
  anno, e **le KPI non lo seguono** — rispondono a *come sto adesso*.

- **18.08.2026 — L'attesa ha un token suo, `--waiting`** (`CLAUDE.md` §6.1).
  Tutto ciò che aspetta si dice allo stesso modo, e non con una trasparenza di
  `warning`: due significati che si distinguono per l'opacità dello stesso
  colore si sfaldano al primo cambio di fondo, e qui si erano già sfaldati —
  **l'attesa stava a `/20` e l'allarme a `/15`**, cioè l'attesa era più forte
  dell'allarme. Un token in più non è un token cambiato: la regola su `warning`
  e `destructive` non si riscrive, l'attesa **esce** da `warning` invece di
  diluirlo.

- **17.08.2026 — Una cosa, una parola, e la parola è quella del Business Plan**
  (`CLAUDE.md` §7). Il prodotto diceva «sedute» nel portale professionista e nel
  back-office e «sessioni» nei piani, nel portale dipendente e nelle KPI
  dell'HR. Non era una distinzione, era abitudine. Vince **«sessioni»** perché è
  la parola che l'investitore ha già letto, e sceglierla non chiede a nessuno di
  arbitrare fra due gusti — e un coach non tiene una seduta.

- **17.08.2026 — L'anteprima dell'hero è di tre pannelli, uno per lato del
  prodotto** (`CLAUDE.md` §10.A.1). Un riquadro solo mescolava il punteggio di
  Laura, il suo appuntamento e una fetta di dashboard HR. I tre pannelli sono
  **il sommario del giro che il pitch fa subito dopo**, quindi l'ordine non è
  decorativo. **Il primo clic ferma la rotazione per sempre**: un carosello che
  riprende da solo toglie la parola a chi la sta usando.

- **17.08.2026 — La barra pubblica ha la voce "Admin"** (`CLAUDE.md` §10.E).
  Non era una difesa: un indirizzo non linkato non protegge da chi ha il link, e
  digitarlo **ricarica**, cioè azzera il provider — quindi la richiesta demo
  inviata durante il giro spariva proprio mentre la si andava a mostrare. A
  proteggere `/admin` resta il banner dei dati dimostrativi, che adesso è
  l'unica difesa a schermo. Da qui la presentazione si percorre tutta in avanti.

- **17.08.2026 — La home del dipendente mostra due fatti, non quattro
  scorciatoie** (`CLAUDE.md` §10.B.2). Le quattro tessere erano **quattro delle
  sei voci del menu**, cioè la stessa strada disegnata due volte. Al loro posto
  la data del prossimo check-up e i consulti dell'anno, che si vedevano solo nel
  profilo, e **non sono link** — o tornerebbe la duplicazione.

- **17.08.2026 — Il medico virtuale arriva a una conclusione** (`CLAUDE.md`
  §10.B.4). Un arco di quattro scambi, poi la casella si spegne e dice perché:
  prima ripeteva la stessa frase all'infinito, che è la prima cosa che si vede
  provandolo due volte. **Il limite è normativo prima che editoriale** — il
  medico consiglia e orienta, non diagnostica e non prescrive — ed è un vincolo
  su ogni frase futura di quella chat.

- **17.08.2026 — Il profilo si raggiunge dal riquadro dell'identità, e il
  riquadro ha una regola** (`CLAUDE.md` §6.5, §10.B.3, §10.D.4). Nei portali
  dipendente e professionista «Profilo» esce dal menu ed entra nel riquadro, che
  è dove chi usa un'app cerca le proprie cose; **la rotta resta**, cambia come
  ci si arriva. La regola del riquadro è stata scritta perché era già stata
  decisa due volte e alla terza ne sarebbe uscita una forma nuova: icona a
  sinistra, link **solo dove esiste una schermata di profilo** — mai l'HR — e
  **l'icona dice cosa c'è dentro il riquadro, non dove porta**.

- **17.08.2026 — La cornice del trimestre nella dashboard HR** (`CLAUDE.md`
  §10.C.1). Il selettore stava nell'intestazione e sembrava comandare la pagina
  intera: lo seguono **otto elementi**, e gli altri parlano dell'ultimo mese o
  dei dodici. La cornice mette insieme gli otto con il selettore in cima e
  lascia gli altri fuori; **i due banner restano sopra**, perché sono avvisi e
  la loro posizione è informazione.

- **17.08.2026 — I consulti di medico virtuale tornano nel report HR**
  (`CLAUDE.md` §10.C.2). Si sommano sui **soli mesi del trimestre** e non si
  cumulano, e la ragione si vede subito: il cumulato darebbe 118 su tutti e
  quattro i trimestri, cioè un numero che non si muove accanto a un selettore
  che si muove. Quel servizio non ha un monte annuo da consumare.

- **17.08.2026 — Il professionista vede il nome dei pazienti, l'amministratore
  no** (`CLAUDE.md` §10.D.2, §8). Mostrare le iniziali a chi ha la persona in
  seduta non protegge nessuno: quel nome glielo dice la paziente. **La garanzia
  del contratto non cade, cambia verso** — vale verso l'azienda e verso
  l'amministratore di piattaforma, e a garantirlo è la forma del dato, con una
  terza vista dello stesso record per il back-office.

- **17.08.2026 — Una sessione in programma si può annullare** (`CLAUDE.md`
  §10.D.3). Dal calendario e dalla lista sessioni, **solo `scheduled` e solo nel
  futuro**. È la prima scrittura del dominio che non inserisce, e chiude metà
  del vuoto che il `CONTRATTO-DATI.md` §8.5 dichiara: l'altra metà — preavviso,
  chi paga una disdetta tardiva, riprogrammazione, disdetta dal lato del
  dipendente — resta lì.

- **17.08.2026 — La conferma della richiesta demo non nomina l'azienda**
  (`docs/PITCH.md`). Il testo è generico. **Lo stato resta il record e non un
  booleano**, perché la garanzia che la conferma non possa comparire senza una
  scrittura sta lì e non nella frase; la prova a schermo che il record è tornato
  dal provider si è spostata dove la demo la mostra già, cioè la riga in
  `/admin`.

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
  previste**. ~~Privacy policy, termini di servizio e cookie policy veri sono
  lavoro di M5, insieme alle quattro pagine istituzionali.~~ → **il 15.08.2026 i
  founder hanno ritirato il blocco f) dallo scope della demo**, e con lui tutte e
  sette le voci: **il lavoro è passato al perimetro dell'MVP** e ha la sua
  sezione in fondo ai refinement. La decisione dell'08.08 sull'affordance resta
  intatta ed è ancora ciò che si vede a schermo.

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

**~~Tre~~ ~~una~~ nessuna delle voci qui sotto è più di quella classe di
rischio, ed era quella che la residenza dei dati ha inaugurato** *(erano tre —
crittografia, consenso e `doneHint` — il 04.09.2026 ne sono state chiuse due, e
il 06.09.2026 la terza. La cifra si corregge qui invece di restare a contare
voci chiuse, ed è la seconda correzione in tre giorni: **è il segno che la
cifra non doveva esserci**, che è la regola di questo file sui numeri in prosa
accanto a una lista. Resta scritta barrata perché la classe di rischio non è
sparita — la descrive il resto del paragrafo, e il giorno in cui una schermata
tornerà a prometterne una si riconosce da qui)*: una **promessa di meccanismo** scritta in una
schermata che un cliente firmerà, mentre il meccanismo non esiste e nessuno ha
ratificato la frase. Si riconoscono da una prova sola — *se un cliente ci
chiedesse di dimostrarla domani, cosa gli mostreremmo?* — e per questo portano
tutte il conto delle stringhe con il criterio accanto: **il giorno in cui si
decide, quelle stringhe o si confermano o si cambiano**, e chi lo farà deve
sapere quante sono senza rifare la ricerca.

~~**La prima voce dell'elenco era di una classe diversa e peggiore**: non
prometteva un meccanismo che manca, affermava un fatto già falso.~~ →
**chiusa il 15.08.2026**, ed è l'unica delle quattro che si sia chiusa
scrivendo codice invece che prendendo una decisione, come la voce stessa
prevedeva.

> ~~**«Non vengono mai condivisi con terzi» è falso, e lo dice il portale del
> dipendente** (15.08.2026). La pagina Profilo dichiarava *"i tuoi dati sanitari
> sono protetti e non vengono mai condivisi con terzi"*, mentre lo psicologo è un
> collaboratore a mandato e le strutture del check-up sono soggetti distinti che
> producono il referto: terzi per qualunque definizione giuridica. Una stringa,
> `employee.profile.dataNote`, e cercando *"con terzi"*, *"a terzi"* e *"terze
> parti"* sulle 728 chiavi di `it.ts` era l'unica occorrenza del prodotto.~~
>
> → **Riscritta in tutte e quattro le lingue** (founder, 15.08.2026): *"i tuoi
> dati sanitari li vedono i professionisti che scegli tu."* **Nomina il
> destinatario invece di ripetere chi è escluso**, ed è la forma che le fa
> guadagnare il posto: il `PrivacyBanner` cento pixel più su dice già che nessun
> dato individuale arriva all'azienda, quindi una riscrittura su quella
> affermazione l'avrebbe duplicata nella stessa schermata — e il §11 direbbe di
> togliere la riga, non di riscriverla.
>
> **Senza esclusività, e per la stessa ragione per cui la voce esisteva.**
> *"Solo"* sarebbe vero sul prodotto — nessun metodo HR o admin restituisce
> `SessionNote` o `CheckupReport` (`CONTRATTO-DATI.md` §3) — e **lasco sul piano
> giuridico**, perché Kora quei dati li conserva ed è la parte che la privacy
> policy dovrà nominare come titolare. Sostituire una promessa falsa in diritto
> con una lasca nello stesso diritto sarebbe stato lo stesso errore una tacca più
> piccolo, dentro la passata che esiste per chiuderlo.

- ~~**La crittografia end-to-end è promessa a schermo e non è verificabile**
  (15.08.2026).~~ → **chiusa il 04.09.2026**, e sulla strada che la voce
  indicava per prima: **la frase si riscrive su ciò che si farà davvero**, non
  l'architettura sull'affermazione. Le tre stringhe dicono ora *"Cifratura in
  transito e a riposo"* e *"I dati sanitari viaggiano cifrati (TLS) e sono
  conservati cifrati"*, in tutte e quattro le lingue.

  **"End-to-end" è uscito perché non era compatibile**, ed è l'argomento della
  voce stessa: con un backend che calcola aggregati per reparto, deriva il
  diritto alle sedute e conserva le note di sessione, *solo gli estremi possono
  leggere* è falso. **"AES-256" è uscito per un'altra ragione**, e vale la pena
  distinguerle: non è incompatibile, è **un impegno che nessuno ha preso** su un
  dettaglio che al lettore non dice niente — nominare un cifrario è precisione
  che si può solo smentire.

  **Il chip della landing era il punto più esposto**, come la voce diceva, ed è
  il primo che si vede aprendo la demo: adesso porta la stessa frase della
  pagina privacy HR, che è la seconda metà della correzione — le due schermate
  dicevano la stessa cosa e devono continuare a dirla.

  **Il §8.2 del `docs/CONTRATTO-DATI.md` non si muove**: chi è titolare, chi
  responsabile, e come si concilia il segreto professionale con la
  conservazione della nota restano decisioni aperte. Questa voce riguardava
  **una frase a schermo**, non il meccanismo dietro.

  Il testo originale, che descrive quello che c'era:
  >
  > (15.08.2026). La pagina privacy dell'HR dichiara *"i dati sanitari sono
  > crittografati in transito e a riposo con standard AES-256"*, e la landing porta
  > lo stesso claim come chip accanto a "Hosting in Svizzera".
  >
  > **Quante stringhe la promettono, con il criterio**: in `src/lib/i18n/it.ts`
  > sono **3** — cercando le stringhe che nominano la cifratura — cioè il **titolo
  > e il corpo** del principio nel riquadro privacy HR
  > (`hr.privacy.principle.encryption`) e il **chip della landing**
  > (`public.landing.privacyChip.encryption`). Ognuna ha le sue tre traduzioni,
  > quindi a cambiare sarebbero dodici stringhe su quattro file, ma **il conto che
  > conta è tre**: sono tre punti a schermo, ed è quello il numero da rileggere.
  >
  > **Il chip della landing è il punto più esposto e non è quello che si
  > guarderebbe per primo**: la pagina privacy HR la vede un cliente che sta
  > valutando, il chip lo vede **chiunque apra la demo**, investitori compresi, ed
  > è nel percorso del pitch.
  >
  > **Perché è una decisione e non un compito.** "End-to-end" ha un significato
  > tecnico preciso — solo gli estremi possono leggere — e con un backend che
  > calcola aggregati per reparto, deriva il diritto alle sedute e conserva le note
  > di sessione, *quel* significato non è compatibile con l'architettura descritta
  > in questo documento. Cifratura in transito e a riposo lo è, ma è un'altra
  > affermazione. Quindi o la frase si riscrive su ciò che si farà davvero, o
  > l'architettura deve cambiare — e la seconda è una decisione che cambia il §8.2
  > del contratto, non una riga di `i18n`.
  >
  > **Proprietario: i founder**, insieme a chi scriverà il backend — è una scelta
  > di architettura prima che di copy. **Il trigger è il primo dato sanitario
  > vero**, cioè lo stesso del protocollo clinico: il giorno in cui esiste un
  > referto di una persona reale, la frase o è vera o è una dichiarazione falsa a
  > un cliente.

- ~~**Il consenso è promesso come già raccolto, e non esiste** (15.08.2026). La
  stessa pagina dichiara *"ogni dipendente conferma il consenso durante
  l'attivazione e può revocarlo in ogni momento"*. Il `CONTRATTO-DATI.md` §8.2
  dice l'opposto alla lettera: **nessun consenso viene raccolto in nessun punto**
  del percorso, e non esistono né l'export dei propri dati né la loro
  cancellazione.~~ → **chiusa il 06.09.2026**, e la chiusura ha due metà
  disuguali.

  **Il consenso adesso si raccoglie**: `/activate` lo chiede con una spunta
  obbligatoria prima delle dieci domande — cioè **prima del primo dato** — e il
  metodo non si può chiamare senza, perché il tipo di `consent` è il letterale
  `true`. La frase della privacy HR ha smesso di affermare un fatto che non era
  successo.

  **La revoca no, e la frase ha smesso di prometterla**: il corpo dice ora *"La
  revoca e l'esportazione dei propri dati arrivano con la messa in produzione"*,
  che è vero e sta scritto nel `docs/CONTRATTO-DATI.md` §8.2. **È la chiusura
  onesta di questa voce**, non la sua soluzione: quello che era una
  dichiarazione falsa a un cliente è diventato metà meccanismo e metà promessa
  dichiarata come tale.

  **Restano aperte quattro cose**, e stanno nel §8.2 del contratto: la
  **registrazione** del consenso — chi, quando, a quale versione del testo — la
  **revoca** con la domanda su cosa succede ai dati già raccolti, **export e
  cancellazione**, e se il consenso all'attivazione **copra gli altri punti di
  raccolta**. Quest'ultima è per il legale, non per chi scrive il codice.

  **Quante stringhe, con il criterio**: in `src/lib/i18n/it.ts` sono **2** —
  cercando le stringhe che nominano il consenso o la revoca — il **titolo e il
  corpo** di `hr.privacy.principle.consent`. Vivono in un punto solo, la pagina
  privacy HR, e non hanno un equivalente sulla landing.

  **È la più grave delle tre, e non per il numero.** Le altre due promettono un
  meccanismo che manca; questa afferma un **fatto giuridico compiuto** — che il
  consenso è stato dato — su una schermata rivolta al titolare del trattamento,
  cioè a chi su quella base tratterà i dati dei propri dipendenti. E promette una
  **revoca** che non ha nessun percorso: né un metodo del provider né una
  schermata.

  **Proprietario: i founder con il legale**, ed è la stessa decisione del §8.2 —
  chi è titolare e chi responsabile del trattamento — vista dal lato della frase
  che la anticipa. **Il trigger è prima del primo utente attivo**, come il
  protocollo clinico: il consenso o si raccoglie prima del primo dato, o non lo
  si raccoglie mai per quel dato.

- ~~**Il `doneHint` del check rapido promette una cadenza che il contratto non
  ha** (15.08.2026).~~ → **chiusa il 04.09.2026**. La stringa ha perso la
  seconda frase: dice *"Puoi cambiare la risposta finché è oggi."* e non
  aggiunge più *"Poi te lo chiediamo di nuovo"*, in tutte e quattro le lingue.

  **Chiusa togliendo, non decidendo**, ed è la forma che la voce stessa
  chiedeva: il difetto era che **una stringa a schermo stava decidendo ciò che
  il contratto lascia indeciso**, quindi il rimedio non era scegliere una
  cadenza — sarebbe stato lo stesso difetto con una parola più precisa — ma
  smettere di affermarne una. **Quale sia la cadenza resta una decisione dei
  founder**, e il vuoto sta dove viveva già: `docs/CONTRATTO-DATI.md` §3, fra le
  tre cose che mancano al check rapido.

  **Quello che resta è la metà vera, ed è anche l'utile**: la risposta si può
  cambiare finché è oggi, che è la proprietà che il tocco reversibile del
  20.08.2026 ha costruito e che a chi legge serve davvero.

  *(La passata del 20.08.2026 aveva già tolto l'intervallo — da «ti richiediamo
  come stai fra qualche giorno» a «Poi te lo chiediamo di nuovo» — e aveva
  ragione a lasciare la voce aperta: quella riscrittura toglieva **la cadenza**
  e teneva **la ricorrenza**, che è ciò che la voce del 15.08 chiamava per nome
  — «l'unica del prodotto che affermi una ricorrenza». È la seconda frase che
  esce oggi, e sono due mezze correzioni della stessa riga a due settimane di
  distanza.)*

  Il testo originale, che descrive quello che c'era:
  >
  > (15.08.2026). Dopo aver risposto, la card dice *"ti richiediamo come stai fra
  > qualche giorno"*. Il `CONTRATTO-DATI.md` §3 dichiara esplicitamente che **la
  > cadenza non esiste**: il contratto non dice ogni quanto si chiede, quindi non
  > può dire quando la risposta è dovuta, e non esistono né l'invito né il ritardo.
  >
  > **Quante stringhe**: **1**, `employee.rapidCheck.doneHint`, più le sue tre
  > traduzioni. È l'unica del prodotto che affermi una ricorrenza.
  >
  > **È la minore delle tre e va nominata comunque**, perché il difetto ha una
  > forma che le altre due non hanno: **una stringa a schermo sta decidendo ciò che
  > il contratto lascia indeciso.** "Fra qualche giorno" non è vago per prudenza —
  > esclude già la cadenza mensile e quella settimanale, cioè restringe una scelta
  > di prodotto che nessuno ha fatto, e la restringe nel punto in cui il §2.7 vuole
  > frasi intere e non decisioni nascoste nel copy.
  >
  > **Proprietario: i founder**, ed è una decisione di prodotto piccola con una
  > conseguenza di dominio grande — la cadenza è ciò da cui dipendono i misurati
  > del periodo, quindi la soglia di anonimato (`CLAUDE.md` §8). **Il trigger è il
  > primo pilot**, che è anche il momento in cui il check rapido smette di essere
  > un tocco in una demo e diventa la sorgente dei dati di stress veri. Fino ad
  > allora la frase non fa danno, e non va confermata per inerzia.

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
  check rapido accetta il valore peggiore **senza che nessuno venga avvisato**,
  la chat del medico non rileva il rischio.

  **Dal 05.09.2026 il numero d'emergenza c'è anche lì, e la voce resta
  aperta.** Toccando "Molto male" compaiono il 144, il 143 del Telefono Amico e
  un collegamento alla prenotazione, in tutte e quattro le lingue. **Non chiude
  niente di questa voce**: il protocollo non esiste, il referente clinico
  nemmeno, e la frase a schermo lo dichiara invece di lasciarlo intendere —
  *"Kora non avvisa nessuno al posto tuo"*. **Il consenso al contatto che quella
  frase nomina non esiste come dato**, ed è il §8.2 del contratto letto da
  questo lato: la seconda metà della riga — *"solo se lo hai chiesto tu"* —
  descrive una condizione che oggi nessuno può soddisfare, ed è deliberato,
  perché dice cosa il prodotto **non** fa senza promettere il meccanismo che
  manca. Quello che è cambiato è che una persona che dichiara di stare malissimo
  adesso vede un numero; quello che non è cambiato è **dove arriva il segnale**,
  cioè da nessuna parte. **Il numero d'emergenza c'è**, in due punti —
  il disclaimer della chat del medico e l'ultima risposta del suo arco, in tutte
  e quattro le lingue — e **non è nel check rapido**, che è dove il valore
  peggiore si dichiara senza parlare con nessuno. Il perimetro sta in
  `CONTRATTO-DATI.md` §8.1, che lo mette **primo** perché non è una funzione ma
  una condizione per operare. *(Fino al 15.08.2026 questa riga diceva che la
  chat non espone numeri d'emergenza, ed era falsa; fino al 17.08.2026 diceva
  "un punto solo", ed è invecchiata con l'arco. **Il vuoto non si è mosso**: due
  numeri nella stessa schermata restano zero percorsi dove il segnale arriva, e
  chi legge questa voce non deve leggere il secondo come un passo avanti.)*

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
  dell'hero e il badge. **Altre ~~6~~ 5 promettono conformità LPD/GDPR o
  "piattaforma svizzera" senza dire dove stanno i dati**: sono adiacenti e
  vanno rilette quel giorno, ma non sono la stessa promessa e **non si sommano
  alle prime cinque**. Sono 5 + 5, non 10, e nemmeno 5.

  **La sesta era l'informativa in fondo alla richiesta demo, ed è uscita dal
  conto il 04.09.2026** — non perché qualcuno l'abbia ricontata, ma perché
  **quella frase non promette più niente**: prometteva che i dati sarebbero
  stati *"trattati in conformità alla LPD svizzera e al GDPR"*, e adesso dice
  che **la richiesta resta nel browser e non viene inviata a nessuno**. È vero
  per costruzione — il provider vive in memoria (`CLAUDE.md` §10) — quindi è
  l'unica delle undici che si può dimostrare invece di ratificare.

  **La stessa nota sta ora anche nel footer pubblico**, sotto il copyright:
  *"Demo dimostrativa · dati di fantasia · nessun dato lascia questo browser"*,
  in tutte e quattro le lingue. Non entra in nessuno dei due conti di questa
  voce — non nomina la residenza né la conformità — e sta nel footer perché è
  l'unico punto comune alle quattro rotte pubbliche.

  **Le cinque della residenza non si toccano**, ed è la riga qui sotto che lo
  dice: per la demo vanno bene. A cambiare è stata **la promessa che si poteva
  sostituire con un fatto**, non quella che aspetta una decisione commerciale.

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
- **Il Business Plan da riallineare** (20.08.2026). Una revisione ha letto i due
  PDF di `docs/` contro `CLAUDE.md` e `docs/PITCH.md`, e ne sono usciti quattro
  fatti che **non sono difetti del prodotto**: sono difetti del documento, e il
  documento vive fuori da questo repository.

  1. **La soglia di anonimato.** Il BP **p.11** (parte A3) dà *"soglia min. 15
     dip per anonimato LPD"*; la demo usa **12 dipendenti misurati nel periodo**,
     con la motivazione in `CLAUDE.md` §8. **La regola per cui il documento si
     aggiorna è già scritta** — `CLAUDE.md` §10.B.1 la fissa per il check rapido,
     *dove i due divergono vince questo file e il documento si aggiorna*, e
     `docs/PITCH.md` la richiama alla lettera per la soglia — **e il documento
     non si è aggiornato**. Il BP deve anche dire **su quale dei due insiemi** la
     soglia si applica, perché oggi non lo dice: è la metà che rende la cifra
     ambigua, ed è la ragione per cui il pitch ha una risposta pronta su quel
     confronto.

     **Il ragionamento dei "Dubbi Business per CEO" §2.4 va rifatto**: costruisce
     un argomento intero sulla soglia a 15 — *"in un'azienda da 30 persone quasi
     nessun reparto supererà mai la soglia"* — e a 12 la sua conclusione può
     cambiare.

  2. **Il check rapido.** Il BP **p.7** lo descrive come *"ogni dipendente
     risponde ogni mese a 3 domande rapide (30 secondi)"*; la demo fa **una
     domanda, un tocco** (`CLAUDE.md` §8 e §10.B.1). Stessa regola del punto
     sopra, e stessa inadempienza: è il §10.B.1 che la dichiara, proprio su
     questo caso, e il documento non si è aggiornato.

  3. **Il quarto rapporto di ROI, e la sua etichetta.** Il BP **p.3** scrive
     *"per ogni CHF 55 investiti per dipendente, le aziende svizzere risparmiano
     in media CHF 220–440"*, cioè un rapporto fra **4:1 e 8:1**. `CLAUDE.md` §9 e
     `docs/PITCH.md` ne conoscono tre — 19,5:1 perdite totali su costo, 3,35:1
     risparmio lordo su costo, 2,35:1 risparmio netto su costo, che è l'unico che
     si mostra — e li disinnescano; **questo non esce da nessuna delle tre
     formule** e non è censito da nessuna parte. Finché è lì, un investitore che
     ha letto la p.3 ha in mano un quarto numero a cui il pitch non ha una
     risposta. Il BP deve toglierlo o ricondurlo a una delle tre.

     **E lo stesso numero ha un secondo difetto, che è ciò che rende pericoloso
     il primo**: la **p.6** etichetta la riga *"ROI potenziale (perdite evitate /
     costo KORA)"* mentre il calcolo è `1.289.500 / 66.000`, cioè perdite
     **totali** su costo. *"Perdite evitate"* sarebbe il risparmio — CHF 221'150
     — che su 66'000 dà **3,35:1**. Un rapporto **definito** diversamente si
     spiega in sala; un rapporto **etichettato** come risparmio recuperato no,
     perché chi legge non sta valutando una definizione: sta leggendo, nel nostro
     documento, che risparmia 19,5 volte quello che paga.

     **`CLAUDE.md` §9 conosce già l'aritmetica** e la dichiara *"perdite totali /
     costo"*. Quello che il repository **non sapeva** è che il BP la etichetta
     male: sono **due difetti distinti dello stesso numero**, e il BP li porta
     tutti e due. *(La p.4, l'executive summary, porta lo stesso 19,5:1 sotto la
     sola dicitura "ROI potenziale", senza formula: lì il numero è nudo, ed è la
     p.6 a etichettarlo.)*

  4. **L'aritmetica della tabella delle perdite, p.6.** Due righe non tornano con
     il modello:

     - **turnover**: la riga scrive *"4,3 abbandoni × CHF 50.000 costo medio"* e
       dà **CHF 217.000**, ma il prodotto è **215.000**;
     - **ricerca e sostituzione**: il BP dà **CHF 45.000**, il modello usa **CHF
       470 per dipendente**, cioè **47'000** a N=100.

     **Il totale non cambia** — le due voci sommano a **CHF 262.000** da entrambe
     le parti, ed è il valore che il BP stesso usa due volte a p.7 — quindi i
     cinque numeri di ancoraggio del §9 restano intatti e **`roi-model.ts` non si
     tocca**. Ma chi ricalcola voce per voce trova due righe che non combaciano.
     Il BP deve allineare lo split o dichiarare da cosa esce il 217.000.

  5. **Le fonti mancanti delle perdite** (04.09.2026). Le tabelle delle pp. 5-7
     citano nome e anno per l'assenteismo (SECO CH 2024, Confindustria 2023), per
     il presenteismo (Job Stress Index CH 2024, Stanford Presenteeism Scale) e
     per la prevalenza pre-burnout (Job Stress Index, Eurofound). **Due voci del
     modello non hanno nessuna fonte**: il **turnover** — *"4,3 abbandoni × CHF
     50.000 costo medio"*, dove la tabella 3.4 non ha colonna fonte e la 3.3 non
     porta il tasso — e i **CHF 65.000 di stipendio medio** che la voce
     pre-burnout moltiplica.

     **Il calcolatore adesso cita le fonti che esistono** e sul turnover dice
     quello che dice il BP di sé stesso — *stima conservativa* — perché
     inventarne una sarebbe stato il §2.4 disatteso nel punto in cui la pagina
     promette di essere verificabile. **Confindustria e la scala di Stanford
     restano nel documento e non a schermo**: sono italiana e americana, e uno
     scenario conservativo svizzero che vi si appoggia invita la domanda
     sbagliata.

     Il BP deve dare una fonte alle due voci o dichiararle stime, come fa già
     per la ricerca e sostituzione.

  6. **Il primo appuntamento entro 24 ore** (04.09.2026). Il BP **p.11** promette
     *"primo appuntamento entro 24 ore, nessuna lista d'attesa"*; il prodotto
     promette **72 ore** su tutti e tre i piani, e `CLAUDE.md` §9 lo dichiara con
     la ragione. **Stessa regola dei punti 1 e 2** — §10.B.1, dove i due divergono
     vince quel file e il documento si aggiorna — e questa volta la divergenza non
     è di prudenza: **le 24 ore il dataset non le regge**, perché la prima fascia
     libera della rete cade il 24.09 alle 09:00 e appartiene a una professionista
     su quattro.

     **La seconda metà della frase è un problema a sé**: *"nessuna lista
     d'attesa"* afferma l'assenza di un oggetto che il prodotto non ha —
     la lista d'attesa è una voce del perimetro dell'MVP
     (`docs/CONTRATTO-DATI.md` §8.5) — quindi non si trascrive in §9 e non si
     dice in sala.

  **Perché è una decisione e non un compito.** Nessuno dei ~~quattro~~ sei si
  chiude scrivendo codice o correggendo una riga di questo repository: si chiudono
  **modificando il Business Plan**, che è un documento commerciale con una sua
  versione e un suo destinatario. E su ognuno c'è una scelta che non è nostra —
  la soglia si riporta a 12 o si riformula sull'insieme giusto, il check rapido
  si riporta a una domanda o il prodotto ne aggiunge due, il 220–440 si toglie o
  si riconduce, lo split del turnover si allinea o si dichiara.

  **Il punto 6 è l'eccezione dichiarata alla riga qui sotto** (04.09.2026): §9
  **è** stato toccato, e non perché un numero sbagliato del BP sia diventato
  ammissibile — perché i founder hanno preso una decisione di prodotto che lo
  sostituisce, con la sua ragione, come il §10.B.1 prevede. È il verso opposto
  del 220–440, che resta fuori proprio perché nessuno ha deciso niente su di lui.

  **§9 non è stato toccato ~~dalla revisione del 20.08.2026~~, ed è la parte da
  non fraintendere** (founder, 20.08.2026). §9 è l'elenco dei numeri **che il prodotto può mostrare**, e un
  numero sbagliato del BP non diventa ammissibile perché lo abbiamo trovato:
  diventa una cosa da correggere alla fonte. Il 220–440 non entra in §9 **e non
  ci entra nemmeno come rimando**, e `docs/PITCH.md` **non guadagna una risposta
  pronta** — scriverla porterebbe quel numero in sala, che è esattamente ciò che
  la decisione evita. **Questa voce è il suo unico posto.**

  **Proprietario: i founder**, che sono gli autori del documento. **Il trigger è
  la prossima versione del Business Plan**, e i ~~quattro~~ sei si chiudono in
  una stesura sola: toccano poche pagine dello stesso file, e aprirlo una volta
  per voce è il modo di allinearne la metà. *(Erano quattro fino al 04.09.2026,
  e la cifra si aggiorna qui perché è accanto all'elenco che la smentirebbe.)*

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

- **Le animazioni d'ingresso dei grafici** (founder, 17.08.2026). La regola del
  `CLAUDE.md` §6.2 — **nessuna animazione d'ingresso su nessun grafico** —
  **resta intera e non si tocca**: vale per la demo, e questa voce non la
  scalfisce.

  Quello che si registra è **da dove è nata**. Il 07.08.2026 la ciambella della
  dashboard HR mostrò i settori vuoti — i gruppi `recharts-pie-sector` c'erano e
  non contenevano nessun `path` — perché l'animazione non completava, e la
  regola fu la risposta giusta a un rischio inaccettabile: la schermata su cui
  si regge il pitch poteva mostrare un buco. Ma **il difetto è stato misurato su
  una macchina sola**, e da un caso su un dispositivo non si può sapere se il
  problema sia di recharts, del browser o di quella macchina.

  Le due ragioni scritte nel §6.2 non pesano uguale fuori dalla demo. La seconda
  — *un'animazione d'ingresso è tempo morto da spiegare* — è una ragione **di
  presentazione dal vivo**, e in un prodotto che una persona usa da sola non
  vale: lì un ingresso morbido è il pattern normale, non un ritardo da giustificare.
  La prima — *il rendering deterministico rende affidabili le verifiche a
  schermo* — resta vera sempre, ma in produzione si compra con un interruttore
  in fase di test invece che con un divieto.

  **Il trigger è un parco dispositivi vero.** Va rivalutata quando esiste
  qualcosa su cui provarla davvero — browser e macchine diverse — e non prima:
  rimetterle oggi significherebbe riaprire su una misura sola il rischio che una
  misura sola aveva chiuso. E vale la pena ricordare che `prefers-reduced-motion`
  è la terza cosa da decidere quel giorno, perché un'animazione che si
  reintroduce senza di lui è un'animazione che qualcuno non può spegnere.

## Il perimetro delle pagine del footer — lavoro dell'MVP

Il blocco f) di M5 è stato **ritirato dallo scope della demo** il 15.08.2026, e
**il lavoro è arrivato qui**: non è cancellato, ha cambiato milestone
(`CLAUDE.md` §4, blocco f). Questa sezione è ciò che serve a chi lo costruirà, e
sta in questo file e non nel contratto dati per una ragione sola: **f) non ha
nessuna superficie di backend** — nessuna entità, nessun metodo, nessun
invariante — e sarebbe l'unico gruppo del §8 del contratto senza niente da
costruire per chi legge quel documento.

### Come il footer si legge oggi — misurato, non corretto

Il punto di partenza di chi costruirà, e la misura serve perché la decisione su
**quali delle sette voci esistono** si prende guardando come si leggono adesso.
Rilevato sulla **build demo** a 1280px, con `innerWidth` verificato prima di
fidarsi di qualunque numero (`CLAUDE.md` §11).

**L'affordance sull'elemento non c'è, ed è giusto così.** Tutte e sette sono `<p>`
senza `href` e senza `role`, con `cursor: auto` e `text-decoration: none` — la
decisione dell'08.08.2026 ha fatto il suo lavoro e non ha lasciato residui.
**Nessun bersaglio muto**: gli unici elementi focalizzabili del footer sono le
**cinque ancore vere**, e le sette voci stanno fuori dall'ordine di tabulazione.
La famiglia del pulsante check-up senza nome, chiusa il 15.08, qui non si
presenta.

**Il difetto è un altro, ed è di simmetria di colonna.** Le quattro voci
istituzionali stanno accanto ai cinque link veri e sono rese in modo
**indistinguibile**:

| | colonna "Piattaforma" | colonna "Azienda" |
|---|---|---|
| elemento | `<a href>` × 5 | `<p>` × 4 |
| stile calcolato | 14px, peso 400, opacità 0.8, `rgb(250,250,250)`, Inter | **identico** |
| prima riga | x 346, y 411, 274×20 | x 660, **y 411**, **274×20** |

Stesso asse verticale, stessa larghezza, stessa altezza, 314px di distanza. A
distinguerle resta il solo puntatore, cioè un'informazione che arriva **dopo** il
gesto e solo a chi passa sopra: l'affordance è stata tolta dall'elemento e
**lasciata nel layout**.

**Le tre voci legali invece si leggono come testo**, e questo chiude la lettura:
stanno a 12px e opacità 0.5, cioè **identiche alla riga di copyright accanto a
loro**. Ne discende la cosa che serve a chi deciderà — **nello stesso footer
esiste già il trattamento che dice "questo è testo", e ce l'hanno tre voci su
sette.**

**Non è stato toccato niente**: è scope (§2.6), e la scelta fra togliere le voci
dal footer e lasciarle è la stessa che questa passata rimanda. **La lettura visiva
resta da confermare su un browser vero**: il pannello riporta `visibilityState:
hidden` anche a scheda in primo piano e gli screenshot escono bianchi, quindi le
misure geometriche sono valide e il raster no — è la stessa limitazione già a
verbale nelle due passate precedenti.

### Cosa dipende da fuori, e cosa è lavoro di codice

**Fuori dal codice — è qui che sta il costo**, e nessuna delle tre si compra con
una passata diligente:

- **i testi legali**, che li scrive un avvocato e non chi lavora qui;
- **la decisione sulla residenza dei dati**, fra le decisioni in sospeso: una
  privacy policy deve dire dove stanno i dati, e finché non è ratificata il
  documento non è scrivibile senza affermare il falso;
- **la scelta di scope su quali delle sette voci esistono davvero**, che oggi non
  è presa e non va presa in anticipo.

**Lavoro di codice — è un ordine di grandezza meno**, e va detto perché non
sembri il contrario: se le pagine sono **testo statico**, ognuna è una rotta in
`App.tsx`, una voce di dizionario e una riga nel footer che diventa un link.
Nessun provider, nessuna query, nessun tipo. Il costo del blocco **non è la sua
implementazione**.

**Una conseguenza che il testo statico si porta dietro, e non è ovvia**: un testo
legale dentro `i18n` significa **quattro versioni giuridicamente vincolanti** da
tenere allineate — che non è tradurre un'etichetta. Va deciso **quale lingua fa
fede** e cosa succede quando una sola cambia. È una decisione da prendere prima
di scrivere la prima riga, non dopo.

### L'inventario delle promesse che la policy dovrà sostenere

**È la ragione per cui questa passata si fa adesso invece che il giorno in cui si
costruisce.** La privacy policy futura dovrà sostenere o smentire ciò che le
schermate promettono **già oggi**, e quell'inventario serve prima: è il tavolo su
cui si decide la residenza dei dati, che il §2.1 dei *Dubbi* colloca **prima del
primo pilot**, cioè prima dei contratti.

**Il criterio**, perché il conto sia rifacibile: si scorrono **le chiavi
stringa di `src/lib/i18n/it.ts`** — con quale criterio e con quale comando lo
dice il `CLAUDE.md` §2.7, e **quante sono lo dice `EXPECTED_KEYS`** in
`src/lib/i18n/placeholders.ts`, dove dal 17.08.2026 un guardrail lo verifica a
ogni avvio — e si
tengono quelle che **affermano qualcosa che una privacy policy dovrà sostenere o
smentire**. Restano fuori le etichette, i titoli
di colonna, gli stati vuoti e le stringhe che contengono una parola chiave senza
fare un'affermazione: "Lugano, Svizzera" è un indirizzo, "scenario conservativo"
è il modello ROI. Ogni promessa ha le sue tre traduzioni; **il conto è su `it.ts`
perché sono i punti a schermo**.

| famiglia | stringhe | classe | esito |
|---|---|---|---|
| dove stanno i dati | **5** (+6 di sola conformità) | meccanismo | ha già la sua voce |
| crittografia | **3** | meccanismo | ha già la sua voce |
| consenso | **2** | meccanismo | ha già la sua voce |
| **cosa l'azienda non vede** | **21** | **fatto, e vero** | il lato in positivo |
| **terzi** | **1** | **fatto** | era falsa, **riscritta il 15.08.2026**: nomina il destinatario |
| conservazione, cancellazione, diritti | **0** | — | terreno libero |

**Le prime tre hanno una voce fra le decisioni in sospeso** e qui si citano senza
duplicarle; **la quinta ce l'aveva e si è chiusa il 15.08.2026**, riscrivendo la
stringa. L'inventario serve a trovare le altre.

**Le 21 sono il lato in positivo, e valgono quanto valeva la promessa falsa** —
tanto che sono state **la riformulazione già pronta** per la stringa che l'ha
sostituita. Sono ciò
che la policy potrà affermare **senza rischi**, perché non sono promesse di
intenzione: le sostiene la forma del dominio, e il `CONTRATTO-DATI.md` §3 le
garantisce una per una — l'elenco dipendenti non ha nessun campo su cui un nome
possa arrivare, la soppressione sotto soglia avviene nel provider e il record
soppresso non porta il punteggio, la nota di sessione non è restituita da nessun
metodo dell'area HR o admin. Dove stanno: **3** nel portale dipendente, **16**
nell'area HR — di cui le sei di `hr.privacy.neverSeen.*`, che sono l'elenco più
esplicito che il prodotto abbia: *dati sanitari individuali, chi ha usato lo
psicologo, note cliniche o referti, diagnosi o trattamenti, prenotazioni
individuali* — **1** sulla landing e **1** nel back-office.

**Lo zero della sesta famiglia è un risultato, non un vuoto.** Cercando
conservazione, cancellazione, export e diritti dell'interessato, **nessuna
schermata promette niente**: né per quanto tempo i dati restano, né che si possano
scaricare o cancellare. Su quel terreno **la policy è libera di dire ciò che sarà
vero**, senza dover rincorrere una frase già pubblicata — ed è l'unica delle sei
famiglie di cui si possa dire. L'unico quasi-caso è `common.state.boot.body`,
*"quello che hai fatto finora non viene conservato"*, che parla dello stato della
demo in memoria e non di dati personali.

### L'effetto sul conteggio delle rotte — verificato, il criterio regge

Il `CLAUDE.md` §10 ha ora un criterio scritto che distingue **26 rotte dello
scope** da **27 schermate**, e dichiara che il numero si muoverà con le pagine del
footer. **Regge senza riscritture**: il criterio definisce una rotta dello scope
come *una voce del §10*, quindi aggiungerne `n` porta le rotte a `26 + n` e le
schermate a `27 + n` **per applicazione della definizione**, senza toccarla. A
muoversi sono i due valori, che è esattamente ciò per cui il criterio è stato
scritto al posto di un numero.

L'unica correzione che è servita è stata **l'attribuzione**, fatta in questa
passata: quella riga diceva che il conto si sarebbe mosso «con le pagine del
footer di M5.f», e da oggi sono lavoro dell'MVP.

**Ma `n` non è sette**, e chi costruisce non deve darlo per scontato: le sette
voci sono *sezioni*, non necessariamente sette rotte. "Contatti" può essere una
sezione della landing o un `mailto:`, "Blog" può stare fuori dall'applicazione, e
tre delle sette sono documenti legali che potrebbero condividere una rotta sola.
**`n` lo decide la scelta di scope**, che è la terza dipendenza qui sopra.

### Cosa non è di questo blocco

Nominare i confini è metà del lavoro, e questi quattro tornano a proporsi da soli:

- **il DPA e il contratto B2B** sono documenti commerciali, non schermate: si
  firmano, non si navigano, e non entrano nello scope del §10;
- **la QR-fattura** e il resto della fatturazione stanno già nel
  `CONTRATTO-DATI.md` §8, gruppo «Ciclo di vita dell'azienda e del dipendente»;
- **la raccolta del consenso, l'export e la cancellazione dei dati** sono
  **meccanismi**, e stanno nel `CONTRATTO-DATI.md` §8.2. La privacy policy li
  *dichiara*; non li implementa. Costruire la pagina senza costruire loro
  significa pubblicare la descrizione di funzioni che non ci sono — che è il
  difetto già registrato fra le decisioni in sospeso, non uno nuovo;
- **il cookie banner**, e qui c'è un fatto misurato che vale la pena sapere
  prima: **oggi l'applicazione non scrive niente**. `document.cookie`,
  `localStorage` e `sessionStorage` sono **vuoti a runtime** sulla build demo, e
  l'unica occorrenza di `document.cookie` in `src/` sta in un componente shadcn
  che non importa nessuno. Con zero richieste esterne a runtime (§3) **non c'è
  nessun cookie da dichiarare**: il contenuto di una cookie policy dipenderà da
  ciò che l'MVP aggiunge — un cookie di sessione per l'autenticazione, e
  qualunque analytics — non da ciò che esiste.

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
