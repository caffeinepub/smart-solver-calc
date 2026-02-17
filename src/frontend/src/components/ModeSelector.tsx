import { Calculator, Atom, FlaskConical } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SolverMode } from '../pages/SolverPage';

interface ModeSelectorProps {
  mode: SolverMode;
  onModeChange: (mode: SolverMode) => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as SolverMode)}>
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger value="math" className="flex flex-col items-center gap-2 py-3">
          <Calculator className="h-5 w-5" />
          <span className="text-sm font-medium">Math</span>
        </TabsTrigger>
        <TabsTrigger value="physics" className="flex flex-col items-center gap-2 py-3">
          <Atom className="h-5 w-5" />
          <span className="text-sm font-medium">Physics</span>
        </TabsTrigger>
        <TabsTrigger value="chemistry" className="flex flex-col items-center gap-2 py-3">
          <FlaskConical className="h-5 w-5" />
          <span className="text-sm font-medium">Chemistry</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
