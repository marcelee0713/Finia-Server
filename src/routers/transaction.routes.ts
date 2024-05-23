import express from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { TransactionController } from "../controllers/transaction.controller";
import {
  ITransaction,
  ITransactionRepository,
  ITransactionServiceInteractor,
} from "../interfaces/transaction.interface";
import { TransactionRepository } from "../repositories/transaction.repository";
import { TransactionService } from "../services/transaction.services";
import { validateBody } from "../middlewares/req.middleware";
import {
  createSchema,
  deleteSchema,
  getSchema,
  updateSchema,
} from "../schemas/transaction.schemas";
import {
  transactionCUDRateLimit,
  transactionReadRateLimit,
} from "../middlewares/rate-limiter/transaction.rate.limit";
import { Transaction } from "../models/transaction.model";
import { middleware } from "./user.routes";

export const container = new Container();

container.bind<ITransaction>(INTERFACE_TYPE.TransactionEntity).to(Transaction);

container
  .bind<ITransactionRepository>(INTERFACE_TYPE.TransactionRepository)
  .to(TransactionRepository);

container
  .bind<ITransactionServiceInteractor>(INTERFACE_TYPE.TransactionService)
  .to(TransactionService);

container.bind(INTERFACE_TYPE.TransactionController).to(TransactionController);

const transactionRouter = express.Router();

const controller = container.get<TransactionController>(INTERFACE_TYPE.TransactionController);

transactionRouter.post(
  "/create",
  transactionCUDRateLimit,
  (req, res, next) => middleware.handleReq(req, res, next),
  validateBody(createSchema),
  controller.onCreateTransaction.bind(controller)
);

transactionRouter
  .route("/")
  .post(
    transactionReadRateLimit,
    (req, res, next) => middleware.handleReq(req, res, next),
    validateBody(getSchema),
    controller.onGetTransaction.bind(controller)
  )
  .patch(
    transactionCUDRateLimit,
    (req, res, next) => middleware.handleReq(req, res, next),
    validateBody(updateSchema),
    controller.onUpdateTransaction.bind(controller)
  )
  .delete(
    transactionCUDRateLimit,
    (req, res, next) => middleware.handleReq(req, res, next),
    validateBody(deleteSchema),
    controller.onDeleteTransaction.bind(controller)
  );

export default transactionRouter;
