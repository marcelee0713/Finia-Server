import { inject, injectable } from "inversify";
import { IUser, IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { IJWTService } from "../interfaces/jwt.interface";
import { INTERFACE_TYPE } from "../utils";
import { generateSetId } from "../utils/set-id-generator";
import { EmailAndResetPayloadType, PayloadType } from "../types/jwt.types";
import { ErrorType } from "../types/error.types";

@injectable()
export class UserService implements IUserServiceInteractor {
  private repository: IUserRepository;
  private auth: IJWTService;
  private entity: IUser;

  constructor(
    @inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository,
    @inject(INTERFACE_TYPE.JWTServices) auth: IJWTService,
    @inject(INTERFACE_TYPE.UserEntity) entity: IUser
  ) {
    this.auth = auth;
    this.repository = repository;
    this.entity = entity;
  }

  async verifyEmailAddress(token: string): Promise<void> {
    try {
      const payload = this.auth.getPayload({
        token: token,
        tokenType: "EMAIL",
      }) as EmailAndResetPayloadType;

      const isTokenBlacklisted = await this.repository.checkTokenInBlacklist(payload.uid, token);

      if (isTokenBlacklisted) throw new Error("blacklisted-token" as ErrorType);

      await this.repository.verifyEmail(payload.uid, payload.email);

      await this.repository.addTokenToBlacklist(payload.uid, token);
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async emailVerificationRequest(
    username: string,
    token: string
  ): Promise<{ uid: string; email: string }> {
    try {
      let user = {
        uid: "",
        email: "",
      };

      if (!username && !token) throw new Error("invalid-request" as ErrorType);

      if (username && !token) {
        const data = await this.repository.getUserData({ username, useCases: ["DEFAULT"] });

        if (data.emailVerified) throw new Error("user-already-verified" as ErrorType);

        user = {
          email: data.email,
          uid: data.uid,
        };

        return user;
      } else {
        const payload = this.auth.getDecodedPayload({
          token: token,
          tokenType: "EMAIL",
        }) as EmailAndResetPayloadType;

        user = payload;
      }

      const data = await this.repository.getUserData({ ...user, useCases: ["DEFAULT"] });

      if (data.emailVerified) throw new Error("user-already-verified" as ErrorType);

      return user;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async createUser(username: string, email: string, password: string): Promise<string> {
    this.entity.validate(username, email, password);

    const uid = await this.repository.create(username, email, password);

    return uid;
  }

  async logInUser(username: string, password: string): Promise<string> {
    try {
      const data = await this.repository.getUserData({
        username,
        password,
        useCases: ["LOGIN", "VERIFY_EMAIL"],
      });

      const setId = generateSetId();

      const refreshToken = this.auth.createToken({
        uid: data.uid,
        setId: setId,
        tokenType: "REFRESH",
      });

      await this.repository.setSession(data.uid, setId, refreshToken);

      const accessToken = this.auth.createToken({
        uid: data.uid,
        setId: setId,
        tokenType: "ACCESS",
      });

      return accessToken;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async logOutUser(token: string): Promise<void> {
    try {
      const data = this.auth.getPayload({ token: token, tokenType: "ACCESS" }) as PayloadType;

      await this.repository.addTokenToBlacklist(data.uid, token);

      await this.repository.removeSession(data.uid, data.setId);
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async resetPasswordRequest(email: string): Promise<string> {
    try {
      this.entity.validateEmail(email);

      const data = await this.repository.getUserData({ email, useCases: ["DEFAULT"] });

      const token = this.auth.createToken({ uid: data.uid, email: email, tokenType: "PASSRESET" });

      return token;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async resetPassword(newPassword: string, token: string): Promise<void> {
    try {
      this.entity.validatePassword(newPassword);

      const payload = this.auth.getPayload({
        token: token,
        tokenType: "PASSRESET",
      }) as EmailAndResetPayloadType;

      const isTokenBlacklisted = await this.repository.checkTokenInBlacklist(payload.uid, token);

      if (isTokenBlacklisted) throw new Error("blacklisted-token" as ErrorType);

      await this.repository.changePassword(payload.uid, newPassword);

      await this.repository.addTokenToBlacklist(payload.uid, token);
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async changePassword(uid: string, newPassword: string): Promise<void> {
    try {
      this.entity.validatePassword(uid);

      await this.repository.changePassword(uid, newPassword);
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async getPassword(uid: string): Promise<string> {
    try {
      const data = await this.repository.getUserData({ uid, useCases: ["DEFAULT"] });

      return data.password;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }
}
