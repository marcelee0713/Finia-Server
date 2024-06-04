import { injectable } from "inversify";
import {
  CategoryTransactions,
  ITransaction,
  MonthTransaction,
  MonthlyTransactions,
  TotalAmountInCategory,
  TransactionData,
  TransactionInfo,
} from "../interfaces/transaction.interface";
import { ErrorType } from "../types/error.types";
import {
  AmountFilter,
  CreateParams,
  CreateTransactionsParams,
  GetParams,
  GetTransactionsParams,
  Months,
  Pagination,
  SortOrder,
  TransactionReturnType,
  TransactionTypes,
  TransactionUseCases,
  UpdateParams,
  UpdateTransactionParams,
  isTransactionUseCase,
} from "../types/transaction.types";
import { formatDateToReadableString } from "../utils/date-converter";

@injectable()
export class Transaction implements ITransaction {
  _uid!: string;
  _userId!: string;
  _categoryId!: string;
  _amount!: string;
  _type!: TransactionTypes;
  _note?: string;
  _createdAt!: Date;

  getUid = (): string => this._uid;

  setUid = (_uid: string) => {
    this._uid = _uid;
  };

  getUserId = (): string => this._userId;

  setUserId = (userId: string) => {
    this._userId = userId;
  };

  getCategoryId = (): string => this._categoryId;

  setCategoryId = (categoryId: string) => {
    this._categoryId = categoryId;
  };

  getAmount = (): string => this._amount;

  setAmount = (amount: string) => {
    this._amount = amount;
  };

  getType = (): TransactionTypes => this._type;

  setType = (type: TransactionTypes) => {
    this._type = type;
  };

  getNote = (): string | undefined => this._note;

  setNote = (note: string) => {
    this._note = note;
  };

  getCreatedAt = (): Date => this._createdAt;

  setCreatedAt = (date: Date) => {
    this._createdAt = date;
  };

  set = (
    uid: string,
    userId: string,
    categoryId: string,
    amount: string,
    type: TransactionTypes,
    createdAt: Date,
    note?: string | undefined
  ) => {
    this._uid = uid;
    this._userId = userId;
    this._categoryId = categoryId;
    this._amount = amount;
    this._type = type;
    this._createdAt = createdAt;
    this._note = note;
  };

  validateAmount(enteredAmount: string | undefined): number | undefined {
    if (!enteredAmount) return undefined;

    const validNumberRegex = /^[0-9]+(\.[0-9]+)?$/;

    if (!validNumberRegex.test(enteredAmount)) throw new Error("invalid-amount" as ErrorType);

    const numbers = enteredAmount.split(".");

    const wholeNumbers = numbers[0];
    const decimalPlaces = numbers[1];

    if (wholeNumbers.length > 12 || (decimalPlaces && decimalPlaces.length > 2)) {
      throw new Error("invalid-amount");
    }

    return parseFloat(enteredAmount);
  }

  validateType(enteredType: string | undefined): TransactionTypes | undefined {
    if (!enteredType) return undefined;

    if (!(enteredType === "EXPENSES" || enteredType === "REVENUE")) {
      throw new Error("invalid-transaction-type" as ErrorType);
    }

    return enteredType as TransactionTypes;
  }

  validateNote(enteredNote: string | undefined): string | undefined {
    if (!enteredNote) return undefined;

    if (enteredNote.length > 50) throw new Error("invalid-note" as ErrorType);
  }

  validateDate(enteredDate: string | undefined): Date | undefined {
    if (!enteredDate) return undefined;

    const date = new Date(enteredDate);

    if (isNaN(date.getTime())) {
      throw new Error("invalid-date" as ErrorType);
    }

    return date;
  }

  validateMinAndMax(enteredMin?: string, enteredMax?: string): AmountFilter {
    const min = this.validateAmount(enteredMin);
    const max = this.validateAmount(enteredMax);

    if (min && max) {
      if (min > max) throw new Error("invalid-min-max" as ErrorType);
      if (max < min) throw new Error("invalid-min-max" as ErrorType);

      return {
        minAmount: min,
        maxAmount: max,
      };
    }

    return {
      minAmount: min,
      maxAmount: max,
    };
  }

  validateOrder(enteredOrder?: string): SortOrder {
    if (!enteredOrder) return undefined;

    if (!(enteredOrder === "asc" || enteredOrder === "desc")) {
      throw new Error("invalid-order" as ErrorType);
    }

    return enteredOrder;
  }

