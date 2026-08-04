"use client";

import { BadgeCheck, PiggyBank, TrendingUp, Users } from "lucide-react";
import { AlertBanner } from "@/components/kora/alert-banner";
import { LevelBadge } from "@/components/kora/level-badge";
import { MaskedValue } from "@/components/kora/masked-value";
import { PrivacyNote } from "@/components/kora/privacy-note";
import { StatCard } from "@/components/kora/stat-card";
import { StressBar } from "@/components/kora/stress-bar";
import { Wordmark } from "@/components/kora/wordmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCHF, formatNumber, formatPercent } from "@/lib/format";
import { it, t } from "@/lib/i18n/it";
import { dataProvider } from "@/lib/data";
import { adoptionPercent } from "@/lib/data/types";
import { Section, Specimen, SubHeading } from "./_shell";

/*
 * Registro HR: compatto, da strumento, terza persona. Card a raggio 10,
 * pulsanti rettangolari, densità alta.
 */
export function HrRegisterSection() {
  const company = dataProvider.getCompany();
  const departments = dataProvider.getDepartments();
  const latestStress = dataProvider.getLatestStressByDepartment();
  const roi = dataProvider.getRoiSnapshot(dataProvider.getCurrentQuarter());

  return (
    <Section
      id="registro-hr"
      title="Registro HR"
      note="Dashboard e landing: forme compatte, tono professionale e metrico, densità da strumento di lavoro."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-petrol-900 px-5 py-4 text-white">
        <Wordmark />
        <p className="text-teal-200">
          {t(it.hr.companySubtitle, {
            name: company.name,
            count: formatNumber(company.employeeCount),
          })}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <AlertBanner
          title={t(it.hr.alertTitle, { department: "Vendite" })}
          description={it.hr.alertDescription}
          action={
            <Button size="sm" variant="outline">
              {it.hr.alertAction}
            </Button>
          }
        />
        <AlertBanner
          variant="danger"
          title={t(it.hr.alertTitle, { department: "Vendite" })}
          description="Variante danger, riservata agli stati critici."
        />
      </div>

      <div className="mt-8">
        <SubHeading>KPI</SubHeading>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={it.hr.kpiSavings}
            value={formatCHF(roi.savedChf)}
            hint={t(it.hr.savingsHint, {
              days: formatNumber(roi.avoidedAbsenceDays),
            })}
            icon={<PiggyBank className="size-4" />}
          />
          <StatCard
            label={it.hr.kpiAdoption}
            value={formatPercent(adoptionPercent(company, roi))}
            hint={t(it.hr.adoptionHint, {
              enrolled: formatNumber(roi.enrolledEmployees),
              active: formatNumber(roi.activeEmployees),
            })}
            icon={<Users className="size-4" />}
          />
          <StatCard
            label={it.hr.kpiStress}
            value={it.domain.stressLevel.medium}
            hint={it.hr.stressHint}
            tone="warn"
            icon={<TrendingUp className="size-4" />}
          />
          <StatCard
            label={it.hr.kpiSessions}
            value={formatNumber(roi.sessionsUsed)}
            hint={t(it.hr.sessionsHint, {
              used: formatNumber(roi.sessionsUsed),
              total: formatNumber(roi.sessionsTotal),
            })}
            progressPercent={
              roi.sessionsTotal > 0
                ? (roi.sessionsUsed / roi.sessionsTotal) * 100
                : 0
            }
            icon={<BadgeCheck className="size-4" />}
          />
        </div>
      </div>

      <div className="mt-8">
        <SubHeading>{it.hr.stressByDepartment}</SubHeading>
        <div className="mt-3 divide-y divide-gray-200 rounded-card border border-gray-200 px-4">
          {departments.map((department, index) => (
            <StressBar
              key={department.id}
              departmentName={department.name}
              employeeCount={department.employeeCount}
              respondents={department.respondents}
              record={latestStress[index]}
            />
          ))}
        </div>
        <PrivacyNote className="mt-3" />
      </div>

      <div className="mt-8">
        <SubHeading>Etichette e valori oscurati</SubHeading>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <LevelBadge level="low" />
          <LevelBadge level="medium" />
          <LevelBadge level="high" />
          <MaskedValue />
          <Badge>Piano Plus</Badge>
          <Badge variant="secondary">Trimestre corrente</Badge>
        </div>
      </div>

      <div className="mt-8">
        <SubHeading>Componenti base nel registro HR</SubHeading>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Specimen label="Button — variant default, outline, secondary, ghost">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Scarica il report</Button>
              <Button variant="outline">Filtra</Button>
              <Button variant="secondary">Confronta</Button>
              <Button variant="ghost">Annulla</Button>
            </div>
          </Specimen>

          <Specimen label="Select + Input">
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="q3">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">1° trimestre 2026</SelectItem>
                  <SelectItem value="q2">2° trimestre 2026</SelectItem>
                  <SelectItem value="q3">3° trimestre 2026</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Cerca reparto" className="w-44" />
            </div>
          </Specimen>

          <Specimen label="Card + Separator">
            <Card>
              <CardHeader>
                <CardTitle>Report trimestrale</CardTitle>
                <CardDescription>
                  Pronto per il consiglio di amministrazione.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-3" />
                <p className="text-gray-600">
                  Include stress per reparto, adozione e risparmio stimato.
                </p>
              </CardContent>
            </Card>
          </Specimen>

          <Specimen label="Tabs">
            <Tabs defaultValue="reparti">
              <TabsList>
                <TabsTrigger value="reparti">Reparti</TabsTrigger>
                <TabsTrigger value="trend">Trend</TabsTrigger>
              </TabsList>
              <TabsContent value="reparti" className="pt-3 text-gray-600">
                Stress dell&apos;ultimo mese, per reparto.
              </TabsContent>
              <TabsContent value="trend" className="pt-3 text-gray-600">
                Andamento degli ultimi dodici mesi.
              </TabsContent>
            </Tabs>
          </Specimen>

          <Specimen label="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Apri la finestra</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Soglia di anonimato</DialogTitle>
                  <DialogDescription>
                    {t(it.hr.suppressedTooltip, { threshold: 15 })}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>{it.common.close}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Specimen>
        </div>
      </div>
    </Section>
  );
}
