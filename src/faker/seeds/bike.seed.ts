// src/faker/seeds/bikes.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Bike } from '../../models/business/Bike.js';
import { Brand } from '../../models/business/Brand.js';
import { BikeCategory } from '../../models/business/BikeCategory.js';
import { SEED_COUNT } from '../config.js';

export async function seedBikes() {
  console.log("Bikes...");

  // Obtener todas las marcas y categorías existentes
  const brands = await Brand.findAll();
  const categories = await BikeCategory.findAll();

  if (brands.length === 0 || categories.length === 0) {
    console.log("⚠️  No brands or categories found. Please run brand and category seeds first.");
    return;
  }

  for (let i = 0; i < SEED_COUNT; i++) {
    const brand = faker.helpers.arrayElement(brands);
    const category = faker.helpers.arrayElement(categories);

    await Bike.create({
      serial_number: faker.string.alphanumeric(10).toUpperCase(),
      model: `${faker.vehicle.model()} ${faker.number.int({ min: 100, max: 999 })}`,
      imageURL: faker.image.url(),
      description: faker.lorem.sentence({ min: 5, max: 15 }),
      price: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
      status: faker.helpers.arrayElement([
        "available", 
        "rented", 
        "maintenance", 
        "unavailable", 
        "sold"
      ]),
      brand_id: brand.id,
      bike_category_id: category.id,
    });
  }
}