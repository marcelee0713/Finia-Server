import { afterAll, expect, describe, beforeAll } from "@jest/globals";
import { CreateUserTest, DatabaseTearDown } from "./setup";
import { UserAuthTestSuite } from "./user/user_auth";
import { UserRegistrationTestSuite } from "./user/user_register";

describe("User Test Suite", () => {
  beforeAll(async () => {
    const user = await CreateUserTest();

    expect(user).toBeDefined();
  });

  afterAll(async () => {
    const res = await DatabaseTearDown();

    expect(res).resolves;
  });

  describe("User Test Registeration Routes", () => {
    UserRegistrationTestSuite();
  });

  describe("User Test Authentication Routes", () => {
    UserAuthTestSuite();
  });
});
