// src/controllers/business/sale.controller.ts
import { Request, Response } from "express";
import { Sale, SaleI } from "../../models/business/Sale.js";
import { User } from "../../models/business/User.js";

export class SaleController {
  // GET ALL (solo pending y paid)
  public async getAllSales(req: Request, res: Response) {
    try {
      const sales = await Sale.findAll({
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

      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales" });
    }
  }

  // GET ALL (incluyendo cancelled y delivered - admin)
  public async getAllSalesAdmin(req: Request, res: Response) {
    try {
      const sales = await Sale.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ],
        order: [["status", "ASC"], ["sale_date", "DESC"]]
      });

      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales" });
    }
  }

  // GET BY ID
  public async getSaleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const sale = await Sale.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

      if (sale) {
        res.status(200).json(sale);
      } else {
        res.status(404).json({ error: "Sale not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale" });
    }
  }

  // GET BY USER
  public async getSalesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const sales = await Sale.findAll({
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

      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales by user" });
    }
  }

  // GET BY STATUS
  public async getSalesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;

      if (typeof status !== 'string') {
      return res.status(400).json({ error: "Status must be a string" });
    }

    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

      const sales = await Sale.findAll({
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

      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sales by status" });
    }
  }

  // CREATE
  public async createSale(req: Request, res: Response) {
    try {
      const {
        user_id,
        sale_date,
        status,
        total,
      } = req.body;

      // Validar que el usuario existe
      const userExists = await User.findByPk(user_id);
      if (!userExists) {
        return res.status(400).json({ error: "User not found" });
      }

      let body: SaleI = {
        user_id,
        sale_date: sale_date || new Date(),
        status: status || "pending",
        total: total || 0,
      };

      const newSale = await Sale.create({ ...body });

      const createdSale = await Sale.findByPk(newSale.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

      res.status(201).json(createdSale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const sale = await Sale.findByPk(id);

      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      // No permitir actualizar ventas canceladas o entregadas
      if (["cancelled", "delivered"].includes(sale.status)) {
        return res.status(400).json({ 
          error: `Cannot update a ${sale.status} sale` 
        });
      }

      const {
        user_id,
        sale_date,
        status,
        total,
      } = req.body;

      // Si se actualiza el usuario, validar que existe
      if (user_id && user_id !== sale.user_id) {
        const userExists = await User.findByPk(user_id);
        if (!userExists) {
          return res.status(400).json({ error: "User not found" });
        }
      }

      await sale.update({
        user_id,
        sale_date,
        status,
        total,
      });

      const updatedSale = await Sale.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone"]
          }
        ]
      });

      res.status(200).json(updatedSale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE FÍSICO
  public async deleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const sale = await Sale.findByPk(id);

      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      // No permitir eliminar ventas pagadas o entregadas
      if (["paid", "delivered"].includes(sale.status)) {
        return res.status(400).json({ 
          error: `Cannot delete a ${sale.status} sale` 
        });
      }

      await sale.destroy();

      res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting sale" });
    }
  }

  // CAMBIAR ESTADO
public async updateSaleStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validación robusta
    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: "Status is required and must be a string" });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}` 
      });
    }

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Validar transiciones de estado
    const validTransitions: Record<string, string[]> = {
      "pending": ["paid", "cancelled"],
      "paid": ["delivered", "cancelled"],
      "cancelled": [],
      "delivered": []
    };

    if (!validTransitions[sale.status]?.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${sale.status} to ${status}`
      });
    }

    await sale.update({ status });

    const updatedSale = await Sale.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    });

    res.status(200).json({
      message: `Sale status updated to ${status}`,
      sale: updatedSale
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}
}