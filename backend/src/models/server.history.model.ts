import { RowDataPacket } from "mysql2";

export default interface ServerHistory extends RowDataPacket {
  id: string;
  clients: number;
  timestamp: number;
}
