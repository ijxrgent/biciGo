// src/routes/business/sale.routes.ts
import { Router } from "express";
import { SaleController } from "../../controllers/business/sale.controller.js";

const router = Router();
const saleController = new SaleController();

// GET
router.get("/", saleController.getAllSales);
router.get("/admin", saleController.getAllSalesAdmin);
router.get("/user/:userId", saleController.getSalesByUser);
router.get("/status/:status", saleController.getSalesByStatus);
router.get("/:id", saleController.getSaleById);

// POST
router.post("/", saleController.createSale);

// PUT
router.put("/:id", saleController.updateSale);

// PATCH - Cambio de estado
router.patch("/:id/status", saleController.updateSaleStatus);

// DELETE
router.delete("/:id", saleController.deleteSale);

export default router;