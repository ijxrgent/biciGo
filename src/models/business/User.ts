// src/models/business/User.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface UserI {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: "customer" | "operator" | "admin";
  status: "active" | "inactive" | "suspended";
}

export class User extends Model {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public role!: "customer" | "operator" | "admin";
  public status!: "active" | "inactive" | "suspended";
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Name must be between 3 and 100 characters",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[0-9+\-()\s]+$/i,
          msg: "Phone format is invalid",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        name: "unique_email",
        msg: "Email already exists",
      },
      validate: {
        isEmail: { msg: "Email must be valid" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, 100],
          msg: "Password must be between 6 and 100 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("customer", "operator", "admin"),
      allowNull: false,
      defaultValue: "customer",
      validate: {
        isIn: {
          args: [["customer", "operator", "admin"]],
          msg: "Invalid role",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      allowNull: false,
      defaultValue: "active",
      validate: {
          isIn: {
            args: [["active", "inactive", "suspended"]],
            msg: "Invalid status",
          },
        },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
    validate: {
      emailOrPhoneRequired() {
        if (!this.email && !this.phone) {
          throw new Error("User must have at least email or phone");
        }
      },
    },
  }
);