import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { Calendar, Target, Sun, Lightbulb, ArrowRight, Quote, Loader2, Flame } from "lucide-react";

// --- IMPORTAÇÕES REAIS ---
import { User, DailyPage } from "@/entities/index";
import { createPageUrl } from "@/utils";
import { getTodayQuote } from "@/utils/quotes";
import { calculateStreak } from "@/utils/stats";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        if (!user.user_metadata?.hasCompletedOnboarding) {
          // navigate(createPageUrl('Introduction'));
          // return;
        }

        const fullName = user.user_metadata?.full_name || 'Ser';
        setUserName(fullName.split(' ')[0]);

        const allDailyPages = await DailyPage.filter({ user_id: user.id });
        
        if (allDailyPages && allDailyPages.length > 0) {
            const dates = allDailyPages
              .filter((page: any) => page && typeof page.date === 'string')
              .map((page: any) => page.date.split('T')[0]);
            
            if(dates.length > 0) {
              setStreak(calculateStreak(dates));
            }
        } else {
          setStreak(0);
        }

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [navigate]);

  const quickActions = [
    { title: "Visão Macro Mensal", description: "Defina seus projetos...", icon: Calendar, url: createPageUrl("MonthlyVision") },
    { title: "Planejamento Semanal", description: "Reflexões da semana...", icon: Target, url: createPageUrl("WeeklyPlanning") },
    { title: "Página Diária", description: "Ritual matinal e reflexões...", icon: Sun, url: createPageUrl("DailyPage") },
    { title: "Visão do Futuro", description: "Objetivos de longo prazo...", icon: Lightbulb, url: createPageUrl("FutureVision") }
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6 py-12">
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100">
              Bem-vindo(a), <span className="font-medium">{userName}</span>
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto font-light leading-relaxed">
              Este é seu espaço para planejar com consciência.
            </p>
        </div>

        <div className={`grid gap-6 ${streak > 0 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          <Card>
            <CardContent className="p-8 text-center flex flex-col justify-center items-center min-h-[180px]">
              <Quote className="w-8 h-8 text-stone-400 dark:text-stone-500 mx-auto mb-4" />
              <blockquote className="text-lg text-stone-700 font-light italic leading-relaxed dark:text-stone-200">
                  "{getTodayQuote()}"
              </blockquote>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">Reflexão do dia</p>
            </CardContent>
          </Card>
          
          {streak > 0 && (
            <Card className="border-amber-300 dark:border-amber-500 border-2 shadow-lg">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center min-h-[180px]">
                <div className="p-4 bg-amber-100 dark:bg-gray-700 rounded-full mb-4">
                  <Flame className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-stone-900 dark:text-stone-100">Sequência de {streak} {streak === 1 ? 'dia' : 'dias'}!</h3>
                  <p className="text-stone-600 dark:text-stone-300 mt-1">
                    Continue o ótimo trabalho a construir o seu hábito.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                          <div className="p-3 bg-stone-100 dark:bg-gray-700 rounded-lg"><action.icon className="w-6 h-6 text-stone-600 dark:text-stone-300" /></div>
                          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-transform" />
                      </div>
                      <h3 className="text-lg text-stone-900 dark:text-stone-100 font-semibold pt-4">{action.title}</h3>
                      <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-light mt-1">{action.description}</p>
                  </CardContent>
                </Card>
            </Link>
            ))}
        </div>
    </div>
  );
}
