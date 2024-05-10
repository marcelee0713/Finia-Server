import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.routes";
import transactionRouter from "./routers/transaction.routes";

dotenv.config();

export const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