  validateSkipAndTake(enteredSkip?: string, enteredTake?: string): Pagination {
    let skip: number | undefined;

    let take: number | undefined;

    if (enteredSkip) {
      skip = parseInt(enteredSkip);

      if (isNaN(skip)) throw new Error("invalid-pagination" as ErrorType);
    }

    if (enteredTake) {
      take = parseInt(enteredTake);

      if (isNaN(take)) throw new Error("invalid-pagination" as ErrorType);
    }

    return {
      skip,
      take,
    };
  }

  createValidation(params: CreateTransactionsParams): CreateParams {
    this.validateAmount(params.amount);
    this.validateType(params.type);

    return {
      ...params,
      amount: parseFloat(params.amount),
      type: params.type as TransactionTypes,
      note: this.validateNote(params.note),
      date: this.validateDate(params.date),
    };
  }

  getValidation(params: GetTransactionsParams): GetParams {
    const pagination = this.validateSkipAndTake(params.skip, params.take);
    const amountFilter = this.validateMinAndMax(params.minAmount, params.maxAmount);

    return {
      ...params,
      userId: params.userId,
      type: this.validateType(params.type),
      minAmount: amountFilter.minAmount,
      maxAmount: amountFilter.maxAmount,
      skip: pagination.skip,
      take: pagination.take,
      amountOrder: this.validateOrder(params.amountOrder),
      dateOrder: this.validateOrder(params.dateOrder),
      noteOrder: this.validateOrder(params.noteOrder),
    };
  }

  updateValidation(params: UpdateTransactionParams): UpdateParams {
    this.validateAmount(params.amount);
    this.validateType(params.type);

    return {
      ...params,
      amount: this.validateAmount(params.amount),
      type: this.validateType(params.type),
      note: this.validateNote(params.note),
      date: this.validateDate(params.date),
    };
  }

  totalTransactions = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (res.data.length === 0) return undefined;

    let revenueCount = 0;
    let expensesCount = 0;

    res.data.forEach((val) => {
      if (val.type === "EXPENSES") {
        expensesCount++;
      } else {
        revenueCount++;
      }
    });

    const transaction: TransactionInfo = {
      useCase: useCase,
      userId: res.data[0].userId,
      info: `${res.data.length} transactions`,
      subInfo: `${revenueCount} revenues : ${expensesCount} expenses`,
    };

