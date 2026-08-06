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

**M0 e M1 chiuse.** La demo è condivisibile — non nomina soggetti reali, il marchio è
uno solo, non ha vicoli ciechi, e le schermate mediche dichiarano di essere
simulazioni — e il repository è nostro: niente base44, niente chiamate verso
l'esterno, TypeScript configurato, i file puri al loro posto.

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. In `reference/` c'è il sorgente della
precedente demo Next.js — `app/`, `components/` e `lib/`, senza configurazioni né
app eseguibile — come magazzino di sola lettura; si cancella a fine M3. Il
repository della vecchia demo è archiviato e non si tocca. I PDF del Business Plan
restano fuori dal repository: le cifre che servono sono trascritte in `CLAUDE.md`
§8 e §9.

### M0 — Messa in sicurezza

Undici commit. Cosa è stato fatto e perché:

- **Nomi reali sostituiti.** Swisscom e Reale Mutua comparivano come clienti
  paganti, Clinica Moncucco / Hirslanden / Ospedale Mendrisio come partner
  convenzionati, e due persone inventate avevano indirizzi `@swisscom.ch`. Il set
  sostitutivo è verificato e **congelato in `CLAUDE.md` §8**: M3 riusa quello.
- **Marchio unificato su Kora**, incluse dieci stringhe che dicevano "HealthOS"
  accanto al logo che diceva "Kora". La favicon non arriva più da `base44.com`: una
  richiesta a terzi a ogni caricamento, su un sito che vende hosting svizzero.
- **Link rotto riparato** (`/employee/piano-ai`, l'unico target morto del
  repository) e pagina 404 tradotta, ripulita dal testo del Builder e dalla
  chiamata a `base44.auth.me()`.
- **`/admin` dichiarato dimostrativo.** `ProtectedRoute` esiste ma dipende
  dall'auth di base44 e manderebbe al login del Builder: §10.E ammette "protetto
  **o** marcato", e marcare non richiede architettura. La guardia vera è M5.
- **Disclaimer medici** su medico virtuale e referto check-up, che producevano
  output clinico simulato senza qualificarlo.
- **Piano "Personalizzato" nascosto**, griglia riportata a tre colonne.
  `FlexiblePlanCard.jsx` resta nel repository.
- **Stima di risparmio rimossa** dal calcolatore prezzi e dal simulatore di
  fatturazione HR. Diceva "CHF 1'400–2'900 per dipendente all'anno" ed era la frase
  più in evidenza di entrambi i riquadri, ma **quella cifra non è nel Business
  Plan**: era la sola voce di quelle schermate che un investitore col documento in
  mano non avrebbe potuto ritrovare. Torna in M4, calcolata da `roi-model.ts` e
  etichettata come scenario conservativo (`CLAUDE.md` §9). Le due 💡 sono sparite
  con le righe che le contenevano. Nella stessa passata, l'estensione partner del
  Plus è passata da "+ CHF 15/mese" a "+ CHF 15/dipendente/mese": la cifra è nel BP
  (p.9), l'etichetta la faceva leggere come una tariffa unica per l'azienda.
- **Form demo risolto in locale.** Restava bloccato su "Invio in corso…" per
  sempre, sul CTA primario della landing.
- **Scope di ESLint allargato** a `src/**` (prima `src/lib`, `src/api`, `App.jsx` e
  `main.jsx` non erano lintati affatto) e 36 import inutilizzati rimossi.
- **Revisione**: i tre riquadri introdotti sopra (banner back-office e i due
  disclaimer) erano su `warning`, che il §6.1 riserva ad alert e stati critici.
  Sono avvisi, non allarmi, e bruciavano il colore che serve al banner dell'alert
  precoce di M3 (§10.C.1): portati a `bg-muted` / `border-border`. Nella stessa
  passata il marchio è andato sui token del §6.1: `KoraLogo.jsx` disegna con
  `hsl(var(--secondary))` e `hsl(var(--primary))` invece dei `#1BAA9A`/`#123A5A`
  ereditati, e la favicon — che è un file statico e le variabili non le legge —
  porta gli stessi valori scritti a mano, `#1BAC99` e `#11395A`.

**Verificato a schermo**: 25 rotte navigate dalla landing usando solo i link, zero
404; nessuna richiesta verso `base44.com` in nessun percorso, invio del form
compreso; `/pricing` a 1280 e 768; i due disclaimer; il banner admin.

**Difetti noti e accettati, da non riscoprire:**

- ~~`--quiet` nasconde i warning · 405 errori di typecheck · i font di Google~~ →
  tutti e tre chiusi da M1.
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
- L'organico resta **150**, non i 120 del §8: cambiarlo trascina il ricalcolo degli
  importi derivati su sei schermate, che è lavoro di M3.
