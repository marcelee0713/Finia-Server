import { z } from "zod";

export const createSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim(),
    amount: z.string().trim(),
    category: z.string().trim(),
    note: z.string().trim().optional(),
  }),
});

export const getSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim().optional(),
    category: z.string().trim().optional(),
    useCase: z.string().trim().optional(),
  }),
});

export const updateSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    userId: z.string().trim(),
    type: z.string().toUpperCase().trim().optional(),
    amount: z.string().trim().optional(),
    category: z.string().trim().optional(),
    note: z.string().trim().optional(),
  }),
});

export const deleteSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    userId: z.string().trim(),
  }),
});
