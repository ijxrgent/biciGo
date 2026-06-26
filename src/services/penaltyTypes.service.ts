// src/services/penaltyType.service.ts
import { Op, CreationAttributes } from "@sequelize/core";
import { PenaltyType, PenaltyTypeI } from "../models/business/PenaltyType.js";
import { BaseService } from "./base.service.js";

export class PenaltyTypeService extends BaseService<PenaltyType> {
  constructor() {
    super(PenaltyType);
  }

  // GET ALL (solo activos)
  public async getAllPenaltyTypes(): Promise<PenaltyType[]> {
    return await this.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]]
    });
  }

  // GET ALL (incluyendo inactivos - admin)
  public async getAllPenaltyTypesAdmin(): Promise<PenaltyType[]> {
    return await this.findAll({
      order: [["status", "DESC"], ["name", "ASC"]]
    });
  }

  // GET BY ID
  public async getPenaltyTypeById(id: string | number): Promise<PenaltyType | null> {
    return await this.findById(id);
  }

  // CREATE
  public async createPenaltyType(penaltyTypeData: CreationAttributes<PenaltyType>): Promise<PenaltyType> {
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

    return await this.create(data);
  }

  // UPDATE
  public async updatePenaltyType(
    id: string | number,
    penaltyTypeData: Partial<PenaltyTypeI>
  ): Promise<PenaltyType | null> {
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