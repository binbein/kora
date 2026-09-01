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

**Clicca un pallino dell'anteprima appena apri la landing.** Il riquadro
dell'hero ha tre pannelli — dipendente, HR, professionista — e finché nessuno lo
tocca cambia da solo ogni cinque secondi. **Il primo clic lo ferma per sempre**
(`CLAUDE.md` §10.A.1), quindi un clic all'apertura e da lì il riquadro mostra
quello che dici tu invece di cambiare mentre parli. I tre pannelli sono il
sommario del giro che stai per fare, quindi indicarli è già l'indice della
presentazione.

---

## Durante

- **Si parte dalla landing** e si usano **solo i link interni**. Mai la barra
  degli indirizzi.
- **Si dice "sessioni", mai "sedute".** È la parola del Business Plan ed è
  quella che le schermate mostrano da tutte e cinque le aree (`CLAUDE.md` §7).
  Dirne una mentre se ne indica un'altra invita la domanda su quale sia la
  differenza fra le due, e la differenza non c'è. Le risposte pronte qui sotto
  sono già scritte così.
- **Fra un portale e l'altro si passa dal logo.** In alto a sinistra di ogni
  portale il logo Kora riporta alla landing, e da lì la barra pubblica entra nel
  successivo: dipendente → logo → HR → logo → professionista. **Sei clic, e non
  serve il tasto Indietro.**

  Prima della micro-passata del 13.08.2026 le uscite non c'erano — solo
  `/admin` ne aveva una — e il giro fra i portali si faceva con Indietro senza
  che questo file lo dicesse. Se ti ritrovi a premerlo qui, stai usando la
  versione vecchia.

  ~~**L'unico Indietro della presentazione resta quello della coreografia di
  `/admin`.**~~ → **Non ce n'è più nessuno** (17.08.2026): la barra ha la voce
  "Admin", quindi anche l'ultimo giro che chiedeva il tasto Indietro si fa con
  un clic. **La presentazione intera si percorre in avanti.**
- **Mai ricaricare.** Il provider vive in memoria: un refresh azzera tutto quello
  che hai costruito durante la demo — le prenotazioni fatte, la richiesta demo
  compilata, il check rapido (`CLAUDE.md` §10).
- **Un clic per PDF.** Il browser blocca i download automatici ravvicinati: se ne
  generi due di fila senza un gesto in mezzo, il secondo non arriva. Un clic è un
  gesto, quindi l'uso normale non lo incontra — ma non lanciarne due da console.
