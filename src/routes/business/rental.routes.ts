// src/routes/business/rental.routes.ts
import { Router } from "express";
import { RentalController } from "../../controllers/business/rental.controller.js";

const router = Router();
const rentalController = new RentalController();

// GET
router.get("/", rentalController.getAllRentals);
router.get("/:id", rentalController.getRentalById);

// POST
router.post("/", rentalController.createRental);

// PUT
router.put("/:id", rentalController.updateRental);

// DELETE
router.delete("/:id", rentalController.deleteRental);

export default router;