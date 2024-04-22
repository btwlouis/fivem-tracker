import axios from "axios";
import * as Server from "../services/server.service";
import * as ServerHistory from "../services/server.history.service";

import IServerData from "../interfaces/IServerData";
import IServerHistory from "../interfaces/IServerHistory";
import IServer from "../interfaces/IServer";


var cachedServers: IServer[] = [];

const BASE_URL = "https://servers-frontend.fivem.net/api/servers";
const ALL_SERVERS_URL = `${BASE_URL}/streamRedir/`;
const SINGLE_SERVER_URL = `${BASE_URL}/single/`;

export async function fetchServers() {
    const date = new Date().getTime();
    const data = await axios.get(ALL_SERVERS_URL);
  
    const regex =
    /\x0A\x06(?:(?! *locale).)*(?<id>[a-z0-9]{6})\x12([^]*?)?(?<ip>(?:\d{1,3}\.){3}\d{1,3}:\d{1,5})/gim;
  
    for (const match of data.data.matchAll(regex)) {
        cachedServers.push({ id: match.groups.id, ip: match.groups.ip });
    }
  
    console.log("Total servers:", cachedServers.length);

    const delay = Number(process.env.DELAY_FIVEM_REQUESTS) || 1000;
    console.log("Delay between requests:", delay);

    const finishDate = new Date(Date.now() + cachedServers.length * delay);
    console.log("Estimated finish date:", finishDate);

    await updateServers(date)
}

export async function updateServers(date: number) {
    const delay = Number(process.env.DELAY_FIVEM_REQUESTS) || 1000;

    for (const server of cachedServers) {
        await new Promise((r) => setTimeout(r, delay));
        const serverData = await fetchServer(server.id);
        
        if (!serverData) {
            console.log("Failed to fetch server data for", server.id);
            cachedServers = cachedServers.filter((s) => s.id !== server.id);
            continue;
        }

        console.log("Getting server data from", serverData.EndPoint);
        serverData.Data.serverIconUrl = `https://servers-live.fivem.net/servers/icon/${serverData.EndPoint}/${serverData.Data.iconVersion}.png`;

        // update or insert server to mongodb
        Server.insertOrUpdate(serverData);

        // insert server history
        const serverHistory: IServerHistory = {
            EndPoint: serverData.EndPoint,
            clients: serverData.Data.clients,
            timestamp: date
        }
        await ServerHistory.insert(serverHistory);
    }
    
    await updateServers(date);
}

export async function fetchServer(id: string) {
    // add header because CF blocks requests without user-agent
    var headers = {	'Content-Type': 'application/json',	'Accept-Encoding': 'gzip', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'};

    try {
        const data = await axios.get(SINGLE_SERVER_URL + id, { headers: headers });
        
        if(data.status !== 200)
            throw new Error("Failed to fetch server data");

        const serverData: IServerData = data.data;

        if (!serverData)
            throw new Error("Failed to fetch server data");
    
        const variables = data.data.Data.vars;

        for(const [key, value] of Object.entries(variables)) {
            if ((value as string).includes("de-DE")) {
                return serverData;
            }
        }
    } catch (error) {
        console.log("Error fetching server data");
        await new Promise((r) => setTimeout(r, 5000));
    }

    return null;
}