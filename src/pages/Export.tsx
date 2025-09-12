import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Printer, Calendar as CalendarIcon, Loader2, FileText } from 'lucide-react';
import { DailyPage, WeeklyPlanning, MonthlyVision, User, FutureVision } from '@/Entities/index'; // Adicionado FutureVision
import PrintableDailyPage from '@/Components/export/PrintableDailyPage';
import PrintableWeeklyPlanning from '@/Components/export/PrintableWeeklyPlanning';
import PrintableMonthlyVision from '@/Components/export/PrintableMonthlyVision';
import PrintableFutureVision from '@/Components/export/PrintableFutureVision'; // Adicionado
import '@/print.css';

const getInitialDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 1); // Pega os últimos 30 dias
  return {
    start: startDate.toISOString().slice(0, 10),
    end: endDate.toISOString().slice(0, 10),
  };
};

export default function ExportPage() {
  const [startDate, setStartDate] = useState(getInitialDateRange().start);
  const [endDate, setEndDate] = useState(getInitialDateRange().end);
  const [dataToExport, setDataToExport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setDataToExport(null);
    const toastId = toast.loading("Buscando seus registros...");
    try {
      const user = await User.me();
      if (!user) {
        toast.error("Por favor, faça login.", { id: toastId });
        setIsLoading(false);
        return;
      }

      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59');

      const [daily, weekly, monthly, future] = await Promise.all([
        DailyPage.filter({ user_id: user.id, date: { gte: start.toISOString(), lte: end.toISOString() } }),
        WeeklyPlanning.filter({ user_id: user.id, week_start_date: { gte: start.toISOString(), lte: end.toISOString() } }),
        MonthlyVision.filter({ user_id: user.id, month: { gte: startDate.slice(0, 7), lte: endDate.slice(0, 7) } }),
        FutureVision.filter({ user_id: user.id })
      ]);

      const validDaily = daily.filter(p => p.id);
      const validWeekly = weekly.filter(p => p.id);
      const validMonthly = monthly.filter(p => p.id);
      const validFuture = future.filter(p => p.id);
      
      console.log("DADOS ENCONTRADOS:", { meses: validMonthly, semanas: validWeekly, dias: validDaily, futuro: validFuture });

      setDataToExport({
        dailyPages: validDaily,
        weeklyPlannings: validWeekly,
        monthlyVisions: validMonthly,
        futureVisions: validFuture
      });
      toast.success("Pré-visualização gerada!", { id: toastId });
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar os dados.", { id: toastId });
      console.error("Error fetching data for export:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const hasData = dataToExport && (
    dataToExport.dailyPages.length > 0 || 
    dataToExport.weeklyPlannings.length > 0 || 
    dataToExport.monthlyVisions.length > 0 || 
    dataToExport.futureVisions.length > 0
  );

  return (
    <>
      <div className="min-h-[calc(100vh-200px)] print:hidden max-w-4xl mx-auto p-6 space-y-8 flex flex-col">
        <Card className="bg-white dark:bg-black/50">
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-stone-800 dark:text-white'>Exportar sua Jornada</CardTitle>
            <p className='text-stone-600 dark:text-white'>Selecione o período que deseja imprimir ou salvar como PDF.</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Data de Início</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Data de Fim</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={fetchData} disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileText className="w-5 h-5 mr-2" />}
              {isLoading ? "Buscando..." : "Gerar Pré-visualização"}
            </Button>
          </CardContent>
        </Card>

        {dataToExport && (
          <div className="flex-grow flex flex-col items-center justify-center text-center bg-stone-50 dark:bg-black/50 rounded-lg p-8 border-dashed border-2">
            {hasData ? (
              <>
                <h2 className="text-xl font-semibold text-stone-800 dark:text-white">Sua pré-visualização está pronta!</h2>
                <p className="text-stone-600 dark:text-white mt-2 mb-6 max-w-md">
                  Encontrados {dataToExport.monthlyVisions.length} planejamentos mensais, 
                  {' '}{dataToExport.weeklyPlannings.length} semanais, 
                  {' '}{dataToExport.dailyPages.length} páginas diárias
                  {dataToExport.futureVisions.length > 0 ? ' e sua visão de futuro.' : '.'}
                </p>
                <Button onClick={handlePrint} size="lg">
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir / Salvar como PDF
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-stone-700 dark:text-white">Nenhum dado encontrado</h2>
                <p className="text-stone-500 dark:text-white mt-2">Não há anotações salvas no período selecionado. Tente ajustar as datas.</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="hidden print:block">
        {hasData && (
          <>
            {dataToExport.monthlyVisions.map((vision: any) => <PrintableMonthlyVision key={vision.id} visionData={vision} />)}
            {dataToExport.weeklyPlannings.map((planning: any) => <PrintableWeeklyPlanning key={planning.id} weeklyData={planning} />)}
            {dataToExport.dailyPages.map((page: any) => <PrintableDailyPage key={page.id} dailyData={page} />)}
            {dataToExport.futureVisions.map((vision: any) => <PrintableFutureVision key={vision.id} visionData={vision} />)}
          </>
        )}
      </div>
    </>
  );
}

