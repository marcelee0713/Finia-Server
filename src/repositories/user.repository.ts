import { Prisma, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/user.interface";
import { db } from "../db/db.server";
import * as bcrypt from "bcrypt";
import { injectable } from "inversify";
import { RedisClientType, redisClient } from "../db/redis";

@injectable()
export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = db;
  }

  async create(username: string, email: string, password: string): Promise<void> {
    try {
      await this.prismaClient.user.create({
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

  async getUid(username: string, password: string): Promise<string> {
    const res = await this.prismaClient.user.findUnique({
      where: {
        username: username,
      },
    });

    if (res == null) throw new Error("user-does-not-exist");

    const isMatch = await bcrypt.compare(password, res.password);

    if (!isMatch) throw new Error("wrong-credentials");

    return res.uid;
  }

  async setSession(uid: string, setId: string, refreshToken: string): Promise<void> {
    const redis: RedisClientType = await redisClient();

    try {
      const key = `${uid}:sessions`;

      const currentDate = new Date();

      currentDate.setDate(currentDate.getDate() + 30);
      const scoreTimestamp = Math.floor(currentDate.getTime() / 1000);

      const member = `${setId}:${refreshToken}`;

      await redis.ZADD(key, [{ score: scoreTimestamp, value: member }]);
    } catch (err) {
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }
}