- **Il giro che mostra il marketplace intero**: prenota uno slot della Dr.ssa
  Meier dal portale dipendente, poi passa al portale professionista e mostra la
  stessa sessione nel calendario. È un record solo visto da due lati, e si vede che
  lo slot è sparito dai liberi.

  **Prenota venerdì 25.09 alle 10:00**: è lo slot provato, cade nella settimana
  corrente e si vede senza spostarsi.

  **Il calendario si sposta di settimana** (18.08.2026), con le due frecce in
  cima alla griglia e "Questa settimana" per tornare: se chiedono di vedere la
  settimana successiva, **mostragliela**. È anche il modo di rispondere alla
  domanda che nasce dall'elenco pazienti — *"prossima seduta 01.10"* — che prima
  il calendario non poteva raggiungere.

  **Le quattro KPI in alto non seguono le frecce**, ed è voluto: dicono come va
  **adesso** — sedute di questa settimana, prossima seduta, agenda del mese,
  pazienti attivi — mentre a muoversi è la sola griglia, con l'etichetta che
  dichiara quale settimana mostra. Se qualcuno lo nota, è la stessa disciplina
  della cornice del trimestre nella dashboard HR.

  **Navigando abbastanza avanti la settimana è vuota**, e la card lo dice: il
  dataset finisce, non la demo. Torna con "Questa settimana" invece di premere
  la freccia indietro più volte.

  **Il salto a data non serve al giro**: l'etichetta della settimana apre un
  calendarietto (18.08.2026), ma è un comando per chi lavora, non per la
  presentazione. In sala bastano le frecce — aprire un calendario davanti a un
  investitore invita a scegliere una data a caso e ad atterrare su una settimana
  che non racconta niente.

  **Se mostri l'annullamento, annulla quella seduta lì**, cioè le 10:00 di
  venerdì 25.09 che hai appena prenotato — non una delle sedute che il
  calendario porta già. Le disponibilità sono le fasce dichiarate della Dr.ssa
  Meier meno quelle occupate: annullando la sua seduta ricorrente del giovedì
  alle 17:30 quell'ora smette di occupare ma **non compare** fra gli slot
  proponibili, perché non è una fascia del piano — e a schermo si legge come
  "l'annullamento non ha liberato nulla" (`CLAUDE.md` §10.D.3). Con lo slot
  appena prenotato il giro si chiude: sparisce prenotando, torna annullando.

  **E c'è un terzo tempo, dal 01.09.2026: la chiudi e non torna più.** Nel
  calendario della professionista la cella di venerdì 25.09 alle 10:00 è
  tornata una fascia libera, e un clic la **chiude** — bordo tratteggiato,
  "Chiusa" — dopodiché dal portale del dipendente quel venerdì **non è più fra i
  giorni prenotabili**. Un secondo clic la riapre e ricompare.

  **È la parte che vale più delle prime due**, perché è l'unica in cui si vede
  che **qualcuno ha deciso** invece che qualcosa sia successo: prenotare e
  annullare muovono l'agenda, chiudere è la professionista che dice *"quell'ora
  non la do"*. È la domanda che il `docs/CONTRATTO-DATI.md` §8.5 dichiara non
  decisa — *«e torna prenotabile da chiunque è un'altra cosa, ed è una policy di
  prodotto»* — mostrata invece che raccontata.

  **L'ordine è vincolante, ed è l'unica cosa da ricordare**: prenota, annulla,
  poi chiudi. Chiudere prima toglie di mezzo lo slot provato — è l'unica fascia
  libera della settimana corrente — e il giro resta senza il suo primo tempo.

  **E poi torna dal dipendente**, che dal 18.08.2026 l'annullamento lo vede: la
  seduta resta nella sua home con "Annullato" e con chi l'ha disdetta, e il
  contatore in programma **scende**. È il terzo lato dello stesso record — dopo
  la prenotazione che compare nel calendario e la disdetta che lo svuota — e si
  mostra in un clic, senza dire una parola in più.

- **La richiesta demo si mostra alla fine, e non ha più una coreografia.**
  Compila il form da `/demo` durante il giro normale, e quando vuoi mostrarne
  l'esito clicca **Admin** nella barra: la richiesta è in tabella, con azienda,
  referente, telefono e data. Due momenti a distanza di minuti, entrambi dentro
  la navigazione interna.

  **Non serve più aprire `/admin` per primo, e non si contano più gli
  Indietro.** Fino al 17.08.2026 questa voce descriveva quattro passi in ordine
  obbligato, perché `/admin` non era linkata da nessuna schermata e l'unico modo
  di entrarci era digitare l'indirizzo — cioè ricaricare, cioè azzerare il
  provider. **Adesso la barra pubblica ha la voce "Admin"** (`CLAUDE.md` §10.E),
  quindi l'ingresso è un clic come gli altri e l'ordine lo scegli tu.

  **Se vuoi anche il "prima"**, apri Admin una volta all'inizio del giro: la
  tabella richieste è vuota, ed è giusto così. È diventato un passaggio
  facoltativo che rafforza il racconto, non il vincolo su cui poggiava.

  **Le due cose che restano vere, e sono le uniche**: non si ricarica **mai**, e
  il provider vive in memoria — un refresh azzera la richiesta appena inviata
  insieme a tutto il resto (`CLAUDE.md` §10).

- **Dopo l'invio, il form demo non si ripropone.** Resta la conferma, e tornarci
  **non** la sostituisce con un form vuoto: la rotta è la stessa e il componente
  non si rimonta. Per una seconda richiesta si passa da **"Torna alla home"** e
  si rientra da lì — dal pulsante "Prenota una demo" della barra, che è anche il
  modo in cui ci si arriva la prima volta, ora che la voce "Demo" non c'è più.
  È voluto, ma scoprirlo davanti a qualcuno sembra una schermata bloccata.

