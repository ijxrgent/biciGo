// src/controllers/business/penalty.controller.ts
import { Request, Response } from "express";
import { Penalty, PenaltyI } from "../../models/business/Penalty.js";
import { Rental } from "../../models/business/Rental.js";
import { PenaltyType } from "../../models/business/PenaltyType.js";

export class PenaltyController {
  // GET ALL (solo pendientes)
  public async getAllPenalties(req: Request, res: Response) {
    try {
      const penalties = await Penalty.findAll({
        where: { status: "pending" },
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ],
        order: [["penalty_date", "DESC"]]
      });

      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties" });
    }
  }

  // GET ALL (incluyendo pagados y exonerados - admin)
  public async getAllPenaltiesAdmin(req: Request, res: Response) {
    try {
      const penalties = await Penalty.findAll({
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ],
        order: [["status", "ASC"], ["penalty_date", "DESC"]]
      });

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

      const penalty = await Penalty.findByPk(id, {
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ]
      });

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

      const penalties = await Penalty.findAll({
        where: { rental_id: rentalId },
        include: [
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ],
        order: [["penalty_date", "DESC"]]
      });

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

      const penalties = await Penalty.findAll({
        where: { penalty_type_id: penaltyTypeId },
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ],
        order: [["penalty_date", "DESC"]]
      });

      res.status(200).json({ penalties });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching penalties by penalty type" });
    }
  }

  // CREATE
  public async createPenalty(req: Request, res: Response) {
    try {
      const {
        rental_id,
        penalty_type_id,
        amount,
        status,
        penalty_date,
        paid_date,
        notes,
      } = req.body;

      // Validar que el rental existe
      const rentalExists = await Rental.findByPk(rental_id);
      if (!rentalExists) {
        return res.status(400).json({ error: "Rental not found" });
      }

      // Validar que el penalty type existe
      const penaltyTypeExists = await PenaltyType.findByPk(penalty_type_id);
      if (!penaltyTypeExists) {
        return res.status(400).json({ error: "Penalty type not found" });
      }

      let body: PenaltyI = {
        rental_id,
        penalty_type_id,
        amount,
        status: status || "pending",
        penalty_date: penalty_date || new Date(),
        paid_date,
        notes,
      };

      const newPenalty = await Penalty.create({ ...body });

      // Obtener la penalización creada con sus relaciones
      const createdPenalty = await Penalty.findByPk(newPenalty.id, {
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ]
      });

      res.status(201).json(createdPenalty);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updatePenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const penalty = await Penalty.findByPk(id);

      if (!penalty) {
        return res.status(404).json({ error: "Penalty not found" });
      }

      const {
        rental_id,
        penalty_type_id,
        amount,
        status,
        penalty_date,
        paid_date,
        notes,
      } = req.body;

      // Si se actualiza el rental, validar que existe
      if (rental_id && rental_id !== penalty.rental_id) {
        const rentalExists = await Rental.findByPk(rental_id);
        if (!rentalExists) {
          return res.status(400).json({ error: "Rental not found" });
        }
      }

      // Si se actualiza el penalty type, validar que existe
      if (penalty_type_id && penalty_type_id !== penalty.penalty_type_id) {
        const penaltyTypeExists = await PenaltyType.findByPk(penalty_type_id);
        if (!penaltyTypeExists) {
          return res.status(400).json({ error: "Penalty type not found" });
        }
      }

      await penalty.update({
        rental_id,
        penalty_type_id,
        amount,
        status,
        penalty_date,
        paid_date,
        notes,
      });

      // Obtener la penalización actualizada con sus relaciones
      const updatedPenalty = await Penalty.findByPk(id, {
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ]
      });

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

      const penalty = await Penalty.findByPk(id);

      if (!penalty) {
        return res.status(404).json({ error: "Penalty not found" });
      }

      // No permitir eliminar penalizaciones pagadas
      if (penalty.status === "paid") {
        return res.status(400).json({ 
          error: "Cannot delete a paid penalty" 
        });
      }

      await penalty.destroy();

      res.status(200).json({ message: "Penalty deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting penalty" });
    }
  }

  // PAGAR PENALIZACIÓN (status → paid)
  public async payPenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paid_date } = req.body;

      const penalty = await Penalty.findOne({
        where: { id, status: "pending" }
      });

      if (!penalty) {
        return res.status(404).json({ 
          error: "Penalty not found or already paid/waived" 
        });
      }

      await penalty.update({
        status: "paid",
        paid_date: paid_date || new Date()
      });

      const updatedPenalty = await Penalty.findByPk(id, {
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ]
      });

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

      const penalty = await Penalty.findOne({
        where: { id, status: "pending" }
      });

      if (!penalty) {
        return res.status(404).json({ 
          error: "Penalty not found or already paid/waived" 
        });
      }

      await penalty.update({
        status: "waived",
        paid_date: null // Asegurar que no tenga fecha de pago
      });

      const updatedPenalty = await Penalty.findByPk(id, {
        include: [
          {
            model: Rental,
            as: "rental",
            attributes: ["id", "user_id", "pickup_datetime", "expected_return_datetime"]
          },
          {
            model: PenaltyType,
            as: "penaltyType",
            attributes: ["id", "name", "penalty_mode"]
          }
        ]
      });

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