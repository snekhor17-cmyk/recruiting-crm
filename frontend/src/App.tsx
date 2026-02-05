import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';

import { AppShell, PageKey } from './layout/AppShell';
import { getCurrentUser } from './lib/api';
import { clearToken, getToken } from './lib/auth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

type AuthState = 'checking' | 'authenticated' | 'guest';

function navigate(path: '/login' | '/') {
  window.history.replaceState(null, '', path);
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    async function validateSession() {
      const token = getToken();
      const isLoginPath = window.location.pathname === '/login';

      if (!token) {
        setAuthState('guest');
        if (!isLoginPath) {
          navigate('/login');
        }
        return;
      }

      try {
        await getCurrentUser();
        setAuthState('authenticated');
        if (isLoginPath) {
          navigate('/');
        }
      } catch {
        clearToken();
        setAuthState('guest');
        navigate('/login');
      }
    }

    validateSession();
  }, []);

  const handleLoginSuccess = () => {
    setAuthState('authenticated');
    navigate('/');
  };

  const handleLogout = () => {
    clearToken();
    setAuthState('guest');
    navigate('/login');
  };

  const content = useMemo(() => {
    if (currentPage === 'dashboard') {
      return <DashboardPage />;
    }

    if (currentPage === 'candidates') {
      return <PlaceholderPage title="Кандидаты" />;
    }

    if (currentPage === 'vacancies') {
      return <PlaceholderPage title="Вакансии" />;
    }

    if (currentPage === 'pipeline') {
      return <PlaceholderPage title="Воронка" />;
    }

    return <PlaceholderPage title="Настройки" />;
  }, [currentPage]);

  if (authState === 'checking') {
    return <Spin fullscreen tip="Проверка авторизации..." />;
  }

  if (authState === 'guest') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {content}
    </AppShell>
  );
}

export default App;