- **La conferma non nomina l'azienda**, dal 17.08.2026: dice solo che la
  richiesta è arrivata. La prova che la scrittura è avvenuta è la riga in
  `/admin`, ed è la ragione per cui vale la pena mostrarla.

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
piattaforma le ha **oggi**, non "le avrà": tutte e ventisette le schermate sono
state percorse in ognuna delle quattro. È questo il modo di dirlo, non un cambio di
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
2. **Il nome del paziente arriva a chi cura e a nessun altro.** Nel portale
   della Dr.ssa Meier i pazienti hanno un nome — lei quel nome lo conosce già,
   glielo dice la persona che ha davanti — e **la stessa seduta vista dal
   back-office porta le sole iniziali**, perché è una proiezione diversa che il
   campo non ce l'ha. La nota clinica funziona allo stesso modo e da più tempo:
   il testo vive solo su ciò che il professionista riceve, e le altre proiezioni
   sanno al massimo che una nota esiste, mai cosa dice (`CLAUDE.md` §10.D).

   **È il fatto più facile da mostrare, e va mostrato invece che detto**:
   `/professional/patients` fa "Marco Bianchi", `/admin/sessions` fa "M.B.", ed
   è la stessa seduta. Chi guarda vede la garanzia funzionare, non la sente
   promettere.

   **Se chiedono perché la psicologa il nome ce l'ha**, la risposta è che
   nasconderglielo non protegge nessuno: la privacy che il prodotto promette non
   è verso chi eroga la cura, è **verso l'azienda e verso di noi**. Un prodotto
   che mostrasse "L.B." a chi ha quella persona in seduta starebbe recitando la
   privacy invece di averla.

3. **La soglia conta i dipendenti misurati nel periodo, non gli iscritti.** È la
   stessa cifra della risposta precedente e qui dice un'altra cosa: sotto soglia
   non c'è da nessuna parte un dato più fine da andare a prendere, c'è il
   trattino con il lucchetto che si vede sulla Direzione.

**E dal lato dell'azienda è il fatto che conta più di tutti, ora che il nome
esiste da qualche parte**: l'elenco dipendenti porta iniziali e reparto e **non
ha nessun campo su cui un nome possa arrivare**, e lo stato del check-up dice se
è stato fatto, mai cosa ha detto (`docs/CONTRATTO-DATI.md` §3). Finché nessuna
schermata mostrava un nome la frase era vera e poco interessante; adesso dice
esattamente dove passa il confine, e si mostra aprendo `/hr/employees` dopo il
portale della Dr.ssa Meier.

**Va detto come il punto più forte del prodotto, non come una rassicurazione**:
qui la privacy non è una promessa scritta nell'informativa, è una proprietà della
forma dei dati — la stessa disciplina per cui i font sono self-hostati e le
richieste esterne a runtime sono zero (`CLAUDE.md` §3).

### "E se due persone hanno le stesse iniziali?"

Arriva **subito dopo** quella sulla privacy, cioè mentre `/admin/sessions`
mostra "M.B." accanto al "Marco Bianchi" del portale della professionista. Tre
fatti, in quest'ordine.

**Primo, e va detto per primo perché rende credibile il resto: nella demo non
succede, ed è un vincolo del dataset — non una proprietà del prodotto.** Nessuna
coppia di persone condivide le iniziali, e a sorvegliarlo c'è un guardrail che
fa fallire l'avvio se qualcuno ne aggiunge una: è il modo in cui le tre liste di
persone restano unibili a mano mentre i dati sono finti.

**Secondo: in produzione le liste si uniscono per id vero**, e le iniziali
tornano a essere quello che sono — una resa. Il vincolo del dataset cade insieme
al guardrail che lo sorveglia, perché non serve più a niente
(`docs/CONTRATTO-DATI.md` §7).

**Terzo, ed è la parte onesta: quello che resta aperto è cosa vede chi guarda
due righe uguali**, ed è una scelta di prodotto che non abbiamo ancora preso
(§8.8). La strada facile — un identificatore accanto alle iniziali — è
**esattamente ciò che quelle schermate esistono per non dare**: un pseudonimo
stabile identifica, e a quel punto l'anonimato è una parola. Le strade sono tre
— un discriminante che non identifica, l'ordinamento come unica chiave di riga,
o l'ammissione che due righe possano leggersi uguali — e si citano, non se ne
sceglie una in sala.

**Due dettagli che rafforzano la risposta**, e sono di questa demo: i posti in
cui l'ambiguità morde sono **due** — l'elenco dipendenti dell'HR e le sessioni
del back-office — perché dal 17.08.2026 i pazienti e le sedute della
professionista portano il nome. Restringere quell'elenco **è tutto il guadagno**:
due dei quattro posti erano proprio quelli di chi la persona la conosce.

