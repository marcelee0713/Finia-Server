import { UserParams } from "../types/user.types";

export interface IUser {
  _uid: string;
  _username: string;
  _email: string;
  _emailVerified: Date | null;
  _password: string;
  _role: string;
  _created_at: Date | null;
}

export interface IUserServiceInteractor {
  createUser(username: string, email: string, password: string): Promise<string>;
  logInUser(username: string, password: string): Promise<string>;
  logOutUser(token: string): Promise<void>;
  emailVerificationRequest(
    username: string,
    token: string
  ): Promise<{ uid: string; email: string }>;
  verifyEmailAddress(uid: string, email: string, token: string): Promise<void>;
  resetPasswordRequest(email: string): Promise<string>;
  resetPassword(newPassword: string, token: string): Promise<void>;
  changePassword(uid: string, newPassword: string): Promise<void>;
  getPassword(uid: string): Promise<string>;
}

export interface IUserRepository {
  create(username: string, email: string, password: string): Promise<string>;
  getUserData(data: UserParams): Promise<IUser>;
  setSession(uid: string, setId: string, refreshToken: string): Promise<void>;
  checkSession(uid: string, setId: string): Promise<string>;
  removeSession(uid: string, setId: string): Promise<void>;
  verifyEmail(uid: string, email: string, emailFromReq: string): Promise<void>;
  checkTokenInBlacklist(uid: string, token: string): Promise<boolean>;
  addTokenToBlacklist(uid: string, token: string): Promise<void>;
  changePassword(uid: string, newPassword: string): Promise<void>;
}
