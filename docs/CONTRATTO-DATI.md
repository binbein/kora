# KORA — il contratto dati

Questo documento è l'output di M2 (`CLAUDE.md` §3, §5.7) ed è **la specifica con
cui nasce il repository del backend**. Descrive l'interfaccia che le schermate
consumano già oggi, gli invarianti che l'implementazione vera dovrà rispettare, e
ciò che è stato lasciato fuori di proposito.

Non descrive il dataset della demo. I valori che il frontend mostra oggi sono
finzione costruita ad arte (`CLAUDE.md` §8 e §9): servono a raccontare una storia
in trenta minuti, non a vincolare l'API. Dove una scelta del dataset ha
conseguenze sul contratto, è detto esplicitamente.

**Come si leggono i rimandi**, perché qui se ne incrociano di due documenti:
`§N` da solo è **una sezione di questo documento**, che ne ha otto e nessuna
sottosezione numerata; i rimandi a `CLAUDE.md` portano **sempre il nome del
file**.

La regola era applicata a metà e si scioglieva per esclusione, perché i numeri
alti non potevano che essere della costituzione. **Il §8 di questo documento
l'ha resa viva**, e c'è una ragione che vale più di quella: questo file **nasce
nel repository del backend** (`CLAUDE.md` §3, §5.7), dove `CLAUDE.md` potrebbe
non esserci — lì un `§11` non si risolve per esclusione né in nessun altro modo.

## 1. La forma

