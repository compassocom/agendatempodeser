// Horários da "Agenda do Dia", de meia em meia hora, no formato salvo no banco ("6:00", "13:30").
// Por compatibilidade com o que já foi salvo, a manhã fica em morning_schedule e a tarde e a
// noite ficam em afternoon_schedule.
export type ScheduleField = 'morning_schedule' | 'afternoon_schedule';

const slots = (start: number, end: number) => {
  const list: string[] = [];
  for (let h = start; h < end; h++) list.push(`${h}:00`, `${h}:30`);
  return list;
};

export const SCHEDULE_PERIODS: Array<{ label: string; field: ScheduleField; slots: string[] }> = [
  { label: 'Manhã', field: 'morning_schedule', slots: slots(6, 13) },
  { label: 'Tarde', field: 'afternoon_schedule', slots: slots(13, 18) },
  { label: 'Noite', field: 'afternoon_schedule', slots: slots(18, 22) },
];

export const ALL_SLOTS = SCHEDULE_PERIODS.flatMap((p) => p.slots);
