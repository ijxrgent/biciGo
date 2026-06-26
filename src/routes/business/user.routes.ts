// src/routes/business/user.routes.ts
import { Router } from "express";
import { UserController } from "../../controllers/business/user.controller.js";

const router = Router();
const userController = new UserController();

// GET
router.get("/", userController.getAllUsers);
router.get("/admin", userController.getAllUsersAdmin);
router.get("/admin/:id", userController.getUserByIdAdmin);
router.get("/:id", userController.getUserById);

// POST
router.post("/", userController.createUser);

// PUT
router.put("/:id", userController.updateUser);

// PATCH - Cambios de estado
router.patch("/:id/inactive", userController.deleteUserAdv);
router.patch("/:id/active", userController.reactivateUser);

// DELETE (físico)
router.delete("/:id", userController.deleteUser);

export default router;