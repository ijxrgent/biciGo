// src/services/rate.service.ts
import { CreationAttributes } from "@sequelize/core";
import { Rate, RateI } from "../models/business/Rate.js";
import { BaseService } from "./base.service.js";

export class RateService extends BaseService<Rate> {
  constructor() {
    super(Rate);
  }

  // Get all rates (solo activos)
  public async getAllRates(): Promise<Rate[]> {
    return await this.findAll({
      where: { status: "active" },
    });
  }

  // Get all rates (admin - incluye inactivos)
  public async getAllRatesAdmin(): Promise<Rate[]> {
    return await this.findAll();
  }

  // Get rate by ID
  public async getRateById(id: string | number): Promise<Rate | null> {
    return await this.findOne({
      where: { id, status: "active" },
    });
  }

  // Get rate by ID (admin - incluye inactivos)
  public async getRateByIdAdmin(id: string | number): Promise<Rate | null> {
    return await this.findById(id);
  }

  // Create rate
  public async createRate(rateData: CreationAttributes<Rate>): Promise<Rate> {
    const data = {
      ...rateData,
      status: rateData.status || "active",
    };
    return await this.create(data);
  }

  // Update rate
  public async updateRate(
    id: string | number,
    rateData: Partial<RateI>
  ): Promise<Rate | null> {
    const rateExist = await Rate.findOne({
      where: { id, status: "active" },
    });

    if (!rateExist) {
      return null;
    }

    await rateExist.update(rateData);
    return rateExist;
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