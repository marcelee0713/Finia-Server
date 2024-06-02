import { inject, injectable } from "inversify";
import {
  ITransaction,
  ITransactionRepository,
  ITransactionServiceInteractor,
  Transaction,
} from "../interfaces/transaction.interface";
import {
  SortOrder,
  TransactionReturnType,
  TransactionTypes,
  TransactionUseCases,
} from "../types/transaction.types";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class TransactionService implements ITransactionServiceInteractor {
  private repository: ITransactionRepository;
  private entity: ITransaction;

  constructor(
    @inject(INTERFACE_TYPE.TransactionRepository) repository: ITransactionRepository,
    @inject(INTERFACE_TYPE.TransactionEntity) transactionEntity: ITransaction
  ) {
    this.repository = repository;
    this.entity = transactionEntity;
  }

  async createTransaction(
    userId: string,
    type: TransactionTypes,
    amount: string,
    category: string,
    date?: string | undefined,
    note?: string | undefined
  ): Promise<Transaction> {
    try {
      this.entity.validate(amount, type, note);

      const formattedDate = this.entity.validateDate(date);

      const res = await this.repository.create(userId, type, amount, category, formattedDate, note);

      return res;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async getTransactions(
    userId: string,
    type?: string,
    category?: string,
    useCase?: string,
    skip?: string,
    take?: string,
    minAmount?: string,
    maxAmount?: string,
    amountOrder?: SortOrder,
    dateOrder?: SortOrder,
    noteOrder?: SortOrder
  ): Promise<TransactionReturnType<TransactionUseCases>> {
    try {
      if (type) this.entity.validateType(type);

      const transactions = await this.repository.get(
        userId,
        type as TransactionTypes,
        category,
        skip ? parseInt(skip) : undefined,
        take ? parseInt(take) : undefined,
        minAmount ? parseFloat(minAmount) : undefined,
        maxAmount ? parseFloat(maxAmount) : undefined,
        amountOrder,
        dateOrder,
        noteOrder
      );

      const object = this.entity.dto(transactions, useCase);

      return object;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async updateTransaction(
    uid: string,
    userId: string,
    amount?: string,
    type?: TransactionTypes,
    category?: string,
    date?: string,
    note?: string
  ): Promise<Transaction> {
    try {
      if (type) this.entity.validateType(type);

      if (amount) this.entity.validateAmount(amount);

      if (note) this.entity.validateNote(note);

      const formattedDate = this.entity.validateDate(date);

      const res = await this.repository.update(
        uid,
        userId,
        amount,
        type,
        category,
        formattedDate,
        note
      );

      return res;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async deleteTransaction(uid: string, userId: string): Promise<void> {
    try {
      await this.repository.delete(uid, userId);
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }
}
