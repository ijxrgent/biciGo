// src/services/rental.service.ts
import { CreationAttributes } from "@sequelize/core";
import { Rental, RentalI } from "../models/business/Rental.js";
import { User } from "../models/business/User.js";
import { BaseService } from "./base.service.js";

export class RentalService extends BaseService<Rental> {
  constructor() {
    super(Rental);
  }

  // Get all rentals
  public async getAllRentals(): Promise<Rental[]> {
    return await this.findAll({
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
    return await this.findById(id);
  }

  // Create rental
  public async createRental(rentalData: CreationAttributes<Rental>): Promise<Rental> {
    // Validar que el usuario existe
    if (rentalData.user_id) {
      const userExists = await User.findByPk(rentalData.user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
    }

    const newRental = await this.create(rentalData);
    
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
}