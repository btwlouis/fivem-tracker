import { Application } from "express";
import homeRoutes from "./home.routes";
import serverRoutes from "./server.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", homeRoutes);
    app.use("/api", serverRoutes);
  }
}
