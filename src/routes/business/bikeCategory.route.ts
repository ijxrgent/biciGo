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

// DELETE (físico)
router.delete("/:id", bikeCategoryController.deleteCategory);

// DELETE lógico
router.patch("/:id", bikeCategoryController.deleteCategoryAdv);

export default router;