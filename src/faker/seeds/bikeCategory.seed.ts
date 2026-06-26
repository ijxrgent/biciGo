// src/faker/seeds/bikeCategories.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { BikeCategory } from '../../models/business/BikeCategory.js';
import { SEED_COUNT } from '../config.js';

export async function seedBikeCategories() {
  console.log("Bike Categories...");

  // Categorías específicas y realistas
  const specificCategories = [
    {
      name: "Montaña",
      description: "Bicicletas diseñadas para terrenos montañosos y senderos",
      status: "active"
    },
    {
      name: "Carretera",
      description: "Bicicletas de alta velocidad para asfalto y competencia",
      status: "active"
    },
    {
      name: "Híbrida",
      description: "Bicicletas versátiles para ciudad y caminos ligeros",
      status: "active"
    },
    {
      name: "Eléctrica",
      description: "Bicicletas con asistencia eléctrica para mayor comodidad",
      status: "active"
    },
    {
      name: "Urbana",
      description: "Bicicletas diseñadas para desplazamientos en ciudad",
      status: "active"
    },
    {
      name: "Infantil",
      description: "Bicicletas para niños y jóvenes",
      status: "active"
    },
    {
      name: "Dobles",
      description: "Bicicletas tándem para dos personas",
      status: "inactive"
    },
    {
      name: "Plegable",
      description: "Bicicletas compactas y fáciles de transportar",
      status: "active"
    },
    {
      name: "BMX",
      description: "Bicicletas para acrobacias y circuitos",
      status: "active"
    },
    {
      name: "Gravel",
      description: "Bicicletas para caminos de grava y aventuras",
      status: "active"
    }
  ];

  // Crear categorías específicas
  for (const categoryData of specificCategories) {
    await BikeCategory.create(categoryData);
  }

  // Si necesitas más categorías aleatorias
  const additionalCount = Math.max(0, SEED_COUNT - specificCategories.length);
  
  const randomCategories = [
    "Ciclismo de montaña",
    "Ciclismo de ruta",
    "Ciclismo urbano",
    "Ciclismo recreativo",
    "Ciclismo profesional",
    "Ciclismo de aventura",
    "Ciclismo de competición",
    "Ciclismo de turismo",
    "Ciclismo de fitness",
    "Ciclismo de velocidad"
  ];

  for (let i = 0; i < additionalCount; i++) {
    await BikeCategory.create({
      name: faker.helpers.arrayElement(randomCategories) + " " + faker.string.alphanumeric(3),
      description: faker.lorem.sentence({ min: 5, max: 12 }),
      status: faker.helpers.arrayElement(["active", "inactive"])
    });
  }
}