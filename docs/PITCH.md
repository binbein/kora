# KORA — lo script del pitch

Il terzo documento del repository, approvato dai founder il 10.08.2026. Non
contiene regole e non racconta la storia del progetto: è **lo script operativo
della presentazione dal vivo** — cosa si prepara prima, come si naviga durante,
cosa si risponde alle domande.

Le regole stanno in `CLAUDE.md` e questo file **le cita, non le duplica**: dove
c'è un rimando, la fonte è quella. I numeri delle risposte vengono da `CLAUDE.md`
§8 e §9 e non se ne inventano altri (§2.4).

---

## Prima della demo

**Deploya la build demo.** `vercel.json` esegue `npm run build:demo`, quindi
l'alias condiviso serve già la build in cui i guardrail parlano (`CLAUDE.md`
§5.6). Condividi **solo l'alias pubblico**: gli URL con l'hash del singolo
deployment sono protetti da Vercel Authentication e chiedono a chi li riceve di
autenticarsi (§3).

**Fai la prova completa il giorno prima**, con la console aperta, percorrendo il
giro che farai davanti agli investitori.

> **Qualunque log dei guardrail durante la prova è un blocco.** Non è un avviso
> da annotare: la build demo **prosegue con i dati sbagliati** dopo aver loggato,
> quindi le schermate si disegnano lo stesso con i numeri che il guardrail ha
> appena dichiarato sbagliati. Ci si ferma, si riproduce in sviluppo — dove il
> guardrail lancia e dice esattamente cosa non torna — si corregge, e **si rifà
> la prova da capo**. La build demo segnala, non autorizza a proseguire
> (`CLAUDE.md` §5.6).

**Apri la scheda e portala in primo piano.** La landing **non si pre-apre in una
scheda di sfondo**: il browser sospende `requestAnimationFrame` sulle schede
nascoste, l'animazione d'ingresso resta congelata e dopo due secondi l'hero sta a
un'opacità di 0.07 — cioè la prima schermata che l'investitore vede sarebbe quasi
vuota. Se la apri in anticipo, portala davanti prima di cominciare (`CLAUDE.md`
§10). Per la stessa ragione a scheda nascosta i grafici misurano zero.

**Tieni la console su uno schermo di servizio**, non su quello proiettato: è lì
che compaiono i log dei guardrail se qualcosa non torna a metà presentazione.

---

## Durante

- **Si parte dalla landing** e si usano **solo i link interni**. Mai la barra
  degli indirizzi.
- **Fra un portale e l'altro si passa dal logo.** In alto a sinistra di ogni
  portale il logo Kora riporta alla landing, e da lì la barra pubblica entra nel
  successivo: dipendente → logo → HR → logo → professionista. **Sei clic, e non
  serve il tasto Indietro.**

  Prima della micro-passata del 13.08.2026 le uscite non c'erano — solo
  `/admin` ne aveva una — e il giro fra i portali si faceva con Indietro senza
  che questo file lo dicesse. Se ti ritrovi a premerlo qui, stai usando la
  versione vecchia.

  **L'unico Indietro della presentazione resta quello della coreografia di
  `/admin`**, qui sotto, ed è un'altra cosa: lì si torna a una schermata da cui
  si è usciti, non si entra in una nuova.
- **Mai ricaricare.** Il provider vive in memoria: un refresh azzera tutto quello
  che hai costruito durante la demo — le prenotazioni fatte, la richiesta demo
  compilata, il check rapido (`CLAUDE.md` §10).
- **Un clic per PDF.** Il browser blocca i download automatici ravvicinati: se ne
  generi due di fila senza un gesto in mezzo, il secondo non arriva. Un clic è un
  gesto, quindi l'uso normale non lo incontra — ma non lanciarne due da console.
- **Il giro che mostra il marketplace intero**: prenota uno slot della Dr.ssa
  Meier dal portale dipendente, poi passa al portale professionista e mostra la
  stessa seduta nel calendario. È un record solo visto da due lati, e si vede che
  lo slot è sparito dai liberi.

  **Prenota dentro la settimana visibile** — **venerdì 25.09 alle 10:00** è lo
  slot provato in M3 e funziona. Il calendario del professionista mostra **solo
  la settimana corrente** (lun 21 – dom 27.09) e non ha navigazione fra
  settimane: uno slot preso oltre il 27 compare fra le sedute in programma ma
  **non nella griglia**, e a metà pitch si legge come un difetto invece che come
  il limite dichiarato che è (`docs/PROGRESS.md`, area dipendente).

