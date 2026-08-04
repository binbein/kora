"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterChip } from "@/components/kora/filter-chip";
import { StatCard } from "@/components/kora/stat-card";
import { dataProvider } from "@/lib/data";
import { formatCHF, formatNumber } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { Section, Specimen, SubHeading } from "./_shell";

/*
 * Stati degli elementi interattivi. La demo si presenta anche da tastiera
 * durante un pitch (§9): l'anello di focus non è un dettaglio di rifinitura,
 * è parte di come la si guida.
 */

/*
 * Il provino della StatCard mostra la KPI vera della dashboard, non due cifre
 * ricopiate: erano scritte a mano e i giorni di assenza evitati sono rimasti a
 * 31 quando il dataset è passato a derivarli dal risparmio (§6). Questa è la
 * pagina che si mostra a un occhio esterno, quindi è l'ultimo posto in cui un
 * numero può divergere dalle schermate.
 */
const SAVINGS = dataProvider.getRoiSnapshot(dataProvider.getCurrentQuarter());

export function StatesSection() {
  const [loading, setLoading] = useState(false);
  const [chipOn, setChipOn] = useState(true);

  return (
    <Section
      id="stati"
      title="Stati"
      note="Focus, hover, selezione, disabilitato e caricamento. Naviga con Tab: ogni elemento interattivo deve mostrare l'anello petrol-700 a due pixel di distanza."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen label="Focus — prova con Tab, non con il mouse">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Registro HR</Button>
            <Button className="rounded-pill">Registro app</Button>
            <Input placeholder="Campo di testo" className="w-40" />
            <a
              href="#stati"
              className="rounded-btn px-2 py-1 text-petrol-700 underline underline-offset-4"
            >
              Link
            </a>
          </div>
        </Specimen>

        <Specimen label="Hover — passa sopra senza cliccare">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Predefinito</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="secondary">Secondario</Button>
            <Button variant="ghost">Trasparente</Button>
          </div>
        </Specimen>

        <Specimen label="Selezione — chip e stato premuto">
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip
              label="sonno"
              selected={chipOn}
              onClick={() => setChipOn((value) => !value)}
            />
            <FilterChip label="non selezionato" />
          </div>
        </Specimen>

        <Specimen label="Disabilitato — nessun puntatore, opacità ridotta">
          <div className="flex flex-wrap items-center gap-2">
            <Button disabled>Predefinito</Button>
            <Button variant="outline" disabled>
              Contorno
            </Button>
            <Input placeholder="Campo disabilitato" disabled className="w-44" />
          </div>
        </Specimen>

        <Specimen label="Caricamento — Skeleton al posto del contenuto">
          <div className="space-y-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLoading((value) => !value)}
            >
              {loading ? "Mostra i dati" : "Simula il caricamento"}
            </Button>
            {loading ? (
              <div className="space-y-2 rounded-card border border-gray-200 px-4 py-3.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            ) : (
              <StatCard
                label={it.hr.kpiSavings}
                value={formatCHF(SAVINGS.savedChf)}
                hint={t(it.hr.savingsHint, {
                  days: formatNumber(SAVINGS.avoidedAbsenceDays),
                })}
              />
            )}
          </div>
        </Specimen>

        <Specimen label="Progress e Tooltip">
          <div className="space-y-4">
            <Progress value={35} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  Passa sopra o metti a fuoco
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Il tooltip risponde anche da tastiera.
              </TooltipContent>
            </Tooltip>
          </div>
        </Specimen>
      </div>

      <div className="mt-8">
        <SubHeading>Toni della StatCard</SubHeading>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <StatCard label="Tono predefinito" value="CHF 14'200" />
          <StatCard label="Tono warn" value="medio" tone="warn" />
          <StatCard label="Tono danger" value="alto" tone="danger" />
        </div>
      </div>
    </Section>
  );
}
