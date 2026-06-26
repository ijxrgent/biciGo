// src/routes/business/brand.routes.ts
import { Router } from "express";
import { BrandController } from "../../controllers/business/brand.controller.js";

const router = Router();
const brandController = new BrandController();

// GET
router.get("/", brandController.getAllBrands);
router.get("/admin", brandController.getAllBrandsAdmin);
router.get("/admin/:id", brandController.getBrandByIdAdmin);
router.get("/:id", brandController.getBrandById);

// POST
router.post("/", brandController.createBrand);

// PUT
router.put("/:id", brandController.updateBrand);

// PATCH - Cambios de estado
router.patch("/:id/inactive", brandController.deleteBrandAdv);
router.patch("/:id/active", brandController.reactivateBrand);

// DELETE (físico)
router.delete("/:id", brandController.deleteBrand);

export default router;