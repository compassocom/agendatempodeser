import React, { useState, useEffect } from "react";
import { DailyPage, User } from "@/Entities";
import { Button } from "@/Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/Textarea";
import { Label } from "@/Components/ui/Label";
import { Sun, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import toast from 'react-hot-toast';

export default function MorningRitualPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  const [dailyEntry, setDailyEntry] = useState<any>(null);
  const [morningRitual, setMorningRitual] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadDailyEntry = async () => {
      if (!date) return;
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) return;

        // Corrigido para usar user.id
        const result = await DailyPage.filter({ date, user_id: user.id });
        if (result && result.length > 0 && result[0].id) {
          setDailyEntry(result[0]);
          setMorningRitual(result[0].morning_ritual || {});
        } else {
          setDailyEntry(null); // Indica que não há registro existente
          setMorningRitual({});
        }
      } catch (error) {
        toast.error("Erro ao carregar dados.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDailyEntry();
  }, [date]);

  const handleSave = async () => {
    if (!date) return;
    setIsSaving(true);
    const toastId = toast.loading("Salvando ritual matinal...");
    try {
      const user = await User.me();
      if (!user) throw new Error("Usuário não autenticado.");

      const dataToSave = { morning_ritual: morningRitual };

      if (dailyEntry && dailyEntry.id) {
        // Atualiza o registro existente
        await DailyPage.update(dailyEntry.id, dataToSave);
      } else {
        // Cria um novo registro
        const payload = {
          date: date,
          user_id: user.id, // Corrigido para usar user.id
          ...dataToSave
        };
        await DailyPage.create(payload);
      }
      toast.success("Ritual salvo com sucesso!", { id: toastId });
      navigate(createPageUrl(`DailyPage?date=${date}`));
    } catch (error) {
      toast.error("Erro ao salvar.", { id: toastId });
      console.error("Erro ao salvar Ritual Matinal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setMorningRitual(prev => ({ ...prev, [field]: value }));
  };
  
  const morningQuestions = [
    { key: 'daily_energy', text: 'Qual é a energia que permeia meu dia hoje? Que mensagem ela traz para minha jornada?' },
    { key: 'limiting_patterns', text: 'Quais padrões de pensamento ou comportamento podem me desviar do meu caminho hoje? Como posso transformá-los em oportunidades?' },
    { key: 'conscious_choices', text: 'Que escolhas conscientes posso fazer hoje para nutrir meu bem-estar e alinhar minhas ações com meus valores?' },
    { key: 'express_gratitude', text: 'Como posso expressar amor, gratidão ou apreço a quem é importante para mim hoje?' },
    { key: 'expand_horizons', text: 'Qual pequeno passo posso dar hoje para expandir meus horizontes e abraçar o desconhecido?' },
    { key: 'plant_seeds', text: 'Quais sementes estou plantando hoje que florescerão no futuro? Como posso nutri-las com paciência e dedicação?' },
    { key: 'internal_criteria', text: 'Quais são os critérios internos que guiarão minhas ações hoje? Como posso honrar minha integridade e me orgulhar?' }
  ];

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-stone-100 dark:bg-stone-700  rounded-xl border border-stone-200 dark:border-stone-700">
            <Sun className="w-6 h-6 text-stone-700 dark:text-stone-100" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">Ritual Matinal</h1>
        <p className="text-stone-900 dark:text-stone-100">
          7 perguntas para definir o dia, evitar auto-sabotação e sair da zona de conforto.
        </p>
      </div>

      <Card className="bg-white border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-900 dark:text-stone-100">Reflexões Matinais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {morningQuestions.map((question, index) => (
              <div key={question.key} className="flex flex-col gap-2">
                <Label htmlFor={`morning-q-${index}`} className="text-stone-900 dark:text-stone-100 font-medium">
                  {index + 1}. {question.text}
                </Label>
                <Textarea
                  id={`morning-q-${index}`}
                  value={morningRitual[question.key] || ''}
                  onChange={(e) => handleInputChange(question.key, e.target.value)}
                  placeholder="Sua reflexão..."
                  className="bg-stone-50/50 min-h-[100px]"
                />
              </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl(`DailyPage?date=${date}`))}
          className="bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a Página Diária
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="px-8 bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 text-white dark:text-black shadow-lg"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Salvando...' : 'Salvar Ritual'}
        </Button>
      </div>
    </div>
  );
}