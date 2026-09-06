import { formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n";

/*
 * L'anello del punteggio del profilo salute (CLAUDE.md §8).
 *
 * **Spostato da `EmployeeHome` e non riscritto** (06.09.2026): lo mostrano in
 * due — la home e l'ultimo passo dell'attivazione (§10.A.6) — e due anelli
 * disegnati due volte sono due rese che possono divergere sullo stesso numero.
 * Il diff di questo file si legge come "stesso codice, in un posto raggiungibile
 * da entrambi".
 */
export default function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display tabular-nums">
          {formatNumber(score)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {t.employee.home.scoreOutOf}
        </span>
      </div>
    </div>
  );
}
