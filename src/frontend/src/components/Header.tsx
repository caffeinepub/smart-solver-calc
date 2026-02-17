import { Calculator } from 'lucide-react';
import LoginButton from './auth/LoginButton';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: 'solver' | 'history';
  onNavigate: (page: 'solver' | 'history') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('solver')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold text-foreground">Smart Solver</span>
                <span className="text-xs text-muted-foreground">Math • Physics • Chemistry</span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentPage === 'solver' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('solver')}
              >
                Solver
              </Button>
              <Button
                variant={currentPage === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('history')}
              >
                History
              </Button>
            </nav>
          </div>

          <LoginButton />
        </div>
      </div>
    </header>
  );
}
