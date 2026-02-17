import type { Input } from '../../backend';

export function getHistorySummary(input: Input): string {
  switch (input.__kind__) {
    case 'mathExpression':
      return input.mathExpression.length > 50 
        ? input.mathExpression.substring(0, 50) + '...'
        : input.mathExpression;
    
    case 'physicsProblem': {
      const topicName = input.physicsProblem.topic.replace(/([A-Z])/g, ' $1').trim();
      const valueCount = input.physicsProblem.values.length;
      return `${topicName} (${valueCount} values)`;
    }
    
    case 'chemistryProblem': {
      const topicName = input.chemistryProblem.topic.replace(/([A-Z])/g, ' $1').trim();
      const valueCount = input.chemistryProblem.values.length;
      return `${topicName} (${valueCount} values)`;
    }
    
    default:
      return 'Unknown problem';
  }
}
