import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  CreateTransactionReqBody,
  GetTransactionReqBody,
  ITransactionServiceInteractor,
  UpdateTransactionReqBody,
} from "../interfaces/transaction.interface";
import { INTERFACE_TYPE } from "../utils";
import { handleError } from "../utils/error-handler";
import { ErrorType } from "../types/error.types";

@injectable()
export class TransactionController {
  private interactor: ITransactionServiceInteractor;

  constructor(
    @inject(INTERFACE_TYPE.TransactionService) interactor: ITransactionServiceInteractor
  ) {
    this.interactor = interactor;
  }

  async onCreateTransaction(req: Request, res: Response) {
    try {
      const reqObj: CreateTransactionReqBody = {
        body: {
          userId: res.locals.uid,
          ...req.body,
        },
      };

      const obj = await this.interactor.createTransaction({ ...reqObj.body });

      return res.status(200).json(obj);
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err.message as ErrorType);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onGetTransaction(req: Request, res: Response) {
    try {
      const reqObj: GetTransactionReqBody = {
        body: {
          userId: res.locals.uid,
          ...req.body,
        },
      };

      const transactions = await this.interactor.getTransactions({ ...reqObj.body });

      return res.status(transactions ? 200 : 204).json(transactions ?? {});
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err.message as ErrorType);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onUpdateTransaction(req: Request, res: Response) {
    try {
      const reqObj: UpdateTransactionReqBody = {
        body: {
          userId: res.locals.uid,
          ...req.body,
        },
      };

      const obj = await this.interactor.updateTransaction({ ...reqObj.body });

      return res.status(200).json(obj);
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err.message as ErrorType);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onDeleteTransaction(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const userId = res.locals.uid;

      await this.interactor.deleteTransaction(uid, userId);

      return res.status(200).json({ res: "Successfully deleted your transaction!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err.message as ErrorType);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
