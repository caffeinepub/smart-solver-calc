import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import SolverPage from './pages/SolverPage';
import HistoryPage from './pages/HistoryPage';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = 'solver' | 'history';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('solver');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {currentPage === 'solver' && <SolverPage />}
        {currentPage === 'history' && <HistoryPage />}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppContent />
        </ThemeProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