- ~~`AuthContext` fa una richiesta fallita a ogni caricamento~~ → chiuso da M1
  insieme all'SDK.
- Il 👋 nella home dipendente resta: decisione in sospeso qui sotto.

### M1 — Fondamenta tecniche

Undici commit, uno per passo. **A schermo non cambia niente**, ed è stato verificato
confrontando le rotte con gli screenshot di M0, non a occhio.

L'ordine non era negoziabile in un punto: **l'alias `@/` è stato definito in
`vite.config.js` con il plugin base44 ancora attivo**, in un commit da solo. Lo
iniettava il plugin, e Vite non legge i `paths` di `tsconfig.json`: toglierlo prima
avrebbe fatto smettere di risolvere ogni import del progetto in un colpo solo.

- **Fuori base44.** L'SDK era un **grappolo chiuso** — `AuthContext`,
  `ProtectedRoute`, `base44Client`, `app-params` e `UserNotRegisteredError` si
  citavano solo fra loro, con `App.jsx` come unico punto di contatto. Cinque
  cancellazioni e una semplificazione, 636 righe in meno. `src/api/` conteneva solo
  `base44Client.js` e sparisce; `PageNotFound.jsx` si sposta in `src/pages/`, dove
  sta una pagina. **`base44/entities/*.jsonc` resta**: il §5.3 lo usa come lista di
  controllo della copertura del dominio. `base44/config.jsonc` no — configurava il
  deploy del Builder, che Vercel sostituisce.
- **TypeScript.** `jsconfig.json` → `tsconfig.json` con `strict: true`,
  `allowJs: true` e **`checkJs: false`**: le pagine ereditate compilano ma non si
  dichiarano tipizzate, che è la verità, ed entrano sotto controllo quando M3 le
  converte. `npm run typecheck` passa da 405 errori a **0**.
- **Dipendenze.** Via 13 pacchetti mai importati, 110 dal tree. In revisione ne sono
  emersi altri due, `sonner` e `next-themes`, tenuti in vita da un solo file morto:
  `components/ui/sonner.jsx` era l'unico a importarli, e nessuno importava lui —
  `App.jsx` monta il `Toaster` di `ui/toaster.jsx`, che è la reimplementazione senza
  Radix. Il §6.1 escludeva `next-themes` esplicitamente.
- **Font self-hostati.** Inter e DM Sans in variante **variabile**: un import per
  famiglia copre tutti i pesi da 100 a 900, quindi la domanda "quali pesi
  spediamo" non si ripresenta la prima volta che qualcuno usa un `font-semibold`
  che oggi non c'è. **Da qui le richieste esterne sono zero.**
- **Trapianto.** `format.ts`, `dates.ts`, `roi-model.ts` copiati da `reference/`.
  Nessuna schermata li usa ancora: si collegano in M3 e M4.
- **Scheletro i18n.** Dizionario tipizzato e interpolatore di segnaposto. Niente
  libreria, context, provider o namespace: c'è una lingua sola e nessuno switcher.
- **`vercel.json`** con la rewrite SPA.

**Due dipendenze nuove, approvate esplicitamente** (§3): `typescript-eslint` — solo
parser e regole `recommended`, non le varianti type-aware, che caricherebbero il
programma TypeScript a ogni lint e con `checkJs: false` coprirebbero comunque metà
del codice — e `@fontsource-variable/inter` + `@fontsource-variable/dm-sans`.

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
| M2 | Il contratto dati | da fare |
| M3 | Migrazione area per area | da fare |
| M4 | Calcolatore ROI e report scaricabile | da fare |
| M5 | Verso la produzione (differibile) | da fare |

## Decisioni chiuse

Decisioni dei founder che non appartengono a una milestone. La regola vive in
`CLAUDE.md`; qui restano la data e il motivo.

- **06.08.2026 — I semi dei trimestri precedenti** (`CLAUDE.md` §9, "Trimestri
  diversi da quello corrente"). Il selettore della dashboard ha quattro righe di
  partenza — iscritti, attivi e sessioni cumulate — e da lì si derivano risparmio,
  giorni di assenza evitati e percentuale di adozione. I semi sono conteggi di
  persone e non importi, perché un importo arrotondato non si inverte senza
  produrre una persona frazionaria. Nella stessa passata sono diventate esplicite
  due cose che erano implicite e senza le quali il §9 non era riproducibile:
  **l'arrotondamento del risparmio al centinaio** e **il periodo delle sessioni
  consumate**, che sono cumulate sui dodici mesi del monte annuo.

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
- **Polarità dei colori sulle KPI di trend.** `KPICard` colora di rosso ogni trend
  negativo: "Stress medio −8%", che è la buona notizia della dashboard, esce con la
  freccia in giù e in `destructive`. Serve sapere per ogni KPI se scendere è bene o
  male. Da decidere in M3, quando la dashboard legge dal provider.

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
