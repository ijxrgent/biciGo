// src/services/user.service.ts
import { User, UserI } from "../models/business/User.js";

export class UserService {
  // Get all users (solo activos)
  public async getAllUsers(): Promise<UserI[]> {
    return await User.findAll({
      where: { status: "active" },
    });
  }

  // Get all users (incluyendo inactivos - admin)
  public async getAllUsersAdmin(): Promise<UserI[]> {
    return await User.findAll();
  }

  // Get user by ID
  public async getUserById(id: string | number): Promise<UserI | null> {
    return await User.findOne({
      where: { id, status: "active" },
    });
  }

  // Get user by ID (incluyendo inactivos)
  public async getUserByIdAdmin(id: string | number): Promise<UserI | null> {
    return await User.findByPk(id);
  }

  // Create user
  public async createUser(userData: Partial<UserI>): Promise<UserI> {
    return await User.create({ ...userData });
  }

  // Update user
  public async updateUser(id: string | number, userData: Partial<UserI>): Promise<UserI | null> {
    const userExist = await User.findOne({
      where: { id, status: "active" },
    });

    if (!userExist) {
      return null;
    }

    await userExist.update(userData);
    return userExist;
  }

  // Delete user (físico)
  public async deleteUser(id: string | number): Promise<boolean> {
    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return false;
    }

    await userToDelete.destroy();
    return true;
  }

  // Delete user lógico (status → inactive)
  public async deleteUserAdv(id: string | number): Promise<boolean> {
    const userToUpdate = await User.findOne({
      where: { id, status: "active" },
    });

    if (!userToUpdate) {
      return false;
    }

    await userToUpdate.update({ status: "inactive" });
    return true;
  }

  // Reactivar usuario (status → active)
  public async reactivateUser(id: string | number): Promise<boolean> {
    const userToUpdate = await User.findOne({
      where: { id, status: "inactive" },
    });

    if (!userToUpdate) {
      return false;
    }

    await userToUpdate.update({ status: "active" });
    return true;
  }
}