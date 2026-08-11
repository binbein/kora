import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/*
 * LA POLARITÀ: il colore segue il beneficio, la freccia segue il segno
 * (CLAUDE.md §6.1).
 *
 * Sta sul **valore** e non su una riga sotto, perché è il valore a essere un
 * delta: "Stress medio −2 punti" è la buona notizia della dashboard, quindi
 * esce verde con la freccia in giù. Un rosso su ogni segno meno racconterebbe
 * il contrario della storia del §8.
 *
 * `goodWhen` non ha un valore di default apposta: dimenticarlo è esattamente
 * l'errore che questa regola esiste per impedire, e senza default TypeScript lo
 * chiede a chi scrive la KPI.
 */
type Polarity = {
  /** Il segno del valore mostrato: guida la freccia e, con `goodWhen`, il colore */
  sign: number;
  goodWhen: 'up' | 'down';
};

function improvingWith(value: number, goodWhen: 'up' | 'down'): boolean | null {
  if (value === 0) return null;
  return goodWhen === 'up' ? value > 0 : value < 0;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  polarity,
  variant = 'default',
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  polarity?: Polarity;
  variant?: 'default' | 'primary' | 'accent';
}) {
  const bgMap = {
    default: 'bg-card',
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-accent',
  };

  const improving =
    polarity === undefined
      ? null
      : improvingWith(polarity.sign, polarity.goodWhen);

  const toneClass =
    improving === null ? '' : improving ? 'text-secondary' : 'text-destructive';

  return (
    <Card className={`${bgMap[variant]} p-5 relative overflow-hidden`}>
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-1 min-w-0">
          <p className={`text-xs font-medium uppercase tracking-wider ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}`}>
            {title}
          </p>
          <p className={`flex items-center gap-1.5 text-2xl font-bold font-display tabular-nums ${toneClass || (variant === 'default' ? 'text-foreground' : '')}`}>
            {improving !== null &&
              (polarity!.sign > 0 ? (
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-5 h-5 flex-shrink-0" />
              ))}
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${variant === 'default' ? 'text-muted-foreground' : 'opacity-70'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${variant === 'default' ? 'bg-accent' : 'bg-white/15'}`}>
            <Icon className={`w-5 h-5 ${variant === 'default' ? 'text-secondary' : ''}`} />
          </div>
        )}
      </div>
    </Card>
  );
}
