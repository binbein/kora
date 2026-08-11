import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Heart,
  Puzzle,
  Shield,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import Footer from "@/components/public/Footer";
import {
  useAppointments,
  useCompany,
  useCurrentQuarter,
  useEmployeeProfile,
  useHrReport,
  usePlans,
  useProfessionals,
} from "@/lib/data/queries";
import { ErrorNotice } from "@/components/kora/StateNotice";
import type { Plan } from "@/lib/data/types";
import { professionalDisplayName } from "@/lib/data/types";
import { planFeatures, type PlanFeatureKey } from "@/lib/plan-features";
import {
  computeRoi,
  DEFAULT_EMPLOYEES,
  roundToHundreds,
} from "@/lib/roi-model";
import {
  formatCHF,
  formatNumber,
  formatPercent,
  formatRatio,
  formatSigned,
  formatTime,
  formatWeekdayShort,
} from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * La landing (CLAUDE.md §10.A.1).
 *
 * Parla a **un'azienda che valuta**, non a un dipendente che usa: registro
 * strumento, terza persona, metrico (§7). Il prodotto ha un lato consumer e la
 * miniatura dell'hero lo mostra, ma il testo attorno non prende in prestito il
 * suo tono.
 *
 * Le animazioni di framer-motion restano: il §6.2 vieta l'ingresso **sui
 * grafici**, e il §3 tiene la libreria proprio per questa schermata. Qui non
 * ci sono grafici.
 */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/**
 * Le voci che l'anteprima mostra di ogni piano.
 *
 * È un sottoinsieme **dichiarato per chiave**, non "le prime cinque": le righe
 * vengono da `plan-features.ts` come quelle di `/pricing`, quindi le due
 * schermate possono mostrarne un numero diverso ma non possono dirne una
 * diversa (§10.A).
 */
const PREVIEW_FEATURES: PlanFeatureKey[] = [
  "sessions",
  "intro",
  "coach",
  "psychiatrist",
  "virtualDoctor",
  "checkup",
  "aiPlan",
  // la dashboard entra nell'anteprima: è la voce che distingue i tre piani dal
  // punto di vista di chi compra, ed è a un'azienda che questa pagina parla
  "hrDashboard",
  "extraSession",
];

/*
 * La miniatura del prodotto nell'hero.
 *
 * Legge dal provider, e non è pedanteria: il riquadro ereditato dichiarava un
 * punteggio di 74 dove Laura ne ha 78, un "Sonno 6.2h" che il §8 non contiene,
 * un'adozione dell'"82%" che era il numero degli iscritti travestito da
 * percentuale, e uno "Stress −8%" che la migrazione dell'area HR ha già
 * dimostrato non riproducibile dalla serie. Quattro cifre su quattro
 * sbagliate, sulla prima schermata che un investitore vede.
 */
function HeroProductPreview() {
  const { data: profile } = useEmployeeProfile();
  const { data: company } = useCompany();
  const { data: quarter } = useCurrentQuarter();
  const { data: report } = useHrReport(quarter);
  const { data: appointments } = useAppointments();
  const { data: professionals } = useProfessionals();

  /*
   * Qui i tre casi collassano di proposito (M5.b), come il riquadro della nav
   * professionista: questo è il mockup di prodotto dentro l'hero, e in tutti e
   * tre — in attesa, dato assente, lettura fallita — la cosa giusta è non
   * disegnarlo. Un riquadro d'errore sulla **prima schermata che un
   * investitore vede** direbbe che il prodotto è rotto, mentre il testo
   * dell'hero accanto sta in piedi da solo.
   */
  if (!profile || !company || !report || !appointments || !professionals) {
    return null;
  }

  const health = profile.healthProfile;
  const next = appointments[0];
  const withNext = next
    ? professionals.find(
        (professional) => professional.id === next.professionalId,
      )
    : undefined;

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {t.public.landing.mockup.scoreLabel}
            </p>
            <p className="text-3xl font-bold font-display text-primary tabular-nums">
              {formatNumber(health.score)}
              <span className="text-lg text-muted-foreground">
                {t.public.landing.mockup.scoreOutOf}
              </span>
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center">
            <Heart className="w-6 h-6 text-secondary" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="bg-accent text-accent-foreground rounded-lg px-3 py-1.5 text-xs font-semibold">
            {t.healthSummary[health.summaryKey]}
          </span>
          <span className="bg-accent text-accent-foreground rounded-lg px-3 py-1.5 text-xs font-semibold">
            {interpolate(t.public.landing.mockup.focus, {
              area: t.healthArea[health.weakestArea].toLowerCase(),
            })}
          </span>
        </div>

        {/* L'appuntamento vero, non un "domani 10:00" con un nome inventato:
            la Dr.ssa Bianchi non è nel roster del §8. */}
        {next && withNext ? (
          <div className="bg-secondary/10 rounded-lg p-3 flex items-center gap-3">
            <Brain className="w-5 h-5 text-secondary flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium">
                {t.public.landing.mockup.nextSessionLabel}
              </p>
              <p className="text-[11px] text-muted-foreground tabular-nums">
                {interpolate(t.public.landing.mockup.nextSessionValue, {
                  weekday: formatWeekdayShort(next.start),
                  time: formatTime(next.start),
                  professional: professionalDisplayName(withNext),
                })}
              </p>
            </div>
          </div>
        ) : null}

        <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium">
              {t.public.landing.mockup.analyticsLabel}
            </p>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {report.stressTrendPoints === null
                ? interpolate(t.public.landing.mockup.analyticsValueNoTrend, {
                    adoption: formatPercent(report.adoptionPercent),
                  })
                : interpolate(t.public.landing.mockup.analyticsValue, {
                    adoption: formatPercent(report.adoptionPercent),
                    trend: formatSigned(report.stressTrendPoints),
                  })}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
        <Shield className="w-3 h-3" aria-hidden="true" /> {t.public.landing.mockupSeal}
      </div>
    </div>
  );
}

