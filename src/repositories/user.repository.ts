import { IUserRepository, UnverifiedUser, UserObject } from "../interfaces/user.interface";
import * as bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { RedisClientType, redisClient } from "../db/redis";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../db/db.server";
import { UserParams } from "../types/user.types";
import { ErrorType } from "../types/error.types";
import { IJWTService } from "../interfaces/jwt.interface";
import { INTERFACE_TYPE } from "../utils/appConst";

@injectable()
export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient;
  private token: IJWTService;

  constructor(@inject(INTERFACE_TYPE.JWTServices) token: IJWTService) {
    this.token = token;
    this.prismaClient = db;
  }

  async getUserData(data: UserParams): Promise<UserObject> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: data.uid,
          username: data.username,
          email: data.email,
        },
      });

      if (user === null) throw new Error("user-does-not-exist" as ErrorType);

      if (data.password && data.useCases.includes("LOGIN")) {
        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) throw new Error("wrong-credentials" as ErrorType);
      }

      if (data.useCases.includes("VERIFY_EMAIL")) {
        if (!user.emailVerified) throw new Error("unverified-email" as ErrorType);
      }

      return {
        uid: user.uid,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.created_at,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2001") {
          throw new Error("user-does-not-exist" as ErrorType);
        }
      }

      if (err instanceof Error) throw new Error(err.message);

      throw new Error("Internal server error");
    }
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
          throw new Error("user-already-exist" as ErrorType);
        }
      }

      throw new Error("Whoops, something went wrong!");
    }
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

  async removeSession(uid: string, setId: string): Promise<void> {
    const redis: RedisClientType = await redisClient();

    try {
      const refreshToken = await this.checkSession(uid, setId);

      const key = `${uid}:sessions`;

      const member = `${setId}:${refreshToken}`;

      await redis.ZREM(key, member);
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }

  async removeUnverifiedUsers(): Promise<void> {
    try {
      const unverifiedUsers: UnverifiedUser[] = await this.prismaClient.user.findMany({
        where: {
          emailVerified: null,
        },
        select: {
          uid: true,
          created_at: true,
          emailVerified: true,
        },
      });

      const now = new Date();

      const expiredUsers: UnverifiedUser[] = [];

      unverifiedUsers.forEach((user) => {
        const diffInMilliseconds = now.getTime() - user.created_at.getTime();
        const diffInDays = diffInMilliseconds / diffInMilliseconds;
        const passed7Days = diffInDays >= 7;

        if (passed7Days && !user.emailVerified) expiredUsers.push(user);
      });

      expiredUsers.forEach(async (user) => {
        await this.prismaClient.user.delete({
          where: {
            uid: user.uid,
          },
        });
      });
    } catch (err) {
      throw new Error(`Internal server error on Prisma: ${err}`);
    }
  }

  async removeExpiredTokens(): Promise<void> {
    const redis: RedisClientType = await redisClient();

    try {
      const keys = await redis.KEYS("*");

      keys.forEach(async (key) => {
        const keyName = key.split(":");

        const keyType = keyName[0];

        const todayTimestamp = Math.floor(Date.now() / 1000);

        // Clear out the expired members basing on the score's value
        await redis.ZREMRANGEBYSCORE(key, "-inf", todayTimestamp);

        if (keyType === "sessions") {
          const sessions = await redis.ZRANGE(key, 0, -1);

          for (let i = 0; i < sessions.length; i++) {
            const token = sessions[i];

            const payload = this.token.getExpPayload(token);

            const isExpired = todayTimestamp > payload.exp;

            if (!isExpired) continue;

            await redis.ZREM(key, token);
          }
        }

        if (keyType === "blacklisted_tokens") {
          const blacklistedTokens = await redis.ZRANGE(key, 0, -1);

          for (let i = 0; i < blacklistedTokens.length; i++) {
            const token = blacklistedTokens[i];

            const payload = this.token.getExpPayload(token);

            const isExpired = todayTimestamp > payload.exp;

            if (!isExpired) continue;

            await redis.ZREM(key, token);
          }
        }
      });
    } catch (err) {
      throw new Error(`Internal server error on Redis: ${err}`);
    } finally {
      await redis.disconnect();
    }
  }

  async checkSession(uid: string, setId: string): Promise<string> {
    const redis: RedisClientType = await redisClient();

    try {
      const key = `${uid}:sessions`;

      const keyExistence = await redis.KEYS(`${key}*`);

      if (keyExistence.length === 0) throw new Error("not-authorized" as ErrorType);

      const sessionKey = keyExistence[0];

      const todayTimestamp = Math.floor(Date.now() / 1000);

      // Clear out the expired sessions basing on the score's value
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

      if (isNotOnTheList) throw new Error("not-authorized" as ErrorType);

      return refreshToken;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }

  async verifyEmail(uid: string, email: string): Promise<void> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: uid,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      if (user.emailVerified) throw new Error("user-already-verified" as ErrorType);

      if (user.email !== email) throw new Error("email-dev-error" as ErrorType);

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

      const keyExistence = await redis.KEYS(`${key}*`);

      const sessionKey: string | undefined = keyExistence[0];

      const todayTimestamp = Math.floor(Date.now() / 1000);

      // Clear out the expired blacklisted tokens first
      if (sessionKey) {
        await redis.ZREMRANGEBYSCORE(sessionKey, "-inf", todayTimestamp);
      }

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

  async getPassword(uid: string): Promise<string> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: uid,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      if (!user.emailVerified) throw new Error("unverified-email" as ErrorType);

      return user.password;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    }
  }

  async changePassword(uid: string, newPassword: string, shouldLogOut: boolean): Promise<void> {
    const redis: RedisClientType = await redisClient();

    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          uid: uid,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      if (!user.emailVerified) throw new Error("unverified-email" as ErrorType);

      const isTheSame = await bcrypt.compare(newPassword, user.password);

      if (isTheSame) throw new Error("same-password-reset-request" as ErrorType);

      await this.prismaClient.user.update({
        where: {
          uid: uid,
        },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });

      if (shouldLogOut) {
        const key = `${user.uid}:sessions`;
        await redis.DEL(key);
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Internal server error");
    } finally {
      await redis.disconnect();
    }
  }
}
