import { z } from "zod";

export const createSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim(),
    amount: z.string(),
    category: z.string(),
    note: z.string().optional(),
  }),
});

export const getSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim().optional(),
    category: z.string().optional(),
  }),
});

export const updateSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim().optional(),
    amount: z.string().optional(),
    category: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const deleteSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    userId: z.string().trim(),
  }),
});
