// src/routes/index.ts
import { Router } from "express";
import userRoutes from "./business/user.routes.js";
import brand from "./business/brand.routes.js"
import bikeCategory from "./business/bikeCategory.routes.js"
import bike from "./business/bike.routes.js"
import rate from "./business/rate.routes.js"
import rental from "./business/rental.routes.js"
import rentalDetails from "./business/rentalDetails.routes.js"
import maintenance from "./business/maintenance.routes.js"
import penaltyTypes from "./business/penaltyTypes.routes.js"
import penalty from "./business/penalty.routes.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/brands", brand);
router.use("/bike-categories", bikeCategory);
router.use("/bikes", bike);
router.use("/rates", rate);
router.use("/rentals", rental);
router.use("/rental-details", rentalDetails);
router.use("/maintenances", maintenance);
router.use("/penalty-types", penaltyTypes);
router.use("/penalties", penalty);

export default router;