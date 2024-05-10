import { afterAll, expect, describe, beforeAll } from "@jest/globals";
import { CreateUserTest, DatabaseTearDown } from "./setup";
import { UserAuthTestSuite } from "./user/user_auth";
import { UserRegistrationTestSuite } from "./user/user_register";
import { TransactionCreateSuite } from "./transaction/transaction.create";
import { TransasctionDeleteSuite } from "./transaction/transaction.delete";
import { TransactionUpdateSuite } from "./transaction/transaction.update";
import { TransactionReadSuite } from "./transaction/transaction.read";

beforeAll(async () => {
  const user = await CreateUserTest();

  expect(user).toBeDefined();
});

describe("User Test Suite", () => {
  describe("User Test Registeration Routes", () => {
    UserRegistrationTestSuite();
  });

  describe("User Test Authentication Routes", () => {
    UserAuthTestSuite();
  });
});

describe("Transaction Test Suite", () => {
  describe("Create Transaction Usage", () => {
    TransactionCreateSuite();
  });

  describe("Read Transaction Usage", () => {
    TransactionReadSuite();
  });

  describe("Update Transaction Usage", () => {
    TransactionUpdateSuite();
  });

  describe("Delete Transaction Usage", () => {
    TransasctionDeleteSuite();
  });
});

afterAll(async () => {
  const res = await DatabaseTearDown();

  expect(res).resolves;
});
