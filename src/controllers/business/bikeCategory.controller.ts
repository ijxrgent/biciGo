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

  // Get all categories (incluyendo inactivas - admin)
  public async getAllCategoriesAdmin(req: Request, res: Response) {
    try {
      // ✅ Usar findAll de BaseService
      const categories = await bikeCategoryService.findAll({
        order: [["status", "DESC"], ["name", "ASC"]]
      });
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

  // Get category by ID (admin - incluye inactivas)
  public async getCategoryByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      // ✅ Usar findById de BaseService
      const category = await bikeCategoryService.findById(id);

      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: "Category not found" });
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

      // Validar que el nombre no esté vacío
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
      }

      // Validar longitud mínima
      if (name.trim().length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters" });
      }

      const categoryData = {
        name: name.trim(),
        description: description?.trim(),
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

      // Validar que el nombre no esté vacío si se envía
      if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length === 0)) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }

      // Validar longitud mínima si se envía
      if (name !== undefined && name.trim().length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters" });
      }

      const categoryData = {
        name: name?.trim(),
        description: description?.trim(),
        status,
      };

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

  // Delete category (físico) - ✅ Usar delete de BaseService
  public async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // Verificar si la categoría tiene bicicletas asociadas
      const hasBikes = await bikeCategoryService.categoryHasBikes(id);
      if (hasBikes) {
        return res.status(400).json({ 
          error: "Cannot delete category with associated bikes. Please reassign or delete the bikes first." 
        });
      }

      const result = await bikeCategoryService.delete(id);

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