import { it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";

export const UserRegistrationTestSuite = () => {
  const body = {
    username: "johnny123",
    email: "johnny123@example.com",
    password: "P@ssword123",
  };

  it(`Should return an error with type user-already-exist and a status of 409`, async () => {
    // This goes the same if either username and email already exist.
    const response = await request(app).post("/api/v1/users/create").send(body);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message", "User already exist!");
    expect(response.body).toHaveProperty("status", "409");
    expect(response.body).toHaveProperty("type", "user-already-exist");
  });

  it(`Should return an error with type invalid-username and a status of 400`, async () => {
    body.username = "123johnny";

    const response = await request(app).post("/api/v1/users/create").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Username is not valid, please follow the format!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-username");
  });

  it(`Should return an error with type invalid-password and a status of 400`, async () => {
    body.username = "johnny123";
    body.password = "password123";

    const response = await request(app).post("/api/v1/users/create").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password is not valid, please follow the format!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-password");
  });

  it(`Should return an error stack with status of 400`, async () => {
    const response = await request(app).post("/api/v1/users/create").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it(`Should return a result where it successfully created a user`, async () => {
    body.username = "jane123";
    body.password = "P@ssword123";
    body.email = "jane@gmail.com";

    const response = await request(app).post("/api/v1/users/create").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully created a user!");
  });
};
