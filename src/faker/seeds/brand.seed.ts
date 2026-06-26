// src/faker/seeds/brands.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Brand } from '../../models/business/Brand.js';
import { SEED_COUNT } from '../config.js';

export async function seedBrands() {
  console.log("Brands...");

  // Marcas específicas y realistas
  const specificBrands = [
    {
      name: "Trek",
      description: "Marca americana líder en bicicletas de alta gama",
      status: "active"
    },
    {
      name: "Specialized",
      description: "Fabricante de bicicletas de montaña y carretera",
      status: "active"
    },
    {
      name: "Giant",
      description: "El fabricante de bicicletas más grande del mundo",
      status: "active"
    },
    {
      name: "Cannondale",
      description: "Marca innovadora con diseños únicos",
      status: "active"
    },
    {
      name: "Scott",
      description: "Marca suiza de bicicletas de alta calidad",
      status: "active"
    },
    {
      name: "Merida",
      description: "Fabricante taiwanés de bicicletas de competición",
      status: "active"
    },
    {
      name: "Bianchi",
      description: "Marca italiana con más de 130 años de historia",
      status: "active"
    },
    {
      name: "Santa Cruz",
      description: "Marca especializada en bicicletas de montaña",
      status: "active"
    },
    {
      name: "Yeti",
      description: "Marca premium de bicicletas de montaña",
      status: "inactive"
    },
    {
      name: "Pivot",
      description: "Marca de bicicletas de montaña de alta gama",
      status: "active"
    }
  ];

  // Crear marcas específicas
  for (const brandData of specificBrands) {
    await Brand.create(brandData);
  }

  // Si necesitas más marcas aleatorias
  const additionalCount = Math.max(0, SEED_COUNT - specificBrands.length);
  
  const randomBrands = [
    "Cube", "Orbea", "Canyon", "Kona", "Marin",
    "Norco", "Polygon", "Raleigh", "Schwinn", "Fuji",
    "GT", "Haro", "Mongoose", "Diamondback", "Electra"
  ];

  for (let i = 0; i < additionalCount; i++) {
    await Brand.create({
      name: faker.helpers.arrayElement(randomBrands) + " " + faker.string.alphanumeric(2),
      description: faker.lorem.sentence({ min: 5, max: 12 }),
      status: faker.helpers.arrayElement(["active", "inactive"])
    });
  }
}