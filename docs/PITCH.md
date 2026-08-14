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

**Rimisura l'overflow orizzontale della landing su un browser vero.** La
correzione del 14.08.2026 è stata verificata su **geometria imposta** — inizio e
fine dell'animazione scritti a mano sull'elemento — perché il pannello del
browser di quella sessione riportava `visibilityState: hidden` anche a scheda in
primo piano, quindi l'animazione d'ingresso non partiva e nessuno ha potuto
guardarla scorrere (`docs/PROGRESS.md`). Prima della prova generale va rifatta
guardandola: **scheda in primo piano e viewport reale prima di fidarsi di
qualunque misura** (`CLAUDE.md` §11). Il criterio è `scrollWidth ===
clientWidth`, non `innerWidth`, che comprende i 15px della barra di scorrimento
verticale.

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

  **Se chiedono di vedere la settimana successiva**, la risposta è che nella demo
  il calendario si ferma a quella corrente: è un limite dichiarato, non qualcosa
  che si è rotto in sala. Non cercare la navigazione a schermo — non c'è, e
  cercarla davanti a qualcuno costa più della frase.

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

## Le quattro lingue

**Decisione dei founder del 14.08.2026**, alla chiusura del blocco e) di M5: la
demo **si presenta in italiano**, e la lingua **non si cambia durante la
presentazione**.

**Il selettore si mostra, non si usa.** Sta nella barra pubblica — `IT DE FR EN`
— e mostra le sole lingue registrate, quindi quattro sigle accese vogliono dire
quattro dizionari che esistono davvero. Indicarlo è già la dimostrazione che
l'architettura c'è: è per questo che è lì, non perché serva alla presentazione.

**Perché non si cambia lingua davanti a chi la parla.** Tedesco, francese e
inglese sono **verificabili e presentabili, non ratificati**: la revisione
madrelingua non è ancora stata fatta per nessuno dei tre (`docs/PROGRESS.md`,
M5.e). Cambiare lingua davanti a un investitore che quella lingua ce l'ha mette a
giudizio la formulazione invece dell'architettura, ed è l'unico modo di
trasformare un argomento forte in una correzione ricevuta in sala.

**Detto a voce, è un argomento competitivo.** Quattro lingue nazionali sono la
condizione per vendere a un'azienda svizzera con sedi in più cantoni, e la
piattaforma le ha **oggi**, non "le avrà": tutte e ventisette le rotte sono state
percorse in ognuna delle quattro. È questo il modo di dirlo, non un cambio di
lingua a schermo.

**Se è l'investitore a cliccare una sigla**, la schermata regge e non c'è niente
da riparare: si finisce il discorso, si riporta l'italiano dal selettore e si
prosegue. **Non ricaricare per tornare in italiano** — il default è italiano a
ogni avvio e la scelta non sopravvive a un ricaricamento (`CLAUDE.md` §2.7), ma
ricaricare azzera la demo (§10).

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

### "L'HR vedrà che vado dallo psicologo?"

**No — e non perché ci fidiamo di una schermata: perché il dato non arriva.** È
la domanda commercialmente più pericolosa che il prodotto riceve, visto che se la
risposta non convince il dipendente l'adozione non parte, ed è quella che la demo
risponde meglio. Tre fatti, tutti verificabili:

1. **La soppressione sotto soglia avviene nel provider, non nella schermata.** Il
   punteggio di un reparto sotto soglia non è nascosto in interfaccia: **non
   arriva al client**, e a garantirlo è la forma del dato — il record soppresso
   non ha nemmeno il campo del punteggio. A uscire su entrambi i rami è il
   conteggio dei misurati, perché la riga deve poter dire quante persone hanno
   risposto (`docs/CONTRATTO-DATI.md` §3).
2. **La nota privata di sessione non esce mai verso l'azienda.** Il testo vive
   solo sulle proiezioni che il professionista riceve, e **nessun tipo che l'area
   HR o l'admin possano leggere ha un campo su cui possa arrivare**: a impedirlo
   è la forma del dominio, non la JSX. Le altre proiezioni sanno al massimo che
   una nota esiste, mai cosa dice (`CLAUDE.md` §10.D).
3. **La soglia conta i dipendenti misurati nel periodo, non gli iscritti.** È la
   stessa cifra della risposta precedente e qui dice un'altra cosa: sotto soglia
   non c'è da nessuna parte un dato più fine da andare a prendere, c'è il
   trattino con il lucchetto che si vede sulla Direzione.

