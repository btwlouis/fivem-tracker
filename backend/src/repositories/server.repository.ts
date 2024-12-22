import { OkPacket } from "mysql2";
import connection from "../database";
import IServer from "../models/server.model";

interface IServerRepository {
  save(tutorial: IServer): Promise<IServer>;
  retrieveAll(): Promise<IServer[]>;
  retrieveById(id: string): Promise<IServer>;
}

class ServerRepository implements IServerRepository {
  retrieveAll(): Promise<IServer[]> {
    let timestamp = performance.now();

    let query: string =
      "SELECT *, ROW_NUMBER() OVER (ORDER BY playersCurrent DESC) AS rank FROM servers ORDER BY playersCurrent DESC";

    return new Promise((resolve, reject) => {
      connection.query<IServer[]>(query, (err, res) => {
        console.log(
          "Time to fetch servers",
          performance.now() - timestamp,
          "ms"
        );
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  save(server: IServer): Promise<IServer> {
    return new Promise((resolve, reject) => {
      connection.query<OkPacket>(
        "INSERT INTO servers (id, locale, localeCountry, hostname, joinId, projectName, projectDescription, upvotePower, burstPower, mapname, gametype, gamename, private, scriptHookAllowed, enforceGameBuild, bannerConnecting, bannerDetail, server, playersMax, playersCurrent, iconVersion, tags, resources, players) " +
          "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) " +
          "ON DUPLICATE KEY UPDATE " +
          "locale = VALUES(locale), " +
          "localeCountry = VALUES(localeCountry), " +
          "hostname = VALUES(hostname), " +
          "joinId = VALUES(joinId), " +
          "projectName = VALUES(projectName), " +
          "projectDescription = VALUES(projectDescription), " +
          "upvotePower = VALUES(upvotePower), " +
          "burstPower = VALUES(burstPower), " +
          "mapname = VALUES(mapname), " +
          "gametype = VALUES(gametype), " +
          "gamename = VALUES(gamename), " +
          "private = VALUES(private), " +
          "scriptHookAllowed = VALUES(scriptHookAllowed), " +
          "enforceGameBuild = VALUES(enforceGameBuild), " +
          "bannerConnecting = VALUES(bannerConnecting), " +
          "bannerDetail = VALUES(bannerDetail), " +
          "server = VALUES(server), " +
          "playersMax = VALUES(playersMax), " +
          "playersCurrent = VALUES(playersCurrent), " +
          "iconVersion = VALUES(iconVersion), " +
          "tags = VALUES(tags), " +
          "resources = VALUES(resources), " +
          "players = VALUES(players)",
        [
          server.id,
          server.locale,
          server.localeCountry,
          server.hostname,
          server.joinId,
          server.projectName,
          server.projectDescription,
          server.upvotePower,
          server.burstPower,
          server.mapname,
          server.gametype,
          server.gamename,
          server.private,
          server.scriptHookAllowed,
          server.enforceGameBuild,
          server.bannerConnecting,
          server.bannerDetail,
          server.server,
          server.playersMax,
          server.playersCurrent,
          server.iconVersion,
          JSON.stringify(server.tags),
          JSON.stringify(server.resources),
          JSON.stringify(server.players),
        ],
        (err, res) => {
          if (err) reject(err);
          else resolve;
        }
      );
    });
  }

  async retrieveById(id: string): Promise<IServer> {
    let query: string = "SELECT * FROM servers WHERE id = ?";

    return new Promise((resolve, reject) => {
      connection.query<IServer[]>(query, [id], (err, res) => {
        if (err) reject(err);
        else resolve(res?.[0]);
      });
    });
  }
  async deleteOldServers() {
    let query: string =
      "DELETE FROM servers WHERE updated_at < NOW() - INTERVAL 30 DAY";

    return new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}

export default new ServerRepository();
