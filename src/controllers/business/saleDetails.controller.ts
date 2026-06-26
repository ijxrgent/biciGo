// src/controllers/business/saleDetails.controller.ts
import { Request, Response } from "express";
import { SaleDetailsService } from "../../services/saleDetails.service.js";

const saleDetailsService = new SaleDetailsService();

export class SaleDetailsController {
  // GET ALL
  public async getAllSaleDetails(req: Request, res: Response) {
    try {
      const saleDetails = await saleDetailsService.getAllSaleDetails();
      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details" });
    }
  }

  // GET BY ID
  public async getSaleDetailsById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const saleDetail = await saleDetailsService.getSaleDetailsById(id);

      if (saleDetail) {
        res.status(200).json(saleDetail);
      } else {
        res.status(404).json({ error: "Sale detail not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale detail" });
    }
  }

  // GET BY SALE
  public async getSaleDetailsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;

      if (!saleId || typeof saleId !== 'string') {
        return res.status(400).json({ error: "Invalid sale ID format" });
      }

      const saleDetails = await saleDetailsService.getSaleDetailsBySale(saleId);
      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details by sale" });
    }
  }

  // GET BY BIKE
  public async getSaleDetailsByBike(req: Request, res: Response) {
    try {
      const { bikeId } = req.params;

      if (!bikeId || typeof bikeId !== 'string') {
        return res.status(400).json({ error: "Invalid bike ID format" });
      }

      const saleDetails = await saleDetailsService.getSaleDetailsByBike(bikeId);
      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details by bike" });
    }
  }

  // CREATE
  public async createSaleDetails(req: Request, res: Response) {
    try {
      const detailData = req.body;
      const newDetail = await saleDetailsService.createSaleDetails(detailData);
      res.status(201).json(newDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateSaleDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const detailData = req.body;
      const updatedDetail = await saleDetailsService.updateSaleDetails(id, detailData);

      if (!updatedDetail) {
        return res.status(404).json({ error: "Sale detail not found" });
      }

      res.status(200).json(updatedDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE
  public async deleteSaleDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await saleDetailsService.deleteSaleDetails(id);

      if (!result) {
        return res.status(404).json({ error: "Sale detail not found" });
      }

      res.status(200).json({ message: "Sale detail deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting sale detail" });
    }
  }

  // DELETE ALL BY SALE
  public async deleteSaleDetailsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;

      if (!saleId || typeof saleId !== 'string') {
        return res.status(400).json({ error: "Invalid sale ID format" });
      }

      const deletedCount = await saleDetailsService.deleteSaleDetailsBySale(saleId);

      res.status(200).json({ 
        message: `${deletedCount} sale details deleted successfully` 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting sale details" });
    }
  }
}