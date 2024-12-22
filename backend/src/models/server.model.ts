import { RowDataPacket } from "mysql2";

export interface IServerViewPlayer {
  endpoint: string;
  id: number;
  identifiers: string[];
  name: string;
  ping: number;
}

export default interface Server extends RowDataPacket {
  id: string;
  locale: string;
  localeCountry: string;
  hostname: string;
  joinId: string;
  projectName: string;
  projectDescription: string;
  upvotePower: number;
  burstPower: number;
  mapname: string;
  gametype: string;
  gamename: string;
  private: boolean;
  scriptHookAllowed: boolean;
  enforceGameBuild: string;
  bannerConnecting: string;
  bannerDetail: string;
  server: string;
  playersMax: number;
  playersCurrent: number;
  tags: string[];
  players: IServerViewPlayer[];
  resources: string[];
}
