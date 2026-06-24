// src/controllers/business/rental.controller.ts
import { Request, Response } from "express";
import { Rental, RentalI } from "../../models/business/Rental.js";
import { User } from "../../models/business/User.js";

export class RentalController {
  // GET ALL
  public async getAllRentals(req: Request, res: Response) {
    try {
      const rentals = await Rental.findAll({
        include: [
          { 
            model: User, 
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

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

      const rental = await Rental.findByPk(id, {
        include: [
          { 
            model: User, 
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

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
      const body: RentalI = req.body;

      // Validar que el usuario existe
      const userExists = await User.findByPk(body.user_id);
      if (!userExists) {
        return res.status(400).json({ error: "User not found" });
      }

      const rental = await Rental.create({ ...body });

      // Obtener el rental creado con su relación
      const createdRental = await Rental.findByPk(rental.id, {
        include: [
          { 
            model: User, 
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

      res.status(201).json(createdRental);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRental(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rental = await Rental.findByPk(id);

      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      await rental.update(req.body);

      // Obtener el rental actualizado con su relación
      const updatedRental = await Rental.findByPk(id, {
        include: [
          { 
            model: User, 
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

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

      const rental = await Rental.findByPk(id);

      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      await rental.destroy();

      res.status(200).json({ message: "Rental deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}