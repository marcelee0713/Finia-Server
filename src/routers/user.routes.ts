import express from "express";
import { Container } from "inversify";
import { IUser, IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { INTERFACE_TYPE } from "../utils";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.services";
import { UserController } from "../controllers/user.controller";
import {
  changePasswordSchema,
  createSchema,
  emailVerifyReqSchema,
  loginSchema,
  passwordResetReqSchema,
  passwordResetSchema,
  verifyEmailSchema,
} from "../schemas/user.schemas";
import { IJWTService } from "../interfaces/jwt.interface";
import { ISchedulerService } from "../interfaces/cron.interface";
import { IEmailService } from "../interfaces/nodemailer.interface";
import { JWTServices } from "../external-libraries/jwt";
import { validateBody } from "../middlewares/req.middleware";
import { UserMiddlewares } from "../middlewares/user.middleware";
import { EmailServices } from "../external-libraries/nodemailer";
import { SchedulerServices } from "../external-libraries/scheduler";
import {
  createAccountRateLimit,
  emailAndPassVerifyingRateLimit,
  emailAndPasswordVerificationRequestRateLimit,
  getUserDataRateLimit,
  loginAndOutRateLimit,
  passwordModificationRateLimit,
} from "../middlewares/rate-limiter/user.rate.limit";
import { User } from "../models/user.model";

export const container = new Container();
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);
container.bind<IUserServiceInteractor>(INTERFACE_TYPE.UserService).to(UserService);
container.bind(INTERFACE_TYPE.UserController).to(UserController);
container.bind(INTERFACE_TYPE.UserMiddlewares).to(UserMiddlewares);
container.bind<IJWTService>(INTERFACE_TYPE.JWTServices).to(JWTServices);
container.bind<IEmailService>(INTERFACE_TYPE.EmailServices).to(EmailServices);
container.bind<ISchedulerService>(INTERFACE_TYPE.SchedulerServices).to(SchedulerServices);
container.bind<IUser>(INTERFACE_TYPE.UserEntity).to(User);

const userRouter = express.Router();

const scheduler = container.get<ISchedulerService>(INTERFACE_TYPE.SchedulerServices);
const controller = container.get<UserController>(INTERFACE_TYPE.UserController);
export const middleware = container.get<UserMiddlewares>(INTERFACE_TYPE.UserMiddlewares);

userRouter.get(
  "/",
  getUserDataRateLimit,
  (req, res, next) => middleware.handleReq(req, res, next),
  controller.onGetUserData.bind(controller)
);

userRouter.post(
  "/create",
  createAccountRateLimit,
  validateBody(createSchema),
  controller.onCreateUser.bind(controller)
);

userRouter.post(
  "/login",
  loginAndOutRateLimit,
  validateBody(loginSchema),
  controller.onLogin.bind(controller)
);

userRouter.delete(
  "/logout",
  loginAndOutRateLimit,
  (req, res, next) => middleware.handleReq(req, res, next),
  controller.onLogout.bind(controller)
);

userRouter.get(
  "/get-password",
  passwordModificationRateLimit,
  (req, res, next) => middleware.handleReq(req, res, next),
  controller.onGetPassword.bind(controller)
);

userRouter.patch(
  "/change-password",
  passwordModificationRateLimit,
  (req, res, next) => middleware.handleReq(req, res, next),
  validateBody(changePasswordSchema),
  controller.onChangePassword.bind(controller)
);

userRouter.post(
  "/verify-email",
  emailAndPassVerifyingRateLimit,
  validateBody(verifyEmailSchema),
  controller.onVerifyEmail.bind(controller)
);

userRouter.post(
  "/req-email-verification",
  emailAndPasswordVerificationRequestRateLimit,
  validateBody(emailVerifyReqSchema),
  controller.onEmailVerificationReq.bind(controller)
);

userRouter.patch(
  "/reset-password",
  emailAndPassVerifyingRateLimit,
  validateBody(passwordResetSchema),
  controller.onPasswordReset.bind(controller)
);

userRouter.post(
  "/req-reset-password",
  emailAndPasswordVerificationRequestRateLimit,
  validateBody(passwordResetReqSchema),
  controller.onPasswordResetReq.bind(controller)
);

scheduler.execute().catch((error) => {
  console.error("Failed to execute scheduler:", error);
});

export default userRouter;
