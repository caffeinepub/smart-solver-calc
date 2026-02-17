import { PhysicsTopic } from '../../../backend';

interface PhysicsVariable {
  key: string;
  label: string;
  unit: string;
}

interface PhysicsTopicConfig {
  name: string;
  formula: string;
  variables: PhysicsVariable[];
}

export const physicsTopics: Record<PhysicsTopic, PhysicsTopicConfig> = {
  [PhysicsTopic.kinematics]: {
    name: 'Kinematics',
    formula: 's = ut + ½at²',
    variables: [
      { key: 's', label: 'Displacement', unit: 'm' },
      { key: 'u', label: 'Initial Velocity', unit: 'm/s' },
      { key: 'a', label: 'Acceleration', unit: 'm/s²' },
      { key: 't', label: 'Time', unit: 's' },
    ],
  },
  [PhysicsTopic.newtonsSecondLaw]: {
    name: "Newton's Second Law",
    formula: 'F = ma',
    variables: [
      { key: 'F', label: 'Force', unit: 'N' },
      { key: 'm', label: 'Mass', unit: 'kg' },
      { key: 'a', label: 'Acceleration', unit: 'm/s²' },
    ],
  },
  [PhysicsTopic.workEnergy]: {
    name: 'Work & Energy',
    formula: 'W = Fd or KE = ½mv²',
    variables: [
      { key: 'W', label: 'Work', unit: 'J' },
      { key: 'F', label: 'Force', unit: 'N' },
      { key: 'd', label: 'Distance', unit: 'm' },
    ],
  },
  [PhysicsTopic.power]: {
    name: 'Power',
    formula: 'P = W/t',
    variables: [
      { key: 'P', label: 'Power', unit: 'W' },
      { key: 'W', label: 'Work', unit: 'J' },
      { key: 't', label: 'Time', unit: 's' },
    ],
  },
  [PhysicsTopic.ohmsLaw]: {
    name: "Ohm's Law",
    formula: 'V = IR',
    variables: [
      { key: 'V', label: 'Voltage', unit: 'V' },
      { key: 'I', label: 'Current', unit: 'A' },
      { key: 'R', label: 'Resistance', unit: 'Ω' },
    ],
  },
};
