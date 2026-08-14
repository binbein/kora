# KORA — il contratto dati

Questo documento è l'output di M2 (`CLAUDE.md` §3, §5.7) ed è **la specifica con
cui nasce il repository del backend**. Descrive l'interfaccia che le schermate
consumano già oggi, gli invarianti che l'implementazione vera dovrà rispettare, e
ciò che è stato lasciato fuori di proposito.

Non descrive il dataset della demo. I valori che il frontend mostra oggi sono
finzione costruita ad arte (`CLAUDE.md` §8 e §9): servono a raccontare una storia
in trenta minuti, non a vincolare l'API. Dove una scelta del dataset ha
conseguenze sul contratto, è detto esplicitamente.

## 1. La forma

```
src/lib/data/
  types.ts     ← le entità: coprono tutto il §10
  provider.ts  ← l'interfaccia: ogni metodo restituisce una Promise
  index.ts     ← una riga che sceglie l'implementazione
  mock/        ← oggi. Si cancella il giorno del passaggio
  http/        ← domani. Stessa interfaccia, fetch dentro
```

Il passaggio alla produzione ha questa forma e nessun'altra: si aggiunge `http/`,
si cambia la riga di `index.ts`, si cancella `mock/`. **Le schermate non le tocca
nessuno.** Se durante l'implementazione del backend viene il pensiero che
convenga rifare il frontend, è il segnale che il seam non ha tenuto: va riportato
ai founder, non eseguito.

**L'elenco completo dei metodi è l'interfaccia `DataProvider` in
`src/lib/data/provider.ts`, che è la fonte** — come `types.ts` lo è per le entità
(§3). Questo documento ne nomina quelli su cui c'è da dire qualcosa che il codice
non dice da solo: chi implementa il backend prende la superficie da lì, non da
qui, perché un elenco trascritto è un secondo elenco che può divergere dal primo.

Due controlli meccanici tengono in piedi questa promessa, e girano nel lint:

- nessun file fuori da `src/lib/data/` può importare `@/lib/data/mock/*`;
- nessun file fuori da `src/lib/data/` può chiamare `new Date()`.

## 2. Le regole che hanno deciso l'interfaccia

**Ogni metodo restituisce una `Promise`, senza eccezioni.** È l'unica scelta non
recuperabile: una schermata che chiamasse il provider aspettandosi un oggetto
andrebbe riscritta il giorno in cui dietro c'è una `fetch`, perché dovrebbe
imparare attesa, errore e vuoto.

**I metodi sono di dominio, non di schermata.** Il criterio: un metodo è di
dominio se sopravvive a un redesign della pagina che lo consuma.
`getRoiSnapshot(period)` sopravvive; un `getHRDashboardData()` no — alla prima
KPI spostata cambierebbe l'API, e il backend erediterebbe le nostre decisioni di
layout. Per la stessa ragione **nell'interfaccia non c'è nessun raggruppamento
per settimana**: la griglia del calendario e le righe del riepilogo compensi si
costruiscono nel client, dalle stesse sedute.

**Assente si dice `null`, mai `undefined` — dove il campo pertiene.** Un valore
che non c'è e un campo che nessuno ha valorizzato sono cose diverse, e alla prima
serializzazione JSON `undefined` sparirebbe dall'oggetto invece di arrivare come
assenza. La regola vale sugli **slot di valore**: posti che il caso prevede e che
possono essere vuoti. `PatientSummary.lastSessionAt` è `Date | null` perché ogni
paziente ha una data dell'ultima seduta, e per chi non ne ha ancora fatte quella
data è vuota; `getPlan` restituisce `Plan | null` perché la domanda ha sempre
senso e la risposta può essere "nessuno".

**Il `?` dice un'altra cosa: che il campo non pertiene al caso.** Non è
un'eccezione tollerata, è la seconda metà della regola, e le due non si
sostituiscono a vicenda:

- gli opzionali di `Plan` — assente significa che **il contratto commerciale non
  lo prevede** (§3), e il listino salta la riga invece di stampare una negazione.
  Un `null` direbbe "questo piano ha un tetto di consulti, ed è vuoto", che è
  falso;
- `ProfessionalSession.cancellationReasonKey` — assente significa che **la seduta
  non è annullata**. Un motivo di annullamento `null` su una seduta erogata
  sarebbe un campo che non dovrebbe esistere lì, dichiarato vuoto;
- `RapidCheckAnswer.employeeId` — assente significa che **la risposta arriva dal
  link anonimo**. Rispondere non richiede un account (`CLAUDE.md` §8), quindi la
  persona non è un valore vuoto da riempire: è un dato che quel caso non ha. Il
  reparto invece non è opzionale, perché senza di lui la risposta non è
  aggregabile.

Il criterio, in una domanda: *se il valore mancasse, la riga avrebbe comunque un
posto dove metterlo?* Se sì, `| null`. Se no, `?`.

Per il backend la differenza è concreta: un campo `| null` **è sempre nella
risposta**, con `null` dentro; un campo `?` **non c'è** quando non pertiene, e il
client non deve distinguere fra assente e vuoto perché il caso non si presenta.

