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

**Assente si dice `null`, mai `undefined`.** Un valore che non c'è e un campo che
nessuno ha valorizzato sono cose diverse, e alla prima serializzazione JSON
`undefined` sparirebbe dall'oggetto invece di arrivare come assenza.

**La superficie del provider cresce così**: *le letture si espongono quando il
dato esiste, le scritture solo quando hanno un chiamante.* Le due metà non sono
simmetriche di proposito. Una lettura senza consumatore costa un metodo che
restituisce dati già costruiti; una scrittura senza consumatore costringe a
indovinare la superficie di invalidazione, che è la parte del contratto in cui
sbagliare costa di più — è il motivo per cui `saveSessionNote` c'è e
`bookAppointment` no.

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

`SessionNote` porta il testo e **nessun metodo dell'area HR o admin lo
restituisce**. Le altre proiezioni sanno al massimo che una nota esiste
(`ProfessionalSession.hasNote`), mai cosa dice. La nota non esce mai verso
l'azienda del paziente, e a impedirlo è la forma del dominio.

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
| **Sessioni consumate** (azienda) | **cumulate sui dodici mesi** del monte annuo, non consumate nel trimestre |
| **Risparmio trimestrale** | proporzionale agli attivi, **arrotondato al centinaio** |
| **Giorni di assenza evitati** | risparmio ÷ costo di una giornata di assenza |

L'arrotondamento al centinaio fa parte della regola, non della formattazione:
senza, gli importi non sono riproducibili, e una cifra al franco su un risparmio
stimato è finta precisione.

## 4. Letture e scritture

Le chiavi di react-query stanno in `src/lib/data/query-keys.ts` e sono
gerarchiche: invalidare `["professional", id]` porta con sé sedute, pazienti,
compensi e pagamenti.

| Mutation | Invalida |
|---|---|
| `saveSessionNote` | `["professional", professionalId]` |

L'unica scrittura implementata oggi. Le prossime — la prenotazione, il check
rapido, la richiesta demo — arrivano con l'area che le usa, e ognuna porta la sua
riga in questa tabella.

Una prenotazione dovrà invalidare **la stessa radice del professionista** e le
query del dipendente: è lo stesso record visto da due lati, e la prova a schermo
arriva quando M3 costruisce il lato dipendente.

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
- **Un solo cliente, una sola azienda.** `getCompany()` non prende un
  identificatore: la demo ha Demo SA e basta. In produzione l'azienda viene dalla
  sessione, non da un parametro — ed è una modifica al provider, non alle
  schermate.
- **Il tempo ha una sola sorgente.** `getReferenceDate()` restituisce la data in
  cui la demo è ambientata. In produzione restituisce oggi, e sparisce dal
  contratto insieme al §1.1 di `CLAUDE.md`.
