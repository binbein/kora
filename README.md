# KORA — frontend

Piattaforma B2B di salute aziendale per il mercato svizzero. Questo repository è
**insieme** la demo per gli investitori e il frontend dell'MVP: i dati sono finti,
l'interfaccia no.

**Le regole stanno in [`CLAUDE.md`](CLAUDE.md)** — è l'unica fonte, e va letto
prima di toccare qualunque cosa. Gli altri tre documenti hanno mestieri distinti,
e nessuno dei quattro ripete ciò che dice un altro:

| | |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | **le regole**: palette, formule, dataset, definizione di "finito" |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | **la storia**: cosa esiste e perché, milestone per milestone, con le decisioni prese e quelle in sospeso |
| [`docs/PITCH.md`](docs/PITCH.md) | **lo script della presentazione**: cosa si prepara, come si naviga, cosa si risponde |
| [`docs/CONTRATTO-DATI.md`](docs/CONTRATTO-DATI.md) | **la specifica per il backend**: gli invarianti che l'API dovrà rispettare, e il perimetro di ciò che l'MVP dovrà ancora costruire |

Riprendendo il lavoro si parte da `PROGRESS.md`; scrivendo il backend, da
`CONTRATTO-DATI.md`.

## Avvio

```
npm install
npm run dev
```

Vite stampa all'avvio l'indirizzo su cui il server risponde: è quello, perché la
porta cambia se la prima è occupata.

**Per vedere la build demo servono due comandi**, perché il primo produce `dist/`
e finisce:

```
npm run build:demo
npm run preview
```

Serve quando si prova il giro del pitch, o si controlla una preview di branch
prima del merge: è la build che viene deployata, e in sviluppo non si vede.

Non serve nessun file `.env`: non c'è backend, e non deve essercene uno
(`CLAUDE.md` §2.5).

## Comandi

| | |
|---|---|
| `npm run dev` | server di sviluppo |
| `npm run build` | build di produzione in `dist/` |
| `npm run build:demo` | build di produzione **con i guardrail che parlano** — è quella che si deploya |
| `npm run preview` | serve l'ultimo build |
| `npm run lint` | ESLint — deve uscire a zero, warning compresi |
| `npm run lint:fix` | ESLint con le correzioni automatiche |
| `npm run typecheck` | `tsc` — deve uscire a zero |

## I tre modi, e cosa fanno i guardrail

I guardrail sono controlli sui disallineamenti che a schermo non si vedono — un
trimestre fuori dal dataset, due schermate che dicono lo stesso numero in modo
diverso. Girano mentre il dataset si inizializza, e **si comportano in tre modi
diversi a seconda di come parte l'applicazione**:

| | | |
|---|---|---|
| `npm run dev` | **lanciano** | pagina bianca: impossibile da non vedere |
| `npm run build:demo` | **loggano** con `console.error` | la schermata si disegna lo stesso |
| `npm run build` | **tacciono** | spariscono dal bundle insieme ai messaggi |

È il motivo per cui `build:demo` esiste: un build di produzione è muto, quindi
una manopola girata male non si vedrebbe più da nessuna parte — ed è di
produzione anche il build che si porta al pitch.

**Le tre build si vedono identiche**, e non è una svista: nessun badge, nessuna
scritta, niente che dica quale si sta guardando. È voluto — la build che si porta
al pitch deve essere **quella provata**, non una versione con dei segni addosso.
A cambiare è solo cosa succede **quando qualcosa è sbagliato**: in sviluppo il
guardrail lancia e la pagina resta bianca, in `build:demo` logga in console e la
schermata si disegna comunque. Più le manopole qui sotto, che vivono solo in
sviluppo.

**Un log della build demo non autorizza a proseguire**: dopo il log
l'inizializzazione continua, quindi le schermate si disegnano con i numeri che il
guardrail ha appena dichiarato sbagliati.

È la stessa cosa vista dall'altro lato: **la build demo sembra a posto anche
quando i numeri sono sbagliati**, quindi guardarla non basta e la console non è un
accessorio. Per questo la prova generale si fa lì e con la console aperta — la
procedura sta in [`docs/PITCH.md`](docs/PITCH.md), le ragioni della scelta e il
criterio con cui i call site si contano nel `CLAUDE.md` §5.6.

## Le manopole di sviluppo

Tre parametri di query fanno succedere cose che il dataset, da solo, non produce
mai — il mock risolve sempre e non fallisce mai. Chi lavora sulle schermate non ha
altro modo di vedere l'errore, il vuoto e l'accesso negato:

| | |
|---|---|
| `?fail=metodo` | quel metodo del provider fallisce; `?fail=metodo:2` fallisce le prime due chiamate e poi riesce |
| `?empty=metodo` | quel metodo risponde vuoto invece che con i dati |
| `?role=ruolo` | fissa la sessione su quel ruolo, così la guardia di rotta nega |

Si combinano (`?fail=…&empty=…`) e si accumulano separandoli con la virgola.

**Esistono solo in sviluppo.** Il decoratore che le implementa
(`src/lib/data/fault-injection.ts`) è montato solo quando i guardrail lanciano, e
sparisce da entrambe le altre build: in `build:demo` e in `build` quei parametri
non fanno niente. Le cautele d'uso — `?empty` puntato su un metodo che il
contratto non dichiara vuotabile fabbrica uno stato che i tipi vietano — stanno
nella testata di quel file.

## Struttura

`src/pages/` per area (`public`, `employee`, `hr`, `professional`, `admin`),
`src/components/ui/` per shadcn (non si tocca), `src/components/kora/` per i
componenti di dominio, `src/lib/` per il layer dati e le funzioni pure, `docs/`
per gli altri tre documenti (`CLAUDE.md` sta alla radice).

La mappa a grana fine — file per file, con la ragione di ognuno — sta nel
`CLAUDE.md` §3.

## Lingue

La demo **si apre in italiano in ogni build**, e le altre lingue si raggiungono
dal selettore nella barra pubblica. Le regole — frasi intere con segnaposto, mai
concatenazioni, e i formati che seguono il locale — stanno nel `CLAUDE.md` §2.7.

## Deploy

Vercel, collegato al repository, con una preview automatica per branch.
`vercel.json` esegue **`npm run build:demo`**, quindi l'indirizzo condiviso serve
la build in cui i guardrail parlano.

## Origine

Fork della demo generata su base44. Il Builder non è più la fonte di verità:
**git lo è**, e il plugin e l'SDK di base44 sono usciti dal repository in M1
(`CLAUDE.md` §3). `reference/`, il sorgente della precedente demo Next.js, è
rimasto più a lungo come magazzino di sola lettura ed è stato cancellato alla
chiusura di M3, quando non c'era più niente da prenderne.

L'alias `@/` lo iniettava il plugin; da allora è definito in `vite.config.js`
sotto `resolve.alias`, e **non si toglie**: Vite non legge i `paths` di
`tsconfig.json`, quindi senza quel blocco ogni import smette di risolvere in un
colpo solo.
