import { beforeEach, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { GetUID } from "../setup";

export const TransactionReadSuite = () => {
  const loginBody = {
    username: "johnny123",
    password: "P@ssword1234",
  };

  const getTransactionBody = {
    userId: "",
    type: "EXPENSES",
    category: "",
  };

  beforeEach(async () => {
    getTransactionBody.userId = await GetUID(loginBody.username);
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

  it(`Should return an error with the type "invalid-transaction-type" and status of 400`, async () => {
    getTransactionBody.type = "NOTATYPE";

    const response = await request(app)
      .post("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(getTransactionBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Transaction type should either be REVENUE or EXPENSES!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-transaction-type");
  });

  it("Should get the two food transactions", async () => {
    getTransactionBody.type = "EXPENSES";
    getTransactionBody.category = "Food";

    const response = await request(app)
      .post("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(getTransactionBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("Should get only 0 transaction", async () => {
    getTransactionBody.type = "EXPENSES";
    getTransactionBody.category = "Transportation";

    const response = await request(app)
      .post("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send(getTransactionBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
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