**La regola riguarda i modelli di lettura. Sugli input di scrittura il `?` è
legittimo**, ed è la convenzione giusta: `DemoRequestInput.message` è un campo di
form che si può lasciare vuoto, e obbligare ogni chiamante a passare
`message: null` sarebbe rumore su un payload in uscita. **A normalizzare è il
confine**: il provider scrive `?? null` sul record che salva, che è esattamente
ciò che farà il backend ricevendo la richiesta. Da lì la lettura dice `| null`
come tutte le altre.

**Il codice la rispetta per intero**, e i due punti che non lo facevano sono stati
allineati dopo la chiusura di M3. Restano annotati perché sono i due casi in cui
sbagliare è facile, e chi scrive il backend li incontrerà:

- **`DemoRequest` ereditava il `?` dall'input**, perché era dichiarato come
  intersezione di `DemoRequestInput`: la scorciatoia di tipo si portava dietro la
  convenzione dell'altro lato. La proiezione letta non è più un'intersezione e
  dichiara `message: string | null`, mentre l'input tiene il suo `?`. È il caso
  che mostra perché le due convenzioni non si sostituiscono a vicenda: **è lo
  stesso campo, e cambia forma attraversando il confine**;
- **`Professional.firstName` è `string | null`**. Non è un campo che al caso non
  pertiene — ogni professionista un nome proprio ce l'ha — è uno slot che il
  dataset demo non riempie, per la ragione dichiarata in §7.

**La superficie del provider cresce così**: *le letture si espongono quando il
dato esiste, le scritture solo quando hanno un chiamante.* Le due metà non sono
simmetriche di proposito. Una lettura senza consumatore costa un metodo che
restituisce dati già costruiti; una scrittura senza consumatore costringe a
indovinare la superficie di invalidazione, che è la parte del contratto in cui
sbagliare costa di più — è il motivo per cui in M2 arrivò `saveSessionNote` e non
`bookAppointment`, che è nato in M3 con il suo chiamante e con la sua riga nella
tabella del §4.

