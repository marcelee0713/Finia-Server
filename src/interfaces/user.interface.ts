import { User } from "../models/user.model";

export interface IUserServiceInteractor {
  createUser(username: string, email: string, password: string): Promise<User>;
}

export interface IUserRepository {
  create(username: string, email: string, password: string): Promise<User>;
}
