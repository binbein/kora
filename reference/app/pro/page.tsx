"use client";

import { ProfessionalHeader } from "@/components/kora/professional-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/lib/data/use-data";
import { it } from "@/lib/i18n/it";
import { CalendarView } from "./_views/calendar";
import { EarningsView } from "./_views/earnings";

/*
 * Portale del professionista (CLAUDE.md §8.D). È il terzo lato del
 * marketplace: dopo l'azienda che compra e il dipendente che usa, la persona
 * che eroga. Deve essere credibile, non completo — due viste statiche e
 * nessuna azione oltre al passaggio dall'una all'altra.
 *
 * I dati passano dal provider come nelle altre schermate, quindi una
 * prenotazione fatta durante la demo nel percorso dipendente compare qui: è
 * la dimostrazione che i tre lati guardano lo stesso sistema, e costa solo il
 * fatto di non tenere una copia locale dei dati.
 */
export default function ProfessionalPortalPage() {
  const professional = useData((provider) => provider.getPortalProfessional());
  const referenceDate = useData((provider) => provider.getReferenceDate());
  const sessions = useData((provider) =>
    provider.getProfessionalSessions(professional.id),
  );
  const freeSlots = useData((provider) =>
    provider.getAvailableSlots(professional.id),
  );
  const earnings = useData((provider) =>
    provider.getProfessionalEarnings(professional.id),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader professional={professional} />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">{it.pro.tabCalendar}</TabsTrigger>
            <TabsTrigger value="earnings">{it.pro.tabEarnings}</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            <CalendarView
              sessions={sessions}
              freeSlots={freeSlots}
              referenceDate={referenceDate}
            />
          </TabsContent>

          <TabsContent value="earnings" className="mt-4">
            <EarningsView earnings={earnings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
