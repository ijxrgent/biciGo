// src/routes/Business/bike.routes.ts
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

// DELETE
router.delete("/:id", bikeController.deleteBike);

// PATCH - Cambios de estado
router.patch("/:id/inactive", bikeController.setBikeUnavailable);
router.patch("/:id/active", bikeController.reactivateBike);

export default router;