export type NumberSystem = 'binary' | 'decimal' | 'octal' | 'hexadecimal';

export interface ConversionResult {
  id: string;
  input: string;
  inputSystem: NumberSystem;
  results: {
    binary: string;
    decimal: string;
    octal: string;
    hexadecimal: string;
  };
  timestamp: Date;
}

export const numberSystems: { value: NumberSystem; label: string }[] = [
  { value: 'binary', label: 'Binary (Base 2)' },
  { value: 'decimal', label: 'Decimal (Base 10)' },
  { value: 'octal', label: 'Octal (Base 8)' },
  { value: 'hexadecimal', label: 'Hexadecimal (Base 16)' },
];

export function validateInput(input: string, system: NumberSystem): boolean {
  if (!input.trim()) return false;
  
  const patterns = {
    binary: /^[01]+$/,
    decimal: /^[0-9]+$/,
    octal: /^[0-7]+$/,
    hexadecimal: /^[0-9a-fA-F]+$/,
  };
  
  return patterns[system].test(input.trim());
}

export function convertNumber(input: string, fromSystem: NumberSystem): ConversionResult {
  const cleanInput = input.trim();
  
  if (!validateInput(cleanInput, fromSystem)) {
    throw new Error(`Invalid ${fromSystem} number: ${cleanInput}`);
  }
  
  // Convert to decimal first
  let decimal: number;
  
  switch (fromSystem) {
    case 'binary':
      decimal = parseInt(cleanInput, 2);
      break;
    case 'decimal':
      decimal = parseInt(cleanInput, 10);
      break;
    case 'octal':
      decimal = parseInt(cleanInput, 8);
      break;
    case 'hexadecimal':
      decimal = parseInt(cleanInput, 16);
      break;
    default:
      throw new Error(`Unsupported number system: ${fromSystem}`);
  }
  
  if (isNaN(decimal) || decimal < 0) {
    throw new Error(`Invalid number: ${cleanInput}`);
  }
  
  return {
    id: Date.now().toString(),
    input: cleanInput,
    inputSystem: fromSystem,
    results: {
      binary: decimal.toString(2),
      decimal: decimal.toString(10),
      octal: decimal.toString(8),
      hexadecimal: decimal.toString(16).toUpperCase(),
    },
    timestamp: new Date(),
  };
}

export function formatSystemLabel(system: NumberSystem): string {
  const labels = {
    binary: 'Binary',
    decimal: 'Decimal',
    octal: 'Octal',
    hexadecimal: 'Hexadecimal',
  };
  return labels[system];
}