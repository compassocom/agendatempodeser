import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { User, DailyPage, MonthlyVision, WeeklyPlanning } from "@/Entities";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Save, LogOut, Award, Loader2, Flame } from "lucide-react";
import FormField from "@/Components/ui/FormField";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { calculateStreak } from "@/utils/stats";
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileData, setProfileData] = useState({ bio: '', goals: '', values: '', inspiration: '' });
  const [stats, setStats] = useState({ dailyPages: 0, weeklyPlannings: 0, monthlyVisions: 0 });
  const [filledDays, setFilledDays] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // CORREÇÃO: Lógica de carregamento movida para uma função reutilizável.
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      if (!user) { setIsLoading(false); return; }

      setUserProfile(user);
      const metadata = user.user_metadata || {};
      setProfileData({
        bio: metadata.bio || '',
        goals: metadata.goals || '',
        values: metadata.values || '',
        inspiration: metadata.inspiration || '',
      });

      const [dailyPages, weeklyPlannings, monthlyVisions] = await Promise.all([
        DailyPage.filter({ user_id: user.id }),
        WeeklyPlanning.filter({ user_id: user.id }),
        MonthlyVision.filter({ user_id: user.id }),
      ]);
      
      const validDaily = dailyPages.filter((p: any) => p.id);
      const validWeekly = weeklyPlannings.filter((p: any) => p.id);
      const validMonthly = monthlyVisions.filter((p: any) => p.id);

      setStats({
          dailyPages: validDaily.length,
          weeklyPlannings: validWeekly.length,
          monthlyVisions: validMonthly.length,
      });

      const dates = validDaily.map((page: any) => page.date.split('T')[0]);
      setFilledDays(new Set(dates));
      setStreak(calculateStreak(dates));

    } catch (error) {
      toast.error("Não foi possível carregar o perfil.");
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('A guardar perfil...');
    try {
      await User.updateMyUserData(profileData);
      toast.success('Perfil salvo com sucesso!', { id: toastId });
      // CORREÇÃO: Recarrega os dados para atualizar a UI imediatamente.
      await loadProfile();
    } catch (error) {
      toast.error("Erro ao salvar o perfil.", { id: toastId });
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading('A terminar sessão...');
    try {
        await User.logout();
        toast.success('Sessão terminada!', { id: toastId });
        navigate('/login');
    } catch (error) {
        toast.error('Erro ao terminar sessão.', { id: toastId });
    }
  };
  
  const getTileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (filledDays.has(dateString)) {
        return 'highlight-day';
      }
    }
    return '';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500 dark:text-stone-100" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Meu Perfil</h1>
        <p className="text-stone-600 dark:text-stone-100 mt-2">Gerencie as suas informações e veja o seu progresso na jornada.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-white dark:bg-black dark:text-white">
            <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label ="Nome Completo" htmlFor="full_name">
                <Input id="full_name" value={userProfile?.user_metadata?.full_name || 'Visitante'} disabled className="bg-stone-100 dark:bg-stone-900 cursor-not-allowed" />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <Input id="email" value={userProfile?.email || ''} disabled className="bg-stone-100 dark:bg-stone-900 cursor-not-allowed" />
              </FormField>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black dark:text-white">
            <CardHeader><CardTitle>Sobre Você</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Biografia Pessoal" htmlFor="bio">
                <Textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Conte um pouco sobre você..." className="min-h-[120px]" />
              </FormField>
              <FormField label="Principais Objetivos" htmlFor="goals">
                <Textarea id="goals" value={profileData.goals} onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })} placeholder="Quais são seus principais objetivos de vida?" className="min-h-[100px]" />
              </FormField>
              <FormField label="Valores Fundamentais" htmlFor="values">
                <Textarea id="values" value={profileData.values} onChange={(e) => setProfileData({ ...profileData, values: e.target.value })} placeholder="Quais valores guiam as suas decisões?" className="min-h-[100px]" />
              </FormField>
              <FormField label="O que te Inspira" htmlFor="inspiration">
                <Textarea id="inspiration" value={profileData.inspiration} onChange={(e) => setProfileData({ ...profileData, inspiration: e.target.value })} placeholder="Pessoas, livros, ideias que te inspiram..." className="min-h-[100px]" />
              </FormField>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white dark:bg-black dark:text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5" />Seu Progresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center font-medium">
                <span className="text-stone-600 dark:text-stone-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Sequência Atual
                </span>
                <span className="font-bold text-lg text-amber-600">{streak} {streak === 1 ? 'dia' : 'dias'}</span>
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-100">
                  <span>Páginas Diárias Preenchidas</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100">{stats.dailyPages}</span>
               </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-100">
                  <span>Planejamentos Semanais</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100">{stats.weeklyPlannings}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 dark:text-stone-100">
                  <span>Visões Mensais</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100">{stats.monthlyVisions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black dark:text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Sua Jornada Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar tileClassName={getTileClassName} className="w-full" locale="pt-BR" />
            </CardContent>
          </Card>
          <div className="space-y-2">
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-full">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? 'A guardar...' : 'Salvar Perfil'}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

