// src/models/business/Rate.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface RateI { 
  id?: number; 
  name: string; 
  price_per_hour: number;
  status: "active" | "inactive"; 
}

export class Rate extends Model {
  public id!: number;
  public name!: string;
  public price_per_hour!: number;
  public status!: "active" | "inactive";
}

Rate.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
        len: {
          args: [3, 100],
          msg: "Name must be between 3 and 100 characters",
        },
      },
    },

    price_per_hour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Price must be a valid decimal",
        },
        min: {
          args: [0],
          msg: "Price cannot be negative",
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
    modelName: "Rate",
    tableName: "rates",
    timestamps: true,
    underscored: true,
  }
);