import { useState } from "react";
import { Link } from "react-router-dom";
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
 * La validazione è quella del browser. `zod` e `react-hook-form` sono
 * installati apposta (§3) ma sono M5: un form che finge di controllare più di
 * quanto controlla è peggio di uno che dichiara i campi obbligatori e basta.
 */

const EMPTY_FORM = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  employeeCount: "",
  message: "",
};

export default function DemoRequest() {
  const [form, setForm] = useState(EMPTY_FORM);
  const queryClient = useQueryClient();

  /*
   * Lo stato di successo è **il record restituito**, non un booleano: la
   * conferma nomina l'azienda che ha scritto, quindi non può comparire se la
   * scrittura non è avvenuta. Un `submitted = true` si accenderebbe lo stesso
   * il giorno in cui la mutation fallisse, ed è il difetto della schermata
   * ereditata, dove `handleSubmit` non chiamava niente.
   */
  const [confirmed, setConfirmed] = useState<DemoRequestRecord | null>(null);

  const submit = useMutation({
    mutationFn: () =>
      dataProvider.submitDemoRequest({
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        // il campo è facoltativo: vuoto vale zero, non NaN
        employeeCount: Math.max(0, Math.round(Number(form.employeeCount) || 0)),
        // grezzi: a decidere che vuoto e soli spazi sono assenza è il confine
        // della scrittura, cioè il provider (§2 del contratto). Farlo anche qui
        // sarebbe la stessa regola in due posti
        phone: form.phone,
        message: form.message,
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
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                submit.mutate();
              }}
            >
              <div>
                <Label htmlFor="demo-company">
                  {t.public.demoRequest.companyLabel}
                </Label>
                <Input
                  id="demo-company"
                  className="mt-1.5"
                  value={form.companyName}
                  onChange={(event) =>
                    setForm({ ...form, companyName: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="demo-contact">
                  {t.public.demoRequest.contactLabel}
                </Label>
                <Input
                  id="demo-contact"
                  className="mt-1.5"
                  value={form.contactName}
                  onChange={(event) =>
                    setForm({ ...form, contactName: event.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demo-email">
                    {t.public.demoRequest.emailLabel}
                  </Label>
                  <Input
                    id="demo-email"
                    type="email"
                    className="mt-1.5"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="demo-phone">
                    {t.public.demoRequest.phoneLabel}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({t.public.demoRequest.optional})
                    </span>
                  </Label>
                  <Input
                    id="demo-phone"
                    type="tel"
                    className="mt-1.5"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
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
                  min={0}
                  className="mt-1.5 tabular-nums"
                  value={form.employeeCount}
                  onChange={(event) =>
                    setForm({ ...form, employeeCount: event.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="demo-message">
                  {t.public.demoRequest.messageLabel}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({t.public.demoRequest.optional})
                  </span>
                </Label>
                <Textarea
                  id="demo-message"
                  className="mt-1.5"
                  rows={3}
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
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
            </form>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
