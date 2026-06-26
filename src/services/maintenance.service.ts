// src/services/maintenance.service.ts
import { Op } from "@sequelize/core";
import { Maintenance, MaintenanceI } from "../models/business/Maintenance.js";
import { Bike } from "../models/business/Bike.js";

export class MaintenanceService {
  // Validar transiciones de estado
  public validateStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      "scheduled": ["in_progress", "cancelled"],
      "in_progress": ["completed", "cancelled"],
      "completed": [],
      "cancelled": []
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Sincronizar estado de la bicicleta
  public async syncBikeStatus(maintenance: Maintenance, status: string): Promise<void> {
    const bikeId = maintenance.bike_id;
    
    if (status === "in_progress") {
      await Bike.update(
        { status: "maintenance" },
        { where: { id: bikeId } }
      );
    } else if (status === "completed" || status === "cancelled") {
      // Verificar si la bici tiene otros mantenimientos activos
      const activeMaintenances = await Maintenance.count({
        where: {
          bike_id: bikeId,
          status: ["scheduled", "in_progress"],
          id: { [Op.ne]: maintenance.id }
        }
      });

      if (activeMaintenances === 0) {
        await Bike.update(
          { status: "available" },
          { where: { id: bikeId } }
        );
      }
    }
  }

  // Get all maintenances (solo activos)
  public async getAllMaintenances(): Promise<Maintenance[]> {
    return await Maintenance.findAll({
      where: {
        status: {
          [Op.in]: ["scheduled", "in_progress"]
        }
      },
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ],
      order: [["start_date", "ASC"]]
    });
  }

  // Get all maintenances (admin)
  public async getAllMaintenancesAdmin(): Promise<Maintenance[]> {
    return await Maintenance.findAll({
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }

  // Get by ID
  public async getMaintenanceById(id: string | number): Promise<Maintenance | null> {
    return await Maintenance.findByPk(id, {
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ]
    });
  }

  // Get by bike
  public async getMaintenancesByBike(bikeId: string | number): Promise<Maintenance[]> {
    return await Maintenance.findAll({
      where: { bike_id: bikeId },
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ],
      order: [["start_date", "DESC"]]
    });
  }

  // Create
  public async createMaintenance(maintenanceData: Partial<MaintenanceI>): Promise<Maintenance> {
    // Validar que la bicicleta existe
    if (maintenanceData.bike_id) {
      const bikeExists = await Bike.findByPk(maintenanceData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Validar que la fecha de inicio no sea en el pasado
    if (maintenanceData.start_date && new Date(maintenanceData.start_date) < new Date()) {
      throw new Error("Start date cannot be in the past");
    }

    const data = {
      ...maintenanceData,
      status: maintenanceData.status || "scheduled",
    };

    const newMaintenance = await Maintenance.create({ ...data });

    // Sincronizar estado de la bici
    if (data.status === "in_progress") {
      await this.syncBikeStatus(newMaintenance, data.status);
    }

    // Retornar el mantenimiento creado con su relación
    return await Maintenance.findByPk(newMaintenance.id, {
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ]
    }) as Maintenance;
  }

  // Update
  public async updateMaintenance(
    id: string | number,
    maintenanceData: Partial<MaintenanceI>
  ): Promise<Maintenance | null> {
    const maintenance = await Maintenance.findByPk(id);

    if (!maintenance) {
      return null;
    }

    // No permitir actualizar si está completado o cancelado
    if (["completed", "cancelled"].includes(maintenance.status)) {
      throw new Error(`Cannot update a ${maintenance.status} maintenance`);
    }

    // Si cambia de bicicleta, validar que existe
    if (maintenanceData.bike_id && maintenanceData.bike_id !== maintenance.bike_id) {
      const bikeExists = await Bike.findByPk(maintenanceData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Validar transición de estado
    if (maintenanceData.status && maintenanceData.status !== maintenance.status) {
      if (!this.validateStatusTransition(maintenance.status, maintenanceData.status)) {
        throw new Error(`Cannot transition from ${maintenance.status} to ${maintenanceData.status}`);
      }
    }

    await maintenance.update(maintenanceData);

    // Sincronizar estado de la bici si cambió el status
    if (maintenanceData.status && maintenanceData.status !== maintenance.status) {
      await this.syncBikeStatus(maintenance, maintenanceData.status);
    }

    // Retornar el mantenimiento actualizado con su relación
    return await Maintenance.findByPk(id, {
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ]
    }) as Maintenance;
  }

  // Delete físico
  public async deleteMaintenance(id: string | number): Promise<boolean> {
    const maintenance = await Maintenance.findByPk(id);

    if (!maintenance) {
      return false;
    }

    // No permitir eliminar si está en progreso o completado
    if (["in_progress", "completed"].includes(maintenance.status)) {
      throw new Error(`Cannot delete a ${maintenance.status} maintenance`);
    }

    // Si estaba programado, sincronizar bici (liberar)
    if (maintenance.status === "scheduled") {
      await this.syncBikeStatus(maintenance, "cancelled");
    }

    await maintenance.destroy();
    return true;
  }

  // Cambio de estado
  public async updateMaintenanceStatus(
    id: string | number,
    status: string,
    total_cost?: number,
    end_date?: Date
  ): Promise<Maintenance | null> {
    const maintenance = await Maintenance.findByPk(id);

    if (!maintenance) {
      return null;
    }

    // Validar transición
    if (!this.validateStatusTransition(maintenance.status, status)) {
      throw new Error(`Cannot transition from ${maintenance.status} to ${status}`);
    }

    // Si se completa, validar que tenga end_date y total_cost
    if (status === "completed") {
      if (!end_date) {
        throw new Error("End date is required when completing maintenance");
      }
      if (!total_cost && total_cost !== 0) {
        throw new Error("Total cost is required when completing maintenance");
      }
    }

    const updateData: any = { status };
    if (total_cost !== undefined) updateData.total_cost = total_cost;
    if (end_date) updateData.end_date = end_date;

    await maintenance.update(updateData);

    // Sincronizar estado de la bici
    await this.syncBikeStatus(maintenance, status);

    // Retornar el mantenimiento actualizado con su relación
    return await Maintenance.findByPk(id, {
      include: [
        {
          model: Bike,
          as: "bike",
          attributes: ["id", "model", "serial_number"]
        }
      ]
    }) as Maintenance;
  }
}