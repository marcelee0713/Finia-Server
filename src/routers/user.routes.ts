import express from "express";
import { Container } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { INTERFACE_TYPE } from "../utils";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.services";
import { UserController } from "../controllers/user.controller";
import {
  changePasswordSchema,
  createSchema,
  loginSchema,
  passwordResetReqSchema,
  passwordResetSchema,
  verifyEmailSchema,
} from "../schemas/user.schemas";
import { IJWTService } from "../interfaces/jwt.interface";
import { JWTServices } from "../external-libraries/jwt";
import { validateBody } from "../middlewares/req.middleware";
import { UserMiddlewares } from "../middlewares/user.middleware";
import { IEmailService } from "../interfaces/nodemailer.interface";
import { EmailServices } from "../external-libraries/nodemailer";

export const container = new Container();
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);
container.bind<IUserServiceInteractor>(INTERFACE_TYPE.UserService).to(UserService);
container.bind(INTERFACE_TYPE.UserController).to(UserController);
container.bind(INTERFACE_TYPE.UserMiddlewares).to(UserMiddlewares);
container.bind<IJWTService>(INTERFACE_TYPE.JWTServices).to(JWTServices);
container.bind<IEmailService>(INTERFACE_TYPE.EmailServices).to(EmailServices);

const userRouter = express.Router();

const controller = container.get<UserController>(INTERFACE_TYPE.UserController);
const middleware = container.get<UserMiddlewares>(INTERFACE_TYPE.UserMiddlewares);

userRouter.post("/create", validateBody(createSchema), controller.onCreateUser.bind(controller));

userRouter.post("/login", validateBody(loginSchema), controller.onLogin.bind(controller));

userRouter.delete(
  "/logout",
  (req, res, next) => middleware.handleReq(req, res, next),
  controller.onLogout.bind(controller)
);

userRouter.get("/get-password", (req, res, next) => middleware.handleReq(req, res, next)),
  controller.onGetPassword.bind(controller);

userRouter.patch(
  "/change-password",
  (req, res, next) => middleware.handleReq(req, res, next),
  validateBody(changePasswordSchema),
  controller.onChangePassword.bind(controller)
);

userRouter.post(
  "/verify-email",
  validateBody(verifyEmailSchema),
  controller.onVerifyEmail.bind(controller)
);

userRouter.patch(
  "/reset-password",
  validateBody(passwordResetSchema),
  controller.onPasswordReset.bind(controller)
);

userRouter.post(
  "/req-reset-password",
  validateBody(passwordResetReqSchema),
  controller.onPasswordResetReq.bind(controller)
);

userRouter.post("/middlewareTest", (req, res, next) => middleware.handleReq(req, res, next));

export default userRouter;
