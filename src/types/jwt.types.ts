export type jwtParams = {
  tokenType: "REFRESH" | "ACCESS";
  uid: string;
  setId: string;
};

export type payloadType = {
  uid: string;
  setId: string;
};

export type payloadParams = {
  token: string;
  tokenType: "REFRESH" | "ACCESS";
};
