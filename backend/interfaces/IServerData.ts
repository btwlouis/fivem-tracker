export default interface IServerData {
    EndPoint: string;
    Data: {
      clients: number;
      gametype: string;
      hostname: string;
      mapname: string;
      sv_maxclients: number;
      enhancedHostSupport: boolean;
      requestSteamTicket: string;
      resources: string[];
      server: string;
      selfReportedClients: number;
      players: {
        endpoint: string;
        id: number;
        identifiers: string[];
        name: string;
        ping: number;
      }[];
      ownerID: number;
      private: boolean;
      fallback: boolean;
      connectEndPoints: string[];
      upvotePower: number;
      burstPower: number;
      support_status: string;
      svMaxclients: number; // Note: This field is repeated with different casing
      ownerName: string;
      ownerProfile: string;
      ownerAvatar: string;
      lastSeen: string;
      iconVersion: number;
      serverIconUrl: string;
    };
}