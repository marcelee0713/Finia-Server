import { inject, injectable } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { IJWTService } from "../interfaces/jwt.interface";
import { INTERFACE_TYPE } from "../utils";
import { generateSetId } from "../utils/set-id-generator";
import { emailAndResetPayloadType, payloadType } from "../types/jwt.types";
import { User } from "../models/user.model";

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

  async verifyEmailAddress(uid: string, email: string, token: string): Promise<void> {
    try {
      this.userEntity.setEmail(email);

      this.userEntity.validateEmail();

      const payload = this.auth.getPayload({
        token: token,
        tokenType: "EMAIL",
      }) as emailAndResetPayloadType;

      if (uid !== payload.uid) throw new Error("uid-mismatch");

      const isTokenBlacklisted = await this.repository.checkTokenInBlacklist(uid, token);

      if (isTokenBlacklisted) throw new Error("blacklisted-token");

      await this.repository.verifyEmail(payload.uid, payload.email, email);

      await this.repository.addTokenToBlacklist(uid, token);
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

      if (!username && !token) throw new Error("invalid-request");

      if (username && !token) {
        const data = await this.repository.getUidAndEmailByUsername(username);

        user = data;
      } else {
        const payload = this.auth.getDecodedPayload({
          token: token,
          tokenType: "EMAIL",
        }) as emailAndResetPayloadType;

        user = payload;
      }

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
      const uid = await this.repository.getUid(username, password);

      const setId = generateSetId();

      const refreshToken = this.auth.createToken({ uid: uid, setId: setId, tokenType: "REFRESH" });

      await this.repository.setSession(uid, setId, refreshToken);

      const accessToken = this.auth.createToken({ uid: uid, setId: setId, tokenType: "ACCESS" });

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
      const data = this.auth.getPayload({ token: token, tokenType: "ACCESS" }) as payloadType;

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

      const uid = await this.repository.getUidByEmail(email);

      const token = this.auth.createToken({ uid: uid, email: email, tokenType: "PASSRESET" });

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
      }) as emailAndResetPayloadType;

      const isTokenBlacklisted = await this.repository.checkTokenInBlacklist(payload.uid, token);

      if (isTokenBlacklisted) throw new Error("blacklisted-token");

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
      return await this.repository.getPassword(uid);
    } catch (err) {
      if (err instanceof Error) {
        throw Error(err.message);
      }

      throw Error("Internal server error");
    }
  }
}
