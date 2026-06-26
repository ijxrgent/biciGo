// src/faker/seeds/rentals.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Rental } from '../../models/business/Rental.js';
import { User } from '../../models/business/User.js';
import { Rate } from '../../models/business/Rate.js';
import { SEED_COUNT } from '../config.js';

export async function seedRentals() {
  console.log("Rentals...");

  // Obtener usuarios y tarifas existentes
  const users = await User.findAll();
  const rates = await Rate.findAll();

  if (users.length === 0 || rates.length === 0) {
    console.log("⚠️  No users or rates found. Please run user and rate seeds first.");
    return;
  }

  // Estados con distribución realista
  const statusDistribution = [
    "reserved", "reserved", "reserved",
    "active", "active",
    "completed", "completed", "completed",
    "cancelled",
    "overdue"
  ];

  for (let i = 0; i < SEED_COUNT; i++) {
    const user = faker.helpers.arrayElement(users);
    const rate = faker.helpers.arrayElement(rates);
    
    // ✅ CORREGIDO: pickupDate solo en pasado o presente (NO futuro)
    const pickupDate = faker.date.between({ 
      from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 días atrás
      to: new Date() // Hasta hoy
    });
    
    // Expected return: entre 1 y 7 días después del pickup
    const expectedReturnDate = new Date(pickupDate);
    expectedReturnDate.setDate(expectedReturnDate.getDate() + faker.number.int({ min: 1, max: 7 }));
    
    // Determinar si tiene fecha de retorno real (para completed)
    let actualReturnDate = null;
    const status = faker.helpers.arrayElement(statusDistribution);
    
    if (status === "completed") {
      actualReturnDate = faker.date.between({
        from: pickupDate,
        to: expectedReturnDate
      });
    } else if (status === "overdue") {
      // Para overdue, la fecha de retorno es después de expectedReturn
      actualReturnDate = faker.date.between({
        from: expectedReturnDate,
        to: new Date(expectedReturnDate.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 días después
      });
    }

    // Calcular total (precio por hora * horas de alquiler)
    const hours = Math.ceil((expectedReturnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60));
    const total = Number((rate.price_per_hour * hours).toFixed(2));

    await Rental.create({
      user_id: user.id,
      rate_id: rate.id,
      pickup_datetime: pickupDate,
      expected_return_datetime: expectedReturnDate,
      actual_return_datetime: actualReturnDate,
      status: status,
      total: total
    });
  }
}