import express from "express";
import { UserController } from "../controllers/user.controller";
import { validateUserCreateBody } from "../middlewares/user.middleware";
import { createUserBodySchema } from "../schemas/user.schemas";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.services";

const userRepository = new UserRepository();
const userInteractor = new UserService(userRepository);
const userController = new UserController(userInteractor);

const userRouter = express.Router();

userRouter.post(
  "/create",
  validateUserCreateBody(createUserBodySchema),
  userController.onCreateUser.bind(userController)
);

export default userRouter;
