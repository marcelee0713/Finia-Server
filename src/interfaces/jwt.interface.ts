import { emailPayloadType, jwtParams, payloadParams, payloadType } from "../types/jwt.types";

export interface IJWTService {
  createToken({ uid, setId, tokenType }: jwtParams): string;
  getPayload({ token, tokenType }: payloadParams): payloadType | emailPayloadType;
}