    return transaction;
  };

  mostSpentCategory = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();
    let userId = "";

    res.data.forEach((transaction) => {
      userId = transaction.userId;
      if (transaction.type === "EXPENSES") {
        if (!map.has(transaction.categoryName)) {
          map.set(transaction.categoryName, parseFloat(transaction.amount));
        } else {
          const amount = map.get(transaction.categoryName);

          if (amount) {
            const addAmount = amount + parseFloat(transaction.amount);
            map.set(transaction.categoryName, addAmount);
          }
        }
      }
    });

    let highestAmount = 0;

    map.forEach((amount, category) => {
      if (amount > highestAmount) {
        highestAmount = amount;

        transaction = {
          amount: highestAmount.toString(),
          category: category,
          useCase: useCase,
          info: "Most spent category",
          userId: userId,
          subInfo: `It's ${category}`,
        };
      }
    });

    return transaction;
  };

  mostEarnedCategory = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();
    let userId = "";

    res.data.forEach((transaction) => {
      userId = transaction.userId;
      if (transaction.type === "REVENUE") {
        if (!map.has(transaction.categoryName)) {
          map.set(transaction.categoryName, parseFloat(transaction.amount));
        } else {
          const amount = map.get(transaction.categoryName);

          if (amount) {
            const addAmount = amount + parseFloat(transaction.amount);
            map.set(transaction.categoryName, addAmount);
          }
        }
      }
    });

    let highestAmount = 0;

    map.forEach((amount, category) => {
      if (amount > highestAmount) {
        highestAmount = amount;

        transaction = {
          amount: highestAmount.toString(),
          category: category,
          useCase: useCase,
          info: "Most earned category",
          subInfo: `It's ${category}`,
          userId: userId,
        };
      }
    });

    return transaction;
  };

  largestExpense = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;
      if (val.type === "EXPENSES") {
        if (!map.has(val.categoryName)) {
          map.set(val.categoryName, parseFloat(val.amount));
        } else {
          const currentAmount = map.get(val.categoryName);

          if (!currentAmount) return;

          const newAmount = currentAmount + parseFloat(val.amount);

          map.set(val.categoryName, newAmount);
        }
      }
    });

    let amount = 0;

    map.forEach((currentAmount, categoryName) => {
      if (currentAmount > amount) {
        amount = currentAmount;
        transaction = {
          userId: userId,
          info: "The largest you spent",
          amount: amount.toString(),
          useCase: useCase,
          subInfo: `It's ${categoryName}`,
          category: categoryName,
        };
      }
    });

    return transaction;
  };

  largestRevenue = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;
      if (val.type === "REVENUE") {
        if (!map.has(val.categoryName)) {
          map.set(val.categoryName, parseFloat(val.amount));
        } else {
          const currentAmount = map.get(val.categoryName);

          if (!currentAmount) return;

          const newAmount = currentAmount + parseFloat(val.amount);

          map.set(val.categoryName, newAmount);
        }
      }
    });

    let amount = 0;

    map.forEach((currentAmount, categoryName) => {
      if (currentAmount > amount) {
        amount = currentAmount;
        transaction = {
          userId: userId,
          info: "The largest you earned",
          amount: amount.toString(),
          useCase: useCase,
          subInfo: `It's ${categoryName}`,
          category: categoryName,
        };
      }
    });

    return transaction;
  };

  totalExpenses = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (res.data.length === 0) return undefined;

    const transaction: TransactionInfo | undefined = {
      userId: "",
      useCase: useCase,
      info: "",
    };

    let totalExpenses = 0;

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;

      if (val.type === "EXPENSES") {
        totalExpenses = parseFloat(val.amount) + totalExpenses;
      }
    });

    transaction.userId = userId;
    transaction.info = "Total expenses all time";
    transaction.amount = totalExpenses.toString();

    return totalExpenses > 0 ? transaction : undefined;
  };

  totalRevenues = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (res.data.length === 0) return undefined;

    const transaction: TransactionInfo | undefined = {
      userId: "",
      useCase: useCase,
      info: "",
    };

    let totalRevenue = 0;

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;

      if (val.type === "REVENUE") {
        totalRevenue = parseFloat(val.amount) + totalRevenue;
      }
    });

    transaction.userId = userId;
    transaction.info = "Total revenue all time";
    transaction.amount = totalRevenue.toString();

    return totalRevenue > 0 ? transaction : undefined;
  };

  totalTransactionThisDay = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const date = new Date();

    const map = new Map<string, number>();

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;
      const conditionMet =
        val.createdAt.getDate() === date.getDate() &&
        val.createdAt.getMonth() === date.getMonth() &&
        val.createdAt.getFullYear() === date.getFullYear();

      if (conditionMet) {
        if (!map.has(val.categoryName)) {
          map.set(val.categoryName, 1);
        } else {
          const transactionCount = map.get(val.categoryName);

          if (transactionCount) {
            const newCount = transactionCount + 1;
            map.set(val.categoryName, newCount);
          }
        }
      }
    });

    let highestCategoryCount = 0;

    map.forEach((count, category) => {
      if (count > highestCategoryCount) {
        highestCategoryCount = count;

        transaction = {
          userId: userId,
          useCase: useCase,
          info: `${map.size} Transactions this day`,
          subInfo: `It's ${category}`,
        };
      }
    });

    return transaction;
  };

  totalTransactionThisMonth = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    const transaction: TransactionInfo | undefined = {
      info: "",
      useCase: useCase,
      userId: "",
    };

    let userId = "";

    const date = new Date();

    let count = 0;

    const map = new Map<string, number>();

    res.data.forEach((val) => {
      userId = val.userId;
      const conditionMet =
        val.createdAt.getMonth() === date.getMonth() &&
        val.createdAt.getFullYear() === date.getFullYear();

      if (conditionMet) {
        count++;

        if (!map.has(val.categoryName)) {
          map.set(val.categoryName, 1);
        } else {
          const transactionCount = map.get(val.categoryName);

          if (transactionCount) {
            const newCount = transactionCount + 1;
            map.set(val.categoryName, newCount);
          }
        }
      }
    });

    const currentMonth = date.toLocaleDateString("en-US", {
      month: "long",
    });

    transaction.userId = userId;
    transaction.info = `${count} Transactions this month`;
    transaction.subInfo = `Current month is ${currentMonth}`;

    return count > 0 ? transaction : undefined;
  };

  currentMonthExpenses = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    const transaction: TransactionInfo | undefined = {
      info: "",
      useCase: useCase,
      userId: "",
    };

    const date = new Date();

    let totalExpenses = 0;

    let userId = "";

    res.data.forEach((val) => {
      const conditionMet =
        val.createdAt.getMonth() === date.getMonth() &&
        val.createdAt.getFullYear() === date.getFullYear();

      if (conditionMet) {
        userId = val.userId;

        if (val.type === "EXPENSES") {
          totalExpenses = parseFloat(val.amount) + totalExpenses;
        }
      }
    });

    const currentMonth = date.toLocaleDateString("en-US", {
      month: "long",
    });

    transaction.userId = userId;
    transaction.info = "Total expenses this month";
    transaction.amount = totalExpenses.toString();
    transaction.subInfo = `Current month is ${currentMonth}`;

    return totalExpenses > 0 ? transaction : undefined;
  };

  currentMonthRevenues = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    const transaction: TransactionInfo | undefined = {
      info: "",
      useCase: useCase,
      userId: "",
    };

    const date = new Date();

    let totalExpenses = 0;

    let userId = "";

    res.data.forEach((val) => {
      const conditionMet =
        val.createdAt.getMonth() === date.getMonth() &&
        val.createdAt.getFullYear() === date.getFullYear();

      if (conditionMet) {
        userId = val.userId;

        if (val.type === "REVENUE") {
          totalExpenses = parseFloat(val.amount) + totalExpenses;
        }
      }
    });

    const currentMonth = date.toLocaleDateString("en-US", {
      month: "long",
    });

    transaction.userId = userId;
    transaction.info = "Total revenue this month";
    transaction.amount = totalExpenses.toString();
    transaction.subInfo = `Current month is ${currentMonth}`;

    return totalExpenses > 0 ? transaction : undefined;
  };

  netIncome = (res: TransactionData, useCase: TransactionUseCases): TransactionInfo | undefined => {
    if (res.data.length === 0) return undefined;
    const transaction: TransactionInfo | undefined = {
      info: "",
      useCase: useCase,
      userId: "",
    };

    let totalExpenses = 0;

    let totalRevenue = 0;

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;

      if (val.type === "EXPENSES") {
        totalExpenses = parseFloat(val.amount) + totalExpenses;
      } else totalRevenue = parseFloat(val.amount) + totalRevenue;
    });

    const netIncome = totalRevenue - totalExpenses;

    transaction.userId = userId;
    transaction.info = "Net Income";
    transaction.amount = netIncome.toFixed(2);

    return netIncome ? transaction : undefined;
  };

  highestTransactionInADay = (
    res: TransactionData,
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (res.data.length === 0) return undefined;

    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();

    let userId = "";

    res.data.forEach((val) => {
      userId = val.userId;

      const date = formatDateToReadableString(val.createdAt.toString());
      if (!map.has(date)) {
        map.set(date, 1);
      } else {
        const currentAmount = map.get(date);
        if (currentAmount) {
          const newAmount = currentAmount + 1;
          map.set(date, newAmount);
        }
      }
    });

    let highestCount = 0;

    map.forEach((amount, thisDate) => {
      if (amount > highestCount) {
        highestCount = amount;

        transaction = {
          info: `${highestCount} transactions`,
          subInfo: `It was at ${thisDate}`,
          userId: userId,
          useCase: useCase,
        };
      }
    });

    return transaction;
  };

  monthlyTransactions = (
    res: TransactionData,
    type: TransactionTypes,
    useCase: TransactionUseCases
  ): MonthlyTransactions | undefined => {
    const allMonths: Months[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const map = new Map<string, MonthTransaction>();

    allMonths.forEach((month) => {
      map.set(month, { month: month, amount: "0" });
    });

    const currentDate = new Date();

    const monthlyTransactions: MonthlyTransactions = {
      type: type,
      useCase: useCase,
      monthlyTransactions: [],
    };

    res.data.forEach((val) => {
      const twelveMonthsAgo = new Date(currentDate);

      twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

      if (val.type === type && val.createdAt >= twelveMonthsAgo && val.createdAt < currentDate) {
        const thisMonth = val.createdAt.toLocaleDateString("en-US", {
          month: "short",
        });

        if (map.has(thisMonth)) {
          const currentObj = map.get(thisMonth);

          if (currentObj) {
            const amount = parseFloat(val.amount);

            const currentAmount = parseFloat(currentObj.amount);

            const newAmount = currentAmount + amount;

            currentObj.amount = newAmount.toString();

            map.set(thisMonth, currentObj);
          }
        }
      }
    });

    allMonths.forEach((month) => {
      if (map.has(month)) {
        monthlyTransactions.monthlyTransactions.push(map.get(month)!);
      }
    });

    return monthlyTransactions.monthlyTransactions.length > 0 ? monthlyTransactions : undefined;
  };

  categoryTransactions = (
    res: TransactionData,
    type: TransactionTypes,
    useCase: TransactionUseCases
  ): CategoryTransactions | undefined => {
    const map = new Map<string, TotalAmountInCategory>();

    const categoryTransactions: CategoryTransactions = {
      data: [],
      type: type,
      useCase: useCase,
    };

    res.data.forEach((transaction) => {
      if (!map.has(transaction.categoryName) && transaction.type === type) {
        const obj: TotalAmountInCategory = {
          categoryName: transaction.categoryName,
          amount: transaction.amount,
        };

        map.set(transaction.categoryName, obj);
      } else {
        const currentObj = map.get(transaction.categoryName);

        if (currentObj) {
          const amount = parseFloat(transaction.amount);

          const currentAmount = parseFloat(currentObj.amount);

          const newAmount = currentAmount + amount;

          currentObj.amount = newAmount.toString();

          map.set(transaction.categoryName, currentObj);
        }
      }
    });

    map.forEach((val) => {
      categoryTransactions.data.push(val);
    });

    return categoryTransactions.data.length !== 0 ? categoryTransactions : undefined;
  };

  dto = (
    data: TransactionData,
    useCases: TransactionUseCases | string | undefined
  ): TransactionReturnType<TransactionUseCases> => {
    if (!useCases || !isTransactionUseCase(useCases)) return data;

    switch (useCases) {
      case "TOTAL_TRANSACTIONS_INFO":
        return this.totalTransactions(data, useCases) as TransactionReturnType<typeof useCases>;

      case "MOST_SPENT_CATEGORY_INFO":
        return this.mostSpentCategory(data, useCases) as TransactionReturnType<typeof useCases>;

      case "MOST_EARNED_INFO":
        return this.mostEarnedCategory(data, useCases) as TransactionReturnType<typeof useCases>;

      case "LARGEST_EXPENSE_INFO":
        return this.largestExpense(data, useCases) as TransactionReturnType<typeof useCases>;

      case "LARGEST_REVENUE_INFO":
        return this.largestRevenue(data, useCases) as TransactionReturnType<typeof useCases>;

      case "TOTAL_EXPENSES_INFO":
        return this.totalExpenses(data, useCases) as TransactionReturnType<typeof useCases>;

      case "TOTAL_REVENUES_INFO":
        return this.totalRevenues(data, useCases) as TransactionReturnType<typeof useCases>;

      case "TOTAL_TRANSACTION_THIS_DAY_INFO":
        return this.totalTransactionThisDay(data, useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "TOTAL_TRANSACTION_THIS_MONTH_INFO":
        return this.totalTransactionThisMonth(data, useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "CURRENT_MONTH_EXPENSES_INFO":
        return this.currentMonthExpenses(data, useCases) as TransactionReturnType<typeof useCases>;

      case "CURRENT_MONTH_REVENUE_INFO":
        return this.currentMonthRevenues(data, useCases) as TransactionReturnType<typeof useCases>;

      case "NET_INCOME_INFO":
        return this.netIncome(data, useCases) as TransactionReturnType<typeof useCases>;

      case "HIGHEST_TRANSACTION_IN_A_DAY_INFO":
        return this.highestTransactionInADay(data, useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "MONTHLY_EXPENSES_GRAPH":
        return this.monthlyTransactions(data, "EXPENSES", useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "MONTHLY_REVENUE_GRAPH":
        return this.monthlyTransactions(data, "REVENUE", useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "EXPENSES_BY_CATEGORY_GRAPH":
        return this.categoryTransactions(data, "EXPENSES", useCases) as TransactionReturnType<
          typeof useCases
        >;

      case "REVENUE_BY_CATEGORY_GRAPH":
        return this.categoryTransactions(data, "REVENUE", useCases) as TransactionReturnType<
          typeof useCases
        >;

      default:
        return data;
    }
  };
}
