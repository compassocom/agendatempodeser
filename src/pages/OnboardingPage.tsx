import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/entities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    objective: '',
    values: '',
    inspiration: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswerChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const toastId = toast.loading("A guardar as suas respostas...");
    try {
      const user = await User.me();
      if (!user) {
        throw new Error("Utilizador não encontrado.");
      }
      
      const userData = {
        ...answers,
        hasCompletedOnboarding: true
      };

      await User.updateMyUserData({ data: userData });
      
      toast.success("Bem-vindo(a)!", { id: toastId });
      navigate(createPageUrl('Dashboard'));

    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente.", { id: toastId });
      console.error("Erro no onboarding:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">Vamos Começar a Sua Jornada</h1>
          <p className="text-stone-600 mt-2">Algumas perguntas para personalizar a sua experiência.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="font-medium text-stone-800">Qual é o seu maior objetivo ou intenção ao usar esta agenda?</label>
            <Textarea 
              value={answers.objective}
              onChange={(e) => handleAnswerChange('objective', e.target.value)}
              className="mt-2"
              placeholder="Ex: Organizar minha rotina, encontrar mais clareza, praticar a gratidão..."
            />
          </div>
          <div>
            <label className="font-medium text-stone-800">Quais são os 3 saberes mais importantes que guiam a sua vida hoje?</label>
            <Textarea 
              value={answers.values}
              onChange={(e) => handleAnswerChange('values', e.target.value)}
              className="mt-2"
              placeholder="Ex: Família, liberdade, criatividade, segurança..."
            />
          </div>
          <div>
            <label className="font-medium text-stone-800">O que ou quem te inspira a ser a sua melhor versão?</label>
            <Textarea 
              value={answers.inspiration}
              onChange={(e) => handleAnswerChange('inspiration', e.target.value)}
              className="mt-2"
              placeholder="Ex: Um livro, uma pessoa, uma filosofia de vida..."
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isSaving} size="lg" className="w-full bg-stone-800 hover:bg-stone-900 text-white">
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Começar a Minha Jornada"}
        </Button>
      </div>
    </div>
  );
}

