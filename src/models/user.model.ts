export class User {
  private uid: string;
  private username: string;
  private email: string;
  private emailVerified: Date | null;
  private password: string;
  private role: string;
  private createdAt: Date;

  constructor(
    uid: string,
    username: string,
    email: string,
    emailVerified: Date | null,
    password: string,
    role: string,
    createdAt: Date
  ) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.emailVerified = emailVerified;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }

  getUid = (): string => this.uid;

  setUid = (uid: string) => {
    this.uid = uid;
  };

  getUsername = (): string => this.username;

  setUsername = (username: string) => {
    this.username = username;
  };

  getEmail = (): string => this.email;

  setEmail = (email: string) => {
    this.email = email;
  };

  isEmailVerified = (): boolean => (this.emailVerified ? true : false);

  setEmailVerified = (date: Date) => {
    this.emailVerified = date;
  };

  getPassword = (): string => this.password;

  setPassword = (hashedPassword: string) => {
    this.password = hashedPassword;
  };

  getRole = (): string => this.role;

  setRole = (role: string) => {
    this.role = role;
  };

  getCreatedAt = (): Date => this.createdAt;

  setCreatedAt = (date: Date) => {
    this.createdAt = date;
  };

  isPasswordMatch = (password: string): boolean => this.password === password;
}
