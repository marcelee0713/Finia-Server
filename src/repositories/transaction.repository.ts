import { injectable } from "inversify";
import {
  ITransactionRepository,
  Transaction,
  TransactionData,
} from "../interfaces/transaction.interface";
import { SortOrder, TransactionTypes } from "../types/transaction.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../db/db.server";
import { ErrorType } from "../types/error.types";
import { skipAndTake, skipArr, takeArr } from "../utils/skip_and_take";

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = db;
  }

  async create(
    userId: string,
    type: TransactionTypes,
    amount: string | number,
    category: string,
    note?: string | undefined
  ): Promise<void> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: userId,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      const _category = await this.prismaClient.categories.findFirst({
        where: {
          category: category,
          transaction_type: type,
        },
      });

      if (!_category) throw new Error("category-does-not-exist" as ErrorType);

      await this.prismaClient.transactions.create({
        data: {
          user_id: user.uid,
          category_id: _category.uid,
          amount: amount,
          type: type,
          note: note && note,
        },
      });
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async get(
    userId: string,
    type?: TransactionTypes,
    category?: string,
    skip?: number,
    take?: number,
    minAmount?: number,
    maxAmount?: number,
    amountOrder?: SortOrder,
    dateOrder?: SortOrder,
    noteOrder?: SortOrder
  ): Promise<TransactionData> {
    let filteredLength = "0";
    let length = "0";

    let transactions = [];

    try {
      const _category =
        category &&
        (await this.prismaClient.categories.findFirst({
          where: {
            category: category,
          },
        }));

      if (category && !_category) {
        throw new Error("category-does-not-exist" as ErrorType);
      }

      transactions = await this.prismaClient.transactions.findMany({
        where: {
          user_id: userId,
        },
        include: {
          categories: {
            select: {
              category: true,
            },
          },
        },
        orderBy: [
          {
            amount: amountOrder,
          },
          {
            created_at: dateOrder,
          },
          {
            note: noteOrder,
          },
        ],
      });

      length = transactions.length.toString();
      filteredLength = transactions.length.toString();

      if (minAmount && maxAmount) {
        transactions = transactions.filter(
          (transaction) =>
            transaction.amount.toNumber() >= minAmount && transaction.amount.toNumber() <= maxAmount
        );

        filteredLength = transactions.length.toString();
      } else if (minAmount && !maxAmount) {
        transactions = transactions.filter(
          (transaction) => transaction.amount.toNumber() >= minAmount
        );

        filteredLength = transactions.length.toString();
      } else if (!minAmount && maxAmount) {
        transactions = transactions.filter(
          (transaction) => transaction.amount.toNumber() <= maxAmount
        );

        filteredLength = transactions.length.toString();
      }

      if (type && _category) {
        const filtered = transactions.filter((val) => {
          return val.type === type && val.category_id === _category.uid;
        });

        filteredLength = filtered.length.toString();

        transactions = filtered;
      } else if (type && !category) {
        const filtered = (transactions = transactions.filter((val) => {
          return val.type === type;
        }));

        filteredLength = filtered.length.toString();

        transactions = filtered;
      } else if (!type && _category) {
        const filtered = transactions.filter((val) => {
          return val.category_id === _category.uid;
        });

        filteredLength = filtered.length.toString();

        transactions = filtered;
      }

      if (skip && take) {
        transactions = skipAndTake(transactions, skip, take);
      } else if (skip && !take) {
        transactions = skipArr(transactions, skip);
      } else if (!skip && take) {
        transactions = takeArr(transactions, take);
      }

      const data: Transaction[] = [];

      transactions.forEach((val) => {
        data.push({
          categoryName: val.categories.category,
          uid: val.uid,
          userId: val.user_id,
          categoryId: val.category_id,
          amount: val.amount.toString(),
          type: val.type,
          createdAt: val.created_at,
          note: val.note ?? undefined,
        });
      });

      const obj: TransactionData = {
        data: data,
        filteredLength: filteredLength,
        length: length,
      };

      return obj;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async update(
    uid: string,
    userId: string,
    amount?: string | undefined,
    type?: TransactionTypes | undefined,
    category?: string | undefined,
    note?: string
  ): Promise<void> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: userId,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      const transaction = await this.prismaClient.transactions.findFirst({
        where: {
          uid: uid,
          user_id: userId,
        },
      });

      if (!transaction) throw new Error("transaction-does-not-exist" as ErrorType);

      const _category =
        category &&
        (await this.prismaClient.categories.findFirst({
          where: {
            category: category,
          },
        }));

      if (category && !_category) throw new Error("category-does-not-exist" as ErrorType);

      await this.prismaClient.transactions.update({
        where: {
          uid: uid,
          user_id: user.uid,
        },
        data: {
          amount: amount ?? transaction.amount,
          type: type ?? transaction.type,
          category_id: _category ? _category.uid : transaction.category_id,
          note: note ?? transaction.note,
        },
      });
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async delete(uid: string, userId: string): Promise<void> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: userId,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      await this.prismaClient.transactions.delete({
        where: {
          uid: uid,
          user_id: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error("transaction-does-not-exist" as ErrorType);
        }
      }
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }
}
