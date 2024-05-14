import { UserParams, UserType } from "../types/user.types";
import { ExcludeFunctions, ExcludeUnderscores } from "../utils/type-modifications";

export interface IUser {
  _uid: string;
  _username: string;
  _email: string;
  _emailVerified: Date | null;
  _password: string;
  _role: string;
  _createdAt: Date;
  getUid: () => string;
  setUid: (uid: string) => void;
  getUsername: () => string;
  setUsername: (username: string) => void;
  getEmail: () => string;
  setEmail: (email: string) => void;
  getEmailVerifiedDate: () => Date | null;
  isEmailVerifiedDate: () => boolean;
  setEmailVerified: (date: Date) => void;
  getPassword: () => string;
  setPassword: (password: string) => void;
  getRole: () => string;
  setRole: (type: UserType) => void;
  getCreatedAt: () => Date;
  setCreatedAt: (date: Date) => void;
  validateEmail: (email: string) => void;
  validatePassword: (password: string) => void;
  validateUsername: (username: string) => void;
  validate: (username: string, email: string, password: string) => void;
}

interface INonFuncUser extends ExcludeFunctions<IUser> {}

export type UserObject = ExcludeUnderscores<INonFuncUser>;

export type PasswordLessUserObject = Omit<UserObject, "password">;

export interface IUserServiceInteractor {
  createUser(username: string, email: string, password: string): Promise<string>;
  logInUser(username: string, password: string): Promise<string>;
  logOutUser(token: string): Promise<void>;
  emailVerificationRequest(
    username: string,
    token: string
  ): Promise<{ uid: string; email: string }>;
  verifyEmailAddress(token: string): Promise<void>;
  resetPasswordRequest(email: string): Promise<string>;
  resetPassword(newPassword: string, token: string, shouldLogOut: boolean): Promise<void>;
  changePassword(uid: string, newPassword: string, shouldLogOut: boolean): Promise<void>;
  getPassword(uid: string): Promise<string>;
  getUserData(uid: string): Promise<PasswordLessUserObject>;
}

export interface IUserRepository {
  create(username: string, email: string, password: string): Promise<string>;
  getUserData(data: UserParams): Promise<UserObject>;
  setSession(uid: string, setId: string, refreshToken: string): Promise<void>;
  checkSession(uid: string, setId: string): Promise<string>;
  removeSession(uid: string, setId: string): Promise<void>;
  verifyEmail(uid: string, email: string): Promise<void>;
  checkTokenInBlacklist(uid: string, token: string): Promise<boolean>;
  addTokenToBlacklist(uid: string, token: string): Promise<void>;
  changePassword(uid: string, newPassword: string, shouldLogOut: boolean): Promise<void>;
}
