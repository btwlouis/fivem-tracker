import mongoose, { Schema } from "mongoose";
import IServerData from "../interfaces/IServerData";

const serverSchema = new Schema({
    EndPoint: String,
    Data: {
        clients: Number,
        gametype: String,
        hostname: String,
        mapname: String,
        sv_maxclients: Number,
        enhancedHostSupport: Boolean,
        requestSteamTicket: String,
        resources: [String],
        server: String,
        selfReportedClients: Number,
        players: [
        {
            endpoint: String,
            id: Number,
            identifiers: [String],
            name: String,
            ping: Number
        }
        ],
        ownerID: Number,
        private: Boolean,
        fallback: Boolean,
        connectEndPoints: [String],
        upvotePower: Number,
        burstPower: Number,
        support_status: String,
        svMaxclients: Number,
        ownerName: String,
        ownerProfile: String,
        ownerAvatar: String,
        lastSeen: String,
        iconVersion: Number,
        serverIconUrl: String
    }
});

export default mongoose.model<IServerData>("Server", serverSchema);