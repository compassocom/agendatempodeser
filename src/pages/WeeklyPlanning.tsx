import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { WeeklyPlanning, User, MonthlyVision } from "@/Entities";
import { Button } from "@/Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Textarea } from "@/Components/ui/Textarea";
import { Input } from "@/Components/ui/Input";
import { Save, ChevronLeft, ChevronRight, Pin, Loader2 } from "lucide-react";

// Estado inicial para garantir que todos os campos existam
const INITIAL_STATE = {
  week_start_date: '',
  user_id: '',
  week_calendar: { text: '' },
  purpose_aligned_action: '',
  crucial_interactions: '',
  self_care_act: '',
  inspiring_people: '',
  three_pillars: '',
  insights_reflections: '',
};

export default function WeeklyPlanningPage() {
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff)).toISOString().split('T')[0];
  });

  const [weeklyData, setWeeklyData] = useState<any>(INITIAL_STATE);
  const [monthlyVision, setMonthlyVision] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) return; // Se não houver usuário, não faz nada

        const currentMonth = weekStartDate.slice(0, 7);

        // --- CORREÇÃO 1: Usar user.id em vez de user.email ---
        const [weeklyResult, monthlyResult] = await Promise.all([
          WeeklyPlanning.filter({ week_start_date: weekStartDate, user_id: user.id }),
          MonthlyVision.filter({ month: currentMonth, user_id: user.id })
        ]);

        if (weeklyResult && weeklyResult.length > 0 && weeklyResult[0].id) {
          // Garante que o estado inicial e os dados carregados sejam mesclados
          setWeeklyData({ ...INITIAL_STATE, ...weeklyResult[0] });
        } else {
          setWeeklyData({ ...INITIAL_STATE, week_start_date: weekStartDate, user_id: user.id });
        }

        setMonthlyVision(monthlyResult && monthlyResult.length > 0 ? monthlyResult[0] : null);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [weekStartDate]);

  // --- CORREÇÃO 2: Lógica de salvar robusta ---
  // Em src/pages/WeeklyPlanningPage.tsx

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Salvando planejamento...');
    try {
      const user = await User.me();
      if (!user) {
        toast.error("Sessão expirada.", { id: toastId });
        setIsSaving(false);
        return;
      }

      // Lógica principal
      if (weeklyData.id) {
        // --- ATUALIZAR (UPDATE) ---
        // Se já existe um ID, atualizamos o registro.
        const { id, ...dataToUpdate } = weeklyData;
        await WeeklyPlanning.update(id, { ...dataToUpdate, user_id: user.id, week_start_date: weekStartDate });

      } else {
        // --- CRIAR (CREATE) ---
        // Se não há ID, criamos um novo.
        const { id, ...dataToCreate } = weeklyData; // Remove o 'id: null'
        
        const { data: createdData, error } = await WeeklyPlanning.create({ 
          ...dataToCreate, 
          user_id: user.id, 
          week_start_date: weekStartDate 
        });

        if (error || !createdData || createdData.length === 0) {
          console.error("Erro na criação:", error);
          throw new Error("Falha ao criar o planejamento semanal.");
        }
        
        // Atualiza o estado com os dados retornados, incluindo o novo ID
        setWeeklyData(createdData[0]);
      }
      
      toast.success('Planejamento salvo!', { id: toastId });
    } catch (error) {
      console.error("Erro ao salvar planejamento semanal:", error);
      toast.error("Erro ao salvar.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const navigateWeek = (direction: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (direction * 7));
    setWeekStartDate(date.toISOString().split('T')[0]);
  };

  const getWeekRange = () => {
    const start = new Date(weekStartDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      start: start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      end: end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  };

  const weekRange = getWeekRange();

  const reflectionQuestions = [
    { key: 'purpose_aligned_action', title: 'Ação Alinhada com Propósito', question: 'Qual é a ação mais alinhada com meu propósito hoje, que, se realizada, fará uma diferença significativa?' },
    { key: 'crucial_interactions', title: 'Interações Cruciais', question: 'Quais interações são cruciais hoje para construir relacionamentos autênticos e colaborativos?' },
    { key: 'self_care_act', title: 'Ato de Autocuidado', question: 'Qual é o ato de autocuidado que nutrirá meu corpo, mente e espírito hoje?' },
    { key: 'inspiring_people', title: 'Pessoas Inspiradoras', question: 'Quem são as pessoas que me inspiram, me apoiam e me desafiam a crescer?' },
    { key: 'three_pillars', title: 'Três Pilares do Mês', question: 'Quais são os 3 pilares que sustentarão meu mês, alinhado com meus valores e propósito?' },
    { key: 'insights_reflections', title: 'Insights e Reflexões', question: 'Espaço para insights, intuições e reflexões que emergem ao longo da semana.' }
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)} className="rounded-full bg-white/50 "><ChevronLeft className="w-4 h-4" /></Button>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Semana de {weekRange.start} a {weekRange.end}
          </h1>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)} className="rounded-full bg-white/50 "><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex justify-center">
          <Input type="date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} className="w-fit bg-white/80 " />
        </div>
      </div>

      <Card className="bg-white  border-stone-200 dark:border-stone-900">
        <CardHeader>
          <CardTitle className="text-stone-900 dark:text-stone-100">Eventos da Semana</CardTitle>
          <p className="text-sm text-stone-600 dark:text-stone-100">
            Anote os principais eventos, atividades e projetos da semana para ter clareza.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={weeklyData.week_calendar?.text ?? ''}
            onChange={(e) => setWeeklyData({ ...weeklyData, week_calendar: { text: e.target.value } })}
            placeholder="Segunda: Reunião com equipe às 14h&#10;Terça: Dentista às 16h&#10;Quarta: Jantar com amigos..."
            className="min-h-[120px] bg-stone-50/50  font-sans w-full"
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {reflectionQuestions.map((item) => (
          <Card key={item.key} className="bg-white  border-stone-200">
            <CardContent className="p-6 flex flex-col gap-2">
              <h4 className="text-stone-900 dark:text-stone-100 text-lg font-semibold">{item.title}</h4>
              <p className="text-sm text-stone-600 dark:text-stone-100">{item.question}</p>
              <Textarea
                id={item.key}
                value={weeklyData[item.key] || ''}
                onChange={(e) => setWeeklyData({ ...weeklyData, [item.key]: e.target.value })}
                placeholder="Sua reflexão..."
                className="min-h-[120px] bg-stone-50/50  w-full"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="px-8 py-3 bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 text-white dark:text-black shadow-lg w-72">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Salvando...' : 'Salvar Planejamento Semanal'}
        </Button>
      </div>
    </div>
  );
}