// src/routes/Business/user.routes.ts
import { Router } from "express";
import { UserController } from "../../controllers/business/user.controller.js";

const router = Router();
const userController = new UserController();

// GET
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

// POST
router.post("/", userController.createUser);

// PUT
router.put("/:id", userController.updateUser);

// DELETE (físico)
router.delete("/:id", userController.deleteUser);

// DELETE lógico
router.patch("/:id", userController.deleteUserAdv);

export default router;