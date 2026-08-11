# M5.b — stati di errore e vuoto veri

Blocco b) di M5 (`CLAUDE.md` §4). **PR di milestone: non entra nel conto delle
passate di refinement**, che resta a undici.

Undici commit. Il blocco aveva **due consegne, e la seconda è la condizione
della prima**: gli stati, e il modo di dimostrarli a schermo.

---

## Il difetto, che era più preciso di "manca la gestione errori"

`if (!dato) return null` in tutte e 26 le schermate **confondeva tre casi**: in
caricamento (`undefined`), legittimamente assente (`null`, che quattro metodi
restituiscono per contratto), ed errore. La dashboard HR aveva un `if` a
**undici condizioni**, due delle quali erano slot nullable — `getRoiSnapshot` e
`getHrReport` — quindi **un trimestre senza dati usciva identico a una pagina
in caricamento e a una rotta**: bianca.

Il precedente giusto era già in casa: `RapidCheckCard` confrontava
`=== undefined`, distinguendo "in caricamento" da "non ha ancora risposto". Il
blocco generalizza quello.

## Le scelte, e perché

**La regola sta scritta una volta**, in `loadState`. **Non conosce le forme** —
il vuoto di una lista è `[]`, quello di uno slot è `null`, e un classificatore
che li conoscesse tutti sarebbe il secondo elenco che diverge dal primo: a
decidere il vuoto è la schermata. L'errore vince sull'attesa, perché aspettare
il resto lascerebbe una sospensione che non finisce.

**Due componenti, non uno con una variante**: `EmptyNotice` **non può ricevere
`onRetry`**, e a impedirlo è il tipo. Nessuno dei due disegna il proprio
contenitore, ed è la scelta che ha reso inutile un terzo componente per il
registro consumer: senza scatola non c'è raggio né densità da cambiare, quindi
i due registri del §6.4 restano una questione di **copy**, scelto al call site.

**Nessun boundary**, ed è una scelta motivata: react-query non lancia in un
boundary senza `throwOnError`; un boundary sostituisce l'area intera, nav
compresa, fabbricando il vicolo cieco che il §10 vieta; e soprattutto **è cieco
sul `null`**, quindi metà del blocco gli passerebbe accanto. Un boundary di
radice catturerebbe solo errori di render, che nessun percorso produce — cioè
il codice non verificabile che questo blocco esiste per non scrivere.

**Dove il ramo non è di pagina c'è una ragione scritta**: la landing tiene il
listino su due sezioni su otto; il riquadro prodotto dell'hero e il badge della
nav professionista collassano i tre casi in "non disegnare", perché un riquadro
d'errore sulla prima schermata che un investitore vede direbbe che il prodotto
è rotto, e un errore al posto della nav toglierebbe la via d'uscita.

**Il bootstrap è il primo errore e sta fuori dalle schermate.** Sei metodi
bloccano il boot; un loro guasto lasciava una pagina bianca muta in tutti e tre
i modi. Ora monta React con lo stesso componente e la stessa stringa di `i18n`,
resa minima, e il copy dice il gesto utile: ricaricare, che per un provider in
memoria è anche il reset.

**Le quattro mutation dicono cosa non è successo**, non cosa è andato storto —
la prenotazione dichiara che lo slot è ancora libero — e non portano un
"Riprova": a ritentare è il pulsante che ha fallito.

## La dimostrazione

`data/fault-injection.ts`: un `Proxy` sul mock, montato **solo** quando
`GUARDRAIL_MODE` vale `"throw"`.

- `?fail=metodo[:n]` → il guasto; `?empty=metodo` → il vuoto legittimo.
- **Senza `?empty` metà del blocco sarebbe indimostrabile**: il dataset del §8
  ha tutti e quattro i trimestri pieni e nessuna lista vuota.
- Svuota **la risposta e non la chiamata**, per forma del valore vero.
- **A riposo è trasparente**, ed è parte del criterio: in sviluppo è montato
  sempre, così il ramo di passaggio si esercita a ogni sessione.
- **Assente da entrambi i bundle**, misurato su sette marcatori.

## Tre decisioni prese in corsa, tutte ratificate

1. **`retry: 1` → `retry: 0`.** Era configurazione ereditata mai esercitata. Il
   retryer di react-query **pausa fra i tentativi a scheda non visibile**, e una
   query in pausa è `data === undefined`: un **quarto caso** indistinguibile
   dalla sospensione. Costava anche l'albero intero, perché una `prefetchQuery`
   in pausa non si risolve.
2. **`?empty` aggiunta** oltre il piano, perché il blocco stesso richiede che
   ogni stato sia producibile.
3. **Il guardrail della cache fredda accusava le query in errore.** Esentava
   `status === "error"`, che non basta: al montaggio react-query rifà la query e
   lo stato torna `pending` con `error: null`. Ora legge `errorUpdateCount`, che
   sopravvive alla finestra. **Il ramo non era mai stato esercitato**, perché
   prima di questo blocco niente poteva fallire.

## Verificato

27 rotte sulla build demo, zero vuote, **zero stati d'errore raggiungibili**,
console pulita. Le manopole **non esistono** nella build demo. I numeri del
pitch fermi alla cifra: CHF 14'200, 16 giorni, 68%, 82 su 120, 142 di 1'200,
62%, soglia 12, −2 punti; i cinque di ancoraggio del §9; CHF 652'968, 415, 798;
CHF 1'120. Coreografia `/admin` completa sulla build demo. "Riprova" riesce
davvero. Contrasti 5.39 e 4.90 sul fondo vero. Guardrail ancora **90 + 6**.
`lint`, `typecheck`, `build`, `build:demo` a posto.

## Aperto e dichiarato

- Gli **stati vuoti preesistenti non sono stati consolidati** su `EmptyNotice`:
  sono già testo attenuato e centrato, e l'inventario li dichiara riga per riga.
- `?empty` non copre i vuoti che nascono da un filtro di schermata.
- L'**anello di focus sui CTA pieni** resta il residuo di M5.a, e "Riprova" non
  lo tocca perché è `variant="outline"`.

## Nota di metodo

Ho dichiarato due volte un difetto che non c'era — "Riprova" sembrava non
funzionare — perché leggevo il DOM **nello stesso tick del clic**. È la stessa
famiglia di `visibilityState` e dello spazio unificatore: *misurare prima che
lo stato esista*. Sta nella sintesi, non qui, perché serve a chi verrà dopo.
