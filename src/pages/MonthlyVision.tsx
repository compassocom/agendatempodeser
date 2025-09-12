import React, { useState, useEffect, useMemo } from "react";
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, Loader2, Calendar } from "lucide-react";

// --- IMPORTAÇÕES REAIS (COM CAMINHOS CORRIGIDOS) ---
import { User, MonthlyVision } from "../entities/index";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import FormField from "../components/ui/formfield";

// Tipos para os dados
type Project = { title: string; description: string; first_steps: string; };
type Event = { title: string; preparation: string; };
type MonthlyVisionData = {
    id: string | null;
    month: string;
    user_id: string;
    major_projects: Project[];
    major_events: Event[];
    preparation_notes: string;
    best_version_notes: string;
    ideal_month_vision: string;
};

const INITIAL_STATE: MonthlyVisionData = { id: null, month: '', user_id: '', major_projects: [{ title: '', description: '', first_steps: '' }], major_events: [{ title: '', preparation: '' }], preparation_notes: '', best_version_notes: '', ideal_month_vision: '' };

export default function MonthlyVisionPage() {
  const [visionData, setVisionData] = useState<MonthlyVisionData>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentMonth = useMemo(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) return;

        const result = await MonthlyVision.filter({ month: currentMonth, user_id: user.id });
        
        if (result && result.length > 0) {
          const loadedData = result[0] as MonthlyVisionData;
          if (!loadedData.major_projects || loadedData.major_projects.length === 0) { loadedData.major_projects = [{ title: '', description: '', first_steps: '' }]; }
          if (!loadedData.major_events || loadedData.major_events.length === 0) { loadedData.major_events = [{ title: '', preparation: '' }]; }
          setVisionData(loadedData);
        } else {
          setVisionData({ ...INITIAL_STATE, month: currentMonth, user_id: user.id });
        }
      } catch(error) {
        console.error("Erro ao carregar visão mensal:", error);
        toast.error("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentMonth]);

  // Em src/pages/MonthlyVisionPage.tsx

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading('A guardar a sua visão mensal...');
        try {
        const user = await User.me();
        if (!user) throw new Error("Utilizador não autenticado.");

        const dataPayload = { ...visionData, user_id: user.id, month: currentMonth };

        if (dataPayload.id) {
            // --- ATUALIZAR (UPDATE) ---
            const { id, ...dataToUpdate } = dataPayload;
            await MonthlyVision.update(id, dataToUpdate);

        } else {
            // --- CRIAR (CREATE) ---
            const { id, ...dataToCreate } = dataPayload; // Garante que 'id' não seja enviado na criação
            
            const result = await MonthlyVision.create(dataToCreate);
            
            if (result?.data?.[0]) {
            // Atualiza o estado com o ID retornado pelo banco de dados
            setVisionData(prev => ({ ...prev, id: result.data[0].id }));
            } else {
            console.error("Erro na criação:", result?.error);
            throw new Error("Falha ao criar a visão mensal.");
            }
        }

        toast.success("Visão mensal guardada com sucesso!", { id: toastId });
        } catch (error) {
        toast.error("Ocorreu um erro ao guardar.", { id: toastId });
        console.error("Erro em handleSave:", error);
        } finally {
        setIsSaving(false);
        }
    };

  const handleDynamicChange = (key: keyof MonthlyVisionData, value: string) => setVisionData(prev => ({...prev, [key]: value}));
  
  const handleNestedChange = <T extends 'major_projects' | 'major_events'>(listName: T, index: number, field: keyof MonthlyVisionData[T][0], value: string) => {
    setVisionData(prev => {
        const updatedList = [...(prev[listName] || [])];
        updatedList[index] = { ...updatedList[index], [field]: value };
        return { ...prev, [listName]: updatedList };
    });
  };

  const addToList = (listName: 'major_projects' | 'major_events', newItem: Project | Event) => {
    setVisionData(prev => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] as any }));
  };

  const removeFromList = (listName: 'major_projects' | 'major_events', index: number) => {
    if (visionData[listName].length <= 1) return;
    setVisionData(prev => ({...prev, [listName]: prev[listName].filter((_: any, i: number) => i !== index)}));
  };

  const monthNameForDisplay = new Date(`${currentMonth}-02`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  if (isLoading) return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 capitalize flex justify-center items-center gap-3">
                <Calendar className="w-8 h-8 text-stone-600 dark:text-amber-400"/>
                {monthNameForDisplay}
            </h1>
            <p className="text-stone-600 dark:text-stone-300">Defina a sua visão e intenções para o mês.</p>
        </div>

        <div className="space-y-8">
            <Card><CardHeader><CardTitle>Maiores Projetos</CardTitle><p className="text-sm text-stone-600 dark:text-stone-300">Quais projetos, se concluídos este mês, trariam o maior impacto?</p></CardHeader><CardContent className="space-y-6">
                {(visionData.major_projects || []).map((p, i) => (
                    <div key={i} className="p-4 bg-stone-50/80 rounded-lg border border-stone-200 dark:bg-gray-700/50 dark:border-gray-600 space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Projeto {i + 1}</Label>
                            {visionData.major_projects.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removeFromList('major_projects', i)}><Trash2 className="w-4 h-4" /></Button>)}
                        </div>
                        <FormField label="Título"><Input value={p.title} onChange={e => handleNestedChange('major_projects', i, 'title', e.target.value)}/></FormField>
                        <FormField label="Descrição"><Textarea value={p.description} onChange={e => handleNestedChange('major_projects', i, 'description', e.target.value)}/></FormField>
                        <FormField label="Primeiros Passos"><Textarea value={p.first_steps} onChange={e => handleNestedChange('major_projects', i, 'first_steps', e.target.value)}/></FormField>
                    </div>
                ))}
                <Button variant="outline" onClick={() => addToList('major_projects', { title: '', description: '', first_steps: '' })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Adicionar Projeto</Button>
            </CardContent></Card>
            
            <Card><CardHeader><CardTitle>Maiores Eventos</CardTitle><p className="text-sm text-stone-600 dark:text-stone-300">Quais eventos cruciais exigem a sua presença plena?</p></CardHeader><CardContent className="space-y-6">
                {(visionData.major_events || []).map((e, i) => (
                    <div key={i} className="p-4 bg-stone-50/80 rounded-lg border border-stone-200 dark:bg-gray-700/50 dark:border-gray-600 space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Evento {i + 1}</Label>
                            {visionData.major_events.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removeFromList('major_events', i)}><Trash2 className="w-4 h-4" /></Button>)}
                        </div>
                        <FormField label="Evento"><Input value={e.title} onChange={ev => handleNestedChange('major_events', i, 'title', ev.target.value)}/></FormField>
                        <FormField label="Como me preparar?"><Textarea value={e.preparation} onChange={ev => handleNestedChange('major_events', i, 'preparation', ev.target.value)}/></FormField>
                    </div>
                ))}
                <Button variant="outline" onClick={() => addToList('major_events', { title: '', preparation: '' })} className="w-full"><Plus className="w-4 h-4 mr-2" /> Adicionar Evento</Button>
            </CardContent></Card>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <Card><CardHeader><CardTitle className="text-base">Como devo me preparar?</CardTitle></CardHeader><CardContent><Textarea value={visionData.preparation_notes} onChange={e => handleDynamicChange('preparation_notes', e.target.value)} className="min-h-[120px] w-full" /></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-base">Como serei o meu melhor?</CardTitle></CardHeader><CardContent><Textarea value={visionData.best_version_notes} onChange={e => handleDynamicChange('best_version_notes', e.target.value)} className="min-h-[120px] w-full" /></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-base">Como seria o meu mês ideal?</CardTitle></CardHeader><CardContent><Textarea value={visionData.ideal_month_vision} onChange={e => handleDynamicChange('ideal_month_vision', e.target.value)} className="min-h-[120px] w-full" /></CardContent></Card>
            </div>
        </div>

        <div className="flex justify-center pt-6">
            <Button onClick={handleSave} disabled={isSaving || isLoading} size="lg">
                {isSaving 
                 ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                 : <Save className="w-5 h-5 mr-2" />
                }
                {isSaving ? 'A guardar...' : 'Guardar Visão Mensal'}
            </Button>
        </div>
    </div>
  );
}

