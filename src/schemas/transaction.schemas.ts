import { z } from "zod";

export const createSchema = z.object({
  body: z.object({
    type: z.string().toUpperCase().trim(),
    amount: z.string().trim(),
    category: z.string().trim(),
    date: z.string().trim().optional(),
    note: z.string().trim().optional(),
  }),
});

export const getSchema = z.object({
  body: z.object({
    type: z.string().toUpperCase().trim().optional(),
    category: z.string().trim().optional(),
    useCase: z.string().trim().optional(),
    minAmount: z.string().trim().optional(),
    maxAmount: z.string().trim().optional(),
    skip: z.string().trim().optional(),
    take: z.string().trim().optional(),
    amountOrder: z.string().trim().optional(),
    dateOrder: z.string().trim().optional(),
    noteOrder: z.string().trim().optional(),
  }),
});

export const updateSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
    type: z.string().toUpperCase().trim().optional(),
    date: z.string().trim().optional(),
    amount: z.string().trim().optional(),
    category: z.string().trim().optional(),
    note: z.string().trim().optional(),
  }),
});

export const deleteSchema = z.object({
  body: z.object({
    uid: z.string().trim(),
  }),
});
