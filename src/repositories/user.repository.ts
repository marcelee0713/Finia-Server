import { Prisma, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/user.interface";
import { db } from "../db/db.server";
import * as bcrypt from "bcrypt";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  private client: PrismaClient;

  constructor() {
    this.client = db;
  }

  async create(username: string, email: string, password: string): Promise<void> {
    try {
      await this.client.user.create({
        data: {
          email: email,
          username: username,
          password: await bcrypt.hash(password, 10),
        },
      });
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
