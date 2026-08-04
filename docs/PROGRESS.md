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

**M0 chiusa.** La demo è condivisibile: non nomina più soggetti reali, il marchio è
uno solo, non ha vicoli ciechi, e le schermate mediche dichiarano di essere
simulazioni.

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. In `reference/` c'è il sorgente della
precedente demo Next.js — `app/`, `components/` e `lib/`, senza configurazioni né
app eseguibile — come magazzino di sola lettura; si cancella a fine M3. Il
repository della vecchia demo è archiviato e non si tocca. I PDF del Business Plan
restano fuori dal repository: le cifre che servono sono trascritte in `CLAUDE.md`
§8 e §9.

### M0 — Messa in sicurezza

Otto commit. Cosa è stato fatto e perché:

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
- **Form demo risolto in locale.** Restava bloccato su "Invio in corso…" per
  sempre, sul CTA primario della landing.
- **Scope di ESLint allargato** a `src/**` (prima `src/lib`, `src/api`, `App.jsx` e
  `main.jsx` non erano lintati affatto) e 36 import inutilizzati rimossi.

**Verificato a schermo**: 25 rotte navigate dalla landing usando solo i link, zero
404; nessuna richiesta verso `base44.com` in nessun percorso, invio del form
compreso; `/pricing` a 1280 e 768; i due disclaimer; il banner admin.

**Difetti noti e accettati, da non riscoprire:**

- `npm run lint` esce 0, ma lo script usa `--quiet`: resta **un warning nascosto**
  (`bookingStep` mai letto in `Psicologi.jsx`, residuo di un wizard a più passi).
  Sparisce in M3 quando la prenotazione viene rifatta.
- `npm run typecheck` esce 2 con **421 errori** ereditati dai `.jsx` non tipizzati.
  Non è una regressione ed è il baseline da non superare finché M1 non sostituisce
  `jsconfig.json`.
- L'organico resta **150**, non i 120 del §8: cambiarlo trascina il ricalcolo degli
  importi derivati su sei schermate, che è lavoro di M3.
- `AuthContext` continua a fare una richiesta fallita a ogni caricamento. Va
  all'origine dell'app, non a base44, quindi non è un problema di privacy — sparisce
  in M1 con l'SDK.
- Il 👋 nella home dipendente resta: decisione in sospeso qui sotto.

### Punto di partenza — cosa c'è e cosa manca

Ereditato e funzionante: 25 rotte su cinque aree (pubblica, dipendente, HR,
professionista, admin), design system e navigazione, 45 componenti shadcn, grafici
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
| M1 | Fondamenta tecniche | da fare |
| M2 | Il contratto dati | da fare |
| M3 | Migrazione area per area | da fare |
| M4 | Calcolatore ROI e report scaricabile | da fare |
| M5 | Verso la produzione (differibile) | da fare |

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
  - **Si copiano davvero**: `lib/format.ts`, `lib/dates.ts`, `lib/roi-model.ts`,
    `lib/i18n/it.ts`, `lib/data/types.ts` e i dataset di `lib/data/mock/`. Sono file
    puri, già scritti e verificati.
  - **Si leggono come specifica e si riprogettano**: `lib/data/provider.ts`,
    `lib/data/index.ts`, `lib/data/use-data.ts` e le firme dei mock. Quel provider è
    **sincrono per scelta dichiarata** (lo dice un commento nel file) e la reattività
    passa da `useSyncExternalStore` su un contatore di versione. `CLAUDE.md` §5.1
    e §5.2 impongono provider asincrono e react-query: sono due modelli diversi, e
    convertirli per copia non funziona.
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
