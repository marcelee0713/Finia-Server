export interface IUserServiceInteractor {
  createUser(username: string, email: string, password: string): Promise<string>;
  logInUser(username: string, password: string): Promise<string>;
  verifyEmailAddress(uid: string, email: string): Promise<void>;
}

export interface IUserRepository {
  create(username: string, email: string, password: string): Promise<string>;
  getUid(username: string, password: string): Promise<string>;
  setSession(uid: string, setId: string, refreshToken: string): Promise<void>;
  checkSession(uid: string, setId: string): Promise<string>;
  verifyEmail(uid: string, email: string): Promise<void>;
}
