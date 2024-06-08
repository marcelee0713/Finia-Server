import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";
import { TOKENS_LIFESPAN } from "../../utils";
import { GetUserTest } from "../setup";

export const UserAuthTestSuite = () => {
  let body = {
    username: "johnny123",
    password: "P@ssword123",
  };

  it(`Should return an error with the type "unverified-email" and status of 403`, async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      username: "johnny123",
      password: "P@ssword123",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Email is not verified!");
    expect(response.body).toHaveProperty("status", "403");
    expect(response.body).toHaveProperty("type", "unverified-email");
  });

  it(`Should return an error with the type "user-does-not-exist" and status of 404`, async () => {
    body = {
      username: "nobody123",
      password: "P@ssword123",
    };

    const response = await request(app).post("/api/v1/users/login").send(body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User does not exist!");
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "user-does-not-exist");
  });

  it(`Should return an error with the type "invalid-email-verification" and status of 400`, async () => {
    body.username = "johnny123";
    const user = await GetUserTest(body.username);
    const emailSecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, emailSecret, {
      expiresIn: "0s",
    });

    const response = await request(app).post("/api/v1/users/verify-email").send({ token: token });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email verification is no longer valid!");
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-email-verification");
  });

  it(`Should verify its email`, async () => {
    const user = await GetUserTest(body.username);
    const emailSecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, emailSecret, {
      expiresIn: TOKENS_LIFESPAN.EmailAndResetPassToken,
    });

    const response = await request(app).post("/api/v1/users/verify-email").send({ token: token });

    expect(response.body).toHaveProperty("res", "Successfully verified your email address!");
  });

  it(`Should return an error with the type "user-already-verified" and status of 409`, async () => {
    const user = await GetUserTest(body.username);
    const emailSecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, emailSecret, {
      expiresIn: TOKENS_LIFESPAN.EmailAndResetPassToken,
    });

    const response = await request(app).post("/api/v1/users/verify-email").send({ token: token });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message", "User already had verified its email!");
    expect(response.body).toHaveProperty("status", "409");
    expect(response.body).toHaveProperty("type", "user-already-verified");
  });

  it(`Should return an error with the type "user-does-not-exist" and status of 404 when requesting a password reset`, async () => {
    const response = await request(app)
      .post("/api/v1/users/req-reset-password")
      .send({ email: "nobody@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User does not exist!");
    expect(response.body).toHaveProperty("status", "404");
    expect(response.body).toHaveProperty("type", "user-does-not-exist");
  });

  it(`Should return an error with the type "invalid-password" and status of 400`, async () => {
    body.password = "password123!";
    const user = await GetUserTest(body.username);

    const passwordSecret = process.env.PASSWORD_RESET_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, passwordSecret, {
      expiresIn: TOKENS_LIFESPAN.EmailAndResetPassToken,
    });

    const response = await request(app)
      .patch("/api/v1/users/reset-password")
      .send({ password: body.password, token: token, removeSessions: "NO" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password is not valid, please follow the format!"
    );
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-password");
  });

  it(`Should return an error with the type "invalid-password-reset-request" and status of 400`, async () => {
    body.password = "P@ssword123";
    body.username = "johnny123";
    const user = await GetUserTest(body.username);
    const passwordSecret = process.env.PASSWORD_RESET_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, passwordSecret, {
      expiresIn: "0s",
    });

    const response = await request(app)
      .patch("/api/v1/users/reset-password")
      .send({ password: body.password, token: token, removeSessions: "NO" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password reset request is no longer valid!");
    expect(response.body).toHaveProperty("status", "400");
    expect(response.body).toHaveProperty("type", "invalid-password-reset-request");
  });

  let usedToken = "";

  it(`Should successfully change its password`, async () => {
    body.password = "P@ssword1234";
    body.username = "johnny123";
    const user = await GetUserTest(body.username);
    const passwordSecret = process.env.PASSWORD_RESET_SECRETKEY as string;

    const token = jwt.sign({ uid: user.uid, email: user.email }, passwordSecret, {
      expiresIn: TOKENS_LIFESPAN.EmailAndResetPassToken,
    });

    const response = await request(app)
      .patch("/api/v1/users/reset-password")
      .send({ password: body.password, token: token, removeSessions: "NO" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully reset your password!");

    usedToken = token;
  });

  it(`Should return an error with the type "blacklisted-token" and status of 403`, async () => {
    body.password = "P@ssword12345";

    const response = await request(app)
      .patch("/api/v1/users/reset-password")
      .send({ password: body.password, token: usedToken, removeSessions: "NO" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "The current request had already been used.");
    expect(response.body).toHaveProperty("status", "403");
    expect(response.body).toHaveProperty("type", "blacklisted-token");
  });

  it(`Should return an error with the type "not-authorized" and status of 401`, async () => {
    body.password = "P@ssword12345";

    const response = await request(app).delete("/api/v1/users/logout?token=");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
    expect(response.body).toHaveProperty("status", "401");
    expect(response.body).toHaveProperty("type", "not-authorized");
  });

  let tokenSession = "";

  it(`Should log in the user`, async () => {
    body.password = "P@ssword1234";

    const response = await request(app).post("/api/v1/users/login").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    const res: { token: string } = await response.body;

    tokenSession = res.token;
  });

  it(`Should log out the user`, async () => {
    body.password = "P@ssword1234";

    const response = await request(app).delete(`/api/v1/users/logout?token=${tokenSession}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("res", "Successfully logged out user");
  });
};
