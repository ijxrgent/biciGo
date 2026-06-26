// src/routes/business/bike.routes.ts
import { Router } from "express";
import { BikeController } from "../../controllers/business/bike.controller.js";

const router = Router();
const bikeController = new BikeController();

// GET - Búsquedas y filtros
router.get("/", bikeController.getAllBikes);
router.get("/admin", bikeController.getAllBikesAdmin);
router.get("/search", bikeController.searchBikes);
router.get("/price-range", bikeController.getBikesByPriceRange);
router.get("/brand/:brandId", bikeController.getBikesByBrand);
router.get("/category/:categoryId", bikeController.getBikesByCategory);
router.get("/:id", bikeController.getBikeById);

// POST
router.post("/", bikeController.createBike);

// PUT
router.put("/:id", bikeController.updateBike);

// PATCH - Cambios de estado
router.patch("/:id/unavailable", bikeController.setBikeUnavailable);
router.patch("/:id/available", bikeController.reactivateBike);

// DELETE (físico)
router.delete("/:id", bikeController.deleteBike);

export default router;