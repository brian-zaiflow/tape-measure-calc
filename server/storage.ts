import { 
  type User, 
  type InsertUser,
  type CalculationHistory,
  type InsertCalculationHistory,
  type SavedMeasurement,
  type InsertSavedMeasurement
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Calculation history
  getCalculationHistory(limit?: number): Promise<CalculationHistory[]>;
  createCalculationHistory(history: InsertCalculationHistory): Promise<CalculationHistory>;
  
  // Saved measurements
  getSavedMeasurements(): Promise<SavedMeasurement[]>;
  createSavedMeasurement(measurement: InsertSavedMeasurement): Promise<SavedMeasurement>;
  deleteSavedMeasurement(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calculationHistory: CalculationHistory[];
  private savedMeasurements: SavedMeasurement[];
  private historyIdCounter: number;
  private savedIdCounter: number;

  constructor() {
    this.users = new Map();
    this.calculationHistory = [];
    this.savedMeasurements = [];
    this.historyIdCounter = 1;
    this.savedIdCounter = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCalculationHistory(limit: number = 50): Promise<CalculationHistory[]> {
    return this.calculationHistory
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }

  async createCalculationHistory(history: InsertCalculationHistory): Promise<CalculationHistory> {
    const record: CalculationHistory = {
      id: this.historyIdCounter++,
      ...history,
      createdAt: new Date(),
    };
    this.calculationHistory.push(record);
    return record;
  }

  async getSavedMeasurements(): Promise<SavedMeasurement[]> {
    return [...this.savedMeasurements].sort((a, b) => b.id - a.id);
  }

  async createSavedMeasurement(measurement: InsertSavedMeasurement): Promise<SavedMeasurement> {
    const record: SavedMeasurement = {
      id: this.savedIdCounter++,
      ...measurement,
      createdAt: new Date(),
    };
    this.savedMeasurements.push(record);
    return record;
  }

  async deleteSavedMeasurement(id: number): Promise<void> {
    this.savedMeasurements = this.savedMeasurements.filter(m => m.id !== id);
  }
}

export const storage = new MemStorage();
