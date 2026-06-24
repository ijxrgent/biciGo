// src/models/business/Brand.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface BrandI {
  id?: number;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

export class Brand extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public status!: "active" | "inactive";
}

Brand.init(
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
    modelName: "Brand",
    tableName: "brands",
    timestamps: true,
    underscored: true,
  }
);
