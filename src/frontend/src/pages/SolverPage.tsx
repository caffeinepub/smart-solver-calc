import { useState } from 'react';
import ModeSelector from '../components/ModeSelector';
import MathSolverForm from '../components/inputs/MathSolverForm';
import PhysicsSolverForm from '../components/inputs/PhysicsSolverForm';
import ChemistrySolverForm from '../components/inputs/ChemistrySolverForm';
import SolutionPanel from '../components/results/SolutionPanel';
import Branding from '../components/Branding';
import type { Result } from '../backend';

export type SolverMode = 'math' | 'physics' | 'chemistry';

export default function SolverPage() {
  const [mode, setMode] = useState<SolverMode>('math');
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSolutionReceived = (solution: Result) => {
    setResult(solution);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Branding />
      
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        {/* Left Column: Mode Selector & Input Forms */}
        <div className="space-y-6">
          <ModeSelector mode={mode} onModeChange={setMode} />
          
          <div className="min-h-[400px]">
            {mode === 'math' && (
              <MathSolverForm 
                onSolutionReceived={handleSolutionReceived}
                onLoadingChange={handleLoadingChange}
              />
            )}
            {mode === 'physics' && (
              <PhysicsSolverForm 
                onSolutionReceived={handleSolutionReceived}
                onLoadingChange={handleLoadingChange}
              />
            )}
            {mode === 'chemistry' && (
              <ChemistrySolverForm 
                onSolutionReceived={handleSolutionReceived}
                onLoadingChange={handleLoadingChange}
              />
            )}
          </div>
        </div>

        {/* Right Column: Solution Display */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <SolutionPanel 
            result={result} 
            mode={mode}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
