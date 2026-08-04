import { dataProvider } from "@/lib/data";
import { Hero } from "./_sections/hero";
import { Plans } from "./_sections/plans";
import { RoiCalculator } from "./_sections/roi-calculator";
import { SiteFooter } from "./_sections/site-footer";
import { SiteHeader } from "./_sections/site-header";

/*
 * Landing pubblica (CLAUDE.md §8.C). Registro strumento come la dashboard:
 * chi legge qui è la stessa persona che poi guarda i numeri.
 *
 * La pagina è un componente server e il calcolatore è l'unico pezzo client:
 * i dati del listino li legge qui il provider (§5) e scendono come prop, così
 * il piano su cui gira il calcolatore e quello evidenziato nel listino sono
 * per costruzione lo stesso oggetto.
 */
export default function LandingPage() {
  const plans = dataProvider.getPlans();
  const calculatorPlan = dataProvider.getPlan("plus");

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <Hero />
        <RoiCalculator plan={calculatorPlan} />
        <Plans plans={plans} highlightedPlanId={calculatorPlan.id} />
      </main>
      <SiteFooter />
    </div>
  );
}
