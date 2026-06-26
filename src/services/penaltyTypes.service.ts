// src/services/penaltyType.service.ts
import { PenaltyType, PenaltyTypeI } from "../models/business/PenaltyType.js";
import { Op } from "@sequelize/core";

export class PenaltyTypeService {
  // GET ALL (solo activos)
  public async getAllPenaltyTypes(): Promise<PenaltyTypeI[]> {
    return await PenaltyType.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]]
    });
  }

  // GET ALL (incluyendo inactivos - admin)
  public async getAllPenaltyTypesAdmin(): Promise<PenaltyTypeI[]> {
    return await PenaltyType.findAll({
      order: [["status", "DESC"], ["name", "ASC"]]
    });
  }

  // GET BY ID
  public async getPenaltyTypeById(id: string | number): Promise<PenaltyTypeI | null> {
    return await PenaltyType.findByPk(id);
  }

  // CREATE
  public async createPenaltyType(penaltyTypeData: Partial<PenaltyTypeI>): Promise<PenaltyTypeI> {
    // Verificar si ya existe un tipo con ese nombre
    const existingType = await PenaltyType.findOne({
      where: { name: penaltyTypeData.name }
    });

    if (existingType) {
      throw new Error("Penalty type with this name already exists");
    }

    const data = {
      ...penaltyTypeData,
      penalty_mode: penaltyTypeData.penalty_mode || "fixed",
      status: penaltyTypeData.status || "active",
    };

    return await PenaltyType.create({ ...data });
  }

  // UPDATE
  public async updatePenaltyType(
    id: string | number,
    penaltyTypeData: Partial<PenaltyTypeI>
  ): Promise<PenaltyTypeI | null> {
    const penaltyType = await PenaltyType.findByPk(id);

    if (!penaltyType) {
      return null;
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (penaltyTypeData.name && penaltyTypeData.name !== penaltyType.name) {
      const existingType = await PenaltyType.findOne({
        where: { 
          name: penaltyTypeData.name,
          id: { [Op.ne]: id }
        }
      });

      if (existingType) {
        throw new Error("Penalty type with this name already exists");
      }
    }

    await penaltyType.update(penaltyTypeData);
    return penaltyType;
  }

  // DELETE FÍSICO
  public async deletePenaltyType(id: string | number): Promise<boolean> {
    const penaltyType = await PenaltyType.findByPk(id);

    if (!penaltyType) {
      return false;
    }

    await penaltyType.destroy();
    return true;
  }

  // DELETE LÓGICO (status → inactive)
  public async deletePenaltyTypeAdv(id: string | number): Promise<boolean> {
    const penaltyType = await PenaltyType.findOne({
      where: { id, status: "active" }
    });

    if (!penaltyType) {
      return false;
    }

    await penaltyType.update({ status: "inactive" });
    return true;
  }

  // REACTIVAR (status → active)
  public async reactivatePenaltyType(id: string | number): Promise<boolean> {
    const penaltyType = await PenaltyType.findOne({
      where: { id, status: "inactive" }
    });

    if (!penaltyType) {
      return false;
    }

    await penaltyType.update({ status: "active" });
    return true;
  }
}