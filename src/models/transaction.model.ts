import { injectable } from "inversify";
import { ITransaction } from "../interfaces/transaction.interface";
import { ErrorType } from "../types/error.types";
import { TransactionTypes } from "../types/transaction.types";

@injectable()
export class Transaction implements ITransaction {
  _uid!: string;
  _userId!: string;
  _categoryId!: string;
  _amount!: number;
  _type!: TransactionTypes;
  _note?: string;
  _created_at!: Date;

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

  getAmount = (): number => this._amount;

  setAmount = (amount: number) => {
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

  getCreatedAt = (): Date => this._created_at;

  setCreatedAt = (created_at: Date) => {
    this._created_at = created_at;
  };

  set = (
    uid: string,
    userId: string,
    categoryId: string,
    amount: number,
    type: TransactionTypes,
    createdAt: Date,
    note?: string | undefined
  ) => {
    this._uid = uid;
    this._userId = userId;
    this._categoryId = categoryId;
    this._amount = amount;
    this._type = type;
    this._created_at = createdAt;
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
}
