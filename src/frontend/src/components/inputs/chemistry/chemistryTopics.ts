import { ChemistryTopic } from '../../../backend';

interface ChemistryField {
  key: string;
  label: string;
  unit?: string;
  type: 'text' | 'number';
  placeholder: string;
}

interface ChemistryTopicConfig {
  name: string;
  description: string;
  fields: ChemistryField[];
}

export const chemistryTopics: Record<ChemistryTopic, ChemistryTopicConfig> = {
  [ChemistryTopic.molarMass]: {
    name: 'Molar Mass Calculator',
    description: 'Calculate the molar mass of a chemical compound',
    fields: [
      { key: 'formula', label: 'Chemical Formula', type: 'text', placeholder: 'e.g., H2O, CO2, NaCl' },
    ],
  },
  [ChemistryTopic.molesMassConversion]: {
    name: 'Moles ⇄ Mass Conversion',
    description: 'Convert between moles and mass using molar mass',
    fields: [
      { key: 'moles', label: 'Moles', unit: 'mol', type: 'number', placeholder: 'Enter moles' },
      { key: 'molarMass', label: 'Molar Mass', unit: 'g/mol', type: 'number', placeholder: 'Enter molar mass' },
    ],
  },
  [ChemistryTopic.molarity]: {
    name: 'Molarity Calculator',
    description: 'Calculate molarity: M = n/V',
    fields: [
      { key: 'moles', label: 'Moles of Solute', unit: 'mol', type: 'number', placeholder: 'Enter moles' },
      { key: 'volume', label: 'Volume of Solution', unit: 'L', type: 'number', placeholder: 'Enter volume' },
    ],
  },
  [ChemistryTopic.dilution]: {
    name: 'Dilution Calculator',
    description: 'Calculate dilution: C₁V₁ = C₂V₂',
    fields: [
      { key: 'C1', label: 'Initial Concentration', unit: 'M', type: 'number', placeholder: 'Enter C₁' },
      { key: 'V1', label: 'Initial Volume', unit: 'L', type: 'number', placeholder: 'Enter V₁' },
      { key: 'C2', label: 'Final Concentration', unit: 'M', type: 'number', placeholder: 'Enter C₂' },
    ],
  },
  [ChemistryTopic.idealGasLaw]: {
    name: 'Ideal Gas Law',
    description: 'Calculate using PV = nRT',
    fields: [
      { key: 'P', label: 'Pressure', unit: 'atm', type: 'number', placeholder: 'Enter pressure' },
      { key: 'V', label: 'Volume', unit: 'L', type: 'number', placeholder: 'Enter volume' },
      { key: 'n', label: 'Moles', unit: 'mol', type: 'number', placeholder: 'Enter moles' },
      { key: 'T', label: 'Temperature', unit: 'K', type: 'number', placeholder: 'Enter temperature' },
    ],
  },
  [ChemistryTopic.ph]: {
    name: 'pH Calculator',
    description: 'Calculate pH from H⁺ concentration',
    fields: [
      { key: 'H', label: 'H⁺ Concentration', unit: 'M', type: 'number', placeholder: 'Enter [H⁺]' },
    ],
  },
};
