import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ReferenceLibraryPage } from './pages/ReferenceLibraryPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Fullscreen Design Studio (no top app layout to maximize architectural workspace) */}
        <Route path="/studio/:projectId" element={<DesignStudioPage />} />
        <Route path="/studio" element={<Navigate to="/studio/proj_villa_solarium" replace />} />

        {/* Authenticated Application Shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/create" element={<CreateProjectPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/references" element={<ReferenceLibraryPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
