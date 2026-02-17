import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, AlertCircle } from 'lucide-react';
import { useRunCalculation } from '../../hooks/useQueries';
import type { Result } from '../../backend';

interface MathSolverFormProps {
  onSolutionReceived: (result: Result) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function MathSolverForm({ onSolutionReceived, onLoadingChange }: MathSolverFormProps) {
  const [expression, setExpression] = useState('');
  const [validationError, setValidationError] = useState('');
  const runCalculation = useRunCalculation();

  const handleSolve = async () => {
    setValidationError('');

    if (!expression.trim()) {
      setValidationError('Please enter a mathematical expression');
      return;
    }

    try {
      onLoadingChange(true);
      const result = await runCalculation.mutateAsync({
        __kind__: 'mathExpression',
        mathExpression: expression.trim(),
      });
      onSolutionReceived(result);
    } catch (error: any) {
      setValidationError(error.message || 'Failed to solve expression');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleReSolve = () => {
    handleSolve();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Math Expression Solver
        </CardTitle>
        <CardDescription>
          Enter any mathematical expression with operators (+, -, *, /, ^), functions (sin, cos, sqrt), and constants (pi, e)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expression">Expression</Label>
          <Textarea
            id="expression"
            placeholder="e.g., (2+3)*4^2 or sqrt(16)+sin(pi/2)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="font-mono min-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSolve();
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Press Ctrl+Enter to solve
          </p>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleSolve} 
            disabled={runCalculation.isPending}
            className="flex-1"
          >
            {runCalculation.isPending ? 'Solving...' : 'Solve'}
          </Button>
          {expression && (
            <Button 
              onClick={handleReSolve} 
              variant="outline"
              disabled={runCalculation.isPending}
            >
              Re-solve
            </Button>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium mb-2">Examples:</p>
          <div className="space-y-1">
            <button
              onClick={() => setExpression('(2+3)*4^2')}
              className="text-xs text-muted-foreground hover:text-foreground block"
            >
              • (2+3)*4^2
            </button>
            <button
              onClick={() => setExpression('sqrt(16)+sin(pi/2)')}
              className="text-xs text-muted-foreground hover:text-foreground block"
            >
              • sqrt(16)+sin(pi/2)
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
