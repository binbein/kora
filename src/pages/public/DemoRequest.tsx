import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, CheckCircle2, Shield } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import Footer from "@/components/public/Footer";
import { dataProvider } from "@/lib/data";
import { queryKeys } from "@/lib/data/query-keys";
import type { DemoRequest as DemoRequestRecord } from "@/lib/data/types";
import { interpolate, t } from "@/lib/i18n";
import { ErrorNotice } from "@/components/kora/StateNotice";

/*
 * La richiesta di demo (CLAUDE.md §10.A.4).
 *
 * È la terza mutation del provider, e l'unica dell'area pubblica. Sta qui e
 * non in `queries.ts` come le altre due scritture: ha un chiamante solo, e una
 * `useMutation` avvolta in un hook che nessun altro chiama è il wrapper che il
 * §11 non vuole.
 *
 * NON INVALIDA NIENTE, oggi. A leggere le richieste sarà il back-office, che è
 * l'ultima area da migrare: la lettura e la sua invalidazione nascono lì,
 * insieme, invece di essere indovinate adesso (`docs/CONTRATTO-DATI.md` §2, §4).
 * Il record però si salva davvero, quindi l'admin lo troverà.
 *
 * LA VALIDAZIONE È QUELLA DELLO SCHEMA QUI SOTTO, ed è l'unica (M5.c). Il
 * `noValidate` sul form spegne quella del browser: due validatori sono due
 * fonti che possono divergere, e la prima a farlo sarebbe quella che non
 * conosce le nostre stringhe. Restano `type="email"`, `type="tel"` e
 * `type="number"`, che decidono la tastiera del telefono e non cosa passa.
 *
 * `form.tsx` di shadcn NON è usato, ed è una scelta. `FormMessage` rende
 * `text-destructive` e `FormLabel` colora l'etichetta in errore con lo stesso
 * token: 3.76:1, sotto l'AA per il testo (§6.1). Sul messaggio si sovrascrive
 * dal call site, sull'etichetta no — il colore è condizionato all'errore — e
 * cambiarlo dentro `ui/` sarebbe un'eccezione al congelamento che nessuno ha
 * concesso. Con un form solo, `register` più un `<p>` costano meno di quanto
 * costerebbe aggirarlo (§11). La ragione sta in `CLAUDE.md` §3, dove la
 * previsione che dava `form` per usato in M5 è corretta con la sua data.
 */

/*
 * Lo schema è il contratto detto in regole (`docs/CONTRATTO-DATI.md` §2):
 * obbligatorio ciò che `DemoRequestInput` dichiara tale, facoltativo il resto.
 *
 * QUELLO CHE NON C'È È DELIBERATO. Nessun formato sul telefono — il tipo lo dà
 * opzionale e nessun documento ne fissa la forma, quindi un pattern svizzero
 * sarebbe una regola inventata (§2.4). Nessun tetto su `employeeCount`: i
 * 20–1000 sono il dominio del calcolatore, non di questo form. Nessuna
 * lunghezza sul messaggio, e nessun controllo che l'email sia "aziendale",
 * che l'etichetta suggerisce e nessuna regola chiede.
 *
 * È UNA FUNZIONE E NON UNA COSTANTE (M5.e), e qui la differenza si vedrebbe a
 * schermo: i messaggi vengono da `t`, e uno schema costruito a livello di
 * modulo li catturerebbe una volta sola — dopo il cambio lingua il form
 * tedesco segnalerebbe gli errori in italiano. Si ricostruisce a ogni render,
 * che è il costo di cinque stringhe, e `zodResolver` prende sempre l'ultimo.
 */
