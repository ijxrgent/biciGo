// src/faker/seeds/penaltyTypes.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { PenaltyType } from '../../models/business/PenaltyType.js';
import { SEED_COUNT } from '../config.js';

export async function seedPenaltyTypes() {
  console.log("Penalty Types...");

  // Tipos de penalización específicos y realistas
  const specificPenaltyTypes = [
    {
      name: "Retraso en devolución",
      default_amount: 10.00,
      description: "Penalización por devolución tardía de la bicicleta",
      penalty_mode: "fixed",
      status: "active"
    },
    {
      name: "Daños en la bicicleta",
      default_amount: 50.00,
      description: "Penalización por daños físicos en la bicicleta",
      penalty_mode: "custom",
      status: "active"
    },
    {
      name: "Pérdida de bicicleta",
      default_amount: 500.00,
      description: "Penalización por pérdida total de la bicicleta",
      penalty_mode: "fixed",
      status: "active"
    },
    {
      name: "Limpieza excesiva requerida",
      default_amount: 15.00,
      description: "Penalización por devolución de la bicicleta en mal estado de limpieza",
      penalty_mode: "fixed",
      status: "active"
    },
    {
      name: "Reparaciones menores",
      default_amount: 30.00,
      description: "Penalización por reparaciones menores necesarias",
      penalty_mode: "custom",
      status: "active"
    },
    {
      name: "Mal uso del equipo",
      default_amount: 40.00,
      description: "Penalización por uso inadecuado de la bicicleta",
      penalty_mode: "custom",
      status: "active"
    },
    {
      name: "Documentación incompleta",
      default_amount: 5.00,
      description: "Penalización por falta de documentación en la devolución",
      penalty_mode: "fixed",
      status: "inactive"
    },
    {
      name: "Cancelación tardía",
      default_amount: 8.00,
      description: "Penalización por cancelación fuera del plazo establecido",
      penalty_mode: "fixed",
      status: "active"
    },
    {
      name: "Devolución en punto incorrecto",
      default_amount: 12.00,
      description: "Penalización por devolver la bicicleta en un punto no autorizado",
      penalty_mode: "fixed",
      status: "active"
    },
    {
      name: "Accesorios faltantes",
      default_amount: 25.00,
      description: "Penalización por faltante de accesorios como candado o luces",
      penalty_mode: "custom",
      status: "active"
    }
  ];

  // Crear tipos de penalización específicos
  for (const penaltyTypeData of specificPenaltyTypes) {
    await PenaltyType.create(penaltyTypeData);
  }

  // Si necesitas más tipos de penalización aleatorios
  const additionalCount = Math.max(0, SEED_COUNT - specificPenaltyTypes.length);
  
  const penaltyNames = [
    "Multa por exceso de velocidad",
    "Estacionamiento indebido",
    "Uso en zona prohibida",
    "Daño a terceros",
    "Incumplimiento de normas",
    "Falta de mantenimiento",
    "Maltrato de equipo",
    "Devolución fuera de horario"
  ];

  for (let i = 0; i < additionalCount; i++) {
    await PenaltyType.create({
      name: faker.helpers.arrayElement(penaltyNames) + " " + faker.string.alphanumeric(2),
      default_amount: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
      description: faker.lorem.sentence({ min: 5, max: 12 }),
      penalty_mode: faker.helpers.arrayElement(["fixed", "custom"]),
      status: faker.helpers.arrayElement(["active", "inactive"])
    });
  }
}