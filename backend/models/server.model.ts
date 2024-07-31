import mongoose, { Schema } from "mongoose";
import {
  IServerView,
  ServerViewDetailsLevel,
  IServerViewPlayer,
  ServerPureLevel,
} from "../utils/types";

export enum SupportStatus {
  Supported = "supported",
  EndOfSupport = "end_of_support",
  EndOfLife = "end_of_life",
  Unknown = "unknown",
}

const serverViewPlayerSchema = new Schema<IServerViewPlayer>({
  endpoint: { type: String, required: true },
  id: { type: Number, required: true },
  identifiers: { type: [String], required: true },
  name: { type: String, required: true },
  ping: { type: Number, required: true },
});

const serverSchema = new Schema<IServerView>({
  id: { type: String, required: true, unique: true },
  locale: { type: String, required: true },
  localeCountry: { type: String, required: true },
  hostname: { type: String, required: false },
  projectName: { type: String },
  rawVariables: { type: Map, of: String, required: true },
  joinId: { type: String },
  historicalAddress: { type: String },
  historicalIconURL: { type: String, default: null },
  connectEndPoints: [{ type: String }],
  projectDescription: { type: String },
  upvotePower: { type: Number },
  burstPower: { type: Number },
  offline: { type: Boolean, default: false },
  iconVersion: { type: Number, default: null },
  licenseKeyToken: { type: String, default: null },
  mapname: { type: String, default: null },
  gametype: { type: String, default: null },
  gamename: { type: String, default: null },
  fallback: { type: Schema.Types.Mixed },
  private: { type: Boolean },
  scriptHookAllowed: { type: Boolean },
  enforceGameBuild: { type: String },
  pureLevel: {
    type: String,
    enum: Object.values(ServerPureLevel),
  },
  premium: {
    type: String,
    enum: [null, "pt", "au", "ag"],
    default: null,
  },
  bannerConnecting: { type: String },
  bannerDetail: { type: String },
  canReview: { type: Boolean },
  ownerID: { type: String },
  ownerName: { type: String },
  ownerAvatar: { type: String },
  ownerProfile: { type: String },
  activitypubFeed: { type: String },
  onesyncEnabled: { type: Boolean },
  server: { type: String, default: null },
  supportStatus: {
    type: String,
    enum: Object.values(SupportStatus),
  },
  playersMax: { type: Number },
  playersCurrent: { type: Number },
  tags: [{ type: String }],
  players: [serverViewPlayerSchema], // Reference to player schema
  resources: [{ type: String }],
  variables: { type: Map, of: String },
});

export default mongoose.model<IServerView>("Server", serverSchema);
