import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "..";

describe("Test", () => {
  test("Add 1 + 2 to equal 3", () => {
    const juan = 1;
    const too = 2;
    const sum = juan + too;
    expect(sum).toBe(3);
  });
});

describe("Email Verification Request", () => {
  test("Should create an email verification request", async () => {
    const userData = {
      username: "marcelaylay",
    };

    const response = await request(app).post("/api/v1/users/req-email-verification").send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message", "User already had verified its email!");
    expect(response.body).toHaveProperty("status", "409");
    expect(response.body).toHaveProperty("type", "user-already-verified");
  });
});
