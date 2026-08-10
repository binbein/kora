import React from 'react';
import { t } from '@/lib/i18n';

export default function KoraLogo({ size = 'md', light = false }) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
    xl: { icon: 56, text: 'text-4xl' },
  };
  const s = sizes[size];
  const color = light ? '#FFFFFF' : 'hsl(var(--primary))';
  const tealColor = 'hsl(var(--secondary))';

  return (
    <div className="flex items-center gap-2">
      <svg width={s.icon} height={s.icon} viewBox="0 0 48 48" fill="none">
        {/* Modular grid / OS feeling */}
        <rect x="4" y="4" width="18" height="18" rx="4" fill={tealColor} opacity="0.15" />
        <rect x="26" y="4" width="18" height="18" rx="4" fill={tealColor} opacity="0.1" />
        <rect x="4" y="26" width="18" height="18" rx="4" fill={tealColor} opacity="0.1" />
        <rect x="26" y="26" width="18" height="18" rx="4" fill={tealColor} opacity="0.15" />
        {/* Swiss cross - soft, centered */}
        <rect x="20" y="12" width="8" height="24" rx="3" fill={tealColor} />
        <rect x="12" y="20" width="24" height="8" rx="3" fill={tealColor} />
        {/* Connection dots - network feeling */}
        <circle cx="8" cy="8" r="2" fill={color} opacity="0.4" />
        <circle cx="40" cy="8" r="2" fill={color} opacity="0.4" />
        <circle cx="8" cy="40" r="2" fill={color} opacity="0.4" />
        <circle cx="40" cy="40" r="2" fill={color} opacity="0.4" />
      </svg>
      <div className="flex items-baseline gap-0">
        <span className={`${s.text} font-display font-bold tracking-tight`} style={{ color }}>
          {t.common.appName}
        </span>
      </div>
    </div>
  );
}