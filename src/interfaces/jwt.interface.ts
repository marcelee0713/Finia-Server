import {
  EmailAndResetPayloadType,
  ExpPayloadType,
  JWTParams,
  PayloadParams,
  PayloadType,
} from "../types/jwt.types";

export interface IJWTService {
  createToken({ uid, setId, tokenType }: JWTParams): string;
  getPayload({ token, tokenType }: PayloadParams): PayloadType | EmailAndResetPayloadType;
  getDecodedPayload({ token, tokenType }: PayloadParams): PayloadType | EmailAndResetPayloadType;
  getExpPayload(token: string): ExpPayloadType;
}
