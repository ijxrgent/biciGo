// src/faker/seeds/maintenances.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Maintenance } from '../../models/business/Maintenance.js';
import { Bike } from '../../models/business/Bike.js';
import { SEED_COUNT } from '../config.js';

export async function seedMaintenances() {
  console.log("Maintenances...");

  // Obtener bicicletas existentes
  const bikes = await Bike.findAll();

  if (bikes.length === 0) {
    console.log("⚠️  No bikes found. Please run bike seeds first.");
    return;
  }

  // Tipos de mantenimiento realistas
  const maintenanceTypes = [
    { name: "Cambio de aceite", description: "Lubricación y cambio de aceite del motor" },
    { name: "Revisión general", description: "Revisión completa de todos los componentes" },
    { name: "Cambio de frenos", description: "Reemplazo de pastillas y discos de freno" },
    { name: "Ajuste de cambios", description: "Ajuste y calibración del sistema de cambios" },
    { name: "Limpieza profunda", description: "Limpieza exhaustiva de toda la bicicleta" },
    { name: "Cambio de neumáticos", description: "Reemplazo de neumáticos y cámaras" },
    { name: "Ajuste de suspensión", description: "Calibración de la suspensión delantera y trasera" },
    { name: "Revisión eléctrica", description: "Revisión del sistema eléctrico y batería" },
    { name: "Cambio de cadena", description: "Reemplazo de la cadena y piñones" },
    { name: "Alineación de ruedas", description: "Alineación y centrado de ruedas" }
  ];

  // Estados con distribución realista
  const statusDistribution = [
    "scheduled", "scheduled", "scheduled",
    "in_progress",
    "completed", "completed", "completed",
    "cancelled"
  ];

  for (let i = 0; i < SEED_COUNT; i++) {
    const bike = faker.helpers.arrayElement(bikes);
    const maintenanceType = faker.helpers.arrayElement(maintenanceTypes);
    const status = faker.helpers.arrayElement(statusDistribution);
    
    // Generar fechas
    const startDate = faker.date.between({
      from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 días atrás
      to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 días adelante
    });
    
    // End date: entre 1-5 días después del start
    let endDate = null;
    let totalCost = null;
    
    if (status === "completed" || status === "in_progress") {
      if (status === "completed") {
        endDate = faker.date.between({
          from: startDate,
          to: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000)
        });
      }
      
      // Costo total: entre $20 y $200
      totalCost = parseFloat(faker.commerce.price({ min: 20, max: 200, dec: 2 }));
    }

    await Maintenance.create({
      bike_id: bike.id,
      name: maintenanceType.name,
      description: maintenanceType.description,
      start_date: startDate,
      end_date: endDate,
      total_cost: totalCost,
      status: status
    });
  }
}