**Non promettere una soluzione e non dire "è in roadmap"**: è la stessa
disciplina della risposta sull'escalation clinica, e per la stessa ragione — la
domanda dopo è *"e quando succede?"*, e a una funzione descritta e non costruita
non c'è niente da rispondere.

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

### "Come fate margine se le sessioni costano?"

**Dal divario fra sessioni incluse ed erogate**, e il numero che lo sostiene è
già a schermo: il monte annuo di Demo SA è di **1'200 sessioni** — 120 dipendenti
per le 10 del piano Plus — e ne sono state usate **142**, cioè il **12%**
(`CLAUDE.md` §8). È la KPI "142 di 1'200" della dashboard HR, quindi è una cifra
che si indica mentre la si dice, non un conto fatto a voce.

**Il costo da leggere accanto è quello di una sessione erogata: CHF 70–80** al
professionista (`CLAUDE.md` §9). Senza un costo unitario il 12% è un dato e non
un argomento; con il costo accanto al monte e al consumo, **la moltiplicazione la
fa chi ascolta**. Va lasciata fare: la tariffa è una banda e non un punto, quindi
un totale detto a voce diventa un numero da difendere che nessuno ha chiesto.

**Il cap annuale è il freno, e il co-payment è il deterrente che lo tiene** — non
un ricavo. Oltre le sessioni incluse il dipendente paga di tasca sua, e questo
tiene il consumo dentro il monte **senza che la piattaforma debba dire di no a
nessuno**: è la differenza fra un tetto che si spiega e una lista d'attesa che si
subisce.

Non è teoria messa in una slide: nell'elenco pazienti del portale professionista
**due pazienti sono sopra il cap**, e a schermo si vede che il tetto è reale e
gestito.

I tetti scalano col piano, e il co-payment con loro: **Essenziale 6 sessioni, extra
CHF 35 · Plus 10, extra CHF 28 · Executive 16, extra CHF 22** (`CLAUDE.md` §9).

> **Risposta riscritta su decisione dei founder del 14.08.2026.** Diceva che il
> margine viene dal co-payment, e metteva nella stessa frase i CHF 28 incassati e
> i CHF 70–80 pagati: chi ascolta fa la sottrazione e sente dire che ogni sessione
> oltre il cap costa alla piattaforma più di quanto le renda, cioè l'opposto di
> ciò che la frase voleva dire. Il divario fra incluse ed erogate regge da sé, e
> il suo numero è l'unico dei tre che l'investitore ha già davanti agli occhi.

### "Il documento dice 15–25% di utilizzo, la demo mostra il 12%"

Arriva da chi ha letto il Business Plan, e arriva subito dopo la risposta sul
margine, perché è lì che il 12% viene detto. Chi la fa sta concludendo che la
demo è sotto-utilizzata rispetto alle nostre stesse assunzioni. **Non lo è, e i
due numeri non si possono sottrarre: hanno denominatori diversi.**

**Primo, e prima di ogni altra cosa: il 12% non è una quota di persone.** È la
quota del **monte annuo di sessioni** che è stata consumata — 142 su 1'200
(`CLAUDE.md` §8) — mentre il 15–25% del documento è una quota di **dipendenti**.
È questa sovrapposizione a generare la domanda, quindi si scioglie per prima e
con una frase sola.

**Secondo: la quota di persone del dataset è circa il 23%.** Le 142 sessioni
dell'anno, a cinque sessioni a testa, fanno **~28 persone su 120**. Le cinque
sessioni a testa non sono una nostra stima: sono la riga del Business Plan per il
piano Plus, che è il piano di Demo SA — *"150 dip: 30 dip × 5 sess = 150 sess"*
(`CLAUDE.md` §9).

**Terzo, ed è il confronto giusto: quel 23% sta accanto al 20% del Business
Plan.** Gli esempi di margine del documento sono **annuali** e danno tutti e due
il **20% dei dipendenti** — 30 su 150 sul Plus, 10 su 50 sull'Essenziale. Demo SA
è appena sopra quella soglia, sullo stesso piano e sulla stessa base. Detto così
il dataset non è sotto le assunzioni: **le rispetta**.

**Non confrontare il 23% con la banda "in un mese dato"**: sarebbe rifare la
stessa confusione al contrario, un dato annuale contro uno mensile.

