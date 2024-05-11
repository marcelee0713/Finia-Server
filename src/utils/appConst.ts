export const INTERFACE_TYPE = {
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserInteractor"),
  UserController: Symbol.for("UserController"),
  UserMiddlewares: Symbol.for("UserMiddlewares"),
  UserEntity: Symbol.for("UserEntity"),
  TransactionRepository: Symbol.for("TransactionRepository"),
  TransactionService: Symbol.for("TransactionService"),
  TransactionController: Symbol.for("TransactionController"),
  TransactionEntity: Symbol.for("TransactionEntity"),
  JWTServices: Symbol.for("JWTServices"),
  EmailServices: Symbol.for("EmailServices"),
};

export const TOKENS_LIFESPAN = {
  RefreshToken: "30d",
  AccessToken: "10m",
  EmailAndResetPassToken: "1d",
};

export const DEFAULT_EMAIL_CONTENT = {
  Name: "Finia",
  Subject: "Finia Email Verification",
  Text: "An email verification for Finia!",
};

export const DEFAULT_RESET_PASS_CONTENT = {
  Name: "Finia",
  Subject: "Finia Reset Password",
  Text: "A request for resetting your password in Finia!",
};
