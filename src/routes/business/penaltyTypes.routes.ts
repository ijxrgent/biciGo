// src/routes/business/penaltyType.routes.ts
import { Router } from "express";
import { PenaltyTypeController } from "../../controllers/business/penaltyType.controller.js";

const router = Router();
const penaltyTypeController = new PenaltyTypeController();

// GET
router.get("/", penaltyTypeController.getAllPenaltyTypes);
router.get("/admin", penaltyTypeController.getAllPenaltyTypesAdmin);
router.get("/:id", penaltyTypeController.getPenaltyTypeById);

// POST
router.post("/", penaltyTypeController.createPenaltyType);

// PUT
router.put("/:id", penaltyTypeController.updatePenaltyType);

// DELETE
router.delete("/:id", penaltyTypeController.deletePenaltyType);

// PATCH - Cambios de estado
router.patch("/:id/inactive", penaltyTypeController.deletePenaltyTypeAdv);
router.patch("/:id/active", penaltyTypeController.reactivatePenaltyType);

export default router;