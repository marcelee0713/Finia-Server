export type jwtParams = {
  tokenType?: "REFRESH" | "ACCESS" | "EMAIL";
  uid: string;
  setId?: string;
  email?: string;
};

export type payloadType = {
  uid: string;
  setId: string;
  expired?: boolean;
};

export type emailPayloadType = {
  uid: string;
  email: string;
};

export type payloadParams = {
  token: string;
  tokenType: "REFRESH" | "ACCESS" | "EMAIL";
};
