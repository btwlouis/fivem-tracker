import IServerHistory from "../interfaces/IServerHistory";
import ServerHistory from "../models/server.history.model";

export async function insert(serverHistory: IServerHistory) {
    await ServerHistory.create(serverHistory);
}

export async function get(endPoint: string, time: string) {
    // time can be 1d 7d or 30d. convert it to milliseconds
    let timeInMs = 0;

    switch (time) {
        case "1d":
            timeInMs = 86400000;
            break;
        case "7d":
            timeInMs = 604800000;
            break;
        case "30d":
            timeInMs = 2592000000;
            break;
    }


    const currentTime = new Date().getTime()
    const startTime = currentTime - timeInMs;

    // only return clients and timestamp
    return await ServerHistory.find({ "EndPoint": endPoint, "timestamp": { $gte: startTime, $lte: currentTime } }, { "clients": 1, "timestamp": 1 });
}