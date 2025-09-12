import React, { useState, useEffect, ReactNode } from "react";
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Target, Loader2, Lightbulb } from "lucide-react";

// --- CORREÇÃO: Importações reais das entidades e componentes ---
import { User, FutureVision } from "@/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Tipos
type Goal = { goal: string; steps: string; target_date: string; };

const FormField = ({ label, children, htmlFor }: { label: string, children: ReactNode, htmlFor?: string }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
  </div>
);

const INITIAL_STATE = {
  id: null,
  user_id: '',
  ideal_future_description: '',
  life_purpose: '',
  person_i_want_to_be: '',
  most_important_to_achieve: '',
  end_of_life_reflection: '',
  one_year_goals: [{ goal: '', steps: '', target_date: '' }],
  three_year_goals: [{ goal: '', steps: '', target_date: '' }]
};

export default function FutureVisionPage() {
  const [visionData, setVisionData] = useState<any>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadFutureVision = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) return;
        
        const existing = await FutureVision.filter({ user_id: user.id });
        if (existing && existing.length > 0 && existing[0].id) {
          const data = { ...INITIAL_STATE, ...existing[0] };
          if (!data.one_year_goals || data.one_year_goals.length === 0) {
            data.one_year_goals = [{ goal: '', steps: '', target_date: '' }];
          }
          if (!data.three_year_goals || data.three_year_goals.length === 0) {
            data.three_year_goals = [{ goal: '', steps: '', target_date: '' }];
          }
          setVisionData(data);
        } else {
          setVisionData({ ...INITIAL_STATE, user_id: user.id });
        }
      } catch (error) {
        toast.error("Não foi possível carregar os dados.");
        console.error("Erro ao carregar Visão do Futuro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFutureVision();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('A salvar a sua visão...');
    try {
      const user = await User.me();
      if (!user) throw new Error("Usuário não autenticado.");

      if (visionData.id) {
        // --- LÓGICA DE ATUALIZAÇÃO (JÁ ESTAVA CORRETA) ---
        // Se já temos um ID, apenas atualizamos o registro existente.
        const { id, ...dataToUpdate } = visionData; // Separa o ID do resto dos dados
        await FutureVision.update(id, { ...dataToUpdate, user_id: user.id });

      } else {
        // --- LÓGICA DE CRIAÇÃO (CORRIGIDA) ---
        // Se não há ID, criamos um novo registro.
        const { id, ...dataToCreate } = visionData; // Remove o 'id: null' do objeto
        
        const result = await FutureVision.create({ ...dataToCreate, user_id: user.id });

        if (result && result.data && result.data.length > 0) {
          // Atualiza o estado com os dados retornados do banco, incluindo o novo ID
          setVisionData(prev => ({ ...prev, ...result.data[0] }));
        } else {
          // Se o Supabase não retornar os dados, lançamos um erro.
          console.error("Erro na criação: ", result?.error);
          throw new Error("Falha ao criar a visão de futuro. O resultado retornado foi inválido.");
        }
      }
      toast.success("Visão do futuro salva!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao salvar.", { id: toastId });
      console.error("Erro detalhado em handleSave:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateGoal = (type: 'one_year_goals' | 'three_year_goals', index: number, field: string, value: string) => {
    const updatedGoals = [...visionData[type]];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setVisionData({ ...visionData, [type]: updatedGoals });
  };

  const addGoal = (type: 'one_year_goals' | 'three_year_goals') => {
    setVisionData((prev: any) => ({
      ...prev,
      [type]: [...(prev[type] || []), { goal: '', steps: '', target_date: '' }]
    }));
  };

  const removeGoal = (type: 'one_year_goals' | 'three_year_goals', index: number) => {
    if (visionData[type].length <= 1) return;
    const updatedGoals = visionData[type].filter((_: any, i: number) => i !== index);
    setVisionData({ ...visionData, [type]: updatedGoals });
  };

  const reflectionQuestions = [
    { key: 'ideal_future_description', title: 'Como eu imagino meu futuro ideal?', subtitle: 'Procure escrever um único parágrafo descritivo.' },
    { key: 'life_purpose', title: 'Qual o propósito que me motiva e alimenta meu estado de espírito e felicidade?' },
    { key: 'person_i_want_to_be', title: 'Que tipo de pessoa eu sou e quais passos devo seguir para que o mundo veja isso?' },
    { key: 'most_important_to_achieve', title: 'Para mim o mais importante de realizar, experienciar e me tornar é...' },
    { key: 'end_of_life_reflection', title: 'No final da minha vida eu quero olhar para trás no tempo e saber que...' }
  ];
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 capitalize flex justify-center items-center gap-3">
          <Lightbulb className="w-8 h-8 text-stone-600 dark:text-amber-400"/>
          Visão de Futuro
        </h1>
        <p className="text-stone-600 dark:text-stone-300">Conecte-se com sua visão de longo prazo para guiar suas ações presentes.</p>
      </div>

      <div className="space-y-6">
        {reflectionQuestions.map((question) => (
          <Card key={question.key}>
            <CardContent className="p-6">
              <FormField label={question.title} htmlFor={question.key}>
                {question.subtitle && <p className="text-sm text-stone-600 dark:text-stone-300 mb-2">{question.subtitle}</p>}
                <Textarea
                  id={question.key}
                  value={visionData[question.key] || ''}
                  onChange={(e) => setVisionData({ ...visionData, [question.key]: e.target.value })}
                  placeholder="Sua reflexão..."
                  className="min-h-[120px] w-full dark:bg-white/10"
                />
              </FormField>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Target className="w-5 h-5 text-stone-600 dark:text-amber-400" /> Objetivos de 1 Ano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {visionData.one_year_goals.map((goal: Goal, index: number) => (
              <div key={index} className="p-4 bg-stone-50/80 rounded-lg border border-stone-200 dark:bg-gray-700/50 dark:border-gray-600 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Objetivo {index + 1}</Label>
                  {visionData.one_year_goals.length > 1 &&
                    <Button variant="ghost" size="sm" onClick={() => removeGoal('one_year_goals', index)} className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"><Trash2 className="w-4 h-4" /></Button>
                  }
                </div>
                <div className="flex flex-col gap-4">
                  <FormField label="Objetivo" htmlFor={`1y-goal-${index}`}>
                    <Textarea id={`1y-goal-${index}`} value={goal.goal} onChange={(e) => updateGoal('one_year_goals', index, 'goal', e.target.value)} placeholder="Descreva seu objetivo..." className="h-20 w-full dark:bg-white/10" />
                  </FormField>
                  <FormField label="Principais Passos" htmlFor={`1y-steps-${index}`}>
                    <Textarea id={`1y-steps-${index}`} value={goal.steps} onChange={(e) => updateGoal('one_year_goals', index, 'steps', e.target.value)} placeholder="Quais são os maiores passos?" className="h-24 w-full dark:bg-white/10" />
                  </FormField>
                  <FormField label="Data Alvo" htmlFor={`1y-date-${index}`}>
                    <Input id={`1y-date-${index}`} type="date" value={goal.target_date} onChange={(e) => updateGoal('one_year_goals', index, 'target_date', e.target.value)} className="w-fit dark:bg-white/10" />
                  </FormField>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addGoal('one_year_goals')} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Objetivo
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Target className="w-5 h-5 text-stone-600 dark:text-amber-400" /> Objetivos de 3 Anos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {visionData.three_year_goals.map((goal: Goal, index: number) => (
              <div key={index} className="p-4 bg-stone-50/80 rounded-lg border border-stone-200 dark:bg-gray-700/50 dark:border-gray-600 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Objetivo {index + 1}</Label>
                  {visionData.three_year_goals.length > 1 &&
                    <Button variant="ghost" size="sm" onClick={() => removeGoal('three_year_goals', index)} className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"><Trash2 className="w-4 h-4" /></Button>
                  }
                </div>
                <div className="flex flex-col gap-4">
                  <FormField label="Objetivo" htmlFor={`3y-goal-${index}`}>
                    <Textarea id={`3y-goal-${index}`} value={goal.goal} onChange={(e) => updateGoal('three_year_goals', index, 'goal', e.target.value)} placeholder="Descreva seu objetivo..." className="h-20 w-full dark:bg-white/10" />
                  </FormField>
                  <FormField label="Principais Passos" htmlFor={`3y-steps-${index}`}>
                    <Textarea id={`3y-steps-${index}`} value={goal.steps} onChange={(e) => updateGoal('three_year_goals', index, 'steps', e.target.value)} placeholder="Quais são os maiores passos?" className="h-24 w-full dark:bg-white/10" />
                  </FormField>
                  <FormField label="Data Alvo" htmlFor={`3y-date-${index}`}>
                    <Input id={`3y-date-${index}`} type="date" value={goal.target_date} onChange={(e) => updateGoal('three_year_goals', index, 'target_date', e.target.value)} className="w-fit dark:bg-white/10" />
                  </FormField>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addGoal('three_year_goals')} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Objetivo
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isSaving ? 'A guardar...' : 'Guardar Visão'}
        </Button>
      </div>
    </div>
  );
}