function demoRequestSchema() {
  return z.object({
    companyName: z.string().trim().min(1, t.public.demoRequest.validation.companyRequired),
    contactName: z.string().trim().min(1, t.public.demoRequest.validation.contactRequired),
    email: z
      .string()
      .trim()
      .min(1, t.public.demoRequest.validation.emailRequired)
      .email(t.public.demoRequest.validation.emailInvalid),
    /* Grezzi: a decidere che vuoto e soli spazi sono assenza è il confine della
       scrittura, cioè il provider (§2 del contratto). Qui si toglie lo spazio
       accidentale e basta. */
    phone: z.string().trim(),
    message: z.string().trim(),
    /* Il campo è facoltativo: o è vuoto, o è un intero non negativo. Il resto
       della regola — **vuoto vale zero** — è `toEmployeeCount` qui sotto.

       LO SCHEMA NON TRASFORMA, ed è un limite della versione installata, non una
       scelta: `zodResolver` 4.1.3 ha un generico solo e restituisce
       `Resolver<z.infer<schema>>`, quindi un `.transform()` renderebbe il tipo
       dei campi diverso da quello del risultato e il resolver non tipizzerebbe
       più. Zittirlo con un `as` sarebbe il cast che nasconde un errore vero.
       Alzare `@hookform/resolvers` alla 5 è una decisione di dipendenza (§3), e
       il giorno in cui la si prende questo campo è il punto da rileggere. */
    employeeCount: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^\d+$/.test(value),
        t.public.demoRequest.validation.employeesInvalid,
      ),
  });
}

type DemoFormValues = z.infer<ReturnType<typeof demoRequestSchema>>;

/**
 * Vuoto vale zero, che è la regola di sempre.
 *
 * Nessun `Math.max` e nessun `Math.round` attorno: lo schema ha già escluso il
 * segno e i decimali, quindi difendersene qui sarebbe un ramo irraggiungibile
 * (§11). È il modo in cui questa riga dichiara di fidarsi della validazione.
 */
const toEmployeeCount = (value: string) => (value === "" ? 0 : Number(value));

const EMPTY_FORM: DemoFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  employeeCount: "",
  message: "",
};

/*
 * Il messaggio di un campo. Ha quattro chiamanti in questa pagina, ed è ciò che
 * lo salva dal §11: senza, la classe e il controllo sul vuoto starebbero scritti
 * quattro volte.
 *
 * `destructive-strong` e non `destructive`: è testo che porta significato, e il
 * token base dà 3.76:1 (§6.1). L'`id` è quello che il campo nomina in
 * `aria-describedby`, quindi chi legge lo schermo sente il messaggio arrivando
 * sul campo — che è anche dove il fuoco lo porta dopo un invio bloccato.
 */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1.5 text-sm text-destructive-strong">
      {message}
    </p>
  );
}

