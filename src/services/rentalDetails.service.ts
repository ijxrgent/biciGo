// src/services/rentalDetails.service.ts
import { RentalDetails, RentalDetailsI } from "../models/business/RentalDetails.js";
import { Rental } from "../models/business/Rental.js";
import { Bike } from "../models/business/Bike.js";

export class RentalDetailsService {
  // Get all rental details
  public async getAllRentalDetails(): Promise<RentalDetails[]> {
    return await RentalDetails.findAll({
      include: [
        { 
          model: Rental, 
          as: "rental"
        },
        { 
          model: Bike, 
          as: "bike"
        }
      ]
    });
  }

  // Get rental detail by ID
  public async getRentalDetailsById(id: string | number): Promise<RentalDetails | null> {
    return await RentalDetails.findByPk(id, {
      include: [
        { 
          model: Rental, 
          as: "rental"
        },
        { 
          model: Bike, 
          as: "bike"
        }
      ]
    });
  }

  // Get rental details by rental ID
  public async getRentalDetailsByRental(rentalId: string | number): Promise<RentalDetails[]> {
    return await RentalDetails.findAll({
      where: { rental_id: rentalId },
      include: [
        { 
          model: Bike, 
          as: "bike"
        }
      ]
    });
  }

  // Create rental detail
  public async createRentalDetails(detailData: Partial<RentalDetailsI>): Promise<RentalDetails> {
    // Validar que el rental existe
    if (detailData.rental_id) {
      const rentalExists = await Rental.findByPk(detailData.rental_id);
      if (!rentalExists) {
        throw new Error("Rental not found");
      }
    }

    // Validar que la bike existe
    if (detailData.bike_id) {
      const bikeExists = await Bike.findByPk(detailData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Calcular subtotal si no viene en el body
    let data = { ...detailData };
    if (!data.subtotal && data.quantity && data.unit_price) {
      data.subtotal = data.quantity * data.unit_price;
    }

    const newDetail = await RentalDetails.create({ ...data });
    
    // Retornar el detalle creado con sus relaciones
    return await RentalDetails.findByPk(newDetail.id, {
      include: [
        { 
          model: Rental, 
          as: "rental"
        },
        { 
          model: Bike, 
          as: "bike"
        }
      ]
    }) as RentalDetails;
  }

  // Update rental detail
  public async updateRentalDetails(
    id: string | number,
    detailData: Partial<RentalDetailsI>
  ): Promise<RentalDetails | null> {
    const rentalDetail = await RentalDetails.findByPk(id);

    if (!rentalDetail) {
      return null;
    }

    // Si se actualiza rental_id, validar que existe
    if (detailData.rental_id && detailData.rental_id !== rentalDetail.rental_id) {
      const rentalExists = await Rental.findByPk(detailData.rental_id);
      if (!rentalExists) {
        throw new Error("Rental not found");
      }
    }

    // Si se actualiza bike_id, validar que existe
    if (detailData.bike_id && detailData.bike_id !== rentalDetail.bike_id) {
      const bikeExists = await Bike.findByPk(detailData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Recalcular subtotal si cambia quantity o unit_price
    let data = { ...detailData };
    if (data.quantity !== undefined || data.unit_price !== undefined) {
      const newQuantity = data.quantity || rentalDetail.quantity;
      const newUnitPrice = data.unit_price || rentalDetail.unit_price;
      data.subtotal = newQuantity * newUnitPrice;
    }

    await rentalDetail.update(data);
    
    // Retornar el detalle actualizado con sus relaciones
    return await RentalDetails.findByPk(id, {
      include: [
        { 
          model: Rental, 
          as: "rental"
        },
        { 
          model: Bike, 
          as: "bike"
        }
      ]
    }) as RentalDetails;
  }

  // Delete rental detail
  public async deleteRentalDetails(id: string | number): Promise<boolean> {
    const rentalDetail = await RentalDetails.findByPk(id);

    if (!rentalDetail) {
      return false;
    }

    await rentalDetail.destroy();
    return true;
  }

  public async updateRentalTotal(rentalId: string | number): Promise<void> {
    const details = await RentalDetails.findAll({
      where: { rental_id: rentalId }
    });

    const total = details.reduce((sum, detail) => {
      return sum + Number(detail.subtotal);
    }, 0);

    await Rental.update(
      { total },
      { where: { id: rentalId } }
    );
  }

  // ✅ DELETE con actualización automática del total
  public async deleteRentalDetailsAndUpdateTotal(id: string | number): Promise<boolean> {
    const rentalDetail = await RentalDetails.findByPk(id);

    if (!rentalDetail) {
      return false;
    }

    const rentalId = rentalDetail.rental_id;
    await rentalDetail.destroy();
    
    // Actualizar el total del rental
    await this.updateRentalTotal(rentalId);
    
    return true;
  }
}