Questa regola sostituisce quella più stretta con cui M2 era partita ("un metodo
nasce con un chiamante"): con quella, tutto il dataset di §8 e §9 sarebbe rimasto
irraggiungibile e questo documento non avrebbe descritto niente. **Va letta prima
di applicare il §11 a `provider.ts`**: i metodi senza chiamante che ci trovate non
sono dimenticanze.

## 3. Le entità

Definite in `src/lib/data/types.ts`, che è la fonte e va letto insieme a questo
documento. Qui stanno solo gli invarianti che il codice non può esprimere.

### Azienda, piani, reparti

- `Company.anonymityThreshold` è una **proprietà del cliente**, non una costante
  di piattaforma: aziende diverse possono averne di diverse, e la frase che la
  mostra non cambia perché il numero è un segnaposto.
- I campi opzionali di `Plan` seguono una regola sola: **assente significa che il
  contratto commerciale non lo prevede**, non che il piano ne sia privo. Il
  listino salta la riga invece di trasformarla in una negazione.
- **`Plan.hrDashboard` e `Plan.freeIntroInterview` sono obbligatori di
  proposito**, ed è la riga da leggere prima di renderli opzionali per simmetria
  con i vicini: sono slot di valore, non campi che al caso non pertengono. Tutti e
  tre i piani hanno una dashboard HR — il §9 la trascrive per ognuno — quindi non
  esiste il caso "il contratto commerciale non la prevede", e il campo è
  un'enumerazione di livelli, non una cadenza. Il colloquio conoscitivo è un
  booleano perché la domanda ha senso su tutti e tre e su due la risposta è "no":
  un campo assente lo renderebbe indistinguibile da un piano su cui nessuno ha
  ancora deciso.
- `Department` **non** porta il conteggio dei misurati. Vive sul record mensile.

### Misurazione dello stress — la parte più delicata

Il dato di stress **non si deduce mai dal comportamento**: né dalle sedute
prenotate, né dalle aperture dell'app, né da un wearable. Un segnale
comportamentale non distingue "il reparto sta peggio" da "il reparto ha adottato
bene il prodotto", e legge come in miglioramento chi si sta ritirando. La
dashboard HR afferma la prima cosa, quindi il dato deve misurare quella.

Tre invarianti che il backend deve garantire:

1. **`measuredEmployees` sta su `DepartmentMonth`, mai sull'anagrafica.**
   L'adesione al check rapido si muove — cala proprio quando un reparto va sotto
   pressione — e con un conteggio unico si peserebbe tutta la serie con il valore
   di oggi, decidendo l'esclusione una volta sola per l'intera storia.
2. **La soppressione avviene lato server.** `StressRecord` arriva al client già
   filtrato: un reparto sotto soglia non ha un punteggio nascosto in UI, non ce
   l'ha nel record. `measuredEmployees` invece esce **su entrambi i rami**, perché
   la riga sotto soglia deve poter mostrare quante persone hanno risposto.
3. **I reparti sotto soglia non entrano nel denominatore** della media aziendale.
   Un punteggio non pubblicabile non può rientrare da una porta di servizio dentro
   un aggregato da cui si potrebbe risalire.

`EarlyAlert` è **derivato dalla scansione delle serie**, non un record salvato: un
alert memorizzato smette di corrispondere ai punteggi da cui è nato. Segnala solo
una risalita ancora in corso all'ultimo rilevamento.

### Appuntamenti — due proiezioni, una entità

`Appointment` (lato dipendente) e `ProfessionalSession` (lato professionista) sono
**due viste dello stesso record memorizzato**, non due entità. Una prenotazione
fatta dal dipendente compare nel calendario del professionista perché è la stessa
riga.

La proiezione del professionista porta `patientId` e `patientInitials`, e **non ha
nessun campo su cui un nome possa arrivare**. Non è una scelta di rendering: è una
garanzia del contratto.

`EmployeeDirectoryEntry` è l'altra metà della stessa garanzia, dal lato
dell'azienda: porta iniziali e reparto e **non ha nessun campo su cui un nome
possa arrivare**, esattamente come `ProfessionalSession`. Non porta nemmeno un
dato sanitario — lo stato del check-up dice se è stato fatto, mai cosa ha detto.
Il suo `checkupStatus` è `null` per chi non ha attivato l'account: la colonna
esiste per tutti, il valore no (§2).

`SessionNote` porta il testo e **nessun metodo dell'area HR o admin lo
restituisce**. Le altre proiezioni sanno al massimo che una nota esiste
(`ProfessionalSession.hasNote`), mai cosa dice. La nota non esce mai verso
l'azienda del paziente, e a impedirlo è la forma del dominio.

### Percorso dipendente

`getEntitlement` prende **quale servizio**, non solo lo psicologo:
`CappedServiceKind` è l'unione stretta dei due che il Plus cappa a un numero di
sedute l'anno. Il medico virtuale è illimitato e il check-up si conta una volta
l'anno, quindi per loro `SessionEntitlement` non direbbe niente di vero. In
produzione l'unione si allarga se un piano cappa altro — l'Executive ha
nutrizionista e workshop.

`SessionEntitlement.extraSessionPrice` è **opzionale**, ed è il criterio `?` del
§2 applicato bene: assente significa che il piano non dichiara un prezzo oltre il
cap, non che la seduta successiva sia gratis. Il Business Plan dà l'importo per
lo psicologo e non ne dà nessuno per il coaching. Le schermate saltano la riga:
il portale professionista non mostra il co-payment, la prenotazione non offre una
seduta a pagamento.

#### Il diritto alle sedute: tre cose che il tipo non dice

Sono le tre in cui l'implementazione di oggi e questo testo divergono, e nessuna
si vede nella demo. Chi scrive il backend le incontra tutte e tre.

**`used` conta le erogate dell'anno di piano, e oggi non c'è un anno.** La
definizione nella tabella delle KPI (§3) dice «nell'anno di piano»;
l'implementazione conta tutte le sedute erogate del paziente, senza finestra.
Nella demo coincidono perché l'agenda è più corta di un anno, ma **in produzione
un cap che non ha un periodo non riparte mai**: al tredicesimo mese il dipendente
resterebbe oltre il tetto per sempre.

`SessionEntitlement` avrà quindi bisogno di un periodo, come `CheckupEligibility`
ce l'ha già — è la stessa domanda, *da quando ricomincio a contare*, e lì è
risolta. Il campo non esiste oggi perché nessuna schermata lo leggerebbe, e un
campo che nessuno legge è ciò che il §11 vieta.

**Il conteggio autorevole è quello centrale, sul paziente.** Il portale del
dipendente conta le sedute su **tutti** gli psicologi; quello del professionista
conta le proprie. Oggi coincidono perché la paziente della demo ne vede uno solo,
e con due psicologi divergerebbero: il co-payment scatterebbe in ritardo, cioè si
erogherebbe a tariffa piena una seduta che il piano non copre più, e a pagarla
sarebbe la piattaforma.

Il backend deve calcolarlo **una volta sola sul paziente**, attraverso tutti i
suoi professionisti. Ciò che il portale del professionista mostra è una
**proiezione** di quel conteggio, come `ProfessionalSession` lo è della seduta
(§3, appuntamenti): serve a far vedere il co-payment al professionista, non a
deciderlo.

**Il piano viene dall'azienda del paziente.** La funzione che calcola il diritto
legge oggi il piano dell'azienda della demo per **tutti** i pazienti, ed è la
stessa semplificazione dell'azienda unica (§7). In produzione una professionista
serve più aziende clienti, quindi il cap e il prezzo della seduta extra cambiano
da paziente a paziente: sono due dati del contratto commerciale di **quella**
azienda, non della piattaforma.

**Un servizio che il piano non prevede vale `null`, non un totale a zero.** Oggi
`getEntitlement("coach")` su un piano senza coach risponde con un diritto da
`0` sedute, e a saltare la riga è la schermata, che legge il piano dall'azienda.
Funziona, e dice una cosa falsa: un totale a zero afferma *«hai diritto a zero
sedute»*, mentre il fatto è *«questo diritto non ce l'hai»* — la differenza fra
un cap esaurito e un servizio che non è nel contratto.

Il valore giusto è `SessionEntitlement | null`, che è la forma che il §5 già
ammette per le assenze legittime. Il tipo oggi non lo prevede perché cambiarlo
sarebbe stato un cambio di contratto dentro una passata di schermate, e in
produzione va cambiato: con `null` la schermata salta la riga su un valore, senza
dover andare a leggere il piano per sapere se il diritto esiste.

`VirtualDoctorConsult` esiste perché il conto dei consulti si prende **dalla
lista**, non da uno scalare accanto. Porta la sola data di apertura: la
conversazione della demo è una simulazione dichiarata e non ha trascritti da
conservare. In produzione il tipo cresce qui — trascritto, medico che ha
risposto, esito — non in una seconda entità.

**Il tetto dei consulti è dichiarato e non è applicato.**
`Plan.virtualDoctorConsultsPerYear` esiste — l'Essenziale ne dà 3 all'anno — e
**nessuna schermata lo legge**, perché la demo è sul Plus, che li dà illimitati:
un controllo scritto oggi sarebbe logica per un caso che nessun percorso può
mostrare, cioè il ramo irraggiungibile che il §11 vieta.

Ne discende che il conteggio esiste come dato e non come regola: in produzione il
tetto va applicato dal server — è lui a dover rifiutare il quarto consulto di chi
ne ha tre — e la schermata deve poterlo dire prima che qualcuno scriva. Vale la
stessa domanda del cap sulle sedute qui sopra: **su quale periodo si conta**.

`RapidCheckAnswer` è il segnale che alimenta ogni dato di stress della dashboard
(§3, misurazione). La scrittura prende **il solo valore**: chi risponde è la
persona autenticata e il reparto lo sa il server, come `getCompany()` non prende
un identificatore (§7). La variante su link anonimo porterà il reparto dal link.

**Il check rapido non ha nozione di periodo, e gli mancano tre cose.** La lettura
restituisce **l'ultima risposta in assoluto**, non quella del periodo corrente:
la card mostra "già risposto" a chi ha risposto un anno fa, e nella demo non si
vede perché di risposte ce n'è al massimo una, scritta durante la sessione.

- **La cadenza non esiste.** Il §8 di `CLAUDE.md` lo chiama *ricorrente* e il
  Business Plan ne descrive tre al mese; il contratto non dice ogni quanto si
  chiede, quindi non può dire quando è **dovuto**. Senza cadenza non esistono né
  l'invito né il ritardo, e il denominatore dell'adesione — i misurati del
  periodo, da cui dipende la soglia di anonimato — non è calcolabile dal dato:
  oggi arriva già aggregato (§3, misurazione).
- **Lo storico non esiste.** `getRapidCheckAnswer` dà un valore, non una serie:
  la persona non può vedere il proprio andamento, che è metà del senso di un
  check ricorrente.
- **La correzione non esiste.** Non c'è modo di cambiare una risposta appena
  data, e su un tocco solo l'errore è a un dito di distanza. In produzione va
  deciso se la seconda risposta dello stesso periodo **sostituisce** la prima o
  se ne aggiunge una: le due producono medie diverse, e la scelta appartiene al
  dato, non alla schermata.

### Check-up

`CheckupProvider` porta lo **stato del convenzionamento**, e arriva al client
anche quando è `pending`: non è una soppressione per privacy come quella dei
reparti sotto soglia, è un dato che il back-office segue. Chi prenota mostra le
sole strutture attive. È **una rete sola**: il portale dipendente e il
back-office descrivono le stesse strutture.

`CheckupEligibility` risponde a "posso prenotare, e da quando". La cadenza è una
regola del piano — il Plus dà un check-up all'anno — quindi il calcolo sta nel
contratto e non nella schermata, che potrebbe ricalcolarlo diversamente.
`availableFrom` è `null` quando il piano non comprende il check-up, che non è la
stessa cosa di una data lontana.

`CheckupReport` è **l'unico dato sanitario individuale del dominio** e vive solo
lì, come `SessionNote`: nessun metodo dell'area HR o admin lo restituisce.
`EmployeeDirectoryEntry` porta lo stato del check-up, mai il suo esito. Sta su un
metodo suo e non dentro l'eligibility perché si chiede quando lo si apre, che è
anche il modo in cui in produzione lo si permessiona e lo si traccia. I valori
delle misure sono **stringhe** — "120/80 mmHg", "Ritmo sinusale" — perché sono
letture con la loro unità, non grandezze che il client debba riformattare.

### Compensi

`ProfessionalEarnings` conta **solo le sedute erogate**: quelle in programma non
sono un compenso maturato. Non porta le righe settimanali, per la ragione detta in
§2.

`FullCapacityReference` esiste perché il totale mensile va sempre letto accanto al
regime tenuto. Senza, un totale part-time si legge come il massimo che la
piattaforma può dare a un professionista.

### KPI con una definizione, non ovvie

Il backend deve calcolarle **allo stesso modo**, altrimenti in produzione ne
nascono due e le schermate divergono:

| KPI | Definizione |
|---|---|
| **Paziente attivo** | ha una seduta in programma, **oppure** una erogata nelle ultime 6 settimane |
| **Dipendente attivo** (azienda) | ha usato almeno un servizio **nel trimestre**: è il conteggio che pilota il risparmio trimestrale, quindi copre il suo stesso periodo |
| **Adozione** | iscritti ÷ organico, arrotondato all'intero |
| **Diritto alle sedute** (`used`) | conto delle sedute **erogate** del paziente nell'anno di piano — mai un contatore a parte |
| **Regime tenuto** | media delle sedute erogate nelle 4 settimane piene precedenti quella corrente |
| **Sessioni consumate** (azienda) | **cumulate sui dodici mesi** del monte annuo, non consumate nel trimestre. Si sommano dalla serie di utilizzo: non sono un secondo conteggio |
| **Risparmio trimestrale** | proporzionale agli attivi, **arrotondato al centinaio** |
| **Giorni di assenza evitati** | risparmio ÷ costo di una giornata di assenza |
| **Utilizzo** (`usagePercent`) | sessioni di psicologo consumate ÷ **monte annuo**, non ÷ trimestre: è la stessa grandezza della KPI "142 su 1'200" |
| **Check-up completati** | check-up eseguiti ÷ **iscritti**, non ÷ organico: chi non ha attivato l'account non può prenotarlo, e metterlo al denominatore misurerebbe l'adozione una seconda volta |
| **Trend dello stress** | ultimo mese del trimestre **meno** l'ultimo del precedente, in punti. `null` sul trimestre più vecchio della finestra, che un precedente non ce l'ha: uno zero direbbe "invariato" dove il dato non esiste |

L'arrotondamento al centinaio fa parte della regola, non della formattazione:
senza, gli importi non sono riproducibili, e una cifra al franco su un risparmio
stimato è finta precisione.

### Piattaforma — il back-office

`ClientCompany` **non porta il fatturato**, ed è la stessa regola di `Invoice`:
è organico × prezzo del piano × 12, e un campo accanto ai due da cui viene può
smettere di tornare con loro. Il back-office ereditato lo dimostrava,
dichiarando per Demo SA un fatturato calcolato su un organico che l'elenco
accanto non confermava più.

`ClientCompany.active` distingue **il cliente non ancora avviato** da quello con
adozione nulla: un contratto firmato e non partito non fattura e non ha
iscritti. In produzione la distinzione serve alla fatturazione, non solo
all'etichetta.

`PlatformMonth` è **una serie sola per tutti i grafici dell'analytics**, come
`ServiceUsageMonth` lo è per la dashboard HR e per la stessa ragione: la
distribuzione per servizio e il totale del mese si derivano da qui, e due
entità separate potrebbero divergere. Ogni suo campo è derivato dal portafoglio
clienti; nel dataset demo le sessioni di un cliente sono la curva di Demo SA
scalata sul rapporto fra gli iscritti, **e questa è una semplificazione che
salta in produzione** (§7).

**Tutti i campi di `PlatformMonth` contano lo stesso insieme: i clienti
presenti in quel mese _e_ avviati.** Ricavo, dipendenti coperti, iscritti e
sedute rispondono allo stesso predicato, e un contratto firmato e non partito
non entra in nessuno dei quattro — è `ClientCompany.active` applicato una volta
sola.

Non è pignoleria: iscritti e coperti sono il numeratore e il denominatore
dell'attivazione, quindi **contare due insiemi diversi ammette un'attivazione
sopra il 100%**. È la forma esatta del difetto che il mock aveva —
`coveredEmployees` filtrava gli attivi, `enrolledEmployees` no — e che non si
vedeva perché nel dataset demo l'unica azienda non avviata ha zero iscritti. In
produzione quella coincidenza cade: un contratto firmato può avere persone già
registrate prima dell'avvio. Un guardrail verifica ora l'invariante su ogni
mese.

**Il tasso di attivazione non è un campo.** È iscritti ÷ dipendenti coperti,
cioè la stessa definizione dell'adozione aziendale applicata a tutti i clienti
attivi. Salvarlo è come il back-office ereditato è arrivato a mostrare "618
utenti attivi" accanto a un tasso che ne implicava 767.

`Professional.rating` è `number | null`: **chi non ha erogato sedute non ha una
valutazione**, e uno zero si leggerebbe come la peggiore possibile. Chi è
prenotabile non è un campo ma una derivazione — `documentsVerified &&
mandateSigned` — così il back-office elenca tutti e la prenotazione filtra,
senza uno `status` che possa contraddire i due controlli da cui verrebbe.

### Granularità

Una scelta del contratto, non del mock: le serie aziendali (stress, utilizzo
servizi — `ServiceUsageMonth`) sono **mensili**; gli aggregati economici
dell'azienda (risparmio, giorni evitati) sono **trimestrali**; il lato
professionista rendiconta **al mese**. La distribuzione per servizio non è
un'entità: si deriva sommando la serie mensile sul periodo selezionato.

## 4. Letture e scritture

Le chiavi di react-query stanno in `src/lib/data/query-keys.ts` e sono
gerarchiche: invalidare `["professional", id]` porta con sé sedute, pazienti,
compensi e pagamenti.

| Mutation | Invalida |
|---|---|
| `saveSessionNote` | `["professional", professionalId]` |
| `bookAppointment` | `["professional", professionalId]` **e** `["employee"]` |
| `submitRapidCheck` | `["employee", "rapid-check"]` |
| `submitDemoRequest` | `["platform", "demo-requests"]` |
| `enterAs` | `["session"]` |

~~Sono tutte le scritture del dominio: dopo l'area pubblica non ne restano
fuori.~~ → **cinque da M5.d**, e la quinta è di natura diversa dalle altre
quattro: `enterAs` non scrive un dato del dominio ma la sessione, quindi
invalida solo sé stessa. Concedere un ruolo non muove nessun numero, e far
rileggere altro sarebbe rileggere mezza applicazione per un cambio di porta.

**È anche la sola che in produzione può sparire**: il ruolo lo concederà
l'autenticazione (§6). Le altre quattro restano.

**`bookAppointment` invalida due radici perché scrive un record solo.**
`Appointment` e `ProfessionalSession` sono due proiezioni della stessa seduta
(§3), quindi dopo la scrittura devono rileggere entrambe: la radice del
professionista porta con sé sedute, pazienti e **disponibilità** — per questo
gli slot stanno sotto di lei e non sotto il dipendente — e quella del dipendente
appuntamenti e contatori. La prova a schermo esiste: prenotando dal portale
dipendente lo slot sparisce, l'appuntamento compare in home e la stessa seduta
compare nel calendario e nelle sedute in programma del professionista.

**`bookAppointment` deve poter rifiutare, e oggi non lo fa mai.** La firma
promette un `Appointment`: nella demo la prenotazione riesce sempre, perché
l'unica scrittrice è la schermata e gli slot che propone sono liberi per
costruzione. In produzione **due persone chiedono lo stesso slot nello stesso
secondo**, e il secondo tentativo va rifiutato — un `409` sul confine HTTP, un
errore sul confine dell'interfaccia. Il client sa già che una mutation può
fallire (§5) e la schermata dice che lo slot è ancora libero, quindi il caso ha
già la sua resa: a mancare è il rifiuto, non il modo di mostrarlo.

**Nessun tetto governa le prenotazioni in programma.** Il diritto alle sedute
conta le **erogate** — è la definizione della tabella qui sopra, ed è la ragione
per cui prenotare non fa salire `used` — ma da questo discende che si può
prenotare **oltre il cap** senza che niente lo dica: il tetto morde al momento
dell'erogazione, e nel frattempo l'agenda accetta. Nella demo non si vede, perché
gli slot proponibili sono pochi e il cap è lontano.

In produzione va deciso **dove** il tetto si applica: al momento della
prenotazione — e allora `bookAppointment` rifiuta anche per questa ragione, con
un motivo distinto da quello dello slot occupato — oppure alla conferma della
seduta, e allora il dipendente va avvertito prima. Il contratto non lo dice
perché la demo non lo esercita, ma è una scelta di prodotto e non un dettaglio:
cambia cosa vede chi prenota l'undicesima seduta.

**`submitRapidCheck` invalida solo la risposta**, non la radice: il check rapido
non muove contatori né appuntamenti, e invalidare più del necessario farebbe
rileggere mezza schermata per un tocco.

**`submitDemoRequest` ha aspettato il suo lettore.** Fino al blocco dell'area
pubblica non invalidava niente, e la riga di questa tabella lo dichiarava: a
leggere le richieste sarebbe stato il back-office, che era l'ultima area da
migrare, quindi non c'era ancora niente da invalidare. `getDemoRequests` è nato
con il suo consumatore, e da lì la mutation invalida `["platform",
"demo-requests"]`.

**Perché valeva la pena aspettare un blocco**: la superficie di invalidazione è
la parte del contratto in cui sbagliare costa di più, e dichiararla in anticipo
non l'avrebbe resa più vera — l'avrebbe solo resa più difficile da correggere.
È il §2 applicato al caso in cui è più facile disattenderlo.

Il record si salvava comunque nello stato del provider, che vive in memoria: una
richiesta compilata davanti a un investitore è ancora lì navigando su `/admin`
(`CLAUDE.md` §10). E non ha semi — il §8 non contiene richieste demo, quindi
l'elenco parte vuoto invece di aprirsi su cinque righe inventate (§2.4).

**Una prenotazione non fa salire `used`.** Il diritto alle sedute conta le
erogate (§3) e la seduta nasce `scheduled`: a muoversi è la parte in programma.
Per la stessa ragione **non muove nessun aggregato aziendale** — le sessioni
consumate si sommano dalla serie di utilizzo, che copre i dodici mesi chiusi.

## 5. Vuoto, errore, attesa

- Il mock risolve immediatamente e **non aggiunge ritardi artificiali**: durante
  una presentazione dal vivo l'attesa è tempo morto da spiegare.
- La cache viene riempita prima del primo paint, e un guardrail in sviluppo
  segnala qualunque query che si monti a cache fredda.
- Le schermate si sospendono su `data === undefined`, **mai su `isFetching`**:
  dopo una mutation il dato precedente è ancora a schermo, ed è il caso che non
  deve far lampeggiare nulla.
- **Un errore è una promise rifiutata**, e il client ne distingue tre casi: in
  attesa (`undefined`), assente ma legittimo (`null` o lista vuota, §2), e
  fallito. Come li *rende* è mestiere del frontend e non entra qui.
- **Il client non ritenta automaticamente.** Un fallimento arriva a schermo così
  com'è, e a ritentare è un gesto dell'utente. Chi reintroduce il tentativo
  automatico il giorno di `http/` deve sapere perché è stato tolto: il retryer di
  react-query **mette in pausa fra un tentativo e l'altro se la scheda non è in
  primo piano**, e una query in pausa ha `data === undefined`, cioè è
  indistinguibile da una in attesa. È un quarto caso che i tre qui sopra non
  ammettono, e con una rete vera — dove i fallimenti sono la norma e non una
  manopola di sviluppo — aspetta chiunque lo riaccenda senza saperlo.

## 6. Cosa è stato lasciato fuori di proposito

**Il numero di iscrizione all'albo professionale.** `Professional` non ha il
campo, e non è una dimenticanza: nel dataset demo un identificatore di formato
plausibile attaccato a una persona inventata potrebbe collidere con l'iscrizione
di un professionista vero, e a differenza di un nome nessuno se ne accorge
leggendo (`CLAUDE.md` §8). **In produzione quel numero esiste e va aggiunto qui**:
la qualifica e lo stato dei documenti sono ciò che la piattaforma mostra, il
numero è ciò che verifica.

**Le forme dei campi degli schemi base44.** I dodici `base44/entities/*.jsonc` del
progetto originale sono stati usati come lista di controllo della copertura del
dominio, non come vincolo di forma. Il contratto è nostro.

**Il totale sulla fattura.** `Invoice` porta organico e prezzo unitario, non il
totale: sono due numeri che dicono la stessa cosa e non devono poter divergere
(§5.5). **In produzione il totale diventerà un campo** il giorno in cui una
fattura avrà rettifiche, crediti o un prezzo cambiato a metà mese — cioè quando
smetterà di essere una moltiplicazione.

**L'autenticazione resta fuori. La sessione è entrata** (12.08.2026, blocco d)
di M5).

