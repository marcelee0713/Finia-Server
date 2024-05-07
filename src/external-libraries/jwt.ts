import jwt from "jsonwebtoken";
import { TOKENS_LIFESPAN } from "../utils";
import {
  emailAndResetPayloadType,
  jwtParams,
  payloadParams,
  payloadType,
  resetPassPayloadType,
} from "../types/jwt.types";
import { IJWTService } from "../interfaces/jwt.interface";
import { injectable } from "inversify";

@injectable()
export class JWTServices implements IJWTService {
  private jwtClient: typeof jwt;

  constructor() {
    this.jwtClient = jwt;
  }

  getDecodedPayload({ token, tokenType }: payloadParams): payloadType | emailAndResetPayloadType {
    if (tokenType === "EMAIL" || tokenType === "PASSRESET") {
      const payload = this.jwtClient.decode(token) as emailAndResetPayloadType;

      return payload;
    }

    const payload = this.jwtClient.decode(token) as payloadType;

    const expiredPayload: payloadType = {
      ...payload,
      expired: true,
    };

    return expiredPayload;
  }

  getPayload({ token, tokenType }: payloadParams): payloadType | resetPassPayloadType {
    const secret =
      tokenType === "REFRESH"
        ? (process.env.REFRESH_TOKEN_SECRETKEY as string)
        : (process.env.ACCESS_TOKEN_SECRETKEY as string);

    const emailSecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;
    const passwordResetSecret = process.env.PASSWORD_RESET_SECRETKEY as string;

    try {
      const payload =
        tokenType === "EMAIL" || tokenType === "PASSRESET"
          ? (this.jwtClient.verify(
              token,
              tokenType === "EMAIL" ? emailSecret : passwordResetSecret
            ) as resetPassPayloadType)
          : (this.jwtClient.verify(token, secret) as payloadType);

      return payload;
    } catch (err) {
      if (tokenType === "REFRESH") throw new Error("not-authorized");

      if (tokenType === "EMAIL") throw new Error("invalid-email-verification");

      if (tokenType === "PASSRESET") throw new Error("invalid-password-reset-request");

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

    const emailSecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;
    const passwordResetSecret = process.env.PASSWORD_RESET_SECRETKEY as string;

    const token =
      tokenType === "EMAIL" || tokenType === "PASSRESET"
        ? this.jwtClient.sign(
            { uid: uid, email: email },
            tokenType === "EMAIL" ? emailSecret : passwordResetSecret,
            {
              expiresIn: TOKENS_LIFESPAN.EmailAndResetPassToken,
            }
          )
        : this.jwtClient.sign({ uid: uid, setId: setId }, secret, {
            expiresIn:
              tokenType === "REFRESH" ? TOKENS_LIFESPAN.RefreshToken : TOKENS_LIFESPAN.AccessToken,
          });

    return token;
  }
}
