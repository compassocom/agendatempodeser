import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Calendar, Target, Sun, Lightbulb, Printer, Share, HelpCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function IntroductionPage() {
  const sections = [
    {
      icon: Calendar,
      title: 'Visão Mensal',
      description: 'Planeje seus principais projetos e eventos do mês para ter uma visão clara do que está por vir.',
    },
    {
      icon: Target,
      title: 'Planejamento Semanal',
      description: 'Defina suas intenções e prioridades para a semana, alinhando suas ações com seus propósitos.',
    },
    {
      icon: Sun,
      title: 'Página Diária',
      description: 'Comece o dia com o Ritual Matinal e termine com a Escrita Noturna para manter o foco e a gratidão.',
    },
    {
      icon: Lightbulb,
      title: 'Visão do Futuro',
      description: 'Reflita sobre seus objetivos de longo prazo e estabeleça metas claras para seu crescimento pessoal.',
    },
  ];

  const usageTips = [
    {
        icon: Share,
        title: 'Exportar para Calendário',
        description: 'Na página diária, use o ícone ao lado de cada tarefa para adicionar ao Google Agenda ou o botão "Exportar" para baixar um arquivo .ics compatível com qualquer calendário.'
    },
    {
        icon: Printer,
        title: 'Imprimir suas Páginas',
        description: 'Acesse a página "Exportar" no menu para selecionar um período e gerar uma versão para impressão de suas anotações, perfeita para guardar ou revisar.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-700 rounded-xl">
            <BookOpen className="w-8 h-8 text-stone-700 dark:text-white/50" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Bem-vindo à Agenda Tempo de Ser
        </h1>
        <p className="text-stone-600 dark:text-stone-100 max-w-2xl mx-auto leading-relaxed">
          Este é o seu espaço sagrado para planejamento consciente, ação com propósito e reflexão profunda. Use esta ferramenta para se conectar com sua essência e construir a vida que você deseja.
        </p>
      </div>

      <Card className="bg-white dark:bg-white/5 border-stone-200 dark:border-stone-700">
        <CardHeader>
          <CardTitle className="text-xl">As Seções da Sua Jornada</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.title} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-lg">
              <section.icon className="w-8 h-8 text-stone-600 dark:text-stone-100 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-100">{section.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-100">{section.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
       <Card className="bg-white dark:bg=white/5 border-stone-200 dark:border-stone-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><HelpCircle className="w-6 h-6" />Dicas de Uso</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {usageTips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-lg">
              <tip.icon className="w-8 h-8 text-stone-600 dark:text-stone-100 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-100">{tip.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-100">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-stone-800 dark:bg-stone-100 border-stone-700">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h3 className="text-xl font-bold text-black">Leve a jornada para o papel</h3>
            <p className="text-stone-500 mt-1 max-w-lg">Adquira a versão física da agenda "Tempo de Ser" para uma experiência de escrita mais profunda e offline.</p>
          </div>
          <a href="https://www.amazon.com.br/TEMPO-DE-SER-reflex%C3%B5es-autoconhecimento/dp/B0CK27YV27" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-4 md:mt-0">
            <Button size="lg" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 hover:bg-stone-200 w-full md:w-auto">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Comprar o Livro Físico
            </Button>
          </a>
        </CardContent>
      </Card>
      
      <div className="text-center pt-6">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Dashboard
            </Button>
          </Link>
      </div>

    </div>
  );
}