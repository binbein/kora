# KORA — frontend

Piattaforma B2B di salute aziendale per il mercato svizzero. Questo repository è
**insieme** la demo per gli investitori e il frontend dell'MVP: i dati sono finti,
l'interfaccia no.

**Le regole del progetto stanno in [`CLAUDE.md`](CLAUDE.md)** — è l'unica fonte, e va
letto prima di toccare qualunque cosa. Lo stato di avanzamento sta in
[`docs/PROGRESS.md`](docs/PROGRESS.md).

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

## Struttura

`src/pages/` per area (`public`, `employee`, `hr`, `professional`, `admin`),
`src/components/ui/` per shadcn (non si tocca), `src/lib/` per il layer dati.
`reference/` è il sorgente della precedente demo Next.js: **sola lettura**, si copia
ma non si importa, e si cancella a fine M3.

## Origine

Fork della demo generata su base44. Il Builder non è più la fonte di verità: **git
lo è**. Il plugin e l'SDK di base44 vengono rimossi in M1 (`CLAUDE.md` §3) — occhio
all'alias `@/`, che oggi lo inietta il plugin e non è definito da nessun'altra parte.
