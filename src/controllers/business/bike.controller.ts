 // src/controllers/business/bike.controller.ts
import { Request, Response } from "express";
import { Bike, BikeI } from "../../models/business/Bike.js";
import { Brand } from "../../models/business/Brand.js";
import { BikeCategory } from "../../models/business/BikeCategory.js";
import { Op } from "@sequelize/core";

export class BikeController {
  // Get all bikes (solo activas)
  public async getAllBikes(req: Request, res: Response) {
    try {
      const bikes = await Bike.findAll({
        where: { status: "available" },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["model", "ASC"]],
      });
      res.status(200).json({ bikes });
    } catch (error) {
      console.error("Error fetching bikes:", error);
      res.status(500).json({ error: "Error fetching bikes" });
    }
  }

  // Get all bikes (incluyendo inactivas - para admin)
  public async getAllBikesAdmin(req: Request, res: Response) {
    try {
      const bikes = await Bike.findAll({
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["status", "ASC"], ["model", "ASC"]],
      });
      res.status(200).json({ bikes });
    } catch (error) {
      console.error("Error fetching all bikes:", error);
      res.status(500).json({ error: "Error fetching bikes" });
    }
  }

  // Get bike by ID
  public async getBikeById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const bike = await Bike.findOne({
        where: { id: pk, status: "available" },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
      });

      if (bike) {
        res.status(200).json(bike);
      } else {
        res.status(404).json({ error: "Bike not found or not available" });
      }
    } catch (error) {
      console.error("Error fetching bike:", error);
      res.status(500).json({ error: "Error fetching bike" });
    }
  }

  // Create bike
  public async createBike(req: Request, res: Response) {
    const {
      serial_number,
      model,
      imageURL,
      description,
      price,
      status,
      brand_id,
      bike_category_id,
    } = req.body;

    try {
      // Verificar que el serial number no exista
      const existingBike = await Bike.findOne({
        where: { serial_number }
      });
      
      if (existingBike) {
        return res.status(400).json({ 
          error: "A bike with this serial number already exists" 
        });
      }

      // Verificar que la marca existe
      const brandExists = await Brand.findByPk(brand_id);
      if (!brandExists) {
        return res.status(400).json({ error: "Brand not found" });
      }

      // Verificar que la categoría existe
      const categoryExists = await BikeCategory.findByPk(bike_category_id);
      if (!categoryExists) {
        return res.status(400).json({ error: "Bike category not found" });
      }

      let body: BikeI = {
        serial_number,
        model,
        imageURL,
        description,
        price,
        status: status || "available",
        brand_id,
        bike_category_id,
      };

      const newBike = await Bike.create({ ...body });
      
      // Obtener la bicicleta con sus relaciones
      const createdBike = await Bike.findByPk(newBike.id, {
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json(createdBike);
    } catch (error: any) {
      console.error("Error creating bike:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update bike
  public async updateBike(req: Request, res: Response) {
    const { id: pk } = req.params;
    const {
      serial_number,
      model,
      imageURL,
      description,
      price,
      status,
      brand_id,
      bike_category_id,
    } = req.body;

    try {
      const bikeExist = await Bike.findOne({
        where: { id: pk, status: "available" },
      });

      if (!bikeExist) {
        return res.status(404).json({ error: "Bike not found or unavailable" });
      }

      // Verificar que el serial number no esté en uso por otra bicicleta
      if (serial_number) {
        const existingBike = await Bike.findOne({
          where: { 
            serial_number,
            id: { [Op.ne]: pk }
          }
        });
        
        if (existingBike) {
          return res.status(400).json({ 
            error: "A bike with this serial number already exists" 
          });
        }
      }

      // Verificar que la marca existe si se está actualizando
      if (brand_id) {
        const brandExists = await Brand.findByPk(brand_id);
        if (!brandExists) {
          return res.status(400).json({ error: "Brand not found" });
        }
      }

      // Verificar que la categoría existe si se está actualizando
      if (bike_category_id) {
        const categoryExists = await BikeCategory.findByPk(bike_category_id);
        if (!categoryExists) {
          return res.status(400).json({ error: "Bike category not found" });
        }
      }

      let body: Partial<BikeI> = {
        serial_number,
        model,
        imageURL,
        description,
        price,
        status,
        brand_id,
        bike_category_id,
      };

      await bikeExist.update(body);
      
      // Obtener la bicicleta actualizada con sus relaciones
      const updatedBike = await Bike.findByPk(pk, {
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json(updatedBike);
    } catch (error: any) {
      console.error("Error updating bike:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete bike (físico)
  public async deleteBike(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const bikeToDelete = await Bike.findByPk(id);

      if (bikeToDelete) {
        await bikeToDelete.destroy();
        res.status(200).json({ message: "Bike deleted successfully" });
      } else {
        res.status(404).json({ error: "Bike not found" });
      }
    } catch (error) {
      console.error("Error deleting bike:", error);
      res.status(500).json({ error: "Error deleting bike" });
    }
  }

  // Delete bike lógico (status → inactive)
  public async setBikeUnavailable(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const bikeToUpdate = await Bike.findOne({
        where: { id: pk, status: "available" },
      });

      if (bikeToUpdate) {
        await bikeToUpdate.update({ status: "unavailable" });
        res.status(200).json({ message: "Bike marked as unavailable" });
      } else {
        res.status(404).json({ error: "Bike not found or already unavailable" });
      }
    } catch (error) {
      console.error("Error updating bike status:", error);
      res.status(500).json({ error: "Error updating bike status" });
    }
  }

  // Reactivate bike (status → active)
  public async reactivateBike(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const bikeToUpdate = await Bike.findOne({
        where: { id: pk, status: "unavailable" },
      });

      if (bikeToUpdate) {
        await bikeToUpdate.update({ status: "available" });
        res.status(200).json({ message: "Bike reactivated successfully" });
      } else {
        res.status(404).json({ error: "Bike not found or already available" });
      }
    } catch (error) {
      console.error("Error reactivating bike:", error);
      res.status(500).json({ error: "Error reactivating bike" });
    }
  }

  // Get bikes by brand
  public async getBikesByBrand(req: Request, res: Response) {
    try {
      const { brandId } = req.params;
      
      // Verificar que la marca existe
      const brandExists = await Brand.findByPk(brandId);
      if (!brandExists) {
        return res.status(404).json({ error: "Brand not found" });
      }

      const bikes = await Bike.findAll({
        where: { 
          brand_id: brandId, 
          status: "available" 
        },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["model", "ASC"]],
      });
      
      res.status(200).json({ 
        brand: brandExists.name,
        bikes 
      });
    } catch (error) {
      console.error("Error fetching bikes by brand:", error);
      res.status(500).json({ error: "Error fetching bikes by brand" });
    }
  }

  // Get bikes by category
  public async getBikesByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      
      // Verificar que la categoría existe
      const categoryExists = await BikeCategory.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ error: "Bike category not found" });
      }

      const bikes = await Bike.findAll({
        where: { 
          bike_category_id: categoryId, 
          status: "available" 
        },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["model", "ASC"]],
      });
      
      res.status(200).json({ 
        category: categoryExists.name,
        bikes 
      });
    } catch (error) {
      console.error("Error fetching bikes by category:", error);
      res.status(500).json({ error: "Error fetching bikes by category" });
    }
  }

  // Search bikes by model or serial number
  public async searchBikes(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const bikes = await Bike.findAll({
        where: {
          status: "available",
          [Op.or]: [
            { model: { [Op.like]: `%${query}%` } },
            { serial_number: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["model", "ASC"]],
      });
      
      res.status(200).json({ bikes });
    } catch (error) {
      console.error("Error searching bikes:", error);
      res.status(500).json({ error: "Error searching bikes" });
    }
  }

  // Get bikes by price range
  public async getBikesByPriceRange(req: Request, res: Response) {
    try {
      const { minPrice, maxPrice } = req.query;
      
      if (!minPrice || !maxPrice) {
        return res.status(400).json({ 
          error: "Both minPrice and maxPrice are required" 
        });
      }

      const bikes = await Bike.findAll({
        where: {
          status: "available",
          price: {
            [Op.between]: [Number(minPrice), Number(maxPrice)]
          }
        },
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: BikeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["price", "ASC"]],
      });
      
      res.status(200).json({ 
        range: {
          min: Number(minPrice),
          max: Number(maxPrice)
        },
        bikes 
      });
    } catch (error) {
      console.error("Error fetching bikes by price range:", error);
      res.status(500).json({ error: "Error fetching bikes by price range" });
    }
  }
}