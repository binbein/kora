import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

/*
 * I due stati che una schermata può mostrare al posto dei dati (CLAUDE.md §4,
 * blocco b di M5): **vuoto** e **errore**. Sono due componenti e non uno con
 * una variante, perché non sono due gradi della stessa cosa — un vuoto è un
 * caso previsto e un errore è un guasto, e solo il secondo ha un gesto da
 * offrire.
 *
 * NON DISEGNANO IL LORO CONTENITORE, ed è la scelta che tiene tutto il resto
 * semplice. Le liste di questa demo vivono già dentro una `Card` con la sua
 * intestazione, e un componente che portasse la propria scatola ne
 * anniderebbe due. Chi non ha un contenitore ce lo mette attorno.
 *
 * DA QUI I DUE REGISTRI DEL §6.4 NON HANNO BISOGNO DI DUE COMPONENTI. Senza
 * scatola non c'è raggio da arrotondare né densità da cambiare: a distinguere
 * lo strumento dal consumer resta **il testo**, che arriva da `i18n` scelto al
 * call site — `t.common.state.*` nelle quattro aree in terza persona,
 * `t.employee.state.*` nel portale dipendente. Il registro si legge dove si
 * decide, invece di essere un prop che nessuno rilegge (§11).
 *
 * L'ICONA STA SOLO SULL'ERRORE. Il vuoto in questa demo è testo attenuato dai
 * tempi di base44, in una decina di punti: dargli un'icona sarebbe un
 * cambiamento di resa che nessuno ha chiesto. L'errore invece è nuovo e raro,
 * ed è il suo essere raro a farlo notare — la stessa ragione per cui il §6.1
 * tiene `warning` e `destructive` per gli alert.
 *
 * L'icona è decorativa e nascosta ai lettori di schermo (M5.a): il titolo
 * accanto porta già il significato, e il colore non è mai l'unica cosa che lo
 * dice.
 */

/** Titolo e corpo di uno stato d'errore, presi insieme da `i18n`. */
export type ErrorCopy = {
  title: string;
  body: string;
};

/**
 * Il vuoto legittimo: non c'è niente da mostrare, e va bene così.
 *
 * È il ramo di `data === null` o di una lista vuota (`docs/CONTRATTO-DATI.md`
 * §2), mai quello di un dato che non è arrivato.
 */
export function EmptyNotice({ text }: { text: string }) {
  return (
    <p className="p-6 text-sm text-muted-foreground text-center">{text}</p>
  );
}

/**
 * Il guasto: il dato non è arrivato.
 *
 * `onRetry` si passa dove c'è qualcosa da rileggere — una query che si può
 * rifare. Si lascia fuori dove il gesto esiste già altrove: dopo una mutation
 * fallita a ritentare è il pulsante che l'ha lanciata, e un secondo "Riprova"
 * accanto direbbe la stessa cosa due volte.
 */
export function ErrorNotice({
  copy,
  onRetry,
}: {
  copy: ErrorCopy;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 text-center">
      <p className="flex items-center justify-center gap-2 text-sm font-medium text-destructive-strong">
        <TriangleAlert className="w-4 h-4" aria-hidden="true" />
        {copy.title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{copy.body}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          {t.common.state.retry}
        </Button>
      )}
    </div>
  );
}
