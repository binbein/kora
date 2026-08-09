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
  sarebbe un campo che non dovrebbe esistere lì, dichiarato vuoto.

Il criterio, in una domanda: *se il valore mancasse, la riga avrebbe comunque un
posto dove metterlo?* Se sì, `| null`. Se no, `?`.

Per il backend la differenza è concreta: un campo `| null` **è sempre nella
risposta**, con `null` dentro; un campo `?` **non c'è** quando non pertiene, e il
client non deve distinguere fra assente e vuoto perché il caso non si presenta.

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

`VirtualDoctorConsult` esiste perché il conto dei consulti si prende **dalla
lista**, non da uno scalare accanto. Porta la sola data di apertura: la
conversazione della demo è una simulazione dichiarata e non ha trascritti da
conservare. In produzione il tipo cresce qui — trascritto, medico che ha
risposto, esito — non in una seconda entità.

`RapidCheckAnswer` è il segnale che alimenta ogni dato di stress della dashboard
(§3, misurazione). La scrittura prende **il solo valore**: chi risponde è la
persona autenticata e il reparto lo sa il server, come `getCompany()` non prende
un identificatore (§7). La variante su link anonimo porterà il reparto dal link.

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

Sono tutte le scritture del dominio: dopo l'area pubblica non ne restano fuori.

**`bookAppointment` invalida due radici perché scrive un record solo.**
`Appointment` e `ProfessionalSession` sono due proiezioni della stessa seduta
(§3), quindi dopo la scrittura devono rileggere entrambe: la radice del
professionista porta con sé sedute, pazienti e **disponibilità** — per questo
gli slot stanno sotto di lei e non sotto il dipendente — e quella del dipendente
appuntamenti e contatori. La prova a schermo esiste: prenotando dal portale
dipendente lo slot sparisce, l'appuntamento compare in home e la stessa seduta
compare nel calendario e nelle sedute in programma del professionista.

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
- Stati di errore e vuoto veri sono M5. Il contratto li regge già — `| null` e
  liste vuote sono valori legittimi — ma le schermate non li mostrano ancora.

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

**L'autenticazione, i ruoli e le guardie di rotta.** Sono M5 e non sono in questa
interfaccia. `UserRole` esiste nei tipi perché il back-office ne ha bisogno come
dato, non come meccanismo di accesso.

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
- **Le sessioni degli altri clienti sono la curva di Demo SA scalata.** È il
  modo in cui il dataset demo tiene Demo SA *dentro* i totali di piattaforma
  invece che accanto, e in produzione salta per intero: ogni cliente avrà le
  sue sedute. Ciò che resta vero è la forma — una serie mensile per la
  piattaforma, derivata e non salvata.
- **Un solo dipendente.** `getEmployeeProfile`, `getEntitlement`,
  `getAppointments`, `getCheckupEligibility` e le altre letture del percorso non
  prendono un identificatore: la demo ha Laura Bernasconi e basta. In produzione
  la persona viene dalla sessione, come l'azienda.