~~Questa voce diceva: *"L'autenticazione, i ruoli e le guardie di rotta sono M5
e non sono in questa interfaccia. `UserRole` esiste nei tipi perché il
back-office ne ha bisogno come dato, non come meccanismo di accesso."*~~

**Perché è cambiata.** Quella riga era esatta finché le guardie non esistevano,
e restava in piedi su un presupposto che il blocco d) ha dovuto affrontare: che
il ruolo potesse restare fuori dal contratto. Non poteva. Una guardia deve
leggere il ruolo da qualche parte, e le due possibilità erano un context di
React o il provider. Con un context, il giorno in cui il ruolo arriva dal server
il codice che lo legge va spostato — cioè **la riscrittura che il §1 di questo
documento esiste per escludere**. Con il provider, quel giorno cambia soltanto
chi risponde.

**Cosa c'è adesso.** `Session` porta un solo campo, `role: UserRole | null`, e
`null` è lo stato di chi sta sull'area pubblica — un vuoto legittimo come tutti
gli altri (§2). Due metodi:

- **`getSession()`** non prende parametri, **come `getCompany()` e
  `getEmployeeProfile()`**, e per la stessa ragione dichiarata nel §7: la
  persona arriva dalla sessione, non da un argomento. In produzione risponde
  l'autenticazione e la firma non cambia;
