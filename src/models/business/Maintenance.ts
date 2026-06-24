// src/models/Business/Maintenance.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface MaintenanceI {
  id?: number;
  bike_id: number;
  name: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  total_cost?: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export class Maintenance extends Model {
  public id!: number;
  public bike_id!: number;
  public name!: string;
  public description!: string;
  public start_date!: Date;
  public end_date!: Date;
  public total_cost!: number;
  public status!: "scheduled" | "in_progress" | "completed" | "cancelled";
}

Maintenance.init(
  {
    bike_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Bike ID must be an integer",
        },
      },
    },
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
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description cannot exceed 500 characters",
        },
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Actual start date must be valid",
        },
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: "Actual end date must be valid",
        },
      },
    },
    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "in_progress",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "scheduled",
      validate: {
        isIn: {
          args: [[
            "scheduled",
            "in_progress",
            "completed",
            "cancelled",
          ]],
          msg: "Invalid maintenances status",
        },
      },
    },
    total_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Total cost must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Total cost cannot be negative",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Maintenance",
    tableName: "maintenances",
    timestamps: true,
    underscored: true,

    //lógica de negocio
    validate: {
      dateLogic() {
        if (
          this.end_date &&
          this.start_date &&
          this.end_date < this.start_date
        ) {
          throw new Error(
            "End date cannot be before start date"
          );
        }
      },

      completedMaintenanceLogic() {
        if (
          this.status === "completed" &&
          !this.end_date
        ) {
          throw new Error(
            "Completed maintenance must have an end date"
          );
        }
      },
    },
  }
);