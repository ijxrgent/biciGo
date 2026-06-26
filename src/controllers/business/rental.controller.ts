// src/controllers/business/rental.controller.ts
import { Request, Response } from "express";
import { RentalService } from "../../services/rental.service.js";

const rentalService = new RentalService();

export class RentalController {
  // GET ALL
  public async getAllRentals(req: Request, res: Response) {
    try {
      const rentals = await rentalService.getAllRentals();
      res.status(200).json({ rentals });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET BY ID
  public async getRentalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const rental = await rentalService.getRentalById(id);

      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      res.status(200).json(rental);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE
  public async createRental(req: Request, res: Response) {
    try {
      const rentalData = req.body;
      const newRental = await rentalService.createRental(rentalData);
      res.status(201).json(newRental);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRental(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rentalData = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const updatedRental = await rentalService.updateRental(id, rentalData);

      if (!updatedRental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      res.status(200).json(updatedRental);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deleteRental(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await rentalService.delete(id);

      if (!result) {
        return res.status(404).json({ error: "Rental not found" });
      }

      res.status(200).json({ message: "Rental deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}