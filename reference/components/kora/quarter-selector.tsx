"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quarterKey, sameQuarter, type Quarter } from "@/lib/data/types";
import { it, t } from "@/lib/i18n/it";

/*
 * Selettore del trimestre della dashboard HR (§8.A.1). Registro strumento.
 *
 * Nessuna larghezza fissa sul trigger: l'etichetta di un trimestre è più
 * lunga in tedesco, e il componente deve dimensionarsi sul contenuto (§2.6).
 *
 * Il trimestre in corso porta un suffisso: è un periodo parziale, e i suoi
 * numeri vanno letti sapendolo.
 */
export function QuarterSelector({
  quarters,
  value,
  currentQuarter,
  onChange,
}: {
  quarters: Quarter[];
  value: Quarter;
  currentQuarter: Quarter;
  onChange: (quarter: Quarter) => void;
}) {
  const labelFor = (quarter: Quarter) =>
    t(
      sameQuarter(quarter, currentQuarter)
        ? it.hr.quarterLabelCurrent
        : it.hr.quarterLabel,
      { quarter: quarter.quarter, year: quarter.year },
    );

  return (
    <Select
      value={quarterKey(value)}
      onValueChange={(key) => {
        const next = quarters.find((quarter) => quarterKey(quarter) === key);
        if (next) onChange(next);
      }}
    >
      <SelectTrigger
        aria-label={it.hr.quarterSelectorLabel}
        className="border-petrol-700 bg-petrol-800 text-white hover:bg-petrol-700"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {quarters.map((quarter) => (
          <SelectItem key={quarterKey(quarter)} value={quarterKey(quarter)}>
            {labelFor(quarter)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
