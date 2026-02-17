import { Badge } from '@/components/ui/badge';
import type { Step } from '../../backend';

interface MathStepsProps {
  steps: Step[];
}

export default function MathSteps({ steps }: MathStepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              {index + 1}
            </Badge>
            <div className="flex-1 space-y-2">
              <p className="text-sm">{step.description}</p>
              {step.calculation && (
                <div className="bg-background/80 p-3 rounded border border-border">
                  <pre className="text-xs font-mono text-foreground overflow-x-auto">
                    {step.calculation}
                  </pre>
                </div>
              )}
              {step.result !== undefined && (
                <p className="text-sm font-medium text-primary">
                  = {step.result}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
