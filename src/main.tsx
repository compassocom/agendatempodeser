// src/main.tsx (Corrigido e Simplificado)
import { ThemeProvider } from '@/contexts/ThemeContext'; 
import React, { useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

// --- IMPORTAÇÕES CORRIGIDAS ---
import { supabase } from '@/supabaseClient'; // Usando alias @/
import '@/index.css'; // Usando alias @/
import Layout from '@/Layout'; // Usando alias @/

// Importando páginas com caminhos padronizados
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import MonthlyVisionPage from '@/pages/MonthlyVision';
import WeeklyPlanningPage from '@/pages/WeeklyPlanning';
import DailyPageComponent from '@/pages/DailyPage';
import FutureVisionPage from '@/pages/FutureVision';
import MorningRitualPage from '@/pages/MorningRitual';
import EveningReflectionPage from '@/pages/EveningReflection';
import ExportPage from '@/pages/Export';
import ProfilePage from '@/pages/Profile';
import IntroductionPage from '@/pages/Introduction';
import MeditationsPage from '@/pages/Meditations'; 
import MeditationPlayerPage from '@/pages/MeditationPlayer';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async (currentSession: Session | null) => {
      if (currentSession?.user?.email) {
        const { data: allowedUser } = await supabase
          .from('allowed_users')
          .select('email')
          .eq('email', currentSession.user.email)
          .single();
        setIsAllowed(!!allowedUser);
      } else {
        setIsAllowed(false);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserStatus(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(true);
      checkUserStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin"/></div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAllowed) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

// Componente para envolver páginas com o Layout principal
const AppLayout = ({ children }: { children: React.ReactElement }) => {
  const pageName = children.type.name.replace('Page', '').replace('Component', '');
  return <Layout currentPageName={pageName}>{children}</Layout>;
};

// Roteador principal da aplicação
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        
        {/* Rotas Protegidas */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/monthlyVision" element={<AppLayout><MonthlyVisionPage /></AppLayout>} />
              <Route path="/weeklyPlanning" element={<AppLayout><WeeklyPlanningPage /></AppLayout>} />
              <Route path="/dailyPage" element={<AppLayout><DailyPageComponent /></AppLayout>} />
              <Route path="/futureVision" element={<AppLayout><FutureVisionPage /></AppLayout>} />
              <Route path="/morningRitual" element={<AppLayout><MorningRitualPage /></AppLayout>} />
              <Route path="/eveningReflection" element={<AppLayout><EveningReflectionPage /></AppLayout>} />
              <Route path="/export" element={<AppLayout><ExportPage /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
              <Route path="/introduction" element={<AppLayout><IntroductionPage /></AppLayout>} />
              <Route path="/meditations" element={<AppLayout><MeditationsPage /></AppLayout>} /> 
              <Route path="/meditationPlayer" element={<AppLayout><MeditationPlayerPage /></AppLayout>} />
              
              {/* Rota padrão para redirecionar ao dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster position="top-right" />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);