**Se la domanda insiste, la contraddizione è del documento e si dice così.** Nel
riquadro "principio fondamentale" le due letture non stanno insieme: 25–30
sessioni al mese su 50 dipendenti Essenziale fanno 300–360 all'anno su un monte
annuo di 300, mentre l'esempio di margine due righe sotto calcola il 79% su **30
sessioni all'anno**. È un fattore dieci dentro lo stesso riquadro. **Dove il
Business Plan diverge da sé stesso, la lettura difendibile è l'esempio di
margine**, ed è quella che il dataset segue — non l'abbiamo scelta per comodità,
è l'unica delle due il cui conto torna.

Da non fare: non usare questa risposta per anticipare la curva di utilizzo reale.
Quella non la sappiamo, ed è la domanda qui sotto.

### "Quindi sulle sessioni extra ci rimettete?"

È l'altro seguito della risposta sul margine, e nasce dalla parte sul co-payment:
dire che è un deterrente e non un ricavo invita la domanda, dove la formulazione
vecchia non la invitava. È il prezzo della correzione, e si paga rispondendo —
non schivando.

**Sì, per unità, ed è voluto.** Il co-payment è tarato per **scoraggiare l'uso
oltre il tetto**, non per coprirne il costo: a KORA una sessione erogata costa
**CHF 70–80** e oltre il cap ne incassa **28**, quindi sull'unità la sottrazione
la fa chiunque e il segno è quello.

**Il confronto che spiega il numero è un altro, ed è quello da fare per primo:
fuori la stessa sessione costa CHF 120–150** (`CLAUDE.md` §9). Il dipendente che
supera il cap paga **28 invece di 120–150**, cioè **un quarto o un quinto** del
prezzo di mercato. È lì che si vede a cosa serve quella cifra: non a coprire un
costo, ma a restare abbastanza bassa da non trasformare la sessione oltre il tetto
in una barriera economica, e abbastanza visibile da restare una scelta
consapevole. Un prezzo a copertura vorrebbe dire chiedere al dipendente i
120–150 del mercato privato, e a quel punto il tetto non sarebbe più un tetto:
sarebbe la fine dell'accesso.

**I tre numeri vanno tenuti distinti, perché due si somigliano**: 70–80 è quanto
KORA **paga**, 120–150 quanto costa **fuori**, 28 quanto paga **il dipendente**
oltre il cap sul Plus. Fino al 14.08.2026 questa risposta chiamava "tariffa del
mercato privato" i 70–80 — cioè il costo di KORA al posto del prezzo di fuori — e
con quella sostituzione l'argomento si capovolgeva: il confronto diventava
"28 contro 70–80", che dice solo che ci rimettiamo, e spariva il 4–5× che è la
ragione per cui il co-payment funziona.

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

**Il tetto scala col piano al contrario del co-payment**: Essenziale 6 sessioni con
extra a CHF 35, Executive 16 con extra a CHF 22 (`CLAUDE.md` §9). Chi ha più
sessioni incluse paga **meno** l'extra, perché al tetto ci arriva avendone già
usate di più. Detto così è coerenza del modello, non una stranezza da
giustificare.

**Se la domanda arriva a *"e se uno ne facesse trenta?"***: oggi non c'è nessun
tetto al numero di sessioni oltre cap prenotabili, il caso non si è mai presentato,
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
  verificati e **mandato non ancora firmato**: zero sessioni erogate, nessuna
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
rischio.

**Il 144 è a schermo in due punti, ed entrambi sono nella chat del medico.** Il
disclaimer sotto la conversazione — *"in caso di emergenza chiama il 144"* — e
la risposta con cui la chat si chiude, che orienta e aggiunge *"se i sintomi
peggiorano all'improvviso, chiami il 144"*. **Non c'è nel check rapido**, che è
invece il punto in cui il valore peggiore si dichiara senza parlare con nessuno.

Detto così non attenua la risposta, la precisa: **quello che manca non è un
numero da aggiungere, è un percorso dove il segnale arriva.** Se qualcuno lo ha
visto nella chat mentre mostravi il medico virtuale, questa è la frase che tiene
insieme le due cose invece di sembrare una contraddizione. *(Fino al 17.08.2026
il numero era in un punto solo; il secondo è arrivato con l'arco della chat, e
non sposta la lacuna di un centimetro.)*

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
