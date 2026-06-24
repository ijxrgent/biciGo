// src/routes/Business/brand.routes.ts
import { Router } from "express";
import { BrandController } from "../../controllers/business/brand.controller.js";

const router = Router();
const brandController = new BrandController();

// GET
router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);

// POST
router.post("/", brandController.createBrand);

// PUT
router.put("/:id", brandController.updateBrand);

// DELETE (físico)
router.delete("/:id", brandController.deleteBrand);

// DELETE lógico
router.patch("/:id", brandController.deleteBrandAdv);

export default router;