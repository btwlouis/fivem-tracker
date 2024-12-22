import express, { Application } from "express";
import cors, { CorsOptions } from "cors";

var cron = require("node-cron");

// import { fetchServers, GameName } from "../services/fivem.service";

// import * as Server from "../services/server.service";
// import * as ServerHistory from "../services/server.history.service";

import { config } from "dotenv";
config();

// app.get("/servers", (req: any, res: any) => {
//   Server.getAll()
//     .then((servers) => {
//       res.send(servers);
//     })
//     .catch((error) => {
//       console.log("Error fetching servers", error);
//       res.status(500).send("Error fetching servers");
//     });
// });

// app.get("/server/:id", (req: any, res: any) => {
//   Server.get(req.params.id)
//     .then((server) => {
//       res.send(server);
//     })
//     .catch((error) => {
//       console.log("Error fetching server", error);
//       res.status(500).send("Error fetching server");
//     });
// });

// app.get("/server/:id/history/:period", (req: any, res: any) => {
//   ServerHistory.get(req.params.id, req.params.period)
//     .then((history) => {
//       res.send(history);
//     })
//     .catch((error) => {
//       console.log("Error fetching server history", error);
//       res.status(500).send("Error fetching server history");
//     });
// });

//app.get("/stats", (req: any, res: any) => {
// Server.getStats()
//   .then((stats) => {
//     res.send(stats);
//   })
//   .catch((error) => {
//     console.log("Error fetching stats", error);
//     res.status(500).send("Error fetching stats");
//   });
//});

//getServers();

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

    console.log("frontend", process.env.FRONTEND_URL);

    //app.use(cors(corsOptions));
    //app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));

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
