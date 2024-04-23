import IServerData from "../interfaces/IServerData";
import Server from "../models/server.model";

export async function insertOrUpdate(serverData: IServerData) {
    const server = await Server.findOne({ "EndPoint": serverData.EndPoint });

    if (server) {
        return await Server.updateOne({ "EndPoint": serverData.EndPoint }, serverData);
    }

    await Server.create(serverData);
}

export async function getAll(amount: number = 2000) {
    // order by clients desc
    return await Server.find({}, { "EndPoint": 1, "Data.serverIconUrl": 1, "Data.hostname": 1, "Data.clients": 1, "Data.mapname": 1, "Data.gametype": 1, "Data.sv_maxclients": 1 })
        .sort({ "Data.clients": -1 })
        .limit(amount);
}

export async function get(endPoint: string) {
    return await Server.findOne({ "EndPoint": endPoint });
}

/*
    returns all players from all servers (count)
    returns all servers (count)

*/
export async function getStats() {
    const servers = await Server.find({}, { "EndPoint": 1, "Data.clients": 1, "Data.sv_maxclients": 1 });
    const players = servers.map(s => s.Data.clients).reduce((a, b) => a + b, 0);
    const maxPlayers = servers.map(s => s.Data.sv_maxclients).reduce((a, b) => a + b, 0);

    return {
        servers: servers.length,
        players,
        maxPlayers
    };
}
