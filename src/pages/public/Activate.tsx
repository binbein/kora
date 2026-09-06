import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KoraLogo from "@/components/shared/KoraLogo";
import ScoreRing from "@/components/kora/ScoreRing";
import { ErrorNotice } from "@/components/kora/StateNotice";
import { dataProvider } from "@/lib/data";
import { queryKeys } from "@/lib/data/query-keys";
import type {
  AssessmentAnswers,
  Company,
  HealthProfile,
} from "@/lib/data/types";
import { ASSESSMENT_QUESTIONS } from "@/lib/health-profile";
import { formatNumber } from "@/lib/format";
import { interpolate, t } from "@/lib/i18n";

/*
 * L'attivazione dell'account (CLAUDE.md §10.A.6).
 *
 * Chiude due cose che il prodotto dichiarava e non aveva: **da dove viene il
 * 78/100** — la domanda che un investitore fa per prima guardando il portale
 * dipendente — e **il consenso**, che la privacy HR prometteva già raccolto
 * mentre nessun punto del percorso lo chiedeva
 * (`docs/CONTRATTO-DATI.md` §8.2).
 *
 * QUATTRO PASSI E UNA ROTTA SOLA, e lo stato del passo vive qui (§5.2). Quattro
 * indirizzi sarebbero quattro pagine apribili fuori ordine, e nessuno dei tre di
 * mezzo vuol dire niente da solo: il consenso senza l'azienda a cui si dà, le
 * dieci domande senza il consenso, il profilo senza le risposte.
 *
 * NIENTE BARRA PUBBLICA E NIENTE GUARDIA, come il link anonimo (§10.A.5): chi
 * arriva qui ha ricevuto un invito, non sta navigando il sito.
 */

type Step = "code" | "consent" | "questions" | "profile";

/*
 * Lo schema del codice, costruito a ogni render come quello della richiesta
 * demo (M5.e): i messaggi vengono da `t`, e uno schema di modulo li
 * catturerebbe una volta sola — dopo il cambio lingua l'errore resterebbe
 * italiano.
 *
 * **Non valida la forma del codice**, e non è una dimenticanza: un
 * `DEMO-SA-\d+` sarebbe un formato inventato (§2.4), e a dire se un codice
 * esiste è il provider. Qui si controlla solo che qualcosa sia stato scritto.
 */
function companyCodeSchema() {
  return z.object({
    companyCode: z
      .string()
      .trim()
      .min(1, t.public.activate.code.validation.required),
  });
}

/* Le cinque risposte, da "mai" a "sempre". **5 è il meglio**, al contrario del
   check rapido dove 1 è "molto bene": sono due strumenti con due domande
   diverse, e il commento sta qui perché è il punto in cui si sbaglierebbe. */
const SCALE: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

