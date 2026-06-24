// src/controllers/business/user.controller.ts
import { Request, Response } from "express";
import { User, UserI } from "../../models/business/User.js";

export class UserController {
 //Get all users (solo activos)
 public async getAllUsers(req: Request, res: Response) {
    try {
      const users: UserI[] = await User.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  }
  
  // Get user by ID
  public async getUserById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const user = await User.findOne({
        where: { id: pk, status: "active" },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  // Create user
  public async createUser(req: Request, res: Response) {
    const {
      name,
      phone,
      email,
      password,
      role,
      status,
    } = req.body;

    try {
      let body: UserI = {
        name,
        phone,
        email,
        password,
        role,
        status,
      };

      const newUser = await User.create({ ...body });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update user
  public async updateUser(req: Request, res: Response) {
    const { id: pk } = req.params;

    const {
      name,
      phone,
      email,
      password,
      role,
      status,
    } = req.body;

    try {
      let body: UserI = {
        name,
        phone,
        email,
        password,
        role,
        status,
      };

      const userExist = await User.findOne({
        where: { id: pk, status: "active" },
      });

      if (userExist) {
        await userExist.update(body);
        res.status(200).json(userExist);
      } else {
        res.status(404).json({ error: "User not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete user (físico)
  public async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    
      const userToDelete = await User.findByPk(id);


      if (userToDelete) {
        await userToDelete.destroy();
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }

  // Delete user lógico (status → inactive)
  public async deleteUserAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const userToUpdate = await User.findOne({
        where: { id: pk, status: "active" },
      });

      if (userToUpdate) {
        await userToUpdate.update({ status: "inactive" });
        res.status(200).json({ message: "User marked as inactive" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error updating user status" });
    }
  }
}