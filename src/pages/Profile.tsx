import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { User, DailyPage, MonthlyVision, WeeklyPlanning, exportMyData, deleteMyData } from "@/Entities/Index";
import { downloadFile } from "@/utils/calendar";
import { Button } from "@/Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Input } from "@/Components/ui/Input";
import { Textarea } from "@/Components/ui/Textarea";
import { Save, LogOut, Award, Loader2, Flame, Bell, CalendarPlus, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { dailyRitualUrl } from "@/utils/calendar";
import { appUrl } from "@/utils/base";
import FormField from "@/Components/ui/FormField/Index.tsx";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { calculateStreak } from "@/utils/stats";
import { toLocalDateString } from "@/utils/date";
import { getNotificationSettings, updateNotificationSettings } from "@/utils/notifications";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileData, setProfileData] = useState({ bio: '', goals: '', values: '', inspiration: '' });
  const [notificationSettings, setNotificationSettings] = useState({ enabled: false, morningTime: '07:00', eveningTime: '20:00' });
  const [stats, setStats] = useState({ dailyPages: 0, weeklyPlannings: 0, monthlyVisions: 0 });
  const [filledDays, setFilledDays] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

      // Carregar configurações de notificação
      const notifSettings = getNotificationSettings(metadata);
      setNotificationSettings({
        enabled: notifSettings.enabled,
        morningTime: notifSettings.morningTime,
        eveningTime: notifSettings.eveningTime,
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
    const toastId = toast.loading('Salvando perfil...');
    try {
      const dataToSave = {
        ...profileData,
        ...updateNotificationSettings({
          enabled: notificationSettings.enabled,
          morningTime: notificationSettings.morningTime,
          eveningTime: notificationSettings.eveningTime,
        }),
      };

      await User.updateMyUserData(dataToSave);
      toast.success('Perfil salvo com sucesso!', { id: toastId });
      await loadProfile();
    } catch (error) {
      toast.error("Erro ao salvar o perfil.", { id: toastId });
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // abre o Google Agenda com o evento diário pronto e guarda o horário escolhido
  const addReminder = (time: string, title: string, page: string) => {
    const link = appUrl(page);
    window.open(dailyRitualUrl(time, title, `Hora do seu ritual na Agenda Tempo de Ser: ${link}`), '_blank', 'noopener');
    User.updateMyUserData(updateNotificationSettings({ ...notificationSettings, enabled: true })).catch(() => {});
  };

  const [dataBusy, setDataBusy] = useState<'export' | 'delete' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleExport = async () => {
    setDataBusy('export');
    try {
      const data = await exportMyData();
      downloadFile(`agenda-tempo-de-ser-meus-dados-${toLocalDateString(new Date())}.json`, JSON.stringify(data, null, 2), 'application/json');
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Não foi possível preparar o arquivo. Tente de novo.");
    } finally {
      setDataBusy(null);
    }
  };

  const handleDeleteData = async () => {
    setDataBusy('delete');
    const toastId = toast.loading('Apagando seus dados...');
    try {
      await deleteMyData();
      toast.success('Seus dados foram apagados.', { id: toastId });
      setConfirmDelete('');
      await loadProfile();
    } catch (error) {
      console.error("Erro ao apagar:", error);
      toast.error('Não foi possível apagar tudo. Nada foi perdido sem aviso: tente de novo ou fale com o suporte.', { id: toastId });
    } finally {
      setDataBusy(null);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading('Saindo...');
    try {
        await User.logout();
        toast.success('Você saiu da conta.', { id: toastId });
        navigate('/login');
    } catch (error) {
        toast.error('Não foi possível sair. Tente de novo.', { id: toastId });
    }
  };

  const getTileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateString = toLocalDateString(date);
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
        <p className="text-stone-600 dark:text-stone-100 mt-2">Gerencie suas informações e veja seu progresso na jornada.</p>
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
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Lembretes dos Rituais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Escolha os horários e adicione ao seu Google Agenda um evento que se repete todos os dias. O próprio
                Google Agenda avisa você na hora, no celular e no computador.
              </p>
              {([
                ['morningTime', 'Ritual da Manhã', 'Ritual Matinal · Tempo de Ser', 'MorningRitual'],
                ['eveningTime', 'Escrita da Noite', 'Escrita Noturna · Tempo de Ser', 'EveningReflection'],
              ] as const).map(([key, label, title, page]) => (
                <div key={key} className="flex flex-wrap items-end gap-3 rounded-lg bg-stone-50 p-3 dark:bg-stone-900">
                  <FormField label={label} htmlFor={key}>
                    <Input
                      id={key}
                      type="time"
                      value={notificationSettings[key]}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.value })}
                      className="w-32"
                    />
                  </FormField>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addReminder(notificationSettings[key], title, page)}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Adicionar ao Google Agenda
                  </Button>
                </div>
              ))}
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Mudou de horário? Edite ou apague o evento antigo no Google Agenda e adicione de novo.
              </p>
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

          <Card className="bg-white dark:bg-black dark:text-white">
            <CardHeader><CardTitle>Seus dados</CardTitle></CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="space-y-2">
                <p className="text-stone-600 dark:text-stone-300">Baixe um arquivo com tudo o que a agenda guarda sobre você.</p>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={dataBusy !== null}>
                  {dataBusy === 'export' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  Baixar meus dados (JSON)
                </Button>
              </div>
              <div className="space-y-2 border-t pt-4 dark:border-gray-700">
                <p className="text-stone-600 dark:text-stone-300">
                  Apagar todas as suas anotações (dias, rituais, semanas, meses, visão do futuro) e o que você escreveu no
                  perfil. Não dá para desfazer: baixe seus dados antes, se quiser guardar.
                </p>
                <FormField label="Para confirmar, digite APAGAR" htmlFor="confirm-delete">
                  <Input id="confirm-delete" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} autoComplete="off" className="max-w-xs" />
                </FormField>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteData}
                  disabled={dataBusy !== null || confirmDelete.trim().toUpperCase() !== 'APAGAR'}
                  className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  {dataBusy === 'delete' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Apagar meus dados
                </Button>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Para excluir também o seu acesso, veja a <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-full">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? 'Salvando...' : 'Salvar Perfil'}
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