- **`enterAs(role)`** è la scrittura che in demo sostituisce il login, ed è la
  parte che **in produzione sparisce o diventa il login vero**. Non è un
  mascheramento: senza un backend non esiste un'autenticazione da simulare
  onestamente (`CLAUDE.md` §2.5), quindi a concedere il ruolo è l'ingresso nel
  portale.

**`UserRole` ha due mestieri, e sono lo stesso.** Era il dato che il
back-office mostra accanto a un utente; ora è anche ciò con cui le guardie
decidono. Non sono stati separati in due tipi perché il ruolo di una persona
non cambia natura a seconda di chi lo guarda, e due enumerazioni da tenere
allineate a mano sono il difetto che il §5.5 vieta ai numeri.

**Cosa il backend deve sapere, e non si vede dai tipi.** Nella demo la guardia
è **una porta che concede**: entrare in un portale assegna il ruolo che quel
portale richiede, perché il giro della presentazione entra in ognuno con un
clic e `/admin` si apre come prima schermata (`docs/PITCH.md`). **In produzione
questa è la prima assunzione che salta**, e deve saltare: a concedere sarà
l'autenticazione, `enterAs` non avrà più un chiamante, e il ramo che nega — che
in demo si raggiunge solo con una manopola di sviluppo — diventerà il caso
normale. Il controllo nella guardia è già quello definitivo: ruolo della
sessione contro ruolo della rotta.

