import IServerHistory from "../interfaces/IServerHistory";
import ServerHistory from "../models/server.history.model";

export async function insert(serverHistory: IServerHistory) {
  await ServerHistory.create(serverHistory);
}

export async function deleteOld(id: string) {
  const currentTime = new Date().getTime();
  const oneMonthAgo = currentTime - 2592000000;

  await ServerHistory.deleteMany({ id: id, timestamp: { $lte: oneMonthAgo } });
}

export async function get(id: string, time: string) {
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

  const currentTime = new Date().getTime();
  const startTime = currentTime - timeInMs;

  // only return clients and timestamp
  return await ServerHistory.find(
    { id: id, timestamp: { $gte: startTime, $lte: currentTime } },
    { clients: 1, timestamp: 1 }
  );
}

export async function exists(id: string) {
  return await ServerHistory.exists({ id: id });
}

export default ServerHistory;
