// src/services/saleDetails.service.ts
import { CreationAttributes } from "@sequelize/core";
import { SaleDetails, SaleDetailsI } from "../models/business/SaleDetails.js";
import { Sale } from "../models/business/Sale.js";
import { Bike } from "../models/business/Bike.js";
import { BaseService } from "./base.service.js";

export class SaleDetailsService extends BaseService<SaleDetails> {
  constructor() {
    super(SaleDetails);
  }

  // GET ALL
  public async getAllSaleDetails(): Promise<SaleDetails[]> {
    return await this.findAll({
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
  }

  // GET BY ID
  public async getSaleDetailsById(id: string | number): Promise<SaleDetails | null> {
    return await this.findById(id);
  }

  // GET BY SALE
  public async getSaleDetailsBySale(saleId: string | number): Promise<SaleDetails[]> {
    return await this.findAll({
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
  }

  // GET BY BIKE
  public async getSaleDetailsByBike(bikeId: string | number): Promise<SaleDetails[]> {
    return await this.findAll({
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
  }

  // CREATE
  public async createSaleDetails(detailData: CreationAttributes<SaleDetails>): Promise<SaleDetails> {
    // Validar que la venta existe
    if (detailData.sale_id) {
      const saleExists = await Sale.findByPk(detailData.sale_id);
      if (!saleExists) {
        throw new Error("Sale not found");
      }
    }

    // Validar que la bicicleta existe
    if (detailData.bike_id) {
      const bikeExists = await Bike.findByPk(detailData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Calcular subtotal si no viene en el body
    let data = { ...detailData };
    if (!data.subtotal && data.quantity && data.unit_price) {
      data.subtotal = data.quantity * data.unit_price;
    }

    const newDetail = await this.create(data);

    // Actualizar el total de la venta
    if (data.sale_id) {
      await this.updateSaleTotal(data.sale_id);
    }

    // Retornar el detalle creado con sus relaciones
    return await SaleDetails.findByPk(newDetail.id, {
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
    }) as SaleDetails;
  }

  // UPDATE
  public async updateSaleDetails(
    id: string | number,
    detailData: Partial<SaleDetailsI>
  ): Promise<SaleDetails | null> {
    const saleDetail = await SaleDetails.findByPk(id);

    if (!saleDetail) {
      return null;
    }

    // Si cambia la venta, validar que existe
    if (detailData.sale_id && detailData.sale_id !== saleDetail.sale_id) {
      const saleExists = await Sale.findByPk(detailData.sale_id);
      if (!saleExists) {
        throw new Error("Sale not found");
      }
    }

    // Si cambia la bicicleta, validar que existe
    if (detailData.bike_id && detailData.bike_id !== saleDetail.bike_id) {
      const bikeExists = await Bike.findByPk(detailData.bike_id);
      if (!bikeExists) {
        throw new Error("Bike not found");
      }
    }

    // Recalcular subtotal si cambia quantity o unit_price
    let data = { ...detailData };
    if (data.quantity !== undefined || data.unit_price !== undefined) {
      const newQuantity = data.quantity || saleDetail.quantity;
      const newUnitPrice = data.unit_price || saleDetail.unit_price;
      data.subtotal = newQuantity * newUnitPrice;
    }

    const oldSaleId = saleDetail.sale_id;
    await saleDetail.update(data);

    // Actualizar el total de la venta antigua y la nueva si cambió
    if (detailData.sale_id && detailData.sale_id !== oldSaleId) {
      await this.updateSaleTotal(oldSaleId);
      await this.updateSaleTotal(detailData.sale_id);
    } else {
      await this.updateSaleTotal(oldSaleId);
    }

    // Retornar el detalle actualizado con sus relaciones
    return await SaleDetails.findByPk(id, {
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
    }) as SaleDetails;
  }

  // DELETE ALL BY SALE
  public async deleteSaleDetailsBySale(saleId: string | number): Promise<number> {
    const deletedCount = await SaleDetails.destroy({
      where: { sale_id: saleId }
    });

    // Actualizar el total de la venta a 0
    await Sale.update(
      { total: 0 },
      { where: { id: saleId } }
    );

    return deletedCount;
  }

  // Método auxiliar para actualizar el total de la venta
  public async updateSaleTotal(saleId: string | number): Promise<void> {
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