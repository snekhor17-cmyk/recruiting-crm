import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';

import { AppShell, PageKey } from './layout/AppShell';
import { getCurrentUser } from './lib/api';
import { clearToken, getToken } from './lib/auth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { CandidatesPage } from './pages/CandidatesPage';

type AuthState = 'checking' | 'authenticated' | 'guest';

function navigate(path: string) {
  window.history.pushState(null, '', path);
}

function getPageByPath(pathname: string): PageKey {
  if (pathname === '/' || pathname === '/dashboard') {
    return 'dashboard';
  }

  if (pathname.startsWith('/candidates')) {
    return 'candidates';
  }

  if (pathname.startsWith('/vacancies')) {
    return 'vacancies';
  }

  if (pathname.startsWith('/pipeline')) {
    return 'pipeline';
  }

  if (pathname.startsWith('/settings')) {
    return 'settings';
  }

  return 'dashboard';
}

function getCandidateIdByPath(pathname: string): string | null {
  const candidatesPathMatch = pathname.match(/^\/candidates\/([^/]+)$/);

  if (!candidatesPathMatch) {
    return null;
  }

  return decodeURIComponent(candidatesPathMatch[1]);
}

function App() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    async function validateSession() {
      const token = getToken();
      const isLoginPath = window.location.pathname === '/login';

      if (!token) {
        setAuthState('guest');
        if (!isLoginPath) {
          navigate('/login');
          setPathname('/login');
        }
        return;
      }

      try {
        await getCurrentUser();
        setAuthState('authenticated');
        if (isLoginPath) {
          navigate('/');
          setPathname('/');
        }
      } catch {
        clearToken();
        setAuthState('guest');
        navigate('/login');
        setPathname('/login');
      }
    }

    validateSession();
  }, []);

  const currentPage = useMemo(() => getPageByPath(pathname), [pathname]);
  const selectedCandidateId = useMemo(() => getCandidateIdByPath(pathname), [pathname]);

  const handleLoginSuccess = () => {
    setAuthState('authenticated');
    navigate('/');
    setPathname('/');
  };

  const handleLogout = () => {
    clearToken();
    setAuthState('guest');
    navigate('/login');
    setPathname('/login');
  };

  const handleNavigate = (page: PageKey) => {
    const nextPathByPage: Record<PageKey, string> = {
      dashboard: '/',
      candidates: '/candidates',
      vacancies: '/vacancies',
      pipeline: '/pipeline',
      settings: '/settings',
    };

    const nextPath = nextPathByPage[page];
    navigate(nextPath);
    setPathname(nextPath);
  };

  const content = useMemo(() => {
    if (currentPage === 'dashboard') {
      return <DashboardPage />;
    }

    if (currentPage === 'candidates') {
      return (
        <CandidatesPage
          selectedCandidateId={selectedCandidateId}
          onOpenCandidate={(candidateId) => {
            const nextPath = `/candidates/${candidateId}`;
            navigate(nextPath);
            setPathname(nextPath);
          }}
        />
      );
    }

    if (currentPage === 'vacancies') {
      return <PlaceholderPage title="Вакансии" />;
    }

    if (currentPage === 'pipeline') {
      return <PlaceholderPage title="Воронка" />;
    }

    return <PlaceholderPage title="Настройки" />;
  }, [currentPage, selectedCandidateId]);

  if (authState === 'checking') {
    return <Spin fullscreen tip="Проверка авторизации..." />;
  }

  if (authState === 'guest') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {content}
    </AppShell>
  );
}

export default App;
