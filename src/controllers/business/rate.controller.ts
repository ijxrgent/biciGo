// src/controllers/business/rate.controller.ts
import { Request, Response } from "express";
import { RateService } from "../../services/rate.service.js";

const rateService = new RateService();

export class RateController {
  // GET ALL (solo activos)
  public async getAllRates(req: Request, res: Response) {
    try {
      const rates = await rateService.getAllRates();
      res.status(200).json({ rates });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET ALL (admin - incluye inactivos)
  public async getAllRatesAdmin(req: Request, res: Response) {
    try {
      // ✅ Usar findAll de BaseService
      const rates = await rateService.findAll();
      res.status(200).json({ rates });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET BY ID
  public async getRateById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const rate = await rateService.getRateById(id);

      if (rate) {
        res.status(200).json(rate);
      } else {
        res.status(404).json({ error: "Rate not found or inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET BY ID (admin - incluye inactivos)
  public async getRateByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // ✅ Usar findById de BaseService
      const rate = await rateService.findById(id);

      if (rate) {
        res.status(200).json(rate);
      } else {
        res.status(404).json({ error: "Rate not found" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE
  public async createRate(req: Request, res: Response) {
    try {
      const { name, price_per_hour, max_hours, status } = req.body;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Invalid name format" });
      }

      const rateData = {
        name,
        price_per_hour,
        max_hours,
        status: status || "active",
      };

      const newRate = await rateService.createRate(rateData);
      res.status(201).json(newRate);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price_per_hour, max_hours, status } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Invalid name format" });
      }

      const rateData = {
        name,
        price_per_hour,
        max_hours,
        status,
      };

      const updatedRate = await rateService.updateRate(id, rateData);

      if (updatedRate) {
        res.status(200).json(updatedRate);
      } else {
        res.status(404).json({ error: "Rate not found or inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE físico - ✅ Usar delete de BaseService
  public async deleteRate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await rateService.delete(id);

      if (result) {
        res.status(200).json({ message: "Rate deleted successfully" });
      } else {
        res.status(404).json({ error: "Rate not found" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE lógico
  public async deleteRateAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await rateService.deleteRateAdv(id);

      if (result) {
        res.status(200).json({ message: "Rate marked as inactive" });
      } else {
        res.status(404).json({ error: "Rate not found or already inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // REACTIVATE
  public async reactivateRate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await rateService.reactivateRate(id);

      if (result) {
        res.status(200).json({ message: "Rate reactivated successfully" });
      } else {
        res.status(404).json({ error: "Rate not found or already active" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}