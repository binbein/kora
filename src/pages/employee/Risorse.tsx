import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HealthArea } from "@/lib/data/types";
import { HEALTH_AREAS } from "@/lib/health-profile";
import { t } from "@/lib/i18n";
import { RESOURCES, type Resource } from "@/lib/resources";

/*
 * Le risorse (CLAUDE.md §10.B.9).
 *
 * CONTENUTO, NON FUNZIONE. Esercizi e letture brevi, da leggere: nessun audio,
 * nessun video, e nessun pulsante «Inizia», «Salva» o «Fatto» — sarebbero
 * scritture che la demo non simula (§1.1), e un comando che non fa niente
 * davanti a un investitore invita a premerlo. Per la stessa ragione la pagina
 * non legge dal provider: il catalogo è contenuto editoriale e sta in
 * `lib/resources.ts`, che dice perché.
 *
 * IL FILTRO STA NELL'INDIRIZZO, come il servizio in `Psicologi.tsx`: è ciò che
 * permette al piano di benessere di portare qui un'area già scelta
 * (`?area=sleep`). Un valore che non è un'area vale «Tutte» invece di una
 * pagina vuota.
 *
 * NESSUNO STATO VUOTO, e non è una dimenticanza: ogni area ha almeno una voce
 * nel catalogo, quindi nessun filtro produce una griglia vuota, e un ramo che
 * nessun dato raggiunge è codice che il §11 non vuole.
 */

const AREA_PARAM = "area";
const ALL = "all";

type Filter = HealthArea | typeof ALL;

function filterFromParam(value: string | null): Filter {
  return HEALTH_AREAS.find((area) => area === value) ?? ALL;
}

function ResourceGrid({
  resources,
  onOpen,
}: {
  resources: Resource[];
  onOpen: (resource: Resource) => void;
}) {
  const copy = t.employee.resources;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {resources.map((resource) => (
        <button
          key={resource.id}
          type="button"
          onClick={() => onOpen(resource)}
          className="rounded-2xl border bg-card text-card-foreground shadow p-5 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              {copy.kind[resource.kind]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t.healthArea[resource.area]}
            </span>
          </div>
          <h2 className="font-semibold text-sm mt-3">
            {copy.item[resource.id].title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {copy.item[resource.id].lead}
          </p>
        </button>
      ))}
    </div>
  );
}

export default function Risorse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openResource, setOpenResource] = useState<Resource | null>(null);

  /* Letto al render e non a livello di modulo, per il cambio lingua (M5.e). */
  const copy = t.employee.resources;
  const filter = filterFromParam(searchParams.get(AREA_PARAM));
  const filters: Filter[] = [ALL, ...HEALTH_AREAS];

  const onFilterChange = (value: string) =>
    setSearchParams(value === ALL ? {} : { [AREA_PARAM]: value }, {
      replace: true,
    });

  const opened = openResource === null ? null : copy.item[openResource.id];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{copy.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{copy.subtitle}</p>
      </div>

      <Tabs value={filter} onValueChange={onFilterChange}>
        {/* Sei filtri non stanno in una riga su schermo stretto: la lista va a
            capo invece di scorrere, e l'altezza fissa di `TabsList` si toglie
            dal call site, non dentro `ui/` (§3). */}
        <TabsList className="h-auto flex-wrap justify-start">
          {filters.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === ALL ? copy.filterAll : t.healthArea[value]}
            </TabsTrigger>
          ))}
        </TabsList>
        {filters.map((value) => (
          <TabsContent key={value} value={value} className="mt-4">
            <ResourceGrid
              resources={
                value === ALL
                  ? RESOURCES
                  : RESOURCES.filter((resource) => resource.area === value)
              }
              onOpen={setOpenResource}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={openResource !== null}
        onOpenChange={(open) => !open && setOpenResource(null)}
      >
        <DialogContent className="max-w-md">
          {opened !== null && (
            <>
              <DialogHeader>
                <DialogTitle>{opened.title}</DialogTitle>
                <DialogDescription>{opened.lead}</DialogDescription>
              </DialogHeader>
              <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-muted-foreground">
                {Object.values(opened.step).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
