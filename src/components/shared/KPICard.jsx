import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ title, value, subtitle, icon: Icon, trend, trendLabel, variant = 'default' }) {
  const bgMap = {
    default: 'bg-card',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent',
  };

  return (
    <Card className={`${bgMap[variant]} p-5 relative overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className={`text-xs font-medium uppercase tracking-wider ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold font-display ${variant === 'default' ? 'text-foreground' : ''}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${variant === 'default' ? 'text-muted-foreground' : 'opacity-70'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${variant === 'default' ? 'bg-accent' : 'bg-white/15'}`}>
            <Icon className={`w-5 h-5 ${variant === 'default' ? 'text-secondary' : ''}`} />
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-secondary" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
          )}
          <span className={`text-xs font-medium ${trend > 0 ? 'text-secondary' : 'text-destructive'}`}>
            {trend > 0 ? '+' : ''}{trend}% {trendLabel}
          </span>
        </div>
      )}
    </Card>
  );
}