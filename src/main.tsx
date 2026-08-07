import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/index.css'
import { queryClientInstance } from '@/lib/query-client'
import { assertQueriesArePrewarmed, prefetchDemo } from '@/lib/data/prefetch'

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

prefetchDemo(queryClientInstance).then(() => {
  ReactDOM.createRoot(container).render(
    <App />
  )
})
