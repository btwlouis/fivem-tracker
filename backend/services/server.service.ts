import { IServer, IServerView } from "../utils/types";
import Server from "../models/server.model";

export async function insertOrUpdate(serverData: IServerView) {
  const server = await Server.findOne({ id: serverData.id });

  if (server) {
    server.set(serverData);
    await server.save();
  } else {
    await Server.create(serverData);
  }
}

export async function getAll(amount: number = 300) {
  // order by clients desc
  return await Server.find(
    {},
    {
      id: 1,
      connectEndPoints: 1,
      hostname: 1,
      playersCurrent: 1,
      playersMax: 1,
      mapname: 1,
      historicalIconURL: 1,
      iconVersion: 1,
      joinId: 1,
      gametype: 1,
    }
  )
    .sort({ playersCurrent: -1 })
    .limit(amount);
}

export async function get(id: string) {
  return await Server.findOne({ id: id });
}

// /*
//     returns all players from all servers (count)
//     returns all servers (count)
// */
// export async function getStats() {
//   const servers = await Server.find(
//     {},
//     { EndPoint: 1, "Data.clients": 1, "Data.sv_maxclients": 1 }
//   );
//   const players = servers.map((s) => s.Data.clients).reduce((a, b) => a + b, 0);
//   const maxPlayers = servers
//     .map((s) => s.Data.sv_maxclients)
//     .reduce((a, b) => a + b, 0);

//   return {
//     servers: servers.length,
//     players,
//     maxPlayers,
//   };
// }