**Cosa resta fuori davvero**: le credenziali, la loro verifica, la durata e il
rinnovo della sessione, i permessi più fini del ruolo. Il contratto non li
nomina, e non è un rimando a una milestone — è il confine fra questo documento
e il servizio di autenticazione che lo servirà.

**Il periodo sui metodi di lettura.** `getProfessionalSessions` restituisce tutte
le sedute di un professionista, e le schermate filtrano in memoria: il dataset
demo è piccolo, e una lista sola è ciò che tiene insieme calendario, KPI e totale
del mese senza che possano divergere.

**In produzione questo metodo prenderà un intervallo**, perché un'agenda vera non
entra in una risposta. L'implementazione HTTP dovrà accettarlo e probabilmente
paginare, e il client dovrà smettere di filtrare in memoria — il che ricade sul
calendario e sul riepilogo compensi, che oggi condividono una fetch sola. Il
parametro non è nell'interfaccia oggi: dichiararlo senza chiamanti non lo
renderebbe più vero, e sarebbe un'opzione che nessuno passa (§11).

## 7. Semplificazioni del dataset demo, non del contratto

Dichiarate perché in produzione **saltano**, ed è bene che saltino rumorosamente
invece di restare assunzioni implicite:

- **Tutti i pazienti di un professionista appartengono alla stessa azienda
  cliente.** In produzione una professionista serve più aziende. Il tipo non
  cambia in nessuno dei due scenari — riceve le iniziali e non vede mai un dato
  aziendale — quindi l'unica cosa che incorpora l'assunzione è un guardrail di
  sviluppo, che è il primo a rompersi quel giorno.
