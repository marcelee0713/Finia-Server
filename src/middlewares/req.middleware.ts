import { AnyZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (error) {
      const err = error;
      if (err instanceof z.ZodError) {
        return res.status(409).json({
          error: err,
        });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };