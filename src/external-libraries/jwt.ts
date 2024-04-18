import jwt from "jsonwebtoken";
import { TOKENS_LIFESPAN } from "../utils";
import { emailPayloadType, jwtParams, payloadParams, payloadType } from "../types/jwt.types";
import { IJWTService } from "../interfaces/jwt.interface";
import { injectable } from "inversify";

@injectable()
export class JWTServices implements IJWTService {
  private jwtClient: typeof jwt;

  constructor() {
    this.jwtClient = jwt;
  }

  getPayload({ token, tokenType }: payloadParams): payloadType | emailPayloadType {
    const secret =
      tokenType === "REFRESH"
        ? (process.env.REFRESH_TOKEN_SECRETKEY as string)
        : (process.env.ACCESS_TOKEN_SECRETKEY as string);

    const emailSecret = `${process.env.REFRESH_TOKEN_SECRETKEY as string}${process.env.ACCESS_TOKEN_SECRETKEY as string}`;

    try {
      const payload =
        tokenType === "EMAIL"
          ? (this.jwtClient.verify(token, emailSecret) as emailPayloadType)
          : (this.jwtClient.verify(token, secret) as payloadType);

      return payload;
    } catch (err) {
      if (tokenType === "REFRESH") throw new Error("not-authorized");

      if (tokenType === "EMAIL") throw new Error("invalid-email-verification");

      const payload = this.jwtClient.decode(token) as payloadType;

      const expiredPayload: payloadType = {
        ...payload,
        expired: true,
      };

      return expiredPayload;
    }
  }

  createToken({ uid, setId, tokenType, email }: jwtParams): string {
    const secret =
      tokenType === "REFRESH"
        ? (process.env.REFRESH_TOKEN_SECRETKEY as string)
        : (process.env.ACCESS_TOKEN_SECRETKEY as string);

    const emailSecret = `${process.env.REFRESH_TOKEN_SECRETKEY as string}${process.env.ACCESS_TOKEN_SECRETKEY as string}`;

    const token =
      tokenType === "EMAIL"
        ? this.jwtClient.sign({ uid: uid, email: email }, emailSecret, {
            expiresIn: TOKENS_LIFESPAN.EmailToken,
          })
        : this.jwtClient.sign({ uid: uid, setId: setId }, secret, {
            expiresIn:
              tokenType === "REFRESH" ? TOKENS_LIFESPAN.RefreshToken : TOKENS_LIFESPAN.AccessToken,
          });

    return token;
  }
}
