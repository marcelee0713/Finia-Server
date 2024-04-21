import { z } from "zod";

export const createSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(100).trim(),
    email: z.string().email().trim(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(100).trim(),
    password: z.string().min(8),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    email: z.string().email().trim(),
    token: z.string().trim(),
  }),
});
