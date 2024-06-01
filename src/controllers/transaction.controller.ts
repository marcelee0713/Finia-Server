import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ITransactionServiceInteractor } from "../interfaces/transaction.interface";
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
      const userId = req.body.userId;
      const type = req.body.type;
      const amount = req.body.amount;
      const category = req.body.category;
      const note: string | undefined = req.body.note;

      await this.interactor.createTransaction(userId, type, amount, category, note);

      return res.status(200).json({ res: "Successfully created a transaction!" });
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
      const userId = res.locals.uid;
      const type = req.body.type;
      const category = req.body.category;
      const useCase = req.body.useCase;
      const skip = req.body.skip;
      const take = req.body.take;
      const minAmount = req.body.minAmount;
      const maxAmount = req.body.maxAmount;
      const amountOrder = req.body.amountOrder;
      const dateOrder = req.body.dateOrder;
      const noteOrder = req.body.noteOrder;

      const transactions = await this.interactor.getTransactions(
        userId,
        type,
        category,
        useCase,
        skip,
        take,
        minAmount,
        maxAmount,
        amountOrder,
        dateOrder,
        noteOrder
      );

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
      const uid = req.body.uid;
      const userId = req.body.userId;
      const type: string | undefined = req.body.type;
      const amount: string | undefined = req.body.amount;
      const category: string | undefined = req.body.category;
      const note: string | undefined = req.body.note;

      await this.interactor.updateTransaction(uid, userId, amount, type, category, note);

      return res.status(200).json({ res: "Successfully updated your transaction!" });
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
      const userId = req.body.userId;

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
