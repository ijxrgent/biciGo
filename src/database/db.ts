import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import { PostgresDialect } from '@sequelize/postgres';
import { MsSqlDialect } from '@sequelize/mssql';
import { OracleDialect } from '@sequelize/oracle';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfigurations: Record<string, DatabaseConfig> = {
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_NAME || "test",
    port: parseInt(process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_NAME || "test",
    port: parseInt(process.env.POSTGRES_PORT || "5432")
  },
  mssql: {
    host: process.env.MSSQL_HOST || "localhost",
    username: process.env.MSSQL_USER || "sa",
    password: process.env.MSSQL_PASSWORD || "",
    database: process.env.MSSQL_NAME || "test",
    port: parseInt(process.env.MSSQL_PORT || "1433")
  },
  oracle: {
    host: process.env.ORACLE_HOST || "localhost",
    username: process.env.ORACLE_USER || "system",
    password: process.env.ORACLE_PASSWORD || "",
    database: process.env.ORACLE_SERVICE || "XE",
    port: parseInt(process.env.ORACLE_PORT || "1521")
  }
};

const selectedEngine = (process.env.DB_ENGINE || "mysql") as keyof typeof dbConfigurations;
const selectedConfig = dbConfigurations[selectedEngine];

if (!selectedConfig) {
  throw new Error(`Motor de base de datos no soportado: ${selectedEngine}`);
}

console.log(`🔌 Conectando a: ${selectedEngine.toUpperCase()}`);

let sequelize: Sequelize;

switch (selectedEngine) {
  case "oracle":
  sequelize = new Sequelize({
    dialect: OracleDialect,
    username: selectedConfig.username,
    password: selectedConfig.password,
    connectString: `${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
  break;

  case "mysql":
    sequelize = new Sequelize({
      dialect: MySqlDialect,
      url: `mysql://${selectedConfig.username}:${selectedConfig.password}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    });
    break;

  case "postgres":
    sequelize = new Sequelize({
      dialect: PostgresDialect,
      url: `postgres://${selectedConfig.username}:${selectedConfig.password}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    });
    break;

  case "mssql":
  sequelize = new Sequelize({
    dialect: MsSqlDialect,

    server: selectedConfig.host,
    port: selectedConfig.port,
    database: selectedConfig.database,

    authentication: {
      type: "default",
      options: {
        userName: selectedConfig.username,
        password: selectedConfig.password,
      },
    },

    // 👇 AQUÍ VA TODO (según docs)
    encrypt: true,
    trustServerCertificate: true,

    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
  break;

  default:
    throw new Error(`Dialecto no soportado: ${selectedEngine}`);
}

export { sequelize };

export const getDatabaseInfo = () => ({
  engine: selectedEngine,
  config: selectedConfig
});

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${selectedEngine.toUpperCase()}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error de conexión a ${selectedEngine.toUpperCase()}:`, error.message || error);
    return false;
  }
};