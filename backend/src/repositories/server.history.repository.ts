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
    const { interval, unit } = parsePeriod(period);

    const query = buildQuery(unit);

    return new Promise((resolve, reject) => {
      connection.query<IServerHistory[]>(query, [id, interval], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

/**
 * Parse the period string into an interval (number) and unit (h or d).
 * @param period - The period string (e.g., '24h', '7d').
 * @returns An object containing the interval and unit.
 */
function parsePeriod(period: string): { interval: number; unit: string } {
  const match = period.match(/^(\d+)([hd])$/);

  if (!match) {
    throw new Error(
      "Invalid period format. Expected format: 'Xd' or 'Xh' where X is a number."
    );
  }

  const interval = parseInt(match[1], 10);
  const unit = match[2];

  return { interval, unit };
}

/**
 * Build the query string based on the unit (h or d).
 * @param unit - The unit of time ('h' for hours or 'd' for days).
 * @returns The query string for the SQL query.
 */
function buildQuery(unit: string): string {
  switch (unit) {
    case "d":
      return `SELECT * FROM server_history WHERE id = ? AND timestamp > DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY timestamp ASC`;
    case "h":
      return `SELECT * FROM server_history WHERE id = ? AND timestamp > DATE_SUB(NOW(), INTERVAL ? HOUR) ORDER BY timestamp ASC`;
    default:
      throw new Error("Invalid time unit. Use 'h' for hours or 'd' for days.");
  }
}

export default new ServerHistoryRepository();
