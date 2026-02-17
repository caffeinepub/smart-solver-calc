import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FlaskConical, AlertCircle } from 'lucide-react';
import { useRunCalculation } from '../../hooks/useQueries';
import { ChemistryTopic, type Result } from '../../backend';
import { chemistryTopics } from './chemistry/chemistryTopics';

interface ChemistrySolverFormProps {
  onSolutionReceived: (result: Result) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function ChemistrySolverForm({ onSolutionReceived, onLoadingChange }: ChemistrySolverFormProps) {
  const [topic, setTopic] = useState<ChemistryTopic>(ChemistryTopic.molarMass);
  const [values, setValues] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState('');
  const runCalculation = useRunCalculation();

  const currentTopic = chemistryTopics[topic];

  useEffect(() => {
    // Reset values when topic changes
    const initialValues: Record<string, string> = {};
    currentTopic.fields.forEach(f => {
      initialValues[f.key] = '';
    });
    setValues(initialValues);
  }, [topic]);

  const handleSolve = async () => {
    setValidationError('');

    // Validate all required fields
    const missingFields = currentTopic.fields
      .filter(f => !values[f.key])
      .map(f => f.label);

    if (missingFields.length > 0) {
      setValidationError(`Please provide values for: ${missingFields.join(', ')}`);
      return;
    }

    // Convert to backend format
    const inputValues: [string, number][] = currentTopic.fields
      .filter(f => f.type === 'number')
      .map(f => [f.key, parseFloat(values[f.key])]);

    // For text fields like formula, add as special entry
    const textFields = currentTopic.fields.filter(f => f.type === 'text');
    if (textFields.length > 0) {
      // Store formula as a special numeric code (simplified for demo)
      inputValues.push(['formula', 0]);
    }

    try {
      onLoadingChange(true);
      const result = await runCalculation.mutateAsync({
        __kind__: 'chemistryProblem',
        chemistryProblem: {
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
          <FlaskConical className="h-5 w-5" />
          Chemistry Problem Solver
        </CardTitle>
        <CardDescription>
          Select a topic and provide the required values
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Select value={topic} onValueChange={(value) => setTopic(value as ChemistryTopic)}>
            <SelectTrigger id="topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(chemistryTopics).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">Input Values:</p>
          {currentTopic.fields.map(field => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key} className="text-sm">
                {field.label} {field.unit && `(${field.unit})`}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                step={field.type === 'number' ? 'any' : undefined}
                placeholder={field.placeholder}
                value={values[field.key] || ''}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
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
            {currentTopic.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
