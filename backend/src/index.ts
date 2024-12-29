import express, { Application } from "express";
import cors, { CorsOptions } from "cors";

var cron = require("node-cron");

import { config } from "dotenv";
config();

import { getServers } from "./services/fivem.service";
import Routes from "./routes/index";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: process.env.FRONTEND_URL,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    this.startCronJob();
  }

  private startCronJob(): void {
    cron.schedule("*/5 * * * *", async () => {
      try {
        await getServers();
      } catch (error) {
        console.error("Error updating servers:", error);
      }
    });
  }
}
