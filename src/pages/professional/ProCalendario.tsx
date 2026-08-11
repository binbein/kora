import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, Video } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import { addDays, startOfWeek } from '@/lib/dates';
import { formatDate, formatNumber, formatTime, formatWeekday, formatWeekdayShort } from '@/lib/format';
import { interpolate, t } from '@/lib/i18n';
import {
  slotsOfWeek,
  nextSession,
  sessionsOfMonth,
  sessionsOfWeek,
  weekGrid,
} from '@/lib/schedule';
import {
  usePortalProfessionalId,
  useProfessionalPatients,
  useProfessionalSessions,
  useReferenceDate,
} from '@/lib/data/queries';

export default function ProCalendario() {
  const { data: today } = useReferenceDate();
  const { data: professionalId } = usePortalProfessionalId();
  const { data: sessions } = useProfessionalSessions(professionalId);
  const { data: patients } = useProfessionalPatients(professionalId);

  if (!today || !sessions || !patients) return null;

  const week = sessionsOfWeek(sessions, today);
  const slots = slotsOfWeek(week);
  const days = weekGrid(sessions, today, today);
  const monday = startOfWeek(today);
  const next = nextSession(sessions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">{t.professional.calendar.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 tabular-nums">
          {interpolate(t.professional.calendar.week, {
            from: formatDate(monday),
            to: formatDate(addDays(monday, 6)),
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t.professional.calendar.sessionsThisWeek} value={formatNumber(week.length)} icon={Calendar} />
        <KPICard
          title={t.professional.calendar.nextSession}
          value={
            next
              ? interpolate(t.professional.calendar.nextSessionValue, {
                  weekday: formatWeekday(next.start),
                  time: formatTime(next.start),
                })
              : t.professional.calendar.noNextSession
          }
          icon={Clock}
        />
        <KPICard
          title={t.professional.calendar.sessionsThisMonth}
          value={formatNumber(sessionsOfMonth(sessions, today).length)}
          icon={Video}
        />
        <KPICard title={t.professional.calendar.activePatients} value={formatNumber(patients.length)} icon={User} />
      </div>

      {slots.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          {t.professional.calendar.empty}
        </Card>
      ) : (
        <Card className="p-4 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 gap-1">
              <div className="p-2" />
              {days.map((day) => (
                <div
                  key={day.date.toISOString()}
                  className={`p-2 text-center text-sm font-semibold ${
                    day.isToday ? 'text-executive' : 'text-muted-foreground'
                  }`}
                >
                  <span className="capitalize">{formatWeekdayShort(day.date)}</span>{' '}
                  <span className="tabular-nums font-normal">{day.date.getDate()}</span>
                </div>
              ))}
              {slots.map((minuteOfDay, row) => (
                <React.Fragment key={minuteOfDay}>
                  <div className="p-2 text-xs text-muted-foreground text-right tabular-nums">
                    {formatTime(new Date(2000, 0, 1, 0, minuteOfDay))}
                  </div>
                  {days.map((day) => {
                    const { session } = day.cells[row];
                    const past = session && session.status === 'completed';
                    return (
                      <div
                        key={`${day.date.toISOString()}-${minuteOfDay}`}
                        className={`p-1.5 rounded-lg text-xs min-h-[48px] border ${
                          session
                            ? past
                              ? 'bg-muted/60 border-border'
                              : 'bg-secondary/10 border-secondary/30'
                            : 'bg-card border-border'
                        }`}
                      >
                        {session && (
                          <div>
                            <p className={`font-medium ${past ? 'text-muted-foreground' : 'text-secondary-strong'}`}>
                              {session.patientInitials}
                            </p>
                            <p className="text-muted-foreground text-[10px]">
                              {t.sessionType[session.type]}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-secondary/10 border border-secondary/30" />
          {t.professional.calendar.legendBooked}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/60 border border-border" />
          {t.professional.calendar.legendPast}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          {t.professional.calendar.legendFree}
        </div>
      </div>
    </div>
  );
}
