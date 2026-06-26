// src/faker/seeds/rates.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Rate } from '../../models/business/Rate.js';
import { SEED_COUNT } from '../config.js';

export async function seedRates() {
  console.log("Rates...");

  // Tarifas específicas y realistas
  const specificRates = [
    {
      name: "Tarifa por hora - Básica",
      price_per_hour: 5.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Estándar",
      price_per_hour: 8.50,
      status: "active"
    },
    {
      name: "Tarifa por hora - Premium",
      price_per_hour: 12.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Eléctrica",
      price_per_hour: 15.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Deportiva",
      price_per_hour: 10.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Infantil",
      price_per_hour: 3.50,
      status: "active"
    },
    {
      name: "Tarifa por hora - Familiar",
      price_per_hour: 7.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Larga duración",
      price_per_hour: 6.00,
      status: "inactive"
    },
    {
      name: "Tarifa por hora - VIP",
      price_per_hour: 20.00,
      status: "active"
    },
    {
      name: "Tarifa por hora - Económica",
      price_per_hour: 4.00,
      status: "inactive"
    }
  ];

  // Crear tarifas específicas
  for (const rateData of specificRates) {
    await Rate.create(rateData);
  }

  // Si necesitas más tarifas aleatorias
  const additionalCount = Math.max(0, SEED_COUNT - specificRates.length);
  
  const rateNames = [
    "Tarifa Express",
    "Tarifa Nocturna",
    "Tarifa Fin de Semana",
    "Tarifa Especial",
    "Tarifa Promocional",
    "Tarifa Corporativa",
    "Tarifa Estudiante",
    "Tarifa Senior",
    "Tarifa Premium Plus",
    "Tarifa Deluxe"
  ];

  for (let i = 0; i < additionalCount; i++) {
    await Rate.create({
      name: faker.helpers.arrayElement(rateNames) + " " + faker.string.alphanumeric(2),
      price_per_hour: parseFloat(faker.commerce.price({ min: 2, max: 25, dec: 2 })),
      status: faker.helpers.arrayElement(["active", "inactive"])
    });
  }
}