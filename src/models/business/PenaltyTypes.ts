// src/models/Business/PenaltyType.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface PenaltyTypeI {
  id?: number;
  name: string;
  default_amount: number;
  description?: string;
  penalty_mode: "fixed" | "custom";
  status: "active" | "inactive";
}

export class PenaltyType extends Model {
  public id!: number;
  public name!: string;
  public default_amount!: number;
  public description!: string;
  public penalty_mode!: "fixed" | "custom";
  public status!: "active" | "inactive";
}

PenaltyType.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_penalty_type_name",
        msg: "Penalty type already exists",
    },
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Name must be between 3 and 100 characters",
        },
      },
      
    },
    default_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Must be a valid amount" },
        min: {
          args: [0],
          msg: "Default amount cannot be negative",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description cannot exceed 500 characters",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [[
            "active",
            "inactive",
          ]],
          msg: "Invalid penalty type status",
        },
      },
    },
    penalty_mode: {
      type: DataTypes.ENUM("fixed", "custom"),
      allowNull: false,
      defaultValue: "fixed",
      validate: {
        isIn: {
          args: [[
            "fixed",
            "custom",
          ]],
          msg: "Invalid penalty mode",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "PenaltyType",
    tableName: "penalty_types",
    timestamps: true,
    underscored: true,
  }
);