import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import CounselorDashboard from './components/dashboard/CounselorDashboard';
import ApplicationList from './components/applications/ApplicationList';
import ApplicationForm from './components/applications/ApplicationForm';
import ApplicationDetails from './components/applications/ApplicationDetails';
import InterviewScheduler from './components/interviews/InterviewScheduler';
import InterviewPrep from './components/interviews/InterviewPrep';
import InterviewFeedback from './components/interviews/InterviewFeedback';
import ApplicationAnalytics from './components/analytics/ApplicationAnalytics';
import MarketInsights from './components/analytics/MarketInsights';
import CompanySearch from './components/companies/CompanySearch';
import DocumentLibrary from './components/documents/DocumentLibrary';
import NotificationCenter from './components/notifications/NotificationCenter';
import Forbidden from './pages/Forbidden';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import useAuth from './hooks/useAuth';

const AUTH_ROUTES = ['/login', '/register'];

function SessionWarningBanner({ onStay, onLogout }) {
  return (
    <div className="session-warning" role="alert" aria-live="assertive">
      <span>⚠️ Your session will expire soon due to inactivity.</span>
      <button className="btn btn-primary" style={{ padding: '6px 14px', minHeight: 36 }} onClick={onStay}>
        Stay logged in
      </button>
      <button className="btn btn-ghost" style={{ padding: '6px 14px', minHeight: 36 }} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const auth = useAuth();
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  if (isAuthPage || !auth?.user) return <>{children}</>;

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header onMenuToggle={() => setSidebarOpen(o => !o)} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} />
        <main id="main-content" className="app-main" tabIndex={-1}>
          {children}
        </main>
      </div>
      {auth.sessionWarning && (
        <SessionWarningBanner
          onStay={() => auth.resetInactivityTimer(auth.user?.role)}
          onLogout={auth.logout}
        />
      )}
    </div>
  );
}

function App() {
  const auth = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forbidden" element={<Forbidden />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR', 'ADMIN']}>
              {auth?.user?.role === 'ADMIN' ? (
                <AdminDashboard />
              ) : auth?.user?.role === 'CAREER_COUNSELOR' ? (
                <CounselorDashboard />
              ) : (
                <CandidateDashboard />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <ApplicationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/new"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <ApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <ApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR']}>
              <InterviewScheduler />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews/:id"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR']}>
              <InterviewPrep />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews/:id/feedback"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <InterviewFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <CompanySearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <ApplicationAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/market-insights"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR']}>
              <MarketInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE']}>
              <DocumentLibrary />
            </ProtectedRoute>
          }
        />

        <Route path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR', 'ADMIN']}>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/counselor"
          element={
            <ProtectedRoute allowedRoles={['STANDARD_CANDIDATE', 'PREMIUM_CANDIDATE', 'CAREER_COUNSELOR', 'ADMIN']}>
              <CounselorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div style={{ padding: 16 }}>404 — Page not found</div>} />
      </Routes>
    </AppLayout>
  );
}

export default App;
