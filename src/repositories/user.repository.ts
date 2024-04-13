import { Prisma, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { db } from "../db/db.server";
import * as bcrypt from "bcrypt";

export class UserRepository implements IUserRepository {
  private client: PrismaClient;

  constructor() {
    this.client = db;
  }

  async create(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      const res = await this.client.user.create({
        data: {
          email: email,
          username: username,
          password: await bcrypt.hash(password, 10),
        },
      });

      const user = new User(
        res.uid,
        res.username,
        res.email,
        res.emailVerified,
        res.password,
        res.role,
        res.created_at
      );
      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("user-already-exist");
        }
      }

      throw new Error("Whoops, something went wrong!");
    }
  }
}
