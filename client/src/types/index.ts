import { z } from "zod";

// Calculator operation types
export const OperationType = z.enum(['add', 'subtract', 'multiply', 'divide', 'none']);
export type OperationType = z.infer<typeof OperationType>;

// Represents an imperial measurement (inches and fractions only)
export interface ImperialMeasurement {
  inches: number;
  numerator: number;
  denominator: number;
}

// Calculator state
export interface CalculatorState {
  currentInput: string;
  displayValue: string;
  previousValue: ImperialMeasurement | null;
  operation: OperationType;
  shouldResetInput: boolean;
}
