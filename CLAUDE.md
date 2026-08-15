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

Il sorgente di quella demo è vissuto in `reference/`, un magazzino di sola
lettura da cui si copiava senza importare. **È stato cancellato alla chiusura di
M3**, quando non c'era più niente da prendere: le cinque aree leggono tutte dal
provider e ogni file di `lib/` ha il suo corrispettivo qui. Resta nella storia
di git, che è il posto giusto per un magazzino vuoto.

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
7. **Lingua: italiano di default — con architettura pronta per 4 lingue.** La
   piattaforma avrà IT, DE, FR, EN; **la demo si apre in italiano in ogni build**
   (it-CH: valuta CHF, numeri 14'200, date gg.mm.aaaa), e le altre lingue si
   raggiungono dal selettore. Valgono da subito:
   - Stringhe UI in `src/lib/i18n/it.ts` (oggetto tipizzato, niente testo cablato
     nei componenti). Aggiungere una lingua domani = aggiungere un file con le
     stesse chiavi. **Retrofittare l'i18n su ventisei schermate dopo costa dieci volte
     tanto: si fa mentre si tocca ogni schermata, non alla fine.**
   - **Mai concatenare stringhe per comporre frasi** (l'ordine delle parole cambia
     tra lingue). Sempre frasi complete con segnaposto:
     `"Hai usato {n} delle tue {max} sessioni"`, mai `"Hai usato " + n + ...`.
   - `format.ts` riceve il locale come parametro e **di default usa la lingua
     attiva** (`getLocale()`, da M5.e): nessuna schermata ne passa uno, quindi un
     default fisso a `it-CH` avrebbe tradotto le parole lasciando i numeri in
     italiano — il caso peggiore, perché a schermo sembra funzionare. Date,
     valuta e liste cambiano con il locale — fr-CH scrive `14'200 CHF`, con la
     valuta dopo. Nessun formato numerico o di data cablato nei componenti.
   - **L'apostrofo delle migliaia vale in tutte e quattro le lingue, ed è una
     decisione di stile** (founder, 14.08.2026): `14'200` in italiano, tedesco,
     francese e inglese. **Non è un fatto di CLDR**, e fino alla tranche
     francese di M5.e questa riga lo dichiarava tale — *"l'apostrofo in tutte le
     varianti svizzere secondo CLDR"* — mentre ICU dà a `fr-CH` lo **spazio
     unificatore stretto** U+202F. Era vero per due lingue su tre, e nessuno
     poteva accorgersene finché il francese non è esistito. Lo impone
     `format.ts` con `formatToParts`, e le ragioni stanno lì: `14'200` è la
     convenzione finanziaria svizzera in tutte le lingue nazionali, i numeri di
     ancoraggio del pitch tengono **una sola forma visiva** cambiando lingua, e
     non si introduce un quinto carattere invisibile in questo codice.

     **Il separatore decimale invece resta quello del locale** — punto in
     it-CH/de-CH/en, virgola in fr-CH (§11) — e la differenza fra i due casi è
     la ragione per cui la decisione è stata presa così: la virgola di `2,35` è
     **correttezza** per chi legge in francese, il raggruppamento è
     **registro**.
   - **Layout che regge il tedesco** (parole ~30% più lunghe): niente larghezze
     fisse su etichette e pulsanti.

   **Il language switcher c'è** (founder, 14.08.2026): il §4.e lo prevedeva come
   decisione del blocco, la tranche 1b di M5.e l'ha eseguito e questa riga lo
   ratifica. Sta **solo in `PublicNav`** — il giro del pitch attraversa comunque
   la barra pubblica — è fatto di sigle e non di un menù, e mostra **le sole
   lingue registrate in `DICTIONARIES`**, che dalla chiusura di M5.e sono
   **quattro**: `IT DE FR EN`. Il default è l'italiano e **la scelta non
   sopravvive a un ricaricamento**, perché il §5.4 vuole che la demo provata sia
   quella presentata.

   **Il divieto che stava scritto qui — "niente language switcher" — non era
   estetica, ed è caduto per la sua stessa ragione**: con un dizionario solo uno
   switcher è un comando che non comanda, e una sigla spenta accanto a quella
   accesa è un'affordance morta che invita la domanda "perché è grigia?" dentro
   trenta minuti contati. È caduto il giorno in cui il secondo dizionario è
   esistito davvero, non prima. La regola che ne discendeva — mostrare le sole
   lingue registrate — non è cambiata: è il registro che si è riempito, e il
   componente è passato da due sigle a quattro **senza che nessuno lo toccasse**.
   Fino al 14.08.2026 questa riga aggiungeva che «continua a non mostrare FR ed
   EN finché non ci sono», ed era vera il giorno in cui è stata scritta.
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

  **A M3 chiusa restano quattro `.jsx`, e non sono dimenticanze**: `HRLayout`,
  `ProLayout`, `KoraLogo` e `PageNotFound`. **Nessuna migrazione di M3 li ha
  toccati**: i due layout sono i wrapper di quindici righe che montano nav e
  `Outlet` e stanno al primo commit, il logo e la 404 non si toccano dai tempi di
  M1 — cioè da prima che l'eccezione sui componenti shadcn rendesse convertibile
  una schermata che importa `Button`. La regola qui sopra è stata applicata alla
  lettera, non disattesa: si convertono il giorno in cui qualcuno ci mette mano. 
  Il quinto, `FlexiblePlanCard.jsx`, resta `.jsx` per un'altra ragione
  ancora: il piano "Personalizzato" è in sospeso (§10.A.3) e i suoi undici prezzi
  non stanno nel Business Plan, quindi non potrebbe leggere da `Plan` nemmeno
  volendo.

  **Da M5.a i convertibili sono tre**: `HRLayout`, `ProLayout` e `KoraLogo`.
  `PageNotFound` è diventata `.tsx` con le stringhe in `i18n` perché il blocco
  a) l'ha toccata — cioè la regola qui sopra che si applica, non un'eccezione
  che cade. `FlexiblePlanCard.jsx` è sempre il caso a parte, e ci resta finché
  il piano è in sospeso.

  **Il criterio, prima di rifare il conto**: `find src -name "*.jsx"` ne trova
  **quattro**, e non contraddice il tre — somma i due insiemi che questa voce
  tiene distinti, quello che si converte al primo che ci mette mano e quello
  che non può convertirsi. Due numeri sullo stesso albero che contano cose
  diverse sono la trappola già costata il 19/11 contro il 13/9 delle CTA e il
  114 contro il 96 dei guardrail (§5.6). **Questo è l'unico punto che li
  nomina**: `docs/PROGRESS.md` cita e rimanda qui, invece di tenere un secondo
  elenco che può divergere.
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

  **La previsione su `form` non si è avverata, e si corregge invece di restare
  smentita in silenzio** (12.08.2026). Il blocco c) di M5 ha costruito la
  validazione con `react-hook-form` e `zod` **senza** `form.tsx`: `FormMessage`
  rende `text-destructive` e `FormLabel` colora l'etichetta in errore con lo
  stesso token, cioè **3.76:1**, sotto l'AA per il testo (§6.1). Sul messaggio
  si sovrascrive dal call site — `cn` usa `twMerge` — ma sull'etichetta no,
  perché il colore è condizionato all'errore e da fuori si può solo spegnerlo
  sempre; e cambiarlo dentro `ui/` sarebbe una terza eccezione al
  congelamento. Usarlo avrebbe **riaperto il debito AA che il blocco a) ha
  chiuso a zero**.

  **Resta qui, e per la prima volta è davvero l'ultima copia buona che questa
  voce dichiara di tenere**: la sua guardia è stata riparata (eccezione qui
  sotto). È l'argomento del toast alla rovescia — lì si è rimosso perché una
  copia rotta non è una copia buona, qui si è riparato perché la riparazione
  costava tre righe.

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

  **La seconda eccezione: due cambiamenti di comportamento, decisi insieme**
  (founder, 12.08.2026, all'apertura del blocco c) di M5). Stanno fuori dalla
  prima, che copre le sole annotazioni, e per questo sono dei founder: **un
  cambiamento di comportamento su un file congelato non si prende mentre lo si
  scrive.** Sono due punti nominati, non una licenza sui due file.

  **`form.tsx` — la guardia di `useFormField` è stata riparata.** Il controllo
  stava dopo la chiamata che doveva proteggere e il default del context era
  `{}`, cioè truthy: non scattava mai, e fuori da un `<FormField>` il
  componente sbagliava più avanti, in un punto che non lo dice. Tre righe:
  guardia sopra l'uso, default che può essere falso, un `as` in meno.

  **Il confine, dichiarato una volta**: la guardia copre il caso vero — un
  `FormItem` dentro un `<Form>` ma fuori da un `<FormField>`. Fuori anche dal
  `<Form>` non ci arriva, perché `useFormContext()` restituisce `null` e la
  destrutturazione lancia prima: è comportamento di react-hook-form, e
  restringerlo sarebbe stata una seconda modifica oltre la decisione presa.

  **`button.tsx` — l'anello di focus ha un `ring-offset`.** È il residuo del
  blocco a) di M5: anello `primary` a filo di un riempimento `primary`, 1.00:1
  su dodici CTA. Una riga alla base della `cva`, e le misure stanno in §6.1,
  dove il residuo è dichiarato chiuso.

  **Non la scioglie per il resto.** Classi, varianti e resa di
  `src/components/ui/` restano congelate. Le eccezioni sono tre, tutte datate,
  tutte nate perché senza di esse una regola di questo file era ineseguibile —
  e la prova che non sono una porta aperta è che il blocco c) ne ha **rifiutata
  una quarta**: `FormMessage` e `FormLabel` rendono l'errore a 3.76:1, e invece
  di correggerli si è costruita la validazione senza `form.tsx`.
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

