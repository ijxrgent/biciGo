// src/controllers/business/brand.controller.ts
import { Request, Response } from "express";
import { Brand, BrandI } from "../../models/business/Brand.js";

export class BrandController {
  // Get all brands (solo activos)
  public async getAllBrands(req: Request, res: Response) {
    try {
      const brands: BrandI[] = await Brand.findAll({
        where: { status: "active" },
        order: [["name", "ASC"]],
      });
      res.status(200).json({ brands });
    } catch (error) {
      res.status(500).json({ error: "Error fetching brands" });
    }
  }

  // Get brand by ID
  public async getBrandById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const brand = await Brand.findOne({
        where: { id: pk, status: "active" },
      });

      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(404).json({ error: "Brand not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching brand" });
    }
  }

  // Create brand
  public async createBrand(req: Request, res: Response) {
    const { name, description, status } = req.body;

    try {
      let body: BrandI = {
        name,
        description,
        status: status || "active",
      };

      const newBrand = await Brand.create({ ...body });
      res.status(201).json(newBrand);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update brand
  public async updateBrand(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { name, description, status } = req.body;

    try {
      let body: BrandI = {
        name,
        description,
        status,
      };

      const brandExist = await Brand.findOne({
        where: { id: pk, status: "active" },
      });

      if (brandExist) {
        await brandExist.update(body);
        res.status(200).json(brandExist);
      } else {
        res.status(404).json({ error: "Brand not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete brand (físico)
  public async deleteBrand(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const brandToDelete = await Brand.findByPk(id);

      if (brandToDelete) {
        await brandToDelete.destroy();
        res.status(200).json({ message: "Brand deleted successfully" });
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting brand" });
    }
  }

  // Delete brand lógico (status → inactive)
  public async deleteBrandAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const brandToUpdate = await Brand.findOne({
        where: { id: pk, status: "active" },
      });

      if (brandToUpdate) {
        await brandToUpdate.update({ status: "inactive" });
        res.status(200).json({ message: "Brand marked as inactive" });
      } else {
        res.status(404).json({ error: "Brand not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error updating brand status" });
    }
  }
}