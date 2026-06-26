// src/faker/seeds/saleDetails.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { SaleDetails } from '../../models/business/SaleDetails.js';
import { Sale } from '../../models/business/Sale.js';
import { Bike } from '../../models/business/Bike.js';
import { SEED_COUNT } from '../config.js';

export async function seedSaleDetails() {
  console.log("Sale Details...");

  // Obtener ventas y bicicletas existentes
  const sales = await Sale.findAll();
  const bikes = await Bike.findAll();

  if (sales.length === 0 || bikes.length === 0) {
    console.log("⚠️  No sales or bikes found. Please run sale and bike seeds first.");
    return;
  }

  for (let i = 0; i < SEED_COUNT; i++) {
    const sale = faker.helpers.arrayElement(sales);
    const bike = faker.helpers.arrayElement(bikes);
    
    // Cantidad: 1-3 bicicletas por detalle
    const quantity = faker.number.int({ min: 1, max: 3 });
    
    // Unit price: basado en el precio de la bicicleta
    const basePrice = Number(bike.price);
    // Puede tener descuento o margen
    const adjustment = faker.number.float({ min: 0.8, max: 1.2, multipleOf: 0.01 });
    const unitPrice = Number((basePrice * adjustment).toFixed(2));
    
    // Subtotal: quantity * unit_price
    const subtotal = Number((quantity * unitPrice).toFixed(2));

    await SaleDetails.create({
      sale_id: sale.id,
      bike_id: bike.id,
      quantity: quantity,
      unit_price: unitPrice,
      subtotal: subtotal
    });
  }
}