- **L'elenco dipendenti è un estratto di otto righe su 120.** Un elenco vero si
  pagina e si cerca, ed è M5. La schermata lo dichiara invece di far credere che
  l'azienda abbia otto persone, e l'intestazione conta l'azienda e non la
  tabella: in produzione `getEmployeeDirectory` prenderà una pagina e un filtro.
- **Un solo cliente, una sola azienda.** `getCompany()` non prende un
  identificatore: la demo ha Demo SA e basta. In produzione l'azienda viene dalla
  sessione, non da un parametro — ed è una modifica al provider, non alle
  schermate.
- **Il tempo ha una sola sorgente.** `getReferenceDate()` restituisce la data in
  cui la demo è ambientata. In produzione restituisce oggi, e sparisce dal
  contratto insieme al §1.1 di `CLAUDE.md`.
- **Il check rapido non alimenta gli aggregati.** `submitRapidCheck` salva la
  risposta e la rilegge, e basta: le dodici curve della dashboard sono la storia
  curata del §8, e un tocco fatto davanti a un investitore non deve poterla
  muovere. **In produzione è esattamente il contrario** — quella scrittura è
  ciò che alimenta le serie di `DepartmentMonth`, e questa è la semplificazione
  che salta per prima il giorno del passaggio.
- **Il coach non ha un'agenda dietro.** Il contatore delle sedute di coaching è
  un valore dichiarato del dataset, non un conto sulle sedute erogate come
  quello dello psicologo: il portale professionista della demo è quello di una
  psicologa, e il coach non ne ha uno. Il contratto non se ne accorge —
  `getEntitlement("coach")` ha la stessa forma — ma chi costruisce il backend
  deve saperlo, perché lì `used` si conterà da un'agenda vera.
