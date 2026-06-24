// src/routes/business/rate.routes.ts
import { Router } from "express";
import { RateController } from "../../controllers/business/rate.controller.js";

const router = Router();
const controller = new RateController();

// GET
router.get("/", controller.getAllRates);
router.get("/:id", controller.getRateById);

// POST
router.post("/", controller.createRate);

// PUT
router.put("/:id", controller.updateRate);

// DELETE físico
router.delete("/:id", controller.deleteRate);

// DELETE lógico
router.patch("/:id", controller.deleteRateAdv);

export default router;