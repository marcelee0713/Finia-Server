import { inject, injectable } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { IJWTService } from "../interfaces/jwt.interface";
import { INTERFACE_TYPE } from "../utils";
import { generateSetId } from "../utils/set-id-generator";
import { EmailAndResetPayloadType, PayloadType } from "../types/jwt.types";
import { User } from "../models/user.model";
import { ErrorType } from "../types/error.types";

@injectable()
export class UserService implements IUserServiceInteractor {
  private repository: IUserRepository;
  private auth: IJWTService;
  private userEntity: User;

  constructor(
    @inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository,
    @inject(INTERFACE_TYPE.JWTServices) auth: IJWTService
  ) {
    this.auth = auth;
    this.repository = repository;
    this.userEntity = new User("", "", "", null, "", "", null);
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

        if (data._emailVerified) throw new Error("user-already-verified" as ErrorType);

        user = {
          email: data._email,
          uid: data._uid,
        };
      } else {
        const payload = this.auth.getDecodedPayload({
          token: token,
          tokenType: "EMAIL",
        }) as EmailAndResetPayloadType;

        user = payload;
      }

      const data = await this.repository.getUserData({ ...user, useCases: ["DEFAULT"] });

      if (data._emailVerified) throw new Error("user-already-verified" as ErrorType);

      return user;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }

  async createUser(username: string, email: string, password: string): Promise<string> {
    this.userEntity.validateCreateUser(username, email, password);

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
        uid: data._uid,
        setId: setId,
        tokenType: "REFRESH",
      });

      await this.repository.setSession(data._uid, setId, refreshToken);

      const accessToken = this.auth.createToken({
        uid: data._uid,
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
      this.userEntity.setEmail(email);

      this.userEntity.validateEmail();

      const data = await this.repository.getUserData({ email, useCases: ["DEFAULT"] });

      const token = this.auth.createToken({ uid: data._uid, email: email, tokenType: "PASSRESET" });

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
      this.userEntity.setPassword(newPassword);

      this.userEntity.validatePassword();

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
      this.userEntity.setPassword(newPassword);

      this.userEntity.validatePassword();

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

      return data._password;
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }
}
