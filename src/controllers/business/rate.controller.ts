//src/controllers/business/rate.controller.ts
import { Request, Response } from "express";
import { Rate, RateI } from "../../models/business/Rate.js";

export class RateController {
  // GET ALL (solo activos)
  public async getAllRates(req: Request, res: Response) {
    try {
      const rates: RateI[] = await Rate.findAll({
        where: { status: "active" },
      });

      res.status(200).json({ rates });

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

    // GET BY ID
  public async getRateById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const rate = await Rate.findOne({
        where: { id, status: "active" },
      });

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

  // CREATE
  public async createRate(req: Request, res: Response) {
    try {
      const { name, price_per_hour, max_hours, status } = req.body;

      const body: RateI = {
        name,
        price_per_hour,
        status,
      };

      const newRate = await Rate.create({ ...body });

      res.status(201).json(newRate);

    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRate(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const { name, price_per_hour, status } = req.body;

      const rate = await Rate.findOne({
        where: { id, status: "active" },
      });

      if (rate) {
        await rate.update({
          name,
          price_per_hour,
          status,
        });

        res.status(200).json(rate);
      } else {
        res.status(404).json({ error: "Rate not found or inactive" });
      }

    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE físico
  public async deleteRate(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const rate = await Rate.findByPk(id);

      if (rate) {
        await rate.destroy();
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
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const rate = await Rate.findOne({
        where: { id, status: "active" },
      });

      if (rate) {
        await rate.update({ status: "inactive" });
        res.status(200).json({ message: "Rate marked as inactive" });
      } else {
        res.status(404).json({ error: "Rate not found" });
      }

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}