import dotenv from "dotenv";
import express, { type Application } from "express";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Las rutas se configurarán más adelante
  }

  private async dbConnection(): Promise<void> {
    // Conexion, configuracion y sincronizar BD
  }

  listen() {
  this.app.listen(this.app.get('port'), () => {
    console.log(
      `🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`
    );
  });
}
}
