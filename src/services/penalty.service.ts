// src/services/penalty.service.ts
import { Penalty, PenaltyI } from "../models/business/Penalty.js";
import { Rental } from "../models/business/Rental.js";
import { PenaltyType } from "../models/business/PenaltyType.js";

export class PenaltyService {
  // GET ALL (solo pendientes)
  public async getAllPenalties(): Promise<Penalty[]> {
    return await Penalty.findAll({
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
  }

  // GET ALL (admin)
  public async getAllPenaltiesAdmin(): Promise<Penalty[]> {
    return await Penalty.findAll({
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
  }

  // GET BY ID
  public async getPenaltyById(id: string | number): Promise<Penalty | null> {
    return await Penalty.findByPk(id, {
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
  }

  // GET BY RENTAL
  public async getPenaltiesByRental(rentalId: string | number): Promise<Penalty[]> {
    return await Penalty.findAll({
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
  }

  // GET BY PENALTY TYPE
  public async getPenaltiesByPenaltyType(penaltyTypeId: string | number): Promise<Penalty[]> {
    return await Penalty.findAll({
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
  }

  // CREATE
  public async createPenalty(penaltyData: Partial<PenaltyI>): Promise<Penalty> {
    // Validar que el rental existe
    if (penaltyData.rental_id) {
      const rentalExists = await Rental.findByPk(penaltyData.rental_id);
      if (!rentalExists) {
        throw new Error("Rental not found");
      }
    }

    // Validar que el penalty type existe
    if (penaltyData.penalty_type_id) {
      const penaltyTypeExists = await PenaltyType.findByPk(penaltyData.penalty_type_id);
      if (!penaltyTypeExists) {
        throw new Error("Penalty type not found");
      }
    }

    const data = {
      ...penaltyData,
      status: penaltyData.status || "pending",
      penalty_date: penaltyData.penalty_date || new Date(),
    };

    const newPenalty = await Penalty.create({ ...data });

    // Retornar la penalización creada con sus relaciones
    return await Penalty.findByPk(newPenalty.id, {
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
    }) as Penalty;
  }

  // UPDATE
  public async updatePenalty(
    id: string | number,
    penaltyData: Partial<PenaltyI>
  ): Promise<Penalty | null> {
    const penalty = await Penalty.findByPk(id);

    if (!penalty) {
      return null;
    }

    // Si se actualiza el rental, validar que existe
    if (penaltyData.rental_id && penaltyData.rental_id !== penalty.rental_id) {
      const rentalExists = await Rental.findByPk(penaltyData.rental_id);
      if (!rentalExists) {
        throw new Error("Rental not found");
      }
    }

    // Si se actualiza el penalty type, validar que existe
    if (penaltyData.penalty_type_id && penaltyData.penalty_type_id !== penalty.penalty_type_id) {
      const penaltyTypeExists = await PenaltyType.findByPk(penaltyData.penalty_type_id);
      if (!penaltyTypeExists) {
        throw new Error("Penalty type not found");
      }
    }

    await penalty.update(penaltyData);

    // Retornar la penalización actualizada con sus relaciones
    return await Penalty.findByPk(id, {
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
    }) as Penalty;
  }

  // DELETE FÍSICO
  public async deletePenalty(id: string | number): Promise<boolean> {
    const penalty = await Penalty.findByPk(id);

    if (!penalty) {
      return false;
    }

    // No permitir eliminar penalizaciones pagadas
    if (penalty.status === "paid") {
      throw new Error("Cannot delete a paid penalty");
    }

    await penalty.destroy();
    return true;
  }

  // PAGAR PENALIZACIÓN (status → paid)
  public async payPenalty(id: string | number, paid_date?: Date): Promise<Penalty | null> {
    const penalty = await Penalty.findOne({
      where: { id, status: "pending" }
    });

    if (!penalty) {
      return null;
    }

    await penalty.update({
      status: "paid",
      paid_date: paid_date || new Date()
    });

    // Retornar la penalización actualizada con sus relaciones
    return await Penalty.findByPk(id, {
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
    }) as Penalty;
  }

  // EXONERAR PENALIZACIÓN (status → waived)
  public async waivePenalty(id: string | number): Promise<Penalty | null> {
    const penalty = await Penalty.findOne({
      where: { id, status: "pending" }
    });

    if (!penalty) {
      return null;
    }

    await penalty.update({
      status: "waived",
      paid_date: null // Asegurar que no tenga fecha de pago
    });

    // Retornar la penalización actualizada con sus relaciones
    return await Penalty.findByPk(id, {
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
    }) as Penalty;
  }
}