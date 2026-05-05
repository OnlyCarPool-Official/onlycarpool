import { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import CommuteDashboard from './features/commute/CommuteDashboard';
import SchoolDashboard from './features/school/SchoolDashboard';
import SnapDashboard from './features/snap/SnapDashboard';
import AuthView from './features/auth/AuthView';
import LandingPage from './features/landing/LandingPage';

function App() {
  const { session, currentCategory, loading } = useContext(AppContext);
  const [view, setView] = useState('landing');

  if (loading) {
    return <div className="w-full h-screen bg-ivory flex items-center justify-center font-display font-bold gold-gradient-text uppercase tracking-[0.3em] animate-pulse">Synchronizing Royal Registry...</div>;
  }

  if (!session) {
    if (view === 'landing') {
      return (
        <LandingPage
          onLogin={() => setView('login')}
          onSignup={() => setView('signup')}
        />
      );
    }
    return (
      <AuthView
        initialMode={view === 'signup' ? 'signup' : 'login'}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <AppShell>
      {currentCategory === 'commute' && <CommuteDashboard />}
      {currentCategory === 'school' && <SchoolDashboard />}
      {currentCategory === 'snap' && <SnapDashboard />}
    </AppShell>
  );
}

export default App;