La stessa garanzia vale dal lato dell'azienda: l'elenco dipendenti porta iniziali
e reparto e **non ha nessun campo su cui un nome possa arrivare**, e lo stato del
check-up dice se è stato fatto, mai cosa ha detto (`docs/CONTRATTO-DATI.md` §3).

**Va detto come il punto più forte del prodotto, non come una rassicurazione**:
qui la privacy non è una promessa scritta nell'informativa, è una proprietà della
forma dei dati — la stessa disciplina per cui i font sono self-hostati e le
richieste esterne a runtime sono zero (`CLAUDE.md` §3).

### "Se rispondo al check rapido, la dashboard si muove?"

**No, ed è voluto.** La risposta si salva e si rilegge — la card mostra il volto
scelto — ma le curve della dashboard non si spostano: gli aggregati di reparto
sono **mensili** (`CLAUDE.md` §5.3), e una risposta sola non muove una media
pesata sui dipendenti misurati.

**Dirlo prima, non farlo scoprire.** Se durante la demo si tocca un volto e poi
si passa alla dashboard HR aspettandosi un movimento, l'assenza di movimento si
legge come un difetto invece che come la granularità del dato — e la domanda
arriva nel momento peggiore, cioè sulla schermata su cui si regge il pitch.

In produzione è esattamente il contrario: quella scrittura è ciò che alimenta le
serie mensili dei reparti, ed è la semplificazione della demo che salta per prima
il giorno del passaggio (`docs/CONTRATTO-DATI.md` §7).

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

**Dal divario fra sessioni incluse ed erogate**, e il numero che lo sostiene è
già a schermo: il monte annuo di Demo SA è di **1'200 sedute** — 120 dipendenti
per le 10 del piano Plus — e ne sono state usate **142**, cioè il **12%**
(`CLAUDE.md` §8). È la KPI "142 di 1'200" della dashboard HR, quindi è una cifra
che si indica mentre la si dice, non un conto fatto a voce.

**Il costo da leggere accanto è quello di una seduta erogata: CHF 70–80** al
professionista (`CLAUDE.md` §9). Senza un costo unitario il 12% è un dato e non
un argomento; con il costo accanto al monte e al consumo, **la moltiplicazione la
fa chi ascolta**. Va lasciata fare: la tariffa è una banda e non un punto, quindi
un totale detto a voce diventa un numero da difendere che nessuno ha chiesto.

**Il cap annuale è il freno, e il co-payment è il deterrente che lo tiene** — non
un ricavo. Oltre le sedute incluse il dipendente paga di tasca sua, e questo
tiene il consumo dentro il monte **senza che la piattaforma debba dire di no a
nessuno**: è la differenza fra un tetto che si spiega e una lista d'attesa che si
subisce.

Non è teoria messa in una slide: nell'elenco pazienti del portale professionista
**due pazienti sono sopra il cap**, e a schermo si vede che il tetto è reale e
gestito.

I tetti scalano col piano, e il co-payment con loro: **Essenziale 6 sedute, extra
CHF 35 · Plus 10, extra CHF 28 · Executive 16, extra CHF 22** (`CLAUDE.md` §9).

> **Risposta riscritta su decisione dei founder del 14.08.2026.** Diceva che il
> margine viene dal co-payment, e metteva nella stessa frase i CHF 28 incassati e
> i CHF 70–80 pagati: chi ascolta fa la sottrazione e sente dire che ogni seduta
> oltre il cap costa alla piattaforma più di quanto le renda, cioè l'opposto di
> ciò che la frase voleva dire. Il divario fra incluse ed erogate regge da sé, e
> il suo numero è l'unico dei tre che l'investitore ha già davanti agli occhi.

### "Quindi sulle sedute extra ci rimettete?"

È il seguito immediato della risposta sul margine: dire che il co-payment è un
deterrente e non un ricavo invita la domanda, dove la formulazione vecchia non la
invitava. È il prezzo della correzione, e si paga rispondendo — non schivando.

**Sì, per unità, ed è voluto.** Il co-payment è tarato per **scoraggiare l'uso
oltre il tetto**, non per coprirne il costo. Un prezzo a copertura vorrebbe dire
chiedere al dipendente la tariffa del mercato privato — i **CHF 70–80** che
prende il professionista (`CLAUDE.md` §9) — e a quel punto il tetto non sarebbe
più un tetto: la seduta oltre il cap smetterebbe di essere una scelta consapevole
per diventare una barriera economica.

