// src/services/base.service.ts
import { Model, ModelStatic, FindOptions, CreationAttributes } from "@sequelize/core";

export abstract class BaseService<T extends Model> {
  constructor(protected model: ModelStatic<T>) {}

  // GET ALL
  public async findAll(options?: FindOptions<T>): Promise<T[]> {
    return await this.model.findAll(options);
  }

  // GET BY ID
  public async findById(id: string | number): Promise<T | null> {
    return await this.model.findByPk(id);
  }

  // CREATE - Usando CreationAttributes<T>
  public async create(data: CreationAttributes<T>): Promise<T> {
    return await this.model.create(data);
  }

  // UPDATE
  public async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const entity = await this.model.findByPk(id);
    if (!entity) return null;
    await entity.update(data);
    return entity;
  }

  // DELETE
  public async delete(id: string | number): Promise<boolean> {
    const entity = await this.model.findByPk(id);
    if (!entity) return false;
    await entity.destroy();
    return true;
  }

  // EXISTS
  public async exists(id: string | number): Promise<boolean> {
    const entity = await this.model.findByPk(id);
    return entity !== null;
  }

  // COUNT
  public async count(options?: FindOptions<T>): Promise<number> {
    return await this.model.count(options);
  }

  // FIND ONE
  public async findOne(options?: FindOptions<T>): Promise<T | null> {
    return await this.model.findOne(options);
  }
}