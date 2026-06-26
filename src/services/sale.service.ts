// src/services/sale.service.ts
import { Sale, SaleI } from "../models/business/Sale.js";
import { User } from "../models/business/User.js";

export class SaleService {
  // GET ALL (solo pending y paid)
  public async getAllSales(): Promise<Sale[]> {
    return await Sale.findAll({
      where: {
        status: ["pending", "paid"]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["sale_date", "DESC"]]
    });
  }

  // GET ALL (admin)
  public async getAllSalesAdmin(): Promise<Sale[]> {
    return await Sale.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["status", "ASC"], ["sale_date", "DESC"]]
    });
  }

  // GET BY ID
  public async getSaleById(id: string | number): Promise<Sale | null> {
    return await Sale.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    });
  }

  // GET BY USER
  public async getSalesByUser(userId: string | number): Promise<Sale[]> {
    return await Sale.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["sale_date", "DESC"]]
    });
  }

  // GET BY STATUS
  public async getSalesByStatus(status: string): Promise<Sale[]> {
    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
    }

    return await Sale.findAll({
      where: { status },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ],
      order: [["sale_date", "DESC"]]
    });
  }

  // CREATE
  public async createSale(saleData: Partial<SaleI>): Promise<Sale> {
    // Validar que el usuario existe
    if (saleData.user_id) {
      const userExists = await User.findByPk(saleData.user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
    }

    const data = {
      ...saleData,
      sale_date: saleData.sale_date || new Date(),
      status: saleData.status || "pending",
      total: saleData.total || 0,
    };

    const newSale = await Sale.create({ ...data });

    // Retornar la venta creada con su relación
    return await Sale.findByPk(newSale.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    }) as Sale;
  }

  // UPDATE
  public async updateSale(
    id: string | number,
    saleData: Partial<SaleI>
  ): Promise<Sale | null> {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      return null;
    }

    // No permitir actualizar ventas canceladas o entregadas
    if (["cancelled", "delivered"].includes(sale.status)) {
      throw new Error(`Cannot update a ${sale.status} sale`);
    }

    // Si se actualiza el usuario, validar que existe
    if (saleData.user_id && saleData.user_id !== sale.user_id) {
      const userExists = await User.findByPk(saleData.user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
    }

    await sale.update(saleData);

    // Retornar la venta actualizada con su relación
    return await Sale.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    }) as Sale;
  }

  // DELETE FÍSICO
  public async deleteSale(id: string | number): Promise<boolean> {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      return false;
    }

    // No permitir eliminar ventas pagadas o entregadas
    if (["paid", "delivered"].includes(sale.status)) {
      throw new Error(`Cannot delete a ${sale.status} sale`);
    }

    await sale.destroy();
    return true;
  }

  // CAMBIAR ESTADO
  public async updateSaleStatus(
    id: string | number,
    status: string
  ): Promise<Sale | null> {
    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
    }

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return null;
    }

    // Validar transiciones de estado
    const validTransitions: Record<string, string[]> = {
      "pending": ["paid", "cancelled"],
      "paid": ["delivered", "cancelled"],
      "cancelled": [],
      "delivered": []
    };

    if (!validTransitions[sale.status]?.includes(status)) {
      throw new Error(`Cannot transition from ${sale.status} to ${status}`);
    }

    await sale.update({ status });

    // Retornar la venta actualizada con su relación
    return await Sale.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    }) as Sale;
  }
}