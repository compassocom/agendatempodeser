// src/Layout.tsx

import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    BookOpen, 
    Calendar, 
    Target, 
    Sun, 
    Lightbulb, 
    Printer, 
    User as UserIcon, 
    Info, 
    BrainCircuit, 
    Moon, 
    SunDim
} from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";

export default function Layout({ children, currentPageName }: { children: React.ReactNode, currentPageName: string }) {
  // A linha abaixo USA o 'useTheme'. O aviso desaparecerá.
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { title: "Dashboard", url: createPageUrl("Dashboard"), icon: BookOpen },
    { title: "Visão Mensal", url: createPageUrl("MonthlyVision"), icon: Calendar },
    { title: "Planejamento Semanal", url: createPageUrl("WeeklyPlanning"), icon: Target },
    { title: "Página Diária", url: createPageUrl("DailyPage"), icon: Sun },
    { title: "Meditações", url: createPageUrl("Meditations"), icon: BrainCircuit },
    { title: "Visão do Futuro", url: createPageUrl("FutureVision"), icon: Lightbulb },
    { title: "Exportar", url: createPageUrl("Export"), icon: Printer }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col dark:bg-gray-900 dark:text-stone-200 transition-colors duration-300">
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Dashboard")} title="Ir para o Dashboard">
            <img src="/image.png" alt="Logo Tempo de Ser" className="h-16 w-auto" />
          </Link>
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.title} to={item.url} title={item.title} className="flex items-center justify-center h-10 w-10 rounded-lg transition-colors text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-gray-700">
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
            <div className="w-px h-6 bg-stone-200 dark:bg-gray-600 mx-2"></div>
            <Link to={createPageUrl("Introduction")} title="Introdução" className="flex items-center justify-center h-10 w-10 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-gray-700"><Info className="w-5 h-5" /></Link>
            <Link to={createPageUrl("Profile")} title="Meu Perfil" className="flex items-center justify-center h-10 w-10 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-gray-700"><UserIcon className="w-5 h-5" /></Link>
            
            {/* Este botão USA 'toggleTheme' e 'theme'. */}
            <button 
              onClick={toggleTheme} 
              title="Alterar Tema" 
              className="flex items-center justify-center h-10 w-10 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-amber-400 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <SunDim className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      {/* Cole este código no lugar do seu footer atual */}
      <footer className="bg-stone-800 text-stone-300 py-12 dark:bg-gray-950">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    
    {/* Coluna 1: Logo e Descrição (Esquerda) */}
    <div className="space-y-4">
      <img src="/image.png" alt="Logo Tempo de Ser" className="h-16 w-auto mx-auto md:mx-0" />
      <p className="text-sm text-stone-400 font-light">
        Sua jornada de autoconhecimento<br /> e planejamento consciente.
      </p>
    </div>

    {/* Coluna 2: Contato/Desenvolvedor (NOVA POSIÇÃO: Centro) */}
    {/* ALINHAMENTO: Adicionamos classes para centralizar o conteúdo em telas maiores */}
    <div className="space-y-4 md:flex md:flex-col md:items-center">
      <img src="/arkhetypo-logo.png" alt="Logo arkhetypo" className="h-16 w-auto mx-auto" />
      <p className="text-sm text-stone-400 font-light md:text-center">
        Desenvolvido pela Arkhetypo.<br />
        Uma ferramenta para alinhar suas ações<br></br> com seu propósito.
      </p>
    </div>

    {/* Coluna 3: Links Rápidos (NOVA POSIÇÃO: Direita) */}
    <div className="space-y-2 md:text-right">
      <h3 className="font-semibold text-white">Navegação</h3>
      <ul className="space-y-1 font-light">
        <li><Link to={createPageUrl("Dashboard")} className="hover:text-white">Dashboard</Link></li>
        <li><Link to={createPageUrl("MonthlyVision")} className="hover:text-white">Visão Mensal</Link></li>
        <li><Link to={createPageUrl("WeeklyPlanning")} className="hover:text-white">Planejamento Semanal</Link></li>
        {/* LINK ADICIONADO */}
        <li><Link to={createPageUrl("DailyPage")} className="hover:text-white">Página Diária</Link></li>
      </ul>
    </div>

  </div>
</footer>
    </div>
  );
}