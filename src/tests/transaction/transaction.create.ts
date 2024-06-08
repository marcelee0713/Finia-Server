import { beforeEach, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { GetUID } from "../setup";

export const TransactionCreateSuite = () => {
  const loginBody = {
    username: "johnny123",
    password: "P@ssword1234",
  };

  const createTransactionBody = {
    userId: "",
    type: "EXPENSES",
    amount: "1500",
    category: "Food",
    note: "Longganisa para sa umaga!",
    date: "",
  };

  beforeEach(async () => {
    createTransactionBody.userId = await GetUID(loginBody.username);
  });

  let tokenSession = "";

  it("Should successfully log in a user", async () => {
    const response = await request(app).post("/api/v1/users/login").send(loginBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    const res: { token: string } = await response.body;
    tokenSession = res.token;
  });

  it(`Should return an error with the type "not-authorized" and status of 401`, async () => {
    const response = await request(app)
      .post(`/api/v1/transactions/create?token=`)
      .send(createTransactionBody);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
    expect(response.body).toHaveProperty("status", "401");
    expect(response.body).toHaveProperty("type", "not-authorized");
  });

  it(`Should return an error with the type "invalid-amount" and status of 400`, async () => {
    createTransactionBody.amount = "1500000HEHE0.000";
    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Invalid amount, please enter a number with 12 digits and 2 decimal places only!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-amount");
  });

  it(`Should return an error with the type "invalid-transaction-type" and status of 400`, async () => {
    createTransactionBody.amount = "1500.00";
    createTransactionBody.type = "NOTATYPE";

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Transaction type should either be REVENUE or EXPENSES!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-transaction-type");
  });

  it(`Should return an error with the type "invalid-note" and status of 400`, async () => {
    createTransactionBody.type = "EXPENSES";
    createTransactionBody.note = `HEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEEHEHEHE
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH`;

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Transaction notes should be less than 50 characters!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-note");
  });

  it(`Should return an error with the type "category-does-not-exist" and status of 404`, async () => {
    createTransactionBody.note = "Longganisa para sa umaga!";
    createTransactionBody.category = "UNKNOWN";

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.body).toHaveProperty("message", "Category does not exist!");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "category-does-not-exist");
  });

  it(`Should return an error with the type "invalid-date" and status of 400`, async () => {
    createTransactionBody.note = "Longganisa para sa umaga!";
    createTransactionBody.category = "Food";
    createTransactionBody.date = "JAN2020201";

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.body).toHaveProperty("message", "Date is not valid");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-date");
  });

  it("Should create the first transaction", async () => {
    createTransactionBody.date = "";
    createTransactionBody.amount = "1500.00";
    createTransactionBody.type = "EXPENSES";
    createTransactionBody.note = "Longganisa para sa umaga!";
    createTransactionBody.category = "Food";

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("Should create the second transaction", async () => {
    createTransactionBody.amount = "50";
    createTransactionBody.type = "EXPENSES";
    createTransactionBody.note = "Ulam";
    createTransactionBody.category = "Food";

    const response = await request(app)
      .post(`/api/v1/transactions/create?token=${tokenSession}`)
      .send(createTransactionBody);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it(`Should log out the user`, async () => {
    const response = await request(app).delete(`/api/v1/users/logout?token=${tokenSession}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully logged out user");
  });
};
