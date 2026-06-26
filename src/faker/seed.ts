// src/faker/seed.ts
import { sequelize } from '../database/db.js';
import '../models/index.js';

import { seedUsers } from './seeds/user.seed.js';
import { seedBrands } from './seeds/brand.seed.js';
import { seedBikeCategories } from './seeds/bikeCategory.seed.js';
import { seedRates } from './seeds/rate.seed.js';
import { seedPenaltyTypes } from './seeds/penaltyType.seed.js';
import { seedBikes } from './seeds/bike.seed.js';
import { seedRentals } from './seeds/rental.seed.js';
import { seedRentalDetails } from './seeds/rentalDetails.seed.js';
import { seedMaintenances } from './seeds/maintenance.seed.js';
import { seedSales } from './seeds/sale.seed.js';
import { seedSaleDetails } from './seeds/saleDetails.seed.js';
import { seedPenalties } from './seeds/penalty.seed.js';

async function seed() {
  try {
    console.log("🌱 Iniciando proceso de seed...");

    console.log("📦 Sincronizando la base de datos...");
    await sequelize.sync({ force: true });
    console.log("✅ Base de datos sincronizada");

    console.log("🌱 Poblando la base de datos...");
    await seedUsers();
    await seedBrands();
    await seedBikeCategories();
    await seedRates();
    await seedPenaltyTypes();
    await seedBikes();
    await seedRentals();
    await seedRentalDetails();
    await seedMaintenances();
    await seedSales();
    await seedSaleDetails();
    await seedPenalties();
    
    console.log("✅ Base de datos poblada correctamente.");
    process.exit(0);

  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();