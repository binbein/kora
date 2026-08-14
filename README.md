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

L'app risponde su http://localhost:5173. L'indirizzo **non viene stampato**: il
`logLevel: 'error'` in `vite.config.js` sopprime il banner di avvio insieme ai
warning.

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

**Un log della build demo non autorizza a proseguire**: dopo il log
l'inizializzazione continua, quindi le schermate si disegnano con i numeri che il
guardrail ha appena dichiarato sbagliati. Le ragioni della scelta, il criterio con
cui i call site si contano e la regola operativa stanno nel `CLAUDE.md` §5.6.

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
`src/components/ui/` per shadcn (non si tocca), `src/lib/` per il layer dati.
`reference/` è il sorgente della precedente demo Next.js: **sola lettura**, si copia
ma non si importa, e si cancella a fine M3.

## Origine

Fork della demo generata su base44. Il Builder non è più la fonte di verità: **git
lo è**. Il plugin e l'SDK di base44 vengono rimossi in M1 (`CLAUDE.md` §3) — occhio
all'alias `@/`, che oggi lo inietta il plugin e non è definito da nessun'altra parte.
