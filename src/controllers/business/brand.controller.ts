// src/controllers/business/brand.controller.ts
import { Request, Response } from "express";
import { BrandService } from "../../services/brand.service.js";

const brandService = new BrandService();

export class BrandController {
  // Get all brands (solo activos)
  public async getAllBrands(req: Request, res: Response) {
    try {
      const brands = await brandService.getAllBrands();
      res.status(200).json({ brands });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching brands" });
    }
  }

  // Get all brands (incluyendo inactivos - admin)
  public async getAllBrandsAdmin(req: Request, res: Response) {
    try {
      const brands = await brandService.getAllBrandsAdmin();
      res.status(200).json({ brands });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching brands" });
    }
  }

  // Get brand by ID
  public async getBrandById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const brand = await brandService.getBrandById(id);

      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(404).json({ error: "Brand not found or inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching brand" });
    }
  }

  // Get brand by ID (admin - incluye inactivos)
  public async getBrandByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const brand = await brandService.getBrandByIdAdmin(id);

      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching brand" });
    }
  }

  // Create brand
  public async createBrand(req: Request, res: Response) {
    try {
      const { name, description, status } = req.body;

      // Validar que el nombre no esté vacío
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
      }

      const brandData = {
        name: name.trim(),
        description: description?.trim(),
        status: status || "active",
      };

      const newBrand = await brandService.createBrand(brandData);
      res.status(201).json(newBrand);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update brand
  public async updateBrand(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const { name, description, status } = req.body;

      // Validar que el nombre no esté vacío si se envía
      if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length === 0)) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }

      const brandData = {
        name: name?.trim(),
        description: description?.trim(),
        status,
      };

      const updatedBrand = await brandService.updateBrand(id, brandData);

      if (updatedBrand) {
        res.status(200).json(updatedBrand);
      } else {
        res.status(404).json({ error: "Brand not found or inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete brand (físico)
  public async deleteBrand(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // Verificar si la marca tiene bicicletas asociadas
      const hasBikes = await brandService.brandHasBikes(id);
      if (hasBikes) {
        return res.status(400).json({ 
          error: "Cannot delete brand with associated bikes" 
        });
      }

      const result = await brandService.deleteBrand(id);

      if (result) {
        res.status(200).json({ message: "Brand deleted successfully" });
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting brand" });
    }
  }

  // Delete brand lógico (status → inactive)
  public async deleteBrandAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await brandService.deleteBrandAdv(id);

      if (result) {
        res.status(200).json({ message: "Brand marked as inactive" });
      } else {
        res.status(404).json({ error: "Brand not found or already inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating brand status" });
    }
  }

  // Reactivate brand (status → active)
  public async reactivateBrand(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await brandService.reactivateBrand(id);

      if (result) {
        res.status(200).json({ message: "Brand reactivated successfully" });
      } else {
        res.status(404).json({ error: "Brand not found or already active" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reactivating brand" });
    }
  }
}