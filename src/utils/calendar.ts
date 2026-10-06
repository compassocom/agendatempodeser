// Levar compromissos para o Google Agenda ou qualquer calendário (.ics).
// Datas 'AAAA-MM-DD' e horários 'H:MM' são sempre no fuso de quem está usando.

/** 'AAAA-MM-DD' + 'H:MM' → Date no horário local */
export const localDateTime = (date: string, time: string) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(`${date}T00:00:00`);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
};

/** formato dos calendários: 20261006T110000Z (UTC) */
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const timeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

interface GoogleEvent {
  title: string;
  start: Date;
  minutes?: number;
  details?: string;
  /** ex.: 'RRULE:FREQ=DAILY' */
  recurrence?: string;
}

export const googleCalendarUrl = ({ title, start, minutes = 30, details, recurrence }: GoogleEvent) => {
  const end = new Date(start.getTime() + minutes * 60000);
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', title);
  url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`);
  if (details) url.searchParams.set('details', details);
  if (recurrence) url.searchParams.set('recur', recurrence);
  const tz = timeZone();
  if (tz) url.searchParams.set('ctz', tz);
  return url.toString();
};

/** Lembrete diário de um ritual, a partir de hoje, no horário 'HH:MM' */
export const dailyRitualUrl = (time: string, title: string, details: string) => {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return googleCalendarUrl({ title, start: localDateTime(date, time), minutes: 15, details, recurrence: 'RRULE:FREQ=DAILY' });
};

// texto dentro de um .ics: vírgula, ponto e vírgula, barra e quebras de linha são escapados
const icsText = (text: string) => text.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');

/** Arquivo .ics com cada compromisso do dia (30 min cada) */
export const dayToICS = (date: string, schedule: Record<string, string>) => {
  const now = stamp(new Date());
  const events = Object.entries(schedule)
    .filter(([, activity]) => activity && activity.trim())
    .sort(([a], [b]) => localDateTime(date, a).getTime() - localDateTime(date, b).getTime())
    .flatMap(([time, activity]) => {
      const start = localDateTime(date, time);
      const end = new Date(start.getTime() + 30 * 60000);
      return [
        'BEGIN:VEVENT',
        `UID:${date}-${time.replace(':', '')}@agendatempodeser`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${icsText(activity.trim())}`,
        'DESCRIPTION:Agenda Tempo de Ser',
        'END:VEVENT',
      ];
    });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Agenda Tempo de Ser//PT-BR', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n');
};

export const downloadFile = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};
