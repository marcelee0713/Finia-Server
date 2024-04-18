export const INTERFACE_TYPE = {
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserInteractor"),
  UserController: Symbol.for("UserController"),
  UserMiddlewares: Symbol.for("UserMiddlewares"),
  JWTServices: Symbol.for("JWTServices"),
  EmailServices: Symbol.for("EmailServices"),
};

export const TOKENS_LIFESPAN = {
  RefreshToken: "30d",
  AccessToken: "10m",
  EmailToken: "1d",
};

export const DEFAULT_EMAIL_CONTENT = {
  Name: "Finia",
  Subject: "Finia Email Verification",
  Text: "An email verification for Finia!",
};
