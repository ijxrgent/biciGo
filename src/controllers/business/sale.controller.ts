// src/controllers/business/sale.controller.ts
import { Request, Response } from "express";
import { SaleService } from "../../services/sale.service.js";

const saleService = new SaleService();

export class SaleController {
  // GET ALL (solo pending y paid)
  public async getAllSales(req: Request, res: Response) {
    try {
      const sales = await saleService.getAllSales();
      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales" });
    }
  }

  // GET ALL (admin)
  public async getAllSalesAdmin(req: Request, res: Response) {
    try {
      const sales = await saleService.getAllSalesAdmin();
      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales" });
    }
  }

  // GET BY ID
  public async getSaleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const sale = await saleService.getSaleById(id);

      if (sale) {
        res.status(200).json(sale);
      } else {
        res.status(404).json({ error: "Sale not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale" });
    }
  }

  // GET BY USER
  public async getSalesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const sales = await saleService.getSalesByUser(userId);
      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales by user" });
    }
  }

  // GET BY STATUS
  public async getSalesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status is required and must be a string" });
      }

      const sales = await saleService.getSalesByStatus(status);
      res.status(200).json({ sales });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // CREATE
  public async createSale(req: Request, res: Response) {
    try {
      const saleData = req.body;
      const newSale = await saleService.createSale(saleData);
      res.status(201).json(newSale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const saleData = req.body;
      const updatedSale = await saleService.updateSale(id, saleData);

      if (!updatedSale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      res.status(200).json(updatedSale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await saleService.delete(id);

      if (!result) {
        return res.status(404).json({ error: "Sale not found" });
      }

      res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // CAMBIAR ESTADO
  public async updateSaleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status is required and must be a string" });
      }

      const updatedSale = await saleService.updateSaleStatus(id, status);

      if (!updatedSale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      res.status(200).json({
        message: `Sale status updated to ${status}`,
        sale: updatedSale
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}