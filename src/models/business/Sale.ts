// src/models/business/Sale.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface SaleI { 
  id?: number; 
  user_id: number;
  sale_date: Date;
  status: "pending" | "paid" | "cancelled" | "delivered";
  total: number;
}

export class Sale extends Model {
  public id!: number;
  public user_id!: number;
  public sale_date!: Date;
  public status!: "pending" | "paid" | "cancelled" | "delivered";
  public total!: number;
}

Sale.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "User ID must be an integer",
        },
        min: {
          args: [1],
          msg: "User ID must be greater than 0",
        },
      },
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          args: true,
          msg: "Sale date must be a valid date",
        },
        isFutureDate(value: Date) {
            if (new Date(value) > new Date()) {
            throw new Error("Sale date cannot be in the future");
            }
        },
        isBefore: {
          args: new Date().toISOString(),
          msg: "Sale date cannot be in the future",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled", "delivered"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "paid", "cancelled", "delivered"]],
          msg: "Invalid sale status",
        },
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: {
          msg: "Total must be a valid decimal number",
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
    modelName: "Sale",
    tableName: "sales",
    timestamps: true,
    underscored: true,

    // VALIDACIONES DE NEGOCIO
    validate: {
      // Si la venta está pagada, no puede estar pendiente
      paidStatusLogic() {
        if (this.status === "paid" && this.total === 0) {
          throw new Error("Paid sale cannot have a total of 0");
        }
      },

      // Si la venta está entregada, debe estar pagada
      deliveredStatusLogic() {
        if (this.status === "delivered" && this.total === 0) {
          throw new Error("Delivered sale cannot have a total of 0");
        }
      },

      // Si la venta está cancelada, validar que no esté pagada
      cancelledStatusLogic() {
        if (this.status === "cancelled" && this.total > 0) {
          throw new Error("Cancelled sale cannot have a positive total");
        }
      },
    },
  }
);