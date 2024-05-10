import jwt from "jsonwebtoken";
import { TOKENS_LIFESPAN } from "../utils";
import {
  EmailAndResetPayloadType,
  JWTParams,
  PayloadParams,
  PayloadType,
} from "../types/jwt.types";
import { IJWTService } from "../interfaces/jwt.interface";
import { injectable } from "inversify";
import { ErrorType } from "../types/error.types";

@injectable()
export class JWTServices implements IJWTService {
  private jwtClient: typeof jwt;

  constructor() {
    this.jwtClient = jwt;
  }

  getDecodedPayload({ token, tokenType }: PayloadParams): PayloadType | EmailAndResetPayloadType {
    if (tokenType === "EMAIL" || tokenType === "PASSRESET") {
      const payload = this.jwtClient.decode(token) as EmailAndResetPayloadType;

      return payload;
    }

    const payload = this.jwtClient.decode(token) as PayloadType;

    const expiredPayload: PayloadType = {
      ...payload,
      expired: true,
    };

    return expiredPayload;
  }

  getPayload({ token, tokenType }: PayloadParams): PayloadType | EmailAndResetPayloadType {
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
            ) as EmailAndResetPayloadType)
          : (this.jwtClient.verify(token, secret) as PayloadType);

      return payload;
    } catch (err) {
      if (tokenType === "REFRESH") throw new Error("not-authorized" as ErrorType);

      if (tokenType === "EMAIL") throw new Error("invalid-email-verification" as ErrorType);

      if (tokenType === "PASSRESET") throw new Error("invalid-password-reset-request" as ErrorType);

      const payload = this.jwtClient.decode(token) as PayloadType;

      const expiredPayload: PayloadType = {
        ...payload,
        expired: true,
      };

      return expiredPayload;
    }
  }

  createToken({ uid, setId, tokenType, email }: JWTParams): string {
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
