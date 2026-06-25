// src/routes/business/saleDetails.routes.ts
import { Router } from "express";
import { SaleDetailsController } from "../../controllers/business/saleDetails.controller.js";

const router = Router();
const saleDetailsController = new SaleDetailsController();

// GET
router.get("/", saleDetailsController.getAllSaleDetails);
router.get("/sale/:saleId", saleDetailsController.getSaleDetailsBySale);
router.get("/bike/:bikeId", saleDetailsController.getSaleDetailsByBike);
router.get("/:id", saleDetailsController.getSaleDetailsById);

// POST
router.post("/", saleDetailsController.createSaleDetails);

// PUT
router.put("/:id", saleDetailsController.updateSaleDetails);

// DELETE
router.delete("/:id", saleDetailsController.deleteSaleDetails);
router.delete("/sale/:saleId", saleDetailsController.deleteSaleDetailsBySale);

export default router;