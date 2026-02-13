import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod";

export const validateSchema = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({ error: error.message });
        return;
      }
      res.status(422).json({ error: "Erro de validação" });
      return;
    }
  }
}