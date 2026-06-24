// src/routes/business/rentalDetails.routes.ts
import { Router } from "express";
import { RentalDetailsController } from "../../controllers/business/rentalDetail.controller.js";

const router = Router();
const rentalDetailsController = new RentalDetailsController();

// GET
router.get("/", rentalDetailsController.getAllRentalDetails);
router.get("/rental/:rentalId", rentalDetailsController.getRentalDetailsByRental);
router.get("/:id", rentalDetailsController.getRentalDetailsById);

// POST
router.post("/", rentalDetailsController.createRentalDetails);

// PUT
router.put("/:id", rentalDetailsController.updateRentalDetails);

// DELETE
router.delete("/:id", rentalDetailsController.deleteRentalDetails);

export default router;