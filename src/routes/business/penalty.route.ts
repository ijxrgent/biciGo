// src/routes/business/penalty.routes.ts
import { Router } from "express";
import { PenaltyController } from "../../controllers/business/penalty.controller.js";

const router = Router();
const penaltyController = new PenaltyController();

// GET
router.get("/", penaltyController.getAllPenalties);
router.get("/admin", penaltyController.getAllPenaltiesAdmin);
router.get("/rental/:rentalId", penaltyController.getPenaltiesByRental);
router.get("/penalty-type/:penaltyTypeId", penaltyController.getPenaltiesByPenaltyType);
router.get("/:id", penaltyController.getPenaltyById);

// POST
router.post("/", penaltyController.createPenalty);

// PUT
router.put("/:id", penaltyController.updatePenalty);

// PATCH - Cambios de estado
router.patch("/:id/pay", penaltyController.payPenalty);
router.patch("/:id/waive", penaltyController.waivePenalty);

// DELETE
router.delete("/:id", penaltyController.deletePenalty);

export default router;