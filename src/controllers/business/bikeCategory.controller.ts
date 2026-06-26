// src/controllers/business/bikeCategory.controller.ts
import { Request, Response } from "express";
import { BikeCategoryService } from "../../services/bikeCategory.service.js";

const bikeCategoryService = new BikeCategoryService();

export class BikeCategoryController {
  // Get all categories (solo activas)
  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await bikeCategoryService.getAllCategories();
      res.status(200).json({ categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching categories" });
    }
  }

  // Get category by ID
  public async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const category = await bikeCategoryService.getCategoryById(id);

      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: "Category not found or inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching category" });
    }
  }

  // Create category
  public async createCategory(req: Request, res: Response) {
    try {
      const { name, description, status } = req.body;

      const categoryData = {
        name,
        description,
        status: status || "active",
      };

      const newCategory = await bikeCategoryService.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update category
  public async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const categoryData = { name, description, status };

      const updatedCategory = await bikeCategoryService.updateCategory(id, categoryData);

      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ error: "Category not found or inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete category (físico)
  public async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeCategoryService.deleteCategory(id);

      if (result) {
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting category" });
    }
  }

  // Delete category lógico (status → inactive)
  public async deleteCategoryAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeCategoryService.deleteCategoryAdv(id);

      if (result) {
        res.status(200).json({ message: "Category marked as inactive" });
      } else {
        res.status(404).json({ error: "Category not found or already inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating category status" });
    }
  }

  // Reactivate category (status → active)
  public async reactivateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeCategoryService.reactivateCategory(id);

      if (result) {
        res.status(200).json({ message: "Category reactivated successfully" });
      } else {
        res.status(404).json({ error: "Category not found or already active" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reactivating category" });
    }
  }
}