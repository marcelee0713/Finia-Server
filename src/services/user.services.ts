import { inject, injectable } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class UserService implements IUserServiceInteractor {
  private repository: IUserRepository;

  constructor(@inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository) {
    this.repository = repository;
  }

  async createUser(username: string, email: string, password: string): Promise<void> {
    return await this.repository.create(username, email, password);
  }
}
