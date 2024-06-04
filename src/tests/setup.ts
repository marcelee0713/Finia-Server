import { db } from "../db/db.server";
import * as bcrypt from "bcrypt";
import { RedisClientType, redisClient } from "../db/redis";

export const GetUserTest = async (username: string) => {
  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) throw new Error("No user found");

  return user;
};

export const CreateUserTest = async () => {
  const body = {
    username: "johnny123",
    email: "johnny@example.com",
    password: await bcrypt.hash("P@ssword123", 10),
  };

  return await db.user.create({
    data: body,
  });
};

export const GetUID = async (username: string): Promise<string> => {
  const res = await db.user.findFirst({
    where: {
      username: username,
    },
    select: {
      uid: true,
    },
  });

  if (!res) throw new Error("User does not exist");

  return res.uid;
};

export const GetTransasctionUID = async (username: string): Promise<string> => {
  const res = await db.transactions.findFirst({
    where: {
      user: {
        username: username,
      },
    },
  });

  if (!res) {
    throw new Error("User does not have any transactions");
  }

  return res.uid;
};

export const DatabaseTearDown = async () => {
  const redis: RedisClientType = await redisClient();

  try {
    const user = await db.user.delete({
      where: {
        username: "johnny123",
      },
    });

    await db.user.delete({
      where: {
        username: "jane123",
      },
    });

    const key = `${user.uid}:blacklisted_tokens`;

    await redis.DEL(key);
  } catch (err) {
    throw new Error("Something when wrong " + err);
  } finally {
    await redis.disconnect();
    await db.$disconnect();
  }
};
