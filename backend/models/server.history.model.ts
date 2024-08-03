import mongoose, { Schema, Document } from "mongoose";
import IServerHistory from "../interfaces/IServerHistory";

const serverSchema = new Schema<IServerHistory>({
  id: { type: String, required: true },
  clients: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

const someRecentDate = new Date();
someRecentDate.setDate(someRecentDate.getDate() - 30);

serverSchema.index(
  { id: 1, timestamp: 1 },
  { partialFilterExpression: { timestamp: { $gte: someRecentDate } } }
);

export default mongoose.model<IServerHistory>("ServerHistory", serverSchema);
