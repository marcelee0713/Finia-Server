import { beforeEach, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { GetUID, GetTransasctionUID } from "../setup";

export const TransasctionDeleteSuite = () => {
  const loginBody = {
    username: "johnny123",
    password: "P@ssword1234",
  };

  const deleteBody = {
    uid: "",
    userId: "",
  };

  beforeEach(async () => {
    deleteBody.userId = await GetUID(loginBody.username);
    deleteBody.uid = await GetTransasctionUID(loginBody.username);
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

  it(`Should return an error with the type "user-does-not-exist" and status of 404`, async () => {
    const response = await request(app)
      .delete("/api/v1/transactions")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send({ uid: deleteBody.uid });

    expect(response.body).toHaveProperty("res", "Successfully deleted your transaction!");
    expect(response.status).toBe(200);
  });

  it(`Should return an error with the type "transaction-does-not-exist" and status of 404`, async () => {
    const response = await request(app)
      .delete("/api/v1/transactions")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send({ uid: "juan12342" });

    expect(response.body).toHaveProperty("message", "Transaction does not exist!");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "transaction-does-not-exist");
  });

  it("Should delete a transaction", async () => {
    const response = await request(app)
      .delete("/api/v1/transactions/")
      .set("Cookie", [`token=${tokenSession}`])
      .set("Content-Type", "application/json")
      .send({ uid: deleteBody.uid });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully deleted your transaction!");
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
