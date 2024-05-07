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

export const emailVerifyReqSchema = z.object({
  body: z.object({
    username: z.string().optional().nullable(),
    token: z.string().optional().nullable(),
  }),
});

export const passwordResetReqSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
  }),
});

export const passwordResetSchema = z.object({
  body: z.object({
    token: z.string().trim(),
    password: z.string().min(8),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    newPassword: z.string().min(8),
  }),
});
