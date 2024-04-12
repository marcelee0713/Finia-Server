import express from "express";
import * as dotenv from "dotenv";
import { db } from "./db/db.server";

dotenv.config();

if (!process.env.PORT) process.exit(1);

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Currently listening on PORT: ${PORT}`);
});
