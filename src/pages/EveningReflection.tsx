import { useState, useEffect } from "react";
import { DailyPage, User } from "@/Entities/Index";
import { Button } from "@/Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Textarea } from "@/Components/ui/Textarea";
import { Label } from "@/Components/ui/Label";
import { Moon, Save, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import toast from "react-hot-toast";
import { toLocalDateString } from "@/utils/date";
import { useUnsavedWarning, isDirty } from "@/hooks/useUnsavedWarning";

export default function EveningReflectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // sem ?date= no endereço, é a escrita de hoje
  const date = searchParams.get('date') || toLocalDateString(new Date());

  const [dailyEntry, setDailyEntry] = useState<any>(null);
  const [eveningReflection, setEveningReflection] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReflection, setSavedReflection] = useState<Record<string, string>>({});
  const dirty = !isLoading && isDirty(eveningReflection, savedReflection);
  useUnsavedWarning(dirty);

  useEffect(() => {
    const loadDailyEntry = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) {
          console.warn("Usuário não logado.");
          setIsLoading(false);
          return;
        }
        let entry = await DailyPage.filter({ date, user_id: user.id });
        if (entry.length > 0) {
          setDailyEntry(entry[0]);
          setEveningReflection(entry[0].evening_reflection || {});
          setSavedReflection(entry[0].evening_reflection || {});
        } else {
          setDailyEntry({ date });
          setEveningReflection({});
          setSavedReflection({});
        }
      } catch (error) {
        toast.error("Erro ao carregar a escrita noturna.");
        console.error("Erro ao carregar página diária:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (date) {
      loadDailyEntry();
    }
  }, [date]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Salvando escrita noturna...");
    try {
      const user = await User.me();
      if (!user) {
        toast.error("Sua sessão expirou. Entre de novo.", { id: toastId });
        setIsSaving(false);
        return;
      }

      let payload = { ...dailyEntry, evening_reflection: eveningReflection };
      
      if (dailyEntry?.id) {
        await DailyPage.update(dailyEntry.id, { evening_reflection: eveningReflection });
      } else {
        payload = {
          ...payload,
          date: date,
          user_id: user.id,
        };
        await DailyPage.create(payload);
      }
      setSavedReflection(eveningReflection);
      toast.success("Escrita noturna salva!", { id: toastId });
      navigate(createPageUrl(`DailyPage?date=${date}`));
    } catch (error) {
      toast.error("Não foi possível salvar. Tente de novo.", { id: toastId });
      console.error("Erro ao salvar reflexão noturna:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEveningReflection(prev => ({ ...prev, [field]: value }));
  };

  const eveningQuestions = [
    { key: 'daily_blessings', text: 'Quais bênçãos, grandes e pequenas, permearam meu dia hoje? Como posso cultivar um coração grato e apreciar a vida?' },
    { key: 'major_challenge', text: 'Qual foi a maior provação que enfrentei hoje? Que forças descobri em mim mesmo ao superá-la?' },
    { key: 'wisdom_gained', text: 'Qual foi a sabedoria que emergiu das experiências de hoje? Como posso integrá-la em minha jornada?' },
    { key: 'moments_of_misalignment', text: 'Quais foram os momentos de desalinho ou frustração hoje? Que lições posso extrair deles com compaixão por mim mesmo?' },
    { key: 'better_choices', text: 'Quais escolhas ou ações poderiam ter nutrido mais meu bem-estar e propósito hoje?' },
    { key: 'sustaining_habits', text: 'Quais hábitos me sustentaram hoje? Como posso celebrá-los e buscar formas de aprimoramento?' }
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone-500"></div></div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-stone-100 dark:bg-black/50 rounded-xl border border-stone-200">
            <Moon className="w-6 h-6 text-stone-700 dark:text-stone-100" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">Escrita Noturna</h1>
        <p className="text-stone-600 dark:text-stone-100">
          Reflexão sobre aprendizados, gratidão e avaliação do dia.
        </p>
      </div>

      <Card className="bg-white border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-900 dark:text-stone-100">Reflexões Noturnas</CardTitle>
        </CardHeader>
          <CardContent className="space-y-6">
            {eveningQuestions.map((question, index) => (
              <div key={question.key} className="flex flex-col gap-2">
                <Label htmlFor={`evening-q-${index}`} className="text-stone-800 dark:text-stone-100 font-medium">
                  {index + 8}. {question.text}
                </Label>
                <Textarea
                  id={`evening-q-${index}`}
                  value={eveningReflection[question.key] || ''}
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
          onClick={() => {
            if (dirty && !window.confirm('Sua escrita ainda não foi salva. Voltar mesmo assim?')) return;
            navigate(createPageUrl(`DailyPage?date=${date}`));
          }}
          className="bg-white dark:bg-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a Página Diária
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="px-8 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 text-white dark:text-black shadow-lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Reflexão'}
        </Button>
      </div>
    </div>
  );
}
