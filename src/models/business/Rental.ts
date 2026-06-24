// src/models/business/Rental.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface RentalI {
  id?: number;
  user_id: number;
  rate_id: number;
  pickup_datetime: Date;
  expected_return_datetime: Date;
  actual_return_datetime?: Date;
  status: "reserved" | "active" | "completed" | "cancelled" | "overdue";
  total: number;
}

export class Rental extends Model {
  public id!: number;
  public user_id!: number;
  public rate_id!: number;
  public pickup_datetime!: Date;
  public expected_return_datetime!: Date;
  public actual_return_datetime!: Date;
  public status!: "reserved" | "active" | "completed" | "cancelled" | "overdue";
  public total!: number;
}

Rental.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "User ID must be an integer",
        },
      },
    },
    rate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Rate ID must be an integer",
        },
      },
    },
    pickup_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Pickup datetime must be valid",
        },
      },
    },
    expected_return_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Expected return datetime must be valid",
        },
      },
    },
    actual_return_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: "Actual return datetime must be valid",
        },
      },
    },
    status: {
      type: DataTypes.ENUM(
        "reserved",
        "active",
        "completed",
        "cancelled",
        "overdue"
      ),
      defaultValue: "reserved",
      validate: {
        isIn: {
          args: [[
            "reserved",
            "active",
            "completed",
            "cancelled",
            "overdue",
          ]],
          msg: "Invalid rental status",
        },
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Total must be decimal",
        },
        min: {
          args: [0],
          msg: "Total cannot be negative",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Rental",
    tableName: "rentals",
    timestamps: true,
    underscored: true,

    //VALIDACIONES DE NEGOCIO
    validate: {
      returnDateLogic() {
        if (
          this.expected_return_datetime &&
          this.pickup_datetime &&
          this.expected_return_datetime <= this.pickup_datetime
        ) {
          throw new Error(
            "Expected return datetime must be after pickup datetime"
          );
        }

        if (
          this.actual_return_datetime &&
          this.actual_return_datetime < this.pickup_datetime
        ) {
          throw new Error(
            "Actual return datetime cannot be before pickup datetime"
          );
        }
      },
      completedRentalLogic() {
        if (
          this.status === "completed" &&
          !this.actual_return_datetime
        ) {
          throw new Error(
            "Completed rental must have actual return datetime"
          );
        }
      },
    },
  }
);