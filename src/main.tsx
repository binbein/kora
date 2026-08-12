import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/index.css'
import { ErrorNotice } from '@/components/kora/StateNotice'
import { queryClientInstance } from '@/lib/query-client'
import { assertQueriesArePrewarmed, prefetchDemo } from '@/lib/data/prefetch'
import { t } from '@/lib/i18n'

/*
 * La cache si riempie prima che l'albero venga montato (CLAUDE.md §5.1): il
 * provider è asincrono, ma la prima schermata deve comparire già piena. Con il
 * dataset in memoria l'attesa è un microtask, quindi non si vede.
 */
assertQueriesArePrewarmed(queryClientInstance)

const container = document.getElementById('root')
if (!container) {
  // `index.html` porta il div: se manca, il montaggio fallirebbe comunque, ma
  // con un errore su `null` invece che con la sua causa.
  throw new Error('#root non è in index.html: l\'app non ha dove montarsi.')
}

const root = ReactDOM.createRoot(container)

/*
 * Se la cache non si scalda, l'applicazione non parte — e fino a M5.b non lo
 * diceva a nessuno.
 *
 * `prefetchDemo` attende sei metodi direttamente, perché le loro risposte sono
 * le chiavi di tutto il resto (`data/prefetch.ts`): se uno rifiuta, rifiuta
 * lui, `.then()` non gira e resta una pagina bianca muta — in sviluppo, nella
 * build demo e in produzione allo stesso modo. È il primo errore da trattare
 * proprio perché sta fuori dalle schermate: nessuna di loro esiste ancora.
 *
 * Si monta React con lo stesso componente delle schermate e la stessa stringa
 * di `i18n`, invece di scrivere HTML a mano: l'albero non è montato, ma nulla
 * impedisce di montarlo con un errore dentro. **La resa è minima di proposito**
 * — il solo riquadro centrato, senza nav e senza layout d'area — perché una
 * pagina d'errore vestita sarebbe una schermata nuova, e questo è uno stato
 * (founder, §2.6).
 *
 * NIENTE "RIPROVA" QUI: `prefetchDemo` non è una query e non si rilegge da
 * sola; il gesto utile è ricaricare, che per un provider che vive in memoria è
 * anche il reset. Il copy lo dice.
 *
 * PERCHÉ NON C'È UN WATCHDOG. Un `catch` prende ciò che rifiuta, non ciò che
 * non si risolve mai — e appendersi era possibile: con `retry: 1` una query in
 * pausa lasciava `prefetchQuery` pendente per sempre, quindi `Promise.all` non
 * finiva. Non lo è più da quando `query-client.ts` non ritenta (la ragione sta
 * là). Rimetterci un tentativo automatico riapre quel caso, e allora si
 * ridiscute: un timer messo qui oggi sarebbe codice che nessun percorso
 * produce (§11).
 */
prefetchDemo(queryClientInstance)
  .then(() => {
    root.render(<App />)
  })
  .catch((error: unknown) => {
    console.error('[boot] la cache non si è scaldata, l\'app non parte.', error)
    root.render(
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorNotice copy={t.common.state.boot} />
      </div>
    )
  })
