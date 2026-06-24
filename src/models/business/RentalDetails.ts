// src/models/Business/RentalDetails.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface RentalDetailsI {
  id?: number;
  rental_id: number;
  bike_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export class RentalDetails extends Model {
  public id!: number;
  public rental_id!: number;
  public bike_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public subtotal!: number;
}

RentalDetails.init(
  {
    rental_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Rental ID must be an integer",
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
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Quantity must be an integer",
        },
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Unit price must be an integer",
        },
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Subtotal must be an integer",
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
    modelName: "RentalDetails",
    tableName: "rental_details",
    timestamps: false,

    //validaciones de negocio
    validate: {
      subtotalLogic() {
        const quantity = Number(this.quantity);
        const unitPrice = Number(this.unit_price);
        const subtotal = Number(this.subtotal);

       const calculatedSubtotal = Number((quantity * unitPrice).toFixed(2));

        if (subtotal !== calculatedSubtotal) {
          throw new Error(
            "Subtotal must equal quantity * unit price"
          );
        }
      },
    },
  }
);