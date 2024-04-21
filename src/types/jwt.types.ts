export type jwtParams = {
  tokenType?: "REFRESH" | "ACCESS" | "EMAIL" | "PASSRESET";
  uid: string;
  setId?: string;
  email?: string;
};

export type payloadType = {
  uid: string;
  setId: string;
  expired?: boolean;
};

export type emailAndResetPayloadType = {
  uid: string;
  email: string;
};

export type resetPassPayloadType = {
  uid: string;
};

export type payloadParams = {
  token: string;
  tokenType: "REFRESH" | "ACCESS" | "EMAIL" | "PASSRESET";
};
