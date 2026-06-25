// src/models/business/SaleDetails.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface SaleDetailsI { 
  id?: number; 
  sale_id: number;
  bike_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export class SaleDetails extends Model {
  public id!: number;
  public sale_id!: number;
  public bike_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public subtotal!: number;
}

SaleDetails.init(
  {
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Sale ID must be an integer",
        },
        min: {
          args: [1],
          msg: "Sale ID must be greater than 0",
        },
      },
    },

    bike_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Bike ID must be an integer",
        },
        min: {
          args: [1],
          msg: "Bike ID must be greater than 0",
        },
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: "Quantity must be an integer",
        },
        min: {
          args: [1],
          msg: "Quantity must be at least 1",
        },
      },
    },

    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Unit price must be a valid decimal number",
        },
        min: {
          args: [0],
          msg: "Unit price cannot be negative",
        },
      },
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Subtotal must be a valid decimal number",
        },
        min: {
          args: [0],
          msg: "Subtotal cannot be negative",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "SaleDetails",
    tableName: "sale_details",
    timestamps: false,
    underscored: true,

    validate: {
      subtotalLogic() {
        const quantity = Number(this.quantity);
        const unitPrice = Number(this.unit_price);
        const subtotal = Number(this.subtotal);

        const calculatedSubtotal = Number(
          (quantity * unitPrice).toFixed(2)
        );

        if (subtotal !== calculatedSubtotal) {
          throw new Error(
            "Subtotal must equal quantity * unit price"
          );
        }
      },
    },
  }
);