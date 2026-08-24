import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import Overview from '../apps/public-dashboard/pages/Overview';
import ImpactMap from '../apps/public-dashboard/pages/ImpactMap';
import AllActivities from '../apps/public-dashboard/pages/AllActivities';
import VerifierList from '../apps/public-dashboard/pages/VerifierList';
import ContributorsList from '../apps/public-dashboard/pages/ContributorsList';
import CitizensList from '../apps/public-dashboard/pages/CitizensList';
import Organizations from '../apps/public-dashboard/pages/Organizations';
import PendingQueue from '../apps/verifier/pages/PendingQueue';
import ActivityReview from '../apps/verifier/pages/ActivityReview';
import RejectedActivity from '../apps/verifier/pages/RejectedActivity';
import Login from '../apps/auth/pages/Login';
import ForgotPassword from '../apps/auth/pages/ForgotPassword';
import ProfileSettings from '../apps/profile/pages/ProfileSettings';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MainLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell admin-space-shell">
      <Header toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <main className="main-layout">
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function FlashMessageToast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const message = location.state?.flashMessage;
  const duration = location.state?.flashDuration || 2200;

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      navigate(location.pathname, { replace: true, state: null });
    }, duration);

    return () => window.clearTimeout(timer);
  }, [message, duration, location.pathname, navigate]);

  if (!message || !visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 2000,
      maxWidth: 'min(92vw, 400px)',
      padding: '0.9rem 1rem',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(15, 118, 110, 0.92)',
      border: '1px solid rgba(45, 212, 191, 0.35)',
      color: 'white',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      animation: 'toastIn 180ms ease-out'
    }} role="status" aria-live="polite">
      <div style={{
        width: '1.3rem',
        height: '1.3rem',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{message}</span>
    </div>
  );
}

export default function AppRouter() {
  const { user } = useAuth();
  const location = useLocation();

  if (user && location.pathname === '/login') {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <>
      <FlashMessageToast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<Navigate to={user ? '/dashboard/overview' : '/login'} replace />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <ProfileSettings />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/overview" element={
          <ProtectedRoute>
            <MainLayout>
              <Overview />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/activities" element={
          <ProtectedRoute>
            <MainLayout>
              <AllActivities />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/map" element={
          <ProtectedRoute>
            <MainLayout>
              <ImpactMap />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/verifiers" element={
          <ProtectedRoute>
            <MainLayout>
              <VerifierList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/contributors" element={
          <ProtectedRoute>
            <MainLayout>
              <ContributorsList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/citizens" element={
          <ProtectedRoute>
            <MainLayout>
              <CitizensList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/organizations" element={
          <ProtectedRoute>
            <MainLayout>
              <Organizations />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/verifier/pending" element={
          <ProtectedRoute>
            <MainLayout>
              <PendingQueue />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/verifier/review" element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityReview />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/verifier/rejected" element={
          <ProtectedRoute>
            <MainLayout>
              <RejectedActivity />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? '/dashboard/overview' : '/login'} replace />} />
      </Routes>
    </>
  );
}
