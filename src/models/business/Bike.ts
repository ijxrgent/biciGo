// src/models/business/Bike.ts
import { DataTypes, Model, ForeignKey } from "@sequelize/core";
import { sequelize } from "../../database/db.js";
import { Brand } from "./Brand.js";
import { BikeCategory } from "./BikeCategory.js";

export interface BikeI {
  id?: number;
  serial_number: string;
  model: string;
  imageURL?: string;
  description?: string;
  price: number;
  status: "available" | "rented" | "maintenance" | "unavailable" | "sold";
  brand_id: number;
  bike_category_id: number;
}

export class Bike extends Model {
  public id!: number;
  public serial_number!: string;
  public model!: string;
  public imageURL!: string;
  public description!: string;
  public price!: number;
  public status!: "available" | "rented" | "maintenance" | "unavailable" | "sold";
  public brand_id!: ForeignKey<number>;
  public bike_category_id!: ForeignKey<number>;
}

Bike.init(
  {
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Serial number cannot be empty" },
        len: {
          args: [5, 50],
          msg: "Serial number must be between 5 and 50 characters",
        },
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Model cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Model must be between 2 and 100 characters",
        },
      },
    },
    imageURL: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: "Image URL must be a valid URL" },
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 500],
          msg: "Description must be between 3 and 500 characters",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a valid decimal number" },
        min: {
          args: [0],
          msg: "Price must be greater than or equal to 0",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("available", "rented", "maintenance", "unavailable", "sold"),
      allowNull: false,
      defaultValue: "available",
      validate: {
        isIn: {
          args: [["available", "rented", "maintenance", "unavailable", "sold"]],
          msg: "Invalid status",
        },
      },
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: "id",
      },
      validate: {
        isInt: { msg: "Brand ID must be an integer" },
        min: {
          args: [1],
          msg: "Brand ID must be greater than 0",
        },
      },
    },
    bike_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BikeCategory,
        key: "id",
      },
      validate: {
        isInt: { msg: "Bike category ID must be an integer" },
        min: {
          args: [1],
          msg: "Bike category ID must be greater than 0",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Bike",
    tableName: "bikes",
    timestamps: true,
    underscored: true,
  }
);
