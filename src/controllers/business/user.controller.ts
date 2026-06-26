// src/controllers/business/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../../services/user.service.js";

const userService = new UserService();

export class UserController {
  // Get all users (solo activos)
  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }

  // Get all users (incluyendo inactivos - admin)
  public async getAllUsersAdmin(req: Request, res: Response) {
    try {
      // ✅ Usar findAll de BaseService directamente
      const users = await userService.findAll({
        order: [["status", "DESC"], ["name", "ASC"]]
      });
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }

  // Get user by ID
  public async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const user = await userService.getUserById(id);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found or inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  // Get user by ID (admin - incluye inactivos)
  public async getUserByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // ✅ Usar findById de BaseService
      const user = await userService.findById(id);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  // Create user
  public async createUser(req: Request, res: Response) {
    try {
      const { name, phone, email, password, role, status } = req.body;

      const userData = {
        name,
        phone,
        email,
        password,
        role,
        status: status || "active",
      };

      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update user
  public async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const { name, phone, email, password, role, status } = req.body;

      const userData = { name, phone, email, password, role, status };

      const updatedUser = await userService.updateUser(id, userData);

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found or inactive" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete user (físico) - ✅ Usar delete de BaseService
  public async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await userService.delete(id);

      if (result) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting user" });
    }
  }

  // Delete user lógico (status → inactive)
  public async deleteUserAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await userService.deleteUserAdv(id);

      if (result) {
        res.status(200).json({ message: "User marked as inactive" });
      } else {
        res.status(404).json({ error: "User not found or already inactive" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user status" });
    }
  }

  // Reactivate user (status → active)
  public async reactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const result = await userService.reactivateUser(id);

      if (result) {
        res.status(200).json({ message: "User reactivated successfully" });
      } else {
        res.status(404).json({ error: "User not found or already active" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reactivating user" });
    }
  }
}