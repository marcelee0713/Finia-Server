export interface IUserServiceInteractor {
  createUser(username: string, email: string, password: string): Promise<void>;
}

export interface IUserRepository {
  create(username: string, email: string, password: string): Promise<void>;
}
