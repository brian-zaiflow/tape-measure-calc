import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationHistorySchema, insertSavedMeasurementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculation History Routes
  app.get("/api/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const history = await storage.getCalculationHistory(limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculation history" });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const data = insertCalculationHistorySchema.parse(req.body);
      const history = await storage.createCalculationHistory(data);
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: "Invalid history data" });
    }
  });

  // Saved Measurements Routes
  app.get("/api/saved-measurements", async (req, res) => {
    try {
      const measurements = await storage.getSavedMeasurements();
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved measurements" });
    }
  });

  app.post("/api/saved-measurements", async (req, res) => {
    try {
      const data = insertSavedMeasurementSchema.parse(req.body);
      const measurement = await storage.createSavedMeasurement(data);
      res.json(measurement);
    } catch (error) {
      res.status(400).json({ error: "Invalid measurement data" });
    }
  });

  app.delete("/api/saved-measurements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSavedMeasurement(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete measurement" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
