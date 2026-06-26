// src/controllers/business/penaltyType.controller.ts
import { Request, Response } from "express";
import { PenaltyTypeService } from "../../services/penaltyTypes.service.js";

const penaltyTypeService = new PenaltyTypeService();

export class PenaltyTypeController {
  // GET ALL (solo activos)
  public async getAllPenaltyTypes(req: Request, res: Response) {
    try {
      const penaltyTypes = await penaltyTypeService.getAllPenaltyTypes();
      res.status(200).json({ penaltyTypes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalty types" });
    }
  }

  // GET ALL (incluyendo inactivos - admin)
  public async getAllPenaltyTypesAdmin(req: Request, res: Response) {
    try {
      const penaltyTypes = await penaltyTypeService.getAllPenaltyTypesAdmin();
      res.status(200).json({ penaltyTypes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalty types" });
    }
  }

  // GET BY ID
  public async getPenaltyTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const penaltyType = await penaltyTypeService.getPenaltyTypeById(id);

      if (penaltyType) {
        res.status(200).json(penaltyType);
      } else {
        res.status(404).json({ error: "Penalty type not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalty type" });
    }
  }

  // CREATE
  public async createPenaltyType(req: Request, res: Response) {
    try {
      const {
        name,
        default_amount,
        description,
        penalty_mode,
        status,
      } = req.body;

      const penaltyTypeData = {
        name,
        default_amount,
        description,
        penalty_mode: penalty_mode || "fixed",
        status: status || "active",
      };

      const newPenaltyType = await penaltyTypeService.createPenaltyType(penaltyTypeData);
      res.status(201).json(newPenaltyType);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updatePenaltyType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const {
        name,
        default_amount,
        description,
        penalty_mode,
        status,
      } = req.body;

      const penaltyTypeData = {
        name,
        default_amount,
        description,
        penalty_mode,
        status,
      };

      const updatedPenaltyType = await penaltyTypeService.updatePenaltyType(id, penaltyTypeData);

      if (!updatedPenaltyType) {
        return res.status(404).json({ error: "Penalty type not found" });
      }

      res.status(200).json(updatedPenaltyType);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deletePenaltyType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await penaltyTypeService.deletePenaltyType(id);

      if (!result) {
        return res.status(404).json({ error: "Penalty type not found" });
      }

      res.status(200).json({ message: "Penalty type deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting penalty type" });
    }
  }

  // DELETE LÓGICO (status → inactive)
  public async deletePenaltyTypeAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await penaltyTypeService.deletePenaltyTypeAdv(id);

      if (!result) {
        return res.status(404).json({ error: "Penalty type not found or already inactive" });
      }

      res.status(200).json({ message: "Penalty type marked as inactive" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating penalty type status" });
    }
  }

  // REACTIVAR (status → active)
  public async reactivatePenaltyType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await penaltyTypeService.reactivatePenaltyType(id);

      if (!result) {
        return res.status(404).json({ error: "Penalty type not found or already active" });
      }

      res.status(200).json({ message: "Penalty type reactivated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reactivating penalty type" });
    }
  }
}