export default function Activate() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("code");
  const [companyCode, setCompanyCode] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [consent, setConsent] = useState(false);
  /* Compare al tentativo e non prima: dire "serve il consenso" su una casella
     che nessuno ha ancora provato a saltare è un avviso su un errore che non
     c'è. */
  const [consentMissing, setConsentMissing] = useState(false);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({});
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  const form = useForm<{ companyCode: string }>({
    resolver: zodResolver(companyCodeSchema()),
    defaultValues: { companyCode: "" },
  });

  /*
   * IL CODICE SI VERIFICA DOPO IL CONSENSO, E NON È UN'INVERSIONE DEI PASSI.
   *
   * `activate` prende `consent: true` come **tipo letterale**, quindi non
   * esiste un modo di chiamarlo prima che il consenso sia stato dato — che è
   * precisamente ciò che quel tipo esiste per garantire
   * (`docs/CONTRATTO-DATI.md` §4). Il primo passo controlla solo che il campo
   * non sia vuoto; a dire se il codice risolve è questa chiamata, e su un codice
   * sconosciuto si **torna al primo passo** con l'errore sul campo.
   *
   * Verificarlo prima avrebbe voluto dire una seconda lettura pubblica che
   * risponde "questa azienda è cliente di Kora" a chiunque provi una stringa —
   * cioè un oracolo sul portafoglio clienti, che è più di quanto questa
   * schermata debba dare.
   *
   * IL `null` NON È UN ERRORE, ed è la distinzione che tiene onesta la
   * schermata: un codice sconosciuto è la risposta a una domanda mal digitata e
   * si dice sul campo, mentre `isError` è il guasto e ha il suo riquadro.
   *
   * **Non invalida niente**: non scrive nessun record (§4).
   */
  const activate = useMutation({
    mutationFn: (code: string) =>
      dataProvider.activate({ companyCode: code, consent: true }),
    onSuccess: (found) => {
      if (found === null) {
        setStep("code");
        form.setError("companyCode", {
          message: t.public.activate.code.validation.unknown,
        });
        return;
      }
      setCompany(found);
      setStep("questions");
    },
  });

  /*
   * Invalida **la radice del dipendente** e non la sola query del profilo:
   * dalle stesse risposte dipende anche l'ordine delle aree del piano di
   * benessere, che segue l'area debole (§10.A.6).
   */
  const submitAssessment = useMutation({
    mutationFn: (complete: AssessmentAnswers) =>
      dataProvider.submitAssessment(complete),
    onSuccess: (computed) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.root() });
      setProfile(computed);
      setStep("profile");
    },
  });

  const missing = ASSESSMENT_QUESTIONS.filter((id) => answers[id] === undefined);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <div className="flex justify-center">
          <KoraLogo />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold font-display">
            {t.public.activate.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.public.activate.intro}
          </p>
        </div>

        {step === "code" && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold">
              {t.public.activate.code.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.public.activate.code.hint}
            </p>

            {/* `noValidate` come nella richiesta demo: due validatori sono due
                fonti che possono divergere, e la prima a farlo sarebbe quella
                che non conosce le nostre stringhe (M5.c). */}
            <form
              noValidate
              className="mt-4 space-y-4"
              onSubmit={form.handleSubmit((values) => {
                setCompanyCode(values.companyCode);
                setStep("consent");
              })}
            >
              <div>
                <Label htmlFor="company-code">
                  {t.public.activate.code.label}
                </Label>
                <Input
                  id="company-code"
                  className="mt-1.5"
                  placeholder={t.public.activate.code.placeholder}
                  {...form.register("companyCode")}
                />
                {form.formState.errors.companyCode && (
                  <p className="mt-1.5 text-xs text-destructive-strong">
                    {form.formState.errors.companyCode.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {t.public.activate.code.submit}
              </Button>
            </form>
          </Card>
        )}

        {step === "consent" && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold">
              {t.public.activate.consent.title}
            </h2>

            {/* Tre righe: cosa trattiamo, per chi, e cosa vede l'azienda. La
                terza è la stessa garanzia che la dashboard HR promette
                dall'altro lato, detta a chi la riceve. */}
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs font-semibold">
                  {t.public.activate.consent.whatTitle}
                </dt>
                <dd className="text-xs text-muted-foreground">
                  {t.public.activate.consent.what}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold">
                  {t.public.activate.consent.whoTitle}
                </dt>
                <dd className="text-xs text-muted-foreground">
                  {t.public.activate.consent.who}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold">
                  {t.public.activate.consent.companyTitle}
                </dt>
                <dd className="text-xs text-muted-foreground">
                  {t.public.activate.consent.company}
                </dd>
              </div>
            </dl>

            {/* NASCE SPENTA, e non si pre-spunta in nessuna circostanza: una
                casella già segnata non è un consenso, è un modulo compilato da
                qualcun altro. */}
            <div className="mt-5 flex items-start gap-2">
              <Checkbox
                id="activate-consent"
                className="mt-0.5"
                checked={consent}
                onCheckedChange={(checked) => {
                  setConsent(checked === true);
                  if (checked === true) setConsentMissing(false);
                }}
              />
              <Label
                htmlFor="activate-consent"
                className="text-sm font-normal leading-snug cursor-pointer"
              >
                {t.public.activate.consent.checkbox}
              </Label>
            </div>

            {consentMissing && (
              <p className="mt-2 text-xs text-destructive-strong">
                {t.public.activate.consent.required}
              </p>
            )}

            <Button
              className="mt-5 w-full"
              disabled={activate.isPending}
              onClick={() => {
                if (!consent) {
                  setConsentMissing(true);
                  return;
                }
                activate.mutate(companyCode);
              }}
            >
              {t.public.activate.consent.submit}
            </Button>

            {activate.isError && (
              <ErrorNotice copy={t.public.activate.consent.error} />
            )}
          </Card>
        )}

        {step === "questions" && (
          <Card className="p-6">
            {company && (
              <p className="text-xs text-muted-foreground">
                {interpolate(t.public.activate.questions.company, {
                  company: company.name,
                })}
              </p>
            )}
            <h2 className="mt-1 text-sm font-semibold">
              {t.public.activate.questions.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.public.activate.questions.hint}
            </p>

            <div className="mt-5 space-y-5">
              {ASSESSMENT_QUESTIONS.map((id) => (
                <fieldset key={id}>
                  <legend className="text-sm">
                    {t.public.activate.questions.question[id]}
                  </legend>
                  {/* Cinque bersagli affiancati come il check rapido, ma con le
                      etichette della frequenza e **senza volti**: là la faccia
                      risponde a "come stai", qui la domanda è quanto spesso una
                      cosa succede, e una faccia non è la risposta. Il 5 sta a
                      destra ed è il meglio. */}
                  <div className="mt-2 flex gap-2">
                    {SCALE.map((value) => {
                      const chosen = answers[id] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              [id]: value,
                            }))
                          }
                          aria-pressed={chosen}
                          className={`flex-1 rounded-xl border px-1 py-2 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            chosen
                              ? "border-secondary bg-card text-foreground ring-2 ring-secondary shadow-sm"
                              : "border-border bg-card text-muted-foreground hover:border-secondary/40 hover:bg-accent/50 hover:text-accent-foreground"
                          }`}
                        >
                          {t.public.activate.questions.scale[value]}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {/* Dice quante ne mancano invece di disabilitare in silenzio: un
                pulsante spento senza una ragione è un vicolo cieco corto. */}
            {missing.length > 0 && (
              <p className="mt-5 text-xs text-muted-foreground">
                {interpolate(t.public.activate.questions.remaining, {
                  n: formatNumber(missing.length),
                })}
              </p>
            )}

            <Button
              className="mt-3 w-full"
              disabled={missing.length > 0 || submitAssessment.isPending}
              onClick={() =>
                submitAssessment.mutate(answers as AssessmentAnswers)
              }
            >
              {t.public.activate.questions.submit}
            </Button>

            {submitAssessment.isError && (
              <ErrorNotice copy={t.public.activate.questions.error} />
            )}
          </Card>
        )}

        {step === "profile" && profile && (
          <Card className="p-6 text-center">
            <h2 className="text-sm font-semibold">
              {t.public.activate.profile.title}
            </h2>

            <div className="mt-4 flex justify-center">
              <ScoreRing score={profile.score} />
            </div>

            <p className="mt-3 font-semibold">
              {t.healthSummary[profile.summaryKey]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.public.activate.profile.hint}
            </p>

            <div className="mt-5 rounded-2xl bg-accent/40 p-4">
              <p className="text-xs font-semibold">
                {t.public.activate.profile.weakestTitle}
              </p>
              <p className="mt-0.5 text-sm">
                {t.healthArea[profile.weakestArea]}
              </p>
            </div>

            <Button asChild className="mt-5 w-full">
              <Link to="/employee">{t.public.activate.profile.home}</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
