import express from "express";
import { Container } from "inversify";
import { IUserRepository, IUserServiceInteractor } from "../interfaces/user.interface";
import { INTERFACE_TYPE } from "../utils";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.services";
import { UserController } from "../controllers/user.controller";
import { validateBody } from "../middlewares/user.middleware";
import { createUserBodySchema } from "../schemas/user.schemas";

const container = new Container();
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);
container.bind<IUserServiceInteractor>(INTERFACE_TYPE.UserService).to(UserService);
container.bind(INTERFACE_TYPE.UserController).to(UserController);

const userRouter = express.Router();

const controller = container.get<UserController>(INTERFACE_TYPE.UserController);

userRouter.post(
  "/create",
  validateBody(createUserBodySchema),
  controller.onCreateUser.bind(controller)
);

export default userRouter;
