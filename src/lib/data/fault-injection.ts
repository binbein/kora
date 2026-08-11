import { raiseOutsideCurrentStack } from "./guardrails";
import type { DataProvider } from "./provider";

/*
 * L'INIEZIONE DI GUASTO: il modo in cui gli stati d'errore si dimostrano a
 * schermo (CLAUDE.md §4, blocco b di M5).
 *
 * Il mock risolve sempre e non fallisce mai, quindi senza questo file uno stato
 * d'errore sarebbe codice che nessun percorso produce — cioè codice che il §11
 * non vuole e che nessuno può verificare. È la seconda consegna del blocco, ed
 * è la condizione della prima.
 *
 * COME SI USA, in sviluppo:
 *
 *   /hr?fail=getCompany          → `getCompany` fallisce sempre
 *   /hr?fail=getCompany:2        → fallisce le prime due chiamate, poi riesce
 *   /hr?fail=getCompany,getInvoices
 *   /hr?empty=getRoiSnapshot     → risponde vuoto invece che con i dati
 *
 * DUE MANOPOLE, PERCHÉ GLI STATI SONO DUE. `?fail` produce il **guasto**,
 * `?empty` il **vuoto legittimo** — e senza la seconda metà del blocco
 * resterebbe indimostrabile: il dataset del §8 ha tutti e quattro i trimestri
 * pieni e nessuna lista vuota, quindi il ramo `null` non lo raggiungerebbe
 * nessun percorso, che è la definizione di codice non verificabile (§11).
 * `?empty` svuota **la risposta e non la chiamata**: il metodo vero viene
 * eseguito, e a essere sostituito è ciò che torna.
 *
 * ⚠︎ `?empty` SI PUNTA SOLO SU UN METODO CHE IL CONTRATTO DICHIARA VUOTABILE —
 * cioè su un `| null` o su una lista (`docs/CONTRATTO-DATI.md` §2).
 * `getRoiSnapshot`, `getHrReport`, `getEarlyAlert` e tutte le letture che
 * restituiscono un array vanno bene; `getReferenceDate`, `getCompany`,
 * `getEmployeeProfile` e gli altri **no**. Su quelli la manopola fabbrica uno
 * stato che i tipi vietano, la schermata riceve un `null` che non ha mai
 * dovuto gestire e l'applicazione si rompe forte — spesso lontano dal punto in
 * cui la manopola è stata girata. **Non è un difetto da riparare, è un errore
 * d'uso**: il decoratore non può distinguere i due casi senza tenere l'elenco
 * dei metodi nullable, che è esattamente il secondo elenco che diverge dal
 * primo. Chi arriva qui dopo aver visto l'app esplodere ha trovato la
 * spiegazione: sposta la manopola su un metodo vuotabile.
 *
 * I nomi sono quelli dei **metodi del provider**, non delle chiavi di query:
 * questo file avvolge il contratto, e il contratto è la sua superficie. Il
 * piano si legge **una volta sola**, all'istanza; le schermate non leggono né
 * l'ambiente né l'indirizzo, e la manopola resta in un file solo del layer
 * dati (§5.7).
 *
 * LA SOGLIA `:n` ESISTE PER IL PULSANTE "RIPROVA": senza un percorso in cui
 * riesce, sarebbe l'opzione che nessuno esercita mai (§11).
 *
 * ⚠︎ LA PRIMA CHIAMATA SE LA PRENDE IL PREFETCH, e il montaggio è la seconda.
 * `prefetchDemo` scalda ogni chiave prima del primo paint (§5.1), quindi
 * quando la schermata monta il guasto è già stato speso una volta; e una query
 * in errore viene **rifatta al montaggio di un osservatore**, perché
 * `retryOnMount` di react-query vale `true` di suo. Misurato: `:1` fa fallire
 * il solo prefetch e la schermata si rimette a posto da sé montando, mentre
 * `:2` è il valore che **mostra l'errore** e lascia riuscire il primo clic su
 * "Riprova". Con `:n`, i montaggi coperti sono `n − 1`.
 *
 * Non ha niente a che vedere con `retry`, che `query-client.ts` tiene a zero
 * per una ragione sua — che vale la pena leggere là prima di rimettercelo.
 *
 * ESISTE SOLO IN SVILUPPO, e non è una promessa: `index.ts` monta questo
 * decoratore solo quando `GUARDRAIL_MODE` vale `"throw"`. Nelle altre due
 * build quel confronto è un letterale falso, il ramo è morto e il
 * minificatore porta via il modulo insieme ai suoi messaggi — si verifica col
 * `grep` sul bundle, come per i guardrail (§5.6). È la ragione per cui il
 * pitch non può inciamparci: nella build che si deploya questo codice non c'è.
 *
 * A MANOPOLA A RIPOSO IL COMPORTAMENTO È IDENTICO. In sviluppo il decoratore è
 * montato sempre, anche senza `?fail`: è voluto, perché così il ramo di
 * passaggio si esercita a ogni sessione di lavoro invece che la prima volta
 * che qualcuno usa la manopola. Ogni metodo è legato all'istanza vera, quindi
 * `this` dentro il provider è il provider e le chiamate interne non
 * riattraversano il Proxy: a fallire è ciò che le schermate chiedono, non ciò
 * che il mock si dice da sé. I guardrail passano di qui come se non ci fosse.
 *
 * Un `Proxy` e non un involucro scritto a mano: i metodi sono 42, e
 * riscriverli sarebbe il secondo elenco che diverge dal primo — lo stesso
 * difetto che il §5.5 vieta ai numeri.
 *
 * I messaggi sono testo per chi sviluppa e **non passano dal dizionario**,
 * come quelli dei guardrail: ciò che la schermata mostra all'utente è un'altra
 * cosa, e sta in `i18n`.
 *
 * NOTA SUL CONTEGGIO DEI GUARDRAIL (§5.6): questo file non aggiunge nessuna
 * chiamata alle due primitive contate — usa `raiseOutsideCurrentStack`, come
 * `prefetch.ts`, che è la terza e sta fuori dai 96 per criterio. I 96 restano
 * 96.
 */

