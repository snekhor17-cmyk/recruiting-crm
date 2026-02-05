import { useMemo, useState } from 'react';
import { AppShell, PageKey } from './layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');

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

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {content}
    </AppShell>
  );
}

export default App;
