export class User {
  private uid: string;
  private username: string;
  private email: string;
  private emailVerified: Date | null;
  private password: string;
  private role: string;
  private created_at: Date | null;

  constructor(
    uid: string,
    username: string,
    email: string,
    emailVerified: Date | null,
    password: string,
    role: string,
    created_at: Date | null
  ) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.emailVerified = emailVerified;
    this.password = password;
    this.role = role;
    this.created_at = created_at;
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

  getcreated_at = (): Date | null => this.created_at;

  setcreated_at = (date: Date) => {
    this.created_at = date;
  };

  validateUsername() {
    const minLength = 3;
    const maxLength = 50;
    const usernameRegex = /^[a-zA-Z]{2}[a-zA-Z0-9]*$/;

    if (this.username.length < minLength || this.username.length > maxLength) {
      throw new Error("invalid-username");
    }

    if (!usernameRegex.test(this.username)) {
      throw new Error("invalid-username");
    }
  }

  validatePassword() {
    const minLength = 8;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    if (this.password.length < minLength) {
      throw new Error("invalid-password");
    }

    if (!passwordRegex.test(this.password)) {
      throw new Error("invalid-password");
    }
  }

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(this.email)) {
      throw new Error("invalid-email");
    }
  }

  validateCreateUser(username?: string, email?: string, password?: string) {
    this.username = username ?? "";
    this.email = email ?? "";
    this.password = password ?? "";

    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
  }
}
