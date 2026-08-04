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

**Nessuna milestone chiusa.** Il repository è il fork della demo base44 nello stato
in cui è stata esportata, prima di qualunque intervento.

Il primo commit è l'export **intatto**, così ogni modifica successiva si legge come
diff contro quello che base44 ha prodotto. In `reference/` c'è il sorgente della
precedente demo Next.js — solo il suo `src/`, senza configurazioni né app
eseguibile — come magazzino di sola lettura; si cancella a fine M3. Il repository
della vecchia demo è archiviato e non si tocca. I PDF del Business Plan restano
fuori dal repository: le cifre che servono sono trascritte in `CLAUDE.md` §8 e §9.

### Punto di partenza — cosa c'è e cosa manca

Ereditato e funzionante: 21 rotte su cinque aree (pubblica, dipendente, HR,
professionista, admin), design system e navigazione, 45 componenti shadcn, grafici
recharts.

Ereditato e **non** funzionante, in sintesi (il dettaglio è in `CLAUDE.md` §10):

- nessun layer dati: ogni pagina dichiara le proprie costanti in cima al file, e le
  stesse grandezze divergono fra schermate vicine;
- le prenotazioni non producono effetti: nessun contatore si muove, nessun
  appuntamento compare, nessuno slot si occupa;
- manca il calcolatore ROI pubblico, mancano stress per reparto, alert precoce e
  selettore trimestre nella dashboard HR;
- importi non formattati in svizzero, cinque coppie giorno/data sbagliate, un link
  di menu che porta a una pagina inesistente;
- marchio a metà fra "Kora" e "HealthOS"; aziende e cliniche reali usate come
  clienti e partner; `/admin` raggiungibile da chiunque.

### Milestone previste

Il piano completo è in `CLAUDE.md` §4. In breve:

| | Milestone | Stato |
|---|---|---|
| M0 | Messa in sicurezza | da fare |
| M1 | Fondamenta tecniche | da fare |
| M2 | Il contratto dati | da fare |
| M3 | Migrazione area per area | da fare |
| M4 | Calcolatore ROI e report scaricabile | da fare |
| M5 | Verso la produzione (differibile) | da fare |

## Decisioni in sospeso

- **Piano "Personalizzato" della pagina prezzi.** Nascosto in M0 in attesa della
  decisione del CEO: gli undici prezzi dei moduli non sono nel Business Plan, gli
  sconti a volume nemmeno, e a 150 dipendenti la preselezione esce allo stesso
  prezzo dell'Essenziale offrendo più di lui.
- **Emoji nel saluto della home dipendente.** Il §7 di `CLAUDE.md` vieta le emoji
  nel testo di sistema; il 👋 della home è l'unico caso in cui il registro consumer
  potrebbe giustificarla. Da chiedere ai founder.

## Note per chi riprende

- `reference/` è il **magazzino**: `lib/format.ts`, `lib/dates.ts`,
  `lib/roi-model.ts`, `lib/i18n/it.ts`, tutto `lib/data/` e i componenti di dominio
  in `components/kora/` sono già scritti e verificati, e vanno **copiati** da lì
  invece che riscritti. Non si modifica, non si importa: nessun file di `src/` deve
  avere un `import` che punta dentro `reference/`.
- **Il passaggio alla produzione avviene in questo repository**, sostituendo
  `lib/data/mock/` con `lib/data/http/` dietro la stessa interfaccia
  (`CLAUDE.md` §5.7). Se viene il pensiero di ricominciare da capo con un repo
  nuovo, è il segnale che il seam non ha tenuto: va riportato ai founder.
- Ogni milestone chiude con una demo che funziona da capo a fondo (`CLAUDE.md`
  §2.3). Se una migrazione non entra in una sessione, si chiude l'area corrente e si
  comincia la prossima dopo, mai a metà.
