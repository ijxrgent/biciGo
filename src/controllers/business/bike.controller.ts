// src/controllers/business/bike.controller.ts
import { Request, Response } from "express";
import { BikeService } from "../../services/bike.service.js";
// ✅ Importar los modelos necesarios
import { Brand } from "../../models/business/Brand.js";
import { BikeCategory } from "../../models/business/BikeCategory.js";

const bikeService = new BikeService();

export class BikeController {
  // Get all bikes (solo disponibles)
  public async getAllBikes(req: Request, res: Response) {
    try {
      const bikes = await bikeService.getAllBikes();
      res.status(200).json({ bikes });
    } catch (error) {
      console.error("Error fetching bikes:", error);
      res.status(500).json({ error: "Error fetching bikes" });
    }
  }

  // Get all bikes (admin - incluye todas)
  public async getAllBikesAdmin(req: Request, res: Response) {
    try {
      // ✅ Usar findAll de BaseService con includes
      const bikes = await bikeService.findAll({
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
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const bike = await bikeService.getBikeById(id);

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

  // Get bike by ID (admin - incluye todas)
  public async getBikeByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // ✅ Usar findById de BaseService
      const bike = await bikeService.findById(id);

      if (bike) {
        res.status(200).json(bike);
      } else {
        res.status(404).json({ error: "Bike not found" });
      }
    } catch (error) {
      console.error("Error fetching bike:", error);
      res.status(500).json({ error: "Error fetching bike" });
    }
  }

  // Create bike
  public async createBike(req: Request, res: Response) {
    try {
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

      const bikeData = {
        serial_number,
        model,
        imageURL,
        description,
        price,
        status: status || "available",
        brand_id,
        bike_category_id,
      };

      const newBike = await bikeService.createBike(bikeData);
      res.status(201).json(newBike);
    } catch (error: any) {
      console.error("Error creating bike:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update bike
  public async updateBike(req: Request, res: Response) {
    try {
      const { id } = req.params;
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

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const bikeData = {
        serial_number,
        model,
        imageURL,
        description,
        price,
        status,
        brand_id,
        bike_category_id,
      };

      const updatedBike = await bikeService.updateBike(id, bikeData);

      if (updatedBike) {
        res.status(200).json(updatedBike);
      } else {
        res.status(404).json({ error: "Bike not found or unavailable" });
      }
    } catch (error: any) {
      console.error("Error updating bike:", error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete bike (físico) - ✅ Usar delete de BaseService
  public async deleteBike(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeService.delete(id);

      if (result) {
        res.status(200).json({ message: "Bike deleted successfully" });
      } else {
        res.status(404).json({ error: "Bike not found" });
      }
    } catch (error) {
      console.error("Error deleting bike:", error);
      res.status(500).json({ error: "Error deleting bike" });
    }
  }

  // Set bike as unavailable
  public async setBikeUnavailable(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeService.setBikeUnavailable(id);

      if (result) {
        res.status(200).json({ message: "Bike marked as unavailable" });
      } else {
        res.status(404).json({ error: "Bike not found or already unavailable" });
      }
    } catch (error) {
      console.error("Error updating bike status:", error);
      res.status(500).json({ error: "Error updating bike status" });
    }
  }

  // Reactivate bike
  public async reactivateBike(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await bikeService.reactivateBike(id);

      if (result) {
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

      if (!brandId || typeof brandId !== 'string') {
        return res.status(400).json({ error: "Invalid brand ID format" });
      }

      const result = await bikeService.getBikesByBrand(brandId);

      if (!result.brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      res.status(200).json({ 
        brand: result.brand.name,
        bikes: result.bikes 
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

      if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json({ error: "Invalid category ID format" });
      }

      const result = await bikeService.getBikesByCategory(categoryId);

      if (!result.category) {
        return res.status(404).json({ error: "Bike category not found" });
      }

      res.status(200).json({ 
        category: result.category.name,
        bikes: result.bikes 
      });
    } catch (error) {
      console.error("Error fetching bikes by category:", error);
      res.status(500).json({ error: "Error fetching bikes by category" });
    }
  }

  // Search bikes
  public async searchBikes(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const bikes = await bikeService.searchBikes(query);
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

      const min = Number(minPrice);
      const max = Number(maxPrice);

      if (isNaN(min) || isNaN(max)) {
        return res.status(400).json({ 
          error: "minPrice and maxPrice must be valid numbers" 
        });
      }

      const bikes = await bikeService.getBikesByPriceRange(min, max);
      
      res.status(200).json({ 
        range: { min, max },
        bikes 
      });
    } catch (error) {
      console.error("Error fetching bikes by price range:", error);
      res.status(500).json({ error: "Error fetching bikes by price range" });
    }
  }
}