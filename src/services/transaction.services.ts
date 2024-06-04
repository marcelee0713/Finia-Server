import { inject, injectable } from "inversify";
import {
  ITransaction,
  ITransactionRepository,
  ITransactionServiceInteractor,
} from "../interfaces/transaction.interface";
import {
  CreateTransactionsParams,
  GetTransactionsParams,
  Transaction,
  TransactionReturnType,
  TransactionUseCases,
  UpdateTransactionParams,
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

  async createTransaction(params: CreateTransactionsParams): Promise<Transaction> {
    try {
      const result = this.entity.createValidation(params);

      const data = await this.repository.create(result);

      return data;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async getTransactions(
    params: GetTransactionsParams
  ): Promise<TransactionReturnType<TransactionUseCases>> {
    try {
      const result = this.entity.getValidation(params);

      const data = await this.repository.get(result);

      const object = this.entity.dto(data, params.useCase);

      return object;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async updateTransaction(params: UpdateTransactionParams): Promise<Transaction> {
    try {
      const result = this.entity.updateValidation(params);

      const data = await this.repository.update(result);

      return data;
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
