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
  Months,
  TransactionReturnType,
  TransactionTypes,
  TransactionUseCases,
  isTransactionUseCase,
} from "../types/transaction.types";

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

  validateAmount(enteredAmount: string) {
    const validNumberRegex = /^[0-9]+(\.[0-9]+)?$/;

    if (!validNumberRegex.test(enteredAmount)) throw new Error("invalid-amount" as ErrorType);

    const numbers = enteredAmount.split(".");

    const wholeNumbers = numbers[0];
    const decimalPlaces = numbers[1];

    if (wholeNumbers.length > 12 || (decimalPlaces && decimalPlaces.length > 2)) {
      throw new Error("invalid-amount");
    }
  }

  validateType(enteredType: string) {
    if (!(enteredType === "EXPENSES" || enteredType === "REVENUE")) {
      throw new Error("invalid-transaction-type" as ErrorType);
    }
  }

  validateNote(enteredNote: string | undefined) {
    if (enteredNote && enteredNote.length > 255) throw new Error("invalid-note" as ErrorType);
  }

  validate(amount: string, type: string, note: string | undefined) {
    this.validateAmount(amount);
    this.validateType(type);
    this.validateNote(note);
  }

  mostSpentCategory = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();
    let userId = "";

    data.forEach((transaction) => {
      userId = transaction.userId;
      if (transaction.type === "EXPENSES") {
        if (!map.has(transaction.categoryName)) {
          map.set(transaction.categoryName, parseInt(transaction.amount));
        } else {
          const amount = map.get(transaction.categoryName);

          if (amount) {
            const addAmount = amount + parseInt(transaction.amount);
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
        };
      }
    });

    return transaction;
  };

  mostEarnedCategory = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const map = new Map<string, number>();
    let userId = "";

    data.forEach((transaction) => {
      userId = transaction.userId;
      if (transaction.type === "REVENUE") {
        if (!map.has(transaction.categoryName)) {
          map.set(transaction.categoryName, parseInt(transaction.amount));
        } else {
          const amount = map.get(transaction.categoryName);

          if (amount) {
            const addAmount = amount + parseInt(transaction.amount);
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
          userId: userId,
        };
      }
    });

    return transaction;
  };

  largestExpense = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    let amount = 0;

    data.forEach((val) => {
      if (val.type === "EXPENSES") {
        if (parseInt(val.amount) > amount) {
          amount = parseInt(val.amount);

          transaction = {
            useCase: useCase,
            userId: val.userId,
            info: "Most spent category",
            category: val.categoryName,
            amount: amount.toString(),
          };
        }
      }
    });

    return transaction;
  };

  largestRevenue = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    let amount = 0;

    data.forEach((val) => {
      if (val.type === "REVENUE") {
        if (parseInt(val.amount) > amount) {
          amount = parseInt(val.amount);

          transaction = {
            useCase: useCase,
            userId: val.userId,
            info: "Most earned category",
            category: val.categoryName,
            amount: amount.toString(),
          };
        }
      }
    });

    return transaction;
  };

  totalExpenses = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (data.length === 0) return undefined;

    const transaction: TransactionInfo | undefined = {
      userId: "",
      useCase: useCase,
      info: "",
    };

    let totalExpenses = 0;

    let userId = "";

    data.forEach((val) => {
      userId = val.userId;

      if (val.type === "EXPENSES") {
        totalExpenses = parseInt(val.amount) + totalExpenses;
      }
    });

    transaction.userId = userId;
    transaction.info = "Total expenses all time";
    transaction.amount = totalExpenses.toString();

    return totalExpenses > 0 ? transaction : undefined;
  };

  totalTransactionThisDay = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    let transaction: TransactionInfo | undefined;

    const date = new Date();

    const map = new Map<string, number>();

    let userId = "";

    data.forEach((val) => {
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
          subInfo: `It was ${category}`,
        };
      }
    });

    return transaction;
  };

  totalTransactionThisMonth = (
    data: TransactionData[],
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

    data.forEach((val) => {
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

    transaction.userId = userId;
    transaction.info = `${count} Transactions this month`;
    transaction.subInfo = `Current month is ${date.getMonth()}`;

    return count > 0 ? transaction : undefined;
  };

  currentMonthExpenses = (
    data: TransactionData[],
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

    data.forEach((val) => {
      const conditionMet =
        val.createdAt.getMonth() === date.getMonth() &&
        val.createdAt.getFullYear() === date.getFullYear();

      if (conditionMet) {
        userId = val.userId;

        if (val.type === "EXPENSES") {
          totalExpenses = parseInt(val.amount) + totalExpenses;
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

  netIncome = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (data.length === 0) return undefined;
    const transaction: TransactionInfo | undefined = {
      info: "",
      useCase: useCase,
      userId: "",
    };

    let totalExpenses = 0;

    let totalRevenue = 0;

    let userId = "";

    data.forEach((val) => {
      userId = val.userId;

      if (val.type === "EXPENSES") {
        totalExpenses = parseInt(val.amount) + totalExpenses;
      } else totalRevenue = parseInt(val.amount) + totalRevenue;
    });

    const netIncome = totalRevenue - totalExpenses;

    transaction.userId = userId;
    transaction.info = "Net Income";
    transaction.amount = netIncome.toString();

    return netIncome ? transaction : undefined;
  };

  highestTransactionInADay = (
    data: TransactionData[],
    useCase: TransactionUseCases
  ): TransactionInfo | undefined => {
    if (data.length === 0) return undefined;

    let transaction: TransactionInfo | undefined;

    const map = new Map<Date, number>();

    let userId = "";

    data.forEach((val) => {
      userId = val.userId;
      if (!map.has(val.createdAt)) {
        map.set(val.createdAt, 1);
      } else {
        const currentAmount = map.get(val.createdAt);
        if (currentAmount) {
          const newAmount = currentAmount + 1;
          map.set(val.createdAt, newAmount);
        }
      }
    });

    let highestCount = 0;

    map.forEach((amount, thisDate) => {
      if (amount > highestCount) {
        highestCount = amount;

        const formattedDate = thisDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        const formattedDay = thisDate.toLocaleDateString("en-US", {
          month: "long",
        });

        transaction = {
          info: `${highestCount} Transactions in ${formattedDate}`,
          subInfo: `It was ${formattedDay}`,
          userId: userId,
          useCase: useCase,
        };
      }
    });

    return transaction;
  };

  monthlyTransactions = (
    data: TransactionData[],
    type: TransactionTypes,
    useCase: TransactionUseCases
  ): MonthlyTransactions | undefined => {
    const map = new Map<string, MonthTransaction>();

    const currentDate = new Date();

    const monthlyTransactions: MonthlyTransactions = {
      type: type,
      useCase: useCase,
      monthlyTransactions: [],
    };

    data.forEach((val) => {
      const date = new Date();
      const twelveMonthsAgo = new Date(date);
      twelveMonthsAgo.setMonth(date.getMonth() - 12);

      if (val.type === type && val.createdAt >= twelveMonthsAgo && val.createdAt < currentDate) {
        const thisMonth = val.createdAt.toLocaleDateString("en-US", {
          month: "short",
        });

        if (!map.has(thisMonth)) {
          const obj: MonthTransaction = {
            month: thisMonth as Months,
            amount: val.amount,
          };

          map.set(thisMonth, obj);
        } else {
          const currentObj = map.get(thisMonth);

          if (currentObj) {
            const amount = parseInt(val.amount);

            const currentAmount = parseInt(currentObj.amount);

            const newAmount = currentAmount + amount;

            currentObj.amount = newAmount.toString();

            map.set(thisMonth, currentObj);
          }
        }
      }
    });

    map.forEach((val, month) => {
      const transaction: MonthTransaction = {
        amount: val.amount,
        month: month as Months,
      };

      monthlyTransactions.monthlyTransactions.push(transaction);
    });

    return monthlyTransactions.monthlyTransactions.length !== 0 ? monthlyTransactions : undefined;
  };

  categoryTransactions = (
    data: TransactionData[],
    type: TransactionTypes,
    useCase: TransactionUseCases
  ): CategoryTransactions | undefined => {
    const map = new Map<string, TotalAmountInCategory>();

    const categoryTransactions: CategoryTransactions = {
      data: [],
      type: type,
      useCase: useCase,
    };

    data.forEach((transaction) => {
      if (!map.has(transaction.categoryName) && transaction.type === type) {
        const obj: TotalAmountInCategory = {
          categoryName: transaction.categoryName,
          amount: transaction.amount,
        };

        map.set(transaction.categoryName, obj);
      } else {
        const currentObj = map.get(transaction.categoryName);

        if (currentObj) {
          const amount = parseInt(transaction.amount);

          const currentAmount = parseInt(currentObj.amount);

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
    data: TransactionData[],
    useCases: TransactionUseCases | string | undefined
  ): TransactionReturnType<TransactionUseCases> => {
    if (!useCases || !isTransactionUseCase(useCases)) return data;

    switch (useCases) {
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
