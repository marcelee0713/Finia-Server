import {
  IUserRepository,
  IUserServiceInteractor,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

export class UserService implements IUserServiceInteractor {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    return await this.repository.create(username, email, password);
  }
}
