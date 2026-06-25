// src/models/Business/Penalty.ts
import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../database/db.js";

export interface PenaltyI {
  id?: number;
  rental_id: number;
  penalty_type_id: number;
  amount: number;
  status: "pending" | "paid" | "waived";
  penalty_date: Date;
  paid_date?: Date;
  notes?: string;
}

export class Penalty extends Model {
  public id!: number;
  public rental_id!: number;
  public penalty_type_id!: number;
  public amount!: number;
  public status!: "pending" | "paid" | "waived";
  public penalty_date!: Date;
  public paid_date!: Date;
  public notes!: string;
}

Penalty.init(
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

    penalty_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Penalty type ID must be an integer",
        },
      },
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Amount must be a valid decimal number",
        },
        min: {
          args: [0],
          msg: "Amount cannot be negative",
        },
      },
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "waived"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "paid", "waived"]],
          msg: "Invalid penalty status",
        },
      },
    },

    penalty_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          args: true,
          msg: "Penalty date must be valid",
        },
      },
    },

    paid_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: "Paid date must be valid",
        },
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notes cannot exceed 500 characters",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Penalty",
    tableName: "penalties",
    timestamps: true,
    underscored: true,

    // VALIDACIONES DE NEGOCIO
    validate: {
      paidPenaltyLogic() {
        if (this.status === "paid" && !this.paid_date) {
          throw new Error(
            "Paid penalty must have a payment date"
          );
        }
      },

      waivedPenaltyLogic() {
        if (this.status === "waived" && this.paid_date) {
          throw new Error(
            "Waived penalty cannot have a payment date"
          );
        }
      },

      paidDateAfterPenaltyDate() {
        if (
          this.paid_date &&
          this.penalty_date &&
          this.paid_date < this.penalty_date
        ) {
          throw new Error(
            "Paid date cannot be before penalty date"
          );
        }
      },
    },
  }
);