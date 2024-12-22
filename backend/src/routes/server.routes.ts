import { Router } from "express";
import ServerController from "../controllers/server.controller";

class ServerRoutes {
  router = Router();
  controller = new ServerController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/servers", this.controller.findAll);
    this.router.get("/server/:id", this.controller.findOne);
    this.router.get("/server/:id/history/:period", this.controller.findHistory);
  }
}

export default new ServerRoutes().router;
