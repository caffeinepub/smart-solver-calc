import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Atom, AlertCircle } from 'lucide-react';
import { useRunCalculation } from '../../hooks/useQueries';
import { PhysicsTopic, type Result } from '../../backend';
import { physicsTopics } from './physics/physicsTopics';

interface PhysicsSolverFormProps {
  onSolutionReceived: (result: Result) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function PhysicsSolverForm({ onSolutionReceived, onLoadingChange }: PhysicsSolverFormProps) {
  const [topic, setTopic] = useState<PhysicsTopic>(PhysicsTopic.kinematics);
  const [values, setValues] = useState<Record<string, string>>({});
  const [solveFor, setSolveFor] = useState<string>('');
  const [validationError, setValidationError] = useState('');
  const runCalculation = useRunCalculation();

  const currentTopic = physicsTopics[topic];

  useEffect(() => {
    // Reset values when topic changes
    const initialValues: Record<string, string> = {};
    currentTopic.variables.forEach(v => {
      initialValues[v.key] = '';
    });
    setValues(initialValues);
    setSolveFor(currentTopic.variables[0].key);
  }, [topic]);

  const handleSolve = async () => {
    setValidationError('');

    // Validate that all variables except solveFor have values
    const missingVars = currentTopic.variables
      .filter(v => v.key !== solveFor && !values[v.key])
      .map(v => v.label);

    if (missingVars.length > 0) {
      setValidationError(`Please provide values for: ${missingVars.join(', ')}`);
      return;
    }

    // Convert to backend format
    const inputValues: [string, number][] = currentTopic.variables
      .filter(v => v.key !== solveFor && values[v.key])
      .map(v => [v.key, parseFloat(values[v.key])]);

    inputValues.push(['solveFor', 0]); // Add solve-for marker

    try {
      onLoadingChange(true);
      const result = await runCalculation.mutateAsync({
        __kind__: 'physicsProblem',
        physicsProblem: {
          topic,
          values: inputValues,
        },
      });
      onSolutionReceived(result);
    } catch (error: any) {
      setValidationError(error.message || 'Failed to solve problem');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="h-5 w-5" />
          Physics Problem Solver
        </CardTitle>
        <CardDescription>
          Select a topic and provide known values to solve for the unknown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Select value={topic} onValueChange={(value) => setTopic(value as PhysicsTopic)}>
            <SelectTrigger id="topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(physicsTopics).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="solveFor">Solve For</Label>
          <Select value={solveFor} onValueChange={setSolveFor}>
            <SelectTrigger id="solveFor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentTopic.variables.map(v => (
                <SelectItem key={v.key} value={v.key}>
                  {v.label} ({v.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">Known Values:</p>
          {currentTopic.variables
            .filter(v => v.key !== solveFor)
            .map(variable => (
              <div key={variable.key} className="space-y-1">
                <Label htmlFor={variable.key} className="text-sm">
                  {variable.label} ({variable.unit})
                </Label>
                <Input
                  id={variable.key}
                  type="number"
                  step="any"
                  placeholder={`Enter ${variable.label.toLowerCase()}`}
                  value={values[variable.key] || ''}
                  onChange={(e) => setValues({ ...values, [variable.key]: e.target.value })}
                />
              </div>
            ))}
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleSolve} 
          disabled={runCalculation.isPending}
          className="w-full"
        >
          {runCalculation.isPending ? 'Solving...' : 'Solve'}
        </Button>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Formula: {currentTopic.formula}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
