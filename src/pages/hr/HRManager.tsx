import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { EyeOff } from 'lucide-react';
import { CRISIS_LINK } from '@/components/kora/RapidCheckCard';
import { EMERGENCY_NUMBER, HELPLINE_NUMBER } from '@/lib/emergency';
import { interpolate, t } from '@/lib/i18n';

/*
 * Le guide per i manager (CLAUDE.md §10.C.6).
 *
 * DICONO COME PARLARE, MAI COME RICONOSCERE (§7). Nessun segnale da osservare,
 * nessuna condizione nominata, nessun invito a tenere d'occhio qualcuno: un
 * manager che impara a individuare chi sta male è un segnale individuale che
 * l'azienda usa, cioè ciò che l'area HR esiste per non avere. Chi aggiunge una
 * frase la rilegge con una domanda sola — descrive l'altro, o dice cosa fare?
 *
 * UGUALI PER TUTTI, E NON LEGGONO NESSUN DATO: la pagina non chiama il
 * provider, quindi non ha né attesa né errore. Nessun download e nessuna stampa:
 * il report ha la sua vista di stampa perché è un allegato, queste no.
 */

type GuideId = keyof typeof t.hr.managers.guide;
type Section = 'say' | 'avoid' | 'then';

const GUIDES: GuideId[] = ['someone_tells_you', 'talk_about_kora', 'worried_now'];
const SECTIONS: Section[] = ['say', 'avoid', 'then'];

/* Il rimando di una guida verso una pagina che c'è già, come le rotte d'uscita di
   `StartingPointDialog`: l'indirizzo è di questa schermata, il testo del
   dizionario. */
const LINKS: Partial<Record<GuideId, string>> = {
  talk_about_kora: '/hr/employees',
};

/*
 * UNA RIGA CHE PORTA UN NUMERO D'EMERGENZA È UN LINK `tel:`, per intero, come
 * nel check rapido. Lo decide il segnaposto e non l'id della guida: la frase che
 * dice di chiamare è quella che contiene il numero, in qualunque guida stia, e
 * il numero arriva da `lib/emergency.ts` e non dal dizionario (§8).
 */
function GuideItem({ text }: { text: string }) {
  const number = text.includes('{number}')
    ? EMERGENCY_NUMBER
    : text.includes('{helpline}')
      ? HELPLINE_NUMBER
      : null;
  const line = interpolate(text, {
    number: EMERGENCY_NUMBER,
    helpline: HELPLINE_NUMBER,
  });
  if (number === null) return <li>{line}</li>;
  return (
    <li>
      <a href={`tel:${number}`} className={CRISIS_LINK}>
        {line}
      </a>
    </li>
  );
}

export default function HRManager() {
  const copy = t.hr.managers;
  const sectionTitle: Record<Section, string> = {
    say: copy.sayTitle,
    avoid: copy.avoidTitle,
    then: copy.thenTitle,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{copy.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{copy.subtitle}</p>
      </div>

      <Card className="p-5 bg-accent/40 border-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
            <EyeOff className="w-5 h-5 text-secondary-strong" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{copy.noDataTitle}</h2>
            <p className="text-sm text-muted-foreground mt-1">{copy.noDataBody}</p>
          </div>
        </div>
      </Card>

      {GUIDES.map((id) => {
        const guide = copy.guide[id];
        const link = LINKS[id];
        return (
          <Card key={id} className="p-5">
            <h2 className="font-semibold">{guide.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{guide.lead}</p>
            <div className="grid gap-5 md:grid-cols-3 mt-4">
              {SECTIONS.map((section) => (
                <div key={section}>
                  <h3 className="text-sm font-semibold">{sectionTitle[section]}</h3>
                  <ul className="mt-2 space-y-1.5 list-disc pl-4 text-sm text-muted-foreground">
                    {Object.values(guide[section]).map((text) => (
                      <GuideItem key={text} text={text} />
                    ))}
                  </ul>
                  {section === 'then' && link !== undefined && (
                    <Link
                      to={link}
                      className="inline-block mt-3 rounded-sm text-sm text-foreground underline underline-offset-4 hover:text-secondary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {copy.codeLink}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
