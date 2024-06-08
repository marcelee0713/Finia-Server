import { it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { TransactionData } from "../../interfaces/transaction.interface";

export const TransactionReadSuite = () => {
  const loginBody = {
    username: "johnny123",
    password: "P@ssword1234",
  };

  const getTransactionBody = {
    type: "EXPENSES",
    category: "",
    minAmount: "",
    maxAmount: "",
    skip: "",
    take: "",
    dateOrder: "",
    amountOrder: "",
    noteOrder: "",
    useCase: "",
  };

  let tokenSession = "";

  it("Should successfully log in a user", async () => {
    const response = await request(app).post("/api/v1/users/login").send(loginBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    const res: { token: string } = await response.body;
    tokenSession = res.token;
  });

  it(`Should return an error with the type "invalid-transaction-type" and status of 400`, async () => {
    getTransactionBody.type = "NOTATYPE";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Transaction type should either be REVENUE or EXPENSES!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-transaction-type");
  });

  it(`Should return an error with the type "category-does-not-exist" and status of 400`, async () => {
    getTransactionBody.type = "EXPENSES";
    getTransactionBody.category = "blabla";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Category does not exist!");
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "category-does-not-exist");
  });

  it(`Should return an error with the type "invalid-order" and status of 400`, async () => {
    getTransactionBody.category = "";
    getTransactionBody.dateOrder = "ash";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid order, input should be asc and desc!");
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-order");
  });

  it(`Should return an error with the type "invalid-min-max" and status of 400`, async () => {
    getTransactionBody.minAmount = "500";
    getTransactionBody.maxAmount = "250";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid min and max amount!");
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-min-max");
  });

  it(`Should return an error with the type "invalid-amount" and status of 400`, async () => {
    getTransactionBody.minAmount = "250.555";
    getTransactionBody.maxAmount = "500.213";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid amount, please enter a number with 12 digits and 2 decimal places only!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-amount");
  });

  it(`Should return an error with the type "invalid-pagination" and status of 400`, async () => {
    getTransactionBody.minAmount = "250.50";
    getTransactionBody.maxAmount = "500.20";
    getTransactionBody.skip = "hehe";
    getTransactionBody.take = "hihihi";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please enter whole numbers only!");
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-pagination");
  });

  it("Should get the two food transactions", async () => {
    getTransactionBody.amountOrder = "";
    getTransactionBody.dateOrder = "";
    getTransactionBody.noteOrder = "";
    getTransactionBody.skip = "";
    getTransactionBody.take = "";
    getTransactionBody.useCase = "";
    getTransactionBody.minAmount = "";
    getTransactionBody.maxAmount = "";
    getTransactionBody.type = "EXPENSES";
    getTransactionBody.category = "Food";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    const resBody: TransactionData = response.body;

    expect(response.status).toBe(200);
    expect(resBody.filteredLength).toBe("2");
  });

  it("Should get only 0 transaction", async () => {
    getTransactionBody.type = "EXPENSES";
    getTransactionBody.category = "Transportation";

    const response = await request(app)
      .post(`/api/v1/transactions?token=${tokenSession}`)
      .send(getTransactionBody);

    const resBody: TransactionData = response.body;

    expect(response.status).toBe(200);
    expect(resBody.filteredLength).toBe("0");
  });

  it(`Should log out the user`, async () => {
    const response = await request(app)
      .delete(`/api/v1/users/logout?token=${tokenSession}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully logged out user");
  });
};
