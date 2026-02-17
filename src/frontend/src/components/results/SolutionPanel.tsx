import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { Result } from '../../backend';
import type { SolverMode } from '../../pages/SolverPage';
import MathSteps from './MathSteps';

interface SolutionPanelProps {
  result: Result | null;
  mode: SolverMode;
  isLoading: boolean;
}

export default function SolutionPanel({ result, mode, isLoading }: SolutionPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Solving your problem...</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Enter a problem and click Solve to see the solution here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Solution</CardTitle>
          <Badge variant="outline" className="capitalize">
            {mode}
          </Badge>
        </div>
        <CardDescription>Step-by-step solution with final answer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Final Answer */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium text-muted-foreground mb-1">Final Answer</p>
          <p className="text-2xl font-bold text-primary">
            {result.finalAnswer.value}
            {result.finalAnswer.units && (
              <span className="text-lg ml-2 text-muted-foreground">
                {result.finalAnswer.units}
              </span>
            )}
          </p>
        </div>

        <Separator />

        {/* Steps */}
        <div className="space-y-4">
          <p className="text-sm font-medium">Solution Steps:</p>
          {mode === 'math' ? (
            <MathSteps steps={result.steps} />
          ) : (
            <div className="space-y-3">
              {result.steps.map((step, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{step.description}</p>
                      {step.calculation && (
                        <p className="text-xs font-mono text-muted-foreground bg-background/50 p-2 rounded">
                          {step.calculation}
                        </p>
                      )}
                      {step.result !== undefined && (
                        <p className="text-sm font-medium text-primary">
                          Result: {step.result}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
