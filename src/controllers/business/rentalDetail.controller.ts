// src/controllers/business/rentalDetails.controller.ts
import { Request, Response } from "express";
import { RentalDetailsService } from "../../services/rentalDetails.service.js";

const rentalDetailsService = new RentalDetailsService();

export class RentalDetailsController {
  // GET ALL
  public async getAllRentalDetails(req: Request, res: Response) {
    try {
      const rentalDetails = await rentalDetailsService.getAllRentalDetails();
      res.status(200).json({ rentalDetails });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET BY ID
  public async getRentalDetailsById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // ✅ Validación de ID
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const rentalDetail = await rentalDetailsService.getRentalDetailsById(id);

      if (!rentalDetail) {
        return res.status(404).json({ error: "Rental detail not found" });
      }

      res.status(200).json(rentalDetail);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET BY RENTAL ID
  public async getRentalDetailsByRental(req: Request, res: Response) {
    try {
      const { rentalId } = req.params;

      // ✅ Validación de ID
      if (!rentalId || typeof rentalId !== 'string') {
        return res.status(400).json({ error: "Invalid rental ID format" });
      }

      const rentalDetails = await rentalDetailsService.getRentalDetailsByRental(rentalId);
      res.status(200).json({ rentalDetails });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE
  public async createRentalDetails(req: Request, res: Response) {
    try {
      const detailData = req.body;
      const newDetail = await rentalDetailsService.createRentalDetails(detailData);
      
      // Actualizar el total del rental
      if (newDetail.rental_id) {
        await rentalDetailsService.updateRentalTotal(newDetail.rental_id);
      }

      res.status(201).json(newDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRentalDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // ✅ Validación de ID
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const detailData = req.body;
      const updatedDetail = await rentalDetailsService.updateRentalDetails(id, detailData);

      if (!updatedDetail) {
        return res.status(404).json({ error: "Rental detail not found" });
      }

      // Actualizar el total del rental
      if (updatedDetail.rental_id) {
        await rentalDetailsService.updateRentalTotal(updatedDetail.rental_id);
      }

      res.status(200).json(updatedDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE
  public async deleteRentalDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // ✅ Validación de ID
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // ✅ Usar el método del servicio que actualiza el total automáticamente
      const result = await rentalDetailsService.deleteRentalDetailsAndUpdateTotal(id);

      if (!result) {
        return res.status(404).json({ error: "Rental detail not found" });
      }

      res.status(200).json({ message: "Rental detail deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}