import { Wordmark } from "@/components/kora/wordmark";

/*
 * Intestazione della landing: solo il marchio. Niente menu di navigazione,
 * perché non ci sono altre pagine pubbliche da raggiungere e un menu con una
 * voce sola è peggio di nessun menu.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <Wordmark className="text-petrol-900" />
      </div>
    </header>
  );
}
