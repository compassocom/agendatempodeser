import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/Layout';

// Importe todos os seus componentes de página
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
import OnboardingPage from '@/Pages/OnboardingPage';

// Componente auxiliar para envolver as páginas com o Layout
const LayoutWrapper = ({ children }: { children: React.ReactElement }) => {
  const pageName = children.type.name.replace('Page', '').replace('Component', '');
  return <Layout currentPageName={pageName}>{children}</Layout>;
};

export default function PageWrapper() {
  return (
    <Routes>
        <Route path="/Onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
        <Route path="/Dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
        <Route path="/MonthlyVision" element={<LayoutWrapper><MonthlyVisionPage /></LayoutWrapper>} />
        <Route path="/WeeklyPlanning" element={<LayoutWrapper><WeeklyPlanningPage /></LayoutWrapper>} />
        <Route path="/DailyPage" element={<LayoutWrapper><DailyPageComponent /></LayoutWrapper>} />
        <Route path="/FutureVision" element={<LayoutWrapper><FutureVisionPage /></LayoutWrapper>} />
        <Route path="/MorningRitual" element={<LayoutWrapper><MorningRitualPage /></LayoutWrapper>} />
        <Route path="/EveningReflection" element={<LayoutWrapper><EveningReflectionPage /></LayoutWrapper>} />
        <Route path="/Export" element={<LayoutWrapper><ExportPage /></LayoutWrapper>} />
        <Route path="/Profile" element={<LayoutWrapper><ProfilePage /></LayoutWrapper>} />
        <Route path="/Introduction" element={<LayoutWrapper><IntroductionPage /></LayoutWrapper>} />
        <Route path="/Meditations" element={<LayoutWrapper><MeditationsPage /></LayoutWrapper>} />
        <Route path="/MeditationPlayer" element={<LayoutWrapper><MeditationPlayerPage /></LayoutWrapper>} />
        <Route path="*" element={<Navigate to="/Dashboard" />} />
    </Routes>
  );
}
