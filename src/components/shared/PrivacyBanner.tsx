import { Shield } from "lucide-react";

/**
 * La nota sulla privacy, dove il dipendente ha bisogno di leggerla.
 *
 * `message` non ha un valore di default e non è opzionale: un banner che dice
 * qualcosa di generico perché chi lo monta non ha deciso cosa dire è peggio di
 * un banner assente — la privacy è un argomento di vendita (§7), e la frase
 * cambia da schermata a schermata. Le frasi stanno in `i18n`.
 */
export default function PrivacyBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 bg-accent/60 border border-secondary/20 rounded-lg px-4 py-3">
      <Shield className="w-5 h-5 text-secondary flex-shrink-0" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
