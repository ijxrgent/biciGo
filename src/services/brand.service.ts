// src/services/brand.service.ts
import { Brand } from "../models/business/Brand.js";
import { Bike } from "../models/index.js";
import { BaseService } from "./base.service.js";
import { CreationAttributes } from "@sequelize/core";
import { Op } from "@sequelize/core";

export class BrandService extends BaseService<Brand> {
  constructor() {
    super(Brand);
  }

  public async getAllBrands(): Promise<Brand[]> {
    return await this.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    });
  }

  public async getBrandById(id: string | number): Promise<Brand | null> {
    return await this.findById(id);
  }

   public async brandHasBikes(id: string | number): Promise<boolean> {
    const count = await Bike.count({
      where: { brand_id: id }
    });
    return count > 0;
  }

  // ✅ create recibe CreationAttributes<Brand>
  public async createBrand(brandData: CreationAttributes<Brand>): Promise<Brand> {
    const data = {
      ...brandData,
      status: brandData.status || "active",
    };
    return await this.create(data);
  }

  public async updateBrand(id: string | number, brandData: Partial<Brand>): Promise<Brand | null> {
    // Validación de nombre único
    if (brandData.name) {
      const existingBrand = await Brand.findOne({
        where: { 
          name: brandData.name,
          id: { [Op.ne]: id }
        }
      });
      if (existingBrand) {
        throw new Error("Brand name already exists");
      }
    }
    return await this.update(id, brandData);
  }

  public async deleteBrandAdv(id: string | number): Promise<boolean> {
    const brand = await Brand.findOne({
      where: { id, status: "active" }
    });
    if (!brand) return false;
    await brand.update({ status: "inactive" });
    return true;
  }

  public async reactivateBrand(id: string | number): Promise<boolean> {
    const brand = await Brand.findOne({
      where: { id, status: "inactive" }
    });
    if (!brand) return false;
    await brand.update({ status: "active" });
    return true;
  }
}