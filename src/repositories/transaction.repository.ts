import { injectable } from "inversify";
import { ITransactionRepository, TransactionData } from "../interfaces/transaction.interface";
import { TransactionTypes } from "../types/transaction.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../db/db.server";
import { ErrorType } from "../types/error.types";

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
    take?: number
  ): Promise<TransactionData[]> {
    const list: TransactionData[] = [];
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

      if (type && _category) {
        transactions = await this.prismaClient.transactions.findMany({
          where: {
            user_id: userId,
            type: type,
            category_id: _category.uid,
            categories: {
              uid: _category.uid,
              category: category,
            },
          },
          include: {
            categories: {
              select: {
                category: true,
              },
            },
          },
          skip: skip,
          take: take,
          orderBy: {
            created_at: "asc",
          },
        });
      } else if (type && !category) {
        transactions = await this.prismaClient.transactions.findMany({
          where: {
            user_id: userId,
            type: type,
          },
          include: {
            categories: {
              select: {
                category: true,
              },
            },
          },
          skip: skip,
          take: take,
          orderBy: {
            created_at: "asc",
          },
        });
      } else if (!type && _category) {
        transactions = await this.prismaClient.transactions.findMany({
          where: {
            user_id: userId,
            category_id: _category.uid,
            categories: {
              uid: _category.uid,
              category: category,
            },
          },
          include: {
            categories: {
              select: {
                category: true,
              },
            },
          },
          skip: skip,
          take: take,
          orderBy: {
            created_at: "asc",
          },
        });
      } else {
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
          skip: skip,
          take: take,
          orderBy: {
            created_at: "asc",
          },
        });
      }

      transactions.forEach((val) => {
        list.push({
          uid: val.uid,
          userId: val.user_id,
          categoryId: val.category_id,
          categoryName: val.categories.category,
          amount: val.amount.toString(),
          createdAt: val.created_at,
          type: val.type,
          note: val.note ?? undefined,
        });
      });

      return list;
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
