import { RowDataPacket, ResultSetHeader, OkPacket } from "mysql2";

import connection from "../database";
import IServerHistory from "../models/server.history.model";

interface IServerHistoryRepository {
  save(tutorial: IServerHistory): Promise<IServerHistory>;
}

class ServerHistoryRepository implements IServerHistoryRepository {
  save(server: IServerHistory): Promise<IServerHistory> {
    return new Promise((resolve, reject) => {
      connection.query<OkPacket>(
        "INSERT INTO server_history (id, clients) VALUES (?,?)",
        [server.id, server.clients],
        (err, res) => {
          if (err) reject(err);
          else resolve;
        }
      );
    });
  }

  async retrieveById(id: string, period: string): Promise<IServerHistory[]> {
    if (!period) period = "30";
    period = period.replace("d", "") || "30";

    const query: string = `SELECT * FROM server_history WHERE id = ? AND timestamp > DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY timestamp ASC`;

    return new Promise((resolve, reject) => {
      connection.query<IServerHistory[]>(query, [id, period], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default new ServerHistoryRepository();
