import { z } from "zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Calculator operation types
export const OperationType = z.enum(['add', 'subtract', 'multiply', 'divide', 'none']);
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

// Database tables
export const calculationHistory = pgTable("calculation_history", {
  id: serial("id").primaryKey(),
  expression: text("expression").notNull(), // e.g., "5' 3 1/2\" + 2' 7 3/4\""
  result: text("result").notNull(), // e.g., "7' 11 1/4\""
  operation: text("operation").notNull(), // 'add', 'subtract', 'multiply', 'divide'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedMeasurements = pgTable("saved_measurements", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  measurement: text("measurement").notNull(), // formatted measurement string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertCalculationHistorySchema = createInsertSchema(calculationHistory).omit({
  id: true,
  createdAt: true,
});

export const insertSavedMeasurementSchema = createInsertSchema(savedMeasurements).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertCalculationHistory = z.infer<typeof insertCalculationHistorySchema>;
export type CalculationHistory = typeof calculationHistory.$inferSelect;
export type InsertSavedMeasurement = z.infer<typeof insertSavedMeasurementSchema>;
export type SavedMeasurement = typeof savedMeasurements.$inferSelect;
