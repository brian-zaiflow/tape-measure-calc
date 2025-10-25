import { z } from "zod";

// Calculator operation types
export const OperationType = z.enum(['add', 'subtract', 'divide', 'none']);
export type OperationType = z.infer<typeof OperationType>;

// Precision settings for rounding
export const PrecisionType = z.enum(['eighth', 'sixteenth']);
export type PrecisionType = z.infer<typeof PrecisionType>;

// Display format for results
export const DisplayFormat = z.enum(['reduced', 'sixteenths']);
export type DisplayFormat = z.infer<typeof DisplayFormat>;

// Represents an imperial measurement
export interface ImperialMeasurement {
  feet: number;
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
  precision: PrecisionType;
  displayFormat: DisplayFormat;
  shouldResetInput: boolean;
}
