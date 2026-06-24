// src/controllers/business/rentalDetails.controller.ts
import { Request, Response } from "express";
import { RentalDetails, RentalDetailsI } from "../../models/business/RentalDetails.js";
import { Rental } from "../../models/business/Rental.js";
import { Bike } from "../../models/business/Bike.js";

export class RentalDetailsController {
  // GET ALL
  public async getAllRentalDetails(req: Request, res: Response) {
    try {
      const rentalDetails = await RentalDetails.findAll({
        include: [
          { 
            model: Rental, 
            as: "rental"
          },
          { 
            model: Bike, 
            as: "bike"
          }
        ]
      });

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

      const rentalDetail = await RentalDetails.findByPk(id, {
        include: [
          { 
            model: Rental, 
            as: "rental"
          },
          { 
            model: Bike, 
            as: "bike"
          }
        ]
      });

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

      const rentalDetails = await RentalDetails.findAll({
        where: { rental_id: rentalId },
        include: [
          { 
            model: Bike, 
            as: "bike"
          }
        ]
      });

      res.status(200).json({ rentalDetails });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE
  public async createRentalDetails(req: Request, res: Response) {
    try {
      const body: RentalDetailsI = req.body;

      // Validar que el rental existe
      const rentalExists = await Rental.findByPk(body.rental_id);
      if (!rentalExists) {
        return res.status(400).json({ error: "Rental not found" });
      }

      // Validar que la bike existe
      const bikeExists = await Bike.findByPk(body.bike_id);
      if (!bikeExists) {
        return res.status(400).json({ error: "Bike not found" });
      }

      // Calcular subtotal si no viene en el body
      if (!body.subtotal) {
        body.subtotal = body.quantity * body.unit_price;
      }

      const rentalDetail = await RentalDetails.create({ ...body });

      // Obtener el detalle creado con sus relaciones
      const createdRentalDetail = await RentalDetails.findByPk(rentalDetail.id, {
        include: [
          { 
            model: Rental, 
            as: "rental"
          },
          { 
            model: Bike, 
            as: "bike"
          }
        ]
      });

      res.status(201).json(createdRentalDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateRentalDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rentalDetail = await RentalDetails.findByPk(id);

      if (!rentalDetail) {
        return res.status(404).json({ error: "Rental detail not found" });
      }

      // Si se actualiza quantity o unit_price, recalcular subtotal
      const { quantity, unit_price } = req.body;
      if (quantity !== undefined || unit_price !== undefined) {
        const newQuantity = quantity || rentalDetail.quantity;
        const newUnitPrice = unit_price || rentalDetail.unit_price;
        req.body.subtotal = newQuantity * newUnitPrice;
      }

      await rentalDetail.update(req.body);

      // Obtener el detalle actualizado con sus relaciones
      const updatedRentalDetail = await RentalDetails.findByPk(id, {
        include: [
          { 
            model: Rental, 
            as: "rental"
          },
          { 
            model: Bike, 
            as: "bike"
          }
        ]
      });

      res.status(200).json(updatedRentalDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE
  public async deleteRentalDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rentalDetail = await RentalDetails.findByPk(id);

      if (!rentalDetail) {
        return res.status(404).json({ error: "Rental detail not found" });
      }

      await rentalDetail.destroy();

      res.status(200).json({ message: "Rental detail deleted successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}