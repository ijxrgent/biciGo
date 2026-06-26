// src/faker/seeds/penalties.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { Penalty } from '../../models/business/Penalty.js';
import { Rental } from '../../models/business/Rental.js';
import { PenaltyType } from '../../models/business/PenaltyType.js';
import { SEED_COUNT } from '../config.js';

export async function seedPenalties() {
  console.log("Penalties...");

  const rentals = await Rental.findAll();
  const penaltyTypes = await PenaltyType.findAll();

  if (rentals.length === 0 || penaltyTypes.length === 0) {
    console.log("⚠️  No rentals or penalty types found. Please run rental and penalty type seeds first.");
    return;
  }

  // Estados con distribución realista
  const statusDistribution = [
    "pending", "pending", "pending",
    "paid", "paid",
    "waived"
  ];

  const noteOptions = [
    "Cliente notificado por correo",
    "Pendiente de pago",
    "En proceso de revisión",
    "Documentación incompleta",
    "Aprobado por gerencia",
    "Requiere autorización especial",
    "Cliente en proceso de pago",
    "Penalización aplicada automáticamente",
    "Revisión de daños pendiente",
    "Cliente contactado exitosamente",
    "Pago pendiente de confirmación",
    "Penalización por retraso en la devolución",
    "Daño reportado por el cliente",
    "Exonerado por acuerdo con el cliente"
  ];

  for (let i = 0; i < SEED_COUNT; i++) {
    const rental = faker.helpers.arrayElement(rentals);
    const penaltyType = faker.helpers.arrayElement(penaltyTypes);
    const status = faker.helpers.arrayElement(statusDistribution);
    
    // ✅ LÓGICA ROBUSTA DE FECHAS
    const today = new Date();
    const pickupDate = new Date(rental.pickup_datetime);
    const expectedReturnDate = new Date(rental.expected_return_datetime);

    // Determinar el rango para la fecha de penalización
    let from: Date;
    let to: Date;

    // Si el pickup es en el pasado, la penalización puede ser entre pickup y hoy
    if (pickupDate < today) {
      from = pickupDate;
      to = today;
    } else {
      // Si el pickup es futuro, la penalización solo puede ser hoy
      from = today;
      to = today;
    }

    // Para penalizaciones de retraso, podemos extender hasta expected_return
    if (rental.status === "overdue" && expectedReturnDate < today) {
      from = expectedReturnDate;
      to = today;
    }

    // Generar fecha de penalización dentro del rango
    const penaltyDate = faker.date.between({ from, to });

    // Calcular monto
    let amount = Number(penaltyType.default_amount);
    if (penaltyType.penalty_mode === "custom") {
      // Para custom, variar entre 0.5 y 2.0 veces el monto por defecto
      const variation = faker.number.float({ min: 0.5, max: 2.0, multipleOf: 0.01 });
      amount = Number((amount * variation).toFixed(2));
    }

    // Si es por retraso, calcular monto basado en días de retraso
    if (rental.status === "overdue" && penaltyType.name.toLowerCase().includes("retraso")) {
      const daysLate = Math.ceil((today.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLate > 0) {
        amount = Number((amount * Math.min(daysLate, 10)).toFixed(2)); // Máximo 10 días
      }
    }

    // Determinar fecha de pago
    let paidDate = null;
    if (status === "paid") {
      paidDate = faker.date.between({
        from: penaltyDate,
        to: new Date(penaltyDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      });
    }

    // Generar notas contextuales
    let notes = null;
    if (faker.datatype.boolean({ probability: 0.7 })) {
      if (rental.status === "overdue") {
        notes = `Penalización por retraso en la devolución (${Math.ceil((today.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24))} días)`;
      } else if (status === "waived") {
        notes = "Exonerado por acuerdo con el cliente";
      } else {
        notes = faker.helpers.arrayElement(noteOptions);
      }
    }

    await Penalty.create({
      rental_id: rental.id,
      penalty_type_id: penaltyType.id,
      amount: amount,
      status: status,
      penalty_date: penaltyDate,
      paid_date: paidDate,
      notes: notes
    });
  }
}