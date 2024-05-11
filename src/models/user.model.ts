import { injectable } from "inversify";
import { IUser } from "../interfaces/user.interface";
import { ErrorType } from "../types/error.types";

@injectable()
export class User implements IUser {
  _uid!: string;
  _username!: string;
  _email!: string;
  _emailVerified!: Date | null;
  _password!: string;
  _role!: string;
  _createdAt!: Date;

  getUid = (): string => this._uid;

  setUid = (_uid: string) => {
    this._uid = _uid;
  };

  getUsername = (): string => this._username;

  setUsername = (_username: string) => {
    this._username = _username;
  };

  getEmail = (): string => this._email;

  setEmail = (_email: string) => {
    this._email = _email;
  };

  getEmailVerifiedDate = (): Date | null => this._emailVerified;

  setEmailVerified = (date: Date) => {
    this._emailVerified = date;
  };

  getPassword = (): string => this._password;

  setPassword = (_hashedPassword: string) => {
    this._password = _hashedPassword;
  };

  getRole = (): string => this._role;

  setRole = (_role: string) => {
    this._role = _role;
  };

  getCreatedAt = (): Date => this._createdAt;

  setCreatedAt = (date: Date) => {
    this._createdAt = date;
  };

  isEmailVerifiedDate = (): boolean => this._emailVerified !== null;

  validateUsername(username: string) {
    const minLength = 3;
    const maxLength = 50;
    const _usernameRegex = /^[a-zA-Z]{2}[a-zA-Z0-9]*$/;

    if (username.length < minLength || username.length > maxLength) {
      throw new Error("invalid-username" as ErrorType);
    }

    if (!_usernameRegex.test(username)) {
      throw new Error("invalid-username" as ErrorType);
    }
  }

  validatePassword(password: string) {
    const minLength = 8;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    if (password.length < minLength) {
      throw new Error("invalid-password" as ErrorType);
    }

    if (!passwordRegex.test(password)) {
      throw new Error("invalid-password" as ErrorType);
    }
  }

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("invalid-email" as ErrorType);
    }
  }

  validate(username: string, email: string, password: string) {
    this.validateUsername(username);
    this.validateEmail(email);
    this.validatePassword(password);
  }
}
