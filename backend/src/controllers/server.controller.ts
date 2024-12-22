import { Request, Response } from "express";
import Server from "../models/server.model";
import serverRepository from "../repositories/server.repository";
import serverHistoryRepository from "../repositories/server.history.repository";

export default class ServerController {
  async findAll(req: Request, res: Response) {
    try {
      const servers = await serverRepository.retrieveAll();

      res.status(200).send(servers);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving servers.",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = String(req.params.id);

    try {
      const server = await serverRepository.retrieveById(id);

      if (!server) {
        return res.status(404).send({ message: "Server not found" });
      }

      res.status(200).send(server);
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving server with id=" + id,
      });
    }
  }

  async findHistory(req: Request, res: Response) {
    const id: string = String(req.params.id);
    const period: string = String(req.params.period);

    try {
      const server = await serverHistoryRepository.retrieveById(id, period);

      if (!server) {
        return res.status(404).send({ message: "Server history not found" });
      }

      res.status(200).send(server);
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving server history with id=" + id,
      });
    }
  }
}
