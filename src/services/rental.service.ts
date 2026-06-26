// src/services/rental.service.ts
import { Rental, RentalI } from "../models/business/Rental.js";
import { User } from "../models/business/User.js";

export class RentalService {
  // Get all rentals
  public async getAllRentals(): Promise<Rental[]> {
    return await Rental.findAll({
      include: [
        { 
          model: User, 
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    });
  }

  // Get rental by ID
  public async getRentalById(id: string | number): Promise<Rental | null> {
    return await Rental.findByPk(id, {
      include: [
        { 
          model: User, 
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    });
  }

  // Create rental
  public async createRental(rentalData: Partial<RentalI>): Promise<Rental> {
    // Validar que el usuario existe
    if (rentalData.user_id) {
      const userExists = await User.findByPk(rentalData.user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
    }

    const newRental = await Rental.create({ ...rentalData });
    
    // Retornar el rental creado con su relación
    return await Rental.findByPk(newRental.id, {
      include: [
        { 
          model: User, 
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    }) as Rental;
  }

  // Update rental
  public async updateRental(
    id: string | number,
    rentalData: Partial<RentalI>
  ): Promise<Rental | null> {
    const rental = await Rental.findByPk(id);

    if (!rental) {
      return null;
    }

    // Si se actualiza el user_id, validar que existe
    if (rentalData.user_id && rentalData.user_id !== rental.user_id) {
      const userExists = await User.findByPk(rentalData.user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
    }

    await rental.update(rentalData);
    
    // Retornar el rental actualizado con su relación
    return await Rental.findByPk(id, {
      include: [
        { 
          model: User, 
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    }) as Rental;
  }

  // Delete rental (físico)
  public async deleteRental(id: string | number): Promise<boolean> {
    const rental = await Rental.findByPk(id);

    if (!rental) {
      return false;
    }

    await rental.destroy();
    return true;
  }
}