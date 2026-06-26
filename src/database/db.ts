//src/database/db.ts
import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: process.env.MSSQL_HOST || "localhost",
  port: parseInt(process.env.MSSQL_PORT || "1433"),
  database: process.env.MSSQL_NAME || "test",
  authentication: {
    type: "default",
    options: {
      userName: process.env.MSSQL_USER || "sa",
      password: process.env.MSSQL_PASSWORD || "",
    },
  },
  encrypt: true,
  trustServerCertificate: true,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

export { sequelize };

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MSSQL');
    return true;
  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message || error);
    return false;
  }
};