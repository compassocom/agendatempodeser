import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  SunDim,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";

const NAV = [
  { title: "Início", page: "Dashboard", icon: BookOpen },
  { title: "Visão Mensal", page: "MonthlyVision", icon: Calendar },
  { title: "Planejamento Semanal", page: "WeeklyPlanning", icon: Target },
  { title: "Página Diária", page: "DailyPage", icon: Sun },
  { title: "Meditações", page: "Meditations", icon: BrainCircuit },
  { title: "Visão do Futuro", page: "FutureVision", icon: Lightbulb },
  { title: "Exportar", page: "Export", icon: Printer },
];

const EXTRA = [
  { title: "Introdução", page: "Introduction", icon: Info },
  { title: "Meu Perfil", page: "Profile", icon: UserIcon },
];

const iconLink = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-center h-10 w-10 rounded-lg transition-colors ${
    isActive
      ? "bg-stone-200 text-stone-900 dark:bg-gray-700 dark:text-white"
      : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-gray-700"
  }`;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // fecha o menu do celular ao trocar de página
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const themeButton = (
    <button
      onClick={toggleTheme}
      title={theme === "light" ? "Tema escuro" : "Tema claro"}
      aria-label={theme === "light" ? "Usar tema escuro" : "Usar tema claro"}
      className="flex items-center justify-center h-10 w-10 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-amber-400 dark:hover:bg-gray-700"
    >
      {theme === "light" ? <Moon className="w-5 h-5" /> : <SunDim className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col dark:bg-gray-900 dark:text-stone-200 transition-colors duration-300">
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to={createPageUrl("Dashboard")} title="Ir para o início" className="flex-shrink-0">
            <img src="/image.png" alt="Logo Tempo de Ser" className="h-12 sm:h-16 w-auto" />
          </Link>

          {/* telas largas: ícones */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Principal">
            {NAV.map((item) => (
              <NavLink key={item.page} to={createPageUrl(item.page)} title={item.title} aria-label={item.title} className={iconLink}>
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
            <div className="w-px h-6 bg-stone-200 dark:bg-gray-600 mx-2" />
            {EXTRA.map((item) => (
              <NavLink key={item.page} to={createPageUrl(item.page)} title={item.title} aria-label={item.title} className={iconLink}>
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
            {themeButton}
          </nav>

          {/* celular e tablet: menu */}
          <div className="flex lg:hidden items-center gap-1">
            {themeButton}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="flex items-center justify-center h-10 w-10 rounded-lg text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-gray-700"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-stone-200 dark:border-gray-700 px-4 py-2" aria-label="Principal">
            {[...NAV, ...EXTRA].map((item) => (
              <NavLink
                key={item.page}
                to={createPageUrl(item.page)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-base ${
                    isActive ? "bg-stone-100 font-medium dark:bg-gray-700" : "hover:bg-stone-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <item.icon className="w-5 h-5 text-stone-500 dark:text-stone-300" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-stone-800 text-stone-300 py-12 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <img src="/image.png" alt="Logo Tempo de Ser" className="h-16 w-auto mx-auto md:mx-0" />
            <p className="text-sm text-stone-400 font-light">
              Sua jornada de autoconhecimento<br /> e planejamento consciente.
            </p>
          </div>

          <div className="space-y-4 md:flex md:flex-col md:items-center">
            <img src="/arkhetypo-logo.png" alt="Logo Arkhetypo" className="h-16 w-auto mx-auto" />
            <p className="text-sm text-stone-400 font-light md:text-center">
              Desenvolvido pela Arkhetypo.<br />
              Uma ferramenta para alinhar suas ações<br /> com seu propósito.
            </p>
          </div>

          <div className="space-y-2 md:text-right">
            <h3 className="font-semibold text-white">Navegação</h3>
            <ul className="space-y-1 font-light">
              <li><Link to={createPageUrl("Dashboard")} className="hover:text-white">Início</Link></li>
              <li><Link to={createPageUrl("MonthlyVision")} className="hover:text-white">Visão Mensal</Link></li>
              <li><Link to={createPageUrl("WeeklyPlanning")} className="hover:text-white">Planejamento Semanal</Link></li>
              <li><Link to={createPageUrl("DailyPage")} className="hover:text-white">Página Diária</Link></li>
              <li className="pt-2"><Link to="/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-white">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
