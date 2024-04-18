import { Request, Response, NextFunction } from "express";
import { handleError } from "../utils/error-handler";
import { IUserRepository } from "../interfaces/user.interface";
import { IJWTService } from "../interfaces/jwt.interface";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { payloadType } from "../types/jwt.types";

@injectable()
export class UserMiddlewares {
  private userRepo: IUserRepository;
  private jwt: IJWTService;

  constructor(
    @inject(INTERFACE_TYPE.UserRepository) userRepo: IUserRepository,
    @inject(INTERFACE_TYPE.JWTServices) jwt: IJWTService
  ) {
    this.userRepo = userRepo;
    this.jwt = jwt;
  }

  async handleReq(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies.token;

      if (accessToken === undefined) throw new Error("not-authorized");

      const payload = this.jwt.getPayload({
        token: accessToken,
        tokenType: "ACCESS",
      }) as payloadType;

      if (!payload.expired) return next();

      const refreshToken = await this.userRepo.checkSession(payload.uid, payload.setId);

      this.jwt.getPayload({ token: refreshToken, tokenType: "REFRESH" });

      const newAccessToken = this.jwt.createToken({
        uid: payload.uid,
        setId: payload.setId,
        tokenType: "ACCESS",
      });

      res.locals.newToken = newAccessToken;

      return next();
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(errObj.status).json({ error: errObj.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
