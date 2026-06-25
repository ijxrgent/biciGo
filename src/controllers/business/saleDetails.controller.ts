// src/controllers/business/saleDetails.controller.ts
import { Request, Response } from "express";
import { SaleDetails, SaleDetailsI } from "../../models/business/SaleDetails.js";
import { Sale } from "../../models/business/Sale.js";
import { Bike } from "../../models/business/Bike.js";

export class SaleDetailsController {
  // GET ALL
  public async getAllSaleDetails(req: Request, res: Response) {
    try {
      const saleDetails = await SaleDetails.findAll({
        include: [
          {
            model: Sale,
            as: "sale",
            attributes: ["id", "user_id", "sale_date", "status", "total"]
          },
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number", "brand_id"]
          }
        ],
        order: [["sale_id", "ASC"]]
      });

      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details" });
    }
  }

  // GET BY ID
  public async getSaleDetailsById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const saleDetail = await SaleDetails.findByPk(id, {
        include: [
          {
            model: Sale,
            as: "sale",
            attributes: ["id", "user_id", "sale_date", "status", "total"]
          },
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number", "brand_id"]
          }
        ]
      });

      if (saleDetail) {
        res.status(200).json(saleDetail);
      } else {
        res.status(404).json({ error: "Sale detail not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale detail" });
    }
  }

  // GET BY SALE
  public async getSaleDetailsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;

      const saleDetails = await SaleDetails.findAll({
        where: { sale_id: saleId },
        include: [
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number", "brand_id"]
          }
        ],
        order: [["id", "ASC"]]
      });

      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details by sale" });
    }
  }

  // GET BY BIKE
  public async getSaleDetailsByBike(req: Request, res: Response) {
    try {
      const { bikeId } = req.params;

      const saleDetails = await SaleDetails.findAll({
        where: { bike_id: bikeId },
        include: [
          {
            model: Sale,
            as: "sale",
            attributes: ["id", "user_id", "sale_date", "status", "total"]
          }
        ],
        order: [["sale_id", "ASC"]]
      });

      res.status(200).json({ saleDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching sale details by bike" });
    }
  }

  // CREATE
  public async createSaleDetails(req: Request, res: Response) {
    try {
      const {
        sale_id,
        bike_id,
        quantity,
        unit_price,
        subtotal,
      } = req.body;

      // Validar que la venta existe
      const saleExists = await Sale.findByPk(sale_id);
      if (!saleExists) {
        return res.status(400).json({ error: "Sale not found" });
      }

      // Validar que la bicicleta existe
      const bikeExists = await Bike.findByPk(bike_id);
      if (!bikeExists) {
        return res.status(400).json({ error: "Bike not found" });
      }

      // Calcular subtotal si no viene en el body
      let calculatedSubtotal = subtotal;
      if (!calculatedSubtotal) {
        calculatedSubtotal = quantity * unit_price;
      }

      let body: SaleDetailsI = {
        sale_id,
        bike_id,
        quantity: quantity || 1,
        unit_price,
        subtotal: calculatedSubtotal,
      };

      const newSaleDetail = await SaleDetails.create({ ...body });

      // Actualizar el total de la venta
      await this.updateSaleTotal(sale_id);

      const createdSaleDetail = await SaleDetails.findByPk(newSaleDetail.id, {
        include: [
          {
            model: Sale,
            as: "sale",
            attributes: ["id", "user_id", "sale_date", "status", "total"]
          },
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number", "brand_id"]
          }
        ]
      });

      res.status(201).json(createdSaleDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // UPDATE
  public async updateSaleDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const saleDetail = await SaleDetails.findByPk(id);

      if (!saleDetail) {
        return res.status(404).json({ error: "Sale detail not found" });
      }

      const {
        sale_id,
        bike_id,
        quantity,
        unit_price,
        subtotal,
      } = req.body;

      // Si cambia la venta, validar que existe
      if (sale_id && sale_id !== saleDetail.sale_id) {
        const saleExists = await Sale.findByPk(sale_id);
        if (!saleExists) {
          return res.status(400).json({ error: "Sale not found" });
        }
      }

      // Si cambia la bicicleta, validar que existe
      if (bike_id && bike_id !== saleDetail.bike_id) {
        const bikeExists = await Bike.findByPk(bike_id);
        if (!bikeExists) {
          return res.status(400).json({ error: "Bike not found" });
        }
      }

      // Recalcular subtotal si cambia quantity o unit_price
      let newSubtotal = subtotal;
      if (quantity !== undefined || unit_price !== undefined) {
        const newQuantity = quantity || saleDetail.quantity;
        const newUnitPrice = unit_price || saleDetail.unit_price;
        newSubtotal = newQuantity * newUnitPrice;
      }

      await saleDetail.update({
        sale_id: sale_id || saleDetail.sale_id,
        bike_id: bike_id || saleDetail.bike_id,
        quantity: quantity || saleDetail.quantity,
        unit_price: unit_price || saleDetail.unit_price,
        subtotal: newSubtotal || saleDetail.subtotal,
      });

      // Actualizar el total de la venta
      const saleId = sale_id || saleDetail.sale_id;
      await this.updateSaleTotal(saleId);

      const updatedSaleDetail = await SaleDetails.findByPk(id, {
        include: [
          {
            model: Sale,
            as: "sale",
            attributes: ["id", "user_id", "sale_date", "status", "total"]
          },
          {
            model: Bike,
            as: "bike",
            attributes: ["id", "model", "serial_number", "brand_id"]
          }
        ]
      });

      res.status(200).json(updatedSaleDetail);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE
  public async deleteSaleDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const saleDetail = await SaleDetails.findByPk(id);

      if (!saleDetail) {
        return res.status(404).json({ error: "Sale detail not found" });
      }

      const saleId = saleDetail.sale_id;

      await saleDetail.destroy();

      // Actualizar el total de la venta después de eliminar
      await this.updateSaleTotal(saleId);

      res.status(200).json({ message: "Sale detail deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting sale detail" });
    }
  }

  // DELETE ALL BY SALE
  public async deleteSaleDetailsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;

      const deletedCount = await SaleDetails.destroy({
        where: { sale_id: saleId }
      });

      // Actualizar el total de la venta a 0
      await Sale.update(
        { total: 0 },
        { where: { id: saleId } }
      );

      res.status(200).json({ 
        message: `${deletedCount} sale details deleted successfully` 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting sale details" });
    }
  }

  // Método auxiliar para actualizar el total de la venta
  private async updateSaleTotal(saleId: number) {
    const details = await SaleDetails.findAll({
      where: { sale_id: saleId },
      attributes: ["subtotal"]
    });

    const total = details.reduce((sum, detail) => {
      return sum + Number(detail.subtotal);
    }, 0);

    await Sale.update(
      { total },
      { where: { id: saleId } }
    );
  }
}