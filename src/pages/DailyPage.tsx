import React, { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import toast from 'react-hot-toast';
import { Sun, Moon, ChevronLeft, ChevronRight, ArrowRight, CheckCircle, Plus, Target, Loader2, Save, CalendarPlus, Download, Check, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DailyPage, WeeklyPlanning, User } from "@/Entities/Index";
import { toLocalDateString } from "@/utils/date";
import { SCHEDULE_PERIODS, type ScheduleField } from "@/utils/schedule";
import { dayToICS, downloadFile, googleCalendarUrl, localDateTime } from "@/utils/calendar";
import { useUnsavedWarning, isDirty } from "@/hooks/useUnsavedWarning";

// --- COMPONENTES DE UI ---
const Button = ({ children, className = '', variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => ( <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 disabled:opacity-50 ${variant === 'outline' ? 'border border-stone-300 bg-transparent hover:bg-stone-100 hover:text-stone-800 dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700 dark:hover:text-stone-200' : 'bg-stone-800 text-white hover:bg-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'} ${size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'} ${size === 'lg' ? 'h-11 px-6 text-base' : ''} ${className}`} {...props}>{children}</button> );
const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`bg-white rounded-lg shadow-sm border border-stone-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`p-6 border-b border-stone-200 dark:border-gray-700 flex items-center justify-between gap-3 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: { children: ReactNode, className?: string }) => <h3 className={`text-xl font-semibold text-stone-800 dark:text-stone-100 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input className="flex h-10 w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-stone-200 dark:placeholder:text-gray-400" {...props} />;
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={`flex min-h-[80px] w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-stone-200 dark:placeholder:text-gray-400 ${props.className}`} {...props} />;
const createPageUrl = (path: string) => `/${path}`;

// Campos que esta página edita (os rituais têm páginas próprias e não são sobrescritos daqui)
const PAGE_FIELDS = ['main_priorities', 'tasks_to_do', 'people_to_connect', 'day_message', 'notes', 'morning_schedule', 'afternoon_schedule'] as const;
const pickPageFields = (data: any) => Object.fromEntries(PAGE_FIELDS.map((key) => [key, data[key]]));

// salva sozinha um pouco depois que a pessoa para de digitar
const AUTOSAVE_MS = 1500;

type SaveState = 'saved' | 'pending' | 'saving' | 'error';

const SaveStatus = ({ state }: { state: SaveState }) => {
  const text = { saved: 'Salvo', pending: 'Alterações não salvas', saving: 'Salvando...', error: 'Erro ao salvar' }[state];
  const color = state === 'error' ? 'text-red-600 dark:text-red-400' : state === 'saved' ? 'text-green-700 dark:text-green-400' : 'text-stone-500 dark:text-stone-400';
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${color}`} role="status">
      {state === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : state === 'saved' ? <Check className="w-4 h-4" /> : null}
      {text}
    </span>
  );
};

const Schedule = ({ morningSchedule, afternoonSchedule, onChange, onExport, onDownload }: {
  morningSchedule: Record<string, string>;
  afternoonSchedule: Record<string, string>;
  onChange: (field: ScheduleField, schedule: Record<string, string>) => void;
  onExport: (time: string, activity: string) => void;
  onDownload: () => void;
}) => {
  const schedules = { morning_schedule: morningSchedule, afternoon_schedule: afternoonSchedule };
  const hasAny = [...Object.values(morningSchedule), ...Object.values(afternoonSchedule)].some((v) => v && v.trim());

  return (
    <Card>
      <CardHeader className="flex-wrap">
        <CardTitle>Agenda do Dia</CardTitle>
        <Button variant="outline" onClick={onDownload} disabled={!hasAny} title="Baixa um arquivo .ics com os compromissos do dia, para importar em qualquer calendário">
          <Download className="w-4 h-4 mr-2" />
          Exportar para calendário (.ics)
        </Button>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-x-8 gap-y-6">
        {SCHEDULE_PERIODS.map((period) => (
          <div key={period.label} className="space-y-3">
            <h4 className="font-semibold text-stone-800 dark:text-stone-100">{period.label}</h4>
            {period.slots.map((time) => {
              const schedule = schedules[period.field];
              const activity = schedule[time] || '';
              return (
                <div key={time} className="flex items-center gap-3">
                  <p className="w-12 text-right text-sm text-stone-500 dark:text-stone-300 flex-shrink-0">{time}</p>
                  <div className="relative w-full">
                    <Input
                      placeholder="Atividade..."
                      value={activity}
                      onChange={(e) => onChange(period.field, { ...schedule, [time]: e.target.value })}
                    />
                    {activity.trim() && (
                      <Button
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-stone-300 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-black"
                        onClick={() => onExport(time, activity)}
                        title="Adicionar ao Google Agenda"
                        aria-label={`Adicionar “${activity}” ao Google Agenda`}
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const getWeekStart = (date: Date) => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); d.setDate(diff); return toLocalDateString(d); };
const getInitialDailyData = (date: string, userId: string) => ({ id: null, date, user_id: userId, main_priorities: ['', '', ''], tasks_to_do: [''], people_to_connect: ['', '', ''], day_message: '', notes: '', morning_ritual: {}, evening_reflection: {}, morning_schedule: {}, afternoon_schedule: {} });

export default function DailyPageComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [currentDate, setCurrentDate] = useState(dateParam || toLocalDateString(new Date()));
  useEffect(() => { if (dateParam) setCurrentDate(dateParam); }, [dateParam]);
  const [dailyData, setDailyData] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('saved');

  // o que está salvo no banco, para saber se há algo pendente
  const savedRef = useRef<any>(null);
  const dataRef = useRef<any>(null);
  const timerRef = useRef<number | undefined>(undefined);
  // uma gravação por vez: a primeira cria o registro, as seguintes atualizam
  const chainRef = useRef<Promise<void>>(Promise.resolve());

  dataRef.current = dailyData;
  const dirty = !!dailyData && !!savedRef.current && isDirty(pickPageFields(dailyData), savedRef.current);
  useUnsavedWarning(dirty);

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) { setIsLoading(false); return; }
        const weekStart = getWeekStart(new Date(currentDate + 'T00:00:00'));
        const [dailyResult, weeklyResult] = await Promise.all([
          DailyPage.filter({ date: currentDate, user_id: user.id }),
          WeeklyPlanning.filter({ week_start_date: weekStart, user_id: user.id }),
        ]);
        const initialData = getInitialDailyData(currentDate, user.id);
        let data: any = initialData;
        if (dailyResult && dailyResult.length > 0 && dailyResult[0].id) {
          const loaded = dailyResult[0];
          loaded.main_priorities = loaded.main_priorities || [];
          while (loaded.main_priorities.length < 3) loaded.main_priorities.push('');
          loaded.tasks_to_do = loaded.tasks_to_do || [];
          if (loaded.tasks_to_do.length === 0) loaded.tasks_to_do.push('');
          loaded.people_to_connect = loaded.people_to_connect || [];
          while (loaded.people_to_connect.length < 3) loaded.people_to_connect.push('');
          data = { ...initialData, ...loaded, morning_schedule: loaded.morning_schedule || {}, afternoon_schedule: loaded.afternoon_schedule || {} };
        }
        savedRef.current = pickPageFields(data);
        setDailyData(data);
        setSaveState('saved');
        setWeeklyPlan(weeklyResult && weeklyResult.length > 0 ? weeklyResult[0] : null);
      } catch (error) {
        toast.error("Erro ao carregar a página do dia.");
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPageData();
  }, [currentDate]);

  // grava o que estiver pendente agora (sem esperar o tempo do salvamento automático)
  const flush = useCallback(() => {
    window.clearTimeout(timerRef.current);
    chainRef.current = chainRef.current.then(async () => {
      const data = dataRef.current;
      if (!data || !savedRef.current) return;
      const fields = pickPageFields(data);
      if (!isDirty(fields, savedRef.current)) return;
      setSaveState('saving');
      try {
        if (data.id) {
          await DailyPage.update(data.id, fields);
        } else {
          const { data: created } = await DailyPage.create({ date: data.date, user_id: data.user_id, ...fields });
          const id = created?.[0]?.id;
          if (id) {
            data.id = id;
            setDailyData((prev: any) => (prev && prev.date === data.date ? { ...prev, id } : prev));
          }
        }
        savedRef.current = fields;
        // se a pessoa continuou digitando durante a gravação, ainda há algo pendente
        setSaveState(isDirty(pickPageFields(dataRef.current), fields) ? 'pending' : 'saved');
      } catch (error) {
        console.error("Erro ao salvar:", error);
        setSaveState('error');
        toast.error("Não foi possível salvar. Verifique a conexão e tente de novo.");
      }
    });
    return chainRef.current;
  }, []);

  // cada alteração agenda uma gravação
  const update = (changes: Partial<any>) => {
    setDailyData((prev: any) => ({ ...prev, ...changes }));
    setSaveState('pending');
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(flush, AUTOSAVE_MS);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // antes de sair para outra página ou outro dia, grava o pendente
  const goTo = async (path: string) => { await flush(); navigate(path); };
  const navigateDate = async (direction: number) => {
    await flush();
    const date = new Date(currentDate + 'T00:00:00');
    date.setDate(date.getDate() + direction);
    navigate(createPageUrl(`DailyPage?date=${toLocalDateString(date)}`), { replace: true });
  };

  const handleGoogleCalendarExport = (time: string, activity: string) => {
    if (!activity.trim()) return;
    const url = googleCalendarUrl({ title: activity.trim(), start: localDateTime(currentDate, time), details: 'Criado a partir da Agenda Tempo de Ser.' });
    window.open(url, '_blank', 'noopener');
  };

  const handleDownloadICS = () => {
    const ics = dayToICS(currentDate, { ...dailyData.morning_schedule, ...dailyData.afternoon_schedule });
    downloadFile(`agenda-${currentDate}.ics`, ics, 'text/calendar;charset=utf-8');
    toast.success("Arquivo baixado! No Google Agenda: Configurações → Importar e exportar.");
  };

  const updateListField = (key: 'main_priorities' | 'tasks_to_do' | 'people_to_connect', index: number, value: string) => { const list = [...dailyData[key]]; list[index] = value; update({ [key]: list }); };
  const addTask = () => update({ tasks_to_do: [...dailyData.tasks_to_do, ''] });
  const removeTask = (index: number) => {
    const list = dailyData.tasks_to_do.filter((_: string, i: number) => i !== index);
    update({ tasks_to_do: list.length ? list : [''] });
  };
  const weeklyFocusHasContent = weeklyPlan && ((weeklyPlan.purpose_aligned_action && weeklyPlan.purpose_aligned_action.trim() !== '') || (weeklyPlan.crucial_interactions && weeklyPlan.crucial_interactions.trim() !== ''));

  if (isLoading || !dailyData) return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;

  const ritualCard = (path: string, Icon: typeof Sun, title: string, subtitle: string, done: boolean) => (
    <a href={createPageUrl(path)} onClick={(e) => { e.preventDefault(); goTo(createPageUrl(path)); }}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-100 dark:bg-gray-700 rounded-xl"><Icon className="w-6 h-6 text-stone-600 dark:text-amber-400" /></div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>
              <p className="text-sm text-stone-700 dark:text-stone-300">{subtitle}</p>
            </div>
          </div>
          {done ? <CheckCircle className="w-6 h-6 text-green-500" /> : <ArrowRight className="w-6 h-6 text-stone-400 group-hover:translate-x-1 transition-transform" />}
        </CardContent>
      </Card>
    </a>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center items-center gap-2 sm:gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} className="rounded-full flex-shrink-0" aria-label="Dia anterior"><ChevronLeft className="w-4 h-4" /></Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 capitalize">{new Date(currentDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)} className="rounded-full flex-shrink-0" aria-label="Dia seguinte"><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <SaveStatus state={saveState} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {ritualCard(`MorningRitual?date=${currentDate}`, Sun, 'Ritual Matinal', 'Comece o dia com intenção.', !!dailyData.morning_ritual && Object.values(dailyData.morning_ritual).some((v) => v))}
        {ritualCard(`EveningReflection?date=${currentDate}`, Moon, 'Escrita Noturna', 'Reflita e aprecie.', !!dailyData.evening_reflection && Object.values(dailyData.evening_reflection).some((v) => v))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-5 h-5 text-stone-600 dark:text-amber-400" />
            Seu Foco Para a Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {weeklyFocusHasContent ? (
            <div className="space-y-4 text-sm">
              {weeklyPlan.purpose_aligned_action?.trim() && (
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300">Ação Alinhada com Propósito:</h4>
                  <p className="text-stone-600 dark:text-stone-400 mt-1">{weeklyPlan.purpose_aligned_action}</p>
                </div>
              )}
              {weeklyPlan.crucial_interactions?.trim() && (
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300">Interações Cruciais:</h4>
                  <p className="text-stone-600 dark:text-stone-400 mt-1">{weeklyPlan.crucial_interactions}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-stone-600 dark:text-stone-400">Crie um plano semanal para acompanhar seu foco aqui.</p>
              <Link to={createPageUrl("WeeklyPlanning")}>
                <Button variant="outline" className="mt-4"><Plus className="w-4 h-4 mr-2" />Criar Plano Semanal</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Mensagem para seu dia</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={dailyData.day_message || ''} onChange={(e) => update({ day_message: e.target.value })} placeholder="Qual mensagem você quer carregar consigo hoje?" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3 Principais Prioridades</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {dailyData.main_priorities.map((priority: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-stone-800 dark:bg-stone-100 text-white dark:text-black rounded-full text-sm font-bold flex-shrink-0">{index + 1}</div>
              <Input value={priority} placeholder={`Prioridade ${index + 1}...`} onChange={(e) => updateListField('main_priorities', index, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Schedule
        morningSchedule={dailyData.morning_schedule || {}}
        afternoonSchedule={dailyData.afternoon_schedule || {}}
        onChange={(field, schedule) => update({ [field]: schedule })}
        onExport={handleGoogleCalendarExport}
        onDownload={handleDownloadICS}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tarefas a fazer</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dailyData.tasks_to_do.map((task: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={task} onChange={(e) => updateListField('tasks_to_do', index, e.target.value)} placeholder={`Tarefa ${index + 1}...`} />
                {(dailyData.tasks_to_do.length > 1 || task) && (
                  <button type="button" onClick={() => removeTask(index)} className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-gray-700 dark:hover:text-stone-200" aria-label={`Remover tarefa ${index + 1}`} title="Remover tarefa">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addTask} className="w-full"><Plus className="w-4 h-4 mr-2" /> Adicionar Tarefa</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pessoas para me conectar</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dailyData.people_to_connect.slice(0, 3).map((person: string, index: number) => (
              <Input key={index} value={person} onChange={(e) => updateListField('people_to_connect', index, e.target.value)} placeholder={`Pessoa ${index + 1}...`} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Notas Adicionais</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={dailyData.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="Outras reflexões, insights ou anotações..." className="min-h-[120px] dark:bg-white/5 font-sans w-full" />
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-2 pt-6">
        <Button onClick={() => flush()} disabled={saveState === 'saving' || (saveState === 'saved' && !dirty)} size="lg">
          {saveState === 'saving' ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Salvar agora
        </Button>
        <p className="text-xs text-stone-500 dark:text-stone-400">A página salva sozinha enquanto você escreve.</p>
      </div>
    </div>
  );
}