- **La richiesta demo che compare in `/admin` ha una coreografia sola**, e va
  fatta in quest'ordine perché `/admin` non è linkata da nessuna schermata:
  l'unico modo di entrarci è l'indirizzo digitato, che ricarica, che azzera il
  provider. Quindi **è la prima cosa che si apre, non l'ultima.**

  **Le uscite dai portali non cambiano niente qui**: il logo porta *fuori* da
  un'area, e in `/admin` c'era già. A mancare è un link che porti *dentro*, e
  non esiste da nessuna parte — è la ragione per cui questa coreografia
  esiste.

  1. **Apri `/admin` per prima**, come schermata iniziale della sessione. La
     tabella richieste è vuota, ed è giusto così: è il "prima".
  2. **Esci col logo**, in alto a sinistra, che porta alla landing. Da qui in
     poi **non si tocca più la barra degli indirizzi**.
  3. **Fai il giro con i link interni**, e compila la richiesta demo da
     `/demo`.
  4. **Torna con Indietro**, e la richiesta è in tabella.

  **Indietro va premuto una volta per ogni passo fatto**, non una sola: la
  cronologia ha un'entrata per clic. Dal logo diretto a `/demo` sono **due
  passi, quindi due Indietro** — ed è la ragione per tenere corto il tratto fra
  il logo e il form. In alternativa si tiene premuto Indietro e si sceglie
  `/admin` dall'elenco.

  **Non ricaricare in nessuno dei quattro passi.** Se digiti `/admin` alla fine
  invece di tornarci con Indietro, il provider riparte e la tabella dice
  "nessuna richiesta": è lo stesso stato del punto 1, e da fuori sembra che la
  scrittura non abbia funzionato.

- **Dopo l'invio, il form demo non si ripropone.** Resta la conferma, e cliccare
  "Demo" nella barra **non** la sostituisce con un form vuoto: la rotta è la
  stessa e il componente non si rimonta. Per una seconda richiesta si passa da
  **"Torna alla home"** e si rientra da lì. È voluto, ma scoprirlo davanti a
  qualcuno sembra una schermata bloccata.

---

## Le risposte pronte

### "Da dove vengono i numeri di stress?"

Da due strumenti, e **nessuno dei due deduce lo stress dal comportamento**.

1. **L'assessment iniziale**, all'attivazione dell'account: 10 domande, circa 8
   minuti. Genera il Profilo Salute e fissa la **baseline** del dipendente — è il
   primo punto della sua serie, non una fotografia una tantum.
2. **Il check rapido ricorrente**: una domanda, un tocco, auto-riportato. È il
   segnale che alimenta il trend per reparto, e vive **dentro l'app** per chi ha
   l'account e su **link anonimo** per chi non ce l'ha.

Il link anonimo non è una comodità: misurare solo chi ha attivato l'account
significa misurare solo chi è già ingaggiato, cioè il campione sbagliato — quello
che del prodotto ha meno bisogno.

**Se qualcuno nota che i misurati superano gli iscritti, è la risposta giusta e
va rivendicata**: è una proprietà voluta del modello, e il dato vale anche dove
l'adozione non è ancora arrivata. Gli iscritti di Demo SA sono **82 su 120**, il
68%; i misurati sono un conto diverso, e la dashboard li mostra **su ogni riga**
di reparto.

**Perché la Direzione mostra "—" con un lucchetto**: la soglia di anonimato è di
**12 dipendenti misurati nel periodo** — non l'organico, non gli iscritti — e la
Direzione ci sta sotto in tutti e dodici i mesi. HR + Legale ha lo stesso
organico ed è pubblicabile: è per questo che i misurati stanno su ogni riga, e
non solo su quelle soppresse (`CLAUDE.md` §8).

E se arriva la domanda difficile — *"non state deducendo lo stress da chi
prenota?"* — la risposta è no, per scelta di modello: un segnale comportamentale
non distingue "il reparto sta peggio" da "il reparto ha adottato bene il
prodotto", e legge come in miglioramento chi si sta ritirando.

### "Nel documento la soglia di anonimato è 15, la dashboard dice 12"

**Le due cifre non contano la stessa cosa**, ed è la prima da dire: la soglia
della dashboard conta i dipendenti **misurati nel periodo** — chi ha risposto al
check rapido — non l'organico del reparto. Il Business Plan dà "soglia min. 15
dip" senza dire su quale dei due, e letta sull'organico non distinguerebbe i due
reparti da 15 persone, HR + Legale e Direzione, che nella demo hanno esiti
opposti.

