// src/controllers/business/penalty.controller.ts
import { Request, Response } from "express";
import { PenaltyService } from "../../services/penalty.service.js";

const penaltyService = new PenaltyService();

export class PenaltyController {
  // GET ALL (solo pendientes)
  public async getAllPenalties(req: Request, res: Response) {
    try {
      const penalties = await penaltyService.getAllPenalties();
      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties" });
    }
  }

  // GET ALL (admin)
  public async getAllPenaltiesAdmin(req: Request, res: Response) {
    try {
      const penalties = await penaltyService.getAllPenaltiesAdmin();
      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties" });
    }
  }

  // GET BY ID
  public async getPenaltyById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const penalty = await penaltyService.getPenaltyById(id);

      if (penalty) {
        res.status(200).json(penalty);
      } else {
        res.status(404).json({ error: "Penalty not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalty" });
    }
  }

  // GET BY RENTAL
  public async getPenaltiesByRental(req: Request, res: Response) {
    try {
      const { rentalId } = req.params;

      if (!rentalId || typeof rentalId !== 'string') {
        return res.status(400).json({ error: "Invalid rental ID format" });
      }

      const penalties = await penaltyService.getPenaltiesByRental(rentalId);
      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties by rental" });
    }
  }

  // GET BY PENALTY TYPE
  public async getPenaltiesByPenaltyType(req: Request, res: Response) {
    try {
      const { penaltyTypeId } = req.params;

      if (!penaltyTypeId || typeof penaltyTypeId !== 'string') {
        return res.status(400).json({ error: "Invalid penalty type ID format" });
      }

      const penalties = await penaltyService.getPenaltiesByPenaltyType(penaltyTypeId);
      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties by penalty type" });
    }
  }

  // CREATE
  public async createPenalty(req: Request, res: Response) {
    try {
      const penaltyData = req.body;
      const newPenalty = await penaltyService.createPenalty(penaltyData);
      res.status(201).json(newPenalty);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updatePenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const penaltyData = req.body;
      const updatedPenalty = await penaltyService.updatePenalty(id, penaltyData);

      if (!updatedPenalty) {
        return res.status(404).json({ error: "Penalty not found" });
      }

      res.status(200).json(updatedPenalty);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deletePenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await penaltyService.deletePenalty(id);

      if (!result) {
        return res.status(404).json({ error: "Penalty not found" });
      }

      res.status(200).json({ message: "Penalty deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // PAGAR PENALIZACIÓN (status → paid)
  public async payPenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paid_date } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const updatedPenalty = await penaltyService.payPenalty(id, paid_date);

      if (!updatedPenalty) {
        return res.status(404).json({ 
          error: "Penalty not found or already paid/waived" 
        });
      }

      res.status(200).json({ 
        message: "Penalty paid successfully",
        penalty: updatedPenalty
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // EXONERAR PENALIZACIÓN (status → waived)
  public async waivePenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const updatedPenalty = await penaltyService.waivePenalty(id);

      if (!updatedPenalty) {
        return res.status(404).json({ 
          error: "Penalty not found or already paid/waived" 
        });
      }

      res.status(200).json({ 
        message: "Penalty waived successfully",
        penalty: updatedPenalty
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}