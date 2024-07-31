import express from "express";
import mongoose from "mongoose";
var cron = require("node-cron");

import { fetchServers, GameName } from "./services/fivem.service";

import * as Server from "./services/server.service";
import * as ServerHistory from "./services/server.history.service";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/fivem-tracker";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

import { config } from "dotenv";
config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/servers", (req: any, res: any) => {
  Server.getAll()
    .then((servers) => {
      res.send(servers);
    })
    .catch((error) => {
      console.log("Error fetching servers", error);
      res.status(500).send("Error fetching servers");
    });
});

app.get("/server/:id", (req: any, res: any) => {
  Server.get(req.params.id)
    .then((server) => {
      res.send(server);
    })
    .catch((error) => {
      console.log("Error fetching server", error);
      res.status(500).send("Error fetching server");
    });
});

app.get("/server/:id/history/:period", (req: any, res: any) => {
  ServerHistory.get(req.params.id, req.params.period)
    .then((history) => {
      res.send(history);
    })
    .catch((error) => {
      console.log("Error fetching server history", error);
      res.status(500).send("Error fetching server history");
    });
});

app.get("/stats", (req: any, res: any) => {
  // Server.getStats()
  //   .then((stats) => {
  //     res.send(stats);
  //   })
  //   .catch((error) => {
  //     console.log("Error fetching stats", error);
  //     res.status(500).send("Error fetching stats");
  //   });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

async function getServers() {
  await fetchServers(GameName.FiveM, async (server) => {
    if (server.locale !== "de-DE") {
      return;
    }

    await ServerHistory.insert({
      id: server.id,
      clients: server.playersCurrent || 0,
      timestamp: new Date(),
    });

    await Server.insertOrUpdate(server);
  });

  console.log("Servers updated");
}

cron.schedule("*/5 * * * *", async () => {
  await getServers();
});