export default function DemoRequest() {
  const queryClient = useQueryClient();

  /*
   * `shouldFocusError` è il default di react-hook-form, e non si tocca: dopo
   * un invio bloccato il fuoco va sul primo campo in errore, che è il requisito
   * di M5.a applicato a un form. Anche `reValidateMode: "onChange"` è il
   * default, ed è ciò che fa sparire il messaggio quando il campo si corregge —
   * senza, resterebbe a schermo su un valore ormai valido.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoRequestSchema()),
    defaultValues: EMPTY_FORM,
  });

  /*
   * Lo stato di successo è **il record restituito**, non un booleano: la
   * conferma nomina l'azienda che ha scritto, quindi non può comparire se la
   * scrittura non è avvenuta. Un `submitted = true` si accenderebbe lo stesso
   * il giorno in cui la mutation fallisse, ed è il difetto della schermata
   * ereditata, dove `handleSubmit` non chiamava niente.
   */
  const [confirmed, setConfirmed] = useState<DemoRequestRecord | null>(null);

  /*
   * La mutation riceve i valori **già validati**, e non li rilegge dallo stato:
   * parte solo su dati validi perché a chiamarla è `handleSubmit`, non il
   * submit del form.
   */
  const submit = useMutation({
    mutationFn: (values: DemoFormValues) =>
      dataProvider.submitDemoRequest({
        ...values,
        employeeCount: toEmployeeCount(values.employeeCount),
      }),
    onSuccess: (request) => {
      /*
       * Da M3 la richiesta ha un lettore: il back-office. Fino a ieri questa
       * mutation non invalidava niente perché niente la mostrava, ed era
       * dichiarato nel contratto (§4); ora la riga è chiusa, e una richiesta
       * inviata durante la demo compare in `/admin` senza ricaricare.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.platform.demoRequests(),
      });
      setConfirmed(request);
    },
  });

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <div className="pt-32 pb-20 max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="inline-flex p-4 bg-accent rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-accent-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold font-display">
            {t.public.demoRequest.successTitle}
          </h1>
          <p className="text-muted-foreground">
            {interpolate(t.public.demoRequest.successBody, {
              company: confirmed.companyName,
            })}
          </p>
          {/* Nessun vicolo cieco (§10): da qui si torna indietro o si va al
              calcolatore, che è la cosa utile da fare mentre si aspetta. */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                {t.public.demoRequest.successHome}
              </Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/roi">{t.public.demoRequest.successRoi}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex p-3 bg-secondary/10 rounded-2xl">
              <Calendar className="w-8 h-8 text-secondary" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              {t.public.demoRequest.title}
            </h1>
            <p className="text-muted-foreground">
              {t.public.demoRequest.subtitle}
            </p>
          </div>

          <Card className="p-6 md:p-8">
            {/* `noValidate`: la validazione è una sola, ed è lo schema. */}
            <form
              className="space-y-5"
              noValidate
              onSubmit={handleSubmit((values) => submit.mutate(values))}
            >
              <div>
                <Label htmlFor="demo-company">
                  {t.public.demoRequest.companyLabel}
                </Label>
                <Input
                  id="demo-company"
                  className="mt-1.5"
                  aria-invalid={!!errors.companyName}
                  aria-describedby={
                    errors.companyName ? "demo-company-error" : undefined
                  }
                  {...register("companyName")}
                />
                <FieldError
                  id="demo-company-error"
                  message={errors.companyName?.message}
                />
              </div>
              <div>
                <Label htmlFor="demo-contact">
                  {t.public.demoRequest.contactLabel}
                </Label>
                <Input
                  id="demo-contact"
                  className="mt-1.5"
                  aria-invalid={!!errors.contactName}
                  aria-describedby={
                    errors.contactName ? "demo-contact-error" : undefined
                  }
                  {...register("contactName")}
                />
                <FieldError
                  id="demo-contact-error"
                  message={errors.contactName?.message}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demo-email">
                    {t.public.demoRequest.emailLabel}
                  </Label>
                  {/* `type` resta: decide la tastiera, non cosa passa. */}
                  <Input
                    id="demo-email"
                    type="email"
                    className="mt-1.5"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "demo-email-error" : undefined
                    }
                    {...register("email")}
                  />
                  <FieldError
                    id="demo-email-error"
                    message={errors.email?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="demo-phone">
                    {t.public.demoRequest.phoneLabel}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({t.public.demoRequest.optional})
                    </span>
                  </Label>
                  {/* Nessun messaggio: il telefono non ha regole da rispettare,
                      quindi non ha niente da dire quando è vuoto o strano. */}
                  <Input
                    id="demo-phone"
                    type="tel"
                    className="mt-1.5"
                    {...register("phone")}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="demo-employees">
                  {t.public.demoRequest.employeesLabel}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({t.public.demoRequest.optional})
                  </span>
                </Label>
                <Input
                  id="demo-employees"
                  type="number"
                  inputMode="numeric"
                  className="mt-1.5 tabular-nums"
                  aria-invalid={!!errors.employeeCount}
                  aria-describedby={
                    errors.employeeCount ? "demo-employees-error" : undefined
                  }
                  {...register("employeeCount")}
                />
                <FieldError
                  id="demo-employees-error"
                  message={errors.employeeCount?.message}
                />
              </div>
              <div>
                <Label htmlFor="demo-message">
                  {t.public.demoRequest.messageLabel}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({t.public.demoRequest.optional})
                  </span>
                </Label>
                {/* Come il telefono: una textarea che ammette tutto non ha
                    regole da raccontare. */}
                <Textarea
                  id="demo-message"
                  className="mt-1.5"
                  rows={3}
                  {...register("message")}
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/60 rounded-lg p-3">
                <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" aria-hidden="true" />
                <span>{t.public.demoRequest.privacy}</span>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={submit.isPending}
              >
                {submit.isPending
                  ? t.public.demoRequest.submitting
                  : t.public.demoRequest.submit}
              </Button>

              {/* I valori vivono in react-hook-form e la mutation fallita non
                  li tocca: chi riprova non ricompila. La validazione previene,
                  non sostituisce — questo ramo resta quello di M5.b. */}
              {submit.isError && (
                <ErrorNotice copy={t.public.demoRequest.error} />
              )}
            </form>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
