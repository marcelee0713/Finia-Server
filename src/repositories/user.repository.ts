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

  async create(username: string, email: string, password: string): Promise<string> {
    try {
      const user = await this.prismaClient.user.create({
        data: {
          email: email,
          username: username,
          password: await bcrypt.hash(password, 10),
        },
      });

      return user.uid;
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

    if (res === null) throw new Error("user-does-not-exist");

    const isMatch = await bcrypt.compare(password, res.password);

    if (!isMatch) throw new Error("wrong-credentials");

    if (!res.emailVerified) throw new Error("unverified-email");

    return res.uid;
  }

  async getUidByEmail(email: string): Promise<string> {
    const res = await this.prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (res === null) throw new Error("user-does-not-exist");

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

  async checkSession(uid: string, setId: string): Promise<string> {
    const redis: RedisClientType = await redisClient();

    try {
      const key = `${uid}:sessions`;

      const keyExistence = await redis.KEYS(`${key}*`);

      if (keyExistence.length === 0) throw new Error("not-authorized");

      const sessionKey = keyExistence[0];

      const todayTimestamp = Math.floor(Date.now() / 1000);

      // Clear out the expired sessions
      await redis.ZREMRANGEBYSCORE(sessionKey, "-inf", todayTimestamp);

      const sessions = await redis.ZRANGE(sessionKey, 0, -1);

      let isNotOnTheList = false;
      let refreshToken = "";

      for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].includes(setId)) {
          isNotOnTheList = false;
          const parts = sessions[i].split(":");
          refreshToken = parts[1];
          break;
        }

        isNotOnTheList = true;
      }

      if (isNotOnTheList) throw new Error("not-authorized");

      return refreshToken;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }

  async verifyEmail(uid: string, email: string, emailFromReq: string): Promise<void> {
    try {
      if (email !== emailFromReq) throw new Error("email-dev-req-error");

      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: uid,
        },
      });

      if (!user) throw new Error("user-does-not-exist");

      if (user.emailVerified) throw new Error("user-already-verified");

      if (user.email !== emailFromReq) throw new Error("email-dev-error");

      await this.prismaClient.user.update({
        where: {
          uid: user.uid,
          email: user.email,
        },
        data: {
          emailVerified: new Date().toISOString(),
        },
      });
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);

      throw new Error("Internal server error");
    }
  }

  async addTokenToBlacklist(uid: string, token: string): Promise<void> {
    const redis: RedisClientType = await redisClient();

    try {
      const key = `${uid}:blacklisted_tokens`;

      const thirtyDaysFutureTimestamp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await redis.ZADD(key, [{ score: thirtyDaysFutureTimestamp, value: token }]);
    } catch (err) {
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }

  async checkTokenInBlacklist(uid: string, token: string): Promise<boolean> {
    const redis: RedisClientType = await redisClient();

    try {
      const key = `${uid}:blacklisted_tokens`;

      const todayTimestamp = Math.floor(Date.now() / 1000);

      // Clear out the expired blacklisted tokkens
      await redis.ZREMRANGEBYSCORE(key, "-inf", todayTimestamp);

      const blacklistedTokens = await redis.ZRANGE(key, 0, -1);

      let isBlacklisted = false;

      for (let i = 0; i < blacklistedTokens.length; i++) {
        if (blacklistedTokens[i] === token) {
          isBlacklisted = true;
          break;
        }

        isBlacklisted = false;
      }

      return isBlacklisted;
    } catch (err) {
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }

  async changePassword(uid: string, newPassword: string): Promise<void> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: uid,
        },
      });

      if (!user) throw new Error("user-does-not-exist");

      const isTheSame = await bcrypt.compare(newPassword, user.password);

      if (isTheSame) throw new Error("same-password-reset-request");

      await this.prismaClient.user.update({
        where: {
          uid: uid,
        },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }
}
