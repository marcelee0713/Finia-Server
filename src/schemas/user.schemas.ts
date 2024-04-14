import { z } from "zod";

export const createUserBodySchema = z.object({
  body: z.object({
    username: z.string().min(3).max(100),
    email: z.string().email().trim(),
    password: z.string().min(8),
  }),
});