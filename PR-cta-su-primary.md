# fix: le CTA verdi piene passano su primary

Passata di palette decisa dai founder il 10.08.2026 (`CLAUDE.md` §6.1, PROGRESS
"Decisioni chiuse"). Sei commit: quattro di colore, due di rimozione. **Nessun
cambiamento oltre ai colori dei punti inventariati.**

---

## L'inventario autoritativo: 13 punti su 9 file

Sostituisce definitivamente i **19/11** di M3 e i **~9/7** della ricognizione.
Quelli erano stime; questo è un conteggio con un criterio scritto, ricavato da 21
occorrenze grezze di `bg-secondary` pieno o `variant="secondary"` in 14 file.

| destinazione | punti | dove |
|---|---|---|
| `primary` | **8** CTA | `PublicNav` ×2, `PageNotFound`, `EmployeeHome`, `Psicologi` ×3, `ProSessioni` |
| `accent` | **2** KPI | `HRDashboard`, `ProPagamenti` |
| coppia `accent` | **2** badge | `Psicologi`, `ProProfilo` |
| rimossa | **1** variante | `KPICard.bgMap.secondary` |

**Fuori, con la ragione**: `button.tsx`, `badge.tsx`, `sheet.tsx` (congelato);
`FlexiblePlanCard.jsx` (codice morto del piano nascosto); il pallino di `Medico`
e i due riempimenti di barra di `HRDashboard` (nessun testo).

### Due errori dell'inventario, trovati verificandolo

Vanno tenuti perché sono **il modo in cui questo conteggio sbaglia**, ed è la
ragione per cui il numero era diverso tutte e tre le volte:

1. **Un `grep -v "bg-secondary/"` esclude la riga, non l'occorrenza.** Quindi
   `className="bg-secondary hover:bg-secondary/90"` — *la CTA*, cioè il caso
   centrale — spariva dal conto, perché la stessa riga contiene anche la tinta
   trasparente. È molto probabilmente l'origine del ~9/7.
2. **`Medico.tsx:159` è un pulsante a sola icona** con `aria-label`, non testo.
   Era nell'inventario che avevi approvato a 14 punti; per il criterio che hai
   fissato — «gli usi senza testo» sono fuori — è uscito, e i punti sono 13. È il
   motivo per cui `/employee/medico` conserva un pulsante teal.

### Un call site non è un rendering

Il censimento a runtime sulle 26 rotte conta 18 pulsanti "Avvia" su
`/professional/sessioni` e tre badge di specialità su `/employee/psicologi` — ma
sono **un** call site ciascuno. L'inventario conta i punti da correggere, non le
volte che si vedono.

---

## Le destinazioni: ereditate, non scelte

- **CTA → `primary`**: `Roi.tsx` porta dai tempi di M3 il commento che lo motiva.
- **Chip, badge → coppia `accent`**: `Psicologi`, `Medico`, `EmployeeHome`,
  `RapidCheckCard`.
- **KPI piena → `variant="accent"`**: tutte e sei le schermate admin.
  `variant="primary"` non lo usava nessuno.

`badge.tsx` è congelato, quindi i due badge cambiano **la variante scelta al call
site** (`outline` + coppia `accent`), mai la definizione. `KPICard` è fuori dal
congelamento, e infatti la sua variante è stata rimossa invece che aggirata.

---

## I commit

1. `fix: move the filled CTAs off the teal` — 8 punti.
2. `fix: move the two filled KPI cards onto accent` — 2 punti.
3. `fix: move the two specialty badges onto the accent pair` — 2 punti. Da qui
   **nessun call site usa più `variant="secondary"`**.
4. `refactor: drop the KPI variant nobody can call safely` — `secondary`, resa
   morta da questa passata: una variante che disegna testo a 2.83:1 è una
   trappola per il prossimo call site (il ragionamento del toast).
5. `refactor: drop the KPI variant that never had callers` — `primary`, codice
   morto **preesistente** scoperto dall'inventario. Commit suo, come vuole il §11.
6. `docs: close the AA debt on the filled green` — §6.1, PROGRESS, e il commento
   di `Roi.tsx` che questa passata rende falso.

---

## Verifica

**I contrasti, misurati sui pixel reali** con un censimento a runtime su tutte e
26 le rotte — non calcolati sui token:

| | prima | dopo |
|---|---|---|
| CTA | 2.83:1 | **11.45:1** |
| KPI | 2.83:1 | **13.53:1** |
| Badge | 2.83:1 | **10.66:1** |

**Testo ancora su teal pieno, su 26 rotte: zero.**

Il calcolatore usato riproduce il 2.83 e il 10.7 delle rilevazioni precedenti,
quindi è tarato sugli stessi numeri che il repository già dichiara.

Inoltre: `lint` e `typecheck` a zero, build demo, 26 rotte percorse con la
navigazione interna, **console pulita**, e screenshot prima/dopo delle **otto
schermate toccate** allegati al riepilogo.

**Nota sugli screenshot della landing**: a scheda nascosta l'animazione
d'ingresso resta congelata (§10, il difetto noto). Per avere uno scatto
confrontabile ho forzato il completamento dell'animazione **solo nella cattura**,
via DOM: il codice non è stato toccato.

---

## Il debito residuo, censito e non toccato

Questa passata chiude **ciò che i founder hanno deciso — il verde pieno** — e
§6.1 dice esattamente questo, non "debito AA chiuso".

Resta il caso **inverso**: testo e icone teal su fondo chiaro. Il suo rimedio
**non è coperto dalla decisione del 10.08.2026**, che ha scelto la strada per il
riempimento pieno. Destinazione **M5**, che ha l'accessibilità completa in
elenco. Censito ora perché un inventario preciso è ciò che rende quella voce
eseguibile senza una terza rilevazione:

| caso | soglia | punti | file |
|---|---|---|---|
| **testo** `text-secondary` su fondo chiaro | 4.5 (WCAG 1.4.3) | **27** | 20 |
| **icone** teal su fondo chiaro | 3.0 (WCAG 1.4.11) | **40** | 20 |
| in `FlexiblePlanCard.jsx` | — | 3 | 1 (escluso, codice morto) |

Misure: `text-secondary` su card bianca **2.83:1**, su `bg-secondary/10`
**2.57:1**. Fra le icone c'è il pulsante di invio di `Medico.tsx:159`, che a
2.83:1 non arriva nemmeno alla soglia del non-testo.

**Il confine fra le due righe è approssimativo** e lo dichiaro: `iconClass:
"text-secondary"` passa da una variabile, quindi va letto a schermo e non da un
grep. È dichiarato anche in PROGRESS.

---

## Note per chi revisiona

- **`PageNotFound.jsx` resta `.jsx`**, con la deroga annotata nel commit e non in
  `CLAUDE.md`: la regola del §3 non cambia, si applica il suo spirito — il
  "tocco" è una classe, non mano al file. Stesso precedente di `KoraLogo`.
- **Il teal non è stato toccato dove fa il suo mestiere**: grafici, barre,
  ciambella, anelli e icone d'accento sono identici. Si vede confrontando la
  dashboard HR prima e dopo — cambia solo la card del risparmio.