~~Due gruppi sono installati e inutilizzati **di proposito**, e non vanno tolti
trovandoli senza `import`:~~ → **entrambi i gruppi hanno i loro chiamanti**, e la
riga si corregge con la data invece di restare smentita in silenzio:

- `jspdf` e `html2canvas` **sono usati da M4**: `lib/report-pdf.ts` li importa
  in modo dinamico, così la landing non paga il report di un'area che non
  visita (§10.C.3);
- `zod`, `react-hook-form` e `@hookform/resolvers` **sono usati da M5.c**
  (12.08.2026): `pages/public/DemoRequest.tsx` li importa per la validazione
  della richiesta demo. Restano gli unici tre chiamanti dell'app —
  `ui/form.tsx` importa react-hook-form, ma nessuna schermata importa lui
  (§3, l'eccezione sui componenti inutilizzati).

**Il gruppo cambia mestiere, non sparisce.** La ragione per cui questa voce
esisteva — *non togliere una dipendenza perché un grep non ne trova l'import* —
oggi la sorregge la regola qui sopra da sola: prima di rimuovere, cercare nel
codice. Con cinque dipendenze usate, la ricerca la trova.

**È la previsione gemella di quella su `form.tsx`**, tre sezioni più su, e
cade allo stesso modo: una riga che dice cosa *servirà* invecchia il giorno in
cui serve davvero, e nessuno torna a rileggerla perché non ha smesso di essere
vera — ha smesso di essere il tempo giusto.

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
  docs/PITCH.md          ← lo script operativo della presentazione dal vivo
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
      kora/              ← componenti di dominio nuovi: RapidCheckCard (M3),
                           StateNotice (M5.b), RequireRole (M5.d)
    lib/
      data/              ← il contratto dati e l'implementazione mock (§5),
                           più i guardrail e il prefetch della cache
      i18n/              ← i quattro dizionari (it, de, fr, en), il registro
                           delle lingue e la guardia dei segnaposto
      locale.ts          ← il tipo `Locale` e il default: modulo foglia, perché
                           lo leggono sia `format.ts` sia `i18n`
      format.ts          ← formatCHF, formatDate, formatPercent — unico punto
      dates.ts           ← aritmetica sui giorni: calcola, non formatta
      roi-model.ts       ← formule del calcolatore ROI (§9)
      earnings.ts        ← righe settimanali e totali dei compensi (§10.D)
      schedule.ts        ← la griglia del calendario, costruita dalle sedute
      plan-features.ts   ← le righe del listino, derivate da `Plan` (§10.A)
      platform-metrics.ts ← ricavo, attivazione e mese corrente del back-office
      report-pdf.ts      ← cattura la vista di stampa e compone il PDF (M4, §10.C.3)
      query-client.ts    ← configurazione react-query
  base44/entities/       ← i 12 schemi del progetto originale: lista di controllo
                           della copertura del dominio (§5.3), non un vincolo
```

`earnings.ts` e `schedule.ts` sono presentazione, non dominio: raggruppare per
settimana è una decisione della schermata e per questo non sta nel provider
(`docs/CONTRATTO-DATI.md` §2).

**`src/lib/utils.ts` manca da questa lista di proposito**, ed è l'unico file di
`lib/` che non compare: contiene il solo `cn()` — `clsx` più `twMerge` — e
appartiene al **layer shadcn**, non al dominio. Lo genera `shadcn` insieme ai
componenti, e la passata di tipizzazione di M3 lo trattò come tale
(`docs/PROGRESS.md`). Questa riga esiste perché una lista che nomina i file uno
per uno fa leggere ogni omissione come un'assenza, e la prossima rilettura non
debba rifare la domanda.

**`platform-metrics.ts` è lì per la stessa ragione, più una che si tocca con
mano**: sono conti sui dati e non dati — «il tasso di attivazione non è un
campo» (`docs/CONTRATTO-DATI.md` §3) — e finché sono vissuti in
`lib/data/mock/platform.ts` **nessuna schermata poteva importarli**, perché la
regola di lint del §5.7 lo vieta. Il risultato era che le pagine del
back-office li riscrivevano, ed è così che una divisione ripetuta in due punti
e un `if (!plan) return 0` sono finiti nel codice. Il giorno in cui `mock/` si
cancella, questo file non si tocca.

**Un solo `CLAUDE.md` in tutto l'albero.** È il file che orienta ogni sessione:
averne due significa due costituzioni in conflitto. Valeva per `reference/`
finché è esistito, e vale per qualunque sorgente si importi in futuro.

**Tre file di documentazione, tre mestieri diversi.** Le regole stanno solo qui:
palette, formule, dataset, definizione di "finito". `docs/PROGRESS.md` racconta
cosa esiste, milestone per milestone, ed è l'indice con cui ci si orienta
riprendendo il lavoro. `docs/PITCH.md` è lo **script operativo della
presentazione**: cosa si prepara prima, come si naviga durante, cosa si risponde
alle domande — approvato dai founder il 10.08.2026.

Nessuno dei due decide niente e nessuno dei due duplica: citano e rimandano qui.
La prova che il terzo mestiere è davvero un terzo: una regola che vale per il
codice sta qui, la sua conseguenza operativa il giorno del pitch sta in
`PITCH.md`, e la storia di quando è stata decisa in `PROGRESS.md`. Se una riga
starebbe bene in due dei tre, è scritta male in almeno uno.

`docs/CONTRATTO-DATI.md` non è un quarto mestiere: è **l'output di M2** e la
specifica con cui nasce il repository del backend (§5.7), quindi non parla a chi
lavora qui ma a chi lavorerà là.

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
- **M3 — Area per area.** HR → dipendente → **area pubblica** → admin; il
  professionista è già migrato in M2 e non si ritocca. Ogni area viene
  migrata **e** rinarrata nello stesso passaggio: dati dal provider, stringhe in
  i18n, importi da `format.ts`, microcopy nel registro giusto. Toccare due volte la
  stessa schermata è lavoro sprecato. **Ha chiuso cancellando `reference/`**,
  che era la prova richiesta: se serviva ancora qualcosa da lì, un'area non era
  finita.

  Il calcolatore ROI passa qui da M4 per decisione dei founder del 07.08.2026:
  è il terzo dei tre pezzi che il pitch ordina per importanza — dashboard HR,
  percorso dipendente, calcolatore — il motore `roi-model.ts` è trapiantato e
  verificato dai tempi di M1, e il back-office non ha valore narrativo.

  **Il terzo blocco è l'area pubblica intera, non il solo `/roi`** (founder,
  07.08.2026). Il calcolatore è la parte che il pitch mostra, ma le altre tre
  rotte della §10.A sono l'unica cosa che M3 lascerebbe indietro senza che
  nessun blocco la reclami — e una di loro ha un difetto che aspetta proprio
  questo passaggio: i **tre disallineamenti delle card prezzi** con il §9,
  aperti da M0, si chiudono facendo leggere le card da `Plan` invece di
  elencarne le voci a mano in JSX, e da lì la card non può più divergere dal
  piano. Landing e richiesta demo seguono la stessa regola dell'area: dati dal
  provider, stringhe in i18n.
- **M4 — Il report scaricabile** (§10.C.3). Il calcolatore ROI, che stava qui,
  è passato in M3.
- **M5 — Verso la produzione.** Differibile, non blocca niente: guardie di rotta per
  ruolo, stati di errore e vuoto veri, validazione dei form, accessibilità
  completa, le altre tre lingue, e **`Intl.ListFormat` per le enumerazioni**
  (founder, 10.08.2026) — le liste sono la terza cosa che cambia col locale dopo
  date e valuta (§2.7), e oggi nessun punto di `format.ts` le tratta.
  **Le schermate di M3 vanno costruite in modo da poterli ospitare, non da doverli
  rimandare.**

  **Si articola in sei blocchi**, approvati dai founder l'11.08.2026, e **ognuno
  chiude con una demo funzionante** (§2.3) — non sono fasi di un unico cantiere
  aperto. L'ordine non è vincolante tranne dove una dipendenza lo impone (f).

  - **a) Accessibilità completa.** Il punto di partenza è il censimento del
    debito AA in `docs/PROGRESS.md`, più ciò che non copriva: focus visibili su
    ogni elemento interattivo, `aria` e alt dove mancano, e il percorso del
    pitch percorribile **da sola tastiera** (§11).
  - **b) Stati di errore e vuoto veri.** Il contratto li regge già — `| null` e
    liste vuote sono valori legittimi (`docs/CONTRATTO-DATI.md` §5) — ma le
    schermate non li mostrano. **Il blocco deve proporre anche come si
    dimostrano a schermo**: il mock risolve sempre e non fallisce mai, quindi
    uno stato che nessun percorso produce è codice che il §11 non vuole e che
    nessuno può verificare.

    **Chiuso.** Le 27 schermate distinguono i tre casi — `undefined` sospende,
    `null` e le liste vuote rendono il vuoto, `isError` rende l'errore — e la
    regola sta scritta una volta in `loadState`, che **non conosce le forme**:
    il vuoto lo decide la schermata. La dimostrazione è
    `data/fault-injection.ts`, un `Proxy` con due manopole (`?fail`, `?empty`)
    che **esiste solo in sviluppo** e sparisce da entrambe le altre build,
    misurato col grep. Da qui `query-client.ts` non ritenta più — un tentativo
    automatico mette in pausa la query a scheda non visibile, e una query in
    pausa è un quarto caso indistinguibile dall'attesa. Il racconto e
    l'inventario schermata per schermata sono in `docs/PROGRESS.md`.
  - **c) Validazione dei form**, con `zod` e `react-hook-form`, che il §3 tiene
    installati apposta. **Porta con sé la decisione rimandata sulla guardia di
    `useFormField`** in `form.tsx`: il controllo sta dopo l'uso che dovrebbe
    proteggere e il default `{}` è truthy, quindi non scatta mai. È un cambio di
    comportamento su un file congelato, quindi è dei founder, e questo è il
    momento — prima `form` non aveva consumatori.
  - **d) Guardie di rotta per ruolo**, scritte da zero sui nostri ruoli: il
    `ProtectedRoute` ereditato è stato cancellato in M1 con l'SDK. **Porta due
    decisioni.** La prima è `react-router` 7, che chiuderebbe le due
    vulnerabilità moderate e i due avvisi sui future flag, ed è un major che
    cambia l'API del router. La seconda è un **vincolo nuovo**: la coreografia
    di `docs/PITCH.md` entra in `/admin` **come prima schermata** e ci rientra
    col tasto Indietro, quindi una guardia che intercetta quell'ingresso
    **rompe un momento del pitch**. Il modello di impersonificazione del ruolo
    va proposto con pro e contro all'apertura del blocco, non deciso mentre lo
    si scrive.
  - **e) Le altre tre lingue, DE per prima** — è quella che mette alla prova i
    layout (§2.7: parole ~30% più lunghe). **Porta la decisione sul language
    switcher**, che oggi il §2.7 vieta e che con quattro dizionari serve.
    Sostituisce anche l'idioma `t.common.listSeparator` con **`Intl.ListFormat`
    in `format.ts`**: i due call site a schermo sono già allineati al
    separatore del dizionario, quindi il lavoro è nel formatter e non nelle
    schermate.
  - **f) Le pagine del footer** — privacy policy, termini, cookie policy, più
    "Chi siamo", "Contatti", "Carriere" e "Blog", che dall'08.08.2026 sono un
    elenco di sezioni senza affordance da link. **Dipende da due cose fuori dal
    codice**: i testi legali dei founder, e la **decisione sulla residenza dei
    dati** (`docs/PROGRESS.md`, decisioni in sospeso) — una privacy policy deve
    dire dove stanno i dati, e oggi la promessa commerciale non è ratificata.
    Per questo è l'ultimo.

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
  getRoiSnapshot(period: Quarter): Promise<RoiSnapshot | null>
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

### 5.6 Guardrail: tre modi, una decisione sola

Controlli per i disallineamenti che a schermo non si vedono: il trimestre del PDF
diverso da quello mostrato, il trimestre corrente fuori dal dataset, uno snapshot
mancante, un id di professionista inesistente. Uno svarione si deve vedere mentre
si lavora, non durante il pitch.

| | comando | comportamento |
|---|---|---|
| sviluppo | `npm run dev` | **lancia** — pagina bianca, impossibile da non vedere |
| build demo | `npm run build:demo` | **logga** con `console.error`, la schermata regge |
| produzione | `npm run build` | **tace**, e sparisce dal bundle |

**La decisione vive in `src/lib/data/guardrails.ts` e in nessun altro punto.** I
call site sono 102 e chiamano `assertInDev` senza sapere in che modo girano:
ripetere la condizione in ognuno significherebbe poterla sbagliare in 102 posti.
Fuori da quel file nessuno legge `import.meta.env`.

**Il criterio con cui i call site si contano**, perché una rilevazione futura non
produca un terzo numero come è già successo con le CTA (`docs/PROGRESS.md`):
si contano le **chiamate** alle due primitive `assertInDev(` e
`assertInDevOutsidePromise(` sotto `src/`, escluso il file che le definisce —
cioè `src/lib/data/guardrails.ts`, **per percorso e non per nome di file**.
Oggi **95 + 7 = 102** (15.08.2026). Restano fuori, e sono le tre trappole del
conteggio: le righe di `import`, la **prosa dei commenti** che le nomina, e il
nome lungo che **contiene** quello corto.

**La terza trappola vale per una forma di grep sola, e va detto quale**, perché
scritta senza questa precisazione manda a sottrarre sei chiamate che nessuno ha
contato due volte. `assertInDev` **nudo** aggancia anche
`assertInDevOutsidePromise`, ed è così che nacque il 114; `assertInDev(` **con la
parentesi** non lo aggancia, perché dopo `assertInDev` c'è una `O` e non una
parentesi. Il criterio qui sopra dice *chiamate*, cioè con la parentesi: **è già
immune**, e chi conta con quello non deve correggere niente.

**L'esclusione va per percorso perché escluderla per nome ha già mangiato un
call site.** Il guardrail dei segnaposto di M5.e nacque in `i18n/guardrails.ts`,
e un criterio che salta *`guardrails.ts`* lo saltava insieme al file che
definisce le primitive: il conto continuava a dire 90 + 6 mentre le chiamate
erano 91. Il file è stato rinominato `i18n/placeholders.ts` (la sezione M5.e di
`docs/PROGRESS.md` racconta come è emerso).

**`prefetch.ts` è una categoria a parte e non entra nel conto**, benché chiami
`raiseOutsideCurrentStack`, che è la terza primitiva del file. Il motivo non è
il nome della funzione: è che la frase qui sopra parla di call site che **non
sanno in che modo girano**, e `prefetch.ts` il modo lo legge da sé — importa
`GUARDRAIL_MODE` e ci apre sopra il proprio controllo.

**Le esclusioni sono nominate, e sono queste due.** La prima è la terza
primitiva, `raiseOutsideCurrentStack`: le sue chiamate non entrano nel conto **da
nessun file**, e oggi la chiamano `prefetch.ts` e `fault-injection.ts`. La
seconda è `prefetch.ts` come categoria a parte, per la ragione qui sopra — che
resta scritta anche se le sue chiamate sarebbero già fuori per la prima, perché
dice **perché** quel file è diverso e non solo che non si conta.

**Il numero si muove, il criterio no**, e una rilevazione che dia una cifra
diversa da quella scritta qui va confrontata **prima col criterio e poi col
numero**: se il criterio è stato applicato per intero, a essere invecchiata è la
riga, e si aggiorna con la data. Un guardrail nuovo è un call site nuovo, ed è
esattamente ciò che è successo passando da 96 a 97 con la tranche tedesca.

**Il numero compare in questa sezione più di una volta, e una sola porta la
data.** È quella del criterio, qui sopra; le altre tre — le due che aprono la
sezione e quella sui nomi — sono prosa. Sono invecchiate **due volte in due
giorni**, mentre la riga datata veniva aggiornata da entrambe le passate che
muovevano il conto: non è distrazione, è che una cifra senza il criterio accanto
non chiede di essere riletta. Ne discendono due obblighi opposti e ugualmente
brevi: chi muove il numero **le muove tutte**, e chi ne trova una che non torna
guarda **prima** la riga datata (founder, 15.08.2026).

**Perché questa forma e non quella di prima.** Fino al 14.08.2026 la riga diceva
*"un 97 futuro va riconosciuto come errore di criterio, non come correzione"*:
blindava **un valore**, il 97 è arrivato in un giorno per la ragione più
ordinaria che ci sia, e la riga avrebbe fatto respingere come errore la misura
giusta. **Le regole si scrivono sui criteri, non sui valori che i criteri
producono** — riscriverla a 98 sarebbe stato ripetere lo stesso sbaglio con una
cifra più alta.

**Da dove veniva il 114** che questo file ha dichiarato fino all'11.08.2026: era
`grep -c "assertInDev"` grezzo, cioè 90 chiamate + 6 chiamate lunghe + 16 righe
di `import` + 2 righe di prosa. Non era un numero invecchiato — era un numero
senza criterio, ed è lo stesso difetto del 19/11 contro il 13/9 delle CTA.

**I nomi `assertInDev` e `assertInDevOutsidePromise` restano** anche ora che
girano in due modi su tre: in sviluppo asseriscono, in demo segnalano, in
produzione tacciono. Rinominarli sarebbe un commit meccanico su 102 chiamate, da
fare il giorno in cui serve davvero e non dentro una passata che deve restare
leggibile (founder, 10.08.2026).

**La build demo esiste perché il build del pitch era cieco.** È un build di
produzione, quindi fino al 10.08.2026 nessun guardrail vi girava: una manopola
girata male — `DEMO_TODAY` spostata di mese è il caso vero — non si vedeva più da
nessuna parte. `--mode demo` basta da solo e **non serve nessun file `.env.demo`**,
il che è anche l'unica strada percorribile: `.gitignore` esclude `.env*` (§2.5),
quindi un file d'ambiente necessario alla build romperebbe una macchina appena
clonata.

**È questa la build da deployare sull'alias che si condivide**, e
`vercel.json` la esegue: `"buildCommand": "npm run build:demo"`. Oggi il
repository ha un solo prodotto ed è la demo (§1.1), e una riga di documentazione
che nessuno esegue è peggio di nessuna riga. Che anche le preview di branch
diventino build demo è un beneficio: chi revisiona una preview vede i log in
console prima del merge. `npm run build` resta la build silenziosa, e questa
scelta si rivede insieme al resto il giorno del passaggio a produzione vera
(§5.7). Deciso dai founder il 10.08.2026.

**In produzione non resta niente, misurato e non promesso.** Vite sostituisce
`import.meta.env.DEV` e `MODE` con letterali al build, quindi il modo diventa una
costante e il minificatore butta via i rami morti **insieme ai messaggi**: nel
bundle di produzione non si trova né il controllo né il testo che avrebbe
stampato. La build demo costa 8 KB in più su ~1.1 MB.

**Un log della build demo non autorizza a proseguire.** Dopo il log
l'inizializzazione continua, quindi le schermate si disegnano lo stesso — con i
numeri che il guardrail ha appena dichiarato sbagliati. È il compromesso voluto,
perché davanti a un investitore una schermata rotta è peggio di un numero storto,
ma ne discende che **il log dice "i numeri a schermo potrebbero essere
sbagliati", mai "è tutto a posto"**. La regola operativa che ne segue — ci si
ferma, si riproduce in sviluppo dove il guardrail lancia, si corregge, si rifà la
prova — è in `docs/PITCH.md`.

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
  Testo bianco su `secondary` va verificato caso per caso — e la verifica caso
  per caso **resta**, perché riguarda ogni accostamento, non solo le CTA.
- **Le CTA piene vanno su `primary`, non su `secondary`.** Bianco su `secondary`
  dà 2.83:1 contro il minimo AA di 4.5, e le due strade erano scurire il token o
  spostare le CTA. **Deciso dai founder il 10.08.2026: si spostano le CTA**, così
  il teal resta la tinta dei dati positivi e degli accenti invece di cambiare di
  luminosità sotto ogni schermata già approvata. **Eseguito**: 13 punti su 9
  file, l'inventario è in `docs/PROGRESS.md`.
- **Il riempimento pieno ha due destinazioni, non una.** Le CTA vanno su
  `primary` (11.45:1); **chip, badge e KPI piene vanno sulla coppia
  `accent`/`accent-foreground`** (10.66:1, e 13.53:1 con `foreground`). Non è una
  sfumatura di gusto: una CTA è un invito ad agire e regge il blu pieno, mentre
  un badge di specialità in blu petrolio pesa quanto il nome che descrive.
- **Dove si corregge il pieno, e dove no.** Le varianti `secondary` di
  `button.tsx` e `badge.tsx` sono la sorgente del bianco su teal, ma stanno in
  `src/components/ui/`, che è congelato (§3): **si cambia la variante scelta al
  call site, non la definizione**. `KPICard` è fuori dal congelamento, e infatti
  la sua variante `secondary` è stata rimossa invece che aggirata.
  `FlexiblePlanCard.jsx` resta fuori dal conto: è codice morto del piano nascosto
  (§10.A.3).
- **Il verde pieno era chiuso sul testo, il debito AA no.** Restavano il caso
  **inverso** — `text-secondary` su fondo chiaro, 2.83:1 su bianco e 2.57:1 su
  `bg-secondary/10` — le icone teal su fondo chiaro, e **un'icona chiara su teal
  pieno** (2.72:1, più bassa del testo bianco perché eredita
  `text-primary-foreground`, che è 98%). Quest'ultima non era né l'uno né
  l'altro caso: è il verde pieno visto dal lato del non-testo, e andava tenuta a
  vista perché due liste che parlano d'altro se la perderebbero in mezzo. **Il
  rimedio è la riga qui sotto**, decisa l'11.08.2026 all'apertura del blocco a)
  di M5.

  **Chiuso dal blocco a)**: il censimento a schermo passa da 79 punti sotto
  soglia a **zero informativi**, su 27 rotte. La sezione M5.a di
  `docs/PROGRESS.md` porta i conti e come ci si è arrivati, compresi i due
  punti che questa riga non poteva prevedere: il censimento vecchio era da grep
  e **sbagliava in difetto**, e il debito delle icone non era di colore ma di
  `aria` — un'icona dichiarata decorativa è esente dalla 1.4.11, e qui ognuna
  sta accanto all'etichetta che porta già il significato.

  ~~**Resta un residuo, e non è chiudibile da lì.** L'anello di focus è
  invisibile sui CTA pieni: `--ring` è il blu di `primary` e i CTA stanno su
  `bg-primary`, cioè **1.00:1**, su **12 pulsanti**.~~ → **chiuso dal blocco c)
  di M5**, con la decisione dei founder del 12.08.2026 che il rimedio
  prevedeva: è la seconda eccezione al congelamento di `src/components/ui/`
  (§3), e sta in `button.tsx`.

  **Il rimedio è `ring-offset-2` alla base della `cva`, non ai dodici call
  site**: la sorgente era una, e dodici rattoppi sarebbero stati dodici posti
  da sbagliare. L'anello si disegna ora come **2px di `--background` più 1px di
  `--ring`**, e il difetto era che l'anello confinava con la stessa tinta del
  pulsante — non che l'anello fosse sbagliato.

  **Le misure, sui CTA pieni di tutta la demo**: anello/banda **11.50:1**,
  banda/riempimento **11.50:1**, anello/fondo pagina **da 11.50 a 11.95:1**. Il
  1.00:1 resta vero come rapporto fra anello e riempimento, e non conta più:
  fra i due c'è la banda. **Nessun CTA pieno sta su una sezione tinta o scura**,
  quindi il caso che poteva non passare qui non esiste — è la verifica da
  rifare se una schermata futura ne mette uno.

  **La base è condivisa, quindi la modifica tocca ogni variante.** Sui pulsanti
  chiari la banda è del colore della pagina ed è invisibile: si vede l'anello
  contro la pagina, **11.95:1**, cioè il valore che il blocco a) aveva già
  misurato. Non è una resa nuova per loro, è un distacco di 2px.
- **Due varianti di solo testo: `secondary-strong` e `destructive-strong`**
  (founder, 11.08.2026). Il colore che porta significato non può essere
  illeggibile, e i due token base non passano l'AA come testo:

  | token | HSL | bianco | tinta `/10` | `accent` |
  |---|---|---|---|---|
  | `secondary` | `172 73% 39%` | 2.83 ✗ | 2.57 ✗ | 2.53 ✗ |
  | **`secondary-strong`** | `172 73% 26%` | **5.75** ✓ | **5.20** ✓ | **5.14** ✓ |
  | `destructive` | `0 84.2% 60.2%` | 3.76 ✗ | 3.30 ✗ | 3.36 ✗ |
  | **`destructive-strong`** | `0 84.2% 44%` | **5.62** ✓ | **4.93** ✓ | **5.02** ✓ |

  **Si tarano sul fondo peggiore, non sul bianco.** Il testo colorato di questa
  demo vive quasi sempre dentro un badge o una card tinta — `bg-secondary/10`,
  `bg-accent` — e lì la soglia morde prima: a `30%` di luminosità il teal dava
  4.56 su bianco ma **4.13 sulla tinta**, cioè passava la misura che nessuno
  guarda e falliva quella che si vede. Una variante di testo va verificata su
  ogni fondo su cui compare, e il censimento a schermo è ciò che li elenca.

  **Si usano solo dove il colore è testo e vuol dire qualcosa.** Chip, barre,
  riempimenti, bordi e sfondi **restano sui token base**: lì il colore non deve
  essere letto, e cambiarlo sposterebbe la luminosità di ogni schermata già
  approvata — che è precisamente l'opzione scartata il 10.08.2026. Un token in
  più non è la stessa cosa di un token cambiato.

  **La ragione della scelta è la polarità del 07.08.2026**, che resta intatta:
  sulle KPI di trend il colore segue il beneficio, verde quando la metrica
  migliora e `destructive` quando peggiora. Portare quel verde su `primary`
  perché non passava il contrasto avrebbe chiuso il debito AA spegnendo la
  regola — e sul rosso non esiste nemmeno un colore dove spostarlo. Le due
  varianti tengono insieme le due cose invece di sceglierne una.

  **Il rosso non era nel censimento**, che contò solo il teal: a 3.78:1 passa la
  soglia del non-testo ma non quella del testo, quindi un inventario che lo
  ignora dichiara "zero punti sotto soglia" senza esserlo.
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

### 6.2 I grafici non si animano in ingresso

**Nessuna animazione d'ingresso su nessun grafico**: linee, barre, ciambelle e
marker si disegnano già completi. Deciso dai founder il 07.08.2026 dopo che la
ciambella della dashboard HR ha mostrato i settori **vuoti** — i gruppi
`recharts-pie-sector` c'erano e non contenevano nessun `path` — perché
l'animazione non completava. Cioè la schermata su cui il pitch si regge poteva
mostrare un buco a seconda della macchina.

Le due ragioni per cui è una regola e non la riparazione di quel grafico:

- **il rendering diventa deterministico**, e un difetto di dati si distingue da
  un fotogramma catturato troppo presto — che è anche ciò che rende affidabili
  le verifiche a schermo del §11;
- **un'animazione d'ingresso è tempo morto da spiegare quanto uno spinner**
  (§5.1). Durante una presentazione dal vivo nessuno aspetta che una barra
  cresca.

In recharts si scrive `isAnimationActive={false}` su ogni serie. **L'area admin
l'ha ereditata migrando in M3**: i suoi cinque grafici la dichiarano tutti. Da qui
la regola riguarda ogni serie che si aggiunge.

### 6.3 Tipografia

- Testo e UI: **Inter**.
- Titoli e numeri di rilievo: **DM Sans** (`font-display`).
- Numeri importanti (CHF, percentuali, orari, contatori): **`tabular-nums`**. Senza,
  le cifre ballano quando un valore cambia — e in questa demo cambiano di continuo.

### 6.4 Due registri di forme e densità

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
  di sistema, **niente emoji**. Nessuna eccezione: il 👋 del saluto nella home
  dipendente era l'unico caso in cui il registro consumer avrebbe potuto
  giustificarne una, e i founder hanno deciso il 07.08.2026 di **toglierlo** — il
  calore lo fa il copy, e un'emoji che lo sostituisce è la scorciatoia che rende
  infantile un registro che il §7 vuole caldo. Il 💡 del riquadro prezzi era già
  sparito in M0 con la riga che lo conteneva.
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

> *Il rename da "Alpine Finance SA" a **Demo SA** è stato fatto in M0, l'organico
> in M3. Il codice ereditato dichiarava **150** in più punti, e la divergenza si è
> chiusa portando il codice a 120, **mai il contrario**: tutte le cifre di questa
> sezione e della §9 sono congelate e verificate su 120, mentre allineare questo
> file al codice avrebbe imposto di riderivare gli snapshot ROI e il monte
> sessioni, cioè rifare lavoro già approvato. A 120 la fatturazione è CHF 6'600 al
> mese e CHF 79'200 l'anno.*
>
> *I `150` rimasti nel codice **non sono l'organico** e non vanno toccati: il
> valore di apertura del simulatore pubblico in `Pricing.tsx` e le tre soglie di
> sconto a volume del piano nascosto (§10.A.3). L'inventario delle occorrenze
> chiuse — compresa quella che un `grep 150` non trovava — resta nei difetti noti
> di `docs/PROGRESS.md`, che è dove le passate finite vivono come storia.*

6 reparti: Vendite (24), Operations (31), Finanza (18), IT (17), HR + Legale (15),
Direzione (15). Il codice ereditato ha reparti diversi e **senza le Vendite**, che è
il reparto della storia: vanno sostituiti con questi.

Persona dipendente: **Laura Bernasconi**, 34, Operations, profilo salute 78/100
("In buon equilibrio", area debole: sonno), 3/10 sessioni psicologo usate, 1/4
sessioni coach, **2 consulti di medico virtuale nell'anno**, check-up annuale
**già fatto**, prossimo appuntamento Dr.ssa Meier giovedì 17:30.

**Dei suoi quattro conteggi, uno solo è derivato e tre sono dichiarati**, ed è
una distinzione da tenere in chiaro nel codice invece che scoprirla leggendo il
dataset (§5.5):

- **3/10 psicologo si deriva** dall'agenda della Dr.ssa Meier — è il conto delle
  sedute erogate di Laura, la stessa funzione che alimenta il co-payment
  dell'elenco pazienti. Il giovedì 17:30 è quello stesso record visto dal lato
  dipendente.
- **1/4 coach è dichiarato qui.** Dietro non c'è un'agenda: il portale
  professionista è quello della Dr.ssa Meier, che è psicologa, e il Dr. Fontana
  non ne ha uno. Il giorno in cui un'agenda coach esistesse, il numero si
  deriverebbe da lì e questa riga sparirebbe — il dataset deve dire a chiare
  lettere che oggi è un seme.
- **2 consulti di medico virtuale** nell'anno di piano, e **il secondo è la chat
  che la schermata mostra**, cioè quella aperta il giorno della demo. Senza
  quella coincidenza il Profilo direbbe "2" mentre chi guarda è dentro il terzo,
  e il conto sarebbe già vecchio nel momento in cui lo si legge. Il conteggio si
  ricava dalla lista dei consulti, non è uno scalare: due numeri che descrivono
  la stessa cosa devono essere lo stesso numero. I 2 stanno dentro i 118 consulti
  aziendali dei dodici mesi, che su 82 iscritti fanno una media di 1.4.
- **Il check-up è completato**, con referto di marzo. È la stessa cosa che
  l'elenco dipendenti dell'HR dichiara della riga `L.B.`, ed è il vincolo che
  tiene la storia unica sui tre lati: la home e il Profilo non possono dire
  "disponibile", e la pagina check-up mostra il referto invece di riproporre una
  prenotazione. Il prossimo si apre dodici mesi dopo, cioè fuori dalla demo.

Nessuno dei quattro è un numero libero: il piano Plus dà 10 sedute di psicologo,
4 di coach, consulti di medico virtuale illimitati con risposta entro 4 ore e un
check-up annuale (§9).

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

**Il quinto è in verifica: Dr.ssa Keller** (stress lavorativo, DE/EN),
approvata dai founder il 08.08.2026. Non è un professionista in più
dell'offerta ma il **flusso di vetting messo a schermo**: documenti verificati,
mandato non ancora firmato, zero sedute erogate e nessuna valutazione. Senza di
lei la KPI "in verifica" del back-office mostra zero e la piattaforma sembra
non controllare nessuno.

**Non è prenotabile**, ed è la stessa regola del Centro Diagnostico Basalto: chi
prenota vede i soli professionisti con documenti *e* mandato in ordine. Lo stato
sta sul dato, non nella schermata — "attivo" si **deriva** da
`documentsVerified && mandateSigned`, senza un campo che possa contraddirli.

**Sedute erogate in carriera, ratificate dai founder il 10.08.2026**: Colombo
**340**, Rossi **285**, Meier **312**, Fontana **210**, Keller **0**. La somma è
**1'147**, ed è la KPI "sedute erogate" del back-office (§10.E): il totale non si
scrive accanto ai cinque, si somma da loro.

Sono **valori dichiarati, non derivati**, e la differenza va tenuta in chiaro: un
guardrail vincola la sola **Meier** — il suo totale non può essere minore delle
sedute erogate della sua agenda — perché è l'unica ad avere un'agenda dietro cui
rispondere. Gli altri quattro sono cifre del dataset come i conteggi di questa
sezione. In produzione si contano tutti dalle sedute.

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

### Il portafoglio clienti, per intero

M0 aveva congelato i nomi; **organici e piani erano rimasti quelli ereditati da
base44**, mai approvati, e da loro discende ogni totale del back-office.
Ratificati dai founder il **08.08.2026**, insieme ai nove valori nuovi che il
§10.E richiede.

| Azienda | Organico | Piano | Cliente da | Iscritti |
|---|---|---|---|---|
| Demo SA | 120 | Plus | 10.2025 | 82 |
| Larice Pharma SA | 420 | Executive | 01.2026 | 226 |
| Genziana Tech SA | 210 | Plus | 03.2026 | 92 |
| Studio Legale Rovere | 48 | Essenziale | 05.2026 | 15 |
| Betulla Assicurazioni SA | 85 | Essenziale | 07.2026 | 0 |

**Betulla è sull'Essenziale, non sul Plus.** Il codice ereditato la dava sul
Plus con 85 dipendenti, mentre `/pricing` dichiara il Plus per aziende da 100 a
300: le due schermate della stessa demo si contraddicevano, e 85 sta nella
banda 20–100 dell'Essenziale. Il mix piani che ne esce è **2 Essenziale, 2
Plus, 1 Executive**.

**Betulla è l'unica non attiva, e a schermo si legge "in attivazione".** Il
campo resta `active: false`; è l'etichetta a cambiare, perché "inattiva" su una
schermata che un investitore può vedere si legge come abbandono, mentre il caso
descritto è un contratto firmato due mesi prima della demo e non ancora
avviato — zero iscritti, nessuna fattura.

**Demo SA parte dal primo mese della finestra** perché la sua serie di stress e
i suoi quattro trimestri ROI coprono già dodici mesi: qualunque data più recente
contraddirebbe dati approvati.

**L'adozione scende con l'anzianità** — 68%, 54%, 44%, 31% — quindi la curva di
activation racconta l'onboarding invece di essere una scala scelta a mano.

**Da qui non si scrive più nessun numero di piattaforma**, si derivano tutti:

- **ricavo di un'azienda** = organico × prezzo del piano × 12;
- **ricavo mensile ricorrente** = somma delle aziende attive in quel mese,
  quindi una curva a gradini, uno per ingresso: 6'600 → 41'040 → 52'590 →
  **54'414**, che moltiplicato per 12 dà i **CHF 652'968** dell'elenco. Due
  strade, lo stesso numero;
- **activation** = 415 iscritti ÷ 798 organico dei clienti attivi = **52%**;
- **sessioni di piattaforma**: la serie di Demo SA (§8) è la curva di adozione
  di riferimento, e ogni altro cliente è quella curva scalata sul rapporto fra
  gli iscritti, contata dal suo mese di ingresso. Non serve nessun numero nuovo,
  e Demo SA sta letteralmente dentro il totale con le sue 142 sedute. **I
  servizi che il piano non include valgono zero**: senza, Studio Legale Rovere
  e Betulla risulterebbero consumare coach e check-up che l'Essenziale non ha.

Rete convenzionata per i check-up — **Centro Medico Ardesia** (Lugano),
**Poliambulatorio Quarzo** (Bellinzona), **Centro Salute Onice** (Locarno),
**Clinica Zaffiro** (Lugano), **Centro Diagnostico Basalto** (Mendrisio). È **una
sola rete**: il portale dipendente e il back-office elencano le stesse strutture con
gli stessi indirizzi, non due elenchi scollegati.

**Il Basalto è in convenzionamento, non ancora attivo**, ed è l'unico dei cinque:
il back-office lo dichiara da sempre `pending` con zero prenotazioni, e il portale
dipendente **non lo propone**. Lo stato sta sul dato della struttura, non nella
schermata che la disegna, altrimenti la stessa rete si racconta in due modi — che
è esattamente il difetto che il codice ereditato aveva, offrendo al dipendente una
struttura che l'admin diceva non ancora convenzionata.

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
- **Per le persone vale il contrario che per i luoghi: il cognome comune è più
  sicuro di quello raro.** Emerso cercando il quinto professionista
  (08.08.2026): due candidati dal suono ticinese, *Steiner* e *Balmelli*, hanno
  restituito ognuno **uno psicologo FSP reale e identificabile** in Ticino alla
  prima ricerca, perché cognome poco frequente più professione più cantone
  puntano a una persona sola. *Keller*, *Galli* e *Brunner* non hanno restituito
  nessuno: sono abbastanza diffusi da non identificare nessuno, ed è la stessa
  ragione per cui Colombo, Rossi, Meier e Fontana reggono. **La prova è
  cercare cognome + professione + cantone**, non il solo cognome.

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
3 consulti/anno, colloquio conoscitivo gratuito una volta, dashboard HR + ROI
base — % di utilizzo, stress anonimizzato, risparmio in CHF) · **Plus CHF 55** (10
sessioni/anno, extra CHF 28, coach 4 sessioni/anno, medico 4h consulti illimitati,
check-up annuale, piano AI ogni 6 mesi, dashboard HR per reparto con report
trimestrale e alert burnout precoce — notifica se un reparto supera la soglia di
stress) · **Executive CHF 82** (16 sessioni/anno,
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

**La dashboard HR mancava su Essenziale e Plus**, e per la stessa ragione delle
tre voci qui sopra: il §9 trascriveva la sola riga dell'Executive, quindi le due
card più economiche non potevano nominarla senza inventarla. Aggiunte dalla p.9
del Business Plan il **08.08.2026**, su decisione dei founder ai sensi del §2.4.

**I tre livelli sono tre cose diverse, non lo stesso prodotto in tre taglie**, e
la card deve poterli distinguere come distingue i due check-up: la base dice
*cosa* mostra (utilizzo, stress anonimizzato, risparmio), quella del Plus
introduce il **taglio per reparto** e l'**alert burnout precoce** — che è
l'alert del §8, cioè il pezzo su cui si regge la dashboard del §10.C — e quella
dell'Executive aggiunge la cadenza mensile e la call col team clinico.

**Le cadenze dei report non sono confrontabili fra i tre piani**, e non vanno
messe su una scala: il BP dà "trimestrale" al Plus e "mensile" all'Executive,
mentre sulla riga dell'Essenziale "mensile" si riferisce alla dashboard e non a
un report. Una cadenza numerica su `Plan` costringerebbe a decidere quel punto,
cioè a inventare: il livello è un'enumerazione e la frase intera vive in `i18n`.

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
la tariffa del singolo: dove cade ognuno è una scelta della demo, da dichiarare
nel file del dataset.

**Come si colloca dentro la banda**, ratificato dai founder il 10.08.2026: chi
ha storico segue la **valutazione**, che è l'unico ordinamento che il §8 dà del
roster; chi non ne ha — in verifica, zero sedute erogate, nessuna valutazione —
prende la **tariffa d'ingresso a metà banda, CHF 75**. È la regola che spiega la
Dr.ssa Keller: senza di essa la sua tariffa sarebbe l'unica del dataset senza un
motivo, e con una valutazione a `null` non c'è niente da cui farla scendere o
salire. Le cinque tariffe restano dichiarate nel dataset, e un guardrail
verifica che nessuna esca dalla banda.

**La stessa seduta sul mercato privato costa CHF 120–150** (BP p.9, riga
"Sessioni extra (oltre 6)" dell'Essenziale: *"Co-payment CHF 35/sess · vs CHF
120–150 mercato privato"*). Trascritta il 15.08.2026 su decisione dei founder ai
sensi del §2.4.

**È una cifra diversa dai CHF 70–80, e confonderle capovolge un argomento.** I
70–80 sono ciò che **KORA paga** al professionista per una seduta erogata; i
120–150 sono ciò che **il dipendente pagherebbe fuori** per la stessa seduta. Il
co-payment sta sotto entrambe — CHF 35, 28 e 22 secondo il piano — ed è quel
confronto a renderlo un **deterrente** e non una barriera economica: chi supera
il cap paga comunque una frazione del prezzo di mercato. Fino al 15.08.2026
`docs/PITCH.md` chiamava "tariffa del mercato privato" i CHF 70–80, cioè metteva
il costo di KORA al posto del prezzo di fuori, e la cifra vera non era in questo
elenco — quindi la risposta non avrebbe potuto citarla nemmeno volendo.

**A pieno regime, 20 sessioni a settimana valgono CHF 5'600–6'400 al mese.** Serve
al portale professionista: **il regime va sempre detto accanto al totale**,
altrimenti chi ha letto il BP legge uno scarto di un ordine di grandezza come un
errore.

**Disponibilità minima: 8 ore a settimana** (BP p.11, parte C1 "Ingresso nella
rete"). È una condizione d'ingresso alla rete, non un dato di compenso, e sta
sulla stessa riga del BP delle altre due che la demo già racconta: iscrizione
all'albo e firma del contratto di mandato — cioè i due controlli da cui si
deriva "prenotabile" (§8). Il portale professionista la mostra accanto al
regime tenuto. Trascritta il 10.08.2026 su decisione dei founder ai sensi del
§2.4: la cifra era già nel dataset e non nell'elenco delle cifre ammesse.

**Margini lordi per piano: 79% Essenziale, 73% Plus, 68% Executive** (BP p.9–10;
la banda **68–79%** ricompare a **p.4**, nella sintesi, e a **p.16**, sullo
stream 1 "Abbonamenti B2B"). Trascritti il 15.08.2026 su decisione dei founder ai
sensi del §2.4.

**L'avvertenza sta sulla stessa riga, perché due dei tre non si derivano dai
costi che il BP mostra.** Ricalcolando ogni esempio con le sole voci esposte:

| piano | ricavo | costi esposti nel BP | margine implicito | dichiarato |
|---|---|---|---|---|
| Essenziale, 50 dip | CHF 22'800 | 2'100 + 2'800 | 78.5% | **79%** |
| Plus, 150 dip | CHF 99'000 | 10'500 + 6'750 | 82.6% | **73%** |
| Executive, 400 dip | CHF 393'600 | 71'120 | 81.9% | **68%** |

Solo l'Essenziale torna. Su Plus ed Executive restano rispettivamente **CHF
~9'480 e ~54'832** di costi che il documento non espone, quindi le due cifre
dichiarate sono più prudenti di ciò che i loro esempi sostengono — il che è la
direzione giusta in cui sbagliare, ma non le rende derivabili.

**Ne discende una regola d'uso, e non è un divieto di citarle.** Averle qui dà
loro una casa e chiude una lacuna del §2.4; **non le promuove a risposta di
pitch**. `docs/PITCH.md` continua a dire di non improvvisare il margine lordo, e
la ragione non è mai stata che la cifra mancasse: è che citarla invita la domanda
*"da cosa esce"*, a cui gli esempi del Business Plan rispondono per un piano su
tre.

**Il co-payment non è uno stream di margine, e a dirlo è il Business Plan**: la
tabella dei flussi di ricavo (p.16) gli assegna margine **"—"** e funzione
*"Fidelizzazione — incentiva l'uso consapevole del cap"*, mentre il 68–79% sta
sullo stream 1, gli abbonamenti. È la conferma documentale della correzione del
14.08.2026 a `docs/PITCH.md`, che ha spostato la risposta sul margine dal
co-payment al **divario fra sessioni incluse ed erogate** — e la conferma vale
più del ragionamento che l'aveva prodotta, perché viene dalla fonte.

**Utilizzo del servizio psicologico: il Business Plan ne dà due letture, e non
sono compatibili.** Trascritte entrambe il 15.08.2026 su decisione dei founder ai
sensi del §2.4, perché la risposta pronta del pitch ha bisogno di tutte e due —
una per rispondere, l'altra perché è da lì che arriva la domanda.

1. **La banda mensile: 15–25%** dei dipendenti usa attivamente il servizio
   psicologico *"in un mese dato"* (BP p.9, riquadro "Principio fondamentale"),
   con l'esempio *"con 50 dipendenti: 10–12 attivi = 25–30 sessioni/mese
   totali"*.
2. **Gli esempi di margine, che sono annuali.** Plus: *"150 dip: Ricavo CHF
   99'000/anno. 30 dip × 5 sess = 150 sess"* — cioè **30 persone su 150, il 20%,
   cinque sedute a testa sull'anno**. Essenziale: *"50 dip … Utilizzo 20% = 30
   sessioni"* — 10 persone su 50, ancora il **20%**, tre sedute a testa.

**Si contraddicono di circa un fattore dieci, e la contraddizione è interna al
BP**: sullo stesso Essenziale, 25–30 sessioni al mese fanno 300–360 all'anno su
un monte annuo di 300 (50 × 6), mentre l'esempio di margine — nello stesso
riquadro, due righe sotto — calcola il 79% su **30 sessioni all'anno**.

**Dove il BP diverge da sé stesso vince l'esempio di margine**, ed è la lettura
che il dataset del §8 segue: è l'unica delle due che regga il proprio conto. La
banda mensile resta trascritta perché **è la riga che un investitore ha letto**,
non perché sia utilizzabile in un confronto.

**Per Demo SA l'esempio è quello del Plus**, che è il suo piano: le persone e le
sedute a testa vengono dalla **stessa riga**, e prenderle da due esempi diversi —
le persone dal Plus e le sedute dall'Essenziale, o viceversa — produce due
risultati lontani fra loro. È l'errore che questa trascrizione esiste per
impedire, ed è già stato commesso una volta preparando la risposta pronta.

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
quattro voci sommano al totale mostrato, e a N=100 escono i cinque numeri di §9;
e **le card prezzi leggono da `Plan`**, quindi nessuna delle loro voci può
divergere dal §9 — è il modo in cui si chiudono i tre disallineamenti aperti da
M0, non correggendo tre righe di JSX che la prossima passata riaprirebbe.

### B. Portale dipendente — `/employee` + 5 sottopagine
Home, Psicologi, Medico virtuale, Check-up, Piano AI, Profilo.

1. **Check rapido nella home** — costruito in M3. **Una domanda, un tocco** (§8).
   È il segnale su cui poggia ogni dato di stress della dashboard HR, e senza di
   esso a un investitore che chiedeva da dove arrivassero quei numeri non avevamo
   niente da indicare. Il Business Plan lo chiama "cuore di KORA" e ne descrive
   tre mensili: dove i due divergono vince questo file, e il documento si aggiorna.
   È una card nella home, **non una rotta nuova**: non entra nel conto delle 26.
   Approvato dai founder il **06.08.2026** ai sensi del §2.6.

**Finita quando:** prenotare uno psicologo **fa succedere qualcosa** — la parte in
programma del contatore sale, l'appuntamento compare in home, lo slot sparisce dalla
disponibilità e compare nel calendario del professionista. Nessun vicolo cieco: ogni
schermata ha una via d'uscita, e ogni voce del menu porta a una rotta che esiste.

**"Il contatore sale" non vuol dire che 3/10 diventa 4/10.** `used` è il conto delle
sedute **erogate** (§5.5, e la tabella delle KPI di `docs/CONTRATTO-DATI.md` §3), e
una prenotazione nasce `scheduled`: farlo salire sarebbe un secondo numero pinnato
sullo stesso fatto, e direbbe al dipendente che ha consumato una seduta che non ha
ancora fatto. A muoversi è la parte in programma, e la frase le tiene distinte:
*"3 su 10 sessioni usate · 1 in programma"*. Deciso dai founder il 07.08.2026.

Ne discendono due guardrail dell'area: dopo una prenotazione `used` è invariato, e
**nessun numero dell'area HR si muove** — le sessioni consumate dell'azienda contano
le erogate, e vengono dalla serie di utilizzo (§9), non dall'agenda.

### C. Portale HR — `/hr` + 4 sottopagine
Dashboard, Dipendenti, Report, Fatturazione, Privacy.

1. **Dashboard**: KPI, utilizzo servizi, **stress per reparto**, **trend 12 mesi
   azienda vs Vendite con marker dell'alert**, **banner alert precoce** — i tre
   pezzi che base44 non aveva, costruiti in M3 — e selettore trimestre che cambia
   i dati.
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
il link vede il back-office con l'elenco dei "clienti".

**Le guardie di ruolo esistono dal 12.08.2026** — blocco d) di M5, scritte da zero
sui nostri ruoli, perché il `ProtectedRoute` ereditato era stato cancellato in M1
insieme all'SDK e usarlo avrebbe mandato al login del Builder. **Ma in demo non
negano l'accesso a niente, per costruzione**: `RequireRole` è una porta che
concede, e il ramo che nega si raggiunge solo con una manopola di sviluppo (§4,
blocco d). Quindi a proteggere `/admin` davanti a chi ha il link **resta il banner
dei dati dimostrativi**, e la riga che segue vale intera.

Fino al 15.08.2026 questa voce diceva *«la guardia vera è M5 e va scritta da
zero»*, ed era vera fino al giorno in cui è stata scritta. La stessa correzione,
con la stessa formulazione, è in `docs/PITCH.md`: se le due divergessero il
difetto tornerebbe da qui, perché è questa la fonte.

**Finita quando:** i totali di ogni schermata si ricavano dai dati e non sono
scritti a mano. **Soddisfatto in M3**: la schermata ereditata faceva convivere
"618 utenti attivi" con un tasso di attivazione che ne implicava 767, e un
fatturato del mese che non tornava con l'elenco delle aziende accanto.

### Come si naviga durante la demo

Il provider vive in memoria: lo stato sopravvive alla navigazione interna, non a un
ricaricamento. Si parte dalla landing e si usano i link, mai la barra degli
indirizzi.

**La landing non si pre-apre in una scheda di sfondo**: l'animazione d'ingresso
resta congelata finché la scheda non è visibile, e la prima schermata che
l'investitore vede sarebbe quasi vuota. Il browser sospende
`requestAnimationFrame` sulle schede nascoste, quindi non è un difetto da
correggere ma un vincolo su come si apre la demo — misurato in M3: dopo due
secondi a scheda nascosta l'hero sta a un'opacità di 0.07. Se la landing va
aperta in anticipo, va **portata in primo piano** prima di cominciare.

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
- **Il separatore decimale segue il locale, e non è una sola convenzione**: punto
  in it-CH, de-CH ed en (`2.35:1`), **virgola in fr-CH** (`2,35:1`). Lo decide
  CLDR e lo applica `format.ts`; nessuna schermata scrive un separatore.
  L'apostrofo delle migliaia invece vale in tutte e quattro perché **glielo
  imponiamo noi** (§2.7), quindi in francese si legge `14'200` e `2,35` nella
  stessa pagina — è così che si scrive in Svizzera romanda, non un'incoerenza da
  correggere.

  **Fino al 14.08.2026 questa riga diceva "il separatore decimale è il punto"**,
  con la stessa motivazione — la convenzione svizzera — ed era **verificata su
  una lingua sola**: con il solo italiano a schermo, "svizzero" e "it-CH" non si
  distinguevano. La tranche francese di M5.e li ha separati, e la regola si è
  corretta con la sua data invece di restare smentita da `/roi` (founder,
  14.08.2026, con l'approvazione della proposta di M5.e).

  **Il 2.35:1 del §9 non cambia**: è il numero del Business Plan, che è scritto
  in italiano e resta l'ancoraggio con cui si verifica il modello. In francese lo
  stesso valore si scrive `2,35:1` — cambia la resa, non la cifra, ed è la
  differenza che questa riga esiste per tenere ferma.
- **Nessuna data scritta a mano.** Le date si derivano da `DEMO_TODAY` e si
  formattano con `format.ts`. Le quattro coppie giorno/data sbagliate di
  `ProSessioni.tsx` — l'anno riscritto a mano su date del 2025 — sono sparite
  con la migrazione di M2, i mesi delle fatture HR e le iscrizioni dell'admin con
  quella di M3. **Da lì non ne resta nessuna**, e la regola sorveglia ciò che si
  scrive.
- Accessibilità di base: contrasti AA, focus visibili, alt text. La demo si presenta
  anche da tastiera durante un pitch: i focus contano.
- **A fine sessione**: riepilogo di cosa è stato fatto e screenshot delle schermate
  toccate, così i founder revisionano a colpo d'occhio. Le verifiche si fanno **a
  schermo con asserzioni concrete**, non solo con `tsc` e lint puliti.
- **Prima di misurare: scheda in primo piano e viewport reale.** A scheda
  nascosta il browser sospende `requestAnimationFrame` e `innerWidth` vale **0**,
  quindi ogni catena `width: 100%` collassa: le misure non sono imprecise, sono
  di un'altra pagina. Uno strumento che aspetta un fotogramma non riparte mai, e
  uno che salta gli elementi invisibili li salta **tutti**, restituendo un
  conteggio basso che sembra una buona notizia. Si controlla `innerWidth` prima
  di fidarsi del primo numero, e **un censimento si rifà due volte**: se i due
  giri non coincidono, a essere rotto è lo strumento. La conseguenza sta in
  `docs/PITCH.md` per il giorno della presentazione; questa riga sta qui perché
  è il punto in cui si sta per sbagliare (founder, 11.08.2026).
