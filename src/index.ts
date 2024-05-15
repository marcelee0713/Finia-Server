import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.routes";
import transactionRouter from "./routers/transaction.routes";
import cors from "cors";

dotenv.config();

export const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log("Currently listening to port: " + PORT);
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
