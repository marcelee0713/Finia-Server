import {
  CategoryTransactions,
  MonthlyTransactions,
  TransactionData,
  TransactionInfo,
} from "../interfaces/transaction.interface";

export type TransactionTypes = "EXPENSES" | "REVENUE";

const TransactionUseCases = {
  DEFAULT: "DEFAULT",
  TOTAL_EXPENSES_INFO: "TOTAL_EXPENSES_INFO",
  TOTAL_REVENUES_INFO: "TOTAL_REVENUES_INFO",
  CURRENT_MONTH_EXPENSES_INFO: "CURRENT_MONTH_EXPENSES_INFO",
  CURRENT_MONTH_REVENUE_INFO: "CURRENT_MONTH_REVENUE_INFO",
  NET_INCOME_INFO: "NET_INCOME_INFO",
  MOST_SPENT_CATEGORY_INFO: "MOST_SPENT_CATEGORY_INFO",
  MOST_EARNED_INFO: "MOST_EARNED_INFO",
  MONTHLY_EXPENSES_GRAPH: "MONTHLY_EXPENSES_GRAPH",
  MONTHLY_REVENUE_GRAPH: "MONTHLY_REVENUE_GRAPH",
  EXPENSES_BY_CATEGORY_GRAPH: "EXPENSES_BY_CATEGORY_GRAPH",
  REVENUE_BY_CATEGORY_GRAPH: "REVENUE_BY_CATEGORY_GRAPH",
  LARGEST_EXPENSE_INFO: "LARGEST_EXPENSE_INFO",
  LARGEST_REVENUE_INFO: "LARGEST_REVENUE_INFO",
  TOTAL_TRANSACTION_THIS_DAY_INFO: "TOTAL_TRANSACTION_THIS_DAY_INFO",
  TOTAL_TRANSACTION_THIS_MONTH_INFO: "TOTAL_TRANSACTION_THIS_MONTH_INFO",
  HIGHEST_TRANSACTION_IN_A_DAY_INFO: "HIGHEST_TRANSACTION_IN_A_DAY_INFO",
  TOTAL_TRANSACTIONS_INFO: "TOTAL_TRANSACTIONS_INFO",
} as const;

export type TransactionUseCases = keyof typeof TransactionUseCases;

export const isTransactionUseCase = (useCase: string): useCase is TransactionUseCases => {
  return useCase in TransactionUseCases;
};

export type TransactionReturnType<T extends TransactionUseCases> = T extends "DEFAULT"
  ? TransactionData[]
  : T extends `${infer R}_INFO`
    ? TransactionInfo
    : MonthlyTransactions | CategoryTransactions;

export type Months =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";
