import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyBanner({ message }) {
  return (
    <div className="flex items-center gap-3 bg-accent/60 border border-secondary/20 rounded-lg px-4 py-3">
      <Shield className="w-5 h-5 text-secondary flex-shrink-0" />
      <p className="text-sm text-muted-foreground">
        {message || "I dati sono aggregati e anonimizzati. HealthOS non mostra mai dati sanitari individuali."}
      </p>
    </div>
  );
}