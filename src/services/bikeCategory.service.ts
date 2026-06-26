// src/services/bikeCategory.service.ts
import { BikeCategory, BikeCategoryI } from "../models/business/BikeCategory.js";
import { Bike } from "../models/business/Bike.js";
import { Op, CreationAttributes } from "@sequelize/core";
import { BaseService } from "./base.service.js";

export class BikeCategoryService extends BaseService<BikeCategory> {
  constructor() {
    super(BikeCategory);
  }

  // Get all categories (solo activas)
  public async getAllCategories(): Promise<BikeCategory[]> {
    return await this.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    });
  }

  // Get all categories (incluyendo inactivas - admin)
  public async getAllCategoriesAdmin(): Promise<BikeCategory[]> {
    return await this.findAll({
      order: [["status", "DESC"], ["name", "ASC"]],
    });
  }

  // Get category by ID
  public async getCategoryById(id: string | number): Promise<BikeCategory | null> {
    return await this.findOne({
      where: { id, status: "active" },
    });
  }

  // Get category by ID (incluyendo inactivas)
  public async getCategoryByIdAdmin(id: string | number): Promise<BikeCategory | null> {
    return await this.findById(id);
  }

  // Get category by name
  public async getCategoryByName(name: string): Promise<BikeCategory | null> {
    return await BikeCategory.findOne({
      where: { name },
    });
  }

  // Create category
  public async createCategory(categoryData: CreationAttributes<BikeCategory>): Promise<BikeCategory> {
    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await this.getCategoryByName(categoryData.name);
    if (existingCategory) {
      throw new Error("Category name already exists");
    }

    const data = {
      ...categoryData,
      status: categoryData.status || "active",
    };

    return await this.create(data);
  }

  // Update category
  public async updateCategory(
    id: string | number,
    categoryData: Partial<BikeCategoryI>
  ): Promise<BikeCategory | null> {
    const categoryExist = await BikeCategory.findOne({
      where: { id, status: "active" },
    });

    if (!categoryExist) {
      return null;
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (categoryData.name && categoryData.name !== categoryExist.name) {
      const existingCategory = await BikeCategory.findOne({
        where: { 
          name: categoryData.name,
          id: { [Op.ne]: id }
        },
      });

      if (existingCategory) {
        throw new Error("Category name already exists");
      }
    }

    await categoryExist.update(categoryData);
    return categoryExist;
  }

  // Delete category lógico (status → inactive)
  public async deleteCategoryAdv(id: string | number): Promise<boolean> {
    const categoryToUpdate = await BikeCategory.findOne({
      where: { id, status: "active" },
    });

    if (!categoryToUpdate) {
      return false;
    }

    await categoryToUpdate.update({ status: "inactive" });
    return true;
  }

  // Reactivate category (status → active)
  public async reactivateCategory(id: string | number): Promise<boolean> {
    const categoryToUpdate = await BikeCategory.findOne({
      where: { id, status: "inactive" },
    });

    if (!categoryToUpdate) {
      return false;
    }

    await categoryToUpdate.update({ status: "active" });
    return true;
  }

  // Check if category has associated bikes
  public async categoryHasBikes(id: string | number): Promise<boolean> {
    const count = await Bike.count({
      where: { bike_category_id: id },
    });
    return count > 0;
  }

  // Check if category exists by ID
  public async categoryExists(id: string | number): Promise<boolean> {
    const category = await BikeCategory.findByPk(id);
    return category !== null;
  }
}