- **Un solo portale professionista.** L'agenda che il back-office elenca è
  quella della Dr.ssa Meier, e la schermata lo dichiara nel sottotitolo. In
  produzione `getProfessionalSessions` prende un intervallo e una pagina, e il
  back-office ne aggrega molte.
- **I professionisti non hanno un nome proprio**, e per questo
  `Professional.firstName` è nullable. Il `CLAUDE.md` §8 fissa del corpo
  professionale il solo cognome, e la prova di sicurezza dei nomi è "cognome +
  professione + cantone": un nome completo alza l'identificabilità, quindi
  inventarne cinque vorrebbe dire rifare quella verifica e passare da una
  decisione dei founder. Il mock non può riempirlo onestamente, e un campo che il
  dataset lascia sempre vuoto è meglio dichiararlo che riempirlo male. **In
  produzione il nome esiste sempre**, e il backend potrà stringere il campo a
  obbligatorio: il contratto documenta perché qui è nullable, non che debba
  restarlo.
- **I totali di carriera dei professionisti sono dichiarati, non derivati.**
  `Professional.totalSessions` è un valore del dataset, ed è ciò che sostiene la
  KPI "sedute erogate" del back-office. Un guardrail impedisce l'unica
  contraddizione visibile — il totale della Dr.ssa Meier non può essere minore
  delle sedute erogate della sua agenda — ma gli altri quattro non hanno
  un'agenda dietro cui rispondere, quindi la loro somma è una cifra dichiarata
  come i conteggi di §8. **Ratificati dai founder il 10.08.2026** e trascritti in
  `CLAUDE.md` §8, dove le cifre ammesse vivono (§2.4): restano dichiarati, e chi
  legge questo documento non deve prenderli per derivati. In produzione il totale
  si conta dalle sedute, come tutto il resto.
- **Le sessioni degli altri clienti sono la curva di Demo SA scalata.** È il
  modo in cui il dataset demo tiene Demo SA *dentro* i totali di piattaforma
  invece che accanto, e in produzione salta per intero: ogni cliente avrà le
  sue sedute. Ciò che resta vero è la forma — una serie mensile per la
  piattaforma, derivata e non salvata.
- **Un solo alert precoce alla volta, e la scansione si ferma al primo.**
  `EarlyAlert` è un valore singolo e `getEarlyAlert` restituisce `EarlyAlert |
  null`, mentre `computeEarlyAlert` esce **al primo reparto** che ha una
  risalita in corso, nell'ordine in cui i reparti sono dichiarati. Con due
  reparti in allerta simultanea il secondo sparirebbe **in silenzio**: nessun
  guardrail se ne accorgerebbe, perché il dato non è contraddittorio — è solo
  incompleto, ed è il tipo di difetto che a schermo si vede meno.

  Nel dataset demo il caso non si presenta per costruzione: il §8 descrive un
  alert solo, sulle Vendite al decimo mese, e tre guardrail lo fissano. **In
  produzione l'assunzione salta subito** — due reparti sotto pressione nello
  stesso trimestre è il caso normale, non l'eccezione — quindi il contratto
  dovrà restituire una **lista** e la dashboard dovrà decidere come mostrarne
  più di uno. È il motivo per cui la voce sta qui e non fra i difetti: oggi il
  tipo è onesto rispetto ai dati che ha, domani non lo sarebbe più.

- **Un solo dipendente.** `getEmployeeProfile`, `getEntitlement`,
  `getAppointments`, `getCheckupEligibility` e le altre letture del percorso non
  prendono un identificatore: la demo ha Laura Bernasconi e basta. In produzione
  la persona viene dalla sessione, come l'azienda.
