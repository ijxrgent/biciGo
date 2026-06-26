// src/routes/business/bikeCategory.routes.ts
import { Router } from "express";
import { BikeCategoryController } from "../../controllers/business/bikeCategory.controller.js";

const router = Router();
const bikeCategoryController = new BikeCategoryController();

// GET
router.get("/", bikeCategoryController.getAllCategories);
router.get("/:id", bikeCategoryController.getCategoryById);

// POST
router.post("/", bikeCategoryController.createCategory);

// PUT
router.put("/:id", bikeCategoryController.updateCategory);

// PATCH - Cambios de estado
router.patch("/:id/inactive", bikeCategoryController.deleteCategoryAdv);
router.patch("/:id/active", bikeCategoryController.reactivateCategory);

// DELETE (físico)
router.delete("/:id", bikeCategoryController.deleteCategory);

export default router;