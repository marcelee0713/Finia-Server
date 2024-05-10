import { beforeEach, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { GetUID, GetTransasctionUID } from "../setup";

export const TransactionUpdateSuite = () => {
  const loginBody = {
    username: "johnny123",
    password: "P@ssword1234",
  };

  const patchTransactionBody = {
    uid: "",
    userId: "",
    type: "EXPENSES",
    amount: "1500.00",
    category: "Food",
    note: "Letchon Baboy",
  };

  beforeEach(async () => {
    patchTransactionBody.userId = await GetUID(loginBody.username);
    patchTransactionBody.uid = await GetTransasctionUID(loginBody.username);
  });

  let tokenSession = "";

  it("Should successfully log in a user", async () => {
    const response = await request(app).post("/api/v1/users/login").send(loginBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    const cookies = response.headers["set-cookie"];

    cookies[0].split(";").map((val) => {
      if (val.startsWith("token=")) {
        tokenSession = val.replace("token=", "");
        return;
      }
    });
  });

  it(`Should return an error with the type "invalid-amount" and status of 400`, async () => {
    patchTransactionBody.amount = "1500000HEHE0.000";
    const response = await request(app)
      .patch("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(patchTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Invalid amount, please enter a number with 12 digits and 2 decimal places only!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-amount");
  });

  it(`Should return an error with the type "invalid-transaction-type" and status of 400`, async () => {
    patchTransactionBody.amount = "1500.00";
    patchTransactionBody.type = "NOTATYPE";

    const response = await request(app)
      .patch("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(patchTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Transaction type should either be REVENUE or EXPENSES!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-transaction-type");
  });

  it(`Should return an error with the type "invalid-note" and status of 400`, async () => {
    patchTransactionBody.type = "EXPENSES";
    patchTransactionBody.note = `HEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEEHEHEHE
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH
        HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEH`;

    const response = await request(app)
      .patch("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(patchTransactionBody);

    expect(response.body).toHaveProperty(
      "message",
      "Transaction notes should be less than 255 characters!"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-note");
  });

  it(`Should return an error with the type "category-does-not-exist" and status of 404`, async () => {
    patchTransactionBody.note = "Letchon Manok";
    patchTransactionBody.category = "UNKNOWN";

    const response = await request(app)
      .patch("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(patchTransactionBody);

    expect(response.body).toHaveProperty("message", "Category does not exist!");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "category-does-not-exist");
  });

  it("Should update transaction amount to 3000.00", async () => {
    patchTransactionBody.category = "Food";
    patchTransactionBody.amount = "3000.00";

    const response = await request(app)
      .patch("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(patchTransactionBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully updated your transaction!");
  });

  it(`Should log out the user`, async () => {
    const response = await request(app)
      .delete("/api/v1/users/logout")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully logged out user");
  });
};
