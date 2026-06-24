// src/controllers/business/maintenance.controller.ts
import { Request, Response } from "express";
import { Op } from "@sequelize/core";
import { Maintenance, MaintenanceI } from "../../models/business/Maintenance.js";
import { Bike } from "../../models/business/Bike.js";

export class MaintenanceController {
  // Validar transiciones de estado
  private validateStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      "scheduled": ["in_progress", "cancelled"],
      "in_progress": ["completed", "cancelled"],
      "completed": [],
      "cancelled": []
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Sincronizar estado de la bicicleta
  private async syncBikeStatus(maintenance: Maintenance, status: string) {
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
          id: { [Op.ne]: maintenance.id } // Excluir el actual
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
  public async getAllMaintenances(req: Request, res: Response) {
    try {
      const maintenances = await Maintenance.findAll({
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

      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Get all maintenances (incluyendo completados y cancelados - admin)
  public async getAllMaintenancesAdmin(req: Request, res: Response) {
    try {
      const maintenances = await Maintenance.findAll({
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number"]
          }
        ],
        order: [["created_at", "DESC"]]
      });

      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Get by ID
  public async getMaintenanceById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const maintenance = await Maintenance.findByPk(id, {
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number"]
          }
        ]
      });

      if (maintenance) {
        res.status(200).json(maintenance);
      } else {
        res.status(404).json({ error: "Maintenance not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenance" });
    }
  }

  // Get by bike
  public async getMaintenancesByBike(req: Request, res: Response) {
    try {
      const { bikeId } = req.params;

      const maintenances = await Maintenance.findAll({
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

      res.status(200).json({ maintenances });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching maintenances" });
    }
  }

  // Create
  public async createMaintenance(req: Request, res: Response) {
    try {
      const {
        bike_id,
        name,
        description,
        start_date,
        end_date,
        total_cost,
        status,
      } = req.body;

      // Validar que la bicicleta existe
      const bikeExists = await Bike.findByPk(bike_id);
      if (!bikeExists) {
        return res.status(400).json({ error: "Bike not found" });
      }

      // Validar que la fecha de inicio no sea en el pasado
      if (new Date(start_date) < new Date()) {
        return res.status(400).json({ 
          error: "Start date cannot be in the past" 
        });
      }

      let body: MaintenanceI = {
        bike_id,
        name,
        description,
        start_date,
        end_date,
        total_cost,
        status: status || "scheduled",
      };

      const newMaintenance = await Maintenance.create({ ...body });

      // Sincronizar estado de la bici
      if (status === "in_progress") {
        await Bike.update(
          { status: "maintenance" },
          { where: { id: bike_id } }
        );
      }

      // Obtener el mantenimiento creado con su relación
      const createdMaintenance = await Maintenance.findByPk(newMaintenance.id, {
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number"]
          }
        ]
      });

      res.status(201).json(createdMaintenance);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update
  public async updateMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const maintenance = await Maintenance.findByPk(id);

      if (!maintenance) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      // No permitir actualizar si está completado o cancelado
      if (["completed", "cancelled"].includes(maintenance.status)) {
        return res.status(400).json({ 
          error: `Cannot update a ${maintenance.status} maintenance` 
        });
      }

      const {
        bike_id,
        name,
        description,
        start_date,
        end_date,
        total_cost,
        status,
      } = req.body;

      // Si cambia de bicicleta, validar que existe
      if (bike_id && bike_id !== maintenance.bike_id) {
        const bikeExists = await Bike.findByPk(bike_id);
        if (!bikeExists) {
          return res.status(400).json({ error: "Bike not found" });
        }
      }

      // Validar transición de estado
      if (status && status !== maintenance.status) {
        if (!this.validateStatusTransition(maintenance.status, status)) {
          return res.status(400).json({
            error: `Cannot transition from ${maintenance.status} to ${status}`
          });
        }
      }

      await maintenance.update({
        bike_id: bike_id || maintenance.bike_id,
        name: name || maintenance.name,
        description,
        start_date: start_date || maintenance.start_date,
        end_date,
        total_cost,
        status: status || maintenance.status,
      });

      // Sincronizar estado de la bici si cambió el status
      if (status && status !== maintenance.status) {
        await this.syncBikeStatus(maintenance, status);
      }

      // Obtener el mantenimiento actualizado con su relación
      const updatedMaintenance = await Maintenance.findByPk(id, {
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number"]
          }
        ]
      });

      res.status(200).json(updatedMaintenance);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete físico
  public async deleteMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const maintenance = await Maintenance.findByPk(id);

      if (!maintenance) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      // No permitir eliminar si está en progreso o completado
      if (["in_progress", "completed"].includes(maintenance.status)) {
        return res.status(400).json({ 
          error: `Cannot delete a ${maintenance.status} maintenance` 
        });
      }

      // Si estaba programado, sincronizar bici (liberar)
      if (maintenance.status === "scheduled") {
        await this.syncBikeStatus(maintenance, "cancelled");
      }

      await maintenance.destroy();

      res.status(200).json({ message: "Maintenance deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting maintenance" });
    }
  }

  // Cambio de estado
  public async updateMaintenanceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, total_cost } = req.body;

      const maintenance = await Maintenance.findByPk(id);

      if (!maintenance) {
        return res.status(404).json({ error: "Maintenance not found" });
      }

      // Validar transición
      if (!this.validateStatusTransition(maintenance.status, status)) {
        return res.status(400).json({
          error: `Cannot transition from ${maintenance.status} to ${status}`
        });
      }

      // Si se completa, validar que tenga end_date y total_cost
      if (status === "completed") {
        if (!req.body.end_date) {
          return res.status(400).json({ 
            error: "End date is required when completing maintenance" 
          });
        }
        if (!total_cost) {
          return res.status(400).json({ 
            error: "Total cost is required when completing maintenance" 
          });
        }
      }

      const updateData: any = { status };
      if (total_cost !== undefined) updateData.total_cost = total_cost;
      if (req.body.end_date) updateData.end_date = req.body.end_date;

      await maintenance.update(updateData);

      // Sincronizar estado de la bici
      await this.syncBikeStatus(maintenance, status);

      const updatedMaintenance = await Maintenance.findByPk(id, {
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number"]
          }
        ]
      });

      res.status(200).json({ 
        message: `Status updated to ${status}`,
        maintenance: updatedMaintenance 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating status" });
    }
  }
}