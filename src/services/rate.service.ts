// src/services/rate.service.ts
import { Rate, RateI } from "../models/business/Rate.js";

export class RateService {
  // Get all rates (solo activos)
  public async getAllRates(): Promise<RateI[]> {
    return await Rate.findAll({
      where: { status: "active" },
    });
  }

  // Get all rates (admin - incluye inactivos)
  public async getAllRatesAdmin(): Promise<RateI[]> {
    return await Rate.findAll();
  }

  // Get rate by ID
  public async getRateById(id: string | number): Promise<RateI | null> {
    return await Rate.findOne({
      where: { id, status: "active" },
    });
  }

  // Get rate by ID (admin - incluye inactivos)
  public async getRateByIdAdmin(id: string | number): Promise<RateI | null> {
    return await Rate.findByPk(id);
  }

  // Create rate
  public async createRate(rateData: Partial<RateI>): Promise<RateI> {
    const data = {
      ...rateData,
      status: rateData.status || "active",
    };
    return await Rate.create({ ...data });
  }

  // Update rate
  public async updateRate(
    id: string | number,
    rateData: Partial<RateI>
  ): Promise<RateI | null> {
    const rateExist = await Rate.findOne({
      where: { id, status: "active" },
    });

    if (!rateExist) {
      return null;
    }

    await rateExist.update(rateData);
    return rateExist;
  }

  // Delete rate (físico)
  public async deleteRate(id: string | number): Promise<boolean> {
    const rateToDelete = await Rate.findByPk(id);

    if (!rateToDelete) {
      return false;
    }

    await rateToDelete.destroy();
    return true;
  }

  // Delete rate lógico (status → inactive)
  public async deleteRateAdv(id: string | number): Promise<boolean> {
    const rateToUpdate = await Rate.findOne({
      where: { id, status: "active" },
    });

    if (!rateToUpdate) {
      return false;
    }

    await rateToUpdate.update({ status: "inactive" });
    return true;
  }

  // Reactivate rate (status → active)
  public async reactivateRate(id: string | number): Promise<boolean> {
    const rateToUpdate = await Rate.findOne({
      where: { id, status: "inactive" },
    });

    if (!rateToUpdate) {
      return false;
    }

    await rateToUpdate.update({ status: "active" });
    return true;
  }
}