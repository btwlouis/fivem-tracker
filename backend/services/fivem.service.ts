import { decodeServer } from "../utils/api";
import { Deferred } from "../utils/async";
import { fetcher } from "../utils/fetcher";
import { FrameReader } from "../utils/frameReader";
import { masterListServerData2ServerView } from "../utils/transformers";
import { IServerView } from "../utils/types";

const BASE_URL = "https://servers-frontend.fivem.net/api/servers";
const ALL_SERVERS_URL = `${BASE_URL}/streamRedir/`;
const SINGLE_SERVER_URL = `${BASE_URL}/single/`;
const TOP_SERVER_URL = `${BASE_URL}/top/`;

export enum GameName {
  FiveM = "gta5",
  RedM = "rdr3",
  LibertyM = "ny",

  Launcher = "launcher",
}

async function readBodyToServers(
  gameName: GameName,
  onServer: (server: IServerView) => void,
  body: ReadableStream<Uint8Array>
): Promise<void> {
  const deferred = new Deferred<void>();

  let decodeTime = 0;
  let transformTime = 0;
  let onServerTime = 0;

  const frameReader = new FrameReader(
    body,
    (frame) => {
      let timestamp = performance.now();
      const srv = decodeServer(frame);
      decodeTime += performance.now() - timestamp;

      if (srv.EndPoint && srv.Data) {
        const serverGameName = srv.Data?.vars?.gamename || GameName.FiveM;

        if (gameName === serverGameName) {
          timestamp = performance.now();
          const serverView = masterListServerData2ServerView(
            srv.EndPoint,
            srv.Data
          );
          transformTime += performance.now() - timestamp;

          timestamp = performance.now();
          onServer(serverView);
          onServerTime += performance.now() - timestamp;
        }
      }

      decodeTime += performance.now() - timestamp;
    },
    deferred.resolve
  );

  frameReader.read();

  await deferred.promise;

  console.log(
    "Times: decode",
    decodeTime,
    "ms, transform",
    transformTime,
    "ms, onServer",
    onServerTime,
    "ms"
  );
}

export async function fetchServers(
  gameName: GameName,
  onServer: (server: IServerView) => void
) {
  console.time("Total fetchServers");

  const { body } = await fetcher.fetch(new Request(ALL_SERVERS_URL));

  if (!body) {
    console.timeEnd("Total getAllServers");
    throw new Error("Empty body of all servers stream");
  }

  await readBodyToServers(gameName, onServer, body);

  console.timeEnd("Total getAllServers");
}
