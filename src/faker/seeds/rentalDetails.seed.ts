// src/faker/seeds/rentalDetails.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { RentalDetails } from '../../models/business/RentalDetails.js';
import { Rental } from '../../models/business/Rental.js';
import { Bike } from '../../models/business/Bike.js';
import { SEED_COUNT } from '../config.js';

export async function seedRentalDetails() {
  console.log("Rental Details...");

  // Obtener rentals y bikes existentes
  const rentals = await Rental.findAll();
  const bikes = await Bike.findAll();

  if (rentals.length === 0 || bikes.length === 0) {
    console.log("⚠️  No rentals or bikes found. Please run rental and bike seeds first.");
    return;
  }

  for (let i = 0; i < SEED_COUNT; i++) {
    const rental = faker.helpers.arrayElement(rentals);
    const bike = faker.helpers.arrayElement(bikes);
    
    // Cantidad: 1-3 bicicletas por detalle
    const quantity = faker.number.int({ min: 1, max: 3 });
    
    // Unit price: precio de la bicicleta + un margen
    const basePrice = Number(bike.price);
    const margin = faker.number.float({ min: 0.1, max: 0.3, multipleOf: 0.01 });
    const unitPrice = Number((basePrice * (1 + margin)).toFixed(2));
    
    // Subtotal: quantity * unit_price
    const subtotal = Number((quantity * unitPrice).toFixed(2));

    await RentalDetails.create({
      rental_id: rental.id,
      bike_id: bike.id,
      quantity: quantity,
      unit_price: unitPrice,
      subtotal: subtotal
    });
  }
}