```
src/lib/data/
  types.ts     ← le entità: coprono tutto il §10 di `CLAUDE.md`
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

**I casi annotati erano due e le violazioni erano tre**, e la riga qui sopra è
stata falsa dal giorno in cui è stata scritta: `DemoRequest.employeeCount` era
obbligatorio e usava **lo zero come sentinella**, cioè diceva l'assenza con un
valore invece che con `null`. Il back-office lo ridecodificava in "—", quindi
un'azienda che avesse davvero dichiarato zero dipendenti sarebbe stata
indistinguibile da una che non aveva risposto.

È allineato dal 14.08.2026 — `?` sull'input, `number | null` in lettura, `?? null`
una volta sola al confine, come `phone` e `message` — e **da lì "il codice la
rispetta per intero" ha smesso di essere un'affermazione ottimista**. Resta
scritto perché il caso è istruttivo: una sentinella non viola la regola in modo
visibile come un `undefined`, quindi passa una rilettura che cerchi la forma
sbagliata invece del significato sbagliato.

**La superficie del provider cresce così**: *le letture si espongono quando il
dato esiste, le scritture solo quando hanno un chiamante.* Le due metà non sono
simmetriche di proposito. Una lettura senza consumatore costa un metodo che
restituisce dati già costruiti; una scrittura senza consumatore costringe a
indovinare la superficie di invalidazione, che è la parte del contratto in cui
sbagliare costa di più — è il motivo per cui in M2 arrivò `saveSessionNote` e non
`bookAppointment`, che è nato in M3 con il suo chiamante e con la sua riga nella
tabella del §4.

Questa regola sostituisce quella più stretta con cui M2 era partita ("un metodo
nasce con un chiamante"): con quella, tutto il dataset di `CLAUDE.md` §8 e §9 sarebbe rimasto
irraggiungibile e questo documento non avrebbe descritto niente. **Va letta prima
di applicare il §11 di `CLAUDE.md` a `provider.ts`**: i metodi senza chiamante che ci trovate non
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
  tre i piani hanno una dashboard HR — il §9 di `CLAUDE.md` la trascrive per
  ognuno — quindi non
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

**Un reparto senza record mensili esce dall'elenco, e va deciso se è giusto.**
`getLatestStressByDepartment` promette l'ultimo record di ogni reparto, e senza
record non c'è un ultimo record: fabbricarne uno soppresso dichiarerebbe un dato
che il provider non ha, ed è la ragione per cui oggi quel reparto **non compare**.

In produzione la conseguenza è concreta e va guardata prima di ereditarla: un
reparto **appena creato** — nessuno ha ancora risposto al check rapido — sparisce
dalla tabella dell'HR **senza lasciare traccia**, e chi guarda non sa che esiste.
È diverso dal reparto sotto soglia, che compare con il trattino e il lucchetto:
lì l'assenza del punteggio è un'informazione, qui l'assenza della riga non lo è.

Le due strade sono distinguere i due casi nel tipo — un terzo ramo di
`StressRecord` che dice *"reparto senza rilevazioni"*, con i misurati a zero — o
lasciare che l'elenco dei reparti e le loro rilevazioni siano due letture
separate, e che a comporle sia la schermata. **La scelta è del backend**, e
questo documento la nomina invece di lasciarla scoprire alla prima azienda che
crea un reparto a metà trimestre.

`EarlyAlert` è **derivato dalla scansione delle serie**, non un record salvato: un
alert memorizzato smette di corrispondere ai punteggi da cui è nato. Segnala solo
una risalita ancora in corso all'ultimo rilevamento.

**È un valore singolo, e in produzione dovrà essere una lista**: la ragione, e
perché oggi il tipo è onesto rispetto ai dati che ha, stanno fra le
semplificazioni del §7. Il rimando è qui perché chi legge le entità decide la
forma leggendo questo paragrafo, non tre sezioni più in là.

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

**`hasNote` è `la nota esiste`**, non una stima di quando dovrebbe esistere.
Sono lo stesso valore letto in due modi, come `Appointment` e
`ProfessionalSession` sono la stessa seduta: il backend lo deriva dalle note che
ha, e non lo memorizza accanto a loro dove potrebbe smettere di tornare.

**Una nota non precede la sua seduta.** È l'invariante sulla data, e vale in
produzione dove i timestamp sono veri: si scrive dopo, quindi `updatedAt` non
può cadere prima della fine della seduta a cui appartiene.

Nel frontend **non è sorvegliato da nessun guardrail**, e la ragione va detta
qui perché è il posto in cui ci si chiede come mai: nella demo non è violabile.
Le note seminate derivano `updatedAt` dalla fine della propria seduta, quindi un
controllo verificherebbe l'espressione contro sé stessa; e quelle scritte durante
la demo nascono col giorno corrente su sedute già erogate, cioè su un passato.
In produzione nessuna delle due cose è garantita, ed è lì che l'invariante serve.

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
campo che nessuno legge è ciò che il §11 di `CLAUDE.md` vieta.

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
mostrare, cioè il ramo irraggiungibile che il §11 di `CLAUDE.md` vieta.

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
anche il modo in cui in produzione lo si permessiona e lo si traccia.

> **Questa frase è stata falsa fino al 16.08.2026, e adesso è vera.**
> `PlatformUser` portava `healthScore` — il punteggio del profilo salute della
> singola persona — accanto a nome, cognome ed email, e `/admin/utenti` lo
> rendeva in una colonna. Era **l'unica eccezione** a ciò che questo paragrafo
> dichiara per l'intero contratto, e nessun'altra riga la nominava: chi leggeva
> qui non aveva modo di scoprirla.
>
> **Il campo è stato tolto** su decisione dei founder, ed è la forma del
> dominio a garantirlo, non la schermata (`CLAUDE.md` §5.5). Al suo posto:
> `PlatformUser.assessmentCompleted`, che dice **che** l'assessment è stato
> fatto e mai cosa ha detto — la stessa distinzione con cui
> `EmployeeDirectoryEntry` porta lo stato del check-up senza portarne l'esito —
> e `PlatformMonth.averageHealthScore`, il punteggio **aggregato**, che è la
> forma in cui può stare in un'area che vede i nomi: una media non si
> attribuisce a nessuno.
>
> **Per chi scriverà il backend**: `assessmentCompleted` non è il punteggio
> reso booleano, ed esporlo derivandolo da *"esiste un punteggio"* è ciò che
> rimetterebbe il dato individuale sulla stessa riga per un'altra strada. I valori
delle misure sono **stringhe** — "120/80 mmHg", "Ritmo sinusale" — perché sono
letture con la loro unità, non grandezze che il client debba riformattare.

### Compensi

`ProfessionalEarnings` conta **solo le sedute erogate**: quelle in programma non
sono un compenso maturato. Non porta le righe settimanali, per la ragione detta in
§2.

`FullCapacityReference` esiste perché il totale mensile va sempre letto accanto al
regime tenuto. Senza, un totale part-time si legge come il massimo che la
piattaforma può dare a un professionista.

**I tre metodi del professionista descrivono lo stesso insieme di sedute.**
`getProfessionalSessions`, `getProfessionalEarnings` e `getProfessionalPayouts`
sono tre viste dell'agenda di **quell'id**: le sedute, il loro totale in un mese,
e i totali dei mesi precedenti. Ne discende che compensi e pagamenti si contano
dalle sedute che il primo metodo restituirebbe, e che **i tre non possono
contraddirsi** — un professionista con la lista vuota ha un totale a zero, non un
totale di qualcun altro.

È l'invariante che nessuna riga enunciava e nessun guardrail copre, ed è ciò che
tiene onesto anche il regime tenuto (§3, KPI): è una media sulle stesse sedute,
quindi appartiene al professionista di cui parla.

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
| **Consulti di medico virtuale** (`virtualDoctorConsults`) | somma della serie di utilizzo sui **soli mesi del trimestre**, non cumulata. È l'unica riga del report che non si cumula, e la ragione è che quel servizio **non ha un monte annuo**: sul Plus è illimitato (`CLAUDE.md` §9), quindi non c'è niente da consumare e "quanti finora" non è una domanda. Cumulandola darebbe il totale dei dodici mesi su tutti e quattro i trimestri, cioè un numero che non si muove accanto a un selettore che si muove |

**Le due righe qui sopra vanno lette insieme**, perché stanno sulla stessa
schermata e si contraddirebbero senza saperlo: `usagePercent` **si cumula**
perché misura un monte annuo, `virtualDoctorConsults` **no** perché un monte non
ce l'ha. Da qui l'obbligo che il §7 di `CLAUDE.md` impone alle tre accezioni di
"sessioni" e ai check-up di piattaforma: **l'etichetta a schermo dichiara il
periodo** — "nel trimestre" — o due numeri affiancati sembrano coprire la stessa
finestra.

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

`PlatformMonth.averageHealthScore` è arrivato qui il 16.08.2026, ed è la ragione
per cui il punteggio individuale ha potuto lasciare `PlatformUser`: **è
l'aggregato che dice la stessa cosa senza attribuirla a nessuno**. È `null`
quando nessuno ha ancora fatto l'assessment — il vuoto del §2, non uno zero che
si legge come un punteggio pessimo. Sta su questa serie e non su una entità sua
per la regola di questo paragrafo: una seconda entità con la stessa cadenza è
una seconda cosa che può divergere.

**Tutti i campi *sommatori* di `PlatformMonth` contano lo stesso insieme: i
clienti presenti in quel mese _e_ avviati.** Ricavo, dipendenti coperti,
iscritti e sedute rispondono allo stesso predicato, e un contratto firmato e non
partito non entra in nessuno dei quattro — è `ClientCompany.active` applicato una
volta sola.

**`averageHealthScore` non è uno di quei quattro, e la qualifica serve** (data:
16.08.2026, insieme al campo). È una **media**, non una somma: dal predicato
dipende la sua **presenza** — `null` quando l'insieme è vuoto, perché senza
iscritti non c'è nessun assessment — mentre il **valore** non è additivo e non si
ricava sommando i clienti del mese. Sommarlo come gli altri quattro darebbe un
numero senza significato, ed è la ragione per cui questa riga dice ora "campi
sommatori" invece di "tutti i campi".

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
(`CLAUDE.md` §10). E non ha semi — il §8 di `CLAUDE.md` non contiene richieste
demo, quindi l'elenco parte vuoto invece di aprirsi su cinque righe inventate
(`CLAUDE.md` §2.4).

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

**Il criterio, prima dell'elenco, perché le sezioni che dicono "qui non c'è" sono
due.** In questa vivono i **campi e i metodi che il contratto ha deliberatamente
non**, con una ragione che vale anche in produzione: sono decisioni prese, e
rimetterli è un errore finché la ragione tiene. Nel §8 vivono i **pezzi di
prodotto che non esistono ancora** e che l'MVP dovrà costruire: lì l'assenza non
è una decisione, è un lavoro non fatto.

La domanda che smista, per chi aggiunge la prossima voce: *se il backend lo
costruisse domani, staremmo violando una scelta o colmando un vuoto?* Se è una
scelta, sta qui. Se è un vuoto, sta nel §8. Due elenchi senza un criterio
divergono, ed è lo stesso difetto che il §5.6 di `CLAUDE.md` racconta a proposito
di un numero.

**Il caso di confine è l'autenticazione, e resta qui.** Il pezzo di prodotto —
credenziali, durata della sessione, permessi fini — è un vuoto e sarebbe da §8;
ma ciò che questa voce descrive è **la forma che il contratto ha già preso** per
accoglierlo: `Session`, `getSession`, `enterAs`, e cosa di loro sopravvive al
passaggio. Spostarla spezzerebbe quella spiegazione in due, quindi resta intera
qui, e il §8 la nomina senza ripeterla.

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
(`CLAUDE.md` §5.5). **In produzione il totale diventerà un campo** il giorno in cui una
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
allineate a mano sono il difetto che il §5.5 di `CLAUDE.md` vieta ai numeri.

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
renderebbe più vero, e sarebbe un'opzione che nessuno passa (`CLAUDE.md` §11).

## 7. Semplificazioni del dataset demo, non del contratto

Dichiarate perché in produzione **saltano**, ed è bene che saltino rumorosamente
invece di restare assunzioni implicite:

- **Tutti i pazienti di un professionista appartengono alla stessa azienda
  cliente.** In produzione una professionista serve più aziende. Il tipo non
  cambia in nessuno dei due scenari — riceve le iniziali e non vede mai un dato
  aziendale — quindi l'unica cosa che incorpora l'assunzione è un guardrail di
  sviluppo, che è il primo a rompersi quel giorno.
- **L'elenco dipendenti è un estratto di otto righe su 120.** Un elenco vero si
  pagina e si cerca, ed è **lavoro dell'MVP, non della demo** (§8): questa riga
  lo mandava a M5, e nessuno dei sei blocchi di quella milestone lo contiene. La
  schermata lo dichiara invece di far credere che l'azienda abbia otto persone, e
  l'intestazione conta l'azienda e non la tabella: in produzione
  `getEmployeeDirectory` prenderà una pagina e un filtro.
- **Le tre liste di persone si uniscono per iniziali, e nessuna persona compare
  con due ruoli.** L'estratto dell'HR, l'agenda della professionista e gli utenti
  del back-office non condividono un id: le iniziali sono l'unica chiave, quindi
  il dataset è costruito perché chi ha un ruolo diverso da `employee` non compaia
  negli altri due elenchi, e un guardrail lo verifica. **Non è una regola del
  dominio**: una referente HR è una dipendente, può stare nell'elenco della
  propria azienda e può essere in cura. In produzione le liste si uniscono per id
  vero, le iniziali tornano a essere una resa e il vincolo sparisce insieme al
  guardrail che lo sorveglia.
- **Il punteggio medio del profilo salute è costante sulla finestra.**
  `PlatformMonth.averageHealthScore` sta su una serie mensile perché in
  produzione il backend lo calcolerà mese per mese dalle risposte vere, mentre
  nel dataset demo è **un valore dichiarato** — come le sedute di carriera del
  `CLAUDE.md` §8, e per la stessa ragione: dietro non c'è una seconda sorgente
  da cui derivarlo. Il giorno in cui c'è, questa riga sparisce e il campo non si
  tocca.
- **Un solo cliente, una sola azienda.** `getCompany()` non prende un
  identificatore: la demo ha Demo SA e basta. In produzione l'azienda viene dalla
  sessione, non da un parametro — ed è una modifica al provider, non alle
  schermate.
- **Il tempo ha una sola sorgente.** `getReferenceDate()` restituisce la data in
  cui la demo è ambientata. In produzione restituisce oggi, e sparisce dal
  contratto insieme al §1.1 di `CLAUDE.md`.
- **Il check rapido non alimenta gli aggregati.** `submitRapidCheck` salva la
  risposta e la rilegge, e basta: le dodici curve della dashboard sono la storia
  curata del `CLAUDE.md` §8, e un tocco fatto davanti a un investitore non deve
  poterla
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
  come i conteggi di `CLAUDE.md` §8. **Ratificati dai founder il 10.08.2026** e
  trascritti in `CLAUDE.md` §8, dove le cifre ammesse vivono (`CLAUDE.md` §2.4):
  restano dichiarati, e chi
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

  Nel dataset demo il caso non si presenta per costruzione: il §8 di `CLAUDE.md`
  descrive un
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

## 8. Il perimetro dell'MVP

Ciò che il prodotto **non ha ancora** e che l'MVP dovrà costruire. Non è un
elenco di desideri: ogni voce dice perché oggi non c'è, e l'ordine dei gruppi è
quello in cui vanno affrontati — il primo è una condizione per operare, gli
ultimi sono lavoro di prodotto.

La differenza fra questa sezione e il §6 è il criterio scritto in apertura di
quello: lì stanno le esclusioni decise, qui i vuoti da colmare.

### 8.1 Escalation clinica

**È la prima voce perché non è una funzione: è una condizione per avere utenti.**

Non esiste nessun percorso di presa in carico urgente. Il check rapido accetta il
valore peggiore e non succede niente; la chat del medico virtuale non rileva il
rischio; nessuna soglia, su nessun dato, produce una segnalazione a un essere
umano.

**Il numero d'emergenza è esposto in due punti**, e vanno detti con precisione
perché sono l'unico presidio che esiste: il **disclaimer** della chat del medico
virtuale — *"in caso di emergenza chiama il 144"* — e, dal 17.08.2026,
**l'ultima risposta dell'arco** della chat stessa, che dopo aver orientato
aggiunge *"se i sintomi peggiorano all'improvviso, chiami il 144"*. Entrambi in
tutte e quattro le lingue.

**Sono due punti della stessa schermata, e questo è il fatto che conta.** In
particolare il 144 **non è nel check rapido**, che è invece **dove il valore
peggiore si può dichiarare senza parlare con nessuno**: una risposta, un tocco,
nessun interlocutore e nessun numero.

La distinzione decide dove il lavoro va fatto: non è un numero da aggiungere
alla chat, che ora ne ha due, è un percorso che manca al punto di ingresso che
raccoglie il segnale peggiore. *(Fino al 15.08.2026 questa voce diceva che la
chat "non espone nessun numero d'emergenza": era falsa, e faceva sembrare il
vuoto più grande e più semplice di com'è. Fino al 17.08.2026 diceva "un punto
solo", ed è invecchiata con l'arco della chat — che ha aggiunto il secondo senza
spostare il vuoto di un centimetro.)*

Non c'è perché **manca la decisione a monte**: quale protocollo si applica e chi
è il referente clinico che risponde. Sono scelte dei founder e non di chi scrive
il codice, e vanno prese **prima del primo utente attivo** — il giorno in cui una
persona vera risponde "molto male" a una domanda sul proprio stato, la
piattaforma deve già sapere cosa fa.

Finché non è deciso, `docs/PITCH.md` dice la verità: il percorso non c'è e la
demo non lo simula.

### 8.2 Consenso e diritti dell'interessato

**Nessun consenso viene raccolto in nessun punto** del percorso: non
all'attivazione, non prima dell'assessment iniziale, non prima del check rapido,
non prima del check-up. Non esistono l'export dei propri dati né la loro
cancellazione, né come metodo del provider né come schermata.

E c'è una domanda che sta **a monte** e che oggi non ha risposta: **chi è
titolare e chi responsabile del trattamento** dei dati clinici — la piattaforma,
l'azienda cliente, il professionista — e **come si concilia il segreto
professionale con la conservazione della nota di sessione** sui nostri server.

La risposta cambia l'architettura, non l'interfaccia: decide dove la nota può
stare, per quanto, chi può esportarla e cosa succede quando il professionista
lascia la rete. Va quindi presa **prima** del codice che la implementa, ed è per
questo che sta qui e non fra le cose da fare in fondo.

La garanzia del §3 — la nota che non esce mai verso l'azienda, e a impedirlo è la
forma del dominio — non è una risposta a questa domanda: dice dove il dato **non**
va, non chi ne risponde.

**I documenti che dichiareranno tutto questo non sono in questo contratto.**
Privacy policy, termini e cookie policy sono pagine di testo senza superficie di
backend, e il loro perimetro sta in `docs/PROGRESS.md` insieme all'inventario
delle promesse che le schermate fanno già oggi. La distinzione serve a chi
implementa: **questa sezione è il meccanismo, quelle pagine lo dichiarano** — e
pubblicare la dichiarazione senza il meccanismo è ciò che il prodotto sta già
facendo in tre punti, registrati fra le decisioni in sospeso di quel file.

### 8.3 Ciclo di vita dell'azienda e del dipendente

Il dataset demo nasce già popolato, quindi nessuno di questi passaggi esiste:

- **Onboarding dell'azienda**: creare un cliente, dichiararne l'organico, i
  reparti e la soglia di anonimato. Oggi sono semi del dataset.
- **Invito e attivazione dei dipendenti**: la differenza fra coperto e iscritto
  è già nel contratto (§3, piattaforma) e il passaggio dall'uno all'altro no.
- **Il link anonimo del check rapido**: `CLAUDE.md` §8 lo descrive e le schermate
  lo promettono, ma **non esiste come oggetto** — non c'è un token, una scadenza,
  un reparto da cui derivarlo. È la metà del modello di misurazione che rende il
  dato indipendente dall'adozione, quindi non è un dettaglio.
- **Offboarding**: cosa succede ai dati di chi lascia l'azienda, e cosa
  all'azienda che disdice.
- **Cambio piano, rinnovo del cap, disdetta**: il cap è annuale (§3) e nessun
  metodo dice quando l'anno ricomincia; cambiare piano a metà anno cambia il
  tetto e il prezzo della seduta extra.
- **La fatturazione oltre la lettura**: `Invoice` si legge e basta. Mancano il
  documento, i dati fiscali, lo stato di pagamento e la QR-fattura, che in
  Svizzera è il modo in cui una fattura si paga.
- **Cosa il dipendente può modificare del proprio profilo.** Oggi **nessuna
  scrittura** tocca `EmployeeProfile`: la pagina lo mostra e basta. Non è una
  svista da colmare con un pulsante "modifica", perché la domanda vera sta a
  monte — **chi crea l'account e chi lo attiva** decide quali campi arrivano
  dall'azienda e quali dalla persona, e i due insiemi hanno regole opposte: il
  reparto governa un aggregato che l'HR legge (§3), quindi non può essere un
  campo che l'interessato cambia da sé; l'email è la chiave dell'invito. Restano
  fuori anche i due casi che si presentano per primi in un'azienda vera: **chi
  cambia reparto** — e allora la sua storia di misurazioni resta dov'era o lo
  segue — e **chi lascia l'azienda**, che è l'offboarding due righe più su.
- **"Pianifica review".** Era un pulsante della pagina report che non faceva
  niente, tolto il 07.08.2026 come vicolo cieco (`docs/PROGRESS.md`). Farlo
  davvero **non è una schermata**: una review è un incontro con il cliente, e
  fissarlo è un'integrazione con un calendario di terzi — disponibilità di chi
  la tiene, invito che esce dalla piattaforma, disdetta governata da fuori. È la
  stessa forma del §8.6, e la stessa ragione per cui quel gruppo esiste. Il
  contratto commerciale la prevede già in due punti — il report trimestrale del
  Plus e la call mensile col team clinico dell'Executive (`CLAUDE.md` §9) —
  quindi la cadenza dipende dal piano, e non è un campo che si aggiunge a
  `Company`.

### 8.4 Il co-payment non ha dove essere registrato, e non è deciso chi lo paga

**È l'unico ricavo variabile del modello, e non ha nessuna rappresentazione
contabile.** Il prezzo esiste come dato — `Plan.extraSessionPrice`, riportato su
`SessionEntitlement` — e si **annuncia** in due schermate: la prenotazione lo
dichiara prima di confermare, l'elenco pazienti del professionista lo mostra sui
due pazienti sopra il cap. Ma superato il tetto la conferma **prenota e basta**:
nessun addebito, nessuna riga, nessun documento. `Invoice` porta organico,
prezzo unitario e stato, e non ha altre voci.

Il gruppo qui sopra dichiara mancante la **forma** della fattura. Questo è un
buco diverso e più a monte: **manca l'oggetto da fatturare**, non il documento
che lo conterrebbe. Nessuna entità registra che una seduta è stata erogata oltre
il cap, a che prezzo, e a chi è stata addebitata.

**La decisione a monte non è stata presa da nessuna parte: chi paga.** Le due
strade non sono varianti di implementazione e producono contratti diversi:

- **addebito al dipendente** — serve un mezzo di pagamento sulla persona, quindi
  un rapporto commerciale diretto fra la piattaforma e chi non è il cliente
  pagante, con tutto ciò che ne segue (incasso, rimborso, insoluto, e un
  dipendente che può rifiutarsi di pagare una seduta già erogata);
- **riaddebito all'azienda** — la seduta extra diventa una riga della fattura
  mensile, e allora l'azienda **sa che quella persona ha superato il cap**. È il
  punto in cui una scelta contabile tocca la garanzia di privacy del §3: una
  riga aggregata "sedute oltre cap: 4 × CHF 28" non nomina nessuno, una riga per
  seduta sì, e il confine fra le due è una decisione, non un dettaglio di
  rendering.

**Non è teoria: `docs/PITCH.md` ci costruisce sopra due risposte intere** — il
co-payment come deterrente che tiene il consumo dentro il cap, e il confronto con
i CHF 120–150 del mercato privato (`CLAUDE.md` §9). Sono argomenti che reggono, e
descrivono un meccanismo che **il prodotto oggi non ha**: chi supera il cap
prenota e non paga niente.

Ne discende anche un vincolo sul metodo di scrittura del §4: `bookAppointment`
oggi restituisce un `Appointment` e nient'altro. Se l'addebito nasce alla
prenotazione, quella firma deve poter dire **che cosa è stato addebitato**; se
nasce alla dichiarazione di erogazione (§8.5 qui sotto), l'oggetto contabile
nasce lì, e le due scelte non sono intercambiabili — la prima addebita una seduta
che potrebbe non avvenire.

### 8.5 Ciclo dell'appuntamento

**Prima degli stati manca l'attore: nessuno dichiara che una seduta è
avvenuta.** Le scritture del dominio sono tutte inserimenti — `bookAppointment`,
`submitRapidCheck`, `submitDemoRequest`, più `saveSessionNote`, che è l'unico
upsert — e **nessun metodo porta una seduta da `scheduled` a `completed`**. Nel
mock a farlo è l'orologio: lo stato si deriva da `start < DEMO_TODAY`, in un punto
solo (`mock/professional-portal.ts`).

In produzione quella condizione diventa un **evento dichiarativo**, e quell'atto
decide insieme tre grandezze che oggi non possono divergere:

| | dove si legge | cosa decide |
|---|---|---|
| **il compenso maturato** del professionista | `ProfessionalEarnings`, `ProfessionalPayout` | quanto la piattaforma deve pagare |
| **il consumo del cap** del dipendente | `SessionEntitlement.used` | quando scatta il co-payment |
| **l'utilizzo che l'HR vede** | `ServiceUsageMonth`, e la KPI "142 su 1'200" | il numeratore su cui poggia il ROI |

**Sono rigorosamente coerenti per una ragione fragile: derivano tutte e tre dalla
stessa condizione sull'orologio.** Tre filtri distinti su
`status === "completed"`, e una sola sorgente dietro. Il giorno in cui la
condizione diventa un evento — qualcuno preme un pulsante, o non lo preme —
**possono divergere per la prima volta**, ed è esattamente il tipo di divergenza
che il §5.5 di `CLAUDE.md` esiste per prevenire: due numeri che descrivono lo
stesso fatto e smettono di essere lo stesso numero.

Le domande da chiudere, tutte e tre di prodotto prima che di implementazione:

- **chi dichiara.** Il professionista, il dipendente, entrambi, o un default
  temporale che qualcuno può contestare. Se dichiara solo chi viene pagato,
  l'atto ha un conflitto d'interesse incorporato; se servono entrambi, una seduta
  resta sospesa quando uno dei due non risponde;
- **entro quale finestra.** Un compenso che matura senza scadenza non si chiude
  mai, e il riepilogo mensile del portale professionista — che si consolida al
  quinto del mese dopo (§3, compensi) — ha bisogno di sapere quando il mese è
  definitivo;
- **cosa succede se i due lati non concordano.** È il caso che genera la mancata
  presentazione qui sotto, e non è lo stesso problema: lì manca uno **stato**, qui
  manca **chi lo scrive**.

Finché l'atto non esiste, la mancata presentazione non è rappresentabile nemmeno
aggiungendo il valore all'enumerazione: uno stato che nessuno può dichiarare non
è uno stato.

`ProfessionalSession.status` ha tre valori — in programma, erogata, annullata — e
il ciclo vero ne ha di più:

- **La mancata presentazione non esiste**, ed è lo stato che decide **chi paga**:
  una seduta che il paziente non onora è un compenso maturato per il
  professionista e non è una seduta erogata per il cap. Senza quello stato, i due
  numeri che il §3 tiene separati tornano a coincidere.
- **Disdetta e riprogrammazione da entrambi i lati**, con la **policy di
  preavviso** che decide se la disdetta è gratuita. Oggi `cancellationReasonKey`
  dice chi ha annullato e nient'altro.
- **La lista d'attesa**, che è la risposta alla promessa del Business Plan sul
  primo appuntamento entro 24 ore quando gli slot finiscono.
- **La pubblicazione della disponibilità**: gli slot sono un dato del dataset, e
  nessun metodo permette a una professionista di dichiarare quando lavora.

#### Cosa vuol dire "occupato", per chi scriverà il backend

Il §4 dice già che `bookAppointment` **deve poter rifiutare** uno slot occupato.
Non diceva cosa sia occupato, e la definizione va scritta qui perché è l'unico
punto in cui questo documento parla al backend: nel frontend la regola vive in un
posto solo — `lib/dates.ts`, che **sopravvive alla cancellazione di `mock/`** — ma
il backend non eredita quel file.

**Due sedute non si sovrappongono se condividono uno dei due lati:**

- **lo stesso professionista**, che non può tenerne due insieme;
- **lo stesso paziente**, che non può farne due insieme **nemmeno con
  professionisti diversi** — ed è la metà che si dimentica, perché ogni agenda
  guardata da sola è coerente.

**Si confrontano intervalli, non istanti d'inizio**, e **gli estremi sono
esclusi**: una seduta che finisce alle 17:30 e una che comincia alle 17:30 si
**toccano**, non si sovrappongono, e devono restare entrambe prenotabili. Con
`[inizio, fine)` la condizione è
`a.inizio < b.fine && b.inizio < a.fine`.

**Le annullate non occupano la loro fascia**: da quando una seduta è annullata,
quell'ora torna prenotabile da chiunque — altrimenti l'annullamento non
libererebbe niente, che è il solo motivo per cui esiste.

**Vale in tre punti e non in uno**, e in produzione sono tre superfici diverse:
ciò che l'elenco degli slot liberi non propone, ciò che la prenotazione rifiuta,
e ciò che i dati non possono contenere. Nel frontend il terzo è un guardrail di
sviluppo; nel backend è un vincolo di integrità, ed è il solo dei tre che regga
due prenotazioni simultanee.

### 8.6 La prenotazione del check-up non esiste

**Il gruppo qui sopra descrive il ciclo delle sedute, e niente di quello vale
qui.** Una seduta si prenota su un'agenda che la piattaforma governa; un check-up
si prenota presso una **struttura convenzionata**, cioè un terzo soggetto
contrattuale con il proprio calendario, i propri orari e i propri referti. Sono
due flussi diversi, e il secondo non esiste affatto.

**Cosa manca, alla lettera**: non c'è nessun `bookCheckup` nell'interfaccia; il
pulsante di ogni struttura è **disabilitato in ogni caso**, e dice perché
(`pages/employee/Checkup.tsx`); e `CheckupBooking` è **un tipo che nessun metodo
crea** — vive solo come valore di `CheckupEligibility.lastCompleted`, cioè
descrive un check-up già fatto e mai uno che qualcuno stia prenotando.

**Non è un dettaglio dell'offerta: è una delle cinque voci del piano Plus**
(`CLAUDE.md` §9), e a schermo si presenta come un elenco di cliniche con un
pulsante spento. Il perimetro da costruire è quello di un'integrazione, non di
una schermata: disponibilità di terzi, conferma che può arrivare in differita,
disdetta governata da chi non siamo noi, e il referto che torna dentro
`CheckupReport` — che il §3 dichiara **l'unico dato sanitario individuale del
dominio**, quindi il canale su cui arriva è una scelta di trattamento prima che
di trasporto.

**Due conseguenze sono già visibili nei tipi**, e vanno lette prima di
implementare:

- **`CheckupEligibility.lastCompleted` promette più di quanto dichiari.** Il
  nome e la glossa dicono *l'ultimo check-up eseguito*, ma il campo è un
  `CheckupBooking` e `CheckupBooking.status` è un `AppointmentStatus` intero —
  quindi il tipo ammette anche `scheduled` e `cancelled`. Oggi il dataset
  contiene un solo valore, `completed`, e la contraddizione non si vede; **i
  consumatori si comportano già in due modi diversi**, il che è il sintomo che la
  promessa vive nel nome e non nel tipo. In produzione o il campo si restringe —
  un `CompletedCheckup` che non può essere altro — oppure cambia nome e
  dichiara di essere *l'ultima prenotazione*, e allora chi legge deve filtrare.
  Le due strade non si equivalgono: la prima rende impossibile lo sbaglio, la
  seconda lo lascia a ogni chiamante.
- **`EmployeeDirectoryEntry.checkupStatus` ha un valore che l'altro lato non sa
  produrre.** L'elenco dell'HR ammette `"booked"`, ma **nel percorso del
  dipendente non c'è nessun modo di arrivarci**, perché la prenotazione non
  esiste: il valore è raggiungibile solo come seme del dataset. È il segno che
  l'HR era stata progettata su un flusso che il portale non ha, e il giorno in
  cui `bookCheckup` esiste i due lati vanno riletti insieme — la stessa
  disciplina con cui il §3 tiene `Appointment` e `ProfessionalSession` come due
  proiezioni di un record solo.

**Della struttura non si sa né cosa offre né quanto lavora**, e le due cose
arrivano dalla stessa integrazione. Il back-office aveva due colonne — i
pacchetti di una clinica e le sue prenotazioni — **tolte il 09.08.2026** perché
nessuna delle due esiste nei dati approvati: `CLAUDE.md` §8 dà alla rete cinque
nomi, cinque indirizzi e uno stato di convenzionamento, e **non un listino per
struttura né una ripartizione delle prenotazioni fra le cliniche**. Erano numeri
che si potevano solo inventare, quindi sono uscite.

In produzione esistono entrambe, e non sono un dato che scriviamo noi:

- **cosa offre una struttura** è il suo catalogo, e decide una cosa che oggi il
  prodotto dà per scontata — che il check-up del Plus e quello **executive**
  (`CLAUDE.md` §9) siano erogabili ovunque. Non lo sono: un'eco addome e un ECG
  non li fa ogni poliambulatorio, quindi il catalogo è ciò che rende
  **prenotabile** una coppia struttura-piano, non un'etichetta descrittiva;
- **quante prenotazioni ha** è un conteggio, e in produzione si **deriva** dalle
  prenotazioni vere (§5.5 di `CLAUDE.md`) invece di essere una colonna. Oggi la
  KPI di piattaforma esiste e dichiara il proprio perimetro — *"di piattaforma,
  sui dodici mesi"* — mentre la ripartizione per struttura no: è quella che
  manca, ed è il dato con cui si capisce se una convenzione serve a qualcuno.

### 8.7 Autorizzazione e multi-tenant

**`UserRole` è un'enumerazione piatta**: dice *hr*, non *HR di quale azienda*.
Nessun metodo prende un identificatore di azienda — `getCompany()` non ne prende
uno (§7) — e **nessun metodo consulta la sessione** per decidere cosa può
rispondere.

In produzione **l'autorizzazione sta interamente lato server**: ogni lettura
deriva il suo perimetro dalla sessione, e due HR di due aziende diverse chiamano
lo stesso metodo ottenendo due risposte. La guardia di rotta del frontend
(`CLAUDE.md` §4, blocco d di M5) **non è una difesa**: decide cosa disegnare, non
cosa si può leggere, e chiunque può chiamare l'API senza passare da lei.

La forma che il contratto ha già preso per accogliere tutto questo — `Session`,
`getSession`, `enterAs` — sta nel §6, con la ragione per cui ci sta.

### 8.8 Realtà del personale

Il dataset descrive un'azienda semplice, e la semplicità è entrata nei tipi:

- **Una sola sede per azienda, e nessuna sede sul reparto.** Un'azienda svizzera
  con sedi in più cantoni è il caso che rende utili le quattro lingue.
- **Nessuna lingua sul profilo del dipendente**, mentre il professionista ha le
  sue. Chi prenota non può quindi cercare chi parla la sua lingua, che è il primo
  filtro vero. *(Fino al 16.08.2026 questa riga aggiungeva che «`getProfessionals`
  espone già un filtro che nessuno chiama»: quel parametro **è stato tolto**, e la
  ragione è la stessa che rende vero il resto della frase — un filtro per lingua
  non è costruibile da un lato che la lingua non ce l'ha. La chiave di cache di
  quella lettura è costante, quindi il primo chiamante che avesse passato un
  filtro avrebbe letto la risposta di un'altra domanda: il giorno in cui il filtro
  serve, torna **insieme alla sua chiave**.)*
- **Email obbligatoria**, quindi nessun canale per chi non ha una casella
  aziendale — in un'azienda di produzione è una parte grossa dell'organico, ed è
  la stessa popolazione che il link anonimo del check rapido dovrebbe raggiungere.
- **I familiari sono a listino e non esistono nel dominio**: il Plus ha
  l'estensione partner e l'Executive li include (`CLAUDE.md` §9), e nessuna
  entità li rappresenta — quindi non hanno un profilo, un diritto alle sedute né
  un appuntamento.
- **L'organico è un intero.** Niente FTE, part-time, stagionali né pro-rata: il
  prezzo è per dipendente al mese, e su un organico che cambia a metà mese la
  fattura di oggi non saprebbe cosa dire.
- **Due persone possono chiamarsi allo stesso modo, e l'interfaccia deve saperle
  distinguere.** Il §7 dichiara già la metà che riguarda i dati: in produzione le
  liste si uniscono per **id vero** e non per iniziali, quindi il vincolo del
  dataset demo — nessuna coppia di iniziali ripetuta, sorvegliato da un guardrail
  — cade insieme al guardrail. **Manca la seconda metà, ed è quella che si
  vede.** Le schermate che mostrano una persona senza mostrarne il nome ne
  mostrano **le iniziali**: l'elenco dipendenti dell'HR, i pazienti e le sessioni
  del professionista, le sessioni del back-office. Con due `M.B.` nella stessa
  azienda quelle righe diventano ambigue a chi guarda, e l'ambiguità **non è
  risolvibile aggiungendo un identificatore**: un id accanto alle iniziali è un
  pseudonimo stabile, cioè esattamente ciò che l'anonimato di quelle schermate
  esiste per non dare. La scelta è di prodotto — un discriminante che non
  identifica, l'ordinamento come unica chiave di riga, o l'ammissione che due
  righe possano leggersi uguali — e va presa prima che il primo cliente vero
  abbia due omonimi, il che su 420 dipendenti è il primo giorno.

### 8.9 L'avanzamento del piano di prevenzione non ha una sorgente

**`AiPlanArea.progressPercent` è l'unico numero del dominio che non misura
niente.** Le cinque aree del piano lo portano come valore dichiarato del dataset
(`mock/ai-plan.ts`), e l'unico guardrail che lo riguarda ne verifica il **range
0–100** — cioè che sia una percentuale, non che sia *quella* percentuale. È il
solo controllo scrivibile: non esiste una seconda sorgente contro cui
confrontarlo, e un guardrail che non può che verificare la forma è il segno che
dietro non c'è un fatto.

**Nessuna entità registra il comportamento che quella barra misurerebbe.** Il
check rapido è un umore auto-riportato senza cadenza (§3), il check-up è annuale
e restituisce misure cliniche, e **non esiste nessun tracciamento di abitudini** —
sonno, attività, alimentazione — né come entità né come scrittura. Le cinque aree
del profilo salute nascono dall'assessment iniziale, che è una fotografia e non
una serie.

**In produzione le strade sono due, e la scelta è di prodotto.** O la barra
sparisce e la card resta quello che il resto già è — un obiettivo e tre
suggerimenti per area, che non hanno bisogno di una percentuale per essere utili
— **oppure va costruito ciò che la alimenta**, e allora nasce un pezzo di dominio
nuovo: un tracciamento periodico per area, con la sua cadenza, il suo storico e
la sua definizione di "avanzamento rispetto a cosa". La seconda strada è
sostanziale, e tocca la promessa più delicata del prodotto: un dato di abitudine
raccolto in continuo è più invasivo di tutto ciò che la piattaforma raccoglie
oggi, quindi ricade sul consenso del §8.2 prima ancora che sull'interfaccia.

**Non si sceglie per omissione.** Lasciare la barra e riempirla con un valore
dichiarato è ciò che il dataset demo fa, dichiarandolo; farlo in produzione
significherebbe mostrare a una persona una misura del proprio comportamento che
nessuno ha misurato — che è la stessa famiglia del §8 di `CLAUDE.md`, dove nessuna
metrica di stress si deduce da un surrogato.

### 8.10 Le tre voci del profilo non hanno una sorgente

**Sta accanto al §8.9 perché è lo stesso problema**, e la somiglianza è il modo
più rapido di capirlo: lì una barra misura un avanzamento che nessuno registra,
qui tre voci descrivono uno stato che nessuno rileva più di una volta.

La demo ereditata mostrava nel profilo del dipendente **stress, sonno ed
energia** come tre righe scritte in pagina. Non erano tre dati: erano tre
etichette. Nel dominio di oggi esiste `HealthProfile`, e porta **tre cose
diverse** — un punteggio `0–100`, una sintesi fra tre valori e **l'area più
debole fra le cinque** di `HealthArea` (§3). Fra le cinque non c'è l'energia.

**Il lavoro dell'MVP non è rimettere tre etichette.** Rimetterle costa un'ora, e
sarebbe la scelta per omissione che il §8.9 vieta: tre voci accanto a un nome
che un cliente legge come una misura del proprio stato. Il lavoro è decidere **da
dove escono quei numeri**, e sono tre decisioni distinte:

- **la cadenza**: `HealthProfile` nasce dall'assessment iniziale, che è una
  fotografia scattata una volta all'attivazione. Tre voci che non si aggiornano
  mai invecchiano addosso alla persona, e a un anno di distanza dicono di
  qualcun altro;
- **lo storico**: senza una serie non esiste "sta migliorando", che è l'unica
  cosa utile che tre voci possono dire a chi le legge di sé. Il check rapido è
  la sola sorgente ricorrente che il prodotto ha, e misura **una** delle tre;
- **rispetto a cosa**: un valore di sonno non vuol dire niente da solo. O si
  confronta con la baseline della persona — e allora serve la serie — o con una
  norma di popolazione, che è un dato clinico che la piattaforma non ha e non
  può inventare (`CLAUDE.md` §2.4).

**La terza decisione è quella che tocca il §8.2**, come per il §8.9: rilevare
sonno ed energia in continuo è più invasivo di tutto ciò che il prodotto
raccoglie oggi, e ricade sul consenso prima che sull'interfaccia. Ed è il punto
in cui il vincolo del `CLAUDE.md` §8 va riletto al contrario: lì dice che lo
stress non si deduce mai dal comportamento, e un tracciamento di abitudini è
esattamente il surrogato che quella riga rifiuta per l'aggregato aziendale.
Averlo sul profilo individuale non è la stessa cosa — è il diretto interessato
che guarda i propri dati — ma la differenza va **decisa**, non lasciata cadere
dalla parte comoda.

### 8.11 Le recensioni dei professionisti

Il roster porta una **valutazione numerica** — `4.9`, `4.8` — e **nessun testo**:
non esiste un'entità recensione, non c'è un metodo che la scriva né uno che la
legga, e la valutazione del dataset è un valore dichiarato senza nulla dietro
(`CLAUDE.md` §8). Chi prenota vede un numero e non sa da quante persone viene.

**Il vincolo che decide il gruppo non è la scrittura: è che anonimo non basta.**
Una recensione firmata "anonimo" ma datata, e con un dettaglio dentro — *"dopo il
mio percorso di sei mesi"* — dice comunque chi è, su una rete in cui un
professionista ha sei pazienti attivi. È la stessa aritmetica della soglia di
anonimato del §3, spostata dall'aggregato al testo libero: lì il rimedio è un
numero minimo di misurati, qui non esiste un rimedio automatico, perché a
identificare è **il contenuto** e non la firma.

E il danno non è simmetrico rispetto agli altri dati del prodotto: la promessa
principale è che nessuno sappia chi va dallo psicologo (`docs/PITCH.md`), quindi
una recensione che si lascia ricondurre a una persona non è un difetto di
funzione — **smentisce l'argomento di vendita**, e lo smentisce su una schermata
pubblica.

**Ne discende il perimetro, che è più largo di "aggiungere un campo testo":**

- **la moderazione**, cioè chi legge prima della pubblicazione e con quale
  regola. Non è un filtro automatico: a essere identificante è un dettaglio
  plausibile, non una parola in una lista;
- **la forma del testo**: se sia libero, o una scelta fra frasi, o solo delle
  dimensioni con un punteggio ciascuna — che è l'unica forma che non può
  contenere un dettaglio;
- **se pubblicare il solo aggregato**, cioè tenere la media e il numero di
  valutazioni e non mostrare mai un testo. È la strada che costa meno ed è
  compatibile con quello che c'è: la valutazione è già un aggregato, le manca
  solo il denominatore;
- **il diritto di replica del professionista**, e cosa succede a una recensione
  quando lascia la rete — che è la stessa domanda del §8.2 sulla nota di
  sessione, su un dato che però è pubblico.

**Non è la stessa cosa della nota di sessione**, ed è utile dirlo perché i due si
somigliano: la nota è privata per forma del dominio e nessun tipo la fa uscire
(§3); una recensione **nasce per essere pubblicata**, quindi la protezione non
può stare nella forma del tipo e deve stare nel processo.

### 8.12 Paginazione

**`getEmployeeDirectory` restituisce otto righe su 120**, e la schermata lo
dichiara (§7). Un elenco vero si pagina e si cerca, e vale per ogni lista che in
produzione cresce: dipendenti, sedute, pazienti, richieste demo, utenti di
piattaforma.

**Sta qui e non in una milestone della demo.** `docs/PROGRESS.md` la dava a M5,
ma nessuno dei sei blocchi di quella milestone la contiene, e non è una
dimenticanza: paginare un estratto di otto righe curate non aggiunge niente alla
demo e toglie tempo a ciò che il pitch mostra. È lavoro dell'MVP, e questa riga
gli dà la sua collocazione invece di lasciarla orfana.
