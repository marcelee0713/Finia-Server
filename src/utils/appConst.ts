export const INTERFACE_TYPE = {
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserInteractor"),
  UserController: Symbol.for("UserController"),
  JWTServices: Symbol.for("JWTServices"),
};

export const TOKENS_LIFESPAN = {
  RefreshToken: "30d",
  AccessToken: "10m",
};
