import { TransactionTypes } from "../types/transaction.types";

export interface ITransaction {
  _uid: string;
  _userId: string;
  _categoryId: string;
  _amount: number;
  _type: TransactionTypes;
  _note?: string;
  _created_at: Date;
  set: (
    uid: string,
    userId: string,
    categoryId: string,
    amount: number,
    type: TransactionTypes,
    createdAt: Date,
    note?: string
  ) => void;
  getUid: () => string;
  setUid: (uid: string) => void;
  getUserId: () => string;
  setUserId: (userId: string) => void;
  getCategoryId: () => void;
  setCategoryId: (categoryId: string) => void;
  getAmount: () => number;
  setAmount: (amount: number) => void;
  getType: () => TransactionTypes;
  setType: (type: TransactionTypes) => void;
  getCreatedAt: () => Date;
  setCreatedAt: (createdAt: Date) => void;
  getNote: () => string | undefined;
  setNote: (note: string) => void;
  validateAmount: (enteredAmount: string) => void;
  validateType: (enteredType: string) => void;
  validateNote: (enteredNote: string | undefined) => void;
  validate: (amount: string, type: string, note: string | undefined) => void;
}

type FunctionKey<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T];

type ExcludeFunctions<T> = Omit<T, FunctionKey<T>>;

export interface INonFuncTransaction extends ExcludeFunctions<ITransaction> {}

type ExcludeUnderscores<T> = {
  [K in keyof T as `${Uncapitalize<string & K> extends `_${infer R}` ? Uncapitalize<string & R> : Uncapitalize<string & K>}`]: T[K];
};

export type TransactionObject = ExcludeUnderscores<INonFuncTransaction>;

export interface ITransactionServiceInteractor {
  createTransaction(
    userId: string,
    type: string,
    amount: string,
    category: string,
    note?: string
  ): Promise<void>;

  getTransactions(userId: string, type?: string, category?: string): Promise<TransactionObject[]>;

  updateTransaction(
    uid: string,
    userId: string,
    amount?: string,
    type?: string,
    category?: string,
    note?: string
  ): Promise<void>;

  deleteTransaction(uid: string, userId: string): Promise<void>;
}

export interface ITransactionRepository {
  create(
    userId: string,
    type: TransactionTypes,
    amount: string,
    category: string,
    note?: string
  ): Promise<void>;

  get(userId: string, type?: TransactionTypes, category?: string): Promise<TransactionObject[]>;

  update(
    uid: string,
    userId: string,
    amount?: string,
    type?: TransactionTypes,
    category?: string,
    note?: string
  ): Promise<void>;

  delete(uid: string, userId: string): Promise<void>;
}
