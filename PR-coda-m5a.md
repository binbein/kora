# docs: la coda documentale di M5.a

Tre voci di sintesi erano invecchiate con la chiusura del blocco a). **È
contabilità di M5.a, quindi appartiene alla milestone**: non è una passata di
refinement e non entra nel conto, che resta a undici (`PROGRESS`, criterio della
sezione *Refinement fra le milestone*, che esclude la milestone).

Tre commit `docs:`, uno per voce. Nessun file di `src/` toccato.

---

## Perché queste tre e non altre

Sono le righe che chi riprende legge **per prime** per capire dove siamo: la voce
che decide quali file restano `.jsx`, la riga che dichiara il debito AA, e la
tabella delle milestone. La sezione M5.a era già scritta bene; erano i punti di
indice a mandare altrove.

Il difetto è sempre lo stesso: **un blocco chiude, la sua sezione racconta, e la
sintesi in cima continua a dire lo stato di prima.**

---

## 1. `CLAUDE.md` §3 — l'elenco dei `.jsx`

Diceva quattro e nominava `PageNotFound`, che il blocco a) ha convertito in
`.tsx` toccandola.

**La frase storica non si riscrive.** È ancorata ad *"A M3 chiusa"* ed era vera
allora; l'aggiornamento la segue, con la convenzione che il file usa già per il
114 dei guardrail e per le CTA su `primary`.

**Il criterio, che è la parte che serve davvero.** `find src -name "*.jsx"` ne
trova **quattro**, e la regola ne conta **tre**: non sono in disaccordo, contano
due insiemi diversi — quello che si converte al primo che ci mette mano
(`HRLayout`, `ProLayout`, `KoraLogo`) e `FlexiblePlanCard.jsx`, che non può
convertirsi finché il piano "Personalizzato" è in sospeso. Senza il criterio
scritto accanto, quel quattro sarebbe il quarto numero della serie che questo
repository conosce già: 19/11 contro 13/9 sulle CTA, 114 contro 96 sui
guardrail.

**Chi li nomina, e chi rimanda.** L'elenco discende dalla regola di conversione,
che vive in `CLAUDE.md`: quindi li nomina il §3, e `PROGRESS` M5.a smette di
tenere un conto suo — diceva *"Restano quattro `.jsx`"*, numericamente giusto
sotto l'altro criterio, che è esattamente il modo in cui i due documenti
divergono senza che nessuno dei due sbagli.

## 2. Il debito AA — chiuso, con il suo residuo

Due punti lo davano ancora aperto: `CLAUDE.md` §6.1 (*"il verde pieno è chiuso
sul testo, il debito AA no"*) e l'intestazione *Stato* di `PROGRESS` (*"resta il
caso inverso… destinazione M5"*). Il blocco a) l'ha chiuso — censimento a
schermo da 79 punti sotto soglia a **zero informativi**, su 27 rotte.

Entrambi ora dicono chiuso e **rimandano alla sezione M5.a per i conti**, invece
di ripeterli. §6.1 aggiunge le due cose che la riga vecchia non poteva prevedere,
perché è ciò che rende leggibile il salto da 27+40 a 79: il censimento vecchio
era da grep e **sbagliava in difetto**, e il debito delle icone non era di colore
ma di `aria` — un'icona dichiarata decorativa è esente dalla 1.4.11.

**"Chiuso" non cancella il residuo, ed è la ragione per cui sta in tutti e due i
punti.** L'anello di focus è invisibile sui CTA pieni: `--ring` è il blu di
`primary` e i CTA stanno su `bg-primary`, cioè **1.00:1** su **12 pulsanti**. Il
rimedio è in `src/components/ui/button.tsx`, congelato dal §3, la cui eccezione
copre le sole annotazioni di tipo — **è una decisione dei founder**, della stessa
famiglia della guardia di `useFormField` che il blocco c) porta con sé.

## 3. La tabella delle milestone

Dava M5 *"da fare"* con un sesto già chiuso. Ora: **in corso — blocco a chiuso,
prossimo b**. È la riga su cui si decide cosa aprire.

---

## Verificato

Ogni affermazione è stata controllata sull'albero prima di scriverla, non presa
dai documenti:

- i `.jsx` presenti sono `HRLayout`, `ProLayout`, `KoraLogo`,
  `FlexiblePlanCard` — quattro file, tre convertibili;
- `PageNotFound.tsx` esiste e non ha un gemello `.jsx`;
- il residuo dell'anello di focus è reale: `--ring: 207 68% 21%` in `index.css`
  è il token di `primary`, e `button.tsx` porta `focus-visible:ring-ring`;
- le due varianti `secondary-strong` e `destructive-strong` sono nei token e
  hanno call site fuori da `src/components/ui/`;
- `npm run lint` e `npm run typecheck` **a zero**.

## La riletta, che è la prova vera

Le tre righe sono state rilette **come le legge chi riprende senza questo
scambio**, ed è il controllo che la modifica doveva superare: da sole devono
ricostruire lo stato vero — tre `.jsx` convertibili più uno che non lo è,
debito AA chiuso con un residuo che aspetta i founder, M5 aperta al blocco b).

**Una cosa incontrata e non toccata**, perché fuori dalle tre voci: la stessa
intestazione *Stato* dice ancora *"La prossima milestone è M5"* in fondo al
paragrafo su M4. Non è falsa — descrive l'ordine dopo il refinement — ma a due
schermate di distanza dal *"M5 è aperta"* di apertura si legge come una terza
versione dello stato. Se la volete allineata, è una riga.
