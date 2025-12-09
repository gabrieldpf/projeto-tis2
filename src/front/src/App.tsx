// src/App.tsx
import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HeroSection from './components/landing/HeroSection';
import DeveloperDashboard from './components/dashboards/DeveloperDashboard';
import CompanyDashboard from './components/dashboards/CompanyDashboard';
import CompanyMilestonesPanel from './components/dashboards/components/CompanyMilestonesPanel';
import CompanyDeliveriesPanel from './components/dashboards/components/CompanyDeliveriesPanel';
import DevPendingMilestonesPanel from './components/dashboards/components/DevPendingMilestonesPanel';
import DevApprovalStatusPanel from './components/dashboards/components/DevApprovalStatusPanel';
import DevHistoryPanel from './components/dashboards/components/DevHistoryPanel';
import Profile from './components/profile/Profile';
import ProfileCompletion from './components/profile/ProfileCompletion';
import AllJobsPage from './pages/AllJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CompanyProfileCompletion from './components/profile/CompanyProfileCompletion';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DisputesPage from './pages/DisputesPage';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <HeroSection />;
  }
  
  if (user.type === 'admin') {
    return <AdminDashboardPage />;
  }
  
  if (user.type === 'developer') {
    if (!user.profileComplete) {
      return <ProfileCompletion />;
    }
    return <DeveloperDashboard />;
  } else {
    // Empresa
    if (!user.profileComplete) {
      return <CompanyProfileCompletion />;
    }
    return <CompanyDashboard />;
  }
};

const CompanyRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || user.type !== 'company') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Layout maxWidth={false} disablePadding>
            <Routes>
              <Route path="/" element={<DashboardRouter />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/company-profile" element={<CompanyProfilePage />} />
              <Route path="/disputas" element={<DisputesPage />} />
              <Route
                path="/admin/indicadores"
                element={
                  <CompanyRoute>
                    <AdminDashboardPage />
                  </CompanyRoute>
                }
              />
              <Route path="/profile-old" element={<Profile />} />
              <Route path="/profile-completion" element={<ProfileCompletion />} />
              <Route path="/company-profile-completion" element={<CompanyProfileCompletion />} />
              <Route path="/vagas" element={<AllJobsPage />} />
              <Route path="/minhas-candidaturas" element={<MyApplicationsPage />} />
              <Route path="/preview/company-milestones" element={<CompanyMilestonesPanel />} />
              <Route path="/preview/company-deliveries" element={<CompanyDeliveriesPanel />} />
              <Route path="/preview/dev-pending" element={<DevPendingMilestonesPanel />} />
              <Route path="/preview/dev-approval" element={<DevApprovalStatusPanel />} />
              <Route path="/preview/dev-history" element={<DevHistoryPanel />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;