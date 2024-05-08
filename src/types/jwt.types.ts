export interface JWTParams {
  tokenType?: TokenType;
  uid: string;
  setId?: string;
  email?: string;
}

export interface PayloadType {
  uid: string;
  setId: string;
  expired?: boolean;
}

export interface EmailAndResetPayloadType {
  uid: string;
  email: string;
}

export type TokenType = "REFRESH" | "ACCESS" | "EMAIL" | "PASSRESET";

export interface PayloadParams {
  token: string;
  tokenType: TokenType;
}
