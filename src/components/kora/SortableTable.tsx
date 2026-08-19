import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { getLocale, t } from "@/lib/i18n";

/*
 * L'ordinamento delle tabelle (§10.C, §10.E).
 *
 * È PRESENTAZIONE E NON DOMINIO, ed è la ragione per cui vive qui e non nel
 * provider: ordinare è una decisione della schermata, come raggruppare per
 * settimana il calendario del professionista — che per la stessa ragione non
 * sta nell'interfaccia (`docs/CONTRATTO-DATI.md` §2). Nessuna chiave di cache
 * cambia, nessun metodo prende un parametro nuovo, e il dato che arriva è lo
 * stesso: **ordinare non è filtrare**, le righe restano quelle e cambia il
 * loro ordine.
 *
 * **Un componente solo per sette tabelle.** Le altre sei hanno da cinque a otto
 * righe e non ne avrebbero bisogno; a chiederlo è `/admin/sessioni`, che ne ha
 * 82. Con una primitiva sola metterlo ovunque non costa niente e toglie la
 * domanda "perché qui sì e là no", che è la stessa ragione per cui i tre
 * portali hanno tutti l'uscita col logo.
 *
 * SI ORDINA PER IL VALORE CHE LA RIGA MOSTRA, e per i testi è l'etichetta a
 * schermo confrontata con `localeCompare` nel locale attivo: due lingue
 * ordinano le stesse righe in modo diverso, ed è giusto — si ordina ciò che si
 * legge. Le enumerazioni fanno eccezione **solo dove hanno una scala del
 * dominio** (il percorso del check-up, i tre piani): lì l'ordine è un fatto e
 * non una convenzione tipografica, quindi il call site passa un numero e la
 * lingua non lo tocca. Dove una scala non c'è e leggerle in ordine alfabetico
 * non vuol dire niente — lo stato di una seduta — la colonna **non si ordina**,
 * e la ragione sta in `AdminSessioni.tsx`.
 */

/** Il valore su cui una colonna si ordina. `null` è il vuoto, e sta in fondo. */
export type SortValue = string | number | boolean | Date | null;

export type SortDirection = "asc" | "desc";

type Sort<K extends string> = { key: K; direction: SortDirection };

/** I props che il call site gira a `SortableHead`. */
export type SortableHeadState = {
  direction: SortDirection | null;
  onSort: () => void;
};

/*
 * I vuoti stanno in fondo in **tutte e due** le direzioni, ed è una scelta: un
 * valore che non c'è non è né grande né piccolo, quindi non ha un posto nella
 * scala — mandarlo in cima invertendo la direzione lo farebbe sembrare il
 * minimo. Il rango si applica prima della direzione, per questo.
 */
function nullRank(value: SortValue): number {
  return value === null ? 1 : 0;
}

function compareValues(a: SortValue, b: SortValue, locale: string): number {
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, locale);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return 0;
}

/**
 * Le righe ordinate, e i props delle intestazioni.
 *
 * `columns` dà il valore di ogni colonna ordinabile; `tiebreak` è la chiave
 * secondaria, **sempre crescente in tutte e due le direzioni**: due righe con
 * lo stesso valore hanno così un ordine loro, invece di dipendere da quello in
 * cui sono arrivate, e non si scambiano di posto a ogni clic.
 *
 * Lo stato parte da `null`, cioè **non ordinato**: la tabella si apre
 * nell'ordine del dato, che è quello che le schermate dichiarano altrove — le
 * richieste demo dalla più recente, le sedute come l'agenda le tiene.
 */
export function useSortedRows<T, K extends string>(
  rows: readonly T[],
  columns: Record<K, (row: T) => SortValue>,
  tiebreak: (row: T) => string,
): { rows: T[]; sortProps: (key: K) => SortableHeadState } {
  const [sort, setSort] = useState<Sort<K> | null>(null);
  const locale = getLocale();

  const sorted = [...rows];
  if (sort !== null) {
    const value = columns[sort.key];
    sorted.sort((rowA, rowB) => {
      const a = value(rowA);
      const b = value(rowB);
      const empties = nullRank(a) - nullRank(b);
      if (empties !== 0) return empties;
      const primary = compareValues(a, b, locale);
      if (primary !== 0) return sort.direction === "asc" ? primary : -primary;
      return tiebreak(rowA).localeCompare(tiebreak(rowB), locale);
    });
  }

  /*
   * Tre stati e non due: il terzo clic **toglie** l'ordinamento e riporta la
   * tabella all'ordine del dato. Senza, una volta ordinata una colonna non si
   * torna più a com'era senza ricaricare — e ricaricare, durante la demo, è la
   * cosa che azzera il provider (§10).
   */
  const sortProps = (key: K): SortableHeadState => ({
    direction: sort !== null && sort.key === key ? sort.direction : null,
    onSort: () =>
      setSort((current) => {
        if (current === null || current.key !== key) {
          return { key, direction: "asc" };
        }
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }),
  });

  return { rows: sorted, sortProps };
}

/**
 * L'intestazione di una colonna ordinabile.
 *
 * `aria-sort` sta sul `<th>` e dice **lo stato**; il nome accessibile del
 * pulsante dice **l'azione**, ed è l'etichetta visibile più una frase per i
 * soli lettori di schermo. Le due metà non si sovrappongono, ed è la ragione
 * per cui la frase non è un `aria-label`: quello sostituirebbe l'etichetta, e
 * chi ascolta sentirebbe una parola diversa da quella che chi guarda legge —
 * lo stesso motivo per cui i cinque volti del check rapido non ne hanno uno.
 *
 * Il pulsante sta **dentro** la cella e non al posto suo: `aria-sort` ha
 * significato su un `<th>` di una tabella vera, e tutte e sette usano
 * `ui/table.tsx`.
 */
export function SortableHead({
  direction,
  onSort,
  className,
  children,
}: SortableHeadState & {
  className?: string;
  children: ReactNode;
}) {
  const Icon =
    direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <TableHead
      aria-sort={
        direction === "asc"
          ? "ascending"
          : direction === "desc"
            ? "descending"
            : "none"
      }
      className={className}
    >
      <button
        type="button"
        onClick={onSort}
        className="inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground"
      >
        {children}
        <Icon
          className={
            direction === null
              ? "w-3.5 h-3.5 shrink-0 opacity-50"
              : "w-3.5 h-3.5 shrink-0 text-foreground"
          }
          aria-hidden="true"
        />
        <span className="sr-only">{t.common.sort.action}</span>
      </button>
    </TableHead>
  );
}
