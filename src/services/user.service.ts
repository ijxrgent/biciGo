// src/services/user.service.ts
import { User, UserI } from "../models/business/User.js";
import { BaseService } from "./base.service.js";
import { CreationAttributes } from "@sequelize/core";

export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]]
    });
  }

  public async getUserById(id: string | number): Promise<User | null> {
    return await this.findById(id);
  }

  // ✅ create recibe CreationAttributes<User>
  public async createUser(userData: CreationAttributes<User>): Promise<User> {
    const data = {
      ...userData,
      status: userData.status || "active",
    };
    return await this.create(data);
  }

  public async updateUser(id: string | number, userData: Partial<User>): Promise<User | null> {
    // Validación específica de User
    if (userData.email) {
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use");
      }
    }
    return await this.update(id, userData);
  }

  public async deleteUserAdv(id: string | number): Promise<boolean> {
    const user = await User.findOne({
      where: { id, status: "active" }
    });
    if (!user) return false;
    await user.update({ status: "inactive" });
    return true;
  }

  public async reactivateUser(id: string | number): Promise<boolean> {
    const user = await User.findOne({
      where: { id, status: "inactive" }
    });
    if (!user) return false;
    await user.update({ status: "active" });
    return true;
  }
}