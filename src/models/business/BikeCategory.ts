// src/models/business/BikeCategory.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface BikeCategoryI {
  id?: number;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

export class BikeCategory extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public status!: "active" | "inactive";
}

BikeCategory.init(
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
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 200],
          msg: "Description must be between 3 and 200 characters",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Invalid status",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "BikeCategory",
    tableName: "bike_categories",
    timestamps: true,
    underscored: true,
  }
);
