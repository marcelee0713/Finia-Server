import {
  AmountFilter,
  CreateParams,
  CreateTransactionsParams,
  GetParams,
  GetTransactionsParams,
  Months,
  Pagination,
  SortOrder,
  Transaction,
  TransactionReturnType,
  TransactionTypes,
  TransactionUseCases,
  UpdateParams,
  UpdateTransactionParams,
} from "../types/transaction.types";
import { ExcludeFunctions } from "../utils/type-modifications";

export interface INonFuncTransaction extends ExcludeFunctions<ITransaction> {
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

export interface TransactionData {
  data: Transaction[];
  filteredLength: string;
  length: string;
}

export interface CreateTransactionReqBody {
  body: {
    userId: string;
    type: string;
    category: string;
    amount: string;
    date?: string;
    note?: string;
  };
}

export interface GetTransactionReqBody {
  body: {
    userId: string;
    type?: string;
    category?: string;
    useCase?: string;
    minAmount?: string;
    maxAmount?: string;
    skip?: string;
    take?: string;
    amountOrder?: string;
    dateOrder?: string;
    noteOrder?: string;
  };
}

export interface UpdateTransactionReqBody {
  body: {
    userId: string;
    uid: string;
    type?: string;
    category?: string;
    amount?: string;
    date?: string;
    note?: string;
  };
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

  validateAmount: (enteredAmount?: string) => number | undefined;

  validateType: (enteredType?: string) => TransactionTypes | undefined;

  validateNote: (enteredNote?: string) => string | undefined;

  validateDate: (enteredDate?: string) => Date | undefined;

  validateMinAndMax: (enteredMin?: string, enteredMax?: string) => AmountFilter;

  validateOrder: (enteredOrder?: string) => SortOrder;

  validateSkipAndTake: (enteredSkip?: string, enteredTake?: string) => Pagination;

  createValidation: (params: CreateTransactionsParams) => CreateParams;

  getValidation: (params: GetTransactionsParams) => GetParams;

  updateValidation: (params: UpdateTransactionParams) => UpdateParams;

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

export interface ITransactionServiceInteractor {
  createTransaction(params: CreateTransactionsParams): Promise<Transaction>;

  getTransactions(
    params: GetTransactionsParams
  ): Promise<TransactionReturnType<TransactionUseCases>>;

  updateTransaction(params: UpdateTransactionParams): Promise<Transaction>;

  deleteTransaction(uid: string, userId: string): Promise<void>;
}

export interface ITransactionRepository {
  create(params: CreateParams): Promise<Transaction>;

  get(params: GetParams): Promise<TransactionData>;

  update(params: UpdateParams): Promise<Transaction>;

  delete(uid: string, userId: string): Promise<void>;
}
