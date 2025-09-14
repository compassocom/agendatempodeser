import React, { useState, useEffect } from 'react';
import { Meditation } from '@/Entities/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BrainCircuit, Clock, ArrowRight, Wind, Sparkles, Heart, Loader2 } from 'lucide-react';
import Badge from '@/Components/ui/Badge';

// A correção está aqui -> "export default"
export default function MeditationsPage() {
  const [meditations, setMeditations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        // Usando um mock, já que não temos backend
        const mockMeditations = [
          { id: '1', title: 'Respiração Consciente', description: 'Uma pausa de 5 minutos para focar na sua respiração e acalmar a mente.', type: 'Respiração', duration: 5 },
          { id: '2', title: 'Escaneamento Corporal', description: 'Relaxe cada parte do seu corpo, da cabeça aos pés, liberando a tensão.', type: 'Atenção Plena', duration: 10 },
          { id: '3', title: 'Visualização da Gratidão', description: 'Conecte-se com o sentimento de gratidão visualizando as coisas boas da sua vida.', type: 'Gratidão', duration: 7 },
        ];
        setMeditations(mockMeditations);
      } catch (error) {
        console.error("Erro ao buscar meditações:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditations();
  }, []);
  
  const typeIcons: { [key: string]: React.ReactNode } = {
    "Atenção Plena": <BrainCircuit className="w-5 h-5" />,
    "Respiração": <Wind className="w-5 h-5" />,
    "Visualização": <Sparkles className="w-5 h-5" />,
    "Gratidão": <Heart className="w-5 h-5" />
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-16 h-16 animate-spin text-stone-300" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 min-h-[calc(100vh-150px)]">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Sessões de Meditação</h1>
        <p className="text-stone-600 dark:text-stone-100 max-w-2xl mx-auto">
          Encontre uma pausa consciente no seu dia. Escolha uma meditação abaixo para começar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meditations.map(meditation => (
          <Link to={createPageUrl(`MeditationPlayer?id=${meditation.id}`)} key={meditation.id}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-0 bg-white flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-stone-900 dark:text-stone-100 font-medium">
                    {meditation.title}
                  </CardTitle>
                  <div className="p-2 bg-stone-100 dark:bg-black/50 rounded-lg">
                    {typeIcons[meditation.type] || <BrainCircuit className="w-5 h-5" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-stone-600 dark:text-stone-100 text-sm leading-relaxed font-light mb-4">
                  {meditation.description}
                </p>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-100">
                  <div className="flex items-center gap-4">
                    <Badge>{meditation.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{meditation.duration} min</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-white dark:text-stone-100group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}