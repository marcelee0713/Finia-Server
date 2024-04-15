import { inject, injectable } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { IJWTService } from "../interfaces/jwt.interface";
import { INTERFACE_TYPE } from "../utils";
import { generateSetId } from "../utils/set-id-generator";

@injectable()
export class UserService implements IUserServiceInteractor {
  private repository: IUserRepository;
  private auth: IJWTService;

  constructor(
    @inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository,
    @inject(INTERFACE_TYPE.JWTServices) auth: IJWTService
  ) {
    this.auth = auth;
    this.repository = repository;
  }

  async createUser(username: string, email: string, password: string): Promise<void> {
    return await this.repository.create(username, email, password);
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
}