const FAIL_PARAM = "fail";
const EMPTY_PARAM = "empty";

/** Metodo del provider → quante chiamate deve ancora far fallire. */
type FaultPlan = Map<string, number>;

/**
 * I nomi di metodo dichiarati in un parametro, verificati sul provider.
 *
 * Un nome sbagliato non romperebbe niente, e questo è il problema: la manopola
 * sembrerebbe girata e la schermata resterebbe intera, quindi si concluderebbe
 * che lo stato non c'è quando invece non è stato chiesto.
 */
function* declaredMethods(
  search: string,
  param: string,
  provider: DataProvider,
): Generator<{ method: string; argument: string | undefined }> {
  const raw = new URLSearchParams(search).get(param);
  if (raw === null) return;

  for (const entry of raw.split(",")) {
    const [rawName, argument] = entry.split(":");
    const method = rawName.trim();
    if (method === "") continue;

    if (!(method in provider)) {
      raiseOutsideCurrentStack(
        `[fault] "${method}" non è un metodo di DataProvider: controlla il nome in ?${param}=.`,
      );
      continue;
    }

    yield { method, argument };
  }
}

function parseFaultPlan(search: string, provider: DataProvider): FaultPlan {
  const plan: FaultPlan = new Map();

  for (const { method, argument } of declaredMethods(
    search,
    FAIL_PARAM,
    provider,
  )) {
    const times =
      argument === undefined ? Number.POSITIVE_INFINITY : Number(argument);
    if (!Number.isInteger(times) && times !== Number.POSITIVE_INFINITY) {
      raiseOutsideCurrentStack(
        `[fault] la soglia di "${method}" deve essere un intero: "${argument}" non lo è.`,
      );
      continue;
    }
    if (times < 1) {
      raiseOutsideCurrentStack(
        `[fault] la soglia di "${method}" è ${times}, quindi non fallirebbe nessuna chiamata.`,
      );
      continue;
    }

    plan.set(method, times);
  }

  return plan;
}

function parseEmptyPlan(search: string, provider: DataProvider): Set<string> {
  const plan = new Set<string>();
  for (const { method } of declaredMethods(search, EMPTY_PARAM, provider)) {
    plan.add(method);
  }
  return plan;
}

export function withFaultInjection(provider: DataProvider): DataProvider {
  const failing = parseFaultPlan(window.location.search, provider);
  const emptying = parseEmptyPlan(window.location.search, provider);

  if (failing.size > 0 || emptying.size > 0) {
    // la manopola è girata: si dice, perché da qui in poi una schermata rotta
    // o vuota è voluta e non va diagnosticata come un difetto
    console.info(
      `[fault] iniezione attiva — guasto: ${[...failing.keys()].join(", ") || "nessuno"}; vuoto: ${[...emptying].join(", ") || "nessuno"}. Esiste solo in sviluppo.`,
    );
  }

  return new Proxy(provider, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== "function") return value;

      const name = String(property);
      const method = value.bind(target) as (
        ...args: unknown[]
      ) => Promise<unknown>;

      /* Il guasto vince sul vuoto: sono due stati diversi e uno solo si vede. */
      if (failing.has(name)) {
        return (...args: unknown[]) => {
          const remaining = failing.get(name) ?? 0;
          if (remaining <= 0) return method(...args);
          failing.set(name, remaining - 1);

          /*
           * Si **rifiuta**, non si lancia: è la promise rifiutata che
           * react-query cattura e trasforma nell'`isError` che le schermate
           * mostrano. È la stessa meccanica che ai guardrail dentro una
           * mutation faceva danno — lì il messaggio spariva dentro lo stato
           * della mutation invece di fermare chi lavorava — e qui è
           * esattamente ciò che si vuole: quello stato è la consegna.
           */
          return Promise.reject(
            new Error(
              `[fault] ${name} fallisce per ?${FAIL_PARAM}=. È un guasto simulato, e vive solo in sviluppo.`,
            ),
          );
        };
      }

      if (emptying.has(name)) {
        return async (...args: unknown[]) => {
          /*
           * Si svuota **quello che il metodo restituisce davvero**, invece di
           * tenere un elenco di quali metodi danno liste e quali slot: quello
           * sarebbe il secondo elenco che diverge dal primo. Una lista diventa
           * vuota, tutto il resto diventa `null` — che sono le due forme in cui
           * il contratto dice "non c'è niente" (`docs/CONTRATTO-DATI.md` §2).
           *
           * Il metodo vero viene chiamato lo stesso: svuotare la risposta e non
           * la chiamata tiene onesti i guardrail che stanno dentro il provider.
           */
          const real = await method(...args);
          return Array.isArray(real) ? [] : null;
        };
      }

      return method;
    },
  });
}