**E 15 non regge nemmeno sui misurati**: un reparto da 15 persone sarebbe
pubblicabile solo con il **100% di risposte in tutti e dodici i mesi**, e
basterebbe una persona che salta il check perché la riga sparisca dalla
dashboard — il dataset funzionerebbe grazie a un numero implausibile. A 12 c'è
margine sopra, e la Direzione resta sotto: è esattamente ciò che la schermata
mostra (`CLAUDE.md` §8).

**E non è una costante di piattaforma**: è una proprietà del cliente,
`Company.anonymityThreshold`. Aziende diverse possono averne di diverse, e la
frase che la mostra non cambia perché il numero è un segnaposto
(`docs/CONTRATTO-DATI.md` §3).

Vale la nota già usata per il check rapido (`CLAUDE.md` §10.B.1): **dove il
Business Plan e la demo divergono vince `CLAUDE.md`, e il documento si
aggiorna.**

### "Perché il ROI è 2.35:1? Nel documento ho letto 19.5:1"

Perché sono **tre rapporti diversi**, e noi mostriamo il più conservativo dei tre.
A 100 dipendenti (`CLAUDE.md` §9):

| | calcolo | risultato |
|---|---|---|
| perdite oggi | | CHF 1'289'500 |
| risparmio stimato | scenario conservativo | CHF 221'150 |
| costo KORA | 100 × 55 × 12 | CHF 66'000 |
| **risparmio netto** | risparmio − costo | **CHF 155'150** |

**ROI = risparmio netto ÷ costo = 2.35:1.** Il 3.35:1 sarebbe risparmio *lordo* ÷
costo, e il **19.5:1 dell'executive summary è perdite totali ÷ costo** — cioè
misura quanto è grande il problema, non quanto ne recuperiamo. **Non si usa da
nessuna parte**: mescolare due definizioni di ROI indebolisce quella buona, e
quella buona regge la domanda successiva.

Da dire sempre: è uno **scenario conservativo**, con fonti dichiarate (SECO, Job
Stress Index). E il rapporto **non cambia con N** — ogni voce è lineare, quindi
da 20 a 1000 dipendenti gli importi crescono e il 2.35:1 resta: se te lo chiedono,
mostralo muovendo il campo.

### "Come fate margine se le sedute costano?"

Il **co-payment oltre il cap**. Il piano Plus dà 10 sedute di psicologo l'anno;
dall'undicesima il dipendente paga **CHF 28** a seduta, contro un compenso al
professionista di **CHF 70–80** (`CLAUDE.md` §9). Non è teoria messa in una
slide: nell'elenco pazienti del portale professionista **due pazienti sono sopra
il cap**, e il meccanismo si vede a schermo.

L'Essenziale ha 6 sedute e extra a CHF 35, l'Executive 16 e extra a CHF 22.

### "Chi controlla i professionisti? E le strutture?"

Il vetting è **a schermo**, non a parole, e in due punti:

- **La Dr.ssa Keller** compare nel back-office fra i professionisti con documenti
  verificati e **mandato non ancora firmato**: zero sedute erogate, nessuna
  valutazione. **Non è prenotabile**, e infatti nella prenotazione del dipendente
  non compare. "Prenotabile" si **deriva** da documenti *e* mandato in ordine, non
  è uno stato che qualcuno può scrivere accanto e contraddire.
- **Il Centro Diagnostico Basalto** è in convenzionamento con zero prenotazioni, e
  il portale dipendente **non lo propone** fra le strutture per il check-up. È una
  rete sola vista da due lati, non due elenchi scollegati.

Se serve la frase corta: *la piattaforma elenca tutti, e propone solo chi ha
superato i controlli.*

---

## Cosa non promettere

- **Non è un prodotto in produzione**: i servizi complessi — video, pagamenti,
  chat medica, referti — sono simulati e dichiarati tali a schermo (`CLAUDE.md`
  §1.1).
- **Non citare cifre che non stanno in `CLAUDE.md` §8 e §9.** Se una domanda ne
  richiede una che non c'è, la risposta è che il dato si aggiunge dopo, non un
  numero inventato sul momento.
- **Non aprire `/admin` come se fosse un cruscotto reale**: è marcato come dati
  dimostrativi, e le guardie di ruolo sono lavoro di M5.
