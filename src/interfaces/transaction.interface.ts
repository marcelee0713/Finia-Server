import {
  Months,
  SortOrder,
  TransactionReturnType,
  TransactionTypes,
  TransactionUseCases,
} from "../types/transaction.types";
import { ExcludeFunctions, ExcludeUnderscores } from "../utils/type-modifications";

interface INonFuncTransaction extends ExcludeFunctions<ITransaction> {
  categoryName: string;
}

export interface MonthTransaction {
  month: Months;
  amount: string;
}

export interface TotalAmountInCategory {
  categoryName: string;
  amount: string;
}

export interface ITransaction {
  _uid: string;
  _userId: string;
  _categoryId: string;
  _amount: string;
  _type: TransactionTypes;
  _note?: string;
  _createdAt: Date;

  set: (
    uid: string,
    userId: string,
    categoryId: string,
    amount: string,
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

  getAmount: () => string;

  setAmount: (amount: string) => void;

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

  totalTransactions: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  mostSpentCategory: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  mostEarnedCategory: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  largestExpense: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  largestRevenue: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  totalExpenses: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  totalRevenues: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  totalTransactionThisDay: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  totalTransactionThisMonth: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  currentMonthExpenses: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  currentMonthRevenues: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  netIncome: (data: TransactionData, useCase: TransactionUseCases) => TransactionInfo | undefined;

  highestTransactionInADay: (
    data: TransactionData,
    useCase: TransactionUseCases
  ) => TransactionInfo | undefined;

  monthlyTransactions: (
    data: TransactionData,
    type: TransactionTypes,
    useCase: TransactionUseCases
  ) => MonthlyTransactions | undefined;

  categoryTransactions: (
    data: TransactionData,
    type: TransactionTypes,
    useCase: TransactionUseCases
  ) => CategoryTransactions | undefined;

  dto: (
    data: TransactionData,
    useCases: TransactionUseCases | string | undefined
  ) => TransactionReturnType<TransactionUseCases>;
}

export interface CategoryTransactions {
  type: TransactionTypes;
  data: TotalAmountInCategory[];
  useCase: TransactionUseCases;
}

export interface MonthlyTransactions {
  type: TransactionTypes;
  monthlyTransactions: MonthTransaction[];
  useCase: TransactionUseCases;
}

export interface TransactionInfo {
  userId: string;
  useCase: TransactionUseCases;
  info: string;
  subInfo?: string;
  category?: string;
  amount?: string;
  note?: string;
  date?: string;
  month?: string;
  day?: string;
}

export type Transaction = ExcludeUnderscores<INonFuncTransaction>;

export interface TransactionData {
  data: Transaction[];
  filteredLength: string;
  length: string;
}

export interface ITransactionServiceInteractor {
  createTransaction(
    userId: string,
    type: string,
    amount: string,
    category: string,
    note?: string
  ): Promise<void>;

  getTransactions(
    userId: string,
    type?: string,
    category?: string,
    useCase?: string,
    skip?: string,
    take?: string,
    minAmount?: string,
    maxAmount?: string,
    amountOrder?: string,
    dateOrder?: string,
    noteOrder?: string
  ): Promise<TransactionReturnType<TransactionUseCases>>;

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

  get(
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
  ): Promise<TransactionData>;

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
