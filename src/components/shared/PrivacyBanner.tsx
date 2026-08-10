import { Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * La nota sulla privacy, dove il dipendente ha bisogno di leggerla.
 *
 * `message` non ha un valore di default e non è opzionale: un banner che dice
 * qualcosa di generico perché chi lo monta non ha deciso cosa dire è peggio di
 * un banner assente — la privacy è un argomento di vendita (§7), e la frase
 * cambia da schermata a schermata. Le frasi stanno in `i18n`.
 *
 * L'icona invece un default ce l'ha, ed è lo scudo del percorso dipendente. Le
 * due schermate HR passano il lucchetto, che è quello che il §7 chiede sulla
 * dashboard: due chiamanti su quattro, quindi è un'opzione usata e non una che
 * nessuno passa (§11). Prima quelle due riscrivevano il markup a mano, e le
 * quattro classi del riquadro esistevano in tre copie libere di divergere.
 */
export default function PrivacyBanner({
  message,
  icon: Icon = Shield,
}: {
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3 bg-accent/60 border border-secondary/20 rounded-lg px-4 py-3">
      <Icon className="w-5 h-5 text-secondary flex-shrink-0" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
