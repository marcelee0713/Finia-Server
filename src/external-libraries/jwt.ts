import jwt from "jsonwebtoken";
import { TOKENS_LIFESPAN } from "../utils";
import { jwtParams, payloadParams, payloadType } from "../types/jwt.types";
import { IJWTService } from "../interfaces/jwt.interface";
import { injectable } from "inversify";

@injectable()
export class JWTServices implements IJWTService {
  private jwtClient: typeof jwt;

  constructor() {
    this.jwtClient = jwt;
  }
  getPayload({ token, tokenType }: payloadParams): payloadType {
    const secret =
      tokenType === "REFRESH"
        ? (process.env.REFRESH_TOKEN_SECRETKEY as string)
        : (process.env.ACCESS_TOKEN_SECRETKEY as string);

    try {
      const payload = this.jwtClient.verify(token, secret) as payloadType;

      return payload;
    } catch (err) {
      if (tokenType === "REFRESH") throw new Error("not-authorized");

      const payload = this.jwtClient.decode(token) as payloadType;

      return payload;
    }
  }

  createToken({ uid, setId, tokenType }: jwtParams): string {
    const secret =
      tokenType === "REFRESH"
        ? (process.env.REFRESH_TOKEN_SECRETKEY as string)
        : (process.env.ACCESS_TOKEN_SECRETKEY as string);

    const token = this.jwtClient.sign({ uid: uid, setId: setId }, secret, {
      expiresIn:
        tokenType === "REFRESH" ? TOKENS_LIFESPAN.RefreshToken : TOKENS_LIFESPAN.AccessToken,
    });

    return token;
  }
}