function ProblemCard({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow group">
      <div className="p-2.5 bg-destructive/10 rounded-xl w-fit mb-3 group-hover:bg-destructive/15 transition-colors">
        <Icon className="w-5 h-5 text-destructive" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
    </Card>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "secondary" | "executive";
}) {
  const bgMap = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    executive: "bg-executive/10",
  };
  const textMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    executive: "text-executive",
  };
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className={`p-3 ${bgMap[color]} rounded-xl w-fit mb-4`}>
        <Icon className={`w-6 h-6 ${textMap[color]}`} aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Card>
  );
}

/**
 * Il richiamo al calcolatore, con i numeri di ancoraggio del §9.
 *
 * Li calcola col modello e col prezzo del piano, come `/roi`: scriverli qui
 * sarebbe una seconda fonte che il giorno di una revisione delle costanti
 * resterebbe indietro senza che nulla si rompa.
 */
function RoiTeaser({ plan }: { plan: Plan }) {
  const estimate = computeRoi(DEFAULT_EMPLOYEES, plan.monthlyPricePerEmployee);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold font-display">
        {t.public.landing.roiTeaser.title}
      </h2>
      <div className="space-y-2">
        {/* Il campione è dichiarato: un importo senza l'organico su cui è
            calcolato non è verificabile da chi legge. */}
        <p className="text-lg text-muted-foreground tabular-nums">
          {interpolate(t.public.landing.roiTeaser.losses, {
            employees: formatNumber(estimate.employees),
            amount: formatCHF(estimate.totalLossesChf),
          })}
        </p>
        <p className="text-lg font-semibold tabular-nums">
          {interpolate(t.public.landing.roiTeaser.net, {
            amount: formatCHF(estimate.netSavingsChf),
            ratio: interpolate(t.public.roi.ratioValue, {
              ratio: formatRatio(estimate.roiRatio),
            }),
          })}
        </p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {interpolate(t.public.roi.perEmployee, {
            amount: formatCHF(
              roundToHundreds(estimate.savingsChf / estimate.employees),
            ),
          })}
        </p>
      </div>
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        asChild
      >
        <Link to="/roi">
          {t.public.landing.roiTeaser.cta}
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function PlanPreviewCard({ plan }: { plan: Plan }) {
  const recommended = plan.id === "plus";
  const features = planFeatures(plan).filter((feature) =>
    PREVIEW_FEATURES.includes(feature.key),
  );

  return (
    <Card
      className={`p-6 relative flex flex-col ${
        recommended ? "ring-2 ring-secondary shadow-xl" : "hover:shadow-lg"
      } transition-all`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-4 py-1 rounded-full">
          {t.public.plans.recommended}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold font-display">{t.plan[plan.id]}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t.public.plans.target[plan.id]}
        </p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold font-display tabular-nums">
          {formatCHF(plan.monthlyPricePerEmployee)}
        </span>
        <span className="text-sm text-muted-foreground">
          {" "}
          {t.public.plans.priceUnit}
        </span>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature.key} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${recommended ? "bg-primary hover:bg-primary/90" : ""}`}
        variant={recommended ? "default" : "outline"}
        asChild
      >
        <Link to="/demo">{t.public.plans.cta}</Link>
      </Button>
    </Card>
  );
}

export default function Landing() {
  const plansQuery = usePlans();
  const plans = plansQuery.data;

  /*
   * I tre casi (M5.b) **non sono di pagina**: il listino alimenta due sezioni
   * su otto, e le altre sei — hero, problema, tre livelli di valore, privacy,
   * CTA — non hanno bisogno di lui. Bloccare tutta la landing per una lettura
   * che riguarda un quinto della pagina toglierebbe più di quanto il guasto
   * abbia rotto.
   */
  const plusPlan = plans?.find((plan) => plan.id === "plus");

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5">
                <Shield className="w-3.5 h-3.5 text-accent-foreground" aria-hidden="true" />
                <span className="text-xs font-semibold text-accent-foreground">
                  {t.public.landing.badge}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight text-foreground">
                {t.public.landing.heroTitleLead}{" "}
                <span className="text-secondary-strong">
                  {t.public.landing.heroTitleAccent}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t.public.landing.heroBody}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8"
                  asChild
                >
                  <Link to="/roi">
                    {t.public.landing.heroCtaRoi}
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8"
                  asChild
                >
                  <Link to="/demo">{t.public.landing.heroCtaDemo}</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                {t.public.landing.heroCompliance}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <HeroProductPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {t.public.landing.problemTitle}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <ProblemCard
              icon={AlertTriangle}
              title={t.public.landing.problem.burnout}
            />
            <ProblemCard
              icon={TrendingDown}
              title={t.public.landing.problem.absenteeism}
            />
            <ProblemCard
              icon={Clock}
              title={t.public.landing.problem.waitingLists}
            />
            <ProblemCard
              icon={Puzzle}
              title={t.public.landing.problem.fragmented}
            />
            <ProblemCard
              icon={BarChart3}
              title={t.public.landing.problem.noData}
            />
          </div>
        </div>
      </section>

      {/* Il ritorno, con i numeri di ancoraggio */}
      {plusPlan ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <RoiTeaser plan={plusPlan} />
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Tre livelli di valore */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {t.public.landing.valueTitle}
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={UserCheck}
              title={t.public.landing.value.employee.title}
              description={t.public.landing.value.employee.body}
              color="secondary"
            />
            <ValueCard
              icon={Building2}
              title={t.public.landing.value.company.title}
              description={t.public.landing.value.company.body}
              color="primary"
            />
            <ValueCard
              icon={Briefcase}
              title={t.public.landing.value.professional.title}
              description={t.public.landing.value.professional.body}
              color="executive"
            />
          </div>
        </div>
      </section>

      {/* Anteprima piani */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {t.public.landing.plansTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.public.landing.plansSubtitle}
            </p>
          </motion.div>
          {plansQuery.isError ? (
            <Card className="max-w-5xl mx-auto">
              <ErrorNotice
                copy={t.common.state.error}
                onRetry={() => plansQuery.refetch()}
              />
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {(plans ?? []).map((plan) => (
                <PlanPreviewCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
          <p className="text-center mt-8">
            <Link
              to="/pricing"
              className="text-sm text-secondary-strong hover:underline font-medium"
            >
              {t.public.landing.plansAll}
            </Link>
          </p>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex p-4 bg-accent rounded-2xl">
              <Shield className="w-10 h-10 text-secondary" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              {t.public.landing.privacyTitleLead}{" "}
              <span className="text-secondary-strong">
                {t.public.landing.privacyTitleAccent}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.public.landing.privacyBody}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                t.public.landing.privacyChip.hosting,
                t.public.landing.privacyChip.gdpr,
                t.public.landing.privacyChip.lpd,
                t.public.landing.privacyChip.encryption,
              ].map((chip) => (
                <div
                  key={chip}
                  className="flex items-center gap-2 bg-accent/60 rounded-full px-4 py-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
                  <span className="text-sm font-medium">{chip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            {t.public.landing.finalTitle}
          </h2>
          <p className="text-lg opacity-80">{t.public.landing.finalBody}</p>
          <Button
            size="lg"
            className="bg-background hover:bg-background/90 text-primary text-base px-10"
            asChild
          >
            <Link to="/demo">
              {t.public.landing.finalCta}
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
