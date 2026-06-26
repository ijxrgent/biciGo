// src/services/bike.service.ts
import { Bike, BikeI } from "../models/business/Bike.js";
import { Brand } from "../models/business/Brand.js";
import { BikeCategory } from "../models/business/BikeCategory.js";
import { Op } from "@sequelize/core";

export class BikeService {
  // Get all bikes (solo disponibles)
  public async getAllBikes(): Promise<Bike[]> {
    return await Bike.findAll({
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
  }

  // Get all bikes (admin - incluye todas)
  public async getAllBikesAdmin(): Promise<Bike[]> {
    return await Bike.findAll({
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
  }

  // Get bike by ID
  public async getBikeById(id: string | number): Promise<Bike | null> {
    return await Bike.findOne({
      where: { id, status: "available" },
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
  }

  // Create bike
  public async createBike(bikeData: Partial<BikeI>): Promise<Bike> {
    // Verificar que el serial number no exista
    const existingBike = await Bike.findOne({
      where: { serial_number: bikeData.serial_number }
    });
    
    if (existingBike) {
      throw new Error("A bike with this serial number already exists");
    }

    // Verificar que la marca existe
    if (bikeData.brand_id) {
      const brandExists = await Brand.findByPk(bikeData.brand_id);
      if (!brandExists) {
        throw new Error("Brand not found");
      }
    }

    // Verificar que la categoría existe
    if (bikeData.bike_category_id) {
      const categoryExists = await BikeCategory.findByPk(bikeData.bike_category_id);
      if (!categoryExists) {
        throw new Error("Bike category not found");
      }
    }

    const data = {
      ...bikeData,
      status: bikeData.status || "available",
    };

    const newBike = await Bike.create({ ...data });
    
    // Retornar la bicicleta con relaciones
    return await Bike.findByPk(newBike.id, {
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
    }) as Bike;
  }

  // Update bike
  public async updateBike(
    id: string | number,
    bikeData: Partial<BikeI>
  ): Promise<Bike | null> {
    const bikeExist = await Bike.findOne({
      where: { id, status: "available" },
    });

    if (!bikeExist) {
      return null;
    }

    // Verificar que el serial number no esté en uso por otra bicicleta
    if (bikeData.serial_number) {
      const existingBike = await Bike.findOne({
        where: { 
          serial_number: bikeData.serial_number,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingBike) {
        throw new Error("A bike with this serial number already exists");
      }
    }

    // Verificar que la marca existe si se está actualizando
    if (bikeData.brand_id) {
      const brandExists = await Brand.findByPk(bikeData.brand_id);
      if (!brandExists) {
        throw new Error("Brand not found");
      }
    }

    // Verificar que la categoría existe si se está actualizando
    if (bikeData.bike_category_id) {
      const categoryExists = await BikeCategory.findByPk(bikeData.bike_category_id);
      if (!categoryExists) {
        throw new Error("Bike category not found");
      }
    }

    await bikeExist.update(bikeData);
    
    // Retornar la bicicleta actualizada con relaciones
    return await Bike.findByPk(id, {
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
    }) as Bike;
  }

  // Delete bike (físico)
  public async deleteBike(id: string | number): Promise<boolean> {
    const bikeToDelete = await Bike.findByPk(id);

    if (!bikeToDelete) {
      return false;
    }

    await bikeToDelete.destroy();
    return true;
  }

  // Set bike as unavailable
  public async setBikeUnavailable(id: string | number): Promise<boolean> {
    const bikeToUpdate = await Bike.findOne({
      where: { id, status: "available" },
    });

    if (!bikeToUpdate) {
      return false;
    }

    await bikeToUpdate.update({ status: "unavailable" });
    return true;
  }

  // Reactivate bike
  public async reactivateBike(id: string | number): Promise<boolean> {
    const bikeToUpdate = await Bike.findOne({
      where: { id, status: "unavailable" },
    });

    if (!bikeToUpdate) {
      return false;
    }

    await bikeToUpdate.update({ status: "available" });
    return true;
  }

  // Get bikes by brand
  public async getBikesByBrand(brandId: string | number): Promise<{ brand: Brand | null, bikes: Bike[] }> {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      return { brand: null, bikes: [] };
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

    return { brand, bikes };
  }

  // Get bikes by category
  public async getBikesByCategory(categoryId: string | number): Promise<{ category: BikeCategory | null, bikes: Bike[] }> {
    const category = await BikeCategory.findByPk(categoryId);
    if (!category) {
      return { category: null, bikes: [] };
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

    return { category, bikes };
  }

  // Search bikes
  public async searchBikes(query: string): Promise<Bike[]> {
    return await Bike.findAll({
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
  }

  // Get bikes by price range
  public async getBikesByPriceRange(minPrice: number, maxPrice: number): Promise<Bike[]> {
    return await Bike.findAll({
      where: {
        status: "available",
        price: {
          [Op.between]: [minPrice, maxPrice]
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
  }
}