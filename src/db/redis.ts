import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export async function redisClient(): Promise<RedisClientType> {
  const redis: RedisClientType = createClient({
    password: process.env.REDIS_SECRETKEY,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
  });

  await redis.connect();

  return redis;
}
