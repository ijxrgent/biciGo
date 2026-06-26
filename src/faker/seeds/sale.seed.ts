// src/faker/seeds/sales.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Sale } from '../../models/business/Sale.js';
import { User } from '../../models/business/User.js';
import { SEED_COUNT } from '../config.js';

export async function seedSales() {
  console.log("Sales...");

  const users = await User.findAll();

  if (users.length === 0) {
    console.log("⚠️  No users found. Please run user seeds first.");
    return;
  }

  // Ventas específicas para pruebas
  const specificSales = [
    {
      user_id: 1,
      sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "delivered" as const,
      total: 3499.99
    },
    {
      user_id: 1,
      sale_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "paid" as const,
      total: 599.99
    },
    {
      user_id: 2,
      sale_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "pending" as const,
      total: 1200.00
    },
    {
      user_id: 3,
      sale_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "cancelled" as const,
      total: 0.00
    }
  ];

  // Crear ventas específicas
  for (const saleData of specificSales) {
    await Sale.create(saleData);
  }

  // Generar ventas aleatorias adicionales
  const additionalCount = Math.max(0, SEED_COUNT - specificSales.length);

  const statusOptions = ["pending", "paid", "cancelled", "delivered"];
  const statusWeights = [0.25, 0.30, 0.15, 0.30];

  for (let i = 0; i < additionalCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const status = faker.helpers.weightedArrayElement(
      statusOptions.map((s, index) => ({ value: s, weight: statusWeights[index] }))
    );
    
    // Fecha de venta: últimos 90 días
    const saleDate = faker.date.between({
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(Date.now())
    });

    // Total según estado
    let total = 0;
    if (status === "cancelled") {
      total = 0;
    } else {
      // Diferentes rangos de precio según estado
      if (status === "pending") {
        total = parseFloat(faker.commerce.price({ min: 50, max: 500, dec: 2 }));
      } else if (status === "paid") {
        total = parseFloat(faker.commerce.price({ min: 100, max: 1500, dec: 2 }));
      } else if (status === "delivered") {
        total = parseFloat(faker.commerce.price({ min: 200, max: 3000, dec: 2 }));
      }
    }

    await Sale.create({
      user_id: user.id,
      sale_date: saleDate,
      status: status,
      total: total
    });
  }
}