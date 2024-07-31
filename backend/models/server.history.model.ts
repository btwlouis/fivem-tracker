import mongoose, { Schema } from "mongoose";
import IServerHistory from "../interfaces/IServerHistory";

const serverSchema = new Schema({
  id: { type: String, required: true },
  clients: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

export default mongoose.model<IServerHistory>("ServerHistory", serverSchema);
