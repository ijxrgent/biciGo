// src/routes/business/rate.routes.ts
import { Router } from "express";
import { RateController } from "../../controllers/business/rate.controller.js";

const router = Router();
const rateController = new RateController();

// GET
router.get("/", rateController.getAllRates);
router.get("/admin", rateController.getAllRatesAdmin);
router.get("/admin/:id", rateController.getRateByIdAdmin);
router.get("/:id", rateController.getRateById);

// POST
router.post("/", rateController.createRate);

// PUT
router.put("/:id", rateController.updateRate);

// PATCH - Cambios de estado
router.patch("/:id/inactive", rateController.deleteRateAdv);
router.patch("/:id/active", rateController.reactivateRate);

// DELETE (físico)
router.delete("/:id", rateController.deleteRate);

export default router;