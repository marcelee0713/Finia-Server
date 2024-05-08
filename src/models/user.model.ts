import { IUser } from "../interfaces/user.interface";

export class User implements IUser {
  _uid: string;
  _username: string;
  _email: string;
  _emailVerified: Date | null;
  _password: string;
  _role: string;
  _created_at: Date | null;

  constructor(
    _uid: string,
    _username: string,
    _email: string,
    _emailVerified: Date | null,
    _password: string,
    _role: string,
    _created_at: Date | null
  ) {
    this._uid = _uid;
    this._username = _username;
    this._email = _email;
    this._emailVerified = _emailVerified;
    this._password = _password;
    this._role = _role;
    this._created_at = _created_at;
  }

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

  isEmailVerified = (): boolean => (this._emailVerified ? true : false);

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

  getcreated_at = (): Date | null => this._created_at;

  setcreated_at = (date: Date) => {
    this._created_at = date;
  };

  validateUsername() {
    const minLength = 3;
    const maxLength = 50;
    const _usernameRegex = /^[a-zA-Z]{2}[a-zA-Z0-9]*$/;

    if (this._username.length < minLength || this._username.length > maxLength) {
      throw new Error("invalid-_username");
    }

    if (!_usernameRegex.test(this._username)) {
      throw new Error("invalid-_username");
    }
  }

  validatePassword() {
    const minLength = 8;
    const _passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    if (this._password.length < minLength) {
      throw new Error("invalid-_password");
    }

    if (!_passwordRegex.test(this._password)) {
      throw new Error("invalid-_password");
    }
  }

  validateEmail() {
    const _emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!_emailRegex.test(this._email)) {
      throw new Error("invalid-_email");
    }
  }

  validateCreateUser(_username?: string, _email?: string, _password?: string) {
    this._username = _username ?? "";
    this._email = _email ?? "";
    this._password = _password ?? "";

    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
  }
}
