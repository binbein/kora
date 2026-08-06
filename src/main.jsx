import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { queryClientInstance } from '@/lib/query-client'
import { assertQueriesArePrewarmed, prefetchDemo } from '@/lib/data/prefetch'

/*
 * La cache si riempie prima che l'albero venga montato (CLAUDE.md §5.1): il
 * provider è asincrono, ma la prima schermata deve comparire già piena. Con il
 * dataset in memoria l'attesa è un microtask, quindi non si vede.
 */
assertQueriesArePrewarmed(queryClientInstance)

prefetchDemo(queryClientInstance).then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )
})
