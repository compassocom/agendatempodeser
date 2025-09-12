import React, { useState, useEffect, ReactNode } from "react";
import toast from 'react-hot-toast';
import { Sun, Moon, ChevronLeft, ChevronRight, ArrowRight, CheckCircle, Plus, Target, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";
// --- IMPORTAÇÃO REAL DO SUPABASE ---
import { DailyPage, WeeklyPlanning, User } from "../entities/index";

// --- INÍCIO DOS COMPONENTES DE UI (MANTIDOS LOCALMENTE PARA ESTABILIDADE VISUAL) ---
const Button = ({ children, className = '', variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => ( <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 disabled:opacity-50 ${variant === 'outline' ? 'border border-stone-300 bg-transparent hover:bg-stone-100 hover:text-stone-800 dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700 dark:hover:text-stone-200' : 'bg-stone-800 text-white hover:bg-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'} ${size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'} ${size === 'lg' ? 'h-11 px-6 text-base' : ''} ${className}`} {...props}>{children}</button> );
const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`bg-white rounded-lg shadow-sm border border-stone-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`p-6 border-b border-stone-200 dark:border-gray-700 flex items-center justify-between ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: { children: ReactNode, className?: string }) => <h3 className={`text-xl font-semibold text-stone-800 dark:text-stone-100 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input className="flex h-10 w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-stone-200 dark:placeholder:text-gray-400" {...props} />;
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={`flex min-h-[80px] w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-stone-200 dark:placeholder:text-gray-400 ${props.className}`} {...props} />;
const createPageUrl = (path: string) => `/${path}`;
const SectionSaveButton = ({ onSave }: { onSave: () => Promise<void> }) => { const [isSaving, setIsSaving] = useState(false); const handleClick = async () => { setIsSaving(true); try { await onSave(); } catch (e) {} setIsSaving(false); }; return <Button size="icon" variant="ghost" className="dark:text-stone-300 dark:hover:bg-gray-700" onClick={handleClick} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}</Button>; };
const generateTimeSlots = (start: number, end: number) => { const slots = []; for (let i = start; i < end; i += 0.5) { const h = Math.floor(i); const m = i % 1 === 0 ? '00' : '30'; slots.push(`${h}:${m}`); } return slots; };
const morningSlots = generateTimeSlots(8, 13);
const afternoonSlots = generateTimeSlots(13, 18);
const Schedule = ({ morningSchedule, afternoonSchedule, onMorningChange, onAfternoonChange, onSave }: any) => { const handleChange = (type: 'morning' | 'afternoon', time: string, value: string) => { if (type === 'morning') onMorningChange({ ...morningSchedule, [time]: value }); else onAfternoonChange({ ...afternoonSchedule, [time]: value }); }; return (<Card><CardHeader><CardTitle>Agenda do Dia</CardTitle><SectionSaveButton onSave={onSave} /></CardHeader><CardContent className="grid md:grid-cols-2 gap-x-12 gap-y-4"><div className="space-y-3"><h4 className="font-semibold text-stone-800 dark:text-stone-100">Manhã</h4>{morningSlots.map(time => (<div key={time} className="flex items-center gap-3"><p className="w-16 text-right text-sm text-stone-500 dark:text-stone-300 flex-shrink-0">{time}</p><Input placeholder="Atividade..." value={morningSchedule[time] || ''} onChange={(e) => handleChange('morning', time, e.target.value)} /></div>))}</div><div className="space-y-3"><h4 className="font-semibold text-stone-800 dark:text-stone-100">Tarde</h4>{afternoonSlots.map(time => (<div key={time} className="flex items-center gap-3"><p className="w-16 text-right text-sm text-stone-500 dark:text-stone-300 flex-shrink-0">{time}</p><Input placeholder="Atividade..." value={afternoonSchedule[time] || ''} onChange={(e) => handleChange('afternoon', time, e.target.value)} /></div>))}</div></CardContent></Card>); };
// --- FIM DOS COMPONENTES LOCAIS ---

const getWeekStart = (date: Date) => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); return new Date(d.setDate(diff)).toISOString().split('T')[0]; };

const getInitialDailyData = (date: string, userId: string) => ({ id: null, date, user_id: userId, main_priorities: ['', '', ''], tasks_to_do: [''], people_to_connect: ['', '', ''], day_message: '', notes: '', morning_ritual: {}, evening_reflection: {}, morning_schedule: {}, afternoon_schedule: {} });

export default function DailyPageComponent() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);

  useEffect(() => {
    const loadPageData = async () => { setIsLoading(true); try { const user = await User.me(); if (!user) { setIsLoading(false); return; } const dateObj = new Date(currentDate + 'T00:00:00'); const weekStart = getWeekStart(dateObj); const [dailyResult, weeklyResult] = await Promise.all([DailyPage.filter({ date: currentDate, user_id: user.id }), WeeklyPlanning.filter({ week_start_date: weekStart, user_id: user.id })]); const initialData = getInitialDailyData(currentDate, user.id); if (dailyResult && dailyResult.length > 0 && dailyResult[0].id) { const loadedData = dailyResult[0]; loadedData.main_priorities = loadedData.main_priorities || []; while (loadedData.main_priorities.length < 3) loadedData.main_priorities.push(''); loadedData.tasks_to_do = loadedData.tasks_to_do || []; if (loadedData.tasks_to_do.length === 0) loadedData.tasks_to_do.push(''); loadedData.people_to_connect = loadedData.people_to_connect || []; while (loadedData.people_to_connect.length < 3) loadedData.people_to_connect.push(''); setDailyData({ ...initialData, ...loadedData }); } else { setDailyData(initialData); } setWeeklyPlan(weeklyResult && weeklyResult.length > 0 ? weeklyResult[0] : null); } catch (error) { toast.error("Erro ao carregar dados da base de dados."); console.error("Erro:", error); } finally { setIsLoading(false); } }; loadPageData();
  }, [currentDate]);

  const handleSaveSection = async (dataToSave: Partial<any>) => { try { const user = await User.me(); if (!user) throw new Error("Utilizador não autenticado."); if (dailyData?.id) { await DailyPage.update(dailyData.id, dataToSave); setDailyData((prev: any) => ({ ...prev, ...dataToSave })); } else { const newRecord = { ...getInitialDailyData(currentDate, user.id), ...dataToSave }; delete newRecord.id; const { data: createdData } = await DailyPage.create(newRecord); setDailyData((prev: any) => ({ ...prev, ...createdData[0] })); } toast.success("Secção guardada!"); } catch (error) { console.error("Erro ao salvar:", error); toast.error("Erro ao guardar seção."); throw error; } };
  
  const handleSaveAll = async () => { setIsSavingAll(true); const toastId = toast.loading('A guardar página completa...'); try { const { id, ...dataToSave } = dailyData; await handleSaveSection(dataToSave); toast.success("Página guardada com sucesso!", { id: toastId }); } catch (error) { toast.error("Erro ao guardar tudo.", { id: toastId }); } finally { setIsSavingAll(false); } };
  
  const navigateDate = (direction: number) => { const date = new Date(currentDate); date.setUTCDate(date.getUTCDate() + direction); setCurrentDate(date.toISOString().split('T')[0]); };
  const updateListField = (key: 'main_priorities' | 'tasks_to_do' | 'people_to_connect', index: number, value: string) => { const list = [...dailyData[key]]; list[index] = value; setDailyData({ ...dailyData, [key]: list }); };
  const addTask = () => setDailyData({ ...dailyData, tasks_to_do: [...dailyData.tasks_to_do, ''] });
 // LINHA CORRIGIDA:
const weeklyFocusHasContent = weeklyPlan && (
    (weeklyPlan.purpose_aligned_action && weeklyPlan.purpose_aligned_action.trim() !== '') ||
    (weeklyPlan.crucial_interactions && weeklyPlan.crucial_interactions.trim() !== '')
);

  if (isLoading || !dailyData) return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} className="rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 capitalize">{new Date(currentDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                <Button variant="outline" size="icon" onClick={() => navigateDate(1)} className="rounded-full"><ChevronRight className="w-4 h-4" /></Button>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl(`MorningRitual?date=${currentDate}`)}><Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"><CardContent className="p-6 flex items-center justify-between"><div className="flex items-center gap-4"><div className="p-3 bg-stone-100 dark:bg-gray-700 rounded-xl"><Sun className="w-6 h-6 text-stone-600 dark:text-amber-400" /></div><div><h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Ritual Matinal</h3><p className="text-sm text-stone-700 dark:text-stone-300">Comece o dia com intenção.</p></div></div>{dailyData.morning_ritual && Object.values(dailyData.morning_ritual).some(v => v) ? (<CheckCircle className="w-6 h-6 text-green-500" />) : (<ArrowRight className="w-6 h-6 text-stone-400 group-hover:translate-x-1 transition-transform" />)}</CardContent></Card></Link>
            <Link to={createPageUrl(`EveningReflection?date=${currentDate}`)}><Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"><CardContent className="p-6 flex items-center justify-between"><div className="flex items-center gap-4"><div className="p-3 bg-stone-100 dark:bg-gray-700 rounded-xl"><Moon className="w-6 h-6 text-stone-700 dark:text-amber-400" /></div><div><h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Escrita Noturna</h3><p className="text-sm text-stone-700 dark:text-stone-300">Reflita e aprecie.</p></div></div>{dailyData.evening_reflection && Object.values(dailyData.evening_reflection).some(v => v) ? (<CheckCircle className="w-6 h-6 text-green-500" />) : (<ArrowRight className="w-6 h-6 text-stone-400 group-hover:translate-x-1 transition-transform" />)}</CardContent></Card></Link>
        </div>
        {/* Substitua o bloco antigo por este Card completo */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-3">
      <Target className="w-5 h-5 text-stone-600 dark:text-amber-400" />
      Seu Foco Para a Semana
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
        {weeklyFocusHasContent ? (
        // --- O que mostrar QUANDO HÁ um plano semanal ---
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
        // --- O que mostrar QUANDO NÃO HÁ um plano semanal ---
        <div className="text-center">
                <p className="text-stone-600 dark:text-stone-400">
                Crie um plano semanal para acompanhar seu foco aqui.
                </p>
                <Link to={createPageUrl("WeeklyPlanning")}>
                <Button variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Criar Plano Semanal
                </Button>
                </Link>
        </div>
        )}
        </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Mensagem para seu dia</CardTitle><SectionSaveButton onSave={() => handleSaveSection({ day_message: dailyData.day_message })} /></CardHeader><CardContent><Textarea value={dailyData.day_message || ''} onChange={(e) => setDailyData({ ...dailyData, day_message: e.target.value })} placeholder="Qual mensagem você quer carregar consigo hoje?"/></CardContent></Card>
        <Card><CardHeader><CardTitle>3 Principais Prioridades</CardTitle><SectionSaveButton onSave={() => handleSaveSection({ main_priorities: dailyData.main_priorities })} /></CardHeader><CardContent className="space-y-3">{dailyData.main_priorities.map((priority: string, index: number) => (<div key={index} className="flex items-center gap-3"><div className="flex items-center justify-center w-8 h-8 bg-stone-800 dark:bg-stone-100 text-white dark:text-black rounded-full text-sm font-bold flex-shrink-0">{index + 1}</div><Input value={priority} placeholder={`Prioridade ${index + 1}...`} onChange={(e) => updateListField('main_priorities', index, e.target.value)}/></div>))}</CardContent></Card>
        <Schedule morningSchedule={dailyData.morning_schedule || {}} afternoonSchedule={dailyData.afternoon_schedule || {}} onMorningChange={(newSchedule: any) => setDailyData((prev: any) => ({ ...prev, morning_schedule: newSchedule }))} onAfternoonChange={(newSchedule: any) => setDailyData((prev: any) => ({ ...prev, afternoon_schedule: newSchedule }))} onSave={() => handleSaveSection({ morning_schedule: dailyData.morning_schedule, afternoon_schedule: dailyData.afternoon_schedule })} />
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Tarefas a fazer</CardTitle><SectionSaveButton onSave={() => handleSaveSection({ tasks_to_do: dailyData.tasks_to_do })} /></CardHeader><CardContent className="space-y-3">{dailyData.tasks_to_do.map((task: string, index: number) => (<Input key={index} value={task} onChange={(e) => updateListField('tasks_to_do', index, e.target.value)} placeholder={`Tarefa ${index + 1}...`}/>))}<Button variant="outline" onClick={addTask} className="w-full"><Plus className="w-4 h-4 mr-2" /> Adicionar Tarefa</Button></CardContent></Card>
          <Card><CardHeader><CardTitle>Pessoas para me conectar</CardTitle><SectionSaveButton onSave={() => handleSaveSection({ people_to_connect: dailyData.people_to_connect })} /></CardHeader><CardContent className="space-y-3">{dailyData.people_to_connect.slice(0, 3).map((person: string, index: number) => (<Input key={index} value={person} onChange={(e) => updateListField('people_to_connect', index, e.target.value)} placeholder={`Pessoa ${index + 1}...`}/>))}</CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Notas Adicionais</CardTitle><SectionSaveButton onSave={() => handleSaveSection({ notes: dailyData.notes })} /></CardHeader><CardContent><Textarea value={dailyData.notes || ''} onChange={(e) => setDailyData({ ...dailyData, notes: e.target.value })} placeholder="Outras reflexões, insights ou anotações..." className="min-h-[120px] dark:bg-white/5  font-sans w-full"/></CardContent></Card>
        <div className="flex justify-center pt-6">
          <Button onClick={handleSaveAll} disabled={isSavingAll} size="lg"><>{isSavingAll ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} {isSavingAll ? 'A guardar...' : 'Guardar Página Diária Completa'}</></Button>
        </div>
    </div>
  );
}

