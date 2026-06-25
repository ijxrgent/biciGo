// src/controllers/business/penaltyType.controller.ts
import { Request, Response } from "express";
import { PenaltyType, PenaltyTypeI } from "../../models/business/PenaltyTypes.js";

export class PenaltyTypeController {
  // GET ALL (solo activos)
  public async getAllPenaltyTypes(req: Request, res: Response) {
    try {
      const penaltyTypes = await PenaltyType.findAll({
        where: { status: "active" },
        order: [["name", "ASC"]]
      });

      res.status(200).json({ penaltyTypes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalty types" });
    }
  }

  // GET ALL (incluyendo inactivos - admin)
  public async getAllPenaltyTypesAdmin(req: Request, res: Response) {
    try {
      const penaltyTypes = await PenaltyType.findAll({
        order: [["status", "DESC"], ["name", "ASC"]]
      });

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

      const penaltyType = await PenaltyType.findByPk(id);

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

      let body: PenaltyTypeI = {
        name,
        default_amount,
        description,
        penalty_mode: penalty_mode || "fixed",
        status: status || "active",
      };

      const newPenaltyType = await PenaltyType.create({ ...body });

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

      const penaltyType = await PenaltyType.findByPk(id);

      if (!penaltyType) {
        return res.status(404).json({ error: "Penalty type not found" });
      }

      const {
        name,
        default_amount,
        description,
        penalty_mode,
        status,
      } = req.body;

      await penaltyType.update({
        name,
        default_amount,
        description,
        penalty_mode,
        status,
      });

      res.status(200).json(penaltyType);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deletePenaltyType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const penaltyType = await PenaltyType.findByPk(id);

      if (!penaltyType) {
        return res.status(404).json({ error: "Penalty type not found" });
      }

      await penaltyType.destroy();

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

      const penaltyType = await PenaltyType.findOne({
        where: { id, status: "active" }
      });

      if (!penaltyType) {
        return res.status(404).json({ error: "Penalty type not found or already inactive" });
      }

      await penaltyType.update({ status: "inactive" });

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

      const penaltyType = await PenaltyType.findOne({
        where: { id, status: "inactive" }
      });

      if (!penaltyType) {
        return res.status(404).json({ error: "Penalty type not found or already active" });
      }

      await penaltyType.update({ status: "active" });

      res.status(200).json({ message: "Penalty type reactivated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reactivating penalty type" });
    }
  }
}