**Il volume è marginale, e si vede a schermo.** Nell'elenco pazienti del portale
professionista **due dei sei pazienti** sono sopra il cap. È la stessa prova
della risposta precedente letta dall'altro lato: lì dice che il tetto è reale,
qui dice quanti lo superano — e sono due righe da contare, non una cifra da
prendere per buona.

**A proteggere l'economia è il cap, non il prezzo dell'extra.** Il monte è annuo e
rigido, e il co-payment è ciò che tiene il consumo dentro il monte senza che la
piattaforma debba dire di no a nessuno. Se il co-payment sparisse, a cambiare non
sarebbe il margine ma **la frizione** — ed è esattamente per questo che il numero
della risposta sul margine è il 12%, e non i CHF 28.

**Il tetto scala col piano al contrario del co-payment**: Essenziale 6 sedute con
extra a CHF 35, Executive 16 con extra a CHF 22 (`CLAUDE.md` §9). Chi ha più
sedute incluse paga **meno** l'extra, perché al tetto ci arriva avendone già
usate di più. Detto così è coerenza del modello, non una stranezza da
giustificare.

**Se la domanda arriva a *"e se uno ne facesse trenta?"***: oggi non c'è nessun
tetto al numero di sedute oltre cap prenotabili, il caso non si è mai presentato,
e il monitoraggio del consumo è parte di ciò che i pilot devono produrre — la
stessa linea della risposta qui sotto. **Non descrivere una difesa che il
prodotto non ha.**

### "E se ne usassero il 40%?"

È il seguito naturale della domanda sul margine e arriva quasi sempre, perché il
12% è il numero su cui poggia la risposta precedente.

**Non lo sappiamo ancora, e validare la curva di utilizzo reale è la metrica
numero uno dei pilot.** È il primo dato che un pilot serve a produrre, e finché
non esiste qualunque cifra sarebbe inventata sul momento (`CLAUDE.md` §2.4).

Detta così è più forte di una proiezione: dice che sappiamo qual è la variabile
da cui dipende il modello e che l'abbiamo messa in cima a ciò che andiamo a
misurare — invece di rispondere con un numero che il primo pilot smentirebbe.

**Non improvvisare il margine lordo**, che è la domanda dopo: oggi non c'è una
risposta pronta, e costruirne una a voce significa consegnare all'investitore una
cifra che nessun documento sostiene.

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

### "E se qualcuno sta male davvero?"

**Il percorso di escalation non c'è, e la demo non lo simula.** È la risposta da
dare per intero e senza attenuarla: il check rapido accetta anche la risposta
peggiore e non succede niente, e la chat del medico virtuale non rileva il
rischio e non espone numeri d'emergenza.

**Il referente clinico e il protocollo si definiscono prima del primo utente
attivo.** È il momento in cui la domanda smette di essere teorica, ed è lì che va
chiusa.

Non dire "è in roadmap" e non descrivere come funzionerà: sarebbe promettere una
funzione che non esiste, cioè ciò che la sezione qui sotto vieta. E qui
l'onestà è anche l'unica cosa che regge la domanda successiva, che è *"e chi
risponde alle tre di notte?"* — a cui una funzione descritta e non costruita non
ha niente da rispondere.

---

## Cosa non promettere

- **Non è un prodotto in produzione**: i servizi complessi — video, pagamenti,
  chat medica, referti — sono simulati e dichiarati tali a schermo (`CLAUDE.md`
  §1.1).
- **Non citare cifre che non stanno in `CLAUDE.md` §8 e §9.** Se una domanda ne
  richiede una che non c'è, la risposta è che il dato si aggiunge dopo, non un
  numero inventato sul momento.
- **Non aprire `/admin` come se fosse un cruscotto reale**: è marcato come dati
  dimostrativi, ed è quel banner la difesa a schermo.

  **Le guardie di ruolo esistono** — costruite il 12.08.2026 — ma in demo **non
  negano l'accesso a niente, per costruzione**: `RequireRole` è una porta che
  concede, perché il giro della presentazione entra in ogni portale con un clic e
  `/admin` si apre come prima schermata della sessione. Il ramo che nega è vero e
  si raggiunge solo con una manopola di sviluppo (`CLAUDE.md` §4, blocco d).

  Quindi **non dire che `/admin` "ora è protetto"**: è una frase che chiunque
  verifica in dieci secondi digitando l'indirizzo, e la verifica la smentisce.
  Il consiglio pratico resta quello di sempre — è un back-office dimostrativo,
  non un cruscotto — e a cambiare è la ragione, non la riga.
