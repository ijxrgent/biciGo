// src/controllers/business/bikeCategory.controller.ts
import { Request, Response } from "express";
import { BikeCategory, BikeCategoryI } from "../../models/business/BikeCategory.js";

export class BikeCategoryController {
  // Get all categories (solo activas)
  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories: BikeCategoryI[] = await BikeCategory.findAll({
        where: { status: "active" },
        order: [["name", "ASC"]],
      });
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  }

  // Get category by ID
  public async getCategoryById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const category = await BikeCategory.findOne({
        where: { id: pk, status: "active" },
      });

      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: "Category not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching category" });
    }
  }

  // Create category
  public async createCategory(req: Request, res: Response) {
    const { name, description, status } = req.body;

    try {
      let body: BikeCategoryI = {
        name,
        description,
        status: status || "active",
      };

      const newCategory = await BikeCategory.create({ ...body });
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update category
  public async updateCategory(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { name, description, status } = req.body;

    try {
      let body: BikeCategoryI = {
        name,
        description,
        status,
      };

      const categoryExist = await BikeCategory.findOne({
        where: { id: pk, status: "active" },
      });

      if (categoryExist) {
        await categoryExist.update(body);
        res.status(200).json(categoryExist);
      } else {
        res.status(404).json({ error: "Category not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete category (físico)
  public async deleteCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const categoryToDelete = await BikeCategory.findByPk(id);

      if (categoryToDelete) {
        await categoryToDelete.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting category" });
    }
  }

  // Delete category lógico (status → inactive)
  public async deleteCategoryAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const categoryToUpdate = await BikeCategory.findOne({
        where: { id: pk, status: "active" },
      });

      if (categoryToUpdate) {
        await categoryToUpdate.update({ status: "inactive" });
        res.status(200).json({ message: "Category marked as inactive" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error updating category status" });
    }
  }
}