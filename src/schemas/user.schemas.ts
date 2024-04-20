import { z } from "zod";

export const createSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(100),
    email: z.string().email().trim(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(8),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    uid: z.string(),
    email: z.string().email().trim(),
  }),
});
