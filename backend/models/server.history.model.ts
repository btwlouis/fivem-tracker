import mongoose, { Schema } from "mongoose";
import IServerHistory from "../interfaces/IServerHistory";

const serverSchema = new Schema({
    EndPoint: String,
    clients: Number,
    timestamp: Number
});

export default mongoose.model<IServerHistory>("ServerHistory", serverSchema);