import { master } from "./master.js";

export function decodeServer(frame: Uint8Array): master.IServer {
  return master.Server.decode(frame);
}
