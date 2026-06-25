// src/routes/business/maintenance.routes.ts
import { Router } from "express";
import { MaintenanceController } from "../../controllers/business/maintenance.controller.js";

const router = Router();
const maintenanceController = new MaintenanceController();

// GET
router.get("/", maintenanceController.getAllMaintenances);
router.get("/admin", maintenanceController.getAllMaintenancesAdmin);
router.get("/bike/:bikeId", maintenanceController.getMaintenancesByBike);
router.get("/:id", maintenanceController.getMaintenanceById);

// POST
router.post("/", maintenanceController.createMaintenance);

// PUT
router.put("/:id", maintenanceController.updateMaintenance);

// PATCH - Cambio de estado
router.patch("/:id/status", maintenanceController.updateMaintenanceStatus);

// DELETE
router.delete("/:id", maintenanceController.deleteMaintenance);

export default router;