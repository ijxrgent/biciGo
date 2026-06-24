// src/routes/index.ts
import { Router } from "express";
import userRoutes from "../routes/business/user.route.js";
import brand from "../routes/business/brand.route.js"
import bikeCategory from "../routes/business/bikeCategory.route.js"
import bike from "../routes/business/bike.route.js"
import rate from "../routes/business/rate.route.js"
import rental from "../routes/business/rental.route.js"
import rentalDetails from "../routes/business/rentalDetails.route.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/brands", brand);
router.use("/bike-categories", bikeCategory);
router.use("/bikes", bike);
router.use("/rates", rate);
router.use("/rentals", rental);
router.use("/rental-details", rentalDetails);

export default router;