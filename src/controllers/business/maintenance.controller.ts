// src/controllers/business/maintenance.controller.ts
import { Request, Response } from "express";
import { MaintenanceService } from "../../services/maintenance.service.js";

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  // Get all maintenances (solo activos)
  public async getAllMaintenances(req: Request, res: Response) {
    try {
      const maintenances = await maintenanceService.getAllMaintenances();
      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Get all maintenances (admin)
  public async getAllMaintenancesAdmin(req: Request, res: Response) {
    try {
      const maintenances = await maintenanceService.getAllMaintenancesAdmin();
      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Get by ID
  public async getMaintenanceById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const maintenance = await maintenanceService.getMaintenanceById(id);

      if (maintenance) {
        res.status(200).json(maintenance);
      } else {
        res.status(404).json({ error: "Maintenance not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenance" });
    }
  }

  // Get by bike
  public async getMaintenancesByBike(req: Request, res: Response) {
    try {
      const { bikeId } = req.params;

      if (!bikeId || typeof bikeId !== 'string') {
        return res.status(400).json({ error: "Invalid bike ID format" });
      }

      const maintenances = await maintenanceService.getMaintenancesByBike(bikeId);
      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Create
  public async createMaintenance(req: Request, res: Response) {
    try {
      const maintenanceData = req.body;
      const newMaintenance = await maintenanceService.createMaintenance(maintenanceData);
      res.status(201).json(newMaintenance);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update
  public async updateMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const maintenanceData = req.body;
      const updatedMaintenance = await maintenanceService.updateMaintenance(id, maintenanceData);

      if (!updatedMaintenance) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      res.status(200).json(updatedMaintenance);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete físico
  public async deleteMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await maintenanceService.deleteMaintenance(id);

      if (!result) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      res.status(200).json({ message: "Maintenance deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Cambio de estado
  public async updateMaintenanceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, total_cost, end_date } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const updatedMaintenance = await maintenanceService.updateMaintenanceStatus(
        id,
        status,
        total_cost,
        end_date
      );

      if (!updatedMaintenance) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      res.status(200).json({ 
        message: `Status updated to ${status}`,
        maintenance: updatedMaintenance 
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}