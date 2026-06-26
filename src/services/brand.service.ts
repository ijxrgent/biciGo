// src/services/brand.service.ts
import { Brand, BrandI } from "../models/business/Brand.js";
import { Bike } from "../models/index.js";

export class BrandService {
  // Get all brands (solo activos)
  public async getAllBrands(): Promise<BrandI[]> {
    return await Brand.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    });
  }

  // Get all brands (incluyendo inactivos - admin)
  public async getAllBrandsAdmin(): Promise<BrandI[]> {
    return await Brand.findAll({
      order: [["status", "DESC"], ["name", "ASC"]],
    });
  }

  // Get brand by ID
  public async getBrandById(id: string | number): Promise<BrandI | null> {
    return await Brand.findOne({
      where: { id, status: "active" },
    });
  }

  // Get brand by ID (incluyendo inactivos)
  public async getBrandByIdAdmin(id: string | number): Promise<BrandI | null> {
    return await Brand.findByPk(id);
  }

  // Create brand
  public async createBrand(brandData: Partial<BrandI>): Promise<BrandI> {
    const data = {
      ...brandData,
      status: brandData.status || "active",
    };
    return await Brand.create({ ...data });
  }

  public async brandHasBikes(id: string | number): Promise<boolean> {
    const count = await Bike.count({
      where: { brand_id: id },
    });
    return count > 0;
  }

  // Update brand
  public async updateBrand(
    id: string | number,
    brandData: Partial<BrandI>
  ): Promise<BrandI | null> {
    const brandExist = await Brand.findOne({
      where: { id, status: "active" },
    });

    if (!brandExist) {
      return null;
    }

    await brandExist.update(brandData);
    return brandExist;
  }

  // Delete brand (físico)
  public async deleteBrand(id: string | number): Promise<boolean> {
    const brandToDelete = await Brand.findByPk(id);

    if (!brandToDelete) {
      return false;
    }

    await brandToDelete.destroy();
    return true;
  }

  // Delete brand lógico (status → inactive)
  public async deleteBrandAdv(id: string | number): Promise<boolean> {
    const brandToUpdate = await Brand.findOne({
      where: { id, status: "active" },
    });

    if (!brandToUpdate) {
      return false;
    }

    await brandToUpdate.update({ status: "inactive" });
    return true;
  }

  // Reactivate brand (status → active)
  public async reactivateBrand(id: string | number): Promise<boolean> {
    const brandToUpdate = await Brand.findOne({
      where: { id, status: "inactive" },
    });

    if (!brandToUpdate) {
      return false;
    }

    await brandToUpdate.update({ status: "active" });
    return true;
  }

  // Check if brand exists by ID
  public async brandExists(id: string | number): Promise<boolean> {
    const brand = await Brand.findByPk(id);
    return brand !== null;
  }
}